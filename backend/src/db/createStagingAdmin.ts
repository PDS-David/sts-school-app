/**
 * STAGING-ONLY first-admin CLI.
 *
 * Creates exactly one `admin` account in a freshly bootstrapped, newly designated
 * staging/test database. It is NOT db:seed (no fixed passwords, no upserts) and it
 * never overwrites, resets or promotes an existing account.
 *
 *   npm run db:create-staging-admin --workspace backend -- --help
 *
 * Safety model (every guard runs inside one transaction and rolls back on failure):
 *   - Default is a DRY RUN: all guards run in a READ ONLY transaction, nothing is written.
 *   - Writes need --apply AND --acknowledge-staging-only AND --confirm-database <exact name>.
 *   - The connected current_database() must equal the confirmation and match the
 *     designated staging/test name pattern. Passing a flag cannot unlock any other name.
 *   - The database must carry the db:bootstrap marker and have ZERO rows in users.
 *   - The password is read from a NAMED environment variable (never argv), validated,
 *     bcrypt-hashed (cost 10, same library/cost as the login route) and never printed.
 *   - No email, network call or external account side effect.
 */
import bcrypt from 'bcryptjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import type { PoolClient } from 'pg';

export class FirstAdminRefusal extends Error {}

/** Current auth policy minimum (routes/auth.ts change-password, routes/admin.ts initial_password). */
export const AUTH_MIN_PASSWORD_LENGTH = 8;
/** This helper is stricter: the account is reachable from a phone over the internet. */
export const ADMIN_MIN_PASSWORD_LENGTH = 12;
/** bcrypt ignores bytes past 72; refuse instead of silently truncating. */
export const MAX_PASSWORD_BYTES = 72;
export const BCRYPT_COST = 10;

/** Only newly designated staging/test database names. Never a bare or production-looking name. */
export const DESIGNATED_DB_NAME = /^(staging|stg|jss3_staging|jss3_test)_[a-z0-9_]{1,48}$/;
const FORBIDDEN_DB_FRAGMENT = /prod|live/;
/** Lower-case; the login route lower-cases usernames before lookup. */
export const USERNAME_PATTERN = /^[a-z0-9][a-z0-9._-]{2,31}$/;
const RESERVED_USERNAMES = new Set(['admin', 'administrator', 'root', 'teacher1', 'system']);
// Rejected when the (lower-cased) password equals or merely contains one of these (db:seed demo values, common bases).
const KNOWN_BAD_FRAGMENTS = ['admin@1234', 'teacher@1234', 'password', 'qwerty', '12345678'];
const PASSWORD_ENV_NAME = /^[A-Z][A-Z0-9_]{2,63}$/;
const RESERVED_ENV_NAMES = new Set(['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'NODE_ENV', 'PATH', 'HOME']);
// Distinct from bootstrap's lock key (1937001, 2).
const ADVISORY_LOCK = [1937001, 3] as const;

export interface FirstAdminOptions {
  username: string;
  schoolCode: string;
  fullName: string;
  password: string;
  apply: boolean;
  acknowledgedStaging: boolean;
  confirmDatabase: string | null;
}

export interface FirstAdminResult {
  mode: 'dry-run' | 'applied';
  database: string;
  username: string;
  schoolCode: string;
  userId?: string;
}

export function normalizeUsername(raw: string): string {
  return String(raw ?? '').trim().toLowerCase();
}

export function validateUsername(username: string): void {
  if (!USERNAME_PATTERN.test(username)) {
    throw new FirstAdminRefusal('Username must be 3-32 chars of a-z, 0-9, dot, underscore or hyphen, starting with a letter or digit.');
  }
  if (RESERVED_USERNAMES.has(username)) {
    throw new FirstAdminRefusal('Username is reserved or a known demo name; choose a distinct staging username.');
  }
}

/** Never includes the password in a message. */
export function validatePassword(password: string | undefined, username: string): void {
  if (password === undefined || password === '') {
    throw new FirstAdminRefusal('Password environment variable is missing or empty.');
  }
  if (password.length < AUTH_MIN_PASSWORD_LENGTH) {
    throw new FirstAdminRefusal(`Password is below the application minimum of ${AUTH_MIN_PASSWORD_LENGTH} characters.`);
  }
  if (password.length < ADMIN_MIN_PASSWORD_LENGTH) {
    throw new FirstAdminRefusal(`Admin password must be at least ${ADMIN_MIN_PASSWORD_LENGTH} characters.`);
  }
  if (Buffer.byteLength(password, 'utf8') > MAX_PASSWORD_BYTES) {
    throw new FirstAdminRefusal(`Password exceeds ${MAX_PASSWORD_BYTES} bytes (bcrypt would silently truncate it).`);
  }
  if (password !== password.trim() || /[\r\n\t]/.test(password)) {
    throw new FirstAdminRefusal('Password has leading/trailing whitespace or a control whitespace character (check how the variable was set).');
  }
  if (new Set(password).size < 5) {
    throw new FirstAdminRefusal('Password has too few distinct characters.');
  }
  const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(re => re.test(password)).length;
  if (classes < 3) {
    throw new FirstAdminRefusal('Password must mix at least three of: lower case, upper case, digits, symbols.');
  }
  const lower = password.toLowerCase();
  if (KNOWN_BAD_FRAGMENTS.some(f => lower.includes(f)) || lower.includes(username)) {
    throw new FirstAdminRefusal('Password is a known demo/common value or contains the username.');
  }
}

export function assertDesignatedDatabaseName(name: string): void {
  if (!DESIGNATED_DB_NAME.test(name) || FORBIDDEN_DB_FRAGMENT.test(name)) {
    throw new FirstAdminRefusal(
      'Connected database name is not a designated staging/test name '
      + '(expected staging_*, stg_*, jss3_staging_* or jss3_test_*, and never prod/live). No changes were made.',
    );
  }
}

/**
 * Runs every guard and, only with apply=true, inserts the admin. Exactly one transaction;
 * rolls back on every failure. The caller owns the client (and its connection details).
 */
export async function createStagingAdmin(client: Pick<PoolClient, 'query'>, opts: FirstAdminOptions): Promise<FirstAdminResult> {
  const username = normalizeUsername(opts.username);
  const schoolCode = String(opts.schoolCode ?? '').trim();
  const fullName = String(opts.fullName ?? '').trim();

  // Pure input validation first: nothing touches the database if these fail.
  validateUsername(username);
  validatePassword(opts.password, username);
  if (!schoolCode) throw new FirstAdminRefusal('School code is required.');
  if (!fullName || fullName.length > 100) throw new FirstAdminRefusal('Full name must be 1-100 characters.');
  if (opts.apply) {
    if (!opts.acknowledgedStaging) {
      throw new FirstAdminRefusal('Writing requires --acknowledge-staging-only. No changes were made.');
    }
    if (!opts.confirmDatabase) {
      throw new FirstAdminRefusal('Writing requires --confirm-database <exact database name>. No changes were made.');
    }
  }

  await client.query(opts.apply ? 'BEGIN' : 'BEGIN READ ONLY');
  try {
    await client.query("SET LOCAL lock_timeout = '5s'");
    await client.query('SET LOCAL search_path TO public');

    const { rows: dbRows } = await client.query('SELECT current_database() AS db');
    const database: string = dbRows[0].db;
    assertDesignatedDatabaseName(database);
    if (opts.confirmDatabase !== null && opts.confirmDatabase !== database) {
      throw new FirstAdminRefusal('--confirm-database does not match the connected database. No changes were made.');
    }

    // Serialize concurrent runs of this helper (works in a read-only transaction too).
    await client.query('SELECT pg_advisory_xact_lock($1, $2)', [...ADVISORY_LOCK]);

    const { rows: present } = await client.query(
      `SELECT to_regclass('public.app_bootstrap') IS NOT NULL AS bootstrap,
              to_regclass('public.users') IS NOT NULL AS users,
              to_regclass('public.schools') IS NOT NULL AS schools`,
    );
    if (!present[0].bootstrap || !present[0].users || !present[0].schools) {
      throw new FirstAdminRefusal('Target is not bootstrapped. Run db:bootstrap on the new empty staging database first. No changes were made.');
    }

    // Block concurrent account creation (API or other scripts) for the rest of this transaction.
    // Read-only transactions may only take ACCESS SHARE, so the dry run relies on the advisory lock.
    if (opts.apply) await client.query('LOCK TABLE public.users IN SHARE ROW EXCLUSIVE MODE');

    const { rows: counts } = await client.query('SELECT count(*)::int AS n FROM public.users');
    if (counts[0].n > 0) {
      throw new FirstAdminRefusal(
        `Target already has ${counts[0].n} user account(s); it is treated as provisioned. `
        + 'This helper never overwrites accounts, resets passwords or grants roles. No changes were made.',
      );
    }

    const { rows: school } = await client.query('SELECT code FROM public.schools WHERE code = $1', [schoolCode]);
    if (school.length !== 1) {
      throw new FirstAdminRefusal(`School code "${schoolCode}" does not exist in the target. No changes were made.`);
    }

    if (!opts.apply) {
      await client.query('ROLLBACK');
      return { mode: 'dry-run', database, username, schoolCode };
    }

    const hash = await bcrypt.hash(opts.password, BCRYPT_COST);
    const { rows: ins } = await client.query(
      `INSERT INTO public.users(username, password_hash, role, school_code, full_name, must_change_pw, is_active)
       VALUES($1, $2, 'admin', $3, $4, FALSE, TRUE) RETURNING id, password_hash`,
      [username, hash, schoolCode, fullName],
    );
    if (!(await bcrypt.compare(opts.password, ins[0].password_hash))) {
      throw new FirstAdminRefusal('Stored hash failed the login-compatibility self-check; rolled back.');
    }
    await client.query(
      `INSERT INTO public.audit_log(actor_id, actor_name, action, entity, entity_id, school_code, detail)
       VALUES (NULL, 'system', 'bootstrap_first_admin', 'user', $1, $2, 'staging-only first-admin CLI')`,
      [ins[0].id, schoolCode],
    );
    await client.query('COMMIT');
    return { mode: 'applied', database, username, schoolCode, userId: ins[0].id };
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch { /* connection already unusable */ }
    throw error;
  }
}

const USAGE = `Staging-only first-admin CLI (creates ONE admin in a freshly bootstrapped staging database).

Required:
  --username <name>            lower-case login name (3-32 chars)
  --school <code>              existing school code: primary | secondary
  --password-env <VAR_NAME>    NAME of the environment variable holding the password (never the password)
Optional:
  --full-name <text>           default "Staging Administrator"
  --apply                      perform the write (default is a dry run that writes nothing)
  --acknowledge-staging-only   required with --apply
  --confirm-database <name>    required with --apply; must equal the connected current_database()
Environment: DATABASE_URL (designated staging database; use NODE_ENV=production only as the SSL switch
for a managed database). Allowed database names: staging_*, stg_*, jss3_staging_*, jss3_test_*.
Exit codes: 0 ok / dry run, 1 refused or failed, 2 usage error.
`;

export interface ParsedCli {
  help: boolean;
  username: string;
  school: string;
  fullName: string;
  passwordEnv: string;
  apply: boolean;
  acknowledgedStaging: boolean;
  confirmDatabase: string | null;
}

/** Throws FirstAdminRefusal with a generic message: never echoes argv (a password may have been typed there). */
export function parseCli(argv: string[]): ParsedCli {
  let values: Record<string, string | boolean | undefined>;
  try {
    ({ values } = parseArgs({
      args: argv,
      strict: true,
      allowPositionals: false,
      options: {
        help: { type: 'boolean' },
        username: { type: 'string' },
        school: { type: 'string' },
        'full-name': { type: 'string' },
        'password-env': { type: 'string' },
        apply: { type: 'boolean' },
        'acknowledge-staging-only': { type: 'boolean' },
        'confirm-database': { type: 'string' },
      },
    }));
  } catch {
    throw new FirstAdminRefusal('Unrecognised or malformed arguments (values are not echoed). Use --help.');
  }
  const s = (k: string) => (typeof values[k] === 'string' ? (values[k] as string) : '');
  return {
    help: values.help === true,
    username: s('username'),
    school: s('school'),
    fullName: s('full-name') || 'Staging Administrator',
    passwordEnv: s('password-env'),
    apply: values.apply === true,
    acknowledgedStaging: values['acknowledge-staging-only'] === true,
    confirmDatabase: typeof values['confirm-database'] === 'string' ? (values['confirm-database'] as string) : null,
  };
}

function safeTarget(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.port ? `:${u.port}` : ''}${u.pathname}`; // never credentials or query
  } catch {
    return '(unparseable DATABASE_URL)';
  }
}

async function main() {
  let usage = false;
  try {
    let cli: ParsedCli;
    try { cli = parseCli(process.argv.slice(2)); } catch (e) { usage = true; throw e; }
    if (cli.help) { console.log(USAGE); return; }
    if (!cli.username || !cli.school || !cli.passwordEnv) {
      usage = true;
      throw new FirstAdminRefusal('--username, --school and --password-env are required. Use --help.');
    }
    // The flag takes a variable NAME. Do not echo it: a mistaken value may be the password itself.
    if (!PASSWORD_ENV_NAME.test(cli.passwordEnv) || RESERVED_ENV_NAMES.has(cli.passwordEnv)) {
      usage = true;
      throw new FirstAdminRefusal('--password-env must be the NAME of an upper-case environment variable (not DATABASE_URL/JWT_*/NODE_ENV), never the password itself.');
    }
    const password = process.env[cli.passwordEnv];
    delete process.env[cli.passwordEnv];
    const databaseUrl = process.env.DATABASE_URL?.trim();
    if (!databaseUrl) throw new FirstAdminRefusal('DATABASE_URL must be supplied explicitly for the staging target.');

    const { pool } = await import('./pool.js');
    try {
      const client = await pool.connect();
      try {
        const result = await createStagingAdmin(client, {
          username: cli.username,
          schoolCode: cli.school,
          fullName: cli.fullName,
          password: password ?? '',
          apply: cli.apply,
          acknowledgedStaging: cli.acknowledgedStaging,
          confirmDatabase: cli.confirmDatabase,
        });
        const target = `${result.database} (${safeTarget(databaseUrl)})`;
        if (result.mode === 'dry-run') {
          console.log(`DRY RUN OK: no changes were made. All guards passed for ${target}.`);
          console.log(`Would create admin "${result.username}" for school "${result.schoolCode}".`);
          console.log(`To write: re-run with --apply --acknowledge-staging-only --confirm-database ${result.database}`);
        } else {
          console.log(`Created admin "${result.username}" (school "${result.schoolCode}") in ${target}. Password not displayed.`);
          console.log('Verify with POST /auth/login on the staging API. Production was not touched.');
        }
      } finally {
        client.release();
      }
    } finally {
      await pool.end();
    }
  } catch (error) {
    // Connection errors can contain connection details: never print raw errors.
    console.error(error instanceof FirstAdminRefusal
      ? `Refused: ${error.message}`
      : 'First-admin setup failed; transaction rolled back if started. Check connectivity, privileges and schema. Connection details are not logged.');
    process.exitCode = usage ? 2 : 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  void main();
}

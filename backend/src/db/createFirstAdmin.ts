/**
 * First-admin CLI for a freshly bootstrapped REAL database (production or any named target).
 *
 * Creates exactly one `admin` account in a database that carries the db:bootstrap marker and
 * has ZERO rows in `users`. It never overwrites, resets or promotes an existing account, and it
 * is not db:seed (no fixed passwords, no upserts). The staging-only CLI (createStagingAdmin.ts)
 * is deliberately restricted to staging_* / stg_* names; this one is its stricter-confirmation
 * counterpart for the real installation and reuses its username/password validators.
 *
 *   npm run db:create-first-admin --workspace backend -- --help
 *
 * Safety model (every guard runs inside one transaction and rolls back on failure):
 *   - Default is a DRY RUN: all guards run in a READ ONLY transaction, nothing is written.
 *   - Writes need --apply AND --acknowledge-production AND --confirm-database <exact name>, and
 *     the confirmation must equal the connected current_database().
 *   - The database must carry the db:bootstrap marker and have ZERO rows in users.
 *   - The password is read from a NAMED environment variable (never argv), validated with the
 *     same policy as the staging CLI (12+ chars, mixed classes), bcrypt-hashed (cost 10, same
 *     library/cost as the login route) and never printed.
 *   - No email, network call or external account side effect.
 */
import bcrypt from 'bcryptjs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import type { PoolClient } from 'pg';
import {
  BCRYPT_COST,
  FirstAdminRefusal,
  normalizeUsername,
  validatePassword,
  validateUsername,
} from './createStagingAdmin.js';

const PASSWORD_ENV_NAME = /^[A-Z][A-Z0-9_]{2,63}$/;
const RESERVED_ENV_NAMES = new Set(['DATABASE_URL', 'JWT_SECRET', 'JWT_REFRESH_SECRET', 'NODE_ENV', 'PATH', 'HOME']);
// Distinct from bootstrap's (1937001, 2) and the staging CLI's (1937001, 3).
const ADVISORY_LOCK = [1937001, 4] as const;

export interface FirstAdminOptions {
  username: string;
  schoolCode: string;
  fullName: string;
  password: string;
  apply: boolean;
  acknowledgedProduction: boolean;
  confirmDatabase: string | null;
}

export interface FirstAdminResult {
  mode: 'dry-run' | 'applied';
  database: string;
  username: string;
  schoolCode: string;
  userId?: string;
}

/**
 * Runs every guard and, only with apply=true, inserts the admin. Exactly one transaction;
 * rolls back on every failure. The caller owns the client (and its connection details).
 */
export async function createFirstAdmin(client: Pick<PoolClient, 'query'>, opts: FirstAdminOptions): Promise<FirstAdminResult> {
  const username = normalizeUsername(opts.username);
  const schoolCode = String(opts.schoolCode ?? '').trim();
  const fullName = String(opts.fullName ?? '').trim();

  // Pure input validation first: nothing touches the database if these fail.
  validateUsername(username);
  validatePassword(opts.password, username);
  if (!schoolCode) throw new FirstAdminRefusal('School code is required.');
  if (!fullName || fullName.length > 100) throw new FirstAdminRefusal('Full name must be 1-100 characters.');
  if (opts.apply) {
    if (!opts.acknowledgedProduction) {
      throw new FirstAdminRefusal('Writing requires --acknowledge-production. No changes were made.');
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
      throw new FirstAdminRefusal('Target is not bootstrapped. Run db:bootstrap on the new empty database first. No changes were made.');
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
       VALUES (NULL, 'system', 'bootstrap_first_admin', 'user', $1, $2, 'first-admin CLI (db:create-first-admin)')`,
      [ins[0].id, schoolCode],
    );
    await client.query('COMMIT');
    return { mode: 'applied', database, username, schoolCode, userId: ins[0].id };
  } catch (error) {
    try { await client.query('ROLLBACK'); } catch { /* connection already unusable */ }
    throw error;
  }
}

const USAGE = `First-admin CLI (creates ONE admin in a freshly bootstrapped database; refuses if any user exists).

Required:
  --username <name>            lower-case login name (3-32 chars)
  --school <code>              existing school code: primary | secondary
  --password-env <VAR_NAME>    NAME of the environment variable holding the password (never the password)
Optional:
  --full-name <text>           default "School Administrator"
  --apply                      perform the write (default is a dry run that writes nothing)
  --acknowledge-production     required with --apply
  --confirm-database <name>    required with --apply; must equal the connected current_database()
Environment: DATABASE_URL (the bootstrapped target; set NODE_ENV=production as the SSL switch for a managed database).
Exit codes: 0 ok / dry run, 1 refused or failed, 2 usage error.
`;

export interface ParsedCli {
  help: boolean;
  username: string;
  school: string;
  fullName: string;
  passwordEnv: string;
  apply: boolean;
  acknowledgedProduction: boolean;
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
        'acknowledge-production': { type: 'boolean' },
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
    fullName: s('full-name') || 'School Administrator',
    passwordEnv: s('password-env'),
    apply: values.apply === true,
    acknowledgedProduction: values['acknowledge-production'] === true,
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
    if (!databaseUrl) throw new FirstAdminRefusal('DATABASE_URL must be supplied explicitly for the target database.');

    const { pool } = await import('./pool.js');
    try {
      const client = await pool.connect();
      try {
        const result = await createFirstAdmin(client, {
          username: cli.username,
          schoolCode: cli.school,
          fullName: cli.fullName,
          password: password ?? '',
          apply: cli.apply,
          acknowledgedProduction: cli.acknowledgedProduction,
          confirmDatabase: cli.confirmDatabase,
        });
        const target = `${result.database} (${safeTarget(databaseUrl)})`;
        if (result.mode === 'dry-run') {
          console.log(`DRY RUN OK: no changes were made. All guards passed for ${target}.`);
          console.log(`Would create admin "${result.username}" for school "${result.schoolCode}".`);
          console.log(`To write: re-run with --apply --acknowledge-production --confirm-database ${result.database}`);
        } else {
          console.log(`Created admin "${result.username}" (school "${result.schoolCode}") in ${target}. Password not displayed.`);
          console.log('Verify with POST /auth/login on the API.');
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

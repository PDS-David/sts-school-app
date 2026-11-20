// Prompt 2B increment D: (1) a missing/invalid PIN_PEPPER is detected BEFORE
// `db:migrate` can modify the database; (2) migrations 0019 and 0020 apply
// together, in one run, on a disposable database holding legacy users.
// Every database here is created and dropped by this file; DATABASE_URL is only
// used to reach the local server and is never pointed at an existing database.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import { resolve } from 'node:path';
import test from 'node:test';
import pg from 'pg';
import { runStartupPreflight } from '../backend/src/utils/startupPreflight.js';

const ROOT = process.cwd();
const VALID_PEPPER = 'preflight-test-pepper-0123456789-abcdef-0123456789';

function adminUrl(): URL {
  const raw = process.env.DATABASE_URL;
  assert.ok(raw, 'DATABASE_URL must reach a local disposable PostgreSQL server');
  const u = new URL(raw);
  assert.ok(['localhost', '127.0.0.1'].includes(u.hostname), 'refusing to run against a non-local database server');
  return u;
}
function urlFor(dbName: string): string {
  const u = adminUrl();
  u.pathname = `/${dbName}`;
  return u.toString();
}
async function withAdmin<T>(fn: (c: pg.Client) => Promise<T>): Promise<T> {
  const c = new pg.Client({ connectionString: urlFor('postgres') });
  await c.connect();
  try { return await fn(c); } finally { await c.end(); }
}
async function createDb(): Promise<string> {
  const name = `sts_pinmig_${randomBytes(5).toString('hex')}`;
  await withAdmin(c => c.query(`CREATE DATABASE ${name}`));
  return name;
}
async function dropDb(name: string) {
  await withAdmin(c => c.query(`DROP DATABASE IF EXISTS ${name} WITH (FORCE)`));
}
async function withDb<T>(name: string, fn: (c: pg.Client) => Promise<T>): Promise<T> {
  const c = new pg.Client({ connectionString: urlFor(name) });
  await c.connect();
  try { return await fn(c); } finally { await c.end(); }
}
function npm(script: string, dbName: string, extraEnv: Record<string, string | undefined> = {}) {
  const env: NodeJS.ProcessEnv = { ...process.env, DATABASE_URL: urlFor(dbName), ...extraEnv };
  for (const k of Object.keys(extraEnv)) if (extraEnv[k] === undefined) delete env[k];
  return spawnSync('npm', ['run', script, '--workspace=backend'], { cwd: ROOT, env, encoding: 'utf8', timeout: 240_000 });
}
const ledger = async (c: pg.Client) =>
  (await c.query('SELECT version FROM public.schema_migrations ORDER BY version')).rows.map(r => r.version as string);

// ── Preflight: pure rule ─────────────────────────────────────────────────────

test('preflight: production without a valid PIN_PEPPER is refused; valid or non-production passes', () => {
  const prod = (PIN_PEPPER?: string) => runStartupPreflight({ NODE_ENV: 'production', ...(PIN_PEPPER === undefined ? {} : { PIN_PEPPER }) } as NodeJS.ProcessEnv);
  assert.equal(prod().ok, false, 'missing pepper refused');
  assert.equal(prod('').ok, false, 'empty pepper refused');
  assert.equal(prod('   ').ok, false, 'blank pepper refused');
  assert.equal(prod('too-short').ok, false, 'short pepper refused');
  assert.equal(prod(' '.repeat(40)).ok, false, 'whitespace-padded blank refused');
  assert.equal(prod(VALID_PEPPER).ok, true, 'valid pepper accepted');
  assert.equal(runStartupPreflight({ NODE_ENV: 'test' } as NodeJS.ProcessEnv).ok, true, 'same rule as the server: only production enforces');
  const refused = prod('too-short');
  assert.ok(!refused.ok && !JSON.stringify(refused).includes('too-short'), 'the refusal never echoes the value');
});

test('start script runs the preflight before db:migrate and before the server', () => {
  const start: string = JSON.parse(readFileSync(resolve(ROOT, 'backend/package.json'), 'utf8')).scripts.start;
  const order = ['start:preflight', 'db:migrate', 'node dist/index.js'].map(s => start.indexOf(s));
  assert.ok(order.every(i => i >= 0), `start script must contain all three steps: ${start}`);
  assert.ok(order[0] < order[1] && order[1] < order[2], `preflight must precede migration: ${start}`);
  assert.ok(!/\|\||;/.test(start), 'steps must be chained with && only, so a failed preflight stops the chain');
});

// ── Preflight: behaviour against a disposable database ───────────────────────

test('npm start chain: bad PIN_PEPPER stops before any migration; valid pepper then migrates', async () => {
  const db = await createDb();
  try {
    assert.equal(npm('db:bootstrap', db, { NODE_ENV: 'test' }).status, 0, 'bootstrap disposable schema');
    const before = await withDb(db, async c => ({
      versions: await ledger(c),
      userCols: (await c.query(`SELECT column_name FROM information_schema.columns WHERE table_name='users' ORDER BY 1`)).rows.length,
    }));

    // Rewind the ledger so 0019/0020 are genuinely pending, as on a pre-Prompt-2 database.
    await withDb(db, c => c.query(`DELETE FROM public.schema_migrations WHERE version >= '0019'`));
    const pendingBefore = await withDb(db, ledger);
    assert.ok(!pendingBefore.includes('0019') && !pendingBefore.includes('0020'));

    // The real start script with the final `node dist/index.js` swapped for `true`
    // (we are testing the chain up to the server, not starting a server).
    const start: string = JSON.parse(readFileSync(resolve(ROOT, 'backend/package.json'), 'utf8')).scripts.start;
    const chain = start.replace('node dist/index.js', 'echo SERVER_WOULD_START_HERE');
    const run = (envExtra: Record<string, string>) => spawnSync('bash', ['-c', `cd backend && ${chain}`], {
      cwd: ROOT, encoding: 'utf8', timeout: 240_000,
      env: { ...process.env, DATABASE_URL: urlFor(db), DATABASE_SSL: 'false', NODE_ENV: 'production', PIN_PEPPER: '', ...envExtra },
    });

    for (const bad of ['', 'short']) {
      const r = run({ PIN_PEPPER: bad });
      assert.notEqual(r.status, 0, `start must fail with PIN_PEPPER='${bad}'`);
      assert.ok(!/SERVER_WOULD_START_HERE/.test(r.stdout), 'the server step must never be reached');
      assert.ok(!/Applied 00/.test(r.stdout + r.stderr), 'no migration may be applied');
      assert.ok(!r.stdout.includes(bad || '\u0000') || bad === '', 'value never printed');
      assert.deepEqual(await withDb(db, ledger), pendingBefore, 'migration ledger unchanged');
    }
    const after = await withDb(db, async c => (await c.query(`SELECT column_name FROM information_schema.columns WHERE table_name='users'`)).rows.length);
    assert.equal(after, before.userCols, 'database structure unchanged after the refused starts');

    const ok = run({ PIN_PEPPER: VALID_PEPPER });
    assert.equal(ok.status, 0, `valid pepper proceeds: ${ok.stdout}${ok.stderr}`);
    assert.match(ok.stdout, /Applied 0019/);
    assert.match(ok.stdout, /Applied 0020/);
    assert.ok(ok.stdout.indexOf('Applied 0019') < ok.stdout.indexOf('Applied 0020'), '0019 before 0020');
    assert.match(ok.stdout, /SERVER_WOULD_START_HERE/, 'chain reaches the server step');
  } finally {
    await dropDb(db);
  }
});

// ── 0019 + 0020 together, with legacy users present ──────────────────────────

test('migrations 0019 and 0020 apply together in one run and leave existing users able to sign in', async () => {
  const db = await createDb();
  try {
    assert.equal(npm('db:bootstrap', db, { NODE_ENV: 'test' }).status, 0);
    // bootstrap stamps only the 0001 baseline; bring the ledger to 0020 first so the
    // measured run below applies exactly the pair under test.
    assert.equal(npm('db:migrate', db, { NODE_ENV: 'test' }).status, 0);

    // Rebuild the pre-Prompt-2 state (migrations 0001-0018 only): remove every
    // object 0019 adds, then seed legacy users.
    await withDb(db, async c => {
      await c.query(`
        DROP TRIGGER IF EXISTS users_enforce_pin_state_trg ON users;
        DROP FUNCTION IF EXISTS users_enforce_pin_state();
        DROP TABLE IF EXISTS auth_sessions, auth_login_lanes, auth_login_attempts CASCADE;
        ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pin_hash_version_check;
        ALTER TABLE users DROP COLUMN IF EXISTS must_set_pin, DROP COLUMN IF EXISTS pin_hash_version, DROP COLUMN IF EXISTS pin_set_at;
        DELETE FROM public.schema_migrations WHERE version >= '0019';`);
      const ins = (u: string, role: string, extra = '') => c.query(
        `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review,must_change_pw)
         VALUES($1,$2,$3,'Seed',$4,TRUE,FALSE,${extra || 'FALSE'})`,
        [u, `legacy-hash-${u}`, role, role === 'admin' ? null : 'primary']);
      await ins('seed-student', 'student');
      await ins('seed-parent', 'parent');
      await ins('seed-teacher', 'teacher');
      await ins('seed-admin', 'admin');
      await ins('seed-issued-teacher', 'teacher', 'TRUE'); // administrator-issued temporary credential
    });
    const hashesBefore = await withDb(db, async c => (await c.query('SELECT username,password_hash FROM users ORDER BY username')).rows);
    const versionsBefore = await withDb(db, ledger);
    assert.ok(!versionsBefore.includes('0019') && !versionsBefore.includes('0020'));

    const run = npm('db:migrate', db, { NODE_ENV: 'test' }); // = `db:migrate --all`
    assert.equal(run.status, 0, `${run.stdout}${run.stderr}`);
    const applied = [...run.stdout.matchAll(/Applied (\d{4})/g)].map(m => m[1]);
    assert.deepEqual(applied, ['0019', '0020'], 'exactly 0019 then 0020, in one run');

    await withDb(db, async c => {
      const versions = await ledger(c);
      assert.ok(versions.includes('0019') && versions.includes('0020'));
      assert.ok(!versions.includes('0021'), '0021 is not applied');
      const flags = Object.fromEntries((await c.query(
        'SELECT username, must_set_pin, must_change_pw, pin_hash_version, pin_set_at FROM users')).rows.map(r => [r.username, r]));
      for (const u of ['seed-student', 'seed-parent', 'seed-teacher']) {
        assert.equal(flags[u].must_set_pin, false, `${u}: existing public-role account is not forced to change its PIN`);
        assert.equal(flags[u].pin_hash_version, null, `${u}: credential not rehashed by migration`);
        assert.equal(flags[u].pin_set_at, null);
      }
      assert.equal(flags['seed-admin'].must_set_pin, false, 'administrator accounts are never gated');
      assert.equal(flags['seed-issued-teacher'].must_change_pw, true, 'administrator-issued temporary credential keeps its requirement');
      assert.equal((await c.query('SELECT 1 FROM auth_sessions')).rowCount, 0, 'no session created or invalidated');
      assert.equal((await c.query(`SELECT 1 FROM pg_trigger WHERE tgname='users_enforce_pin_state_trg'`)).rowCount, 1, 'PIN-state trigger present');
      const hashesAfter = (await c.query('SELECT username,password_hash FROM users ORDER BY username')).rows;
      assert.deepEqual(hashesAfter, hashesBefore, 'no credential was altered');
      assert.equal((await c.query(`SELECT 1 FROM pg_indexes WHERE indexname='users_username_global_norm_uq'`)).rowCount, 0, 'no global username unique index');
    });

    // Re-running is a no-op (checksums verified, nothing pending).
    const again = npm('db:migrate', db, { NODE_ENV: 'test' });
    assert.equal(again.status, 0);
    assert.ok(!/Applied 00/.test(again.stdout), 'second run applies nothing');
  } finally {
    await dropDb(db);
  }
});

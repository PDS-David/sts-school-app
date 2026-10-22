// STAGING-BOOTSTRAP: staging-only first-admin CLI against a DISPOSABLE, LOOPBACK PostgreSQL 16.
//   JSS3_LOCAL_TEST_DATABASE_URL=postgres://postgres@127.0.0.1:55433/postgres node --import tsx --test tests/staging-admin.db.test.mts
// The URL only names a SERVER (needs CREATEDB). The test creates its own throw-away databases
// (jss3_test_admin_*), bootstraps them with the real db:bootstrap, and drops them afterwards.
// It refuses any non-loopback host. Passwords below are synthetic test values.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import test, { after, before, beforeEach } from 'node:test';
import type { AddressInfo } from 'node:net';
import bcrypt from 'bcryptjs';
import pg from 'pg';

const SERVER_URL = process.env.JSS3_LOCAL_TEST_DATABASE_URL;
const root = path.resolve(import.meta.dirname, '..');
const CLI = path.join(root, 'backend/src/db/createStagingAdmin.ts');

if (!SERVER_URL) {
  test('first-admin CLI DB tests (skipped: set JSS3_LOCAL_TEST_DATABASE_URL to a LOCAL disposable PostgreSQL 16)', { skip: true }, () => {});
} else {
  const server = new URL(SERVER_URL);
  assert.ok(['localhost', '127.0.0.1', '::1', '[::1]'].includes(server.hostname), 'refusing non-local database host');

  const GOOD = 'Stg-Test!Pass-7391xQ';
  const suffix = randomBytes(4).toString('hex');
  const DB = `jss3_test_admin_${suffix}`;              // bootstrapped, designated
  const DB_EMPTY = `jss3_test_nobootstrap_${suffix}`;  // designated name, never bootstrapped
  const DB_BADNAME = `sts_notdesignated_${suffix}`;    // not a designated name
  const created: string[] = [];
  const urlFor = (db: string) => { const u = new URL(SERVER_URL); u.pathname = `/${db}`; return u.toString(); };

  const adminClient = new pg.Client({ connectionString: SERVER_URL });
  await adminClient.connect();
  for (const db of [DB, DB_EMPTY, DB_BADNAME]) {
    await adminClient.query(`CREATE DATABASE "${db}"`);
    created.push(db);
  }

  // Bind the app pool (used by the real auth router) to the disposable DB BEFORE importing it.
  process.env.DATABASE_URL = urlFor(DB);
  process.env.NODE_ENV = 'development';
  process.env.JWT_SECRET = 'test-secret-not-for-use';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-not-for-use';
  const { pool, query } = await import('../backend/src/db/pool.js');
  const { bootstrap } = await import('../backend/src/db/bootstrap.js');
  const lib = await import('../backend/src/db/createStagingAdmin.js');
  await import('express-async-errors');
  const { default: express } = await import('express');
  const { default: authRouter } = await import('../backend/src/routes/auth.js');

  const boot = await pool.connect();
  assert.equal(await bootstrap(boot), 'created');
  boot.release();

  const opts = (over: Partial<import('../backend/src/db/createStagingAdmin.js').FirstAdminOptions> = {}) => ({
    username: 'stg.admin', schoolCode: 'secondary', fullName: 'Staging Administrator', password: GOOD,
    apply: true, acknowledgedStaging: true, confirmDatabase: DB, ...over,
  });
  const run = async (o = opts(), url = urlFor(DB)) => {
    const c = new pg.Client({ connectionString: url });
    await c.connect();
    try { return await lib.createStagingAdmin(c, o); } finally { await c.end(); }
  };
  const counts = async () => (await query(
    `SELECT (SELECT count(*) FROM users)::int u, (SELECT count(*) FROM audit_log WHERE action='bootstrap_first_admin')::int a`,
  )).rows[0] as { u: number; a: number };
  const refused = (re: RegExp) => (e: unknown) => e instanceof lib.FirstAdminRefusal && re.test(e.message);
  const cli = (args: string[], env: Record<string, string> = {}, db = DB) => spawnSync(
    process.execPath, ['--import', 'tsx', CLI, ...args],
    { cwd: root, encoding: 'utf8', env: { PATH: process.env.PATH ?? '', DATABASE_URL: urlFor(db), NODE_ENV: 'development', ...env } },
  );

  before(() => assert.deepEqual(created.length, 3));
  beforeEach(async () => { await query('DELETE FROM audit_log'); await query('DELETE FROM users'); });
  after(async () => {
    await pool.end();
    for (const db of created) await adminClient.query(`DROP DATABASE IF EXISTS "${db}" WITH (FORCE)`);
    const left = (await adminClient.query('SELECT datname FROM pg_database WHERE datname = ANY($1)', [created])).rows;
    await adminClient.end();
    assert.deepEqual(left, [], 'disposable databases removed');
  });

  // ── pure validation ────────────────────────────────────────────────────────
  test('password policy: missing, short, whitespace, weak, demo, oversize all refused; good accepted; message never echoes it', () => {
    const bad: Array<[string | undefined, RegExp]> = [
      [undefined, /missing/], ['', /missing/], ['Ab1!', /minimum of 8/], ['Ab1!xyz9', /at least 12/],
      [` ${GOOD}`, /whitespace/], [`${GOOD}\n`, /whitespace/], ['aaaaaaaaaaaaaaaa', /distinct/],
      ['alllowercaseletters', /three of/], ['Stg.admin-Pass-1234', /username/], ['Admin@1234!!', /demo\/common/], ['My-Password-9911x', /demo\/common/],
      [`Aa1!${'x'.repeat(80)}`, /72 bytes/],
    ];
    for (const [pw, re] of bad) {
      assert.throws(() => lib.validatePassword(pw, 'stg.admin'), (e: any) => e instanceof lib.FirstAdminRefusal && re.test(e.message) && !(pw && e.message.includes(pw)), String(pw));
    }
    assert.doesNotThrow(() => lib.validatePassword(GOOD, 'stg.admin'));
  });
  test('username and database-name rules', () => {
    for (const u of ['ab', 'Admin User', 'a'.repeat(40), '-lead', 'admin', 'root']) assert.throws(() => lib.validateUsername(u), lib.FirstAdminRefusal, u);
    assert.doesNotThrow(() => lib.validateUsername('stg.admin-01'));
    for (const n of ['postgres', 'sts_school', 'production', 'staging', 'staging_prod_copy', 'jss3_test_live', 'sts_notdesignated_x', 'Staging_X', 'stg_']) {
      assert.throws(() => lib.assertDesignatedDatabaseName(n), lib.FirstAdminRefusal, n);
    }
    for (const n of ['staging_jss3', 'stg_device1', 'jss3_staging_a', 'jss3_test_admin_ab12']) assert.doesNotThrow(() => lib.assertDesignatedDatabaseName(n), n);
  });
  test('argument parser never echoes argv (a password typed by mistake stays out of messages)', () => {
    for (const argv of [['--password', 'Sup3r!Secret-value'], ['Sup3r!Secret-value'], ['--password-env']]) {
      assert.throws(() => lib.parseCli(argv), (e: any) => e instanceof lib.FirstAdminRefusal && !/Sup3r/.test(e.message));
    }
    const p = lib.parseCli(['--username', 'x', '--school', 'secondary', '--password-env', 'STG_ADMIN_PASSWORD']);
    assert.equal(p.apply, false); assert.equal(p.confirmDatabase, null); assert.equal(p.acknowledgedStaging, false);
  });

  // ── real PostgreSQL ────────────────────────────────────────────────────────
  test('dry run: all guards pass, nothing is written (library and CLI)', async () => {
    const r = await run(opts({ apply: false, acknowledgedStaging: false, confirmDatabase: null }));
    assert.deepEqual([r.mode, r.database, r.username], ['dry-run', DB, 'stg.admin']);
    assert.deepEqual(await counts(), { u: 0, a: 0 });
    const out = cli(['--username', 'stg.admin', '--school', 'secondary', '--password-env', 'STG_PW'], { STG_PW: GOOD });
    assert.equal(out.status, 0, out.stderr); assert.match(out.stdout, /DRY RUN OK: no changes were made/);
    assert.ok(!(out.stdout + out.stderr).includes(GOOD)); assert.deepEqual(await counts(), { u: 0, a: 0 });
  });
  test('valid initial admin: role/school/flags, bcrypt hash, audit row, and the REAL login route accepts it', async () => {
    const r = await run();
    assert.equal(r.mode, 'applied');
    const u = (await query('SELECT * FROM users')).rows;
    assert.equal(u.length, 1); assert.equal(u[0].username, 'stg.admin'); assert.equal(u[0].role, 'admin');
    assert.equal(u[0].school_code, 'secondary'); assert.equal(u[0].is_active, true); assert.equal(u[0].must_change_pw, false);
    assert.match(u[0].password_hash, /^\$2[aby]\$10\$/); assert.ok(u[0].password_hash !== GOOD);
    assert.ok(await bcrypt.compare(GOOD, u[0].password_hash)); assert.ok(!(await bcrypt.compare('wrong', u[0].password_hash)));
    assert.equal((await counts()).a, 1);

    const app = express(); app.use(express.json()); app.use('/auth', authRouter);
    const srv: any = app.listen(0, '127.0.0.1'); await new Promise(res => srv.once('listening', res));
    try {
      const base = `http://127.0.0.1:${(srv.address() as AddressInfo).port}`;
      const post = (password: string, username = 'Stg.Admin ') => fetch(`${base}/auth/login`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ username, password }) });
      const ok = await post(GOOD); assert.equal(ok.status, 200);
      const body: any = await ok.json(); assert.equal(body.user.role, 'admin'); assert.ok(body.access_token);
      assert.equal((await post('not-the-password')).status, 401);
    } finally { await new Promise(res => srv.close(res)); }
  });
  test('CLI apply end to end: succeeds, password and hash never printed', async () => {
    const out = cli(['--username', 'stg.cli', '--school', 'primary', '--password-env', 'STG_PW', '--apply', '--acknowledge-staging-only', '--confirm-database', DB], { STG_PW: GOOD });
    assert.equal(out.status, 0, out.stderr); assert.match(out.stdout, /Created admin "stg.cli"/);
    const all = out.stdout + out.stderr; assert.ok(!all.includes(GOOD));
    const row = (await query('SELECT password_hash FROM users')).rows[0]; assert.ok(!all.includes(row.password_hash));
  });
  test('missing acknowledgement or missing confirmation: refused, no writes', async () => {
    await assert.rejects(run(opts({ acknowledgedStaging: false })), refused(/acknowledge-staging-only/));
    await assert.rejects(run(opts({ confirmDatabase: null })), refused(/confirm-database/));
    const out = cli(['--username', 'stg.admin', '--school', 'secondary', '--password-env', 'STG_PW', '--apply'], { STG_PW: GOOD });
    assert.equal(out.status, 1); assert.match(out.stderr, /Refused/); assert.deepEqual(await counts(), { u: 0, a: 0 });
  });
  test('wrong database confirmation: refused for apply and for dry run, no writes', async () => {
    await assert.rejects(run(opts({ confirmDatabase: 'jss3_test_other' })), refused(/does not match the connected database/));
    await assert.rejects(run(opts({ apply: false, confirmDatabase: 'jss3_test_other' })), refused(/does not match/));
    const out = cli(['--username', 'stg.admin', '--school', 'secondary', '--password-env', 'STG_PW', '--apply', '--acknowledge-staging-only', '--confirm-database', 'jss3_test_other'], { STG_PW: GOOD });
    assert.equal(out.status, 1); assert.deepEqual(await counts(), { u: 0, a: 0 });
  });
  test('missing, invalid and weak password: refused, no writes (library and CLI)', async () => {
    await assert.rejects(run(opts({ password: '' })), refused(/missing or empty/));
    await assert.rejects(run(opts({ password: 'short1!' })), refused(/minimum of 8/));
    await assert.rejects(run(opts({ password: 'alllowercaseletters' })), refused(/three of/));
    const unset = cli(['--username', 'stg.admin', '--school', 'secondary', '--password-env', 'STG_PW_UNSET', '--apply', '--acknowledge-staging-only', '--confirm-database', DB]);
    assert.equal(unset.status, 1); assert.match(unset.stderr, /missing or empty/);
    // A password typed where the variable NAME belongs is rejected and never echoed.
    const typed = cli(['--username', 'stg.admin', '--school', 'secondary', '--password-env', GOOD]);
    assert.equal(typed.status, 2); assert.ok(!(typed.stdout + typed.stderr).includes(GOOD));
    assert.deepEqual(await counts(), { u: 0, a: 0 });
  });
  test('database that is not designated staging/test is refused even with every flag; unbootstrapped target refused', async () => {
    await assert.rejects(run(opts({ confirmDatabase: DB_BADNAME }), urlFor(DB_BADNAME)), refused(/not a designated staging\/test name/));
    await assert.rejects(run(opts({ confirmDatabase: DB_EMPTY }), urlFor(DB_EMPTY)), refused(/not bootstrapped/));
    const out = cli(['--username', 'stg.admin', '--school', 'secondary', '--password-env', 'STG_PW', '--apply', '--acknowledge-staging-only', '--confirm-database', DB_BADNAME], { STG_PW: GOOD }, DB_BADNAME);
    assert.equal(out.status, 1); assert.match(out.stderr, /designated staging/);
  });
  test('existing admin or any user: refused; nothing overwritten, no password reset, no role granted', async () => {
    const old = await bcrypt.hash('Original!Pass-5512', 10);
    for (const role of ['admin', 'student', 'teacher']) {
      await query('DELETE FROM users');
      await query(`INSERT INTO users(username,password_hash,role,school_code) VALUES('stg.admin',$1,$2,'secondary')`, [old, role]);
      await assert.rejects(run(), refused(/already has 1 user account/));
      await assert.rejects(run(opts({ username: 'someone.else' })), refused(/already has 1 user account/));
      await assert.rejects(run(opts({ apply: false })), refused(/already has 1 user account/));
      const row = (await query('SELECT username, role, password_hash FROM users')).rows;
      assert.deepEqual(row.map(r => [r.username, r.role, r.password_hash]), [['stg.admin', role, old]]);
    }
    assert.equal((await counts()).a, 0);
  });
  test('missing school: refused, no writes', async () => {
    await assert.rejects(run(opts({ schoolCode: 'nonexistent' })), refused(/does not exist/));
    await assert.rejects(run(opts({ apply: false, schoolCode: 'nonexistent' })), refused(/does not exist/));
    assert.deepEqual(await counts(), { u: 0, a: 0 });
  });
  test('repeat run is refused and leaves the first account and hash untouched', async () => {
    await run();
    const first = (await query('SELECT id, password_hash FROM users')).rows[0];
    await assert.rejects(run(opts({ password: 'Different!Pass-8820z' })), refused(/already has 1 user account/));
    const after_ = (await query('SELECT id, password_hash FROM users')).rows;
    assert.equal(after_.length, 1); assert.deepEqual(after_[0], first); assert.equal((await counts()).a, 1);
    const again = cli(['--username', 'stg.admin', '--school', 'secondary', '--password-env', 'STG_PW', '--apply', '--acknowledge-staging-only', '--confirm-database', DB], { STG_PW: GOOD });
    assert.equal(again.status, 1);
  });
  test('two concurrent applies are serialised: exactly one admin is created', async () => {
    const results = await Promise.allSettled([run(opts({ username: 'stg.one' })), run(opts({ username: 'stg.two' }))]);
    assert.equal(results.filter(r => r.status === 'fulfilled').length, 1);
    const bad = results.find(r => r.status === 'rejected') as PromiseRejectedResult;
    assert.ok(bad.reason instanceof lib.FirstAdminRefusal && /already has 1 user account/.test(bad.reason.message), String(bad.reason));
    assert.deepEqual(await counts(), { u: 1, a: 1 });
  });
  test('rollback: a failure after the insert leaves no user and no audit row', async () => {
    await query(`CREATE OR REPLACE FUNCTION zz_fail_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'forced audit failure'; END $$`);
    await query('CREATE TRIGGER zz_fail_audit BEFORE INSERT ON audit_log FOR EACH ROW EXECUTE FUNCTION zz_fail_audit()');
    try {
      await assert.rejects(run(), /forced audit failure/);
      assert.deepEqual(await counts(), { u: 0, a: 0 });
    } finally {
      await query('DROP TRIGGER zz_fail_audit ON audit_log'); await query('DROP FUNCTION zz_fail_audit()');
    }
    assert.equal((await run()).mode, 'applied'); // the guard did not leave the target locked or half-provisioned
  });
  test('cleanup: no residue after the suite state is reset', async () => {
    await query('DELETE FROM audit_log'); await query('DELETE FROM users');
    assert.deepEqual(await counts(), { u: 0, a: 0 });
  });
}

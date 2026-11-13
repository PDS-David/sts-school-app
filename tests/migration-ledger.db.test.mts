// Integration coverage for the versioned migration runner against disposable PostgreSQL databases.
// MIGRATION_TEST_DATABASE_URL must point to a local CI PostgreSQL server with CREATEDB privileges.
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { randomBytes } from 'node:crypto';
import path from 'node:path';
import test, { after } from 'node:test';
import pg from 'pg';

const SERVER_URL = process.env.MIGRATION_TEST_DATABASE_URL;
const root = path.resolve(import.meta.dirname, '..');
const CLI = path.join(root, 'backend/src/db/migrate.ts');
const MIGRATIONS_DIR = path.join(root, 'backend/migrations');

if (!SERVER_URL) {
  test('migration ledger PostgreSQL integration (skipped: MIGRATION_TEST_DATABASE_URL not set)', { skip: true }, () => {});
} else {
  const server = new URL(SERVER_URL);
  assert.ok(['localhost', '127.0.0.1', '::1', '[::1]'].includes(server.hostname), 'refusing non-loopback database host');

  const suffix = randomBytes(4).toString('hex');
  const DB_FRESH = `jss3_test_migrate_${suffix}`;
  const DB_EXISTING = `jss3_test_migrate_existing_${suffix}`;
  const created: string[] = [];
  const tempFiles: string[] = [];
  const urlFor = (db: string) => { const u = new URL(SERVER_URL); u.pathname = `/${db}`; return u.toString(); };
  const admin = new pg.Client({ connectionString: SERVER_URL });
  await admin.connect();

  for (const db of [DB_FRESH, DB_EXISTING]) {
    await admin.query(`CREATE DATABASE "${db}"`);
    created.push(db);
  }

  const cli = (mode: '--all' | '--fresh' | '--status', db: string) => spawnSync(
    process.execPath,
    ['--import', 'tsx', CLI, mode],
    {
      cwd: root,
      encoding: 'utf8',
      env: { ...process.env, DATABASE_URL: urlFor(db), NODE_ENV: 'development' },
    },
  );
  const dbClient = async (db: string) => {
    const client = new pg.Client({ connectionString: urlFor(db) });
    await client.connect();
    return client;
  };
  const output = (result: ReturnType<typeof cli>) => result.stdout + result.stderr;

  after(async () => {
    for (const file of tempFiles) if (existsSync(file)) unlinkSync(file);
    for (const db of created) await admin.query(`DROP DATABASE IF EXISTS "${db}" WITH (FORCE)`);
    const left = (await admin.query('SELECT datname FROM pg_database WHERE datname = ANY($1)', [created])).rows;
    await admin.end();
    assert.deepEqual(left, [], 'disposable migration databases removed');
  });

  test('status is read-only; fresh stamps baseline; all applies pending migrations idempotently', async () => {
    const statusBefore = cli('--status', DB_FRESH);
    assert.equal(statusBefore.status, 0, statusBefore.stderr);
    assert.match(statusBefore.stdout, /Migration ledger does not exist/);
    let client = await dbClient(DB_FRESH);
    try {
      const absent = await client.query("SELECT to_regclass('public.schema_migrations') IS NULL AS absent");
      assert.equal(absent.rows[0].absent, true, '--status must not create the ledger');
    } finally { await client.end(); }

    const allBeforeBaseline = cli('--all', DB_FRESH);
    assert.notEqual(allBeforeBaseline.status, 0, 'default --all must not invent a baseline on an empty database');
    assert.match(output(allBeforeBaseline), /Use --fresh only against an empty database/);

    const fresh = cli('--fresh', DB_FRESH);
    assert.equal(fresh.status, 0, output(fresh));
    client = await dbClient(DB_FRESH);
    try {
      const baseline = await client.query('SELECT version, name FROM schema_migrations ORDER BY version');
      assert.deepEqual(baseline.rows, [{ version: '0001', name: '0001_baseline.sql' }]);
      const schools = await client.query("SELECT to_regclass('public.schools') IS NOT NULL AS present");
      assert.equal(schools.rows[0].present, true);
    } finally { await client.end(); }

    const migrations = readdirSync(MIGRATIONS_DIR).filter(name => name.endsWith('.sql')).sort();
    const firstAll = cli('--all', DB_FRESH);
    assert.equal(firstAll.status, 0, output(firstAll));
    const secondAll = cli('--all', DB_FRESH);
    assert.equal(secondAll.status, 0, output(secondAll));

    client = await dbClient(DB_FRESH);
    try {
      const applied = await client.query('SELECT version FROM schema_migrations ORDER BY version');
      assert.deepEqual(applied.rows.map(row => row.version), migrations.map(name => name.slice(0, 4)));
      if (existsSync(path.join(MIGRATIONS_DIR, '0002_school_events.sql'))) {
        const events = await client.query("SELECT to_regclass('public.school_events') IS NOT NULL AS present");
        assert.equal(events.rows[0].present, true);
      }
    } finally { await client.end(); }

    const statusAfter = cli('--status', DB_FRESH);
    assert.equal(statusAfter.status, 0, output(statusAfter));
    assert.match(statusAfter.stdout, /\[applied\] 0001 0001_baseline\.sql/);
  });

  test('checksum drift is refused and a failed migration rolls back its DDL and ledger row', async () => {
    const existing = readdirSync(MIGRATIONS_DIR).filter(name => name.endsWith('.sql')).sort();
    const nextVersion = String(existing.length + 1).padStart(4, '0');
    const checksumFile = path.join(MIGRATIONS_DIR, `${nextVersion}_checksum_probe.sql`);
    const checksumSql = 'CREATE TABLE migration_checksum_probe (id INT PRIMARY KEY);\n';
    tempFiles.push(checksumFile);
    writeFileSync(checksumFile, checksumSql);

    const applied = cli('--all', DB_FRESH);
    assert.equal(applied.status, 0, output(applied));
    writeFileSync(checksumFile, checksumSql + '-- deliberate checksum drift\n');
    const mismatch = cli('--all', DB_FRESH);
    assert.notEqual(mismatch.status, 0);
    assert.match(output(mismatch), /Checksum\/name mismatch/);
    writeFileSync(checksumFile, checksumSql);

    const rollbackVersion = String(existing.length + 2).padStart(4, '0');
    const rollbackFile = path.join(MIGRATIONS_DIR, `${rollbackVersion}_rollback_probe.sql`);
    tempFiles.push(rollbackFile);
    writeFileSync(rollbackFile,
      'CREATE TABLE migration_rollback_probe (id INT);\nSELECT * FROM table_that_does_not_exist;\n');
    const failed = cli('--all', DB_FRESH);
    assert.notEqual(failed.status, 0);
    assert.match(output(failed), /transaction rolled back/);

    const client = await dbClient(DB_FRESH);
    try {
      const table = await client.query("SELECT to_regclass('public.migration_rollback_probe') IS NULL AS absent");
      assert.equal(table.rows[0].absent, true, 'DDL from failed migration must roll back');
      const row = await client.query('SELECT 1 FROM schema_migrations WHERE version=$1', [rollbackVersion]);
      assert.equal(row.rowCount, 0, 'failed migration must not be recorded');
    } finally { await client.end(); }
  });

  test('existing untracked application schema is never auto-baselined or fresh-replayed', async () => {
    let client = await dbClient(DB_EXISTING);
    try { await client.query('CREATE TABLE schools (code TEXT PRIMARY KEY)'); }
    finally { await client.end(); }

    const status = cli('--status', DB_EXISTING);
    assert.equal(status.status, 0, output(status));
    assert.match(status.stdout, /Migration ledger does not exist/);
    client = await dbClient(DB_EXISTING);
    try {
      const absent = await client.query("SELECT to_regclass('public.schema_migrations') IS NULL AS absent");
      assert.equal(absent.rows[0].absent, true, '--status must remain read-only');
    } finally { await client.end(); }

    const all = cli('--all', DB_EXISTING);
    assert.notEqual(all.status, 0);
    assert.match(output(all), /application schema already exists without a migration baseline/);
    const fresh = cli('--fresh', DB_EXISTING);
    assert.notEqual(fresh.status, 0);
    assert.match(output(fresh), /application schema already exists without a migration baseline/);

    client = await dbClient(DB_EXISTING);
    try {
      const rows = await client.query('SELECT count(*)::int AS count FROM schema_migrations');
      assert.equal(rows.rows[0].count, 0, 'existing database must not be silently stamped');
    } finally { await client.end(); }
  });
}

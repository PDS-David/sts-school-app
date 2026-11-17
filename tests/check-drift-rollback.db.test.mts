
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { after, before, test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { Client } from 'pg';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const driftChecker = path.join(root, 'backend', 'src', 'db', 'checkDrift.ts');
const adminUrl = process.env.MIGRATION_TEST_DATABASE_URL;

let admin: Client | undefined;
const createdDatabases: string[] = [];

function databaseUrl(database: string): string {
  assert.ok(adminUrl);
  const url = new URL(adminUrl);
  url.pathname = `/${database}`;
  return url.toString();
}

function newDatabaseName(): string {
  return `ops05_drift_${randomUUID().replace(/-/g, '').slice(0, 16)}`;
}

async function createDisposableDatabase(): Promise<string> {
  assert.ok(admin);
  const database = newDatabaseName();

  // template0 gives this test a clean database, independent of template1.
  await admin.query(`CREATE DATABASE "${database}" TEMPLATE template0`);
  createdDatabases.push(database);

  return database;
}

async function inspectDatabase(database: string) {
  const client = new Client({ connectionString: databaseUrl(database) });

  await client.connect();

  try {
    const result = await client.query<{
      pgcrypto_present: boolean;
      ledger_present: boolean;
      drift_schema_count: number;
    }>(`
      SELECT
        EXISTS (
          SELECT 1
          FROM pg_extension
          WHERE extname = 'pgcrypto'
        ) AS pgcrypto_present,
        to_regclass('public.schema_migrations') IS NOT NULL AS ledger_present,
        (
          SELECT COUNT(*)::int
          FROM pg_namespace
          WHERE nspname LIKE '_drift_check_%'
        ) AS drift_schema_count
    `);

    return result.rows[0];
  } finally {
    await client.end();
  }
}

async function runDriftChecker(database: string) {
  const result = spawnSync(
    process.execPath,
    ['--import', 'tsx', driftChecker],
    {
      cwd: root,
      encoding: 'utf8',
      timeout: 120_000,
      maxBuffer: 8 * 1024 * 1024,
      env: {
        ...process.env,
        DATABASE_URL: databaseUrl(database),
        NODE_ENV: 'development',
      },
    },
  );

  assert.equal(
    result.error,
    undefined,
    `Drift checker process error: ${result.error?.message ?? ''}`,
  );

  return {
    status: result.status,
    output: `${result.stdout ?? ''}\n${result.stderr ?? ''}`,
  };
}

before(async () => {
  if (!adminUrl) return;

  const parsed = new URL(adminUrl);
  const hostname = parsed.hostname.replace(/^\[|\]$/g, '');

  assert.ok(
    ['localhost', '127.0.0.1', '::1'].includes(hostname),
    'MIGRATION_TEST_DATABASE_URL must point to a loopback PostgreSQL server',
  );

  admin = new Client({ connectionString: adminUrl });
  await admin.connect();
});

after(async () => {
  if (admin) {
    for (const database of createdDatabases) {
      await admin.query(`DROP DATABASE IF EXISTS "${database}" WITH (FORCE)`);
    }

    for (const database of createdDatabases) {
      const result = await admin.query(
        'SELECT 1 FROM pg_database WHERE datname = $1',
        [database],
      );

      assert.equal(
        result.rowCount,
        0,
        `Disposable test database ${database} was not removed`,
      );
    }

    await admin.end();
  }
});

test(
  'successful drift replay rolls back all temporary database objects',
  { skip: !adminUrl },
  async () => {
    const database = await createDisposableDatabase();
    const beforeState = await inspectDatabase(database);

    const result = await runDriftChecker(database);

    // An empty database is expected to report application-schema drift.
    // Exit code 1 is therefore valid even when replay and rollback succeed.
    assert.equal(result.status, 1, result.output);

    assert.match(
      result.output,
      /Rollback complete; inspected database was not modified\./,
    );

    assert.doesNotMatch(
      result.output,
      /Drift check failed:/,
      'Schema replay should complete successfully on the empty database',
    );

    const afterState = await inspectDatabase(database);

    assert.deepEqual(
      afterState,
      beforeState,
      'Successful drift inspection must leave extensions, ledger and temporary schemas unchanged',
    );

    assert.equal(afterState.drift_schema_count, 0);
    assert.equal(afterState.ledger_present, false);
  },
);

test(
  'failed schema replay rolls back its extension and temporary schema while preserving pre-existing objects',
  { skip: !adminUrl },
  async () => {
    const database = await createDisposableDatabase();

    const client = new Client({ connectionString: databaseUrl(database) });
    await client.connect();

    try {
      // Deliberately malformed pre-existing ledger.
      // schema.sql uses CREATE TABLE IF NOT EXISTS, so it will not repair
      // this table. Its final baseline INSERT must fail on missing columns.
      await client.query(`
        CREATE TABLE public.schema_migrations (
          wrong_column TEXT
        )
      `);
    } finally {
      await client.end();
    }

    const beforeState = await inspectDatabase(database);
    const result = await runDriftChecker(database);

    assert.equal(result.status, 1, result.output);

    assert.match(
      result.output,
      /Drift check failed:/,
      'The deliberately malformed migration ledger should make schema replay fail',
    );

    assert.match(
      result.output,
      /Rollback complete after drift-check failure\./,
    );

    const afterState = await inspectDatabase(database);

    assert.equal(
      afterState.pgcrypto_present,
      beforeState.pgcrypto_present,
      'A failed replay must not leave behind an extension it created',
    );

    assert.equal(afterState.ledger_present, true);
    assert.equal(afterState.drift_schema_count, 0);

    const verifyClient = new Client({
      connectionString: databaseUrl(database),
    });

    await verifyClient.connect();

    try {
      const columns = await verifyClient.query<{ column_name: string }>(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'schema_migrations'
        ORDER BY ordinal_position
      `);

      assert.deepEqual(
        columns.rows.map((row) => row.column_name),
        ['wrong_column'],
        'Rollback must preserve the original malformed ledger without adding or changing columns',
      );
    } finally {
      await verifyClient.end();
    }
  },
);

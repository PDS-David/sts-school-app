import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { PoolClient } from 'pg';
import { pool } from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.resolve(__dirname, '../../schema.sql');
const MIGRATIONS_DIR = path.resolve(__dirname, '../../migrations');
const LOCK_NAMESPACE = 1937001;
const LOCK_ID = 3;

type Mode = '--all' | '--fresh' | '--status';
type Migration = { version: string; name: string; checksum: string; sql: string };
type AppliedMigration = { version: string; name: string; checksum: string };

function checksum(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

function readMigrations(): Migration[] {
  if (!existsSync(MIGRATIONS_DIR)) {
    throw new Error(`Migrations directory is missing: ${MIGRATIONS_DIR}`);
  }
  const files = readdirSync(MIGRATIONS_DIR).filter(name => name.endsWith('.sql')).sort();
  if (!files.length) throw new Error('No numbered migration files found.');

  const migrations = files.map(name => {
    if (!/^\d{4}_[a-z0-9_-]+\.sql$/.test(name)) {
      throw new Error(`Invalid migration filename "${name}". Use NNNN_lowercase-description.sql.`);
    }
    const sql = readFileSync(path.join(MIGRATIONS_DIR, name), 'utf8');
    return {
      version: name.slice(0, 4),
      name,
      checksum: checksum(sql),
      sql,
    };
  });

  const versions = new Set<string>();
  for (const [index, migration] of migrations.entries()) {
    if (versions.has(migration.version)) throw new Error(`Duplicate migration version ${migration.version}.`);
    const expected = String(index + 1).padStart(4, '0');
    if (migration.version !== expected) {
      throw new Error(`Migration sequence gap: expected ${expected}, found ${migration.version}.`);
    }
    versions.add(migration.version);
  }
  return migrations;
}

async function ledgerExists(client: PoolClient): Promise<boolean> {
  const { rows } = await client.query(
    "SELECT to_regclass('public.schema_migrations') IS NOT NULL AS present",
  );
  return Boolean(rows[0]?.present);
}

async function ensureLedger(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS public.schema_migrations (
      version TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      checksum TEXT NOT NULL,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}

async function getApplied(client: PoolClient): Promise<AppliedMigration[]> {
  if (!(await ledgerExists(client))) return [];
  const { rows } = await client.query(
    'SELECT version, name, checksum FROM public.schema_migrations ORDER BY version',
  );
  return rows as AppliedMigration[];
}

async function assertNoUntrackedApplicationSchema(client: PoolClient): Promise<void> {
  // Match the clean-bootstrap guard: tolerate extension-owned objects and
  // the ledger itself, but refuse any other pre-existing public schema object.
  const { rows } = await client.query(`
    SELECT 1 FROM (
      SELECT 'pg_class'::regclass AS classid, c.oid AS objid
        FROM pg_class c JOIN pg_namespace n ON n.oid=c.relnamespace
        WHERE n.nspname='public' AND c.relname <> 'schema_migrations' AND c.relkind IN ('r','p','v','m','f','S')
      UNION ALL
      SELECT 'pg_proc'::regclass, p.oid
        FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace
        WHERE n.nspname='public'
      UNION ALL
      SELECT 'pg_type'::regclass, t.oid
        FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace
        WHERE n.nspname='public' AND t.typrelid=0 AND t.typelem=0
    ) obj
    WHERE NOT EXISTS (
      SELECT 1 FROM pg_depend d
       WHERE d.classid=obj.classid AND d.objid=obj.objid AND d.deptype='e'
    )
    LIMIT 1
  `);
  if (rows[0]) {
    throw new Error(
      'An application schema already exists without a migration baseline, or the public schema contains untracked objects. ' +
      'Use --fresh only for a genuinely clean installation, or complete the owner-approved OPS-05 drift review before adopting an existing database.',
    );
  }
}

async function acquireLock(client: PoolClient): Promise<void> {
  await client.query('SELECT pg_advisory_lock($1, $2)', [LOCK_NAMESPACE, LOCK_ID]);
}

async function releaseLock(client: PoolClient): Promise<void> {
  await client.query('SELECT pg_advisory_unlock($1, $2)', [LOCK_NAMESPACE, LOCK_ID]);
}

function assertAppliedChecksums(migrations: Migration[], applied: AppliedMigration[]): void {
  const byVersion = new Map(migrations.map(m => [m.version, m]));
  for (const row of applied) {
    const source = byVersion.get(row.version);
    if (!source) {
      throw new Error(`Database has applied migration ${row.version} (${row.name}), but that file is missing from backend/migrations/.`);
    }
    if (source.name !== row.name || source.checksum !== row.checksum) {
      throw new Error(
        `Checksum/name mismatch for applied migration ${row.version}. Never edit an applied migration; restore the original file and add a new numbered migration.`,
      );
    }
  }
}

function assertSequentialHistory(migrations: Migration[], applied: AppliedMigration[]): void {
  const appliedVersions = new Set(applied.map(row => row.version));
  let pendingSeen = false;
  for (const migration of migrations) {
    if (!appliedVersions.has(migration.version)) pendingSeen = true;
    else if (pendingSeen) {
      throw new Error(`Migration history is out of sequence at ${migration.version}. Review schema_migrations before continuing.`);
    }
  }
}

async function applyAll(client: PoolClient, migrations: Migration[]): Promise<void> {
  // Do not create even an empty ledger on an existing untracked database.
  // --all is incremental-only; --fresh is the explicit clean-install path.
  if (!(await ledgerExists(client))) {
    await assertNoUntrackedApplicationSchema(client);
    throw new Error('No baseline migration is recorded. Use --fresh only against an empty database, or complete OPS-05 drift review before adopting an existing database.');
  }
  const applied = await getApplied(client);
  if (!applied.length) {
    throw new Error('The migration ledger is empty. Use --fresh only against an empty database, or complete OPS-05 drift review before adopting an existing database.');
  }
  assertAppliedChecksums(migrations, applied);
  assertSequentialHistory(migrations, applied);

  const appliedVersions = new Set(applied.map(row => row.version));
  for (const migration of migrations) {
    if (appliedVersions.has(migration.version)) continue;

    await client.query('BEGIN');
    try {
      if (migration.sql.trim()) await client.query(migration.sql);
      await client.query(
        'INSERT INTO public.schema_migrations(version,name,checksum) VALUES($1,$2,$3)',
        [migration.version, migration.name, migration.checksum],
      );
      await client.query('COMMIT');
      console.log(`Applied ${migration.version} ${migration.name}`);
    } catch (error) {
      await client.query('ROLLBACK');
      throw new Error(`Migration ${migration.name} failed; transaction rolled back.`, { cause: error });
    }
  }
}

async function applyFresh(client: PoolClient, migrations: Migration[]): Promise<void> {
  const baseline = migrations.find(m => m.version === '0001');
  if (!baseline || baseline.name !== '0001_baseline.sql') {
    throw new Error('Fresh install requires migrations/0001_baseline.sql.');
  }

  const applied = await getApplied(client);
  assertAppliedChecksums(migrations, applied);
  await assertNoUntrackedApplicationSchema(client);
  if (applied.some(row => row.version !== '0001')) {
    throw new Error('Refusing --fresh after incremental migrations have been applied. Use --all.');
  }
  await ensureLedger(client);

  const schema = readFileSync(SCHEMA_PATH, 'utf8');
  console.log('Applying complete schema.sql for a fresh installation…');
  await client.query('BEGIN');
  try {
    await client.query(schema);
    const appliedAfterSchema = await getApplied(client);
    assertAppliedChecksums(migrations, appliedAfterSchema);
    if (!appliedAfterSchema.some(row => row.version === '0001')) {
      throw new Error('schema.sql did not stamp the immutable 0001 baseline migration.');
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw new Error('Fresh schema replay failed; transaction rolled back.', { cause: error });
  }
  console.log('Fresh schema applied and baseline migration stamped.');
}

async function printStatus(client: PoolClient, migrations: Migration[]): Promise<void> {
  const exists = await ledgerExists(client);
  const applied = exists ? await getApplied(client) : [];
  assertAppliedChecksums(migrations, applied);
  assertSequentialHistory(migrations, applied);
  const appliedVersions = new Set(applied.map(row => row.version));

  console.log(exists ? 'Migration ledger:' : 'Migration ledger does not exist (read-only status).');
  for (const migration of migrations) {
    console.log(`${appliedVersions.has(migration.version) ? '[applied]' : '[pending]'} ${migration.version} ${migration.name}`);
  }
  if (!exists) {
    console.log('Use --fresh for a clean installation. Existing databases require OPS-05 drift review before baseline adoption.');
  }
}

export async function runMigrations(mode: Mode = '--all'): Promise<void> {
  if (!['--all', '--fresh', '--status'].includes(mode)) {
    throw new Error('Usage: migrate.ts [--all|--fresh|--status]');
  }
  const migrations = readMigrations();
  const client = await pool.connect();
  let locked = false;
  try {
    if (mode === '--status') {
      await printStatus(client, migrations);
      return;
    }

    await acquireLock(client);
    locked = true;
    if (mode === '--fresh') await applyFresh(client, migrations);
    else await applyAll(client, migrations);
  } finally {
    try { if (locked) await releaseLock(client); }
    finally { client.release(); }
  }
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const mode = (process.argv[2] ?? '--all') as Mode;
  runMigrations(mode)
    .catch(error => {
      console.error(error instanceof Error ? error.message : 'Migration failed.');
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}

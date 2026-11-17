import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import type { PoolClient } from 'pg';
import { pool } from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTRACT_PATH = path.resolve(__dirname, '../../migrations/baseline/0001_contract.json');
const BASELINE_PATH = path.resolve(__dirname, '../../migrations/0001_baseline.sql');
const DATABASE_NAME = 'sts_school_db_2';
const LOCK_NAMESPACE = 1937001;
const LOCK_ID = 3;

type ColumnContract = { data_type: string; udt_name: string; is_nullable: 'YES' | 'NO'; has_default: boolean };
type ActualColumnRow = { table_name: string; column_name: string; data_type: string; udt_name: string; is_nullable: 'YES' | 'NO'; column_default: string | null };
type Contract = {
  baseline_migration: { version: string; name: string; sha256: string };
  original_schema: { bootstrap_checksum: string; commit: string; blob_sha: string };
  expected: {
    baseline_table_count: number; baseline_column_count: number; public_table_count: number;
    operational_tables: string[]; explicit_indexes: string[]; constraint_counts: Record<string, number>;
    extensions: string[]; enum_types: string[]; pending_tables: string[];
    pending_audit_log_columns: string[]; pending_audit_log_fk_to_drop: string; pending_indexes: string[]; pending_functions: string[]; pending_triggers: string[]; pending_constraints: string[];
  };
  tables: Record<string, Record<string, ColumnContract>>;
};

const contract = JSON.parse(readFileSync(CONTRACT_PATH, 'utf8')) as Contract;
const baselineSql = readFileSync(BASELINE_PATH);
const baselineChecksum = createHash('sha256').update(baselineSql).digest('hex');

function fail(message: string): never { throw new Error(message); }
function sorted(values: string[]): string[] { return [...values].sort(); }
function sameList(left: string[], right: string[]): boolean { return JSON.stringify(sorted(left)) === JSON.stringify(sorted(right)); }

async function preflight(client: PoolClient): Promise<{ database: string; version: string; columns: number }> {
  const errors: string[] = [];
  if (baselineChecksum !== contract.baseline_migration.sha256) {
    errors.push(`0001 baseline checksum changed: expected ${contract.baseline_migration.sha256}, found ${baselineChecksum}`);
  }

  const server = await client.query<{ database: string; version: string; version_num: number; encoding: string }>(
    `SELECT current_database() AS database, current_setting('server_version') AS version,
            current_setting('server_version_num')::integer AS version_num, current_setting('server_encoding') AS encoding`,
  );
  const db = server.rows[0];
  if (db.database !== DATABASE_NAME) errors.push(`Connected to ${db.database}, not ${DATABASE_NAME}`);
  if (Math.floor(db.version_num / 10000) !== 18) errors.push(`Expected PostgreSQL 18, found ${db.version}`);
  if (db.encoding !== 'UTF8') errors.push(`Expected UTF8 encoding, found ${db.encoding}`);

  const tableRows = await client.query<{ table_name: string }>(
    `SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_type='BASE TABLE' ORDER BY table_name`,
  );
  const baselineTables = Object.keys(contract.tables);
  const expectedPublicTables = [...baselineTables, ...contract.expected.operational_tables];
  const actualPublicTables = tableRows.rows.map(row => row.table_name);
  if (!sameList(actualPublicTables, expectedPublicTables)) {
    errors.push(`Public table set differs. Expected ${sorted(expectedPublicTables).join(', ')}; found ${sorted(actualPublicTables).join(', ')}`);
  }
  if (baselineTables.length !== contract.expected.baseline_table_count) errors.push('Baseline contract table count is internally inconsistent');

  const columnRows = await client.query<ActualColumnRow>(
    `SELECT table_name,column_name,data_type,udt_name,is_nullable,column_default
       FROM information_schema.columns WHERE table_schema='public' ORDER BY table_name,ordinal_position`,
  );
  const actualByTable = new Map<string, Map<string, ActualColumnRow>>();
  for (const row of columnRows.rows) {
    if (!actualByTable.has(row.table_name)) actualByTable.set(row.table_name, new Map());
    actualByTable.get(row.table_name)!.set(row.column_name, row);
  }
  let checkedColumns = 0;
  for (const [table, expectedColumns] of Object.entries(contract.tables)) {
    const actualColumns = actualByTable.get(table) ?? new Map<string, ActualColumnRow>();
    if (!sameList([...actualColumns.keys()], Object.keys(expectedColumns))) {
      errors.push(`${table}: baseline column names differ (expected ${Object.keys(expectedColumns).length}, found ${actualColumns.size})`);
    }
    for (const [column, expected] of Object.entries(expectedColumns)) {
      const actual = actualColumns.get(column);
      if (!actual) continue;
      checkedColumns++;
      if (actual.data_type !== expected.data_type || actual.udt_name !== expected.udt_name) {
        errors.push(`${table}.${column}: expected ${expected.data_type}/${expected.udt_name}, found ${actual.data_type}/${actual.udt_name}`);
      }
      if (actual.is_nullable !== expected.is_nullable) errors.push(`${table}.${column}: nullability differs (expected ${expected.is_nullable}, found ${actual.is_nullable})`);
      if ((actual.column_default !== null) !== expected.has_default) errors.push(`${table}.${column}: default presence differs`);
    }
  }
  if (checkedColumns !== contract.expected.baseline_column_count) errors.push(`Expected to verify ${contract.expected.baseline_column_count} baseline columns, verified ${checkedColumns}`);

  const indexRows = await client.query<{ indexname: string }>(`SELECT indexname FROM pg_indexes WHERE schemaname='public'`);
  const actualIndexes = new Set(indexRows.rows.map(row => row.indexname));
  for (const indexName of contract.expected.explicit_indexes) if (!actualIndexes.has(indexName)) errors.push(`Missing baseline index ${indexName}`);

  const constraintRows = await client.query<{ contype: string; total: number }>(
    `SELECT c.contype, count(*)::integer AS total
       FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid JOIN pg_namespace n ON n.oid=t.relnamespace
      WHERE n.nspname='public' AND t.relname = ANY($1::text[]) GROUP BY c.contype`,
    [baselineTables],
  );
  const actualConstraintCounts = Object.fromEntries(constraintRows.rows.map(row => [row.contype, Number(row.total)]));
  for (const [type, expectedCount] of Object.entries(contract.expected.constraint_counts)) {
    if ((actualConstraintCounts[type] ?? 0) !== expectedCount) errors.push(`Baseline constraint count ${type}: expected ${expectedCount}, found ${actualConstraintCounts[type] ?? 0}`);
  }
  const unvalidated = await client.query<{ total: number }>(
    `SELECT count(*)::integer AS total FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid JOIN pg_namespace n ON n.oid=t.relnamespace
      WHERE n.nspname='public' AND t.relname = ANY($1::text[]) AND NOT c.convalidated`, [baselineTables],
  );
  if (Number(unvalidated.rows[0]?.total ?? 0) !== 0) errors.push('One or more baseline constraints are not validated');
  const invalidIndexes = await client.query<{ total: number }>(
    `SELECT count(*)::integer AS total FROM pg_index i JOIN pg_class t ON t.oid=i.indrelid JOIN pg_namespace n ON n.oid=t.relnamespace
      WHERE n.nspname='public' AND t.relname = ANY($1::text[]) AND (NOT i.indisvalid OR NOT i.indisready)`, [baselineTables],
  );
  if (Number(invalidIndexes.rows[0]?.total ?? 0) !== 0) errors.push('One or more baseline indexes are invalid or not ready');

  const extensionRows = await client.query<{ extname: string }>(`SELECT extname FROM pg_extension`);
  for (const name of contract.expected.extensions) if (!extensionRows.rows.some(row => row.extname === name)) errors.push(`Missing required extension ${name}`);
  const enumRows = await client.query<{ typname: string }>(
    `SELECT t.typname FROM pg_type t JOIN pg_namespace n ON n.oid=t.typnamespace WHERE n.nspname='public' AND t.typtype='e'`,
  );
  for (const name of contract.expected.enum_types) if (!enumRows.rows.some(row => row.typname === name)) errors.push(`Missing required enum type ${name}`);

  const pendingRows = await client.query<{ name: string }>(
    `SELECT pending_name AS name FROM unnest($1::text[]) AS pending(pending_name) WHERE to_regclass('public.' || pending_name) IS NOT NULL`,
    [contract.expected.pending_tables],
  );
  if (pendingRows.rows.length) errors.push(`Pending migration tables already exist: ${pendingRows.rows.map(row => row.name).join(', ')}`);
  const pendingAuditColumns = await client.query<{ column_name: string }>(
    `SELECT column_name FROM information_schema.columns WHERE table_schema='public' AND table_name='audit_log' AND column_name = ANY($1::text[])`,
    [contract.expected.pending_audit_log_columns],
  );
  if (pendingAuditColumns.rows.length) errors.push(`Some audit migration columns already exist: ${pendingAuditColumns.rows.map(row => row.column_name).join(', ')}`);
  const oldAuditFk = await client.query<{ present: boolean }>(
    `SELECT EXISTS (SELECT 1 FROM pg_constraint c JOIN pg_class t ON t.oid=c.conrelid JOIN pg_namespace n ON n.oid=t.relnamespace
      WHERE n.nspname='public' AND t.relname='audit_log' AND c.conname=$1 AND c.contype='f') AS present`,
    [contract.expected.pending_audit_log_fk_to_drop],
  );
  if (!oldAuditFk.rows[0]?.present) errors.push(`Expected pre-migration audit FK ${contract.expected.pending_audit_log_fk_to_drop} is missing`);
  const pendingIndexes = await client.query<{ indexname: string }>(
    `SELECT indexname FROM pg_indexes WHERE schemaname='public' AND indexname = ANY($1::text[])`,
    [contract.expected.pending_indexes],
  );
  if (pendingIndexes.rows.length) errors.push(`Pending migration indexes already exist: ${pendingIndexes.rows.map(row => row.indexname).join(', ')}`);
  const pendingFunctions = await client.query<{ proname: string }>(
    `SELECT p.proname FROM pg_proc p JOIN pg_namespace n ON n.oid=p.pronamespace WHERE n.nspname='public' AND p.proname = ANY($1::text[])`,
    [contract.expected.pending_functions],
  );
  if (pendingFunctions.rows.length) errors.push(`Pending migration functions already exist: ${pendingFunctions.rows.map(row => row.proname).join(', ')}`);
  const pendingTriggers = await client.query<{ tgname: string }>(
    `SELECT tgname FROM pg_trigger WHERE tgrelid='public.audit_log'::regclass AND tgname = ANY($1::text[]) AND NOT tgisinternal`,
    [contract.expected.pending_triggers],
  );
  if (pendingTriggers.rows.length) errors.push(`Pending migration triggers already exist: ${pendingTriggers.rows.map(row => row.tgname).join(', ')}`);
  const pendingConstraints = await client.query<{ conname: string }>(
    `SELECT conname FROM pg_constraint WHERE conrelid='public.audit_log'::regclass AND conname = ANY($1::text[])`,
    [contract.expected.pending_constraints],
  );
  if (pendingConstraints.rows.length) errors.push(`Pending migration constraints already exist: ${pendingConstraints.rows.map(row => row.conname).join(', ')}`);
  const allUserTriggers = await client.query<{ total: number }>(
    `SELECT count(*)::integer AS total FROM pg_trigger t JOIN pg_class c ON c.oid=t.tgrelid JOIN pg_namespace n ON n.oid=c.relnamespace WHERE n.nspname='public' AND NOT t.tgisinternal`,
  );
  if (Number(allUserTriggers.rows[0]?.total ?? 0) !== 0) errors.push('Unexpected user-defined trigger(s) exist in public schema');
  const auditTriggers = await client.query<{ total: number }>(
    `SELECT count(*)::integer AS total FROM pg_trigger WHERE tgrelid='public.audit_log'::regclass AND NOT tgisinternal`,
  );
  if (Number(auditTriggers.rows[0]?.total ?? 0) !== 0) errors.push('Unexpected user trigger(s) already exist on audit_log');

  const bootstrapRows = await client.query<{ version: number; checksum: string }>(
    `SELECT version,checksum FROM public.app_bootstrap ORDER BY applied_at DESC`,
  );
  if (bootstrapRows.rows.length !== 1 || bootstrapRows.rows[0]?.version !== 1 || bootstrapRows.rows[0]?.checksum !== contract.original_schema.bootstrap_checksum) {
    errors.push('app_bootstrap marker does not match the verified original bootstrap checksum; refusing baseline adoption');
  }

  if (errors.length) fail(`Baseline adoption preflight failed:\n- ${errors.join('\n- ')}`);
  return { database: db.database, version: db.version, columns: checkedColumns };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const confirmIndex = args.indexOf('--confirm-database');
  const confirmation = confirmIndex >= 0 ? args[confirmIndex + 1] : undefined;
  if (confirmation !== DATABASE_NAME) fail(`Pass --confirm-database ${DATABASE_NAME} to run this production-specific preflight.`);
  if (baselineChecksum !== contract.baseline_migration.sha256) fail('The 0001 baseline migration checksum does not match the pinned contract.');
  if (apply && confirmation !== DATABASE_NAME) fail('Production baseline adoption requires the exact database confirmation.');

  const client = await pool.connect();
  let transactionOpen = false;
  try {
    await client.query('BEGIN');
    transactionOpen = true;
    await client.query('SELECT pg_advisory_xact_lock($1, $2)', [LOCK_NAMESPACE, LOCK_ID]);
    const targetInfo = await client.query<{ database: string; version_num: number; encoding: string }>(
      `SELECT current_database() AS database, current_setting('server_version_num')::integer AS version_num, current_setting('server_encoding') AS encoding`,
    );
    const target = targetInfo.rows[0];
    if (target.database !== DATABASE_NAME || Math.floor(target.version_num / 10000) !== 18 || target.encoding !== 'UTF8') {
      fail(`Refusing target ${target.database}: expected ${DATABASE_NAME}, PostgreSQL 18, UTF8.`);
    }
    const ledgerState = await client.query<{ present: boolean }>(`SELECT to_regclass('public.schema_migrations') IS NOT NULL AS present`);
    if (ledgerState.rows[0]?.present) {
      const baselineRows = await client.query<{ version: string; name: string; checksum: string }>(
        `SELECT version,name,checksum FROM public.schema_migrations WHERE version=$1`,
        [contract.baseline_migration.version],
      );
      const baselineRow = baselineRows.rows[0];
      if (!baselineRow || baselineRow.name !== contract.baseline_migration.name || baselineRow.checksum !== baselineChecksum) {
        fail('schema_migrations exists, but its 0001 baseline record does not match the verified baseline. Refusing to continue.');
      }
      console.log('The verified 0001 baseline is already adopted. No ledger changes were made; the migration runner will validate the complete history.');
      await client.query('ROLLBACK');
      transactionOpen = false;
    } else {
      const result = await preflight(client);
      console.log(`Baseline preflight passed for ${result.database} (PostgreSQL ${result.version}); verified ${result.columns} original baseline columns.`);
      console.log('Preserved operational tables: app_bootstrap, backup_log. Pending migrations: 0002_school_events, 0003_rate_limit_counters, 0004_audit_log_integrity.');
      if (apply) {
        await client.query(`CREATE TABLE public.schema_migrations (
          version TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          checksum TEXT NOT NULL,
          applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`);
        await client.query(
          'INSERT INTO public.schema_migrations(version,name,checksum) VALUES($1,$2,$3)',
          [contract.baseline_migration.version, contract.baseline_migration.name, baselineChecksum],
        );
        await client.query('COMMIT');
        transactionOpen = false;
        console.log('Baseline ledger created and 0001 recorded. No application migrations were run by this command.');
      } else {
        await client.query('ROLLBACK');
        transactionOpen = false;
        console.log('DRY RUN ONLY: no database changes were made.');
      }
    }
  } catch (error) {
    if (transactionOpen) {
      try { await client.query('ROLLBACK'); } catch { /* Preserve the original preflight error. */ }
    }
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch(error => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});

// ── Schema drift checker ─────────────────────────────────────────────────────
// Answers one question systematically: "does what's actually running in
// production match what schema.sql says it should be?" — the exact class of
// bug that caused the `activation_code` 500 (code shipped, migration never
// ran against the live DB, and nobody had a way to know until a real user
// hit it).
//
// HOW: replay the real schema.sql inside a transaction on one dedicated client,
// with a unique throwaway schema first on search_path. All introspection queries
// use that same client. The script always ROLLBACKs before releasing the client;
// this is essential because schema.sql contains public-qualified DDL and a
// public.schema_migrations baseline stamp. Transaction rollback also undoes
// extension creation and any other writes performed by the replay.
//
// SAFETY: this is a rollback-only schema comparison, not a write-free SQL
// execution. Never remove the transaction or replace ROLLBACK with COMMIT.
// A successful rollback leaves the inspected database unchanged.
//
// USAGE (same pattern as db:migrate — use only after reviewing this rollback guard):
//   cd backend
//   $env:NODE_ENV="production"          (PowerShell)  or  export NODE_ENV=production (bash)
//   $env:DATABASE_URL="<the EXTERNAL Render Postgres URL>"
//   npx tsx src/db/checkDrift.ts
//
// Exit code 0 = clean (no drift). Exit code 1 = drift found (see report).
// The replay executes DDL/DML but must be fully undone by ROLLBACK before exit.

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import type { PoolClient } from 'pg';
import { pool } from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

type ColumnRow = {
  table_name: string;
  column_name: string;
  data_type: string;
  is_nullable: string;
  column_default: string | null;
  character_maximum_length: number | null;
};

type EnumRow = { enum_name: string; labels: string[] };
type IndexRow = { table_name: string; indexdef: string };
type ConstraintRow = { table_name: string; constraint_type: string; columns: string[] };

async function getColumns(client: PoolClient, schema: string): Promise<ColumnRow[]> {
  const { rows } = await client.query(
    `SELECT table_name, column_name, data_type, is_nullable, column_default, character_maximum_length
     FROM information_schema.columns
     WHERE table_schema = $1
     ORDER BY table_name, ordinal_position`,
    [schema],
  );
  return rows;
}

async function getTables(client: PoolClient, schema: string): Promise<string[]> {
  const { rows } = await client.query(
    `SELECT table_name FROM information_schema.tables WHERE table_schema = $1 AND table_type = 'BASE TABLE' ORDER BY table_name`,
    [schema],
  );
  return rows.map((r) => r.table_name);
}

async function getEnums(client: PoolClient, schema: string): Promise<EnumRow[]> {
  const { rows } = await client.query(
    `SELECT t.typname AS enum_name, array_agg(e.enumlabel ORDER BY e.enumsortorder) AS labels
     FROM pg_type t
     JOIN pg_enum e ON t.oid = e.enumtypid
     JOIN pg_namespace n ON n.oid = t.typnamespace
     WHERE n.nspname = $1
     GROUP BY t.typname
     ORDER BY t.typname`,
    [schema],
  );
  return rows;
}

async function getIndexes(client: PoolClient, schema: string): Promise<IndexRow[]> {
  const { rows } = await client.query(
    `SELECT tablename AS table_name, indexdef FROM pg_indexes WHERE schemaname = $1 ORDER BY tablename, indexname`,
    [schema],
  );
  // Normalize away the schema-qualified table reference inside the index
  // definition (e.g. "ON _drift_check_123.users" vs "ON public.users") so
  // otherwise-identical index defs compare equal across schemas.
  return rows.map((r) => ({
    table_name: r.table_name,
    indexdef: r.indexdef.replace(new RegExp(`\\b${schema}\\.`, 'g'), ''),
  }));
}

async function getConstraints(client: PoolClient, schema: string): Promise<ConstraintRow[]> {
  const { rows } = await client.query(
    `SELECT tc.table_name, tc.constraint_type,
            array_agg(kcu.column_name::text ORDER BY kcu.ordinal_position) AS columns
     FROM information_schema.table_constraints tc
     JOIN information_schema.key_column_usage kcu
       ON tc.constraint_name = kcu.constraint_name AND tc.table_schema = kcu.table_schema
     WHERE tc.table_schema = $1 AND tc.constraint_type IN ('PRIMARY KEY','UNIQUE','FOREIGN KEY')
     GROUP BY tc.table_name, tc.constraint_type, tc.constraint_name
     ORDER BY tc.table_name, tc.constraint_type`,
    [schema],
  );
  return rows;
}

function key(row: ConstraintRow): string {
  return `${row.table_name}::${row.constraint_type}::${row.columns.join(',')}`;
}

async function main() {
  const tempSchema = `_drift_check_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const issues: string[] = [];
  let client: PoolClient | undefined;
  let transactionStarted = false;
  let rollbackFailed = false;

  try {
    client = await pool.connect();
    await client.query('BEGIN');
    transactionStarted = true;

    console.log(`Creating transactional throwaway schema "${tempSchema}"…`);
    await client.query(`CREATE SCHEMA "${tempSchema}"`);
    await client.query(`SET LOCAL search_path TO "${tempSchema}", public`);

    console.log('Applying schema.sql inside the rollback-only transaction…');
    const schemaSql = readFileSync(path.resolve(__dirname, '../../schema.sql'), 'utf-8');
    await client.query(schemaSql);

    console.log('Introspecting expected (throwaway) vs actual (public) schema…\n');

    const expectedTables = await getTables(client, tempSchema);
    const actualTables = await getTables(client, 'public');
    const missingTables = expectedTables.filter((t) => !actualTables.includes(t));
    const extraTables = actualTables.filter((t) => !expectedTables.includes(t));

    missingTables.forEach((t) => issues.push(`MISSING TABLE: "${t}" exists in schema.sql but not in production`));
    extraTables.forEach((t) => issues.push(`EXTRA TABLE (informational): "${t}" exists in production but not in schema.sql — check if it's legacy/unused`));

    const expectedCols = await getColumns(client, tempSchema);
    const actualCols = await getColumns(client, 'public');
    const actualColMap = new Map<string, ColumnRow>();
    actualCols.forEach((c) => actualColMap.set(`${c.table_name}.${c.column_name}`, c));
    const expectedColMap = new Map<string, ColumnRow>();
    expectedCols.forEach((c) => expectedColMap.set(`${c.table_name}.${c.column_name}`, c));

    for (const [colKey, exp] of expectedColMap) {
      if (!expectedTables.includes(exp.table_name)) continue;
      const act = actualColMap.get(colKey);
      if (!act) {
        issues.push(`MISSING COLUMN: "${exp.table_name}.${exp.column_name}" exists in schema.sql but not in production`);
        continue;
      }
      if (exp.data_type !== act.data_type) {
        issues.push(`TYPE MISMATCH: "${colKey}" — schema.sql says ${exp.data_type}, production has ${act.data_type}`);
      }
      if (exp.is_nullable !== act.is_nullable) {
        issues.push(`NULLABILITY MISMATCH: "${colKey}" — schema.sql says nullable=${exp.is_nullable}, production has nullable=${act.is_nullable} (this is exactly the class of bug that caused the activation_code 500 — a NOT NULL that should have been dropped, or vice versa)`);
      }
    }
    for (const [colKey, act] of actualColMap) {
      if (!expectedTables.includes(act.table_name)) continue;
      if (!expectedColMap.has(colKey)) {
        issues.push(`EXTRA COLUMN (informational): "${colKey}" exists in production but not in schema.sql`);
      }
    }

    const expectedEnums = await getEnums(client, tempSchema);
    const actualEnums = await getEnums(client, 'public');
    const actualEnumMap = new Map(actualEnums.map((e) => [e.enum_name, e.labels]));
    for (const exp of expectedEnums) {
      const act = actualEnumMap.get(exp.enum_name);
      if (!act) {
        issues.push(`MISSING ENUM TYPE: "${exp.enum_name}" exists in schema.sql but not in production`);
        continue;
      }
      const expSorted = [...exp.labels].sort();
      const actSorted = [...act].sort();
      if (JSON.stringify(expSorted) !== JSON.stringify(actSorted)) {
        issues.push(`ENUM VALUE MISMATCH: "${exp.enum_name}" — schema.sql has [${exp.labels.join(', ')}], production has [${act.join(', ')}]`);
      }
    }

    const expectedConstraints = await getConstraints(client, tempSchema);
    const actualConstraints = await getConstraints(client, 'public');
    const actualConstraintKeys = new Set(actualConstraints.map(key));
    const expectedConstraintKeys = new Set(expectedConstraints.map(key));
    for (const c of expectedConstraints) {
      if (!expectedTables.includes(c.table_name)) continue;
      if (!actualConstraintKeys.has(key(c))) {
        issues.push(`MISSING CONSTRAINT: ${c.table_name} is missing a ${c.constraint_type} on (${c.columns.join(', ')})`);
      }
    }
    for (const c of actualConstraints) {
      if (!expectedTables.includes(c.table_name)) continue;
      if (!expectedConstraintKeys.has(key(c))) {
        issues.push(`EXTRA CONSTRAINT (informational): ${c.table_name} has an unexpected ${c.constraint_type} on (${c.columns.join(', ')})`);
      }
    }

    const expectedIdx = await getIndexes(client, tempSchema);
    const actualIdx = await getIndexes(client, 'public');
    const actualIdxDefs = new Set(actualIdx.map((i) => i.indexdef));
    for (const idx of expectedIdx) {
      if (!expectedTables.includes(idx.table_name)) continue;
      if (!actualIdxDefs.has(idx.indexdef)) {
        issues.push(`MISSING INDEX: schema.sql defines an index on "${idx.table_name}" not found in production: ${idx.indexdef}`);
      }
    }

    if (issues.length === 0) {
      console.log('✅ No drift found — production schema matches schema.sql exactly.');
    } else {
      const blocking = issues.filter((i) => !i.includes('(informational)'));
      const informational = issues.filter((i) => i.includes('(informational)'));
      console.log(`⚠️  ${issues.length} irregularit${issues.length === 1 ? 'y' : 'ies'} found:\n`);
      if (blocking.length) {
        console.log(`--- ${blocking.length} likely to cause real errors (run "npm run db:migrate" to fix missing tables/columns/enums/indexes; missing constraints need a manual ALTER) ---`);
        blocking.forEach((i) => console.log(`  • ${i}`));
      }
      if (informational.length) {
        console.log(`\n--- ${informational.length} informational (production has extra stuff not in schema.sql — not necessarily a problem, just worth knowing about) ---`);
        informational.forEach((i) => console.log(`  • ${i}`));
      }
    }

    console.log('Rolling back schema replay and all comparison-side effects…');
    await client.query('ROLLBACK');
    transactionStarted = false;
    console.log('Rollback complete; inspected database was not modified.');
    process.exitCode = issues.some((i) => !i.includes('(informational)')) ? 1 : 0;
  } catch (e) {
    console.error('Drift check failed:', e);
    if (client && transactionStarted) {
      try {
        await client.query('ROLLBACK');
        transactionStarted = false;
        console.log('Rollback complete after drift-check failure.');
      } catch (rollbackErr) {
        rollbackFailed = true;
        console.error('CRITICAL: drift-check transaction rollback failed; inspect database connection and transaction state immediately.', rollbackErr);
      }
    }
    process.exitCode = 1;
  } finally {
    if (client) {
      client.release(
        rollbackFailed
          ? new Error('Drift-check rollback failed; discard this database connection.')
          : undefined,
      );
    }
    await pool.end();
  }
}
main();

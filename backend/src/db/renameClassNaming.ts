// Admin utility for canonical class naming: 'JSS1' -> 'JSS 1',
// 'SS1' -> 'SS 1', and legacy 'Grade 1'..'Grade 6' / 'PRY 1'..'PRY 6'
// -> 'Primary 1'..'Primary 6'. Early-years names are unchanged.
//
// class_name/assigned_class is plain TEXT with no foreign key anywhere in
// schema.sql, duplicated across 8 columns in 8 tables (verified by grepping
// schema.sql for "class_name|assigned_class" — see CHANGELOG/handoff notes
// for this feature). This script is the single source of truth for that
// column list; if a future migration adds another class_name-shaped column,
// add it to TABLES below.
//
// Run by hand on the server, the same way resetAcademicData.ts is run —
// this app's existing pattern (per README/SESSION_COLLATION.md) is that an
// admin runs scripts like this themselves via SSH and confirms the printed
// summary. This is NOT folded into schema.sql: schema.sql is re-run
// unattended on every `db:migrate` (see migrate.ts — plain pool.query(sql),
// no per-statement review), which is fine for additive/idempotent DDL but
// wrong for a live rename of real student/class data that deserves a human
// actually looking at the before/after counts.
//
// Usage:
//   cd backend
//   npx tsx src/db/renameClassNaming.ts            # dry run — prints counts only
//   npx tsx src/db/renameClassNaming.ts --yes       # actually renames, inside one transaction
//
// Without --yes, prints exactly how many rows in each table match each old
// name and exits without touching anything — always run it once without
// --yes first, the same convention as resetAcademicData.ts.
//
// With --yes: opens one client, BEGIN, runs every UPDATE, re-counts to
// confirm zero old-name rows remain and the new-name totals match the
// pre-migration counts, then COMMITs. Any error, or any post-check
// mismatch, ROLLBACKs the whole thing instead of leaving a half-renamed
// database — a partial rename (e.g. students moved but class_locks not)
// would be worse than not running this at all, since teacher-facing scope
// checks in scope.ts compare class_name strings directly.

import { pool } from './pool.js';
import type { PoolClient } from 'pg';

const MAPPING: Record<string, string> = {
  JSS1: 'JSS 1',
  JSS2: 'JSS 2',
  JSS3: 'JSS 3',
  SS1: 'SS 1',
  SS2: 'SS 2',
  SS3: 'SS 3',
  'Grade 1': 'Primary 1',
  'Grade 2': 'Primary 2',
  'Grade 3': 'Primary 3',
  'Grade 4': 'Primary 4',
  'Grade 5': 'Primary 5',
  'Grade 6': 'Primary 6',
  'PRY 1': 'Primary 1',
  'PRY 2': 'Primary 2',
  'PRY 3': 'Primary 3',
  'PRY 4': 'Primary 4',
  'PRY 5': 'Primary 5',
  'PRY 6': 'Primary 6',
};

// [table, column] for every place a class-name-shaped string lives.
const TABLES: Array<[string, string]> = [
  ['classes', 'name'],
  ['users', 'assigned_class'],
  ['students', 'class_name'],
  ['class_locks', 'class_name'],
  ['materials', 'class_name'],
  ['questions', 'class_name'],
  ['assessments', 'class_name'],
  ['fee_items', 'class_name'],
  // Added alongside the topics feature (post-dates this script) — exactly
  // the "future migration adds another class_name-shaped column" case the
  // comment above warns about.
  ['topics', 'class_name'],
];

async function countAll(runner: { query: (sql: string, params?: unknown[]) => Promise<{ rows: any[] }> }) {
  // counts[table][oldName] = row count
  const counts: Record<string, Record<string, number>> = {};
  for (const [table, column] of TABLES) {
    counts[table] = {};
    for (const oldName of Object.keys(MAPPING)) {
      const { rows } = await runner.query(
        `SELECT COUNT(*)::int AS c FROM ${table} WHERE ${column} = $1`,
        [oldName],
      );
      counts[table][oldName] = rows[0].c;
    }
  }
  return counts;
}

function printCounts(label: string, counts: Record<string, Record<string, number>>) {
  console.log(`\n${label}`);
  for (const [table] of TABLES) {
    const rowCounts = counts[table];
    const total = Object.values(rowCounts).reduce((a, b) => a + b, 0);
    if (total === 0) continue;
    const parts = Object.entries(rowCounts)
      .filter(([, c]) => c > 0)
      .map(([oldName, c]) => `${oldName}→${MAPPING[oldName]}: ${c}`)
      .join(', ');
    console.log(`  ${table}: ${parts}`);
  }
}

async function runRename(client: PoolClient) {
  for (const [table, column] of TABLES) {
    for (const [oldName, newName] of Object.entries(MAPPING)) {
      await client.query(`UPDATE ${table} SET ${column} = $1 WHERE ${column} = $2`, [newName, oldName]);
    }
  }
}

async function main() {
  const yes = process.argv.includes('--yes');

  const before = await countAll(pool);
  printCounts('Rows matching OLD class names (before):', before);
  const totalBefore = Object.values(before)
    .flatMap(t => Object.values(t))
    .reduce((a, b) => a + b, 0);

  if (totalBefore === 0) {
    console.log('\nNo rows match any old class name — nothing to do (already renamed, or never seeded).');
    await pool.end();
    return;
  }

  if (!yes) {
    console.log('\nDry run only — pass --yes to actually rename, inside a single transaction.');
    await pool.end();
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Count inside the transaction and block concurrent writes while renaming.
    // A uniqueness collision aborts and rolls back; never delete class, lock,
    // or topic records just to force two existing records to merge.
    await client.query(`LOCK TABLE ${TABLES.map(([table]) => table).join(', ')} IN SHARE ROW EXCLUSIVE MODE`);
    const transactionBefore = await countAll(client);
    const targetsBefore: Record<string, Record<string, number>> = {};
    const targetNames = [...new Set(Object.values(MAPPING))];
    for (const [table, column] of TABLES) {
      targetsBefore[table] = {};
      for (const newName of targetNames) {
        const { rows } = await client.query(
          `SELECT COUNT(*)::int AS c FROM ${table} WHERE ${column} = $1`, [newName],
        );
        targetsBefore[table][newName] = rows[0].c;
      }
    }
    await runRename(client);

    const after = await countAll(client);
    const remainingOld = Object.values(after).flatMap(t => Object.values(t)).reduce((a, b) => a + b, 0);
    if (remainingOld !== 0) {
      printCounts('UNEXPECTED — old names still present after rename:', after);
      throw new Error(`${remainingOld} row(s) still have an old class name after the rename — rolling back.`);
    }

    console.log('\n✓ All old-name rows renamed successfully. Verifying totals before commit…');
    // Verify the combined Grade/PRY counts plus existing canonical rows.
    for (const [table, column] of TABLES) {
      for (const newName of targetNames) {
        const expected = targetsBefore[table][newName] + Object.entries(MAPPING)
          .filter(([, target]) => target === newName)
          .reduce((total, [oldName]) => total + transactionBefore[table][oldName], 0);
        const { rows } = await client.query(
          `SELECT COUNT(*)::int AS c FROM ${table} WHERE ${column} = $1`,
          [newName],
        );
        if (rows[0].c !== expected) {
          throw new Error(
            `${table}.${column}='${newName}' has ${rows[0].c} row(s), expected ${expected} — rolling back.`,
          );
        }
      }
    }

    await client.query('COMMIT');
    console.log('✓ Committed.');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('\n✗ Rolled back — no changes were kept.');
    throw e;
  } finally {
    client.release();
  }

  await pool.end();
}

main().catch(e => { console.error(e); process.exit(1); });

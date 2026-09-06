// Cleanup for stale `classes` rows left behind by the 2026-09 class-naming
// convention change (see renameClassNaming.ts) — 'JSS1'/'SS1'/'Grade N' rows
// that still exist in `classes` alongside their renamed equivalents
// ('JSS 1'/'SS 1'/'PRY N'), each showing 0 topics/students/anything while
// the renamed row has hundreds.
//
// How this happened (best explanation from reading the actual code, not
// server logs, which aren't available): renameClassNaming.ts's TABLES list
// has always included ['classes','name'] (confirmed via `git log --follow`
// on that file — it was there in the very first commit, not added later),
// so the rename script itself was never missing this table. The more
// likely explanation is that `--yes` was simply never run against
// production at all: seed.ts's *current* version only ever inserts the NEW
// names ('PRY 1'..'PRY 6', 'JSS 1'..'SS 3') via `ON CONFLICT DO NOTHING`,
// and every other table's real data (students, topics, materials, ...) was
// populated by scripts written *after* the naming decision, so it never
// used old names to begin with. The OLD `classes` rows are simply
// pre-decision leftovers that nothing has ever gone back and removed —
// `ON CONFLICT DO NOTHING` only ever *adds* the new rows, it never touches
// (renames or removes) anything already present.
//
// Confirmed live problem, not just database noise: GET /academic/classes
// does a plain unfiltered `SELECT * FROM classes` (see routes/academic.ts),
// and is called directly by ClassLockScreen, AttendanceScreen,
// WeeklyEffortsScreen, ScoreEntryScreen, AdminUsersScreen,
// CreateAssessmentScreen, and AddStudentScreen — seven real class-picker
// dropdowns in the mobile app that show both 'JSS1' and 'JSS 1' as
// separate, equally-clickable options today, with the old one silently
// leading to an empty class.
//
// NOT covered by this script: 'KG 1'/'KG 2' having 0 topics. There is no
// 'KG1'/'KG2' (no-space) row anywhere — seed.ts and renameClassNaming.ts's
// own MAPPING both only ever reference the spaced form — so this isn't a
// duplicate-naming issue at all, just a class with no curriculum content
// ingested yet. Out of scope here.
//
// class_name/assigned_class is plain TEXT with no foreign key anywhere in
// schema.sql (same fact renameClassNaming.ts's header relies on) — so a
// `classes` row is only "still relevant" through an exact string match
// elsewhere, never through a real foreign-key reference. That means the
// safety check below (zero references anywhere else) is a complete,
// sufficient check, not a best-effort one.
//
// Usage:
//   cd backend
//   npx tsx src/db/cleanupStaleClasses.ts            # dry run — prints findings only
//   npx tsx src/db/cleanupStaleClasses.ts --yes       # deletes confirmed-safe rows only

import { pool } from './pool.js';

const OLD_NAMES = [
  'JSS1', 'JSS2', 'JSS3', 'SS1', 'SS2', 'SS3',
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
];

// Every OTHER table besides `classes` itself that carries a class-name-
// shaped string — copied from renameClassNaming.ts's own TABLES list minus
// ['classes','name']. If that script's list grows, mirror the addition
// here too.
const REFERENCE_TABLES: Array<[string, string]> = [
  ['users', 'assigned_class'],
  ['students', 'class_name'],
  ['class_locks', 'class_name'],
  ['materials', 'class_name'],
  ['questions', 'class_name'],
  ['assessments', 'class_name'],
  ['fee_items', 'class_name'],
  ['topics', 'class_name'],
];

async function main() {
  const yes = process.argv.includes('--yes');

  const { rows: staleRows } = await pool.query(
    `SELECT id, school_code, name FROM classes WHERE name = ANY($1) ORDER BY school_code, name`,
    [OLD_NAMES],
  );

  if (staleRows.length === 0) {
    console.log('No stale pre-rename class rows found — nothing to do.');
    await pool.end();
    return;
  }

  console.log(`Found ${staleRows.length} candidate stale class row(s):\n`);

  const safeToDelete: typeof staleRows = [];
  const flaggedNotSafe: Array<{ row: (typeof staleRows)[number]; refs: string }> = [];

  for (const row of staleRows) {
    const refCounts: string[] = [];
    let totalRefs = 0;
    for (const [table, column] of REFERENCE_TABLES) {
      const { rows } = await pool.query(
        `SELECT COUNT(*)::int AS c FROM ${table} WHERE ${column} = $1`,
        [row.name],
      );
      const c = rows[0].c;
      if (c > 0) { refCounts.push(`${table}.${column}=${c}`); totalRefs += c; }
    }

    if (totalRefs === 0) {
      safeToDelete.push(row);
      console.log(`  [safe to delete] classes.id=${row.id} school=${row.school_code} name='${row.name}' — zero references anywhere else`);
    } else {
      flaggedNotSafe.push({ row, refs: refCounts.join(', ') });
      console.log(`  [NOT safe — still referenced] classes.id=${row.id} school=${row.school_code} name='${row.name}' — ${refCounts.join(', ')}`);
    }
  }

  console.log(`\n${safeToDelete.length} row(s) safe to delete, ${flaggedNotSafe.length} row(s) flagged (still referenced — investigate before touching these).`);

  if (!yes) {
    console.log('\nDry run only — pass --yes to actually delete the safe-to-delete rows above. Flagged rows are never deleted by this script, with or without --yes.');
    await pool.end();
    return;
  }

  if (safeToDelete.length === 0) {
    console.log('\nNothing safe to delete — exiting without changes.');
    await pool.end();
    return;
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    for (const row of safeToDelete) {
      // Re-check immediately before deleting, inside the transaction — a
      // guard against something writing a reference to this exact old name
      // in the window between the dry-run report above and this run.
      let stillZero = true;
      for (const [table, column] of REFERENCE_TABLES) {
        const { rows } = await client.query(`SELECT COUNT(*)::int AS c FROM ${table} WHERE ${column} = $1`, [row.name]);
        if (rows[0].c > 0) { stillZero = false; break; }
      }
      if (!stillZero) {
        throw new Error(`classes.id=${row.id} name='${row.name}' now has a reference that didn't exist moments ago — rolling back, nothing deleted.`);
      }
      await client.query('DELETE FROM classes WHERE id=$1', [row.id]);
    }
    await client.query('COMMIT');
    console.log(`\n✓ Deleted ${safeToDelete.length} stale class row(s). Committed.`);
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

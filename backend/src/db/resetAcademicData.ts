// Admin utility for clearing academic data at a term or session boundary.
// Run by hand on the server, the same way importFirstTerm.ts is run — this
// is deliberately a CLI script, not an API route or mobile button, because
// every mode here is destructive and irreversible, and this app's existing
// working pattern (per README/SESSION_COLLATION.md) is that an admin runs
// scripts like this themselves via SSH and confirms the printed summary.
//
// Usage:
//   cd backend
//   npx tsx src/db/resetAcademicData.ts --term <term_id> [--yes]
//   npx tsx src/db/resetAcademicData.ts --session <school_code> <academic_year> [--yes]
//   npx tsx src/db/resetAcademicData.ts --new-session <school_code> <old_academic_year> [--include-students] [--yes]
//
// Without --yes, it prints exactly what it WOULD delete (row counts) and
// exits without touching anything — always run it once without --yes first.
//
// ── Modes ────────────────────────────────────────────────────────────────
// --term <term_id>
//   Clears scores, attendance, and class_records for ONE term only (e.g. to
//   redo a botched import). Leaves the term row itself, students, and
//   subjects in place. Does not affect other terms in the same session —
//   safe to use mid-session without disturbing 1st/2nd Term data still
//   needed for the eventual session collation report.
//
// --session <school_code> <academic_year>
//   For "reset before next term" within the SAME session: clears scores,
//   attendance, and class_records for every term in that (school,
//   academic_year), but leaves the term rows, students, and subjects
//   intact. Use this if a whole session's worth of data needs redoing
//   from scratch but the roster/subjects are still correct.
//
// --new-session <school_code> <old_academic_year> [--include-students]
//   For the actual "empty database for next session" case: deletes every
//   term row for that school+year (cascading to their scores, attendance,
//   class_records, and any questions/assessments tied to those terms),
//   clearing the way for a fresh academic_year's 1st Term to be created via
//   the normal Admin > Terms screen (or a future import). Subjects are left
//   in place (they carry over between sessions). Students are ALSO left in
//   place by default, since promotion (moving a student to next class) is
//   an edit, not a delete — pass --include-students only if this really is
//   a full roster wipe (e.g. re-registration each session), which also
//   removes every login linked to those students.
//
// Every mode requires --yes to actually execute; without it, this only
// reports what it found.

import { query, pool } from './pool.js';

function parseArgs(argv: string[]) {
  const yes = argv.includes('--yes');
  const includeStudents = argv.includes('--include-students');
  const mode = argv[0];
  return { mode, rest: argv.slice(1).filter(a => !a.startsWith('--')), yes, includeStudents };
}

async function countForTermIds(termIds: number[]) {
  if (termIds.length === 0) return { scores: 0, attendance: 0, class_records: 0 };
  const [s, a, c] = await Promise.all([
    query('SELECT COUNT(*)::int c FROM scores WHERE term_id = ANY($1)', [termIds]),
    query('SELECT COUNT(*)::int c FROM attendance WHERE term_id = ANY($1)', [termIds]),
    query('SELECT COUNT(*)::int c FROM class_records WHERE term_id = ANY($1)', [termIds]),
  ]);
  return { scores: s.rows[0].c, attendance: a.rows[0].c, class_records: c.rows[0].c };
}

async function clearDataForTermIds(termIds: number[]) {
  if (termIds.length === 0) return;
  await query('DELETE FROM scores WHERE term_id = ANY($1)', [termIds]);
  await query('DELETE FROM attendance WHERE term_id = ANY($1)', [termIds]);
  await query('DELETE FROM class_records WHERE term_id = ANY($1)', [termIds]);
}

async function runTermMode(termIdStr: string, yes: boolean) {
  const termId = Number(termIdStr);
  if (!Number.isInteger(termId)) throw new Error(`--term needs a numeric term id, got "${termIdStr}"`);
  const { rows } = await query('SELECT id,name,academic_year,school_code FROM terms WHERE id=$1', [termId]);
  if (!rows[0]) throw new Error(`No term with id ${termId}`);
  const t = rows[0];
  const counts = await countForTermIds([termId]);
  console.log(`Term: ${t.school_code} — ${t.name} ${t.academic_year} (id ${termId})`);
  console.log(`Would delete: ${counts.scores} scores, ${counts.attendance} attendance rows, ${counts.class_records} class records.`);
  console.log('Term row, students, and subjects are NOT affected.');
  if (!yes) { console.log('\nDry run only — pass --yes to actually delete.'); return; }
  await clearDataForTermIds([termId]);
  console.log('\n✓ Cleared.');
}

async function runSessionMode(schoolCode: string, academicYear: string, yes: boolean) {
  const { rows } = await query(
    'SELECT id,name FROM terms WHERE school_code=$1 AND academic_year=$2', [schoolCode, academicYear],
  );
  const termIds = rows.map(r => r.id);
  const counts = await countForTermIds(termIds);
  console.log(`School: ${schoolCode}, Session: ${academicYear} — ${rows.length} term(s): ${rows.map(r => r.name).join(', ') || '(none found)'}`);
  console.log(`Would delete: ${counts.scores} scores, ${counts.attendance} attendance rows, ${counts.class_records} class records across all ${rows.length} term(s).`);
  console.log('Term rows, students, and subjects are NOT affected.');
  if (!yes) { console.log('\nDry run only — pass --yes to actually delete.'); return; }
  await clearDataForTermIds(termIds);
  console.log('\n✓ Cleared.');
}

async function runNewSessionMode(schoolCode: string, oldYear: string, includeStudents: boolean, yes: boolean) {
  const { rows: termRows } = await query(
    'SELECT id,name FROM terms WHERE school_code=$1 AND academic_year=$2', [schoolCode, oldYear],
  );
  const termIds = termRows.map(r => r.id);
  const counts = await countForTermIds(termIds);

  // Bug found in a live test run of this exact mode: scores/attendance/
  // class_records use ON DELETE CASCADE on term_id (schema.sql), so those
  // three genuinely do disappear when the term row is deleted below — but
  // materials, questions, assessments, and invoices all use
  // ON DELETE SET NULL instead. Deleting the term row does NOT delete
  // those four; it silently leaves them behind with term_id set to NULL,
  // contradicting what this function used to print ("cascading to ...
  // plus any questions/assessments tied to those terms") and leaving an
  // orphaned, still-`open` assessment sitting in the database indefinitely
  // after a reset that's supposed to clear the way for a fresh session.
  // Explicitly counted and deleted here instead of relied upon to cascade.
  const [materialsCount, questionsCount, assessmentsCount, invoicesCount] = await Promise.all([
    query('SELECT COUNT(*)::int c FROM materials WHERE term_id = ANY($1)', [termIds]),
    query('SELECT COUNT(*)::int c FROM questions WHERE term_id = ANY($1)', [termIds]),
    query('SELECT COUNT(*)::int c FROM assessments WHERE term_id = ANY($1)', [termIds]),
    query('SELECT COUNT(*)::int c FROM invoices WHERE term_id = ANY($1)', [termIds]),
  ]);

  console.log(`School: ${schoolCode}, retiring session: ${oldYear} — ${termRows.length} term row(s): ${termRows.map(r => r.name).join(', ') || '(none found)'}`);
  console.log(`Would delete: the ${termRows.length} term row(s) themselves, which cascade-delete ${counts.scores} scores, ${counts.attendance} attendance rows, and ${counts.class_records} class records.`);
  console.log(`Would ALSO explicitly delete (these do NOT cascade from the term row — schema.sql sets their term_id to NULL on delete instead, so they must be removed separately to actually retire the session): ${materialsCount.rows[0].c} material(s), ${questionsCount.rows[0].c} question(s), ${assessmentsCount.rows[0].c} assessment(s), ${invoicesCount.rows[0].c} invoice(s).`);
  console.log('Subjects are NOT affected (they carry over between sessions).');
  if (includeStudents) {
    const { rows: studentCount } = await query('SELECT COUNT(*)::int c FROM students WHERE school_code=$1', [schoolCode]);
    console.log(`--include-students passed: would ALSO permanently delete all ${studentCount[0].c} student(s) in ${schoolCode} (and any login accounts linked to them).`);
  } else {
    console.log('Students are NOT affected — pass --include-students if this is a full roster wipe, not just a term/year rollover.');
  }
  if (!yes) { console.log('\nDry run only — pass --yes to actually delete.'); return; }

  // Order matters: assessments reference questions via assessment_questions
  // (cascades from either side per schema.sql), so deleting questions and
  // assessments independently is safe in either order; both must happen
  // before the term rows only in the sense that they're scoped by term_id,
  // not because of any FK ordering requirement — CASCADE handles the
  // scores/attendance/class_records side regardless of order.
  await query('DELETE FROM materials WHERE term_id = ANY($1)', [termIds]);
  await query('DELETE FROM questions WHERE term_id = ANY($1)', [termIds]);
  await query('DELETE FROM assessments WHERE term_id = ANY($1)', [termIds]);
  await query('DELETE FROM invoices WHERE term_id = ANY($1)', [termIds]);
  await query('DELETE FROM terms WHERE id = ANY($1)', [termIds]); // cascades scores/attendance/class_records per schema.sql
  if (includeStudents) {
    await query('DELETE FROM students WHERE school_code=$1', [schoolCode]); // cascades scores/attendance/class_records/etc for any stragglers
  }
  console.log('\n✓ Cleared. Create the new session\'s 1st Term via Admin > Terms (or a fresh import script) to continue.');
}

async function main() {
  const { mode, rest, yes, includeStudents } = parseArgs(process.argv.slice(2));
  if (mode === '--term' && rest[0]) {
    await runTermMode(rest[0], yes);
  } else if (mode === '--session' && rest[0] && rest[1]) {
    await runSessionMode(rest[0], rest[1], yes);
  } else if (mode === '--new-session' && rest[0] && rest[1]) {
    await runNewSessionMode(rest[0], rest[1], includeStudents, yes);
  } else {
    console.log(`Usage:
  npx tsx src/db/resetAcademicData.ts --term <term_id> [--yes]
  npx tsx src/db/resetAcademicData.ts --session <school_code> <academic_year> [--yes]
  npx tsx src/db/resetAcademicData.ts --new-session <school_code> <old_academic_year> [--include-students] [--yes]

Always run once WITHOUT --yes first to see exactly what would be deleted.`);
    process.exitCode = 1;
  }
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });

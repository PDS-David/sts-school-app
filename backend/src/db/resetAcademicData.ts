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
//
// ── Progression-decision history (report_roster_progression_decisions) ────
// Progression decisions (promoted / retained / removed) are a permanent,
// append-only audit record. They reference students, schools and terms with
// ON DELETE RESTRICT, so:
//   --term and --session  never delete term or student rows, so they cannot
//                          touch progression history and are unaffected.
//   --new-session          deletes term rows. If ANY progression decision
//                          references those terms it is REFUSED, before
//                          anything is deleted (dry runs report it too).
//   --include-students     deletes student rows. If ANY progression decision
//                          belongs to those students it is REFUSED the same way.
// There is intentionally no flag to delete or bypass this history. The
// destructive part of --new-session runs in a single transaction and repeats
// the check inside it, so a decision recorded while the reset is running, or
// any other foreign key that blocks a delete, rolls the whole reset back
// instead of leaving it half-applied.

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { query, pool, withTransaction } from './pool.js';

const PROGRESSION_TABLE = 'report_roster_progression_decisions';

/** The reset would damage, or cannot safely get past, protected history. Nothing was changed. */
export class AcademicResetRefusal extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AcademicResetRefusal';
  }
}

type Db = { query(text: string, params?: unknown[]): Promise<{ rows: any[] }> };

export interface ProgressionBlockers {
  byTerm: { decisions: number; students: number };
  byStudent: { decisions: number; students: number };
}

/**
 * Returns what progression history stands in the way of deleting the given
 * terms (and, with includeStudents, the school's students), or null when
 * nothing does. A database that predates the progression table has no history
 * to protect.
 */
export async function findProgressionHistoryBlockers(
  db: Db, schoolCode: string, termIds: number[], includeStudents: boolean,
): Promise<ProgressionBlockers | null> {
  const { rows: present } = await db.query('SELECT to_regclass($1) IS NOT NULL AS present', [`public.${PROGRESSION_TABLE}`]);
  if (!present[0].present) return null;
  const none = { decisions: 0, students: 0 };
  const byTerm = termIds.length
    ? (await db.query(
        `SELECT count(*)::int AS decisions, count(DISTINCT student_id)::int AS students
           FROM public.${PROGRESSION_TABLE} WHERE term_id = ANY($1)`, [termIds])).rows[0]
    : none;
  const byStudent = includeStudents
    ? (await db.query(
        `SELECT count(*)::int AS decisions, count(DISTINCT d.student_id)::int AS students
           FROM public.${PROGRESSION_TABLE} d JOIN students s ON s.id = d.student_id
          WHERE s.school_code = $1`, [schoolCode])).rows[0]
    : none;
  return byTerm.decisions || byStudent.decisions ? { byTerm, byStudent } : null;
}

function progressionRefusalMessage(schoolCode: string, oldYear: string, b: ProgressionBlockers): string {
  const reasons: string[] = [];
  if (b.byTerm.decisions) {
    reasons.push(`${b.byTerm.decisions} progression decision(s) for ${b.byTerm.students} student(s) are recorded against the term(s) of ${schoolCode} ${oldYear}`);
  }
  if (b.byStudent.decisions) {
    reasons.push(`${b.byStudent.decisions} progression decision(s) belong to ${b.byStudent.students} student(s) of ${schoolCode} that --include-students would delete`);
  }
  return [
    `Refusing --new-session for ${schoolCode} ${oldYear}: ${reasons.join('; ')}.`,
    `Progression decisions are a permanent, append-only audit record (${PROGRESSION_TABLE}). Deleting the terms or students they reference is blocked by RESTRICT foreign keys, and this script has no option to delete or bypass that history.`,
    'NOTHING WAS CHANGED.',
    `Instead, use "--session ${schoolCode} ${oldYear}" to clear scores, attendance and class records while keeping the term rows` +
      (b.byStudent.decisions ? ', and do not pass --include-students (promotion edits a student, it does not require deleting one)' : '') +
      ', then create the new academic year\'s terms alongside the old ones.',
  ].join('\n');
}

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

export async function runTermMode(termIdStr: string, yes: boolean) {
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

export async function runSessionMode(schoolCode: string, academicYear: string, yes: boolean) {
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

export async function runNewSessionMode(schoolCode: string, oldYear: string, includeStudents: boolean, yes: boolean) {
  const { rows: termRows } = await query(
    'SELECT id,name FROM terms WHERE school_code=$1 AND academic_year=$2', [schoolCode, oldYear],
  );
  const termIds = termRows.map(r => r.id);

  // Refuse up front, before reporting or deleting anything, if progression
  // history references what this mode deletes (see the header comment).
  const blocked = await findProgressionHistoryBlockers(pool, schoolCode, termIds, includeStudents);
  if (blocked) throw new AcademicResetRefusal(progressionRefusalMessage(schoolCode, oldYear, blocked));

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
  // One transaction: if anything below is blocked (history recorded since the
  // check above, or any other protective foreign key) the whole reset rolls
  // back, rather than leaving materials/questions/assessments/invoices already
  // deleted while the term rows remain.
  try {
    await withTransaction(async (client) => {
      const again = await findProgressionHistoryBlockers(client, schoolCode, termIds, includeStudents);
      if (again) throw new AcademicResetRefusal(progressionRefusalMessage(schoolCode, oldYear, again));
      await client.query('DELETE FROM materials WHERE term_id = ANY($1)', [termIds]);
      await client.query('DELETE FROM questions WHERE term_id = ANY($1)', [termIds]);
      await client.query('DELETE FROM assessments WHERE term_id = ANY($1)', [termIds]);
      await client.query('DELETE FROM invoices WHERE term_id = ANY($1)', [termIds]);
      await client.query('DELETE FROM terms WHERE id = ANY($1)', [termIds]); // cascades scores/attendance/class_records per schema.sql
      if (includeStudents) {
        await client.query('DELETE FROM students WHERE school_code=$1', [schoolCode]); // cascades scores/attendance/class_records/etc for any stragglers
      }
    });
  } catch (e: any) {
    if (e?.code === '23503') {
      throw new AcademicResetRefusal(
        `Reset aborted and fully rolled back - NOTHING WAS CHANGED. A foreign key protects data this reset would have deleted ` +
        `(constraint "${e.constraint ?? 'unknown'}" on table "${e.table ?? 'unknown'}"${e.detail ? `: ${e.detail}` : ''}). ` +
        'This script has no option to delete or bypass protected history.',
      );
    }
    throw e;
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

// Only run when executed directly, so the modes above can be imported and tested.
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    if (e instanceof AcademicResetRefusal) console.error(`\nRESET REFUSED\n${e.message}`);
    else console.error(e);
    process.exit(1);
  });
}

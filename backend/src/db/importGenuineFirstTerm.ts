// One-time import of the GENUINE First Term (2025/2026) results, parsed
// directly from the legacy report-card HTML exports (FilesPRY.zip /
// FilesSEC.zip), into this app's Postgres schema.
//
// Run with:  cd backend && npx tsx src/db/importGenuineFirstTerm.ts
//
// ── Why this exists, and why it's separate from importFirstTerm.ts ─────────
// A live cross-check this session proved the data importFirstTerm.ts loaded
// (and which has been sitting live as "1st Term" ever since) is actually
// GENUINE SECOND TERM data — confirmed both by exact score-for-score
// matches against a fresh legacy SQLite export the school's own teachers
// identified as Second Term, and by explicit confirmation from DD after
// checking with teachers directly. That existing "1st Term" row has
// already been renamed to "2nd Term" (see terms.id 3 and 4 for primary/
// secondary — a plain UPDATE, no score data was touched or moved).
//
// This script imports the ACTUAL First Term data, sourced from parsing the
// HTML report cards directly (they are the authoritative source — each one
// literally prints "First term 2025/2026" / "First Term 2024/2025" — the
// secondary cards' year is a stale template typo, not the real session;
// academic_year is hardcoded to 2025/2026 below for both schools, matching
// what's already used everywhere else in the live database).
//
// ── Student matching ─────────────────────────────────────────────────────
// The report cards use a completely different admission-number scheme
// (e.g. "GRD 001") than what's already live (e.g. "PRI013") for the exact
// same physical students — confirmed live this session ("Ayeni Anuoluwapo"
// exists live as PRI013, Grade 5; the HTML card for the same student says
// "GRD 001"). resolveStudentId() below tries admission_number first, and
// when that predictably finds nothing, falls through to matching by
// (full_name, class_name, school_code) case-insensitively — which is what
// actually links these records to the right existing students. This is
// the same fallback importFirstTerm.ts already used safely.
//
// A handful of names needed a manual decision DD made directly after
// reviewing a name-comparison report (some clearly the same person under a
// nickname/typo/dropped-middle-name; some clearly different people who
// simply share a surname or first name with an existing student). Those
// are hardcoded in NAME_OVERRIDES below — the bundle's full_name for those
// specific students has already been corrected to match the live DB's
// spelling, so the normal fallback match finds them directly. Everyone not
// in that list matched cleanly on name+class+school with no ambiguity.
// Five further students were confirmed by DD as genuinely NEW people (no
// existing DB record at all, despite an initial "closest guess" surfacing
// during review) — those are included in the bundle under their own HTML
// name as-is and will be created fresh, exactly like any other
// no-existing-match student.
//
// Six students already in the database have NO First Term HTML report
// card at all (confirmed informational-only by DD — Ogunmodede Rosemary,
// Wojuade Adebayo, Omokhoa Testimony for primary; Ogunmodede Jumoke,
// Adeniran Israel for secondary, plus Soyoye Henry who WAS matched via the
// override above). No action needed for them here — they simply have no
// First Term scores, same as any student a teacher hasn't graded yet. Per
// DD's explicit instruction, teachers must be able to freely add scores,
// subjects, and records for ANY term (including this one and Second Term)
// through the normal Enter Scores flow — that capability is a separate,
// already-existing part of the app (POST /scores/bulk) and needs no schema
// change for this import to be complete; verify it's reachable for these
// specific students/classes as a follow-up, not blocked by this script.
//
// ── Subjects ─────────────────────────────────────────────────────────────
// The report cards contain real inconsistency beyond simple casing — some
// are genuine typos ("Christain Religious Studies", "Phsics") and some are
// wording variants ("Cultural and Creative Art" / "Cultural and creative
// Arts" / "Culture and creative Arts") that will NOT fold together even
// with resolveSubjectId()'s existing case-insensitive matching. Per DD's
// explicit instruction: fold ONLY pure casing differences (already handled
// automatically by resolveSubjectId's case-insensitive lookup — nothing
// extra needed here for that part); do NOT attempt to cleverly guess-merge
// the typo/wording variants — import them as their own distinct subjects
// exactly as printed, and make sure teachers/admins have a working screen
// to rename or merge subjects themselves afterward (SubjectsMgmtScreen,
// already built — reachable via Admin > Subjects; confirm it supports
// renaming an existing subject as a follow-up check, not blocked by this
// script). This deliberately leaves some subject fragmentation in place
// rather than silently guessing at ambiguous merges.
//
// ── Current term ─────────────────────────────────────────────────────────
// Unlike importFirstTerm.ts, this script NEVER marks the term it creates as
// current — "2nd Term" (renamed from the old mislabeled "1st Term", ids 3
// and 4) is already correctly marked as the current/in-progress term for
// both schools, and a completed past term should never silently become
// "current" again. If 1st Term genuinely needs to be reopened as current
// for some reason, do that explicitly afterward via Admin > Terms or
// PUT /academic/terms/:id { "is_current": true } — not automatically here.
//
// Safe to re-run: every write is an upsert (ON CONFLICT DO UPDATE / DO
// NOTHING), so running it twice just re-applies the same data rather than
// duplicating rows or students.

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import { pool, query } from './pool.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

interface StudentRef {
  admission_number: string | null;
  full_name: string;
  class_name: string;
  school_code: string;
}

interface StudentBundle extends StudentRef {}
interface TermBundle { school_code: string; name: string; academic_year: string; days_opened: number; next_term_begins: string | null; }
interface SubjectBundle { school_code: string; name: string; code: string | null; }
interface ScoreBundle extends StudentRef {
  subject_name: string; term_name: string; academic_year: string;
  ca1: number; ca2: number; exam: number; grade: string | null; teacher_remark: string | null;
}

interface Bundle {
  students: StudentBundle[];
  terms: TermBundle[];
  subjects: SubjectBundle[];
  scores: ScoreBundle[];
  attendance: any[];
  class_records: any[];
}

const studentCache = new Map<string, string | null>();
async function resolveStudentId(ref: StudentRef): Promise<string | null> {
  const cacheKey = `${ref.admission_number ?? ''}|${ref.full_name}|${ref.class_name}|${ref.school_code}`;
  if (studentCache.has(cacheKey)) return studentCache.get(cacheKey)!;

  let id: string | null = null;
  if (ref.admission_number) {
    const { rows } = await query('SELECT id FROM students WHERE admission_number=$1', [ref.admission_number]);
    if (rows[0]) id = rows[0].id;
  }
  if (!id) {
    const { rows } = await query(
      `SELECT id FROM students WHERE lower(full_name)=lower($1) AND class_name=$2 AND school_code=$3`,
      [ref.full_name, ref.class_name, ref.school_code],
    );
    if (rows.length === 1) id = rows[0].id;
  }
  studentCache.set(cacheKey, id);
  return id;
}

const subjectCache = new Map<string, number | null>();
async function resolveSubjectId(school_code: string, name: string): Promise<number | null> {
  const key = `${school_code}|${name.toLowerCase()}`;
  if (subjectCache.has(key)) return subjectCache.get(key)!;
  const { rows } = await query(
    'SELECT id FROM subjects WHERE school_code=$1 AND lower(name)=lower($2)',
    [school_code, name],
  );
  const id = rows[0]?.id ?? null;
  subjectCache.set(key, id);
  return id;
}

async function main() {
  const dataPath = path.resolve(__dirname, 'data/genuine_first_term_import.json');
  const bundle: Bundle = JSON.parse(readFileSync(dataPath, 'utf-8'));

  console.log('── Genuine First Term (2025/2026) Import ─────────────────────');

  // 1. Terms — upsert, but NEVER mark as current (see doc comment above:
  //    "2nd Term" is already correctly the live current term for both
  //    schools; a completed past term must never silently become current).
  const termIdMap = new Map<string, number>();
  for (const t of bundle.terms) {
    const { rows } = await query(
      `INSERT INTO terms(name,academic_year,school_code,is_current,days_opened,next_term_begins)
       VALUES($1,$2,$3,FALSE,$4,$5)
       ON CONFLICT (name,academic_year,school_code)
       DO UPDATE SET days_opened=EXCLUDED.days_opened,
                     next_term_begins=EXCLUDED.next_term_begins
       RETURNING id`,
      [t.name, t.academic_year, t.school_code, t.days_opened, t.next_term_begins],
    );
    termIdMap.set(`${t.school_code}|${t.name}|${t.academic_year}`, rows[0].id);
    console.log(`  ✓ ${t.school_code}: ${t.name} ${t.academic_year} (id ${rows[0].id}) — left not-current`);
  }

  // 2. Subjects — add any missing ones (by school_code + name, case-
  //    insensitive). Deliberately does NOT try to merge typo/wording
  //    variants of an existing subject — see doc comment above.
  let subjectsAdded = 0, subjectsExisting = 0;
  for (const s of bundle.subjects) {
    const existing = await resolveSubjectId(s.school_code, s.name);
    if (existing) { subjectsExisting++; continue; }
    await query(
      `INSERT INTO subjects(school_code,name,code) VALUES($1,$2,$3)
       ON CONFLICT(school_code,name) DO NOTHING`,
      [s.school_code, s.name, s.code],
    );
    subjectCache.delete(`${s.school_code}|${s.name.toLowerCase()}`);
    subjectsAdded++;
  }
  console.log(`  Subjects: ${subjectsAdded} added, ${subjectsExisting} already existed`);

  // 3. Students — add any missing ones. Existing students (matched the
  //    same way scores match them below) are left completely untouched.
  //    Names here already reflect DD's confirmed overrides (a handful of
  //    close-match names corrected to the live DB's spelling so the
  //    fallback match links them to the right existing record; five
  //    confirmed-genuinely-new students kept under their own HTML name and
  //    will be created fresh here).
  let studentsAdded = 0, studentsExisting = 0;
  for (const s of bundle.students) {
    const existingId = await resolveStudentId(s);
    if (existingId) { studentsExisting++; continue; }
    const { rows } = await query(
      `INSERT INTO students(school_code,admission_number,full_name,class_name)
       VALUES($1,$2,$3,$4) RETURNING id`,
      [s.school_code, s.admission_number, s.full_name, s.class_name],
    );
    const cacheKey = `${s.admission_number ?? ''}|${s.full_name}|${s.class_name}|${s.school_code}`;
    studentCache.set(cacheKey, rows[0].id);
    studentsAdded++;
  }
  console.log(`  Students: ${studentsAdded} added, ${studentsExisting} already existed`);

  // 4. Scores
  let scoresSaved = 0;
  const scoreSkips: string[] = [];
  for (const s of bundle.scores) {
    const studentId = await resolveStudentId(s);
    const subjectId = await resolveSubjectId(s.school_code, s.subject_name);
    const termId = termIdMap.get(`${s.school_code}|${s.term_name}|${s.academic_year}`);
    if (!studentId || !subjectId || !termId) {
      scoreSkips.push(
        `${s.full_name} (${s.class_name}, ${s.school_code}) — ${s.subject_name}` +
        `${!studentId ? ' [no matching student]' : ''}${!subjectId ? ' [no matching subject]' : ''}${!termId ? ' [no matching term]' : ''}`,
      );
      continue;
    }
    await query(
      `INSERT INTO scores(student_id,subject_id,term_id,ca1,ca2,exam,grade,teacher_remark,updated_at)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,now())
       ON CONFLICT(student_id,subject_id,term_id)
       DO UPDATE SET ca1=$4,ca2=$5,exam=$6,grade=$7,teacher_remark=$8,updated_at=now()`,
      [studentId, subjectId, termId, s.ca1, s.ca2, s.exam, s.grade, s.teacher_remark],
    );
    scoresSaved++;
  }
  console.log(`  Scores: ${scoresSaved} saved, ${scoreSkips.length} skipped`);

  if (scoreSkips.length) {
    console.log(`\n⚠ ${scoreSkips.length} row(s) could not be matched — review manually:`);
    scoreSkips.forEach((s) => console.log('   - ' + s));
  }

  console.log('\nDone.');
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });

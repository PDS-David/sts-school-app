// One-time import of First Term (2025/2026) results, bundled from a legacy
// SQLite export (the old Flask/PythonAnywhere system), into this app's
// Postgres schema.
//
// Run with:  cd backend && npx tsx src/db/importFirstTerm.ts
//
// ── Why this replaces the old `importSecondTerm.ts` ─────────────────────────
// A previous pass built an import script and bundle for this same legacy
// data but labeled it "2nd Term". That label was wrong: the legacy DB's own
// `term` table called it "Second Term", but the report-card exports that
// came out of that same legacy system (FilesSEC.zip / FilesPRY.zip) say
// "First Term" on every single card — the primary-school cards even spell
// out "First term 2025/2026" in full. The legacy DB's term label was the
// typo, not the report cards. This script and its data bundle
// (`data/first_term_import.json`) are corrected to "1st Term". The academic
// year, 2025/2026, was already correct in the legacy DB and is unaffected —
// a handful of secondary report cards show "2024/2025" instead, which is a
// stale template typo in that export, not the real session, and is ignored.
// One extra empty/duplicate term row in the legacy DB (no scores, attendance,
// or class records ever attached to it) was dropped when the bundle was
// rebuilt — it was never used for anything.
//
// ── What it does, in order ───────────────────────────────────────────────
//   1. Upserts a "1st Term 2025/2026" row for each school. Unlike the old
//      script, this does NOT force-mark it as the current term — see the
//      "current term" note below.
//   2. Upserts any subjects from the bundle that don't already exist. A
//      handful of legacy subjects were duplicated under different casing
//      (e.g. "Basic science" vs "BASIC SCIENCE") with genuinely different
//      students' scores under each spelling (verified no student appears
//      under both). The bundle already folds each such pair into one
//      canonical subject, so this step is a plain upsert.
//   3. Upserts STUDENTS from the bundle — matched by admission_number, or by
//      exact (full_name + class_name + school_code) for the ~18 legacy
//      records with no admission number recorded. Existing students are
//      left untouched; only students not already in the database are
//      created. This is what lets this import run against an otherwise
//      empty roster with zero manual student entry.
//   4. Upserts scores, attendance, and class-teacher/admin remarks for that
//      term, matched to the students resolved in step 3.
//   5. Prints a summary, including anything it could NOT match, so it can be
//      reviewed and fixed by hand rather than silently dropped.
//
// ── Current term ──────────────────────────────────────────────────────────
// This script leaves `is_current` alone unless no term is currently marked
// current for that school (a brand-new database) — in which case it marks
// 1st Term current so there's always something. If a term already exists
// and is current (e.g. an admin already opened 2nd or 3rd Term), this
// import will NOT demote it — bulk-loading historical 1st Term data should
// never silently yank the picker back to a term teachers have moved past.
// If you genuinely need 1st Term to be the current/open term after running
// this (e.g. you're running it fresh, before opening 2nd Term), mark it
// current explicitly via the Admin > Terms screen, or:
//   PUT /academic/terms/:id   { "is_current": true }
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
interface AttendanceBundle extends StudentRef {
  term_name: string; academic_year: string; days_present: number;
}
interface ClassRecordBundle extends StudentRef {
  term_name: string; academic_year: string; class_teacher_remark: string | null; admin_remark: string | null;
}

interface Bundle {
  students: StudentBundle[];
  terms: TermBundle[];
  subjects: SubjectBundle[];
  scores: ScoreBundle[];
  attendance: AttendanceBundle[];
  class_records: ClassRecordBundle[];
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
  const dataPath = path.resolve(__dirname, 'data/first_term_import.json');
  const bundle: Bundle = JSON.parse(readFileSync(dataPath, 'utf-8'));

  console.log('── First Term (2025/2026) Import ───────────────────────────');

  // 1. Terms — upsert. Only mark current if the school has no current term
  //    at all yet; never demote a term an admin has already moved on to.
  //
  //    Bug found in a live test run of this exact script against a fresh
  //    install (migrate → seed → import, the sequence this script exists
  //    for): seed.ts always creates a placeholder "1st Term 2024/2025" and
  //    marks it current. That placeholder has zero scores/attendance/
  //    class-records — nobody has actually used it — but `is_current=TRUE`
  //    still made this script treat "no current term yet" as false, so the
  //    real "1st Term 2025/2026" this script just populated with 1,639
  //    scores was left NOT current, and the app would show the empty
  //    placeholder term by default right after the exact operation meant to
  //    populate real data. A genuine in-progress term (2nd/3rd Term an
  //    admin has already opened) always has real data attached by the time
  //    this script would run against it, so checking for attached data
  //    (rather than just the is_current flag) distinguishes "nothing has
  //    happened here yet" from "an admin is actively partway through a
  //    later term" without needing a manual Admin > Terms follow-up step
  //    for the common fresh-install case.
  const termIdMap = new Map<string, number>();
  for (const t of bundle.terms) {
    const { rows: currentRows } = await query(
      `SELECT t.id,
         (SELECT count(*) FROM scores sc JOIN students st ON st.id=sc.student_id WHERE sc.term_id=t.id) +
         (SELECT count(*) FROM attendance a JOIN students st2 ON st2.id=a.student_id WHERE a.term_id=t.id) +
         (SELECT count(*) FROM class_records cr JOIN students st3 ON st3.id=cr.student_id WHERE cr.term_id=t.id)
         AS data_count
       FROM terms t WHERE t.school_code=$1 AND t.is_current=TRUE`,
      [t.school_code],
    );
    const shouldBeCurrent = currentRows.length === 0 || Number(currentRows[0].data_count) === 0;

    // Must demote the old placeholder BEFORE inserting the new current
    // term, not after — there's a unique index enforcing only one
    // is_current=TRUE row per school_code (idx_one_current_term), so
    // inserting a second one while the empty placeholder is still current
    // violates it immediately. (Found by actually running this against a
    // real database — the first version of this fix had the demotion
    // happening after the insert and failed with exactly that constraint
    // violation.)
    if (shouldBeCurrent && currentRows.length > 0) {
      await query('UPDATE terms SET is_current=FALSE WHERE id=$1', [currentRows[0].id]);
    }

    const { rows } = await query(
      `INSERT INTO terms(name,academic_year,school_code,is_current,days_opened,next_term_begins)
       VALUES($1,$2,$3,$4,$5,$6)
       ON CONFLICT (name,academic_year,school_code)
       DO UPDATE SET days_opened=EXCLUDED.days_opened,
                     next_term_begins=EXCLUDED.next_term_begins
       RETURNING id`,
      [t.name, t.academic_year, t.school_code, shouldBeCurrent, t.days_opened, t.next_term_begins],
    );
    termIdMap.set(`${t.school_code}|${t.name}|${t.academic_year}`, rows[0].id);
    let reason: string;
    if (currentRows.length === 0) reason = 'marked current — no current term existed';
    else if (shouldBeCurrent) reason = 'marked current — previous current term was an empty placeholder with no data';
    else reason = 'left is_current unchanged — an in-progress term with real data already exists';
    console.log(`  ✓ ${t.school_code}: ${t.name} ${t.academic_year} (id ${rows[0].id}) — ${reason}`);
  }

  // 2. Subjects — add any missing ones (by school_code + name).
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

  // 3. Students — add any missing ones. Existing students (matched the same
  //    way scores/attendance/class-records match them below) are left
  //    completely untouched, so re-running this never overwrites anything
  //    an admin or teacher has since edited by hand (class, name, etc).
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

  // 5. Attendance
  let attSaved = 0;
  const attSkips: string[] = [];
  for (const a of bundle.attendance) {
    const studentId = await resolveStudentId(a);
    const termId = termIdMap.get(`${a.school_code}|${a.term_name}|${a.academic_year}`);
    if (!studentId || !termId) {
      attSkips.push(`${a.full_name} (${a.class_name}, ${a.school_code})`);
      continue;
    }
    await query(
      `INSERT INTO attendance(student_id,term_id,days_present) VALUES($1,$2,$3)
       ON CONFLICT(student_id,term_id) DO UPDATE SET days_present=$3`,
      [studentId, termId, a.days_present],
    );
    attSaved++;
  }
  console.log(`  Attendance: ${attSaved} saved, ${attSkips.length} skipped`);

  // 6. Class-record remarks
  let crSaved = 0;
  const crSkips: string[] = [];
  for (const c of bundle.class_records) {
    const studentId = await resolveStudentId(c);
    const termId = termIdMap.get(`${c.school_code}|${c.term_name}|${c.academic_year}`);
    if (!studentId || !termId) {
      crSkips.push(`${c.full_name} (${c.class_name}, ${c.school_code})`);
      continue;
    }
    await query(
      `INSERT INTO class_records(student_id,term_id,class_teacher_remark,admin_remark,updated_at)
       VALUES($1,$2,$3,$4,now())
       ON CONFLICT(student_id,term_id) DO UPDATE SET class_teacher_remark=$3,admin_remark=$4,updated_at=now()`,
      [studentId, termId, c.class_teacher_remark, c.admin_remark],
    );
    crSaved++;
  }
  console.log(`  Class records: ${crSaved} saved, ${crSkips.length} skipped`);

  const allSkips = [...new Set([...scoreSkips, ...attSkips, ...crSkips])];
  if (allSkips.length) {
    console.log(`\n⚠ ${allSkips.length} row(s) could not be matched to an existing student/subject/term — review manually:`);
    allSkips.forEach((s) => console.log('   - ' + s));
  }

  console.log('\nDone.');
  await pool.end();
}

main().catch((e) => { console.error(e); process.exit(1); });

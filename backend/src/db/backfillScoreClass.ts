// ── DATA-03b: one-off backfill of scores.class_name from promotion history ─────
// DATA-03 stamps scores.class_name when a score is saved. Rows written before
// that have NULL, so their reports still follow the student's live class. This
// script fills those NULLs from audit_log (promote_class / demote_class rows),
// using the rules in backfillScoreClassLogic.ts. First Term 2025/2026 rows are
// stamped from the class printed on the report cards (backend/src/db/data/
// genuine_first_term_import.json) in preference to the reconstruction. It only ever sets class_name
// on rows where it is NULL; it never overwrites a stamp and never touches
// students, audit_log or any other column (updated_at included).
//
// A row is stamped only when the answer is unambiguous. Everything else stays
// NULL and is listed with a reason (see the evidence note for the rules).
//
// USAGE (run from backend/, DATABASE_URL must point at the intended database):
//   1) dry run (default, read-only):
//        npx tsx src/db/backfillScoreClass.ts [--report skipped.json]
//   2) write — needs BOTH flags, the host must equal DATABASE_URL's host:
//        npx tsx src/db/backfillScoreClass.ts --apply --confirm-host <host>
// Back up the database first. The write is one transaction.

import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { pool, withTransaction } from './pool.js';
import { resolveClassName } from './classNaming.js';
import {
  parsePromotionDetail, planBackfill,
  type ClassEvent, type ScoreRow, type StudentRow,
} from './backfillScoreClassLogic.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const argv = process.argv.slice(2);
const flag = (n: string) => argv.includes(`--${n}`);
const arg = (n: string) => { const i = argv.indexOf(`--${n}`); return i >= 0 ? argv[i + 1] : undefined; };

// Term dates are plain DATEs; the schools are in Nigeria (UTC+1, no DST), so a
// term day is read in Africa/Lagos time.
const TZ = 'Africa/Lagos';

async function main() {
  const apply = flag('apply');
  let host = '';
  try { host = new URL(process.env.DATABASE_URL ?? '').host; } catch { /* handled below */ }
  if (!host) { console.error('DATABASE_URL is missing or not a valid URL.'); process.exit(2); }
  if (apply && arg('confirm-host') !== host) {
    console.error(`Refusing to write: --confirm-host must equal the database host (${host}).`);
    process.exit(2);
  }
  console.log(`Mode: ${apply ? 'APPLY (writes)' : 'DRY RUN (no writes)'}   Database host: ${host}`);

  // First Term report cards: the class printed on each card was the student's class
  // that term. importGenuineFirstTerm.ts was built from those cards, so its data file
  // carries it. Students are matched by school + full name (case-insensitive) and only
  // when exactly one student in that school has that name; admission numbers are NOT
  // used because the cards use a different numbering scheme (see that importer).
  const bundle = JSON.parse(readFileSync(path.resolve(__dirname, 'data/genuine_first_term_import.json'), 'utf-8')) as {
    terms: { school_code: string; name: string; academic_year: string }[];
    students: { full_name: string; class_name: string; school_code: string }[];
  };
  const cardTerms = new Set(bundle.terms.map(t => `${t.school_code}|${t.name}|${t.academic_year}`));

  const { rows: scoreRows } = await pool.query(
    `SELECT sc.id, sc.student_id, sc.updated_at, t.name AS term_name, t.academic_year, t.school_code,
            (t.start_date::timestamp AT TIME ZONE $1)         AS term_start,
            ((t.end_date + 1)::timestamp AT TIME ZONE $1)     AS term_end_exclusive
       FROM scores sc
       JOIN terms t ON t.id = sc.term_id
      WHERE sc.class_name IS NULL`,
    [TZ],
  );
  const scores: ScoreRow[] = scoreRows.map((r: any) => ({
    scoreId: r.id, studentId: r.student_id, updatedAt: r.updated_at,
    termStart: r.term_start, termEndExclusive: r.term_end_exclusive,
    isReportCardTerm: cardTerms.has(`${r.school_code}|${r.term_name}|${r.academic_year}`),
  }));

  const studentIds = [...new Set(scores.map(s => s.studentId))];
  const { rows: stRows } = await pool.query(
    'SELECT id, class_name FROM students WHERE id = ANY($1::uuid[])', [studentIds],
  );
  const students: StudentRow[] = stRows.map((r: any) => ({ studentId: r.id, currentClass: r.class_name }));

  const { rows: classRows } = await pool.query('SELECT school_code, name FROM classes');
  const classesBySchool = new Map<string, Set<string>>();
  for (const r of classRows as any[]) {
    const set = classesBySchool.get(r.school_code) ?? new Set<string>();
    set.add(r.name);
    classesBySchool.set(r.school_code, set);
  }
  const { rows: allStudents } = await pool.query('SELECT id, school_code, lower(btrim(full_name)) AS k FROM students');
  const idsByKey = new Map<string, string[]>();
  for (const r of allStudents as any[]) {
    const key = `${r.school_code}|${r.k}`;
    idsByKey.set(key, [...(idsByKey.get(key) ?? []), r.id]);
  }
  const reportCardClassByStudent = new Map<string, string>();
  let cardNoMatch = 0, cardAmbiguous = 0, cardClassUnresolved = 0;
  for (const c of bundle.students) {
    const ids = idsByKey.get(`${c.school_code}|${c.full_name.trim().toLowerCase()}`) ?? [];
    if (ids.length === 0) { cardNoMatch++; continue; }
    if (ids.length > 1) { cardAmbiguous++; continue; }
    const cls = resolveClassName(c.class_name, classesBySchool.get(c.school_code) ?? new Set());
    if (!cls) { cardClassUnresolved++; continue; }
    reportCardClassByStudent.set(ids[0], cls);
  }
  console.log(`Report-card students: ${bundle.students.length}; usable: ${reportCardClassByStudent.size}; ` +
    `no matching student: ${cardNoMatch}; ambiguous name: ${cardAmbiguous}; class not in classes table: ${cardClassUnresolved}`);

  const { rows: evRows } = await pool.query(
    `SELECT entity_id, detail, created_at FROM audit_log
      WHERE entity = 'student' AND action IN ('promote_class','demote_class')
        AND entity_id = ANY($1::text[])
      ORDER BY created_at, id`,
    [studentIds],
  );
  const events: ClassEvent[] = [];
  const unparsed = new Set<string>();
  for (const r of evRows as any[]) {
    const p = parsePromotionDetail(r.detail);
    if (!p || !r.created_at) { unparsed.add(r.entity_id); continue; }
    events.push({ studentId: r.entity_id, at: r.created_at, from: p.from, to: p.to });
  }

  const { stamps, skipped } = planBackfill({ scores, students, events, studentsWithUnparsedEvents: unparsed, reportCardClassByStudent });

  const count = <T,>(xs: T[], key: (x: T) => string) => {
    const m: Record<string, number> = {};
    for (const x of xs) m[key(x)] = (m[key(x)] ?? 0) + 1;
    return m;
  };
  console.log(`Unstamped score rows: ${scores.length}`);
  console.log(`Would stamp: ${stamps.length}`, count(stamps, s => s.basis));
  console.log(`Would leave NULL: ${skipped.length}`, count(skipped, s => s.reason));
  const reportPath = arg('report');
  if (reportPath) {
    writeFileSync(reportPath, JSON.stringify({ skipped }, null, 2));
    console.log(`Skipped rows written to ${reportPath} (contains student ids — keep out of Git).`);
  }

  if (!apply) { console.log('Dry run only. Re-run with --apply --confirm-host <host> to write.'); return; }
  if (stamps.length === 0) { console.log('Nothing to write.'); return; }

  const written = await withTransaction(async client => {
    const res = await client.query(
      `UPDATE scores s SET class_name = v.class_name
         FROM unnest($1::int[], $2::text[]) AS v(id, class_name)
        WHERE s.id = v.id AND s.class_name IS NULL`,
      [stamps.map(s => s.scoreId), stamps.map(s => s.className)],
    );
    return res.rowCount ?? 0;
  });
  console.log(`Stamped ${written} row(s).`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main()
    .then(() => pool.end())
    .catch(err => { console.error(err); pool.end().finally(() => process.exit(1)); });
}

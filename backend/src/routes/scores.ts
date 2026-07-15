import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { requireAuth, requirePerm } from '../middleware/auth.js';
import { getGrade } from '../utils/grades.js';
import { audit } from '../utils/audit.js';
import { termRank } from '../utils/terms.js';
import { checkTeacherStudentScope } from '../utils/scope.js';
import { sendPushToUser } from '../utils/push.js';

const router = Router();
router.use(requireAuth);

// Shared by POST /scores and POST /scores/bulk — see Pass 10 fix note below
// on why /bulk needs this too, not just type/shape validation.
const scoreEntrySchema = z.object({
  student_id:     z.string().uuid(),
  subject_id:     z.number().int(),
  term_id:        z.number().int(),
  ca1:            z.number().min(0),
  ca2:            z.number().min(0),
  exam:           z.number().min(0),
  teacher_remark: z.string().optional(),
});

// ── GET /scores?term_id=&class_name=&subject_id=&school_code= ─────────────────
router.get('/', requirePerm('grades.read'), async (req, res) => {
  const { term_id, class_name, subject_id, student_id, school_code } = req.query as Record<string, string>;
  const user = req.user!;

  let sql = `SELECT sc.id, sc.ca1, sc.ca2, sc.exam, sc.total, sc.grade, sc.teacher_remark,
                    s.id AS student_id, s.full_name, s.class_name, s.admission_number,
                    sub.id AS subject_id, sub.name AS subject_name,
                    t.id AS term_id, t.name AS term_name
             FROM scores sc
             JOIN students s   ON s.id = sc.student_id
             JOIN subjects sub ON sub.id = sc.subject_id
             JOIN terms t      ON t.id  = sc.term_id
             WHERE 1=1`;
  const params: unknown[] = [];

  if (term_id)    { params.push(term_id);    sql += ` AND sc.term_id=$${params.length}`; }
  if (class_name) { params.push(class_name); sql += ` AND s.class_name=$${params.length}`; }
  if (subject_id) { params.push(subject_id); sql += ` AND sc.subject_id=$${params.length}`; }
  if (student_id) { params.push(student_id); sql += ` AND sc.student_id=$${params.length}`; }
  // Teachers see only their school
  if (user.role === 'teacher') {
    params.push(user.school_code); sql += ` AND s.school_code=$${params.length}`;
    if (user.assigned_class) {
      params.push(user.assigned_class); sql += ` AND s.class_name=$${params.length}`;
    } else if (user.assigned_subject_id) {
      // Bug found by live-testing this route directly with a real
      // subject-only teacher account: the previous version only blocked a
      // subject-only teacher when NO class_name was supplied at all — but
      // passing ANY class_name (including one this teacher has no
      // relationship to whatsoever) sailed straight through with no
      // subject restriction applied anywhere, returning every subject's
      // scores for that entire class. Confirmed: a Mathematics-only
      // teacher account pulled all 210 score rows across 15 different
      // subjects for a class ("JSS2") they don't teach at all, just by
      // adding ?class_name=JSS2 to the request.
      //
      // The actual rule this route needs (matching checkTeacherContentScope
      // elsewhere in this codebase): a subject-only teacher may see any
      // class in their own school, but ONLY for their own subject. Forcing
      // sc.subject_id to their own assigned_subject_id here — regardless of
      // whether the caller also passed a (possibly different, possibly
      // forged) subject_id — means a mismatched subject_id param now
      // returns zero rows instead of leaking every subject's data.
      params.push(user.assigned_subject_id); sql += ` AND sc.subject_id=$${params.length}`;
    } else {
      // Neither an assigned class nor an assigned subject — nothing in
      // this school is legitimately scoped to this teacher at all.
      return res.json({ scores: [] });
    }
  } else if (user.role === 'admin' && school_code) {
    // Found in a hardening pass: filtering by class_name alone (e.g. the
    // admin Class Summary/ranking screen) had no school scoping at all for
    // admin, unlike the teacher branch above. Since class names aren't
    // unique across schools ("JSS1" can exist in more than one school), an
    // admin viewing one school's class ranking would silently pick up scores
    // from every other school's same-named class too. Admin has no
    // school_code of their own (by design — they oversee every school), so
    // this can only be enforced when the caller passes one explicitly; the
    // admin UI (ClassSummaryScreen) now always does.
    params.push(school_code); sql += ` AND s.school_code=$${params.length}`;
  }

  sql += ' ORDER BY s.class_name, s.full_name, sub.name';
  const { rows } = await query(sql, params);
  return res.json({ scores: rows });
});

// ── POST /scores  (upsert) ────────────────────────────────────────────────────
router.post('/', requirePerm('grades.write'), async (req, res) => {
  const parsed = scoreEntrySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const d = parsed.data;

  const scopeViolation = await checkTeacherStudentScope(req.user!, d.student_id, d.term_id);
  if (scopeViolation) return res.status(scopeViolation.status).json({ error: scopeViolation.error });

  // Fetch school config for max validation
  const { rows: schRows } = await query(
    `SELECT sc.ca1_max, sc.ca2_max, sc.exam_max
     FROM schools sc JOIN students st ON st.school_code=sc.code
     WHERE st.id=$1`, [d.student_id],
  );
  const cfg = schRows[0] ?? { ca1_max: 20, ca2_max: 20, exam_max: 60 };
  if (d.ca1 > cfg.ca1_max || d.ca2 > cfg.ca2_max || d.exam > cfg.exam_max) {
    return res.status(400).json({
      error: `Score exceeds maximum (CA1≤${cfg.ca1_max}, CA2≤${cfg.ca2_max}, Exam≤${cfg.exam_max})`,
    });
  }

  const grade = getGrade(d.ca1 + d.ca2 + d.exam);

  const { rows } = await query(
    `INSERT INTO scores(student_id,subject_id,term_id,ca1,ca2,exam,grade,teacher_remark,entered_by,updated_at)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,now())
     ON CONFLICT(student_id,subject_id,term_id)
     DO UPDATE SET ca1=$4,ca2=$5,exam=$6,grade=$7,teacher_remark=$8,entered_by=$9,updated_at=now()
     RETURNING *`,
    [d.student_id, d.subject_id, d.term_id, d.ca1, d.ca2, d.exam,
     grade, d.teacher_remark ?? null, req.user!.id],
  );
  await audit(req.user!, 'save_score', 'score', String(rows[0].id));
  return res.json({ score: rows[0] });
});

// ── POST /scores/bulk  (batch entry for a whole class) ────────────────────────
router.post('/bulk', requirePerm('grades.write'), async (req, res) => {
  // Found live in Pass 10: this is the endpoint ScoreEntryScreen.tsx (the
  // only mobile screen that writes scores) actually calls — but unlike
  // POST /scores above, it never ran the shape/type schema, and never
  // checked ca1/ca2/exam against the school's ca1_max/ca2_max/exam_max at
  // all. Live-verified before this fix: a same-school teacher could submit
  // e.g. ca1=50 for a school where ca1_max=15 and it saved silently
  // (grade/total computed off the inflated number); a large enough value
  // (e.g. ca1=999) instead crashed with a raw Postgres numeric-field-
  // overflow surfaced as a generic 500, since the generated `total` column
  // is NUMERIC(5,2). Both are now caught with the same 400 the single-score
  // route already gives, before anything is written.
  const bodySchema = z.object({ scores: z.array(scoreEntrySchema).min(1) });
  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { scores } = parsed.data;

  // Check every distinct (student, term) pair in the batch is in scope
  // before writing any of it — a partial batch write (some students saved,
  // one silently rejected midway) would be worse than rejecting the whole
  // request. Keyed by student+term rather than just student, since the
  // class-lock check inside checkTeacherStudentScope() is per-term — a
  // student could in principle appear in the same batch under two
  // different term_ids (unusual, but the schema doesn't forbid it), and
  // each needs its own lock check.
  const uniquePairs = [...new Map(scores.map(s => [`${s.student_id}:${s.term_id}`, s])).values()];
  for (const s of uniquePairs) {
    const scopeViolation = await checkTeacherStudentScope(req.user!, s.student_id, s.term_id);
    if (scopeViolation) return res.status(scopeViolation.status).json({ error: scopeViolation.error });
  }

  // Same per-school max-score check as POST /scores, run for every row
  // before any write — a batch is usually all one school, but each row is
  // still checked individually since nothing stops a client from mixing
  // student_ids across schools in one payload.
  type ScoreCfg = { ca1_max: number; ca2_max: number; exam_max: number };
  const cfgCache = new Map<string, ScoreCfg>();
  const getScoreCfg = async (studentId: string): Promise<ScoreCfg> => {
    const cached = cfgCache.get(studentId);
    if (cached) return cached;
    const { rows: schRows } = await query(
      `SELECT sc.ca1_max, sc.ca2_max, sc.exam_max
       FROM schools sc JOIN students st ON st.school_code=sc.code
       WHERE st.id=$1`, [studentId],
    );
    const cfg: ScoreCfg = schRows[0] ?? { ca1_max: 20, ca2_max: 20, exam_max: 60 };
    cfgCache.set(studentId, cfg);
    return cfg;
  };
  for (const s of scores) {
    const cfg = await getScoreCfg(s.student_id);
    if (s.ca1 > cfg.ca1_max || s.ca2 > cfg.ca2_max || s.exam > cfg.exam_max) {
      return res.status(400).json({
        error: `Score exceeds maximum for one or more students (CA1≤${cfg.ca1_max}, CA2≤${cfg.ca2_max}, Exam≤${cfg.exam_max})`,
      });
    }
  }

  const saved = [];
  for (const s of scores) {
    const grade = getGrade(s.ca1 + s.ca2 + s.exam);
    const { rows } = await query(
      `INSERT INTO scores(student_id,subject_id,term_id,ca1,ca2,exam,grade,teacher_remark,entered_by,updated_at)
       VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,now())
       ON CONFLICT(student_id,subject_id,term_id)
       DO UPDATE SET ca1=$4,ca2=$5,exam=$6,grade=$7,teacher_remark=$8,entered_by=$9,updated_at=now()
       RETURNING *`,
      [s.student_id, s.subject_id, s.term_id, s.ca1, s.ca2, s.exam,
       grade, s.teacher_remark ?? null, req.user!.id],
    );
    saved.push(rows[0]);
  }

  // ScoreEntryScreen.tsx (the only mobile screen that writes scores) calls
  // this endpoint, not POST / above — which means bulk saves were never
  // showing up in the admin Audit Log at all until now. One summary entry
  // per batch (not one per row) keeps the log readable for a 30-student
  // class save.
  const subjectIds = [...new Set(scores.map(s => s.subject_id))];
  const termIds    = [...new Set(scores.map(s => s.term_id))];
  await audit(
    req.user!, 'save_scores_bulk', 'score', undefined,
    `${saved.length} score(s) saved — subject(s) ${subjectIds.join(',')}, term(s) ${termIds.join(',')}`,
  );

  // Push the affected students. scores.student_id references students.id,
  // not users.id directly (a student may not even have a login) — resolve
  // through students.user_id the same way GET /scores/report/:student_id
  // above already does. One push per student per batch save, not one per
  // row, matching the "one audit entry per batch" pattern just above.
  const studentIds = [...new Set(saved.map(s => s.student_id))];
  const { rows: studentUserRows } = await query(
    `SELECT user_id FROM students WHERE id = ANY($1) AND user_id IS NOT NULL`, [studentIds],
  );
  Promise.all(studentUserRows.map(r => sendPushToUser(r.user_id, {
    title: 'New score entered',
    body: 'A new score has been recorded for you.',
    data: { type: 'score' },
  }))).catch(err => console.error('Push send failed (scores bulk):', err));

  return res.json({ saved: saved.length });
});

// ── GET /scores/report/:student_id  (full term report) ───────────────────────
router.get('/report/:student_id', async (req, res) => {
  const { term_id } = req.query as { term_id?: string };
  const user = req.user!;

  // Fetch student
  const { rows: stRows } = await query('SELECT * FROM students WHERE id=$1', [req.params.student_id]);
  const student = stRows[0];
  if (!student) return res.status(404).json({ error: 'Student not found' });

  // Authorisation: student sees own, parent sees ward, teacher sees own class, admin sees all
  if (user.role === 'student') {
    if (student.user_id !== user.id) return res.status(403).json({ error: 'Access denied' });
  } else if (user.role === 'parent') {
    const { rows: pw } = await query(
      'SELECT 1 FROM parent_wards WHERE parent_id=$1 AND student_id=$2', [user.id, student.id],
    );
    if (!pw.length) return res.status(403).json({ error: 'Not your ward' });
  } else if (user.role === 'teacher') {
    if (student.school_code !== user.school_code) return res.status(403).json({ error: 'Wrong school' });
  }

  // Resolve term
  let resolvedTermId = term_id;
  if (!resolvedTermId) {
    const { rows: tc } = await query(
      'SELECT id FROM terms WHERE school_code=$1 AND is_current=TRUE LIMIT 1', [student.school_code],
    );
    resolvedTermId = tc[0]?.id;
  }
  if (!resolvedTermId) return res.status(404).json({ error: 'No active term' });

  const { rows: termRows } = await query('SELECT * FROM terms WHERE id=$1', [resolvedTermId]);
  const term = termRows[0];

  const { rows: scoreRows } = await query(
    `SELECT sc.*, sub.name AS subject_name,
            (SELECT ROUND(AVG(s2.total),2) FROM scores s2 JOIN students st2 ON st2.id=s2.student_id
             WHERE s2.subject_id=sc.subject_id AND s2.term_id=sc.term_id AND st2.class_name=$1) AS class_average,
            (SELECT MAX(s2.total) FROM scores s2 JOIN students st2 ON st2.id=s2.student_id
             WHERE s2.subject_id=sc.subject_id AND s2.term_id=sc.term_id AND st2.class_name=$1) AS class_highest
     FROM scores sc
     JOIN subjects sub ON sub.id=sc.subject_id
     WHERE sc.student_id=$2 AND sc.term_id=$3
     ORDER BY sub.name`,
    [student.class_name, student.id, resolvedTermId],
  );

  const { rows: attRows } = await query(
    'SELECT days_present FROM attendance WHERE student_id=$1 AND term_id=$2',
    [student.id, resolvedTermId],
  );
  const { rows: recRows } = await query(
    'SELECT * FROM class_records WHERE student_id=$1 AND term_id=$2',
    [student.id, resolvedTermId],
  );

  const totalScore = scoreRows.reduce((s, r) => s + Number(r.total), 0);
  const n = scoreRows.length;

  return res.json({
    student,
    term,
    scores: scoreRows,
    attendance: { days_present: attRows[0]?.days_present ?? 0, days_opened: term?.days_opened ?? 0 },
    class_record: recRows[0] ?? {},
    summary: { total_score: totalScore, average: n ? +(totalScore / n).toFixed(2) : 0, subject_count: n },
  });
});

// ── GET /scores/session-report/:student_id?academic_year=  ────────────────────
// Collates whichever of the session's 3 terms (1st/2nd/3rd) have been entered
// so far into a running session total per subject, plus a grand total/average.
// Safe to call before the 3rd term exists yet — it reports on however many
// terms are present and flags `is_complete_session` once all 3 are in.
router.get('/session-report/:student_id', async (req, res) => {
  const { academic_year } = req.query as { academic_year?: string };
  const user = req.user!;

  const { rows: stRows } = await query('SELECT * FROM students WHERE id=$1', [req.params.student_id]);
  const student = stRows[0];
  if (!student) return res.status(404).json({ error: 'Student not found' });

  // Same authorisation as /scores/report/:student_id
  if (user.role === 'student') {
    if (student.user_id !== user.id) return res.status(403).json({ error: 'Access denied' });
  } else if (user.role === 'parent') {
    const { rows: pw } = await query(
      'SELECT 1 FROM parent_wards WHERE parent_id=$1 AND student_id=$2', [user.id, student.id],
    );
    if (!pw.length) return res.status(403).json({ error: 'Not your ward' });
  } else if (user.role === 'teacher') {
    if (student.school_code !== user.school_code) return res.status(403).json({ error: 'Wrong school' });
  }

  // Resolve the session (academic_year): default to the year of the school's current term
  let year = academic_year;
  if (!year) {
    const { rows: cur } = await query(
      'SELECT academic_year FROM terms WHERE school_code=$1 AND is_current=TRUE LIMIT 1',
      [student.school_code],
    );
    year = cur[0]?.academic_year;
  }
  if (!year) return res.status(404).json({ error: 'No academic year could be resolved for this session' });

  const { rows: termRows } = await query(
    'SELECT * FROM terms WHERE school_code=$1 AND academic_year=$2',
    [student.school_code, year],
  );
  if (!termRows.length) return res.status(404).json({ error: `No terms found for ${year}` });

  // A session is exactly 3 terms. POST/PUT /terms already enforce that cap at
  // write time — this is a defensive re-check, not the only guard.
  if (termRows.length > 3) {
    return res.status(500).json({
      error: `Data integrity issue: ${termRows.length} terms found for ${year} — a session must have exactly 3.`,
    });
  }
  const terms = [...termRows].sort((a, b) => termRank(a.name) - termRank(b.name));
  const termIds = terms.map(t => t.id);

  const { rows: scoreRows } = await query(
    `SELECT sc.*, sub.name AS subject_name
     FROM scores sc JOIN subjects sub ON sub.id = sc.subject_id
     WHERE sc.student_id=$1 AND sc.term_id = ANY($2::int[])
     ORDER BY sub.name`,
    [student.id, termIds],
  );

  // Group each subject's per-term totals together
  const bySubject = new Map<number, { subject_id: number; subject_name: string; terms: Record<number, number> }>();
  for (const row of scoreRows) {
    if (!bySubject.has(row.subject_id)) {
      bySubject.set(row.subject_id, { subject_id: row.subject_id, subject_name: row.subject_name, terms: {} });
    }
    bySubject.get(row.subject_id)!.terms[row.term_id] = Number(row.total);
  }

  const subjects = [...bySubject.values()]
    .map(s => {
      const recorded = terms.map(t => s.terms[t.id]).filter((v): v is number => v !== undefined);
      const session_total   = recorded.reduce((a, b) => a + b, 0);
      const session_average = recorded.length ? +(session_total / recorded.length).toFixed(2) : 0;
      return {
        subject_id:      s.subject_id,
        subject_name:    s.subject_name,
        term_scores:     terms.map(t => ({ term_id: t.id, term_name: t.name, total: s.terms[t.id] ?? null })),
        terms_recorded:  recorded.length,
        session_total,
        session_average,
        session_grade:   recorded.length ? getGrade(session_average) : null,
      };
    })
    .sort((a, b) => a.subject_name.localeCompare(b.subject_name));

  const { rows: attRows } = await query(
    'SELECT days_present FROM attendance WHERE student_id=$1 AND term_id = ANY($2::int[])',
    [student.id, termIds],
  );
  const days_present = attRows.reduce((s, r) => s + Number(r.days_present ?? 0), 0);
  const days_opened  = terms.reduce((s, t) => s + Number(t.days_opened ?? 0), 0);

  const grand_total   = subjects.reduce((s, r) => s + r.session_total, 0);
  const grand_average = subjects.length
    ? +(subjects.reduce((s, r) => s + r.session_average, 0) / subjects.length).toFixed(2)
    : 0;

  return res.json({
    student,
    academic_year: year,
    terms: terms.map(t => ({ id: t.id, name: t.name, is_current: t.is_current })),
    terms_present: terms.length,
    is_complete_session: terms.length === 3 && subjects.length > 0 && subjects.every(s => s.terms_recorded === 3),
    subjects,
    attendance: { days_present, days_opened },
    summary: { grand_total, grand_average, subject_count: subjects.length },
  });
});

export default router;

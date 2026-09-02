import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireAuth, requirePerm } from '../middleware/auth.js';
import { resolveViewerClassNames, checkTeacherContentScope } from '../utils/scope.js';
import { generateJSON } from '../utils/ai.js';
import { sendPushToClass } from '../utils/push.js';

const router = Router();
router.use(requireAuth);

// ════════════════════════════════════════════════════════
// MATERIALS
// ════════════════════════════════════════════════════════

router.get('/materials', requirePerm('materials.read'), async (req, res) => {
  const { subject_id, class_name, term_id, school_code } = req.query as Record<string, string>;
  const user = req.user!;
  const sc = (school_code && user.role === 'admin') ? school_code : user.school_code;

  // Students/parents can't be trusted to pass class_name themselves (no
  // screen does), so their viewable classes are resolved server-side and
  // enforced regardless of what (if anything) the client sent. See
  // resolveViewerClassNames() for why.
  const viewerClasses = await resolveViewerClassNames(user);

  let sql = `SELECT m.*,sub.name AS subject_name,u.full_name AS uploaded_by
             FROM materials m
             JOIN subjects sub ON sub.id=m.subject_id
             JOIN users u ON u.id=m.created_by
             WHERE m.school_code=$1`;
  const params: unknown[] = [sc];

  if (viewerClasses) {
    if (!viewerClasses.length) {
      // Student with no linked record, or parent with no wards — nothing to show.
      return res.json({ materials: [] });
    }
    params.push(viewerClasses);
    sql += ` AND (m.class_name = ANY($${params.length}) OR m.class_name IS NULL)`;
  } else if (class_name) {
    params.push(class_name); sql += ` AND m.class_name=$${params.length}`;
  }

  if (subject_id) { params.push(subject_id); sql += ` AND m.subject_id=$${params.length}`; }
  if (term_id)    { params.push(term_id);    sql += ` AND m.term_id=$${params.length}`; }
  sql += ' ORDER BY m.created_at DESC';

  const { rows } = await query(sql, params);
  return res.json({ materials: rows });
});

router.post('/materials', requirePerm('materials.write'), async (req, res) => {
  const { subject_id, class_name, term_id, title, type, url, school_code } = req.body;
  const sc = (school_code && req.user!.role === 'admin') ? school_code : req.user!.school_code;

  // Found alongside the same-shape bug on /assessments below: a teacher
  // could previously publish a material for any class/subject in their
  // school, whether or not they actually teach it. A teacher may write here
  // for their own assigned_class (any subject) or their own
  // assigned_subject_id (any class) — see checkTeacherContentScope() for
  // the full rule; admin is unrestricted as everywhere else.
  const scopeError = await checkTeacherContentScope(req.user!, { class_name: class_name ?? null, subject_id });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const { rows } = await query(
    `INSERT INTO materials(school_code,subject_id,class_name,term_id,title,type,url,created_by)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [sc, subject_id, class_name ?? null, term_id ?? null,
     title, type, url, req.user!.id],
  );
  return res.status(201).json({ material: rows[0] });
});

router.delete('/materials/:id', requirePerm('materials.write'), async (req, res) => {
  const user = req.user!;
  // Found in the Pass 20 comparison audit: this only ever deleted `WHERE
  // created_by=$2` — meaning even admin could not remove a material some
  // other teacher had uploaded (e.g. to take it down after that teacher
  // left the school). Admin now bypasses the created_by check entirely,
  // matching the "admin is unrestricted" pattern used everywhere else in
  // the app; a non-admin teacher is still limited to their own uploads.
  const { rows } = await query(
    user.role === 'admin'
      ? 'DELETE FROM materials WHERE id=$1 RETURNING id'
      : 'DELETE FROM materials WHERE id=$1 AND created_by=$2 RETURNING id',
    user.role === 'admin' ? [req.params.id] : [req.params.id, user.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Material not found' });
  return res.json({ ok: true });
});

// ════════════════════════════════════════════════════════
// QUESTIONS
// ════════════════════════════════════════════════════════

router.get('/questions', requirePerm('questions.read'), async (req, res) => {
  const { subject_id, class_name, type } = req.query as Record<string, string>;
  let sql = `SELECT * FROM questions WHERE school_code=$1`;
  const params: unknown[] = [req.user!.school_code];
  if (subject_id) { params.push(subject_id); sql += ` AND subject_id=$${params.length}`; }
  if (class_name) { params.push(class_name); sql += ` AND class_name=$${params.length}`; }
  if (type)       { params.push(type);       sql += ` AND type=$${params.length}`; }
  const { rows } = await query(sql, params);
  return res.json({ questions: rows });
});

router.post('/questions', requirePerm('questions.write'), async (req, res) => {
  const { subject_id, class_name, term_id, type, stem, options, correct_keys, marks, school_code } = req.body;

  // Added in Pass 19: the same scoping gap as /materials and /assessments
  // (flagged as a follow-up when those two were fixed in Pass 17, since a
  // question feeds directly into an assessment) — a teacher could publish a
  // question for any class/subject in their school, whether or not they
  // actually teach it. Same rule as the other two: allowed for the
  // teacher's own assigned class (any subject) or their own assigned
  // subject (any class).
  const scopeError = await checkTeacherContentScope(req.user!, { class_name: class_name ?? null, subject_id });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  // Same admin-NULL-school_code fix already applied to /materials and
  // /assessments: admin accounts have school_code=null, so always writing
  // req.user.school_code silently created questions invisible to every
  // teacher's GET /questions (which filters by their own non-null
  // school_code). Accept an explicit school_code in the body for admin only.
  const sc = (school_code && req.user!.role === 'admin') ? school_code : req.user!.school_code;

  const { rows } = await query(
    `INSERT INTO questions(school_code,subject_id,class_name,term_id,type,stem,options,correct_keys,marks,created_by)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [sc, subject_id, class_name ?? null, term_id ?? null,
     type ?? 'mcq', stem, JSON.stringify(options ?? []), correct_keys ?? [], marks ?? 1, req.user!.id],
  );
  return res.status(201).json({ question: rows[0] });
});

// ════════════════════════════════════════════════════════
// ASSESSMENTS
// ════════════════════════════════════════════════════════

router.get('/assessments', requirePerm('assessments.read'), async (req, res) => {
  const { class_name, subject_id, status, school_code } = req.query as Record<string, string>;
  const user = req.user!;
  const sc = (school_code && user.role === 'admin') ? school_code : user.school_code;

  // Same class-scoping gap as /materials above, plus: a student/parent has no
  // business seeing an assessment that's still 'draft' — it isn't published
  // to anyone yet. Live-verified: a JSS1 student's account could see the
  // title of an unpublished SS3-only assessment before this fix.
  const viewerClasses = await resolveViewerClassNames(user);

  const params: unknown[] = [sc];

  // For a student, also report whether they've already submitted this
  // assessment (and their score, if so) — added alongside the
  // already_submitted UI fix: previously nothing distinguished a fresh
  // assessment from one already answered, so AssessmentsScreen always
  // showed the same "Take Assessment" button, and re-tapping it silently
  // overwrote the student's prior (possibly AI-graded) submission with no
  // warning. Not added for admin/teacher — the extra subquery/join is
  // meaningless for them (a teacher never reaches this route at all per
  // rbac.ts; admin's "own submission" has no meaning here).
  let submittedCol = '';
  if (user.role === 'student') {
    params.push(user.id);
    const p = params.length;
    submittedCol = `, EXISTS (
         SELECT 1 FROM submissions sm JOIN students st ON st.id = sm.student_id
         WHERE sm.assessment_id = a.id AND st.user_id = $${p}
       ) AS already_submitted,
       (SELECT sm.id FROM submissions sm JOIN students st ON st.id = sm.student_id
        WHERE sm.assessment_id = a.id AND st.user_id = $${p}) AS my_submission_id,
       (SELECT sm.total_score FROM submissions sm JOIN students st ON st.id = sm.student_id
        WHERE sm.assessment_id = a.id AND st.user_id = $${p}) AS my_score`;
  }

  let sql = `SELECT a.*,sub.name AS subject_name,
                    (SELECT COUNT(*) FROM assessment_questions aq WHERE aq.assessment_id=a.id) AS question_count
                    ${submittedCol}
             FROM assessments a JOIN subjects sub ON sub.id=a.subject_id
             WHERE a.school_code=$1`;

  if (viewerClasses) {
    if (!viewerClasses.length) return res.json({ assessments: [] });
    params.push(viewerClasses);
    sql += ` AND (a.class_name = ANY($${params.length}) OR a.class_name IS NULL)`;
    sql += ` AND a.status != 'draft'`;
  } else if (class_name) {
    params.push(class_name); sql += ` AND a.class_name=$${params.length}`;
  }

  if (subject_id) { params.push(subject_id); sql += ` AND a.subject_id=$${params.length}`; }
  if (status)     { params.push(status);     sql += ` AND a.status=$${params.length}`; }
  sql += ' ORDER BY a.created_at DESC';
  const { rows } = await query(sql, params);
  return res.json({ assessments: rows });
});

router.post('/assessments', requirePerm('assessments.create'), async (req, res) => {
  const { subject_id, class_name, term_id, title, start_at, end_at, shuffle, question_ids, school_code } = req.body as {
    subject_id: number; class_name: string; term_id?: number; title: string;
    start_at?: string; end_at?: string; shuffle?: boolean;
    question_ids: Array<{ id: number; points: number }>; school_code?: string;
  };
  const sc = (school_code && req.user!.role === 'admin') ? school_code : req.user!.school_code;

  // Same rule as POST /materials above — a teacher may only schedule an
  // assessment for their own assigned class (any subject) or their own
  // assigned subject (any class in their school).
  const scopeError = await checkTeacherContentScope(req.user!, { class_name, subject_id });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const total_marks = (question_ids ?? []).reduce((s, q) => s + (q.points ?? 1), 0);
  const { rows } = await query(
    `INSERT INTO assessments(school_code,subject_id,class_name,term_id,title,total_marks,
       start_at,end_at,shuffle,created_by)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`,
    [sc, subject_id, class_name, term_id ?? null, title, total_marks,
     start_at ?? null, end_at ?? null, shuffle !== false, req.user!.id],
  );
  const assessment = rows[0];

  // Link questions
  for (let i = 0; i < (question_ids ?? []).length; i++) {
    const q = question_ids[i];
    await query(
      `INSERT INTO assessment_questions(assessment_id,question_id,points,order_index)
       VALUES($1,$2,$3,$4) ON CONFLICT DO NOTHING`,
      [assessment.id, q.id, q.points ?? 1, i],
    );
  }
  return res.status(201).json({ assessment });
});

// ── PUT /assessments/:id/status  (draft → open → closed) ──────────────────────
// Found in QA Pass 6: assessments.status defaults to 'draft' at creation and
// NOTHING anywhere (backend route or UI control) ever changed it — every
// assessment ever created was permanently stuck in 'draft', so the "Take
// Assessment" button (gated on status === 'open') could never work for any
// student, for any assessment, ever. This is the missing publish/close action.
router.put('/assessments/:id/status', requirePerm('assessments.schedule'), async (req, res) => {
  const { status } = req.body as { status: string };
  if (!['draft', 'open', 'closed'].includes(status)) {
    return res.status(400).json({ error: "status must be 'draft', 'open', or 'closed'" });
  }
  const { rows: aRows } = await query(
    'SELECT school_code, class_name, subject_id, title FROM assessments WHERE id=$1', [req.params.id],
  );
  if (!aRows[0]) return res.status(404).json({ error: 'Assessment not found' });
  if (req.user!.role !== 'admin' && aRows[0].school_code !== req.user!.school_code) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  // Found in the Pass 20 comparison audit: creating an assessment is
  // already scoped to "your own class or your own subject" via
  // checkTeacherContentScope(), but publishing/closing one (this route)
  // only ever checked school_code — so any teacher in the school could
  // open or close an assessment they had no part in creating, as long as
  // it belonged to their school. Same rule now applies here: a teacher may
  // change status only when they're the class teacher for aRows[0]
  // .class_name OR the subject teacher for aRows[0].subject_id. Admin
  // remains unrestricted.
  const scopeError = await checkTeacherContentScope(req.user!, {
    class_name: aRows[0].class_name, subject_id: aRows[0].subject_id,
  });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const { rows } = await query(
    'UPDATE assessments SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id],
  );

  // Only on publish, not on close — a closed assessment isn't something a
  // student needs pushed to them. TakeAssessmentScreen needs both
  // assessmentId and title in its route params, so both travel in `data`.
  if (status === 'open') {
    sendPushToClass(aRows[0].school_code, aRows[0].class_name, {
      title: 'New assessment available',
      body: `${aRows[0].title} has been published for your class.`,
      data: { type: 'assessment', assessmentId: req.params.id, title: aRows[0].title },
    }).catch(err => console.error('Push send failed (assessment publish):', err));
  }

  return res.json({ assessment: rows[0] });
});

// ── GET /assessments/:id/questions  (for the student taking it) ───────────────
// Found in QA Pass 6: TakeAssessmentScreen.tsx never actually fetched this
// assessment's own questions — no such endpoint existed. It called the
// unrelated, unscoped GET /learning/questions (which 403s for students
// anyway — 'questions.read' is admin-only per rbac.ts) and, per a
// comment in the old code, "simplified" by taking whichever 20 questions
// happened to come back first. Had that 403 not already blocked it, a
// student would have been shown questions with no relationship at all to
// the assessment they opened, while /submit (correctly) grades against the
// *real* assessment_questions — meaning a student could never actually pass
// the assessment they were shown. This route returns the real, correct,
// ordered question set for a specific assessment.
router.get('/assessments/:id/questions', async (req, res) => {
  const user = req.user!;
  const { rows: aRows } = await query(
    'SELECT * FROM assessments WHERE id=$1', [req.params.id],
  );
  const assessment = aRows[0];
  if (!assessment) return res.status(404).json({ error: 'Assessment not found' });

  if (user.role === 'student') {
    const { rows: stRows } = await query(
      'SELECT school_code, class_name FROM students WHERE user_id=$1', [user.id],
    );
    const student = stRows[0];
    if (!student || assessment.school_code !== student.school_code || assessment.class_name !== student.class_name) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    if (assessment.status !== 'open') {
      return res.status(403).json({ error: `This assessment is ${assessment.status === 'draft' ? 'not yet open' : 'closed'}.` });
    }
    const now = Date.now();
    if (assessment.start_at && now < new Date(assessment.start_at).getTime()) {
      return res.status(403).json({ error: 'This assessment has not started yet' });
    }
    if (assessment.end_at && now > new Date(assessment.end_at).getTime()) {
      return res.status(403).json({ error: 'This assessment has already closed' });
    }
  } else if (user.role !== 'admin') {
    // Teachers never get here: creating, viewing, or opening the questions of
    // an assessment is Brainee/admin territory on this platform, not a
    // teacher's — same policy enforced in rbac.ts.
    return res.status(403).json({ error: 'Not authorized' });
  }

  // Students never get correct_keys back — teachers/admin do, for review.
  const cols = user.role === 'student'
    ? 'q.id, q.type, q.stem, q.options'
    : 'q.id, q.type, q.stem, q.options, q.correct_keys';
  const { rows: qRows } = await query(
    `SELECT ${cols}, aq.points, aq.order_index
     FROM assessment_questions aq JOIN questions q ON q.id = aq.question_id
     WHERE aq.assessment_id=$1 ORDER BY aq.order_index`,
    [req.params.id],
  );
  return res.json({ assessment, questions: qRows });
});

// ── POST /assessments/:id/submit (student) ────────────────────────────────────
router.post('/assessments/:id/submit', requirePerm('assessments.take'), async (req, res) => {
  const user = req.user!;
  const { answers } = req.body as { answers: Record<string, string> };  // {question_id: selected_key}

  // Get student record
  const { rows: stRows } = await query('SELECT id, school_code, class_name FROM students WHERE user_id=$1 LIMIT 1', [user.id]);
  if (!stRows[0]) return res.status(404).json({ error: 'No student record for this user' });
  const student = stRows[0];
  const student_id = student.id;

  // Found in QA Pass 4: this route never checked the assessment's status or
  // time window, so a student could submit to (and get auto-graded on) a
  // still-draft/never-published assessment, or one whose end_at had already
  // passed — live-verified: a draft assessment returned a full auto-score.
  // Also add the same school/class scoping used on every other write route.
  const { rows: aRows } = await query(
    'SELECT status, start_at, end_at, school_code, class_name FROM assessments WHERE id=$1', [req.params.id],
  );
  const assessment = aRows[0];
  if (!assessment) return res.status(404).json({ error: 'Assessment not found' });
  if (assessment.school_code !== student.school_code || assessment.class_name !== student.class_name) {
    return res.status(403).json({ error: 'This assessment is not available to you' });
  }
  if (assessment.status !== 'open') {
    return res.status(403).json({ error: `This assessment is ${assessment.status === 'draft' ? 'not yet open' : 'closed'}.` });
  }
  const now = Date.now();
  if (assessment.start_at && now < new Date(assessment.start_at).getTime()) {
    return res.status(403).json({ error: 'This assessment has not started yet' });
  }
  if (assessment.end_at && now > new Date(assessment.end_at).getTime()) {
    return res.status(403).json({ error: 'This assessment has already closed' });
  }

  // Auto-mark MCQs; hand essay answers to Brainee (this is the STS Virtual
  // School's own AI grading path — see submission_answers in schema.sql.
  // This never touches `scores`, `attendance`, or `class_records`, which
  // remain the separate, teacher-entered traditional grading system used
  // for report cards.)
  const { rows: qRows } = await query(
    `SELECT aq.question_id, aq.points, q.correct_keys, q.type, q.stem
     FROM assessment_questions aq JOIN questions q ON q.id=aq.question_id
     WHERE aq.assessment_id=$1`,
    [req.params.id],
  );

  let auto_score = 0;
  const essayRows: { question_id: number; points: number; stem: string; answer_text: string }[] = [];

  for (const q of qRows) {
    if (q.type === 'mcq') {
      const selected = answers[q.question_id];
      if (selected && q.correct_keys.includes(selected)) {
        auto_score += Number(q.points);
      }
    } else if (q.type === 'essay') {
      const answer_text = (answers[q.question_id] ?? '').toString();
      essayRows.push({ question_id: q.question_id, points: Number(q.points), stem: q.stem, answer_text });
    }
  }

  const { rows } = await query(
    `INSERT INTO submissions(assessment_id,student_id,answers,auto_score,total_score,started_at,submitted_at)
     VALUES($1,$2,$3,$4,$4,now(),now())
     ON CONFLICT(assessment_id,student_id)
     DO UPDATE SET answers=$3,auto_score=$4,total_score=$4,submitted_at=now()
     RETURNING *`,
    [req.params.id, student_id, JSON.stringify(answers), auto_score],
  );
  const submission = rows[0];

  // Resubmission support: this student's assessment_questions haven't
  // changed shape, but their answers have — replace the prior per-question
  // breakdown rather than leaving stale rows behind.
  await query('DELETE FROM submission_answers WHERE submission_id=$1', [submission.id]);

  let essayPointsTotal = 0;
  let anyUngraded = false;

  // MCQ rows — final immediately, same as auto_score above.
  for (const q of qRows) {
    if (q.type !== 'mcq') continue;
    const selected = answers[q.question_id] ?? null;
    const correct = !!selected && q.correct_keys.includes(selected);
    await query(
      `INSERT INTO submission_answers(submission_id,question_id,question_type,selected_key,max_points,awarded_points,grading_status)
       VALUES($1,$2,'mcq',$3,$4,$5,'auto')`,
      [submission.id, q.question_id, selected, q.points, correct ? q.points : 0],
    );
  }

  // Essay rows — Brainee grades each one. An unanswered essay gets 0 with no
  // AI call (nothing to grade). A failed Brainee call leaves it explicitly
  // 'ai_unavailable' rather than silently scoring it 0 or dropping it —
  // a teacher has to grade it by hand via PUT /submissions/:id/answers/:answerId.
  for (const e of essayRows) {
    if (!e.answer_text.trim()) {
      await query(
        `INSERT INTO submission_answers(submission_id,question_id,question_type,answer_text,max_points,awarded_points,grading_status)
         VALUES($1,$2,'essay',$3,$4,0,'auto')`,
        [submission.id, e.question_id, e.answer_text, e.points],
      );
      continue;
    }

    try {
      const prompt =
        `Grade this student's essay answer out of ${e.points} marks.\n` +
        `Question: "${e.stem}"\n` +
        `Student's answer: "${e.answer_text}"\n` +
        `Return JSON exactly like: {"points": number (0-${e.points}), "feedback": string (1-2 short, encouraging, age-appropriate sentences)}`;
      const result: any = await generateJSON(prompt, 'essay-mark', { userId: user.id, role: user.role });
      const points = Math.max(0, Math.min(e.points, Number(result?.points) || 0));
      const feedback = typeof result?.feedback === 'string' ? result.feedback : null;

      await query(
        `INSERT INTO submission_answers(submission_id,question_id,question_type,answer_text,max_points,awarded_points,ai_suggested_points,ai_feedback,grading_status)
         VALUES($1,$2,'essay',$3,$4,$5,$5,$6,'ai_graded')`,
        [submission.id, e.question_id, e.answer_text, e.points, points, feedback],
      );
      essayPointsTotal += points;
    } catch {
      anyUngraded = true;
      await query(
        `INSERT INTO submission_answers(submission_id,question_id,question_type,answer_text,max_points,grading_status)
         VALUES($1,$2,'essay',$3,$4,'ai_unavailable')`,
        [submission.id, e.question_id, e.answer_text, e.points],
      );
    }
  }

  const total_score = auto_score + essayPointsTotal;
  const { rows: updated } = await query(
    `UPDATE submissions SET total_score=$2, fully_graded=$3 WHERE id=$1 RETURNING *`,
    [submission.id, total_score, !anyUngraded],
  );

  return res.json({ submission: updated[0], auto_score });
});

// ── GET /assessments/:id/results (admin oversight only) ────────────────────────
// A student's self-assessment results with Brainee are the student's own
// business, not a teacher's — see rbac.ts. Only admin gets this oversight
// view, with the power to correct a grade Brainee clearly got wrong (see the
// /review route below).
router.get('/assessments/:id/results', requirePerm('aiResults.read'), async (req, res) => {
  const { rows: aRows } = await query('SELECT school_code FROM assessments WHERE id=$1', [req.params.id]);
  if (!aRows[0]) return res.status(404).json({ error: 'Assessment not found' });
  if (req.user!.role !== 'admin' && aRows[0].school_code !== req.user!.school_code) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  const { rows } = await query(
    `SELECT sub.id,sub.answers,sub.auto_score,sub.total_score,sub.submitted_at,sub.fully_graded,
            st.full_name AS student_name,st.class_name,
            (SELECT count(*) FROM submission_answers sa WHERE sa.submission_id=sub.id AND sa.grading_status='ai_unavailable') AS pending_essay_count
     FROM submissions sub JOIN students st ON st.id=sub.student_id
     WHERE sub.assessment_id=$1 ORDER BY st.full_name`,
    [req.params.id],
  );
  return res.json({ results: rows });
});

// ── GET /assessments/:id/submissions (teacher/admin) ───────────────────────────
// Same data as /results but framed for the "essay marking inbox" screen —
// includes each submission's per-question essay answers needing attention.
// This is the query that fills the "Teacher pending marking" gap noted in
// docs/ARCHIVED_redesign-branch-NOTES.md — there was no graded/ungraded flag
// on submissions at all before this pass.
router.get('/assessments/:id/submissions', requirePerm('aiResults.read'), async (req, res) => {
  const { rows: aRows } = await query('SELECT school_code, title FROM assessments WHERE id=$1', [req.params.id]);
  if (!aRows[0]) return res.status(404).json({ error: 'Assessment not found' });
  if (req.user!.role !== 'admin' && aRows[0].school_code !== req.user!.school_code) {
    return res.status(404).json({ error: 'Assessment not found' });
  }

  const { rows } = await query(
    `SELECT sub.id AS submission_id, sub.auto_score, sub.total_score, sub.fully_graded, sub.submitted_at,
            st.full_name AS student_name, st.class_name
     FROM submissions sub JOIN students st ON st.id=sub.student_id
     WHERE sub.assessment_id=$1 ORDER BY sub.fully_graded ASC, st.full_name`,
    [req.params.id],
  );
  return res.json({ assessment_title: aRows[0].title, submissions: rows });
});

// ── GET /submissions/:id/answers ────────────────────────────────────────────
// Full per-question breakdown. Teacher/admin see everything, including
// Brainee's suggested essay score/feedback before it's been reviewed.
// Students/parents only ever see a final, human-or-auto-confirmed score for
// each question — an 'ai_graded' essay answer that hasn't been reviewed yet
// shows as "Pending your teacher's review" with no numbers, so a
// provisional AI score can never be mistaken for a confirmed one.
router.get('/submissions/:id/answers', async (req, res) => {
  const user = req.user!;
  const { rows: subRows } = await query(
    `SELECT sub.*, st.user_id AS student_user_id, st.school_code, st.class_name, st.id AS student_id
     FROM submissions sub JOIN students st ON st.id=sub.student_id WHERE sub.id=$1`,
    [req.params.id],
  );
  const submission = subRows[0];
  if (!submission) return res.status(404).json({ error: 'Submission not found' });

  if (user.role === 'admin') { /* unrestricted — Brainee ↔ student grading, admin oversight only */ }
  else if (user.role === 'student') {
    if (submission.student_user_id !== user.id) return res.status(403).json({ error: 'Not your submission' });
  } else if (user.role === 'parent') {
    const { rows: pw } = await query('SELECT 1 FROM parent_wards WHERE parent_id=$1 AND student_id=$2', [user.id, submission.student_id]);
    if (!pw.length) return res.status(403).json({ error: 'Not your ward' });
  } else {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const { rows: answers } = await query(
    `SELECT sa.*, q.stem
     FROM submission_answers sa JOIN questions q ON q.id = sa.question_id
     WHERE sa.submission_id=$1 ORDER BY sa.id`,
    [req.params.id],
  );

  const isStaff = user.role === 'admin';
  const shaped = answers.map((a: any) => {
    if (isStaff) return a;
    const finalized = a.grading_status === 'auto' || a.grading_status === 'teacher_reviewed';
    return {
      ...a,
      awarded_points: finalized ? a.awarded_points : null,
      ai_suggested_points: undefined,
      ai_feedback: finalized ? a.ai_feedback : null,
      pending_review: !finalized,
    };
  });

  return res.json({ submission, answers: shaped });
});

// ── PUT /submissions/:id/answers/:answerId/review (admin override only) ───────
// Confirms or overrides Brainee's essay score. Body: { awarded_points,
// feedback? }. This is the only route that can move an essay answer to
// 'teacher_reviewed' (kept as a DB/status literal for backward compatibility;
// the only human who can reach this route is admin), and the only route
// that can resolve an 'ai_unavailable' answer (Brainee failed to grade it,
// so a human must). No teacher permission maps to 'aiGrading.override' — a
// teacher must never open, view, or touch a grade Brainee gave a student.
// Admin retains this purely as an oversight/correction power, e.g. Brainee
// clearly misread a valid answer as incorrect.
router.put('/submissions/:id/answers/:answerId/review', requirePerm('aiGrading.override'), async (req, res) => {
  const { rows: check } = await query(
    `SELECT st.school_code FROM submissions sub JOIN students st ON st.id=sub.student_id WHERE sub.id=$1`,
    [req.params.id],
  );
  if (!check[0]) return res.status(404).json({ error: 'Submission not found' });
  if (req.user!.role !== 'admin' && check[0].school_code !== req.user!.school_code) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const { awarded_points, feedback } = req.body as { awarded_points: number; feedback?: string };
  if (awarded_points == null || Number.isNaN(Number(awarded_points))) {
    return res.status(400).json({ error: 'awarded_points is required' });
  }

  const { rows: ansRows } = await query(
    `UPDATE submission_answers
     SET awarded_points=$3, ai_feedback=COALESCE($4, ai_feedback), grading_status='teacher_reviewed',
         graded_by=$5, graded_at=now()
     WHERE id=$2 AND submission_id=$1 AND question_type='essay'
     RETURNING *`,
    [req.params.id, req.params.answerId, Math.max(0, Number(awarded_points)), feedback ?? null, req.user!.id],
  );
  if (!ansRows[0]) return res.status(404).json({ error: 'Essay answer not found on this submission' });

  // Recompute the submission's total from every per-question row — simplest
  // way to keep total_score consistent regardless of how many essay
  // questions this assessment has or what order they're reviewed in.
  const { rows: allAnswers } = await query(
    `SELECT awarded_points, grading_status FROM submission_answers WHERE submission_id=$1`,
    [req.params.id],
  );
  const total = allAnswers.reduce((sum: number, a: any) => sum + (a.awarded_points != null ? Number(a.awarded_points) : 0), 0);
  const fully_graded = !allAnswers.some((a: any) => a.grading_status === 'ai_unavailable');

  const { rows: updatedSub } = await query(
    `UPDATE submissions SET total_score=$2, fully_graded=$3 WHERE id=$1 RETURNING *`,
    [req.params.id, total, fully_graded],
  );

  return res.json({ answer: ansRows[0], submission: updatedSub[0] });
});

export default router;

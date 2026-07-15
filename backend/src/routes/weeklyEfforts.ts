import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireAuth, requirePerm } from '../middleware/auth.js';
import { checkTeacherStudentScope } from '../utils/scope.js';
import { audit } from '../utils/audit.js';
import { generate } from '../utils/ai.js';

const router = Router();
router.use(requireAuth);

// ── POST /weekly-efforts ──────────────────────────────────────────────────────
router.post('/', requirePerm('weeklyEfforts.write'), async (req, res) => {
  const {
    student_id, subject_id, term_id, week,
    attendance_percent, tasks_completed, tasks_assigned,
    mcq_avg, teacher_comment, flags,
  } = req.body;

  if (!student_id) return res.status(400).json({ error: 'student_id required' });
  const scopeViolation = await checkTeacherStudentScope(req.user!, student_id, term_id);
  if (scopeViolation) return res.status(scopeViolation.status).json({ error: scopeViolation.error });

  const { rows } = await query(
    `INSERT INTO weekly_efforts(student_id,subject_id,term_id,week,attendance_percent,
      tasks_completed,tasks_assigned,mcq_avg,teacher_comment,flags,teacher_id)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT(student_id,subject_id,term_id,week)
     DO UPDATE SET attendance_percent=$5,tasks_completed=$6,tasks_assigned=$7,
       mcq_avg=$8,teacher_comment=$9,flags=$10,teacher_id=$11
     RETURNING *`,
    [student_id, subject_id ?? null, term_id, week, attendance_percent ?? null,
     tasks_completed ?? null, tasks_assigned ?? null, mcq_avg ?? null,
     teacher_comment ?? null, flags ?? [], req.user!.id],
  );
  // Wasn't audited at all before this pass.
  await audit(req.user!, 'save_weekly_effort', 'weekly_effort', String(rows[0].id));

  // Best-effort: turn the numbers/flags a teacher just entered into a short,
  // plain-language summary a young student can actually understand on their
  // own, without an adult translating "mcq_avg: 62, flags: ['late_submissions']"
  // for them. This must never block or fail the save itself — if Brainee is
  // unreachable, ai_summary just stays null and the student/parent still see
  // the underlying numbers as before.
  let weeklyEffort = rows[0];
  try {
    const prompt =
      `Write a short (2-3 sentence), warm, encouraging weekly summary for a school ` +
      `student, based on this week's log. Use very simple words a young student ` +
      `can understand on their own — no jargon, no percentages read out as-is, no ` +
      `harsh or judgmental tone.\n` +
      `Tasks completed: ${weeklyEffort.tasks_completed ?? 'not recorded'} of ${weeklyEffort.tasks_assigned ?? 'not recorded'}.\n` +
      `Average quiz score this week: ${weeklyEffort.mcq_avg ?? 'not recorded'}${weeklyEffort.mcq_avg != null ? '%' : ''}.\n` +
      `Attendance: ${weeklyEffort.attendance_percent ?? 'not recorded'}${weeklyEffort.attendance_percent != null ? '%' : ''}.\n` +
      (Array.isArray(weeklyEffort.flags) && weeklyEffort.flags.length
        ? `Things flagged by the teacher: ${weeklyEffort.flags.join(', ')}.\n`
        : '') +
      (weeklyEffort.teacher_comment ? `Teacher's comment: "${weeklyEffort.teacher_comment}"\n` : '') +
      `If something needs improvement, mention ONE gentle, specific, encouraging next step.`;

    const summary = await generate(prompt, 'remediation', { userId: req.user!.id, role: req.user!.role });
    const { rows: updated } = await query(
      `UPDATE weekly_efforts SET ai_summary=$2, ai_summary_generated_at=now() WHERE id=$1 RETURNING *`,
      [weeklyEffort.id, summary],
    );
    weeklyEffort = updated[0];
  } catch {
    // Fail open — the weekly effort itself is already saved either way.
  }

  return res.status(201).json({ weekly_effort: weeklyEffort });
});

// ── GET /weekly-efforts?student_id=&term_id=&week= ────────────────────────────
router.get('/', requirePerm('weeklyEfforts.read'), async (req, res) => {
  const { student_id, term_id, week } = req.query as Record<string, string>;
  const user = req.user!;

  let sql = `SELECT we.*,
                    s.full_name AS student_name, s.class_name,
                    sub.name AS subject_name,
                    t.name AS term_name
             FROM weekly_efforts we
             JOIN students s   ON s.id=we.student_id
             LEFT JOIN subjects sub ON sub.id=we.subject_id
             JOIN terms t      ON t.id=we.term_id
             WHERE 1=1`;
  const params: unknown[] = [];

  if (student_id) { params.push(student_id); sql += ` AND we.student_id=$${params.length}`; }
  if (term_id)    { params.push(term_id);    sql += ` AND we.term_id=$${params.length}`; }
  if (week)       { params.push(week);       sql += ` AND we.week=$${params.length}`; }

  // Scope
  if (user.role === 'teacher') {
    // Always restrict to the teacher's own school — a subject-only teacher
    // (no assigned_class) previously had no school-level restriction at all
    // and could see every school's weekly efforts. Verified live before this
    // fix; verified blocked after it.
    params.push(user.school_code); sql += ` AND s.school_code=$${params.length}`;
    if (user.assigned_class) {
      params.push(user.assigned_class); sql += ` AND s.class_name=$${params.length}`;
    } else {
      // Found in the Pass 20 thorough-check audit: even with the school
      // restriction above, a subject-only teacher had no CLASS restriction
      // at all on this list — WeeklyEffortsScreen.tsx's own main feed calls
      // this with no filters whatsoever, so in practice (not just via a raw
      // API call) a subject-only teacher's feed showed every weekly-effort
      // entry for every student in every class in the school, logged by
      // every other teacher too. A class teacher legitimately sees every
      // entry for their own class regardless of who logged it (they're the
      // class's overall guardian); a subject-only teacher has no class of
      // their own to be trusted with that way, so — per the same "records
      // access is class-teacher-only, no subject-wide carve-out" rule
      // applied to GET /students in this pass — they're restricted here to
      // just the entries they personally logged. This keeps the existing
      // feed screen working (it still shows real data, just their own) with
      // no UI change needed, rather than returning nothing until a class
      // filter is added to that screen.
      params.push(user.id); sql += ` AND we.teacher_id=$${params.length}`;
    }
  }
  if (user.role === 'parent') {
    params.push(user.id);
    sql += ` AND we.student_id IN (SELECT student_id FROM parent_wards WHERE parent_id=$${params.length})`;
  }
  if (user.role === 'student') {
    params.push(user.id);
    sql += ` AND we.student_id=(SELECT id FROM students WHERE user_id=$${params.length} LIMIT 1)`;
  }

  sql += ' ORDER BY we.term_id DESC, we.week DESC, s.full_name';
  const { rows } = await query(sql, params);
  return res.json({ weekly_efforts: rows });
});

// ── Shared: may this user see/reply to this weekly_effort's feedback thread? ──
async function checkWeeklyEffortAccess(user: { id: string; role: string; school_code: string | null }, weeklyEffortId: string) {
  const { rows } = await query(
    `SELECT we.id, s.id AS student_id, s.school_code, s.user_id AS student_user_id
     FROM weekly_efforts we JOIN students s ON s.id = we.student_id
     WHERE we.id=$1`,
    [weeklyEffortId],
  );
  const rec = rows[0];
  if (!rec) return { status: 404, error: 'Weekly effort not found' };

  if (user.role === 'admin') return null;
  if (user.role === 'teacher') {
    return rec.school_code === user.school_code ? null : { status: 403, error: 'Wrong school' };
  }
  if (user.role === 'student') {
    return rec.student_user_id === user.id ? null : { status: 403, error: 'Access denied' };
  }
  if (user.role === 'parent') {
    const { rows: pw } = await query('SELECT 1 FROM parent_wards WHERE parent_id=$1 AND student_id=$2', [user.id, rec.student_id]);
    return pw.length ? null : { status: 403, error: 'Not your ward' };
  }
  return { status: 403, error: 'Access denied' };
}

// ── POST /weekly-efforts/:id/feedback ────────────────────────────────────────
router.post('/:id/feedback', requirePerm('weeklyEfforts.feedback'), async (req, res) => {
  const denied = await checkWeeklyEffortAccess(req.user!, req.params.id);
  if (denied) return res.status(denied.status).json({ error: denied.error });

  const { body } = req.body as { body: string };
  if (!body?.trim()) return res.status(400).json({ error: 'body required' });
  const { rows } = await query(
    `INSERT INTO weekly_feedback(weekly_effort_id,sender_id,body) VALUES($1,$2,$3) RETURNING *`,
    [req.params.id, req.user!.id, body.trim()],
  );
  return res.status(201).json({ feedback: rows[0] });
});

// ── GET /weekly-efforts/:id/feedback ─────────────────────────────────────────
// Previously had no ownership check at all — any authenticated user could
// read any weekly_effort's feedback thread by id, regardless of role or
// relationship to the student. Confirmed live before this fix.
router.get('/:id/feedback', async (req, res) => {
  const denied = await checkWeeklyEffortAccess(req.user!, req.params.id);
  if (denied) return res.status(denied.status).json({ error: denied.error });

  const { rows } = await query(
    `SELECT wf.*,u.full_name AS sender_name,u.role AS sender_role
     FROM weekly_feedback wf JOIN users u ON u.id=wf.sender_id
     WHERE wf.weekly_effort_id=$1 ORDER BY wf.created_at ASC`,
    [req.params.id],
  );
  return res.json({ feedback: rows });
});

export default router;

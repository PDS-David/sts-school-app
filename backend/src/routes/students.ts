import { Router } from 'express';
import { z } from 'zod';
import { createHash } from 'node:crypto';
import { query, withTransaction } from '../db/pool.js';
import { requireAuth, requirePerm, requireRole } from '../middleware/auth.js';
import { auditContextFromRequest, auditInTransaction, auditStrict } from '../utils/audit.js';
import { checkTeacherDeleteScope, checkTeacherRosterScope } from '../utils/scope.js';
import { resolveStudentRosterScope } from '../utils/studentRosterScope.js';
import { createStudentWithParent } from '../utils/parentProvisioning.js';
import type { PoolClient } from 'pg';
import type { AuthUser } from '../types/index.js';

const router = Router();
router.use(requireAuth);

type WardMutationScope =
  | { ok: true; schoolCode: string }
  | { ok: false; status: number; error: string };

/**
 * Lock the student row while changing its parent relationship. This makes
 * school/class authorization and the parent_wards write one consistent
 * operation with respect to concurrent student reassignment or soft-delete.
 */
async function lockWardMutationStudent(
  client: PoolClient,
  user: AuthUser,
  studentId: string,
): Promise<WardMutationScope> {
  const { rows } = await client.query(
    'SELECT school_code, class_name, deleted_at FROM students WHERE id=$1 FOR UPDATE',
    [studentId],
  );
  const student = rows[0];
  if (!student || student.deleted_at) {
    return { ok: false, status: 404, error: 'Active student not found' };
  }

  if (user.role === 'admin') {
    if (user.school_code && student.school_code !== user.school_code) {
      return { ok: false, status: 404, error: 'Active student not found' };
    }
    return { ok: true, schoolCode: student.school_code };
  }
  if (user.role !== 'teacher') {
    return { ok: false, status: 403, error: 'Not authorized to manage parent links' };
  }
  if (!user.school_code || student.school_code !== user.school_code) {
    return { ok: false, status: 403, error: "You can't manage parent links outside your school" };
  }
  if (user.assigned_class && student.class_name !== user.assigned_class) {
    return { ok: false, status: 403, error: "You can't manage parent links outside your assigned class" };
  }
  return { ok: true, schoolCode: student.school_code };
}

// ── GET /students  ────────────────────────────────────────────────────────────
router.get('/', requirePerm('students.read'), async (req, res) => {
  const { school_code, class_name, search } = req.query as Record<string, string>;
  const user = req.user!;

  // Resolve role-specific roster scope before constructing SQL. Finance
  // administrators must explicitly select a campus; teachers can never widen
  // their school/class scope with query parameters.
  const scope = resolveStudentRosterScope(user, { school_code, class_name });
  if ('error' in scope) return res.status(scope.status).json({ error: scope.error });
  const effectiveSchool = scope.schoolCode;
  const effectiveClass = scope.className;

  // Teachers browse only active physical report-roster memberships. Their
  // online student-account class is deliberately not used as report-roster
  // membership or as an authorization fallback.
  const teacherRosterJoin = user.role === 'teacher'
    ? ' JOIN report_roster_memberships rrm ON rrm.student_id=s.id AND rrm.status=\'active\''
    : '';
  let sql = `SELECT s.id,s.admission_number,s.full_name,
                    ${user.role === 'teacher' ? 'rrm.class_name' : 's.class_name'} AS class_name,
                    s.gender,s.date_of_birth,s.school_code,s.created_at
             FROM students s${teacherRosterJoin}
             WHERE s.deleted_at IS NULL`;
  const params: unknown[] = [];

  if (effectiveSchool) { params.push(effectiveSchool); sql += ` AND s.school_code=${params.length}`; }
  if (effectiveClass) {
    params.push(effectiveClass);
    sql += user.role === 'teacher'
      ? ` AND rrm.class_name=${params.length}`
      : ` AND s.class_name=${params.length}`;
  }
  if (user.role === 'teacher') sql += ' AND rrm.status=\'active\'';
  if (search) { params.push(`%${search}%`); sql += ` AND s.full_name ILIKE ${params.length}`; }

  sql += user.role === 'teacher'
    ? ' ORDER BY rrm.class_name, s.full_name'
    : ' ORDER BY s.class_name, s.full_name';
  const { rows } = await query(sql, params);
  return res.json({ students: rows });
});

// ── GET /students/wards  (parent's own children, for the child-switcher) ──────
// Deliberately its own route rather than reusing GET / — that one requires
// 'students.read', which parents don't have (they shouldn't be able to browse
// the whole school). This only ever returns rows joined through parent_wards
// for the calling parent's own id, so it can't leak other families' children.
router.get('/wards', async (req, res) => {
  if (req.user!.role !== 'parent') {
    return res.status(403).json({ error: 'Only parent accounts have wards' });
  }
  const { rows } = await query(
    `SELECT s.id, s.admission_number, s.full_name, s.class_name, s.school_code
     FROM students s
     JOIN parent_wards pw ON pw.student_id = s.id
     WHERE pw.parent_id = $1 AND s.deleted_at IS NULL
     ORDER BY s.full_name`,
    [req.user!.id],
  );
  return res.json({ wards: rows });
});

// ── GET /students/me  (student's own record, for self-lookup) ─────────────────
// Deliberately its own route rather than reusing GET / — that one requires
// 'students.read', which students don't have (they shouldn't be able to
// browse the class roster). Mirrors the /wards pattern for parents above.
// This is what MyResultsScreen.tsx calls to resolve its own student_id
// before hitting /scores/report/:student_id.
router.get('/me', async (req, res) => {
  if (req.user!.role !== 'student') {
    return res.status(403).json({ error: 'Only student accounts can use this route' });
  }
  const { rows } = await query(
    `SELECT id, admission_number, full_name, class_name, school_code
     FROM students WHERE user_id = $1 AND deleted_at IS NULL`,
    [req.user!.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'No student record linked to your account' });
  return res.json({ students: rows });
});

// ── GET /students/deleted  (admin only — for the restore screen) ─────────────
// Deliberately declared here, before GET /:id below — a wildcard single-
// segment route registered first would swallow this one, treating "deleted"
// as an :id (the same reason /wards and /me above are also declared before
// GET /:id, not after).
router.get('/deleted', requireRole('admin'), async (req, res) => {
  const { school_code } = req.query as Record<string, string>;
  const scope = resolveStudentRosterScope(req.user!, { school_code });
  if ('error' in scope) return res.status(scope.status).json({ error: scope.error });
  let sql = `SELECT s.id, s.admission_number, s.full_name, s.class_name, s.school_code,
                     s.deleted_at, u.full_name AS deleted_by_name, u.role AS deleted_by_role
              FROM students s
              LEFT JOIN users u ON u.id = s.deleted_by
              WHERE s.deleted_at IS NOT NULL`;
  const params: unknown[] = [];
  if (scope.schoolCode) { params.push(scope.schoolCode); sql += ` AND s.school_code=$${params.length}`; }
  sql += ' ORDER BY s.deleted_at DESC';
  const { rows } = await query(sql, params);
  return res.json({ students: rows });
});

// ── GET /students/:id ─────────────────────────────────────────────────────────
// Scoped the same way as GET /students: global admins see any student;
// school-bound admins and teachers are restricted to their own school_code.
// A requester outside that school gets 404 rather than 403, so the endpoint
// doesn't confirm that the record exists at all.
router.get('/:id', requirePerm('students.read'), async (req, res) => {
  const user = req.user!;
  const params: unknown[] = [req.params.id];
  let schoolClause = '';
  if (user.role !== 'admin' || user.school_code) {
    params.push(user.school_code);
    schoolClause = ` AND s.school_code=$${params.length}`;
  }
  // Admin can still open a soft-deleted student's detail page (needed to
  // show the "Restore" action) — everyone else gets a 404, same as if the
  // record never existed, matching every other non-admin scoping check.
  const deletedClause = user.role === 'admin' ? '' : ' AND s.deleted_at IS NULL';
  const { rows } = await query(
    `SELECT s.*,
            lu.username AS login_username,
            array_agg(json_build_object('parent_id',pw.parent_id,'name',pu.full_name,'phone',pu.phone))
              FILTER (WHERE pw.parent_id IS NOT NULL) AS parents
     FROM students s
     LEFT JOIN users lu ON lu.id = s.user_id
     LEFT JOIN parent_wards pw ON pw.student_id=s.id
     LEFT JOIN users pu ON pu.id=pw.parent_id
     WHERE s.id=$1${schoolClause}${deletedClause} GROUP BY s.id, lu.username`,
    params,
  );
  if (!rows[0]) return res.status(404).json({ error: 'Student not found' });
  return res.json({ student: rows[0] });
});

// ── POST /students ────────────────────────────────────────────────────────────
// ── POST /students  ───────────────────────────────────────────────────────────
// Bug found by live-testing this route (see checkTeacherRosterScope in
// scope.ts): this had no scope check at all — a teacher could create a
// student in any class, in any school, using only the generic grades.write
// permission every teacher has. checkTeacherRosterScope() now limits a
// non-admin teacher to their own school and (if they have one) their own
// assigned class. A school-bound admin is pinned to their school; only a
// global admin (school_code NULL) is unrestricted.
router.post('/', requirePerm('grades.write'), async (req, res) => {
  const schema = z.object({
    full_name:        z.string().min(2),
    class_name:       z.string(),
    school_code:      z.string(),
    gender:           z.enum(['M','F','Other']).optional(),
    date_of_birth:    z.string().optional(),
    admission_number: z.string().optional(),
    parent_name:      z.string().optional(),
    parent_phone: z.string().optional().refine((value) => {
      if (!value?.trim()) return true;
      const digits = value.replace(/\D/g, '');
      return digits.length >= 10 && digits.length <= 15;
    }, { message: 'Parent phone must contain between 10 and 15 digits' }),
    parent_email:     z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const d = parsed.data;
  const scopeError = checkTeacherRosterScope(req.user!, { school_code: d.school_code, class_name: d.class_name });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const result = await createStudentWithParent(
    {
      full_name: d.full_name,
      class_name: d.class_name,
      school_code: d.school_code,
      gender: d.gender ?? null,
      date_of_birth: d.date_of_birth ?? null,
      admission_number: d.admission_number ?? null,
    },
    d.parent_phone?.trim() ? {
      school_code: d.school_code,
      parent_name: d.parent_name ?? null,
      parent_phone: d.parent_phone,
      parent_email: d.parent_email ?? null,
    } : undefined,
    async (client, student, parentRecord) => {
      await auditInTransaction(
        client, req.user!, 'add_student', 'student', String(student.id), 'student record created',
        auditContextFromRequest(req, { schoolCode: d.school_code, metadata: { class_name: d.class_name, parent_linked: !!parentRecord } }),
      );
      if (parentRecord?.created) {
        await auditInTransaction(
          client, req.user!, 'add_parent_auto', 'user', parentRecord.id, 'parent account auto-provisioned',
          auditContextFromRequest(req, { schoolCode: d.school_code, metadata: { linked_student_id: String(student.id) } }),
        );
      }
    },
  );

  const studentId = String(result.student.id);
  let parent: { id: string; username: string; temporary_password?: string } | undefined;
  if (result.parent) {
    const { created, ...parentDetails } = result.parent;
    parent = parentDetails;
  }

  return res.status(201).json({ student: result.student, parent });
});

// ── PUT /students/:id ─────────────────────────────────────────────────────────
// Same bug, same fix as POST above: no scope check meant any teacher could
// edit any student anywhere. Reuses checkTeacherDeleteScope() (an alias of
// checkTeacherStudentScope) since editing an existing student's own-school/
// own-class rule is identical to the one already enforced for deleting one.
router.put('/:id', requirePerm('grades.write'), async (req, res) => {
  const scopeError = await checkTeacherDeleteScope(req.user!, req.params.id);
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const { full_name, class_name, gender, date_of_birth, admission_number } = req.body;
  const updated = await withTransaction(async (client) => {
    const { rows } = await client.query(
      `UPDATE students SET full_name=COALESCE($1,full_name), class_name=COALESCE($2,class_name),
              gender=COALESCE($3,gender), date_of_birth=COALESCE($4,date_of_birth),
              admission_number=COALESCE($5,admission_number)
       WHERE id=$6 AND deleted_at IS NULL AND ($7::text IS NULL OR school_code=$7) RETURNING *`,
      [full_name, class_name, gender, date_of_birth, admission_number, req.params.id, req.user!.school_code ?? null],
    );
    if (!rows[0]) return null;
    await auditInTransaction(
      client, req.user!, 'edit_student', 'student', rows[0].id, 'student record updated',
      auditContextFromRequest(req, { schoolCode: rows[0].school_code, metadata: { changed_fields: Object.keys(req.body ?? {}).filter(key => !/password|token|secret|pin/i.test(key)) } }),
    );
    return rows[0];
  });
  // A soft-deleted record can't be edited until it's restored.
  if (!updated) return res.status(404).json({ error: 'Student not found' });
  return res.json({ student: updated });
});

// ── POST /students/:id/promotion ──────────────────────────────────────────────
// End-of-term/session class movement — per explicit school-owner decision:
// this is the class teacher's call alone, with NO admin bypass (unlike every
// other roster action in this file, which also lets admin through). Admin
// can still change a student's class_name arbitrarily via the generic PUT
// /:id above if ever genuinely needed — this route is just the guided,
// one-tap Promote/Retain/Demote workflow for the one person whose job it
// actually is.
//
// "Next"/"previous" class is derived from the classes table's own row order
// within the student's school (see backend/schema.sql's classes table and
// seed.ts, which inserts PRIMARY_CLASSES/SECONDARY_CLASSES in exactly this
// progression) — there's no separate ordering column to define or keep in
// sync.
//
// students.class_name is still simply overwritten here (no enrolment-history
// table). Superseded earlier decision (DATA-03, owner decision D5 pending):
// past terms' class figures (class_average/class_highest/subject_position in
// GET /scores/report) used to follow the student's live class_name. They now
// use scores.class_name, stamped when each score is recorded (routes/scores.ts),
// and fall back to the live class only for rows with no stamp. Nothing is
// written to scores from this route.
router.post('/:id/promotion', requireRole('teacher'), async (req, res) => {
  const user = req.user!;
  const { action } = req.body as { action?: 'promote' | 'demote' | 'retain' | 'remove' | 'reinstate' };
  if (!action || !['promote', 'demote', 'retain', 'remove', 'reinstate'].includes(action)) {
    return res.status(400).json({ error: "action must be 'promote', 'demote', 'retain', 'remove', or 'reinstate'" });
  }

  const { rows: membershipRows } = await query(
    `SELECT s.id, s.full_name, s.school_code,
            m.class_name AS report_class_name, m.status
     FROM students s
     JOIN report_roster_memberships m ON m.student_id=s.id
     WHERE s.id=$1 AND s.deleted_at IS NULL`,
    [req.params.id],
  );
  const membership = membershipRows[0];
  if (!membership) return res.status(404).json({ error: 'Active report-roster membership not found' });

  // Decisions apply to the teacher's physical class only. The student's
  // online-learning class and login link are deliberately not consulted or
  // modified by this workflow.
  if (!user.school_code || membership.school_code !== user.school_code
      || !user.assigned_class || membership.report_class_name !== user.assigned_class) {
    return res.status(403).json({ error: 'You can only manage report-roster placement in your own assigned physical class' });
  }

  if (action === 'remove') {
    if (membership.status !== 'active') {
      return res.status(409).json({ error: 'Student is not currently active in the report roster' });
    }
    await withTransaction(async (client) => {
      await client.query(
        `UPDATE report_roster_memberships
         SET status='removed', removed_at=now(), changed_by=$1, updated_at=now()
         WHERE student_id=$2 AND status='active'`,
        [user.id, membership.id],
      );
      await client.query(
        `INSERT INTO report_roster_membership_events
           (student_id,event_type,from_class_name,actor_id,details)
         VALUES($1,'removed',$2,$3,$4::jsonb)`,
        [membership.id, membership.report_class_name, user.id, JSON.stringify({ reason: 'teacher_decision' })],
      );
      await auditInTransaction(client, user, 'remove_report_roster_membership', 'student', membership.id,
        'student removed from active physical report roster',
        auditContextFromRequest(req, { schoolCode: membership.school_code, metadata: { class_name: membership.report_class_name } }));
    });
    return res.json({ ok: true, action, class_name: membership.report_class_name, online_account_unchanged: true });
  }

  if (action === 'reinstate') {
    if (membership.status !== 'removed') {
      return res.status(409).json({ error: 'Student is already active in the report roster' });
    }
    await withTransaction(async (client) => {
      await client.query(
        `UPDATE report_roster_memberships
         SET status='active', removed_at=NULL, changed_by=$1, updated_at=now()
         WHERE student_id=$2 AND status='removed'`,
        [user.id, membership.id],
      );
      await client.query(
        `INSERT INTO report_roster_membership_events
           (student_id,event_type,to_class_name,actor_id,details)
         VALUES($1,'reinstated',$2,$3,$4::jsonb)`,
        [membership.id, membership.report_class_name, user.id, JSON.stringify({ reason: 'teacher_decision' })],
      );
      await auditInTransaction(client, user, 'reinstate_report_roster_membership', 'student', membership.id,
        'student reinstated in physical report roster',
        auditContextFromRequest(req, { schoolCode: membership.school_code, metadata: { class_name: membership.report_class_name } }));
    });
    return res.json({ ok: true, action, class_name: membership.report_class_name, online_account_unchanged: true });
  }

  if (membership.status !== 'active') {
    return res.status(409).json({ error: 'Only active report-roster students can be promoted, demoted, or retained' });
  }

  const fromClass = membership.report_class_name;
  if (action === 'retain') {
    await withTransaction(async (client) => {
      await client.query(
        'UPDATE report_roster_memberships SET changed_by=$1, updated_at=now() WHERE student_id=$2 AND status=\'active\'',
        [user.id, membership.id],
      );
      await client.query(
        `INSERT INTO report_roster_membership_events
           (student_id,event_type,from_class_name,to_class_name,actor_id,details)
         VALUES($1,'retained',$2,$2,$3,$4::jsonb)`,
        [membership.id, fromClass, user.id, JSON.stringify({ reason: 'teacher_decision' })],
      );
      await auditInTransaction(client, user, 'retain_report_roster_student', 'student', membership.id,
        'student retained in physical report class',
        auditContextFromRequest(req, { schoolCode: membership.school_code, metadata: { class_name: fromClass } }));
    });
    return res.json({ ok: true, action, from_class: fromClass, to_class: fromClass, online_account_unchanged: true });
  }

  const { rows: classRows } = await query(
    'SELECT name FROM classes WHERE school_code=$1 ORDER BY id ASC', [membership.school_code],
  );
  const names = classRows.map((r: any) => r.name);
  const idx = names.indexOf(fromClass);
  if (idx === -1) {
    return res.status(409).json({ error: `"${fromClass}" isn't in this school's class list, so it cannot be moved automatically.` });
  }
  const targetIdx = action === 'promote' ? idx + 1 : idx - 1;
  if (targetIdx < 0 || targetIdx >= names.length) {
    return res.status(400).json({
      error: action === 'promote'
        ? `"${fromClass}" is already the highest class.`
        : `"${fromClass}" is already the lowest class.`,
    });
  }
  const toClass = names[targetIdx];

  await withTransaction(async (client) => {
    await client.query(
      `UPDATE report_roster_memberships
       SET class_name=$1, changed_by=$2, updated_at=now()
       WHERE student_id=$3 AND status='active'`,
      [toClass, user.id, membership.id],
    );
    await client.query(
      `INSERT INTO report_roster_membership_events
         (student_id,event_type,from_class_name,to_class_name,actor_id,details)
       VALUES($1,'class_changed',$2,$3,$4,$5::jsonb)`,
      [membership.id, fromClass, toClass, user.id, JSON.stringify({ action })],
    );
    await auditInTransaction(client, user, action === 'promote' ? 'promote_report_roster_student' : 'demote_report_roster_student',
      'student', membership.id, 'physical report-roster class placement changed',
      auditContextFromRequest(req, { schoolCode: membership.school_code, metadata: { from_class: fromClass, to_class: toClass } }));
  });
  return res.json({ ok: true, action, from_class: fromClass, to_class: toClass, online_account_unchanged: true });
});

// ── DELETE /students/:id ──────────────────────────────────────────────────────
// Found in a hardening pass: this only ever required `grades.write` — the
// same permission every teacher has for routine score entry — so any teacher
// in the school (not just the student's own class/subject teacher) could
// permanently delete any student's record, and a hard DELETE meant every
// score/attendance/class-record/weekly-effort/submission/invoice tied to
// that student vanished with it, with no way back.
//
// Two changes:
//   1. checkTeacherDeleteScope() (an alias of the same scope check used for
//      score/attendance writes) now gates this — a teacher may delete a
//      student's record on their own, without admin approval, exactly when
//      that student is under their class or subject care; global admins are
//      unrestricted and school-bound admins are pinned to their school. A
//      teacher outside that relationship gets a 403, and (for a cross-school
//      id) a 404, matching the existing pattern elsewhere.
//   2. The delete itself is now a soft delete — the row stays, tagged
//      deleted_at/deleted_by, so historical scores/attendance still resolve
//      correctly and an admin can bring it back via POST /:id/restore. Every
//      audit entry records exactly who did it and what was deleted.
router.delete('/:id', requirePerm('grades.write'), async (req, res) => {
  const user = req.user!;
  const scopeError = await checkTeacherDeleteScope(user, req.params.id);
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const { rows } = await query(
    `UPDATE students SET deleted_at=now(), deleted_by=$1
     WHERE id=$2 AND deleted_at IS NULL AND ($3::text IS NULL OR school_code=$3) RETURNING full_name`,
    [user.id, req.params.id, user.school_code ?? null],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Student not found' });

  await auditStrict(
    user, 'delete_student', 'student', req.params.id,
    `${rows[0].full_name} (deleted by ${user.role}; recoverable via restore)`,
  );
  return res.json({ ok: true, restorable: true });
});

// ── POST /students/:id/restore  (admin only) ──────────────────────────────────
router.post('/:id/restore', requireRole('admin'), async (req, res) => {
  const { rows } = await query(
    `UPDATE students SET deleted_at=NULL, deleted_by=NULL
     WHERE id=$1 AND deleted_at IS NOT NULL AND ($2::text IS NULL OR school_code=$2) RETURNING full_name`,
    [req.params.id, req.user!.school_code ?? null],
  );
  if (!rows[0]) return res.status(404).json({ error: 'No deleted student found with that id' });
  await auditStrict(req.user!, 'restore_student', 'student', req.params.id, rows[0].full_name);
  return res.json({ ok: true, student: rows[0] });
});

// ── POST /students/:id/link-parent ────────────────────────────────────────────
router.post('/:id/link-parent', requirePerm('grades.write'), async (req, res) => {
  const studentId = z.string().uuid().safeParse(req.params.id);
  const body = z.object({ parent_id: z.string().uuid() }).safeParse(req.body);
  if (!studentId.success || !body.success) {
    return res.status(400).json({ error: 'A valid student id and parent_id are required' });
  }
  const parentId = body.data.parent_id;

  const result = await withTransaction(async (client) => {
    const { rows: parentRows } = await client.query(
      'SELECT role, is_active FROM users WHERE id=$1 FOR SHARE',
      [parentId],
    );
    if (parentRows[0]?.role !== 'parent' || !parentRows[0]?.is_active) {
      return { ok: false as const, status: 400, error: 'That user is not an active parent account' };
    }

    const scope = await lockWardMutationStudent(client, req.user!, studentId.data);
    if (!scope.ok) return scope;

    const { rows } = await client.query(
      `INSERT INTO parent_wards(parent_id,student_id)
       VALUES($1,$2) ON CONFLICT DO NOTHING RETURNING parent_id`,
      [parentId, studentId.data],
    );
    return { ok: true as const, linked: rows.length > 0 };
  });

  if (!result.ok) return res.status(result.status).json({ error: result.error });
  if (result.linked) {
    await auditStrict(req.user!, 'link_parent', 'student', studentId.data, `parent ${parentId}`);
  }
  return res.json({ ok: true, linked: result.linked });
});

// ── DELETE /students/:id/unlink-parent/:parentId ──────────────────────────────
router.delete('/:id/unlink-parent/:parentId', requirePerm('grades.write'), async (req, res) => {
  const studentId = z.string().uuid().safeParse(req.params.id);
  const parentId = z.string().uuid().safeParse(req.params.parentId);
  if (!studentId.success || !parentId.success) {
    return res.status(400).json({ error: 'Valid student and parent ids are required' });
  }

  const result = await withTransaction(async (client) => {
    const scope = await lockWardMutationStudent(client, req.user!, studentId.data);
    if (!scope.ok) return scope;

    const { rows } = await client.query(
      'DELETE FROM parent_wards WHERE student_id=$1 AND parent_id=$2 RETURNING parent_id',
      [studentId.data, parentId.data],
    );
    return { ok: true as const, unlinked: rows.length > 0 };
  });

  if (!result.ok) return res.status(result.status).json({ error: result.error });
  if (result.unlinked) {
    await auditStrict(req.user!, 'unlink_parent', 'student', studentId.data, `parent ${parentId.data}`);
  }
  return res.json({ ok: true, unlinked: result.unlinked });
});

// ── POST /students/:id/link-user  (attach a student's own login) ─────────────
// A login and a student record must have a one-to-one relationship. Lock the
// user and all affected student rows in a stable order so concurrent admin
// requests cannot silently overwrite a link or attach one login twice.
router.post('/:id/link-user', requireRole('admin'), async (req, res) => {
  const studentId = z.string().uuid().safeParse(req.params.id);
  const body = z.object({ user_id: z.string().uuid() }).safeParse(req.body);
  if (!studentId.success || !body.success) {
    return res.status(400).json({ error: 'A valid student id and user_id are required' });
  }
  const userId = body.data.user_id;

  let result: {
    ok: true;
    student: { id: string; user_id: string };
    linked: boolean;
  } | {
    ok: false;
    status: number;
    error: string;
  };
  try {
    result = await withTransaction(async (client) => {
      const { rows: userRows } = await client.query(
        'SELECT role, is_active, school_code FROM users WHERE id=$1 FOR UPDATE',
        [userId],
      );
      if (userRows[0]?.role !== 'student' || !userRows[0]?.is_active) {
        return { ok: false as const, status: 400, error: 'That user is not an active student account' };
      }

      // Lock the requested student and any existing link for this user.
      // ORDER BY gives conflicting assignments the same lock order and avoids
      // deadlocks when two administrators submit competing requests.
      const { rows: affectedStudents } = await client.query(
        `SELECT id, user_id, deleted_at, school_code
           FROM students
          WHERE id=$1 OR user_id=$2
          ORDER BY id
          FOR UPDATE`,
        [studentId.data, userId],
      );
      const target = affectedStudents.find(row => row.id === studentId.data);
      if (!target || target.deleted_at ||
          (req.user!.school_code && target.school_code !== req.user!.school_code)) {
        return { ok: false as const, status: 404, error: 'Active student not found' };
      }
      if (userRows[0].school_code !== target.school_code) {
        return { ok: false as const, status: 400, error: 'The student login belongs to a different school' };
      }
      if (target.user_id && target.user_id !== userId) {
        return { ok: false as const, status: 409, error: 'This student is already linked to a different login; unlink it first' };
      }
      const existing = affectedStudents.find(row => row.id !== studentId.data && row.user_id === userId);
      if (existing) {
        return { ok: false as const, status: 409, error: 'That login is already linked to a different student' };
      }

      if (target.user_id === userId) {
        return { ok: true as const, student: { id: target.id, user_id: target.user_id }, linked: false };
      }
      const { rows } = await client.query(
        'UPDATE students SET user_id=$1 WHERE id=$2 RETURNING id, user_id',
        [userId, studentId.data],
      );
      return { ok: true as const, student: rows[0], linked: true };
    });
  } catch (error) {
    const dbError = error as { code?: string; constraint?: string };
    if (dbError.code === '23505' && dbError.constraint === 'students_user_id_key') {
      return res.status(409).json({ error: 'That login is already linked to a different student' });
    }
    throw error;
  }

  if (!result.ok) return res.status(result.status).json({ error: result.error });
  if (result.linked) {
    await auditStrict(req.user!, 'link_student_user', 'student', studentId.data, `user ${userId}`);
  }
  return res.json({ ok: true, student: result.student, linked: result.linked });
});

// ── DELETE /students/:id/unlink-user ──────────────────────────────────────────
router.delete('/:id/unlink-user', requireRole('admin'), async (req, res) => {
  const studentId = z.string().uuid().safeParse(req.params.id);
  if (!studentId.success) return res.status(400).json({ error: 'A valid student id is required' });

  const result = await withTransaction(async (client) => {
    const { rows } = await client.query(
      'SELECT user_id FROM students WHERE id=$1 AND ($2::text IS NULL OR school_code=$2) FOR UPDATE',
      [studentId.data, req.user!.school_code ?? null],
    );
    if (!rows[0]) return { ok: false as const, status: 404, error: 'Student not found' };
    if (!rows[0].user_id) return { ok: true as const, unlinked: false };
    await client.query('UPDATE students SET user_id=NULL WHERE id=$1', [studentId.data]);
    return { ok: true as const, unlinked: true };
  });
  if (!result.ok) return res.status(result.status).json({ error: result.error });
  if (result.unlinked) {
    await auditStrict(req.user!, 'unlink_student_user', 'student', studentId.data, '');
  }
  return res.json({ ok: true, unlinked: result.unlinked });
});

// ── POST /students/:id/erasure  (admin only) ──────────────────────────────────
// OPS-04 (owner decision D7, recommended default: soft delete + PII redaction,
// history retained). This is NOT hard deletion: the students row, its id,
// school_code and class_name stay, so scores, attendance, remarks, weekly
// efforts, invoices and submissions keep pointing at a valid row and academic
// and financial history remain internally consistent.
//
// What changes on the students row (these are the only personal columns the
// table has — there is no phone, email or birth_date column on it):
//   full_name        -> 'Erased student'
//   gender           -> NULL
//   date_of_birth    -> NULL
//   admission_number -> 'ERASED-<12 hex of sha256(id)>' (deterministic, not
//                       reversible, unique per student so the per-school
//                       unique constraint on (school_code, admission_number)
//                       still holds)
//   deleted_at/by    -> set only if the student was not already soft-deleted
//
// Trade-off, by design: every existing read that joins students will now show
// "Erased student" instead of the historical name (reports, finance lists,
// assessment results, Excel export). Restoring an erased student
// (POST /:id/restore) is still possible but does NOT bring the redacted
// values back; they are not kept anywhere, including the audit row.
//
// Not touched here (see evidence/OPS-04.md): the student's own login in
// `users` (name, username, phone, email), parent links, and any free text
// that other tables hold (remarks, weekly-effort comments, submission answers,
// messages).
const ERASED_NAME = 'Erased student';
const erasedAdmissionToken = (id: string) =>
  'ERASED-' + createHash('sha256').update(id).digest('hex').slice(0, 12);

const erasureSchema = z.object({
  // Must equal the student's current admission number (or, when the student
  // has none, their current full name). The expected value is never echoed.
  confirmation: z.string().trim().min(1),
  // Free text kept in the audit log. Do not put the student's personal
  // details in it: the audit row is retained.
  reason: z.string().trim().min(5).max(500),
});
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

router.post('/:id/erasure', requireRole('admin'), async (req, res) => {
  const user = req.user!;
  const id = req.params.id;
  if (!UUID_RE.test(id)) return res.status(404).json({ error: 'Student not found' });

  const parsed = erasureSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'confirmation and reason (5-500 characters) are required' });
  }
  const { confirmation, reason } = parsed.data;

  type Outcome =
    | { status: number; error: string }
    | { status: 200; alreadyErased: boolean; student: Record<string, unknown> };

  const outcome: Outcome = await withTransaction(async (client): Promise<Outcome> => {
    const { rows } = await client.query(
      `SELECT id, school_code, class_name, admission_number, full_name, gender,
              date_of_birth, deleted_at
       FROM students WHERE id=$1 FOR UPDATE`,
      [id],
    );
    const st = rows[0];
    if (!st) return { status: 404, error: 'Student not found' };

    // An admin bound to a school may only erase that school's students. An
    // admin with no school_code is cross-school everywhere else in the app
    // (scope.ts), so it is not restricted here either.
    if (user.school_code && st.school_code !== user.school_code) {
      return { status: 403, error: "You can't erase a student outside your school" };
    }

    const expected = st.admission_number ?? st.full_name;
    if (confirmation !== expected) {
      return { status: 400, error: 'Confirmation does not match this student' };
    }

    const token = erasedAdmissionToken(st.id);
    const alreadyErased =
      st.full_name === ERASED_NAME && st.admission_number === token &&
      st.gender === null && st.date_of_birth === null && st.deleted_at !== null;

    // Field NAMES only, never the old values.
    const fieldsChanged: string[] = [];
    if (!alreadyErased) {
      if (st.full_name !== ERASED_NAME) fieldsChanged.push('full_name');
      if (st.gender !== null) fieldsChanged.push('gender');
      if (st.date_of_birth !== null) fieldsChanged.push('date_of_birth');
      if (st.admission_number !== token) fieldsChanged.push('admission_number');
      if (st.deleted_at === null) fieldsChanged.push('deleted_at', 'deleted_by');
    }

    let result = { ...st };
    if (!alreadyErased) {
      const { rows: updated } = await client.query(
        `UPDATE students
            SET full_name=$2, gender=NULL, date_of_birth=NULL, admission_number=$3,
                deleted_by = CASE WHEN deleted_at IS NULL THEN $4::uuid ELSE deleted_by END,
                deleted_at = COALESCE(deleted_at, now())
          WHERE id=$1
          RETURNING id, school_code, class_name, admission_number, full_name, deleted_at`,
        [id, ERASED_NAME, token, user.id],
      );
      result = updated[0];
    }

    // Written inside the same transaction (not via utils/audit.ts, which
    // swallows failures): an erasure with no audit row must not commit.
    await client.query(
      `INSERT INTO audit_log(actor_id, actor_name, action, entity, entity_id, school_code, detail)
       VALUES ($1,$2,'erase_student','student',$3,$4,$5)`,
      [
        user.id, user.username, id, st.school_code,
        JSON.stringify({ reason, fields_changed: fieldsChanged, already_erased: alreadyErased }),
      ],
    );

    return {
      status: 200,
      alreadyErased,
      student: {
        id: result.id, school_code: result.school_code, class_name: result.class_name,
        admission_number: result.admission_number, full_name: result.full_name,
        deleted_at: result.deleted_at,
      },
    };
  });

  if (outcome.status !== 200) {
    const o = outcome as { status: number; error: string };
    return res.status(o.status).json({ error: o.error });
  }
  const done = outcome as { status: 200; alreadyErased: boolean; student: Record<string, unknown> };
  return res.json({ ok: true, erased: true, already_erased: done.alreadyErased, student: done.student });
});

export default router;

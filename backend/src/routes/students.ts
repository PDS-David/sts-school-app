import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { requireAuth, requirePerm, requireRole } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';
import { checkTeacherDeleteScope, checkTeacherRosterScope } from '../utils/scope.js';
import { findOrCreateParent, linkParentToStudent, type ProvisionedParent } from '../utils/parentProvisioning.js';

const router = Router();
router.use(requireAuth);

// ── GET /students  ────────────────────────────────────────────────────────────
router.get('/', requirePerm('students.read'), async (req, res) => {
  const { school_code, class_name, search } = req.query as Record<string, string>;
  const user = req.user!;

  // Scope: teachers see their own class; admin sees all. finance_admin also
  // has school_code=NULL and needs to pick a student when creating an
  // invoice, so it gets the same explicit-school-code override as admin.
  const effectiveSchool = (user.role === 'admin' || user.role === 'finance_admin') ? (school_code ?? user.school_code) : user.school_code;
  const effectiveClass  = user.role === 'teacher' ? (user.assigned_class ?? class_name) : class_name;

  // A teacher who is a class teacher (assigned_class set) is always pinned
  // to their own class above, same as before — a hybrid teacher (also has
  // an assigned_subject_id) does NOT get widened here; per product decision,
  // "class teacher" access to student records stays class-scoped no matter
  // what else that teacher is also assigned to teach. A teacher who is NOT
  // a class teacher at all (pure subject specialist, or an edge-case
  // account with neither) has no class of their own to fall back to, so
  // effectiveClass above resolves to whatever `class_name` they passed —
  // and if they passed none, it was silently falling through to "no class
  // filter", i.e. the FULL roster of every class in the school (names,
  // admission numbers, dates of birth) in one shot. checkTeacherContentScope
  // already lets a subject teacher publish content for any class in their
  // subject without needing to browse the whole school's students to do it,
  // so there's no legitimate case that needs this default. A non-class
  // teacher must now explicitly name the one class they want; nothing is
  // returned until they do.
  if (user.role === 'teacher' && !user.assigned_class && !effectiveClass) {
    return res.json({ students: [] });
  }

  let sql = `SELECT s.id,s.admission_number,s.full_name,s.class_name,s.gender,s.date_of_birth,
                    s.school_code,s.created_at
             FROM students s WHERE s.deleted_at IS NULL`;
  const params: unknown[] = [];

  if (effectiveSchool) { params.push(effectiveSchool); sql += ` AND s.school_code=$${params.length}`; }
  if (effectiveClass)  { params.push(effectiveClass);  sql += ` AND s.class_name=$${params.length}`; }
  if (search)          { params.push(`%${search}%`);   sql += ` AND s.full_name ILIKE $${params.length}`; }

  sql += ' ORDER BY s.class_name, s.full_name';
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
  let sql = `SELECT s.id, s.admission_number, s.full_name, s.class_name, s.school_code,
                    s.deleted_at, u.full_name AS deleted_by_name, u.role AS deleted_by_role
             FROM students s
             LEFT JOIN users u ON u.id = s.deleted_by
             WHERE s.deleted_at IS NOT NULL`;
  const params: unknown[] = [];
  if (school_code) { params.push(school_code); sql += ` AND s.school_code=$${params.length}`; }
  sql += ' ORDER BY s.deleted_at DESC';
  const { rows } = await query(sql, params);
  return res.json({ students: rows });
});

// ── GET /students/:id ─────────────────────────────────────────────────────────
// Scoped the same way as GET /students: admin sees any student, everyone
// else (teacher) is restricted to their own school_code. A non-admin
// requesting a student outside their school gets 404 rather than 403, so
// the endpoint doesn't confirm the record exists at all.
router.get('/:id', requirePerm('students.read'), async (req, res) => {
  const user = req.user!;
  const params: unknown[] = [req.params.id];
  let schoolClause = '';
  if (user.role !== 'admin') {
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
// assigned class. Admin is unrestricted.
router.post('/', requirePerm('grades.write'), async (req, res) => {
  const schema = z.object({
    full_name:        z.string().min(2),
    class_name:       z.string(),
    school_code:      z.string(),
    gender:           z.enum(['M','F','Other']).optional(),
    date_of_birth:    z.string().optional(),
    admission_number: z.string().optional(),
    // Optional — when given, a parent account is found (by phone, scoped to
    // this school — siblings share one account) or auto-created and linked.
    // See utils/parentProvisioning.ts.
    parent_name:      z.string().optional(),
    parent_phone:     z.string().optional(),
    parent_email:     z.string().optional(),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const d = parsed.data;
  const scopeError = checkTeacherRosterScope(req.user!, { school_code: d.school_code, class_name: d.class_name });
  if (scopeError) return res.status(scopeError.status).json({ error: scopeError.error });

  const { rows } = await query(
    `INSERT INTO students(full_name,class_name,school_code,gender,date_of_birth,admission_number)
     VALUES($1,$2,$3,$4,$5,$6) RETURNING *`,
    [d.full_name, d.class_name, d.school_code, d.gender ?? null, d.date_of_birth ?? null, d.admission_number ?? null],
  );
  await audit(req.user!, 'add_student', 'student', rows[0].id, d.full_name);

  let parent: ProvisionedParent | undefined;
  if (d.parent_phone?.trim()) {
    parent = await findOrCreateParent(req.user!, {
      school_code: d.school_code,
      parent_name: d.parent_name ?? null,
      parent_phone: d.parent_phone,
      parent_email: d.parent_email ?? null,
    });
    await linkParentToStudent(parent.id, rows[0].id);
  }

  return res.status(201).json({ student: rows[0], parent });
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
  const { rows } = await query(
    `UPDATE students SET full_name=COALESCE($1,full_name), class_name=COALESCE($2,class_name),
            gender=COALESCE($3,gender), date_of_birth=COALESCE($4,date_of_birth),
            admission_number=COALESCE($5,admission_number)
     WHERE id=$6 AND deleted_at IS NULL RETURNING *`,
    [full_name, class_name, gender, date_of_birth, admission_number, req.params.id],
  );
  // A soft-deleted record can't be edited until it's restored — the same
  // WHERE ... AND deleted_at IS NULL above means this 404 also covers "id
  // doesn't exist", exactly like every other scoped lookup in this file.
  if (!rows[0]) return res.status(404).json({ error: 'Student not found' });
  await audit(req.user!, 'edit_student', 'student', rows[0].id, full_name);
  return res.json({ student: rows[0] });
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
//      that student is under their class or subject care; admin is always
//      allowed. A teacher outside that relationship gets a 403, and (for a
//      cross-school id) a 404, matching the existing pattern elsewhere.
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
     WHERE id=$2 AND deleted_at IS NULL RETURNING full_name`,
    [user.id, req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Student not found' });

  await audit(
    user, 'delete_student', 'student', req.params.id,
    `${rows[0].full_name} (deleted by ${user.role}; recoverable via restore)`,
  );
  return res.json({ ok: true, restorable: true });
});

// ── POST /students/:id/restore  (admin only) ──────────────────────────────────
router.post('/:id/restore', requireRole('admin'), async (req, res) => {
  const { rows } = await query(
    `UPDATE students SET deleted_at=NULL, deleted_by=NULL
     WHERE id=$1 AND deleted_at IS NOT NULL RETURNING full_name`,
    [req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'No deleted student found with that id' });
  await audit(req.user!, 'restore_student', 'student', req.params.id, rows[0].full_name);
  return res.json({ ok: true, student: rows[0] });
});

// ── POST /students/:id/link-parent ────────────────────────────────────────────
router.post('/:id/link-parent', requirePerm('grades.write'), async (req, res) => {
  const { parent_id } = req.body as { parent_id: string };
  const { rows: pu } = await query(`SELECT role FROM users WHERE id=$1`, [parent_id]);
  if (pu[0]?.role !== 'parent') return res.status(400).json({ error: 'That user is not a parent account' });
  await query(
    `INSERT INTO parent_wards(parent_id,student_id) VALUES($1,$2) ON CONFLICT DO NOTHING`,
    [parent_id, req.params.id],
  );
  await audit(req.user!, 'link_parent', 'student', req.params.id, `parent ${parent_id}`);
  return res.json({ ok: true });
});

// ── DELETE /students/:id/unlink-parent/:parentId ──────────────────────────────
router.delete('/:id/unlink-parent/:parentId', requirePerm('grades.write'), async (req, res) => {
  await query(`DELETE FROM parent_wards WHERE student_id=$1 AND parent_id=$2`, [req.params.id, req.params.parentId]);
  await audit(req.user!, 'unlink_parent', 'student', req.params.id, `parent ${req.params.parentId}`);
  return res.json({ ok: true });
});

// ── POST /students/:id/link-user  (attach a student's own login) ─────────────
// Without this, a "student" role account created in Admin > Users has no way
// to be connected to an actual students row — every screen that looks the
// student up via their user id (taking assessments, viewing their own report
// card, messaging contacts) would come back empty for that account.
router.post('/:id/link-user', requireRole('admin'), async (req, res) => {
  const { user_id } = req.body as { user_id: string };
  const { rows: uRows } = await query(`SELECT role FROM users WHERE id=$1`, [user_id]);
  if (uRows[0]?.role !== 'student') {
    return res.status(400).json({ error: 'That user is not a student account' });
  }
  const { rows: already } = await query(`SELECT id FROM students WHERE user_id=$1`, [user_id]);
  if (already[0] && already[0].id !== req.params.id) {
    return res.status(409).json({ error: 'That login is already linked to a different student' });
  }
  const { rows } = await query(
    `UPDATE students SET user_id=$1 WHERE id=$2 RETURNING id, user_id`,
    [user_id, req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Student not found' });
  await audit(req.user!, 'link_student_user', 'student', req.params.id, `user ${user_id}`);
  return res.json({ ok: true, student: rows[0] });
});

// ── DELETE /students/:id/unlink-user ──────────────────────────────────────────
router.delete('/:id/unlink-user', requireRole('admin'), async (req, res) => {
  const { rows } = await query(`UPDATE students SET user_id=NULL WHERE id=$1 RETURNING id`, [req.params.id]);
  if (!rows[0]) return res.status(404).json({ error: 'Student not found' });
  await audit(req.user!, 'unlink_student_user', 'student', req.params.id, '');
  return res.json({ ok: true });
});

export default router;

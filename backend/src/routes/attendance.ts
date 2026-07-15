import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireAuth, requirePerm } from '../middleware/auth.js';
import { hasPerm } from '../utils/rbac.js';
import { audit } from '../utils/audit.js';
import { checkTeacherStudentScope } from '../utils/scope.js';

const router = Router();
router.use(requireAuth);

// Found live in Pass 10: neither PUT /attendance nor PUT /attendance/bulk
// validated `days_present` at all — not even that it's a non-negative
// number, let alone that it fits within the term's own `days_opened`.
// Live-verified before this fix: -5 and 9999 (term's days_opened was 60)
// both saved without error, silently producing an attendance percentage
// over 100% (or negative) on every report that reads this row. This
// mirrors the same "school config caps the value" shape scores.ts already
// handles for ca1/ca2/exam — same fix pattern here, scoped to the term's
// days_opened instead of a school-level max.
async function getDaysOpened(termId: number): Promise<number | null> {
  const { rows } = await query('SELECT days_opened FROM terms WHERE id=$1', [termId]);
  return rows[0]?.days_opened ?? null;
}
function validateDaysPresent(days_present: unknown, daysOpened: number | null): string | null {
  if (typeof days_present !== 'number' || !Number.isFinite(days_present) || !Number.isInteger(days_present)) {
    return 'days_present must be a whole number';
  }
  if (days_present < 0) return 'days_present cannot be negative';
  if (daysOpened !== null && days_present > daysOpened) {
    return `days_present (${days_present}) cannot exceed the term's days_opened (${daysOpened})`;
  }
  return null;
}

// ── PUT /attendance  (upsert days present) ────────────────────────────────────
router.put('/', requirePerm('attendance.write'), async (req, res) => {
  const { student_id, term_id, days_present } = req.body as {
    student_id: string; term_id: number; days_present: number;
  };
  if (!student_id || !term_id || days_present === undefined) {
    return res.status(400).json({ error: 'student_id, term_id, days_present required' });
  }
  const scopeViolation = await checkTeacherStudentScope(req.user!, student_id, term_id);
  if (scopeViolation) return res.status(scopeViolation.status).json({ error: scopeViolation.error });

  const daysOpened = await getDaysOpened(term_id);
  const validationError = validateDaysPresent(days_present, daysOpened);
  if (validationError) return res.status(400).json({ error: validationError });

  const { rows } = await query(
    `INSERT INTO attendance(student_id,term_id,days_present) VALUES($1,$2,$3)
     ON CONFLICT(student_id,term_id) DO UPDATE SET days_present=$3 RETURNING *`,
    [student_id, term_id, days_present],
  );
  // Wasn't audited at all before this pass — "who marked attendance" had no
  // record anywhere except whatever the number itself implies.
  await audit(req.user!, 'save_attendance', 'attendance', String(rows[0].id));
  return res.json({ attendance: rows[0] });
});

// ── GET /attendance?class_name=&term_id=  (existing values, for editing) ─────
// There was previously no way to read attendance back at all — the mobile
// screen's own code had a "(In production: fetch existing attendance records
// here)" comment where this call should have been, meaning it always showed
// blank inputs even when a class/term already had data saved.
router.get('/', requirePerm('attendance.read'), async (req, res) => {
  const { class_name, term_id } = req.query as Record<string, string>;
  const user = req.user!;
  const effectiveClass = user.role === 'teacher' ? (user.assigned_class ?? class_name) : class_name;

  if (!effectiveClass || !term_id) {
    return res.status(400).json({ error: 'class_name and term_id are required' });
  }

  const { rows } = await query(
    `SELECT a.student_id, a.days_present
     FROM attendance a
     JOIN students s ON s.id = a.student_id
     WHERE s.class_name = $1 AND a.term_id = $2
       AND ($3::text IS NULL OR s.school_code = $3)`,
    [effectiveClass, term_id, user.school_code ?? null],
  );
  return res.json({ attendance: rows });
});

// ── PUT /attendance/bulk  (whole class at once) ───────────────────────────────
router.put('/bulk', requirePerm('attendance.write'), async (req, res) => {
  const { entries, term_id } = req.body as {
    term_id: number;
    entries: Array<{ student_id: string; days_present: number }>;
  };
  if (!Array.isArray(entries) || !entries.length || !term_id) {
    return res.status(400).json({ error: 'term_id and a non-empty entries array are required' });
  }
  const uniqueStudentIds = [...new Set(entries.map(e => e.student_id))];
  for (const sid of uniqueStudentIds) {
    const scopeViolation = await checkTeacherStudentScope(req.user!, sid, term_id);
    if (scopeViolation) return res.status(scopeViolation.status).json({ error: scopeViolation.error });
  }

  // Validate every entry against the batch's single term before writing any
  // of it — same all-or-nothing approach as the scope check just above.
  const daysOpened = await getDaysOpened(term_id);
  for (const e of entries) {
    const validationError = validateDaysPresent(e.days_present, daysOpened);
    if (validationError) {
      return res.status(400).json({ error: `${validationError} (student ${e.student_id})` });
    }
  }

  for (const e of entries) {
    await query(
      `INSERT INTO attendance(student_id,term_id,days_present) VALUES($1,$2,$3)
       ON CONFLICT(student_id,term_id) DO UPDATE SET days_present=$3`,
      [e.student_id, term_id, e.days_present],
    );
  }
  // Wasn't audited at all before this pass, same gap as the single route
  // above — one summary entry per batch, not one per student.
  await audit(req.user!, 'save_attendance_bulk', 'attendance', undefined, `${entries.length} student(s), term ${term_id}`);
  return res.json({ saved: entries.length });
});

// ── GET /class-records/:student_id/:term_id  (single record) ─────────────────
// NOTE: deliberately NOT gated by requirePerm('classRecord.read') — that
// permission also guards the *bulk* whole-class listing below, which must
// stay teacher/admin-only. Granting it to student/parent would leak every
// other student's remarks via that route. Instead this route does its own
// per-request ownership check, mirroring GET /scores/report/:student_id:
// student sees only their own record, parent only a linked ward's, teacher
// only their own school, admin sees all.
router.get('/class-records/:student_id/:term_id', async (req, res) => {
  const { student_id, term_id } = req.params;
  const user = req.user!;

  const { rows: stRows } = await query('SELECT * FROM students WHERE id=$1', [student_id]);
  const student = stRows[0];
  if (!student) return res.status(404).json({ error: 'Student not found' });

  if (user.role === 'student') {
    if (student.user_id !== user.id) return res.status(403).json({ error: 'Access denied' });
  } else if (user.role === 'parent') {
    const { rows: pw } = await query(
      'SELECT 1 FROM parent_wards WHERE parent_id=$1 AND student_id=$2', [user.id, student.id],
    );
    if (!pw.length) return res.status(403).json({ error: 'Not your ward' });
  } else if (user.role === 'teacher') {
    if (!hasPerm(user.role, 'classRecord.read')) return res.status(403).json({ error: 'Permission denied: classRecord.read' });
    if (student.school_code !== user.school_code) return res.status(403).json({ error: 'Wrong school' });
  } else if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { rows } = await query(
    `SELECT * FROM class_records WHERE student_id=$1 AND term_id=$2`,
    [student_id, term_id],
  );
  return res.json({ class_record: rows[0] ?? null });
});

// ── GET /class-records?class_name=&term_id=  (whole class, for teacher/admin review) ─
router.get('/class-records', requirePerm('classRecord.read'), async (req, res) => {
  const { class_name, term_id } = req.query as Record<string, string>;
  const user = req.user!;
  const effectiveClass = user.role === 'teacher' ? (user.assigned_class ?? class_name) : class_name;

  if (!effectiveClass || !term_id) {
    return res.status(400).json({ error: 'class_name and term_id are required' });
  }

  const { rows } = await query(
    `SELECT cr.*, s.full_name, s.class_name
     FROM class_records cr
     JOIN students s ON s.id = cr.student_id
     WHERE s.class_name = $1 AND cr.term_id = $2
     ORDER BY s.full_name`,
    [effectiveClass, term_id],
  );
  return res.json({ class_records: rows });
});

// ── PUT /class-records  (teacher/admin remarks) ───────────────────────────────
router.put('/class-records', requirePerm('classRecord.write'), async (req, res) => {
  const { student_id, term_id, class_teacher_remark, admin_remark } = req.body as {
    student_id: string; term_id: number;
    class_teacher_remark?: string; admin_remark?: string;
  };
  // admin_remark is the head teacher/principal's field — only an admin
  // account may set it. The mobile UI already hides this field from
  // teachers, but that's client-side only; enforce it here too, since a
  // teacher could otherwise call this endpoint directly and write it anyway
  // (verified live before this fix).
  if (admin_remark !== undefined && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Only an admin can set the head teacher/principal remark' });
  }
  const scopeViolation = await checkTeacherStudentScope(req.user!, student_id, term_id);
  if (scopeViolation) return res.status(scopeViolation.status).json({ error: scopeViolation.error });

  const { rows } = await query(
    `INSERT INTO class_records(student_id,term_id,class_teacher_remark,admin_remark,updated_at)
     VALUES($1,$2,$3,$4,now())
     ON CONFLICT(student_id,term_id)
     DO UPDATE SET class_teacher_remark=COALESCE($3,class_records.class_teacher_remark),
                   admin_remark=COALESCE($4,class_records.admin_remark),
                   updated_at=now()
     RETURNING *`,
    [student_id, term_id, class_teacher_remark ?? null, admin_remark ?? null],
  );
  await audit(req.user!, 'save_class_record', 'class_record', String(rows[0].id));
  return res.json({ class_record: rows[0] });
});

export default router;

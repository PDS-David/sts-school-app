import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';

// PRD-01 (owner decision D8: read-only announcements, admin writes, targeted
// by role and/or class, no push). Reads are scoped in SQL to the viewer's own
// school; there is no school or class parameter on GET.
const router = Router();
router.use(requireAuth);

const COLUMNS = 'a.id, a.title, a.body, a.audience_role, a.class_name, a.created_by, a.created_at, a.expires_at';
const LIVE = '(a.expires_at IS NULL OR a.expires_at > now())';
const LIMIT = 50;

// ── GET /announcements ────────────────────────────────────────────────────────
// student  : the school and class of their own (non-deleted) students row
// parent   : the school and class of ANY ward (non-deleted); school-wide
//            (class_name NULL) notices of a ward's school also match
// teacher  : their own school; class_name NULL or their assigned_class
// admin    : everything in their school; an admin with no school_code (cross-
//            school everywhere else in the app) sees every school, optionally
//            narrowed with ?school_code=
// anyone else (finance_admin has no school_code) : nothing — fails closed
// Every branch also requires audience_role IS NULL or = the viewer's role,
// and an unexpired notice.
router.get('/', async (req, res) => {
  const user = req.user!;
  let rows: unknown[] = [];

  if (user.role === 'student' || user.role === 'parent') {
    const wardPredicate = user.role === 'student'
      ? 's.user_id = $1'
      : 's.id IN (SELECT student_id FROM parent_wards WHERE parent_id = $1)';
    ({ rows } = await query(
      `SELECT ${COLUMNS} FROM announcements a
        WHERE ${LIVE}
          AND (a.audience_role IS NULL OR a.audience_role = $2)
          AND EXISTS (
            SELECT 1 FROM students s
             WHERE ${wardPredicate}
               AND s.deleted_at IS NULL
               AND s.school_code = a.school_code
               AND (a.class_name IS NULL OR a.class_name = s.class_name)
          )
        ORDER BY a.created_at DESC LIMIT ${LIMIT}`,
      [user.id, user.role],
    ));
  } else if (user.role === 'teacher') {
    if (user.school_code) {
      ({ rows } = await query(
        `SELECT ${COLUMNS} FROM announcements a
          WHERE ${LIVE}
            AND a.school_code = $1
            AND (a.audience_role IS NULL OR a.audience_role = 'teacher')
            AND (a.class_name IS NULL OR a.class_name = $2::text)
          ORDER BY a.created_at DESC LIMIT ${LIMIT}`,
        [user.school_code, user.assigned_class ?? null],
      ));
    }
  } else if (user.role === 'admin') {
    const requested = typeof req.query.school_code === 'string' ? req.query.school_code : undefined;
    const school = user.school_code ?? requested ?? null;
    ({ rows } = await query(
      `SELECT ${COLUMNS} FROM announcements a
        WHERE ${LIVE}
          AND ($1::text IS NULL OR a.school_code = $1::text)
        ORDER BY a.created_at DESC LIMIT ${LIMIT}`,
      [school],
    ));
  }

  return res.json({ announcements: rows });
});

// ── POST /announcements  (admin only) ─────────────────────────────────────────
const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(5000),
  audience_role: z.enum(['student', 'parent', 'teacher', 'finance_admin']).nullish(),
  class_name: z.string().trim().min(1).max(100).nullish(),
  expires_at: z.string().datetime({ offset: true }).nullish(),
  school_code: z.string().trim().min(1).max(50).nullish(),
});

router.post('/', requireRole('admin'), async (req, res) => {
  const user = req.user!;
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid announcement: ' + parsed.error.issues.map(i => i.path.join('.') || 'body').join(', ') });
  }
  const d = parsed.data;

  // A school-bound admin always posts to their own school; naming a different
  // one is refused. An admin with no school_code must name the school.
  if (user.school_code && d.school_code && d.school_code !== user.school_code) {
    return res.status(403).json({ error: "You can't post an announcement for another school" });
  }
  const school = user.school_code ?? d.school_code ?? null;
  if (!school) return res.status(400).json({ error: 'school_code is required' });

  const { rows: schoolRows } = await query('SELECT 1 FROM schools WHERE code=$1', [school]);
  if (!schoolRows[0]) return res.status(400).json({ error: 'Unknown school' });

  if (d.class_name) {
    const { rows: classRows } = await query(
      'SELECT 1 FROM classes WHERE school_code=$1 AND name=$2', [school, d.class_name],
    );
    if (!classRows[0]) return res.status(400).json({ error: `Unknown class for this school: ${d.class_name}` });
  }

  if (d.expires_at && new Date(d.expires_at).getTime() <= Date.now()) {
    return res.status(400).json({ error: 'expires_at must be in the future' });
  }

  const { rows } = await query(
    `INSERT INTO announcements(school_code, title, body, audience_role, class_name, created_by, expires_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7)
     RETURNING id, school_code, title, body, audience_role, class_name, created_by, created_at, expires_at`,
    [school, d.title, d.body, d.audience_role ?? null, d.class_name ?? null, user.id, d.expires_at ?? null],
  );
  await audit(user, 'create_announcement', 'announcement', String(rows[0].id), d.title);
  return res.status(201).json({ announcement: rows[0] });
});

// ── DELETE /announcements/:id  (admin only) ───────────────────────────────────
router.delete('/:id', requireRole('admin'), async (req, res) => {
  const user = req.user!;
  if (!/^[0-9]+$/.test(req.params.id)) return res.status(404).json({ error: 'Announcement not found' });

  // A school-bound admin can only delete their own school's rows; the SQL
  // makes another school's row indistinguishable from a missing one.
  const { rows } = await query(
    `DELETE FROM announcements
      WHERE id=$1 AND ($2::text IS NULL OR school_code=$2::text)
      RETURNING id, title`,
    [req.params.id, user.school_code ?? null],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Announcement not found' });
  await audit(user, 'delete_announcement', 'announcement', String(rows[0].id), rows[0].title);
  return res.json({ ok: true });
});

export default router;

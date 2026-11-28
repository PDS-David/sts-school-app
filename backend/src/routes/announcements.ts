import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';
import { assignedTeacherClasses } from '../utils/studentRosterScope.js';

// PRD-01 (owner decision D8: read-only announcements, admin writes, targeted
// by role and/or class, no push). Reads are scoped in SQL to the viewer's own
// school; there is no school or class parameter on GET.
const router = Router();
router.use(requireAuth);

const COLUMNS = 'a.id, a.school_code, a.title, a.body, a.audience_role, a.class_name, a.created_by, a.created_at, a.expires_at';
const LIVE = '(a.expires_at IS NULL OR a.expires_at > now())';
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 100;

// Visibility per role, as a SQL predicate plus its parameters ($1.. are bound
// by the caller after the predicate's own parameters, see listAnnouncements).
// student  : the school and class of their own (non-deleted) students row
// parent   : the school and class of ANY ward (non-deleted); school-wide
//            (class_name NULL) notices of a ward's school also match
// teacher  : their own school only. School-wide notices addressed to everyone
//            or to teachers, PLUS every notice aimed at one of their classes
//            whatever its audience role (student/parent/teacher): the teacher
//            needs to see what their class's families were told. Classes are
//            the class teacher's assigned classes and a subject teacher's
//            granted classes, never another school's class of the same name.
// admin    : everything in their school; an admin with no school_code (cross-
//            school everywhere else in the app) sees every school, optionally
//            narrowed with ?school_code=
// anyone else (finance_admin has no school_code) : nothing — fails closed
// Every branch also requires an unexpired notice.
function visibility(user: NonNullable<Express.Request['user']>, requestedSchool?: string): { sql: string; params: unknown[] } | null {
  if (user.role === 'student' || user.role === 'parent') {
    const wardPredicate = user.role === 'student'
      ? 's.user_id = $1'
      : 's.id IN (SELECT student_id FROM parent_wards WHERE parent_id = $1)';
    return {
      sql: `(a.audience_role IS NULL OR a.audience_role = $2)
            AND EXISTS (
              SELECT 1 FROM students s
               WHERE ${wardPredicate}
                 AND s.deleted_at IS NULL
                 AND s.school_code = a.school_code
                 AND (a.class_name IS NULL OR a.class_name = s.class_name)
            )`,
      params: [user.id, user.role],
    };
  }
  if (user.role === 'teacher') {
    if (!user.school_code) return null;
    const grantClasses = (user.assigned_class_subjects ?? [])
      .filter(g => g.school_code === user.school_code).map(g => g.class_name);
    const classes = [...new Set([...assignedTeacherClasses(user), ...grantClasses])];
    return {
      sql: `a.school_code = $1
            AND (
              (a.class_name IS NULL AND (a.audience_role IS NULL OR a.audience_role = 'teacher'))
              OR a.class_name = ANY($2::text[])
            )`,
      params: [user.school_code, classes],
    };
  }
  if (user.role === 'admin') {
    const school = user.school_code ?? requestedSchool ?? null;
    return { sql: '($1::text IS NULL OR a.school_code = $1::text)', params: [school] };
  }
  return null;
}

// ── GET /announcements ────────────────────────────────────────────────────────
// Newest first, keyset-paginated: ?limit=1..100 (default 50) and, for older
// pages, ?before=<next_cursor from the previous response>. Responds with
// { announcements, next_cursor } where next_cursor is null on the last page.
router.get('/', async (req, res) => {
  const user = req.user!;
  const requestedSchool = typeof req.query.school_code === 'string' ? req.query.school_code : undefined;
  const vis = visibility(user, requestedSchool);
  if (!vis) return res.json({ announcements: [], next_cursor: null });

  const rawLimit = Number.parseInt(String(req.query.limit ?? ''), 10);
  const limit = Number.isFinite(rawLimit) ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT) : DEFAULT_LIMIT;

  const params = [...vis.params];
  let cursorSql = '';
  if (typeof req.query.before === 'string' && req.query.before) {
    const m = /^(.+)\|(\d+)$/.exec(req.query.before);
    const ts = m ? new Date(m[1]) : null;
    if (!m || !ts || Number.isNaN(ts.getTime())) return res.status(400).json({ error: 'Invalid before cursor' });
    params.push(ts.toISOString(), m[2]);
    cursorSql = `AND (a.created_at, a.id) < ($${params.length - 1}::timestamptz, $${params.length}::bigint)`;
  }
  params.push(limit + 1);
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM announcements a
      WHERE ${LIVE} AND ${vis.sql} ${cursorSql}
      ORDER BY a.created_at DESC, a.id DESC LIMIT $${params.length}`,
    params,
  );
  const page = rows.slice(0, limit);
  const last = page[page.length - 1] as { created_at: Date | string; id: string | number } | undefined;
  const next_cursor = rows.length > limit && last ? `${new Date(last.created_at).toISOString()}|${last.id}` : null;
  return res.json({ announcements: page, next_cursor });
});

// ── GET /announcements/:id ────────────────────────────────────────────────────
// The full notice, under exactly the same visibility rules as the list: a
// notice the caller cannot see is a 404, never a 403, so ids are not probeable.
router.get('/:id(\\d+)', async (req, res) => {
  const user = req.user!;
  const requestedSchool = typeof req.query.school_code === 'string' ? req.query.school_code : undefined;
  const vis = visibility(user, requestedSchool);
  if (!vis) return res.status(404).json({ error: 'Announcement not found' });
  const params = [...vis.params, req.params.id];
  const { rows } = await query(
    `SELECT ${COLUMNS} FROM announcements a
      WHERE ${LIVE} AND ${vis.sql} AND a.id = $${params.length}::bigint`,
    params,
  );
  if (!rows[0]) return res.status(404).json({ error: 'Announcement not found' });
  return res.json({ announcement: rows[0] });
});

// ── POST /announcements  (admin only) ─────────────────────────────────────────
const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().min(1).max(5000),
  audience_role: z.enum(['student', 'parent', 'teacher']).nullish(),
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

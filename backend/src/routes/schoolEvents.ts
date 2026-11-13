import { Router } from 'express';
import { z } from 'zod';
import { query } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';

const router = Router();
router.use(requireAuth);

const EVENT_COLUMNS = 'e.id, e.school_code, e.title, e.description, e.event_type, e.audience_role, e.class_name, e.start_at, e.end_at, e.created_at';
const RANGE = "e.start_at >= now() - interval '30 days' AND e.start_at <= now() + interval '365 days'";

// The client never supplies a viewer identity or arbitrary class filter.
// Parent/student visibility is derived from active student records and wards.
router.get('/', async (req, res) => {
  const user = req.user!;
  let rows: unknown[] = [];

  if (user.role === 'student' || user.role === 'parent') {
    const studentPredicate = user.role === 'student'
      ? 's.user_id = $1'
      : 's.id IN (SELECT student_id FROM parent_wards WHERE parent_id = $1)';
    ({ rows } = await query(
      `SELECT ${EVENT_COLUMNS} FROM school_events e
        WHERE ${RANGE}
          AND (e.audience_role IS NULL OR e.audience_role = $2)
          AND EXISTS (
            SELECT 1 FROM students s
             WHERE ${studentPredicate}
               AND s.deleted_at IS NULL
               AND s.school_code = e.school_code
               AND (e.class_name IS NULL OR e.class_name = s.class_name)
          )
        ORDER BY e.start_at ASC LIMIT 100`,
      [user.id, user.role],
    ));
  } else if (user.role === 'teacher') {
    if (user.school_code) {
      ({ rows } = await query(
        `SELECT ${EVENT_COLUMNS} FROM school_events e
          WHERE ${RANGE} AND e.school_code=$1
            AND (e.audience_role IS NULL OR e.audience_role='teacher')
            AND (e.class_name IS NULL OR e.class_name=$2::text)
          ORDER BY e.start_at ASC LIMIT 100`,
        [user.school_code, user.assigned_class ?? null],
      ));
    }
  } else if (user.role === 'admin') {
    const requested = typeof req.query.school_code === 'string' ? req.query.school_code : undefined;
    const school = user.school_code ?? requested ?? null;
    ({ rows } = await query(
      `SELECT ${EVENT_COLUMNS} FROM school_events e
        WHERE ${RANGE} AND ($1::text IS NULL OR e.school_code=$1::text)
        ORDER BY e.start_at ASC LIMIT 200`,
      [school],
    ));
  }

  return res.json({ events: rows });
});

const eventSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().trim().max(5000).nullish(),
  event_type: z.enum(['event', 'exam', 'holiday', 'meeting', 'deadline']).default('event'),
  audience_role: z.enum(['student', 'parent', 'teacher']).nullish(),
  class_name: z.string().trim().min(1).max(100).nullish(),
  start_at: z.string().datetime({ offset: true }),
  end_at: z.string().datetime({ offset: true }).nullish(),
  school_code: z.string().trim().min(1).max(50).nullish(),
});

router.post('/', requireRole('admin'), async (req, res) => {
  const user = req.user!;
  const parsed = eventSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid school event: ' + parsed.error.issues.map(i => i.path.join('.') || 'body').join(', '),
    });
  }
  const d = parsed.data;
  if (d.end_at && new Date(d.end_at).getTime() < new Date(d.start_at).getTime()) {
    return res.status(400).json({ error: 'end_at cannot be earlier than start_at' });
  }
  if (user.school_code && d.school_code && d.school_code !== user.school_code) {
    return res.status(403).json({ error: "You can't create an event for another school" });
  }
  const school = user.school_code ?? d.school_code ?? null;
  if (!school) return res.status(400).json({ error: 'school_code is required' });

  const { rows: schools } = await query('SELECT 1 FROM schools WHERE code=$1', [school]);
  if (!schools[0]) return res.status(400).json({ error: 'Unknown school' });
  if (d.class_name) {
    const { rows: classes } = await query(
      'SELECT 1 FROM classes WHERE school_code=$1 AND name=$2', [school, d.class_name],
    );
    if (!classes[0]) return res.status(400).json({ error: 'Unknown class for this school' });
  }

  const { rows } = await query(
    `INSERT INTO school_events(school_code,title,description,event_type,audience_role,class_name,start_at,end_at,created_by)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
     RETURNING id, school_code, title, description, event_type, audience_role, class_name, start_at, end_at, created_at`,
    [school, d.title, d.description ?? null, d.event_type, d.audience_role ?? null,
      d.class_name ?? null, d.start_at, d.end_at ?? null, user.id],
  );
  await audit(user, 'create_school_event', 'school_event', String(rows[0].id), d.title);
  return res.status(201).json({ event: rows[0] });
});

router.delete('/:id', requireRole('admin'), async (req, res) => {
  if (!/^[0-9]+$/.test(req.params.id)) return res.status(404).json({ error: 'School event not found' });
  const { rows } = await query(
    `DELETE FROM school_events
      WHERE id=$1 AND ($2::text IS NULL OR school_code=$2::text)
      RETURNING id,title`,
    [req.params.id, req.user!.school_code ?? null],
  );
  if (!rows[0]) return res.status(404).json({ error: 'School event not found' });
  await audit(req.user!, 'delete_school_event', 'school_event', String(rows[0].id), rows[0].title);
  return res.json({ ok: true });
});

export default router;

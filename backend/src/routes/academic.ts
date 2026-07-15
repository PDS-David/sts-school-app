import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { SESSION_TERM_NAMES, isValidSessionTermName } from '../utils/terms.js';
import { audit } from '../utils/audit.js';

const router = Router();
router.use(requireAuth);

// ════════════════════════════════════════
// SCHOOLS
// ════════════════════════════════════════
router.get('/schools', async (_req, res) => {
  const { rows } = await query('SELECT * FROM schools ORDER BY id');
  return res.json({ schools: rows });
});

// ════════════════════════════════════════
// TERMS
// ════════════════════════════════════════

// Found live in Pass 10: neither POST /terms nor PUT /terms/:id validated
// `days_opened` at all. Live-verified a term's days_opened could be set to
// -20 via PUT — which then made the attendance.ts days_present validation
// (added earlier this pass) reject even a valid days_present=0, since 0 is
// not <= -20. A negative or non-integer days_opened is nonsensical on its
// own regardless of that knock-on effect, so it's rejected here directly.
function validateDaysOpened(days_opened: unknown): string | null {
  if (days_opened === undefined || days_opened === null) return null; // optional field
  if (typeof days_opened !== 'number' || !Number.isFinite(days_opened) || !Number.isInteger(days_opened)) {
    return 'days_opened must be a whole number';
  }
  if (days_opened < 0) return 'days_opened cannot be negative';
  return null;
}
router.get('/terms', async (req, res) => {
  const { school_code } = req.query as { school_code?: string };
  const sc = (school_code && req.user!.role === 'admin') ? school_code : req.user!.school_code;
  const { rows } = await query(
    'SELECT * FROM terms WHERE school_code=$1 ORDER BY academic_year DESC, id', [sc],
  );
  return res.json({ terms: rows });
});

router.get('/terms/current', async (req, res) => {
  const { school_code } = req.query as { school_code?: string };
  const sc = (school_code && req.user!.role === 'admin') ? school_code : req.user!.school_code;
  const { rows } = await query(
    'SELECT * FROM terms WHERE school_code=$1 AND is_current=TRUE LIMIT 1', [sc],
  );
  return res.json({ term: rows[0] ?? null });
});

router.post('/terms', requireRole('admin'), async (req, res) => {
  const { name, academic_year, school_code, start_date, end_date, days_opened, next_term_begins } = req.body;

  // A session is fixed at exactly 3 terms (1st, 2nd, 3rd). This is enforced
  // here rather than only in the UI, since /terms can be called directly.
  if (!isValidSessionTermName(name)) {
    return res.status(400).json({
      error: `Term name must be one of: ${SESSION_TERM_NAMES.join(', ')}`,
    });
  }
  const { rows: existingTerms } = await query(
    'SELECT id, name FROM terms WHERE school_code=$1 AND academic_year=$2',
    [school_code, academic_year],
  );
  if (existingTerms.length >= 3) {
    return res.status(409).json({
      error: `${academic_year} for ${school_code} already has all 3 terms of a session ` +
             `(${existingTerms.map((t: any) => t.name).join(', ')}). A session cannot exceed 3 terms.`,
    });
  }
  if (existingTerms.some((t: any) => t.name === name)) {
    return res.status(409).json({ error: `${name} already exists for ${academic_year}.` });
  }
  const daysOpenedError = validateDaysOpened(days_opened);
  if (daysOpenedError) return res.status(400).json({ error: daysOpenedError });

  const { rows } = await query(
    `INSERT INTO terms(name,academic_year,school_code,start_date,end_date,days_opened,next_term_begins)
     VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
    [name, academic_year, school_code, start_date ?? null, end_date ?? null,
     days_opened ?? 0, next_term_begins ?? null],
  );
  return res.status(201).json({ term: rows[0] });
});

router.put('/terms/:id', requireRole('admin'), async (req, res) => {
  const { name, academic_year, is_current, start_date, end_date, days_opened, next_term_begins } = req.body;

  if (name !== undefined && !isValidSessionTermName(name)) {
    return res.status(400).json({
      error: `Term name must be one of: ${SESSION_TERM_NAMES.join(', ')}`,
    });
  }
  if (name !== undefined) {
    const { rows: t } = await query('SELECT school_code, academic_year FROM terms WHERE id=$1', [req.params.id]);
    if (t[0]) {
      const yr = academic_year ?? t[0].academic_year;
      const { rows: clash } = await query(
        'SELECT id FROM terms WHERE school_code=$1 AND academic_year=$2 AND name=$3 AND id<>$4',
        [t[0].school_code, yr, name, req.params.id],
      );
      if (clash.length) {
        return res.status(409).json({ error: `${name} already exists for ${yr}.` });
      }
    }
  }
  const daysOpenedError = validateDaysOpened(days_opened);
  if (daysOpenedError) return res.status(400).json({ error: daysOpenedError });

  if (is_current) {
    // Unset others first
    const { rows: t } = await query('SELECT school_code FROM terms WHERE id=$1', [req.params.id]);
    if (t[0]) await query('UPDATE terms SET is_current=FALSE WHERE school_code=$1', [t[0].school_code]);
  }
  const { rows } = await query(
    `UPDATE terms SET name=COALESCE($1,name), academic_year=COALESCE($2,academic_year),
            is_current=COALESCE($3,is_current), start_date=COALESCE($4,start_date),
            end_date=COALESCE($5,end_date), days_opened=COALESCE($6,days_opened),
            next_term_begins=COALESCE($7,next_term_begins)
     WHERE id=$8 RETURNING *`,
    [name, academic_year, is_current, start_date, end_date, days_opened, next_term_begins, req.params.id],
  );
  return res.json({ term: rows[0] });
});

// ════════════════════════════════════════
// SUBJECTS
// ════════════════════════════════════════
router.get('/subjects', async (req, res) => {
  const { school_code } = req.query as { school_code?: string };
  const sc = (school_code && req.user!.role === 'admin') ? school_code : req.user!.school_code;
  const { rows } = await query(
    'SELECT * FROM subjects WHERE school_code=$1 ORDER BY name', [sc],
  );
  return res.json({ subjects: rows });
});

router.post('/subjects', requireRole('admin','teacher'), async (req, res) => {
  const { name, code, school_code } = req.body;
  const sc = (school_code && req.user!.role === 'admin') ? school_code : req.user!.school_code;
  const { rows } = await query(
    `INSERT INTO subjects(name,code,school_code) VALUES($1,$2,$3)
     ON CONFLICT(school_code,name) DO UPDATE SET code=$2 RETURNING *`,
    [name, code ?? null, sc],
  );
  return res.json({ subject: rows[0] });
});

router.delete('/subjects/:id', requireRole('admin'), async (req, res) => {
  await query('DELETE FROM subjects WHERE id=$1', [req.params.id]);
  return res.json({ ok: true });
});

// ════════════════════════════════════════
// CLASSES
// ════════════════════════════════════════
router.get('/classes', async (req, res) => {
  const { school_code } = req.query as { school_code?: string };
  const sc = (school_code && req.user!.role === 'admin') ? school_code : req.user!.school_code;
  const { rows } = await query(
    'SELECT * FROM classes WHERE school_code=$1 ORDER BY id', [sc],
  );
  return res.json({ classes: rows });
});

// ════════════════════════════════════════
// CLASS LOCKS
// ════════════════════════════════════════
// Added at the school owner's explicit request as a deliberate, simpler
// alternative to per-record conflict detection: a class teacher can "close"
// her own class's records for a term (e.g. once report cards are being
// finalized), which then blocks every write to that class's scores,
// attendance, class-record remarks, and weekly efforts — including her own
// — until she (or an admin) unlocks it again. See utils/scope.ts →
// checkTeacherStudentScope(), which is the single place the lock is
// actually enforced; these two routes just manage the class_locks row.
//
// GET  /academic/class-locks?class_name=&term_id=&school_code=
router.get('/class-locks', async (req, res) => {
  const { class_name, term_id, school_code } = req.query as Record<string, string>;
  if (!class_name || !term_id) {
    return res.status(400).json({ error: 'class_name and term_id are required' });
  }
  const sc = (school_code && req.user!.role === 'admin') ? school_code : req.user!.school_code;
  if (!sc) return res.status(400).json({ error: 'school_code is required' });

  const { rows } = await query(
    `SELECT cl.*, u.full_name AS locked_by_name
     FROM class_locks cl LEFT JOIN users u ON u.id = cl.locked_by
     WHERE cl.school_code=$1 AND cl.class_name=$2 AND cl.term_id=$3`,
    [sc, class_name, Number(term_id)],
  );
  return res.json({ lock: rows[0] ?? null });
});

// PUT  /academic/class-locks   body: { class_name, term_id, school_code?, locked }
router.put('/class-locks', requireRole('teacher', 'admin'), async (req, res) => {
  const { class_name, term_id, school_code, locked } = req.body as {
    class_name?: string; term_id?: number; school_code?: string; locked?: boolean;
  };
  if (!class_name || !term_id || typeof locked !== 'boolean') {
    return res.status(400).json({ error: 'class_name, term_id, and locked (boolean) are required' });
  }
  const user = req.user!;

  let sc: string | null;
  if (user.role === 'admin') {
    // Admin has no school_code of their own — they must say which school's
    // class they mean, same pattern as every other admin-facing endpoint in
    // this file (GET /terms, GET /classes above).
    if (!school_code) return res.status(400).json({ error: 'school_code is required for admin' });
    sc = school_code;
  } else {
    // Teacher: only their own assigned class, own school. A subject-only
    // teacher (no assigned_class) or a teacher naming a class that isn't
    // theirs can't lock/unlock anything — this is deliberately narrower
    // than checkTeacherStudentScope's write checks (which also allow a
    // subject teacher with no assigned_class to write across a whole
    // school); locking is a bigger, more disruptive action than a single
    // record write, so it's restricted to the one person whose job it
    // actually is to close out a class.
    if (!user.assigned_class || user.assigned_class !== class_name) {
      return res.status(403).json({ error: 'You can only lock or unlock your own assigned class' });
    }
    sc = user.school_code;
  }

  if (locked) {
    const { rows } = await query(
      `INSERT INTO class_locks(school_code, class_name, term_id, locked_by)
       VALUES($1,$2,$3,$4)
       ON CONFLICT(school_code, class_name, term_id) DO NOTHING
       RETURNING *`,
      [sc, class_name, term_id, user.id],
    );
    // Locking an already-locked class (re-tap, or someone else beat them to
    // it) is a no-op, not an error — just report whichever lock exists.
    const lock = rows[0] ?? (await query(
      'SELECT * FROM class_locks WHERE school_code=$1 AND class_name=$2 AND term_id=$3',
      [sc, class_name, term_id],
    )).rows[0];
    if (rows[0]) {
      await audit(user, 'lock_class', 'class_lock', String(lock.id), `${class_name} — term ${term_id}`);
    }
    return res.json({ lock });
  } else {
    const { rows } = await query(
      'DELETE FROM class_locks WHERE school_code=$1 AND class_name=$2 AND term_id=$3 RETURNING id',
      [sc, class_name, term_id],
    );
    if (rows[0]) {
      await audit(user, 'unlock_class', 'class_lock', String(rows[0].id), `${class_name} — term ${term_id}`);
    }
    return res.json({ lock: null });
  }
});

export default router;

import { Router } from 'express';
import { query, withTransaction } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { SESSION_TERM_NAMES, isValidSessionTermName } from '../utils/terms.js';
import { audit } from '../utils/audit.js';
import { checkTermSchoolScope } from '../utils/scope.js';

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
  // finance_admin also has school_code=NULL (manages both schools, same as
  // admin) and needs to pick a term when creating an invoice — same override
  // pattern as admin, extended to cover it.
  const sc = (school_code && (req.user!.role === 'admin' || req.user!.role === 'finance_admin')) ? school_code : req.user!.school_code;
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
  const { name, academic_year, school_code, start_date, end_date, days_opened, next_term_begins } = req.body ?? {};

  if (!isValidSessionTermName(name)) {
    return res.status(400).json({
      error: `Term name must be one of: ${SESSION_TERM_NAMES.join(', ')}`,
    });
  }
  if (typeof academic_year !== 'string' || !academic_year.trim() || academic_year.length > 20) {
    return res.status(400).json({ error: 'A valid academic_year is required (maximum 20 characters).' });
  }
  if (typeof school_code !== 'string' || !school_code.trim() || school_code.length > 50) {
    return res.status(400).json({ error: 'A valid school_code is required.' });
  }
  const daysOpenedError = validateDaysOpened(days_opened);
  if (daysOpenedError) return res.status(400).json({ error: daysOpenedError });

  const schoolCode = school_code.trim();
  const academicYear = academic_year.trim();

  // Serialize term mutations for this school. The schema's unique constraint
  // remains the final duplicate-name guard; this lock makes the read/check/
  // write path deterministic and lets concurrent duplicates return HTTP 409.
  const result = await withTransaction(async (client) => {
    const { rows: schoolRows } = await client.query(
      'SELECT 1 FROM schools WHERE code=$1 FOR SHARE',
      [schoolCode],
    );
    if (!schoolRows[0]) {
      return { ok: false as const, status: 400, error: 'Unknown school_code.' };
    }
    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext('academic-terms'), hashtext($1))",
      [schoolCode],
    );
    const { rows: existingTerms } = await client.query(
      'SELECT id, name FROM terms WHERE school_code=$1 AND academic_year=$2 ORDER BY id FOR UPDATE',
      [schoolCode, academicYear],
    );
    if (existingTerms.length >= 3) {
      return {
        ok: false as const,
        status: 409,
        error: `${academicYear} for ${schoolCode} already has all 3 terms of a session (${existingTerms.map((t: any) => t.name).join(', ')}).`,
      };
    }
    if (existingTerms.some((term: any) => term.name === name)) {
      return { ok: false as const, status: 409, error: `${name} already exists for ${academicYear}.` };
    }

    const { rows } = await client.query(
      `INSERT INTO terms(name,academic_year,school_code,start_date,end_date,days_opened,next_term_begins)
       VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *`,
      [name, academicYear, schoolCode, start_date ?? null, end_date ?? null,
       days_opened ?? 0, next_term_begins ?? null],
    );
    return { ok: true as const, term: rows[0] };
  });

  if (!result.ok) return res.status(result.status).json({ error: result.error });
  return res.status(201).json({ term: result.term });
});

router.put('/terms/:id', requireRole('admin', 'teacher'), async (req, res) => {
  const termId = Number(req.params.id);
  if (!Number.isSafeInteger(termId) || termId <= 0 || termId > 2_147_483_647) {
    return res.status(404).json({ error: 'Term not found' });
  }
  const { name, academic_year, is_current, start_date, end_date, days_opened, next_term_begins } = req.body ?? {};
  const user = req.user!;

  if (user.role === 'teacher') {
    if (name !== undefined || academic_year !== undefined || is_current !== undefined ||
        start_date !== undefined || end_date !== undefined) {
      return res.status(403).json({ error: 'Teachers can only update days-opened and next-term-begins for a term.' });
    }
  }

  if (name !== undefined && !isValidSessionTermName(name)) {
    return res.status(400).json({
      error: `Term name must be one of: ${SESSION_TERM_NAMES.join(', ')}`,
    });
  }
  if (academic_year !== undefined &&
      (typeof academic_year !== 'string' || !academic_year.trim() || academic_year.length > 20)) {
    return res.status(400).json({ error: 'academic_year must be a non-empty string of at most 20 characters.' });
  }
  if (is_current !== undefined && typeof is_current !== 'boolean') {
    return res.status(400).json({ error: 'is_current must be a boolean.' });
  }
  const daysOpenedError = validateDaysOpened(days_opened);
  if (daysOpenedError) return res.status(400).json({ error: daysOpenedError });

  const result = await withTransaction(async (client) => {
    // school_code is immutable through this endpoint. Read it to select the
    // per-school advisory lock, then lock/re-read the row before authorizing
    // or writing. This lock is shared with POST /terms.
    const { rows: initialRows } = await client.query(
      'SELECT school_code FROM terms WHERE id=$1',
      [termId],
    );
    if (!initialRows[0]) return { ok: false as const, status: 404, error: 'Term not found' };
    const schoolCode = initialRows[0].school_code as string | null;
    if (!schoolCode) return { ok: false as const, status: 409, error: 'Term has no school assignment and cannot be updated.' };

    await client.query(
      "SELECT pg_advisory_xact_lock(hashtext('academic-terms'), hashtext($1))",
      [schoolCode],
    );
    const { rows: lockedRows } = await client.query(
      'SELECT * FROM terms WHERE id=$1 FOR UPDATE',
      [termId],
    );
    const term = lockedRows[0];
    if (!term) return { ok: false as const, status: 404, error: 'Term not found' };

    if (user.role === 'teacher' && term.school_code !== user.school_code) {
      return { ok: false as const, status: 404, error: 'Term not found' };
    }

    const targetYear = academic_year ?? term.academic_year;
    if (name !== undefined || academic_year !== undefined) {
      const { rows: clash } = await client.query(
        'SELECT id FROM terms WHERE school_code=$1 AND academic_year=$2 AND name=$3 AND id<>$4',
        [term.school_code, targetYear, name ?? term.name, termId],
      );
      if (clash.length) {
        return { ok: false as const, status: 409, error: `${name ?? term.name} already exists for ${targetYear}.` };
      }
    }

    if (is_current === true) {
      await client.query(
        'UPDATE terms SET is_current=FALSE WHERE school_code=$1 AND id<>$2',
        [term.school_code, termId],
      );
    }

    const { rows } = await client.query(
      `UPDATE terms SET name=COALESCE($1,name), academic_year=COALESCE($2,academic_year),
              is_current=COALESCE($3,is_current), start_date=COALESCE($4,start_date),
              end_date=COALESCE($5,end_date), days_opened=COALESCE($6,days_opened),
              next_term_begins=COALESCE($7,next_term_begins)
       WHERE id=$8 RETURNING *`,
      [name, academic_year?.trim(), is_current, start_date, end_date, days_opened, next_term_begins, termId],
    );
    if (!rows[0]) return { ok: false as const, status: 404, error: 'Term not found' };
    return { ok: true as const, term: rows[0] };
  });

  if (!result.ok) return res.status(result.status).json({ error: result.error });
  return res.json({ term: result.term });
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
  const parsedTermId = Number(term_id);
  const termScopeError = await checkTermSchoolScope(sc, parsedTermId);
  if (termScopeError) return res.status(termScopeError.status).json({ error: termScopeError.error });

  const { rows } = await query(
    `SELECT cl.*, u.full_name AS locked_by_name
     FROM class_locks cl LEFT JOIN users u ON u.id = cl.locked_by
     WHERE cl.school_code=$1 AND cl.class_name=$2 AND cl.term_id=$3`,
    [sc, class_name, parsedTermId],
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
    if (!sc) return res.status(403).json({ error: 'Your teacher account is not assigned to a school.' });
  }

  const termScopeError = await checkTermSchoolScope(sc, term_id);
  if (termScopeError) return res.status(termScopeError.status).json({ error: termScopeError.error });

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

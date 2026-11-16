import { Router, type Request, type Response, type NextFunction } from 'express';
import { query, withTransaction } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { z } from 'zod';

const router = Router();
router.use(requireAuth);

// ── Operations Admin AND Teacher are walled off from finance entirely ──────────
// 'admin' (Operations Admin) has the '*' permission wildcard for everything
// else in this app, but must NOT reach finance — that's 'finance_admin''s
// job, and the whole point of splitting the two roles apart. 'teacher' was
// previously allowed read access here (scoped to their own school) via
// per-route branches below; confirmed with the school owner this should be
// blocked entirely instead, matching Operations Admin's treatment — a
// teacher's dashboard/materials/scores/etc. work has no legitimate reason
// to also expose fee/invoice status. Blocking here explicitly (rather than
// via requirePerm, which admin's wildcard would satisfy regardless of what
// rbac.ts actually grants) is what actually enforces the wall for both
// roles. Every route below checks this first.
function blockNonFinanceRoles(req: Request, res: Response, next: NextFunction) {
  if (req.user!.role === 'admin') {
    return res.status(403).json({ error: 'Finance is managed separately by Finance Admin, not Operations Admin.' });
  }
  if (req.user!.role === 'teacher') {
    return res.status(403).json({ error: 'Finance is managed separately by Finance Admin — teachers do not have access.' });
  }
  next();
}
router.use(blockNonFinanceRoles);

// ── GET /finance/fee-items ─────────────────────────────────────────────────────
// Fee schedules are school-scoped. A parent may have wards across both STS
// campuses, so their requested school must be proven against parent_wards
// rather than silently falling back to the parent's original home school.
// Omitting school_code returns the union of fee schedules for all active linked wards.
router.get('/fee-items', async (req, res) => {
  const { school_code } = req.query as { school_code?: string };
  const requestedSchoolCode = typeof school_code === 'string' ? school_code.trim() : undefined;
  if (req.user!.role === 'parent') {
    const params: unknown[] = [req.user!.id];
    let schoolFilter = '';
    if (requestedSchoolCode) {
      params.push(requestedSchoolCode);
      schoolFilter = ` AND fi.school_code=$${params.length}`;
    }
    const { rows } = await query(
      `SELECT fi.* FROM fee_items fi
       WHERE fi.school_code IN (
         SELECT DISTINCT st.school_code
         FROM parent_wards pw
         JOIN students st ON st.id=pw.student_id
         WHERE pw.parent_id=$1 AND st.deleted_at IS NULL
       )${schoolFilter}
       ORDER BY fi.id`,
      params,
    );
    return res.json({ fee_items: rows });
  }

  // finance_admin has no school of its own (manages both schools) — it
  // needs an explicit school_code from the client, e.g. the school switcher.
  const sc = req.user!.role === 'finance_admin' ? (requestedSchoolCode ?? req.user!.school_code) : req.user!.school_code;
  const { rows } = await query('SELECT * FROM fee_items WHERE school_code=$1 ORDER BY id', [sc]);
  return res.json({ fee_items: rows });
});

// ── POST /finance/fee-items — finance_admin only ────────────────────────────────
const createFeeItemSchema = z.object({
  name: z.string().trim().min(1).max(120),
  amount: z.coerce.number().finite().positive(),
  class_name: z.string().trim().max(100).nullable().optional(),
  school_code: z.string().trim().min(1).max(32),
});

router.post('/fee-items', requireRole('finance_admin'), async (req, res) => {
  const parsed = createFeeItemSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid fee item: ' + parsed.error.issues.map(issue => issue.path.join('.') || 'body').join(', '),
    });
  }
  const { name, amount, class_name, school_code } = parsed.data;
  const { rows: schools } = await query('SELECT 1 FROM schools WHERE code=$1', [school_code]);
  if (!schools[0]) return res.status(400).json({ error: 'Select a valid school for this fee item.' });
  const { rows } = await query(
    'INSERT INTO fee_items(school_code,name,amount,class_name) VALUES($1,$2,$3,$4) RETURNING *',
    [school_code, name, amount, class_name || null],
  );
  return res.status(201).json({ fee_item: rows[0] });
});

// ── GET /finance/invoices?student_id=&status= ─────────────────────────────────
// Authorisation mirrors /scores/report/:student_id:
//   finance_admin → any invoice (optionally filtered by student_id/status)
//   parent        → ONLY invoices for students linked to them via parent_wards
//   student       → ONLY their own invoices
// ('admin' and 'teacher' never reach here at all — blocked above.)
router.get('/invoices', async (req, res) => {
  const { student_id, status } = req.query as Record<string, string>;
  const user = req.user!;

  let sql = `SELECT i.*,st.full_name AS student_name,st.class_name,st.school_code
             FROM invoices i JOIN students st ON st.id=i.student_id WHERE 1=1`;
  const params: unknown[] = [];

  if (user.role === 'parent') {
    params.push(user.id);
    sql += ` AND st.deleted_at IS NULL
              AND i.student_id IN (SELECT student_id FROM parent_wards WHERE parent_id=$${params.length})`;
  } else if (user.role === 'student') {
    params.push(user.id);
    sql += ` AND st.deleted_at IS NULL
              AND i.student_id = (SELECT id FROM students WHERE user_id=$${params.length} AND deleted_at IS NULL LIMIT 1)`;
  }
  // finance_admin: no extra scoping beyond optional filters below

  if (student_id) {
    // Even for parent/student, this narrows within their already-scoped set —
    // it can never widen access to a student_id outside the WHERE clause above.
    params.push(student_id); sql += ` AND i.student_id=$${params.length}`;
  }
  if (status) { params.push(status); sql += ` AND i.status=$${params.length}`; }

  sql += ' ORDER BY i.issued_at DESC';
  const { rows } = await query(sql, params);
  return res.json({ invoices: rows });
});

// ── POST /finance/invoices — finance_admin only ─────────────────────────────────
const createInvoiceSchema = z.object({
  student_id: z.string().uuid(),
  term_id: z.number().int().positive(),
  fee_item_ids: z.array(z.number().int().positive()).min(1).max(100)
    .refine(ids => new Set(ids).size === ids.length, 'fee_item_ids must not contain duplicates'),
});

// ── POST /finance/invoices — finance_admin only ─────────────────────────────────
router.post('/invoices', requireRole('finance_admin'), async (req, res) => {
  const parsed = createInvoiceSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Invalid invoice request: ' + parsed.error.issues.map(issue => issue.path.join('.') || 'body').join(', '),
    });
  }

  const { student_id, term_id, fee_item_ids } = parsed.data;

  // Lock and validate every source row inside the same transaction as the
  // invoice write. FOR SHARE prevents concurrent edits/deletes from changing
  // school/class applicability after validation but before invoice commit.
  // Lock fee items in primary-key order to keep concurrent multi-item invoices
  // from acquiring the same row locks in different orders.
  const result = await withTransaction(async (client) => {
    const { rows: studentRows } = await client.query(
      'SELECT school_code, class_name FROM students WHERE id=$1 AND deleted_at IS NULL FOR SHARE',
      [student_id],
    );
    const student = studentRows[0];
    if (!student) return { ok: false as const, status: 404, error: 'Active student not found' };

    const { rows: termRows } = await client.query(
      'SELECT school_code FROM terms WHERE id=$1 FOR SHARE',
      [term_id],
    );
    const term = termRows[0];
    if (!term) return { ok: false as const, status: 404, error: 'Term not found' };
    if (term.school_code !== student.school_code) {
      return { ok: false as const, status: 400, error: 'That term belongs to a different school than the student.' };
    }

    const { rows: items } = await client.query(
      'SELECT * FROM fee_items WHERE id = ANY($1::int[]) ORDER BY id FOR SHARE',
      [fee_item_ids],
    );
    if (items.length !== fee_item_ids.length) {
      return { ok: false as const, status: 400, error: 'One or more fee_item_ids do not exist.' };
    }

    const wrongSchool = items.find(item => item.school_code !== student.school_code);
    if (wrongSchool) {
      return {
        ok: false as const,
        status: 400,
        error: `Fee item "${wrongSchool.name}" belongs to a different school than the student.`,
      };
    }

    const wrongClass = items.find(item => item.class_name != null && item.class_name !== student.class_name);
    if (wrongClass) {
      return {
        ok: false as const,
        status: 400,
        error: `Fee item "${wrongClass.name}" does not apply to class "${student.class_name}".`,
      };
    }

    const total = items.reduce((sum, item) => sum + Number(item.amount), 0);
    const { rows: invoiceRows } = await client.query(
      'INSERT INTO invoices(student_id,term_id,total) VALUES($1,$2,$3) RETURNING *',
      [student_id, term_id, total],
    );
    const invoice = invoiceRows[0];

    for (const item of items) {
      await client.query(
        'INSERT INTO invoice_items(invoice_id,fee_item_id,amount) VALUES($1,$2,$3)',
        [invoice.id, item.id, item.amount],
      );
    }

    return { ok: true as const, invoice };
  });

  if (!result.ok) return res.status(result.status).json({ error: result.error });
  return res.status(201).json({ invoice: result.invoice });
});

// ── PUT /finance/invoices/:id/status — finance_admin only ──────────────────────
// Moved here from /admin/finance/invoices/:id/status — same route, same
// validation, new gate and new path (mobile FinanceScreen updated to match).
router.put('/invoices/:id/status', requireRole('finance_admin'), async (req, res) => {
  const { status } = req.body as { status: string };
  if (!['unpaid', 'partial', 'paid'].includes(status)) {
    return res.status(400).json({ error: "status must be 'unpaid', 'partial', or 'paid'" });
  }
  const { rows } = await query(
    'UPDATE invoices SET status=$1 WHERE id=$2 RETURNING *', [status, req.params.id],
  );
  if (!rows[0]) return res.status(404).json({ error: 'Invoice not found' });
  return res.json({ invoice: rows[0] });
});

export default router;

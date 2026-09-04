import { Router, type Request, type Response, type NextFunction } from 'express';
import { query } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// ── Operations Admin is walled off from finance entirely ───────────────────────
// 'admin' (Operations Admin) has the '*' permission wildcard for everything
// else in this app, but must NOT reach finance — that's 'finance_admin''s
// job, and the whole point of splitting the two roles apart. Blocking it here
// explicitly (rather than via requirePerm, which the wildcard would satisfy
// regardless of what's actually granted to 'admin' in rbac.ts) is what
// actually enforces the wall. Every route below checks this first.
function blockOpsAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.user!.role === 'admin') {
    return res.status(403).json({ error: 'Finance is managed separately by Finance Admin, not Operations Admin.' });
  }
  next();
}
router.use(blockOpsAdmin);

// ── GET /finance/fee-items ─────────────────────────────────────────────────────
// Fee schedule is not sensitive per-student data, just scoped to the caller's school.
router.get('/fee-items', async (req, res) => {
  const { school_code } = req.query as { school_code?: string };
  // finance_admin has no school of its own (manages both schools, same as
  // Operations Admin used to for this data) — needs an explicit school_code
  // from the client (e.g. a school switcher), same pattern as everywhere
  // else an admin-shaped role has school_code = NULL.
  const sc = req.user!.role === 'finance_admin' ? (school_code ?? req.user!.school_code) : req.user!.school_code;
  const { rows } = await query('SELECT * FROM fee_items WHERE school_code=$1 ORDER BY id', [sc]);
  return res.json({ fee_items: rows });
});

// ── POST /finance/fee-items — finance_admin only ────────────────────────────────
router.post('/fee-items', requireRole('finance_admin'), async (req, res) => {
  const { name, amount, class_name, school_code } = req.body;
  const sc = school_code ?? req.user!.school_code;
  const { rows } = await query(
    'INSERT INTO fee_items(school_code,name,amount,class_name) VALUES($1,$2,$3,$4) RETURNING *',
    [sc, name, amount, class_name ?? null],
  );
  return res.status(201).json({ fee_item: rows[0] });
});

// ── GET /finance/invoices?student_id=&status= ─────────────────────────────────
// Authorisation mirrors /scores/report/:student_id:
//   finance_admin → any invoice (optionally filtered by student_id/status)
//   teacher       → invoices for students in their own school
//   parent        → ONLY invoices for students linked to them via parent_wards
//   student       → ONLY their own invoices
// ('admin' never reaches here at all — blocked above.)
router.get('/invoices', async (req, res) => {
  const { student_id, status } = req.query as Record<string, string>;
  const user = req.user!;

  let sql = `SELECT i.*,st.full_name AS student_name,st.class_name,st.school_code
             FROM invoices i JOIN students st ON st.id=i.student_id WHERE 1=1`;
  const params: unknown[] = [];

  if (user.role === 'parent') {
    params.push(user.id);
    sql += ` AND i.student_id IN (SELECT student_id FROM parent_wards WHERE parent_id=$${params.length})`;
  } else if (user.role === 'student') {
    params.push(user.id);
    sql += ` AND i.student_id = (SELECT id FROM students WHERE user_id=$${params.length} LIMIT 1)`;
  } else if (user.role === 'teacher') {
    params.push(user.school_code);
    sql += ` AND st.school_code=$${params.length}`;
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
router.post('/invoices', requireRole('finance_admin'), async (req, res) => {
  const { student_id, term_id, fee_item_ids } = req.body as {
    student_id: string; term_id: number; fee_item_ids: number[];
  };

  // Found in QA Pass 8: none of this was validated before — live-verified
  // that a primary-school student could be invoiced using a secondary
  // school's fee item (wrong amount charged, no error), that a nonexistent
  // fee_item_id was silently dropped from the total instead of rejected
  // (invoice created for less than intended with no indication anything was
  // wrong), and that an empty fee_item_ids array created a real ₦0 invoice.
  if (!Array.isArray(fee_item_ids) || fee_item_ids.length === 0) {
    return res.status(400).json({ error: 'fee_item_ids must be a non-empty array.' });
  }

  const { rows: studentRows } = await query('SELECT school_code FROM students WHERE id=$1', [student_id]);
  if (!studentRows[0]) return res.status(404).json({ error: 'Student not found' });
  const studentSchool = studentRows[0].school_code;

  const { rows: termRows } = await query('SELECT school_code FROM terms WHERE id=$1', [term_id]);
  if (!termRows[0]) return res.status(404).json({ error: 'Term not found' });
  if (termRows[0].school_code !== studentSchool) {
    return res.status(400).json({ error: "That term belongs to a different school than the student." });
  }

  const { rows: items } = await query(
    'SELECT * FROM fee_items WHERE id = ANY($1)', [fee_item_ids],
  );
  if (items.length !== fee_item_ids.length) {
    return res.status(400).json({ error: 'One or more fee_item_ids do not exist.' });
  }
  const mismatched = items.find(i => i.school_code !== studentSchool);
  if (mismatched) {
    return res.status(400).json({
      error: `Fee item "${mismatched.name}" belongs to a different school than the student.`,
    });
  }

  const total = items.reduce((s, i) => s + Number(i.amount), 0);
  const { rows } = await query(
    'INSERT INTO invoices(student_id,term_id,total) VALUES($1,$2,$3) RETURNING *',
    [student_id, term_id, total],
  );
  for (const item of items) {
    await query('INSERT INTO invoice_items(invoice_id,fee_item_id,amount) VALUES($1,$2,$3)',
      [rows[0].id, item.id, item.amount]);
  }
  return res.status(201).json({ invoice: rows[0] });
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

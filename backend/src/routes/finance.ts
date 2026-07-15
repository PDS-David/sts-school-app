import { Router } from 'express';
import { query } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

// ── GET /finance/fee-items ─────────────────────────────────────────────────────
// Fee schedule is not sensitive per-student data, just scoped to the caller's school.
router.get('/fee-items', async (req, res) => {
  const { school_code } = req.query as { school_code?: string };
  const sc = req.user!.role === 'admin' ? (school_code ?? req.user!.school_code) : req.user!.school_code;
  const { rows } = await query('SELECT * FROM fee_items WHERE school_code=$1 ORDER BY id', [sc]);
  return res.json({ fee_items: rows });
});

// ── GET /finance/invoices?student_id=&status= ─────────────────────────────────
// Authorisation mirrors /scores/report/:student_id:
//   admin    → any invoice (optionally filtered by student_id/status)
//   teacher  → invoices for students in their own school
//   parent   → ONLY invoices for students linked to them via parent_wards
//   student  → ONLY their own invoices
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
  // admin: no extra scoping beyond optional filters below

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

export default router;

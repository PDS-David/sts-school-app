import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';
import { sendAdminLogEmail } from '../utils/email.js';
import * as XLSX from 'xlsx';
import { generateTempPassword, generateNumericPin } from '../utils/password.js';

const router = Router();
router.use(requireAuth, requireRole('admin'));

// ══════════════════════════════════════════
// USER MANAGEMENT
// ══════════════════════════════════════════
router.get('/users', async (req, res) => {
  const { school_code, role } = req.query as Record<string, string>;
  let sql = `SELECT u.id,u.username,u.full_name,u.role,u.school_code,u.assigned_class,
                    u.is_active,u.must_change_pw,u.access_expires_at,u.created_at,
                    COALESCE(array_agg(ts.subject_id) FILTER (WHERE ts.subject_id IS NOT NULL), '{}') AS assigned_subject_ids
             FROM users u
             LEFT JOIN teacher_subjects ts ON ts.user_id = u.id
             WHERE 1=1`;
  const params: unknown[] = [];
  if (school_code) { params.push(school_code); sql += ` AND u.school_code=$${params.length}`; }
  if (role)        { params.push(role);        sql += ` AND u.role=$${params.length}`; }
  sql += ' GROUP BY u.id ORDER BY u.role,u.full_name';
  const { rows } = await query(sql, params);
  return res.json({ users: rows });
});

// ── GET /admin/students-without-login  (helper for the "link login" picker) ──
router.get('/students-without-login', async (req, res) => {
  const { school_code, class_name } = req.query as Record<string, string>;
  let sql = `SELECT id, full_name, class_name, school_code, admission_number
             FROM students WHERE user_id IS NULL`;
  const params: unknown[] = [];
  if (school_code) { params.push(school_code); sql += ` AND school_code=$${params.length}`; }
  if (class_name)  { params.push(class_name);  sql += ` AND class_name=$${params.length}`; }
  sql += ' ORDER BY full_name';
  const { rows } = await query(sql, params);
  return res.json({ students: rows });
});

// ── GET /admin/student-logins-without-link  (reverse of the above: student
//    accounts in Users that aren't yet attached to a students row) ──────────
router.get('/student-logins-without-link', async (req, res) => {
  const { school_code } = req.query as Record<string, string>;
  let sql = `SELECT id, username, full_name, school_code FROM users
             WHERE role='student' AND NOT EXISTS (SELECT 1 FROM students st WHERE st.user_id = users.id)`;
  const params: unknown[] = [];
  if (school_code) { params.push(school_code); sql += ` AND school_code=$${params.length}`; }
  sql += ' ORDER BY full_name';
  const { rows } = await query(sql, params);
  return res.json({ users: rows });
});

// ── GET /admin/parent-logins  (for the "link parent" picker — any parent can
//    be linked to several children, so no "unlinked" filtering here) ────────
router.get('/parent-logins', async (req, res) => {
  const { school_code } = req.query as Record<string, string>;
  let sql = `SELECT id, username, full_name, phone FROM users WHERE role='parent'`;
  const params: unknown[] = [];
  if (school_code) { params.push(school_code); sql += ` AND school_code=$${params.length}`; }
  sql += ' ORDER BY full_name';
  const { rows } = await query(sql, params);
  return res.json({ users: rows });
});

router.post('/users', async (req, res) => {
  const { username, full_name, role, school_code, assigned_class, assigned_subject_ids, phone, email, access_expires_at } = req.body;
  const uname = String(username).trim().toLowerCase();
  const exists = await query('SELECT id FROM users WHERE username=$1', [uname]);
  if (exists.rows.length) return res.status(409).json({ error: 'Username taken' });

  // access_expires_at only makes sense for teacher/parent credentials the admin
  // is handing out for a limited time. Admin accounts never expire this way.
  const expiresAt = (role === 'teacher' || role === 'parent') ? (access_expires_at ?? null) : null;

  const generatedPassword = generateTempPassword();
  const hash = await bcrypt.hash(generatedPassword, 10);
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,
       phone,email,must_change_pw,access_expires_at)
     VALUES($1,$2,$3,$4,$5,$6,$7,$8,TRUE,$9) RETURNING id,username,role,school_code,access_expires_at`,
    [uname, hash, role, full_name, school_code ?? null,
     assigned_class ?? null, phone ?? null, email ?? null, expiresAt],
  );
  const subjectIds: number[] = Array.isArray(assigned_subject_ids) ? assigned_subject_ids : [];
  for (const sid of subjectIds) {
    await query('INSERT INTO teacher_subjects(user_id, subject_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [rows[0].id, sid]);
  }
  await audit(req.user!, 'add_user', 'user', rows[0].id, `${role}: ${full_name}`);
  return res.status(201).json({ user: { ...rows[0], temporary_password: generatedPassword } });
});

router.put('/users/:id', async (req, res) => {
  const { full_name, role, school_code, assigned_class, assigned_subject_ids, is_active, phone, email, access_expires_at, clear_expiry, revocation_reason } = req.body;
  // clear_expiry: true lets the admin explicitly remove an expiry (grant indefinite access)
  // without that being confused with "field simply not sent" (which COALESCE would ignore).
  //
  // revocation_reason: optional note admin attaches when deactivating a user
  // or ending their access — surfaced back to the user at login/refresh and
  // in the forgot-password flow instead of a generic "contact admin"
  // message. Auto-cleared whenever this same request reactivates the user
  // (is_active=true), since a reason for a revocation that's just been
  // undone is stale and would otherwise keep showing on their next login.
  const reactivating = is_active === true;
  const { rows } = await query(
    `UPDATE users SET full_name=COALESCE($1,full_name), role=COALESCE($2,role),
       school_code=COALESCE($3,school_code), assigned_class=COALESCE($4,assigned_class),
       is_active=COALESCE($5,is_active),
       phone=COALESCE($6,phone), email=COALESCE($7,email),
       access_expires_at = CASE WHEN $9 THEN NULL ELSE COALESCE($8, access_expires_at) END,
       revocation_reason = CASE WHEN $11 THEN NULL ELSE COALESCE($12, revocation_reason) END
     WHERE id=$10 RETURNING id,username,role,is_active,access_expires_at,revocation_reason`,
    [full_name, role, school_code, assigned_class, is_active, phone, email,
     access_expires_at ?? null, !!clear_expiry, req.params.id, reactivating, revocation_reason ?? null],
  );
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  if (Array.isArray(assigned_subject_ids)) {
    await query('DELETE FROM teacher_subjects WHERE user_id=$1', [req.params.id]);
    for (const sid of assigned_subject_ids) {
      await query('INSERT INTO teacher_subjects(user_id, subject_id) VALUES($1,$2) ON CONFLICT DO NOTHING', [req.params.id, sid]);
    }
  }
  await audit(req.user!, 'edit_user', 'user', req.params.id);
  return res.json({ user: rows[0] });
});

router.post('/users/:id/reset-password', async (req, res) => {
  const pw = generateTempPassword();
  const hash = await bcrypt.hash(pw, 10);
  await query('UPDATE users SET password_hash=$1, must_change_pw=TRUE WHERE id=$2', [hash, req.params.id]);
  await audit(req.user!, 'reset_password', 'user', req.params.id);
  return res.json({ ok: true, temporary_password: pw });
});

router.delete('/users/:id', async (req, res) => {
  if (req.params.id === req.user!.id) return res.status(400).json({ error: 'Cannot delete yourself' });
  const { rows: targetRows } = await query('SELECT role FROM users WHERE id=$1', [req.params.id]);
  if (!targetRows[0]) return res.status(404).json({ error: 'User not found' });
  if (targetRows[0].role === 'admin') return res.status(400).json({ error: 'Admin accounts cannot be deleted' });
  const { rows } = await query('DELETE FROM users WHERE id=$1 RETURNING username', [req.params.id]);
  await audit(req.user!, 'delete_user', 'user', req.params.id, rows[0].username);
  return res.json({ ok: true });
});

// ══════════════════════════════════════════
// AUDIT LOG
// ══════════════════════════════════════════
router.get('/audit-log', async (req, res) => {
  const { school_code, limit = '100' } = req.query as Record<string, string>;
  let sql = `SELECT al.*,u.username AS actor_username
             FROM audit_log al LEFT JOIN users u ON u.id=al.actor_id
             WHERE 1=1`;
  const params: unknown[] = [];
  if (school_code) { params.push(school_code); sql += ` AND al.school_code=$${params.length}`; }
  sql += ` ORDER BY al.created_at DESC LIMIT $${params.length + 1}`;
  params.push(Number(limit));
  const { rows } = await query(sql, params);
  return res.json({ audit_log: rows });
});

// ══════════════════════════════════════════
// EMAIL LOG TRIGGER
// ══════════════════════════════════════════
router.post('/log-email', async (req, res) => {
  const { level = 'INFO', event = 'manual', payload = {} } = req.body;
  await query(
    `INSERT INTO email_log_queue(level,event,payload) VALUES($1,$2,$3)`,
    [level, event, JSON.stringify(payload)],
  );
  try {
    await sendAdminLogEmail(level, event, payload);
    await query(`UPDATE email_log_queue SET processed_at=now() WHERE processed_at IS NULL ORDER BY id DESC LIMIT 1`);
  } catch (e: any) {
    return res.status(500).json({ error: 'Email queued but failed to send: ' + e.message });
  }
  return res.json({ ok: true });
});

// ══════════════════════════════════════════
// EXCEL EXPORT (mirrors STS export)
// ══════════════════════════════════════════
router.get('/export/excel', async (req, res) => {
  const { school_code } = req.query as { school_code?: string };
  const sc = school_code ?? req.user!.school_code;

  // Found in QA Pass 8: admin's own `school_code` is NULL (same root cause as
  // the Pass 7 contacts bug), so hitting this route with no `?school_code=`
  // used to fall through to `WHERE school_code=NULL` on every sheet — which
  // matches nothing in Postgres, not "no restriction". That silently returned
  // a real 200 with a real .xlsx attachment, just one with header-only sheets
  // and no Scores sheet at all — live-verified indistinguishable from a
  // genuine empty school. Unlike messaging contacts, this report is
  // inherently single-school (mirrors the mobile school picker), so the fix
  // here is a real error rather than admin-sees-everything.
  if (!sc) {
    return res.status(400).json({ error: 'school_code is required (e.g. "primary" or "secondary").' });
  }
  const { rows: schoolRows } = await query('SELECT code FROM schools WHERE code=$1', [sc]);
  if (!schoolRows[0]) {
    return res.status(400).json({ error: `Unknown school_code "${sc}".` });
  }

  const wb = XLSX.utils.book_new();

  // Students sheet
  const { rows: students } = await query(
    'SELECT admission_number,full_name,class_name,gender,created_at FROM students WHERE school_code=$1 ORDER BY class_name,full_name', [sc],
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(students), 'Students');

  // Subjects sheet
  const { rows: subjects } = await query(
    'SELECT name,code FROM subjects WHERE school_code=$1 ORDER BY name', [sc],
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(subjects), 'Subjects');

  // Terms sheet
  const { rows: terms } = await query(
    'SELECT name,academic_year,is_current,days_opened,next_term_begins FROM terms WHERE school_code=$1 ORDER BY id', [sc],
  );
  XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(terms), 'Terms');

  // Scores for current term
  const { rows: currentTerm } = await query(
    'SELECT id,name FROM terms WHERE school_code=$1 AND is_current=TRUE LIMIT 1', [sc],
  );
  if (currentTerm[0]) {
    const { rows: scores } = await query(
      `SELECT st.admission_number,st.full_name,st.class_name,
              sub.name AS subject,sc.ca1,sc.ca2,sc.exam,sc.total,sc.grade,sc.teacher_remark
       FROM scores sc
       JOIN students st ON st.id=sc.student_id
       JOIN subjects sub ON sub.id=sc.subject_id
       WHERE st.school_code=$1 AND sc.term_id=$2
       ORDER BY st.class_name,st.full_name,sub.name`,
      [sc, currentTerm[0].id],
    );
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(scores), `Scores - ${currentTerm[0].name}`);
  }

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', `attachment; filename="school-report-${sc}-${Date.now()}.xlsx"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  return res.send(buf);
});

// Finance (fee items, invoices, invoice status) has moved to routes/finance.ts
// entirely, gated by requireRole('finance_admin') — not this router's
// requireRole('admin'). Operations Admin (this file) has no finance access
// at all now; see finance.ts for why that's enforced explicitly rather than
// through the '*' permission wildcard this role otherwise has.

// ══════════════════════════════════════════
// TERM-ACCESS PINS (Feature A — see schema.sql's "Term-PIN gating" section
// for the locked product decisions this implements)
// ══════════════════════════════════════════
const TERM_LABELS = ['1st Term', '2nd Term', '3rd Term'];

// ── POST /admin/term-pins — generate (or re-issue) a PIN ───────────────────────
router.post('/term-pins', async (req, res) => {
  const { student_id, term_label } = req.body as { student_id?: string; term_label?: string };
  if (!student_id || !term_label) {
    return res.status(400).json({ error: 'student_id and term_label are required' });
  }
  if (!TERM_LABELS.includes(term_label)) {
    return res.status(400).json({ error: `term_label must be one of: ${TERM_LABELS.join(', ')}` });
  }

  const { rows: stRows } = await query('SELECT id FROM students WHERE id=$1', [student_id]);
  if (!stRows[0]) return res.status(404).json({ error: 'Student not found' });

  const pin = generateNumericPin();
  // Upsert on (student_id, term_label): re-issuing (a lost slip, or a
  // deliberate reset) replaces the existing PIN and clears any prior
  // redemption, rather than erroring or accumulating rows — there is only
  // ever meant to be one live PIN per student per term_label at a time.
  const { rows } = await query(
    `INSERT INTO term_access_pins(student_id, term_label, pin, created_by)
     VALUES($1,$2,$3,$4)
     ON CONFLICT (student_id, term_label)
     DO UPDATE SET pin=EXCLUDED.pin, redeemed_at=NULL, created_by=EXCLUDED.created_by, created_at=now()
     RETURNING *`,
    [student_id, term_label, pin, req.user!.id],
  );
  return res.status(201).json({ term_pin: rows[0] });
});

// ── GET /admin/term-pins?student_id=&term_label= — view issued/redeemed status ──
// Note: this deliberately returns the live `pin` value too (not just
// redemption status) — an admin re-checking what they handed a student
// needs to be able to read it back, same as `POST /admin/users`'s
// `temporary_password` being visible to admin, not just the recipient.
router.get('/term-pins', async (req, res) => {
  const { student_id, term_label } = req.query as Record<string, string>;
  let sql = `SELECT tp.*, st.full_name AS student_name, st.class_name
             FROM term_access_pins tp JOIN students st ON st.id=tp.student_id WHERE 1=1`;
  const params: unknown[] = [];
  if (student_id) { params.push(student_id); sql += ` AND tp.student_id=$${params.length}`; }
  if (term_label) { params.push(term_label); sql += ` AND tp.term_label=$${params.length}`; }
  sql += ' ORDER BY st.full_name, tp.term_label';
  const { rows } = await query(sql, params);
  return res.json({ term_pins: rows });
});

export default router;
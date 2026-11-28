// End-to-end integration tests for the single six-digit PIN policy for teachers
// and students (owner decision, Nov 2026), against a real PostgreSQL schema:
//
//   * accept any six ASCII digits, including sequential PINs such as 123456;
//   * reject six identical digits (000000, 111111 …) and anything that is not
//     exactly six digits;
//   * administrator-issued temporary credentials are six digits and must be
//     replaced on first use; a reset revokes every session and the old PIN;
//   * administrator passwords stay on their own, stronger route;
//   * credential operations never touch academic records.
//
// Run: node --import tsx --test --test-concurrency=1 tests/backend-six-digit-pin-policy.integration.test.mts
process.env.PIN_PEPPER ||= 'test-pepper-0123456789-0123456789-0123456789-abcdef';
process.env.JWT_SECRET ||= 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET ||= 'test-jwt-refresh-secret';

import 'express-async-errors';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { randomBytes, randomInt } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after, before } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import authRouter from '../backend/src/routes/auth.js';
import adminRouter from '../backend/src/routes/admin.js';
import { requireAuth } from '../backend/src/middleware/auth.js';
import { signAccess } from '../backend/src/utils/jwt.js';
import { PIN_HASH_VERSION, checkPin, generateTemporaryPin, hashPin, isTrivialPin } from '../backend/src/utils/pin.js';

const sfx = () => randomInt(100_000_000, 999_999_999).toString();
const uname = (label: string) => `pin6-${label}-${sfx()}`;
const device = () => randomBytes(12).toString('hex');

let server: Server;
let base = '';
let adminId = '';
let adminToken = '';
const createdUserIds: string[] = [];
const createdStudentIds: string[] = [];
const createdClasses: string[] = [];

before(async () => {
  const adminName = uname('admin');
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,is_active)
     VALUES($1,$2,'admin','PIN6 Test Administrator',TRUE) RETURNING id`,
    [adminName, await bcrypt.hash('Admin-Strong-Passw0rd!', 4)],
  );
  adminId = String(rows[0].id);
  createdUserIds.push(adminId);
  adminToken = signAccess({ id: adminId, username: adminName, role: 'admin', school_code: null, assigned_class: null, assigned_subject_ids: [] });

  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);
  app.use('/admin', adminRouter);
  app.get('/protected', requireAuth, (_req, res) => res.json({ ok: true }));
  app.use((error: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) return next(error);
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  });
  server = app.listen(0, '127.0.0.1');
  await new Promise<void>((r) => server.once('listening', r));
  base = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
});

after(async () => {
  if (server) {
    server.closeAllConnections();
    await new Promise<void>((r) => server.close(() => r()));
  }
  if (createdStudentIds.length) await query('DELETE FROM students WHERE id = ANY($1::uuid[])', [createdStudentIds]);
  if (createdUserIds.length) {
    await query('DELETE FROM auth_sessions WHERE user_id = ANY($1::uuid[])', [createdUserIds]);
    await query('DELETE FROM teacher_class_subjects WHERE user_id = ANY($1::uuid[])', [createdUserIds]);
    await query('DELETE FROM teacher_subjects WHERE user_id = ANY($1::uuid[])', [createdUserIds]);
    await query('DELETE FROM users WHERE id = ANY($1::uuid[])', [createdUserIds]);
  }
  if (createdClasses.length) await query("DELETE FROM classes WHERE school_code='primary' AND name = ANY($1::text[])", [createdClasses]);
  await pool.end();
});

async function post(path: string, body: unknown, headers: Record<string, string> = {}) {
  const r = await fetch(`${base}${path}`, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
  let json: any = null; try { json = await r.json(); } catch { /* empty */ }
  return { status: r.status, json };
}
async function get(path: string, token: string) {
  const r = await fetch(`${base}${path}`, { headers: { authorization: `Bearer ${token}` } });
  let json: any = null; try { json = await r.json(); } catch { /* empty */ }
  return { status: r.status, json };
}
const adminHeaders = () => ({ authorization: `Bearer ${adminToken}` });
const bearer = (t: string) => ({ authorization: `Bearer ${t}` });
const login = (username: string, pin: string, dev = device()) =>
  post('/auth/login', { username, pin }, { 'x-device-id': dev });

/** A student/teacher who already holds a permanent PIN (peppered or legacy hash). */
async function makePinUser(role: 'student' | 'teacher', pin: string, opts: { legacy?: boolean; mustSetPin?: boolean } = {}) {
  const username = uname(role);
  const hash = opts.legacy ? await bcrypt.hash(pin, 4) : await hashPin(pin);
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,pin_hash_version,pin_set_at,role,full_name,school_code,is_active,must_set_pin,must_change_pw)
     VALUES($1,$2,$3,$4,$5,'PIN6 Test User','primary',TRUE,$6,FALSE) RETURNING id`,
    [username, hash, opts.legacy ? null : PIN_HASH_VERSION, opts.legacy ? null : new Date(), role, opts.mustSetPin ?? false],
  );
  const id = String(rows[0].id);
  createdUserIds.push(id);
  return { id, username };
}

async function makeStudentRecord(userId: string | null = null) {
  const { rows } = await query(
    `INSERT INTO students(full_name,class_name,school_code,admission_number,user_id)
     VALUES('PIN6 Student Record','Primary 4','primary',$1,$2) RETURNING id`,
    [`PIN6-${sfx()}`, userId],
  );
  const id = String(rows[0].id);
  createdStudentIds.push(id);
  return id;
}

async function academicSnapshot(studentId: string, teacherId?: string) {
  const student = await query('SELECT * FROM students WHERE id=$1', [studentId]);
  const subjects = teacherId ? await query('SELECT subject_id FROM teacher_subjects WHERE user_id=$1 ORDER BY subject_id', [teacherId]) : { rows: [] };
  const teacherRow = teacherId
    ? await query('SELECT assigned_class, assigned_class_names, school_code FROM users WHERE id=$1', [teacherId])
    : { rows: [] };
  return JSON.stringify({ student: student.rows, subjects: subjects.rows, teacher: teacherRow.rows });
}

// ── Policy (unit level, same functions the routes call) ──────────────────────

test('policy: accepts 123456 and other sequential six-digit PINs', () => {
  for (const pin of ['123456', '234567', '345678', '456789', '987654', '654321', '012345']) {
    assert.deepEqual(checkPin(pin), { ok: true }, pin);
  }
});

test('policy: rejects 000000, 111111 and every other six-identical-digit PIN', () => {
  for (let d = 0; d <= 9; d++) {
    const pin = String(d).repeat(6);
    const r = checkPin(pin);
    assert.equal(r.ok, false, pin);
    if (!r.ok) assert.equal(r.reason, 'trivial', pin);
  }
});

test('policy: rejects five-digit, seven-digit, letters and non-numeric characters', () => {
  for (const bad of ['12345', '1234567', 'abcdef', '12345a', '12-456', '12 456', ' 123456', '123456 ', '١٢٣٤٥٦', '１２３４５６', '', 123456, null, undefined]) {
    const r = checkPin(bad as unknown);
    assert.equal(r.ok, false, String(bad));
    if (!r.ok) assert.equal(r.reason, 'format', String(bad));
  }
});

test('policy: administrator-issued temporary PINs are six digits and never identical digits', () => {
  for (let i = 0; i < 500; i++) {
    const pin = generateTemporaryPin();
    assert.match(pin, /^\d{6}$/);
    assert.equal(isTrivialPin(pin), false);
  }
});

// ── Routes: same rule on every teacher/student PIN endpoint ──────────────────

test('POST /auth/pin applies the policy for teachers and students', async () => {
  for (const role of ['teacher', 'student'] as const) {
    const u = await makePinUser(role, '482913');
    const l = await login(u.username, '482913');
    assert.equal(l.status, 200, `${role} login`);
    const auth = bearer(l.json.access_token);
    for (const bad of ['000000', '111111', '12345', '1234567', 'abcdef', '12a456']) {
      assert.equal((await post('/auth/pin', { current_credential: '482913', new_pin: bad }, auth)).status, 400, `${role} ${bad}`);
    }
    const ok = await post('/auth/pin', { current_credential: '482913', new_pin: '123456' }, auth);
    assert.equal(ok.status, 200, `${role} may choose 123456`);
    assert.equal((await login(u.username, '123456')).status, 200, `${role} signs in with 123456`);
  }
});

test('teacher first-time PIN setup: admin-created teacher with a temporary six-digit PIN must replace it', async () => {
  const className = `PIN6 Class ${sfx()}`;
  await query('INSERT INTO classes(school_code,name) VALUES($1,$2)', ['primary', className]);
  createdClasses.push(className);

  // The obsolete four-digit code and identical digits are refused.
  for (const bad of ['1234', '12345', '111111', '000000', 'abcdef']) {
    const r = await post('/admin/users', {
      full_name: 'PIN6 Teacher', role: 'teacher', school_code: 'primary', assigned_class: className,
      assigned_class_names: [], assigned_subject_ids: [], initial_password: bad,
    }, adminHeaders());
    assert.equal(r.status, 400, `initial_password ${bad}`);
  }
  const created = await post('/admin/users', {
    full_name: 'PIN6 Teacher', role: 'teacher', school_code: 'primary', assigned_class: className,
    assigned_class_names: [], assigned_subject_ids: [], initial_password: '246813',
  }, adminHeaders());
  assert.equal(created.status, 201, JSON.stringify(created.json));
  const teacherId = String(created.json.user.id);
  createdUserIds.push(teacherId);
  const username = created.json.user.username as string;

  const { rows } = await query('SELECT pin_hash_version, must_set_pin, password_hash FROM users WHERE id=$1', [teacherId]);
  assert.equal(rows[0].pin_hash_version, PIN_HASH_VERSION, 'temporary PIN is stored with the peppered scheme');
  assert.equal(rows[0].must_set_pin, true, 'temporary PIN must be replaced');
  assert.ok(!String(rows[0].password_hash).includes('246813'));

  const l = await login(username, '246813');
  assert.equal(l.status, 200);
  assert.equal(l.json.pin_setup_required, true);
  assert.equal(l.json.must_change_pw, false, 'teachers are never sent to the administrator password-change flow');
  const auth = bearer(l.json.access_token);
  const blocked = await get('/protected', l.json.access_token);
  assert.equal(blocked.status, 403);
  assert.equal(blocked.json.code, 'PIN_SETUP_REQUIRED');
  assert.equal((await post('/auth/pin', { current_credential: '246813', new_pin: '246813' }, auth)).status, 400, 'must differ from temporary PIN');
  assert.equal((await post('/auth/pin', { current_credential: '246813', new_pin: '345678' }, auth)).status, 200);
  const me = await get('/auth/me', l.json.access_token);
  assert.equal(me.json.pin_setup_required, false);
  assert.equal((await login(username, '246813')).status, 401, 'temporary PIN no longer works');
  const fresh = await login(username, '345678');
  assert.equal(fresh.status, 200);
  assert.equal(fresh.json.pin_setup_required, false);
});

test('student first-time PIN setup: activation sets a permanent six-digit PIN in one step', async () => {
  const created = await post('/admin/users', {
    username: uname('stu-act'), full_name: 'PIN6 Activated Student', role: 'student', school_code: 'primary',
  }, adminHeaders());
  assert.equal(created.status, 201, JSON.stringify(created.json));
  const id = String(created.json.user.id);
  createdUserIds.push(id);
  const { username, activation_code } = created.json.user;

  // Policy violations do not consume the code.
  for (const bad of ['111111', '12345', 'LongPassword123']) {
    const r = await post('/auth/activate', { username, activation_code, new_pin: bad });
    assert.equal(r.status, 400, bad);
  }
  const ok = await post('/auth/activate', { username, activation_code, new_pin: '123456' });
  assert.equal(ok.status, 201, JSON.stringify(ok.json));
  const { rows } = await query('SELECT pin_hash_version, must_set_pin, activation_code FROM users WHERE id=$1', [id]);
  assert.equal(rows[0].pin_hash_version, PIN_HASH_VERSION);
  assert.equal(rows[0].must_set_pin, false, 'a PIN the student chose is permanent');
  assert.equal(rows[0].activation_code, null);
  const l = await login(username, '123456');
  assert.equal(l.status, 200);
  assert.equal(l.json.pin_setup_required, false);
  assert.equal((await get('/protected', l.json.access_token)).status, 200);
});

test('student first-time PIN setup: self-registration requires a six-digit PIN and it is permanent', async () => {
  const studentId = await makeStudentRecord(null);
  const { rows: s } = await query('SELECT admission_number FROM students WHERE id=$1', [studentId]);
  const username = uname('stu-reg');
  const body = (pin: string) => ({
    role: 'student', full_name: 'PIN6 Student Record', phone: '08012345678', school_code: 'primary',
    username, pin, admission_number: s[0].admission_number,
  });
  for (const bad of ['000000', '12345', '1234567', 'password1']) {
    assert.equal((await post('/auth/self-register', body(bad))).status, 400, bad);
  }
  const r = await post('/auth/self-register', body('234567'));
  assert.equal(r.status, 201, JSON.stringify(r.json));
  const { rows } = await query('SELECT id, pin_hash_version, must_set_pin FROM users WHERE username=$1', [username]);
  createdUserIds.push(String(rows[0].id));
  assert.equal(rows[0].pin_hash_version, PIN_HASH_VERSION);
  assert.equal(rows[0].must_set_pin, false);
  const l = await login(username, '234567');
  assert.equal(l.status, 200);
  assert.equal(l.json.pin_setup_required, false);
});

test('teacher and student PIN change revokes other sessions; this device stays signed in', async () => {
  for (const role of ['teacher', 'student'] as const) {
    const u = await makePinUser(role, '918273');
    const a = await login(u.username, '918273');
    const b = await login(u.username, '918273');
    const r = await post('/auth/pin', { current_credential: '918273', new_pin: '192837' }, bearer(a.json.access_token));
    assert.equal(r.status, 200);
    assert.equal((await get('/protected', a.json.access_token)).status, 200, `${role}: changing device keeps its session`);
    assert.equal((await get('/protected', b.json.access_token)).status, 401, `${role}: other device signed out`);
    assert.equal((await post('/auth/refresh', { refresh_token: b.json.refresh_token })).status, 401, `${role}: other refresh token dead`);
    assert.equal((await login(u.username, '918273')).status, 401, `${role}: old PIN invalid`);
    assert.equal((await login(u.username, '192837')).status, 200);
  }
});

test('teacher and student reset: temporary six-digit PIN, every session revoked, old PIN invalid, new PIN forced', async () => {
  for (const role of ['teacher', 'student'] as const) {
    const u = await makePinUser(role, '564738');
    const studentRecord = await makeStudentRecord(role === 'student' ? u.id : null);
    const before = await academicSnapshot(studentRecord, role === 'teacher' ? u.id : undefined);
    const session = await login(u.username, '564738');
    assert.equal((await get('/protected', session.json.access_token)).status, 200);

    const reset = await post(`/admin/users/${u.id}/reset-password`, {}, adminHeaders());
    assert.equal(reset.status, 200);
    const temp = reset.json.temporary_pin as string;
    assert.match(temp, /^\d{6}$/);
    assert.equal(isTrivialPin(temp), false);

    assert.equal((await get('/protected', session.json.access_token)).status, 401, `${role}: old session revoked`);
    assert.equal((await post('/auth/refresh', { refresh_token: session.json.refresh_token })).status, 401, `${role}: old refresh revoked`);
    assert.equal((await login(u.username, '564738')).status, 401, `${role}: old PIN invalid`);

    const l = await login(u.username, temp);
    assert.equal(l.status, 200);
    assert.equal(l.json.pin_setup_required, true, `${role}: must replace temporary PIN`);
    assert.equal(l.json.must_change_pw, false);
    assert.equal((await get('/protected', l.json.access_token)).json.code, 'PIN_SETUP_REQUIRED');
    assert.equal((await post('/auth/pin', { current_credential: temp, new_pin: '777777' }, bearer(l.json.access_token))).status, 400);
    assert.equal((await post('/auth/pin', { current_credential: temp, new_pin: '135792' }, bearer(l.json.access_token))).status, 200);
    assert.equal((await login(u.username, '135792')).json.pin_setup_required, false);

    assert.equal(await academicSnapshot(studentRecord, role === 'teacher' ? u.id : undefined), before, `${role}: academic records untouched`);
  }
});

test('existing valid accounts still sign in without being forced to change anything', async () => {
  const peppered = await makePinUser('student', '314159');
  const legacy = await makePinUser('teacher', '271828', { legacy: true });
  for (const [u, pin] of [[peppered, '314159'], [legacy, '271828']] as const) {
    const l = await login(u.username, pin);
    assert.equal(l.status, 200, u.username);
    assert.equal(l.json.pin_setup_required, false, u.username);
    assert.equal((await get('/protected', l.json.access_token)).status, 200);
  }
  // A teacher still holding an older four-digit temporary code is not locked
  // out: it signs in and is sent to the six-digit PIN screen.
  const oldCode = await makePinUser('teacher', '4821', { legacy: true, mustSetPin: true });
  const l = await post('/auth/login', { username: oldCode.username, password: '4821' }, { 'x-device-id': device() });
  assert.equal(l.status, 200);
  assert.equal(l.json.pin_setup_required, true);
  assert.equal((await post('/auth/pin', { current_credential: '4821', new_pin: '482100' }, bearer(l.json.access_token))).status, 200);
  assert.equal((await login(oldCode.username, '482100')).json.pin_setup_required, false);
});

test('teachers and students cannot use the administrator password-change route', async () => {
  for (const role of ['teacher', 'student'] as const) {
    const u = await makePinUser(role, '808182');
    const l = await login(u.username, '808182');
    const r = await post('/auth/change-password', { old_password: '808182', new_password: 'Some-Long-Passw0rd' }, bearer(l.json.access_token));
    assert.equal(r.status, 400);
    assert.equal(r.json.code, 'USE_PIN_ENDPOINT');
    assert.equal((await login(u.username, '808182')).status, 200, 'credential unchanged');
  }
});

test('administrator password change stays separate and requires a strong password', async () => {
  const name = uname('admin-pw');
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,is_active) VALUES($1,$2,'admin','PIN6 Admin',TRUE) RETURNING id, password_hash`,
    [name, await bcrypt.hash('Original-Admin-Passw0rd', 4)],
  );
  const id = String(rows[0].id);
  createdUserIds.push(id);
  const l = await post('/auth/login', { username: name, password: 'Original-Admin-Passw0rd' }, { 'x-device-id': device() });
  assert.equal(l.status, 200);
  assert.equal(l.json.pin_setup_required, false, 'administrators are never put on the PIN screen');
  const auth = bearer(l.json.access_token);
  assert.equal((await post('/auth/pin', { current_credential: 'Original-Admin-Passw0rd', new_pin: '123456' }, auth)).status, 403, 'six-digit PINs do not apply to administrators');
  assert.equal((await post('/auth/change-password', { old_password: 'Original-Admin-Passw0rd', new_password: '123456' }, auth)).status, 400, 'a six-digit PIN is too weak for an administrator');
  assert.equal((await post('/auth/change-password', { old_password: 'Original-Admin-Passw0rd', new_password: 'New-Strong-Admin-Passw0rd!' }, auth)).status, 200);
  const after = await query('SELECT pin_hash_version, must_set_pin FROM users WHERE id=$1', [id]);
  assert.equal(after.rows[0].pin_hash_version, null);
  assert.equal(after.rows[0].must_set_pin, false);
  assert.equal((await post('/auth/login', { username: name, password: 'New-Strong-Admin-Passw0rd!' }, { 'x-device-id': device() })).status, 200);

  // Administrator activation keeps the 8+ character password rule.
  const created = await post('/admin/users', { username: uname('admin-act'), full_name: 'PIN6 New Admin', role: 'admin' }, adminHeaders());
  assert.equal(created.status, 201, JSON.stringify(created.json));
  createdUserIds.push(String(created.json.user.id));
  {
    const { username, activation_code } = created.json.user;
    assert.equal((await post('/auth/activate', { username, activation_code, new_password: 'short' })).status, 400);
    assert.equal((await post('/auth/activate', { username, activation_code, new_password: '123456' })).status, 400, 'a PIN is not an administrator password');
    assert.equal((await post('/auth/activate', { username, activation_code, new_password: 'Admin-Activated-Passw0rd' })).status, 201);
    const { rows: act } = await query('SELECT pin_hash_version, must_set_pin FROM users WHERE username=$1', [username]);
    assert.equal(act[0].pin_hash_version, null);
    assert.equal(act[0].must_set_pin, false);
  }
});


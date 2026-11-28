// End-to-end tests for the legacy-PIN login migration and the "no forced
// change" rule for administrator-issued temporary credentials (PR #1062),
// against a real PostgreSQL schema:
//
//   * existing students, parents and teachers whose credential is a legacy
//     four-digit or eight-digit code sign in with it, then must establish a
//     six-digit PIN before any dashboard route; nobody re-registers and no
//     record or link is lost or detached;
//   * existing six-digit users go straight to their dashboards;
//   * administrator-issued temporary PINs (teacher creation, PIN reset, parent
//     auto-provisioning) and temporary passwords (Administrator / Finance
//     Administrator reset) open the dashboard directly;
//   * voluntary PIN and password changes keep working; administrator passwords
//     stay separate from the six-digit PIN policy;
//   * migration 0023 clears only flags it can attribute (public-role PIN rows;
//     administrator flags only where the audit log shows an old reset event);
//   * the login/reset and PIN-change/reset races never leave the replaced
//     credential with a session or overwrite the administrator's reset;
//   * a four-digit initial teacher PIN is rejected with an actionable message.
//
// Run: node --import tsx --test --test-concurrency=1 tests/backend-legacy-pin-migration.integration.test.mts
process.env.PIN_PEPPER ||= 'test-pepper-0123456789-0123456789-0123456789-abcdef';
process.env.JWT_SECRET ||= 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET ||= 'test-jwt-refresh-secret';

import 'express-async-errors';
import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';
import { randomBytes, randomInt } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after, before } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import authRouter from '../backend/src/routes/auth.js';
import adminRouter from '../backend/src/routes/admin.js';
import studentsRouter from '../backend/src/routes/students.js';
import { requireAuth } from '../backend/src/middleware/auth.js';
import { signAccess } from '../backend/src/utils/jwt.js';
import { PIN_HASH_VERSION, hashPin, isTrivialPin } from '../backend/src/utils/pin.js';
import { isLegacyPinFormat } from '../backend/src/routes/auth.js';
import { auditStrict } from '../backend/src/utils/audit.js';

const sfx = () => randomInt(100_000_000, 999_999_999).toString();
const uname = (label: string) => `legacy-${label}-${sfx()}`;
const device = () => randomBytes(12).toString('hex');
const NEW_PIN = '582047';
const LEGACY_CODES = { 'four-digit': '4821', 'eight-digit': '48213579' } as const;
const PIN_ROLES = ['student', 'parent', 'teacher'] as const;
type PinRole = typeof PIN_ROLES[number];

let server: Server;
let base = '';
let globalAdminToken = '';
let primaryAdminToken = '';
let subjectId = 0;
const createdUserIds: string[] = [];
const createdStudentIds: string[] = [];
// Created through POST /students: their report-roster events are append-only
// by design, so these rows are soft-deleted rather than removed.
const routeStudentIds: string[] = [];

before(async () => {
  const mkAdmin = async (school: string | null) => {
    const name = uname(`admin-${school ?? 'global'}`);
    const { rows } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active)
       VALUES($1,$2,'admin','Legacy PIN Test Administrator',$3,TRUE) RETURNING id`,
      [name, await bcrypt.hash('Admin-Strong-Passw0rd!', 4), school],
    );
    const id = String(rows[0].id);
    createdUserIds.push(id);
    return signAccess({ id, username: name, role: 'admin', school_code: school, assigned_class: null, assigned_subject_ids: [] });
  };
  globalAdminToken = await mkAdmin(null);
  primaryAdminToken = await mkAdmin('primary');
  const { rows: subj } = await query('INSERT INTO subjects(school_code,name) VALUES($1,$2) RETURNING id', ['primary', `Legacy PIN Subject ${sfx()}`]);
  subjectId = Number(subj[0].id);

  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);
  app.use('/admin', adminRouter);
  app.use('/students', studentsRouter);
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
  if (routeStudentIds.length) {
    await query('DELETE FROM parent_wards WHERE student_id = ANY($1::uuid[])', [routeStudentIds]);
    await query('UPDATE students SET deleted_at=now() WHERE id = ANY($1::uuid[])', [routeStudentIds]);
  }
  if (createdStudentIds.length) await query('DELETE FROM students WHERE id = ANY($1::uuid[])', [createdStudentIds]);
  if (createdUserIds.length) {
    await query('DELETE FROM auth_sessions WHERE user_id = ANY($1::uuid[])', [createdUserIds]);
    await query('DELETE FROM teacher_class_subjects WHERE user_id = ANY($1::uuid[])', [createdUserIds]);
    await query('DELETE FROM teacher_subjects WHERE user_id = ANY($1::uuid[])', [createdUserIds]);
    await query('DELETE FROM users WHERE id = ANY($1::uuid[])', [createdUserIds]);
  }
  if (subjectId) await query('DELETE FROM subjects WHERE id=$1', [subjectId]);
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
const bearer = (t: string) => ({ authorization: `Bearer ${t}` });
const login = (username: string, secret: string, field: 'pin' | 'password' = 'pin', dev = device()) =>
  post('/auth/login', { username, [field]: secret }, { 'x-device-id': dev });

async function makeStudentRecord(userId: string | null) {
  const { rows } = await query(
    `INSERT INTO students(full_name,class_name,school_code,admission_number,user_id)
     VALUES('Legacy PIN Student','Primary 4','primary',$1,$2) RETURNING id`,
    [`LEGACY-${sfx()}`, userId],
  );
  const id = String(rows[0].id);
  createdStudentIds.push(id);
  return id;
}

/**
 * An existing account as it stands in production today: a legacy (unpeppered)
 * bcrypt hash, no forced-change flags (migration 0020), and its real-world
 * associations — student record, parent-ward link, or teacher assignments.
 */
async function makeExistingAccount(role: PinRole, secret: string) {
  const username = uname(role);
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,assigned_class,assigned_class_names,is_active,must_set_pin,must_change_pw)
     VALUES($1,$2,$3,'Legacy PIN User','primary',$4,$5::text[],TRUE,FALSE,FALSE) RETURNING id`,
    [username, await bcrypt.hash(secret, 4), role,
      role === 'teacher' ? 'Primary 4' : null, role === 'teacher' ? ['Primary 4'] : []],
  );
  const id = String(rows[0].id);
  createdUserIds.push(id);
  let studentId: string;
  if (role === 'student') {
    studentId = await makeStudentRecord(id);
  } else {
    studentId = await makeStudentRecord(null);
    if (role === 'parent') await query('INSERT INTO parent_wards(parent_id,student_id) VALUES($1,$2)', [id, studentId]);
    if (role === 'teacher') await query('INSERT INTO teacher_subjects(user_id,subject_id) VALUES($1,$2)', [id, subjectId]);
  }
  return { id, username, studentId };
}

/** Everything that must survive the migration untouched. */
async function associations(userId: string, studentId: string) {
  const user = await query(
    `SELECT id, username, role, school_code, assigned_class, assigned_class_names, is_active, pending_admin_review
       FROM users WHERE id=$1`, [userId]);
  const student = await query('SELECT id, user_id, school_code, class_name, full_name, admission_number, deleted_at FROM students WHERE id=$1', [studentId]);
  const wards = await query('SELECT parent_id, student_id FROM parent_wards WHERE parent_id=$1 OR student_id=$2 ORDER BY parent_id', [userId, studentId]);
  const subjects = await query('SELECT subject_id FROM teacher_subjects WHERE user_id=$1 ORDER BY subject_id', [userId]);
  const classSubjects = await query('SELECT class_id, subject_id FROM teacher_class_subjects WHERE user_id=$1 ORDER BY class_id, subject_id', [userId]);
  return JSON.stringify({ user: user.rows, student: student.rows, wards: wards.rows, subjects: subjects.rows, classSubjects: classSubjects.rows });
}

// ── Format rule ──────────────────────────────────────────────────────────────

test('legacy format: anything other than exactly six digits needs a new six-digit PIN', () => {
  for (const legacy of ['4821', '48213579', '12345', '1234567', 'Abc12345', 'LegacyPassw0rd!']) {
    assert.equal(isLegacyPinFormat(legacy), true, legacy);
  }
  for (const pin of ['482913', '123456', '000001']) assert.equal(isLegacyPinFormat(pin), false, pin);
});

// ── Legacy four-digit and eight-digit users ──────────────────────────────────

for (const role of PIN_ROLES) {
  for (const [kind, legacy] of Object.entries(LEGACY_CODES)) {
    test(`${role} with a ${kind} legacy code signs in, must set a six-digit PIN, then reaches the dashboard with every record intact`, async () => {
      const acct = await makeExistingAccount(role, legacy);
      const before = await associations(acct.id, acct.studentId);

      // Wrong legacy code is still refused (no format shortcut).
      assert.equal((await login(acct.username, legacy.replace(/.$/, (d) => String((Number(d) + 1) % 10)))).status, 401);

      // Older builds sending `password` and current builds sending `pin` both work.
      const l = await login(acct.username, legacy, role === 'teacher' ? 'password' : 'pin');
      assert.equal(l.status, 200, JSON.stringify(l.json));
      assert.equal(l.json.user.id, acct.id, 'same account, no re-registration');
      assert.equal(l.json.user.role, role);
      assert.equal(l.json.pin_setup_required, true, 'six-digit PIN required');
      assert.equal(l.json.must_set_pin, true);
      assert.equal(l.json.must_change_pw, false, 'never the administrator password flow');
      const token = l.json.access_token as string;

      const me = await get('/auth/me', token);
      assert.equal(me.status, 200);
      assert.equal(me.json.pin_setup_required, true);
      const blocked = await get('/protected', token);
      assert.equal(blocked.status, 403);
      assert.equal(blocked.json.code, 'PIN_SETUP_REQUIRED');
      assert.equal((await get('/students', token)).json?.code, 'PIN_SETUP_REQUIRED', 'normal dashboard data is gated');

      // The requirement survives a new device and a token refresh.
      const other = await login(acct.username, legacy);
      assert.equal(other.json.pin_setup_required, true);
      const refreshed = await post('/auth/refresh', { refresh_token: l.json.refresh_token });
      assert.equal((await get('/protected', refreshed.json.access_token)).json.code, 'PIN_SETUP_REQUIRED');

      // The legacy credential is proof enough to set the new PIN; policy still applies.
      assert.equal((await post('/auth/pin', { current_credential: legacy, new_pin: '777777' }, bearer(refreshed.json.access_token))).status, 400);
      const set = await post('/auth/pin', { current_credential: legacy, new_pin: NEW_PIN }, bearer(refreshed.json.access_token));
      assert.equal(set.status, 200, JSON.stringify(set.json));

      assert.equal((await get('/protected', refreshed.json.access_token)).status, 200, 'released on this device');
      const { rows } = await query('SELECT must_set_pin, must_change_pw, pin_hash_version FROM users WHERE id=$1', [acct.id]);
      assert.deepEqual(rows[0], { must_set_pin: false, must_change_pw: false, pin_hash_version: PIN_HASH_VERSION });

      assert.equal((await login(acct.username, legacy)).status, 401, 'legacy code retired');
      const fresh = await login(acct.username, NEW_PIN);
      assert.equal(fresh.status, 200);
      assert.equal(fresh.json.pin_setup_required, false);
      assert.equal((await get('/protected', fresh.json.access_token)).status, 200);

      assert.equal(await associations(acct.id, acct.studentId), before, 'account, student record, ward link and teacher assignments unchanged');
    });
  }
}

test('a gated legacy user whose sign-in is still pending approval stays pending first', async () => {
  const acct = await makeExistingAccount('parent', LEGACY_CODES['eight-digit']);
  await query('UPDATE users SET pending_admin_review=TRUE WHERE id=$1', [acct.id]);
  const l = await login(acct.username, LEGACY_CODES['eight-digit']);
  assert.equal(l.json.pending_admin_review, true);
  assert.equal((await get('/protected', l.json.access_token)).json.code, 'PENDING_APPROVAL');
  await query('UPDATE users SET pending_admin_review=FALSE WHERE id=$1', [acct.id]);
  assert.equal((await get('/protected', l.json.access_token)).json.code, 'PIN_SETUP_REQUIRED');
});

// ── Existing six-digit users ─────────────────────────────────────────────────

test('existing six-digit users (legacy and peppered hashes) go straight to their dashboards, even with a stale flag', async () => {
  for (const role of PIN_ROLES) {
    const legacy = await makeExistingAccount(role, '730518');
    const before = await associations(legacy.id, legacy.studentId);
    const l = await login(legacy.username, '730518');
    assert.equal(l.status, 200, role);
    assert.equal(l.json.pin_setup_required, false, role);
    assert.equal((await get('/protected', l.json.access_token)).status, 200, role);
    assert.equal(await associations(legacy.id, legacy.studentId), before, `${role}: nothing detached`);

    const peppered = await makeExistingAccount(role, 'unused');
    await query(
      `UPDATE users SET password_hash=$1, pin_hash_version=$2, pin_set_at=clock_timestamp() WHERE id=$3`,
      [await hashPin('604215'), PIN_HASH_VERSION, peppered.id],
    );
    // A stale forced-change flag from the earlier policy is cleared at sign-in.
    await query('UPDATE users SET must_set_pin=TRUE, must_change_pw=TRUE WHERE id=$1', [peppered.id]);
    const p = await login(peppered.username, '604215');
    assert.equal(p.json.pin_setup_required, false, `${role}: peppered`);
    assert.equal((await get('/protected', p.json.access_token)).status, 200, `${role}: peppered`);
    const { rows } = await query('SELECT must_set_pin, must_change_pw FROM users WHERE id=$1', [peppered.id]);
    assert.deepEqual(rows[0], { must_set_pin: false, must_change_pw: false });
  }
});

// ── Administrator-issued temporary PINs ──────────────────────────────────────

test('admin PIN reset for student, parent and teacher: temporary PIN opens the dashboard, records untouched, voluntary change works', async () => {
  for (const role of PIN_ROLES) {
    const acct = await makeExistingAccount(role, LEGACY_CODES['four-digit']);
    const before = await associations(acct.id, acct.studentId);
    const reset = await post(`/admin/users/${acct.id}/reset-password`, {}, bearer(globalAdminToken));
    assert.equal(reset.status, 200, JSON.stringify(reset.json));
    const temp = reset.json.temporary_pin as string;
    assert.match(temp, /^\d{6}$/);
    assert.equal(isTrivialPin(temp), false);

    assert.equal((await login(acct.username, LEGACY_CODES['four-digit'])).status, 401, `${role}: old credential retired`);
    const l = await login(acct.username, temp);
    assert.equal(l.status, 200);
    assert.equal(l.json.pin_setup_required, false, `${role}: no mandatory change`);
    assert.equal(l.json.must_change_pw, false);
    assert.equal((await get('/protected', l.json.access_token)).status, 200, `${role}: dashboard`);

    const change = await post('/auth/pin', { current_credential: temp, new_pin: NEW_PIN }, bearer(l.json.access_token));
    assert.equal(change.status, 200, `${role}: voluntary change`);
    assert.equal((await login(acct.username, NEW_PIN)).json.pin_setup_required, false);
    assert.equal(await associations(acct.id, acct.studentId), before, `${role}: records untouched`);
  }
});

test('admin-created teacher: temporary six-digit PIN opens the dashboard with assignments in place', async () => {
  const created = await post('/admin/users', {
    full_name: 'Legacy PIN Subject Teacher', role: 'teacher', school_code: 'primary', username: uname('subj'),
    assigned_class_names: ['Primary 4'], assigned_subject_ids: [subjectId], initial_password: '360741',
  }, bearer(primaryAdminToken));
  assert.equal(created.status, 201, JSON.stringify(created.json));
  const id = String(created.json.user.id);
  createdUserIds.push(id);
  const l = await login(created.json.user.username, '360741');
  assert.equal(l.status, 200);
  assert.equal(l.json.pin_setup_required, false);
  assert.equal((await get('/protected', l.json.access_token)).status, 200);
  const { rows } = await query('SELECT subject_id FROM teacher_subjects WHERE user_id=$1', [id]);
  assert.deepEqual(rows.map((r: any) => Number(r.subject_id)), [subjectId]);
});

test('auto-provisioned parent: temporary six-digit PIN opens the dashboard and the ward link is in place', async () => {
  const phone = `080${sfx().slice(0, 8)}`;
  const r = await post('/students', {
    full_name: `Legacy PIN Enrolee ${sfx()}`, class_name: 'Primary 4', school_code: 'primary',
    parent_name: 'Legacy PIN Parent', parent_phone: phone,
  }, bearer(primaryAdminToken));
  assert.equal(r.status, 201, JSON.stringify(r.json));
  const studentId = String(r.json.student.id);
  routeStudentIds.push(studentId);
  const parent = r.json.parent;
  createdUserIds.push(String(parent.id));
  assert.match(parent.temporary_pin, /^\d{6}$/);
  assert.equal(parent.temporary_password, parent.temporary_pin);
  assert.equal('created' in parent, false, 'internal field not exposed');

  const l = await login(parent.username, parent.temporary_pin);
  assert.equal(l.status, 200, JSON.stringify(l.json));
  assert.equal(l.json.pin_setup_required, false);
  assert.equal((await get('/protected', l.json.access_token)).status, 200);
  const wards = await get('/students/wards', l.json.access_token);
  assert.equal(wards.status, 200, JSON.stringify(wards.json));
  assert.ok(JSON.stringify(wards.json).includes(studentId), 'ward visible to the parent');
});

// ── Administrator / Finance Administrator temporary passwords ────────────────

test('admin and finance-admin password reset: temporary password opens the dashboard; voluntary change still works; PIN policy does not apply', async () => {
  for (const role of ['admin', 'finance_admin'] as const) {
    const name = uname(role);
    const { rows } = await query(
      `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,must_change_pw)
       VALUES($1,$2,$3,'Legacy PIN Staff',$4,TRUE,FALSE) RETURNING id`,
      [name, await bcrypt.hash('Original-Staff-Passw0rd', 4), role, role === 'admin' ? 'primary' : null],
    );
    const id = String(rows[0].id);
    createdUserIds.push(id);

    const reset = await post(`/admin/users/${id}/reset-password`, {}, bearer(globalAdminToken));
    assert.equal(reset.status, 200, JSON.stringify(reset.json));
    const temp = reset.json.temporary_password as string;
    assert.equal(reset.json.temporary_pin, undefined, `${role}: not a PIN`);
    assert.ok(temp.length >= 8, `${role}: password, not a six-digit PIN`);
    const { rows: flags } = await query('SELECT must_change_pw, must_set_pin, pin_hash_version FROM users WHERE id=$1', [id]);
    assert.deepEqual(flags[0], { must_change_pw: false, must_set_pin: false, pin_hash_version: null });

    const l = await login(name, temp, 'password');
    assert.equal(l.status, 200, role);
    assert.equal(l.json.must_change_pw, false, `${role}: no mandatory password change`);
    assert.equal(l.json.pin_setup_required, false);
    const auth = bearer(l.json.access_token);
    assert.equal((await get('/protected', l.json.access_token)).status, 200, `${role}: dashboard`);
    assert.equal((await post('/auth/pin', { current_credential: temp, new_pin: NEW_PIN }, auth)).status, 403, `${role}: six-digit PIN route closed`);
    assert.equal((await post('/auth/change-password', { old_password: temp, new_password: '123456' }, auth)).status, 400, `${role}: a PIN is too weak`);
    const cp = await post('/auth/change-password', { old_password: temp, new_password: 'Chosen-Staff-Passw0rd!' }, auth);
    assert.equal(cp.status, 200, `${role}: voluntary change ${JSON.stringify(cp.json)}`);
    assert.equal((await login(name, 'Chosen-Staff-Passw0rd!', 'password')).status, 200);
    assert.equal((await login(name, temp, 'password')).status, 401);
  }
});

// ── Migration 0023 ───────────────────────────────────────────────────────────

const OLD_RESET_DETAIL = 'administrator reset user password; forced password change on next login';
const NEW_RESET_DETAIL = 'administrator reset user password; temporary password issued; no forced change on next login'; // as written by the route

async function makeStaff(role: 'admin' | 'finance_admin', label: string, mustChange: boolean) {
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,must_change_pw)
     VALUES($1,$2,$3,'Legacy PIN Staff',NULL,TRUE,$4) RETURNING id`,
    [uname(label), await bcrypt.hash('Temp-Staff-Passw0rd', 4), role, mustChange],
  );
  const id = String(rows[0].id);
  createdUserIds.push(id);
  return id;
}
async function writeResetEvent(targetId: string, kind: 'old' | 'new', outcome: 'success' | 'failure' = 'success') {
  await auditStrict(null, 'reset_password', 'user', targetId,
    kind === 'old' ? OLD_RESET_DETAIL : NEW_RESET_DETAIL,
    { metadata: { target_user_id: targetId }, outcome });
}

test('migration 0023: public roles as before; administrator flags cleared ONLY where an old reset event is on record', async () => {
  const sql = readFileSync(new URL('../backend/migrations/0023_admin_issued_credentials_no_forced_change.sql', import.meta.url), 'utf8');

  // Public roles (unchanged behaviour).
  const issuedPin = await makeExistingAccount('teacher', 'unused');
  await query(`UPDATE users SET password_hash=$1, pin_hash_version=1, pin_set_at=clock_timestamp() WHERE id=$2`, [await hashPin('604215'), issuedPin.id]);
  await query('UPDATE users SET must_set_pin=TRUE, must_change_pw=FALSE WHERE id=$1', [issuedPin.id]);
  const legacyGated = await makeExistingAccount('parent', LEGACY_CODES['eight-digit']);
  await query('UPDATE users SET must_set_pin=TRUE, must_change_pw=TRUE WHERE id=$1', [legacyGated.id]);

  // Administrator accounts, each flagged must_change_pw = TRUE.
  const oldResetAdmin = await makeStaff('admin', 'old-admin', true);
  const oldResetFinance = await makeStaff('finance_admin', 'old-fa', true);
  const seededDefault = await makeStaff('admin', 'seeded-default', true);          // no audit event at all
  const otherTarget = await makeStaff('admin', 'other-target', true);               // only OTHER accounts have events
  const superseded = await makeStaff('admin', 'superseded', true);                  // newer-style reset came later
  const failedEvent = await makeStaff('admin', 'failed-event', true);               // old-style but outcome = failure
  const unrelatedEvent = await makeStaff('admin', 'unrelated', true);               // only a login event
  await writeResetEvent(oldResetAdmin, 'old');
  await writeResetEvent(oldResetFinance, 'old');
  await writeResetEvent(oldResetAdmin, 'old'); // repeated old resets are still old
  await writeResetEvent(superseded, 'old');
  await writeResetEvent(superseded, 'new');
  await writeResetEvent(failedEvent, 'old', 'failure');
  await auditStrict(null, 'login', 'user', unrelatedEvent, undefined, {});

  const staff = { oldResetAdmin, oldResetFinance, seededDefault, otherTarget, superseded, failedEvent, unrelatedEvent };
  const ids = [issuedPin.id, legacyGated.id, ...Object.values(staff)];
  const before = (await query('SELECT id, password_hash, pin_hash_version, is_active FROM users WHERE id=ANY($1::uuid[]) ORDER BY id', [ids])).rows;
  const links = [await associations(issuedPin.id, issuedPin.studentId), await associations(legacyGated.id, legacyGated.studentId)];

  await query(sql);
  await query(sql); // idempotent

  const flags = new Map((await query('SELECT id, must_set_pin, must_change_pw FROM users WHERE id=ANY($1::uuid[])', [ids])).rows
    .map((r: any) => [String(r.id), { must_set_pin: r.must_set_pin, must_change_pw: r.must_change_pw }]));
  assert.deepEqual(flags.get(issuedPin.id), { must_set_pin: false, must_change_pw: false }, 'administrator-issued six-digit PIN freed');
  assert.deepEqual(flags.get(legacyGated.id), { must_set_pin: true, must_change_pw: true }, 'legacy-format row left for the sign-in step to decide');

  assert.equal(flags.get(oldResetAdmin)!.must_change_pw, false, 'flag from an old administrator reset is cleared');
  assert.equal(flags.get(oldResetFinance)!.must_change_pw, false, 'same for Finance Administrator');
  for (const [label, id] of Object.entries({ seededDefault, otherTarget, superseded, failedEvent, unrelatedEvent })) {
    assert.equal(flags.get(id)!.must_change_pw, true, `${label}: ambiguous flag left untouched`);
  }
  assert.deepEqual((await query('SELECT id, password_hash, pin_hash_version, is_active FROM users WHERE id=ANY($1::uuid[]) ORDER BY id', [ids])).rows, before, 'no credential or account state written');
  assert.deepEqual([await associations(issuedPin.id, issuedPin.studentId), await associations(legacyGated.id, legacyGated.studentId)], links);

  // The legacy row is still resolved correctly at sign-in.
  const l = await login(legacyGated.username, LEGACY_CODES['eight-digit']);
  assert.equal(l.json.pin_setup_required, true);
});

test('new administrator-issued temporary password still needs no forced change after migration 0023', async () => {
  const id = await makeStaff('admin', 'post-0023', true);
  await writeResetEvent(id, 'old');
  const reset = await post(`/admin/users/${id}/reset-password`, {}, bearer(globalAdminToken));
  assert.equal(reset.status, 200, JSON.stringify(reset.json));
  const { rows } = await query('SELECT must_change_pw FROM users WHERE id=$1', [id]);
  assert.equal(rows[0].must_change_pw, false);
  const name = (await query('SELECT username FROM users WHERE id=$1', [id])).rows[0].username;
  const l = await login(name, reset.json.temporary_password, 'password');
  assert.equal(l.status, 200);
  assert.equal(l.json.must_change_pw, false);
  assert.equal((await get('/protected', l.json.access_token)).status, 200);
  const audit = await query(
    `SELECT detail FROM audit_log WHERE action='reset_password' AND entity_id=$1 ORDER BY id DESC LIMIT 1`, [id]);
  assert.equal(audit.rows[0].detail, NEW_RESET_DETAIL, 'new events are distinguishable from old ones');
  assert.notEqual(audit.rows[0].detail, OLD_RESET_DETAIL);
});

// ── Concurrency: administrator reset vs login / PIN change ───────────────────
//
// Deterministic interleaving without sleeps or production test hooks: the test
// holds a row lock on the account (FOR NO KEY UPDATE), starts the request,
// waits until PostgreSQL reports the request's compare-and-swap UPDATE blocked
// on that lock, then commits an "administrator reset" (new hash) and releases.
// The blocked UPDATE re-evaluates its WHERE clause against the new row, so it
// must match zero rows.

async function lockUserRow(userId: string) {
  const client = await pool.connect();
  await client.query('BEGIN');
  await client.query('SELECT 1 FROM users WHERE id=$1 FOR NO KEY UPDATE', [userId]);
  return client;
}
async function waitForBlockedUpdate(queryFragment: string) {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    const { rowCount } = await query(
      `SELECT 1 FROM pg_stat_activity
        WHERE datname = current_database() AND pid <> pg_backend_pid()
          AND wait_event_type = 'Lock' AND query ILIKE $1`,
      [`%${queryFragment}%`],
    );
    if (rowCount) return;
    await new Promise((r) => setTimeout(r, 20));
  }
  throw new Error(`no blocked UPDATE matching "${queryFragment}" appeared`);
}
/** What POST /admin/users/:id/reset-password commits for a public role. */
async function commitAdminReset(client: Awaited<ReturnType<typeof pool.connect>>, userId: string, pin: string) {
  await client.query(
    `UPDATE users SET password_hash=$1, pin_hash_version=$2, pin_set_at=clock_timestamp(),
            must_set_pin=FALSE, must_change_pw=FALSE WHERE id=$3`,
    [await hashPin(pin), PIN_HASH_VERSION, userId],
  );
  await client.query('COMMIT');
  client.release();
}

test('login/reset race: a credential replaced mid-login gets no session and a generic failure', async () => {
  const acct = await makeExistingAccount('teacher', LEGACY_CODES['eight-digit']); // PIN gate must be applied
  const linksBefore = await associations(acct.id, acct.studentId);
  const generic = (await login(acct.username, '00000000')).json.error;            // an ordinary wrong credential
  assert.ok(generic);

  const lock = await lockUserRow(acct.id);
  let released = false;
  try {
    const pending = login(acct.username, LEGACY_CODES['eight-digit']);
    await waitForBlockedUpdate('UPDATE users SET must_set_pin=TRUE WHERE id=$1 AND password_hash=$2');
    await commitAdminReset(lock, acct.id, '604215');
    released = true;
    const res = await pending;
    assert.equal(res.status, 401, JSON.stringify(res.json));
    assert.equal(res.json.error, generic, 'same generic message as any wrong credential');
    assert.equal(res.json.access_token, undefined);
    assert.equal(res.json.refresh_token, undefined);
  } finally {
    if (!released) { await lock.query('ROLLBACK'); lock.release(); }
  }

  const sessions = await query('SELECT 1 FROM auth_sessions WHERE user_id=$1', [acct.id]);
  assert.equal(sessions.rowCount, 0, 'the replaced credential has no session');
  assert.equal((await login(acct.username, LEGACY_CODES['eight-digit'])).status, 401, 'old credential no longer works');
  const fresh = await login(acct.username, '604215');
  assert.equal(fresh.status, 200, 'the administrator-issued PIN works');
  assert.equal(fresh.json.pin_setup_required, false);
  assert.equal(await associations(acct.id, acct.studentId), linksBefore, 'records untouched');
});

test('PIN-change/reset race: the old credential cannot overwrite a concurrent administrator reset', async () => {
  const acct = await makeExistingAccount('student', 'unused');
  await query(`UPDATE users SET password_hash=$1, pin_hash_version=1, pin_set_at=clock_timestamp() WHERE id=$2`, [await hashPin('604215'), acct.id]);
  const deviceA = device(); const deviceB = device();
  const a = await login(acct.username, '604215', 'pin', deviceA);
  const b = await login(acct.username, '604215', 'pin', deviceB);
  assert.equal(a.status, 200); assert.equal(b.status, 200);
  const sessionsBefore = (await query('SELECT id FROM auth_sessions WHERE user_id=$1 AND revoked_at IS NULL ORDER BY id', [acct.id])).rows.map((r: any) => r.id);
  assert.equal(sessionsBefore.length, 2);

  const lock = await lockUserRow(acct.id);
  let released = false;
  try {
    const pending = post('/auth/pin', { current_credential: '604215', new_pin: '739104' }, { ...bearer(a.json.access_token), 'x-device-id': deviceA });
    await waitForBlockedUpdate('AND password_hash=$4');
    await commitAdminReset(lock, acct.id, '826401');
    released = true;
    const res = await pending;
    assert.equal(res.status, 409, JSON.stringify(res.json));
    assert.equal(res.json.code, 'CREDENTIAL_CHANGED');
  } finally {
    if (!released) { await lock.query('ROLLBACK'); lock.release(); }
  }

  assert.equal((await login(acct.username, '739104')).status, 401, 'the stale PIN change was not written');
  assert.equal((await login(acct.username, '604215')).status, 401, 'the old PIN is gone');
  assert.equal((await login(acct.username, '826401')).status, 200, 'the administrator reset stands');
  const stillActive = (await query('SELECT id FROM auth_sessions WHERE id = ANY($1::uuid[]) AND revoked_at IS NULL', [sessionsBefore])).rowCount;
  assert.equal(stillActive, 2, 'a failed update revokes no sessions');
  const events = await query(`SELECT 1 FROM audit_log WHERE entity_id=$1 AND action IN ('change_pin','set_pin')`, [acct.id]);
  assert.equal(events.rowCount, 0, 'no success audit event for the rejected change');
});

test('PIN change without a race still succeeds and revokes only the other sessions', async () => {
  const acct = await makeExistingAccount('parent', 'unused');
  await query(`UPDATE users SET password_hash=$1, pin_hash_version=1, pin_set_at=clock_timestamp() WHERE id=$2`, [await hashPin('604215'), acct.id]);
  const a = await login(acct.username, '604215');
  const b = await login(acct.username, '604215');
  const res = await post('/auth/pin', { current_credential: '604215', new_pin: '739104' }, bearer(a.json.access_token));
  assert.equal(res.status, 200, JSON.stringify(res.json));
  assert.equal((await get('/protected', a.json.access_token)).status, 200, 'this session survives');
  assert.equal((await get('/protected', b.json.access_token)).status, 401, 'the other session is revoked');
  assert.equal((await login(acct.username, '739104')).status, 200);
});

// ── Older admin apps (four-digit teacher code) ───────────────────────────────

test('four-digit initial teacher PIN is rejected with an actionable message and creates nothing', async () => {
  const username = uname('four');
  const r = await post('/admin/users', {
    full_name: 'Older App Teacher', role: 'teacher', school_code: 'primary', username,
    assigned_class_names: ['Primary 4'], assigned_subject_ids: [subjectId], initial_password: '4821',
  }, bearer(primaryAdminToken));
  assert.equal(r.status, 400, JSON.stringify(r.json));
  assert.equal(r.json.code, 'TEACHER_PIN_SIX_DIGITS_REQUIRED');
  assert.match(r.json.error, /four-digit/i);
  assert.match(r.json.error, /six-digit PIN/);
  assert.match(r.json.error, /Update the admin app/);
  const { rowCount } = await query('SELECT 1 FROM users WHERE lower(btrim(username))=$1', [username.toLowerCase()]);
  assert.equal(rowCount, 0, 'no account created');
  // Other malformed values keep the generic six-digit message.
  const other = await post('/admin/users', {
    full_name: 'Older App Teacher', role: 'teacher', school_code: 'primary', username: uname('five'),
    assigned_class_names: ['Primary 4'], assigned_subject_ids: [subjectId], initial_password: '48213',
  }, bearer(primaryAdminToken));
  assert.equal(other.status, 400);
  assert.match(other.json.error, /exactly six digits/);
});

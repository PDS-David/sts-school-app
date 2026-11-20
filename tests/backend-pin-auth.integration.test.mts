process.env.PIN_PEPPER = 'test-pepper-0123456789-0123456789-0123456789-abcdef';
process.env.JWT_SECRET ||= 'test-jwt-secret';
process.env.JWT_REFRESH_SECRET ||= 'test-jwt-refresh-secret';

import assert from 'node:assert/strict';
import bcrypt from 'bcryptjs';
import { readFileSync } from 'node:fs';
import { randomInt, randomBytes } from 'node:crypto';
import type { AddressInfo } from 'node:net';
import type { Server } from 'node:http';
import express from 'express';
import test, { after } from 'node:test';
import { pool, query } from '../backend/src/db/pool.js';
import authRouter from '../backend/src/routes/auth.js';
import adminRouter from '../backend/src/routes/admin.js';
import { requireAuth, sessionIdRequired } from '../backend/src/middleware/auth.js';
import { signAccess, signRefresh } from '../backend/src/utils/jwt.js';
import { PENDING_APPROVAL_MESSAGE } from '../backend/src/utils/authMessages.js';
import {
  PinConfigError, checkPin, generateTemporaryPin, hashPin, isPinConfigured, isTrivialPin, verifyCredential,
} from '../backend/src/utils/pin.js';
import { accountKeyFor, normalizeUsername } from '../backend/src/utils/usernames.js';
import {
  LOGIN_THROTTLE_POLICY, clearAccountThrottle, lockMinutesForCount, recordLoginSuccess, reserveLoginAttempt,
} from '../backend/src/utils/loginThrottle.js';
import { MAX_ACTIVE_SESSIONS, ROTATION_GRACE_MS, sha256Hex } from '../backend/src/utils/authSessions.js';

const sfx = () => randomInt(100_000_000, 999_999_999).toString();
const uname = (label: string) => `pin-${label}-${sfx()}`;
const device = () => randomBytes(12).toString('hex'); // 24 chars, valid device id
const LEGACY = 'LegacyPassw0rd!';
const GOOD_PIN = '482913';
const EXISTING_PIN = '730518'; // an existing user's six-digit PIN, stored as a legacy (unpeppered) bcrypt hash

after(async () => { await pool.end(); });

async function startServer(): Promise<{ server: Server; base: string }> {
  await query(`DELETE FROM public.rate_limit_counters WHERE namespace = 'auth-login-ip'`);
  const app = express();
  app.use(express.json());
  app.use('/auth', authRouter);
  app.use('/admin', adminRouter);
  app.get('/protected', requireAuth, (_req, res) => res.json({ ok: true }));
  app.get('/health-check-open', (_req, res) => res.json({ ok: true }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((r, j) => { server.once('listening', r); server.once('error', j); });
  return { server, base: `http://127.0.0.1:${(server.address() as AddressInfo).port}` };
}
async function stop(server: Server) {
  server.closeAllConnections();
  await new Promise<void>((r) => server.close(() => r()));
}

interface MakeUser { role?: string; pending?: boolean; active?: boolean; secret?: string; mustSetPin?: boolean; pinVersion?: 1 | null; school?: string | null }
async function makeUser(name: string, o: MakeUser = {}): Promise<string> {
  const role = o.role ?? 'student';
  const secret = o.secret ?? LEGACY;
  const hash = o.pinVersion === 1 ? await hashPin(secret) : await bcrypt.hash(secret, 4);
  const { rows } = await query(
    `INSERT INTO users(username,password_hash,role,full_name,school_code,is_active,pending_admin_review,pin_hash_version)
     VALUES($1,$2,$3,'PIN Test',$4,$5,$6,$7) RETURNING id`,
    [name, hash, role, o.school === undefined ? 'primary' : o.school, o.active ?? true, o.pending ?? false, o.pinVersion ?? null],
  );
  const id = String(rows[0].id);
  // Existing students/parents/teachers already hold six-digit PINs and are NOT
  // flagged (migration 0020). Only tests that model an administrator-issued
  // temporary credential pass mustSetPin: true.
  await query('UPDATE users SET must_set_pin=$2, pin_hash_version=$3 WHERE id=$1', [
    id, o.mustSetPin ?? false, o.pinVersion ?? null,
  ]);
  return id;
}

async function post(base: string, path: string, body: unknown, headers: Record<string, string> = {}) {
  const r = await fetch(`${base}${path}`, { method: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) });
  let json: any = null; try { json = await r.json(); } catch { /* empty */ }
  return { status: r.status, json, headers: r.headers };
}
async function get(base: string, path: string, token?: string) {
  const r = await fetch(`${base}${path}`, { headers: token ? { authorization: `Bearer ${token}` } : {} });
  let json: any = null; try { json = await r.json(); } catch { /* empty */ }
  return { status: r.status, json };
}
const login = (base: string, username: string, pin: string, extra: Record<string, unknown> = {}, dev = device()) =>
  post(base, '/auth/login', { username, pin, ...extra }, { 'x-device-id': dev });

// ── PIN rules ────────────────────────────────────────────────────────────────

test('PIN validation: exactly six digits, weak patterns rejected', () => {
  for (const bad of ['12345', '1234567', 'abcdef', '12 456', '', '١٢٣٤٥٦', 123456 as unknown as string, null as unknown as string]) {
    assert.equal(checkPin(bad).ok, false, String(bad));
  }
  for (const weak of ['123456', '000000', '111111', '654321', '234567', '012345', '567890', '121212', '123123', '123321', '112233', '159753']) {
    assert.equal(isTrivialPin(weak), true, weak);
    const r = checkPin(weak);
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.reason, 'trivial');
  }
  for (const good of ['482913', '907265', '350186']) assert.equal(checkPin(good).ok, true, good);
});

test('temporary PIN generator yields six non-trivial digits', () => {
  for (let i = 0; i < 300; i++) {
    const p = generateTemporaryPin();
    assert.match(p, /^\d{6}$/);
    assert.equal(isTrivialPin(p), false);
  }
});

test('username normalisation is identical for case and surrounding whitespace', () => {
  assert.equal(normalizeUsername('  JohnSmith '), 'johnsmith');
  assert.equal(accountKeyFor('JohnSmith'), accountKeyFor(' johnsmith  '));
  assert.notEqual(accountKeyFor('johnsmith'), accountKeyFor('johnsmith2'));
});

test('missing or short PIN_PEPPER fails closed and never falls back to unpeppered hashing', async () => {
  for (const env of [{}, { PIN_PEPPER: '' }, { PIN_PEPPER: 'short' }] as NodeJS.ProcessEnv[]) {
    assert.equal(isPinConfigured(env), false);
    await assert.rejects(() => hashPin(GOOD_PIN, env), (e: unknown) => {
      assert.ok(e instanceof PinConfigError);
      assert.ok(!String((e as Error).message).includes('PIN_PEPPER'), 'error must not name the secret');
      return true;
    });
    await assert.rejects(() => verifyCredential(GOOD_PIN, '$2a$04$abcdefghijklmnopqrstuuabcdefghijklmnopqrstuvwxyz01234', 1, env), PinConfigError);
  }
});

test('PIN hash is peppered: not verifiable as plain bcrypt, differs by pepper, never contains the PIN', async () => {
  const hash = await hashPin(GOOD_PIN);
  assert.ok(!hash.includes(GOOD_PIN));
  assert.equal(await bcrypt.compare(GOOD_PIN, hash), false, 'must not verify as an unpeppered bcrypt hash');
  assert.equal(await verifyCredential(GOOD_PIN, hash, 1), true);
  assert.equal(await verifyCredential('482914', hash, 1), false);
  const otherPepper = { PIN_PEPPER: 'a-completely-different-pepper-value-0123456789abcdef' } as NodeJS.ProcessEnv;
  assert.equal(await verifyCredential(GOOD_PIN, hash, 1, otherPepper), false);
});

test('missing pepper at runtime: login returns 503 and does not count as a failed attempt', async () => {
  const { server, base } = await startServer();
  const name = uname('nopepper');
  await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
  const saved = process.env.PIN_PEPPER;
  try {
    delete process.env.PIN_PEPPER;
    const r = await login(base, name, GOOD_PIN);
    assert.equal(r.status, 503);
    assert.ok(!JSON.stringify(r.json).includes('PEPPER'));
    const { rows } = await query('SELECT count(*)::int AS n FROM auth_login_attempts WHERE account_key=$1', [accountKeyFor(name)]);
    assert.equal(rows[0].n, 0);
  } finally { process.env.PIN_PEPPER = saved; await stop(server); }
});

// ── Login behaviour ──────────────────────────────────────────────────────────

test('login: unknown username and wrong credential are indistinguishable; username is case/space-insensitive', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('Generic');
    await makeUser(name);
    const wrong = await login(base, name, 'wrong-credential');
    const unknown = await login(base, uname('nobody'), 'wrong-credential');
    assert.equal(wrong.status, 401);
    assert.equal(unknown.status, 401);
    assert.deepEqual(wrong.json, unknown.json);

    const ok = await login(base, `  ${name.toUpperCase()}  `, LEGACY);
    assert.equal(ok.status, 200, JSON.stringify(ok.json));
    assert.equal(ok.json.user.username, name);
  } finally { await stop(server); }
});

test('login: role comes from the database; a client-supplied role/school is ignored', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('role');
    await makeUser(name, { role: 'student' });
    const r = await login(base, name, LEGACY, { role: 'admin', account_type: 'admin', school_code: 'other' });
    assert.equal(r.status, 200);
    assert.equal(r.json.user.role, 'student');
  } finally { await stop(server); }
});

test('login: pending approval message appears only after correct credentials', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('pending');
    await makeUser(name, { role: 'parent', pending: true });
    const wrong = await login(base, name, 'nope');
    assert.equal(wrong.status, 401);
    assert.ok(!JSON.stringify(wrong.json).includes('E.O.'), 'pending state must not leak before authentication');
    const ok = await login(base, name, LEGACY);
    assert.equal(ok.status, 200);
    assert.equal(ok.json.pending_admin_review, true);
    assert.equal(ok.json.message, 'Please see or call the E.O. for your approval');
    assert.equal(PENDING_APPROVAL_MESSAGE, 'Please see or call the E.O. for your approval');
  } finally { await stop(server); }
});

test('login: inactive account is revealed only after correct credentials', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('inactive');
    await makeUser(name, { active: false });
    const wrong = await login(base, name, 'nope');
    assert.equal(wrong.status, 401);
    const right = await login(base, name, LEGACY);
    assert.equal(right.status, 403);
    assert.match(right.json.error, /deactivated/i);
  } finally { await stop(server); }
});

test('login: request validation', async () => {
  const { server, base } = await startServer();
  try {
    assert.equal((await post(base, '/auth/login', {})).status, 400);
    assert.equal((await post(base, '/auth/login', { username: 'x' })).status, 400);
    assert.equal((await post(base, '/auth/login', { username: 'x'.repeat(200), pin: '1' })).status, 400);
  } finally { await stop(server); }
});

test('GET /auth/teacher-logins no longer exists (no public username list)', async () => {
  const { server, base } = await startServer();
  try {
    assert.equal((await get(base, '/auth/teacher-logins')).status, 404);
    assert.equal((await get(base, '/auth/teacher-logins?school_code=primary')).status, 404);
  } finally { await stop(server); }
});

// ── Pending restricted session ───────────────────────────────────────────────

test('pending account gets a restricted session: only GET /auth/me and POST /auth/logout', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('restricted');
    await makeUser(name, { role: 'parent', pending: true, mustSetPin: false, pinVersion: 1, secret: GOOD_PIN });
    const l = await login(base, name, GOOD_PIN);
    assert.equal(l.status, 200);
    const token = l.json.access_token;

    const me = await get(base, '/auth/me', token);
    assert.equal(me.status, 200);
    assert.equal(me.json.pending_admin_review, true);
    assert.equal(me.json.message, PENDING_APPROVAL_MESSAGE);

    const blocked = await get(base, '/protected', token);
    assert.equal(blocked.status, 403);
    assert.equal(blocked.json.code, 'PENDING_APPROVAL');
    assert.equal(blocked.json.error, PENDING_APPROVAL_MESSAGE);

    const blockedPin = await post(base, '/auth/pin', { current_credential: GOOD_PIN, new_pin: '907265' }, { authorization: `Bearer ${token}` });
    assert.equal(blockedPin.status, 403);
    const blockedPush = await post(base, '/auth/push-token', { token: 'x' }, { authorization: `Bearer ${token}` });
    assert.equal(blockedPush.status, 403);

    const out = await post(base, '/auth/logout', {}, { authorization: `Bearer ${token}` });
    assert.equal(out.status, 200);
  } finally { await stop(server); }
});

test('pending teacher gets the same restricted session as a parent', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('pending-teacher');
    await makeUser(name, { role: 'teacher', pending: true, mustSetPin: false, pinVersion: 1, secret: GOOD_PIN });
    const l = await login(base, name, GOOD_PIN);
    assert.equal(l.json.message, PENDING_APPROVAL_MESSAGE);
    assert.equal((await get(base, '/protected', l.json.access_token)).status, 403);
    assert.equal((await get(base, '/auth/me', l.json.access_token)).status, 200);
  } finally { await stop(server); }
});

test('UNCHANGED (Prompt 4 scope): while free-launch mode is on, a pending STUDENT is still treated as approved', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('pending-student');
    await makeUser(name, { role: 'student', pending: true, mustSetPin: false, pinVersion: 1, secret: GOOD_PIN });
    const l = await login(base, name, GOOD_PIN);
    assert.equal(l.status, 200);
    assert.equal(l.json.pending_admin_review, false);
  } finally { await stop(server); }
});

// ── Existing users: no first-login PIN gate ─────────────────────────────────

test('existing student/parent/teacher with a six-digit PIN sign in straight to their dashboard, on any device', async () => {
  const { server, base } = await startServer();
  try {
    for (const role of ['student', 'parent', 'teacher']) {
      const name = uname(`ex-${role}`);
      await makeUser(name, { role, secret: EXISTING_PIN }); // legacy-format hash, not flagged
      const first = await login(base, name, EXISTING_PIN);
      assert.equal(first.status, 200, role);
      assert.equal(first.json.must_set_pin, false, role);
      assert.equal(first.json.pending_admin_review, false);
      assert.equal((await get(base, '/protected', first.json.access_token)).status, 200, `${role}: no PIN_SETUP_REQUIRED`);
      assert.equal((await get(base, '/auth/me', first.json.access_token)).json.must_set_pin, false);
      // A brand-new device is not a reason to change the PIN either.
      const other = await login(base, name, EXISTING_PIN, {}, device());
      assert.equal(other.status, 200);
      assert.equal(other.json.must_set_pin, false);
      assert.equal((await get(base, '/protected', other.json.access_token)).status, 200);
      // Signing in never asks them to change anything. The server transparently
      // upgrades the stored hash to the peppered scheme; the PIN itself is the
      // same and still works (see the dedicated rehash tests below).
      const { rows } = await query('SELECT must_set_pin, pin_hash_version FROM users WHERE username=$1', [name]);
      assert.equal(rows[0].must_set_pin, false);
      assert.equal(rows[0].pin_hash_version, 1);
    }
  } finally { await stop(server); }
});

test('an existing PIN user who is still pending approval stays on the pending screen, then reaches the dashboard once approved', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('ex-pending');
    const id = await makeUser(name, { role: 'parent', secret: EXISTING_PIN, pending: true });
    const l = await login(base, name, EXISTING_PIN);
    assert.equal(l.status, 200);
    assert.equal(l.json.pending_admin_review, true);
    assert.equal(l.json.must_set_pin, false);
    assert.equal((await get(base, '/protected', l.json.access_token)).json.code, 'PENDING_APPROVAL');
    await query('UPDATE users SET pending_admin_review=FALSE WHERE id=$1', [id]);
    assert.equal((await get(base, '/protected', l.json.access_token)).status, 200);
  } finally { await stop(server); }
});

test('migration 0020 clears only the bulk 0019 flag: existing users freed, administrator-issued credentials keep the requirement', async () => {
  const sql = readFileSync(new URL('../backend/migrations/0020_pin_gate_only_for_admin_issued_credentials.sql', import.meta.url), 'utf8');
  const flagged = async (name: string, role: string, o: { changePw?: boolean; pinVersion?: 1 | null } = {}) => {
    const id = await makeUser(name, { role, secret: o.pinVersion === 1 ? GOOD_PIN : EXISTING_PIN, pinVersion: o.pinVersion ?? null, school: role === 'admin' ? null : 'primary' });
    // The state migration 0019's bulk backfill produced.
    await query('UPDATE users SET must_set_pin=TRUE, must_change_pw=$2, pin_set_at=$3 WHERE id=$1',
      [id, o.changePw ?? false, o.pinVersion === 1 ? new Date() : null]);
    return id;
  };
  const existing = await Promise.all(['student', 'parent', 'teacher'].map((r) => flagged(uname(`mg-${r}`), r)));
  const tempPassword = await flagged(uname('mg-temp'), 'teacher', { changePw: true });
  const adminReset = await flagged(uname('mg-reset'), 'student', { pinVersion: 1 });
  const adminAccount = await flagged(uname('mg-admin'), 'admin');

  await query(sql);
  await query(sql); // idempotent

  const { rows } = await query('SELECT id, must_set_pin FROM users WHERE id=ANY($1::uuid[])', [[...existing, tempPassword, adminReset, adminAccount]]);
  const by = new Map(rows.map((r: any) => [String(r.id), r.must_set_pin]));
  for (const id of existing) assert.equal(by.get(id), false, 'existing PIN user is freed');
  assert.equal(by.get(tempPassword), true, 'account still on an administrator-issued temporary password keeps it');
  assert.equal(by.get(adminReset), true, 'administrator PIN reset keeps it');
  assert.equal(by.get(adminAccount), true, 'roles outside the public set are not touched by this migration');

  // The freed users now go straight in.
  const { server, base } = await startServer();
  try {
    const { rows: names } = await query('SELECT username FROM users WHERE id=$1', [existing[0]]);
    const l = await login(base, names[0].username, EXISTING_PIN);
    assert.equal(l.status, 200);
    assert.equal(l.json.must_set_pin, false);
    assert.equal((await get(base, '/protected', l.json.access_token)).status, 200);
  } finally { await stop(server); }
});

test('voluntary PIN change: an unflagged user can change their PIN, other sessions end, the new PIN works', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('ex-vol');
    await makeUser(name, { role: 'student', secret: EXISTING_PIN });
    const here = await login(base, name, EXISTING_PIN);
    const elsewhere = await login(base, name, EXISTING_PIN);
    assert.equal(here.json.must_set_pin, false);
    const change = await post(base, '/auth/pin', { current_credential: EXISTING_PIN, new_pin: GOOD_PIN }, { authorization: `Bearer ${here.json.access_token}` });
    assert.equal(change.status, 200, JSON.stringify(change.json));
    assert.equal((await get(base, '/protected', here.json.access_token)).status, 200);
    assert.equal((await get(base, '/protected', elsewhere.json.access_token)).status, 401);
    assert.equal((await login(base, name, GOOD_PIN)).status, 200);
    assert.equal((await login(base, name, EXISTING_PIN)).status, 401);
    // A wrong current PIN cannot change it.
    const bad = await post(base, '/auth/pin', { current_credential: '111222', new_pin: '350186' }, { authorization: `Bearer ${here.json.access_token}` });
    assert.equal(bad.status, 401);
  } finally { await stop(server); }
});

test('administrator-issued temporary credential still forces PIN setup before any dashboard access', async () => {
  const { server, base } = await startServer();
  try {
    for (const role of ['student', 'parent', 'teacher']) {
      const name = uname(`tmp-${role}`);
      const id = await makeUser(name, { role, secret: LEGACY, mustSetPin: true });
      await query('UPDATE users SET must_change_pw=TRUE WHERE id=$1', [id]);
      const l = await login(base, name, LEGACY);
      assert.equal(l.status, 200, role);
      assert.equal(l.json.must_set_pin, true, role);
      const auth = { authorization: `Bearer ${l.json.access_token}` };
      assert.equal((await get(base, '/protected', l.json.access_token)).json.code, 'PIN_SETUP_REQUIRED');
      assert.equal((await post(base, '/auth/push-token', { token: 'x' }, auth)).json.code, 'PIN_SETUP_REQUIRED');
      assert.equal((await get(base, '/auth/me', l.json.access_token)).json.must_set_pin, true);
      // Requirement survives a new session / device.
      const l2 = await login(base, name, LEGACY);
      assert.equal(l2.json.must_set_pin, true);
      assert.equal((await get(base, '/protected', l2.json.access_token)).status, 403);
      const set = await post(base, '/auth/pin', { current_credential: LEGACY, new_pin: GOOD_PIN }, auth);
      assert.equal(set.status, 200, JSON.stringify(set.json));
      assert.equal((await get(base, '/protected', l.json.access_token)).status, 200);
      const { rows } = await query('SELECT id, must_set_pin, pin_hash_version, pin_set_at FROM users WHERE id=$1', [id]);
      assert.equal(rows[0].must_set_pin, false);
      assert.equal(rows[0].pin_hash_version, 1);
      assert.ok(rows[0].pin_set_at);
      assert.equal((await login(base, name, GOOD_PIN)).status, 200);
      assert.equal((await login(base, name, LEGACY)).status, 401);
    }
  } finally { await stop(server); }
});

test('existing user without a usable credential keeps the activation flow (login stays generic)', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('noactivation');
    await query(`INSERT INTO users(username,password_hash,role,full_name,school_code,activation_code) VALUES($1,NULL,'teacher','T','primary','code-1')`, [name]);
    const r = await login(base, name, 'anything');
    assert.equal(r.status, 401);
    assert.equal(r.json.error, 'Incorrect username or PIN.');
  } finally { await stop(server); }
});

test('PIN endpoint: format, weak PIN, wrong current credential, same-as-current', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('pinrules');
    await makeUser(name);
    const l = await login(base, name, LEGACY);
    const auth = { authorization: `Bearer ${l.json.access_token}` };
    assert.equal((await post(base, '/auth/pin', { current_credential: LEGACY, new_pin: '12345' }, auth)).status, 400);
    assert.equal((await post(base, '/auth/pin', { current_credential: LEGACY, new_pin: 'abcdef' }, auth)).status, 400);
    assert.equal((await post(base, '/auth/pin', { current_credential: LEGACY, new_pin: '123456' }, auth)).status, 400);
    assert.equal((await post(base, '/auth/pin', { current_credential: LEGACY, new_pin: '000000' }, auth)).status, 400);
    assert.equal((await post(base, '/auth/pin', { current_credential: 'wrong', new_pin: GOOD_PIN }, auth)).status, 401);
    assert.equal((await post(base, '/auth/pin', { new_pin: GOOD_PIN }, auth)).status, 400);
    const ok = await post(base, '/auth/pin', { current_credential: LEGACY, new_pin: GOOD_PIN }, auth);
    assert.equal(ok.status, 200);
    assert.ok(!JSON.stringify(ok.json).includes(GOOD_PIN), 'response must never echo the PIN');
    assert.equal((await post(base, '/auth/pin', { current_credential: GOOD_PIN, new_pin: GOOD_PIN }, auth)).status, 400);
  } finally { await stop(server); }
});

test('stored credential is a hash; plaintext PIN is nowhere in the users row', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('hashonly');
    const id = await makeUser(name);
    const l = await login(base, name, LEGACY);
    await post(base, '/auth/pin', { current_credential: LEGACY, new_pin: GOOD_PIN }, { authorization: `Bearer ${l.json.access_token}` });
    const { rows } = await query('SELECT * FROM users WHERE id=$1', [id]);
    assert.ok(!JSON.stringify(rows[0]).includes(GOOD_PIN));
    assert.match(rows[0].password_hash, /^\$2[aby]\$/);
  } finally { await stop(server); }
});

test('DB trigger: any other credential write re-forces PIN setup for public roles only', async () => {
  const student = await makeUser(uname('trig-s'), { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
  const admin = await makeUser(uname('trig-a'), { role: 'admin', school: null, mustSetPin: false });
  const newHash = await bcrypt.hash('SomethingElse9', 4);
  await query('UPDATE users SET password_hash=$1 WHERE id=ANY($2::uuid[])', [newHash, [student, admin]]);
  const { rows } = await query('SELECT id, must_set_pin, pin_hash_version FROM users WHERE id=ANY($1::uuid[])', [[student, admin]]);
  const byId = new Map(rows.map((r: any) => [String(r.id), r]));
  assert.equal(byId.get(student).must_set_pin, true);
  assert.equal(byId.get(student).pin_hash_version, null);
  assert.equal(byId.get(admin).must_set_pin, false);
});

// ── Sessions ─────────────────────────────────────────────────────────────────

test('refresh tokens: stored hashed, rotated on use, old token works only inside the grace window, reuse revokes the session', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('rotate');
    await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const l = await login(base, name, GOOD_PIN, { remember_me: true });
    const rt1 = l.json.refresh_token as string;
    assert.match(rt1, /^rt_/);
    const stored = await query('SELECT refresh_hash FROM auth_sessions WHERE refresh_hash=$1 OR refresh_hash=$2', [rt1, sha256Hex(rt1)]);
    assert.equal(stored.rows.length, 1);
    assert.equal(stored.rows[0].refresh_hash, sha256Hex(rt1), 'only the SHA-256 is stored');

    const r2 = await post(base, '/auth/refresh', { refresh_token: rt1 });
    assert.equal(r2.status, 200);
    const rt2 = r2.json.refresh_token as string;
    assert.notEqual(rt2, rt1);
    assert.equal((await get(base, '/protected', r2.json.access_token)).status, 200);

    // Lost-response retry inside the grace window still works...
    const retry = await post(base, '/auth/refresh', { refresh_token: rt1 });
    assert.equal(retry.status, 200);
    const rt3 = retry.json.refresh_token as string;

    // ...but after the grace window the superseded token is treated as theft.
    await query(`UPDATE auth_sessions SET prev_rotated_at = now() - ($2 || ' milliseconds')::interval WHERE refresh_hash=$1`, [sha256Hex(rt3), String(ROTATION_GRACE_MS + 5000)]);
    const reuse = await post(base, '/auth/refresh', { refresh_token: rt2 });
    assert.equal(reuse.status, 401);
    // Session revoked: even the latest token and its access token are dead.
    assert.equal((await post(base, '/auth/refresh', { refresh_token: rt3 })).status, 401);
    assert.equal((await get(base, '/protected', retry.json.access_token)).status, 401);
  } finally { await stop(server); }
});

test('refresh: garbage, wrong prefix and expired sessions are rejected', async () => {
  const { server, base } = await startServer();
  try {
    assert.equal((await post(base, '/auth/refresh', {})).status, 400);
    assert.equal((await post(base, '/auth/refresh', { refresh_token: 'rt_' + 'a'.repeat(43) })).status, 401);
    assert.equal((await post(base, '/auth/refresh', { refresh_token: 'not-a-jwt' })).status, 401);
    const name = uname('expired');
    await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const l = await login(base, name, GOOD_PIN);
    await query(`UPDATE auth_sessions SET expires_at = now() - interval '1 minute' WHERE refresh_hash=$1`, [sha256Hex(l.json.refresh_token)]);
    assert.equal((await post(base, '/auth/refresh', { refresh_token: l.json.refresh_token })).status, 401);
    assert.equal((await get(base, '/protected', l.json.access_token)).status, 401);
  } finally { await stop(server); }
});

test('session lifetimes: remember me 30 days, otherwise 12 hours', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('ttl');
    await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const long = await login(base, name, GOOD_PIN, { remember_me: true });
    const short = await login(base, name, GOOD_PIN, { remember_me: false });
    const days = (iso: string) => (new Date(iso).getTime() - Date.now()) / 86_400_000;
    assert.ok(Math.abs(days(long.json.session_expires_at) - 30) < 0.01);
    assert.ok(Math.abs(days(short.json.session_expires_at) - 0.5) < 0.01);
    assert.equal(long.json.remember_me, true);
    assert.equal(short.json.remember_me, false);
  } finally { await stop(server); }
});

test('multiple devices: independent sessions; logout ends only the current session and kills its access token at once', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('multi');
    await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const a = await login(base, name, GOOD_PIN);
    const b = await login(base, name, GOOD_PIN);
    assert.equal((await get(base, '/protected', a.json.access_token)).status, 200);
    assert.equal((await get(base, '/protected', b.json.access_token)).status, 200);

    assert.equal((await post(base, '/auth/logout', {}, { authorization: `Bearer ${a.json.access_token}` })).status, 200);
    assert.equal((await get(base, '/protected', a.json.access_token)).status, 401, 'access token dies immediately on logout');
    assert.equal((await post(base, '/auth/refresh', { refresh_token: a.json.refresh_token })).status, 401);
    assert.equal((await get(base, '/protected', b.json.access_token)).status, 200, 'other device unaffected');
    assert.equal((await post(base, '/auth/refresh', { refresh_token: b.json.refresh_token })).status, 200);
  } finally { await stop(server); }
});

test('same device signing in again replaces its own session; accounts keep at most 10 active sessions', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('cap');
    const id = await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const dev = device();
    const first = await login(base, name, GOOD_PIN, {}, dev);
    const second = await login(base, name, GOOD_PIN, {}, dev);
    assert.equal((await get(base, '/protected', first.json.access_token)).status, 401);
    assert.equal((await get(base, '/protected', second.json.access_token)).status, 200);

    const tokens: string[] = [];
    for (let i = 0; i < MAX_ACTIVE_SESSIONS + 2; i++) tokens.push((await login(base, name, GOOD_PIN)).json.access_token);
    const { rows } = await query('SELECT count(*)::int AS n FROM auth_sessions WHERE user_id=$1 AND revoked_at IS NULL', [id]);
    assert.equal(rows[0].n, MAX_ACTIVE_SESSIONS);
    assert.equal((await get(base, '/protected', tokens[tokens.length - 1])).status, 200);
    assert.equal((await get(base, '/protected', tokens[0])).status, 401, 'oldest session evicted');
  } finally { await stop(server); }
});

test('PIN change revokes OTHER sessions and keeps the current one', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('chg');
    await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const here = await login(base, name, GOOD_PIN);
    const other = await login(base, name, GOOD_PIN);
    const r = await post(base, '/auth/pin', { current_credential: GOOD_PIN, new_pin: '907265' }, { authorization: `Bearer ${here.json.access_token}` });
    assert.equal(r.status, 200);
    assert.equal((await get(base, '/protected', here.json.access_token)).status, 200);
    assert.equal((await get(base, '/protected', other.json.access_token)).status, 401);
    assert.equal((await post(base, '/auth/refresh', { refresh_token: other.json.refresh_token })).status, 401);
    assert.equal((await login(base, name, '907265')).status, 200);
    assert.equal((await login(base, name, GOOD_PIN)).status, 401);
  } finally { await stop(server); }
});

test('legacy sessions survive the rollout: old JWT refresh token is exchanged once, honouring its own expiry', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('legacy');
    const id = await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const legacyRefresh = signRefresh(id);
    await query('UPDATE users SET refresh_token=$1 WHERE id=$2', [legacyRefresh, id]);

    const r = await post(base, '/auth/refresh', { refresh_token: legacyRefresh });
    assert.equal(r.status, 200);
    assert.match(r.json.refresh_token, /^rt_/);
    assert.equal((await get(base, '/protected', r.json.access_token)).status, 200);

    // An older app build still presenting the legacy token keeps working (access token only).
    const again = await post(base, '/auth/refresh', { refresh_token: legacyRefresh });
    assert.equal(again.status, 200);
    assert.ok(again.json.access_token);
    assert.equal(again.json.refresh_token, undefined);

    // Revoking sessions also kills the legacy path.
    await post(base, '/auth/logout', {}, { authorization: `Bearer ${r.json.access_token}` });
    assert.equal((await post(base, '/auth/refresh', { refresh_token: legacyRefresh })).status, 401);
  } finally { await stop(server); }
});

test('legacy access tokens without a session id: accepted outside production, refused when sessions are required', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('sidless');
    const id = await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const token = signAccess({ id, username: name, role: 'student', school_code: 'primary', assigned_class: null, assigned_subject_ids: [], assigned_class_names: [] } as any);
    assert.equal(sessionIdRequired({ NODE_ENV: 'production' } as NodeJS.ProcessEnv), true);
    assert.equal(sessionIdRequired({ NODE_ENV: 'development' } as NodeJS.ProcessEnv), false);
    assert.equal(sessionIdRequired({ NODE_ENV: 'production', AUTH_REQUIRE_SESSION_ID: 'false' } as NodeJS.ProcessEnv), false);
    assert.equal((await get(base, '/protected', token)).status, 200);
    const prev = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      assert.equal((await get(base, '/protected', token)).status, 401);
    } finally { process.env.NODE_ENV = prev; }
  } finally { await stop(server); }
});

test('a forged session id or a session belonging to another user is rejected', async () => {
  const { server, base } = await startServer();
  try {
    const a = uname('own-a'); const b = uname('own-b');
    const idA = await makeUser(a, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    await makeUser(b, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const lb = await login(base, b, GOOD_PIN);
    const { rows } = await query('SELECT id FROM auth_sessions WHERE refresh_hash=$1', [sha256Hex(lb.json.refresh_token)]);
    const forged = signAccess({ id: idA, username: a, role: 'student', school_code: 'primary', assigned_class: null, assigned_subject_ids: [], assigned_class_names: [], sid: rows[0].id } as any);
    assert.equal((await get(base, '/protected', forged)).status, 401);
    const junk = signAccess({ id: idA, username: a, role: 'student', school_code: 'primary', assigned_class: null, assigned_subject_ids: [], assigned_class_names: [], sid: 'not-a-uuid' } as any);
    assert.equal((await get(base, '/protected', junk)).status, 401);
  } finally { await stop(server); }
});

// ── Administrator reset ──────────────────────────────────────────────────────

test('admin reset issues a secure one-time temporary PIN, forces PIN change, revokes all sessions, clears lockout, and is audited', async () => {
  const { server, base } = await startServer();
  try {
    const adminName = uname('adm');
    await makeUser(adminName, { role: 'admin', school: null, secret: 'AdminLongPassw0rd', mustSetPin: false });
    const adminLogin = await login(base, adminName, 'AdminLongPassw0rd');
    assert.equal(adminLogin.status, 200);
    assert.equal(adminLogin.json.must_set_pin, false);
    const adminAuth = { authorization: `Bearer ${adminLogin.json.access_token}` };

    const name = uname('victim');
    const id = await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const s1 = await login(base, name, GOOD_PIN);
    const s2 = await login(base, name, GOOD_PIN);
    for (let i = 0; i < 5; i++) await login(base, name, 'wrongwrong');

    const reset = await post(base, `/admin/users/${id}/reset-password`, {}, adminAuth);
    assert.equal(reset.status, 200, JSON.stringify(reset.json));
    assert.match(reset.json.temporary_pin, /^\d{6}$/);
    assert.equal(isTrivialPin(reset.json.temporary_pin), false);
    assert.equal(reset.headers.get('cache-control'), 'no-store');

    assert.equal((await get(base, '/protected', s1.json.access_token)).status, 401);
    assert.equal((await get(base, '/protected', s2.json.access_token)).status, 401);
    assert.equal((await post(base, '/auth/refresh', { refresh_token: s1.json.refresh_token })).status, 401);

    const fresh = await login(base, name, reset.json.temporary_pin);
    assert.equal(fresh.status, 200, 'lockout was cleared and the temporary PIN works');
    assert.equal(fresh.json.must_set_pin, true);
    assert.equal((await get(base, '/protected', fresh.json.access_token)).json.code, 'PIN_SETUP_REQUIRED');
    const set = await post(base, '/auth/pin', { current_credential: reset.json.temporary_pin, new_pin: '350186' }, { authorization: `Bearer ${fresh.json.access_token}` });
    assert.equal(set.status, 200);

    const { rows } = await query(`SELECT actor_id, action, entity_id FROM audit_log WHERE action='reset_pin' AND entity_id=$1`, [id]).catch(async () =>
      query(`SELECT user_id AS actor_id, action, entity_id FROM audit_logs WHERE action='reset_pin' AND entity_id=$1`, [id]));
    assert.ok(rows.length >= 1, 'reset is audited');
    const { rows: leak } = await query(`SELECT count(*)::int AS n FROM audit_log WHERE detail LIKE $1`, [`%${reset.json.temporary_pin}%`]).catch(() => ({ rows: [{ n: 0 }] }));
    assert.equal(leak[0].n, 0, 'temporary PIN must not be written to the audit log');
  } finally { await stop(server); }
});

// ── Admin / Finance Admin compatibility ──────────────────────────────────────

test('admin and finance admin keep their existing credential format and are never forced to a six-digit PIN', async () => {
  const { server, base } = await startServer();
  try {
    for (const role of ['admin', 'finance_admin']) {
      const name = uname(role);
      await makeUser(name, { role, school: role === 'admin' ? null : 'primary', secret: 'Long-Existing-Passw0rd!', mustSetPin: false });
      const l = await login(base, name, 'Long-Existing-Passw0rd!');
      assert.equal(l.status, 200, role);
      assert.equal(l.json.user.role, role);
      assert.equal(l.json.must_set_pin, false);
      const auth = { authorization: `Bearer ${l.json.access_token}` };
      assert.equal((await get(base, '/protected', l.json.access_token)).status, 200);
      const pin = await post(base, '/auth/pin', { current_credential: 'Long-Existing-Passw0rd!', new_pin: GOOD_PIN }, auth);
      assert.equal(pin.status, 403);
      const cp = await post(base, '/auth/change-password', { old_password: 'Long-Existing-Passw0rd!', new_password: 'Even-Longer-Passw0rd!' }, auth);
      assert.equal(cp.status, 200, JSON.stringify(cp.json));
      assert.equal((await login(base, name, 'Even-Longer-Passw0rd!')).status, 200);
    }
  } finally { await stop(server); }
});

// ── Public recovery ──────────────────────────────────────────────────────────

test('public security-question recovery: students/parents/teachers get an identical "not available" response (no enumeration); reset is refused', async () => {
  const { server, base } = await startServer();
  try {
    const answerHash = await bcrypt.hash('blue', 4);
    const names: string[] = [];
    for (const role of ['student', 'parent', 'teacher']) {
      const n = uname(`rec-${role}`);
      const id = await makeUser(n, { role });
      await query(`UPDATE users SET security_question='Colour?', security_answer_hash=$2, must_set_security_question=FALSE WHERE id=$1`, [id, answerHash]);
      names.push(n);
    }
    const unknown = await get(base, `/auth/forgot-password/question?username=${uname('ghost')}`);
    assert.equal(unknown.json.available, false);
    for (const n of names) {
      const r = await get(base, `/auth/forgot-password/question?username=${n}`);
      assert.deepEqual(r.json, unknown.json);
      const reset = await post(base, '/auth/forgot-password/reset', { username: n, answer: 'blue', new_password: 'Brand-New-Pass1' });
      assert.equal(reset.status, 401);
      assert.equal((await login(base, n, 'Brand-New-Pass1')).status, 401, 'password must not have changed');
    }
    // Security-question data is preserved.
    const { rows } = await query('SELECT count(*)::int AS n FROM users WHERE username=ANY($1::text[]) AND security_answer_hash IS NOT NULL', [names]);
    assert.equal(rows[0].n, 3);
  } finally { await stop(server); }
});

test('admin recovery arrangement is unchanged: admin with a security question can still reset', async () => {
  const { server, base } = await startServer();
  try {
    const n = uname('rec-admin');
    const id = await makeUser(n, { role: 'admin', school: null, secret: 'Old-Admin-Passw0rd', mustSetPin: false });
    await query(`UPDATE users SET security_question='Colour?', security_answer_hash=$2, must_set_security_question=FALSE WHERE id=$1`, [id, await bcrypt.hash('blue', 4)]);
    const q = await get(base, `/auth/forgot-password/question?username=${n}`);
    assert.equal(q.json.available, true);
    assert.equal(q.json.question, 'Colour?');
    const reset = await post(base, '/auth/forgot-password/reset', { username: n, answer: 'blue', new_password: 'New-Admin-Passw0rd' });
    assert.equal(reset.status, 200);
    assert.equal((await login(base, n, 'New-Admin-Passw0rd')).status, 200);
  } finally { await stop(server); }
});

// ── Lockout and brute-force resistance ───────────────────────────────────────

test('lock schedule: 5 free failures, then 1, 5, 15, 60, 60 minutes', () => {
  assert.deepEqual([4, 5, 6, 7, 8, 9, 20].map((n) => lockMinutesForCount(n, 5)), [null, 1, 5, 15, 60, 60, 60]);
  assert.equal(LOGIN_THROTTLE_POLICY.deviceFreeAttempts, 5);
  assert.deepEqual([...LOGIN_THROTTLE_POLICY.lockMinutes], [1, 5, 15, 60]);
});

test('lockout over HTTP: 5 wrong attempts, then 429 with Retry-After; even the correct PIN is refused during the lock; unknown usernames behave identically', async () => {
  const { server, base } = await startServer();
  try {
    const real = uname('lock-real');
    const ghost = uname('lock-ghost');
    await makeUser(real, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const dev = device();
    for (const name of [real, ghost]) {
      const statuses: number[] = [];
      for (let i = 0; i < 5; i++) statuses.push((await login(base, name, '999888', {}, dev)).status);
      assert.deepEqual(statuses, [401, 401, 401, 401, 401], name);
      const sixth = await login(base, name, GOOD_PIN, {}, dev);
      assert.equal(sixth.status, 429, `${name}: ${JSON.stringify(sixth.json)}`);
      const retry = Number(sixth.headers.get('retry-after'));
      assert.ok(retry > 0 && retry <= 60, `retry-after ${retry}`);
    }
  } finally { await stop(server); }
});

test('victim lockout protection: an attacker locking their own (account, device) lane does not block the real user on another device', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('victim-lock');
    await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const attacker = device();
    for (let i = 0; i < 5; i++) await login(base, name, '999888', {}, attacker);
    assert.equal((await login(base, name, GOOD_PIN, {}, attacker)).status, 429);
    // Legitimate user on a NEW phone (never seen before) signs in on the first try.
    const victimNewPhone = await login(base, name, GOOD_PIN, {}, device());
    assert.equal(victimNewPhone.status, 200, JSON.stringify(victimNewPhone.json));
  } finally { await stop(server); }
});

test('denied attempts are not recorded: hammering a locked lane does not extend the lock', async () => {
  const key = accountKeyFor(uname('noextend'));
  const dev = device();
  const base = { accountKey: key, deviceId: dev, ip: '10.9.0.1', knownDevice: false };
  const t0 = new Date('2026-01-01T00:00:00Z');
  for (let i = 0; i < 5; i++) assert.equal((await reserveLoginAttempt({ ...base, now: new Date(t0.getTime() + i * 1000) })).allowed, true);
  const d1 = await reserveLoginAttempt({ ...base, now: new Date(t0.getTime() + 10_000) });
  assert.equal(d1.allowed, false);
  const before = (await query('SELECT fail_count, locked_until FROM auth_login_lanes WHERE lane_key LIKE $1', [`dev:${key}:%`])).rows[0];
  for (let i = 0; i < 20; i++) await reserveLoginAttempt({ ...base, now: new Date(t0.getTime() + 11_000 + i * 100) });
  const after = (await query('SELECT fail_count, locked_until FROM auth_login_lanes WHERE lane_key LIKE $1', [`dev:${key}:%`])).rows[0];
  assert.equal(after.fail_count, before.fail_count);
  assert.equal(new Date(after.locked_until).getTime(), new Date(before.locked_until).getTime());
  await clearAccountThrottle(key);
});

test('escalation: each further failure after a lock expires lengthens the delay 1 → 5 → 15 → 60 minutes', async () => {
  const key = accountKeyFor(uname('escalate'));
  const base = { accountKey: key, deviceId: device(), ip: '10.9.0.2', knownDevice: false };
  let now = new Date('2026-02-01T00:00:00Z');
  for (let i = 0; i < 5; i++) await reserveLoginAttempt({ ...base, now });
  const waits: number[] = [];
  for (let round = 0; round < 4; round++) {
    const denied = await reserveLoginAttempt({ ...base, now });
    assert.equal(denied.allowed, false);
    if (!denied.allowed) waits.push(Math.round(denied.retryAfterSeconds / 60));
    // wait the lock out, then fail once more
    now = new Date(now.getTime() + (waits[waits.length - 1] * 60 + 1) * 1000);
    const next = await reserveLoginAttempt({ ...base, now });
    assert.equal(next.allowed, true);
  }
  assert.deepEqual(waits, [1, 5, 15, 60]);
  await clearAccountThrottle(key);
});

test('a recognised device is NOT exempt: its own lane still locks after repeated failures', async () => {
  const key = accountKeyFor(uname('known-locks'));
  const base = { accountKey: key, deviceId: device(), ip: '10.9.0.3', knownDevice: true };
  const now = new Date('2026-03-01T00:00:00Z');
  for (let i = 0; i < 5; i++) assert.equal((await reserveLoginAttempt({ ...base, now })).allowed, true);
  assert.equal((await reserveLoginAttempt({ ...base, now })).allowed, false);
  await clearAccountThrottle(key);
});

test('distributed brute force: rotating device ids from one IP is stopped by the IP lane; rotating IPs is stopped by the account pace gate', async () => {
  const keyA = accountKeyFor(uname('rot-dev'));
  const now = new Date('2026-04-01T00:00:00Z');
  let allowed = 0; let blocked = 0;
  for (let i = 0; i < 25; i++) {
    const r = await reserveLoginAttempt({ accountKey: keyA, deviceId: device(), ip: '10.9.1.1', knownDevice: false, now });
    if (r.allowed) allowed++; else blocked++;
  }
  assert.equal(allowed, 10 + 0, 'IP lane allows 10 free attempts, then locks regardless of device id');
  assert.ok(blocked >= 15);

  const keyB = accountKeyFor(uname('rot-ip'));
  let allowedB = 0; let pacedB = 0;
  for (let i = 0; i < 60; i++) {
    const r = await reserveLoginAttempt({ accountKey: keyB, deviceId: device(), ip: `10.9.2.${i + 1}`, knownDevice: false, now });
    if (r.allowed) allowedB++; else if (r.reason === 'account_pace') pacedB++;
  }
  assert.equal(allowedB, LOGIN_THROTTLE_POLICY.unknownDeviceCeilingPerWindow, 'account-wide ceiling caps unknown-device guesses per hour');
  assert.ok(pacedB >= 29);
  await clearAccountThrottle(keyA); await clearAccountThrottle(keyB);
});

test('victim protection under distributed attack: exhausting the unknown-device budget does not block a known device, and only paces (never blocks) a new phone', async () => {
  const key = accountKeyFor(uname('budget'));
  const t0 = new Date('2026-05-01T00:00:00Z');
  for (let i = 0; i < LOGIN_THROTTLE_POLICY.unknownDeviceCeilingPerWindow; i++) {
    await reserveLoginAttempt({ accountKey: key, deviceId: device(), ip: `10.9.3.${i + 1}`, knownDevice: false, now: t0 });
  }
  const sameInstant = new Date(t0.getTime() + 1000);
  const attackerNext = await reserveLoginAttempt({ accountKey: key, deviceId: device(), ip: '10.9.4.1', knownDevice: false, now: sameInstant });
  assert.equal(attackerNext.allowed, false);

  // The owner's known phone has its own budget and is unaffected.
  const knownPhone = await reserveLoginAttempt({ accountKey: key, deviceId: device(), ip: '10.9.4.2', knownDevice: true, now: sameInstant });
  assert.equal(knownPhone.allowed, true);

  // A new phone is only delayed, never blocked until an administrator acts.
  const later = new Date(t0.getTime() + (LOGIN_THROTTLE_POLICY.unknownDevicePaceSeconds + 5) * 1000);
  const newPhone = await reserveLoginAttempt({ accountKey: key, deviceId: device(), ip: '10.9.4.3', knownDevice: false, now: later });
  assert.equal(newPhone.allowed, true);
  await clearAccountThrottle(key);
});

test('success clears this device and IP lanes and refunds the attempt', async () => {
  const key = accountKeyFor(uname('refund'));
  const input = { accountKey: key, deviceId: device(), ip: '10.9.5.1', knownDevice: false };
  const g = await reserveLoginAttempt(input);
  assert.equal(g.allowed, true);
  if (g.allowed) await recordLoginSuccess(input, g.attemptId);
  const { rows } = await query('SELECT count(*)::int AS n FROM auth_login_lanes WHERE account_key=$1', [key]);
  assert.equal(rows[0].n, 0);
  const { rows: att } = await query('SELECT count(*)::int AS n FROM auth_login_attempts WHERE account_key=$1', [key]);
  assert.equal(att[0].n, 0);
});

test('parallel guesses cannot slip past the limit (attempts are reserved before verification)', async () => {
  const key = accountKeyFor(uname('parallel'));
  const dev = device();
  const results = await Promise.all(Array.from({ length: 20 }, () =>
    reserveLoginAttempt({ accountKey: key, deviceId: dev, ip: '10.9.6.1', knownDevice: false })));
  assert.equal(results.filter((r) => r.allowed).length, LOGIN_THROTTLE_POLICY.deviceFreeAttempts);
  await clearAccountThrottle(key);
});

test('invalid device ids are ignored (cannot be used to dodge the limiter)', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('baddev');
    await makeUser(name, { pinVersion: 1, secret: GOOD_PIN, mustSetPin: false });
    const statuses: number[] = [];
    for (let i = 0; i < 6; i++) statuses.push((await post(base, '/auth/login', { username: name, pin: '999888' }, { 'x-device-id': `x${i}` })).status);
    assert.deepEqual(statuses, [401, 401, 401, 401, 401, 429], 'junk ids all fall into the same IP-derived lane');
  } finally { await stop(server); }
});

// ── Transparent PIN rehash (legacy bcrypt → peppered) ────────────────────────
// Existing users keep their PIN. A correct sign-in upgrades the stored hash; nothing
// else about the account, its sessions or its permissions changes.

import { isRehashEligible, rehashLegacyPinAfterLogin } from '../backend/src/utils/pinRehash.js';

async function credRow(name: string) {
  const { rows } = await query(
    'SELECT id, password_hash, pin_hash_version, pin_set_at, must_set_pin, must_change_pw, role FROM users WHERE username=$1', [name],
  );
  return rows[0];
}

test('rehash: an existing PIN stored as a legacy bcrypt hash still verifies exactly as before', async () => {
  const hash = await bcrypt.hash(EXISTING_PIN, 4);
  assert.equal(await verifyCredential(EXISTING_PIN, hash, null), true);
  assert.equal(await verifyCredential('730519', hash, null), false);
  assert.equal(await bcrypt.compare(EXISTING_PIN, hash), true, 'legacy hash is plain bcrypt of the PIN');
});

test('rehash: successful sign-in upgrades the hash; PIN unchanged, no PIN change forced, not flagged', async () => {
  const { server, base } = await startServer();
  try {
    for (const role of ['student', 'parent', 'teacher']) {
      const name = uname(`rh-${role}`);
      await makeUser(name, { role, secret: EXISTING_PIN });
      const before = await credRow(name);
      assert.equal(before.pin_hash_version, null);

      const r = await login(base, name, EXISTING_PIN);
      assert.equal(r.status, 200, role);
      assert.equal(r.json.must_set_pin, false, `${role}: no forced PIN change`);
      assert.equal((await get(base, '/protected', r.json.access_token)).status, 200);

      const after = await credRow(name);
      assert.equal(after.pin_hash_version, 1, `${role}: now the peppered scheme`);
      assert.notEqual(after.password_hash, before.password_hash, `${role}: old hash replaced`);
      assert.equal(after.must_set_pin, false, `${role}: the credential-write trigger must not flag a rehash`);
      assert.ok(after.pin_set_at, 'pin_set_at moves with the hash');
      assert.equal(await verifyCredential(EXISTING_PIN, after.password_hash, 1), true, 'same PIN verifies against the new hash');
      assert.equal(await bcrypt.compare(EXISTING_PIN, after.password_hash), false, 'new hash is not plain bcrypt of the PIN');
      assert.ok(!after.password_hash.includes(EXISTING_PIN));
    }
  } finally { await stop(server); }
});

test('rehash: repeated sign-ins after the upgrade keep working, on any device, and do not rewrite the hash again', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('rh-repeat');
    await makeUser(name, { secret: EXISTING_PIN });
    assert.equal((await login(base, name, EXISTING_PIN)).status, 200);
    const first = await credRow(name);
    assert.equal(first.pin_hash_version, 1);
    for (let i = 0; i < 3; i++) {
      const r = await login(base, name, EXISTING_PIN, {}, device());
      assert.equal(r.status, 200);
      assert.equal(r.json.must_set_pin, false);
      assert.equal((await get(base, '/protected', r.json.access_token)).status, 200);
    }
    const last = await credRow(name);
    assert.equal(last.password_hash, first.password_hash, 'already peppered: nothing further is written');
    assert.equal(String(last.pin_set_at), String(first.pin_set_at));
    assert.equal(last.must_set_pin, false);
  } finally { await stop(server); }
});

test('rehash: a failed authentication never rehashes (wrong PIN, wrong-format PIN, unknown user)', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('rh-fail');
    await makeUser(name, { secret: EXISTING_PIN });
    const before = await credRow(name);
    for (const bad of ['730519', '000000', '12345', EXISTING_PIN + '0', 'abcdef']) {
      const r = await login(base, name, bad, {}, device());
      assert.equal(r.status, 401, bad);
    }
    assert.equal((await login(base, uname('ghost'), EXISTING_PIN)).status, 401);
    const after = await credRow(name);
    assert.equal(after.password_hash, before.password_hash, 'hash untouched by failures');
    assert.equal(after.pin_hash_version, null);
    assert.equal(after.pin_set_at, null);
    assert.equal(after.must_set_pin, false);
  } finally { await stop(server); }
});

test('rehash: the write is a compare-and-swap and cannot overwrite a concurrently changed credential', async () => {
  const name = uname('rh-race');
  const id = await makeUser(name, { secret: EXISTING_PIN });
  const stale = await credRow(name); // what the login handler verified against

  // Another writer (e.g. the user changing their PIN, or an administrator reset)
  // lands between verification and the rehash.
  const theirs = await hashPin('582193');
  await query('UPDATE users SET password_hash=$1, pin_hash_version=1, pin_set_at=clock_timestamp() WHERE id=$2', [theirs, id]);

  assert.equal(await rehashLegacyPinAfterLogin(stale, EXISTING_PIN), 'superseded');
  const after = await credRow(name);
  assert.equal(after.password_hash, theirs, "the other writer's credential is untouched");
  assert.equal(await verifyCredential('582193', after.password_hash, 1), true);
  assert.equal(await verifyCredential(EXISTING_PIN, after.password_hash, 1), false, 'old PIN must not be resurrected');

  // Same, for an administrator reset that re-flags the account for PIN setup.
  const name2 = uname('rh-race-admin');
  const id2 = await makeUser(name2, { secret: EXISTING_PIN });
  const stale2 = await credRow(name2);
  const temp = await hashPin(generateTemporaryPin());
  await query('UPDATE users SET password_hash=$1, pin_hash_version=1, pin_set_at=clock_timestamp(), must_set_pin=TRUE WHERE id=$2', [temp, id2]);
  assert.equal(await rehashLegacyPinAfterLogin(stale2, EXISTING_PIN), 'superseded');
  const a2 = await credRow(name2);
  assert.equal(a2.password_hash, temp);
  assert.equal(a2.must_set_pin, true, 'the administrator-issued requirement survives');
});

test('rehash: two simultaneous sign-ins both succeed and exactly one rewrite lands', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('rh-parallel');
    await makeUser(name, { secret: EXISTING_PIN });
    const [a, b] = await Promise.all([login(base, name, EXISTING_PIN, {}, device()), login(base, name, EXISTING_PIN, {}, device())]);
    assert.equal(a.status, 200);
    assert.equal(b.status, 200);
    const row = await credRow(name);
    assert.equal(row.pin_hash_version, 1);
    assert.equal(row.must_set_pin, false);
    assert.equal(await verifyCredential(EXISTING_PIN, row.password_hash, 1), true);
    assert.equal((await login(base, name, EXISTING_PIN, {}, device())).status, 200);
  } finally { await stop(server); }
});

test('rehash: missing PIN_PEPPER fails safe — sign-in still works, nothing is written, no unpeppered fallback, no lockout, no leak', async () => {
  const { server, base } = await startServer();
  const name = uname('rh-nopepper');
  await makeUser(name, { secret: EXISTING_PIN });
  const before = await credRow(name);
  const saved = process.env.PIN_PEPPER;
  const logged: string[] = [];
  const realErr = console.error, realWarn = console.warn, realLog = console.log;
  const sink = (...a: unknown[]) => { logged.push(a.map((x) => (typeof x === 'string' ? x : JSON.stringify(x))).join(' ')); };
  try {
    delete process.env.PIN_PEPPER;
    console.error = sink; console.warn = sink; console.log = sink;
    for (let i = 0; i < 3; i++) {
      const r = await login(base, name, EXISTING_PIN, {}, device());
      assert.equal(r.status, 200, 'an existing legacy PIN still signs in while the pepper is unavailable');
      assert.equal(r.json.must_set_pin, false);
      assert.ok(!JSON.stringify(r.json).includes('PEPPER'));
    }
  } finally {
    console.error = realErr; console.warn = realWarn; console.log = realLog;
    process.env.PIN_PEPPER = saved;
    await stop(server);
  }
  const after = await credRow(name);
  assert.equal(after.password_hash, before.password_hash, 'old hash left in place');
  assert.equal(after.pin_hash_version, null);
  assert.equal(after.must_set_pin, false);
  const { rows } = await query('SELECT count(*)::int AS n FROM auth_login_attempts WHERE account_key=$1', [accountKeyFor(name)]);
  assert.equal(rows[0].n, 0, 'a missing pepper is never counted against the user');
  const text = logged.join('\n');
  assert.ok(!text.includes(EXISTING_PIN), 'PIN must not be logged');
  assert.ok(!text.includes(before.password_hash), 'hash must not be logged');
  assert.ok(!text.includes(String(saved)), 'pepper must not be logged');

  // Once the pepper is back the next sign-in upgrades the hash.
  const s2 = await startServer();
  try {
    assert.equal((await login(s2.base, name, EXISTING_PIN)).status, 200);
    assert.equal((await credRow(name)).pin_hash_version, 1);
  } finally { await stop(s2.server); }
});

test('rehash: a database failure during the upgrade never fails the sign-in and writes nothing', async () => {
  const name = uname('rh-dberr');
  await makeUser(name, { secret: EXISTING_PIN });
  const cand = await credRow(name);
  const realErr = console.error;
  const logged: string[] = [];
  console.error = (...a: unknown[]) => { logged.push(a.map(String).join(' ')); };
  try {
    // A candidate whose id is not a valid uuid makes the UPDATE itself throw.
    const outcome = await rehashLegacyPinAfterLogin({ ...cand, id: 'not-a-uuid' }, EXISTING_PIN);
    assert.equal(outcome, 'unavailable');
  } finally { console.error = realErr; }
  assert.equal((await credRow(name)).password_hash, cand.password_hash);
  assert.ok(!logged.join('\n').includes(EXISTING_PIN));
});

test('rehash: never applies to administrator-issued temporary credentials or to administrator roles', async () => {
  const { server, base } = await startServer();
  try {
    // Temporary credential awaiting PIN setup (must_set_pin) — legacy format, six digits.
    const tmp = uname('rh-tmp');
    await makeUser(tmp, { secret: '615284', mustSetPin: true });
    const t1 = await login(base, tmp, '615284');
    assert.equal(t1.status, 200);
    assert.equal(t1.json.must_set_pin, true, 'still must establish a permanent PIN');
    assert.equal((await get(base, '/protected', t1.json.access_token)).status, 403, 'still blocked from the dashboard');
    const r1 = await credRow(tmp);
    assert.equal(r1.pin_hash_version, null, 'temporary credential left exactly as issued');
    assert.equal(r1.must_set_pin, true);

    // must_change_pw = TRUE keeps its requirement and is not rehashed.
    const cpw = uname('rh-cpw');
    const cid = await makeUser(cpw, { secret: '615284' });
    await query('UPDATE users SET must_change_pw=TRUE, must_set_pin=TRUE, pin_set_at=clock_timestamp() WHERE id=$1', [cid]);
    const beforeCpw = await credRow(cpw);
    assert.equal((await login(base, cpw, '615284')).json.must_set_pin, true);
    const afterCpw = await credRow(cpw);
    assert.equal(afterCpw.password_hash, beforeCpw.password_hash);
    assert.equal(afterCpw.pin_hash_version, null);

    // Administrators: unchanged, even if their secret happens to be six digits.
    for (const role of ['admin', 'finance_admin']) {
      const a = uname(`rh-${role}`);
      await makeUser(a, { role, secret: '615284', school: null });
      const b = await credRow(a);
      const r = await login(base, a, '615284');
      assert.equal(r.status, 200, role);
      const af = await credRow(a);
      assert.equal(af.password_hash, b.password_hash, `${role} credential untouched`);
      assert.equal(af.pin_hash_version, null, role);
      assert.equal(af.must_set_pin, false, role);
    }
    assert.equal(isRehashEligible({ id: 'x', role: 'admin', password_hash: 'h', pin_hash_version: null }, '615284'), false);
    assert.equal(isRehashEligible({ id: 'x', role: 'finance_admin', password_hash: 'h', pin_hash_version: null }, '615284'), false);
  } finally { await stop(server); }
});

test('rehash: only a six-digit PIN is upgraded; any other legacy credential keeps working untouched', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('rh-nonpin');
    await makeUser(name, { secret: LEGACY }); // alphanumeric legacy password
    const before = await credRow(name);
    assert.equal((await login(base, name, LEGACY)).status, 200);
    const after = await credRow(name);
    assert.equal(after.password_hash, before.password_hash);
    assert.equal(after.pin_hash_version, null);
    assert.equal(isRehashEligible({ id: 'x', role: 'student', password_hash: 'h', pin_hash_version: 1 }, EXISTING_PIN), false, 'already peppered');
    assert.equal(isRehashEligible({ id: 'x', role: 'student', password_hash: 'h', pin_hash_version: null }, EXISTING_PIN), true);
  } finally { await stop(server); }
});

test('rehash: existing sessions stay valid and role/permissions are unchanged', async () => {
  const { server, base } = await startServer();
  try {
    const name = uname('rh-session');
    const id = await makeUser(name, { role: 'teacher', secret: EXISTING_PIN });
    const saved = process.env.PIN_PEPPER;
    let tokenA = '';
    try {
      delete process.env.PIN_PEPPER; // first sign-in cannot rehash; it just creates a session
      const a = await login(base, name, EXISTING_PIN, {}, device());
      assert.equal(a.status, 200);
      tokenA = a.json.access_token;
    } finally { process.env.PIN_PEPPER = saved; }
    assert.equal((await credRow(name)).pin_hash_version, null);

    const b = await login(base, name, EXISTING_PIN, {}, device()); // this one rehashes
    assert.equal(b.status, 200);
    assert.equal((await credRow(name)).pin_hash_version, 1);

    assert.equal((await get(base, '/protected', tokenA)).status, 200, 'the earlier session survives the rehash');
    assert.equal((await get(base, '/protected', b.json.access_token)).status, 200);
    const { rows } = await query('SELECT count(*)::int AS n FROM auth_sessions WHERE user_id=$1 AND revoked_at IS NULL', [id]);
    assert.equal(rows[0].n, 2, 'no session was revoked');
    assert.equal(b.json.user.role, 'teacher');
    const me = await credRow(name);
    assert.equal(me.role, 'teacher');
  } finally { await stop(server); }
});

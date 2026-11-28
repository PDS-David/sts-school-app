import { Router } from 'express';
import type { Request } from 'express';
import rateLimit from 'express-rate-limit';
import { createHash, randomInt, timingSafeEqual } from 'node:crypto';
import bcrypt from 'bcryptjs';
import { query, withTransaction } from '../db/pool.js';
import { signAccess, verifyRefresh } from '../utils/jwt.js';
import { pinSetupOutstanding, readLearningAccessPolicy, requireAuth } from '../middleware/auth.js';
import { audit, auditInTransaction } from '../utils/audit.js';
import { accountKeyFor, normalizeUsername } from '../utils/usernames.js';
import { PIN_HASH_VERSION, PinConfigError, burnDummyVerification, checkPin, hashPin, verifyCredential } from '../utils/pin.js';
import { rehashLegacyPinAfterLogin } from '../utils/pinRehash.js';
import { recordLoginSuccess, reserveLoginAttempt, validDeviceId } from '../utils/loginThrottle.js';
import {
  REFRESH_PREFIX, createSession, findLegacySession, isKnownDevice, revokeSession, revokeUserSessions, rotateSession, sha256Hex,
} from '../utils/authSessions.js';
import { GENERIC_LOGIN_ERROR, PENDING_APPROVAL_MESSAGE } from '../utils/authMessages.js';
import { claimStudentAccount, listUnclaimedStudentRoster, registerSelfServiceAccount } from '../utils/selfRegistration.js';
import { normalizeAnswer, usernameBaseFromName } from '../utils/password.js';
import { activateAccount, resetPasswordWithSecurityAnswer } from '../utils/credentialAttempts.js';
import type { AuthUser, Role } from '../types/index.js';
import { createPostgresRateLimitStore } from '../utils/postgresRateLimitStore.js';

const router = Router();

// ── Login throttling ─────────────────────────────────────────────────────────
// Account/device/IP layering lives in utils/loginThrottle.ts (it replaces the
// old per-username express limiter, which let anyone lock out any user by
// failing 10 times against that username). What stays here is a per-IP limiter
// across ALL accounts that counts failures only, so a school's shared Wi-Fi is
// not throttled by successful sign-ins.
const loginIpFailureLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  message: { error: 'Too many failed attempts from this network. Please wait a few minutes and try again.' },
  store: createPostgresRateLimitStore('auth-login-ip'),
});

const PIN_ROLES = new Set<string>(['student', 'parent', 'teacher']);
const ADMIN_ROLES = new Set<string>(['admin', 'finance_admin']);
const PIN_UNAVAILABLE_ERROR = 'PIN setup is temporarily unavailable. Please contact the school administrator.';

function humanWait(seconds: number): string {
  if (seconds < 90) return `${Math.max(1, seconds)} second${seconds === 1 ? '' : 's'}`;
  const minutes = Math.ceil(seconds / 60);
  return `${minutes} minute${minutes === 1 ? '' : 's'}`;
}

function clientDeviceId(req: Request): string | null {
  return validDeviceId(req.header('x-device-id') ?? (req.body as any)?.device_id);
}

function deviceLabel(raw: unknown): string | null {
  return typeof raw === 'string' && raw.trim() ? raw.trim().slice(0, 80) : null;
}

const ACCOUNT_STATE_SQL = `SELECT id,username,role,school_code,assigned_class,
       COALESCE(assigned_class_names, ARRAY[]::text[]) AS assigned_class_names,
       is_active,access_expires_at,revocation_reason,pending_admin_review,must_set_pin
  FROM users WHERE id=$1`;

async function loadAuthUser(userId: string, sid: string) {
  const { rows } = await query(ACCOUNT_STATE_SQL, [userId]);
  const user = rows[0];
  if (!user) return null;
  const { rows: subjectRows } = await query('SELECT subject_id FROM teacher_subjects WHERE user_id=$1', [user.id]);
  const authUser: AuthUser = {
    id: user.id, username: user.username, role: user.role as Role,
    school_code: user.school_code, assigned_class: user.assigned_class,
    assigned_subject_ids: subjectRows.map((r: any) => r.subject_id),
    assigned_class_names: user.assigned_class_names ?? [],
    sid,
  };
  return { user, authUser };
}

function accessEnded(user: any, message: string | null = null) {
  if (user.access_expires_at && new Date(user.access_expires_at).getTime() <= Date.now()) {
    return message ?? (user.revocation_reason
      ? `Your access period has ended: ${user.revocation_reason}. Contact the school admin to reactivate your account.`
      : 'Your access period has ended. Contact the school admin to reactivate your account.');
  }
  return null;
}

/** True when a proven public-role credential is not a six-digit PIN. */
export function isLegacyPinFormat(typed: string): boolean {
  return !/^\d{6}$/.test(typed);
}

/**
 * Bring must_set_pin / must_change_pw in line with the credential just proven
 * (see the call site in /login). Compare-and-swap on the verified hash, so a
 * concurrent PIN change, reset or activation is never overwritten. Mutates
 * `user` so the response and the rehash step see the stored state.
 *
 * Returns false when a flag change was needed but the compare-and-swap matched
 * no row: the credential that was just verified has been replaced in the
 * meantime (administrator reset, PIN change, activation). The caller must then
 * refuse the sign-in; the proven credential is no longer the account's
 * credential, so it must not be given a session.
 */
async function syncLegacyPinRequirement(user: any, typed: string): Promise<boolean> {
  if (!PIN_ROLES.has(user.role) || !user.password_hash) return true;
  const required = isLegacyPinFormat(typed);
  const stale = required
    ? user.must_set_pin !== true
    : user.must_set_pin === true || user.must_change_pw === true;
  if (!stale) return true;
  const { rowCount } = await query(
    required
      ? 'UPDATE users SET must_set_pin=TRUE WHERE id=$1 AND password_hash=$2'
      : 'UPDATE users SET must_set_pin=FALSE, must_change_pw=FALSE WHERE id=$1 AND password_hash=$2',
    [user.id, user.password_hash],
  );
  if (rowCount !== 1) return false;
  if (required) user.must_set_pin = true;
  else { user.must_set_pin = false; user.must_change_pw = false; }
  return true;
}

// ── POST /auth/login ──────────────────────────────────────────────────────────
// One username field and one secret field for every account. The client never
// says what kind of account it is and the server never trusts it if it did:
// the verified role comes only from the database row.
//
// Response discipline:
//   * unknown username and wrong PIN return the SAME generic error, with the
//     same timing (a dummy bcrypt runs when there is no account);
//   * only AFTER the credential is proven correct does the server reveal
//     account state (deactivated, expired, pending approval).
router.post('/login', loginIpFailureLimiter, async (req, res) => {
  const body = (req.body ?? {}) as Record<string, unknown>;
  const username = body.username;
  // `password` is accepted as an alias so older app builds that still send it
  // reach the same code path; it is not documented API.
  const secret = typeof body.pin === 'string' ? body.pin : body.password;
  if (typeof username !== 'string' || !username.trim() || username.length > 128 ||
      typeof secret !== 'string' || !secret || secret.length > 128) {
    return res.status(400).json({ error: 'Enter your username and PIN.' });
  }
  const rememberMe = body.remember_me === true;
  const deviceId = clientDeviceId(req);
  const ip = req.ip ?? 'unknown';
  const accountKey = accountKeyFor(username);

  const { rows: found } = await query(
    `SELECT id,username,password_hash,pin_hash_version,role,school_code,assigned_class,
            COALESCE(assigned_class_names, ARRAY[]::text[]) AS assigned_class_names,
            is_active,must_change_pw,must_set_pin,access_expires_at,revocation_reason,
            must_set_security_question,pending_admin_review
       FROM users WHERE lower(btrim(username)) = $1`,
    [normalizeUsername(username)],
  );
  // Older builds sent a school; honour it only to disambiguate teachers who
  // share a username. Newer clients never send it.
  const legacySchool = typeof body.school_code === 'string' ? body.school_code.trim() : '';
  const candidates = found.length > 1 && legacySchool
    ? found.filter((u: any) => u.role !== 'teacher' || u.school_code === legacySchool)
    : found;

  const throttleInput = {
    accountKey, deviceId, ip,
    knownDevice: await isKnownDevice(candidates.map((u: any) => u.id), deviceId),
  };
  const gate = await reserveLoginAttempt(throttleInput);
  if (!gate.allowed) {
    res.set('Retry-After', String(gate.retryAfterSeconds));
    return res.status(429).json({
      error: `Too many attempts. Please wait ${humanWait(gate.retryAfterSeconds)} and try again.`,
      retry_after_seconds: gate.retryAfterSeconds,
    });
  }

  const matches: any[] = [];
  try {
    if (candidates.length === 0) await burnDummyVerification(secret);
    for (const candidate of candidates) {
      if (!candidate.password_hash) { await burnDummyVerification(secret); continue; }
      if (await verifyCredential(secret, candidate.password_hash, candidate.pin_hash_version ?? null)) matches.push(candidate);
    }
  } catch (error) {
    if (error instanceof PinConfigError) {
      // Our configuration fault, not the user's: do not count it against them.
      await recordLoginSuccess(throttleInput, gate.attemptId);
      return res.status(503).json({ error: 'Sign-in is temporarily unavailable. Please contact the school administrator.' });
    }
    throw error;
  }

  if (matches.length !== 1) {
    if (matches.length > 1) console.warn('[auth] ambiguous username: credential matched more than one account', { matches: matches.length });
    return res.status(401).json({ error: GENERIC_LOGIN_ERROR });
  }
  const user = matches[0];
  await recordLoginSuccess(throttleInput, gate.attemptId);

  // ── Credential proven. Account state may now be revealed. ──
  if (!user.is_active) {
    return res.status(403).json({
      error: user.revocation_reason
        ? `Account is deactivated: ${user.revocation_reason}. Contact the school admin.`
        : 'Account is deactivated. Contact the school admin.',
    });
  }
  const ended = accessEnded(user);
  if (ended) return res.status(403).json({ error: ended });

  // Legacy-credential migration (students, parents, teachers). Decided here,
  // from the credential that was just proven, because a stored hash does not
  // reveal how many digits it protects:
  //   * not six digits (old four-digit teacher codes, eight-digit/character
  //     temporary credentials, older 8+ character passwords) → the account
  //     must establish a six-digit PIN before anything else;
  //   * six digits (existing PIN holders, administrator-issued temporary
  //     PINs) → straight to the dashboard; any stale forced-change flag is
  //     cleared.
  // Only the flags move; the account, its records and links are untouched.
  // If the credential was replaced between verification and this step (for
  // example an administrator reset), refuse: no session may be created for the
  // replaced credential, and the response is the same generic failure as any
  // other wrong credential.
  if (!await syncLegacyPinRequirement(user, secret)) {
    return res.status(401).json({ error: GENERIC_LOGIN_ERROR });
  }

  // Transparent upgrade of an existing PIN from the legacy bcrypt hash to the
  // peppered scheme. Runs only here, i.e. after the credential is proven, the
  // account is unique, active and not expired. It never throws, never changes
  // the PIN, never blocks or fails this sign-in, and skips temporary credentials
  // and administrator roles (see utils/pinRehash.ts).
  await rehashLegacyPinAfterLogin(user, secret);

  const accessPolicy = await readLearningAccessPolicy();
  const pending = !!user.pending_admin_review && !(user.role === 'student' && accessPolicy.freeLaunchMode);

  const { rows: subjectRows } = await query('SELECT subject_id FROM teacher_subjects WHERE user_id=$1', [user.id]);
  const assignedSubjectIds = subjectRows.map((r: any) => r.subject_id);

  const session = await createSession({
    userId: user.id, rememberMe, deviceId, deviceLabel: deviceLabel(body.device_label), ip,
  });
  const payload: AuthUser = {
    id: user.id,
    username: user.username,
    role: user.role as Role,
    school_code: user.school_code,
    assigned_class: user.assigned_class,
    assigned_subject_ids: assignedSubjectIds,
    assigned_class_names: user.assigned_class_names ?? [],
    sid: session.sessionId,
  };
  await audit(payload, 'login', 'user', user.id);

  const isPinRole = PIN_ROLES.has(user.role);
  return res.json({
    access_token: signAccess(payload),
    refresh_token: session.refreshToken,
    session_expires_at: session.expiresAt.toISOString(),
    remember_me: rememberMe,
    // The server enforces this on every request (requireAuth); the flags are only
    // so the app can show the right screen. Both are reported as stored.
    must_set_pin: isPinRole && user.must_set_pin === true,
    must_change_pw: isPinRole ? user.must_change_pw === true : user.must_change_pw,
    // Derived: a student, parent or teacher carrying EITHER flag must establish
    // a new six-digit PIN (POST /auth/pin) before anything else. False for
    // permanent PIN holders and for administrator accounts.
    pin_setup_required: pinSetupOutstanding(user),
    // Public roles recover through an administrator, so the forced
    // security-question step no longer applies to them. Administrator
    // accounts are unchanged.
    must_set_security_question: (isPinRole || user.role === 'teacher') ? false : user.must_set_security_question,
    pending_admin_review: pending,
    ...(pending ? { message: PENDING_APPROVAL_MESSAGE } : {}),
    user: {
      id: user.id, username: user.username, role: user.role, school_code: user.school_code,
      assigned_class: user.assigned_class, assigned_subject_ids: assignedSubjectIds,
      assigned_class_names: user.assigned_class_names ?? [], pending_admin_review: pending,
    },
  });
});

// ── POST /auth/refresh ────────────────────────────────────────────────────────
// Opaque refresh tokens are rotated on every use. A pre-migration JWT refresh
// token is exchanged once for a session, honouring its own original expiry, so
// nobody is signed out by the rollout.
router.post('/refresh', async (req, res) => {
  const { refresh_token } = (req.body ?? {}) as { refresh_token?: unknown };
  if (typeof refresh_token !== 'string' || !refresh_token || refresh_token.length > 2048) {
    return res.status(400).json({ error: 'refresh_token required' });
  }
  const revoked = () => res.status(401).json({ error: 'Invalid or expired refresh token' });

  if (refresh_token.startsWith(REFRESH_PREFIX)) {
    const rotated = await rotateSession(refresh_token);
    if (rotated.kind !== 'ok') return revoked();
    const loaded = await loadAuthUser(rotated.userId, rotated.sessionId);
    if (!loaded || !loaded.user.is_active || accessEnded(loaded.user)) {
      await revokeSession(rotated.sessionId, 'account_inactive');
      return revoked();
    }
    return res.json({
      access_token: signAccess(loaded.authUser),
      refresh_token: rotated.refreshToken,
      session_expires_at: rotated.expiresAt.toISOString(),
    });
  }

  // Legacy path.
  let legacy: { sub: string; exp?: number };
  try { legacy = verifyRefresh(refresh_token); } catch { return revoked(); }
  const legacySha = sha256Hex(refresh_token);
  const existing = await findLegacySession(legacySha);
  if (existing) {
    if (existing.revoked_at || new Date(existing.expires_at).getTime() <= Date.now()) return revoked();
    const loaded = await loadAuthUser(existing.user_id, existing.id);
    if (!loaded || !loaded.user.is_active || accessEnded(loaded.user)) return revoked();
    // Older app builds keep sending the legacy token and only read access_token.
    return res.json({ access_token: signAccess(loaded.authUser) });
  }
  const { rows } = await query('SELECT refresh_token FROM users WHERE id=$1', [legacy.sub]);
  if (!rows[0] || rows[0].refresh_token !== refresh_token) return revoked();
  const state = await query(ACCOUNT_STATE_SQL, [legacy.sub]);
  if (!state.rows[0] || !state.rows[0].is_active || accessEnded(state.rows[0])) return revoked();

  const session = await createSession({
    userId: legacy.sub, rememberMe: true, deviceId: clientDeviceId(req), ip: req.ip ?? null,
    legacyRefreshSha: legacySha,
    expiresAt: legacy.exp ? new Date(legacy.exp * 1000) : new Date(Date.now() + 7 * 86_400_000),
  });
  const loaded = await loadAuthUser(legacy.sub, session.sessionId);
  return res.json({
    access_token: signAccess(loaded!.authUser),
    refresh_token: session.refreshToken,
    session_expires_at: session.expiresAt.toISOString(),
  });
});

// ── GET /auth/me ──────────────────────────────────────────────────────────────
// What the app needs to restore the right screen after a restart: approval
// state and whether a PIN must still be set. The server enforces both
// independently on every request.
router.get('/me', requireAuth, async (req, res) => {
  const { rows } = await query('SELECT role, pending_admin_review, must_set_pin, must_change_pw FROM users WHERE id=$1', [req.user!.id]);
  if (!rows[0]) return res.status(404).json({ error: 'User not found' });
  const accessPolicy = req.learningAccessPolicy!;
  const pending = !!rows[0].pending_admin_review && !(req.user!.role === 'student' && accessPolicy.freeLaunchMode);
  return res.json({
    pending_admin_review: pending,
    must_set_pin: PIN_ROLES.has(rows[0].role) && rows[0].must_set_pin === true,
    must_change_pw: PIN_ROLES.has(rows[0].role) && rows[0].must_change_pw === true,
    pin_setup_required: pinSetupOutstanding(rows[0]),
    ...(pending ? { message: PENDING_APPROVAL_MESSAGE } : {}),
  });
});

// ── POST /auth/logout ─────────────────────────────────────────────────────────
// Ends THIS session only; other devices stay signed in. The access token stops
// working immediately because requireAuth checks the session row.
router.post('/logout', requireAuth, async (req, res) => {
  if (req.user!.sid) await revokeSession(req.user!.sid, 'logout');
  else await query('UPDATE users SET refresh_token=NULL WHERE id=$1', [req.user!.id]);
  return res.json({ ok: true });
});

// ── POST /auth/pin ────────────────────────────────────────────────────────────
// Set or change the six-digit PIN (students, parents, teachers). The same route
// serves the mandatory first-time setup and later voluntary changes, and is the
// only route besides /auth/me and /auth/logout reachable before setup. The
// current credential is required again, so a stolen session alone cannot
// replace the PIN, and attempts count toward the same throttle as login.
router.post('/pin', requireAuth, async (req, res) => {
  const me = req.user!;
  if (!PIN_ROLES.has(me.role)) {
    return res.status(403).json({ error: 'Six-digit PINs apply to student, parent and teacher accounts.' });
  }
  const { current_credential, new_pin } = (req.body ?? {}) as { current_credential?: unknown; new_pin?: unknown };
  if (typeof current_credential !== 'string' || !current_credential || current_credential.length > 128) {
    return res.status(400).json({ error: 'Enter your current PIN or password.' });
  }
  const check = checkPin(new_pin);
  if (!check.ok) return res.status(400).json({ error: check.message });
  if (current_credential === new_pin) {
    return res.status(400).json({ error: 'Choose a new PIN that is different from your current one.' });
  }

  const { rows } = await query('SELECT password_hash, pin_hash_version, must_set_pin FROM users WHERE id=$1', [me.id]);
  const row = rows[0];
  if (!row?.password_hash) return res.status(400).json({ error: 'This account cannot set a PIN yet.' });

  const deviceId = clientDeviceId(req);
  const throttleInput = {
    accountKey: accountKeyFor(me.username), deviceId, ip: req.ip ?? 'unknown',
    knownDevice: await isKnownDevice([me.id], deviceId),
  };
  const gate = await reserveLoginAttempt(throttleInput);
  if (!gate.allowed) {
    res.set('Retry-After', String(gate.retryAfterSeconds));
    return res.status(429).json({ error: `Too many attempts. Please wait ${humanWait(gate.retryAfterSeconds)} and try again.`, retry_after_seconds: gate.retryAfterSeconds });
  }

  let newHash: string;
  try {
    const ok = await verifyCredential(current_credential, row.password_hash, row.pin_hash_version ?? null);
    if (!ok) return res.status(401).json({ error: 'Your current PIN or password is incorrect.' });
    newHash = await hashPin(check.ok ? String(new_pin) : '');
  } catch (error) {
    if (error instanceof PinConfigError) {
      await recordLoginSuccess(throttleInput, gate.attemptId);
      return res.status(503).json({ error: 'PIN changes are temporarily unavailable. Please contact the school administrator.' });
    }
    throw error;
  }
  await recordLoginSuccess(throttleInput, gate.attemptId);

  // Compare-and-swap on the exact hash that was just verified. If an
  // administrator reset (or another PIN change) replaced the credential in the
  // meantime, nothing is written and no session is touched: the old credential
  // must never overwrite the newer one. Sessions are revoked only after the
  // update succeeded, inside the same transaction.
  const saved = await withTransaction(async (client) => {
    const { rowCount } = await client.query(
      `UPDATE users SET password_hash=$1, pin_hash_version=$2, pin_set_at=clock_timestamp(),
              must_set_pin=FALSE, must_change_pw=FALSE
        WHERE id=$3 AND password_hash=$4`,
      [newHash, PIN_HASH_VERSION, me.id, row.password_hash],
    );
    if (rowCount !== 1) return false;
    // Every other device is signed out; this one keeps its session.
    await revokeUserSessions(me.id, 'pin_changed', { exceptSessionId: me.sid ?? null, client });
    await auditInTransaction(
      client, me, row.must_set_pin ? 'set_pin' : 'change_pin', 'user', me.id,
      'six-digit PIN saved; other sessions revoked',
    );
    return true;
  });
  if (!saved) {
    return res.status(409).json({
      error: 'Your PIN was changed or reset by an administrator while you were saving. Nothing was changed. Sign in again with your current PIN.',
      code: 'CREDENTIAL_CHANGED',
    });
  }
  return res.json({ ok: true });
});

// ── POST /auth/change-password ────────────────────────────────────────────────
// Administrator and Finance Administrator accounts only; their credential
// arrangement is unchanged. Student/parent/teacher accounts use POST /auth/pin.
router.post('/change-password', requireAuth, async (req, res) => {
  if (PIN_ROLES.has(req.user!.role)) {
    return res.status(400).json({ error: 'Use the PIN screen to change your PIN.', code: 'USE_PIN_ENDPOINT' });
  }
  const { old_password, new_password } = req.body as { old_password: string; new_password: string };
  if (!old_password || !new_password) {
    return res.status(400).json({ error: 'old_password and new_password required' });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const { rows } = await query('SELECT password_hash FROM users WHERE id=$1', [req.user!.id]);
  if (!rows[0] || !await bcrypt.compare(old_password, rows[0].password_hash)) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const hash = await bcrypt.hash(new_password, 10);
  await withTransaction(async (client) => {
    await client.query('UPDATE users SET password_hash=$1, must_change_pw=FALSE WHERE id=$2', [hash, req.user!.id]);
    await revokeUserSessions(req.user!.id, 'password_changed', { exceptSessionId: req.user!.sid ?? null, client });
  });
  await audit(req.user!, 'change_password', 'user', req.user!.id);
  return res.json({ ok: true });
});

// ── POST /auth/push-token ─────────────────────────────────────────────────────
// Called by the mobile app right after login succeeds (see AuthContext.tsx
// login()), not as part of /auth/login itself — a push token is a device
// registering itself under an already-established session, not part of
// authenticating. Upserted on every login/app-open, so a reinstalled app or
// cleared storage naturally replaces its own dead row (see schema.sql
// device_push_tokens for why this is UNIQUE(user_id, expo_push_token)
// rather than one-token-per-user).
router.post('/push-token', requireAuth, async (req, res) => {
  const { expo_push_token, platform } = req.body as { expo_push_token: string; platform: string };
  if (!expo_push_token || !['ios', 'android'].includes(platform)) {
    return res.status(400).json({ error: 'expo_push_token and platform required' });
  }
  await query(
    `INSERT INTO device_push_tokens(user_id, expo_push_token, platform, last_seen_at)
     VALUES($1,$2,$3,now())
     ON CONFLICT(user_id, expo_push_token) DO UPDATE SET last_seen_at=now()`,
    [req.user!.id, expo_push_token, platform],
  );
  return res.status(204).send();
});

// ── POST /auth/push-token/unregister ──────────────────────────────────────────
// Called from the mobile logout flow — otherwise a shared/reissued device
// keeps receiving another account's pushes after logout.
router.post('/push-token/unregister', requireAuth, async (req, res) => {
  const { expo_push_token } = req.body as { expo_push_token: string };
  if (!expo_push_token) return res.status(400).json({ error: 'expo_push_token required' });
  await query(
    `DELETE FROM device_push_tokens WHERE user_id=$1 AND expo_push_token=$2`,
    [req.user!.id, expo_push_token],
  );
  return res.status(204).send();
});

// ── POST /auth/security-question ────────────────────────────────────────────
// Sets or updates the caller's own security question/answer — used both for
// the one-time forced setup (see must_set_security_question in /login) and
// for voluntarily changing it later from Settings. Requires being logged in;
// this is not part of the recovery flow itself (that's public, below).
router.post('/security-question', requireAuth, async (req, res) => {
  const { question, answer } = req.body as { question?: string; answer?: string };
  if (!question?.trim() || question.trim().length < 4) {
    return res.status(400).json({ error: 'Question must be at least 4 characters' });
  }
  if (!answer?.trim() || answer.trim().length < 2) {
    return res.status(400).json({ error: 'Answer must be at least 2 characters' });
  }
  const hash = await bcrypt.hash(normalizeAnswer(answer), 10);
  await query(
    `UPDATE users SET security_question=$1, security_answer_hash=$2,
       must_set_security_question=FALSE,
       security_answer_fail_count=0, security_answer_locked_until=NULL
     WHERE id=$3`,
    [question.trim(), hash, req.user!.id],
  );
  await audit(req.user!, 'set_security_question', 'user', req.user!.id);
  return res.json({ ok: true });
});

// ── Public recovery ───────────────────────────────────────────────────────────
// Students, parents and teachers recover through an administrator who verifies
// the person and issues a temporary six-digit PIN (POST /admin/users/:id/
// reset-password); a security question alone is not treated as proof of
// identity for them, so these public endpoints never serve those roles.
//
// Administrator and Finance Administrator accounts keep the existing
// security-question arrangement unchanged (explicitly out of scope here).
//
// Every "not available" outcome returns the SAME response, so these endpoints
// do not reveal whether an account exists, is deactivated, or has no question.
// (An administrator account that does have a question set still returns it:
// that is the unchanged arrangement, noted as a known limitation.)
const RECOVERY_UNAVAILABLE = 'Self-service recovery is not available for this account. Please see or call the E.O. to reset your PIN.';

router.get('/forgot-password/question', async (req, res) => {
  const username = normalizeUsername(String(req.query.username ?? ''));
  if (!username) return res.status(400).json({ error: 'username is required' });

  const { rows } = await query(
    `SELECT role, is_active, access_expires_at, security_question, must_set_security_question
       FROM users WHERE lower(btrim(username))=$1`,
    [username],
  );
  const user = rows.length === 1 ? rows[0] : null;
  const usable = !!user && ADMIN_ROLES.has(user.role) && user.is_active
    && !(user.access_expires_at && new Date(user.access_expires_at).getTime() <= Date.now())
    && !user.must_set_security_question && !!user.security_question;
  if (!usable) return res.json({ available: false, message: RECOVERY_UNAVAILABLE });
  return res.json({ available: true, question: user.security_question });
});

router.post('/forgot-password/reset', async (req, res) => {
  const { username, answer, new_password } = req.body as {
    username?: string; answer?: string; new_password?: string;
  };
  if (!username?.trim() || !answer?.trim() || !new_password) {
    return res.status(400).json({ error: 'username, answer, and new_password are required' });
  }
  if (new_password.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const result = await resetPasswordWithSecurityAnswer(normalizeUsername(username), answer, new_password);
  if (result.kind === 'locked') {
    return res.status(429).json({
      error: `Too many incorrect attempts. Try again in about ${result.retryAfterMinutes} minute(s), or contact your school admin.`,
    });
  }
  if (result.kind !== 'reset') {
    return res.status(401).json({ error: 'Incorrect answer, or this account is not eligible for self-service reset.' });
  }
  return res.json({ ok: true });
});

// ── Student self-claim (Task B) ──────────────────────────────────────────────
// Public (no login) — a student finds their own name and sets their own
// password, gated by a per-class code (see class_access_codes in schema.sql;
// generated via POST /admin/class-codes). Three read-only lookup steps
// (schools -> classes -> unclaimed roster) followed by the actual claim.
//
// Deliberately duplicates rather than reuses GET /academic/schools and GET
// /academic/classes: both of those routers apply requireAuth to the whole
// router (see academic.ts line 8), which a pre-account flow can never
// satisfy — and the roster step specifically must return only UNCLAIMED
// students with minimal fields (id + full_name, nothing else), which is not
// what any existing authenticated route returns, so it needs its own query
// regardless.
router.get('/self-claim/schools', async (_req, res) => {
  const { rows } = await query('SELECT code, name FROM schools ORDER BY id');
  return res.json({ schools: rows });
});

router.get('/self-claim/classes', async (req, res) => {
  const schoolCode = String(req.query.school_code ?? '').trim();
  if (!schoolCode) return res.status(400).json({ error: 'school_code is required' });
  const { rows } = await query('SELECT name FROM classes WHERE school_code=$1 ORDER BY id', [schoolCode]);
  return res.json({ classes: rows.map((r) => r.name) });
});

// Verify the class code before any unclaimed student names or identifiers are
// returned. POST keeps the code out of URLs; no-store prevents caching.
router.post('/self-claim/roster', async (req, res) => {
  res.set('Cache-Control', 'no-store');
  const { school_code, class_name, code } = req.body as {
    school_code?: string; class_name?: string; code?: string;
  };
  if (!school_code?.trim() || !class_name?.trim() || !code?.trim()) {
    return res.status(400).json({ error: 'school_code, class_name, and code are required' });
  }

  const result = await listUnclaimedStudentRoster({
    schoolCode: school_code.trim(),
    className: class_name.trim(),
    accessCode: code,
  });
  if (result.kind === 'locked') {
    return res.status(429).json({
      error: `Too many incorrect attempts for this class. Try again in about ${result.retryAfterMinutes} minute(s), or ask your school admin.`,
    });
  }
  if (result.kind === 'invalid_code') {
    return res.status(401).json({ error: 'Incorrect class code, or self-claim is not available for this class.' });
  }
  return res.json({ students: result.students });
});

router.post('/self-claim', async (req, res) => {
  const { school_code, class_name, student_id, code, admission_number, new_pin, new_password } = req.body as {
    school_code?: string; class_name?: string; student_id?: string; code?: string; admission_number?: string; new_pin?: string; new_password?: string;
  };
  // `new_pin` is the field; `new_password` is accepted from older app builds.
  const chosenPin = new_pin ?? new_password;
  if (!school_code?.trim() || !class_name?.trim() || !student_id || !code || !admission_number?.trim() || !chosenPin) {
    return res.status(400).json({ error: 'school_code, class_name, student_id, code, admission_number, and new_pin are required' });
  }
  // Students choose their permanent six-digit PIN here (same rule as POST /auth/pin).
  const pinCheck = checkPin(chosenPin);
  if (!pinCheck.ok) return res.status(400).json({ error: pinCheck.message });

  let passwordHash: string;
  try {
    passwordHash = await hashPin(String(chosenPin));
  } catch (error) {
    if (error instanceof PinConfigError) return res.status(503).json({ error: PIN_UNAVAILABLE_ERROR });
    throw error;
  }
  const result = await claimStudentAccount({
    schoolCode: school_code.trim(),
    className: class_name.trim(),
    studentId: student_id,
    admissionNumber: admission_number,
    accessCode: code,
    passwordHash,
    pinHashVersion: PIN_HASH_VERSION,
  });

  if (result.kind === 'locked') {
    return res.status(429).json({
      error: `Too many incorrect attempts for this class. Try again in about ${result.retryAfterMinutes} minute(s), or ask your school admin.`,
    });
  }
  if (result.kind === 'invalid_code') {
    return res.status(401).json({ error: 'Incorrect class code, or self-claim is not available for this class.' });
  }
  if (result.kind === 'student_not_found') {
    return res.status(404).json({ error: 'That student was not found, or already has an account. If you already have an account, use Forgot Password instead.' });
  }

  return res.status(201).json({ username: result.username });
});

// UPDATE (this session): the note that used to be here said self-signup for
// teacher/parent/admin was deliberately removed and should not be re-added
// without an admin-issued-invite-code guard. That guard was discussed but
// never built. Explicit project-owner decision this session reverses that:
// student/parent/teacher (never admin) can now self-register directly, with
// NO invite code — identity verification is intentionally light (full name +
// phone, plus an admission number for student/parent specifically, matched
// against an existing enrollment record). The actual safeguard is
// `pending_admin_review`: a self-registered account can log in immediately,
// but sees nothing class-related until an admin approves it (see
// POST /admin/users/:id/approve in admin.ts, and RootNavigator.tsx's
// pending-review phase on the mobile side). If this is ever revisited again,
// re-read this note and AGENT_CONTINUATION.md's "Confirmed product intent"
// section first — this is now the third time this specific tradeoff has
// been discussed and decided.
router.post('/self-register', async (req, res) => {
  const { role, full_name, phone, school_code, username, class_name, admission_number, ward_admission_number } = req.body as {
    role?: string; full_name?: string; phone?: string; school_code?: string;
    username?: string; pin?: string; password?: string; class_name?: string; admission_number?: string; ward_admission_number?: string;
  };
  // Every self-registering role (student, parent, teacher) signs in with a
  // six-digit PIN. `pin` is the field; `password` is accepted from older builds.
  const password = (req.body as { pin?: string; password?: string }).pin ?? (req.body as { password?: string }).password;

  if (!role || !['student', 'parent', 'teacher'].includes(role)) {
    return res.status(400).json({ error: 'role must be student, parent, or teacher' });
  }
  if (!full_name?.trim() || !phone?.trim() || !school_code?.trim() || !username?.trim() || !password) {
    return res.status(400).json({ error: 'full_name, phone, school_code, username, and pin are required' });
  }
  const pinCheck = checkPin(password);
  if (!pinCheck.ok) return res.status(400).json({ error: pinCheck.message });
  if (role === 'student' && !class_name?.trim() && !admission_number?.trim()) {
    return res.status(400).json({ error: 'class_name is required for independent online student registration' });
  }
  if (role === 'parent') {
    if (!ward_admission_number?.trim()) {
      return res.status(400).json({ error: 'ward_admission_number is required for parent self-registration' });
    }
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      return res.status(400).json({ error: 'Parent phone must contain between 10 and 15 digits' });
    }
  }

  const normalizedUsername = username.trim().toLowerCase();
  const normalizedSchool = school_code.trim();
  const normalizedName = full_name.trim();
  const normalizedPhone = phone.trim();
  let passwordHash: string;
  try {
    passwordHash = await hashPin(String(password));
  } catch (error) {
    if (error instanceof PinConfigError) return res.status(503).json({ error: PIN_UNAVAILABLE_ERROR });
    throw error;
  }

  const result = await registerSelfServiceAccount({
    role: role as 'student' | 'parent' | 'teacher',
    fullName: normalizedName,
    phone: normalizedPhone,
    schoolCode: normalizedSchool,
    username: normalizedUsername,
    passwordHash,
    pinHashVersion: PIN_HASH_VERSION,
    className: role === 'student' ? class_name?.trim() : undefined,
    admissionNumber: role === 'student' ? admission_number?.trim() : undefined,
    wardAdmissionNumber: role === 'parent' ? ward_admission_number?.trim() : undefined,
  });

  if (result.kind === 'username_taken') {
    return res.status(409).json({ error: 'That username is already taken — pick another.' });
  }
  if (result.kind === 'school_not_found') {
    return res.status(404).json({ error: 'The selected school was not found.' });
  }
  if (result.kind === 'class_not_found') {
    return res.status(404).json({ error: 'The selected learning class was not found for this school.' });
  }
  if (result.kind === 'student_not_found') {
    return res.status(404).json({
      error: role === 'parent'
        ? "We couldn't find a matching enrollment record for that admission number at this school. Contact your school admin."
        : "We couldn't find a matching enrollment record for that admission number at this school, or it already has an account. Contact your school admin.",
    });
  }
  if (result.kind === 'parent_phone_exists') {
    return res.status(409).json({ error: 'An account already exists for this phone number. Use Forgot Password to recover it, or contact your school admin.' });
  }

  const accessPolicy = await readLearningAccessPolicy();
  return res.status(201).json({
    username: result.username,
    approval_required: !!(role !== 'student' || !accessPolicy.freeLaunchMode),
  });
});

router.post('/activate', async (req, res) => {
  const { username, activation_code, new_pin, new_password } = req.body as {
    username?: string; activation_code?: string; new_pin?: string; new_password?: string;
  };
  // Students/parents/teachers send `new_pin` (six digits); administrator roles
  // send `new_password` (8+ characters). The account's role decides which rule
  // applies (utils/credentialAttempts.ts), so either field name is accepted.
  const secret = new_pin ?? new_password;
  if (!username || !activation_code || typeof secret !== 'string' || !secret || secret.length > 128) {
    return res.status(400).json({ error: 'username, activation_code, and new_pin (or new_password) are required' });
  }

  let result;
  try {
    result = await activateAccount(username.trim().toLowerCase(), activation_code, secret);
  } catch (error) {
    if (error instanceof PinConfigError) return res.status(503).json({ error: PIN_UNAVAILABLE_ERROR });
    throw error;
  }
  if (result.kind === 'invalid_secret') {
    return res.status(400).json({ error: result.message });
  }
  if (result.kind === 'locked') {
    return res.status(429).json({
      error: `Too many incorrect attempts. Try again in about ${result.retryAfterMinutes} minute(s), or ask your school admin for a new code.`,
    });
  }
  if (result.kind === 'invalid') {
    return res.status(401).json({ error: 'Invalid username or activation code, or this account is already active.' });
  }

  return res.status(201).json({ ok: true, username: result.username });
});

// self-claim above is a deliberate, narrower exception to that decision —
// gated by a per-class code plus finding your own still-unclaimed name in
// the roster, not an open self-signup.

export default router;
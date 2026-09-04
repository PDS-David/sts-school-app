import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';
import { normalizeAnswer } from '../utils/password.js';
import type { AuthUser, Role } from '../types/index.js';

const router = Router();

// ── POST /auth/login ──────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { username, password } = req.body as { username: string; password: string };
  if (!username || !password) {
    return res.status(400).json({ error: 'username and password required' });
  }

  const { rows } = await query(
    `SELECT id,username,password_hash,role,school_code,
            assigned_class,is_active,must_change_pw,access_expires_at,
            revocation_reason,must_set_security_question
     FROM users WHERE username = $1`,
    [username.trim().toLowerCase()],
  );

  const user = rows[0];
  if (!user || !await bcrypt.compare(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  if (!user.is_active) {
    return res.status(403).json({
      error: user.revocation_reason
        ? `Account is deactivated: ${user.revocation_reason}. Contact the school admin.`
        : 'Account is deactivated. Contact the school admin.',
    });
  }
  if (user.access_expires_at && new Date(user.access_expires_at).getTime() <= Date.now()) {
    return res.status(403).json({
      error: user.revocation_reason
        ? `Your access period has ended: ${user.revocation_reason}. Contact the school admin to reactivate your account.`
        : 'Your access period has ended. Contact the school admin to reactivate your account.',
    });
  }

  const { rows: subjectRows } = await query('SELECT subject_id FROM teacher_subjects WHERE user_id=$1', [user.id]);
  const assignedSubjectIds = subjectRows.map((r: any) => r.subject_id);

  const payload: AuthUser = {
    id: user.id,
    username: user.username,
    role: user.role as Role,
    school_code: user.school_code,
    assigned_class: user.assigned_class,
    assigned_subject_ids: assignedSubjectIds,
  };

  const accessToken  = signAccess(payload);
  const refreshToken = signRefresh(user.id);

  // Persist refresh token
  await query('UPDATE users SET refresh_token=$1 WHERE id=$2', [refreshToken, user.id]);
  await audit(payload, 'login', 'user', user.id);

  return res.json({
    access_token: accessToken,
    refresh_token: refreshToken,
    must_change_pw: user.must_change_pw,
    // Prompts the one-time (or retrofitted, for pre-existing accounts)
    // security-question setup that self-service password recovery depends
    // on — see POST /auth/security-question and the forgot-password routes
    // below. Independent of must_change_pw: a user who already knows their
    // password can still be missing this.
    must_set_security_question: user.must_set_security_question,
    // `assigned_class` added here for the class-lock feature: the mobile app
    // needs to know which class (if any) a teacher is the class teacher for,
    // so it can offer "lock/unlock my class" only where it actually applies.
    // It was already being fetched and put into the JWT payload above, just
    // never actually returned to the client for the app to read directly.
    user: { id: user.id, username: user.username, role: user.role, school_code: user.school_code, assigned_class: user.assigned_class, assigned_subject_ids: assignedSubjectIds },
  });
});

// ── POST /auth/refresh ────────────────────────────────────────────────────────
router.post('/refresh', async (req, res) => {
  const { refresh_token } = req.body as { refresh_token: string };
  if (!refresh_token) return res.status(400).json({ error: 'refresh_token required' });

  let payload: { sub: string };
  try { payload = verifyRefresh(refresh_token); }
  catch { return res.status(401).json({ error: 'Invalid or expired refresh token' }); }

  const { rows } = await query(
    `SELECT id,username,role,school_code,assigned_class,
            is_active,refresh_token,access_expires_at,revocation_reason FROM users WHERE id=$1`,
    [payload.sub],
  );
  const user = rows[0];
  if (!user || user.refresh_token !== refresh_token || !user.is_active) {
    return res.status(401).json({ error: 'Refresh token revoked' });
  }
  if (user.access_expires_at && new Date(user.access_expires_at).getTime() <= Date.now()) {
    return res.status(403).json({
      error: user.revocation_reason
        ? `Your access period has ended: ${user.revocation_reason}. Contact the school admin to reactivate your account.`
        : 'Your access period has ended. Contact the school admin to reactivate your account.',
    });
  }

  const { rows: subjectRows } = await query('SELECT subject_id FROM teacher_subjects WHERE user_id=$1', [user.id]);
  const assignedSubjectIds = subjectRows.map((r: any) => r.subject_id);

  const authUser: AuthUser = {
    id: user.id, username: user.username, role: user.role,
    school_code: user.school_code,
    assigned_class: user.assigned_class,
    assigned_subject_ids: assignedSubjectIds,
  };
  return res.json({ access_token: signAccess(authUser) });
});

// ── POST /auth/logout ─────────────────────────────────────────────────────────
router.post('/logout', requireAuth, async (req, res) => {
  await query('UPDATE users SET refresh_token=NULL WHERE id=$1', [req.user!.id]);
  return res.json({ ok: true });
});

// ── POST /auth/change-password ────────────────────────────────────────────────
router.post('/change-password', requireAuth, async (req, res) => {
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
  await query('UPDATE users SET password_hash=$1, must_change_pw=FALSE WHERE id=$2', [hash, req.user!.id]);
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

// ── GET /auth/forgot-password/question?username= ───────────────────────────
// Public (no login) — the first step of self-service recovery. Deliberately
// re-checks the exact same is_active/access_expires_at gate that login and
// requireAuth already enforce: if an admin has revoked access or it's
// lapsed, self-service recovery must not be usable as a side-door around
// that, and the person is shown the same revocation_reason login would show.
// Returning a question only when one exists means a "not available" result
// doesn't distinguish "no such user" from "user has no question set" from
// "wrong username" — all three look the same on purpose.
router.get('/forgot-password/question', async (req, res) => {
  const username = String(req.query.username ?? '').trim().toLowerCase();
  if (!username) return res.status(400).json({ error: 'username is required' });

  const { rows } = await query(
    `SELECT is_active, access_expires_at, revocation_reason,
            security_question, must_set_security_question
     FROM users WHERE username=$1`,
    [username],
  );
  const user = rows[0];

  const unavailable = (message: string) => res.json({ available: false, message });

  if (!user) {
    return unavailable('No recovery question found for this account. Contact your school admin.');
  }
  if (!user.is_active) {
    return unavailable(
      user.revocation_reason
        ? `Your account was deactivated: ${user.revocation_reason}. Contact your school admin.`
        : 'Your account is deactivated. Contact your school admin.',
    );
  }
  if (user.access_expires_at && new Date(user.access_expires_at).getTime() <= Date.now()) {
    return unavailable(
      user.revocation_reason
        ? `Your access period has ended: ${user.revocation_reason}. Contact your school admin.`
        : 'Your access period has ended. Contact your school admin to reactivate your account.',
    );
  }
  if (user.must_set_security_question || !user.security_question) {
    return unavailable('No recovery question is set for this account yet. Contact your school admin to reset your password.');
  }
  return res.json({ available: true, question: user.security_question });
});

// ── POST /auth/forgot-password/reset ────────────────────────────────────────
// Public (no login) — the second step: answer the question, set a new
// password directly. No separate reset-token/email round trip, since there's
// no delivery channel to send one through; the answer check itself is the
// verification step. Re-checks the same gate as the question lookup above
// (an admin could revoke access in the window between the two requests).
// Failed attempts are counted per-account and lock out for an hour after 5,
// independent of the broader per-IP /auth rate limiter in index.ts.
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

  const uname = username.trim().toLowerCase();
  const { rows } = await query(
    `SELECT id, is_active, access_expires_at, revocation_reason,
            security_question, security_answer_hash, must_set_security_question,
            security_answer_fail_count, security_answer_locked_until
     FROM users WHERE username=$1`,
    [uname],
  );
  const user = rows[0];

  // Same generic shape for "no such user", "no question set", and a wrong
  // answer — see the comment on the question-lookup route above for why.
  const genericFail = () => res.status(401).json({ error: 'Incorrect answer, or this account is not eligible for self-service reset.' });

  if (!user) return genericFail();
  if (!user.is_active) {
    return res.status(403).json({
      error: user.revocation_reason
        ? `Your account was deactivated: ${user.revocation_reason}. Contact your school admin.`
        : 'Your account is deactivated. Contact your school admin.',
    });
  }
  if (user.access_expires_at && new Date(user.access_expires_at).getTime() <= Date.now()) {
    return res.status(403).json({
      error: user.revocation_reason
        ? `Your access period has ended: ${user.revocation_reason}. Contact your school admin.`
        : 'Your access period has ended. Contact your school admin to reactivate your account.',
    });
  }
  if (user.must_set_security_question || !user.security_answer_hash) return genericFail();

  if (user.security_answer_locked_until && new Date(user.security_answer_locked_until).getTime() > Date.now()) {
    const mins = Math.ceil((new Date(user.security_answer_locked_until).getTime() - Date.now()) / 60000);
    return res.status(429).json({ error: `Too many incorrect attempts. Try again in about ${mins} minute(s), or contact your school admin.` });
  }

  const correct = await bcrypt.compare(normalizeAnswer(answer), user.security_answer_hash);
  if (!correct) {
    const fails = (user.security_answer_fail_count ?? 0) + 1;
    const LOCK_THRESHOLD = 5;
    if (fails >= LOCK_THRESHOLD) {
      await query(
        `UPDATE users SET security_answer_fail_count=0,
           security_answer_locked_until=now() + interval '1 hour' WHERE id=$1`,
        [user.id],
      );
    } else {
      await query('UPDATE users SET security_answer_fail_count=$1 WHERE id=$2', [fails, user.id]);
    }
    await audit(null, 'forgot_password_failed', 'user', user.id, `attempt ${fails}`);
    return genericFail();
  }

  const hash = await bcrypt.hash(new_password, 10);
  await query(
    `UPDATE users SET password_hash=$1, must_change_pw=FALSE,
       security_answer_fail_count=0, security_answer_locked_until=NULL
     WHERE id=$2`,
    [hash, user.id],
  );
  await audit(null, 'forgot_password_reset', 'user', user.id);
  return res.json({ ok: true });
});

// NOTE: There is deliberately no self-signup route. Teacher and parent accounts
// are only ever created by an admin (see POST /admin/users), which also lets the
// admin set an access_expires_at window for that credential. Removing this route
// was a decision made explicitly with the school owner — do not re-add it without
// also re-adding the admin-issued-invite-code guard that was discussed alongside it.

export default router;
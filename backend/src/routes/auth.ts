import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { query } from '../db/pool.js';
import { signAccess, signRefresh, verifyRefresh } from '../utils/jwt.js';
import { requireAuth } from '../middleware/auth.js';
import { audit } from '../utils/audit.js';
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
            assigned_class,assigned_subject_id,is_active,must_change_pw,access_expires_at
     FROM users WHERE username = $1`,
    [username.trim().toLowerCase()],
  );

  const user = rows[0];
  if (!user || !await bcrypt.compare(password, user.password_hash)) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }
  if (!user.is_active) {
    return res.status(403).json({ error: 'Account is deactivated. Contact the school admin.' });
  }
  if (user.access_expires_at && new Date(user.access_expires_at).getTime() <= Date.now()) {
    return res.status(403).json({ error: 'Your access period has ended. Contact the school admin to reactivate your account.' });
  }

  const payload: AuthUser = {
    id: user.id,
    username: user.username,
    role: user.role as Role,
    school_code: user.school_code,
    assigned_class: user.assigned_class,
    assigned_subject_id: user.assigned_subject_id,
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
    // `assigned_class` added here for the class-lock feature: the mobile app
    // needs to know which class (if any) a teacher is the class teacher for,
    // so it can offer "lock/unlock my class" only where it actually applies.
    // It was already being fetched and put into the JWT payload above, just
    // never actually returned to the client for the app to read directly.
    user: { id: user.id, username: user.username, role: user.role, school_code: user.school_code, assigned_class: user.assigned_class },
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
    `SELECT id,username,role,school_code,assigned_class,assigned_subject_id,
            is_active,refresh_token,access_expires_at FROM users WHERE id=$1`,
    [payload.sub],
  );
  const user = rows[0];
  if (!user || user.refresh_token !== refresh_token || !user.is_active) {
    return res.status(401).json({ error: 'Refresh token revoked' });
  }
  if (user.access_expires_at && new Date(user.access_expires_at).getTime() <= Date.now()) {
    return res.status(403).json({ error: 'Your access period has ended. Contact the school admin to reactivate your account.' });
  }

  const authUser: AuthUser = {
    id: user.id, username: user.username, role: user.role,
    school_code: user.school_code,
    assigned_class: user.assigned_class,
    assigned_subject_id: user.assigned_subject_id,
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

// NOTE: There is deliberately no self-signup route. Teacher and parent accounts
// are only ever created by an admin (see POST /admin/users), which also lets the
// admin set an access_expires_at window for that credential. Removing this route
// was a decision made explicitly with the school owner — do not re-add it without
// also re-adding the admin-issued-invite-code guard that was discussed alongside it.

export default router;

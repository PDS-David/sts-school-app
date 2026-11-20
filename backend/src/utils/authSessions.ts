import { createHash, randomBytes } from 'node:crypto';
import type { PoolClient } from 'pg';
import { query, withTransaction } from '../db/pool.js';
import { LOGIN_THROTTLE_POLICY } from './loginThrottle.js';

/**
 * Server-side sessions.
 *
 * Every login creates its own row, so signing in on another device never ends
 * an existing session. The access token carries the session id (`sid`); the
 * auth middleware checks the row on every request, so logout, a PIN change or
 * an administrator reset invalidates access tokens immediately instead of
 * waiting out their 15-minute lifetime.
 *
 * Refresh tokens are opaque 256-bit random values stored only as SHA-256
 * hashes, rotated on every use. The previous token is honoured for a short
 * grace window (a lost response must not strand a phone on a flaky network);
 * presenting an old token after that window is treated as theft and revokes
 * the whole session.
 */

export const REMEMBER_TTL_MS = 30 * 24 * 3_600_000;   // Remember me: 30 days, absolute
export const SHORT_TTL_MS = 12 * 3_600_000;           // otherwise: 12 hours, absolute
export const MAX_ACTIVE_SESSIONS = 10;
export const ROTATION_GRACE_MS = 30_000;
export const REFRESH_PREFIX = 'rt_';

export const sha256Hex = (value: string): string => createHash('sha256').update(value).digest('hex');
export const newRefreshToken = (): string => REFRESH_PREFIX + randomBytes(32).toString('base64url');
export const isUuid = (v: unknown): v is string =>
  typeof v === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);

export interface NewSessionInput {
  userId: string;
  rememberMe: boolean;
  deviceId: string | null;
  deviceLabel?: string | null;
  ip?: string | null;
  now?: Date;
  /** Pre-migration JWT refresh token being exchanged (idempotency marker). */
  legacyRefreshSha?: string | null;
  /** Override the absolute expiry (used to honour a legacy token's own expiry). */
  expiresAt?: Date;
}

export interface IssuedSession { sessionId: string; refreshToken: string; expiresAt: Date }

export async function createSession(input: NewSessionInput, client?: PoolClient): Promise<IssuedSession> {
  const now = input.now ?? new Date();
  const refreshToken = newRefreshToken();
  const expiresAt = input.expiresAt ?? new Date(now.getTime() + (input.rememberMe ? REMEMBER_TTL_MS : SHORT_TTL_MS));

  const run = async (c: PoolClient): Promise<IssuedSession> => {
    // The same device signing in again replaces its own previous session
    // instead of consuming another of the account's 10 slots.
    if (input.deviceId) {
      await c.query(
        `UPDATE auth_sessions SET revoked_at=$3, revoked_reason='replaced_same_device'
          WHERE user_id=$1 AND device_id=$2 AND revoked_at IS NULL`,
        [input.userId, input.deviceId, now],
      );
    }
    const { rows } = await c.query<{ id: string }>(
      `INSERT INTO auth_sessions(user_id, refresh_hash, device_id, device_label, ip, remember_me,
                                 created_at, last_used_at, expires_at, legacy_refresh_sha)
       VALUES($1,$2,$3,$4,$5,$6,$7,$7,$8,$9) RETURNING id`,
      [input.userId, sha256Hex(refreshToken), input.deviceId, input.deviceLabel ?? null, input.ip ?? null,
       input.rememberMe, now, expiresAt, input.legacyRefreshSha ?? null],
    );
    // Hard cap: keep the 10 most recently used active sessions.
    await c.query(
      `UPDATE auth_sessions SET revoked_at=$2, revoked_reason='session_cap'
        WHERE id IN (SELECT id FROM auth_sessions
                      WHERE user_id=$1 AND revoked_at IS NULL AND expires_at > $2
                      ORDER BY last_used_at DESC, created_at DESC OFFSET $3)`,
      [input.userId, now, MAX_ACTIVE_SESSIONS],
    );
    return { sessionId: rows[0].id, refreshToken, expiresAt };
  };
  return client ? run(client) : withTransaction(run);
}

export type RotateResult =
  | { kind: 'ok'; sessionId: string; userId: string; refreshToken: string; expiresAt: Date }
  | { kind: 'invalid' };

/** Exchange a refresh token for a fresh pair; the old token stops working after the grace window. */
export async function rotateSession(presented: string, now: Date = new Date()): Promise<RotateResult> {
  if (!presented.startsWith(REFRESH_PREFIX) || presented.length > 200) return { kind: 'invalid' };
  const oldHash = sha256Hex(presented);
  const next = newRefreshToken();
  const nextHash = sha256Hex(next);

  const current = await query(
    `UPDATE auth_sessions
        SET refresh_hash=$2, prev_refresh_hash=refresh_hash, prev_rotated_at=$3, last_used_at=$3
      WHERE refresh_hash=$1 AND revoked_at IS NULL AND expires_at > $3
      RETURNING id, user_id, expires_at`,
    [oldHash, nextHash, now],
  );
  if (current.rows[0]) {
    return { kind: 'ok', sessionId: current.rows[0].id, userId: current.rows[0].user_id, refreshToken: next, expiresAt: new Date(current.rows[0].expires_at) };
  }

  // Not the current token. Is it the immediately previous one?
  const { rows: prev } = await query(
    `SELECT id, user_id, prev_rotated_at, revoked_at, expires_at FROM auth_sessions WHERE prev_refresh_hash=$1`,
    [oldHash],
  );
  const row = prev[0];
  if (!row || row.revoked_at || new Date(row.expires_at) <= now) return { kind: 'invalid' };

  if (now.getTime() - new Date(row.prev_rotated_at).getTime() <= ROTATION_GRACE_MS) {
    // Lost-response retry inside the grace window: rotate again.
    const again = await query(
      `UPDATE auth_sessions
          SET refresh_hash=$3, prev_refresh_hash=refresh_hash, prev_rotated_at=$4, last_used_at=$4
        WHERE id=$1 AND prev_refresh_hash=$2 AND revoked_at IS NULL
        RETURNING id, user_id, expires_at`,
      [row.id, oldHash, nextHash, now],
    );
    if (again.rows[0]) {
      return { kind: 'ok', sessionId: again.rows[0].id, userId: again.rows[0].user_id, refreshToken: next, expiresAt: new Date(again.rows[0].expires_at) };
    }
    return { kind: 'invalid' };
  }

  // An already-superseded token presented after the grace window: reuse.
  await revokeSession(row.id, 'refresh_reuse_detected', now);
  return { kind: 'invalid' };
}

export async function revokeSession(sessionId: string, reason: string, now: Date = new Date()): Promise<void> {
  await query(
    `UPDATE auth_sessions SET revoked_at=$2, revoked_reason=$3 WHERE id=$1 AND revoked_at IS NULL`,
    [sessionId, now, reason],
  );
}

/**
 * Revoke a user's sessions (optionally sparing one). Also clears the legacy
 * single refresh-token column so any pre-migration token that was never
 * exchanged dies with them.
 */
export async function revokeUserSessions(
  userId: string,
  reason: string,
  opts: { exceptSessionId?: string | null; client?: PoolClient; now?: Date } = {},
): Promise<void> {
  const now = opts.now ?? new Date();
  const run = opts.client ? opts.client.query.bind(opts.client) : query;
  await run(
    `UPDATE auth_sessions SET revoked_at=$2, revoked_reason=$3
      WHERE user_id=$1 AND revoked_at IS NULL AND ($4::uuid IS NULL OR id <> $4::uuid)`,
    [userId, now, reason, opts.exceptSessionId ?? null],
  );
  await run('UPDATE users SET refresh_token=NULL WHERE id=$1', [userId]);
}

/** Has this device id completed a sign-in for any of these accounts recently? */
export async function isKnownDevice(userIds: string[], deviceId: string | null, now: Date = new Date()): Promise<boolean> {
  if (!deviceId || userIds.length === 0) return false;
  const since = new Date(now.getTime() - LOGIN_THROTTLE_POLICY.knownDeviceMemoryDays * 86_400_000);
  const { rows } = await query(
    `SELECT 1 FROM auth_sessions WHERE user_id = ANY($1::uuid[]) AND device_id=$2 AND created_at > $3 LIMIT 1`,
    [userIds, deviceId, since],
  );
  return rows.length > 0;
}

export async function findLegacySession(legacySha: string) {
  const { rows } = await query(
    `SELECT id, user_id, revoked_at, expires_at FROM auth_sessions WHERE legacy_refresh_sha=$1`,
    [legacySha],
  );
  return rows[0] ?? null;
}

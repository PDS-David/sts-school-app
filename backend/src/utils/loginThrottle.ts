import { createHash } from 'node:crypto';
import type { PoolClient } from 'pg';
import { query, withTransaction } from '../db/pool.js';

/**
 * Layered login throttling.
 *
 * A device identifier is a risk signal, never proof of identity, so NO lane is
 * ever exempt. Protection is layered:
 *
 *  1. Device lane  (account + device id, or account + IP when the client sent
 *                   none): 5 attempts, then escalating locks 1/5/15/60 min.
 *  2. IP lane      (account + IP): same schedule with 10 free attempts, so one
 *                   school NAT is not locked by a few typos.
 *  3. Account pace (all devices): once an account sees too many recent
 *                   attempts, further attempts are PACED (not blocked). Devices
 *                   with a prior successful sign-in use a separate "known"
 *                   budget from never-seen devices, so an attacker burning the
 *                   unknown budget cannot freeze the owner's own phone.
 *  4. Per-IP across all accounts: express-rate-limit in routes/auth.ts
 *                   (failures only).
 *
 * Why this does not let an attacker lock the real user out: a lock only ever
 * applies to the attacker's own (account, device) and (account, IP) lanes, and
 * attempts that are denied are NOT recorded, so hammering a locked lane never
 * extends the lock. The one shared resource is the per-account pace gate, and
 * it degrades (one attempt per interval) instead of blocking.
 *
 * Why a legitimate user on a new phone does not need an administrator: a new
 * device starts with an empty device lane and uses the unknown-device budget,
 * which only paces (never blocks) once exhausted; the owner who knows their PIN
 * succeeds on the first attempt as soon as a pace slot is free.
 *
 * Attempts are RESERVED before the PIN is checked (counted pessimistically) so
 * parallel guesses cannot all slip through, and refunded on success.
 *
 * The same code runs for usernames that do not exist (account key is a hash of
 * the typed username), so lockout behaviour never reveals which accounts exist.
 */
export const LOGIN_THROTTLE_POLICY = {
  deviceFreeAttempts: 5,
  ipFreeAttempts: 10,
  lockMinutes: [1, 5, 15, 60] as const,   // 1st lock, 2nd, 3rd, then 60 thereafter
  decayHours: 24,                          // a lane forgets failures after 24h quiet
  accountWindowMinutes: 60,
  unknownDeviceCeilingPerWindow: 30,
  unknownDevicePaceSeconds: 120,
  knownDeviceCeilingPerWindow: 15,
  knownDevicePaceSeconds: 300,
  knownDeviceMemoryDays: 90,
} as const;

const P = LOGIN_THROTTLE_POLICY;

export interface ThrottleInput {
  accountKey: string;
  /** Client-generated device id, or null if absent/invalid. */
  deviceId: string | null;
  ip: string;
  /** True if this device id completed a successful sign-in for this account recently. */
  knownDevice: boolean;
  now?: Date;
}

export type ThrottleDecision =
  | { allowed: true; attemptId: string }
  | { allowed: false; retryAfterSeconds: number; reason: 'device' | 'ip' | 'account_pace' };

const sha = (v: string) => createHash('sha256').update(v).digest('hex');

export function validDeviceId(raw: unknown): string | null {
  return typeof raw === 'string' && /^[A-Za-z0-9_-]{16,64}$/.test(raw) ? raw : null;
}

function lanesFor(input: ThrottleInput) {
  const deviceKey = input.deviceId ? `dev:${input.accountKey}:${sha(input.deviceId)}` : `dev:${input.accountKey}:ip-${sha(input.ip)}`;
  const ipKey = `ip:${input.accountKey}:${sha(input.ip)}`;
  return { deviceKey, ipKey };
}

export function lockMinutesForCount(count: number, freeAttempts: number): number | null {
  if (count < freeAttempts) return null;
  const tier = Math.min(count - freeAttempts, P.lockMinutes.length - 1);
  return P.lockMinutes[tier];
}

interface LaneRow { lane_key: string; fail_count: number; locked_until: Date | null; last_failure_at: Date }

function effective(row: LaneRow | undefined, now: Date): { count: number; lockedUntil: Date | null } {
  if (!row) return { count: 0, lockedUntil: null };
  if (now.getTime() - new Date(row.last_failure_at).getTime() > P.decayHours * 3_600_000) return { count: 0, lockedUntil: null };
  return { count: row.fail_count, lockedUntil: row.locked_until ? new Date(row.locked_until) : null };
}

async function bumpLane(client: PoolClient, laneKey: string, accountKey: string, count: number, free: number, now: Date) {
  const next = count + 1;
  const minutes = lockMinutesForCount(next, free);
  const lockedUntil = minutes ? new Date(now.getTime() + minutes * 60_000) : null;
  await client.query(
    `INSERT INTO auth_login_lanes(lane_key, account_key, fail_count, locked_until, last_failure_at)
     VALUES($1,$2,$3,$4,$5)
     ON CONFLICT (lane_key) DO UPDATE
       SET fail_count=$3, locked_until=$4, last_failure_at=$5`,
    [laneKey, accountKey, next, lockedUntil, now],
  );
}

/** Gate + reserve one attempt. Denied attempts record nothing. */
export async function reserveLoginAttempt(input: ThrottleInput): Promise<ThrottleDecision> {
  const now = input.now ?? new Date();
  const { deviceKey, ipKey } = lanesFor(input);
  const lane = input.knownDevice ? 'known' : 'unknown';
  const ceiling = input.knownDevice ? P.knownDeviceCeilingPerWindow : P.unknownDeviceCeilingPerWindow;
  const paceSeconds = input.knownDevice ? P.knownDevicePaceSeconds : P.unknownDevicePaceSeconds;

  return withTransaction(async (client): Promise<ThrottleDecision> => {
    // Serialises gate+reserve per account only (short critical section; the
    // slow credential check happens afterwards, outside this transaction).
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [input.accountKey]);

    const windowStart = new Date(now.getTime() - P.accountWindowMinutes * 60_000);
    await client.query(
      `DELETE FROM auth_login_attempts WHERE account_key=$1 AND attempted_at < $2`,
      [input.accountKey, new Date(now.getTime() - P.decayHours * 3_600_000)],
    );

    const { rows } = await client.query<LaneRow>(
      `SELECT lane_key, fail_count, locked_until, last_failure_at FROM auth_login_lanes WHERE lane_key = ANY($1::text[])`,
      [[deviceKey, ipKey]],
    );
    const byKey = new Map(rows.map((r) => [r.lane_key, r]));
    const dev = effective(byKey.get(deviceKey), now);
    const ip = effective(byKey.get(ipKey), now);

    const secondsLeft = (until: Date) => Math.max(1, Math.ceil((until.getTime() - now.getTime()) / 1000));
    if (dev.lockedUntil && dev.lockedUntil > now) return { allowed: false, retryAfterSeconds: secondsLeft(dev.lockedUntil), reason: 'device' };
    if (ip.lockedUntil && ip.lockedUntil > now) return { allowed: false, retryAfterSeconds: secondsLeft(ip.lockedUntil), reason: 'ip' };

    const { rows: stat } = await client.query<{ n: string; last: Date | null }>(
      `SELECT count(*)::text AS n, max(attempted_at) AS last
         FROM auth_login_attempts WHERE account_key=$1 AND lane=$2 AND attempted_at > $3`,
      [input.accountKey, lane, windowStart],
    );
    const recent = Number(stat[0]?.n ?? 0);
    if (recent >= ceiling && stat[0]?.last) {
      const elapsed = (now.getTime() - new Date(stat[0].last).getTime()) / 1000;
      if (elapsed < paceSeconds) {
        return { allowed: false, retryAfterSeconds: Math.ceil(paceSeconds - elapsed), reason: 'account_pace' };
      }
    }

    await bumpLane(client, deviceKey, input.accountKey, dev.count, P.deviceFreeAttempts, now);
    await bumpLane(client, ipKey, input.accountKey, ip.count, P.ipFreeAttempts, now);
    const { rows: ins } = await client.query<{ id: string }>(
      `INSERT INTO auth_login_attempts(account_key, lane, attempted_at) VALUES($1,$2,$3) RETURNING id::text`,
      [input.accountKey, lane, now],
    );
    return { allowed: true, attemptId: ins[0].id };
  });
}

/** Correct credential: refund the attempt and clear this device's and IP's lanes. */
export async function recordLoginSuccess(input: ThrottleInput, attemptId: string): Promise<void> {
  const { deviceKey, ipKey } = lanesFor(input);
  await withTransaction(async (client) => {
    await client.query('SELECT pg_advisory_xact_lock(hashtextextended($1, 0))', [input.accountKey]);
    await client.query('DELETE FROM auth_login_attempts WHERE id=$1::bigint', [attemptId]);
    await client.query('DELETE FROM auth_login_lanes WHERE lane_key = ANY($1::text[])', [[deviceKey, ipKey]]);
  });
}

/** Administrator-issued reset / explicit unlock: forget everything for this account. */
export async function clearAccountThrottle(accountKey: string, client?: PoolClient): Promise<void> {
  const run = client ? client.query.bind(client) : query;
  await run('DELETE FROM auth_login_lanes WHERE account_key=$1', [accountKey]);
  await run('DELETE FROM auth_login_attempts WHERE account_key=$1', [accountKey]);
}

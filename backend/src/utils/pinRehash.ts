import { query } from '../db/pool.js';
import { PIN_HASH_VERSION, hashPin } from './pin.js';

/**
 * Transparent upgrade of an existing six-digit PIN from a legacy (unpeppered)
 * bcrypt hash to the approved peppered scheme (see ./pin.ts, version 1).
 *
 * Existing students, parents and teachers already hold six-digit PINs stored as
 * plain bcrypt. They are never asked to change anything. Each time one signs in
 * successfully with the PIN they already have, the server — which has just
 * proved the typed PIN is correct — re-hashes that same PIN with the pepper and
 * replaces the old hash. The PIN itself does not change.
 *
 * Safety properties (all covered by tests/backend-pin-auth.integration.test.mts):
 *  - Called only after a successful, uniquely matched login. A failed
 *    authentication never reaches this module, so a failure can never rehash.
 *  - Best effort and non-throwing. Any problem (missing pepper, database error)
 *    leaves the old, still-valid hash in place and the user signs in as normal.
 *    There is no unpeppered fallback and no failed-attempt is recorded.
 *  - The UPDATE is a compare-and-swap on the exact hash that was verified, so it
 *    cannot overwrite a credential changed concurrently (PIN change, administrator
 *    reset, activation). If the row moved, nothing is written.
 *  - Never applies to temporary credentials (must_set_pin / must_change_pw) or to
 *    administrator roles, whose credential arrangements are unchanged.
 *  - Sessions are not touched; a rehash is not a PIN change.
 *  - The PIN, pepper and hashes are never logged.
 */

export const REHASH_ROLES = ['student', 'parent', 'teacher'] as const;

export type RehashOutcome =
  | 'rehashed' // old hash replaced with the peppered hash
  | 'not_eligible' // nothing to do (already peppered, temporary credential, admin role, not a PIN)
  | 'superseded' // the credential changed concurrently; left exactly as the other writer set it
  | 'unavailable'; // could not rehash (pepper missing, database error); old hash left in place

export interface RehashCandidate {
  id: string;
  role: string;
  password_hash: string | null;
  pin_hash_version: number | null;
  must_set_pin?: boolean | null;
  must_change_pw?: boolean | null;
}

/** Pure eligibility rule. `typed` must be the credential that was just verified. */
export function isRehashEligible(user: RehashCandidate, typed: string): boolean {
  return (
    (REHASH_ROLES as readonly string[]).includes(user.role) &&
    !!user.password_hash &&
    (user.pin_hash_version ?? null) === null &&
    user.must_set_pin !== true &&
    user.must_change_pw !== true &&
    /^\d{6}$/.test(typed)
  );
}

export async function rehashLegacyPinAfterLogin(
  user: RehashCandidate,
  typed: string,
  env: NodeJS.ProcessEnv = process.env,
): Promise<RehashOutcome> {
  if (!isRehashEligible(user, typed)) return 'not_eligible';
  try {
    // Throws PinConfigError when the pepper is missing/short: we then keep the
    // existing hash. We never hash without the pepper.
    const newHash = await hashPin(typed, env);

    // Compare-and-swap. Every condition re-checks the state we verified against,
    // so a concurrent change makes this match zero rows instead of clobbering.
    //
    // pin_set_at is written in the same statement on purpose: the
    // users_enforce_pin_state trigger treats a password_hash write that does not
    // also move pin_set_at as a legacy credential write and would set
    // must_set_pin = TRUE — i.e. force exactly the PIN change this feature exists
    // to avoid. Moving pin_set_at is the same mechanism POST /auth/pin uses.
    const result = await query(
      `UPDATE users
          SET password_hash = $1, pin_hash_version = $2, pin_set_at = clock_timestamp()
        WHERE id = $3
          AND password_hash = $4
          AND pin_hash_version IS NULL
          AND must_set_pin = FALSE
          AND COALESCE(must_change_pw, FALSE) = FALSE
          AND role = ANY($5::text[])`,
      [newHash, PIN_HASH_VERSION, user.id, user.password_hash, [...REHASH_ROLES]],
    );
    if (result.rowCount !== 1) return 'superseded';
    // Our own write replaced the stored hash. Keep the caller's snapshot in step so
    // a later compare-and-swap on "the hash I verified" (session creation at login)
    // matches the row we just wrote and not the one we replaced.
    user.password_hash = newHash;
    user.pin_hash_version = PIN_HASH_VERSION;
    return 'rehashed';
  } catch (error) {
    // Class/code only. Messages from the driver can embed query parameters.
    const e = error as { name?: string; code?: string };
    console.error('[pin] transparent rehash skipped', { reason: e?.code ?? e?.name ?? 'error' });
    return 'unavailable';
  }
}

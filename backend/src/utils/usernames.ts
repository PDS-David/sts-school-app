import { createHash } from 'node:crypto';

/**
 * One normalisation rule for usernames everywhere: login lookup, the duplicate
 * check, and the (held) global unique index all use
 *   lower(btrim(username))
 * in SQL, which is "strip leading/trailing spaces, then lowercase".
 */
export function normalizeUsername(raw: string): string {
  return raw.replace(/^ +| +$/g, '').toLowerCase();
}

/**
 * Throttle key for an account. Derived from the typed username only, never
 * from whether the account exists, so lockout behaviour cannot be used to
 * discover which usernames are real.
 */
export function accountKeyFor(username: string): string {
  return createHash('sha256').update(`acct:${normalizeUsername(username)}`).digest('hex');
}

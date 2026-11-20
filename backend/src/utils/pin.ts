import { createHmac, randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';

/**
 * Six-digit PIN handling.
 *
 * A six-digit PIN has only 1,000,000 possibilities, so a leaked database of
 * plain bcrypt hashes would let anyone recover every PIN offline in seconds.
 * New PIN hashes are therefore bcrypt over HMAC-SHA256(PIN_PEPPER, pin). The
 * pepper lives only in the server environment (Render), never in the database,
 * the repository, logs, or error responses.
 *
 * If PIN_PEPPER is missing or too short we FAIL CLOSED: no PIN can be set or
 * verified. There is no fallback to unpeppered PIN hashing.
 */

export const PIN_HASH_VERSION = 1;
export const PEPPER_MIN_LENGTH = 32;
const BCRYPT_COST = 10;

export class PinConfigError extends Error {
  readonly code = 'PIN_NOT_CONFIGURED';
  constructor() {
    // Deliberately generic: never name the variable or echo its value.
    super('PIN service is not configured');
  }
}

let configWarningLogged = false;

function readPepper(env: NodeJS.ProcessEnv = process.env): string {
  const value = env.PIN_PEPPER;
  if (typeof value !== 'string' || value.trim().length < PEPPER_MIN_LENGTH) {
    if (!configWarningLogged) {
      configWarningLogged = true;
      // The value itself is never logged.
      console.error('[pin] PIN_PEPPER is missing or too short; PIN set/verify is disabled.');
    }
    throw new PinConfigError();
  }
  return value.trim();
}

/** Call once at startup. In production a bad pepper stops the process. */
export function assertPinConfiguredAtStartup(env: NodeJS.ProcessEnv = process.env): void {
  if (env.NODE_ENV === 'production') readPepper(env);
}

export function isPinConfigured(env: NodeJS.ProcessEnv = process.env): boolean {
  try { readPepper(env); return true; } catch { return false; }
}

// ── Validation ───────────────────────────────────────────────────────────────

export type PinCheck = { ok: true } | { ok: false; reason: 'format' | 'trivial'; message: string };

const EXPLICIT_WEAK = new Set(['159753', '147258', '258369', '147369', '123654', '135790', '246810', '112233', '998877', '102030', '010203']);

export function isTrivialPin(pin: string): boolean {
  if (!/^\d{6}$/.test(pin)) return false;
  const d = [...pin].map(Number);
  // one repeated digit: 000000, 111111 …
  if (d.every((x) => x === d[0])) return true;
  // full ascending / descending run, wrapping through 9→0: 123456, 654321, 456789, 890123 …
  const asc = d.every((x, i) => i === 0 || x === (d[i - 1] + 1) % 10);
  const desc = d.every((x, i) => i === 0 || x === (d[i - 1] + 9) % 10);
  if (asc || desc) return true;
  // repeating blocks: 121212, 123123
  if (pin.slice(0, 2).repeat(3) === pin || pin.slice(0, 3).repeat(2) === pin) return true;
  // mirror: 123321
  if (pin === [...pin].reverse().join('')) return true;
  // doubled pairs: 112233
  if (d[0] === d[1] && d[2] === d[3] && d[4] === d[5]) return true;
  return EXPLICIT_WEAK.has(pin);
}

export function checkPin(pin: unknown): PinCheck {
  if (typeof pin !== 'string' || !/^\d{6}$/.test(pin)) {
    return { ok: false, reason: 'format', message: 'Your PIN must be exactly six digits (numbers only).' };
  }
  if (isTrivialPin(pin)) {
    return { ok: false, reason: 'trivial', message: 'That PIN is too easy to guess. Avoid repeated or sequential digits such as 123456 or 000000.' };
  }
  return { ok: true };
}

// ── Hashing ──────────────────────────────────────────────────────────────────

function pepperedInput(pin: string, env: NodeJS.ProcessEnv = process.env): string {
  return createHmac('sha256', readPepper(env)).update(`sts-pin:v${PIN_HASH_VERSION}:${pin}`).digest('base64');
}

/** Hash an already-validated PIN. Throws PinConfigError if the pepper is unusable. */
export async function hashPin(pin: string, env: NodeJS.ProcessEnv = process.env): Promise<string> {
  return bcrypt.hash(pepperedInput(pin, env), BCRYPT_COST);
}

/**
 * Verify a typed credential against a stored hash.
 *  - version 1: six-digit PIN, peppered.
 *  - null/other: legacy credential of any format (plain bcrypt) — kept so
 *    existing accounts, including administrators, keep working unchanged.
 */
export async function verifyCredential(
  typed: string,
  hash: string,
  version: number | null,
  env: NodeJS.ProcessEnv = process.env,
): Promise<boolean> {
  if (version === PIN_HASH_VERSION) {
    if (!/^\d{6}$/.test(typed)) return false;
    return bcrypt.compare(pepperedInput(typed, env), hash);
  }
  return bcrypt.compare(typed, hash);
}

// A real bcrypt hash of a random value, computed once, so the "no such
// account" path costs the same as a wrong credential (no timing oracle).
const DUMMY_HASH = bcrypt.hashSync(`dummy-${randomInt(0, 2 ** 31)}`, BCRYPT_COST);
export async function burnDummyVerification(typed: string): Promise<void> {
  await bcrypt.compare(typed, DUMMY_HASH);
}

// ── Temporary PINs (administrator reset) ─────────────────────────────────────

/** Cryptographically secure six-digit PIN that is never a trivial pattern. */
export function generateTemporaryPin(): string {
  for (;;) {
    const pin = String(randomInt(0, 1_000_000)).padStart(6, '0');
    if (!isTrivialPin(pin)) return pin;
  }
}

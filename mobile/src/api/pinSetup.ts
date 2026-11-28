// Pure PIN-setup helpers (no React Native imports, so they are unit-testable).
//
// Contract: backend `POST /auth/pin` (Prompt 2A, backend/src/routes/auth.ts)
//   request : { current_credential: string, new_pin: string }
//   success : 200 { ok: true }   (this device keeps its session; others are revoked)
//   failure : 400 policy/format, 401 wrong current credential, 403, 429, 503
// Authoritative state: `GET /auth/me` -> { must_set_pin: boolean, ... }
//
// The PIN rules below MIRROR backend/src/utils/pin.ts (checkPin / isTrivialPin)
// so the screen explains a rejection before the round trip. The server remains
// the authority: if the two ever drift, the server's message is shown as sent.
// tests/mobile/pin-setup.test.mts compares this copy against the backend file.

import { PIN_LENGTH, sanitizePin } from './loginForm';

export { PIN_LENGTH, sanitizePin };

// ── Rules (mirror of backend/src/utils/pin.ts) ───────────────────────────────
// Owner policy: exactly six digits, and not the same digit six times
// (000000, 111111 …). Sequential PINs such as 123456 are accepted.

export function isTrivialPin(pin: string): boolean {
  if (!/^\d{6}$/.test(pin)) return false;
  return /^(\d)\1{5}$/.test(pin);
}

export const PIN_FORMAT_MESSAGE = 'Your PIN must be exactly six digits (numbers only).';
export const PIN_TRIVIAL_MESSAGE = 'Your PIN cannot be the same digit six times (for example 000000 or 111111).';

export type PinCheck = { ok: true } | { ok: false; reason: 'format' | 'trivial'; message: string };

export function checkPin(pin: unknown): PinCheck {
  if (typeof pin !== 'string' || !/^\d{6}$/.test(pin)) {
    return { ok: false, reason: 'format', message: PIN_FORMAT_MESSAGE };
  }
  if (isTrivialPin(pin)) return { ok: false, reason: 'trivial', message: PIN_TRIVIAL_MESSAGE };
  return { ok: true };
}

// ── Form validation ──────────────────────────────────────────────────────────

export const CURRENT_CREDENTIAL_MAX_LENGTH = 128; // backend rejects longer
export const CURRENT_CREDENTIAL_REQUIRED_MESSAGE = 'Enter your current PIN or password.';
export const PIN_MISMATCH_MESSAGE = 'The two PINs do not match. Enter the same six digits in both boxes.';
export const PIN_SAME_AS_CURRENT_MESSAGE = 'Choose a new PIN that is different from your current one.';

export type PinSetupField = 'current' | 'pin' | 'confirm';
export interface PinSetupValues { current: string; pin: string; confirm: string }
export interface PinSetupFormError { field: PinSetupField; message: string }

/**
 * Returns the first problem, or null when the form may be submitted. The
 * current credential is passed through untouched (never trimmed or digit-
 * filtered): it may be a legacy password, and the server compares it exactly.
 */
export function validatePinSetupForm(v: PinSetupValues): PinSetupFormError | null {
  if (!v.current || v.current.length > CURRENT_CREDENTIAL_MAX_LENGTH) {
    return { field: 'current', message: CURRENT_CREDENTIAL_REQUIRED_MESSAGE };
  }
  const check = checkPin(v.pin);
  // Cast: without strictNullChecks, `!check.ok` does not narrow the union.
  if (!check.ok) return { field: 'pin', message: (check as { ok: false; message: string }).message };
  if (v.confirm !== v.pin) return { field: 'confirm', message: PIN_MISMATCH_MESSAGE };
  if (v.current === v.pin) return { field: 'pin', message: PIN_SAME_AS_CURRENT_MESSAGE };
  return null;
}

// ── Failure mapping ──────────────────────────────────────────────────────────

/** Exact text the backend sends for a wrong current credential on POST /auth/pin. */
export const PIN_CREDENTIAL_REJECTED_MESSAGE = 'Your current PIN or password is incorrect.';

export const PIN_NETWORK_MESSAGE =
  'Could not reach the server, so your PIN has not been saved. Check your connection (the server can take up to a minute to wake up) and try again.';
export const PIN_GENERIC_FAILURE_MESSAGE = 'We could not save your PIN. Please try again.';
export const PIN_UNAVAILABLE_MESSAGE = 'PIN setup is temporarily unavailable. Please try again shortly.';

export type PinSetupFailureKind = 'network' | 'credential' | 'policy' | 'throttled' | 'unavailable' | 'other';

export function pinSetupFailure(e: any): { kind: PinSetupFailureKind; message: string } {
  const res = e?.response;
  if (!res) return { kind: 'network', message: PIN_NETWORK_MESSAGE };
  const serverMessage = typeof res.data?.error === 'string' && res.data.error ? res.data.error : '';
  switch (res.status) {
    case 400: return { kind: 'policy', message: serverMessage || PIN_GENERIC_FAILURE_MESSAGE };
    case 401:
      return serverMessage === PIN_CREDENTIAL_REJECTED_MESSAGE
        ? { kind: 'credential', message: PIN_CREDENTIAL_REJECTED_MESSAGE }
        : { kind: 'other', message: serverMessage || PIN_GENERIC_FAILURE_MESSAGE };
    case 429: return { kind: 'throttled', message: serverMessage || 'Too many attempts. Please wait a moment and try again.' };
    case 503: return { kind: 'unavailable', message: serverMessage || PIN_UNAVAILABLE_MESSAGE };
    default:  return { kind: 'other', message: serverMessage || PIN_GENERIC_FAILURE_MESSAGE };
  }
}

/**
 * A 401 from POST /auth/pin that says the CURRENT CREDENTIAL is wrong is not an
 * expired access token. The axios layer must not refresh-and-replay it: that
 * would count a second throttle attempt and rotate the session for nothing.
 */
export function isPinCredentialRejection(url: string | undefined, status: number | undefined, data: unknown): boolean {
  if (status !== 401) return false;
  if ((url ?? '').split('?')[0] !== '/auth/pin') return false;
  return (data as any)?.error === PIN_CREDENTIAL_REJECTED_MESSAGE;
}

// ── Submit controller (duplicate-submit guard, validate → post → confirm) ────

export type PinSetupResult =
  | { status: 'busy' }
  | { status: 'invalid'; field: PinSetupField; message: string }
  | { status: 'failed'; kind: PinSetupFailureKind; message: string }
  // The server accepted the PIN. `confirmed` is true only once a fresh read of
  // the server's state says must_set_pin is false.
  | { status: 'saved'; confirmed: boolean };

export interface PinSetupDeps {
  /** POST /auth/pin. Must reject with the axios error on failure. */
  postPin: (body: { current_credential: string; new_pin: string }) => Promise<void>;
  /** GET /auth/me; resolves true only when the server reports must_set_pin === false. */
  confirmSetup: () => Promise<boolean>;
}

export function createPinSetupSubmitter(deps: PinSetupDeps) {
  let inFlight = false;
  let accepted = false; // server returned ok; never post again after this

  const confirm = async (): Promise<PinSetupResult> => {
    let confirmed = false;
    try { confirmed = await deps.confirmSetup(); } catch { confirmed = false; }
    return { status: 'saved', confirmed };
  };

  return {
    get busy() { return inFlight; },
    async submit(values: PinSetupValues): Promise<PinSetupResult> {
      if (inFlight) return { status: 'busy' };
      inFlight = true;
      try {
        // Already accepted by the server: only the confirmation can be retried.
        // Re-posting would fail (the old credential is no longer valid).
        if (accepted) return await confirm();
        const problem = validatePinSetupForm(values);
        if (problem) return { status: 'invalid', ...problem };
        try {
          await deps.postPin({ current_credential: values.current, new_pin: values.pin });
        } catch (e) {
          return { status: 'failed', ...pinSetupFailure(e) };
        }
        accepted = true;
        return await confirm();
      } finally {
        inFlight = false;
      }
    },
  };
}

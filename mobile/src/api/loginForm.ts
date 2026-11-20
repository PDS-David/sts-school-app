// Pure login-form helpers (no React Native imports, so they are unit-testable).
// Contract: backend POST /auth/login (Prompt 2A) — see docs/auth/PROMPT2_PIN_AUTH.md.

export type CredentialMode = 'pin' | 'password';

export const PIN_LENGTH = 6;

/** Keep digits only and cap at six. Used while typing in PIN mode. */
export function sanitizePin(raw: string): string {
  return raw.replace(/\D/g, '').slice(0, PIN_LENGTH);
}

/**
 * Client-side shape check only. The server is the authority on PIN rules
 * (including trivial-PIN rejection) and on which role an account has.
 * Returns an error message, or null when the form may be submitted.
 */
export function validateLoginInput(mode: CredentialMode, username: string, secret: string): string | null {
  if (!username.trim()) return mode === 'pin' ? 'Enter your username and six-digit PIN.' : 'Enter your username and password.';
  if (!secret) return mode === 'pin' ? 'Enter your username and six-digit PIN.' : 'Enter your username and password.';
  if (mode === 'pin' && !new RegExp(`^\\d{${PIN_LENGTH}}$`).test(secret)) return 'Your PIN is exactly six digits.';
  return null;
}

export const GENERIC_LOGIN_FAILURE = 'Incorrect username or PIN.';
export const NETWORK_FAILURE =
  'Could not reach the server — check your connection, or it may just be starting back up after a period of inactivity (can take up to a minute). The first login on a device needs this to succeed; once signed in, you can keep working offline.';

/**
 * Turn a failed login into a message that never reveals whether a username
 * exists. The server already returns one generic 401 for unknown username and
 * wrong credential; for any other 401 we also force the generic text. 403
 * (pending, deactivated, access ended), 429 (throttled) and 503 messages come
 * from the server only after the credential was verified or because of
 * throttling, so they are shown as sent.
 */
export function loginErrorMessage(e: any): string {
  const res = e?.response;
  if (!res) return NETWORK_FAILURE;
  if (res.status === 401) return GENERIC_LOGIN_FAILURE;
  const serverMessage = typeof res.data?.error === 'string' ? res.data.error : '';
  if (res.status === 403 || res.status === 429 || res.status === 503) {
    return serverMessage || GENERIC_LOGIN_FAILURE;
  }
  return GENERIC_LOGIN_FAILURE;
}

/** Device id format accepted by the backend: /^[A-Za-z0-9_-]{16,64}$/ */
export function isValidDeviceId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Za-z0-9_-]{16,64}$/.test(value);
}

/** Random 32-char id. A risk signal for throttling only — never proof of identity. */
export function generateDeviceId(random: () => number = Math.random): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const cryptoObj: any = (globalThis as any).crypto;
  let out = '';
  if (cryptoObj?.getRandomValues) {
    const bytes = new Uint8Array(32);
    cryptoObj.getRandomValues(bytes);
    for (const b of bytes) out += alphabet[b % alphabet.length];
  } else {
    for (let i = 0; i < 32; i++) out += alphabet[Math.floor(random() * alphabet.length)];
  }
  return out;
}

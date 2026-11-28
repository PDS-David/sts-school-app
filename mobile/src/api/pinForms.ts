// Pure helpers shared by every screen where a student, parent or teacher
// CHOOSES a six-digit PIN outside the signed-in PIN screen: account activation,
// student self-claim and self-registration. No React Native imports, so they
// are unit-testable (tests/mobile/pin-forms.test.mts).
//
// The rule itself lives in ./pinSetup.ts (checkPin), which mirrors
// backend/src/utils/pin.ts: exactly six digits, not the same digit six times.
// Administrator passwords are a separate, stronger rule and never pass through
// the PIN helpers.

import { checkPin, PIN_MISMATCH_MESSAGE, sanitizePin } from './pinSetup';

export { sanitizePin };

/** Roles that hold a six-digit PIN (mirrors PIN_ROLES in the backend). */
export const PIN_ROLES = ['student', 'parent', 'teacher'] as const;

export const ADMIN_PASSWORD_MIN_LENGTH = 8;
export const ADMIN_PASSWORD_LENGTH_MESSAGE = 'New password must be at least 8 characters';
export const PASSWORD_MISMATCH_MESSAGE = 'Passwords do not match';

/** Validate a new PIN and its confirmation. Returns an error message or null. */
export function validateNewPinPair(pin: string, confirm: string): string | null {
  const check = checkPin(pin);
  if (!check.ok) return (check as { ok: false; message: string }).message;
  if (confirm !== pin) return PIN_MISMATCH_MESSAGE;
  return null;
}

/**
 * Activation is used by students/parents (six-digit PIN) and by administrator
 * accounts (password). The app cannot know the role before activation, so the
 * person picks which one they are; the server applies the rule for the
 * account's real role regardless.
 */
export type ActivationMode = 'pin' | 'password';

export function validateActivationSecret(mode: ActivationMode, secret: string, confirm: string): string | null {
  if (mode === 'pin') return validateNewPinPair(secret, confirm);
  if (secret.length < ADMIN_PASSWORD_MIN_LENGTH) return ADMIN_PASSWORD_LENGTH_MESSAGE;
  if (confirm !== secret) return PASSWORD_MISMATCH_MESSAGE;
  return null;
}

/** Request body for POST /auth/activate. */
export function activationBody(mode: ActivationMode, username: string, code: string, secret: string) {
  return mode === 'pin'
    ? { username: username.trim(), activation_code: code.trim(), new_pin: secret }
    : { username: username.trim(), activation_code: code.trim(), new_password: secret };
}

/**
 * Success dialog after an administrator creates a teacher. The teacher account
 * is created with a normal six-digit PIN (no forced PIN setup): they sign in
 * with it and reach the dashboard, and may change it later from More. This text
 * must never promise a forced setup screen (tests/mobile/pin-forms.test.mts).
 */
export function teacherAccountCreatedMessage(username: string | undefined, pin: string): string {
  return `Username: ${username}\nSix-digit PIN: ${pin}\n\nShare this PIN with the teacher privately. They sign in with it on the PIN tab and go straight to their dashboard. They can change it later from More.`;
}

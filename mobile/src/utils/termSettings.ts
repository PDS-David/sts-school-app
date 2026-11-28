/**
 * Client-side mirror of backend/src/utils/termSettings.ts. The server is the
 * authority; this exists so the teacher gets the same verdict before a
 * request is sent. KEEP IN SYNC — tests/term-settings-validation.test.mts
 * runs one shared vector table through both copies.
 *
 * next_term_begins is a free-text label (e.g. "Monday, 12th January"), not a
 * DATE column, so this validates "safe non-blank label" and never reformats.
 */
export const NEXT_TERM_BEGINS_MAX_LENGTH = 120;
export const DAYS_OPENED_MAX = 2_147_483_647;

export type NextTermBeginsResult =
  | { ok: true; value: string | null }
  | { ok: false; error: string };

export function normalizeNextTermBegins(input: unknown): NextTermBeginsResult {
  if (input === null) return { ok: true, value: null };
  if (typeof input !== 'string') {
    return { ok: false, error: 'next_term_begins must be text, or null to clear it.' };
  }
  const trimmed = input.trim();
  if (trimmed === '') return { ok: true, value: null };
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) {
    return { ok: false, error: 'next_term_begins cannot contain control characters or line breaks.' };
  }
  if (trimmed.length > NEXT_TERM_BEGINS_MAX_LENGTH) {
    return { ok: false, error: `next_term_begins must be at most ${NEXT_TERM_BEGINS_MAX_LENGTH} characters.` };
  }
  if (!/[\p{L}\p{N}]/u.test(trimmed)) {
    return { ok: false, error: 'next_term_begins must contain a date or description, not just symbols.' };
  }
  return { ok: true, value: trimmed };
}

export function validateDaysOpenedValue(value: unknown): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) {
    return 'days_opened must be a whole number';
  }
  if (value < 0) return 'days_opened cannot be negative';
  if (value > DAYS_OPENED_MAX) return 'days_opened is too large';
  return null;
}

/**
 * Parse the days-opened text box. Returns the number, or an error message.
 * A blank box is an error here because days_opened cannot be cleared; callers
 * only invoke this for a field the user actually edited.
 */
export function parseDaysOpenedInput(text: string): { ok: true; value: number } | { ok: false; error: string } {
  const trimmed = text.trim();
  if (!trimmed) return { ok: false, error: 'Days school opened cannot be blank. Enter a whole number or restore the previous value.' };
  if (!/^\d+$/.test(trimmed)) return { ok: false, error: 'Days school opened must be a non-negative whole number.' };
  const value = Number(trimmed);
  const error = validateDaysOpenedValue(value);
  return error ? { ok: false, error: 'Days school opened must be a non-negative whole number.' } : { ok: true, value };
}

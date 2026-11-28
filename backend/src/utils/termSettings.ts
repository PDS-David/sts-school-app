/**
 * Shared validation for the teacher-editable term settings.
 *
 * `terms.next_term_begins` is a free-text TEXT column, not a DATE: every
 * existing client (AttendanceScreen, the admin term form, MyResultsScreen,
 * report templates) treats it as a display label such as "Monday, 12th
 * January" or "14th January 2025", and the first-term importers store NULL.
 * Forcing an ISO date would break previously saved labels and the report
 * wording, so the rule here is "safe, non-blank label", not "parseable date".
 *
 * KEEP IN SYNC with mobile/src/utils/termSettings.ts (same rules, same
 * limits). tests/term-settings-validation.test.mts runs one shared vector
 * table through both copies so they cannot drift apart silently.
 */
export const NEXT_TERM_BEGINS_MAX_LENGTH = 120;
export const DAYS_OPENED_MAX = 2_147_483_647; // terms.days_opened is INT

export type NextTermBeginsResult =
  | { ok: true; value: string | null }
  | { ok: false; error: string };

/**
 * Validate a value the user deliberately submitted for next_term_begins.
 * `null` and blank/whitespace-only strings mean "clear the field".
 * Callers must not call this for a field that was not submitted at all.
 */
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

/** days_opened must be a non-negative whole number that fits the INT column. */
export function validateDaysOpenedValue(value: unknown): string | null {
  if (typeof value !== 'number' || !Number.isFinite(value) || !Number.isInteger(value)) {
    return 'days_opened must be a whole number';
  }
  if (value < 0) return 'days_opened cannot be negative';
  if (value > DAYS_OPENED_MAX) return 'days_opened is too large';
  return null;
}

# Student self-claim retry/recovery checkpoint

**Branch:** `agent/self-claim-retry-recovery-20261116`  
**Base at start:** `32d4d1677e4cd236f05bcb2c4fb4a86022dfaed8` (`master`, 2026-11-16)

## Finding

The public student self-claim flow had no recovery path for transient lookup failures:
- A school-list failure left the first step with no way to retry.
- A class-list failure displayed the class picker with no classes; pressing Next only produced “Select your class”.
- A roster request failure was rendered as “No unclaimed students found”, incorrectly implying a successful empty result and giving no retry action.

## Change

- Separate lookup failures from form-validation errors.
- Add retry controls for school, class, and roster lookups.
- Distinguish a successful empty school/class/roster result from a network/API failure.
- Disable Next until a valid school, class, or student has been selected.

## Verification

- Confirmed the screen's lookup endpoints exist in `backend/src/routes/auth.ts`.
- Mobile TypeScript and Android readiness checks pending after PR creation.
- No account or production data was created or modified.

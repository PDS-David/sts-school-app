# Finance school-switch race fix checkpoint

**Branch:** `agent/finance-school-switch-race-20261116`  
**Base at start:** `32d4d1677e4cd236f05bcb2c4fb4a86022dfaed8` (`master`, 2026-11-16)  
**Scope:** Finance Admin and parent finance screen data-loading correctness.

## Finding

`FinanceScreen.tsx` starts independent invoice and fee-schedule loads whenever the selected ward or school changes. If a user switches campus/ward while an earlier request is still in flight, the earlier response could finish last and overwrite the screen with data for the previous selection. The invoice-options modal had the same race for students and terms. A campus switch while a fee/invoice modal was open could also leave old-campus form state active.

## Change

- Added request identity guards so only the latest finance data load can update invoices, fee items, error state, and loading state.
- Added the same latest-request guard to student/term option loading for new invoices.
- On Finance Admin campus changes, invalidate outstanding option loads, close campus-specific modals, clear stale student/term/fee selections, and dismiss a pending payment confirmation.

## Additional parent cross-campus finding and fix

Parent accounts can have wards in both STS campuses. The prior fee-schedule route always used the parent account's original `users.school_code`, even when the parent selected a ward at the other campus; this disagreed with the cross-campus `parent_wards` model used by invoices. The screen now requests the selected ward's campus. The backend verifies that campus against the parent's active linked wards before returning fee items, and an unfiltered parent request returns only fee items from campuses containing their active wards. A new integration test covers both linked campuses and rejects an unlinked-campus query.

## Verification

- Static review against `backend/src/routes/finance.ts`: invoice creation independently checks that the student, term, fee items, school, and class are compatible.
- Mobile TypeScript CI passed on the initial screen change; backend build and the extended finance integration test are pending after the latest commits.
- No live payment or production database action performed.

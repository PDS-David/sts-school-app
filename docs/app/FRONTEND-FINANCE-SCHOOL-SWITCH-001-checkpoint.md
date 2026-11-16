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

## Verification

- Static review against current `backend/src/routes/finance.ts`: invoice creation independently checks that the student, term, fee items, school, and class are compatible; this frontend change prevents stale campus data from reaching that validation path.
- TypeScript / CI: pending after PR creation.
- No live payment or production database action performed.

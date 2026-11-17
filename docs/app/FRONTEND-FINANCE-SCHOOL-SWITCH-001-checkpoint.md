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

## Additional fee-item validation

The fee-item creation API now validates a nonblank bounded name, a finite positive amount, and a nonblank campus code; it confirms the campus exists before inserting. This prevents malformed fee schedule records and avoids relying solely on mobile-side validation. Integration coverage checks missing campus, zero amount, unknown campus, and a successful normalized insert.

## Verification

- Static review against `backend/src/routes/finance.ts`: invoice creation independently checks that the student, term, fee items, school, and class are compatible.
- Final code head `ac3bd3b1eda77572b1629e189cec93f6e147188b`: PostgreSQL finance invoice integrity regression passed (including parent-campus scoping and fee-item validation); backend typecheck passed.
- Mobile TypeScript, Android readiness/bundle export, SS1 integrity, and SS2/SS3 package checks passed on the same code head. The broader JSS3 implementation/assets check was still running when this checkpoint was refreshed.
- An earlier backend run caught a missing `# Finance school-switch race fix checkpoint

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

## Additional fee-item validation

The fee-item creation API now validates a nonblank bounded name, a finite positive amount, and a nonblank campus code; it confirms the campus exists before inserting. This prevents malformed fee schedule records and avoids relying solely on mobile-side validation. Integration coverage checks missing campus, zero amount, unknown campus, and a successful normalized insert.

## Verification

- Static review against `backend/src/routes/finance.ts`: invoice creation independently checks that the student, term, fee items, school, and class are compatible.
 in the dynamic SQL parameter placeholder; the binding was corrected and the latest PostgreSQL finance regression passed.
- No live payment or production database action performed.

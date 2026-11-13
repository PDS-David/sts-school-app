# FRONTEND-FINANCE-002 — Finance actions and invoice recovery checkpoint

Task ID: FRONTEND-FINANCE-002
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `034b680015635c1eaf4614e1e92ae1618f6d24e2`
Worker branch: `agent/frontend-finance-actions-current-20261113`

## Baseline and ownership checks
- Inspected current master and open finance PRs before editing.
- No open FinanceScreen action-recovery PR was found.
- Read `FinanceScreen.tsx`, the shared API offline outbox and the existing finance routes.
- Existing backend finance_admin-only write access and parent read-only scope were not changed.

## Findings
- Mark-paid success/error and fee-item validation/save feedback used Alert.alert, unreliable on web.
- Mark-paid had no explicit confirmation despite changing a financial record.
- Invoice option retrieval errors used Alert.alert and left an empty student/term picker with no retry.
- Invoice validation and create failures used Alert.alert.
- Finance write endpoints could be placed into the generic offline outbox and return a synthetic queued response. The UI could then report a payment or invoice/fee-item creation as complete before the server had confirmed it.
- Finance admin could open invoice creation without selecting a school.

## Implemented
- Replace native alerts with in-app ConfirmDialog feedback.
- Require explicit confirmation before marking an invoice paid.
- Add separate invoice-option loading/error/retry and disable invoice creation until required options are available.
- Validate fee item name/amount and require a selected school.
- Add duplicate-save guards and loading states for fee item/invoice writes.
- Require school selection before finance-admin invoice setup.
- Exclude fee-item creation, invoice creation and invoice payment-status updates from synthetic offline queueing; financial changes now require a live server response before showing success.
- Preserve parent read-only invoice view and finance_admin write gating.

## Changed files
- `mobile/src/screens/FinanceScreen.tsx`

## Commits
- `b081e520523331b58fb34c0ce52a98f25889497f` — reapply finance action recovery on current master.
- Checkpoint commit: pending.

## Verification
- Static inspection confirms parent remains read-only and finance_admin remains the only write-enabled role.
- Static inspection confirms all FinanceScreen Alert.alert calls were removed.
- Static inspection confirms financial mutations no longer accept synthetic queued responses as completed writes.
- Existing finance endpoints and server-side validation remain unchanged.
- Automated tests, TypeScript and device checks were not run because no local checkout/command execution environment is available.
- No runtime or accounting-readiness claim is made.

- Financial-write offline exclusion was moved to shared API policy PR #760 to avoid overlapping client.ts changes.

## Remaining work
- Verify fee item creation, invoice creation and payment status update for finance_admin.
- Verify parent can only view the selected child's invoices and cannot access write controls.
- Test offline/reconnect behavior for all three financial write endpoints.
- Verify school switcher selection and no-school error states.

## Exact next action
Compare with current `master`, open a focused PR, and continue the remaining finance/admin navigation audit.

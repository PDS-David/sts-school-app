# FRONTEND-CONTRACT-TESTS-001 — Guard role navigation contracts and automate regression checks

Task ID: FRONTEND-CONTRACT-TESTS-001
Status: IMPLEMENTED — awaiting PR CI; tests not yet executed in this turn
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `790cf7f9fb7a26473ea10470a2263459e2e2e960`
Worker branch: `agent/frontend-contract-tests-20261116`

## Finding

The finance administrator role deliberately has no messaging permission and no Chats tab, but NotificationsContext still queried message contacts and assigned any returned message alert to the admin-only `Messages` route. This could create a notification whose destination does not exist for that role.

The frontend also had no automated contract test covering role-specific notification destinations, assessment/results routes, the student Downloads filter, admin per-recipient drafts, or student-specific attendance/score field labels.

## Implemented

- Skip the message-notification feed entirely for `finance_admin`.
- Route message alerts to `Messages` only for `admin`; other supported messaging roles use `ChatThread`.
- Add Node test-runner contract checks for registered message/assessment/results routes and finance-admin exclusion.
- Add contract checks for PDF+DOC Downloads behavior, per-recipient admin message drafts, and student-specific attendance/score labels.
- Add `test:mobile:frontend-contracts` and run it in the existing Android/mobile readiness workflow.

## Changed files

- `mobile/src/components/NotificationsContext.tsx`
- `tests/mobile/frontend-contracts.test.mts`
- `package.json`
- `.github/workflows/mobile-android-readiness.yml`
- `docs/app/FRONTEND-CONTRACT-TESTS-001-checkpoint.md`

## Verification

- Static review confirms finance_admin has no registered Chats/Messages route in `FinanceAdminTabs`.
- Static review confirms all other message target names correspond to registered role-stack screens.
- The contract test command is wired into the Android readiness workflow after offline outbox tests.
- The first test execution is pending PR CI; no pass is claimed.
- No backend permissions, endpoints or user data changed.

## Remaining

- Confirm the new contract suite passes in CI.
- Continue real-device screen-reader and role-account end-to-end testing; source-contract tests do not replace runtime navigation tests.

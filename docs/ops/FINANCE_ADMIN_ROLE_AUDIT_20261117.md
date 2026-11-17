# Finance Admin Role Audit — 2026-11-17

## Scope

Reviewed the finance-admin navigation, Finance screen, backend RBAC map, finance API routes, student/term read scope and messaging routes. This audit is separate from the four-role audit in `APP_WIDE_AUDIT.md`.

## Navigation and permitted operations

`FinanceAdminTabs` exposes the Finance dashboard, Finance screen, Change Password and Security Question Setup. It does not expose admin user management, academic management, student assessment screens, attendance, curriculum editing or the Messages screen.

The Finance screen supports:
- Viewing fee items for a selected school.
- Creating fee items for a valid school.
- Viewing invoices.
- Creating invoices for an active student, a term belonging to the same school and fee items belonging to that same school.
- Updating invoice status among `unpaid`, `partial` and `paid`.

The finance role is intentionally cross-school. The UI uses a school switcher; finance API operations validate the selected school and, during invoice creation, validate the student, term and every fee item against the same school. Student lookup is limited to the basic fields needed for invoice creation; it does not grant finance-admin access to scores or attendance.

The RBAC map grants `finance_admin` `dashboard.read`, `students.read`, `terms.read` and the finance permissions. It does not grant `messages.read`, `messages.write`, `users.manage`, `attendance.write`, `scores.write`, `topics.write` or `assessments.write`.

## Finding: message-read routes did not enforce RBAC

Before this PR:
- `POST /messages` checked `messages.write`.
- `GET /messages/contacts` called `getMessageableUsers`, which returned no contacts for `finance_admin`.
- However, `GET /messages` and `GET /messages/conversation/:other` had no `messages.read` guard. A finance-admin token could call these endpoints directly and read any historical messages involving that account; the conversation endpoint also marked received messages as read.

This contradicted the RBAC map and the Finance Admin navigation's deliberate absence of messaging.

### Fix in this PR

All three read routes now use `requirePerm('messages.read')`. The finance-admin role receives HTTP 403 on inbox, conversation and contacts routes. Student, parent, teacher and admin permissions are unchanged.

Regression tests exercise the actual `requirePerm` middleware and verify finance-admin denial plus allowed roles. A dedicated GitHub Actions workflow runs the test.

## Remaining finance-product limitations

- Invoice payment status is manually updated; no online payment provider, verified payment webhook or automated reconciliation exists.
- Status transitions are limited to `unpaid`, `partial`, `paid`; refund, reversal, void/cancel and immutable payment-event ledger workflows are not implemented.
- Fee items and invoices can be created, but a complete fee schedule versioning, discounts/scholarships, receipts and financial reconciliation workflow has not been evidenced in this audit.
- The current replacement database has zero fee items and invoices and no student records, so end-to-end finance acceptance requires data restoration/seeding and a real finance-admin account.

## Verification status

- Source-level route and permission review: complete.
- Middleware regression tests: added; CI pending on PR.
- Live finance-admin token test against a restored, populated database: not yet possible because the current Render database has no student records and the previous production database is unavailable.
- No production data, role assignment, deployment or database configuration was changed.

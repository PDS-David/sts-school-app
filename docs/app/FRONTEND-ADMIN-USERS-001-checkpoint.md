# FRONTEND-ADMIN-USERS-001 — User management recovery checkpoint

Task ID: FRONTEND-ADMIN-USERS-001
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `034b680015635c1eaf4614e1e92ae1618f6d24e2`
Worker branch: `agent/frontend-admin-users-current-20261113`

## Baseline and ownership checks
- Inspected current master and open admin-user-management PRs before editing.
- No open AdminUsersScreen recovery PR was found.
- Read `AdminUsersScreen.tsx`, the existing admin users and academic school/class/subject endpoints, and current user provisioning response handling.
- No backend user roles, permissions, account provisioning or expiry logic changed.

## Findings
- User list fetch errors were swallowed and rendered as an empty user list.
- School list errors were swallowed, leaving school-linked account forms without options.
- Class/subject prefetch errors were swallowed; teacher account forms could silently omit assignment choices.
- User create/edit had no saving guard, allowing repeated taps to submit duplicate create requests.
- New account form did not locally validate username, school selection or phone format.

## Implemented
- Add user-list error state and retry, retaining last successful users when a later refresh fails.
- Add school-list error and retry, visible both on the list and inside the user form.
- Track per-school class/subject prefetch failures, show retry, and block teacher saves when selected-school lookup data is unavailable.
- Add a saving guard and loading/disabled state to the Save action.
- Validate required username for non-class-teacher new accounts, school selection for school roles, and optional phone number length.
- Preserve existing generated password/activation-code display, role-specific expiry behavior, and server-side validation.

## Changed files
- `mobile/src/screens/AdminUsersScreen.tsx`

## Commits
- `3165082e4113bc9005a53a9edd76137e9fbde462` — reapply the focused implementation on current master.
- Checkpoint commit: `b4ac4ed5be4927dbcb3a0187832a5410cdfd39fa`.

## Verification
- Static inspection confirms school/class/subject lookup calls remain scoped by school_code.
- Static inspection confirms teacher save is blocked when selected-school lookup data is unavailable.
- Static inspection confirms list errors are distinct from empty users and retries are available.
- Existing admin RBAC, user provisioning and role-specific behavior remain unchanged.
- Automated tests, TypeScript and device checks were not run because no local checkout/command execution environment is available.
- No runtime account-management readiness claim is made.

- Account create/update/approval live-response policy is provided by shared API PR #776; merge it before this UI PR.

## Remaining work
- Verify new teacher, subject-only teacher, parent, student, admin and finance_admin creation/edit flows.
- Test school lookup failures and retries, role changes, class/subject assignment and access expiry.
- Verify password reset, activation-code reissue, pending admin approval, deactivate/reactivate and delete failure feedback.

## Exact next action
Compare with current `master`, open a focused PR, and continue auditing academic term/subject management and finance/admin forms.

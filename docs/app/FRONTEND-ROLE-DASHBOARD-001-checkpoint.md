# FRONTEND-ROLE-DASHBOARD-001 — Teacher/admin dashboard recovery checkpoint

Task ID: FRONTEND-ROLE-DASHBOARD-001
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `3e0f985972ad485f60fe5940c8cee60535e774b6`
Worker branch: `agent/frontend-role-dashboard-current-20261113`

## Baseline and ownership checks
- Inspected current master and open teacher/dashboard PRs before editing.
- No open teacher/admin dashboard recovery PR was found; active work in unrelated backend credential-attempt logic does not touch these screens.
- Read `TeacherDashboardHomeScreen.tsx`, `TeacherAnalyticsScreen.tsx`, `AdminDashboardHomeScreen.tsx`, and the existing dashboard endpoints.
- No backend score scope, school selection, backup endpoint or role permission changed.

## Findings
- Teacher dashboard swallowed both current-term and overview failures through a single Promise.all, hiding successful data if only one source failed.
- Teacher analytics swallowed overview failures and left no retry path.
- Admin dashboard swallowed school-summary failures.
- Admin backup status failure returned null, leaving a blank card with no explanation or retry.
- Admin backup confirmation used Alert.alert, which is unreliable on web in this application and made the control appear unresponsive.

## Implemented
- Fetch teacher term and overview independently and show a recoverable partial-data error with retry.
- Add initial and stale-data error recovery to Teacher Analytics.
- Fetch admin student count and current term independently; show retry on partial/total failure.
- Show backup status errors and retry instead of rendering no backup card.
- Replace native Alert backup confirmation with an in-app confirmation panel that works in web/mobile UI.

## Changed files
- `mobile/src/screens/teacher/TeacherDashboardHomeScreen.tsx`
- `mobile/src/screens/teacher/TeacherAnalyticsScreen.tsx`
- `mobile/src/screens/admin/AdminDashboardHomeScreen.tsx`

## Commits
- `019de20a7a713b1eed06a341726b89dfd875511f` — reapply `mobile/src/screens/teacher/TeacherDashboardHomeScreen.tsx` recovery on current master.
- `a89812f1dfeda8c26e0bf03f593c6d4e1532119a` — reapply `mobile/src/screens/teacher/TeacherAnalyticsScreen.tsx` recovery on current master.
- `1a951e8bf34451c40ae3876e06793baad01796a2` — reapply `mobile/src/screens/admin/AdminDashboardHomeScreen.tsx` recovery on current master.
- Checkpoint commit: `4409815145ae4d07aecb4ec8f5fef8decbaf2a2b`.

## Verification
- Static inspection confirms existing role-scoped overview and school-specific endpoints remain in use.
- Static inspection confirms partial teacher/admin data can remain visible while failed sources expose retry.
- Static inspection confirms backup action still calls the existing authenticated endpoint after explicit in-app confirmation.
- No backend, permission or backup recipient behavior changed.
- Automated tests, TypeScript and device checks were not run because no local checkout/command execution environment is available.
- No runtime or device-readiness claim is made.

## Remaining work
- Verify teacher dashboards with independent term/overview failures and recovery.
- Verify admin school switching, backup status errors and web/mobile backup confirmation.
- Continue auditing admin and teacher screens for dead navigation, missing validation and inaccessible controls.

## Exact next action
Open a focused PR from this latest-master branch and continue the cross-role audit.

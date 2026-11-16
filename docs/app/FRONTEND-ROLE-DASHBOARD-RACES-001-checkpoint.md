# FRONTEND-ROLE-DASHBOARD-RACES-001 — Isolate dashboard data by active school/teacher scope

Task ID: FRONTEND-ROLE-DASHBOARD-RACES-001
Status: IMPLEMENTED — awaiting PR CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Worker branch: `agent/frontend-role-dashboard-races-20261116`

## Findings

- Admin dashboard requests student counts and current-term details for the selected school, but a slow response for the previous school could overwrite the current school's header after a switch.
- The admin dashboard also retained the previous school's values while the new school's requests were pending.
- Teacher dashboard requests term and marking analytics independently, but a delayed response could update the dashboard after the teacher's authenticated school/class scope changed. Old summary values also remained visible during the scope transition.

## Implemented

- Add monotonically increasing request generations to both dashboards.
- Ignore stale success, error and loading-state updates after a newer request or effect cleanup.
- Clear school-specific admin summary values and show loading while a different school is being loaded.
- Derive teacher request identity from user, school and assigned-class scope; clear the previous scope's term/analytics before loading the new scope.
- Preserve independent partial-data behavior and existing retry controls.

## Changed files

- `mobile/src/screens/admin/AdminDashboardHomeScreen.tsx`
- `mobile/src/screens/teacher/TeacherDashboardHomeScreen.tsx`

## Verification

- Static review confirms admin requests retain the selected school query parameter.
- Static review confirms teacher analytics still uses the existing authenticated teacher overview endpoint.
- Static review confirms every result/error/final loading update is guarded by the active request generation.
- No backend endpoints, permissions or analytics calculations changed.
- TypeScript, automated, browser and device checks are pending PR CI/runtime access; no pass is claimed.

## Remaining

- Switch the admin school selector while delaying the prior school's student/term responses; verify only the new school's values display.
- Change teacher school/class assignment while requests are pending; verify stale analytics are discarded.
- Verify independent partial-failure and retry behavior for both roles.

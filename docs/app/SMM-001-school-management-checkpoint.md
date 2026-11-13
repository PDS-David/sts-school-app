# School-management feature completion checkpoint

Task ID: SMM-001
Status: IN PROGRESS — announcement dashboard integration implemented; broader feature work remains
Base branch: master
Base commit: 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26
Worker branch: agent/school-management-feature-completion-20261113

## Baseline findings (verified against master)

- Announcements are already implemented end-to-end: `backend/schema.sql` contains the announcements model; `backend/src/routes/announcements.ts` implements authenticated, school/class/role-scoped reads and admin-only validated create/delete; `backend/src/index.ts` mounts the route; `mobile/src/components/NotificationsContext.tsx` fetches announcements; `NotificationsScreen.tsx` renders them. Do not duplicate this feature. Remaining work: inspect schema and tests, then add/verify missing coverage or fix demonstrated defects only.
- Assessment essay review backlog exists in `backend/src/routes/learning.ts`. It computes `pending_review_count` for `ai_graded` and `ai_unavailable` answers and returns it in the admin results/submissions routes. Current RBAC intentionally withholds `aiResults.read` and `aiGrading.override` from teachers. Do not expose essay answers or provisional AI grades to teachers. Determine a safe aggregate-only teacher marking indicator if it matches the intended workflow.
- Teacher analytics, calendar, student badges, and parent upcoming tests/events are absent from current teacher/parent/student navigation or are documented as placeholders in `docs/app/remaining-20261030/app/PRD-02-placeholders.md`. Existing archived redesign notes are stale and must not be treated as source of truth.
- Existing product-gap documentation `docs/app/remaining-20261030/README.md` records owner decisions D8 (announcements yes, read-only) and D9 (remove placeholders unless individually approved for build). This assignment explicitly requests the named features, so implementation should follow the requested scope without resurrecting unrelated placeholders.
- Existing open PRs #682, #683, #684 do not touch the requested school-management features. Historical branches `app/prd-01-announcements` and `app/asm-04-marking-backlog` are 3,827+ commits behind current master and are not safe bases.

## Changed files
- `mobile/src/screens/student/StudentHomeScreen.tsx` — replaced the hard-coded empty announcements card with the latest three announcement items from the already-scoped notification feed; pull-to-refresh refreshes the feed.
- `mobile/src/screens/parent/ParentHomeScreen.tsx` — same for parent dashboard; the backend's parent/ward scoping remains authoritative.
- This checkpoint file.

## Commits
- `b30835c24ff2de7c2fbb1e149d8c6165133f4e2a` — initial durable checkpoint.
- `9b74a964985cc4bab131e626fdf9ca5bdaa07c3a` — student dashboard announcement integration.
- `59761d8ee5e95430e443f1a59a1fdc3d992701f8` — parent dashboard announcement integration.

## Tests
- No automated tests/typecheck run: this session has GitHub repository write/read access but no local checkout or command execution environment for this repository.
- Static verification: both dashboards consume `useNotifications()`; the existing provider fetches `/announcements`, and the backend endpoint scopes student/parent announcements to their own active student/ward rows. No permissions or backend query were widened.

## Remaining work
1. Inspect current schema, route permissions, mobile navigators and feature-specific tests before changing each feature.
2. Implement calendar/school events, parent upcoming tests/events, student badges/achievements, teacher analytics, and a safe teacher marking-backlog summary as separate coherent units.
3. For each unit, add schema migration-safe changes, API validation and scope enforcement, frontend integration, and tests; run available typecheck/test commands where execution access exists.
4. Update evidence and open focused PRs; do not claim runtime/device verification without it.

## Exact next action
Open a focused PR for the dashboard announcement integration. Then inspect and implement the parent-scoped upcoming-assessment/event path and calendar data model as a separate unit. Preserve the existing rule that teachers cannot access AI-generated essay marks; any teacher backlog metric must be aggregate-only and separately permissioned.

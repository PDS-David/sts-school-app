# School-management feature completion checkpoint

Task ID: SMM-001
Status: IN PROGRESS — baseline inspected; implementation not yet started
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
- This checkpoint file only.

## Commits
- Initial checkpoint commit: pending.

## Tests
- No tests run yet. Repository inspection used GitHub's current master file contents and commit/PR metadata; no local checkout or runtime/database was available in this session at checkpoint creation.

## Remaining work
1. Inspect current schema, route permissions, mobile navigators and feature-specific tests before changing each feature.
2. Implement calendar/school events, parent upcoming tests/events, student badges/achievements, teacher analytics, and a safe teacher marking-backlog summary as separate coherent units.
3. For each unit, add schema migration-safe changes, API validation and scope enforcement, frontend integration, and tests; run available typecheck/test commands where execution access exists.
4. Update evidence and open focused PRs; do not claim runtime/device verification without it.

## Exact next action
Inspect `backend/schema.sql`, `backend/src/routes/learning.ts`, `backend/src/utils/rbac.ts`, role navigators and test files for existing calendar/event/achievement/analytics implementations; then select the smallest missing vertical slice and implement it without overlapping other agents.

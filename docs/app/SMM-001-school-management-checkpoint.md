# School-management feature completion checkpoint

Task ID: SMM-001
Status: IMPLEMENTATION SUBMITTED — five focused PRs open; awaiting final CI/review/merge evidence
Base branch: master
Base commit: 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26
Worker branch: agent/school-management-feature-completion-20261113

## Baseline findings (verified against master)

- Announcements are already implemented end-to-end: `backend/schema.sql` contains the announcements model; `backend/src/routes/announcements.ts` implements authenticated, school/class/role-scoped reads and admin-only validated create/delete; `backend/src/index.ts` mounts the route; `mobile/src/components/NotificationsContext.tsx` fetches announcements; `NotificationsScreen.tsx` renders them. Do not duplicate this feature. Remaining work: inspect schema and tests, then add/verify missing coverage or fix demonstrated defects only.
- Assessment essay review backlog exists in `backend/src/routes/learning.ts`. It computes `pending_review_count` for `ai_graded` and `ai_unavailable` answers and returns it in the admin results/submissions routes. Current RBAC intentionally withholds `aiResults.read` and `aiGrading.override` from teachers. Do not expose essay answers or provisional AI grades to teachers. Determine a safe aggregate-only teacher marking indicator if it matches the intended workflow.
- Teacher analytics, calendar, student badges, and parent upcoming tests/events are absent from current teacher/parent/student navigation or are documented as placeholders in `docs/app/remaining-20261030/app/PRD-02-placeholders.md`. Existing archived redesign notes are stale and must not be treated as source of truth.
- Existing product-gap documentation `docs/app/remaining-20261030/README.md` records owner decisions D8 (announcements yes, read-only) and D9 (remove placeholders unless individually approved for build). This assignment explicitly requests the named features, so implementation should follow the requested scope without resurrecting unrelated placeholders.
- Existing open PRs #682, #683, #684 do not touch the requested school-management features. Historical branches `app/prd-01-announcements` and `app/asm-04-marking-backlog` are 3,827+ commits behind current master and are not safe bases.


## Feature implementation PRs (all open; none merged)

- PR #685 — student/parent dashboard announcement integration. Existing announcement schema/API/notification feed reused.
- PR #686 — school calendar/events API and schema, admin event management, parent upcoming tests/events, and student/teacher calendar views.
- PR #688 — teacher pending traditional score-entry counts and analytics. Aggregate-only; no AI essay answers or provisional grades exposed.
- PR #691 — student badges/achievements derived from existing passed-topic and finalized-assessment evidence.
- PR #694 — admin announcement authoring/management UI, completing the existing backend path.

## Additional documented backlog audit

- Term PIN generation/redemption and lesson gating already exist in current master; no duplicate implementation was added.
- Assessment submission transactions already use the existing transaction helper; finance invoice creation also uses a transaction.
- Database TLS certificate validation is already implemented in `backend/src/db/pool.ts`.
- The six PRD-02 navigation placeholders were either already removed from master or have now been replaced by functional screens in the PRs above. The dead student AssessmentResults route is already absent.
- Owner-decision items remain blocked and were not guessed: D1 (whether AI essay suggestions are final or must be teacher-reviewed) and D4 (assessment retake policy). The current request explicitly authorized building the PRD-02 calendar, badges, analytics and upcoming-test features despite the older D9 recommendation to remove placeholders.
- Other operational/data-integrity tasks in the archived backlog (for example migration-ledger, offline idempotency and push-receipt work) are separate from the school-management feature scope and remain for a dedicated pass.

## Changed files
- `mobile/src/screens/student/StudentHomeScreen.tsx` — replaced the hard-coded empty announcements card with the latest three announcement items from the already-scoped notification feed; pull-to-refresh refreshes the feed and shows a distinct error state.
- `mobile/src/components/NotificationsContext.tsx` — retains the last successful announcement feed on refresh failure, exposes load/error state, and guards against stale account-switch responses.
- `mobile/src/screens/parent/ParentHomeScreen.tsx` — same for parent dashboard; the backend's parent/ward scoping remains authoritative.
- This checkpoint file.

## Commits
- `b30835c24ff2de7c2fbb1e149d8c6165133f4e2a` — initial durable checkpoint.
- `9b74a964985cc4bab131e626fdf9ca5bdaa07c3a` — student dashboard announcement integration.
- `59761d8ee5e95430e443f1a59a1fdc3d992701f8` — parent dashboard announcement integration.
- `c8af650ff83ecc547eb3be6db90c9c2cf2bb25c1` — preserve cached announcements and expose refresh error state.
- `c8112748cb277121e478dfe2c8b8271eb3c1f6c3` and `322dd8cf9a417b8c6cfd701b246e609861a8a3a5` — distinguish announcement load errors from an empty feed.
- `9c5946a6e605ce368fe80e3efac55340f3381cd3` and `2a456cee1d121748f880e2efcff55bba8cdbdbed` — keep previously loaded notices visible while showing refresh warnings.

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

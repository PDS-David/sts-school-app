# SMM-002 — Calendar, school events and parent upcoming tests checkpoint

Task ID: SMM-002
Status: IMPLEMENTED IN BRANCH — awaiting CI/PR review; no runtime verification claimed
Base: `agent/ops-01-migration-ledger-20261113` at OPS-01 PR #708 head `7398f32772edf44827a7a960a51632211bfae30c`
Branch: `agent/calendar-parent-upcoming-ops01-20261113` (stacked on OPS-01 PR #708)

## Scope delivered
- Added `school_events` to the replayable PostgreSQL schema with school ownership, event type/audience checks, start/end validation, and calendar indexes.
- Added authenticated `/school-events` API:
  - student and parent reads are derived from active student/ward records, school, class and audience;
  - teacher reads are limited to own school and assigned class plus school-wide events;
  - admin reads are school-bound or cross-school for global admins;
  - create/delete are admin-only, class/school references are validated, date ranges are checked, and writes are audited.
- Added parent-only `GET /learning/parent/upcoming-assessments`, scoped through active linked wards and only published/open assessments; it excludes assessments withdrawn by the existing JSS3/SS1/English/Agricultural Science/Primary 4 correction guards.
- Replaced parent Activities placeholder with upcoming tests, school calendar events and a working link to results.
- Added admin School Calendar management UI to create and delete events.

## Changed files
- `backend/schema.sql` (includes OPS-01 ledger plus school_events fresh schema)
- `backend/migrations/0002_school_events.sql` (new incremental migration)
- `backend/src/routes/schoolEvents.ts` (new)
- `backend/src/index.ts`
- `backend/src/routes/learning.ts`
- `mobile/src/screens/SchoolCalendarScreen.tsx` (new shared student/teacher calendar screen)
- `mobile/src/screens/parent/ParentActivitiesScreen.tsx`
- `mobile/src/screens/admin/AdminSchoolEventsScreen.tsx` (new)
- `mobile/src/screens/admin/AdminMoreScreen.tsx`
- `mobile/src/navigation/AdminTabs.tsx`
- `mobile/src/navigation/TeacherTabs.tsx`
- `mobile/src/navigation/StudentTabs.tsx`
- `mobile/src/screens/teacher/TeacherMoreScreen.tsx`
- `mobile/src/screens/student/StudentProfileScreen.tsx`
- This checkpoint.

## Commits
- OPS-01 migration-ledger base: `7398f32772edf44827a7a960a51632211bfae30c` (PR #708).
- Calendar migration: `2f9d9096130ca4c30528a49d6672f4493494bfea`.
- Latest calendar screen implementation: `028bdde09cb14b03998306ccbc3fbaa5fe92ddb0`.
- Checkpoint copy: `3c97d0b5f0dc31506dfd59af64c2ba69b658d8dd`.

## Verification
- Static checks: confirmed the learning router applies `requireAuth`; event router applies `requireAuth`; event POST/PUT/DELETE use `requireRole('admin')`; class validation checks the same school's `classes` row; schema table and indexes are present.
- The PR is stacked on OPS-01 PR #708; latest CI for this branch is pending. OPS-01's migration runner and this branch's `0002_school_events.sql` must be reviewed together. No live database migration or device test has been run.
- The school_events schema is applied through the new OPS-01 migration runner. Merge PR #708 first, then merge this PR; do not deploy the schema until both are merged and the target DB migration has been run.

## Remaining
- Add route-level tests and run backend/mobile typechecks once a repository execution environment is available.
- Confirm event form UX and permissions on actual admin/parent/student/teacher accounts.
- Continue SMM-001: teacher-safe pending-mark counts, teacher analytics, student badges/achievements, and other unfinished features in repository documentation.

## Exact next action
Open a focused dependent PR for SMM-002 with base branch `agent/ops-01-migration-ledger-20261113`, inspect CI, and wait for PR #708 to merge first. After #708 merges, retarget this PR to `master` and verify migration 0002 is applied only after owner-approved deployment.

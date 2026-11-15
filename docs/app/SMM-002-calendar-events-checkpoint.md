# SMM-002 — Calendar, school events and parent upcoming tests checkpoint

Task ID: SMM-002
Status: IMPLEMENTED ON CURRENT MASTER — PR/CI pending
Base: current `master` includes merged OPS-01 migration ledger PR #737.
Branch: `agent/calendar-master-merged-ops-20261113`

## Scope delivered
- Added `school_events` as numbered migration `0002_school_events.sql` and included matching DDL in the complete fresh-install schema.
- Added authenticated `/school-events` API with active-ward/student, school, class and audience scoping; teacher class scoping; admin-only create/update/delete; validation and audit records.
- Added parent-only `GET /learning/parent/upcoming-assessments`, derived from active linked wards and open/future assessments, preserving existing withdrawal guards and returning metadata only.
- Replaced Parent Activities placeholder with upcoming tests, events and results link. Failed feeds show an error/retry state rather than falsely claiming an empty feed; cached items remain visible after refresh failures.
- Added shared student/teacher calendar screen and admin event create/edit/delete screen with role navigation.

## Changed files
- `backend/migrations/0002_school_events.sql` (new)
- `backend/schema.sql`
- `backend/src/index.ts`
- `backend/src/routes/learning.ts`
- `backend/src/routes/schoolEvents.ts` (new)
- `mobile/src/screens/SchoolCalendarScreen.tsx` (new)
- `mobile/src/screens/admin/AdminSchoolEventsScreen.tsx` (new)
- `mobile/src/screens/parent/ParentActivitiesScreen.tsx`
- `mobile/src/navigation/AdminTabs.tsx`
- `mobile/src/navigation/StudentTabs.tsx`
- `mobile/src/navigation/TeacherTabs.tsx`
- `mobile/src/screens/admin/AdminMoreScreen.tsx`
- `mobile/src/screens/student/StudentProfileScreen.tsx`
- `mobile/src/screens/teacher/TeacherMoreScreen.tsx`
- This checkpoint.

## Verification
- Previous iteration CI run `43455712697` passed TypeScript, static regressions, PostgreSQL schema replay and migration-ledger tests for `0002_school_events.sql`.
- This latest-master rebased branch requires a fresh full CI run.
- No feature-specific route authorization tests or device acceptance have been run. No production database was changed.

## Remaining
- Run full CI on this rebased PR.
- Add route tests for ward scoping, teacher class scoping, school-admin isolation, global-admin behavior and date validation.
- Test event create/edit/delete and calendar access on actual role accounts/devices.
- Do not deploy before migration `0002` is applied to the target database.

## Exact next action
Open a focused PR against master, run the full workflow and fix any failures. OPS-01 is already merged; this PR can now merge independently once its checks pass.

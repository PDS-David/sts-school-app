# SMM-002 — Calendar, school events and parent upcoming tests checkpoint

Task ID: SMM-002
Status: IMPLEMENTED — stacked behind current-master OPS-01 PR #737
Base: `agent/ops-01-rebased-20261113` (OPS-01 PR #737)
Branch: `agent/calendar-rebased-20261113`

## Scope delivered
- Added `school_events` as numbered migration `0002_school_events.sql` and included matching DDL in the complete fresh-install schema.
- Added authenticated `/school-events` API with active-ward/student, school, class and audience scoping; teacher class scoping; admin-only create/update/delete; validation and audit records.
- Added parent-only `GET /learning/parent/upcoming-assessments`, derived from active linked wards and open/future assessments, with existing withdrawal guards and metadata-only responses.
- Replaced Parent Activities placeholder with upcoming tests, events and results link. Failed feeds now show a retry/error state rather than falsely claiming an empty feed; cached items remain visible after refresh failures.
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
- Static review confirms authenticated reads, admin-only event writes, same-school class validation, ward-derived parent/student visibility and metadata-only parent assessment responses.
- The OPS-01 disposable PostgreSQL test checks that migration `0002_school_events.sql` creates the event table when present.
- Combined CI and feature-specific route/device tests are pending. No production database was changed.

## Remaining
- Verify backend/mobile typechecks and PostgreSQL migration replay on the stacked branch.
- Add route tests for ward scoping, teacher class scoping, school-admin isolation, global-admin behavior and date validation.
- Test admin event create/edit/delete and student/parent/teacher calendar access on actual accounts/devices.
- Do not deploy until OPS-01 is merged and migration `0002` is applied to the target database.

## Exact next action
Open a focused PR against OPS-01 PR #737, inspect combined CI, and fix any failures. Merge order: #737 first, then this calendar PR.

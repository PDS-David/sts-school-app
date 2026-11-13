# SMM-002 — Calendar, school events and parent upcoming tests checkpoint

Task ID: SMM-002
Status: IMPLEMENTED ON TOP OF OPS-01 — awaiting stacked CI/review
Base: `agent/ops-01-current-master-20261113` (OPS-01 PR #724; master base `3e0f985972ad485f60fe5940c8cee60535e774b6`)
Branch: `agent/calendar-current-master-20261113`

## Scope delivered
- Added `school_events` as numbered migration `0002_school_events.sql` and included the same DDL in the complete fresh-install `schema.sql`.
- Added authenticated `/school-events` API:
  - student and parent visibility is derived from active student/ward rows, school, class and audience;
  - teacher visibility is limited to own school and assigned class plus school-wide events;
  - admin reads are school-bound or cross-school for global admins;
  - create/update/delete are admin-only, validate school/class references and date ranges, and write audit records.
- Added parent-only `GET /learning/parent/upcoming-assessments`, derived from active linked wards and open/future assessments, excluding assessments withdrawn by existing correction guards. It returns assessment metadata only.
- Replaced Parent Activities placeholder with upcoming tests, school events, and a results link. Failed feeds now show an error/retry state rather than falsely claiming there are no tests/events; cached results remain visible on refresh failure.
- Added shared student/teacher calendar screen and linked it from Student Profile and Teacher More.
- Added admin School Calendar management screen with create/edit/delete and linked it from Admin More.

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

## Commits
- Migration/API/screen/navigation commits are recorded in branch history; latest checkpoint commit will be recorded after this file is added.

## Verification
- Static review confirms authenticated read routes, admin-only event writes, same-school class validation, ward-derived parent/student access and metadata-only parent assessment responses.
- Disposable migration integration suite in OPS-01 checks that `0002_school_events.sql` creates the `school_events` table when present.
- No device test or live school database migration has been run. Stacked CI is pending.

## Remaining
- Run stacked backend/mobile typechecks and PostgreSQL migration replay.
- Add focused route-level tests for parent ward scoping, teacher class scoping, school-admin isolation, global-admin behavior and date validation.
- Test admin event creation/edit/deletion and calendar navigation on real role accounts/devices.
- Do not deploy until OPS-01 is merged and migration `0002` has been applied to the target database.

## Exact next action
Open this PR against the OPS-01 branch (not master), inspect combined CI, and fix any failures. Merge order is OPS-01 PR #724 first, then this calendar PR.

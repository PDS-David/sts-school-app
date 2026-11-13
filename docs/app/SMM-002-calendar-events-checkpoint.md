# SMM-002 — Calendar, school events and parent upcoming tests checkpoint

Task ID: SMM-002
Status: IMPLEMENTED IN BRANCH — awaiting CI/PR review; no runtime verification claimed
Base: `master` at `982c1d2d94e9bfbbb890d027c620b8a16e7f3f26`
Branch: `agent/calendar-parent-upcoming-20261113`

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
- `backend/schema.sql`
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
- `b61d5bde90ea140e077d19fd8bbd4ab8cac7c6ba` — schema.
- `a9c84f4afe712d21da62af14382a41f366950fe6` — school events API.
- `ac4d88f93513e6a1a25e247455d7bda97794f243` — API mount.
- `4c54a1f2a9c63078decbce1564afd5eaf0f95ca3` — parent upcoming tests endpoint.
- `b078f9a04df30a45c88fd95c7bdab7959abfb242` — parent activities screen.
- `1b32ffc3dfc77c34449122db2799727da8e166f2` — admin event screen.
- `44d40fcbfab72c4a7c3bd7f085c6cd55e86a331b` — admin menu link.
- `4828a504050c6b8d03049d7521f646a2fcc99ce4` — admin route registration.
- `11b269e9fb02c7a1a8a22931f36fd00144c9aa42` — include school code in event feeds.
- `cf9c456bf271813eb151c601aa5a021891ee1712` — include school code in parent test feed.
- `026d0b3d3fa5df0078229366c47aa55589333d53` — display school for multi-school parent calendars.
- `137834eba22c9488f1bafce266eb953e1f284e33` — reject the unreachable finance-admin audience.
- `f833cbd26d850fb19db1668e44775b00b41af9b1` — remove the finance-admin audience option.
- `928528e655645257df07e748789eaf2a410c4f7d` — enforce subject/school ownership on parent test queries.
- `e335c6a3a7acec65603b01a5b7da0596adb76ff8` — add validated admin event updates.
- `6ae13b4aa20e82e52822f5139670bbc41ad9d3ec` — add event edit controls to the admin screen.
- `8bf9e9214229b7d38a479165dec12b48d3104d54` — clarify edit/create form state and errors.
- `40dd2b84441417716aa7316d1095a6b491fcd94b` — shared calendar screen for students/teachers.
- `ff27c3f9c0afece28bde81a72f5d3bee44a78c6f` and `d4e7c5f84d3c6bff039d2973c97bc092e09c5915` — teacher calendar link and route.
- `f868c9815aaf9278a82fc46bc9904097e7cccc43` and `724c73cc241ccd2dce962639d35c52206bad43d2` — student calendar link and route.

## Verification
- Static checks: confirmed the learning router applies `requireAuth`; event router applies `requireAuth`; event POST/PUT/DELETE use `requireRole('admin')`; class validation checks the same school's `classes` row; schema table and indexes are present.
- No automated test, TypeScript build, database migration, or device test has been run. This session has GitHub connector access but no local repository runtime/command execution.
- The schema change requires the project's existing manual `npm run db:migrate --workspace backend` process against the target database before deployment; do not claim it has been applied.

## Remaining
- Add route-level tests and run backend/mobile typechecks once a repository execution environment is available.
- Confirm event form UX and permissions on actual admin/parent/student/teacher accounts.
- Continue SMM-001: teacher-safe pending-mark counts, teacher analytics, student badges/achievements, and other unfinished features in repository documentation.

## Exact next action
Open a focused PR for SMM-002 and inspect CI. Then design the teacher marking backlog around the existing separation between traditional teacher-entered scores and admin-only AI essay review; do not grant teachers `aiResults.read` or access to essay answers.

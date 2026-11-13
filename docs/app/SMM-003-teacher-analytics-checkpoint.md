# SMM-003 — Teacher marking backlog and analytics checkpoint

Task ID: SMM-003
Status: IMPLEMENTED IN BRANCH — awaiting CI/PR review; no runtime verification claimed
Base: `master` at `982c1d2d94e9bfbbb890d027c620b8a16e7f3f26`
Branch: `agent/teacher-marking-analytics-20261113`

## Scope delivered
- Added `GET /scores/teacher/overview`, protected by the existing `grades.read` permission.
- Calculates expected score-entry slots from active students × in-scope subjects for the current term; missing score rows count as pending marks.
- Returns aggregate-only metrics: student count, expected/entered/pending marks, average score, pass rate, and per-subject counts.
- Attendance and weekly-effort aggregates are returned only for class teachers/admins; subject-only teachers do not receive class-register aggregates.
- Teacher scoping follows the existing score-entry behavior: a class teacher is limited to their assigned class; a subject-only teacher is limited to their assigned subject IDs across their school. Subject rows are explicitly constrained to the same school.
- Added dashboard pending-mark summary and a dedicated Teacher Analytics screen with per-subject marking progress.
- No AI essay answers, AI marks, or admin-only grading permissions were exposed to teachers.

## Changed files
- `backend/src/routes/scores.ts`
- `mobile/src/screens/teacher/TeacherDashboardHomeScreen.tsx`
- `mobile/src/screens/teacher/TeacherAnalyticsScreen.tsx` (new)
- `mobile/src/screens/teacher/TeacherMoreScreen.tsx`
- `mobile/src/navigation/TeacherTabs.tsx`
- This checkpoint.

## Commits
- `6c139381b84666b04445d67579e63d05e4f59058` — aggregate overview endpoint.
- `c620bc6e58592522a23134157a618cb79f0bd299` — dashboard summary.
- `9eaca6b280656771489a7034909f6840178152cd` — score-entry navigation fix.
- `4bc5a3f62d6de145439e87b083fff91266c753ba` — analytics screen.
- `02b4cca051ca2c5425a37800565c842c830dab6e` — More menu.
- `791516fdc05788777751c7f7be3c95197cc7aa65` — route registration.
- `7a61e0919af9df0624ca3f124271e2530fec0a20` — attendance denominator fix.
- `b2f4f325c0b26e3e5eaf3903f9401412bfcb0312` — enforce same-school subject scope.

## Verification
- Static review confirmed the route is behind `requirePerm('grades.read')`; teachers already have that permission.
- The aggregate query is constrained by school, active students, assigned class or assigned subject IDs, and current term.
- Attendance denominator uses the current term's `days_opened`; subject rows are constrained to the teacher's school.
- GitHub Actions run `43445698487` completed successfully for the latest PR head: `verify` passed backend/mobile typechecks, static/focused regressions, PostgreSQL schema replay and existing integration checks. These are repository-wide checks, not feature-specific tests for the new analytics query. No local device test was run.

## Remaining
- Add executable route/query tests and run backend/mobile typechecks when a local runtime is available.
- Confirm the definition of a pending mark (missing score row) against real school data; if the school uses partially entered CA1/CA2/Exam as a distinct incomplete state, the data model needs an explicit completion marker rather than inferring it.
- Continue student badges/achievements and any additional unfinished documented features.

## Exact next action
Open a focused PR and inspect CI. Then design the badges/achievements model from measurable existing events (assessment completion, score milestones, learning topic completion) with anti-duplication rules and a student-only read surface.

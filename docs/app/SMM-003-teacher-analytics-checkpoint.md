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
- Latest implementation commit: `b2f4f325c0b26e3e5eaf3903f9401412bfcb0312`.
- Durable checkpoint commit / branch head at last checkpoint: `e6315de74651d89d34fe491484fc4d84dd51f89c`.

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

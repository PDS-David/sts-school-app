# SMM-003 — Teacher marking backlog and analytics checkpoint

Task ID: SMM-003
Status: IMPLEMENTED ON MASTER — CI/typecheck evidence available; feature-specific SQL test still outstanding
Base: current `master` includes the feature.

## Scope delivered
- Added `GET /scores/teacher/overview`, protected by existing `grades.read`.
- Calculates expected score-entry slots from active students and in-scope subjects for the current term; missing score rows count as pending marks.
- Returns aggregate-only metrics: student count, expected/entered/pending marks, average score, pass rate and per-subject counts.
- Attendance and weekly-effort aggregates are returned only for class teachers/admins; subject-only teachers do not receive class-register aggregates.
- Class teachers are scoped to their assigned class; subject-only teachers are scoped to assigned subject IDs within their own school.
- Added dashboard pending-mark summary and dedicated Teacher Analytics screen with per-subject marking progress.

## Security boundary
- Reuses the existing `grades.read` permission.
- Does not expose student names, individual marks, essay answers, AI-proposed grades or admin-only review endpoints.
- Subject-only teachers do not receive whole-class attendance/weekly-effort aggregates.

## Verification
- Current-master GitHub Actions run `43453221768` passed backend/mobile TypeScript checks, static regressions and PostgreSQL schema replay.
- No feature-specific SQL/permission integration test or physical-device test is recorded for this endpoint. Pending count means a missing score row; partial CA/Exam components are not separately counted.

## Remaining
- Add focused tests for class-teacher scope, subject-only scope, cross-school isolation, expected-slot calculation and pending count.
- Verify dashboard and analytics screen on a teacher account/device.

## Exact next action
Add a focused PostgreSQL route/query test for the overview endpoint without widening teacher permissions.

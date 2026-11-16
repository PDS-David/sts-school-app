# SMM-003 — Teacher marking backlog and analytics checkpoint

Task ID: SMM-003
Status: IMPLEMENTED ON MASTER — feature-specific query integration tests in PR #894

## Scope delivered
- Adds `GET /scores/teacher/overview`, protected by `grades.read`.
- Calculates expected score-entry slots from active students × in-scope subjects for the current term; missing score rows count as pending marks.
- Returns aggregate-only metrics: student count, expected/entered/pending marks, average score, pass rate and per-subject counts.
- Attendance and weekly-effort aggregates are returned only for class teachers/admins; subject-only teachers do not receive class-register aggregates.
- Class teachers are limited to their assigned class; subject-only teachers are limited to assigned subject IDs within their school. Subject rows are constrained to the same school.
- Adds dashboard pending-mark summary and a dedicated Teacher Analytics screen with per-subject marking progress.
- Does not expose AI essay answers, AI marks or admin-only grading permissions.

## Verification
- Implementation is present on current master.
- Earlier repository CI run `43445698487` passed backend/mobile typechecks, static/focused regressions and PostgreSQL checks.
- PR #894 adds database-backed assertions for class-teacher and subject-only expected/marked/pending counts and verifies that subject-only teachers receive no class attendance/effort aggregates. CI is pending.
- No live school-account or device verification has been performed.

## Remaining
- Merge PR #894 after CI passes.
- Confirm with school operations whether a partially entered CA1/CA2/Exam should count as pending; current calculation treats a score row as entered.
- Verify dashboard and analytics navigation with class-teacher and subject-teacher accounts.

## Exact next action
Complete PR #894 CI, then validate the pending-mark definition with the school before rollout.
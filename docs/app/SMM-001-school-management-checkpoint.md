# SMM-001 — School-management feature completion checkpoint

Task ID: SMM-001
Status: IMPLEMENTED ACROSS MASTER + FOUR FOCUSED PRS — awaiting CI/review/merge of remaining PRs
Current PR stack:
1. OPS-01 migration runner — PR #737
2. Calendar/events and parent upcoming tests — PR #740
3. Student badges and achievements — PR #743
4. Admin announcement authoring — PR #744

## Completed on current master
- Existing announcements data/API and notification feed reused rather than duplicated.
- Parent and student dashboards consume the existing authenticated announcement feed; refresh failures preserve cached notices and expose an error state. Parent refresh works even when no ward is selected.
- Teacher marking overview and analytics are implemented: aggregate expected/entered/pending marks, average/pass rate and per-subject progress. Class/subject scoping follows existing permissions; subject-only teachers do not receive whole-class attendance/effort aggregates.
- Existing admin announcement read/write endpoints remain school/class/role scoped.

## Implemented in the open PR stack
- PR #737: versioned migration runner and ledger, immutable baseline, checksum/order validation, safe fresh-install path and disposable PostgreSQL integration tests.
- PR #740: school events schema/API, role/class/school visibility, admin event management, student/teacher calendar and parent upcoming tests.
- PR #743: student-only badges and achievements derived from existing topic completions and fully graded assessment submissions.
- PR #744: admin announcement authoring, role/class/school targeting, expiry and deletion.

## Changed files
The durable per-task checkpoints are:
- `docs/app/remaining-20261030/evidence/OPS-01.md`
- `docs/app/SMM-002-calendar-events-checkpoint.md`
- `docs/app/SMM-003-teacher-analytics-checkpoint.md`
- `docs/app/SMM-004-student-achievements-checkpoint.md`
- `docs/app/SMM-005-announcements-admin-ui-checkpoint.md`

## Verification evidence
- OPS-01 PR #737 GitHub Actions run `43453221768` passed backend/mobile typechecks, static regressions, schema replay and all 3 disposable PostgreSQL migration-ledger integration tests.
- Calendar PR #740 first CI run exposed JSX syntax and duplicate-state defects in Parent Activities. Both were corrected in later commits; fresh combined CI is pending.
- PR #743 and #744 include the same calendar corrections; combined CI is pending.
- No local device acceptance or production database migration has been performed.

## Remaining
- Await and fix the latest combined CI for PRs #740, #743 and #744.
- Add focused API tests for school-event visibility, parent ward scoping, student achievements thresholds and announcement role/class audience behavior.
- Merge in dependency order only after passing checks: #737 → #740 → #743 → #744.
- Apply migrations to any target database only through an owner-approved deployment procedure; do not auto-adopt an existing database.

## Exact next action
Inspect the latest JSS3 verify/typecheck results for PR #744 (the cumulative stack). Fix any failures and update the individual checkpoints with the final run IDs.

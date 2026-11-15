# SMM-001 — School-management feature completion checkpoint

Task ID: SMM-001
Status: PRIMARY FEATURES IMPLEMENTED — current PRs open for calendar, achievements and admin authoring
Current status:
- OPS-01 migration ledger merged to master in PR #737.
- Calendar/events and parent upcoming tests: PR #764.
- Student badges and achievements: PR #766.
- Admin announcement authoring: PR #768.
- Teacher marking overview/analytics and student/parent announcement feed integration are already on master.

## Completed on current master
- Existing school announcements schema/API and notification feed are reused; no duplicate announcements feature.
- Parent and student dashboards consume the authenticated announcement feed. Failed refreshes preserve cached notices and show an error state. Parent refresh also runs when no ward is selected.
- Teacher marking overview/analytics returns aggregate expected/entered/pending marks, average/pass rate and per-subject progress. Class/subject scoping uses existing permissions; subject-only teachers do not receive whole-class attendance/effort aggregates.
- Existing admin announcement reads/writes are school/class/role scoped.
- Versioned PostgreSQL migration runner is merged: numbered migrations, SHA-256 checksums, advisory lock, transactional apply, read-only status, clean-only fresh schema path and disposable PostgreSQL integration tests.

## Implemented in open PRs
- PR #764: migration `0002_school_events.sql`, school events API, admin event management, student/teacher calendar and parent upcoming tests.
- PR #766: student-only achievements endpoint and screen, excluding provisional AI essay grades.
- PR #768: admin announcement authoring, role/class/school targeting, expiry and deletion.

## Durable checkpoints
- `docs/app/remaining-20261030/evidence/OPS-01.md`
- `docs/app/SMM-002-calendar-events-checkpoint.md`
- `docs/app/SMM-003-teacher-analytics-checkpoint.md`
- `docs/app/SMM-004-student-achievements-checkpoint.md`
- `docs/app/SMM-005-announcements-admin-ui-checkpoint.md`

## Verification
- OPS-01 PR #737 passed the backend/mobile typechecks, static regressions, PostgreSQL schema replay and all 3 disposable migration-ledger integration tests (run `43454501343`).
- Calendar PR #764 has passing TypeScript/static/package jobs; the JSS3 verify job is still queued. An earlier iteration's JSX/state defects in Parent Activities were fixed.
- Achievements PR #766 mobile TypeScript passed, but the cumulative JSS3/static and package-integrity jobs are blocked by an unrelated stale Financial Accounting lesson hash in `backend/src/db/ss1/subjects/financial-accounting.json`. That file is under another agent's active work and was not changed.
- Admin announcement PR #768 mobile TypeScript passed; its package-integrity gate is blocked by the same unrelated Financial Accounting hash.
- No physical-device acceptance or production database migration has been performed.

## Remaining
- Complete the latest CI runs for #764, #766 and #768 after the separate Financial Accounting hash issue is resolved by its owner.
- Add focused route tests for school-event visibility, parent ward scoping, student achievement thresholds and announcement role/class audience behavior.
- Test admin event/announcement operations and student/parent/teacher views on actual accounts/devices.
- Merge order: #764 → #766 → #768. OPS-01 is already merged.
- DATA-02 offline replay idempotency and VER-02 manual CI coverage remain additional backlog tasks; owner-gated tasks remain blocked.

## Exact next action
Wait for the active Financial Accounting owner to repair the stale body hash, then rerun the package/JSS3 gates for #766 and #768. Finish route/device acceptance before marking the feature set production-ready.

# SMM-001 — School-management feature completion checkpoint

Task ID: SMM-001
Status: IMPLEMENTED ON MASTER — feature-specific integration coverage in PR #894

## Merged implementation
- OPS-01 migration ledger: PR #737 merged.
- Calendar, school events and parent upcoming tests: PR #764 merged.
- Student badges and achievements: PR #766 merged.
- Admin announcement authoring: PR #768 merged.
- Root test/typecheck scripts: PR #771 merged.
- Teacher marking backlog and analytics, plus student/parent announcement feeds, were already on master.

## Current feature behavior
- Announcements reuse the existing schema, scoped read API and notification feed. Admin authoring supports school/role/class targeting, expiry and deletion.
- Teacher overview returns expected, marked and pending score-entry counts, average/pass rate and per-subject progress. Class teachers are class-scoped; subject-only teachers are subject-scoped and do not receive whole-class attendance/effort aggregates.
- Calendar events use numbered migration 0002, fresh-schema DDL, school/class/audience scoping, admin-only writes and audit records.
- Parents receive upcoming open assessments and school events for their active linked wards; assessment question content is not exposed by the parent summary endpoint.
- Student achievements are derived from passed topic completions and fully graded assessment submissions; provisional AI essay grades are excluded.

## Verification
- Current master commit `209a960ace30a8026e722e71e1b7f727347fef0c` passed SS1 package integrity, SS23 package integrity, SS23 package contract tests and JSS3 implementation/asset checks.
- PR #894 adds real PostgreSQL route integration coverage for events, announcements, parent upcoming tests, achievements and teacher analytics. Its CI is pending at checkpoint time.
- No physical-device acceptance or production migration/deployment has been performed.

## Remaining
- Merge PR #894 after all required CI checks pass.
- Perform role-account/device acceptance for admin, teacher, student and parent screens.
- Confirm migration 0002 is applied through the reviewed deployment process before enabling calendar features in any production database.
- DATA-02 offline replay idempotency and VER-02 manual CI coverage remain separate documented backlog items, outside this school-management feature scope.

## Exact next action
Finish PR #894 CI, repair any test failures without weakening assertions, merge it, then complete the role-account/device acceptance checklist.
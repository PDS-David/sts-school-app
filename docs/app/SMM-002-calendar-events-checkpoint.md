# SMM-002 — Calendar, school events and parent upcoming tests checkpoint

Task ID: SMM-002
Status: IMPLEMENTED AND MERGED — route integration tests merged in PR #894
Merged implementation: PR #764
Migration: `backend/migrations/0002_school_events.sql`

## Scope delivered
- Adds `school_events` as numbered migration 0002 and includes matching DDL in the clean-install schema.
- Adds authenticated `/school-events` API with active student/ward, school, class and audience scoping; teacher class scoping; admin-only create/update/delete; validation and audit records.
- Adds parent-only `GET /learning/parent/upcoming-assessments`, derived from linked non-deleted wards and open/future assessments, returning metadata only.
- Replaces Parent Activities placeholder with upcoming tests, events and results link. Failed feeds show an error/retry state and cached items remain visible after refresh failures.
- Adds shared student/teacher calendar screen and admin event create/edit/delete screen with role navigation.

## Verification
- PR #764 merged on 2026-11-13.
- Current master CI on commit `209a960ace30a8026e722e71e1b7f727347fef0c` passed the package integrity, SS23 contract and JSS3 implementation/asset gates.
- PR #894 adds disposable-PostgreSQL tests for event audience/class/school visibility, admin school isolation, date validation and parent upcoming-test ward scoping. The route suite passed in JSS3 verify run `43941196109`; all five required workflows passed on PR #894 head `434111153ae1aafcfedfa85ae7d6240f48468cb2`. PR #894 merged to master as `554688b372f6b9f1b74adf64dd4fcf817ca690e2`.
- No production database has been migrated and no physical-device acceptance has been performed.

## Remaining
- Verify admin create/edit/delete and student/teacher/parent calendar views on role accounts/devices.
- Apply migration 0002 to each target production database using the reviewed migration procedure; do not assume merge deploys schema automatically.

## Exact next action
Perform staging acceptance for each role, then apply migration 0002 to each production database through the reviewed migration procedure before enabling calendar features.
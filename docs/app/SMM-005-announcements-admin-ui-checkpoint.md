# SMM-005 — Admin announcement authoring checkpoint

Task ID: SMM-005
Status: IMPLEMENTED AND MERGED — role and school-scope tests merged in PR #894
Merged implementation: PR #768

## Scope delivered
- Reuses existing announcement schema, scoped read API, admin-only validated writes, audit logging and notification feed.
- Adds Admin > More authoring/management screen to publish, target by school/role/class, set optional expiry, list notices and delete them.
- Includes `school_code` in admin feed for global-admin cross-school distinction.
- Rejects `finance_admin` as an audience because that role has no matching announcement read path.
- Registers the screen in Admin navigation; no duplicate announcement table or notification mechanism.

## Verification
- PR #768 merged on 2026-11-13; mobile TypeScript passed in run `43457696034`.
- Current master validation on commit `209a960ace30a8026e722e71e1b7f727347fef0c` passed package integrity and curriculum contract gates.
- PR #894 adds DB-backed checks for parent ward/class/audience filtering, unrelated-parent isolation and school-admin/global-admin write scope. The route suite passed in run `43941196109`; all five required workflows passed on PR #894 head `434111153ae1aafcfedfa85ae7d6240f48468cb2`. PR #894 merged to master as `554688b372f6b9f1b74adf64dd4fcf817ca690e2`.
- No physical-device acceptance has been performed.

## Remaining
- Verify publish/delete and audience delivery on actual admin/student/parent/teacher staging accounts.

## Exact next action
Test announcement publishing, deletion and role/class/school audience delivery with role-specific staging accounts.
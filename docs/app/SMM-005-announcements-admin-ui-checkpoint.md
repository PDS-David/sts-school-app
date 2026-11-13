# SMM-005 — Admin announcement authoring checkpoint

Task ID: SMM-005
Status: IMPLEMENTED — stacked behind current-master OPS-01, calendar and achievements
PR base: `master` (this branch includes OPS-01 #737, calendar #740 and achievements #743 before announcements)
Branch: `agent/announcements-admin-ui-rebased-20261113`

## Scope delivered
- Reused existing announcement schema, scoped read API, admin-only validated writes, audit logging and notification feed.
- Added Admin > More authoring/management UI to publish, target by school/role/class, set optional expiry, list notices and delete them.
- Included `school_code` in admin list response for global-admin cross-school distinction.
- Removed `finance_admin` as an accepted audience because it has no matching announcement read path.
- Registered the screen in Admin navigation; no duplicate announcement table or notification mechanism.

## Changed files
- `backend/src/routes/announcements.ts`
- `mobile/src/screens/admin/AdminAnnouncementsScreen.tsx` (new)
- `mobile/src/screens/admin/AdminMoreScreen.tsx`
- `mobile/src/navigation/AdminTabs.tsx`
- This checkpoint.

## Commits
- Backend: `baa1429b6970891d6c51872c0f7b25ed3a874390`.
- Navigation: `42a1eb3e7d120f81677ee23832d0a6ccb89a6445`.
- Admin More link: `5931ad7f97833edc44e79cc32e6cb09b7e56921f`.
- Screen: `eb91e127858e237656a09e23532e0aaa18f324a2`.

## Verification
- Static review confirms admin-only backend writes, school/class validation, future expiry validation and school-bound deletion.
- Client validates title/body/school and future ISO expiry; server validation remains authoritative.
- Combined CI, role-specific API tests and device acceptance are pending.

## Remaining
- Add API tests for global-admin vs school-admin isolation and role/class visibility.
- Verify publish/delete and audience delivery on actual admin/student/parent/teacher accounts.

## Exact next action
Open this PR against achievements PR #743, run combined CI and focused API tests. Merge order: OPS-01 #737, calendar #740, achievements #743, then announcements.

# SMM-005 — Admin announcement authoring checkpoint

Task ID: SMM-005
Status: IMPLEMENTED ON CURRENT MASTER — awaiting CI/review
Branch: `agent/announcements-admin-ui-current-master-20261113`

## Scope delivered
- Audited existing announcements schema, authenticated school/class/role-scoped GET, admin-only validated POST/DELETE, audit entries, route mount and notification-bell integration before adding UI.
- Added missing admin authoring/management interface: publish, target by role/class/school, optional expiry, list published notices and delete.
- Linked the screen from Admin > More.
- Updated admin list data to include `school_code` for global-admin cross-school distinction.
- Removed `finance_admin` from supported announcement audiences because that role has no announcement read path; backend rejects unsupported targets.
- No duplicate announcements table or notification mechanism added.

## Changed files
- `backend/src/routes/announcements.ts`
- `mobile/src/screens/admin/AdminAnnouncementsScreen.tsx` (new)
- `mobile/src/screens/admin/AdminMoreScreen.tsx`
- `mobile/src/navigation/AdminTabs.tsx`
- This checkpoint.

## Commits
- Backend contract: `600bff5c41f811dcf1dd2fe770d70b33999bbf91`.
- Navigation: `1401a0bfe09c8d9f652e18dfd6c71013d3dae5ab`.
- Admin More link: `486a4d402db7c7be973aaa2d1a8d5e637e8665f3`.
- Authoring screen: `ed3cf59e57d87b18165063f60dd5f6695f1e1ad7`.

## Verification
- Static review confirms backend admin-only writes, school/class validation, expiry validation, and school-bound deletion.
- Client validates required title/body/school and future ISO expiry; backend remains authoritative.
- CI, API contract tests and device acceptance are pending.

## Remaining
- Test publish/delete as school-bound and global admins.
- Verify student/parent/teacher audience filters with active ward/class fixtures.
- Add executable announcement route/form contract tests and device acceptance.

## Exact next action
Run CI for this current-master PR, fix failures, and add focused API tests for role/class/school audience visibility and write authorization.

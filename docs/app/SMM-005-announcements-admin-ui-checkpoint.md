# SMM-005 — Admin announcement authoring checkpoint

Task ID: SMM-005
Status: IMPLEMENTED — stacked behind OPS-01, calendar and student achievements
Base: `agent/student-achievements-stacked-20261113` (PR #730)
Branch: `agent/announcements-admin-ui-stacked-20261113`

## Scope delivered
- Reused the existing announcement schema, scoped read API, admin-only validated writes, audit logging and notification feed.
- Added admin authoring UI to publish, target by school/role/class, set optional expiry, list notices and delete them.
- Added `school_code` to the admin list response for global-admin cross-school distinction.
- Removed `finance_admin` as an accepted announcement audience because no matching read path exists.
- Registered the screen under Admin > More; no duplicate announcements table or notification mechanism.

## Changed files
- `backend/src/routes/announcements.ts`
- `mobile/src/screens/admin/AdminAnnouncementsScreen.tsx` (new)
- `mobile/src/screens/admin/AdminMoreScreen.tsx`
- `mobile/src/navigation/AdminTabs.tsx`
- This checkpoint.

## Commits
- Backend: `a6ae515b573c6e5eb8c3102294e344fefdcb6886`.
- Navigation: `cdd90a6e3fc41c8e23d279dd77c4cf872517acfc`.
- Admin More link: `e7d54601ee35bb8fd6b4ebae4c01e5233e514037`.
- Screen: `1bd0e900a348ee173ea00828d319e39c4a7da451`.

## Verification
- Static review confirms backend admin-only writes, school/class validation, future expiry validation and school-bound deletion.
- Client validates title/body/school and future ISO expiry; server validation remains authoritative.
- Combined CI, role-specific publish/delete tests and device acceptance are pending.

## Remaining
- Add API tests for global-admin vs school-admin isolation and role/class visibility.
- Verify publish, edit targeting, expiry and deletion on admin accounts and ensure notices reach only the intended audiences.

## Exact next action
Open a PR against the achievements branch, run combined CI and focused API tests. Merge order: OPS-01 #724, calendar #728, achievements #730, then this announcements PR.

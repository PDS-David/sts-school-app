# SMM-005 — Admin announcement authoring checkpoint

Task ID: SMM-005
Status: IMPLEMENTED — stacked on current-master calendar and achievements
Base: `agent/student-achievements-master-merged-ops-20261113` (PR #766)
Branch: `agent/announcements-admin-ui-master-merged-ops-20261113`

## Scope delivered
- Reused the existing announcement schema, scoped read API, admin-only validated writes, audit logging and notification feed.
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
- Backend: `7ba026137c3a04a8c17d313025bc2ca9d2eb719f`.
- Navigation: `530812502c499ca3c88ca9e7e498faf4946df04b`.
- Admin More link: `9b5cb7d1c9c1b4c46071c1cb792958b5ee28ab19`.
- Screen: `43a2d23a1b1a5ab66893da0907bf1044849b9cbe`.

## Verification
- Static review confirms admin-only backend writes, school/class validation, future expiry validation and school-bound deletion.
- Client validates title/body/school and future ISO expiry; server validation remains authoritative.
- Full CI, role-specific API tests and device acceptance are pending.

## Remaining
- Add API tests for global-admin vs school-admin isolation and role/class visibility.
- Verify publish/delete and audience delivery on actual admin/student/parent/teacher accounts.

## Exact next action
Open this PR against the achievements branch, run full CI and focused API tests. Merge #764, then #766, then this announcements PR.

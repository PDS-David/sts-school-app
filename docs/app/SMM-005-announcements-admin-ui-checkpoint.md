# SMM-005 — Admin announcement authoring checkpoint

Task ID: SMM-005
Status: IMPLEMENTED IN BRANCH — awaiting CI/PR review; no runtime verification claimed
Base: `master` at `982c1d2d94e9bfbbb890d027c620b8a16e7f3f26`
Branch: `agent/announcements-admin-ui-20261113`

## Scope delivered
- Audited the existing announcements implementation before adding anything: schema, authenticated role/class/school-scoped GET, admin-only validated POST/DELETE, audit entries, route mount, and notification-bell integration already exist on master.
- Added the missing admin authoring/management interface: publish, target by role/class/school, optional expiry, list published notices, delete.
- Linked the screen from Admin > More.
- This complements the separate dashboard integration PR #685, which surfaces notices on student and parent home screens. Existing bell feed remains available to every authenticated role.
- No duplicate announcements table, route or notification mechanism was added.

## Changed files
- `mobile/src/screens/admin/AdminAnnouncementsScreen.tsx` (new)
- `mobile/src/screens/admin/AdminMoreScreen.tsx`
- `mobile/src/navigation/AdminTabs.tsx`
- This checkpoint.

## Commits
- `b81a55e93ff97107500353f0917c5d88d7cacd5a` — admin authoring/management screen.
- `e07367166d17ee3bdedebc504384384fab9a72b1` — admin menu.
- `2bac06871bcafd960437eaa7ebeaf490544d0891` — route registration.
- `98c51cbae0ca4868a67fc0a5a4845405b66735e9` — include school code in the admin announcement feed.
- `4a938d5932a3a03d00eef75ba3c69cfbc7f6f5ca` — reject the unreachable finance-admin audience.
- `c2042bf9f3ee0cc7f55571dd74fb1c70038d0021` — remove the unreachable finance-admin option.
- `5461c82848c912970a332c9a4d47b8e5f0add5ab` and `4e1f066392590a591dc6ad38d1a07cf592edf812` — place menu and route additions away from the calendar PR's insertion points.

## Verification
- Static review confirmed existing backend route enforces admin-only writes, validates school and class references, validates future expiry, and limits deletion to the admin's school unless the admin is global.
- New form performs client-side required-field/date checks; server validation remains authoritative. Admin feed includes `school_code` for cross-school distinction. `finance_admin` is not offered as a target because that role intentionally has no announcement read path.
- GitHub Actions `verify` run `43446425202` completed successfully: backend/mobile types, static/focused regressions, PostgreSQL schema replay and existing integration checks all passed. These are repository-wide checks, not feature-specific announcement API tests. No device test was run.

## Remaining
- Test publishing/deleting as a school-bound and global admin, and confirm each audience sees only matching notices.
- Add executable screen/API contract tests and run typechecks when a local runtime is available.
- Continue auditing TODO.md and feature docs for remaining unfinished product functionality.

## Exact next action
Open a focused PR and inspect CI. Then inspect the current feature documentation and TODO inventory for unfinished features not yet covered by the preceding SMM PRs.

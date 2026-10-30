# PRD-02 — Remove or build the six "Coming soon" placeholders

Status: BLOCKED ON OWNER DECISION D9 · Depends: none · Base: `origin/master` (record the SHA)
Writes: `mobile/src/screens/parent/ParentActivitiesScreen.tsx`, `mobile/src/screens/student/StudentProfileScreen.tsx`, `mobile/src/screens/teacher/TeacherMoreScreen.tsx`, the navigators that register them (`mobile/src/navigation/*`), `docs/app/remaining-20261030/evidence/PRD-02.md`

## Why (verified at master `8ffcd12`)

Three screens render inert entries that navigate nowhere:

- `mobile/src/screens/parent/ParentActivitiesScreen.tsx:11-13` — Upcoming Tests, Calendar, School Events with `screen: null` and a "Coming soon" label.
- `mobile/src/screens/student/StudentProfileScreen.tsx:15` — Badges.
- `mobile/src/screens/teacher/TeacherMoreScreen.tsx:14-15` — Analytics, Calendar.

`APP_WIDE_AUDIT.md` also records a dead registration: `AssessmentResultsScreen` is registered in the student stack although that role cannot open it.

These are not broken features; they are promises the app cannot keep. Under decision D9 the recommended default is to remove them from navigation until they exist, rather than ship "Coming soon" indefinitely.

## Do

1. Remove the placeholder entries and any now-unused rows/icons from the three screens. If a screen becomes empty (no remaining rows), remove the screen file and its navigator registration instead of leaving a blank page.
2. Check each navigator for dead routes while you are there: a registration whose only caller was the removed entry must also go. In particular, remove the dead `AssessmentResultsScreen` registration from the student stack, keeping it registered where a role can actually reach it.
3. Keep all working rows untouched (profile, change password, security question, logout, etc.). The diff must not reorder working navigation.
4. If D9 is "build them" for any single item, stop and split that item into its own task: each needs data model, endpoint, permission and screen decisions, which this prompt does not authorise.
5. Evidence note: before/after navigation inventory per role, with the file:line of every removed entry.

## Acceptance (static)

- No "Coming soon" text remains in the three files.
- No navigator entry points at a screen that was deleted.
- Every remaining row navigates to a registered screen.
- No new screen, endpoint, permission or data model.

## Do not

- Build Analytics, Calendar, Badges, School Events or Upcoming Tests.
- Remove working navigation or rename routes that pushes deep-link to (`ChatThread`, `Messages` are used by push payloads — leave them).
- Claim the navigation was exercised on a device.

# FRONTEND-ACADEMIC-001 — Term and subject management checkpoint

Task ID: FRONTEND-ACADEMIC-001
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `034b680015635c1eaf4614e1e92ae1618f6d24e2`
Worker branch: `agent/frontend-academic-setup-current-20261113`

## Baseline and ownership checks
- Inspected current master and open academic setup PRs before editing.
- No open term/subject management recovery PR was found.
- Read `AcademicMgmtScreens.tsx`, the existing selected-school academic APIs and the shared confirmation dialog.
- No backend term/subject route, school isolation, or role permission changed.

## Findings
- Term and subject list failures were swallowed and looked like valid empty lists.
- Switching schools could leave prior-school terms/subjects visible while the next request was pending.
- Term creation accepted malformed dates, invalid date ordering and negative/fractional school-open days.
- Subject and term management used Alert.alert, which is unreliable on web.
- Subject deletion had a confirmation alert but the web implementation could fail to show it; delete errors were also alert-only.
- Set-current term and write refreshes did not await the refreshed list, allowing controls to re-enable before the UI reflected the server state.

## Implemented
- Add distinct term/subject load errors and retry controls; clear old school data before fetching the newly selected school's records.
- Replace native alerts with ConfirmDialog for validation, write errors and subject deletion.
- Validate required term name, academic year and school code.
- Validate days-opened as a non-negative whole number.
- Validate real YYYY-MM-DD calendar dates and ensure end date is not before start date.
- Add save-in-progress protection for term and subject creation.
- Guard concurrent set-current-term requests and await list refresh after successful writes.
- Await subject list refresh after add/delete and prevent overlapping deletes.

## Changed files
- `mobile/src/screens/AcademicMgmtScreens.tsx`

## Commits
- `29dd092e140c49ed281b4701c1e864d70243a12d` — reapply academic setup recovery on current master.
- Checkpoint commit: `1f87011775a0632cce7c4ca117d30718a3c2c27b`.

## Verification
- Static inspection confirms terms and subjects continue to use the selected-school query parameter.
- Static inspection confirms old-school data is cleared before a school change fetch completes.
- Static inspection confirms native Alert.alert references were removed from this screen.
- Static inspection confirms term date validation uses a real calendar date and date ordering.
- No backend, school isolation or role permission changed.
- Automated tests, TypeScript and device checks were not run because no local checkout/command execution environment is available.
- No runtime readiness claim is made.

## Remaining work
- Verify term creation/current-term selection across both schools, including date/day boundaries and failed requests.
- Verify subject creation/deletion for teacher/admin roles and delete-denied cases when records already reference a subject.
- Review offline queue behavior for academic setup writes; UI should not imply a server-confirmed write when a mutation is only queued.

## Exact next action
Compare with current `master`, open a focused PR, and continue the administrator forms and navigation audit.

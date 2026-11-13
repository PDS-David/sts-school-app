# FRONTEND-ACADEMIC-001 — Term and subject management checkpoint

Task ID: FRONTEND-ACADEMIC-001
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `c4a985d8eaad86c837259c900c700ba0f27738ba`
Worker branch: `agent/frontend-academic-setup-recovery-20261113`

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
- `bbdd6619e6718d04868291deb382961a26a8dcd4` — term load recovery and validation.
- `1e663412d9f1f65096adc606bcf43226e424b3b0` — term retry and web-safe dialogs.
- `d2ad27b8f6740ead78f80d651dc9b4f0e0d57aa8` — subject load recovery and web-safe actions.
- `9f6b44fd79f552d024f2abe5434482465801cfee` — clear stale school data and validate calendar dates.
- `a1eb3d0253f1d0cb4467482bf48609e57c777fa4` — await post-write refresh.
- Checkpoint commit: `7524e1bd48499a0ba3935874c85d4ed0319e01df`.

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

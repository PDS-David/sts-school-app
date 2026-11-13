# FRONTEND-PARENT-001 — Parent dashboard recovery checkpoint

Task ID: FRONTEND-PARENT-001
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `03aa60f0f448caed371e8da9a30ff1f91cb0cbf5`
Worker branch: `agent/frontend-parent-dashboard-recovery-20261113`

## Baseline and ownership checks
- Inspected current master and parent-related open PRs before editing.
- PR #710 owns the Parent Activities placeholder replacement and upcoming-tests/calendar feature. This task changes only ParentHomeScreen and does not overlap that work.
- Read `mobile/src/screens/parent/ParentHomeScreen.tsx`, `ParentTabs.tsx`, and the existing ward-scoped score report route usage.
- No backend endpoint, ward access rule, or finance permission changed.

## Findings
- Child report retrieval failures were swallowed and displayed as “No report data yet”, conflating API failure with a valid empty report.
- When the selected ward changed, the previous ward's report could remain visible while the next request was in flight.
- The “Report absence” FAB action only navigated to the generic Chats tab; it did not open an absence-reporting workflow or prefill a message.

## Implemented
- Distinguish report loading, API error and valid no-report states.
- Clear the previous ward's report before loading the newly selected ward to avoid cross-ward stale display.
- Add an explicit retry action for the selected child's report.
- Remove the misleading Report absence action; existing Message teacher and View report actions remain.

## Changed files
- `mobile/src/screens/parent/ParentHomeScreen.tsx`

## Commits
- `c26b77071ee902c39ababf380d5c4c0bf9de61f1` — add parent report recovery and remove misleading action.
- Checkpoint commit: pending.

## Verification
- Static inspection confirms report requests still use the selected ward's existing `/scores/report/:studentId` endpoint.
- Static inspection confirms the previous ward report is cleared before a new ward fetch.
- Static inspection confirms the removed absence action no longer advertises a workflow that does not exist.
- No backend or ward-scope code changed.
- Automated tests, TypeScript and device checks were not run because no local checkout/command execution environment is available.
- No runtime or device-readiness claim is made.

## Remaining work
- Verify switching between multiple linked wards while report requests succeed/fail.
- Verify no-ward, valid-empty-report, offline-cache and retry states on a parent account.
- Parent Activities remains tracked separately under PR #710; merge order depends on migration-ledger PR #708.

## Exact next action
Open a focused PR and continue the role audit with student dashboard loading failures and teacher/admin navigation.

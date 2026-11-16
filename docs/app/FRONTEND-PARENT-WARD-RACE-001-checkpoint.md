# FRONTEND-PARENT-WARD-RACE-001 — Ignore stale child-report responses

Task ID: FRONTEND-PARENT-WARD-RACE-001
Status: IMPLEMENTED — awaiting PR CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Worker branch: `agent/frontend-parent-ward-race-current-20261116`

## Finding

ParentHomeScreen cleared the previous ward's report when a new ward was selected, but the outstanding request for the previous ward could still resolve afterward and overwrite the currently selected child's report or error state. The same race could occur between a retry and an earlier in-flight request. A switch to no selected ward also left an earlier report request free to update state.

## Implemented

- Assign each parent dashboard load a monotonically increasing request generation.
- Ignore success, error and loading-state updates from superseded requests.
- Invalidate outstanding report requests when the effect is cleaned up, including when the selected ward changes or the screen unmounts.
- Clear report-loading state when there is no selected ward.

## Verification

- Static review confirms report success/error/finally updates are guarded by the active request generation.
- Existing ward-scoped `/scores/report/:studentId` endpoint and authorization are unchanged.
- No backend, ward permissions, or report calculation changed.
- Automated TypeScript, unit, browser and device checks are pending PR CI/runtime access; no pass is claimed.

## Remaining

- Verify two linked wards with deliberately reversed response order, failures and retries on a parent account.
- Verify the no-ward state and screen unmount while a report request is pending.

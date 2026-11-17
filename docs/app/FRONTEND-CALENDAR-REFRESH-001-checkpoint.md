# FRONTEND-CALENDAR-REFRESH-001 — Preserve cached calendar data after refresh failures

Task ID: FRONTEND-CALENDAR-REFRESH-001
Status: IMPLEMENTED — awaiting PR CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Worker branch: `agent/frontend-calendar-refresh-recovery-20261116`

## Findings

- Parent Activities reported that it was showing the last available upcoming tests/events after a refresh failure, but the corresponding list was hidden whenever that feed failed.
- The shared School Calendar also retained its last successful event list in state but hid it whenever a refresh failed.
- Overlapping requests could resolve out of order and allow an older response to replace the result of a newer refresh. A response could also update state after screen unmount.

## Implemented

- Keep the last successful tests/events visible when only a refresh fails, alongside a clear warning.
- Keep the last successful School Calendar events visible when refresh fails.
- Preserve distinct error and successful-empty states.
- Add request-generation guards to both screens so stale success/error/loading updates are ignored.
- Invalidate in-flight requests when either screen unmounts.

## Changed files

- `mobile/src/screens/parent/ParentActivitiesScreen.tsx`
- `mobile/src/screens/SchoolCalendarScreen.tsx`

## Verification

- Static review confirms the parent upcoming-assessments and school-events endpoints are unchanged.
- Static review confirms successful empty responses remain distinct from failed feeds.
- Static review confirms only the active request generation can update feed state.
- No backend endpoint, audience scope or permissions changed.
- TypeScript, automated, browser and device checks are pending PR CI/runtime access; no pass is claimed.

## Remaining

- Verify one feed succeeds while the other fails and cached data remains visible.
- Verify both feeds fail initially, then recover on pull-to-refresh.
- Verify reversed response order and screen unmount during refresh.

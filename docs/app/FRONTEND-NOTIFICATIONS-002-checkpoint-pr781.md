# FRONTEND-NOTIFICATIONS-002 — Notification feed recovery checkpoint

Task ID: FRONTEND-NOTIFICATIONS-002
Status: IMPLEMENTED — awaiting PR review and CI; based on current master
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `c4a985d8eaad86c837259c900c700ba0f27738ba`
Worker branch: `agent/frontend-notification-recovery-current-20261113`

## Coordination
- Rebased the notification recovery onto current master after reviewing the intervening notification-context changes.
- Preserved master’s user-switch reset, last-successful announcement cache and refresh-generation stale-response protection.
- Kept changes additive: partial-feed errors and read-state exposure were layered onto the current provider rather than replacing its newer logic.

## Findings
- Assessment and message feed failures were swallowed; users could see an apparently complete feed even when sources failed.
- Notification screen lacked retry, loading feedback, unread count and per-item read-state feedback.

## Implemented
- Track failed source names for assessment, messages and announcements independently.
- Expose feedErrors and readIds through the shared context.
- Preserve existing announcement fallback/cache and unread state.
- Add retry/refresh and partial-source error UI to NotificationsScreen.
- Disable Mark all read when no unread notifications remain.

## Changed files
- `mobile/src/components/NotificationsContext.tsx`
- `mobile/src/screens/NotificationsScreen.tsx`

## Commits
- `6c1d1af13250519107cba4b14c68ce5da5ca3ca7` — add partial feed failure tracking to current provider.
- `9954a53c220a0ee6770b7db3c2b45b769fc89497` — add retry and unread UI on current screen.
- Checkpoint commit: `a9fca6d471dc2e2ad9f0fd8973145e4d26139ec4`.

## Verification
- Static inspection confirms account-switch resets, refresh-generation protection and last-successful announcement fallback from master remain.
- Static inspection confirms each source error is independently surfaced and retry calls the existing refresh routine.
- No backend notification route or permission changed.
- Automated tests and TypeScript remain pending CI; no runtime claim is made.

## Exact next action
Compare against current master, open refreshed PR, and close the stale predecessor after verifying the new diff.

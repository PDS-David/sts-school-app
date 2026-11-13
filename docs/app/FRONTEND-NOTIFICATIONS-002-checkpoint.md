# FRONTEND-NOTIFICATIONS-002 — Notification feed recovery checkpoint

Task ID: FRONTEND-NOTIFICATIONS-002
Status: IMPLEMENTED — awaiting PR review and CI; rebased onto current master
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `034b680015635c1eaf4614e1e92ae1618f6d24e2`
Worker branch: `agent/frontend-notification-current-20261113`

## Coordination
- Rebased the notification recovery onto current master after checking intervening changes.
- Preserved master’s account-switch reset, announcement cache and stale-response generation protection.
- The current master had no changes to the two notification files; the previous PR was stale only because unrelated repository work had advanced master.

## Implemented
- Track assessment, message and announcement source failures independently.
- Expose `feedErrors` and `readIds` through the shared context.
- Preserve last-successful announcement fallback and existing unread-state behavior.
- Add refresh/retry and partial-source error feedback to NotificationsScreen.
- Disable Mark all read when there are no unread notifications.

## Changed files
- `mobile/src/components/NotificationsContext.tsx`
- `mobile/src/screens/NotificationsScreen.tsx`

## Commits
- `8e4c6421870003e139d7332103b5f461ba43427d` — carry notification feed recovery onto current master in `mobile/src/components/NotificationsContext.tsx`.
- `60f538b39c165f6a8d6b8e173d73e8b4fca00096` — carry notification feed recovery onto current master in `mobile/src/screens/NotificationsScreen.tsx`.
- Checkpoint commit: pending.

## Verification
- Static inspection confirms existing user-switch resets, refresh-generation protection and announcement fallback remain.
- Static inspection confirms retries reissue the existing refresh routine.
- No backend notification routes or permissions changed.
- Automated tests and TypeScript remain pending CI; no runtime claim is made.

## Exact next action
Open a focused PR from current master and close the stale predecessor after confirming the refreshed diff.

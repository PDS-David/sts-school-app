# FRONTEND-NOTIFICATIONS-002 — Notification feed recovery checkpoint

Task ID: FRONTEND-NOTIFICATIONS-002
Status: IMPLEMENTED — awaiting PR review and CI; rebased onto current master
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `22c7ed5c1cbdc24ca1ddc83a425096133a1f4136`
Worker branch: `agent/frontend-notification-recovery-latest2-20261113`

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
- `b22e27c11147ce432663f5474c38a60b659867cd` — refresh notification recovery in `mobile/src/components/NotificationsContext.tsx` on latest master.
- `e39919c435d1aa5e2e11028a9d84fc11ccf29aa5` — refresh notification recovery in `mobile/src/screens/NotificationsScreen.tsx` on latest master.
- Checkpoint commit: pending.

## Verification
- Static inspection confirms existing user-switch resets, refresh-generation protection and announcement fallback remain.
- Static inspection confirms retries reissue the existing refresh routine.
- No backend notification routes or permissions changed.
- Automated tests and TypeScript remain pending CI; no runtime claim is made.

## Exact next action
Open a focused PR from current master and close the stale predecessor after confirming the refreshed diff.

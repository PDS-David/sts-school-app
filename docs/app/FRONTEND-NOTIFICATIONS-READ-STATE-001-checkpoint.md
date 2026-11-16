# Notifications read-state persistence checkpoint

**Branch:** `agent/notifications-read-state-20261116`  
**Base at start:** `32d4d1677e4cd236f05bcb2c4fb4a86022dfaed8` (`master`, 2026-11-16)

## Finding

`NotificationsContext.tsx` kept `readIds` only in component state. A restart discarded every read marker, so previously dismissed notifications reappeared as unread. Message notifications also used a stable ID per contact, meaning a new unread message from the same contact could remain hidden after the earlier alert was marked read.

## Change

- Persist read notification IDs in AsyncStorage, scoped to the signed-in user and role/school/class context.
- Hydrate the stored state before writing the initial state, preventing an empty initial render from overwriting saved read markers.
- Ignore stale hydration responses when the signed-in context changes.
- Include the latest message timestamp and unread count in message notification IDs so a new unread message produces a new notification identity.

## Verification

- TypeScript and Android bundle checks pending after PR creation.
- No backend or production data changes.

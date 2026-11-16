# FRONTEND-ADMIN-MESSAGE-DRAFTS-001 — Keep admin message drafts scoped to recipients

Task ID: FRONTEND-ADMIN-MESSAGE-DRAFTS-001
Status: IMPLEMENTED — awaiting PR CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `cba776275b8af23e6289310c6bf3c9d60f17c8fa`
Worker branch: `agent/frontend-admin-message-drafts-20261116`

## Finding

The admin Messages screen uses one shared composer for every conversation. Returning to the contact list and opening another conversation did not clear or preserve the previous recipient's draft separately. Text intended for one recipient could therefore appear in another recipient's composer and be sent to the wrong person.

## Implemented

- Keep an in-memory draft map keyed by contact ID.
- Save the current recipient's draft when leaving a thread or switching contacts.
- Restore only the selected recipient's draft when opening a conversation.
- When a send succeeds (including an offline-queued send), clear only the exact submitted draft for that recipient.
- Preserve newer text typed while a send is in flight.
- Ignore draft clearing for another recipient and preserve failed-send drafts.
- Compare trimmed submitted text so harmless surrounding whitespace does not leave a duplicate draft behind.

## Changed files

- `mobile/src/screens/MessagesScreen.tsx`

## Verification

- Static review confirms drafts are keyed by recipient ID and are not shared between admin conversations.
- Static review confirms a successful send clears only the matching submitted draft, while later edits and failed sends remain.
- Existing `POST /messages`, offline outbox and server-side recipient authorization are unchanged.
- TypeScript, automated, browser and device checks are pending PR CI/runtime access; no runtime pass is claimed.

## Remaining

- Switch between two admin recipients with unsent drafts and verify each draft restores only in its own conversation.
- Complete a send while another recipient is active and verify the previous draft clears without changing the active thread.
- Verify send failure and offline-queued sends preserve the expected recipient-specific draft behavior.

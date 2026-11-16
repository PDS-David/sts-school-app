# FRONTEND-CHAT-DRAFT-RACE-001 — Preserve drafts across in-flight chat sends

Task ID: FRONTEND-CHAT-DRAFT-RACE-001
Status: IMPLEMENTED — awaiting PR CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `f1a8906d10e1b498ba4c2e863e9932c2b616af0a`
Worker branch: `agent/frontend-chat-draft-race-20261116`

## Finding

The nested ChatThread screen allowed the composer to remain editable while a message was being sent, but unconditionally cleared the composer when the request completed. Text typed after Send was pressed could therefore be lost. A late send response could also append to the wrong thread if the active contact changed while the request was in flight.

## Implemented

- Capture the recipient and send generation at request start.
- Ignore late success/error/loading updates after the active contact or request generation changes.
- Append a sent message only to the conversation that initiated the send.
- Clear the composer only when its current contents still match the submitted text, preserving any newer draft.
- Guard the delayed scroll action against a conversation switch.

## Changed files

- `mobile/src/screens/chats/ChatThreadScreen.tsx`

## Verification

- Static review confirms send responses are guarded by both recipient identity and request generation.
- Static review confirms the composer is cleared conditionally, preserving text entered during the request.
- Existing `POST /messages` endpoint and server-side recipient authorization are unchanged.
- TypeScript, automated, browser and device checks are pending PR CI/runtime access; no pass is claimed.

## Remaining

- Test a delayed successful send while typing a second draft.
- Test recipient changes and failed sends while a request is in flight.
- Verify queued/offline sends and reconnect behavior on parent, student and teacher accounts.

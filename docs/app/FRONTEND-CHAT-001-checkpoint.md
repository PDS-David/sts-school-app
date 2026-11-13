# FRONTEND-CHAT-001 — New-message journey checkpoint

Task ID: FRONTEND-CHAT-001
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `982c1d2d94e9bfbbb890d027c620b8a16e7f3f26`
Worker branch: `agent/frontend-chat-journeys-20261113`

## Baseline and ownership checks
- Inspected the latest master commit history before editing.
- Checked open PRs and branches for messaging/chat work; no active chat-specific branch or open messaging PR was found.
- Existing chat backend `GET /messages/contacts` returns the server-authorized recipient list; `POST /messages` independently rechecks recipient scope. This implementation reuses that list and does not widen permissions.
- Existing role navigators register `ChatThread` for student, parent and teacher journeys. Admin messaging is a separate route and was not changed.
- Avoided files changed by the in-flight school-management/calendar and teacher-marking work.

## Finding
In `mobile/src/screens/chats/ChatsScreen.tsx`, the only FAB action labelled “New message” merely changed the selected tab to “Direct Messages”. That tab rendered the same contact list as “All”, so it did not start a distinct compose/recipient-selection journey. “Groups” and “Archived” tabs also led to static “not available” dead ends despite looking interactive. A failed contact request was silently swallowed and then presented as an empty conversation list.

## Implemented
- Replace the misleading “New message” tab switch with a recipient picker and search by name, username or role.
- Start a conversation by selecting a recipient and navigating to the existing `ChatThread` route.
- Use only `GET /messages/contacts` results, preserving the backend's role/school/relationship restrictions; the send endpoint still performs its own authorization check.
- Remove the unsupported Groups and Archived controls rather than leave dead-end tabs.
- Add an explicit contact-load error state and retry action so network failure is not misreported as an empty inbox.
- Add accessible labels and selected tab state to the remaining controls.

## Changed files
- `mobile/src/screens/chats/ChatsScreen.tsx`

## Commits
- `d485519ad57cbda1aa8f5cb22683348d639d8e1c` — implement recipient picker, remove dead-end tabs, and expose load failures.
- Checkpoint commit: pending.

## Verification
- Static inspection: the picker consumes the same authorized contacts endpoint already used by the inbox.
- Static inspection: selected recipients are passed unchanged to the registered `ChatThread` route; message writes continue through the existing scoped `POST /messages` endpoint.
- Static inspection: failed contact loads display an error and a retry control; empty results have a separate message.
- Automated tests, TypeScript, and device checks were not run. The available repository integration exposes GitHub file/branch operations but no local checkout or command execution environment; `mobile/package.json` also has no test or typecheck script.
- No runtime/device readiness claim is made.

## Remaining work
- Run mobile lint/typecheck and role-based device tests when a repository execution environment is available.
- Verify new-message picker behavior on student, parent and teacher accounts, including empty permitted-recipient lists and offline/server failures.
- Continue the wider frontend audit in independent, non-overlapping role journeys.

## Exact next action
Refresh against the current `master`, inspect the latest PR/branch ownership, then open a focused PR for FRONTEND-CHAT-001. Next audit the next independently available frontend journey without touching active school-management or teacher-marking branches.

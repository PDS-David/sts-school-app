# FRONTEND-CHAT-002 — Conversation recovery checkpoint

Task ID: FRONTEND-CHAT-002
Status: IMPLEMENTED — awaiting PR review and CI; no runtime verification claimed
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `03aa60f0f448caed371e8da9a30ff1f91cb0cbf5`
Worker branch: `agent/frontend-chat-recovery-20261113`

## Baseline and ownership checks
- Inspected current master and open messaging PRs before editing.
- Confirmed PR #690 owns the new-message recipient picker and ChatsScreen changes; this task deliberately avoids that screen and does not overlap its branch.
- Read `mobile/src/screens/chats/ChatThreadScreen.tsx`, `mobile/src/screens/MessagesScreen.tsx`, and `backend/src/routes/messages.ts`.
- Existing server-side `getMessageableUsers` authorization and message read semantics were not changed.

## Findings
- Parent/student/teacher conversation retrieval failures were swallowed and left an apparently empty thread with no retry.
- Admin contact-list failures were swallowed and looked like a valid empty contact list.
- Admin conversation failures were swallowed, and switching conversations could leave the prior thread visible while the new request was pending.
- Send failures used a native alert, which can be unreliable on web, and did not provide persistent inline feedback.
- Send controls were not disabled for empty drafts and admin send could proceed while thread retrieval was still failing.

## Implemented
- Parent/student/teacher ChatThread: show a recoverable conversation-load error with retry and back navigation.
- Parent/student/teacher ChatThread: show inline send errors while preserving the draft; clear the error when the draft is edited.
- Prevent duplicate sends and disable the send button for empty drafts.
- Admin Messages: distinguish contacts loading failures from a genuinely empty contacts list and provide retry.
- Admin Messages: add thread loading/error/retry states; clear old messages on recipient switch and ignore stale responses from prior recipient requests.
- Admin Messages: show inline send errors, preserve drafts, prevent duplicate sends, and block sends until the active conversation is available.
- Add accessible send-button labels.
- Keep offline-queued message behavior unchanged; queued messages remain visibly pending.

## Changed files
- `mobile/src/screens/chats/ChatThreadScreen.tsx`
- `mobile/src/screens/MessagesScreen.tsx`

## Commits
- `91a2695ac638743a7e066dd2511014b1d71cf6e2` — recover ChatThread loads and preserve send drafts.
- `079951f86613f76ebe9c11efc07cb8b597b066cb` — add admin message recovery.
- `a8d131fed074bfe1a3afa2cdfcd3946376eb92ee` — remove obsolete native alert import.
- `0c546f7449be1e085b96d3b56cf7fad09d7903fc` — tighten admin messaging control states.
- Checkpoint commit: `3740ed6c6146e803223fe1da607cf4fd9d793ab2`.

## Verification
- Static inspection confirms chat history uses the existing conversation endpoint, which marks received messages read server-side as before.
- Static inspection confirms retries reissue the existing conversation/contacts requests.
- Static inspection confirms admin recipient switches clear prior thread content and stale responses are ignored.
- Static inspection confirms send errors preserve drafts and offline-queued messages remain visibly pending.
- Existing server-side recipient authorization and read semantics remain unchanged.
- Automated tests, TypeScript and device checks were not run because no local checkout/command execution environment is available.
- No runtime or device-readiness claim is made.

## Remaining work
- Verify new-message picker PR #690 together with these conversation fixes after both pass CI.
- Test admin, teacher, parent and student conversations: initial load failure, retry, switch recipients during load, offline queued send, server rejection and reconnect.
- Confirm notification push tap routing into both the admin Messages screen and nested ChatThread screen on devices.

## Exact next action
Compare with current `master`, open a focused PR, and continue auditing parent/teacher/admin navigation and remaining end-to-end flows.

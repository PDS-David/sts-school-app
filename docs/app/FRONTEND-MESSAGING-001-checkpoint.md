# FRONTEND-MESSAGING-001 — Conversation send-state correctness

- Status: implementation committed; awaiting CI and review.
- Base branch: `master`
- Base commit: `acc6ff5f62113df659fbd0f39afe18ac44e7debf`
- Worker branch: `agent/frontend-messaging-race-current-20261113`

## Commits
- `8332ed6333e8768d43590b65f08f01fbaabb1e10` — prevent stale send responses from corrupting another conversation or draft.
- Checkpoint commit: `pending`.

## Changes
- Capture recipient and conversation request identity before sending.
- If the user switches conversations while a send is in flight, do not append the old recipient's message to the newly opened thread.
- Do not clear a new draft typed after the original send began.
- Show send errors only in the conversation that initiated the request.
- Treat local conversation cache persistence as best-effort after the API confirms or queues the message. Cache failure no longer presents a false send failure or encourages duplicate sends.
- Preserve offline outbox pending-message behavior.

## Verification
- Static inspection: send response checks conversation identity before changing visible thread/draft state.
- Static inspection: cached conversation is still updated using the captured recipient id.
- Static inspection: local cache errors are isolated from the API send result.
- CI pending; no live multi-conversation race or offline-device test is claimed.

## Remaining work
- Check mobile TypeScript and Android readiness.
- Verify online/offline message delivery with two accounts on devices when available.
- Next action: inspect CI and update this checkpoint.

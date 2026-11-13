# FRONTEND-MESSAGING-001 — Conversation send-state correctness

- Status: implementation committed; awaiting CI and review.
- Base branch: `master`
- Base commit: `b8651cebaa480097fd1c40c9b02c11b228187caa`
- Worker branch: `agent/frontend-messaging-race-20261113`

## Commits
- `64d2bb16f46e7b7f7a9ef92ad4dfeb617db9e773` — prevent stale send responses from corrupting another conversation or draft.
- Checkpoint commit: `d80d7af455950258d34e2f343990e485a5efe40b`.

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

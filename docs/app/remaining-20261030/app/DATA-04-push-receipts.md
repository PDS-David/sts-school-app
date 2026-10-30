# DATA-04 — Add a durable push delivery ledger

Status: READY · Depends: OPS-01 · Base: `origin/master` (record the SHA)
Writes: `backend/schema.sql`, the OPS-01 migration, `backend/src/utils/push.ts`, `docs/app/remaining-20261030/evidence/DATA-04.md`

## Why (verified at master `8ffcd12`)

`device_push_tokens` stores one row per user/device (`schema.sql:457-468`, unique on user+token). `push.ts:40-65` sends through Expo, reads the returned tickets **in memory**, and deletes tokens that come back `DeviceNotRegistered`. Nothing records what was sent, to which token, whether a ticket succeeded, or what the provider error was.

The manual: "A durable universal delivery/receipt ledger is not demonstrated." A failed push does not undo the saved message (correct), but the school cannot answer "was this parent notified?" — and `push_enabled`/token pruning are the only operational signals.

## Do

1. Schema: `push_deliveries(id BIGSERIAL PRIMARY KEY, user_id UUID REFERENCES users(id) ON DELETE SET NULL, token TEXT NOT NULL, title TEXT, body_preview TEXT, status TEXT NOT NULL CHECK (status IN ('queued','accepted','error','pruned')), provider_ticket_id TEXT, error TEXT, message_id UUID NULL, created_at TIMESTAMPTZ DEFAULT now(), updated_at TIMESTAMPTZ DEFAULT now())`. Store at most 120 characters of body (preview), never the full message.
2. `push.ts`: for each recipient token, insert a `queued` row before the provider call (best effort — a ledger failure must not block the push, same rule as today), then update it to `accepted` with the ticket id, or `error` with the provider message. When a token is pruned, mark its most recent delivery `pruned` in addition to deleting the token.
3. Do not change: fire-and-forget semantics in `messages.ts:71-88`, `push_enabled` handling, the class-push target rule (students only), or the bell (client-side).
4. Add no endpoint and no screen in this task. If an admin read is needed later, it is a separate task with its own permission decision.
5. Evidence note: table columns, the exact write points in `push.ts`, and the retention question (no pruning job implemented — say so).

## Acceptance (static)

- Every attempted push produces one row whose status matches the provider outcome as far as the current code can tell.
- A ledger INSERT failure is caught and logged, never turned into a message-send failure.
- No message body beyond the preview is stored; no token is logged.
- Token pruning still happens; it now also annotates the delivery.

## Do not

- Add Expo receipt polling (a second, scheduled API) — out of scope.
- Backfill past pushes.
- Expose the table through any route.

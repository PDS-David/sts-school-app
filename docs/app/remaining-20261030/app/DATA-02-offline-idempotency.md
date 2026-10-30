# DATA-02 — Make offline-replayed writes exactly-once

Status: READY · Depends: OPS-01 (schema/migration) · Base: `origin/master` (record the SHA)
Writes: `backend/schema.sql`, the OPS-01 migration, `backend/src/index.ts` (middleware mount), `backend/src/middleware/idempotency.ts` (new), `backend/src/routes/messages.ts` (only if a natural key is preferred), `mobile/src/offline/storage.ts`, `mobile/src/api/client.ts`, `docs/app/remaining-20261030/evidence/DATA-02.md`

## Why (verified at master `8ffcd12`)

The outbox record contains only `{ id (local), method, url, data, createdAt }` (`mobile/src/offline/storage.ts:102-108`). Nothing it sends identifies the attempt to the server (`mobile/src/api/client.ts:236`). A queued request returns a synthetic 202 (`client.ts:257`), and `flushOutbox` (`281-313`) removes the item on any 4xx and keeps it on network/5xx errors (`296-302`).

If the request reaches the server but the response is lost, the item stays queued and is sent again on the next flush. Scores and attendance survive that because they upsert on conflict; a **message** insert does not — `POST /messages` has no unique key (`messages.ts:45-50`), so the duplicate text is delivered twice. The manual states plainly: "There is no universal idempotency-key/exactly-once guarantee."

## Do

1. Client: give every queued request a `request_id` (UUID v4) at enqueue time, persist it with the record, and send it as an `Idempotency-Key` header on replay (not on the original live request path, or on both — either is safe as long as the key is stable per logical request).
2. Server: add `backend/src/middleware/idempotency.ts`:
   - Applies only to `POST`/`PUT`/`PATCH` under `/messages`, `/scores`, `/attendance`, `/weekly-efforts`, `/students` (list them explicitly; no wildcard).
   - Requires authentication first; the key is scoped to `(user_id, key)`.
   - If a completed row exists for that pair, replay the stored status and JSON body without executing the handler.
   - If no row exists, execute the handler and store the response. Use `INSERT ... ON CONFLICT DO NOTHING` as the reservation step so two concurrent replays cannot both execute.
3. Schema: `request_idempotency(user_id UUID, key TEXT, method TEXT, path TEXT, status INT, response JSONB, created_at TIMESTAMPTZ DEFAULT now(), PRIMARY KEY (user_id, key))`, plus a retention comment (rows can be pruned after 7 days; the pruning job is **not** part of this task).
4. Mount the middleware after `requireAuth` in `index.ts`; do not mount it globally before auth.
5. Do not add a client-side merge or last-write-wins scheme; conflicts between two devices remain out of scope.
6. Evidence note: the exact replay sequence (send → 202 → lost response → flush → same key → stored response) and which endpoints are covered.

## Acceptance (static)

- Every queued write carries a stable key; live-only operations (auth, `/ai`, deletes, completion, PIN) are unchanged.
- A second request with the same key never inserts a second message or a second score row.
- The middleware never caches a 4xx as success, and never serves another user's stored response.
- No change to the outbox cap, the 4xx-drop rule or the flush guard.

## Do not

- Add Redis or an external queue.
- Store response bodies for endpoints that return tokens or secrets.
- Run the app, a test or a database command.

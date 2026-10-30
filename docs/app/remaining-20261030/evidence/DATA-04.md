# DATA-04 evidence — durable push delivery ledger

Status: `IMPLEMENTED_TESTING_DEFERRED` (implemented, not approved, not verified)
Base: `origin/master` `1764f62`. Prompt line numbers were written against `8ffcd12`; citations are at `1764f62`.
OPS-01 has not landed. Per the README fallback the table is added by hand to `backend/schema.sql` in its existing style (`CREATE TABLE IF NOT EXISTS`); no numbered migration exists to add.
Files changed: `backend/schema.sql`, `backend/src/utils/push.ts`.

## Old behaviour (base `1764f62`)

- `device_push_tokens` stores one row per user/device, `UNIQUE (user_id, expo_push_token)` (`schema.sql`, ~457-465).
- `backend/src/utils/push.ts` `sendPushToUser`: reads `notification_settings.push_enabled`, loads tokens, filters with `Expo.isExpoPushToken`, chunks, calls `sendPushNotificationsAsync`, reads the tickets in memory, and `DELETE`s tokens whose ticket is `DeviceNotRegistered`. A whole-chunk failure was only `console.error`-ed. Nothing durable recorded what was sent, to which token, or the provider outcome.

## Table (`push_deliveries`, in `schema.sql` right after the `device_push_tokens` index)

| Column | Type | Notes |
|---|---|---|
| `id` | BIGSERIAL PK | |
| `user_id` | UUID → `users(id)` ON DELETE SET NULL | rows outlive an account |
| `token` | TEXT NOT NULL | |
| `title` | TEXT | as passed by the caller |
| `body_preview` | TEXT | `body.slice(0, 120)`; never the full message |
| `status` | TEXT NOT NULL, CHECK in `queued`/`accepted`/`error`/`pruned` | |
| `provider_ticket_id` | TEXT | Expo ticket id on `accepted` |
| `error` | TEXT | provider error or send-failure text, truncated to 500 chars |
| `message_id` | UUID NULL | no FK, as specified |
| `created_at`, `updated_at` | TIMESTAMPTZ DEFAULT now() | |

Two indexes were added beyond the prompt's column list: `(user_id, created_at DESC)` for "was this user notified?" and `(token, id DESC)` so the prune annotation does not scan the table. Both are `IF NOT EXISTS`. Reviewer may drop them.

## Write points in `push.ts`

1. `ledgerQueue` — one multi-row `INSERT … SELECT … FROM unnest(tokens) RETURNING id, token` with status `queued`, executed **before** `sendPushNotificationsAsync`, after the `push_enabled`/token/`isExpoPushToken` filtering. Parameters are cast explicitly (`$1::uuid`, `$5::uuid`, etc.) because untyped parameters in an `INSERT … SELECT` list cannot be relied on to infer `uuid`.
2. Per chunk, on success: `ledgerSettle` — one `UPDATE … FROM unnest(ids, statuses, ticket_ids, errors)`: `ok` ticket → `accepted` with `provider_ticket_id`; `error` ticket → `error` with `"<details.error>: <message>"`.
3. Per chunk, on whole-chunk failure (the existing `catch`): `ledgerSettle` marks every token in that chunk `error` with `send failed: <message>`. The existing `console.error` and `continue` are unchanged.
4. After the existing `DELETE FROM device_push_tokens`: `ledgerMarkPruned` sets `status='pruned'` on the most recent delivery of each pruned token (`DISTINCT ON (token) … ORDER BY token, id DESC`). The `error` text recorded in step 2 is kept. Pruning itself is unchanged.

A signature addition: `sendPushToUser`'s `notif` accepts an optional `messageId` (stored in `message_id`). `sendPushToClass` passes `notif` through unchanged. `messages.ts` does not pass a message id today and is outside this task's Writes, so `message_id` is NULL for all rows until a follow-up passes it.

## Best-effort guarantees

- Each helper has its own `try/catch`; a failure logs `Push ledger … failed: <message>` (message only, sliced to 500 chars) and returns. `ledgerQueue` returns an empty map on failure, in which case the push proceeds and no row is updated. The ledger can therefore never turn a message send into a failure.
- No new logging contains a token or a body. The only pre-existing raw-error log (`console.error('Push send failed for a chunk:', err)`) is unchanged; whether Expo error objects can embed tokens was not checked.
- The `error` column can contain Expo's message text, which for `DeviceNotRegistered` includes the token; the table already stores the token in `token`, so no new exposure within the table. The table is not exposed through any route.

## Acceptance (static)

- Every attempted push (a token that passed `isExpoPushToken` and was handed to the provider) gets a row whose final status reflects what the current code can tell: `accepted`, `error`, or `pruned`. A row can remain `queued` if the process dies between the insert and the settle, or if the settle itself fails; that is by design and visible.
- Tokens skipped by `push_enabled = false`, no tokens, or failing `isExpoPushToken` are not attempted and have no row.
- Token pruning still happens and now also annotates the delivery.

## Deliberately not changed

Fire-and-forget behaviour in `messages.ts`, `push_enabled` handling, the students-only class-push rule in `sendPushToClass`, the client-side bell, any route or screen. No Expo receipt polling, no backfill.

## Retention

**No retention or pruning job is implemented.** The table grows with every push. A retention policy (age-based delete or archival) is an open question for the owner and a separate task.

## Not done / not verified

No tests, typechecks, DB, migration or deploy were run (testing deferred by owner). The SQL (`INSERT … SELECT … unnest`, `UPDATE … FROM unnest`, `DISTINCT ON`) has not been executed, and the Expo SDK type narrowing for ticket `ok`/`error` has not been compiled.

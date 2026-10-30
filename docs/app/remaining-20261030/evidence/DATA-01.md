# DATA-01 evidence — make invoice creation atomic

Status: `IMPLEMENTED_TESTING_DEFERRED` (implemented, not approved, not verified)
Base: `origin/master` `f5a0aef`. The prompt's line numbers were written against `8ffcd12`; `finance.ts` is unchanged in the cited region. Only code file changed: `backend/src/routes/finance.ts`.

## Old behaviour (base `f5a0aef`)

- `POST /finance/invoices` (`backend/src/routes/finance.ts`, `router.post('/invoices', requireRole('finance_admin'), …)`): after validation it ran `INSERT INTO invoices … RETURNING *`, then a `for` loop of `INSERT INTO invoice_items` per fee item, each a separate autocommit `query()`. No `BEGIN`.
- `withTransaction` exists at `backend/src/db/pool.ts:19-33`; no route used it before ASM-03 (PR #280).
- A failure inside the loop (constraint, timeout, restart) left a committed invoice whose lines were missing or partial while `total` already held the full sum.

## New behaviour

Statement order, all on one transaction client (`withTransaction`):

1. `INSERT INTO invoices(student_id,term_id,total) VALUES($1,$2,$3) RETURNING *`
2. `INSERT INTO invoice_items(invoice_id,fee_item_id,amount)` once per validated fee item, in the same order as before.

Any throw rolls back both. Everything before them stays outside the transaction and unchanged, in the same order with the same messages and status codes: empty `fee_item_ids` (400), student not found (404), term not found (404), term/student school mismatch (400), missing fee item (400), cross-school fee item (400). The total is still `items.reduce(... Number(i.amount))` from the validated fee items.

Response is `201 { invoice }` with the header row, same as before. `mobile/src/screens/FinanceScreen.tsx` posts to this route and ignores the response body (it closes the modal and refetches), so lines were not added to the contract.

## Worked example

Fee items validated for the student's school: "Tuition" 5000 and "Uniform" 2500.
- Total = 5000 + 2500 = **7500**.
- Transaction: header (`total = 7500`), then line (fee item Tuition, 5000), then line (Uniform, 2500). Lines sum to 7500 = header total.
- If the second line insert throws, the header and the first line are rolled back; no invoice exists.

## Acceptance (static)

- No invoice row commits without all of its lines, and no `invoice_items` row exists for an uncommitted invoice: both inserts are in one transaction.
- Validation responses unchanged; only the write path changed.
- Role gates unchanged: `blockNonFinanceRoles` (router-level) and `requireRole('finance_admin')` on this route.

## Deliberately not changed

Payment status logic and `PUT /invoices/:id/status`, the `unpaid`/`partial`/`paid` model, the read routes, any payments/gateway/webhook/reconciliation table, schema, other routes.

## Not done / not verified

No tests, typechecks, DB, migrations or deploy were run (testing deferred by owner). The TypeScript was not compiled and the rollback path was not exercised.

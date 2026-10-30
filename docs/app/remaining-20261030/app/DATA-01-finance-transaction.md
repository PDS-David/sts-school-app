# DATA-01 — Make invoice creation atomic

Status: READY · Depends: none · Base: `origin/master` (record the SHA)
Writes: `backend/src/routes/finance.ts`, `docs/app/remaining-20261030/evidence/DATA-01.md`

## Why (verified at master `8ffcd12`)

`POST /finance/invoices` (`backend/src/routes/finance.ts:91-139`) validates the student, the term's school and every fee item correctly, sums the amount, inserts the invoice header (`130-133`), then inserts one `invoice_items` row per item in a loop (`134-137`). There is no `BEGIN`, and no route in the codebase uses the `withTransaction` helper that already exists at `backend/src/db/pool.ts:19-33`.

A failure in the loop (constraint, timeout, process restart) leaves a real invoice whose total does not match its lines. The manual records this: "Invoice header/lines use multiple queries without one enclosing transaction, so partial failure must be investigated."

## Do

1. Wrap the two inserts in `withTransaction` from `pool.ts`, keeping all reads (student, term, fee items, school comparisons, total calculation) outside or inside as convenient — the correctness requirement is that the header and **all** lines commit together.
2. Use the transaction client for both statements. Return the same `{ invoice }` response shape; include the inserted lines in the response only if the mobile screen already expects them (grep `FinanceScreen.tsx` first — if not, do not change the contract).
3. Keep the exact validation order and error messages for: empty item list, missing student, missing term, term/student school mismatch, missing fee item, cross-school fee item. Those are already correct and were fixed in an earlier pass.
4. Keep the role gate (`blockNonFinanceRoles` at `20-29`, `requireRole('finance_admin')` at 91). Do not touch payment status logic, since there is no payment ledger.
5. Evidence note: the statement order inside the transaction, and one worked example (2 items summing to the header total).

## Acceptance (static)

- No invoice row can be committed without all of its lines.
- No `invoice_items` row can exist for an invoice that was not committed.
- Validation responses are unchanged; only the write path changes.
- The total continues to be computed from the validated fee items, never from client input.

## Do not

- Add a payments, gateway, webhook or reconciliation table — out of scope and not authorised.
- Change the invoice status model (`unpaid`/`partial`/`paid`).
- Run a query, a migration or a test.

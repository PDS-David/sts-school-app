# BK-WK-T3-W04 — Bookkeeping, 3rd Term, Week 4 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective-level source indexing only; no teaching text or missing worked answers are invented.

## Source identity and boundary
- Source: `SS1-SRC-97f226215927`; member SHA-256 `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`.
- Scheme locator: scheme blocks 14–16; body blocks 151–175 and 180–254.
- Inventory: `BK-INV-T3.md`.
- The source has no literal WEEK marker in the teaching body. This is a scheme-week mapping, not a verified importer row or confirmed body boundary.

## Objectives and evidence

| Scheme objective | Status | Source evidence and gap |
|---|---|---|
| Rules for posting balances from ledger to trial balance | PARTIAL | Blocks 151–164 contain a visual classification diagram naming credit liabilities, credit income/gain, debit expenses and debit assets; its spatial mapping requires visual disposition. |
| Preparation of trial balance | PARTIAL | Blocks 166–175 give ledger balancing steps and blocks 180–254 contain a worked illustration. The printed trial-balance totals do not reconcile as printed. |

## Implementation boundary
- Matching `coverage[]` entries are recorded in `backend/src/db/ss1/subjects/bookkeeping.json` with exact source locators, evidence, and no lesson IDs.
- PARTIAL/UNRESOLVED statuses deliberately block delivery until a teaching lesson or separately authored equivalent exists.
- No source wording, figures or dates are silently corrected. See `BK-PRES-T3-WORKED` for arithmetic review and `BK-INV-T3.md` for source structure.
- Importer/compiler execution, package tests and delivery verification remain deferred.

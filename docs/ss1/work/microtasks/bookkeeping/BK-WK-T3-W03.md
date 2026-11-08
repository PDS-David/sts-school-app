# BK-WK-T3-W03 — Bookkeeping, 3rd Term, Week 3 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective-level source indexing only; no teaching text or missing worked answers are invented.

## Source identity and boundary
- Source: `SS1-SRC-97f226215927`; member SHA-256 `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`.
- Scheme locator: scheme blocks 10–13; body blocks 85–150 and 166–259.
- Inventory: `BK-INV-T3.md`.
- The source has no literal WEEK marker in the teaching body. This is a scheme-week mapping, not a verified importer row or confirmed body boundary.

## Objectives and evidence

| Scheme objective | Status | Source evidence and gap |
|---|---|---|
| Meaning of trial balance | PARTIAL | Block 87 defines a trial balance as a statement of ledger balances in double-entry form used to test arithmetical accuracy. |
| Functions of trial balance | PARTIAL | Blocks 147–150 list three purposes: comprehensive account list, arithmetical accuracy check and data for final accounts. |
| Extraction of balance from ledger to trial balance | PARTIAL | Blocks 166–175 describe ledger balancing; blocks 180–254 show transactions, ledger accounts and a trial balance. Printed totals show debit 10,000 and credit 1,000; the worked answer requires arithmetic review. |

## Implementation boundary
- Matching `coverage[]` entries are recorded in `backend/src/db/ss1/subjects/bookkeeping.json` with exact source locators, evidence, and no lesson IDs.
- PARTIAL/UNRESOLVED statuses deliberately block delivery until a teaching lesson or separately authored equivalent exists.
- No source wording, figures or dates are silently corrected. See `BK-PRES-T3-WORKED` for arithmetic review and `BK-INV-T3.md` for source structure.
- Importer/compiler execution, package tests and delivery verification remain deferred.

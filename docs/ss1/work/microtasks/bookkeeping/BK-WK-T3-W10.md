# BK-WK-T3-W10 — Bookkeeping, 3rd Term, Week 10 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective-level source indexing only; no teaching text or missing worked answers are invented.

## Source identity and boundary
- Source: `SS1-SRC-97f226215927`; member SHA-256 `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`.
- Scheme locator: scheme blocks 34–38; body blocks 404, 426–468.
- Inventory: `BK-INV-T3.md`.
- The source has no literal WEEK marker in the teaching body. This is a scheme-week mapping, not a verified importer row or confirmed body boundary.

## Objectives and evidence

| Scheme objective | Status | Source evidence and gap |
|---|---|---|
| Explain balance sheet | PARTIAL | Block 404 defines a balance sheet as a list of assets and liabilities at a particular date. |
| Balance sheet content | PARTIAL | Blocks 426–452 show capital, liabilities, fixed assets, investment and current assets; layout requires visual disposition. |
| Users of balance sheet | UNRESOLVED | Scheme block 37 explicitly names users, but no identifiable explanation of user groups or their uses appears in the body. |
| Preparation of simple balance sheet | PARTIAL | Blocks 426–452 show a layout and blocks 457–468 provide an unsolved assignment; the date conflicts between 1983 and 1883. |

## Implementation boundary
- Matching `coverage[]` entries are recorded in `backend/src/db/ss1/subjects/bookkeeping.json` with exact source locators, evidence, and no lesson IDs.
- PARTIAL/UNRESOLVED statuses deliberately block delivery until a teaching lesson or separately authored equivalent exists.
- No source wording, figures or dates are silently corrected. See `BK-PRES-T3-WORKED` for arithmetic review and `BK-INV-T3.md` for source structure.
- Importer/compiler execution, package tests and delivery verification remain deferred.

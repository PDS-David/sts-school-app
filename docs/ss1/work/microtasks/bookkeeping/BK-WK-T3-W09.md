# BK-WK-T3-W09 — Bookkeeping, 3rd Term, Week 9 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective-level source indexing only; no teaching text or missing worked answers are invented.

## Source identity and boundary
- Source: `SS1-SRC-97f226215927`; member SHA-256 `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`.
- Scheme locator: scheme blocks 30–33; body blocks 401–423.
- Inventory: `BK-INV-T3.md`.
- The source has no literal WEEK marker in the teaching body. This is a scheme-week mapping, not a verified importer row or confirmed body boundary.

## Objectives and evidence

| Scheme objective | Status | Source evidence and gap |
|---|---|---|
| Purpose of profit and loss account | PARTIAL | Block 403 says the account discloses net profit or loss and expenses are deducted from gross profit; it does not separately enumerate the purpose. |
| Determining net sales and net profit | UNRESOLVED | Block 417 defines net profit but no net-sales computation or worked net-profit calculation is supplied. |
| Rules for preparing profit and loss account | PARTIAL | Block 422 says expenses in the trial balance are deducted from gross profit; no distinct P&L format or full rule sequence is supplied. |

## Implementation boundary
- Matching `coverage[]` entries are recorded in `backend/src/db/ss1/subjects/bookkeeping.json` with exact source locators, evidence, and no lesson IDs.
- PARTIAL/UNRESOLVED statuses deliberately block delivery until a teaching lesson or separately authored equivalent exists.
- No source wording, figures or dates are silently corrected. See `BK-PRES-T3-WORKED` for arithmetic review and `BK-INV-T3.md` for source structure.
- Importer/compiler execution, package tests and delivery verification remain deferred.

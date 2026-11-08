# BK-WK-T3-W08 — Bookkeeping, 3rd Term, Week 8 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective-level source indexing only; no teaching text or missing worked answers are invented.

## Source identity and boundary
- Source: `SS1-SRC-97f226215927`; member SHA-256 `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`.
- Scheme locator: scheme blocks 28–29; body blocks 418–423.
- Inventory: `BK-INV-T3.md`.
- The source has no literal WEEK marker in the teaching body. This is a scheme-week mapping, not a verified importer row or confirmed body boundary.

## Objectives and evidence

| Scheme objective | Status | Source evidence and gap |
|---|---|---|
| Preparation of a simple trading account | UNRESOLVED | Blocks 418–423 give general final-account steps, but no simple trading-account layout, figures or worked preparation are supplied. |

## Implementation boundary
- Matching `coverage[]` entries are recorded in `backend/src/db/ss1/subjects/bookkeeping.json` with exact source locators, evidence, and no lesson IDs.
- PARTIAL/UNRESOLVED statuses deliberately block delivery until a teaching lesson or separately authored equivalent exists.
- No source wording, figures or dates are silently corrected. See `BK-PRES-T3-WORKED` for arithmetic review and `BK-INV-T3.md` for source structure.
- Importer/compiler execution, package tests and delivery verification remain deferred.

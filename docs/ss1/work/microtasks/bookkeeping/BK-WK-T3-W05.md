# BK-WK-T3-W05 — Bookkeeping, 3rd Term, Week 5 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. Objective-level source indexing only; no teaching text or missing worked answers are invented.

## Source identity and boundary
- Source: `SS1-SRC-97f226215927`; member SHA-256 `343c428b86364be8e1784c814fdd7ca3d02836f508e7eff289af0e139447fd7d`.
- Scheme locator: scheme blocks 17–21; body blocks 261–307 and 308–314.
- Inventory: `BK-INV-T3.md`.
- The source has no literal WEEK marker in the teaching body. This is a scheme-week mapping, not a verified importer row or confirmed body boundary.

## Objectives and evidence

| Scheme objective | Status | Source evidence and gap |
|---|---|---|
| Meaning of errors | PARTIAL | Blocks 261–267 introduce six error categories and short definitions/examples. |
| Types of errors | PARTIAL | Blocks 262–267 list original entry, omission, commission, principle, compensating errors and complete reversal. |
| Errors affecting trial balance | PARTIAL | Blocks 308–314 list one-sided omission, misposting, subsidiary-book transfer errors, two entries on the same side and under/overcasting as errors affecting agreement. |
| Errors that do not affect trial balance | UNRESOLVED | Scheme block 21 names this objective, but no distinct list or explanation of errors that do not affect agreement appears in the body. |

## Implementation boundary
- Matching `coverage[]` entries are recorded in `backend/src/db/ss1/subjects/bookkeeping.json` with exact source locators, evidence, and no lesson IDs.
- PARTIAL/UNRESOLVED statuses deliberately block delivery until a teaching lesson or separately authored equivalent exists.
- No source wording, figures or dates are silently corrected. See `BK-PRES-T3-WORKED` for arithmetic review and `BK-INV-T3.md` for source structure.
- Importer/compiler execution, package tests and delivery verification remain deferred.

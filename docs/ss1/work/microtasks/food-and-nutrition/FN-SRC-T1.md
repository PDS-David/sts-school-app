# FN-SRC-T1 — Food and Nutrition, 1st Term source registration

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Starting SHA: `441a8823680b0f630c0597b19682446ff553f884` (origin/master). No open PR touched this item; no `AGENTS.md`; `food-and-nutrition.json` did not exist on master. The only related branch, `origin/ss1/food-and-nutrition-queue`, carries no package work.
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified** (supplied as `SSS_1-20260507T072431Z-3-001.zip`; the bytes decide).
- Source `SS1-SRC-de2cdd0b85f6`, member `SSS 1/1st Term SS1_/F _ N.docx`, SHA-256 `398b0e1f1383e88f7d71148253f8466fbfed95fefdca068907b5ba35083f4ff7` **verified**, 38,569 bytes; equals `SOURCE_ASSIGNMENTS.csv`.
- Method: member extracted privately outside Git; text read from `word/document.xml` with Python `zipfile` + regex over `w:p`/`w:t`. The importer/mammoth output was not generated (deferred). No source bytes or extracts are committed.

## Findings
- Opening heading (first body element, occurs once): `SCHEME OF WORK FOR ALPHA TERM`. It names no subject, class or `1st Term`; there is no `SUBJECT:` or `CLASS:` line anywhere in the document. Term comes from the archive folder.
- Subject confirmed from content, not filename: Week 1 scheme topic "Introduction to food and nutrition"; lesson body begins `WEEK 1 / INTRODUCTION TO FOOD AND NUTRITION`; scheme covers nutrients, vitamins, mineral salts, deficiency symptoms and the digestive system. Not Catering Craft ("Hotel and catering management" is one item in a Week 2 careers list). No handoff needed.
- Header-level only: no week inventory, objectives or hygiene/safety review were performed (see FN-INV-T1). The file contains 6 drawing/pict elements and 3 tables but no embedded media files; these are left to inventory.

## Edits
- Created `backend/src/db/ss1/subjects/food-and-nutrition.json`: PENDING envelope, this one source, `source_alias` rule `SS1-SRC-de2cdd0b85f6-R001` (approval_reference `PENDING-OWNER`; no approval invented), open item `FOOD-AND-NUTRITION-ALIAS-APPROVAL` (OWNER_ACTION, blocks delivery). Lessons, corrections, assets, coverage empty.
- Updated `QUEUE.json`: FN-SRC-T1 → IMPLEMENTED_TESTING_DEFERRED; `status_counts` recomputed; `next_runnable` recomputed from satisfied dependencies.

## Remaining
- Owner alias approval (open item). The source has no coverage yet: blocker stays until indexing.
- Filename variation `F _ N` / `FOOD _ NUTRITION` is not aliased here; T2/T3 record what their own headers show.
- Runnable next: `FN-SRC-T2`, `FN-SRC-T3`, `FN-INV-T1` (all depend only on this item; same-subject edits should run sequentially, T2 first).

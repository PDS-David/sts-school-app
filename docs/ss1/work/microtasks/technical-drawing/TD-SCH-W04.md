# TD-SCH-W04 — Technical Drawing, 2nd Term Week 4 scheme row

Status: **IMPLEMENTED_TESTING_DEFERRED** (source indexing implemented; content approval pending; verification deferred by owner).

## Inputs and dependencies

- Target: `PDS-David/sts-school-app`, branch `master`.
- Starting package contained the registered 2nd Term Technical Drawing source and completed scheme mappings W01–W03. Prerequisites `TD-SRC-T2` and `TD-PRE-T2` are recorded as implemented on the current queue.
- Supplied file: `2ND TERM S1 TECHNICAL DRAWING.docx`, original archive member `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`.
- Source bytes: 2,865,886; SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`. Recomputed against the attachment before editing; it matches both the prompt and the registered source entry.
- The DOCX `word/document.xml` was inspected directly. The exact scheme paragraph occurs once. No source document or private extract was added to the repository.

## Scheme row hash accounting

- Scheme table parsed row 3, label `WEEK 4`, contains the exact 27-character row text: `WEEK 4:        Plain scales`.
- SHA-256 over its exact UTF-8 text: `dc7684f7b356a56c10dbdeefe7f7676a5e72e61d4a8c69a06814ff2ec7e600ab`, matching `docs/ss1/work/SS1-03/evidence/parsed_rows.json` entry `i=3` (length 27).
- The exact full-row anchor occurs **once** in the supplied DOCX XML text. The full row is used, rather than the short phrase alone, to preserve the unique, hash-accounted scheme-row identity.
- Objective recorded verbatim: **“Plain scales”**. This is a scheme-table objective, not a teaching body.

## Existing teaching row binding

- The matching teaching row is parsed row 14, `WEEK FOUR`, titled **“Plain scales and their uses”**.
- Existing original lesson ID (reused without replacement): `SS1-SRC-af4868d2c026:BODY:d9141b54433dff4d82e5eabd00defc9c226eb3f265396382624e1c1da2aac9cd`.
- Its body hash matches the `parsed_rows.json` entry for row 14. The lesson appears on source pages 19–22.
- The teaching row covers the objective at topic level: it defines scale and representative fraction; lists common representative fractions; explains a plain scale and its two units of measurement; and gives worked construction methods for plain scales with different ratios, ranges and subdivisions. It also contains evaluation questions and weekend-assignment work.
- This is existing original-source teaching. No supplement, replacement lesson, or invented answer was added.

## Implementation

1. `backend/src/db/ss1/subjects/technical-drawing.json`
   - Added rule `SS1-SRC-af4868d2c026-R006`, operation `classify_marker`, kind `SCHEME_ONLY`, bound to the registered source SHA and unique Week 4 scheme-row anchor.
   - Added coverage `COV-TD-T2-SCH-W04`, status `SUPPORTED`, objective verbatim and locator/hash recorded, targeting the existing parsed row 14 original lesson ID.
   - Existing rules, source record, lessons, approvals, verification state, and unrelated coverage/open items were retained. Package remains `PENDING`; no whole-package completion is implied.

2. `docs/ss1/work/microtasks/technical-drawing/QUEUE.json`
   - Marked only `TD-SCH-W04` as `IMPLEMENTED_TESTING_DEFERRED`.
   - Recomputed status counts: 6 implemented/testing-deferred, 5 blocked, 28 pending (39 total).
   - Advanced `next_runnable` to `TD-SCH-W05`; removed W04 from `runnable_now`; recorded the implementation reference and review date.

## Checks performed

- Recomputed supplied DOCX byte length and SHA-256; matched the manifest and package.
- Inspected the original DOCX XML and confirmed one exact occurrence of the 27-character anchor.
- Recomputed the scheme-row UTF-8 SHA-256; matched `parsed_rows.json`.
- Checked that the existing teaching-row ID and body hash match the recorded parsed-row evidence.
- Confirmed rule/coverage IDs are unique and references point to the registered source and existing original lesson.
- No source text, source hashes, or unrelated subject files were changed.

## Deferred / limitations

- No full test suite, TypeScript check, importer/compiler run, database script, deployment, or device/runtime check was performed, as directed.
- Content approval remains `PENDING`; verification remains `DEFERRED`. `SUPPORTED` records the source's objective-level teaching match, not teacher approval, factual certification, answer-key review, or successful student delivery.
- The source's construction content and exercises were not independently validated against the cited textbook. Figures and any figure-dependent issues remain outside this single scheme-row task.

## Publication

- Package change: commit `54edac346b11fb480c172f27d4ce7fe0e9ea2c78`.
- Queue update: commit `aa33fba2b6b5590034230b175cd1bd8169cd8177`.
- The implementation note is committed separately after the package and queue updates.
- Stop after TD-SCH-W04. Do not start TD-SCH-W05 until explicitly instructed.

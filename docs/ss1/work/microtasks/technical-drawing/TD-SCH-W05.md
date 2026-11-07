# TD-SCH-W05 — Technical Drawing, 2nd Term Week 5 scheme row

Status: **IMPLEMENTED_TESTING_DEFERRED** (scheme indexing and source mapping implemented; content approval pending; verification deferred).

## Inputs and source identity

- Repository: `PDS-David/sts-school-app`, branch `master`.
- Source: `SS1-SRC-af4868d2c026`; registered member `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`.
- Original DOCX: 2,865,886 bytes; SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`. Recomputed from the supplied DOCX attachment and matches the source registry and task manifest.
- The source DOCX paragraph contains the exact Week 5 scheme row once: `WEEK 5:        Diagonal and chordalScales`. The unique paragraph was inspected in `word/document.xml`; its full 41-character parsed-row identity is independently recorded in `docs/ss1/work/SS1-03/evidence/parsed_rows.json`, entry `i=4`, SHA-256 `8c5c6c7a65e58f85552c3dbf582106d0d999c3459d4fb6aefe6fce7309a57be1`.
- Original source wording is preserved exactly, including the joined spelling `chordalScales`. No editorial correction, source rewrite, or replacement wording was introduced.

## Teaching-row binding

- Existing original teaching row: parsed row 15, `WEEK FIVE`, title **“Diagonal and chordal scale and their uses.”**
- Existing content-bound original lesson ID (reused): `SS1-SRC-af4868d2c026:BODY:2b5d6f2948b4bc9b9684315e7ebcd5ecd033f68849bb19a5e65890ccd435d1cc`.
- The original teaching row's content list identifies (i) meaning and construction of diagonal scales and (ii) scale of chords and its construction.
- The diagonal-scale section explains its three measurement units (centimetres, millimetres and tenths of a millimetre), contrasts its accuracy with a plain scale, and provides construction procedures and examples.
- The scale-of-chords section and its construction are explicitly included in the same Week Five lesson body. The existing teaching row therefore directly covers both parts named by the scheme objective at topic level.
- No new lesson, supplement, or duplicate teaching content was created.

## Implementation

1. `backend/src/db/ss1/subjects/technical-drawing.json`
   - Added source rule `SS1-SRC-af4868d2c026-R007`, operation `classify_marker`, kind `SCHEME_ONLY`, bound to the registered source ID/hash and the exact Week 5 scheme row anchor.
   - Added coverage `COV-TD-T2-SCH-W05`, status `SUPPORTED`, preserving the scheme objective verbatim and binding it to the existing Week Five original teaching-row ID.
   - Existing source, rules, lessons, coverage, open items, and approval/verification states were retained.

2. `docs/ss1/work/microtasks/technical-drawing/QUEUE.json`
   - Updated only `TD-SCH-W05` to `IMPLEMENTED_TESTING_DEFERRED`.
   - Updated status counts and next runnable task to `TD-SCH-W06`.
   - Recorded implementation and review references. No later task was started.

3. `docs/ss1/work/microtasks/technical-drawing/TD-SCH-W05.md`
   - Added this source identity, mapping, implementation and limitation report.

## Checks performed

- Recomputed original DOCX byte length and SHA-256; matched the registered source.
- Inspected `word/document.xml`; confirmed the complete Week 5 scheme-row paragraph and exact objective spelling.
- Matched the 41-character parsed-row length and SHA-256 to `parsed_rows.json` entry `i=4`.
- Confirmed the existing Week Five teaching-row title and body hash from parsed-row evidence.
- Checked the package additions use unique IDs and the registered source/lesson references.
- Re-fetched the package from GitHub after publishing the package change.

## Deferred / limitations

- Full test suite, TypeScript check, compiler/importer run, database operation, deployment and device/runtime verification were not performed.
- Content approval remains pending and verification remains deferred; `SUPPORTED` records the source's objective-level match only.
- The construction methods, diagrams, worked numerical examples and answer-key accuracy have not been independently validated against the cited textbook. Source-referenced figures remain subject to the separate visual-assets tasks.
- No changes were made to shared schema, compiler, source registry, source assignment manifest, checkpoint or handoff files.

## Publication

- Package implementation commit: `359e5cdd14ffc4aff807c8a6704f537d5088838d`.
- Queue update and this report are separate commits.
- Stop after TD-SCH-W05. Do not start TD-SCH-W06 until explicitly instructed.

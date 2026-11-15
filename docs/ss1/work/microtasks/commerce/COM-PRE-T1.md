# COM-PRE-T1 — Commerce First Term preamble and scheme indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source-content approval remains pending; verification remains deferred.

## Source identity and evidence

- Subject: Commerce, SS 1, 1st Term.
- Source ID: `SS1-SRC-d96373071a7e`.
- Original archive member: `SSS 1/1st Term SS1_/1ST TERM S1 COMMERCE.doc`.
- Member SHA-256: `ba6b7fee7987713d60e598066f9f718d1ad042e38e09507a7980b087b577c42a`.
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; both archive and member hashes were checked and recorded in `COM-INV-T1.md`.
- Opening block: extracted-text lines 1–36, SHA-256 `d8658c5c643ff3336b8b240a9c89a6abbdd1a45ba35f2a423ff25ef45cdad092`.
- The block contains the term-note heading, the unique subject/class line, the scheme heading, its tab-aligned column header and twelve rows. It is preamble/scheme material, not an instructional week.

## Scheme-to-body mapping

| Scheme row | Exact scheme label | Line | Corresponding body | Recorded difference |
|---|---|---:|---|---|
| 1 | Meaning, Scope and Functions of Commerce. | 25 | Week One, 39–121 | Body adds history/development and Nigeria/West Africa factors; existing coverage row retained |
| 2 | Occupation | 26 | Week Two, 124–183 | Body adds factors influencing occupation |
| 3 | Production | 27 | Week Three, 186–252 | Body includes a four-line contents list (189–192) |
| 4 | Division of Labour, Specialization and Exchange | 28 | Week Four, 254–325 | No additional difference recorded in inventory |
| 5 | Retail Trade | 29 | Week Five, 328–458 | Body teaches the TRADE chart (341–351) before Retail Trade |
| 6 | Small Scale Retailing | 30 | Week Six, 461–564 | Heading repeats at lines 505 and 516 |
| 7 | Large Scale Retailing | 31 | Week Seven, 567–701 | Body has no CONTENT line |
| 8 | Modern Trends in Retailing | 32 | Week Eight, 704–852 | No additional difference recorded in inventory |
| 9 | Wholesale Trade | 33 | Week Nine, 854–978 | Body adds CHANNEL OF DISTIBUTION |
| 10 | Warehousing | 34 | Week Ten, 980–1063 | Body adds documents used in warehousing |
| 11 | Revision | 35 | No body | Reserved for COM-MARK-T1-SCHEME-REVEXAM |
| 12 | Examination | 36 | No body | Reserved for COM-MARK-T1-SCHEME-REVEXAM |

The body ranges and SHA-256 digests are the exact values recorded in `COM-INV-T1.md`. The opening-block digest binds the scheme rows as one source range; no unsupported per-row digest is claimed.

## Implementation

- Retained `COV-COM-T1-W01-SCHEME-1` from the existing Week One indexing.
- Added `COV-COM-T1-SCHEME-2` through `COV-COM-T1-SCHEME-10` to `commerce.json`.
- Each new record identifies its exact scheme row line, the opening-block digest and the corresponding week body line range/digest.
- New scheme-only coverage records are `UNRESOLVED`: a scheme heading is not evidence that the objective was adequately taught. The corresponding week-indexing task must assess actual instructional support and update objective-level coverage.
- Rows 11–12 are not represented as teaching coverage and remain with the marker-disposition task.
- No source text was changed. No lesson, answer key, parser rule, source approval or verification was invented.

## Validation and limits

- Parsed the pre-change package and queue as JSON before editing; checked new coverage IDs are unique against existing coverage.
- Recomputed queue status counts for the one status transition and removed `COM-PRE-T1` from `next_runnable`; other task statuses were preserved.
- No tests, TypeScript checks, importer/compiler, database or device checks were run; the SS1 owner protocol defers those gates. This is not a student-readiness or subject-completion claim.

## Checkpoint

- Task: `COM-PRE-T1`
- Status: `IMPLEMENTED_TESTING_DEFERRED`
- Changed files: `backend/src/db/ss1/subjects/commerce.json`, `docs/ss1/work/microtasks/commerce/QUEUE.json`, this evidence note.
- Next eligible item: `COM-WK-T1-W02` (subject to current-master refresh and branch ownership check).

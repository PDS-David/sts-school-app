# FN-WK-T1-W01 - Food and Nutrition, 1st Term Week 1 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexed under the existing schema; not approved, not verified, nothing deliverable). Testing deferred by owner.

## Inputs
- Base: `origin/master` `8f9d29ac5f9af50886e04e7db3bd9279687897ec` (pulled fast-forward before the edit). Both prerequisites, `FN-INV-T1` and `FN-SRC-T1`, are `IMPLEMENTED_TESTING_DEFERRED`.
- Source `SS1-SRC-de2cdd0b85f6`, member `SSS 1/1st Term SS1_/F _ N.docx`, 38,569 bytes, SHA-256 `398b0e1f1383e88f7d71148253f8466fbfed95fefdca068907b5ba35083f4ff7` **verified** on the single attached file (the uploaded name differs; the hash decides). The composite archive was not supplied.
- Read with `mammoth` 1.12.2 `extractRawText` in a private scratch directory: 21,131 characters, 865 lines, text SHA-256 `b9bfbdfc1952ef26444e64ed49c529a9e25e5b436ef8881ca0b885ea70c1c8b2`; Week 1 lines 107-153 SHA-256 `f34469bf0472df86f85c5153d24d5e71b4cf734aeeee66718569fd146867ba97`. Both equal `FN-INV-T1`. Source documents and private extracts stay outside Git.
- Line numbers are 1-based over the extract split on `\n`; a block hash is over its lines joined with `\n`, UTF-8, edge blanks trimmed; a single-line hash is the line exactly as extracted. Blank separators in the span: 108, 110, 112, 114, 116, 118, 120, 122 and so on at every second line, and 136-140.

## Week 1 structure as indexed
| Block | Lines | SHA-256 |
|---|---|---|
| Scheme row 1 (number cell 5, topic cell 7) | 5-7 | `e2e7f2edc36afade01d863e15337ac1ebf2ac09cf4dd88d6b9d45442c68888bd` |
| WEEK 1 marker and title | 107-109 | `6cecfd640b105d663f3f09883c00a4ae035ff3e74cf9f6ba6481c8b950d4f46d` |
| Opening 111, definitions of food 113, nutrients 115, nutrition 117 | 111-117 | `a393273033e6e81f6605499e6daaaa9511efcadb1170ba501a9a57e916b7592b` |
| Importance of human nutrition (heading, eight points) | 119-135 | `4d39445b3ca1a44b2163d19791fdb0b1fb63ed8984e983b2ded09cb0c78bddb1` |
| Factors affecting human nutrition (intro, six points) | 141-153 | `db4791d19dee9ae2e42b2c6e3619b5e4128391c76e45a043fa92af7383d1c56e` |
| Whole WEEK 1 body | 107-153 | `f34469bf0472df86f85c5153d24d5e71b4cf734aeeee66718569fd146867ba97` |

Per-line digests: definition lines 113 `c4027be6dc8287c27642c97f5a7658e7ae726ca9457c413980b1370d01e8257c`, 115 `2da598e99435e013cab8900a43d79964ce47fd3c90935960f5995513bf28d9d6`, 117 `10f7ea2bb174a4f6957845ec86266d0c916ac48b6961f37fffdf53c28d12e4b2`; importance points 121-135 and factors 143-153 carry one digest each inside the package entries; the cross-referenced evaluation line 185 is `8eee0f0136f411fa247c88fa5902952dd5024d2cffcf2b371f6695848de8501a`.

## Coverage written in food-and-nutrition.json (7 entries: 6 PARTIAL / 1 UNRESOLVED / 0 SUPPORTED)
All have `lesson_ids: []`; no SUPPORTED entry exists because there is no original lesson id for this source and no authored lesson.
- PARTIAL: `COV-FN-T1-W01-SCHEME-1`, `-OPENING` (line 111), `-DEFINITION-FOOD` (113, 115), `-DEFINITION-NUTRITION` (117, printed duplication preserved), `-IMPORTANCE` (eight points, 121-135), `-FACTORS` (six label-only points, 143-153).
- UNRESOLVED: `COV-FN-T1-W01-ASSESSMENT` - Week 1 carries no assessment of its own.
No entry was upgraded on the strength of the scheme row.

## Assessment census
- Inside lines 107-153 there is no EVALUATION, WEEKEND ASSIGNMENT, THEORY, READING ASSIGNMENT or SECTION B block: a case-insensitive scan for evaluation, assignment, theory, question, exercise, answer, mark and section b returns 0 hits.
- The only evaluation about this content is line 185, exact wording `Evaluation: mention the importance of human nutrition.`, printed at the end of the Week 2 block (155-185). It is recorded as a cross-reference only; `FN-WK-T1-W02` owns it. No key, model answer or marks exist for it.
- Safety: the Week 1 body contains no dose, treatment, cure, practical or classroom observation (scanned); none was recorded or added.

## Open items written (5 new; 3 block delivery)
`FOOD-AND-NUTRITION-T1-W01-COVERAGE`, `-NO-ASSESSMENT`, `-NUTRITION-CLAIMS` (blocking); `-THIN-TEACHING`, `-SOURCE-DEFECTS` (non-blocking). The two alias `OWNER_ACTION` items are untouched, so `open_items[]` holds 7 entries.

## Queue edits
- `FN-WK-T1-W01` set to `IMPLEMENTED_TESTING_DEFERRED`; other fields unchanged.
- Appended `FN-FACT-T1-W01-TEACHER-DECISIONS` (BLOCKED, four decisions) and lesson tasks `FN-LES-T1-W01-DEFINITIONS`, `FN-LES-T1-W01-IMPORTANCE-FACTORS` and `FN-LES-T1-W01-ASSESSMENT` (PENDING). `FN-FACT-T1-NUTRITION-CLAIMS` was not edited; it does not list the Week 1 claims, which the open item `-NUTRITION-CLAIMS` records.
- Counts and `next_runnable` recomputed from the 49 items: {IMPLEMENTED_TESTING_DEFERRED: 6, PENDING: 41, BLOCKED: 2}. The stored 37-entry list included the deferred `FN-TEST-PACKAGE`; it is excluded now. `FN-WK-T1-W01` and `FN-TEST-PACKAGE` left the list and two lesson tasks entered, so it still has 37 entries. The queue file has no trailing newline and that was preserved.

## Checks performed
- Attachment SHA-256 recomputed; extraction reproduced the recorded counts and digests of `FN-INV-T1`.
- Every SHA-256 written into the package, queue and this record re-derived by an independent verifier from the range printed beside it.
- JSON round-trips; schema mirrored by hand (strict keys, vocabularies, non-blank text, non-empty `affected_ids`); duplicate-id and dangling-reference guards.
- Source scans recomputed from the extract: no assessment words and no dose or treatment words in 107-153; line 185 wording.

## Not done / remaining gaps
- No lesson, coverage upgrade, correction, asset, rule or source edit; `package_status` stays PENDING. Week 1 is indexed, not taught and not certified.
- Importer, plan build, tests, typechecks, database and deployment were not run (deferred by owner).
- Owner actions needed: the four `FN-FACT-T1-W01-TEACHER-DECISIONS`, `FN-FACT-T1-NUTRITION-CLAIMS`, the alias approvals and content approval.

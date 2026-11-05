# COM-WK-T1-W01 — Commerce, 1st Term Week 1 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexed under the existing schema; not approved, not verified, nothing deliverable). Testing deferred by owner.

## Inputs
- Base: current `origin/master` `b29de195cf68f1b02b39b7a29cc3821940db7cb4`, isolated branch `ss1/com-wk-t1-w01` (started at `a665934c6cf89ea9ea0cbacb5d9e77abc9809e5e` and fast-forwarded after Physics PR #329 merged; that merge touches only `physics.json`, the Physics queue and the Physics record, none of which this item writes). No `AGENTS.md` exists anywhere in the tree (tracked-file search: 0 hits). Both prerequisites are `IMPLEMENTED_TESTING_DEFERRED`: `COM-SRC-T1` (source registered) and `COM-INV-T1` (locator method, ranges, assessment census). `gh pr list --state open` returned no open PR when the branch was prepared, so nothing else is in flight against these paths.
- Source `SS1-SRC-d96373071a7e`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 COMMERCE.doc`, 1,166,848 bytes, SHA-256 `ba6b7fee7987713d60e598066f9f718d1ad042e38e09507a7980b087b577c42a` **verified** against the queue item and `SOURCE_ASSIGNMENTS.csv`, from the composite archive `SSS 1-20260507T072431Z-3-001 (1).zip`, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` **verified**.
- Working copy read with `word-extractor` 1.0.4 `extract(path).getBody()` (the importer legacy `.doc` call) in a private scratch directory: 57,453 characters, 1,064 lines, 873 non-blank, text SHA-256 `fa0ff13e0ee6cfd8d60b0f4674542c628c0f52c1720fc1e533123def69bfe035`; Week One lines 39-121 SHA-256 `80762112630c0de4a9d919f58346945accdc800fa04a774d338059a0d74a78c1`; opening block lines 1-36 SHA-256 `d8658c5c643ff3336b8b240a9c89a6abbdd1a45ba35f2a423ff25ef45cdad092`. All three equal the values recorded by `COM-INV-T1` and by the queue item.
- Files read before editing: `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md`, `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `backend/src/db/ss1/subjects/commerce.json`, `docs/ss1/work/microtasks/commerce/QUEUE.json`, `COM-INV-T1.md`, `COM-SRC-T1.md`. Source documents and extracts are kept outside Git.

## Locator method (unchanged from COM-INV-T1)
Line numbers are 1-based over `getBody()` text split on `\n`. A block runs from its marker line to the last non-blank line before the next marker; the SHA-256 is over those lines joined with `\n`, UTF-8, with edge blank lines trimmed and no trailing newline. Tabs and trailing spaces are kept exactly as extracted. The unlabelled opening block digest is over the raw lines 1-36 including its blanks, as `COM-INV-T1` records it. No numbering was changed.

## Week 1 structure as indexed
| Block | Lines | SHA-256 |
|---|---|---|
| WEEK ONE + topic line | 39-40 | `3b8fc8307dfeaab4a8374876db854a81699c0021ad88b929eb084225121a3251` |
| CONTENT outline (3 items) | 41-44 | `ef4c47defeb3f6680086a9fe61944fea9e329a67f1b63c851d9f603a4166831c` |
| DEFINITION OF COMMERCE | 46-47 | `4ec1bf60f04ac99073196624522062ba6966162862a462197c3b613ff9eac666` |
| THE IMPORTANCE (FUNCTIONS) OF COMMERCE (6) | 49-55 | `dacdaa4698537288b3ded4822fb399e89d2d21ee39d4c9b1a2b101b9ddb564ea` |
| STAGES IN THE HISTORY AND DEVELOPMENT OF COMMERCE (5) | 57-62 | `1d78bd4fa7aaaad4bac6e267978fd920d15adc175e605cb014374c2c392d59e8` |
| EVALUATION (2 questions) | 64-66 | `39689b4c09a1ec53462577b45582624fb5b091b155a8a61ab9a3c7c2902a1e61` |
| FACTORS THAT DELAYED THE DEVELOPMENT (9) | 68-77 | `9503db42af76cb880f2741c53771fc87e68e1e897404cb815223874f69c12c9e` |
| FACTORS THAT HAVE CONTRIBUTED TO THE GROWTH (7) | 79-86 | `af6486a06a43079209c8af6cdb04c66f6b3d050c0423b6483dafc9497122b65f` |
| DIVISIONS OF COMMERCE (2 + 7 aids) | 88-94 | `bc14d17c53079bd8639ccc03463d8ff3d25674539bd11acc1065579139450ea4` |
| EVALUATION (2 questions) | 96-98 | `b2c511354a5f934ad44b2f9b6ffd4f693119ed18907e4fcab22a9f7e25f5d522` |
| READING ASSIGNMENT (2 references) | 100-102 | `66f0f7a68f43db2864a9a188174b92517decf1ce81ced645435d2b162552d2a7` |
| WEEKEND ASSIGNMENT (5 MC) | 104-110 | `72d0834d8f4ad8f1dffde34ff8a6f1c34a098350fcff059bbc8067f8eee43911` |
| THEORY (2 questions) | 112-114 | `3a9f34003d3c890cb7f21a83e66abbdb113d781b89fde9e7550113edd420834a` |
| GENERAL EVALUATION (5 questions) | 116-121 | `9c8dff3b9815bc5dd94131c8d794435aa05a11a5ddc9bfb5415043e44e0c2d09` |

The marker `WEEK ONE` is at line 39 and the next marker `WEEK TWO` at line 124, so the week range 39-121 and every block digest above are inside it. Line 115 holds a single space and separates THEORY from GENERAL EVALUATION.

## Coverage written in commerce.json (14 entries: 7 PARTIAL / 7 UNRESOLVED, 0 SUPPORTED)
Every entry has `source_id` `SS1-SRC-d96373071a7e` and `lesson_ids: []`, because `lessons[]` length is 0, the importer has not been run, and this source has no parsed row in `docs/ss1/work/SS1-03/evidence/parsed_rows.json` (the ten sources listed there do not include Commerce).

- `COV-COM-T1-W01-SCHEME-1` — **PARTIAL** — Scheme row 1 of the 1st Term Commerce scheme of work: 'Meaning, Scope and Functions of Commerce.'
- `COV-COM-T1-W01-MEANING` — **PARTIAL** — The meaning of commerce: a definition of the subject
- `COV-COM-T1-W01-FUNCTIONS` — **PARTIAL** — The importance (functions) of commerce
- `COV-COM-T1-W01-SCOPE` — **UNRESOLVED** — The scope of commerce, named in scheme row 1 and repeated in the week's topic line
- `COV-COM-T1-W01-HISTORY` — **PARTIAL** — Stages in the history and development of commerce
- `COV-COM-T1-W01-DELAYED-FACTORS` — **PARTIAL** — Factors that delayed the development of commerce in Nigeria and West Africa
- `COV-COM-T1-W01-GROWTH-FACTORS` — **PARTIAL** — Factors that have contributed to the growth of commerce in Nigeria and West Africa
- `COV-COM-T1-W01-DIVISIONS` — **PARTIAL** — Divisions of commerce: trade and aids to trade, with the aids subdivided
- `COV-COM-T1-W01-EVALUATION-1` — **UNRESOLVED** — The first EVALUATION of Week 1: two questions on the definition and the functions
- `COV-COM-T1-W01-EVALUATION-2` — **UNRESOLVED** — The second EVALUATION of Week 1: essentiality and the principal divisions
- `COV-COM-T1-W01-READING-ASSIGNMENT` — **UNRESOLVED** — The READING ASSIGNMENT: two external textbook readings set for the week
- `COV-COM-T1-W01-WEEKEND-ASSIGNMENT` — **UNRESOLVED** — The WEEKEND ASSIGNMENT: five multiple-choice questions
- `COV-COM-T1-W01-THEORY` — **UNRESOLVED** — The THEORY block: two structured questions on ancillary services and transport
- `COV-COM-T1-W01-GENERAL-EVALUATION` — **UNRESOLVED** — The GENERAL EVALUATION: five un-numbered end-of-week structured questions

The six body sections (meaning, functions, history stages, delaying factors, growth factors, divisions) are PARTIAL: the source teaches them, as lists, and nothing is deliverable. The seven UNRESOLVED entries are the scope promise plus the five assessment blocks and the reading assignment. No entry was upgraded on the strength of a scheme heading, an outline line or one objective.

## Question census (16 questions, all indexed, none answered)
- EVALUATION (lines 64-66): 2 questions; EVALUATION (96-98): 2; WEEKEND ASSIGNMENT (104-110): 5 multiple-choice, with question 3 options split as (a)-(c) on line 107 and (d) alone on line 108; THEORY (112-114): 2; GENERAL EVALUATION (116-121): 5 un-numbered. READING ASSIGNMENT (100-102) adds 2 textbook references.
- Per-question line digests: 65: `fbf0da554152ba9962fe58d7a180f66c50f75d1304ab59283ea2ae8b9bc98c6f`; 66: `aed19bad8311b2e003b103b58359edba177360292c20d8e01c175af4bfe0710c`; 97: `afa201509fd0d2023e1c1598ba00941f38a258fd226ab6eff9b3dd33d829fa10`; 98: `6f6880e154ecf916537157bcb141c3843fd5d21deed207f469b21252d03cadb9`; 105: `e2d0949c01b3fb9a0ab1199a8a467ac29111558ea49ab93ee28a68469a4b0660`; 106: `a625f13fced5b3e058c5f9ee048cc1fa6e06d0140f133ab6a406f0a18c442eb3`; 107: `b15537ecd281fdbce79a45051c5a7665d863351d254e673a8a09ae99cfdd86f3`; 109: `6b35595dcb9b4280baa56ebbaf94bc008981ed8def6a38971d5bfcc3eeb6a35f`; 110: `862ef5f63cc1120b089c108506b99a04959ff79673b512b3dfb8198f635bd3dd`; 113: `481875116e67b70c4547902671ee06a40c24899be95421d077ba13294c63856f`; 114: `0b510266c2aea6ba5f1c5ce2cf096eff0497ebaf989a0e1befde6984673494e6`; 117: `4362a5fdd3fd12a306b0586d3ec3f83b1d7f6e2b89d2344f887c106c5d4d54a1`; 118: `fec163ac41c06210c585c672e360d919ab9ca71d76d620c2c987d97129ee4970`; 119: `38300e34eccebb820a25600b1b3da3bdb2d36a2beca4004ddd5231a18345a340`; 120: `1ad0885841bf007983b1dab4a7b88ca898e95941b9546cc88175f0743b2e5d2c`; 121: `c9e0aeefefbab81a56f25bbf10943bbc56dfd7b52a4701a201946946e6a70f47`.
- No answer key, worked answer, marking scheme, mark allocation, score or rubric exists anywhere in the document: a case-insensitive scan of the whole extract finds no occurrence of answer, marking, score, rubric or "scheme of mark" at all, and the single "marks" hit is line 746, inside Week Eight branding text. Within lines 39-121 none of the six words occurs. No option letter was marked correct and no ranking was supplied here.

## What the source does not teach (searched across the whole extract, not assumed)
- scope: occurs on 3 lines in the extract; inside Week 1 (39-121) it appears on line 40. The other two hits are the scheme row (25) and a Week Four question (323); no Week 1 line states what the scope of commerce is, so the promise carried in the scheme heading has no source content behind it.
- ancillary: occurs on 2 lines in the extract; inside Week 1 (39-121) it appears on lines 113 and 118 — both are assessment lines (THEORY 1, GENERAL EVALUATION 2). The teaching never uses the word: lines 91-94 name seven "Aids to trade" (transport, insurance, banking and finance, advertising, warehousing, communication, tourism) and explain none of them, so those questions ask for a term and explanations Week 1 does not supply.
- relative importance: occurs on 1 line in the extract; inside Week 1 (39-121) it appears on line 98 — the phrase exists only inside the EVALUATION question that asks for it; nothing in the week ranks the six functions.
- basic want: occurs on 1 line in the extract; inside Week 1 (39-121) it appears on line 110 — the very line is Weekend question 5, and the classification that question assumes is never taught anywhere in the term.
- transport: occurs on 14 lines in the extract; inside Week 1 (39-121) it appears on lines 83, 93, 105, 107, 110, 114 and 121. A case-sensitive scan for an upper-case teaching heading containing TRANSPORT returns 0 hits in the whole document, so THEORY 2 (114) and GENERAL EVALUATION 5 (121) have no Week 1 answer; transportation is taught from the 2nd Term source.
- advertis: occurs on 21 lines in the extract; inside Week 1 (39-121) it appears on lines 85, 93, 107, 109 and 119. Every Week 1 hit is a list item or a question; no ADVANTAGES OF ADVERTISING teaching block exists anywhere in the term, so GENERAL EVALUATION 3 (119) has no answer in this week.
- warehous: occurs on 46 lines in the extract; inside Week 1 (39-121) it appears on lines 84, 94, 105, 109 and 120. GENERAL EVALUATION 4 (120) points at Week Ten, where the teaching actually sits under `TOPIC: WAREHOUSING` (981), `IMPORTANCE OF WAREHOUSING` (991), `TYPES OF WAREHOUSING` (1001), `FACTORS TO BE CONSIDERED IN SITTING A WAREHOUSE` (1021) and `DOCUMENTS USED IN WAREHOUSING` (1033): out-of-week content, recorded as an open item instead of imported into Week 1.
- history block lines 58-62 contain no digits, no century and no era wording, so the five stages are undated; the nine delaying and seven growth factor lines are bare noun phrases with no explanation, date or attribution.

## Open items written (10 new; 7 block delivery, 3 do not)
- `COMMERCE-T1-W01-COVERAGE` (CONTENT, blocking)
- `COMMERCE-T1-W01-SCOPE-GAP` (CONTENT, blocking)
- `COMMERCE-T1-W01-OUTLINE-GAP` (CONTENT, non-blocking)
- `COMMERCE-T1-W01-HISTORY-FACTS` (FACT, blocking)
- `COMMERCE-T1-W01-ASSESSMENT-NO-KEY` (CONTENT, blocking)
- `COMMERCE-T1-W01-OUT-OF-WEEK-ITEMS` (CONTENT, blocking)
- `COMMERCE-T1-W01-ASSESSMENT-SCOPE` (CONTENT, blocking)
- `COMMERCE-T1-W01-READING-RIGHTS` (PERMISSION, blocking)
- `COMMERCE-T1-W01-HEADING-AMBIGUITY` (CONTENT, non-blocking)
- `COMMERCE-T1-W01-SOURCE-DEFECTS` (CONTENT, non-blocking)

## Queue edits
- `COM-WK-T1-W01` set to `IMPLEMENTED_TESTING_DEFERRED` with a computed `implementation_reference`; its `completion_condition`, `week_or_locator`, `required_files`, `required_attachments` and `allowed_write_paths` are unchanged.
- Appended `COM-FACT-T1-W01-SCOPE` (FACTUAL_DEPENDENCY, BLOCKED: seven numbered decisions) and the lesson tasks `COM-LES-T1-W01-SCOPE`, `COM-LES-T1-W01-KEY-ASSESSMENT` and `COM-LES-T1-W01-ANCILLARY-SERVICES` (LESSON, PENDING), each with the verified member and archive hashes and the same three allowed write paths.
- `counts`, `status_counts` and `next_runnable` recomputed from the items, not hand-edited: 45 items, {"IMPLEMENTED_TESTING_DEFERRED":6,"PENDING":37,"BLOCKED":2}, next_runnable 31 entries. The derivation rule (PENDING with every dependency IMPLEMENTED_TESTING_DEFERRED, in item order) was first proved to reproduce the stored 31-item list before any edit, so the change is attributable: `COM-WK-T1-W01` left the list, `COM-FACT-T1-HISTORY-NIGERIA` entered it, and the four appended items wait on the blocked decision item. This queue has no `total` or `runnable_now` key and none was added. One note appended.

## Checks actually performed
- Member and archive SHA-256 recomputed from the supplied files; extraction re-run from the member and byte-identical to `COM-INV-T1` counts and hashes.
- A separate verifier re-extracted the member from disk and re-derived every SHA-256 written into the package from the stated line ranges: 127 digest references, 0 mismatches, including the week digest and the scheme row digest.
- Package mirror-checked field-for-field against `subjectPackageSchema.ts` (strict keys, status and kind vocabularies, digest pattern, non-blank text, `affected_ids` non-empty): valid; JSON re-parses and re-serialises identically; CRLF file ending preserved.
- Compiler-rule mirror: no `SUPPORTED` entry was claimed, every `lesson_ids` list is empty so no `coverage target` assertion can fail, and a plan run for this package would emit 26 blockers (2 `SOURCE_WITHOUT_COVERAGE` for the untouched 2nd and 3rd Term sources, 14 `INCOMPLETE_COVERAGE`, 10 `OPEN_ITEM` of which 3 are the pre-existing alias items and 7 are new). Nothing was marked ready.
- Duplicate-id guard on coverage, open items and queue items; dangling-reference guard on every `affected_ids` value and on every id quoted in the new queue texts.
- Leak scan over this record and the added package text: none of the source document-property values (author, last-saved-by, title, company), no e-mail, telephone or publisher-advertisement wording, no credential pattern, no run of ten or more digits outside a 64-character digest, and no verbatim source passage longer than a heading label — the only source strings reproduced here are upper-case heading lines quoted as locators, the scheme row wording inside a coverage objective, and the short phrase "Aids to trade". A verifier re-tests each of these claims against the record itself and against a fresh extraction.
- `git status` after the edit shows exactly three changed paths: `backend/src/db/ss1/subjects/commerce.json`, `docs/ss1/work/microtasks/commerce/QUEUE.json` and this record.

## Not done / remaining gaps
- No lesson, correction, asset, parser rule or source edit: `lessons[]`, `assets[]` and `delivery_corrections[]` stay at length 0 and `source_rules` stays at 3. `package_status` stays PENDING.
- Week 1 is indexed, not certified and not taught: 7 PARTIAL objectives still need deliverable lessons and 7 UNRESOLVED objectives still need teacher decisions, a key, rights or dated history.
- The importer, plan build, schema parse, tests, typechecks, database and deployment were not run (deferred by owner); no merge.
- The 2nd Term and 3rd Term Commerce sources still have no coverage at all, and the three alias `OWNER_ACTION` open items remain blocking.
- Owner actions this record does not take: `COM-FACT-T1-W01-SCOPE` decisions, `COM-FACT-T1-HISTORY-NIGERIA` dated sources, `COMMERCE-T1-W01-READING-RIGHTS` on the two cited textbooks, and `COM-FACT-CONTENT-APPROVAL` before any lesson becomes deliverable.

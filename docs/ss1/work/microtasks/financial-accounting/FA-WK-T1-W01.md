# FA-WK-T1-W01 - Financial Accounting, 1st Term Week 1 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (indexed under the existing schema; not approved, not verified, nothing deliverable). Testing deferred by owner.

## Inputs
- Base: `origin/master` `c4c817e9b00e5dee6f83f8ec813ce2a187b2eed1` (pulled fast-forward before the edit). Both prerequisites, `FA-INV-T1` and `FA-SRC-T1`, are `IMPLEMENTED_TESTING_DEFERRED`.
- Source `SS1-SRC-cf77df509ac3`, member `SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx`, 1,166,213 bytes, SHA-256 `c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb` **verified** on the single attached file (the uploaded name differs; the hash decides). The composite archive was not supplied.
- Read with `mammoth` 1.12.2 `extractRawText` (the importer's `.docx` call) in a private scratch directory: 41,252 characters, 1,691 lines, text SHA-256 `8b5d32570047a689876a556a6492f95d6a6c1847413aef9d34b04e15a74b7686`; Week One lines 65-263 SHA-256 `9c7f09369d4ed8878008d314426d26e60575fde599764f2cd6b6e1849d6f7e17`. Both equal `FA-INV-T1`. Source documents and private extracts stay outside Git.
- Line numbers are 1-based over the extract split on `\n`; a block hash is over its lines joined with `\n`, UTF-8, edge blanks trimmed; a single-line hash is the line exactly as extracted.
- **Line-number note.** The task prompt quotes older offsets for the early blocks (definitions 79-81, differences 85-93, users 97-179). The extract's own numbers are used here and the whole-body digest matches: definitions 83 and 87, differences 91-101, users 105-181. Later blocks agree with the prompt within a few lines. `FA-FACT-T1-DATED-REFERENCES` carries the same older offsets; the correct ones are recorded in open item `FINANCIAL-ACCOUNTING-T1-W01-DATED-CLAIMS` and that queue item was not edited.

## Week 1 structure as indexed
| Block | Lines | SHA-256 |
|---|---|---|
| WEEK ONE marker and topic line | 65-67 | `b222948c18a90f5fb588f232c729b18fec83c60eee488cab027ae3252d37d09b` |
| CONTENT outline (five items) | 69-79 | `7d99af84cb342f6099c2ece99762deb98850b530a3d3e517f536b5f17c394b3c` |
| Definitions (book-keeping 83, accounting 87) | 83-87 | `fcc1f91a2ae6b3b90483c5246043dd5d42c87b06bde13e043db43076d8b0e954` |
| DIFFERENCES (five) | 91-101 | `dbd871e84380bf864c9d6c5d8fefe3c4ba77c8094779b34ae27daa05180ea750` |
| USERS OF ACCOUNTING INFORMATION (intro 107, ten groups) | 105-181 | `0cd0f37a76d8fd69cfac4c823354b0da3eed32ea28bcff0b8751c3d8b07fe231` |
| EVALUATION QUESTIONS (heading, 2 questions) | 185-189 | `6af921ada2622cc14b99286d3660f3f8e7e022965458b7519fd93e017fab815e` |
| IMPORTANCE (nine reasons) | 193-211 | `0dad229a1ccc08acf0fa135ebe5048eea4601a2b94770b5e856f85de7db9d00a` |
| HISTORY (three paragraphs) | 215-225 | `9d022a5ff3a681da68100b5282b04f8960479ffead7a1c0b71427216fcfd7369` |
| EVALUATION QUESTIONS (heading, 2 questions) | 229-233 | `886d3384b20f6b1c61968ba244fd5facbf339e471eb3237f95ee47be0d2c93cf` |
| READING ASSIGNMENT | 237-239 | `d94ab390434443955418a0832124f82e2540ec4a50c30cc687334044bcacfae0` |
| WEEKEND ASSIGNMENT (five items) | 243-253 | `4a99a2378f0afa25f930aefb648b187a8b50d2935e0729dc1c407f8a2bf4acf1` |
| THEORY (heading, 3 questions) | 257-263 | `243d375e29f98b8fc2d68efdb86bbe203b3af5a86131548098756d8542eac1e4` |
| Whole WEEK ONE body | 65-263 | `9c7f09369d4ed8878008d314426d26e60575fde599764f2cd6b6e1849d6f7e17` |

## Coverage written in financial-accounting.json (11 entries: 6 PARTIAL / 5 UNRESOLVED / 0 SUPPORTED)
All have `lesson_ids: []`; no SUPPORTED entry exists because there is no original lesson id for this source and no authored lesson.
- PARTIAL: `COV-FA-T1-W01-SCHEME-1` (scheme row 1, line 47), `-DEFINITIONS`, `-DIFFERENCES` (five), `-USERS` (ten groups), `-IMPORTANCE` (nine reasons), `-HISTORY` (three paragraphs, dated claims).
- UNRESOLVED: `-EVALUATION-1`, `-EVALUATION-2`, `-READING-ASSIGNMENT`, `-WEEKEND-ASSIGNMENT`, `-THEORY`.
No entry was upgraded on the strength of the scheme row or the CONTENT outline.

## Question census (12 questions, one reading pointer; none answered)
| Line | Where | Wording | SHA-256 |
|---|---|---|---|
| 187 | EVALUATION 1, Q1 | 'Define the following terms:a. Book-keeping   b. Accounting ' | `c7c0aa0ade6483d2ed18d6e3560da3daf684beec18f91169768409262e3dd9f8` |
| 189 | EVALUATION 1, Q2 | 'State three differences between book-keeping and accounting ' | `de6152dcd45863f5826cbfde684da01a71686b605351991d98fe81012eb6b581` |
| 231 | EVALUATION 2, Q1 | 'List five benefits of book-keeping and accounting.' | `d6044dbcbe04b8ad0f3ff38da6f92de87b1756b67575d9383f1ff8e44b93d873` |
| 233 | EVALUATION 2, Q2 | 'State four duties of an accountant in a business organisation ' | `ebd3286543fe9223d459dcf86305f83743b45b635797d6e337fac9f92beaf093` |
| 245 | WEEKEND item 1 | 'The systematic recording of business transactions in monetary terms is   A. auditing    B. book-keeping   C. debiting    D. crediting ' | `3d57c4ff86ed8fa64f46a028a1206828c429896b4f804d3a13b31af5f63c15d3` |
| 247 | WEEKEND item 2 | 'Financial accounting information is for    A. internal use only     B. external use only       C. business use only    D. internal and external use ' | `8be48185dfbe8edaf5d97501de75deba062813ac67fa7b08ca2224c9eba008f2` |
| 249 | WEEKEND item 3 | 'Which of the following is not a purpose of financial accounting     A. determining profit    B. fixing prices     C. credit dealings    D. determining cash balance ' | `89cb1b8ed8a7218b4192febb4c6b6373bd054a33bd394507afc8a417261323b6` |
| 251 | WEEKEND item 4 | 'The fourth stage of the accounting information system is    A. recording     B. summarizing    C. interpreting      D. classifying ' | `bb8833c3d1ee1c5e07d9dd5df2862719c20cd1778c1b4e35fc4cbad3a2721d69` |
| 253 | WEEKEND item 5 | 'The double entry principle of accounting was developed by   A. Frank Wood      B. Akintola Williams    C. Luca Pacioli     D. William Pickles ' | `a73c0dcb2c99f2a1f255d01c81b0f2d388ffe4079ceba6e1c12f51e915dc83c2` |
| 259 | THEORY a | 'a. What is book-keeping?' | `596603304d7e37eee4606cf684d0be1de60b721e443765643b11884966cd3d6c` |
| 261 | THEORY b | 'b. Give five reasons why accounting records are kept.' | `7dd034a2d75f66e4b3a768a92e4746269aa463b284314ae7600b6a525c367562` |
| 263 | THEORY 3 | 'List eight users of accounting information.' | `6991c96a04ab46d7a6710d224b449a040bae0142d641f8ab172d0b746c0d1849` |

- Reading pointer: line 239, SHA-256 `0cf8a7ee2bed6046b20e31c89ae670fdb33a8b2e36508b252ec17ae3b09150f8`.
- A case-insensitive scan of lines 65-263 for answer, marking, marks, score, rubric and scheme of mark returns 0 hits: no key, marks or marking wording. No option letter was marked correct.

## What the source does not teach
- Duties of an accountant (line 233): duty and duties occur only in the question.
- Stages of the accounting information system (line 251): the word occurs only there; line 87 gives six verbs but never calls them stages.
- Weekend item 3 (line 249): determining cash balance is never taught; fixing prices and credit dealings appear only as other users' purposes.
- Dated claims (221, 225), regulator abbreviations (165, 175) and the training-time claim (97) are routed to `FA-FACT-T1-DATED-REFERENCES` and not verified here. The external reading (239) is routed to `FA-FACT-T1-EXTERNAL-MATERIALS`.

## Open items written (8 new; 6 block delivery)
`FINANCIAL-ACCOUNTING-T1-W01-COVERAGE`, `-DATED-CLAIMS`, `-UNANSWERED-QUESTIONS`, `-WEEKEND-AMBIGUOUS-ITEMS`, `-ASSESSMENT-NO-KEY`, `-READING-EXTERNAL` (blocking); `-COUNT-CHOICES`, `-SOURCE-DEFECTS` (non-blocking). The two alias `OWNER_ACTION` items are untouched, so `open_items[]` holds 10 entries.

## Queue edits
- `FA-WK-T1-W01` set to `IMPLEMENTED_TESTING_DEFERRED`; other fields unchanged.
- Appended `FA-FACT-T1-W01-TEACHER-DECISIONS` (BLOCKED, six decisions) and lesson tasks `FA-LES-T1-W01-DEFINITIONS-DIFFERENCES`, `-USERS`, `-IMPORTANCE`, `-HISTORY` (waits on `FA-FACT-T1-DATED-REFERENCES`), `-ACCOUNTANT-DUTIES` and `-KEY-ASSESSMENT` (PENDING).
- Counts and `next_runnable` recomputed from the 53 items: {IMPLEMENTED_TESTING_DEFERRED: 6, PENDING: 45, BLOCKED: 2}. The stored 35-entry list included the deferred `FA-TEST-PACKAGE`; deferred TEST tasks are excluded, so the new list has 36 entries (`FA-WK-T1-W01` and `FA-TEST-PACKAGE` left; three lesson tasks entered).

## Checks performed
- Attachment SHA-256 recomputed; extraction reproduced the recorded counts and digests of `FA-INV-T1`.
- Every SHA-256 written into the package, queue and this record re-derived by an independent verifier from the range printed beside it.
- JSON round-trips; schema mirrored by hand (strict keys, vocabularies, non-blank text, non-empty `affected_ids`); duplicate-id and dangling-reference guards; every new open item and coverage entry is named by a queue item or open item.
- Source-census guards recomputed from the extract: 12 questions, ten user groups, five differences, nine reasons, the 0-hit key scan, and the hit lists for duty, stage and the weekend-option topics.

## Not done / remaining gaps
- No lesson, coverage upgrade, correction, asset, rule or source edit; `package_status` stays PENDING. Week 1 is indexed, not taught and not certified.
- Importer, plan build, tests, typechecks, database and deployment were not run (deferred by owner).
- Owner actions needed: the six `FA-FACT-T1-W01-TEACHER-DECISIONS`, `FA-FACT-T1-DATED-REFERENCES`, `FA-FACT-T1-EXTERNAL-MATERIALS`, the alias approvals and content approval.

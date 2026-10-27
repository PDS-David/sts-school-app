# ENG-WK-T1-W02 — English, 1st Term, Week 2 (indexing)

Status: **IMPLEMENTED_TESTING_DEFERRED** — indexing is complete. Its content gaps are **not** closed.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Starting SHA: `c48a012225c4b142bb6515a2fd8e5bf4d440509e` (origin/master), isolated branch `ss1/eng-wk-t1-w02`.
- Archive `SSS 1-20260507T072431Z-3-001 (1).zip` supplied as one file (received as `SSS_1-20260507T072431Z-3-001__1_.zip`); SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` verified, matching the queue.
- Member `SSS 1/1st Term SS1_/1ST TERM S1 ENGLISH LANGUAGE.doc`, SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef` verified; matches `SOURCE_ASSIGNMENTS.csv` and source ID `SS1-SRC-a00657d42196`.
- Text extracted privately with the repository's own extractor (`word-extractor`, `getBody()`), the existing rules for this source applied, then split with the same WEEK-marker logic as `parseTopics` in `backend/src/db/ingestTopics.ts`, so locators match the importer's input. Nothing from the source is committed. The importer itself was not run.
- Subject directory: the prompt's slug `English` resolves to the repository directory `english` (lower case).
- Open PRs: none (GitHub API listed 0 open); no branch for this item existed. PR71's foundation was not used. Prerequisite ENG-SRC-T1 is implemented.

## Week 2 rows (reproduced, hashes match the existing coverage)
| Row | Label | Body SHA-256 |
|---|---|---|
| ENGLISH-BODY-004 | `WEEK TWO` (comprehension, religion) | `3e5b19ca3d9197f9adbcde08a2f0d6b08ed471bcbea63fa53f87eb17e9bfe3e5` |
| ENGLISH-BODY-005 | `WEEK 2` B (phrasal verbs) | `3bf9e57695b44faa72ac28d81de2c17c964ead8b92356981b6d4fb3bb088f781` |
| ENGLISH-BODY-006 | `WEEK 2` C (adverb, conjunction, preposition) | `dbf347f04ca688cade8a116abfbf8283b1489acfc218054d5664c59a632f4adf` |
| ENGLISH-BODY-007 | `WEEK 2` D (library vocabulary) | `ecb99bd6ceeaf6fa93a91b083b03bc06f1ddcc7605164be60de6c81d9ca64267` |

Every new coverage `objective_locator` is `<body id> :: from '<exact start text>' to before '<exact end text>'` (or `to end of body`). Each anchor was checked to occur exactly once in its body.

## Scheme row 2 → entries
| Scheme objective | Entries |
|---|---|
| Comprehension, reading skills; word meanings in context (Unit 3, pp. 54-55) | CM01 (passage), CM02 (word meanings), CM03 (evaluation) |
| Structure: introduction to phrasal verbs | PV01-PV05 |
| More on parts of speech: adverb, conjunction, preposition | AV01-AV03, CJ01-CJ04, PP01-PP03 |
| Vocabulary development: words associated with libraries | LB01-LB05 |

All entry IDs are prefixed `ENGLISH-T1-W02-`.

## Outcome (24 new entries; ENGLISH-BODY-004..007 kept as PARTIAL row-level entries pointing at them)
- **SUPPORTED (9):** PV01, PV03, PV04, AV01, CJ01, CJ02, CJ03, PP01, LB01 — the original row teaches the objective itself.
- **MARKER (1):** SCHEME-ROW → rule `SS1-SRC-a00657d42196-R029`.
- **PARTIAL (8):** PV02 ('come through' gloss), PV05 (eight look-up verbs, no meanings/key), AV02 ('if' listed as an adverb, repeated 'very'), AV03 (misspelt heading, 'at 6 O'clock' example, 'alternately'), CJ04 ('which/who/whose' listed as conjunctions), PP02 ('in different to', 'spy at', 'die on', 'hinges on'), PP03 ('in a view of', truncated 'in addition wit.'), LB04 (five revision items, no key; item 2 appears to have no fitting option).
- **UNRESOLVED (6):** CM01 and CM03 and LB02, LB03, LB05 (book pages not supplied), CM02 ('Word Meanings in Context' is in the scheme but no source row teaches it).
- No SS1-02 correction or replacement lesson displaces any Week 2 row, so no replacement-scope check was needed. `SUP-SS1-ENGLISH-READING-T1` stays unbound (queue item ENG-FACT-READING-T1-T3-UNBOUND) and is not counted as Week 2 coverage.
- Source wording is not edited; defects are flagged for separately tracked replacements.

## Rule added
`SS1-SRC-a00657d42196-R029` `classify_marker` / `SCHEME_ONLY`, anchored on the Week 2 scheme-table text. It occurs once in the extracted text and in no parsed WEEK body (checked), so the compiler's existing preamble-marker path supports it. No other rule changed. Scheme-table rows 3 to 11 are not classified here (row 1 is rule R028); later week items own them.

## Open items added (all block delivery)
- `ENGLISH-T1-W02-EXTERNAL-MATERIALS` — Effective English pp. 54-56, Countdown pp. 159-160 and 271-272 (queue ENG-FACT-W02-EXTERNAL-MATERIALS).
- `ENGLISH-T1-W02-WORD-MEANINGS-SCOPE` — untaught scheme objective (queue ENG-LES-W02-WORD-MEANINGS).
- `ENGLISH-T1-W02-SOURCE-WORDING-REVIEW` — wording defects (queue ENG-LES-W02-PHRASAL-VERBS, ENG-LES-W02-ADVERB-CONJ-PREP).
- `ENGLISH-T1-W02-ANSWER-KEYS` — look-up verbs and revision items without answer content (queue ENG-LES-W02-PHRASAL-VERBS).

## Checks run
Hashes (archive, member, four row bodies), JSON syntax of both edited files, and reference consistency: unique IDs, every coverage target resolves to a parsed body or the marker rule, anchor uniqueness, every PARTIAL/UNRESOLVED Week 2 entry named by an open item, existing entries and rules otherwise unchanged. Nothing was executed against the importer, database or tests.

## Remaining dependencies and notes
- Package status stays PENDING; no approval, certification or verification is recorded or implied.
- `QUEUE_BUILD.md` still names W02 as next; it lies outside this item's write paths and was left unchanged. `QUEUE.json` `next_runnable` is set to ENG-WK-T1-W03.
- No schema or compiler limitation blocked this item; no foundation task needed.

## Queue item complete?
Yes — indexing complete (`IMPLEMENTED_TESTING_DEFERRED`).

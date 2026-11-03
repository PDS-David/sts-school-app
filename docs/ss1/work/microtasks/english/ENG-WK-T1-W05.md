# ENG-WK-T1-W05 — English, 1st Term, Week 5 (indexing)

Status: **IMPLEMENTED_TESTING_DEFERRED** — indexing is complete. Its content gaps are **not** closed.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Base: origin/master `7a57f83b1c51460b340a33ec17e1536b24f29d70` (W04 merged by PR #297), isolated branch `ss1/eng-wk-t1-w05-20261103`. No remote branch or PR for W05 existed at fetch. Open PRs could not be listed: GitHub API access was not enabled for the session, so this was checked from the remote branch list only. The repository has no `AGENTS.md`.
- Prerequisite ENG-SRC-T1 is implemented; source `SS1-SRC-a00657d42196` is registered in `backend/src/db/ss1/subjects/english.json`. W01 to W04 were complete; W05 was the first dependency-ready SOURCE_WEEK_INDEXING item.
- Member `1ST TERM S1 ENGLISH LANGUAGE.doc` supplied as a standalone file, SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef` verified (equals the task's member hash). The composite archive was not supplied, so its hash was **not checked**.
- Method: text extracted privately with `word-extractor` `getBody()` (81,965 characters, SHA-256 `8c3faa979ab73ef5de1cbc97976405c20332d505d49233cc147bfef691034a4e`, identical to the W03 and W04 extraction). Rules R001 to R031 were applied as structural insertions (82,151 characters, SHA-256 `f823d499b69c7ceceb6da6f5387f87593f680a6bd9011c7e3ba2b3ba3a970282`, identical to W04) and the text split by a scratch copy of the WEEK-marker logic in `parseTopics` (`backend/src/db/ingestTopics.ts`). The importer was not run. The document was also rendered to PDF privately (pages 20 to 22) to see formatting that the extraction drops. Nothing from the source is committed.

## Week 5 rows (reproduced; hashes equal the existing coverage)
| Row | Label | Body SHA-256 |
|---|---|---|
| ENGLISH-BODY-015 | `WEEK FIVE` (kinds of sentences; also carries the three topic lines) | `c6269e8376b264e61acf42202827d91fd9dca763ed98fe494495eff90b17ba66` |
| ENGLISH-BODY-016 | `WEEK 5` B (expository essay) | `343237170c2ae8935e88c2240e33d963f31412cfbc54ecb7a108a1def7a9cb40` |
| ENGLISH-BODY-017 | `WEEK 5` C (stock exchange, glossary, revision questions, weekend assignment) | `c634d3455342808383d7a1f88dbdfd62df7b3442f5e231d7706feaab0623d733` |

Every new `objective_locator` is `<body id> :: from '<exact start text>' to before '<exact end text>'` (or `to end of body`). Each anchor was asserted to occur exactly once in its body, and each span's end follows its start.

## Scheme row 5 → entries
| Scheme objective | Entries |
|---|---|
| Structure: kinds of sentences (simple, multiple, compound, complex, compound-complex) | KS01 (outline list, definition), KS02 to KS06 (one per kind), KS07 (evaluation), RA01 (reading assignment) |
| Essay writing: expository, "Honesty is the Best Legacy" | ES01 (definition), ES02 and ES03 (two sample outlines), ES04 (evaluation), ES05 (reading assignment) |
| Vocabulary development: stock exchange and insurance | SE01 (definition), SE02 (glossary), SE03 (insurance) |

Also indexed: VF01 (the topic line on fisheries and animal husbandry, which the scheme row does not name), RV01 (five revision questions) and WA01 (weekend assignment). All entry IDs are prefixed `ENGLISH-T1-W05-`.

## Outcome (20 new entries; ENGLISH-BODY-015..017 kept unchanged)
- **IMPLEMENTED_EQUIVALENT (0):** none. No correction replaces any Week 5 row.
- **MARKER (1):** SCHEME-ROW → rule `SS1-SRC-a00657d42196-R032`.
- **PARTIAL (14):** KS01 to KS07, ES01 to ES04, SE01, SE02, RV01.
- **UNRESOLVED (5):** RA01, ES05, WA01 (book pages not supplied), VF01 (conflicting objective), SE03 (insurance not taught).

## Replacement scope check
No delivery correction displaces a Week 5 row. `SUP-SS1-ENGLISH-PHRASES-CLAUSES-T1` states simple, compound, complex and compound-complex sentences in one paragraph, but it is bound only to ENGLISH-BODY-013 (correction `SS1-02-english-COR-002`). Correction `SS1-02-english-COR-021` binds only the 3rd Term row to `SUP-SS1-ENGLISH-PHRASES-CLAUSES-T3`. The T1 supplement does not use the label "multiple sentence" and has no task in which the learner writes sentences of each kind. It is cited as a lead on KS01 to KS07 and **not** bound. `SUP-SS1-ENGLISH-ESSAY-TYPES-T2` explains the expository essay but is a 2nd Term lesson bound to nothing in 1st Term; cited on ES01 as a lead only.

## Findings that matter for delivery
- **The vocabulary objective is contradictory.** The scheme row and the `WEEK 5` C heading say stock exchange and insurance. The `WEEK FIVE` topic line says fisheries and animal husbandry. No Week 5 text teaches fisheries or animal husbandry; those terms are taught in Week 4 (W04 AG02 and AG03), so the line may be a leftover. This answers the cross-week lead in the W04 note: Week 5 adds no fishery or livestock words. It is a reading, not a fact, so VF01 stays UNRESOLVED pending an owner decision.
- **Insurance is named but not taught.** The word occurs once in the row, in the heading. Only a nine-entry stock-exchange glossary follows, with "bond" glossed twice differently and no example sentences or exercise.
- **Both multiple-sentence examples may not have three main clauses.** In one, a single subject carries three coordinated predicates; in the other, two predicates share a subject. By the clause-counting rule in the replacement they could be analysed as fewer clauses. Not corrected.
- **No Week 5 task has an answer.** The five-sentences task, the "Honesty is the Best Legacy" essay (the source gives only the title) and the five revision questions have no key or marking scheme.
- **The revision questions test untaught content.** They cover adjective order, tag questions, a spelling and a determiner, none of which is a Week 5 scheme objective; the document never mentions tag questions or adjective order. Item 2's options are garbled in the original as well as in the extraction, and the instruction says A to D while each item has five options. Unlike Week 4, the render shows no underlined target words.
- **No visual is required.** The only embedded images are on pages 1 and 2. The sentence tables are real text tables. No ASSET item is created.

## Rule added
`SS1-SRC-a00657d42196-R032` `classify_marker` / `SCHEME_ONLY`, anchored on the first line of scheme-table row 5. It occurs once in the extracted text and in no parsed WEEK body (checked). No other rule changed. Scheme rows 6 to 11 are not classified here.

## Open items added (all block delivery)
`ENGLISH-T1-W05-EXTERNAL-MATERIALS`, `-ANSWER-KEYS`, `-SOURCE-WORDING-REVIEW`, `-SENTENCE-KINDS-BINDING`, `-EXPOSITORY-ESSAY`, `-INSURANCE-VOCAB`, `-VOCAB-OBJECTIVE-CONFLICT` (kind FACT).

## Queue edits
ENG-WK-T1-W05 → `IMPLEMENTED_TESTING_DEFERRED`. Six PENDING follow-ups appended, none authored: ENG-FACT-W05-EXTERNAL-MATERIALS, ENG-FACT-W05-VOCAB-OBJECTIVE, ENG-LES-W05-SENTENCE-KINDS, ENG-LES-W05-EXPOSITORY-ESSAY, ENG-LES-W05-STOCK-INSURANCE-VOCAB (depends on the vocabulary decision), ENG-LES-W05-REVISION-KEYS. The overlap note in ENG-LES-W04-AGRICULTURE-VOCAB was resolved by appended text. Counts and status_counts recomputed from the 119 items; one note appended. `next_runnable` is unchanged (`ENG-LES-W02-PHRASAL-VERBS`). `NEXT_TASK.md` and `QUEUE_BUILD.md` were outside the write paths and still name W04.

## Checks run (authoring only)
SHA-256 of the member, the extraction, the ruled text and the three row bodies; JSON parse of both files; both files round-trip with `indent=2` and a trailing newline; unique IDs; every `lesson_ids` target resolves (original body hash or the new rule); every PARTIAL and UNRESOLVED entry is named by a blocking open item; open-item `affected_ids` resolve; dependency resolution; existing coverage, rules, open items, lessons and corrections unchanged and in order; `git diff`. Nothing was executed against the importer, compiler, database or tests.

## Remaining
Package status stays PENDING; no approval, certification or verification is recorded or implied. Indexing of 1st Term Weeks 6 to 11 remains (2nd and 3rd Term indexing is separate). Next indexing item: `ENG-WK-T1-W06`. This does not claim the subject or class complete.

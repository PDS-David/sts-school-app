# ENG-WK-T1-W04 — English, 1st Term, Week 4 (indexing)

Status: **IMPLEMENTED_TESTING_DEFERRED** — indexing is complete. Its content gaps are **not** closed.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Base: origin/master `541e8b0182a1bf31807cb84713b23b8fe3d1ad38`, isolated branch `ss1/eng-wk-t1-w04-20261103`. Open PRs at fetch: #295 (documentation only, `docs/curriculum/20261102/`); none touches English. The repository has no `AGENTS.md`; `AGENT_CONTINUATION.md` and `HANDOFF.md` exist at the root and were not needed for this task.
- Prerequisite ENG-SRC-T1 is implemented; source `SS1-SRC-a00657d42196` is registered in `backend/src/db/ss1/subjects/english.json`. W01 to W03 were already complete; W04 was the first dependency-ready SOURCE_WEEK_INDEXING item.
- Member `1ST TERM S1 ENGLISH LANGUAGE.doc` supplied as a standalone file, SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef` verified (equals the task's member hash). The composite archive was not supplied, so its hash was **not checked**.
- Method: text extracted privately with `word-extractor` `getBody()` (81,965 characters, SHA-256 `8c3faa979ab73ef5de1cbc97976405c20332d505d49233cc147bfef691034a4e`, identical to the W03 extraction). Rules R001 to R030 were applied as structural insertions (82,151 characters, SHA-256 `f823d499b69c7ceceb6da6f5387f87593f680a6bd9011c7e3ba2b3ba3a970282`) and the text split by a scratch copy of the WEEK-marker logic in `parseTopics` (`backend/src/db/ingestTopics.ts`). The importer was not run. The document was also rendered to PDF privately (pages 16 to 20) to see formatting the extraction drops. Nothing from the source is committed.

## Week 4 rows (reproduced; hashes equal the existing coverage)
| Row | Label | Body SHA-256 |
|---|---|---|
| ENGLISH-BODY-012 | `WEEK FOUR` (skimming and scanning, Unit 4 drama) | `d8bc6522b3e9f5faad42588517ef7db56406dfa3290a9e83b6807ec22e256392` |
| ENGLISH-BODY-013 | `WEEK 4` B (noun phrase and verb phrase) | `1c98310e1fd9b30d4be570da432c1a4203dfa79ddbf55acbd0f1a1fb7bcca830` |
| ENGLISH-BODY-014 | `WEEK 4` (agriculture vocabulary, spelling, revision questions) | `9a0782678ccf117f1b370a215502adeb890414f7b3165e45d741ec906cb46b35` |

Every new `objective_locator` is `<body id> :: from '<exact start text>' to before '<exact end text>'` (or `to end of body`). Each anchor was asserted to occur exactly once in its body, and each span's end follows its start.

## Scheme row 4 → entries
| Scheme objective | Entries |
|---|---|
| Comprehension/reading skills: skimming and scanning, Unit 4 | SK01 (skills), DR01 (synopsis), DR02 (evaluation), DR03 (reading assignment) |
| Structure: noun phrase and verb phrase | NP01-NP08 (definition and functions), VP01, EV01 (evaluation), RA01 |
| Vocabulary development: agriculture | AG01 (general), AG02 (livestock), AG03 (fishery), AG04 (evaluation), AG05 |
| Spelling: words commonly misspelt | SP01 (table and list), SP02 (dictation), SP03 |
| Unified test | UT01 |

Also indexed: RV01 (five revision questions) and WA01 (weekend assignment), which the scheme row does not name. All entry IDs are prefixed `ENGLISH-T1-W04-`.

## Outcome (27 new entries; ENGLISH-BODY-012..014 kept unchanged)
- **IMPLEMENTED_EQUIVALENT (4):** NP02, NP06, NP07, VP01 (via `SUP-SS1-ENGLISH-PHRASES-CLAUSES-T1`).
- **MARKER (1):** SCHEME-ROW → rule `SS1-SRC-a00657d42196-R031`.
- **PARTIAL (13):** DR01, NP01, NP03, NP04, NP05, NP08, EV01, AG01, AG02, AG03, AG04, SP01, RV01.
- **UNRESOLVED (9):** SK01 (nothing teaches it), DR02, DR03, RA01, AG05, SP02, SP03, WA01 (book pages or content not supplied), UT01 (no test content).

## Replacement scope check
Correction `SS1-02-english-COR-002` replaces the whole of ENGLISH-BODY-013 with `SUP-SS1-ENGLISH-PHRASES-CLAUSES-T1`. The replacement corrects the source's mislabelled object complements (NP07), shows subject and direct and indirect object (NP02, NP06) and states verb phrases (VP01). It does **not** teach a pronoun as head (NP01), a gerund phrase (NP03) or an infinitive phrase (NP04) as a noun phrase, an adjective as head (NP05), or the noun phrase as complement of a preposition by name (NP08), and its practice omits the source's functions exercise (EV01). No other Week 4 row is displaced by a correction.

## Findings that matter for delivery
- **Underlining is lost.** The tasks in EV01 (functions of underlined expressions) and RV01 (nearest meaning to an underlined word) depend on underlining that exists only in the original formatting. The extracted text, which is what the importer delivers, does not show the target expressions.
- **No visual is required.** The only embedded images in the document are on pages 1 and 2. The fishery glossary and spelling list are text tables. No ASSET item is created.
- **SK01 and READING-T1.** `SUP-SS1-ENGLISH-READING-T1` teaches skimming and scanning but is bound to nothing, and UNR-01 reviewed it only against ten other rows. Binding it is the owner decision already in `ENG-FACT-READING-T1-T3-UNBOUND`; nothing was bound here.
- **Cross-week lead for W05.** The Week 5 topic line names fisheries and animal husbandry vocabulary, while the scheme row for Week 5 names the stock exchange and insurance. Not examined here.

## Rule added
`SS1-SRC-a00657d42196-R031` `classify_marker` / `SCHEME_ONLY`, anchored on the Week 4 scheme-table line. It occurs once in the extracted text and in no parsed WEEK body (checked). No other rule changed. Scheme rows 5 to 11 are not classified here.

## Open items added (all block delivery)
`ENGLISH-T1-W04-EXTERNAL-MATERIALS`, `-ANSWER-KEYS`, `-SOURCE-WORDING-REVIEW`, `-PHRASES-REPLACEMENT-SCOPE`, `-SKIM-SCAN-BINDING`, `-UNIFIED-TEST`.

## Queue edits
ENG-WK-T1-W04 → `IMPLEMENTED_TESTING_DEFERRED`. Seven PENDING follow-ups appended, none authored: ENG-FACT-W04-EXTERNAL-MATERIALS, ENG-FACT-W04-UNIFIED-TEST, ENG-LES-W04-SKIM-SCAN (depends on the READING-T1 decision), ENG-LES-W04-NOUN-VERB-PHRASE-SCOPE, ENG-LES-W04-AGRICULTURE-VOCAB, ENG-LES-W04-SPELLING-MISSPELT, ENG-LES-W04-REVISION-KEYS. A finding was appended to `ENG-FACT-READING-T1-T3-UNBOUND` (status unchanged). Counts and status_counts recomputed from the 113 items; one note appended. `next_runnable` is unchanged (`ENG-LES-W02-PHRASAL-VERBS`). `NEXT_TASK.md` and `QUEUE_BUILD.md` were outside the write paths and still name W04.

## Checks run (authoring only)
SHA-256 of the member, the extraction and the three row bodies; JSON parse of both files; both files round-trip with `indent=2` and a trailing newline; unique IDs; every `lesson_ids` target resolves (original body hash, supplement or rule); equivalent entries carry a supplement; every new PARTIAL/UNRESOLVED entry is named by a blocking open item; open-item `affected_ids` resolve; dependency resolution; existing coverage, rules, open items, lessons and corrections unchanged and in order; `git diff`. Nothing was executed against the importer, compiler, database or tests.

## Remaining
Package status stays PENDING; no approval, certification or verification is recorded or implied. Indexing of 1st Term Weeks 5 to 11 remains (2nd and 3rd Term indexing is separate). Next indexing item: `ENG-WK-T1-W05`. This does not claim the subject or class complete.

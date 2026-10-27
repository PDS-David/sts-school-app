# ENG-WK-T1-W01 — English, 1st Term, Week 1 (indexing)

Status: **IMPLEMENTED_TESTING_DEFERRED** — indexing is complete. Its content gaps are **not** closed.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Starting SHA: `fc2aef1f0761f25fe50c06ed4592b2357a117bff` (origin/master), isolated branch `ss1/eng-wk-t1-w01`.
- Source ID `SS1-SRC-a00657d42196`; document SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef` (verified; matches `SOURCE_ASSIGNMENTS.csv`).
- Archive `SSS 1-20260507T072431Z-3-001 (1).zip` (SHA-256 `024487…65c9a3e`) was **not supplied as one file**. The owner supplied the three term archives that make it up; the document was read from the 1st Term archive and its hash checked directly. The combined-archive hash was not re-verified.
- Text was extracted privately with the repository's own extractor (`word-extractor`) so anchors match the importer's input. Nothing from the source is committed.
- Open PRs for this queue item: none found in the repo's git refs; the GitHub API was not reachable with the supplied credential, so this was not re-confirmed through the API. PR71's foundation was not used.

## Week 1 locator scheme
Parsed rows after the existing rules R002/R003: `WEEK ONE` (body `3a51afe5…2744f26`), `WEEK 1 / B. Review of Word Class` (body `954e005e…f4ab01`), `WEEK 1 / C: Spelling` (body `de2cf448…24f903`). Each hash was reproduced from the source. Every coverage `objective_locator` is `<body id> :: from '<exact start text>' to before '<exact end text>'`; each anchor was checked to occur exactly once in its body.

## Objectives inspected (26 coverage entries)
| Entry | Objective | Status |
|---|---|---|
| ENGLISH-BODY-001 (kept, narrowed) | Section A general revision + Lexis/structure reading assignment | PARTIAL |
| ENGLISH-BODY-002 (kept) | Row-level entry for Section B | **IMPLEMENTED_EQUIVALENT → PARTIAL** |
| ENGLISH-BODY-003 (kept) | Section C doubling-of-consonants rules | PARTIAL → SUPPORTED |
| ENGLISH-T1-W01-N01 | Noun definition | EQUIVALENT |
| N02 | Noun features, regular plural, noun endings | UNRESOLVED |
| N03 | Proper/common/concrete/abstract | PARTIAL (capital-letter rule missing) |
| N04 | Count/non-count/other uncountables, damage/damages | PARTIAL |
| N05 / N06 | Collective nouns / possessive nouns | UNRESOLVED |
| N07 | Regular plurals -s/-es | UNRESOLVED |
| N08 / N09 / N10 | Irregular / compound / zero plurals | PARTIAL |
| N11 | Plural-form nouns (goods, ashes…), aircraft/cattle | UNRESOLVED |
| P01 / P02 | Pronoun function / eight pronoun types | EQUIVALENT / PARTIAL |
| A01 | Adjective, attributive vs predicative | PARTIAL (terms not named) |
| A02 / A03 | Kinds of adjectives / adjective endings | UNRESOLVED |
| R01 | Countdown pp. 240–241; works/work, damages/damage, stationery/stationary | UNRESOLVED |
| V01 / V03 | Verb + lexical verbs / finite and non-finite | EQUIVALENT |
| V02 | Primary and modal auxiliaries | PARTIAL (lists missing) |
| V04 | Transitive/intransitive | UNRESOLVED |
| SP02 | Spelling tasks, Effective English p. 273, nine-word correction | PARTIAL |
| SCHEME-ROW | Scheme-table row 1 (preamble) | MARKER → rule R028 |

## Correction SS1-02-english-COR-001
Unchanged as a record. Finding: replacement `SUP-SS1-ENGLISH-WORD-CLASSES-T1` (4 paragraphs, 2 objectives, 3 practice items) does **not** preserve every objective of the row it displaces: of 21 Section B objectives, 4 are equivalent, 8 partly taught, 9 not taught. It should stay inactive until follow-up items below are done. The source's own defects (common-vs-concrete, auxiliary and non-finite wording, the noun-ending list, aircraft/cattle note) are flagged, not copied.

## Rule added
`SS1-SRC-a00657d42196-R028` `classify_marker` / `SCHEME_ONLY`, anchored on the Week 1 scheme-table text. It occurs once in the extracted text and in no parsed WEEK body (checked), so the compiler's existing preamble-marker path supports it. No other rule changed.

## Remaining gaps and queue IDs (all PENDING)
- `ENG-LES-W01-NOUNS` — N02–N11 gaps (open item `ENGLISH-T1-W01-WORD-CLASS-REPLACEMENT-SCOPE`).
- `ENG-LES-W01-PRONOUN-ADJ-VERB` — P02, A01–A03, R01, V02, V04 (same open item).
- `ENG-FACT-W01-EXTERNAL-MATERIALS` — last term's exam questions, WASSCE/NECO past questions, Countdown pp. 240–241, Effective English p. 273, answers to spelling task (open item `ENGLISH-T1-W01-EXTERNAL-MATERIALS`).

## Other observations
- The Week 1 weekend assignment (monophthongs; four types of essay) refers to Week 3 scheme content. It is not indexed as Week 1; ENG-WK-T1-W03 should pick it up.
- No schema or compiler limitation blocked this item; no foundation task needed.

## Queue item complete?
Yes — indexing complete (`IMPLEMENTED_TESTING_DEFERRED`). No approval, verification or certification is recorded or implied.

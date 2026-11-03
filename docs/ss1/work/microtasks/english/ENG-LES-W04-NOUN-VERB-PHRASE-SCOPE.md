# ENG-LES-W04-NOUN-VERB-PHRASE-SCOPE — English, 1st Term, Week 4 (lesson)

Status: **IMPLEMENTED_TESTING_DEFERRED** — one lesson authored. Content approval **PENDING**, verification **DEFERRED**.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Branch `ss1/eng-les-w04-noun-verb-phrase-20261103`, **stacked on** `ss1/eng-les-w03-revision-keys-20261103` (PR #305), itself stacked on PR #304, #303, #302 and #301, because all six change `english.json` and `QUEUE.json`. Merge #301, then #302, then #303, then #304, then #305, then this. Master at start: `da0849e32cdb1c717f7ed03b4ed010f563b8cfe0` (3 November 2026).
- Prerequisite ENG-WK-T1-W04 is IMPLEMENTED_TESTING_DEFERRED. The Week 4 coverage entries and open items were reused; no audit was repeated.
- The source row `BODY 1c98310e1fd9b30d4be570da432c1a4203dfa79ddbf55acbd0f1a1fb7bcca830` was read privately from the render made earlier this session (member SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`, verified then). The section read was the noun-phrase definition, its functions, the gerund, infinitive and adjective examples, the verb phrase and the underlined-expression evaluation. Nothing is reproduced; the source is not committed.

## Lesson
`SUP-SS1-ENGLISH-NOUN-PHRASE-FUNCTIONS-T1`, 10 body paragraphs, 6 objectives, 6 practice items, 60 marks; `body_sha256` `7660f694304fde9e01a6d336ba75075b16eb02985e11100670af0337797aa659` recomputed from the UTF-8 body. It teaches the noun phrase with a noun, pronoun or adjective head; the six functions; gerund and infinitive phrases as noun phrases, including the dummy-*it* pattern; adjective-headed phrases and their agreement; the noun phrase as complement of a preposition; verb phrases and the predicate; a step-by-step identification method; and common errors. Practice Q1 to Q6 are original, each with a complete answer and criterion-level marking that sums to its marks. Q6 is a five-item functions exercise with four noun-phrase items and one verb-phrase item, using square brackets because underlining is lost in plain text.

| Coverage | Before | After | Taught in |
|---|---|---|---|
| ENGLISH-T1-W04-NP01 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 1: pronoun as head |
| ENGLISH-T1-W04-NP03 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 3 and Q3: gerund phrase |
| ENGLISH-T1-W04-NP04 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 4 and Q3: infinitive phrase |
| ENGLISH-T1-W04-NP05 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 5 and Q4: adjective as head |
| ENGLISH-T1-W04-NP08 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 6 and Q5: complement of a preposition |
| ENGLISH-T1-W04-EV01 | PARTIAL | IMPLEMENTED_EQUIVALENT | Q6: keyed functions exercise |

## Correction decision
The replacement's scope was reviewed. Correction `SS1-02-english-COR-002` and replacement `SUP-SS1-ENGLISH-PHRASES-CLAUSES-T1` are **unchanged**: the supplement is additive and covers the missing objectives alongside the existing replacement. Extending the shipped replacement or binding a second correction would change stable delivered content for no gain, so neither was done.

## Open items
`ENGLISH-T1-W04-PHRASES-REPLACEMENT-SCOPE` removed: the scope review is complete and the missing teaching plus a keyed exercise are supplied. `ENGLISH-T1-W04-ANSWER-KEYS` narrowed to `ENGLISH-BODY-014`, AG04, SP02 and RV01; EV01 now has a key. `ENGLISH-T1-W04-SOURCE-WORDING-REVIEW` drops NP03, NP08 and EV01 from its affected IDs and records the review. `ENGLISH-T1-W04-EXTERNAL-MATERIALS`, `ENGLISH-T1-W04-SKIM-SCAN-BINDING` and `ENGLISH-T1-W04-UNIFIED-TEST` are untouched. The source text is unchanged.

## For owner review
- The grammar descriptions and examples are from general British-English grammar knowledge and were **not fetched**. Confirm before approval, especially: *the elderly* taking a plural verb while *the unknown* takes a singular verb; the dummy-*it* analysis of *It is wrong to tell lies*; the possessive before a gerund; the noun phrase as the complement of a preposition; and the five-item functions exercise as an acceptable equivalent for the source's underlined task.
- The lesson contains no approval reference; none is invented. It does not claim to correct the source bytes and does not reproduce them.

## Checks run (authoring only)
SHA-256 of the body recomputed and equal to `body_sha256` and to the queue reference; JSON parse of both edited files; strict key sets checked against the package schema; per-lesson body hashes recomputed for all 27 lessons; unique lesson, coverage, open-item and queue IDs; every `lesson_ids` and `affected_ids` target resolves; every practice item's marking sums to its marks (60 in total); unnamed PARTIAL/UNRESOLVED coverage rows unchanged at 52 compared with the parent branch, none newly unnamed; queue `counts` and `status_counts` recomputed from items (35 implemented, 80 pending, 4 blocked); 8-word shingle comparison against the private render returned no shared sequence, and the 5-word overlaps were generic frames (*a noun phrase is a*, *is a group of words*, *as complement of a preposition*, *a group of people or*); CRLF preserved; `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 4 still has ENG-LES-W04-AGRICULTURE-VOCAB (next runnable), ENG-LES-W04-SPELLING-MISSPELT and ENG-LES-W04-REVISION-KEYS; ENG-LES-W04-SKIM-SCAN still depends on the pending fact item ENG-FACT-READING-T1-T3-UNBOUND. Week 3 still has the owner-dependent ENG-FACT-W03-EXTERNAL-MATERIALS. This does not claim the week, subject or class complete.

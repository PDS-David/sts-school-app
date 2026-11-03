# ENG-LES-W04-REVISION-KEYS — English, 1st Term, Week 4 (lesson)

Status: **IMPLEMENTED_TESTING_DEFERRED** — one lesson authored. Content approval **PENDING**, verification **DEFERRED**.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Branch `ss1/eng-les-w04-revision-keys-20261103`, **stacked on** `ss1/eng-les-w04-spelling-misspelt-20261103` (PR #308), itself stacked on PR #307, #306, #305, #304, #303, #302 and #301, because all nine change `english.json` and `QUEUE.json`. Merge #301, then #302, then #303, then #304, then #305, then #306, then #307, then #308, then this. Master at start: `da0849e32cdb1c717f7ed03b4ed010f563b8cfe0` (3 November 2026).
- Prerequisite ENG-WK-T1-W04 is IMPLEMENTED_TESTING_DEFERRED. The Week 4 coverage entries and open items were reused; no audit was repeated.
- The source row `BODY 9a0782678ccf117f1b370a215502adeb890414f7b3165e45d741ec906cb46b35` was read privately from the render made earlier this session (member SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`, verified then). The section read was the general evaluation/revision questions only. Nothing from the source is committed.

## Lesson
`SUP-SS1-ENGLISH-REVISION-W04-T1`, 9 body paragraphs, 6 objectives, 6 practice items, 60 marks; `body_sha256` `0be6ba8d652e01093ec952ec7a5dd12886115bdfe17f2b812fcea0e7e49cc1a3` recomputed from the UTF-8 body. It teaches what “nearest in meaning” requires, the six context-clue types, a five-step elimination method, connotation and strength traps, grammar/collocation/register checks, and how to write a three-part explanation. Practice Q1 to Q6 are original, each with a complete answer and criterion-level marking that sums to its marks. Q1 is a five-item nearest-meaning set with four options each; Q2 to Q6 cover clue naming, trap rejection, substitution checks, sentence writing and precise-word replacement.

| Coverage | Before | After | Taught in |
|---|---|---|---|
| ENGLISH-T1-W04-RV01 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraphs 2–8 and Q1–Q6 |

## Review of the source task
- The target words were underlined, and underlining is lost in the extracted text. The lesson uses square brackets instead, as an equivalent device.
- The instruction says the options are lettered A to D, but every source item offers five (a to e). The lesson states the number of options in each item and does not repeat the mismatch.
- One target word is misspelt in the source. The lesson records the fact without depending on the word and does not treat the faulty form as a model.
- No answer key is supplied. **No answer is inferred from the source options**; all five Q1 items, their options and their explanations are newly written.
- The source items test the Week 2 skill of word meaning in context, not one of the five Week 4 scheme objectives. The lesson is labelled as revision of that skill and does not claim to assess the Week 4 topics.

## Correction decision
No correction is bound. The supplement is additive and does not change any shipped lesson, correction or replacement. No `delivery_correction` was added.

## Open items
`ENGLISH-T1-W04-ANSWER-KEYS` is **closed**: AG04, SP02 and RV01 now all have keyed teaching, so the item has no remaining obligation. `ENGLISH-T1-W04-SOURCE-WORDING-REVIEW` drops RV01 from its affected IDs and records the underlining equivalent. `ENGLISH-T1-W04-EXTERNAL-MATERIALS` is unchanged. All other open items are untouched. The source text is unchanged.

## For owner review
- The senses, connotations and collocations are from general British-English knowledge and were **not fetched from a dictionary**. Confirm before approval, especially: *candid*/*frank*/*rude*; *firm*/*decisive*; *childlike*/*childish*; *thrifty*/*stingy*; *famous*/*notorious*; *cozy*/*cramped*; *commence*/*start*; *refuse*/*deny*; and *imply*/*infer*.
- The lesson states that the source items test the Week 2 objective rather than the Week 4 scheme objectives. This is a coverage judgement from the item content and the scheme row; confirm at review.
- The lesson contains no approval or verification reference; none is invented. It does not claim to correct the source bytes and does not reproduce them.

## Checks run (authoring only)
SHA-256 of the body recomputed and equal to `body_sha256` and to the queue reference; JSON parse of both edited files and byte-exact round-trip through the project serialization with CRLF; strict key sets checked against the package schema; per-lesson body hashes recomputed for all 30 lessons; unique lesson, coverage, open-item and queue IDs; every `lesson_ids` and `affected_ids` target resolves; every practice item's marking sums to its marks (60 in total); unnamed PARTIAL/UNRESOLVED coverage rows unchanged at 52 compared with the parent branch, none newly unnamed; the closed `ANSWER-KEYS` item leaves no coverage row unnamed; queue `counts` and `status_counts` recomputed from items (38 implemented, 77 pending, 4 blocked); 8-, 7- and 6-word shingle comparison against the private render returned no shared sequence, and the only 5-word overlaps are the generic rubric frames (*a to d choose the*, *choose the one that is*, *nearest in meaning to the*); CRLF preserved; `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 4 lesson work is complete except ENG-LES-W04-SKIM-SCAN, which still depends on the pending fact item ENG-FACT-READING-T1-T3-UNBOUND; AG05/SP03 remain under the owner-dependent external-materials item. The next runnable lesson is ENG-LES-W05-SENTENCE-KINDS (Week 5). Week 3 still has the owner-dependent ENG-FACT-W03-EXTERNAL-MATERIALS. This does not claim the week, subject or class complete.

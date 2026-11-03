# ENG-LES-W05-REVISION-KEYS — English, 1st Term, Week 5 (lesson)

Status: **IMPLEMENTED_TESTING_DEFERRED** — one lesson authored. Content approval **PENDING**, verification **DEFERRED**.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Branch `ss1/eng-les-w05-revision-keys-20261103`, **stacked on** `ss1/eng-les-w05-expository-essay-20261103` (PR #311, head `29db4c1`), itself stacked on PR #310, #309, #308, #307, #306, #305, #304, #303, #302 and #301, because all twelve change `english.json` and `QUEUE.json`. Merge #301 through #311 in order, then this. Master at start: `da0849e32cdb1c717f7ed03b4ed010f563b8cfe0` (3 November 2026).
- Prerequisite ENG-WK-T1-W05 is IMPLEMENTED_TESTING_DEFERRED. The Week 5 coverage entries and open items were reused; no audit was repeated.
- The source row `BODY c634d3455342808383d7a1f88dbdfd62df7b3442f5e231d7706feaab0623d733` was read privately from the render made earlier this session (member SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`, verified then). The section read was from the general evaluation heading to the weekend assignment. Nothing from the source is committed.

## Lesson
`SUP-SS1-ENGLISH-REVISION-W05-T1`, 9 body paragraphs, 6 objectives, 6 practice items, 60 marks; `body_sha256` `61662a28c27d77c30fe67da5c658eb6da5f6839da9516dd6d4c47f037d1021f3` recomputed from the UTF-8 body. It teaches adjective order with the purpose/classifier slot and its traps, tag-question formation and the special patterns (I am, let us, imperatives, negative-meaning subjects, demonstratives, nationality as person or language, used to, have to), asthma and silent-letter spelling with the word family, determiner choice by definiteness and countability, and a five-step examination method. Practice Q1 to Q6 are original, each with a complete answer and criterion-level marking that sums to its marks. Q5 is a five-item keyed set in four-option format.

| Coverage | Before | After | Taught in |
|---|---|---|---|
| ENGLISH-T1-W05-RV01 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraphs 1–9 and Q1–Q6 |

## Review of the source
- The rubric names options A to D, but every item supplies five (a to e). The lesson states four options in its own set and does not repeat the mismatch.
- Item 2’s options are merged in the original text. The lesson records that the item cannot be answered from the printed choices, **does not repair it** and does not copy it.
- No answer key is supplied. **No answer is inferred from the source options**; every sentence, option and answer in Q1 to Q6 is newly written.
- The five items test adjective order, tag questions (twice), the spelling of asthma and determiner choice, while the Week 5 teaching covers none of these. The lesson is labelled as revision of those skills and does not claim to assess the Week 5 scheme objectives.
- The two tag items are replaced by a full tag section so that the skill is taught once rather than assumed.

## Correction decision
No correction is bound. The supplement is additive and does not change any shipped lesson, correction or replacement. No `delivery_correction` was added. The supplement is attached to RV01 only through coverage `lesson_ids`, with the source target kept first.

## Open items
`ENGLISH-T1-W05-ANSWER-KEYS` is **closed**: KS07, ES04 and RV01 now all have keyed teaching, so the item has no remaining obligation. `ENGLISH-T1-W05-SOURCE-WORDING-REVIEW` drops RV01 and now affects only SE01 and SE02. `ENGLISH-T1-W05-EXTERNAL-MATERIALS`, `ENGLISH-T1-W05-INSURANCE-VOCAB` and `ENGLISH-T1-W05-VOCAB-OBJECTIVE-CONFLICT` are unchanged. No PARTIAL/UNRESOLVED row became unnamed. The source text is unchanged.

## For owner review
- The grammar and spelling descriptions are from general British-English knowledge and were **not fetched**. Confirm before approval, especially the adjective-order sequence, the special tag patterns, the silent letters in asthma, rhythm, subtle and solemn, and the each/every restriction.
- The lesson sets Q5 in a four-option A-to-D format and states that explicitly, correcting the source’s five-option mismatch. Confirm that this format is acceptable for revision.
- The lesson contains no approval or verification reference; none is invented. It does not claim to correct the source bytes and does not reproduce them.

## Checks run (authoring only)
SHA-256 of the body recomputed and equal to `body_sha256` and to the queue reference; JSON parse of both edited files; strict key sets checked against the package schema; per-lesson body hashes recomputed for all 33 lessons; unique lesson, coverage, open-item and queue IDs; every `lesson_ids` and `affected_ids` target resolves; every practice item's marking sums to its marks (60 in total); unnamed PARTIAL/UNRESOLVED coverage rows unchanged at 52 compared with the parent branch, none newly unnamed; queue `counts` and `status_counts` recomputed from items (41 implemented, 74 pending, 4 blocked); no 8-, 7-, 6- or 5-word shingle is shared with the private render; CRLF preserved; `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
No English lesson is now runnable without owner input. ENG-LES-W05-STOCK-INSURANCE-VOCAB depends on the pending fact item ENG-FACT-W05-VOCAB-OBJECTIVE, which asks the owner which Week 5 vocabulary is intended; ENG-LES-W04-SKIM-SCAN depends on ENG-FACT-READING-T1-T3-UNBOUND. RA01, ES05, WA01, AG05 and SP03 remain under external-materials items, and Week 3 has ENG-FACT-W03-EXTERNAL-MATERIALS. Approval stays PENDING, verification DEFERRED and testing deferred. This does not claim the week, subject or class complete.

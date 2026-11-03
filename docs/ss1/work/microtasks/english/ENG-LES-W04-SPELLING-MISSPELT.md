# ENG-LES-W04-SPELLING-MISSPELT — English, 1st Term, Week 4 (lesson)

Status: **IMPLEMENTED_TESTING_DEFERRED** — one lesson authored. Content approval **PENDING**, verification **DEFERRED**.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Branch `ss1/eng-les-w04-spelling-misspelt-20261103`, **stacked on** `ss1/eng-les-w04-agriculture-vocab-20261103` (PR #307), itself stacked on PR #306, #305, #304, #303, #302 and #301, because all eight change `english.json` and `QUEUE.json`. Merge #301, then #302, then #303, then #304, then #305, then #306, then #307, then this. Master at start: `da0849e32cdb1c717f7ed03b4ed010f563b8cfe0` (3 November 2026).
- Prerequisite ENG-WK-T1-W04 is IMPLEMENTED_TESTING_DEFERRED. The Week 4 coverage entries and open items were reused; no audit was repeated.
- The source row `BODY 9a0782678ccf117f1b370a215502adeb890414f7b3165e45d741ec906cb46b35` was read privately from the render made earlier this session (member SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`, verified then). The section read was the correct/misspelt table, the further word list and the bare dictation heading. Nothing from the source is committed.

## Lesson
`SUP-SS1-ENGLISH-SPELLING-MISSPELT-T1`, 9 body paragraphs, 6 objectives, 6 practice items, 60 marks; `body_sha256` `6de254a753c121e0c6dced5e68d5e001a0d0e310369467096b217a6ca4c318dc` recomputed from the UTF-8 body. It teaches the word list under four patterns: consonant doubling (including stress-based doubling in *referred* and *incurred*), unstressed vowels and related forms (*separate*, *business*, *pronunciation*, *maintenance*), silent and unexpected letters (*acquaint*, *foreigner*, *grievous*, *mischievous*, *pneumonia*, *indict*), and suffix choice (*-ous*/*-ious*/*-uous*, *-able*, *-cede*/*-ceed*/*-sede*). It also covers the loanword-looking items (*bibliography*, *gubernatorial*, *onomatopoeia*, *diarrhoea*) and explains how to build and check a personal list. Practice Q1 to Q6 are original, each with a complete answer and criterion-level marking that sums to its marks. Q6 is the keyed dictation: a stated original passage, twelve named target words and one mark per correct target word.

| Coverage | Before | After | Taught in |
|---|---|---|---|
| ENGLISH-T1-W04-SP01 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraphs 2–7 and Q1–Q5 |
| ENGLISH-T1-W04-SP02 | UNRESOLVED | IMPLEMENTED_EQUIVALENT | Paragraph 9 and Q6: stated dictation with marking |
| ENGLISH-T1-W04-SP03 | UNRESOLVED | UNRESOLVED | Reading assignment; remains under EXTERNAL-MATERIALS |

## Review decisions
- The source table's misspelt column repeats the correct form for *excitement*, *foreigner*, *misspell*, *necessary*, *receive* and *separate*. Those six rows therefore show no error; the lesson supplies common errors (*excitment*, *foreignor*, *mispell*, *neccessary*, *recieve*, *seperate*) and the reason for each.
- *Accommodation* and *maintenance* appear in both the table and the further list, and *obstetrician* and *stethoscope* appear twice in the further list. Each is taught once.
- The headword *philandrer* is misspelt; the correct spelling is *philanderer* (philander + -er). The source promises an analysis of the words but states no rule; the patterns above supply it.
- The dictation row named only the word *Dictation*. The lesson does not assume that the table words were the intended list; it supplies a new passage and names its target words, with per-word marking.
- Nothing is claimed as an approved correction. The lesson is original teaching, approval stays PENDING, and the source text is not edited.

## Correction decision
No correction is bound. The supplement is additive and does not change any shipped lesson, correction or replacement. No `delivery_correction` was added.

## Open items
`ENGLISH-T1-W04-ANSWER-KEYS` narrowed to `ENGLISH-BODY-014` and RV01 (SP02 removed; it now has a stated passage and marking). `ENGLISH-T1-W04-SOURCE-WORDING-REVIEW` drops SP01 from its affected IDs and records the review. `ENGLISH-T1-W04-EXTERNAL-MATERIALS` for SP03 is unchanged. All other Week 4 open items are untouched. The source text is unchanged.

## For owner review
- The spellings and word families are from general British-English knowledge and were **not fetched from a dictionary**. Confirm before approval, especially: *colossal* (single l, double s); *harassment* (one r, double s) and *embarrassment* (double r, double s); *expatiate* (no n); *gubernatorial*; *onomatopoeia*; *philanderer*; and British *diarrhoea* versus American *diarrhea*.
- The dictation passage in Q6 is original and is the stated text for SP02. The teacher should read it twice as directed; the marking is one mark per target word, with no deduction for other words.
- The lesson contains no approval or verification reference; none is invented. It does not claim to correct the source bytes and does not reproduce them.

## Checks run (authoring only)
SHA-256 of the body recomputed and equal to `body_sha256` and to the queue reference; JSON parse of both edited files and byte-exact round-trip through the project serialization with CRLF; strict key sets checked against the package schema; every listed word checked present with the correct spelling; per-lesson body hashes recomputed for all 29 lessons; unique lesson, coverage, open-item and queue IDs; every `lesson_ids` and `affected_ids` target resolves; every practice item's marking sums to its marks (60 in total); unnamed PARTIAL/UNRESOLVED coverage rows unchanged at 52 compared with the parent branch, none newly unnamed; queue `counts` and `status_counts` recomputed from items (37 implemented, 78 pending, 4 blocked); 8-, 7-, 6- and 5-word shingle comparison against the private render returned no shared sequence; CRLF preserved; `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 4 still has ENG-LES-W04-REVISION-KEYS (next runnable); ENG-LES-W04-SKIM-SCAN still depends on the pending fact item ENG-FACT-READING-T1-T3-UNBOUND, and SP03 remains under the owner-dependent external-materials item. Week 3 still has the owner-dependent ENG-FACT-W03-EXTERNAL-MATERIALS. This does not claim the week, subject or class complete.

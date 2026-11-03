# ENG-LES-W04-AGRICULTURE-VOCAB — English, 1st Term, Week 4 (lesson)

Status: **IMPLEMENTED_TESTING_DEFERRED** — one lesson authored. Content approval **PENDING**, verification **DEFERRED**.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Branch `ss1/eng-les-w04-agriculture-vocab-20261103`, **stacked on** `ss1/eng-les-w04-noun-verb-phrase-20261103` (PR #306), itself stacked on PR #305, #304, #303, #302 and #301, because all seven change `english.json` and `QUEUE.json`. Merge #301, then #302, then #303, then #304, then #305, then #306, then this. Master at start: `da0849e32cdb1c717f7ed03b4ed010f563b8cfe0` (3 November 2026).
- Prerequisite ENG-WK-T1-W04 is IMPLEMENTED_TESTING_DEFERRED. The Week 4 coverage entries and open items were reused; no audit was repeated.
- The source row `BODY 9a0782678ccf117f1b370a215502adeb890414f7b3165e45d741ec906cb46b35` was read privately from the render made earlier this session (member SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`, verified then). The section read was the general-terms list, the livestock list, the flattened fishery table, the choose-five evaluation and the page reference. Nothing from the source is committed.

## Lesson
`SUP-SS1-ENGLISH-AGRICULTURE-VOCAB-T1`, 9 body paragraphs, 6 objectives, 7 practice items, 60 marks; `body_sha256` `7a1e93c73240e6255d0b3b0d16d7934965555c5c927a1ae84a3e377aca9d5ece` recomputed from the UTF-8 body. It teaches the sixteen general terms (land, buildings, crops, finance), the ten livestock terms, and the nine fishery terms; reviews the four faulty source glosses (*arable land*, *amortize*, *ranches*, *animal droopings*) with corrected glosses and a stated reason for each; restates the fishery table in prose with corrected glosses for *cane pole and line*, *ripples* and *fishery*; distinguishes close pairs such as arable land and arable farming, manure and fertilizer, beef and cattle, ranch and pen, fishery and fish farm; and gives a step-by-step method for the choose-five task. Practice Q1 to Q7 are original, each with a complete answer and criterion-level marking that sums to its marks. Q5 is the keyed choose-five task with five model sentences and a two-mark criterion for each chosen word.

| Coverage | Before | After | Taught in |
|---|---|---|---|
| ENGLISH-T1-W04-AG01 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraphs 2–4 and Q1, Q2, Q3, Q6 |
| ENGLISH-T1-W04-AG02 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 5 and Q2, Q3, Q6, Q7 |
| ENGLISH-T1-W04-AG03 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraphs 6–7 and Q4 |
| ENGLISH-T1-W04-AG04 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 9 and Q5: keyed choose-five |

AG05 (reading assignment, Countdown pages 144–145) stays **UNRESOLVED** under `ENGLISH-T1-W04-EXTERNAL-MATERIALS`; no page text or answer is invented.

## Gloss review
- *Arable land*: the source describes farming on the land; the reviewed gloss names the land that can be ploughed and used for crops, and the lesson distinguishes *arable land* from *arable farming*.
- *Amortize*: the source wording is not intelligible; the reviewed gloss is to pay off a debt gradually in regular instalments covering interest and principal.
- *Ranches*: the source gloss has no verb and calls a ranch a confined space; the reviewed gloss calls it a large farm, normally extensive, and contrasts it with a pen or paddock.
- *Animal droopings*: the source headword is misspelt; the reviewed headword is *droppings*, with *animal droppings* accepted as a phrase.
- Fishery table: the extraction flattens the two-column table so a *fish-net* row appears before the FISHERY heading; the lesson restates the terms in prose. *Cane pole and line* is defined by its make-up instead of a circular back-reference; *ripples* gets its general surface-wave sense; the two senses of *fishery* are separated from *fish farm*.
- No glossary entry is presented as an approved correction: the lesson is original teaching, approval stays PENDING, and the source text is not edited.

## Correction decision
No correction is bound. The supplement is additive: it supplies reviewed teaching alongside the source row without changing any shipped lesson, correction or replacement. No `delivery_correction` was added.

## Open items
`ENGLISH-T1-W04-ANSWER-KEYS` narrowed to `ENGLISH-BODY-014`, SP02 and RV01 (AG04 removed; it now has keyed model sentences). `ENGLISH-T1-W04-SOURCE-WORDING-REVIEW` drops AG01, AG02 and AG03 from its affected IDs and records the gloss review. `ENGLISH-T1-W04-EXTERNAL-MATERIALS` for AG05 is unchanged. All other Week 4 open items are untouched. The source text is unchanged.

## For owner review
- The glosses, collocations and example sentences are from general British-English vocabulary knowledge and were **not fetched**. Confirm before approval, especially: *amortize* as a finance term; *arable land* as land rather than the activity; the extent of *ranch* and the contrast with *pen* and *paddock*; *pullet* as a young female chicken in its first laying season; the two senses of *fishery* and the distinction from *fish farm*; and the corrected *cane pole and line* and *ripples* glosses.
- The five model sentences in Q5 are offered as standards, not as a single required answer; any five sentences that use the chosen words correctly earn the marks.
- The lesson contains no approval or verification reference; none is invented. It does not claim to correct the source bytes and does not reproduce them.

## Checks run (authoring only)
SHA-256 of the body recomputed and equal to `body_sha256` and to the queue reference; JSON parse of both edited files and byte-exact round-trip through the project serialization with CRLF; strict key sets checked against the package schema; per-lesson body hashes recomputed for all 28 lessons; unique lesson, coverage, open-item and queue IDs; every `lesson_ids` and `affected_ids` target resolves; every practice item's marking sums to its marks (60 in total); unnamed PARTIAL/UNRESOLVED coverage rows unchanged at 52 compared with the parent branch, none newly unnamed; queue `counts` and `status_counts` recomputed from items (36 implemented, 79 pending, 4 blocked); 8-word shingle comparison against the private render returned matches only inside the four deliberately quoted faulty glosses in Q3, and the body prose returned no shared 5-word sequence; CRLF preserved; `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 4 still has ENG-LES-W04-SPELLING-MISSPELT (next runnable) and ENG-LES-W04-REVISION-KEYS; ENG-LES-W04-SKIM-SCAN still depends on the pending fact item ENG-FACT-READING-T1-T3-UNBOUND, and AG05 remains under the owner-dependent external-materials item. Week 3 still has the owner-dependent ENG-FACT-W03-EXTERNAL-MATERIALS. This does not claim the week, subject or class complete.

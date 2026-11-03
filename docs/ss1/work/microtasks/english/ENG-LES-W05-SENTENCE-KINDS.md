# ENG-LES-W05-SENTENCE-KINDS — English, 1st Term, Week 5 (lesson)

Status: **IMPLEMENTED_TESTING_DEFERRED** — one lesson authored. Content approval **PENDING**, verification **DEFERRED**.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Branch `ss1/eng-les-w05-sentence-kinds-20261103`, **stacked on** `ss1/eng-les-w04-revision-keys-20261103` (PR #309, head `bb7fc49`), itself stacked on PR #308, #307, #306, #305, #304, #303, #302 and #301, because all ten change `english.json` and `QUEUE.json`. Merge #301, then #302, then #303, then #304, then #305, then #306, then #307, then #308, then #309, then this. Master at start: `da0849e32cdb1c717f7ed03b4ed010f563b8cfe0` (3 November 2026).
- Prerequisite ENG-WK-T1-W05 is IMPLEMENTED_TESTING_DEFERRED. The Week 5 coverage entries and open items were reused; no audit was repeated.
- The source row `BODY c6269e8376b264e61acf42202827d91fd9dca763ed98fe494495eff90b17ba66` was read privately from the render made earlier this session (member SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`, verified then). The section read was the kinds-of-sentences block from the WEEK FIVE heading to before the essay section. Nothing from the source is committed.

## Lesson
`SUP-SS1-ENGLISH-SENTENCE-KINDS-T1`, 10 body paragraphs, 6 objectives, 6 practice items, 60 marks; `body_sha256` `e55b363b1d05065c5cb382c7f86c0b55cabf7985e3e91b7d7900d689926f5a5e` recomputed from the UTF-8 body. It teaches a sentence definition that includes commands and exclamations, the clause as the counting unit with compound predicates, the simple, compound, complex and compound-complex kinds, the course-book “multiple sentence” label as a longer compound rather than a different structure, a five-step clause-counting method, punctuation checks and the commonest counting errors. Practice Q1 to Q6 are original, each with a complete answer and criterion-level marking that sums to its marks. Q6 is the keyed write-five-sentences task, with model answers, clause counts and an accepted-label note.

| Coverage | Before | After | Taught in |
|---|---|---|---|
| ENGLISH-T1-W05-KS01 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraphs 1, 2 and 10 and Q1 |
| ENGLISH-T1-W05-KS02 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 3 and Q2(a) |
| ENGLISH-T1-W05-KS03 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 4 and Q2(b) |
| ENGLISH-T1-W05-KS04 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraphs 2, 5 and 9 and Q2(e), Q6(c) |
| ENGLISH-T1-W05-KS05 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 6 and Q3 |
| ENGLISH-T1-W05-KS06 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 7 and Q2(d), Q6(e) |
| ENGLISH-T1-W05-KS07 | PARTIAL | IMPLEMENTED_EQUIVALENT | Paragraph 8 and Q6 |

## Review of the source
- The outline names three kinds, but the teaching that follows covers five; the outline calls the last one by a slashed name. The lesson teaches the five encountered kinds and records the mismatch in paragraph 10.
- The definition contains a mistyped plural verb and leaves out subjectless commands. The lesson defines a sentence through complete sense and finite clauses, and explains the understood *you* and verbless exclamations.
- Both multiple-sentence examples may contain fewer than three main clauses, because one subject can carry several coordinated predicates. The lesson shows a genuine three-clause example with each clause listed, and states that one subject with several verbs is one clause.
- The compound section names “or” but illustrates only “and” and “but”. The lesson illustrates “or” and also warns against the comma splice.
- The complex definition uses a singular noun after “one or more”. The lesson states that one subordinate clause makes a sentence complex and that further subordinate clauses do not make it compound.
- The single compound-complex example reuses the compound example with a clause added. The lesson supplies two fresh examples with the clauses counted.
- No model answers or marks are given for the evaluation. **None is inferred**; Q6, its model answers and its marking are newly written.

## Correction decision
No correction is bound. The supplement is additive and does not change any shipped lesson, correction or replacement. No `delivery_correction` was added. The supplement is attached to KS01 to KS07 only through coverage `lesson_ids`, with the original source target kept first.

## Open items
`ENGLISH-T1-W05-ANSWER-KEYS` drops KS07 and `ENGLISH-BODY-015`; the essay (ES04) and revision questions (RV01) remain. `ENGLISH-T1-W05-SOURCE-WORDING-REVIEW` drops KS01, KS04 and KS06 and records the review; ES02, ES03, SE01, SE02 and RV01 remain. `ENGLISH-T1-W05-SENTENCE-KINDS-BINDING` stays open for the owner's choice between the five-way label and the four standard kinds; its detail records that the teaching is authored, that the supplement is additive and that no binding is invented. `ENGLISH-T1-W05-EXTERNAL-MATERIALS`, `ENGLISH-T1-W05-EXPOSITORY-ESSAY`, `ENGLISH-T1-W05-INSURANCE-VOCAB` and `ENGLISH-T1-W05-VOCAB-OBJECTIVE-CONFLICT` are untouched. The source text is unchanged.

## For owner review
- The grammar descriptions and examples are from general British-English grammar knowledge and were **not fetched**. Confirm before approval, especially: the understood *you* in commands; *there* as a non-subject in “There are three chairs”; a coordinated predicate counting as one clause; “Although it rained, we stayed because the hall was warm” as complex with two subordinate clauses; “My brother, who lives in Lagos, is visiting” as complex; and the five-way label as a course-book convention.
- The lesson accepts either label for a three-main-clause sentence when the clause count is shown. The decision whether the course uses “multiple sentence” is left to the owner and is not made by the lesson.
- The lesson contains no approval or verification reference; none is invented. It does not claim to correct the source bytes and does not reproduce them.

## Checks run (authoring only)
SHA-256 of the body recomputed and equal to `body_sha256` and to the queue reference; JSON parse of both edited files; strict key sets checked against the package schema; per-lesson body hashes recomputed for all 31 lessons; unique lesson, coverage, open-item and queue IDs; every `lesson_ids` and `affected_ids` target resolves; every practice item's marking sums to its marks (60 in total); unnamed PARTIAL/UNRESOLVED coverage rows unchanged at 52 compared with the parent branch, none newly unnamed; queue `counts` and `status_counts` recomputed from items (39 implemented, 76 pending, 4 blocked); 8-, 7- and 6-word shingle comparison against the private render returned no shared sequence, and the only 5-word overlaps are generic grammar frames (*at least one subordinate clause*, *two or more main clauses*); CRLF preserved; `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 5 still has ENG-LES-W05-EXPOSITORY-ESSAY (next runnable), ENG-LES-W05-REVISION-KEYS and ENG-LES-W05-STOCK-INSURANCE-VOCAB, which depends on the pending fact item ENG-FACT-W05-VOCAB-OBJECTIVE; RA01, ES05 and WA01 stay under the owner-dependent external-materials item. Week 4 still has ENG-LES-W04-SKIM-SCAN, which depends on the pending fact item ENG-FACT-READING-T1-T3-UNBOUND. Week 3 still has the owner-dependent ENG-FACT-W03-EXTERNAL-MATERIALS. This does not claim the week, subject or class complete.

# ENG-LES-W02-PHRASAL-VERBS — English, 1st Term, Week 2 (lesson)

Status: **IMPLEMENTED_TESTING_DEFERRED** — one lesson authored. Content approval **PENDING**, verification **DEFERRED**.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Branch `ss1/eng-les-w02-phrasal-verbs-20261103`, **stacked on** `ss1/eng-wk-t1-w05-20261103` (head `466ee89`, PR #298, not yet merged) because both change `english.json` and `QUEUE.json`. Merge PR #298 first. Master at start: `7a57f83b1c51460b340a33ec17e1536b24f29d70`.
- Prerequisite ENG-WK-T1-W02 is IMPLEMENTED_TESTING_DEFERRED. Existing coverage evidence (PV02, PV05, LB04) and open items were reused; no audit was repeated.
- Source: `1ST TERM S1 ENGLISH LANGUAGE.doc`, SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef` (standalone file, verified earlier this session; the composite archive was not supplied and was not checked). The two rows read again were the extraction bodies `3bf9e57695b4…` (phrasal verbs) and `ecb99bd6ceea…` (library vocabulary and revision questions), to confirm the glosses, look-up list and revision items. Nothing from them is reproduced.

## Lesson
`SUP-SS1-ENGLISH-PHRASAL-VERBS-T1`, 9 body paragraphs, 3 objectives, 7 practice items, 46 marks; `body_sha256` `71893c9aaea9dd561b885a9bbb91452f44346cb6da7aae78f303b7e9fddf29e8` recomputed from the UTF-8 body. It teaches the definition and literal versus phrasal use; the eight listed single-particle verbs with reviewed meanings (including 'come through' as survive, not 'experience'); where an object and a pronoun go; the eight look-up verbs with meanings and examples (three senses of 'turn out'); a four-step gap-fill method with a worked example; and get through to, make away with and look up to. Practice Q1 to Q7 are original, with full answers and criterion-level marking that sums to each item's marks.

## Bindings
| Coverage | Before | After | Note |
|---|---|---|---|
| ENGLISH-T1-W02-PV02 | PARTIAL | IMPLEMENTED_EQUIVALENT | Reviewed glosses and examples for the eight verbs; original row kept |
| ENGLISH-T1-W02-PV05 | PARTIAL | IMPLEMENTED_EQUIVALENT | Source gave no meanings; these are authored equivalents |
| ENGLISH-T1-W02-LB04 | PARTIAL | IMPLEMENTED_EQUIVALENT | Equivalent keyed set only; source items stay unkeyed and source item 2 stays unrepaired |

**No correction binding.** The supplement does not teach PV01 (definition as stated in the row), PV03 (double particles) or PV04 (evaluation) as source-bound items, and the library-vocabulary row (BODY-007) is a different objective, so replacing ENGLISH-BODY-005 would displace teaching it does not cover. Whether to bind later belongs to ENG-FACT-REPLACEMENT-SCOPE.

## Open items
`ENGLISH-T1-W02-ANSWER-KEYS` removed (its action is complete for PV05 and LB04). `ENGLISH-T1-W02-SOURCE-WORDING-REVIEW` narrowed: PV02 and ENGLISH-BODY-005 removed; the adverb, conjunction and preposition entries remain for ENG-LES-W02-ADVERB-CONJ-PREP. `ENGLISH-T1-W02-EXTERNAL-MATERIALS` untouched.

## For owner review
- Dictionary senses for the sixteen phrasal verbs, and for get through to, make away with and look up to, are paraphrased from general knowledge and were **not fetched**. Confirm before approval, especially 'round off' (number sense), 'cut in' (traffic sense), 'touch down' and the three senses of 'turn out'.
- The lesson contains no approval reference; none is invented.

## Checks run (authoring only)
SHA-256 of the body recomputed and equal to `body_sha256`; JSON parse and round-trip of both files; unique lesson, coverage and queue IDs; every practice item's marking sums to its marks (46 in total); every `lesson_ids` target resolves; equivalent entries carry the supplement; open-item `affected_ids` resolve; queue counts recomputed from items; `git diff`. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 2 still has ENG-LES-W02-ADVERB-CONJ-PREP (next runnable) and ENG-FACT-W02-EXTERNAL-MATERIALS. This does not claim the week, subject or class complete.

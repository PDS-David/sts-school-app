# ENG-LES-W03-IDIOMS — English, 1st Term, Week 3 (lesson)

Status: **IMPLEMENTED_TESTING_DEFERRED** — one lesson authored. Content approval **PENDING**, verification **DEFERRED**.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Branch `ss1/eng-les-w03-idioms-20261103`, **stacked on** `ss1/eng-les-w03-essay-report-20261103` (head `2bc4cfd`, PR #301, not yet merged) because both change `english.json` and `QUEUE.json`. Merge PR #301 first. Master at start: `4f5bd69b30245a3d07f918a79b46dc76447bf8e6`.
- Prerequisite ENG-WK-T1-W03 is IMPLEMENTED_TESTING_DEFERRED. The existing Week 3 coverage entry and open items were reused; no audit was repeated.
- Source row read privately from the render made earlier this session (member `SSS 1/1st Term SS1_/1ST TERM S1 ENGLISH LANGUAGE.doc`, SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`, verified then; the archive and member were not re-hashed in this run). The section read was the `C. IDIOMS` block and its list of 49 entries, to review the flagged forms and glosses. Nothing is reproduced; the source is not committed.

## Lesson
`SUP-SS1-ENGLISH-IDIOMS-T1`, 10 body paragraphs, 6 objectives, 8 practice items, 62 marks; `body_sha256` `3ef92806e67e91f66b61cd40845222ec10a76f6e1f9da6ba288105184f39ef54` recomputed from the UTF-8 body. It defines an idiom and gives three tests (composition, fixedness, limited variation); teaches the fixed forms the source gets wrong; groups reviewed idioms by theme with meanings and example sentences; separates expressions that are not idioms; explains register, density and the grammar around a fixed phrase with a short model paragraph; and closes with a four-step answering method and the four recurring traps. Practice Q1 to Q8 are original, each with a complete answer and criterion-level marking that sums to its marks.

## Source entries reviewed
| Source entry | Review outcome taught in the lesson |
|---|---|
| The breathe one's last | fixed form `to breathe one's last`; `breathe` is the verb, `breath` the noun |
| To be a bird of a feather [not - birds of the same feather] | fixed form `birds of a feather`; the bracketed correction is removed |
| To have a light finger | fixed form `to have light fingers`, plural |
| To take a bull by the horn | fixed form `to take the bull by the horns` |
| A snail pace | fixed form `at a snail's pace` |
| To throw light | completed as `throw light on` |
| To call to a halt | fixed form `call a halt to something` |
| Burn candle at both ends | article restored: `burn the candle at both ends` |
| Baptism of fire | gloss replaced: a difficult or dangerous first experience |
| Bed of roses | gloss replaced: a situation of ease, almost always used in the negative |
| By rule of thumb | gloss replaced: a rough method based on practice, not theory |
| To beat about the bush | gloss replaced: to avoid coming to the point |
| To chase one's shadow | set aside as unreliable; `to chase shadows` glossed as pursuing what cannot be caught |
| To give an airy nothing | not a standard set expression; taught as a literary phrase, not an idiom |
| A backlog | not an idiom: one noun, an accumulation of unfinished work or arrears |
| An ample opportunity | not an idiom: an ordinary quantifier with a noun |
| Beginning of a new era | not an idiom: an ordinary descriptive phrase |

## Bindings
| Coverage | Before | After | Note |
|---|---|---|---|
| ENGLISH-T1-W03-ID02 | PARTIAL | IMPLEMENTED_EQUIVALENT | Reviewed set, meanings, example sentences and keyed practice; original row kept |

**No correction binding.** Row `ENGLISH-BODY-010` also carries MN03 (the displaced monophthong evaluation) and MN04 (the reading assignment), so replacing the whole row would displace teaching this lesson does not cover. Whether to bind a row-level correction belongs to a separate scope review.

## Open items
`ENGLISH-T1-W03-SOURCE-WORDING-REVIEW` narrowed: `ENGLISH-T1-W03-ID02` and `ENGLISH-BODY-010` removed from `affected_ids`; the entertainment glosses (EN02) and the monophthong word lists (MN02, with row entries `ENGLISH-BODY-009` and `ENGLISH-BODY-011`) remain. `ENGLISH-T1-W03-ANSWER-KEYS` and `ENGLISH-T1-W03-EXTERNAL-MATERIALS` untouched. `ENGLISH-BODY-010` stays named by both of those, so it remains a declared blocker.

## For owner review
- The idiom forms and senses are paraphrased from general knowledge and were **not fetched**. Confirm every meaning before approval, especially `a baptism of fire`, `an acid test`, `by rule of thumb` and the treatment of `to chase shadows`.
- The lesson contains no approval reference; none is invented. The source list is unchanged and still delivered.

## Checks run (authoring only)
SHA-256 of the body recomputed and equal to `body_sha256` and to the queue's recorded value; per-lesson body hashes recomputed for all 23 lessons; JSON parse of both edited files; unique IDs in every section; every `lesson_ids` and `affected_ids` target resolves; each practice item's marking sums to its marks (62 in total); no new unnamed blocker compared with the parent branch; queue `counts` and `status_counts` recomputed from items; CRLF preserved; 8-word and 10-word shingle comparison against the private render returned no shared sequence (the only 6-word overlaps are the idiom expressions themselves, which must be quoted to be taught); `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 3 still has ENG-LES-W03-ENTERTAINMENT-VOCAB (next runnable), ENG-LES-W03-MONOPHTHONGS-SCOPE, ENG-LES-W03-REVISION-KEYS and ENG-FACT-W03-EXTERNAL-MATERIALS. This does not claim the week, subject or class complete.

# ENG-LES-W03-ENTERTAINMENT-VOCAB — English, 1st Term, Week 3 (lesson)

Status: **IMPLEMENTED_TESTING_DEFERRED** — one lesson authored. Content approval **PENDING**, verification **DEFERRED**.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Branch `ss1/eng-les-w03-entertainment-vocab-20261103`, **stacked on** `ss1/eng-les-w03-idioms-20261103` (PR #302, itself stacked on PR #301) because all three change `english.json` and `QUEUE.json`. Merge #301, then #302, then this. Master at start: `4f5bd69b30245a3d07f918a79b46dc76447bf8e6`.
- Prerequisite ENG-WK-T1-W03 is IMPLEMENTED_TESTING_DEFERRED. The Week 3 coverage entries and open items were reused; no audit was repeated.
- Source row read privately from the render made earlier this session (member SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`, verified then; not re-hashed in this run). The section read was `D. VOCABULARY DEVELOPMENT` from its heading to the revision questions, to review the sixteen glosses. Nothing is reproduced; the source is not committed.

## Lesson
`SUP-SS1-ENGLISH-ENTERTAINMENT-VOCAB-T1`, 10 body paragraphs, 6 objectives, 8 practice items, 62 marks; `body_sha256` `b03411aeee4ee55c212bdfc1e1b8c6d1e946ee2232c73c47159bcfd0ccb16d0d` recomputed from the UTF-8 body. It gives reviewed glosses in fresh wording for the ten sport words and six theatre words, corrects the four faulty source entries, separates referee from linesman and from umpire, adds the collocations and other parts of speech, supplies model sentences and a four-step answering method. Practice Q1 to Q8 are original, each with a complete answer and criterion-level marking that sums to its marks.

## Source glosses reviewed
| Source entry | Review outcome taught in the lesson |
|---|---|
| Football (no gloss at all) | supplied: the game in which two teams of eleven try to kick a ball into the other goal |
| Linesman (clause repeated twice) | one clause: an official who assists the referee, chiefly on whether the ball has crossed a touchline or goal line; assistant referee is the neutral term |
| Track Suit (“wooden clothes”) | warm clothing worn by athletes before and after exercise |
| Athletics (“exercise of physical strength or speed”) | track and field sports: running, jumping and throwing events |
| Curtain-Call (loose) | the performers’ return to the stage after the play, in answer to applause |
| Penalty (“punishment for a foul”) | a free kick at goal given for a serious foul inside the penalty area |
| Referee, marathon, podium, contingent, soccer, actor, box-office, cast, director, usher | kept in sense, restated in fresh wording with a class and an example |

## Bindings
| Coverage | Before | After | Note |
|---|---|---|---|
| ENGLISH-T1-W03-EN02 | PARTIAL | IMPLEMENTED_EQUIVALENT | Reviewed sport glosses, corrections and keyed practice; original row kept |
| ENGLISH-T1-W03-EN03 | SUPPORTED | IMPLEMENTED_EQUIVALENT | Reviewed theatre glosses with the curtain-call correction; original row kept |

**No correction binding.** Row `ENGLISH-BODY-011` also holds EN04, EN05, EN06 and EN07, so replacing the whole row would displace teaching and external material this lesson does not cover. Whether to bind a row-level correction belongs to a separate scope review.

## Open items
`ENGLISH-T1-W03-SOURCE-WORDING-REVIEW` narrowed to the monophthong word lists alone (`ENGLISH-BODY-009`, `ENGLISH-T1-W03-MN02`), with `required_action` pointing at ENG-LES-W03-MONOPHTHONGS-SCOPE. `ENGLISH-T1-W03-ANSWER-KEYS` now covers only MN03 and EN06; `ENGLISH-T1-W03-EXTERNAL-MATERIALS` untouched.

## For owner review
- The glosses are paraphrased from general knowledge and were **not fetched**. Confirm before approval, particularly the penalty gloss (free kick in the penalty area), the neutral status of *assistant referee*, and the use of *soccer* as informal British English.
- The lesson contains no approval reference; none is invented. The source glosses are unchanged and still delivered.

## Checks run (authoring only)
SHA-256 of the body recomputed and equal to `body_sha256` and to the queue record; per-lesson body hashes recomputed for all 24 lessons; JSON parse of both edited files; unique IDs in every section; every `lesson_ids` and `affected_ids` target resolves; each practice item's marking sums to its marks (62 in total); no new unnamed blocker compared with the parent branch; queue `counts` and `status_counts` recomputed from items; CRLF preserved; 8-word shingle comparison against the private render returned no shared sequence; `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 3 still has ENG-LES-W03-MONOPHTHONGS-SCOPE (next runnable), ENG-LES-W03-REVISION-KEYS and ENG-FACT-W03-EXTERNAL-MATERIALS. This does not claim the week, subject or class complete.

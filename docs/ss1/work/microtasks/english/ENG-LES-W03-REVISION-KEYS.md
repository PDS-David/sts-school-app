# ENG-LES-W03-REVISION-KEYS — English, 1st Term, Week 3 (lesson)

Status: **IMPLEMENTED_TESTING_DEFERRED** — one lesson authored. Content approval **PENDING**, verification **DEFERRED**.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Branch `ss1/eng-les-w03-revision-keys-20261103`, **stacked on** `ss1/eng-les-w03-monophthongs-20261103` (PR #304), itself stacked on PR #303, #302 and #301, because all five change `english.json` and `QUEUE.json`. Merge #301, then #302, then #303, then #304, then this. Master at start: `da0849e32cdb1c717f7ed03b4ed010f563b8cfe0` (3 November 2026).
- Prerequisite ENG-WK-T1-W03 is IMPLEMENTED_TESTING_DEFERRED. The Week 3 coverage entries and open items were reused; no audit was repeated.
- The source section `GENERAL EVALUATION/ REVISION QUESTIONS` was read privately from the render made earlier this session (member SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`, verified then). It holds five stem-and-options items: reported speech (two), a suffix item with *endear* (one) and the passive voice (two). The stems and options are **not** reproduced, no answer is inferred from them, and the source is not committed.

## Lesson
`SUP-SS1-ENGLISH-REVISION-W03-T1`, 10 body paragraphs, 6 objectives, 6 practice items, 60 marks; `body_sha256` `8e37cd0aeadee234c7caa84c0a2a674105c0d515925b7cecd137633191aac94e` recomputed from the UTF-8 body. It teaches reported statements with backshift, pronoun and time/place changes, the say/tell distinction, reported questions and commands; suffixation with -ment, -ness, -ful, -less, -tion, -able, -ly and -en, including spelling changes; and passive formation and tense sequence, two-object verbs and the limits of the passive. Practice Q1 to Q6 are original, each with a complete answer and criterion-level marking that sums to its marks.

| Item | Focus | Marks |
|---|---|---|
| Q1 | Five statements reported in indirect speech | 10 |
| Q2 | Two questions and two commands/requests reported | 8 |
| Q3 | Three reported-speech errors corrected | 6 |
| Q4 | Six base + suffix forms and word classes | 12 |
| Q5 | Six active sentences rewritten in the passive | 12 |
| Q6 | Mixed voice, reporting and suffixation items | 12 |

## Bindings
| Coverage | Before | After | Note |
|---|---|---|---|
| ENGLISH-T1-W03-EN06 | PARTIAL | IMPLEMENTED_EQUIVALENT | Keyed revision set on the three tested structures; the source anchor is kept first in `lesson_ids` |

**No correction binding.** The source's revision questions stay unchanged and unanswered in place; this lesson is an equivalent, not a replacement, and no answer is inferred from the source options. The original row is not corrected.

## Open items
`ENGLISH-T1-W03-ANSWER-KEYS` removed: both Week 3 tasks it named now have keys (MN03 in `SUP-SS1-ENGLISH-MONOPHTHONGS-T1`, EN06 here), and the minutes task ES04 was already covered. `ENGLISH-T1-W03-EXTERNAL-MATERIALS` untouched: the Week 3 weekend assignment still needs owner-supplied extracts and rights. The source text is unchanged.

## For owner review
- The grammar descriptions and answers are from general British-English grammar knowledge and were **not fetched**. Confirm before approval, especially: *must* expressing obligation becoming *had to*; universal truths being allowed to keep the present; the time and place word correspondences; *argue* becoming *argument*; the two-object passive alternatives; and the note that the *get*-passive is informal.
- The lesson contains no approval reference; none is invented. It does not claim to correct the source bytes and does not reproduce them.

## Checks run (authoring only)
SHA-256 of the body recomputed and equal to `body_sha256` and to the queue reference; JSON parse of both edited files; strict key sets checked against the package schema; per-lesson body hashes recomputed for all 26 lessons; unique lesson, coverage, open-item and queue IDs; every `lesson_ids` and `affected_ids` target resolves; every practice item's marking sums to its marks (60 in total); unnamed PARTIAL/UNRESOLVED coverage rows unchanged at 52 compared with the parent branch, none newly unnamed; queue `counts` and `status_counts` recomputed from items (34 implemented, 81 pending, 4 blocked); 8-word shingle comparison against the private render returned no shared sequence, and the only 5-word overlap was the generic reporting frame *becomes he said that he*; CRLF preserved; `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 3 still has ENG-FACT-W03-EXTERNAL-MATERIALS, which needs owner-supplied extracts. The next runnable lesson is ENG-LES-W04-NOUN-VERB-PHRASE-SCOPE; ENG-LES-W04-SKIM-SCAN still depends on the pending fact item ENG-FACT-READING-T1-T3-UNBOUND. This does not claim the week, subject or class complete.

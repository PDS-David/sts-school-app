# ENG-LES-W03-MONOPHTHONGS-SCOPE — English, 1st Term, Week 3 (lesson)

Status: **IMPLEMENTED_TESTING_DEFERRED** — one lesson authored. Content approval **PENDING**, verification **DEFERRED**.
Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Branch `ss1/eng-les-w03-monophthongs-20261103`, **stacked on** `ss1/eng-les-w03-entertainment-vocab-20261103` (PR #303), itself stacked on PR #302 and PR #301, because all four change `english.json` and `QUEUE.json`. Merge #301, then #302, then #303, then this. Master at start: `da0849e32cdb1c717f7ed03b4ed010f563b8cfe0` (3 November 2026), which has merged #301 and #302.
- Prerequisite ENG-WK-T1-W03 is IMPLEMENTED_TESTING_DEFERRED. The Week 3 coverage entries and open items were reused; no audit was repeated.
- Source row read privately from the render made earlier this session (member SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`, verified then; not re-hashed in this run). The section read was the monophthong row, to confirm the replacement's gaps. Nothing is reproduced; the source is not committed.

## Lesson
`SUP-SS1-ENGLISH-MONOPHTHONGS-T1`, 8 body paragraphs, 6 objectives, 6 practice items, 60 marks; `body_sha256` `79bf6e278230a87d4077c775126af3243c0194404059217196ff8831b89fea2c` recomputed from the UTF-8 body. It defines a monophthong as a pure vowel held in one position and contrasts it with a gliding diphthong; groups the twelve symbols by relative length; gives two ordinary examples of each sound; treats spelling traps, near-identical symbols, the monophthong/diphthong test and a fixed method for an examples task; and states the limit of written work. Practice Q1 to Q6 are original, with complete answers and criterion-level marking that sums to each item's marks.

## Examples supplied
| Sound | Two examples | Check noted in the lesson |
|---|---|---|
| /iː/ | see, team | same sound written differently |
| /ɪ/ | sit, big | short partner of /iː/ |
| /e/ | bed, said | said is /sed/, not /seɪd/ |
| /æ/ | cat, hand | more open than /e/ |
| /ɑː/ | car, father | long, not the /æ/ of cat |
| /ɒ/ | hot, clock | British English, short |
| /ɔː/ | saw, door | long partner of /ɒ/ |
| /ʊ/ | book, put | short partner of /uː/ |
| /uː/ | food, blue | long, including blue |
| /ʌ/ | cup, love | same sound written differently |
| /ɜː/ | bird, work | long |
| /ə/ | about, teacher | schwa, always unstressed |

The source's repeated and misplaced word lists are not reproduced or reused; every example here is common vocabulary chosen independently.

## Bindings
| Coverage | Before | After | Note |
|---|---|---|---|
| ENGLISH-T1-W03-MN01 | PARTIAL | IMPLEMENTED_EQUIVALENT | Definition and monophthong/diphthong contrast in paragraphs 1 and 2; original target kept |
| ENGLISH-T1-W03-MN03 | PARTIAL | IMPLEMENTED_EQUIVALENT | Keyed "two examples of each sound" set in Q1; source anchor kept first in `lesson_ids` |

**No correction binding.** Correction `SS1-02-english-COR-005` already replaces source row `ENGLISH-BODY-009` in delivery. This lesson is an equivalent extension of that replacement, not a second replacement: the original row and the existing correction are untouched, and adding another correction for the same row would be redundant.

## Open items
`ENGLISH-T1-W03-PHONETICS-REPLACEMENT-SCOPE` removed: the replacement's scope was reviewed and extended by this lesson, and MN01 and MN03 are now equivalent. `ENGLISH-T1-W03-SOURCE-WORDING-REVIEW` removed: the twelve example pairs were reviewed, none reproduces the source's repeated or misplaced entries, and the existing correction already replaces the row for delivery, so no further binding was added. `ENGLISH-T1-W03-ANSWER-KEYS` narrowed to `ENGLISH-BODY-010`, `ENGLISH-BODY-011` and `ENGLISH-T1-W03-EN06`; its detail and required action now name only the revision questions. `ENGLISH-T1-W03-EXTERNAL-MATERIALS` untouched. The source text is unchanged.

## For owner review
- The definitions, symbols and examples come from general British-English pronunciation knowledge and were **not fetched**. Confirm before approval, especially: /e/ rather than /ɛ/ for DRESS; eight diphthongs counted with /ʊə/, which many speakers merge with /ɔː/; *said* /sed/; *women* /ˈwɪmɪn/; *busy* /ˈbɪzi/; and the /ə/ examples *about* and *teacher*.
- The lesson contains no approval reference; none is invented. It does not claim to correct the source bytes and does not reproduce them.

## Checks run (authoring only)
SHA-256 of the body recomputed and equal to `body_sha256` and to the queue reference; JSON parse of both edited files; strict key sets checked against the package schema for the lesson, practice, marking, provenance and state objects; per-lesson body hashes recomputed for all 25 lessons; unique lesson, coverage, open-item and queue IDs; every `lesson_ids` and `affected_ids` target resolves; every practice item's marking sums to its marks (60 in total); unnamed PARTIAL/UNRESOLVED coverage rows unchanged at 52 compared with the parent branch, none newly unnamed; queue `counts` and `status_counts` recomputed from items (33 implemented, 82 pending, 4 blocked); 5-word and 8-word shingle comparison against the private render returned no shared sequence; CRLF preserved; `git diff` reviewed. Nothing was run against the importer, compiler, database or tests.

## Remaining
Week 3 still has ENG-LES-W03-REVISION-KEYS (next runnable) and ENG-FACT-W03-EXTERNAL-MATERIALS. This does not claim the week, subject or class complete.

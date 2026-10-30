# UNR-01 English — bind reading supplements to the rows they replace

Base: `origin/master` `8ffcd12b4b4067072787268b8de3ef1dd1eaabef` (30 October 2026). No open PRs at start or before publication. Authoring checks only; testing deferred by owner. Status of this item: `IMPLEMENTED_TESTING_DEFERRED` (decision recorded); not verified, not approved.

## Lessons reviewed

`english.json` has 19 lessons. Three are reading supplements: `SUP-SS1-ENGLISH-READING-T1`, `-T2`, `-T3`. All three have the identical body, SHA-256 `7c5883178f99e9d6800bb9136625912b51a9db271e5dc5c5b12a8dbd2c3bdfa5` (recomputed from the body as UTF-8). The body opens by saying it is a newly authored equivalent activity, not a reproduction of a missing textbook passage. It teaches skimming, scanning, supported inference, context vocabulary and summary, using one original passage (a school library timetable) and three questions (6 marks). It names no textbook, page, religion passage, essay type, diction topic or exam passage. `-T2` is already bound (to 2nd Term rows); `-T3` cannot bind to 1st Term rows.

## Decisions (from the lesson body only)

| ID | Objective (short) | Old status | New status | Decision |
|---|---|---|---|---|
| ENGLISH-T1-W02-CM01 | Religion passage, Effective English pp54-55, with reading assignment | UNRESOLVED | UNRESOLVED | Closest candidate. The supplement teaches generic reading skills but not the passage content (the deity, Yoruba beliefs, Tiv initiation). Not bound. Its stale evidence item was replaced with this decision. |
| ENGLISH-T1-W02-CM03 | Evaluation, Practice 3, p56, Effective English | UNRESOLVED | UNRESOLVED | A pointer to an exercise whose questions are unknown; the supplement's questions are not that exercise. |
| ENGLISH-T1-W02-LB02 | Evaluation, Exercise (b), p160, Countdown | UNRESOLVED | UNRESOLVED | Same: exercise content unknown. |
| ENGLISH-T1-W02-LB03 | Reading assignment, p159, Countdown | UNRESOLVED | UNRESOLVED | A page reference; the page is not supplied and its topic is not stated. |
| ENGLISH-T1-W02-LB05 | Weekend assignment, pp271-272, Qs 91-100, Countdown | UNRESOLVED | UNRESOLVED | Question type and content unknown. |
| ENGLISH-T1-W03-ES05 | Reading assignment, essay types, pp2-5, Count Down in English | UNRESOLVED | UNRESOLVED | Topic is essay types; the supplement teaches reading, not essay types. |
| ENGLISH-T1-W03-MN04 | Reading assignment, p11, Standard Speech 10 (diction) | UNRESOLVED | UNRESOLVED | Diction/speech reading; unrelated to the supplement. |
| ENGLISH-T1-W03-EN04 | Evaluation, p148 practice, Effective English for SS 1 | UNRESOLVED | UNRESOLVED | Exercise content unknown. |
| ENGLISH-T1-W03-EN05 | Reading assignment, p169, Countdown in English | UNRESOLVED | UNRESOLVED | A page reference; topic not stated. |
| ENGLISH-T1-W03-EN07 | Weekend assignment, p352, Passage A, Nos 1-18, Countdown | UNRESOLVED | UNRESOLVED | A specific passage with 18 questions; the supplement has one passage and three questions. |

No equivalent was found, so no `lesson_ids` entry was added and no status changed. Binding any of these would present a generic activity as the textbook material, which the source row itself does not support. Whether a labelled equivalent activity is acceptable is an owner decision, as the four queue items already say.

## Changes

- `backend/src/db/ss1/subjects/english.json`: one evidence item on `ENGLISH-T1-W02-CM01` replaced (it said the supplement was unbound and un-reviewed). Nothing else; lesson bodies and hashes, coverage count (155), lesson count (19) and the status split (PARTIAL 84, IMPLEMENTED_EQUIVALENT 45, SUPPORTED 13, UNRESOLVED 10, MARKER 3) are unchanged.
- `docs/ss1/work/microtasks/english/QUEUE.json`: the decision was appended to `implementation_reference` of `ENG-FACT-READING-T1-T3-UNBOUND`, `ENG-FACT-W02-EXTERNAL-MATERIALS` and `ENG-FACT-W03-EXTERNAL-MATERIALS`. All four named items stay PENDING; `ENG-FACT-W01-EXTERNAL-MATERIALS` has no entry among the ten and is unchanged. Counts and status_counts are unchanged.

## Still open

- All 10 entries stay UNRESOLVED. They need the authorised textbook pages and answers with edition (see UNR-06 for the supply request), or an owner decision to accept a labelled equivalent activity.
- `SUP-SS1-ENGLISH-READING-T1` and `-T3` remain unbound to any row; `-T1` was reviewed against the ten rows only, not against other 1st Term rows.
- All three reading supplements share one body hash; the owner may want distinct or fewer lessons.

## Authoring checks run (not tests)

JSON parses for both files; lesson body hashes unchanged and recomputed; counts equal before and after; `git diff` touches only the three permitted paths. No tests, typecheck, importer, compiler, database, device or other subject; Yoruba untouched.

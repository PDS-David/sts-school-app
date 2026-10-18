# C_ENGLISH_YORUBA — REPORT

**Base:** master `9ee05972d93b896fca9a6b73a09ec4628fb5e08c` (the pack was written against `86a1a6195f47370ebbdecbc806e06d4661fbef58`; master has since gained the Mathematics commits). Branch: **none pushed**. Delivery date 18 October 2026.

## Status in one place
| State | What |
|---|---|
| **Prepared** | 20 new lessons (14 English, 6 Yoruba), 50 changed decisions, evidence, 14 blockers, record deltas |
| **Staged-tested** | Composed into a disposable copy of master; focused tests run on **Node v22.22.2** (24.19.0 not available) |
| **Integrated on master** | **Nothing.** No GitHub credentials or connector existed in the sandbox, so no branch, PR or push was possible |

Because the push could not be made, integration worker F (or the owner) must apply this delivery. The prompt's own contract also reserves shared files and master for F.

## What was done
All 59 mandatory candidates are accounted for: **50 changed decisions** (DECISIONS.csv) and **9 reviewed and left unchanged** (SL-087, 089, 094, 099, 202, 207, 222, 323, 570; reasons in BLOCKERS.csv). Every decision anchor was checked as a literal substring of its supporting lesson body or original row.

New lessons (SUPPLEMENT_UPSERTS.json, all `op: add`, `expected_old_sha256: null`, no replaces, none deleted, no hold released):

| ID | Subject | Term | Gap IDs | Title |
|---|---|---|---|---|
| SUP-EN-VERB-PREP | English Language | 1st Term | EN1-SL184 | Describing emotions: verb or adjective plus the right preposition |
| SUP-EN-NEGATION | English Language | 1st Term | EN1-SL194 | Changing a positive statement into a negative statement |
| SUP-EN-TAGS | English Language | 2nd Term | EN2-SL412 | Question tags: checking and confirming |
| SUP-EN-CONJ | English Language | 2nd Term | EN2-SL410 | Conjunctions: joining words, phrases and clauses |
| SUP-EN-WORDFORM | English Language | 2nd Term | EN2-SL411, EN2-SL415 | Prefixes, suffixes and synonyms: building and choosing words |
| SUP-EN-PRONOUNS | English Language | 2nd Term | EN2-SL413, EN2-SL416 | Personal, possessive and demonstrative pronouns |
| SUP-EN-CONSONANT-PRACTICE | English Language | 1st Term | EN1-SL193, EN1-SL197, EN1-SL217, EN1-SL212 | Consonant practice: /ʒ/ and /dʒ/; /d/, /ð/, /θ/ and /z/; /w/ and /j/ |
| SUP-EN-CONSONANT-PAIRS-2 | English Language | 2nd Term | EN2-SL410S, EN2-SL411S, EN2-SL413S | Consonant contrasts: /t/ and /s/; /s/ and /z/; the nasals /m/, /n/ and /ŋ/ |
| SUP-EN-VOWELS-2 | English Language | 2nd Term | EN2-SL412V, EN2-SL414V, EN2-SL415V, EN2-SL416V, EN2-SL417V | Vowel contrasts: /ʌ/ and /ɑː/; /æ/ and /ɜː/; /ɔː/ and /ɒ/; /ʊ/ and /uː/; schwa /ə/ |
| SUP-EN-FORMAL-LETTER | English Language | 1st Term | EN1-SL200, EN1-SL205, EN2-SL413L | Formal letter: layout, tone and a complete model |
| SUP-EN-ESSAY-REVIEW | English Language | 2nd Term | EN2-SL416E, EN2-SL417E, EN2-SL504, EN2-SL508, EN2-SL215 | Essay writing review: narrative, descriptive and argumentative structure |
| SUP-EN-CRITICAL-READING | English Language | 1st Term | EN1-SL185, EN1-SL195, EN1-SL199, EN1-SL204, EN1-SL209, EN1-SL214, EN1-SL219 | Critical reading: purpose, facts and opinions, and word meaning in context |
| SUP-EN-LIT-FORMS | English Language | 1st Term | EN1-SL182, EN1-SL187, EN2-SL221 | Literature review: fiction and non-fiction, poetry, and key literary terms |
| SUP-EN-LIT-TEXT-TOOLS | English Language | 1st Term | EN1-SL192, EN1-SL201, EN1-SL206 | Studying any recommended prose or drama text: plot, character, setting and theme |
| SUP-EN-EXAM-PRACTICE | English Language | 2nd Term | EN2-SL502, EN2-SL506, EN2-SL513, EN2-SL514, EN2-SL222 | English exam-style practice with answers (original questions for revision) |
| SUP-YO-MARRIAGE | Yoruba | 2nd Term | YO-SL-344 | Àṣà ìgbéyàwó: marriage in Yoruba culture and the steps the school lists |
| SUP-YO-IRANLOWO-PRACTICE | Yoruba | 1st Term | YO-SL-100, YO-SL-103 | Ìrànra-ẹni-lọ́wọ́: practice on cooperative work and thrift |
| SUP-YO-OBALUAYE | Yoruba | 1st Term | YO-SL-106B | Ọbalúayé (Ṣọ̀pọ̀ná): a bounded alternative reading of the scheme's 'obalale' |
| SUP-YO-LIT-METHOD | Yoruba | 1st Term | YO-SL-095, YO-SL-324 | Reading a Yoruba literature book: a method that works for any set text |
| SUP-YO-OHUN-SILEBU | Yoruba | 1st Term | YO-SL-102 | Àmì ohùn àti sílébù: marking tone and counting syllables |

Gap IDs of the form `EN1-SL184`, `EN2-SL412V` or `YO-SL-102` are new coverage IDs created for this delivery; they pass the existing schema pattern, so **no validator change is needed**.

### Semantic overlaps with existing lessons (reused, not duplicated)
SUP-LETTER (informal letter), SUP-SPEECH (debate), SUP-RHYME, SUP-ADVERBS, SUP-WRITE-2, SUP-EN2-08 (reflexive/relative), SUP-EN2-15 (expository), SUP-EN2-17 (active/passive), SUP-DRUG-EXPOSITION, SUP-IPA and SUP-VOWEL-ER (partly overlap SUP-EN-CONSONANT-PRACTICE and SUP-EN-VOWELS-2: they add minimal pairs and practice, and SUP-IPA's blank-slot selections are unchanged), SUP-YO-OBATALA (SUP-YO-OBALUAYE is the second reading of the same scheme word), SUP-YO-ISUNKI, SUP-YO-IBEERE, SUP-YO-ORAL-GENRES, SUP-YO-ORAL-TEXTS.

### Honest limits of the content
* The lessons are new attributed teaching, not recovered school text. English practice passages, poems and model letters are original and labelled.
* SUP-EN-EXAM-PRACTICE is original practice, plainly **not** past questions. SL-513 and SL-514 therefore stay `OWNER_INPUT_NEEDED_PAST_QUESTIONS`; SL-502 and SL-506 stay `EXISTING_SUPPLEMENT_PARTIAL`. Nothing was placed in Third Term.
* No traditional Ṣàngó pípè, Ọya pípè or egúngún verse was added, and none was invented. The OB-11 verification of the two oral-text excerpts was **not done**: the two PDFs are not in the pack and were not obtained.
* Ten of the fifteen marriage steps are named by the school but not explained here; no source matching them was found. Only ìwádìí, alárinà, ìtọrọ and ìdána are explained, and the lesson says customs vary.
* **The Yoruba lessons and tone marks were written by an AI model and have not been checked by a Yoruba speaker.** They must be reviewed before release (B-C12).
* Source links are reference landing pages (British Council, Cambridge, Wikipedia, Mythopedia, WAEC, DiscoverYoruba, headteacher.ng, Britannica). The English grammar/skills pages were not individually re-fetched in this run.
* Written practice does not show spoken performance, teacher certification or examining-body acceptance.

### DELIVERY_CORRECTIONS.json
Empty array. I found no unsafe original advice in my scope. I did not audit every original English or Yoruba row for errors; I read only the rows I cited.

## Tests actually run (Node v22.22.2, `npm ci --workspace=backend --ignore-scripts`)
See `tests/TEST_RUN_BASELINE.log` and `tests/TEST_RUN_COMPOSED.log`.

* Unmodified master: `jss3-batch2-content` 44/44 pass.
* With upserts composed: `jss3-supplements` 11 pass (1 skipped), `jss3-english-1f-r1` 8 pass (2 skipped), `jss3-english-correction` 3/3, `jss3-text-study` 7/7, new `c_english_yoruba_delivery` 5/5 (includes negative controls).
* With upserts composed, `jss3-batch2-content` is **41/44**. The three failures are record/count pins, not content errors, and F must update them with the record deltas:
  * test 16 (`SUP-MODAL-WILL`): asserts it is the last English 1st-Term supplement and that bucket size + 24 equals 35. Fourteen of my lessons add to English buckets.
  * test 30 (Mathematics lessons): contains a pinned supplement total of 90; the total is now 110.
  * test 39 (records agree): requires every new lesson in IMPLEMENTED_LESSONS.csv, TEACHER_SCHEDULE_SUPPLEMENTS.csv and, for every gap ID, CURRENT_COVERAGE.csv. Use RECORD_DELTAS/ and rerun `scripts/jss3/build_teacher_schedule.py`.
* Not run: full original-source capture via `scripts/jss3/capture_rows.py`, the full combined suite, mobile tests, Node 24.19.0. These belong to F.

## For F — files to change
* `backend/src/db/data/jss3Supplements.json`: append the 20 lessons in the given order (`RECORD_DELTAS/jss3Supplements.append.patch` is that diff against `9ee0597`).
* `docs/jss3/replacements/SEMANTIC_DECISIONS.csv`: replace the 50 rows by candidate_id from DECISIONS.csv, then rebuild SEMANTIC_CLOSURE.csv with `scripts/jss3/build_semantic_closure.py`.
* `IMPLEMENTED_LESSONS.csv`, `CURRENT_COVERAGE.csv` (53 new rows): from RECORD_DELTAS/; regenerate `TEACHER_SCHEDULE_SUPPLEMENTS.csv`.
* Update tests 16, 30 and 39 as above; add `tests/c_english_yoruba_delivery.test.mts`.
* OPEN_BLOCKERS.csv: OB-03, 10, 11, 12 and 13 stay open; update their text to match BLOCKERS.csv. Do not close any.
* No code patch is required (`code.patch` intentionally absent).

## Remaining blockers
See BLOCKERS.csv (B-C01 to B-C14), including the missing push access (B-C14).

# ENG-LES-W01-PRONOUN-ADJ-VERB — English, 1st Term Week 1 pronoun, adjective and verb supplement

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; content approval PENDING, verification DEFERRED; nothing approved or verified). Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Starting SHA: `4a327fc1ceb051751d40a1ebde4991be809175eb` (origin/master). Prerequisites ENG-WK-T1-W01 and ENG-LES-WORD-CLASSES-T1 are IMPLEMENTED_TESTING_DEFERRED (queue and package checked). Open PRs checked through the GitHub API at start: none. No `AGENTS.md` exists in the repository. No branch or PR for this item was found.
- Source `SS1-SRC-a00657d42196`, `1ST TERM S1 ENGLISH LANGUAGE.doc`, manifest member `SSS 1/1st Term SS1_/1ST TERM S1 ENGLISH LANGUAGE.doc`. The owner supplied (a) the standalone file and (b) the 1st Term SS1 archive (`1st_Term_SS1_-20230730T171406Z-001.zip`, SHA-256 `8055d852…5e636`). SHA-256 of the standalone file and of the identical archive member were both `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`, matching `SOURCE_ASSIGNMENTS.csv` and the queue. The full original ZIP (`024487…65c9a3e`) was not supplied and its hash was **not** verified; the supplied 1st Term archive hash is not claimed to match it. A 3rd Term archive supplied earlier was recognised as the wrong source (different member hash) and not used.
- Text was extracted privately with the repository's extractor package (`word-extractor`) only to re-read the pronoun, adjective and verb section of Week 1 Section B. Nothing from the source and no private render is committed.
- References consulted 2026-10-28 for disputed or technical points (reference only; all prose, examples and practice are original): ACARA English glossary (pronoun types), Scribbr (possessive pronouns; adjectives), KSE Academy (adjective endings, -ic/-ical), Oxford Learner's Dictionaries (work, works), iPleaders (damage/damages), Dictionary.com (stationary/stationery), University of Jijel course notes (auxiliaries, semi-modals), Thesaurus.com (transitive/intransitive).

## Changes
- `english.json`: new lesson `SUP-SS1-ENGLISH-PRONOUN-ADJ-VERB-T1` (6 objectives, 9 teaching paragraphs, 10 practice items, 64 marks; each item's marking sums to its marks; `body_sha256` `cd32486d12e6307489ad4970188598b095c7f953f6808440650e7bd8f4475da5` checked against the UTF-8 body). State: approval PENDING, IMPLEMENTED, verification DEFERRED, no approval or verification reference. The existing `SUP-SS1-ENGLISH-WORD-CLASSES-T1` and `SUP-SS1-ENGLISH-NOUNS-T1` were not changed.
- Coverage: `ENGLISH-T1-W01-P02`, `A01`, `A02`, `A03`, `V02`, `V04` -> IMPLEMENTED_EQUIVALENT with the new lesson in `lesson_ids` (original evidence retained; one evidence entry appended to each). `ENGLISH-T1-W01-R01` stays **PARTIAL**: the works/work, damages/damage and stationery/stationary contrasts are taught (paragraph 7, Q6), but the Countdown pp. 240-241 reading assignment was not supplied and is **not** marked covered. `ENGLISH-BODY-002` stays PARTIAL (one evidence entry appended).
- Open items: `ENGLISH-T1-W01-WORD-CLASS-REPLACEMENT-SCOPE` updated (still blocking; remaining: the external-material component of R01); `ENGLISH-T1-W01-EXTERNAL-MATERIALS` updated (word-pair contrasts now taught; only the Countdown reading remains). `SS1-02-english-COR-001` is unchanged and must stay inactive: a whole-row replacement does not yet contain every displaced objective.
- `QUEUE.json`: item -> IMPLEMENTED_TESTING_DEFERRED; `status_counts` refreshed (23 / 73 / 4); `next_runnable` set to `ENG-LES-W02-WORD-MEANINGS`. `ENG-FACT-W01-EXTERNAL-MATERIALS` follows in list order but needs owner-supplied pages or a decision, so it is not given to a worker as next runnable.

## Source defects handled (not copied)
- Its is listed in the source as a possessive pronoun; it is normally a possessive determiner, and the possessive-pronoun forms are mine, yours, his, hers, ours, theirs.
- The source treats demonstrative, possessive and distributive words as adjectives; the supplement keeps those school names and notes that many modern grammars call them determiners (and that some/any are older-list distributives).
- Adjective endings: the source heads a list `-cal` (the ending is `-ical`), lists sensible and edible under `-able` (they end `-ible`), and gives workaholic and sedative without noting they can be nouns.
- Auxiliaries: the source lists only be-forms as primary auxiliaries and says some auxiliaries can stand on their own as main verbs; the supplement names be, have and do, states that only these double as main verbs, and gives the modal and semi-modal lists.
- Transitive/intransitive: cooked and prayed are shown by the source only as intransitive; the supplement teaches that the sentence decides.

## Checks performed
Source and archive-member SHA-256; queue and package JSON parse; lesson body hash; every practice item's marks equal the sum of its marking criteria; practice IDs unique; lesson ID pattern and prefix; coverage IDs unique and every `lesson_ids` target exists; every IMPLEMENTED_EQUIVALENT entry points to a supplement lesson with evidence; original evidence entries preserved; structural diff limited to the lesson, the eight coverage entries and two open items named above. The importer, compiler, schema validation, tests and typechecks were not run.

## Remaining
- Owner supply of Countdown pp. 240-241 (and the other external materials) through ENG-FACT-W01-EXTERNAL-MATERIALS, then a whole-row replacement review before COR-001 can be activated.
- Owner content approval and later verification of the new lesson (not invented).

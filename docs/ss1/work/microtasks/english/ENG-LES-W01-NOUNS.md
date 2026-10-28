# ENG-LES-W01-NOUNS — English, 1st Term Week 1 noun supplement

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; content approval PENDING, verification DEFERRED; nothing approved or verified). Testing deferred by owner. No tests, typechecks, importer runs, database operations or device checks were run.

## Inputs
- Starting SHA: `4d5269fe09e008a0247303669e12172b0c9c0d4e` (origin/master). Prerequisites ENG-WK-T1-W01 and ENG-LES-WORD-CLASSES-T1 are IMPLEMENTED_TESTING_DEFERRED. No open PR or branch for this item was found by branch name.
- Source `SS1-SRC-a00657d42196`, document SHA-256 `4852226f…ddef`. **The original document was not supplied in this run** (only a 2nd Term zip was attached), so no hash was checked and no source text was re-read. Work used the reviewed coverage evidence and locators from ENG-WK-T1-W01 and the existing package. Nothing from the source was copied.
- References consulted 2026-10-28 for disputed points (reference only; prose and examples are original): Scribbr (plural nouns; collective-noun agreement) and Lund University AWELU (atypical nouns).

## Changes
- `english.json`: new lesson `SUP-SS1-ENGLISH-NOUNS-T1` (10 teaching paragraphs, 3 objectives, 8 practice items, 29 marks; each item's marking sums to its marks; `body_sha256` checked against the body). State: approval PENDING, IMPLEMENTED, verification DEFERRED, no references. The existing `SUP-SS1-ENGLISH-WORD-CLASSES-T1` was not changed (one new stable-ID supplement chosen so its hash and other content stay intact).
- Coverage `ENGLISH-T1-W01-N02`…`N11` → IMPLEMENTED_EQUIVALENT with `SUP-SS1-ENGLISH-NOUNS-T1` in `lesson_ids` (N03, N04, N08, N09, N10 keep the word-classes lesson as well). Original evidence retained; one evidence entry appended to each.
- Open item `ENGLISH-T1-W01-WORD-CLASS-REPLACEMENT-SCOPE` updated (still blocking; remaining P02, A01–A03, R01, V02, V04). `SS1-02-english-COR-001` is unchanged and must stay inactive. The supplement does not become its replacement automatically.
- `QUEUE.json`: item → IMPLEMENTED_TESTING_DEFERRED; counts updated; `next_runnable` set to the single next item, following the file's existing one-item convention.

## Source defects handled (not copied)
- Noun-ending list: `-like` and `-al` mostly form adjectives; "firmess" corrected to firmness.
- "soldiers" is an ordinary plural, not a collective noun.
- "person" is not a zero plural (usual plural: people).
- "cattle" is plural in meaning and "aircraft" is a zero plural; they are not presented as one category.
- works/work and stationery/stationary (R01) were deliberately left to ENG-LES-W01-PRONOUN-ADJ-VERB; only damage/damages is claimed here.

## Remaining
- Owner content approval and later verification of the new lesson (not invented).
- ENG-LES-W01-PRONOUN-ADJ-VERB. Optional: check the final wording against the original once supplied.

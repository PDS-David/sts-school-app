# FR-LES-T1-W04-ETRE-SENTENCES — French, 1st Term Week 4 être sentences

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; content approval PENDING, verification DEFERRED; not approved or verified). Testing deferred by owner.

## Inputs
- Base: origin/master `7353234`. Read: `french.json`, `french/QUEUE.json`, `FR-WK-T1-W04.md` (and the existing `SUP-SS1-FRENCH-AUXILIARIES-T1`, objective OBJ-2 and open item `FRENCH-T1-W04-ETRE-SENTENCE-SCOPE`).
- No attachment required; the original document was not opened. The 24 source sentences are not copied and their errors are not used as a key; only the error types already recorded in OBJ-2 were used, taught as general rules.

## What `SUP-SS1-FRENCH-AUXILIARIES-T1` already covers (not repeated)
Present forms of être, six model sentences (élève, calme, contente, prêts, en classe, nigérianes), the agreement rule, the negative, and practice Q1/Q3. Left unchanged.

## Missing scope added
New lesson `SUP-SS1-FRENCH-VERBE-ETRE-T1` ("Phrases avec être : identité, lieu, nationalité, profession, description"), body sha256 `d2d20b91edfbe2390988451d1f66be01bc6ace97aa6188cbb1aeaf0dbf124f31`:
- identity and relationship nouns with article or possessive, mon before a vowel sound (`mon amie`);
- location with à / au / en classe / dans la classe;
- nationality as a lower-case agreeing adjective without article (nigérian, sénégalais, français), noun form with capital;
- profession without article, the `c’est un/une` contrast, `professeur` / `professeure`;
- neutral description only: height (grand, petit), calme, clothing with `en uniforme`. No appearance or body vocabulary, so no owner decision was needed.
Practice (17 marks, every marking list sums): Q1 completion 6, Q2 correction 5, Q3 writing 6, each with a complete answer and acceptable alternatives.

## Sources checked (consulted 2026-11-06)
Tex's French Grammar (UT Austin): det4, det6, adj2/adj4, pre2. Académie française dictionary, 9th ed.: `nigérian, -ane`; `professeur` (professeur or, less well, professeure). Larousse junior: `sénégalais, sénégalaise`. `française` follows the regular rule and was not looked up separately. The `en classe` / `dans la classe` contrast rests on a learner Q&A (Kwiziq) only; it is marked secondary in provenance and should be confirmed at content review. No text from any source is reproduced.

## Edits
- `french.json`: lesson added; coverage `FRENCH-T1-W04-OBJ-2` → IMPLEMENTED_EQUIVALENT (lesson ids now the existing lesson plus the new one; earlier evidence kept, new entry supersedes "no counterpart"); open item `FRENCH-T1-W04-ETRE-SENTENCE-SCOPE` removed. Not touched: OBJ-1, OBJ-3 to OBJ-5, `FRENCH-T1-W04-AVOIR-SENTENCE-SCOPE`, corrections, sources, assets.
- `QUEUE.json`: this item → IMPLEMENTED_TESTING_DEFERRED; counts/status_counts recomputed (67 / 44 / 4); `next_runnable` unchanged (`FR-WK-T1-W05`).
- The ID sorts after every other 1st Term French supplement, so no stored supplement order index shifts.

## Checks (authoring checks, not tests)
JSON parse (original formatting kept); unique lesson IDs; coverage `lesson_ids` and open-item `affected_ids` resolve; body hash recomputed from UTF-8; marking sums (6, 5, 6 = 17); counts recomputed. No typecheck, suite, importer, database or device run.

## Remaining
Owner content approval and verification. `FR-LES-T1-W04-AVOIR-SENTENCES` stays PENDING. This does not claim Week 4 complete.

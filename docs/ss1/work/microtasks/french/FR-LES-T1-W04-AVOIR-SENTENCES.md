# FR-LES-T1-W04-AVOIR-SENTENCES — French, 1st Term Week 4 avoir sentences

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; content approval PENDING, verification DEFERRED; not approved or verified). Testing deferred by owner.

## Inputs
- Base: origin/master `7baf4e1`. Read: `french.json`, `french/QUEUE.json`, `FR-WK-T1-W04.md`, the schema and the contract (and the existing `SUP-SS1-FRENCH-AUXILIARIES-T1`, objective OBJ-4 and open item `FRENCH-T1-W04-AVOIR-SENTENCE-SCOPE`). No `AGENTS.md`.
- No attachment required; the original document was not opened. The 24 source sentences, their wording and their errors are not copied or used as a key; only the error types already recorded in OBJ-4 were used, taught as general rules with different examples.

## What `SUP-SS1-FRENCH-AUXILIARIES-T1` already covers (not repeated)
Present forms of avoir, possession (`J’ai un livre`), age, `beaucoup d’`, the negative with `de`, and practice Q1/Q2. Left unchanged.

## Missing scope added
New lesson `SUP-SS1-FRENCH-VOCAB-AVOIR-T1` (“Phrases avec avoir : famille, argent, cours et couleurs”), body sha256 `58fcaddc2c17d313fb98cab10072af61867992e482305bd110918591fffe7a02`:
- family nouns with articles, `sœur` with œ, `belle-mère` hyphenated (plural `belles-mères`), `femme` as woman or wife, `mari`, and the negative with `de` / `d’`; `ont` written with a t (not `on`);
- money with the partitive (`du`, `de la`, `de l’`), `de l’argent`, a number with no article, `beaucoup d’argent` (not `beaucoup de l’argent`), and the negative `pas d’argent`;
- school courses: `avoir cours` (no article), `avoir un cours de` + subject, subject names in lower case with `d’` before a vowel, `mathématiques` as a plural, `un devoir de mathématiques`;
- colours after the noun with agreement (vert/verte, blanc/blanche, rouge/jaune/rose adding only the plural s), `orange` and `marron` invariable, two-word colours invariable.
Practice (19 marks, every marking list sums): Q1 completion 6, Q2 correction 5, Q3 writing 8 with a per-sentence rubric (form and pattern 1, spelling/agreement/punctuation 1 for each of four sentences), each with a complete answer and acceptable alternatives.

The ID sorts after every other 1st Term French supplement (compiler order is plain string order of IDs, `VO…` after `VE…`), so no stored supplement order index shifts. The name was chosen for that reason.

## Sources checked (consulted 2026-11-06)
- Tex's French Grammar (UT Austin), det5: partitive forms and the negative.
- Dictionnaire de l’Académie française, 9th ed.: `devoir` [II] (“un devoir de français, de mathématiques”, “faire ses devoirs”); `femme`, sense 2 (épouse).
- Larousse: `belle-mère` (pl. belles-mères; mother-in-law or stepmother), `mathématiques` (feminine plural).
- **Secondary references, to be confirmed at content review:** Lawless French, Adjectifs de couleur (agreement; orange and marron invariable; rose, rouge, jaune follow ordinary agreement; compound colours invariable); an Ellipses FLE workbook sample and the Larousse French–Chinese entry for `cours` (`avoir cours`, `un cours de français`). The monolingual Larousse `avoir cours` means legal tender, a different sense; it was not used.
- Everyday family and clothing nouns (frère, oncle, tante, cousin, enfants, robe, chemise, sac, tableau) were not looked up individually in a dictionary. All French words in the lesson were run through an open French word list (pyspellchecker) as a spelling screen; every word passed except `sœur` (ligature not in that list) and the proper noun Lagos. That screen is not an authoritative check. No text from any source is reproduced.

## Edits
- `french.json`: lesson added; coverage `FRENCH-T1-W04-OBJ-4` → IMPLEMENTED_EQUIVALENT (lesson ids now the existing lesson plus the new one; earlier evidence kept, new entry supersedes “no counterpart”); open item `FRENCH-T1-W04-AVOIR-SENTENCE-SCOPE` removed. Not touched: OBJ-1 to OBJ-3, OBJ-5, other open items, corrections, sources, assets.
- `QUEUE.json`: this item → IMPLEMENTED_TESTING_DEFERRED; `status_counts` recomputed (68 / 43 / 4); `next_runnable` unchanged (`FR-WK-T1-W05`).

## Checks (authoring checks, not tests)
JSON parse (original formatting kept); unique lesson IDs and ID pattern; coverage `lesson_ids` and open-item `affected_ids` resolve; body hash recomputed from UTF-8; marking sums (6, 5, 8 = 19); status counts recomputed. No typecheck, suite, importer, database or device run.

## Remaining
Owner content approval and verification; confirmation of the two secondary references. `FR-LES-T1-W03-GREETING-SET` (prompt 22) is now unblocked by this task. This does not claim Week 4 complete.

# CC-PRES-T2-PROCESSES — source-faithful process preservation index

**Status:** IMPLEMENTED_TESTING_DEFERRED. This record identifies the original process passages as separate preservation units. It does not rewrite, summarise as new teaching, or correct the source wording. The exact original wording remains in the verified source archive and is locatable by the line ranges and hashes in the existing week indexes.

## Verified source
- Source ID: `SS1-SRC-f433169ca25c`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member: `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc`
- Member SHA-256: `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`
- Extractor: `word-extractor` 1.0.4 `extract(path).getBody()`; full-body SHA-256 `371aa91970bceb96c354a002a3ac7a5384ca597c1c2f404f51f13096b7324c8a`.

## Separate source-faithful preservation units
| Unit | Source locator | Existing index / factual boundary |
|---|---:|---|
| Poultry preparation, handling and storage | 175–179 | `CC-IDX-T2-W01.md`; factual review `CC-FACT-T2-MEAT-POULTRY-FISH-EGG-HYGIENE` |
| Egg dishes and egg-cooking methods | 261–282 | `CC-IDX-T2-W02.md`; preserve the egg-use and cooking passage as its own source unit |
| Fish preparation, freshness and cooking | 335–365 | `CC-IDX-T2-W02.md`; factual classification/figures review remains separate |
| Boiling, poaching and steaming rules and processes | 937–1031 | `CC-IDX-T2-W07.md` |
| Stewing and frying, including oil stages and frying rules | 1062–1166 | `CC-IDX-T2-W08.md`; factual review `CC-FACT-T2-FRYING-HEAT-FIRE-BURNS` remains separate |
| Baking, roasting and grilling | 1204–1272 | `CC-IDX-T2-W09.md` |

The week indexes record exact inclusive section locators, week hashes and section hashes. The original text must be recovered from the archive using the verified member hash; no line is silently normalised, reordered or replaced by this index.

## Preservation rules
- Keep each process sequence in its own source-faithful unit, preserving original order, wording, examples and lists.
- Keep later factual corrections in separate records. In particular, the source's classification of frying under moist heat is not changed here; see `CC-FACT-T2-COOKING-METHOD-CLASSIFICATION.md`.
- Do not infer missing steps, equipment, temperatures, safety instructions or practical outcomes.
- This task creates no lesson, coverage entry, source rule, delivery correction, asset, answer key or approval.
- No tests, importer, database or device runs were performed; testing remains deferred by the owner.

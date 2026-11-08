# AG-WK-T1-W05 — Agricultural Science, First Term Week 5 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is source indexing; no lesson authorship, approval, verification or delivery acceptance is claimed.

## Inputs and locators
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — verified.
- First Term member SHA-256: `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified.
- Scheme entry 5: block 16. Week label: block 421; topic: block 423.
- Eleven role paragraphs: blocks 426–436.
- Week range 421–472; SHA-256 `0b511ea943b8ca423eb1fc0e16807edaedf56048210b5e6a9638ecd6fe745819`, re-derived and matched.
- Locator rule: direct child of `w:body` in `word/document.xml`, zero-based; block text is concatenated `w:t` runs, UTF-8, no normalisation; range hash is SHA-256 of block texts joined with newline, empty blocks included.

## Scheme objective and coverage
| Objective | Source evidence | Status |
|---|---|---|
| Roles of Science and Technology in Agricultural Development | Eleven roles at 426–436 | **PARTIAL** — source-taught; package row/importer identity unverified |

The eleven roles are machinery, agro-climatology, pest/disease control, crop/animal improvement, soil fertility, animal health, storage/processing, transport, soil/water conservation, land surveying and improved agricultural systems. PARTIAL is a delivery-mapping limitation, not a source-content gap.

## Assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 439–441 | State ten roles; discuss science and technology's contribution | Supported by 426–436. |
| 443–448 | Define technology; crop/animal improvement; five improved systems; five storage facilities; agro-climatology | Crop/animal improvement supported by 429; agro-climatology by 427. Technology is not defined. Block 436 lists only three improved systems. Block 432 gives two storage examples (silos, cold rooms); Week 3 block 234 adds cribs. Millers/shellers are processing equipment, not storage. |
| 449–451 | Reading assignment | References recorded; books/pages not opened or verified. |
| 452–457 | Weekend MCQs | Q1 (453) includes bush fallowing, not classified in teaching. Q2 (454) uses “Genetic engineering” while source 429 says “genetics and breeding”; fact-check appended. Q3 (455) supported by surveying 435 and soil-testing 430. Q4 (456) supported by conservation 434. Q5 (457) supported by preservation/avoiding wastage 432. |
| 458–460 | Five roles; five agro-climatology benefits | Roles supported by 426–436; agro-climatology benefit described at 427. |

## Follow-ups
- `AG-LES-T1-W05-TECHNOLOGY-DEFINITION`: define technology in an agricultural context.
- `AG-LES-T1-W05-FARM-MANAGEMENT`: teach five improved farm-management systems and clarify bush fallowing.
- `AG-LES-T1-W05-STORAGE-FACILITIES`: teach five storage facilities and distinguish them from processing equipment.
- `AG-FACT-T1-W05-GENETICS-ITEM`: verify the genetics terminology MCQ.

Pesticides, fungicides, nematicides and fumigants are named at 428; no doses, rates, mixing or handling instructions appear or are added.

## Changes and validation
- Added four coverage entries (one PARTIAL, three UNRESOLVED) and five open items.
- Marked `AG-WK-T1-W05` `IMPLEMENTED_TESTING_DEFERRED`; appended four bounded follow-ups; recomputed queue counts and `next_runnable`.
- Parsed queue/package JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source text, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

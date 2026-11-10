# AG-WK-T1-W08 — Agricultural Science, First Term Week 8 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is source indexing; no lesson authoring, legal verification, approval or delivery acceptance is claimed.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; First Term member SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified.
- Scheme entry 8: block 19; Week label 618; topic 620.
- Land tenure overview: blocks 623–626; types and advantages/disadvantages: 627–695.
- Week range 618–720; SHA-256 `5b0cac0de95cf5e17ccd5c4c5544da456300a217f35414511af3ee3525a70d14`, re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Land-tenure systems | Definition 626; five types and advantages/disadvantages 628–692 | **PARTIAL** — source-taught; package row/importer identity unverified |
| Agricultural laws and reforms | No dedicated law/reform teaching in Week 8; Land Use Act references only at Week 3 block 195 and Week 7 block 583 | **UNRESOLVED** |

The five land-tenure systems taught are communal (628–641), inheritance (646–656), leasehold (662–673), free gift (675–682), and state/government ownership (684–692).

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 643–645 | Evaluation heading | Heading “EVALUATION” at 643 has no question; blocks 644–645 are empty. |
| 657–659 | Definition and types of land tenure | Supported by definition 626 and five types 628–692. |
| 697–702 | Definition, types, communal advantages/disadvantages, most prominent system, perennial crops | Q1–Q3 supported. Q4 (701) asks for the most prominent tenure system in Nigeria; source does not state prevalence. Q5 (702) supported by inheritance advantage at 651 and communal/leasehold disadvantages at 639/671. |
| 704–705 | Reading assignment | Points to “Roles of Government in Agricultural Development” (Week 4), not the Week 8 land-tenure topic; recorded as a mis-scoped reading pointer. Book/pages not opened. |
| 707–712 | Weekend MCQs | Q1 (708) supported by inheritance fragmentation/small plots at 653–654. Q2 (709) cross-week supported by Week 7 factors (579–587). Q3 (710) asks for the commonest tenure system; not stated in source. Q4 (711) supported by leasehold definition 662. Q5 (712) supported by land-tenure definition/acquisition at 626. |
| 713–716 | Five ownership systems; four effects of communal ownership | Supported by the five systems and communal advantages/disadvantages at 628–641. |

## Follow-ups and legal caution
- `AG-LES-T1-W08-AGRICULTURAL-LAWS-REFORMS`: teach the scheme's agricultural-law/reform objective, including a legally accurate account of the Land Use Act 1978, using the statute and authoritative sources.
- `AG-FACT-T1-W08-PROMINENT-TENURE`: verify the prevalence claim in questions 701/710; do not infer from the order of types.
- `AG-FACT-T1-W08-LAND-USE-ACT`: verify the source's statement at Week 7 block 583 that the Act prevents individuals from owning land; do not silently amend the source.

## Changes and validation
- Added three coverage entries (one PARTIAL, two UNRESOLVED) and four precise open items.
- Marked `AG-WK-T1-W08` `IMPLEMENTED_TESTING_DEFERRED`; appended three bounded follow-ups; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source text, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

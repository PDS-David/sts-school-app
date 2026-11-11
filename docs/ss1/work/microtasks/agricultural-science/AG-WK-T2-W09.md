# AG-WK-T2-W09 — Agricultural Science, Second Term Week Nine

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; wording corrections are not applied.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; Second Term member SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Scheme item 9: block 13; Week label 599; topic 600.
- Five factors: block 609; sections climate 611–616, parent material 622–623, topography 626–627, biotic factors 633–639, time 645–646.
- Week range 599–674; SHA-256 `bc1d1321d855bd1376adc8b8d0f08f6c5dbd9b31eae703f1358a34060ae8ba81`, re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Objective | Source evidence | Status |
|---|---|---|
| Factors of Soil Formation | Five factors explicitly listed at 608–609 and described at 611–646 | **PARTIAL** — package row/importer identity unverified |

The five factors are climate, parent materials, topography, biotic factors (living organisms) and time. Climate elements at 612 are sunlight, temperature, wind, relative humidity, rainfall and pressure. Biotic examples include termites, earthworms, crickets, human tillage, plant roots and leaf/bacteria decomposition.

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 618–620 | Define climate; list five climate elements | Supported by 612. |
| 629–631 | Parent material and topography | Supported by 623 and 627. |
| 641–643 | Five biotic factors; role of vegetation | Supported by 633–639. |
| 648–653 | Factors of soil formation; climate elements; biotic factors; vegetation | Supported by the five-factor list and sections 611–646. |
| 655–659 | Book review and reading assignment | References recorded; books/pages not opened or verified. |
| 661–668 | Weekend MCQs | Climate definition (662–663), climatic element exception (664–665), biotic-factor exception (666), topography (667), and five-factor exception (668) supported by 609, 612, 623, 627 and 633–639. |
| 670–672 | Climate elements; three ways vegetation affects soil formation | Supported by 612 and 638–639. |

## Cross-week and correction review
- Week Eight general evaluation block 576 asks for five soil-formation factors; this is supported by Week Nine block 609.
- Block 627 says “sloppy area”; context suggests “sloping area”.
- Block 634 says organisms play a role in “rock formation” within the soil-formation section. `AG-CORR-T2-W09-SOIL-TERMS` verifies both phrases before any delivery-only correction.

## Changes and validation
- Added one PARTIAL coverage entry and two precise open items.
- Marked `AG-WK-T2-W09` `IMPLEMENTED_TESTING_DEFERRED`; appended one bounded correction task; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and the PARTIAL coverage's open-item link.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.


## Implementation follow-up (2026-11-11)

The source row `SS1-SRC-956594d97094:BODY:1d566e884981c34293a7c08a90ce5177dc063ea5813da9a7f27e69e09c5f77ee` is now bound by `CORR-AG-T2-W09-SOIL-TERMS-REPLACEMENT` to `SUP-SS1-AGRICULTURAL-SCIENCE-T2-W09-SOIL-FORMATION`. The replacement teaches climate, parent material, relief, organisms and time, soil horizons, and the effects of slope/runoff. It corrects “sloppy area” to “sloping area” and “rock formation” to “soil formation”. Coverage is IMPLEMENTED_EQUIVALENT; approval and verification remain pending.

# AG-WK-T2-W06 — Agricultural Science, Second Term Week Six

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; no unverified ecological or animal-science claims are added.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; Second Term member SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Scheme item 6: block 10; Week label 337; topic 338.
- Definition: 344–354; components: 361–376; interactions: 383–395.
- Week range 337–420; SHA-256 `8e54b81a1ac02ed85c99e0746d481317ad31d9191f6ecdab2bcaeb687cd97ce5`, re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Meaning of Agricultural Ecology | Definition at 345; autecology 350; synecology 352; ecosystem 354 | Source-taught |
| Components of farm ecosystem | Biotic/abiotic 361–376; producers/consumers 366–370 | Source-taught |
| Interactions among components in farm settings | Mono-cropping 384–387; mixed cropping 388–391; mixed farming 392–395 | Source-taught for these three settings |
| Overall objective | Agricultural ecology and farm ecosystem relationships | **PARTIAL** — package row/importer identity unverified |

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 356–359 | Define agricultural ecology; aspects of ecology; define ecosystem | Supported by 345, 350, 352 and 354. |
| 378–381 | Autotrophs/heterotrophs; five climatic factors; primary consumers | Supported by 368–376 and 370. |
| 397–402 | Repeat definitions; climatic factors; interactions in mixed farming, mixed cropping and fish pond | Definitions/factors supported. Mixed farming and mixed cropping supported by 388–395. Fish-pond interaction is not taught; pond appears only as a synecology example at 352. |
| 404–405 | Reading assignment | Reference recorded; book/pages not opened or verified. |
| 407–414 | Weekend MCQs | Q1 (408) asks polygastric classification of cattle/goat/rabbit/sheep, not taught; Q2 autecology supported by 350; Q3 climate vs rocks supported by 373–375; Q4 mixed farming supported by 392; Q5 organic manure supported by 394. |
| 416–418 | Aspects of ecology; interactions in fish pond and forest/savannah | Aspects supported by 350/352. Fish-pond and forest/savannah interaction explanations are not taught. |

## Defects and follow-ups
- `AG-LES-T2-W06-ECOSYSTEM-INTERACTIONS`: add sourced interactions for fish ponds and forest/savannah, clearly labelled as supplement content.
- `AG-FACT-T2-W06-POLYGASTRIC-ITEM`: verify the animal classifications in weekend Q1.
- `AG-CORR-T2-W06-ECOLOGY-TERMINOLOGY`: verify whether “Autotrophism”/“Heterotrophism” are being used correctly for groups of organisms or modes of nutrition.
- Topic block 342 prints “agro-ecosysytem”; joined words occur in blocks 346, 350 and 352. Original wording preserved.

## Changes and validation
- Added two coverage entries (one PARTIAL, one UNRESOLVED) and four precise open items.
- Marked `AG-WK-T2-W06` `IMPLEMENTED_TESTING_DEFERRED`; appended three bounded follow-ups; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

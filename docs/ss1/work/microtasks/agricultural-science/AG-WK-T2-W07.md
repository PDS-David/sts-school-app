# AG-WK-T2-W07 — Agricultural Science, Second Term Week Seven

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; scientific corrections are not assumed.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; Second Term member SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Scheme item 7: block 11; Week label 421; topic 422.
- Rock definition: 427–428; types: 429–433; igneous: 435–448; sedimentary: 454–465; metamorphic: 471–485.
- Week range 421–516; SHA-256 `b8ed03701eace10e135d2dbb227245677d6c160dd0876e4540e450e980657d1b`, re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Meaning/classification of rocks | Definition 428; igneous, sedimentary and metamorphic groups 429–433 | Source-taught |
| Formation and characteristics | Igneous 435–448; sedimentary 454–465; metamorphic 471–485 | Source-taught, but several characteristics require scientific verification |
| Overall scheme objective | Rock formation and three types | **PARTIAL** — package row/importer identity unverified |

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 450–452 | Igneous formation and four characteristics | Supported by 435–448. |
| 467–469 | Sedimentary formation and four characteristics | Supported by 454–465. |
| 487–489 | Metamorphic formation and parent rocks | Supported by 471–478. |
| 491–496 | Definition; three types; igneous formation; sedimentary characteristics/classes/examples | Supported by 428–433, 435–440, 460–465 and 457–459; block 458 prints “peak” in the carbonaceous examples. |
| 498–502 | Book review/reading assignment | References recorded; book/pages not opened or verified. |
| 504–510 | Weekend MCQs | Q1 (505) introduces mica, not classified in the source. Q2 granite igneous supported by 439; Q3 schist from shale supported by 477; Q4 marble from limestone supported by 474; Q5 magma forms igneous rock supported by 436. |
| 512–514 | Granite/limestone formation and characteristics; three characteristics for each rock type | Broadly supported by the type-level explanations/examples and characteristic lists; specific granite/limestone properties are not separately developed. |

## Follow-ups and defects
- `AG-FACT-T2-W07-ROCK-CHARACTERISTICS`: verify broad claims about crystallinity, fossils, layering and erosion resistance; avoid treating tendencies as universal.
- `AG-CORR-T2-W07-PEAT-TYPO`: verify the printed “peak” term at block 458 before any correction.
- `AG-FACT-T2-W07-MICA-MCQ`: verify the classification used in weekend Q1.
- Potentially overgeneralised characteristics include “metamorphic rocks are not in form of crystals” and “may contain fossils” (481–485); no correction has been made.

## Changes and validation
- Added two coverage entries (one PARTIAL, one UNRESOLVED) and four precise open items.
- Marked `AG-WK-T2-W07` `IMPLEMENTED_TESTING_DEFERRED`; appended three bounded follow-ups; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

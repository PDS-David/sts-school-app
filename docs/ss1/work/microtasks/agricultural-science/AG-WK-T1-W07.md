# AG-WK-T1-W07 — Agricultural Science, First Term Week 7 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; no lesson authorship, approval, verification or delivery acceptance is claimed.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; First Term member SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified.
- Scheme entry 7: block 18; Week label 534; topic 536.
- Land definition 545; characteristics 547–549; agricultural uses 557–565; non-agricultural uses 571–576; availability factors 578–587.
- Week range 534–617; SHA-256 `dd96618ec8f4bed312155a23f941d506c6fa6ca0be4bccf91ebc31b703a9aa1`, re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Objective | Source evidence | Status |
|---|---|---|
| Land and its Uses: Agricultural and Non-Agricultural Uses | Definition, characteristics, five agricultural uses, six non-agricultural uses and eight availability factors | **PARTIAL** — source-taught; package row/importer identity unverified |

Agricultural uses: crop production, grazing, fishery, forestry and wildlife conservation (557–565). Non-agricultural uses: housing, industrial buildings, transport, socio-economic facilities, religious centres and mining (571–576). Availability factors include population pressure, land tenure, topography, soil type, government laws, pollution/oil spillage, climate, cultural practices and socio-economic land uses (579–587).

## Assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 550–552 | Definition and three characteristics | Definition supported by 545. Characteristics at 547–548 are clear; block 549 says “Land is mobile” but glosses it as “cannot be moved”, a contradiction requiring fact verification. |
| 566–568 | Four agricultural uses; five Nigerian game reserves | Four uses supported by 557–561. Only four reserves supplied at 562–565; names/locations not independently verified. |
| 588–590 | Five non-agricultural uses; five availability factors | Supported by six uses at 571–576 and eight factors at 579–587. |
| 592–598 | Definition, characteristics, uses, five reserves, five socio-economic factors | Five game reserves and five explicitly socio-economic factors are **UNRESOLVED**; only one factor is labelled socio-economic at 587. |
| 600–602 | Reading assignment | References recorded; books/pages not opened or verified. |
| 604–609 | Weekend MCQs | Q1 (605) supported by listed factors; Q2 (606) cross-week supported by Week 9 climate teaching; Q3 (607) supported by Week 6 crop rotation 436 and Week 3 flooding 283. Q4 (608) conflicts with the source classifying game reserves/pasture as agricultural uses (558, 561). Q5 (609) includes labour, not discussed as a factor in this section; fact-check appended. |
| 611–613 | Three agricultural uses; five availability factors | Supported by 557–565 and 579–587. |

## Follow-ups and defects
- `AG-LES-T1-W07-GAME-RESERVES`: supply five verified Nigerian reserves and locations; verify the four source examples without overwriting original wording.
- `AG-LES-T1-W07-SOCIOECONOMIC-FACTORS`: teach five accurately sourced socio-economic factors, distinguished from the source's general availability list.
- `AG-FACT-T1-W07-LAND-MOBILITY`: resolve the contradictory “mobile/cannot be moved” statement at 549.
- `AG-FACT-T1-W07-GAME-RESERVE-USE`: resolve the conflict between source land-use categories and weekend Q4.
- `AG-FACT-T1-W07-LABOUR-FACTOR`: verify weekend Q5's labour option.

## Changes and validation
- Added three coverage entries (one PARTIAL, two UNRESOLVED) and six precise open items.
- Marked `AG-WK-T1-W07` `IMPLEMENTED_TESTING_DEFERRED`; appended five bounded follow-ups; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source text, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

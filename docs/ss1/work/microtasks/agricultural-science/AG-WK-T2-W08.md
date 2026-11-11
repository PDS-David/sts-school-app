# AG-WK-T2-W08 — Agricultural Science, Second Term Week Eight

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; no unverified corrections are applied.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; Second Term member SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Scheme item 8: block 12; Week label 517; topic 518.
- Definition 523–525; processes 527–530; physical 533–539; chemical 547–553; biological 559–564.
- Week range 517–598; SHA-256 `aa24be430015e9cf92fe0e3b82b9ddffd52a5c59998ae69cb3962bd75c9f9f7e`, re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Meaning of rock weathering | Definition 524–525 | Source-taught |
| Processes of rock weathering | Physical 533–539; chemical 547–553; biological 559–564 | Source-taught |
| Overall scheme objective | Rock weathering and its processes | **PARTIAL** — package row/importer identity unverified |

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 541–545 | Define weathering; name processes; list/describe physical agents | Supported by 523–539. |
| 555–557 | Five chemical agents; explain two | Supported by list 548 and explanations 549–553. |
| 566–569 | Four biotic factors; processes of rock formation; physical agents | Biotic agents supported by 560–564; physical agents by 534–539. Block 568 says “rock formation” although the taught topic is “rock weathering”; correction review appended. |
| 571–576 | Definition; processes; physical agents; chemical agents; five soil-formation factors | Weathering questions supported. Q5 cross-week supported by Week Nine block 609, which explicitly lists climate, parent materials, topography, biotic factors and time. |
| 578–582 | Book review/reading assignment | References recorded; book/pages not opened or verified. |
| 584–591 | Weekend MCQs | Hydration (585), oxidation (586), physical agents (587–588), soil organisms (589), weathering definition (590–591) supported by 533–564 and 525. |
| 593–596 | Definition; three processes; three agents of one process | Supported by 523–564. |

## Follow-up and wording issue
- `AG-CORR-T2-W08-QUESTION-WORDING`: verify “processes of rock formation” in blocks 568 and 573 against the scheme/topic; bind a delivery-only correction to “rock weathering” only if confirmed.
- Cross-week dependency: the five soil-formation factors are taught at Week Nine block 609, not in this Week Eight range.

## Changes and validation
- Added one PARTIAL coverage entry and two precise open items.
- Marked `AG-WK-T2-W08` `IMPLEMENTED_TESTING_DEFERRED`; appended one bounded correction task; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and the PARTIAL coverage's open-item link.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.


## Implementation follow-up (2026-11-11)

The source row `SS1-SRC-956594d97094:BODY:1f941dd52a764e5665229f0caad9aa3a3bca2ecf1ffad1ac4f3810601bfa573b` is now bound by `CORR-AG-T2-W08-QUESTION-WORDING-REPLACEMENT` to `SUP-SS1-AGRICULTURAL-SCIENCE-T2-W08-ROCK-WEATHERING`. The replacement teaches physical, chemical and biological weathering and distinguishes weathering from erosion and rock formation. The source assessment wording is corrected. Coverage is IMPLEMENTED_EQUIVALENT; content approval and learner verification remain pending.

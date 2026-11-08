# AG-WK-T1-W06 — Agricultural Science, First Term Week 6 indexing

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; no lesson authorship, approval, verification or delivery acceptance is claimed.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` and First Term member SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526` — verified.
- Scheme entry 6: block 17; Week label 473; topic text 475–479.
- Definition: block 482. Industry/raw-material table: block 486 (15 rows including header, 3 columns, 14 data rows). Relationship statements: blocks 493–502 (ten).
- Week range 473–533; SHA-256 `19248abe8aded1d7f739cf4d6f75759c8eb099022e21e45614135bc4815d36c5`, re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined by newline, including empty blocks.

## Scheme objective coverage
| Objective | Evidence | Status |
|---|---|---|
| Agro-Allied Industry and Relationship between Agriculture and Industry | Definition 482; 14-row table 486; ten relationships 493–502 | **PARTIAL** — source-taught; package row/importer identity unverified |

The source defines agro-allied/agro-based industries as industries dependent on agricultural raw materials. The table includes oil mill, soap, tobacco, textile, breweries, fruit canning, paper, sugar, plywood/sawmill, flour mill, starch, tyre, feed mill and beverage, each with raw materials. Ten relationships cover market, food, raw materials, labour, essential goods, agro-chemicals, storage, processing, tools/machinery and industrial development.

## Assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 487–490 | Definition, ten industries/raw materials, five cereals | Q1–Q2 supported by definition/table. Cereals taught later at Week 10 block 893. |
| 503–506 | Seven relationships; five industrial goods; three storage structures | Q1–Q2 supported by 493–502. Q3 storage structures **UNRESOLVED**: block 499 says industries provide facilities but gives no named structures. |
| 508–515 | Definition, five industries, cereals, five agro-chemicals, storage structures/produce, five Week 5 roles | Definition/table supported; cereals cross-week supported by Week 10 block 893; agro-chemical examples available across Week 5 blocks 428–431 and Week 6 block 498; storage structures/produce pairings **UNRESOLVED**; Week 5 roles supported by 426–436. |
| 516–517 | Reading assignment | Reference recorded; book/pages not opened or verified. |
| 518–525 | Weekend MCQs | Q1 (519) asks whether incubator is a farm machine; source does not classify it (fact-check appended). Q2 brewery/cereal and Q3 electronics exception supported by table 486. Q4 storage vs processing and Q5 processing structure supported by silos/cribs at Week 3 block 234 and grinder as processing equipment at Week 6 block 500. |
| 528–531 | Definition, five industries/raw materials, storage structures/produce | First two supported; storage pairings **UNRESOLVED**. |

## Follow-ups and defects
- `AG-LES-T1-W06-STORAGE-STRUCTURES`: teach at least three storage structures and the produce stored in each, with evidence and provenance.
- `AG-FACT-T1-W06-INCUBATOR-ITEM`: verify the farm-machine MCQ classification.
- Topic block 475 prints “AGRO-ALLIED IDUSTRIES”; heading block 481 prints “MEANING OF AGRO-ALLIED INDUSRIES”. Source spellings are preserved.
- Comparison table block 486 remains assigned to `AG-VIS-T1-TBL-W06`; this task does not claim visual disposition.

## Changes and validation
- Added two coverage entries (one PARTIAL, one UNRESOLVED) and three precise open items.
- Marked `AG-WK-T1-W06` `IMPLEMENTED_TESTING_DEFERRED`; appended two bounded follow-ups; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source text, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

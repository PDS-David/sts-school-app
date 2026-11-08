# AG-WK-T3-W04 — Agricultural Science, Third Term Week Four

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; no unverified corrections are applied.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Third Term member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Combined scheme item 4–5: block 10; Week Four label 370; topic 371.
- Digestive system 384–435; circulatory system 442–475; reproduction 481–498.
- Week Four label block 370 SHA-256 `3c43507c7d6178122a308f5e7ede8deda1dd2dfab7a0beebb4601d6d26ea10c2`; range blocks 370–523 SHA-256 `53f4e7e4e5be6ec369a81e8b68b0098b12f85395e248ff0f13035f01c88d1499`; both re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Digestion in ruminants | 391–400 | Source-taught |
| Digestion in non-ruminants | 402–422 | Source-taught; liver enzyme part of evaluation is not taught |
| Digestion in poultry | 424–428 | Source-taught |
| Monogastric/polygastric comparison | Table 431 | Source-taught; factual claims require review |
| Circulatory system | 442–472 | Source-taught |
| Reproductive system, male and female | 481–492 | Source-taught; anatomical terminology requires review |
| Delivery mapping | Three topic coverage rows | **PARTIAL** — package lesson rows/importer identity unverified |

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 398–400 | Ruminant definition/examples; cattle digestion | Supported by 391–396. |
| 420–422 | Non-ruminants; enzymes in stomach, small intestine, pancreas and liver | Most parts map to 402–418. The source describes bile at 411 but does not list a liver enzyme; this portion is unresolved. |
| 433–435 | Poultry digestion; ruminant/non-ruminant differences | Supported by 424–431. |
| 437–440 | Book reading | References recorded; books/pages not opened or verified. |
| 473–475 | Circulatory system and blood functions | Supported by 442–463. |
| 477–479 | Book reading | References recorded; books/pages not opened or verified. |
| 496–498 | Reproduction; male accessory glands | Supported by 482–486, subject to terminology verification. |
| 500–503 | Female reproductive system; similarities of monogastric/polygastric digestion; circulatory components | Female system supported by 490–492; components by 443–446. Similarities are not explicitly set out; table 431 lists differences. |
| 505–507 | Book reading | References recorded; books/pages not opened or verified. |
| 510 | Ruminant stomach chamber exception | Supported by the four compartments at 392; gizzard is described for poultry at 428. |
| 511–512 | Site where digestion begins | Supported by 387 and 404. |
| 513–514 | Non-male reproductive organ | Supported by male structures 485–486 and female oviduct at 490. |
| 515 | Gland responsible for vaginal lubrication | The source says Cowper's glands are also called Bartholin's glands at 492; this conflation requires specialist verification. |
| 516 | Major constituent of blood | Water is listed as a component of plasma at 449, but its quantitative status as a “major constituent” is not established. |
| 519–520 | Ruminant digestion; mono-/polygastric differences | Supported by 391–396 and table 431. |
| 521 | Sphincters | **Not taught** anywhere in blocks 370–523. |

## Table and figure disposition
- Table at block 431 compares monogastric and polygastric animals across cud-chewing, feed, stomach compartments, cellulose/fibre digestion, bacterial involvement and protein synthesis.
- Six embedded image files were inspected: cattle/ruminant tract at block 395 (`image7.png`); non-ruminant digestive tract at 417 (`image8.jpeg`); poultry digestive system at 425 (`image9.jpeg`); male reproductive images at 487 (`image10.jpeg`, `image11.jpeg`); female reproductive images at 493–494 (`image12.jpeg`, `image13.jpeg`). These are source figures, not newly authored assets.

## Follow-ups and factual review
- `AG-LES-T3-W04-UNTAUGHT-ASSESSMENT-ITEMS`: liver bile/enzyme distinction, similarities in digestion, blood composition and sphincter definition.
- `AG-FACT-T3-W04-DIGESTIVE-ACCURACY`: verify table 431's bacterial digestion/protein synthesis claims and enzyme names/actions, especially trypsinogen at 410.
- `AG-FACT-T3-W04-REPRODUCTIVE-ACCURACY`: verify vas deferens/uterus masculinus and sperm storage (485), Cowper's/Bartholin's terminology (492), species-specific vaginal length and “sex-inhibited characters” wording (482).
- Reading references at 437–440, 477–479 and 505–507 were recorded but not independently consulted.

## Changes and validation
- Added three PARTIAL coverage entries and one UNRESOLVED coverage entry; appended four precise open items.
- Marked `AG-WK-T3-W04` `IMPLEMENTED_TESTING_DEFERRED`; appended one bounded lesson task and two factual-dependency tasks; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

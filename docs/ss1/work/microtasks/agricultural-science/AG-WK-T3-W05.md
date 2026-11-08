# AG-WK-T3-W05 — Agricultural Science, Third Term Week Five

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; the displayed equations are preserved verbatim and not silently corrected.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Third Term member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Scheme item 4–5: block 10; Week Five label 524; topic 525.
- Respiratory system 530–564; nervous system 577–581.
- Week Five label block 524 SHA-256 `700c30e110b71fbdb4d6aaa0ea0a922cb9d63b799643acd01e32055226c62598`; range blocks 524–606 SHA-256 `df93004697a28727f740591bb0256c07afbeab82aa6a032d14098df02ac63cde`; both re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Respiratory system and respiration | 530–541 | Source-taught; equations need verification |
| Respiratory organs, breathing and fish gills | 543–555 | Source-taught; detailed breathing mechanics not supplied |
| Importance of respiratory system | 560–564 | Source-taught |
| Nervous system, stimulus/response, CNS/PNS | 577–581 | Source-taught; reflex action not taught |
| Delivery mapping | Two topic coverage rows | **PARTIAL** — package lesson rows/importer identity unverified |

## Equations preserved verbatim
- Block 532: `C6H12O6+6O26CO2+ 6H2O + ENERGY`
- Block 537: `C6 H12 O6+6O26CO2+ 6H2O +            ENERGY`
- Block 540: `C6H12O6 2C2H5OH + 2CO2+ ENERGY`
- The labels at 533, 538 and 541 identify glucose, oxygen, carbon dioxide, water, alcohol and ATP/energy as printed. The text extraction does not show a reaction arrow or reliable subscript formatting. No missing symbols or coefficients were inserted.

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 556–559 | Inhalation/exhalation; aerobic/anaerobic differences | Basic definitions/types at 535–541 and 549–550 support the questions; breathing mechanics are not described. |
| 566–571 | Respiration definition/types; fish respiration; aerobic equation; named-animal respiration | Definitions/types at 531–541; fish gills at 552; equation at 537. A complete named-animal process is not taught. |
| 573–575 | Book reading | References recorded; books/pages not opened or verified. |
| 584–586 | Notes on respiratory/nervous systems; CNS/PNS distinction | Supported by 530–564 and 577–581, within the limited detail provided. |
| 588–591 | Book and WAEC past-question reading | References recorded; books/pages/past question not opened or verified. |
| 594–596 | Lungs in rabbit / gills in fish; windpipe | Supported by 544–546 and 552. |
| 597 | Gill structure performing a protective role comparable to epiglottis | Source says epiglottis prevents food entering trachea (546) and gill rakers prevent particles entering the gill chamber (552); wording and intended answer should be checked. |
| 598–599 | Environmental change that triggers response | Supported by stimulus definition at 578. |
| 600–601 | Structural and functional unit of nervous system | Neurons are mentioned at 579, but the source does not teach this explicit relationship. |
| 603–604 | Simple reflex action and four examples | **Not taught** in blocks 577–581. |

## Figure disposition
- Goat respiratory-system image at block 547 (`word/media/image14.jpeg`).
- Two fish-gill images at block 554 (`word/media/image15.jpeg`, `image16.jpeg`).
- No body tables in blocks 524–606.

## Follow-ups and factual review
- `AG-LES-T3-W05-RESPIRATION-NERVOUS-GAPS`: add verified breathing mechanics, a complete named-animal respiration account, neuron structure/function and reflex action/examples.
- `AG-FACT-T3-W05-RESPIRATION-ACCURACY`: verify equations/formatting, distinguish animal anaerobic respiration from alcoholic fermentation, and check bronchioles/gill-raker/operculum descriptions.
- Reading references at 573–575 and 588–591 were recorded but not independently consulted.

## Changes and validation
- Added two PARTIAL coverage entries and one UNRESOLVED coverage entry; appended three precise open items.
- Marked `AG-WK-T3-W05` `IMPLEMENTED_TESTING_DEFERRED`; appended one bounded lesson task and one factual-dependency task; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

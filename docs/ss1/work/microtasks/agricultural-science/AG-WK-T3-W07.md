# AG-WK-T3-W07 — Agricultural Science, Third Term Week Seven

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only; no hormone corrections or egg-formation values are silently changed.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Third Term member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Scheme item 6–7: block 11; Week Seven label 788; topic 789.
- Egg formation 794–795; poultry reproductive-system heading 820; hormone definition 825–827; hormone table 828.
- Week Seven label block 788 SHA-256 `4a723109953b31906cbe40ce93fd8a4f440295167adea8b71e78dda0d7f59808`; range blocks 788–854 SHA-256 `7e69c5c03f6c38dd97d0bd0e33c58f1772d980a4853bc595d28894e331b6abbc`; both re-derived and matched.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Poultry egg formation | 794–795 | Source-taught; timings need verification |
| Poultry reproductive system | Heading 820; figures 803–804 and 819 | **UNRESOLVED** — figures are present but explanatory prose is absent |
| Male/female reproductive hormones | 825–828 | Source-taught; sex/site/function assignments need verification |
| Delivery mapping | Egg-formation and hormone entries | **PARTIAL** — package lesson rows/importer identity unverified |

## Egg formation sequence and timings (source wording)
- Ovum/yolk released from ovary into oviduct via infundibulum; fertilization at infundibulum (15 minutes).
- Magnum: albumen and chalaza secreted around yolk (3 hours).
- Isthmus: two shell membranes formed (1 hour 15 minutes).
- Uterus: shell formed from calcium carbonate and mineral solutions added (18–21 hours).
- Vagina: 1–15 minutes; egg laid through cloaca.
- Source states complete formation takes “almost 26 hours”. All timings are retained as source figures and require independent verification.

## Hormone table
Table block 828 (cell-text SHA-256 `23d71c760fadf5dd5905d5e23e91a46de2c4e0c34845c5c57892c337d20b5cb9`) lists:
- Testosterone/androgen — male — testes.
- Oestrogen — female — ovary.
- Progesterone — female — corpus luteum.
- Oxytocin — female — pituitary.
- Relaxin — female — pituitary.
- FSH — female — pituitary.
- LH — female — pituitary.
The table's stated functions are retained in the source; sex/site/function assignments require fact-checking, especially FSH/LH in males, relaxin source and the oxytocin/sperm-transport statement.

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 821–823 | Egg formation; describe poultry reproductive system | Egg formation maps to 794–795. Reproductive-system description is not supplied in prose after heading 820, although figures are present. |
| 830–837 | Five hormones/functions; functions of ovary, oviduct, magnum and uterus | Hormones map to table 828; egg-formation organs map to 795. |
| 838–840 | Book and WAEC past-question reading | References recorded; books/pages/past question not opened or verified. |
| 844 | Male reproductive-system exception | Male/female structures are illustrated at 819; answer mapping should be checked against the diagram. |
| 845 | Female hormone exception | Table 828 marks testosterone as male; this is the source's intended distinction, subject to table verification. |
| 846 | Fertilization site in poultry | Supported by infundibulum at 795. |
| 847 | Viviparous-animal exception | Turkey is oviparous; cross-week support at Week Four block 482 says poultry birds are oviparous. |
| 848 | Hormone causing uterine contraction | Source table 828 attributes this to oxytocin; physiological role/site require verification. |
| 851 | Draw and label an egg | Egg-structure image at block 804 provides visual support; bird embryo image at 803 is distinct. |
| 852 | Five reproductive hormones, sites and functions | Supported by the seven-row table at 828, subject to factual verification. |

## Figure disposition
Five embedded media files inspected:
- Block 803: bird embryo/egg image (`image17.jpeg`) and poultry internal organs (`image18.jpeg`).
- Block 804: scanned egg-structure diagram (`image19.jpeg`) and poultry oviduct/egg-formation diagram (`image20.jpeg`).
- Block 819: male/female reproductive-excretory systems (`image21.jpeg`).
No body tables other than hormone table 828.

## Follow-ups
- `AG-LES-T3-W07-POULTRY-REPRO-SYSTEM`: provide a verified prose explanation of male/female poultry reproductive structures tied to the source diagrams.
- `AG-FACT-T3-W07-HORMONES`: verify all seven hormone sex/site/function assignments.
- `AG-FACT-T3-W07-EGG-FORMATION`: verify egg-formation anatomy and stage durations.

## Changes and validation
- Added two PARTIAL coverage entries and one UNRESOLVED coverage entry; appended four precise open items.
- Marked `AG-WK-T3-W07` `IMPLEMENTED_TESTING_DEFERRED`; appended one bounded lesson task and two factual-dependency tasks; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

# AG-WK-T3-W06 — Agricultural Science, Third Term Week Six

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only. Veterinary-sensitive statements are recorded as source content, not endorsed or expanded into procedures.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Third Term member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Scheme item 6–7: block 11; Week Six label 607; topic 608.
- Oestrus 611–617; ovulation 619–627; heat/signs 628–647; mating/AI 653–708; fertilization 709–710; implantation 712–713; gestation 715–724; parturition 726–743; lactation 749–752; colostrum 753–760.
- Week Six label block 607 SHA-256 `8c07e3bd938cea9a3897d0d69eb6c600bf1fbace15d21b346bf0372fa095c038`; range blocks 607–787 SHA-256 `984ba7e0f5936a9a5dfb7680e93fc00ab7c64faa8bc8cbab696cbeda6b6159c7`; both re-derived and matched.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Reproduction, sexual maturity and cycles | 609–647 | Source-taught; species timings need verification |
| Natural mating systems and artificial insemination | 653–708 | Source-taught; factual/safety review required |
| Fertilization, implantation and gestation | 709–724 | Source-taught; table layout and species values need verification |
| Parturition, lactation and colostrum | 726–760 | Source-taught; claims require veterinary/dairy review |
| Delivery mapping | Three topic coverage rows | **PARTIAL** — package lesson rows/importer identity unverified |

## Timing and gestation table
- Sexual maturity (609): cattle up to 15 months; goats/sheep about 6 months; poultry about 18 weeks.
- Oestrus cycle (612–617): cow 20–21 days; ewe 17–21; sow 14–28; doe (goat) 17–21; doe (rabbit) “spontaneous”.
- Ovulation (620–626): cow 10–14 hours; ewe 20–24; sow 24–36; doe (goat) 12–36; rabbit “spontaneous”.
- Heat (629–634): cow 5–24 hours; ewe 35–36; sow 40–48; doe (goat) 40–50; rabbit “spontaneous”.
- Gestation table block 724 cell-text SHA-256: `7b1f4bfc31fe563d88fe519302d11e61eb59129a4ad39d3f8dcde1c48207ac0c`. It lists horse/cattle (mare/cow; 336 days/283 days), goat (doe; 150 days), sheep (ewe; 150 days), pig (sow; 114 days), and rabbit/chicken (doe/hen; 31 days/21 days). The paired entries are concatenated within cells as `HorseCattle`, `MareCow`, `336 days283 days`, `RabbitChicken`, `DoeHen`, `31days21 days`; the original table is retained and the formatting ambiguity is recorded.

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 649–651 | Oestrus cycle vs heat; ovulation timings | Supported by 611–647; timing values need validation. |
| 702–708 | Artificial mating; advantages/disadvantages; semen collection; cycle terms; signs of heat | Supported by 653–708 as source statements. No collection/handling procedure is added. |
| 744–748 | Gestation, parturition, signs and species names | Supported by 715–743. |
| 761–764 | Book and WAEC past-question reading | References recorded; books/pages/past questions not opened or verified. |
| 766–770 | Reproduction, implantation, parturition signs and colostrum | Supported by 609, 712–713 and 735–760; colostrum claims need verification. |
| 773–774 | Oestrus-cycle interval | Supported by 612. |
| 775–776 | Hormone exception (lactation vs oestrus/heat) | The source attributes cycle/heat to oestrogen (612,629) and lactation to oxytocin (750); physiological claims require verification. |
| 777–778 | Natural mating and venereal disease | Supported by 677 and 688. |
| 779–780 | Desirable male kept for mating | Supported by stud-mating definition 680–685. |
| 781 | Pig gestation | Table 724 lists 114 days; table layout/value needs verification. |
| 783–784 | Embryo development | **Partially taught**: 712–713 only states zygote attaches and develops into a foetus; no stages are described. |
| 785 | Lamb position before expulsion | **Not taught**; no fetal presentation content in 726–743. Any supplement is limited to veterinary-reviewed, non-procedural educational identification. |

## Safety and factual review
- Artificial insemination section 691–700 mentions semen collection methods and storage in liquid nitrogen at -196°C. This is reported as source text only; no operating instructions or doses were added.
- Lactation section 750 mentions injectable oxytocin; no dosage, administration or treatment guidance is provided.
- Colostrum section 755 uses the word “antibiotic” for protective components. Verify terminology and immunity claims before delivery.
- “Goat milk is the best and richest” (751), poultry “hatching” as parturition (733), species timing values and the concatenated gestation table need authoritative review.

## Follow-ups
- `AG-LES-T3-W06-EMBRYO-LAMB-PRESENTATION`: supplement embryo development and non-procedural fetal presentation; veterinary review required.
- `AG-FACT-T3-W06-REPRO-TIMINGS`: verify sexual maturity, oestrus, ovulation, heat and gestation values by species and clarify table structure.
- `AG-FACT-T3-W06-LACTATION-COLOSTRUM`: verify oxytocin, goat-milk, colostrum and hatching claims; no drug doses/instructions.

## Changes and validation
- Added three PARTIAL coverage entries and one UNRESOLVED coverage entry; appended four precise open items.
- Marked `AG-WK-T3-W06` `IMPLEMENTED_TESTING_DEFERRED`; appended one bounded lesson task and two factual-dependency tasks; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

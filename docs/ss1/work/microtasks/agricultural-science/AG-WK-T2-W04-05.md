# AG-WK-T2-W04-05 — Agricultural Science, Second Term Weeks Four and Five

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only. All numeric table values below are transcribed verbatim; none are normalised or supplemented with invented rates.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; Second Term member SHA-256 `e9706d69cbb41e7149e2fe62a202ec21143e827fb78c46cb92efe142f9d7e042` — verified.
- Scheme item 4–5: block 9; combined Weeks 4–5 label 279; topic 280.
- Maize/rice table: block 286; cowpea/groundnut: block 298; yam/cassava: block 309. Each is a 17-row, 3-column table.
- Week range 279–336; SHA-256 `1dbb2d100cc1c775a4797cdeb018bfff05030346fe9d3bb7593448e4ac5e577a`, re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Crop group | Source evidence | Status |
|---|---|---|
| Cereals: maize and rice | Table block 286 | Source-taught |
| Legumes: cowpea and groundnut | Table block 298 | Source-taught |
| Roots/tubers: yam and cassava | Table block 309 | Source-taught |
| Combined scheme objective | Three complete cultivation tables and related assessments | **PARTIAL** — package row/importer identity unverified |

Each table has the same 17-row structure: crop name, description, varieties/cultivar, land preparation, climate, soil, propagation, planting date, planting, seed rate, spacing, cultural practices, maturity, harvesting, processing, uses and storage.

## Verbatim agronomic figures retained
These strings are copied as they appear in the tables; no correction or unit conversion is implied.

| Crop | Climate/soil | Planting date | Seed rate | Spacing | Maturity |
|---|---|---|---|---|---|
| Maize | Temperature `260C-300C`; Rainfall `75cm-150cm per annum`; sandy-loamy soil pH 6-7 | Early maize – March/April; Late maize – July/August | `20-30kg per hectare of land` | `80cm between row and 30cmwithin row` | `90-120 days after planting` |
| Rice | Temperature `200c`; rainfall `75cm-120cm` for upland and `over 250cm` for swamp; loamy-clayey soil | South – April/May; North – August/September | `65kg per hectare at 2-3 seeds per hole` | `25-30cm apart depending on varieties` | `4-7 months` |
| Cowpea | Temperature `27o-35oC`; rainfall `60-125cm per annum`; well-drained sandy-loamy soil | `April to September depending on the ecological zone` | `20 – 25kg per hectare` | Erect `30 x 75cm`; creeping `25 x 90cm` | `9 – 12 weeks after planting` |
| Groundnut | Temperature `25o-30oC`; rainfall `70-100cm per annum`; coarse-textured sandy-loamy soil | South – March/April; North – May/June | `30 – 35kg per hectare` | Erect `60 x 15cm`; creeping `60 x 20cm` | `3 – 4 months after planting` |
| Yam | Temperature `25o – 30oC`; rainfall `100cm – 180cm per annum`; well-drained sandy-loamy soil | Early yam – November/December; Late yam – March/April | `3 – 5 tonnes per hectare` | `90cm x 100cm` | `8 – 12 months` |
| Cassava | Temperature `21o – 35oC`; rainfall `150 – 200cm per annum`; table says `Dried loamy soil` | `March to September depending on ecological zone` | Seed-rate cell is blank | `100cm x 100cm` | `10 – 15 months` |

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 288–292 | Nutritional values; named cereal cultivation | Nutritional values cross-map to First Term Week 10 blocks 893–898: cereals/carbohydrates, legumes/proteins, vegetables/vitamins and minerals, spices/vitamins and minerals/flavour, beverage crops/food drinks. Cereal cultivation maps to maize/rice table 286. |
| 294–295 | Reading assignment | Reference recorded; book/page not opened. |
| 300–303 | Cowpea pre-planting; groundnut/cowpea uses; five importance of legumes | Cultivation maps to table 298 and earlier pre-planting operations. Legume uses/importance are supported by block 298: plant protein, cover crop, forage, green manure, oil, cake and groundnut butter. |
| 305–306 | Reading assignment | Reference recorded; book/page not opened. |
| 308–313 | Yam/cassava cultivation and varieties | Maps to table 309. Yam/cassava soil/climate, propagation, planting, maturity and harvesting are explicitly given. |
| 315–319 | Yam cultivation; named legume; four groundnut uses; yam cultural practices | Tables 298/309 support most subheadings and uses. Theory 319 is under-supported for explaining staking/training, which are only named in table 309. |
| 321–322 | Reading assignment | Reference recorded; book/page not opened. |
| 324–330 | Weekend MCQs | Q1 pulses supported by cowpea description 298. Q2 thinning exception supported by yam cultural-practices row 309. Q3 mulching benefits may have more than one unsupported exception: earlier mulching text 197–203 gives moisture/temperature/weed/erosion/humus benefits, not pest or yam-rot prevention. Q4 cowpea processing supported by 298. Q5 rice processing supported by 286; source prints “per boiling”. |
| 332–334 | Staking, mulching, training of vine; four legume uses | Mulching supported by earlier blocks 197–203; staking/training are only named in table 309. Legume uses supported by 298. |

## Defects and follow-ups
- `AG-LES-T2-W04-05-YAM-PRACTICES`: explain staking and training of yam vines; preserve original table list and label supplement content.
- `AG-FACT-T2-W04-05-MULCHING-MCQ`: verify whether weekend Q3 has a unique exception.
- `AG-CORR-T2-W04-05-TABLE-TEXT`: verify table anomalies before any delivery correction. Examples include `per boiling`, `2/3 0f`, joined botanical names, malformed yam-variety cell, `Dried loamy soil`, and `30cmwithin row`.
- Cowpea storage text mentions insecticide treatment and store fumigation; no rates/doses or operational handling directions are supplied or added.

## Changes and validation
- Added two coverage entries (one PARTIAL, one UNRESOLVED) and four precise open items.
- Marked `AG-WK-T2-W04-05` `IMPLEMENTED_TESTING_DEFERRED`; appended three bounded follow-ups; recomputed queue counts and `next_runnable`.
- Parsed package/queue JSON; checked unique IDs and open-item links for PARTIAL/UNRESOLVED coverage.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

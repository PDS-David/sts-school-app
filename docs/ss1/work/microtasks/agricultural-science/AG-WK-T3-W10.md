# AG-WK-T3-W10 — Agricultural Science, Third Term Week Ten

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only. Veterinary and chemical statements, including the stated dose, are recorded verbatim as source content and are not endorsed or supplemented.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Third Term member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — both verified.
- Scheme item 9–10 is a combined row at block 13. Week Ten label 1124 SHA-256 `3ee3bfdc68d8630b1fb02fe862672c802a6d5e762236767928f0d739d3291e10`.
- Topic heading 1125; content outline 1126–1135.
- Week range blocks 1124–1254 SHA-256 `9b3f1eb753bab7cfec4511faab33fb3eee2bacdad2b167fdd0a74e4222d4661c`, re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Cattle classification, breeds and terms | 1136, 1138–1153 | Source-taught |
| Characteristics and rearing systems | 1160–1176 | Source-taught |
| Feeding | 1182–1190 | Source-taught; terminology discrepancy |
| Breeding-to-finishing management | 1192–1203 | Source-taught |
| Parasites and diseases | 1205–1226 | Source-taught; treatment/chemical claims require review |
| Delivery mapping | Whole Week Ten objective | **PARTIAL** — package lesson rows/importer identity unverified |

The source states cattle are reared for meat, milk, hide/skin, manure and draught work (1136). It groups breeds as beef (1141–1142), dairy (1143–1144) and dual purpose (1146–1147); terms include bull, cow, calf, heifer, serving, calving, herd and beef (1149–1153).

## Feeding and management
- Extensive, semi-intensive and intensive systems: 1168–1176.
- Feeding: balanced diet, grasses/legumes and roughages, concentrate, zero-grazing, “rational grazing” (source wording), hay, silage and straw: 1182–1190.
- Breeding to calving: 1195–1197; birth to weaning: 1199–1200; weaning to finishing: 1202–1203.
- Tattooing is named as an identification method at 1203, but is not defined there.

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 1156–1158 | Five cattle breeds; five importance(s) | Supported by 1138–1147 and the stated products/uses at 1136. |
| 1178–1180 | Cattle characteristics; disadvantages of extensive system | Supported by 1161–1166 and 1170. |
| 1228–1237 | Breeds, products, characteristics, intensive system, management stages, other feeds, parasites/diseases | Supported by 1136–1226. |
| 1240–1242 | Book and WAEC reading | References recorded; books/pages/past questions not opened or verified. |
| 1244–1250 | Weekend MCQs: gestation, weaning, colostrum, heifer, calving | Supported by 1165, 1200, 1151–1152 and 1197. |
| 1252–1254 | Define tattooing, zero-grazing, rotational grazing; economic importance | Zero-grazing is defined at 1187; cattle importance is supported at 1136. Tattooing is named but not defined (1203). The text says “Rational grazing” at 1188 while the question says “rotational grazing”; intended wording requires verification. |

## Parasites, diseases and safety-sensitive statements
- Mange is attributed to mites; symptoms and treatment claims appear at 1207–1212.
- Block 1210 says “invermectin or ivomec injection”; block 1212 lists diazuntol, malathione, benzyl benzoate and benzene hexachloride.
- Tuberculosis is described at 1214–1222. The source states “isonicotinichydracide” at **10 mg/kg body weight for eight weeks** (1221–1222).
- Dehorning section says caustic soda may be applied to the horn bud (1203).
- No chemical handling/PPE instructions or supporting veterinary references are supplied. These are source statements, not validated veterinary directions. `AG-FACT-T3-W10-CATTLE-SAFETY` is appended for authoritative review; no additional dose or procedure is invented.

## Cross-topic and wording issues
- The cattle mange section at 1210 says to maintain hygiene and sanitation in “pig houses”; this appears cross-topic and requires confirmation.
- “Rational grazing” at 1188 versus “rotational grazing” in theory 1253 requires verification.
- `AG-FACT-T3-W10-CATTLE-TERMS` records the tattooing/terminology issues; a correction-binding and bounded supplement task depend on that decision.

## Changes and validation
- Added one PARTIAL and one UNRESOLVED coverage entry and three precise open items.
- Marked `AG-WK-T3-W10` `IMPLEMENTED_TESTING_DEFERRED`; appended two factual tasks, one correction-binding task and one dependent lesson task; recomputed queue counts and `next_runnable`.
- Verified archive/member hashes and week label/range hashes; parsed package/queue JSON; checked unique IDs and that every PARTIAL/UNRESOLVED coverage row has an open-item reference.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

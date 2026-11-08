# AG-WK-T3-W09 — Agricultural Science, Third Term Week Nine

Status: **IMPLEMENTED_TESTING_DEFERRED**. Source indexing only. Veterinary and chemical statements are recorded as source content, not endorsed or expanded into procedures.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Third Term member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — both verified.
- Scheme item 9–10 is a combined row at block 13. Week Nine label 982 SHA-256 `e38b03944a5cbe25a9e8b633065edd7490e9360c352bcb33ba8e6926594b756f`.
- Topic heading 983; content outline 984–991.
- Week range blocks 982–1123 SHA-256 `5a6918c499185465ecb30f240112f9c39c3697e7ba6fed967255d8154efdc0e4`, re-derived and matched.
- Locator rule: direct child of `w:body`, zero-based; block text concatenates `w:t` runs; range hash is SHA-256 of block texts joined with newline, including empty blocks.

## Scheme objective and coverage
| Sub-objective | Source evidence | Status |
|---|---|---|
| Pig terms and classification | 992, 994–1000 | Source-taught |
| Breeds and characteristics | 1002–1004, 1008–1016 | Source-taught |
| Rearing systems and housing | 1023–1032, 1038–1039 | Source-taught; one assessment term absent |
| Feeding and hygiene | 1041–1049 | Source-taught |
| Breeding-to-finishing management | 1055–1070 | Source-taught |
| Parasites and diseases | 1072–1093 | Source-taught; veterinary/chemical claims require review |
| Delivery mapping | Whole Week Nine objective | **PARTIAL** — package lesson rows/importer identity unverified |

The source lists Hampshire, Yorkshire/Largewhite, Poland China, Landrace, Berkshire, Large Black, West African Dwarf and Duroc. Terms include boar, sow, piglet, barrow, pork, in-sow, dry sow, “Fatheners” (block 998; source spelling), farrowing, lard and gilt. Later blocks use “fatteners” (1042, 1068); no silent spelling correction is made.

## Rearing, housing, feeding and management
- Extensive system 1024–1025; semi-intensive 1027–1029; intensive 1031–1032.
- Housing 1038–1039: pigs are housed in pens; siting, walls, concrete floor, slope/drainage, rough floor, roof and trough/bath provisions are described.
- Feeding 1041–1042: balanced diet, flushing, laxative diet, creep feed, weaner and fattener mash, water and market-weight statements.
- Hygiene 1044–1049: pen and trough cleaning, disinfection, deworming and vaccination.
- Breeding to farrowing 1058–1060; birth to weaning 1062–1065; weaning to finishing 1067–1070.

## Assessment-by-assessment scope
| Blocks | Item | Finding |
|---|---|---|
| 1018–1021 | Pig breeds, management terms and characteristics | Supported by 994–1016. |
| 1034–1036 | Extensive/intensive systems | Supported by 1024–1032. |
| 1051–1053 | Laxative/creep/fattener feeds and hygiene | Supported by 1041–1049. |
| 1095–1097 | Intensive disadvantages; birth-to-weaning and weaning-to-finishing management | Management is supported by 1062–1070. Only one intensive-system disadvantage (“capital intensive”, 1032) is explicit although the question asks for two. |
| 1099–1106 | General review: characteristics, breeds, systems, advantages/disadvantages, feeding/hygiene, management | Most items are supported. The second intensive-system disadvantage is not taught. |
| 1108–1110 | Book and WAEC reading | References recorded; books/pages/past questions not opened or verified. |
| 1112–1119 | Weekend MCQs | Boar, gestation period, laxative diet and Duroc are supported by 995, 1010, 1042 and 1003–1004. Q3 asks for “sty” (1115), but the body says pigs are housed in pens (1039) and does not teach “sty”. |
| 1120–1121 | Extensive/intensive advantages and disadvantages | Extensive pros/cons and intensive advantages are described. Intensive disadvantage: only capital intensity is explicit; the requested second disadvantage is absent. |

## Parasites, diseases and safety-sensitive statements
- External parasites and pesticide/insecticide claim: 1080.
- Internal parasite names and control statement: 1082.
- African swine fever, tick-transmission statement, 10% caustic-soda disinfection and two-month pen vacancy: 1085–1087.
- Swine erysipelas and penicillin statement: 1089–1090.
- Hypoglycaemia and glucose-injection statement: 1092–1093.
- Iron “dextian” injection at 2–3 days and again 2–3 weeks later: 1064.
- The source provides no handling/PPE instructions for pesticide/insecticide or caustic soda and no product-specific application instructions. These statements are not validated veterinary directions. `AG-FACT-T3-W09-PIG-SAFETY` is appended for authoritative review; no doses or procedures are invented.

## Visual and cross-week notes
- Pig external-anatomy diagram at block 1006 (`image22.jpeg`) is inventoried; its separate visual-disposition task remains pending.
- No cross-week assessment dependency was identified in the Week Nine assessment set.

## Follow-ups
- `AG-FACT-T3-W09-PIG-ASSESSMENT-SCOPE`: verify “sty”, the missing second intensive-system disadvantage, and “Fatheners”/“fatteners” spelling before authoring or correcting.
- `AG-LES-T3-W09-PIG-ASSESSMENT-SUPPLEMENT`: dependent on the fact decision; author only verified missing assessment content.
- `AG-FACT-T3-W09-PIG-SAFETY`: verify source veterinary/chemical claims and safe educational disposition.

## Changes and validation
- Added one PARTIAL and one UNRESOLVED coverage entry and three precise open items.
- Marked `AG-WK-T3-W09` `IMPLEMENTED_TESTING_DEFERRED`; appended two bounded factual tasks and one dependent lesson task; recomputed queue counts and `next_runnable`.
- Verified archive/member hashes and week label/range hashes; parsed package/queue JSON; checked unique IDs and that every PARTIAL/UNRESOLVED coverage row has an open-item reference.
- Importer, tests, TypeScript, DB and device checks **not run**; testing remains deferred by owner.
- No source bytes, lesson bodies, rules, corrections, assets, shared code or other subjects modified.

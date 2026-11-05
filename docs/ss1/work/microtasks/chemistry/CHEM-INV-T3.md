# CHEM-INV-T3 — Chemistry, 3rd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: `origin/master` `349164e` (merge of PR #317, which carried CHEM-INV-T2). PR #316 (Catering Craft) was already merged as `b399b24`; no open PR and no Chemistry branch or PR existed for this item.
- Prerequisite **CHEM-SRC-T3** is `IMPLEMENTED_TESTING_DEFERRED`; source `SS1-SRC-28ed32f52548` is registered in `chemistry.json`. This item adds no package change.
- Original: member `SSS 1/3rd Term SS1_/3RD TERM S1 CHEMISTRY.doc`, **350,720 bytes**, SHA-256 `0b8f96389c722ed7bfeed046e4478771b98613cb1bfdf004226b7794922ea435`, verified before extraction and equal to the task and `SOURCE_ASSIGNMENTS.csv`.
- Container: the composite archive verified by CHEM-SRC-T3, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`. The member hash was re-verified on the private copy used here.
- Method: private scratch extraction with `word-extractor` 1.0.4 `getBody()`, corroborated by antiword 0.37 DocBook output; OLE streams and properties with olefile 0.47; the one JPEG with Pillow 11.x. No Word or LibreOffice render was used. Nothing from the document is committed.

## Locator rule (reproducible)
Line = 1-based line of the `getBody()` text, which has LF endings; no normalisation, and U+001E is kept as-is. Range sha256 = SHA-256 over lines a..b joined with `\n`, empty lines included. The body is **89,485 characters**; splitting on LF gives 1,338 newlines and **1,339 entries**, the last empty (line 1,339). Whole-body SHA-256 `2b83b851ea8de54b62fb49a9396bc0f23c3b8b95941a1f8ea1ea65515fde886f`. This is a different locator from the T2 `.docx` block rule; it is the reproducible rule for this Word 97 binary.

## Opening / scheme (lines 1-24, range sha256 `ba556b7118ec2b07475cd62697bfd0e4c6c6be93a531e792b9cd98e9e861ee8c`; 1,544 characters, 19 non-empty lines)

| Line | Exact text |
|---:|---|
| 1 | `THIRD TERM E-LEARNING NOTE` |
| 3 | `SUBJECT: CHEMISTRY<TAB>CLASS: SS 1` |
| 5 | `SCHEME OF WORK` |
| 7 | `WEEK<TAB>    <TAB>TOPIC` |
| 8 | `1.<TAB><TAB>Revision /Acids: Properties, Preparation and Uses. pH Scale` |
| 9 | `2-3.<TAB>Bases: Properties, Preparation.  Salts: Classification, Methods of preparation, Types and Characteristics` |
| 10 | `4.  <NBSP x6><TAB>Carbon- Allotropes and their Structures, Properties, Differences between Diamond and Graphite.` |
| 11 | `5.    <NBSP x2><TAB>Carbon (ii) Oxide (CO), Carbon (iv) Oxide (CO2): their Preparation, Properties and Uses.` |
| 12 | `6.    <TAB>Coal: Types of Coal, Destructive Distillation of Coal, Uses of the Products, Coke: Gasification and Uses.` |
| 13 | `7.     <TAB>Metallic Carbonate: Occurrences, Preparation and Uses, Test for Trioxocarbonate ion. Trioxocarbonate (iv) acid: Preparation, Properties and Uses.` |
| 14 | `8-9.   <TAB>Introduction to Hydrocarbons: Sources of Hydrocarbons, Classification<NBSP>of<NBSP>Aliphatic Hydrocarbons. Petroleum and Natural<NBSP>gases: Refining of<NBSP>Petroleum by Fractional Distillation, Uses of different Fractions,<NBSP>Cracking<NBSP>of Petroleum (Thermal and Catalytic), Anti-knock and Octane rating.` |
| 15 | `10.  <NBSP x2> <TAB>Applied Chemistry: Raw material used in Chemical industries and their Sources. Division of the Chemical Industries: Heavy chemicals, Fine chemicals, Fertilizers, Plastics, Metallurgy, Pharmaceutical, Glass, Ceramics, Cements, Soap and Detergents.` |
| 16 | `11. <TAB>Revision.` |
| 17 | `12-13. <TAB>Examination` |
| 19 | `REFERENCE MATERIALS` |
| 20 | `New School Chemistry for Senior Secondary Schools by<NBSP>Osei Yaw Ababio` |
| 21 | `New<NBSP>System<NBSP>Chemistry<NBSP>for<NBSP>Senior<NBSP>Secondary Schools by Tan Yan Ton el al` |
| 22 | `WAEC past Questions and Answers` |
| 23 | `UTME past Questions and Answers` |

Scheme lines 5-17: range sha256 `6e4210ca1311223dc4e9a57825197d9ea30c732ca60f9f7a8f88cd3da419beef`, 1,258 characters, 12 non-empty lines. References lines 19-23: range sha256 `5d0bbcb9de1985c6a2b906fbb83548bcde61c98311af042633f90b59e47291b2`, 223 characters, 5 non-empty lines.

Thirteen numbered scheme rows occupy ten physical lines: 1, 2-3, 4, 5, 6, 7, 8-9, 10, 11 (Revision), 12-13 (Examination). The row numbers are typed text, not automatic numbering. Lines 1-24 precede the first week marker, so the compiler will report `PREAMBLE_REQUIRES_COVERAGE`; the scheme must be coverage-mapped, never authored as a lesson.

## Week inventory

| Label (exact) | Label line | Range | Range sha256 | Non-empty lines | Characters | Source title line |
|---|---:|---|---|---:|---:|---|
| `WEEK ONE` | 25 | 25-276 | `f810a252493dc9fc8c96662cbff8f917c3a0889755e2cba345128031baa73058` | 210 | 11,414 | 26 `TOPIC: REVISION/ACIDS` |
| `WEEK TWO AND THREE` | 277 | 277-582 | `f56dabf601a9e1dd3c15154ee6533cfc84634ccd11adeb334e2f98368b936269` | 259 | 16,266 | 278 `TOPIC: BASES AND SALTS` |
| `WEEK<NBSP>FOUR` | 583 | 583-735 | `b2e0cdbe6238c0cd0f097568df6fcc5d5098ff8f9a1a24503a19a14df88cd1bd` | 114 | 9,703 | 584 `TOPIC: CARBON AND ITS PROPERTIES` |
| `WEEK FIVE` | 736 | 736-896 | `e253243903d2ca00af22141667707e0e0f7e475bfcebf0ed4173a30773788b09` | 136 | 10,906 | 737 `TOPIC: OXIDE OF CARBON.` |
| `WEEK SIX` | 897 | 897-992 | `f1fac005982318be0f532c806e841139b08713ca1628ca315234385e949cad7e` | 81 | 6,887 | 898 `TOPIC: COAL AND FUEL GASES` |
| `WEEK SEVEN` | 993 | 993-1084 | `a2ca76ca71a7cb37dd783635c98bbfda3031f1d995765a5fc99aa29dcba102ec` | 77 | 6,025 | 994 `TOPIC: TRIOXOCARBONATE (iv) ACID` |
| `WEEK EIGHT AND NINE` | 1085 | 1085-1262 | `8ced131ec507d667ecc6bac758a790b8c38916f3f5a917d7a2be0afb9cb40770` | 141 | 18,300 | 1086 `INTRODUCTION TO HYDROCARBONS` (no `TOPIC:`) |
| `WEEK TEN` | 1263 | 1263-1338 | `ce8babfd90d0e8a456204d1b28529fb61f9f2f5c8865f9f5cfb2b0f6d29451f8` | 54 | 8,431 | 1264 `APPPLIED CHEMISTRY` (no `TOPIC:` line) |

Eight labels cover **ten teaching weeks**. `WEEK TWO AND THREE` and `WEEK EIGHT AND NINE` each cover two scheme rows. The `WEEK<NBSP>FOUR` label uses U+00A0 between `WEEK` and `FOUR`.

Section order by line (headings are source text):

- **W01 (25-276):** acids and classes (33-62), strength and ionisation equations (63-76), basicity table (77-84), EVALUATION (85-89), physical and chemical properties (90-109), preparation and uses (110-151), EVALUATION (152-157), pH/pOH definition, scale and relationship (158-198), worked pH examples (199-239), universal-indicator measurement (240-245), EVALUATION (246-250), GENERAL EVALUATION/REVISION (251-259), READING ASSIGNMENT (260-262), WEEKEND ASSIGNMENT (263-269), THEORY (270-276). No revision-of-first-term section exists despite scheme row 1.
- **W02-3 (277-582):** bases and alkalis (281-301), strength (302-312), physical and chemical properties (313-326), uses (327-338), EVALUATION (340-344), neutralisation and oxonium ion (346-364), EVALUATION (365-368), salts and five types (369-409), hydrolysis (410-416), uses of salts (417-427), EVALUATION (428-432), solubility-rule tables (433-448), preparation and recovery (449-476), hydrated salts and water-of-crystallisation calculation (477-525), efflorescence/deliquescence/hygroscopy and drying agents (527-550), EVALUATION (551-554), GENERAL EVALUATION/REVISION (555-561), READING ASSIGNMENT (562-564), WEEKEND ASSIGNMENT (565-573), THEORY (574-582).
- **W04 (583-735):** occurrence and allotropes (589-613), diamond properties and uses (614-629), graphite properties and uses (630-652), industrial graphite and Acheson process (653-657), diamond/graphite comparison table (658-666), EVALUATION (667-669), amorphous carbon (671-677), physical and chemical properties (678-714), EVALUATION (715-718), READING ASSIGNMENT (719-721), WEEKEND ASSIGNMENT (722-729), THEORY (730-735).
- **W05 (736-896):** carbon(IV) oxide (742-815), carbon(II) oxide (816-870), EVALUATION (810-814), EVALUATION (866-870), GENERAL EVALUATION/REVISION (871-877), READING ASSIGNMENT (878-880), WEEKEND ASSIGNMENT (881-889), THEORY (890-896).
- **W06 (897-992):** coal composition and carbonisation (903-908), types of coal (909-919), destructive distillation and products (920-937), uses of coal (938-941), EVALUATION (942-945), producer gas, water gas and synthetic gas (946-967), EVALUATION (968-972), READING ASSIGNMENT (973-975), WEEKEND ASSIGNMENT (976-987), THEORY (988-992).
- **W07 (993-1084):** H2CO3 and the two salt series (994-1001), preparation of soluble and insoluble trioxocarbonates (1002-1015), properties and the metal/heat/acid table (1016-1034), carbonate test (1035-1038), EVALUATION (1039-1042), hydrogen trioxocarbonate preparation and properties (1043-1057), EVALUATION (1058-1061), GENERAL EVALUATION/REVISION (1062-1068), READING ASSIGNMENT (1069-1071), WEEKEND ASSIGNMENT (1072-1080), THEORY (1081-1084).
- **W08-9 (1085-1262):** hydrocarbons and classification (1086-1108), petroleum origin and occurrence (1109-1114), refining by fractional distillation (1115-1124), fractions and uses (1125-1147), cracking and reforming (1149-1167), octane number with heptane/iso-octane layouts (1168-1187), grades and octane-number table (1188-1204), synthetic petrol and petrochemicals (1205-1216), problems and solutions (1217-1228), EVALUATION (1229-1233), GENERAL EVALUATION/REVISION (1234-1242), READING ASSIGNMENT (1243-1245), WEEKEND ASSIGNMENT (1246-1253), THEORY (1254-1262).
- **W10 (1263-1338):** chemical-industry definition (1269-1273), raw materials and sources (1274-1284), division of chemical industries (1285-1291), heavy and fine chemicals (1292-1298), fertilizer, paint, cement, plastic and pharmaceutical industries (1299-1318), EVALUATION (1319-1323), READING ASSIGNMENT (1324-1326), WEEKEND ASSIGNMENT (1327-1335), THEORY (1336-1338).

## Structural findings (findings only; no rule written)
- **Importer fit:** exactly eight line-start markers (`^[ \t]*week…`) exist and all are the labels above. The `WEEK_MARKER` in `backend/src/db/ingestTopics.ts` matches every one, including `WEEK<NBSP>FOUR` because JavaScript `\s` matches U+00A0. The importer will produce eight parsed week rows, not ten; no `split_before` and no `attach_stranded_label` rule is needed. Shared labels must not be split.
- **Markers:** no REVISION and no EXAMINATION marker, paper or marking scheme exists in the body. Scheme rows 11-13 have no corresponding body. The opening is a preamble, not a marker row; `classify_marker` is not needed for the body.
- **Titles:** W01-W07 carry `TOPIC:`; W08-9 has an unlabelled title line; W10 has no title line and its first credible line is the misspelt `APPPLIED CHEMISTRY`. W05's title ends with a full stop and W07's uses lower-case `(iv)`. These are recorded, not chosen.
- **Scheme vs body:** scheme row 1 promises revision of the first term but W01 teaches acids only. Row 7 promises metallic-carbonate occurrences, preparation and uses; W07 teaches the trioxocarbonate acid, its salts and tests but not those occurrences/preparations/uses. Row 10 says `Applied Chemistry`; the body says `APPPLIED CHEMISTRY`. Disposition belongs to **CHEM-MARK-T3-SCHEME**.
- **Numbering:** the extraction flattens list formatting. The scheme row numbers are typed; body lists appear as typed numbers and letters, and antiword emits only 3 `<orderedlist>` and 5 `<itemizedlist>` elements for the whole document. No numbering metadata is reconstructed here; later indexing must not assume automatic numbering.
- **Tables:** 15 table-like groups were identified: scheme 7-17; organic acids 39-45; inorganic acids 55-58; basicity 79-83; acid uses 138-151; hydroxide nature 293-300; alkali uses 328-338; solubility rules 434-447; hydrated salts 486-493; drying agents 543-548; diamond/graphite 659-664; coal distillates 933-936; carbonate heat 1026-1033; petroleum fractions 1133-1147; octane numbers 1194-1201. Twelve were emitted as `<informaltable>` by antiword; the scheme, petroleum-fraction table and octane-number table are tab text. The petroleum table is visibly misaligned (for example `2. Petrol 40 - 200 4 - 12 Fuel in aeroplanes and motor vehicles` spans lines 1138-1139) and the octane table uses blank-separated columns.
- **Images:** exactly **one** raster object exists: a 949x359 JPEG of 106,941 bytes appended after the text at WordDocument stream offset 174,161-281,102. It is a two-panel `MR OSHO TUTORS` letterhead/banner (green circular logo with books and a graduation cap, the slogan `Making the time right!`, the titles `MR OSHO` and `TUTORS`, role descriptions, and a phone number and e-mail address, withheld here as personal contact data). It is not a chemistry diagram, and neither extractor exposes its anchor or page placement. The 8,108-byte `Data` stream and the 47,052-byte `1Table` stream contain no PNG, JPEG, GIF, WMF, EMF or embedded OLE signature, so this is the only raster object in the file. W04 leaves lines 605-611 blank before the caption `Basic Tetrahedral Shape in Diamond Crystals` (612) and lines 631-636 blank after the graphite paragraph (630); both areas have no image data and are unresolved figures.
- **Special characters:** 68 U+00A0 characters in the body (including the W04 label and many tab-padding spaces) and **3 U+001E non-breaking hyphens**: line 220 after `OH` and line 287 twice (`O2<U+001E>` and `OH<U+001E>`). There are no U+2011 or U+00AD characters.
- **Hyperlinks and equations:** no URL, no `www.` string and no `HYPERLINK` field exists. Formulae, charges, powers and temperatures are flattened: for example `H2SO4 2H+ + SO42-` (66), `H2CO3 2H+ + CO32-` (72), `10-14`/`10-3` (195-246), `H2C204.2H20` (486-525), `CaC03` (1277), `35000C` (680), `-780C` (770) and `300atoms` (1153).

## Objects
- Word 97 OLE package with 6 streams: `WordDocument` 281,102 bytes, `1Table` 47,052, `Data` 8,108, `SummaryInformation`, `DocumentSummaryInformation`, `CompObj`. No embedded OLE storage.
- One JPEG (see above); no other raster reference and no external relationship storage. No hyperlink relationships.
- `docProps`: author `WPS Office`, last saved by `tosyno`, revision 43, created 2006-04-26 06:14, last saved 2019-09-03 09:49, 43 pages, 13,376 words, 76,249 characters. The footer text is `MR OSHO/3rd TERM/chemistry/sS 1<TAB><TAB>Page 43` (a `PAGE` field with cached result 43). No separate comments, footnotes or embedded objects were found.

## Observed content issues (for later items; source text not altered)
- **Safety:** strong acids described as corrosive (93) and concentrated NaOH/KOH as corrosive (317); CO preparation "must be done in a fume cupboard" and the claim that even 1% CO in air may cause death (826, 829); CO binding haemoglobin (844); phosgene described as a First World War poison (856); passing air and steam through coke above 1000°C (949-962); lead tetraethyl as an anti-knock additive (1226-1227); the pharmaceutical list including `Potassium bromine`, `bismuth carbonate`, `mercury nitrate` and `mercury (1) chloride` (1317). The document gives **no goggles/gloves/first-aid/emergency instruction**; none is added.
- **Accuracy/dated:** universal indicator said to measure "between 3 and 11" (242); carbon melting point `35000C` (680); atmospheric CO2 "about 0.03%" (743); CO2 "about 1.5 times denser than air" (767); dry ice `(-780C)` (770); CO "neither lighter nor heavier than air" (834); water-gas catalyst `4500C` (954), producer/water gas "above 10000C" (962) and synthetic gas `8000C` (965); the WEEK SEVEN question treating BaCO3 as not decomposed (1073); the temperature series `4000C`/`400C`, `500C-2000C`, `1700C-2500C`, `3000C-3600C`, `3500C-5000C`, `6000C` and `5000C` (1127-1154); cracking "about 300atoms" pressure (1153); the octane table values, especially octane `144` and `-27` and nonane `128` and `-45` (1200-1201); `HN4O3` (1275); `CaC03` (1277); and `calcium trioxocarbonate (iv) acid` / `Sodium trioxocarbonate(iv) acid` (1293-1294). Flattened superscripts (`4000C`, `-780C`) may be formatting loss rather than error.
- **Equations:** the hydrolysis set at 412-414 is not mass-balanced; limewater product written `Ca(HCO3)(aq)` (796); the formate decomposition at 845-849 is garbled; the silver-carbonate decomposition (1030) and the sodium-hydrogen-carbonate/sulfuric-acid equation (1055) need atom checks; the cracking examples (1157-1158) and the pyrolysis fragment (1224) need stoichiometric review; the neutralisation set at 345-358 includes `H3OCl` and `(H3O)2SO4`.
- **Provenance:** references are two textbooks, WAEC past questions and UTME past questions (19-23); the body has no URL or hyperlink; the branding JPEG carries a phone number and e-mail address. No in-text citation identifies copied passages, no licence or reuse permission is present, and the reference list is not proof of source clearance. Rights and personal-data handling are unresolved; citation is not reuse permission.
- **Answer keys:** EVALUATION, GENERAL EVALUATION/REVISION, WEEKEND ASSIGNMENT and THEORY items are unanswered; the only answers are the worked SOLUTION blocks. Nothing is inferred.

## Edits
- `QUEUE.json`: CHEM-INV-T3 → `IMPLEMENTED_TESTING_DEFERRED`; **21 PENDING items appended**: `CHEM-IDX-T3-OPEN`, eight week items `CHEM-IDX-T3-W01`, `W02-W03`, `W04`, `W05`, `W06`, `W07`, `W08-W09`, `W10`, `CHEM-MARK-T3-SCHEME`, three `CHEM-VIS-T3-*` items (carbon structures, organic structures, branding JPEG), four `CHEM-PRES-T3-*` items and four `CHEM-FACT-T3-*` items. Counts, `status_counts` and `next_runnable` recomputed; one note appended. Totals: **105 items**, counts `{FACTUAL_DEPENDENCY:12, SOURCE_COMPARISON:1, SOURCE_MARKER_DISPOSITION:4, SOURCE_PRESERVATION:14, SOURCE_REGISTRATION:4, SOURCE_SECTION_INDEXING:4, SOURCE_WEEK_INDEXING:37, SOURCE_WEEK_INVENTORY:4, TEST:1, VISUAL_DISPOSITION:24}`, status `{BLOCKED:1, IMPLEMENTED_TESTING_DEFERRED:8, PENDING:96}`, 71 `next_runnable` entries. IDs, dependencies and counts were checked with a JSON parse and script assertions (authoring checks, not tests).
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler, `NEXT_TASK.md` or other-subject file touched.

## Remaining
- Owner alias approval for this source (open item `CHEMISTRY-ALIAS-APPROVAL-T3`) remains outstanding.
- The source has no coverage until the indexing items run; the opening requires preamble coverage, and the W01 revision mismatch, W07 scope mismatch, shared W02-3/W08-9 labels and W10 title need recorded dispositions. No lesson titles are invented here.
- All new items are PENDING; preservation and factual items depend on the week indexing items.
- Source documents and private extracts stay out of Git, including the extracted branding JPEG and the personal contact details it contains.

Checks run: member/body hashes, range hashes, OLE stream/property inspection, JPEG extraction and dimensions, antiword table/link counts, JSON syntax, ID/dependency/reference consistency and diff inspection only. No suite, typecheck, importer, database or device test was run; testing is deferred by owner.

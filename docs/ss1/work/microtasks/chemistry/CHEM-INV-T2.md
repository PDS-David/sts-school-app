# CHEM-INV-T2 — Chemistry, 2nd Term week inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (inventory only; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: `origin/master` `68663e4` (merge of PR #312). The only open PR at start was #316 (Catering Craft); it does not touch Chemistry. No Chemistry branch or PR existed for this item.
- Prerequisite **CHEM-SRC-T2** is `IMPLEMENTED_TESTING_DEFERRED`; source `SS1-SRC-80b770d18aa8` is registered in `chemistry.json`. This item adds no package change.
- Original: member `SSS 1/2nd Term SS1_/CHEMISTRY.docx`, **1,973,278 bytes**, SHA-256 `236b1bdb2e752f652dd22e8f2df831279237e669ceeec356825cecc4ef8911e7`, hashed before reading and equal to the task and `SOURCE_ASSIGNMENTS.csv`.
- Container: the per-term "2nd Term SS1" ZIP supplied by the owner (SHA-256 `94a32a4ec4af7d492d26feecdf06cedfedf846d3c65c27a5473a1693d0d33c0a`). The member hash was verified from that ZIP; the composite archive hash (`024487…65c9a3e`) was **not** checked because the composite was not supplied.
- Method: private scratch extraction with the Python standard library (`zipfile`, `xml.etree`), image dimensions with Pillow 11.x; no mammoth module was available locally, so the block locator below is the reproducible one. Nothing from the document is committed.

## Locator rule (reproducible)
Block = direct child of `w:body` in `word/document.xml`, 0-based. Block text = concatenation of its `w:t` runs in document order (UTF-8, no normalisation; `w:tab` is omitted). Range sha256 = SHA-256 of the block texts first..last joined with `\n`, empty blocks included. The body has **2,221 children** (2,213 `p`, 7 `tbl`, 1 `sectPr`); whole body blocks 0-2220: **99,355 characters**, SHA-256 `60db0c49b150ebdab160d6d3ee7cb86629788cd1a73c58ace7f1cef831f74c72`. The last paragraph block is 2219; block 2220 is the empty `sectPr`.

## Opening / scheme (blocks 0-38, range sha256 `66ec694d3ce0c6540ea5f81478831fa2c33990b4fdb73cbf7ac90a7cc8574d6d`; scheme rows 4-15: `330d627bb1d01a8f65d8977419180d0d2dcf9de67208fa7de9ac4a9a10cbee1c`)

| Element | Block | Exact text |
|---|---|---|
| Header | 2 | `  E-NOTE FOR CHEMISTRY  SS1` (two leading spaces) |
| Scheme title | 4 | `SCHEME OF WORK FOR SECOND TERM SS1 CHEMISTRY.` |
| Column header | 6 | `WEEKS               TOPICS` |
| Scheme rows 1-3 | 7-9 | Automatic numbers 1-3 (`numId` 80, decimal `%1.`): revision of first term / introduction to mole concept; calculations in terms of Avogadro's constant, empirical and molecular formula; writing and balancing chemical equations |
| Scheme row 4&5 | 10 | `     4&5                    STATE, ILLUSTRATIONS AND VERIFICATION OF                  CHEMICAL LAWS.` |
| Scheme rows 6-10 | 11-15 | Manual numbers `6.` chemical combinations or bonding; `7.` the kinetic theory of matter; `8.` gas laws and calculations; `9.` Gay-Lussac's law; `10.` air & flame |

Nine rows cover **ten teaching weeks**. Rows 1-3 carry no visible number in the plain text because their numbering is automatic; this is a source property, not missing content. There is no REVISION or EXAMINATION row. Because the opening precedes the first week marker, the compiler will report `PREAMBLE_REQUIRES_COVERAGE`; the scheme must be mapped in coverage, never authored as a lesson.

## Week inventory

| Label (exact) | Label block | Range | Range sha256 | Non-empty chars | Non-empty blocks | Source title |
|---|---:|---|---|---:|---:|---|
| `WEEK   1` | 39 | 39-246 | `ca2bc4cb64e3ac080f9c89f84b3b9d3cb9f6ce0d160bf22878fe90a160363e24` | 6,816 | 134 | `INTRODUCTION TO MOLE CONCEPT` |
| `WEEK  2` | 247 | 247-678 | `796a9f42a80a95cce2f318b1ce3258f9f72c4dbb7389b09cc2bf0743a13991b0` | 13,122 | 317 | `MOLE IN TERMS OF THE RELATIVE ATOMIC MASS OR RELATIVE MOLECULAR MASS OF ASUBSTANCE.` |
| `WEEK  3` | 679 | 679-911 | `fd364da491339fb51013057efc6001cf214ea95300d904532e474a0a1afc46bc` | 8,323 | 168 | `Balancing Chemical Equations` |
| `WEEK  4 & 5` | 912 | 912-970 | `89e9d740beaeb627f823f4132b8b161dbeeee93c52e3c16e5657785151131f8f` | 3,709 | 39 | `STATE,ILLUSTRATION AND VERIFICATION OF CHEMICAL LAWS` |
| `WEEK  6` | 971 | 971-1238 | `782862c6180465ecb7e707745cb83bc9d04156f08bf5c245fee6798f4191fa0d` | 15,516 | 176 | `CHEMICAL BONDING` |
| `WEEK 7` | 1239 | 1239-1388 | `4dfc30b37a87d665f93f474c72b69fc46cf19ac1a5ae8dc0e95a2091595652e8` | 6,788 | 86 | `KINETIC THEORY OF GASES` |
| `WEEK  8` | 1389 | 1389-1731 | `86a9c454e0cf796b511954366f91c989ed307e2401ca41fd0e81c9ec36006b67` | 13,930 | 245 | `GAS LAWS` |
| `WEEK  9` | 1732 | 1732-2110 | `a8150aceb0198ed60316ff741491b0dcf147932553083c10c3ac2a7eba89fac6` | 12,226 | 296 | Law statement fused with the title in block 1733: `GAY LUSSAC'S LAW: It states that when gasses react, they do so in volumes …` |
| `WEEK 10` | 2111 | 2111-2219 | `1904ac56a083b1e542538a6e1757e100d4eb2f1410edadf712338b169120602a` | 15,917 | 60 | `AIR AND FLAMES` |

Section order by block (headings are source text):

- **W1 (39-246):** matter/atom/molecule/atomicity/ions (41-55), relative formula mass (57-63), relative atomic mass (65-69), mole and Avogadro's number (136-157), molar mass (158-169), the mole concept (170-210), QUESTION (211-246). No revision-of-first-term section exists despite scheme row 1.
- **W2 (247-678):** moles in terms of number (289-388), moles in terms of volume (393-490), SUMMARY (491-517), empirical and molecular formulae (518-622), percentage of element (623-640), QUESTIONS (641-678).
- **W3 (679-911):** laws lead-in (685-687), balancing conventions and method (688-737), stoichiometry/FeS2 (738-754), limiting reactant and percent yield (755-806), EVALUATION (807-911).
- **W4&5 (912-970):** conservation of mass (914-927), definite proportions (929-959) with the Zinc Oxide table at 963, QUESTIONS (960-970).
- **W6 (971-1238):** introduction/Lewis (973-981), main types (983-987), ionic formation and properties (989-1052), covalent bonds (1054-1075), hydrogen bond (1077-1086), metallic/other binding forces (1088-1157), coordinate covalent (1158-1181), QUESTIONS (1183-1238).
- **W7 (1239-1388):** kinetic assumptions (1241-1246), pressure (1248-1266), states (1267-1294), Brownian movement (1302-1317), diffusion (1319-1358), osmosis (1359-1367), EVALUATION (1369-1388).
- **W8 (1389-1731):** Boyle (1392-1470), absolute temperature (1471-1493), Charles (1494-1570), general gas equation (1571-1600), S.T.P. (1601-1615), ideal gas (1616-1656), Dalton (1653-1668), EXERCISES/solutions (1669-1705), EVALUATION (1706-1731).
- **W9 (1732-2110):** Gay-Lussac (1732-1767), Avogadro (1768-1776), relative vapour density (1777-1799), Graham (1800-1833), mole-concept applications (1834-1992), mole fraction/percent (1993-2074), QUESTION (2075-2110).
- **W10 (2111-2219):** air mixture/evidence (2113-2120), constituent determination (2121-2166), pollutants (2171-2173), FLAMES (2174-2210), Bunsen burner/types (2211-2213), QUESTIONS (2214-2219).

## Structural findings (findings only; no rule written)
- **Importer fit:** exactly nine line-start markers (`^[ \t]*week…`) exist and all are the labels above. `WEEK_MARKER` matches every one, including `WEEK  4 & 5` (its numeric branch accepts `&`), and `compiler.ts` accepts the numeric range in a rule's `week_label`. No `split_before` and no `attach_stranded_label` rule is needed.
- **Markers:** no REVISION and no EXAMINATION marker, paper or marking scheme exists anywhere. The opening is a preamble, not a marker row; `classify_marker` is not needed for the body.
- **Titles:** W9 has no standalone title, so the importer's first-credible-line rule takes the fused law sentence (truncated at 200 characters). W7's source title is "KINETIC THEORY OF GASES" while the scheme says "THE KINETIC THEORY OF MATTER". W2's title has trailing spaces and "ASUBSTANCE". These are recorded, not chosen.
- **Scheme vs body:** scheme row 1 promises revision of the first term but W1 is mole concept only. W4&5 teaches conservation of mass and definite proportions but not the law of multiple proportions, which appears only in the W3 lead-in at block 687. W9's scheme title names only Gay-Lussac while the body also teaches Avogadro, vapour density, Graham and mole-concept applications. W10 is `AIR AND FLAMES` against `AIR & FLAME`. Disposition belongs to **CHEM-MARK-T2-SCHEME**.
- **Automatic numbering:** 253 `w:numPr` paragraphs. Per week: opening 3, W1 2, W2 14, W3 104, W4&5 0, W6 41, W7 35, W8 44, W9 7, W10 3. The scheme rows 1-3 use `numId` 80; the W3 EVALUATION equations use `numId` 55 (decimal `%1.`), and block 813 additionally types "5." inside that list, so numbering can render twice. Raw text (mammoth `extractRawText` or `w:t` concatenation) drops all automatic numbers; later indexing must reconstruct them from `word/numbering.xml`.
- **Tables:** 7 top-level `w:tbl` at blocks 963 (3x3), 991 (3x3), 1000 (3x3), 1006 (3x3), 1043 (2x1), 2201 (2x1, empty) and 2212 (1x1). Table 1043's cell text is a web article headed "Covalent Bonds" but its image (`image9.gif`) is an ionic MgO/MgCl formation diagram; 2201 is an empty layout table; 2212 wraps 1,356 characters of Bunsen-burner prose with three bullet-numbered paragraphs.
- **Equations:** 11 `m:oMath` at blocks 1472, 1715, 1803, 1805, 1806, 1808 (two), 1811, 1812, 1814 and 1815. The OMML text is degraded: degree signs only at 1472/1715, `1/√∂` at 1803, `∂` at 1805, the placeholder `Type equation here.` at 1806, and bare radicals at 1811-1815. Graham's-law and vapour-density fractions are also split across blocks and drawn with straight-connector shapes. Nothing is reconstructed here.
- **Non-image drawing layer:** 114 `w:drawing` = 42 with a raster image + 69 AutoShape straight connectors/arrowheads (mostly W8-W9, where fraction bars and arrows are shapes) + 3 text boxes (`Jelly` 1343, `CuSO4 CRYSTALS` 1347, `Rubber bung` 1349). All 72 `w:pict` are VML fallbacks of those shapes, not 72 figures. The drawings at 156, 523, 529 and 592 carry no raster image.
- **Sub/superscripts:** 1,177 `w:vertAlign` runs (830 subscript, 347 superscript): W1 104, W2 217, W3 235, W6 58, W7 7, W8 259, W9 241, W10 56; W4&5 has none. Raw text flattens formulae, charges, units and powers.

## Objects
- Package: **59 parts**; 41 media parts, all distinct bytes. **42 raster references to 41 images**; `image21.png` is used twice (blocks 1169 and 1171); `image5.jpeg` is a 17x9, 377-byte spacer. By week: W1 0, W2 0, W3 5, W6 18 references (17 images), W7 8, W8 6, W9 0, W10 5. W1, W2 and W9 contain drawings but no raster image.
- Content only in images: `image11.png` (compound/structural-formula table), `image14.png` (kernel/mobile-electron table), `image15.png` (Na/Mg/Al bond-strength table), `image17.png` (metal-properties table), `image18.png` (metal-properties diagram). These are not recovered text and counts do not substitute for them.
- Hyperlinks: **52 external relationships**, only **38 `w:hyperlink` elements** in the body (14 relationships unused). By week: W3 6, W6 25, W7 4, W8 3. Domains: visionlearning 20, chemistry-assignment 13, en.wikipedia 10, crescentok 4, hyperphysics 4, sites.google 1.
- `docProps`: creator `AKINOLA`, lastModifiedBy `hp`, revision 3, created/modified 2018-01-15, 15,903 words, 90,650 characters, 1 reported page. A glossary part exists and contains only `Type equation here.` No headers/footers, comments, footnotes or embedded OLE objects.
- The 11 equations are listed above; 99 visual/equation blocks were reviewed.

## Observed content issues (for later items; source text not altered)
- **Safety:** sodium reacting violently with water and chlorine's toxicity (975); heating mercuric oxide (916, 945), copper in oxygen, copper in nitric acid and igniting cupric nitrate (940-942); Zinc Oxide in a hydrogen stream (961); white phosphorus stored under water, catching fire and smouldering (2137, 2143); burning copper/lead/magnesium/phosphorus (2130-2137); alkaline pyrogallol and benzene-1,2,3-triol (2142-2145); limewater, KOH/NaOH and solid NaOH (2150-2159); concentrated tetraoxosulphate(VI) acid (2161); asbestos paper held across a flame (2202); Bunsen strike-back and poisonous gases (2202, 2212). The document gives **no goggles/gloves/first-aid/emergency instruction**; none is added.
- **Accuracy/dated:** absolute zero described as `0C or 273K` at 1472 against the correct conversion at 1475; limewater milkiness attributed to soluble `Ca(HCO3)2` at 2153 against `CaCO3` at 2150-2151; the hydrate equations at 2158-2159; `2CO2 (g) + O2 (g)2CO2 (g)` at 1743; `2H2O + O2 → 2H2O` at 1058; CO2 "constant at 0.03%" at 2149; the Zinc Oxide sample ratios at 963 (81.1% vs 82.2% Zn); the empirical-formula masses at 542-544 (14.4% vs stated 12.8%); the Graham symbols and placeholder (1803-1815); `Charles Law - V α Ti` at 1574; `Avogadro2mols 1molecules 2molecules` at 1775; the Bunsen claims at 2212.
- **Provenance:** the 52 hyperlink relationships, paste-sourced web text in table 1043, image-encoded tables, and 2018 metadata. Rights are unresolved; citation is not reuse permission.
- **Answer keys:** all QUESTIONS/EVALUATION items are unanswered; the only answers are the worked SOLUTION blocks. Nothing is inferred.

## Edits
- `QUEUE.json`: CHEM-INV-T2 → `IMPLEMENTED_TESTING_DEFERRED`; **26 PENDING items appended**: `CHEM-IDX-T2-OPEN`, nine week items `CHEM-IDX-T2-W01`…`W03`, `W04-W05`, `W06`…`W10`, `CHEM-MARK-T2-SCHEME`, seven `CHEM-VIS-T2-*` items, five `CHEM-PRES-T2-*` items and three `CHEM-FACT-T2-*` items. Counts, `status_counts` and `next_runnable` recomputed; one note appended. IDs, dependencies and counts were checked with a JSON parse and a script assertion (authoring checks, not tests).
- This file. No package, lesson, coverage, rule, correction, asset, shared schema/compiler, `NEXT_TASK.md` or other-subject file touched.

## Remaining
- Owner alias approval for this source (open item `CHEMISTRY-ALIAS-APPROVAL-T2`) remains outstanding.
- The source has no coverage until the indexing items run; the opening requires preamble coverage, and the W9 title, W4&5 scope and W10 title need recorded dispositions (no lesson titles are invented here).
- All new items are PENDING; preservation and factual items depend on the week indexing items.
- Source documents and private extracts stay out of Git.

Checks run: member/range hashes, package/part inventory, XML counts, image dimensions, JSON syntax, ID/dependency/reference consistency and diff inspection only. Testing deferred by owner.

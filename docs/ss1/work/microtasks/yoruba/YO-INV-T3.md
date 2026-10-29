# YO-INV-T3 — Yoruba, 3rd Term document inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `4159336c7068d2235209221f5f14adc4986acec5`, fetched 2026-10-29; it is this stack's merge base. YO-INV-T1 (PR #193) and YO-INV-T2 (PR #194) are still unmerged, so this item is stacked on `ss1/yo-inv-t2-20261029` (commit `8554237`) to keep the single `QUEUE.json` edit conflict-free; T1's and T2's queue edits are carried unchanged.
- Prerequisite `YO-SRC-T3` is `IMPLEMENTED_TESTING_DEFERRED` on master. No open PR owned YO-INV-T3 when work started.
- Source `SS1-SRC-4cc6aae9ed7d`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`.
- Member SHA-256 `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3` **re-verified this run** (68,373 bytes, read from the archive itself); archive `SSS 1-20260507T072431Z-3-001 (1).zip` hashed this run, 35,828,550 bytes, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, matching the prompt.
- Method (private, outside Git): a separate copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call): 63,445 characters, 2,463 lines. `word/document.xml`, `header1.xml`, `footer1.xml` and `footer2.xml` inspected. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, compiler and parser were not run.

## Week structure
The front matter has a title line, the heading `ILANA ISE OSOOSE FUN SAA KETA` (line 3) and a **flat scheme**: line 5 is only `Ose: ` with no numerals, followed by **ten unlabelled `EDE:`/`ASA:`/`LIT:` triples plus one revision pair** (lines 7–83). The teaching body has **ten** sections, one `OSE ...` heading each, and every one of weeks 1–10 has its own section. The revision pair (lines 81–83) has **no teaching body**; there is no examination row. No week holds more than one teaching section. The scheme rows are paragraphs, not a Word table.

### Scheme groups (lines 5–83)
Continuation lines are joined with a space in the table; the hash covers the exact lines. `\t` marks a tab.

| Week | Scheme content (EDE / ASA / LIT, verbatim) | Lines | SHA-256 |
|---|---|---|---|
| 1 | `EDE:\tIsori oro;Oro Oruko: Oriki, Orisii Oruko, Ise Oro-Oruko ninu Gbolohun` / `ASA:\tAsa- Asa Isomoloruko: Amutorunwa, abiso, inagije abbl.` / `LIT:\tItupale ewi apileko. Amuye ewi, koko ewi abbl.` | 7–11 | `62d8c558c9d8d7d25842a84a51e4c20d27b5e3922b26c39a310fb62ce891aa8e` |
| 2 | `EDE:\tOro Aropo-Oruko` / `ASA:\tIpolowo Oja: iwulo ati pataki, orisii ona ti a n gba polowo oja.` / `LIT:\tItupale iwe asayan ti ijoba yan. WAEC/NECO.` | 13–17 | `12b984e154f5bab69dc520e5c609e3606ce32be1a4a9e437068aead476c6bc60` |
| 3 | `EDE:\tOro-Ise: Agbabo, Alaigbabo, elela, Alailela.` / `ASA:\tEre Idaraya: Ere Osupa, aojoojumo, Ita gbangba, abele.` / `LIT:\tItupale iwe asayan ti ijoba yan. WAEC/NECO.` | 19–23 | `cc19fa12f31f31016663e2b334bfd926f6372c81b4d7c13e968c299a6d87ea48` |
| 4 | `EDE:\tOnka; Egbaa titi de egbaa-run-un(2,000-10,000)-Ilana onkaye lati egbaa-egbaa-run.` / `ASA:\tEre Omode, Odo, Giripa ati agba. Ofin to de ere kookan, ohun elo ere kookan ati anfaani ere kookan` / `LIT: \tItupale iwe asayan ti ijoba yan. WAEC/NECO.` | 25–33 | `492122e7e9364f09531ddd3db93cbac832506d6c43a8e9d7db0215edba8ba501` |
| 5 | `EDE:\tAroko Ajemo Isipaya` / `ASA:\tEre idaraya-;Ere igbalode. Ayipada ti o ti de ba ere idaraya abinibi` / `LIT:\tItupale iwe asayan ti ijoba yan. WAEC/NECO.` | 35–39 | `50c7df0b38e40a9016b0a6508d7587ad6db802a9767bdf8edba8cbdb3bb3442b` |
| 6 | `EDE:\tisori Oro: Oro-Aropo Afarajoruko, Oro Apejuwe. Lilo won ni gbolohun.` / `ASA:\tOwo Yiya: Ohun ti o le sun eniyan de ibi owo yia, ona ti a n gba ya owo, ipa ti onigbowo n ko ninu eto iyawo, anfaani ati aleebu owo yiya.` / `LIT:\tEwi Alohun gege bi orison ironu Yoruba: Ese Ifa, Alo Apagbe.` | 41–51 | `2b25d4918221876232c76035fb4c089525bd48c4195f5567c0c6aa1e6f52807c` |
| 7 | `EDE:\tItupale gbolohun oniponna: oriki, Dida gbolohun oniponna mo,` / `ASA:\tOna ti a n gba gba gbese – osomaalo,elemun-un. Ipa ti awon elesin ati ijoye n ko ninu gbigba gbese.` / `LIT:\tEwi Alohun gege bi orison ironu Yoruba: Ofo, Ogede, Itan riro` | 53–59 | `bc4ea6d4912b5e8e8835e851182c143dc8b67dfcc12bdb6a444b4cbe32ef9676` |
| 8 | `EDE:\tAroko asariyanjiyan: Ilana kiko aroko asariyanjiyan, Awon ori-oro ti o je mo aroko asariiyanjiyan, ijiroro lori ori-oro ti o je mo aroko asariiyanjiyan, kiko ilapa ero` / `ASA:\tAsa Isinku ni Ile Yoruba: Orisiirisii ona ti a n gba sin oku, oku omode, oku agba, itufo, itoju oku ati sisin oku agba sinu ile` / `LIT:\tEwi Alohun alohun ti o je mo asa isinku, oku pipe, ijala, rara, Olele, Ege, Iremoje.` | 61–67 | `33511c69113dda8efe27fc0fcae84dae663a74c7258cc7e19689af787454b9f5` |
| 9 | `EDE:\tAkaye oloro geere –kika ayoka ni akaye, didahun ibeere ti o wa labe   \tayoka. Awon oro ti o takoko ninu ayoka.` / `ASA:\tAsa isinku ni ileYoruba: Isinku oba, isinku abami eniyan.` / `LIT:\tAkojopo awon owe ti o jeyo lati inu iwe Asayan ewi ti ajo WAEC/NECO` | 69–73 | `a15ef24840b5fdfd282028fa7f03210b94a9a475c53a98fe406811d2b98de9f7` |
| 10 | `EDE:\tAroko; Leta kiko-Gbefe, ilana fun leta gbefe` / `ASA:\tOku sise, sise oro oku.` / `LIT:\tItupale iwe asayan ti ijoba yan. WAEC/NECO.` | 75–79 | `7f35470f95d25014ad35320f48879f0be4db9c3e0a380f3b7a5ea3e0bf78eb08` |
| 11 | `EDE:\tAtunyewo eko lori ise saa yii ninu ede, asa, ati litireso.` / `  \tAtunyewo  idanwo lori ise odun yii ninu ede, asa ati litirso.` (unlabelled second line; revision/test) | 81–83 | `a8579d59815b77e42e64ccf1a8134d8ba38ca3a2620e47a3df08c1224f3934c3` |

The scheme heading plus rows is lines 3–83, 2,396 characters, SHA-256 `e01907be4a3a91ab933ac6a10b39b9a21f93e2cb43cb979686e5540f4e87736e`; the front matter including the title line and the `IWE ITOKASI` list is lines 1–113, SHA-256 `d2054cef3116d98e5bfc049a5a407b1f81dd2c7c4876ba5b0b263ffbbbcbc165`.

### Teaching sections
| Week | Verbatim teaching label | Label line (char offset) | Section lines | SHA-256 |
|---|---|---|---|---|
| 1 | `OSE KINNI` | 121 (2970) | 121–426 | `b9d0b35a3b6075c9c1565b6bdda3c263fa85324eaa443f99f18fe9253afd21f3` |
| 2 | `OSE KEJI` | 427 (10299) | 427–678 | `4e9c5de3a0d9b20e958f97b3178a968e84002c7b7a8b6025c6e1b810bb657083` |
| 3 | `OSE KETA` | 679 (13249) | 679–962 | `ac42a651d7eec9ae181071b7b7b9141417cee0637953e9ebe1d34fc040a44df5` |
| 4 | `OSE KERIN` | 963 (18309) | 963–1280 | `c2b144f4d427ad8c6b8ad30b4d6495ee231821698cd76bf9b5d9cd4cc0e51171` |
| 5 | `OSE KARUN-UN` | 1281 (23941) | 1281–1356 | `b35e84fdb051d5e6bbe0af565db59832c6a94a2b12e8548b78d5b3f6ae0adbbc` |
| 6 | `\t\t\tOSE KEFA` | 1357 (25543) | 1357–1624 | `ada0ea7aa1907d40f3086dce147264b9f8ead9bba7d38803409f4afdbe89ddd7` |
| 7 | `OSE KEJE` | 1625 (32065) | 1625–1878 | `f16c3f349bea61c867441a3073c63eb114a2e905a7680c4361e4a72155ae2368` |
| 8 | `OSE KEJO` | 1879 (38186) | 1879–2160 | `ab8f624ff32e4d054d2b7ff7e4dd8fbbfecc38d0bef950c4ec5602f2d6c448fc` |
| 9 | `OSE KESAN-AN` | 2161 (46059) | 2161–2312 | `f26fc75fd0e48893b4579f2fb6ae3f46e2b68a3e82618fd03c56eede41b240e4` |
| 10 | `OSE KEWAA` | 2313 (57919) | 2313–2463 (end) | `d84c4fe40486f5776e87c9f0644f7ef82bd428748f65523c35bb1061c991f224` |
| 11 | — (revision pair only) | — | — | — |

Every teaching label occurs exactly once in the extraction. Only the week-6 label carries leading tabs, so a trimmed anchor is still unique here, unlike the 2nd Term document.

## What each section teaches
Line numbers below are the part headings; the section hash above covers all of them.

| Week | EDE | ASA | LITIRESO | Assignments |
|---|---|---|---|---|
| 1 | 125 `ORO-ORUKO` (oriki, orisiirisii, ise, lilo) 135–213 | 223 `ORISII ORUKO TI A LE SO OMO NILE YORUBA` (amutorunwa, abiku, inagije, abiso) 227–345 | 363 `ITUPALE EWI APILEKO` (awitunwi, asorege/asodun, owe, akanlo ede, iforodara) 365–385 | IGBELEWON 349/389, APAPO 395–401, ISE AMURELE 407–417, APA KEJI 419–423; IWE 217–219/357–359 |
| 2 | 429 `ORO AROPO ORUKO` (abuda, ate, irisi, ipo oluwa/abo/eyan) 439–591 | 603 `IPOLOWO OJA` 605–607 | 617 `SISE ATUPALE EWI KEJI NINU IWE TI IJOBA YAN` (Iya Atata reference only) | IGBELEWON 595–599, APAPO 627–635, ISE AMURELE 639–649, APA KEJI 651–661; IWE 611–613 |
| 3 | 681 `ORO ISE` (agbabo, asebeere, asokunfa, elela, akanmoruko, asapejuwe, asoluwadabo, alapepada, asinpo) 691–849 | 869 `ERE IDARAYA` (Osupa, ojoojumo, ita gbangba, abele; no ASA heading) 871–893 | 913 `LITIRESO APILEKO`, `KIKA IWE APILEKO ORI KETA ATI EKERIN` (Iya Atata reference only) | IGBELEWON 853–857/897–903/921–923, APAPO 927–935, ISE ASETILEWA 943–953, APA KEJI 955–959; IWE 863–867/907–909 |
| 4 | 967 `ONKA YORUBA` (onkaye/onkapo, 1–2000; no EDE heading) 969–1161 | 1171 `ERE OMODE`, `ERE GIRIPA/AGBA`, ofin, anfaani/ewu 1175–1207 | 1225 `LITIRESO APILEKO`, `KIKA IWE APILEKO ORI KETA ATI EKERIN` (Iya Atata reference only) | IGBELEWON 1159–1161/1213–1215/1241–1243, APAPO 1247–1251, ISE AMURELE 1255–1265, APA KEJI 1269–1277; IWE 1165–1169/1219–1221 |
| 5 | 1285 `AROKO AJEMO ISIPAYA` 1287–1301 | 1313 `ERE IDARAYA IGBALODE` 1315–1317 | absent | IGBELEWON 1303, APAPO 1327–1331, ISE AMURELE 1335–1345, APA KEJI 1349–1353; IWE ITOKASI 1307–1309, IWE AKATILEWA 1321–1323 |
| 6 | 1359 `ORO AROPO AFARAJORUKO` 1367–1439 | 1451 `OWO YIYA` 1455–1521 | 1523 `EWI ALOHUN GEGE BI ORISUN IRONU`; `AALO APAGBE` 1529 | IGBELEWON 1441/1513/1565, APAPO 1575–1581, ISE AMURELE 1595–1611, APA KEJI 1613–1622; IWE 1447–1449, IWE KIKA 1585–1589 |
| 7 | 1629 `GBOLOHUN ONIPONNA` / 1631 `ITUPALE GBOLOHUN ONIPONNA.` (no EDE heading) 1637–1691 | 1717 `ONA TI A N GBA GBA GBESE NI AYE ATIJO` (osomaalo, elemun-un) 1719–1761 | 1783 `EWI ALOHUN GEGE BI ORISUN AGBARA ATI IMO IJINLE YORUBA` (ofo, ogede) 1785–1847 | IGBELEWON 1693–1709/1755, APAPO 1763–1781/1839, ISE AMURELE 1849–1869, Apa keji 1871–1875; IWE ITOKASI 1711–1713 |
| 8 | 1881 `AROKO ASARIYANJIYAN` 1883–1940 | 1955 `ASA ISINKU NI ILE YORUBA` 1957–2021 | 2029 `EWI ALOHUN TO JE MO ASA ISINKU` 2031–2095 | IGBELEWON 1941–1947/2023–2027/2097–2101, APAPO 2109–2139, APA KEJI 2141–2159; IWE 1949–1951/2103–2105 |
| 9 | `AKAYE 1` 2163–2179 and `AKAYE 2` 2181–2209 (comprehension passages with questions; no EDE heading) | 2211 `ASA ISINKU NI ILE YORUBA` (isinku oba ati abami) 2213–2245 | 2249 `KIKA IWE TI IJOBA YAN`; `AKAYE KIN-IN-NI` 2259–2277, `AKAYE KEJI` 2281–2305 | Apa keji 2307–2311; IWE KIKA 2253–2255 |
| 10 | 2315 `LETA GBEFE KIKO` 2317–2355 | 2365 `OKU SISE` 2367–2389, then the same content again 2393–2419 (heading repeated at 2395/2397) | absent | IGBELEWON 2423–2425, ISE ASETILEWA 2427–2447, Apa keji 2451–2457; IWE 2359–2361 |

- Scheme and body align one-to-one for weeks 1–10. Week 11 is a revision/test pair with no body; no week holds more than one teaching section.
- The scheme has no week numbers or labels: line 5 is only `Ose: `, and the eleven groups are identified only by position and their repeated `EDE:`/`ASA:`/`LIT:` prefixes.
- Weeks 5 and 10 name `Itupale iwe asayan ti ijoba yan` in the scheme but have no LITIRESO part. Weeks 2–4 have a LIT pointer only (a title and a reference, no taught content).
- Week 9's scheme LIT names a collection of proverbs from the WAEC/NECO poetry text, but the section's LITIRESO part is two comprehension passages (`KIKA IWE TI IJOBA YAN`, `AKAYE KIN-IN-NI`, `AKAYE KEJI`) with questions; the proverb collection is not separately taught.
- Week 10 repeats the ASA `OKU SISE` content: paragraphs 2373–2389 appear verbatim again at 2403–2419, and the heading itself is repeated (`OKU SISE` at 2367 and at 2397, with a blank line at 2395).
- Part labels are inconsistent: week 3 has no `ASA` heading before `ERE IDARAYA`; week 4 has no `EDE` heading; week 7 has no `EDE` heading, duplicates its topic (`GBOLOHUN ONIPONNA` 1629, `ITUPALE GBOLOHUN ONIPONNA.` 1631) and uses `IWE ITOKASI:` (1711) instead of `IWE AKATILEWA`; week 9 has no `EDE` heading (it starts with `AKAYE 1`).
- `Iya Atata` is the only title from that list cited in the body (weeks 2–4 LIT).

## Preamble and metadata
- Title line 1: `ISE-:EDE YORUBA` + four tabs + 31 spaces + `CLASS: SS1`; 60 characters, SHA-256 `cd75f590d1060a7b6cefbd92ba58e0bf42064f11a9439b9f0db209a4a1d87504`. It equals the registered `header_text` of `SS1-SRC-4cc6aae9ed7d`.
- Scheme heading line 3 (`ILANA ISE OSOOSE FUN SAA KETA`), `Ose: ` line 5 with no numerals, and the eleven groups lines 7–83; lines 3–83 are 2,396 characters, SHA-256 `e01907be…4e87736e`. The rows are paragraphs with tabs, not a Word table.
- `IWE ITOKASI`, lines 91–113: 11 reference titles, 478 characters, SHA-256 `c5da812e2f7d9fc5ced97d036b8496498a1f43d771bf3a52756746e9aaa728aa`. It is a bibliography, not teaching content.
- `word/header1.xml` carries a NAME/CLASS fill-in line and `word/footer2.xml` carries `1GSCHS/3RD TERM/YOR/SS1`; neither is in `extractRawText` and neither is teaching content. `word/footer1.xml` has no text. No separate item is raised for them.

## Embedded objects, markers and diacritics
- **No embedded objects.** In `word/document.xml`: 0 tables (`w:tbl`, `w:tr`), drawings (`w:drawing`, `w:pict`, `v:shape`), pictures (`a:blip`, `v:imagedata`), OLE objects (`w:object`, `o:OLEObject`), equations (`m:oMath`), text boxes (`w:txbxContent`), floating/inline shapes (`wp:inline`, `wp:anchor`), hyperlinks, fields, footnotes or endnotes; no `word/media` part; one section break (`w:sectPr`). Nothing needs visual inspection, so no VISUAL_DISPOSITION item is appended.
- **Automatic list numbering is lost in extraction.** 198 paragraphs carry `w:numPr`; `extractRawText` emits their text without the generated bullet or number (for example the scheme triples at lines 7–79 and the exercise lists). Literal numbers typed into the text are preserved. The tab-aligned scheme and tabular lists use 922 `w:tab` runs, and tabs survive in the extracted text.
- **The document contains no Yoruba diacritics at all.** No tone-marked or sub-dot letters, no combining marks and no soft hyphen occur in the extraction, and `YO-SRC-T3` independently records the same for the source. The only non-ASCII characters are punctuation: `’` 33, `–` 28, `‘` 23, `…` 9, `“` 2, `”` 1. Because the source is entirely unmarked, no diacritic-fidelity test is possible from this document and none was performed; all Yoruba words here are written without tone marks or sub-dots.

## Queue changes
- YO-INV-T3 → `IMPLEMENTED_TESTING_DEFERRED`; 14 items appended, every one depending on `YO-SRC-T3`:
  - `YO-WK-T3-W01` … `YO-WK-T3-W10` (SOURCE_WEEK_INDEXING), one per teaching week; each binds the section tabled above.
  - `YO-WK-T3-W11` (SOURCE_WEEK_INDEXING) for the revision/test pair lines 81–83; it has no teaching body and there is no separate examination row.
  - `YO-PRE-T3-1` (SOURCE_PREAMBLE_INDEXING) for the title line and the flat eleven-group scheme, lines 1–83.
  - `YO-PRE-T3-2` (SOURCE_PREAMBLE_INDEXING) for the `IWE ITOKASI` list, lines 91–113.
  - `YO-FND-T3-01` (FOUNDATION_REQUEST) for the unnumbered flat scheme, the repeated `EDE:`/`ASA:`/`LIT:` prefixes and the scheme-only revision marker.
  - No VISUAL_DISPOSITION item: no embedded object exists.
- All 14 IDs added to `YO-SCOPE-OBJECTIVE-INDEXING.depends_on` (30 → 44). Counts: SOURCE_WEEK_INDEXING 20 → 31, SOURCE_PREAMBLE_INDEXING 2 → 4, FOUNDATION_REQUEST 2 → 3; items 35 → 49, status counts 6 implemented / 43 pending. `next_runnable` → `YO-WK-T1-W01`, the first eligible pending item (the umbrella and the test package remain blocked on the 44 index items). `yoruba.json` was not edited.

## Limits
- Inventory only: no objective was indexed, no lesson authored, no package edit, no schema or compiler edit, no importer/compiler run. Nothing was rendered; no visual inspection was needed because the document contains no object.
- Unresolved by design: whether week 9's comprehension passages are intended to satisfy the scheme's `akaye oloro geere` and proverb-collection objectives; whether week 10's duplicated ASA block is duplication or intended revision material; and whether the missing LITIRESO bodies in weeks 5 and 10 are supplied by a separate literature text. All are stated in the week items, not resolved here.
- Not approved and not verified. Testing deferred by owner.

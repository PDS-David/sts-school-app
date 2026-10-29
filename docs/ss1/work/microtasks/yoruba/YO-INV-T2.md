# YO-INV-T2 — Yoruba, 2nd Term document inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner.

## Inputs
- Base: origin/master `4159336c7068d2235209221f5f14adc4986acec5`, fetched 2026-10-29; it is this branch's merge base. YO-INV-T1 is still unmerged in PR #193, so this item is stacked on `ss1/yo-inv-t1-20261029` (commit `822fe56`) to keep the single `QUEUE.json` edit conflict-free; T1's queue edits are carried unchanged.
- Prerequisite `YO-SRC-T2` is `IMPLEMENTED_TESTING_DEFERRED` on master. No open PR owned YO-INV-T2 when work started.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`.
- Member SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run** (66,197 bytes) from the supplied archive; archive `SSS 1-20260507T072431Z-3-001 (1).zip` hashed this run, 35,828,550 bytes, SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`, matching the prompt.
- Method (private, outside Git): member extracted unchanged and hashed; a separate copy read with `mammoth` 1.12.2 `extractRawText({path})` (the importer's .docx call): 53,525 characters, 2,433 lines. `word/document.xml`, `header1.xml`, `footer1.xml` and `footer2.xml` inspected. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, compiler and parser were not run.

## Week structure
The front matter is a 12-row scheme (`ILANA ISE OSOOSE FUN SAA KEJI`, line 7). The teaching body has **nine** sections, one `OSE ...` heading each, with EDE/ASA/LITIRESO parts inside. There is no `OSE KEJO` (week 8) section and no revision or examination section: scheme rows 8, 11 and 12 have **no teaching body**. No week holds more than one teaching section. The scheme rows are paragraphs, not a Word table.

### Scheme table (lines 9–141)
| Week | Verbatim scheme label | Lines | SHA-256 |
|---|---|---|---|
| 1 | `Ose  kinni- Ede-Atunyewo awon isori oro` | 9–25 | `1d57865591bfc8d86e0690f5806f73279f4f89dc8ee1f64c979a0d278ddc3d51` |
| 2 | `Ose keji  Ede- Awon isori gbolohun gege bi ihun won.` | 27–35 | `b53285363baae5728ce43137e19f236e58d9c264234c8cb54fdaee1319d33650` |
| 3 | ` Ose keta    Ede- Awon isori gbolohun gege bi ise won.` | 37–43 | `2d55c9d18854ce5458f51a5afc2542918b006d82b6e7426a78e2f72f6f7208fb` |
| 4 | `Ose kerin Ede- Aroko  Asapejuwe;ilana kiko aroko` | 45–55 | `21818e1ffba31b71926e8292140cacf0315b00187358446a68feea8297baf6d2` |
| 5 | ` Ose karun-un  Ede- Aayan Ogbufo; ilana sise aayan ogbufo.` | 57–67 | `55c53e211535fa77ed6c031487d304be3141521cf8e093de9408c34abd5f659a` |
| 6 | `Ose kefa Ede – Aayan Ogbufo; sise ogbufo ayoka ede Geesi si ede Yoruba.` | 69–79 | `2de02ce7721cc33f01b7ade59a9be44cce27128c7302d955b7c284e4688f2810` |
| 7 | `ose keje- Ede- Onka  Yoruba;onkaye lati ori  ookan titi de Egbaa (1- 2000)` | 81–91 | `90af69d72b37b7347417348791b180ad3d5b37aab457eefc80e2ea0d077a0d88` |
| 8 | `Ose kejo- Ede- Atunyewo eko lori eka ede Yoruba; Ijesa, Ekiti,Oyo.abbl.` | 93–105 | `5e8dee089a86032a35e024eaaf1bffb5a95dafd66ad0971eeca5e0a64e825d37` |
| 9 | `Ose kesan-an` | 107–123 | `d6f35818a8c31544d32b7324e5e17c62e5c2ab03c70b71b42b11fb7b0dda6027` |
| 10 | `Ose  kewaa-  Ede- Isori oro-oruko` | 125–137 | `6f81346dd5b5fb196cf342cad485c8e10474df2337d60cbb53ae713b8716fb8f` |
| 11 | `Ose kokanla- Agbeyewo ise saa keji lapapo..` (revision) | 139 | `c8639358723f993c5605c822e3392ca3a6f4a772825dfa509886c158d9f31027` |
| 12 | `Ose kejila-  Idanwo saa keji.` (examination) | 141 | `aa097f81f0441460a3fe8b00396ccc6ca1cd78fa38dcf732732079b423f43f3d` |

The scheme heading plus rows 1–12 is lines 7–141, 2,591 characters, SHA-256 `1239d3fde57b34ddf1e8a401d21bb709e3ede3f669daefe4f8e0845b52d95cc7`; the front matter including the title block (lines 3–5) is lines 3–141, SHA-256 `044ca198991b51d73a9afe62b4d402e5a855210bdd0cd60dc02a4d92c82a1cbc`.

### Teaching sections
| Week | Verbatim teaching label | Label line (char offset) | Section lines | SHA-256 |
|---|---|---|---|---|
| 1 | `\t\t\tOSE KINNI` | 149 (2660) | 149–854 | `53462d0b7dc26f243193177332b13216518a3aa3ad4949fa10cb3454169a1190` |
| 2 | `OSE KEJI` | 855 (13236) | 855–1074 | `95fd2ac951255d2721b66c9c3017933c6ad7cb7f9b8a25ee576f1bf059f0d61a` |
| 3 | ` OSE KETA ` | 1075 (17392) | 1075–1302 | `d209b73a0145a6f038ce24c5dde16416f0908ff92c963d9ab017ec990be4f206` |
| 4 | `OSE KERIN` | 1303 (21383) | 1303–1450 | `2db6479730bcda31005348909fae7b943526f50a818b0b25df5ad9591b6d076a` |
| 5 | `\t\tOSE  KARUN-UN` | 1451 (26528) | 1451–1610 | `3514d24ba56cf7c4997e9014a23f984c3c4acb462c5b3fec7cc79302f9bce41a` |
| 6 | `\t\t\t\tOSE KEFA` | 1611 (30167) | 1611–1682 | `756396228f6d585c2a83b3a571212f34241c41a58bd149bd2199564d3528e789` |
| 7 | `\tOSE  KEJE` | 1683 (32669) | 1683–2016 | `e4dcfd052a675c0e1795a5944b1dbb8fb6d905a014276722f459f4772edc5625` |
| 8 | — (no section; scheme row 8 only) | — | — | — |
| 9 | `OSE KESAN-AN` | 2017 (44273) | 2017–2220 | `3e932ecb11eccf939fc6ce930c950547a896cdac5dc7959903fb24632d9d48d9` |
| 10 | `OSE KEWAA` | 2221 (48527) | 2221–2433 (end) | `4f053c8c065a7260053db902b189ad6ce0c0a1a6a8e165cecd2054fcd44e0bd5` |
| 11 | — (revision row only) | — | — | — |
| 12 | — (examination row only) | — | — | — |

Three teaching labels carry leading tabs, the week-3 label also has a trailing space, and scheme row 12 ends with two tabs, so a trimmed anchor alone is not unique or faithful for those lines.

## What each section teaches
Line numbers below are the part headings; the section hash above covers all of them.

| Week | EDE | ASA | LITIRESO | Assignments |
|---|---|---|---|---|
| 1 | 151 oro aropo oruko, afarajoruko, atokun, asopo, oro-ise, aponle, apejuwe | absent; `oge sise` appears only inside evaluation questions (e.g. 797) | 405–407 pointer `Kika iwe litireso` only | IWE AKATILEWA 805, Apa keji 843 |
| 2 | 859 isori gbolohun by structure | 943/945 aso wiwo | absent | 1029, APA KEJI 1055 |
| 3 | 1077 isori gbolohun by function | 1201/1203 ila kiko | absent | 1259, APA KEJI 1285 |
| 4 | 1305 aroko alapejuwe | 1333/1335 asa igbeyawo | absent | APA KEJI 1435; no reading assignment |
| 5 | 1453 aayan ogbufo | 1547 orisii igbeyawo | absent | 1571, APA KEJI 1599 |
| 6 | 1613 sise ayoka Geesi si Yoruba | 1617/1619 igbeyawo ode-oni | absent | 1649; part-two heading mangled at 1669 (`kEJI`) |
| 7 | 1685 onka Yoruba | 1877 oyun, ibimo, abiku | 1927–1969 atenudenu and sin oku | IGBELEWON 1971, ISE ASETILEWA 1977, APA KEJI 1999 |
| 8 | none in the body | no week-8 section; week 9's `orisiirisii oruko` body (2047–2189) teaches name types and examples only | none | none |
| 9 | 2019 aroko oniroyin | 2047/2049 orisii oruko | absent (scheme's aalo not taught) | 2191, APA KEJI 2215 |
| 10 | 2223 isori oro-oruko | 2323/2325 ipolowo oja | absent (scheme's ewi alohun not taught) | 2391, APA KEJI 2417 |

- `Itupale asayan iwe litireso` is named on scheme rows 1–6 and 8 but has no body anywhere; week 1 carries only the instruction pointer at 405–407.
- Week 8 has no body at all: its Ede dialect-review objective (Ijesa/Ekiti/Oyo) occurs only on scheme line 93, and its Asa objectives are covered only in part by week 9's name-type body.
- Week 9 and week 10 scheme Litireso objectives (aalo; ewi alohun) have no matching body part.

## Preamble and metadata
- Title block, lines 3–5: `SECOND TERM E-NOTE` (3), `SUBJECT; YORUBA.` + six tabs + `CLASS-; SS1` (5); 54 characters, SHA-256 `12c4f4d35d0f0e7c1e22491d7d2985a8eaa763039fed3ecd60fa7b83111e51fe`. The subject line equals the registered `header_text` of `SS1-SRC-ec4a5095420d`.
- Scheme of work, lines 7–141, SHA-256 `1239d3fd…d95cc7` (2,591 characters), as tabled above.
- `word/header1.xml` carries a NAME/CLASS fill-in line and `word/footer2.xml` carries `1|WKLA|S/2ND| TERM/|YORUBA/S.S. 1`; neither is in `extractRawText` and neither is teaching content. `word/footer1.xml` has no text. No separate item is raised for them.

## Embedded objects, markers and diacritics
- **No embedded objects.** In `word/document.xml`: 0 tables (`w:tbl`, `w:tr`), drawings (`w:drawing`, `w:pict`, `v:shape`), pictures (`a:blip`, `v:imagedata`), OLE objects (`w:object`, `o:OLEObject`), equations (`m:oMath`), text boxes (`w:txbxContent`), floating/inline shapes (`wp:inline`, `wp:anchor`), hyperlinks, fields, footnotes or endnotes; no `word/media` part; one section break (`w:sectPr`). Nothing needs visual inspection, so no VISUAL_DISPOSITION item is appended.
- **Automatic list numbering is lost in extraction.** 94 paragraphs carry `w:numPr`; `extractRawText` emits their text without the generated bullet or number (for example the week-1 scheme list at lines 11–21). Literal numbers typed into the text (exercises, `Apa keji`) are preserved. The tab-aligned scheme and `Ate` lists use 981 `w:tab` runs, and tabs survive in the extracted text.
- **Diacritics survive extraction.** 133 precomposed Latin letters with diacritics appear in the extraction, identical to the `w:t` runs (123 in U+00C0–U+024F, plus ọ and ẹ in U+1E00–U+1EFF): ó 48, ù 22, í 16, ú 7, é 6, è 6, ì 6, ẹ 6, à 5, ọ 4, ń 2, á 2, Ì 1, À 1, È 1. There are no combining marks and no normalization was applied, but most Yoruba words are written without tone marks or sub-dots — only these 133 characters carry them. One U+00AD soft hyphen (line 1053) appears in the extraction and not in the `w:t` runs, as already recorded by YO-SRC-T2. Curly quotes (95), en dashes (34) and ellipses (6) also survive unchanged.

## Queue changes
- YO-INV-T2 → `IMPLEMENTED_TESTING_DEFERRED`; 14 items appended, every one depending on `YO-SRC-T2`:
  - `YO-WK-T2-W01` … `YO-WK-T2-W12` (SOURCE_WEEK_INDEXING), one per scheme week. W01–W07, W09 and W10 bind the teaching section above; W08, W11 and W12 are scheme-row-only and say so.
  - `YO-PRE-T2-1` (SOURCE_PREAMBLE_INDEXING) for the title block and the 12-row scheme, lines 3–141.
  - `YO-FND-T2-01` (FOUNDATION_REQUEST) for the label/scheme structure the current schema and parser cannot express.
  - No VISUAL_DISPOSITION item: no embedded object exists.
- All 14 IDs added to `YO-SCOPE-OBJECTIVE-INDEXING.depends_on` (16 → 30). Counts: SOURCE_WEEK_INDEXING 8 → 20, SOURCE_PREAMBLE_INDEXING 1 → 2, FOUNDATION_REQUEST 1 → 2; items 21 → 35, status counts 5 implemented / 30 pending. `next_runnable` → `YO-INV-T3`. `yoruba.json` was not edited.

## Limits
- Inventory only: no objective was indexed, no lesson authored, no package edit, no schema or compiler edit, no importer/compiler run. Nothing was rendered; no visual inspection was needed because the document contains no object.
- Unresolved by design: whether week 8 was deliberately folded into week 9 or its teaching body was lost, and whether the missing Litireso bodies (weeks 1–6, 8–10) are supplied by a separate literature text. Both are stated in the week items, not resolved here.
- Not approved and not verified. Testing deferred by owner.

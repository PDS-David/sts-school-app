# YO-WK-T1-W06 — Yoruba, 1st Term, Week 6 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 6 is **not delivered**: all 12 coverage entries are PARTIAL and two lesson items plus one factual-dependency item are appended. Week 6 has **two strands and no LITIRESO section**.

## Inputs
- Base: `ss1/yo-wk-t1-w05` at `4dc44d5` (PR #200, Week 5), which is itself stacked on `ss1/yo-wk-t1-w04` at `3d72c04` (PR #199, Week 4) and on master `f4f0719d57b11fba39b499501060da59efe6532b` (the merge of PR #198, Week 3). PRs #199 and #200 are open and unmerged, so this branch is **stacked** and PR #201 targets `ss1/yo-wk-t1-w05`; it is merged after #199 and #200, following the precedent recorded in `ceb9a31` ("Stacked on ss1/yo-wk-t1-w01 (PR #196); merge after #193-#196").
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED`. `YO-WK-T1-W06` was the `next_runnable` recorded by Week 5 in #200.
- Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, 55,974 bytes, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef` **re-verified this run** from the supplied archive (SHA-256 `02448712…65c9a3e`).
- Method (private, outside Git): the same mammoth 1.12.2 `extractRawText` output as Weeks 1–5 (1,781 lines) and a top-level walk of `word/document.xml` to locate tables, automatic numbering, VML shapes (including the five arrow connectors) and media. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run.

## Scheme mapping
- The opening list (lines 9–51, 22 topic paragraphs, SHA-256 `afccd54e…5b4f6af6`) carries **no week numbers and no week markers**. Week 6 has **only two topics**, 16 and 17:

| Scheme topic | Line | Hash (1 line) | Matches |
|---|---|---|---|
| `Silebu` | 39 | `de31a8b4…bc3d41f4` | EDE heading line 1289 `AKOLE ISE: SILEBU` — exact apart from the label, the first exact scheme-to-heading match in the list |
| `Awon owe ti o suyo ninu ise ati ise Yoruba ` | 41 | `9a14381c…a4d567e1` | ASA heading line 1439, word for word (case, label and trailing space aside) |

- Week 6 has **two strands and no LITIRESO section**, and the list is consistent with that: no LITIRESO topic occurs between line 37 (Week 5 topic 15) and line 51 (Week 8 topic 22), so Weeks 6 and 7 each carry two topics; Week 8 carries three again (lines 47, 49 and 51).
- Lines 43 and 45 are Week 7: `Akoto ede Yoruba` matches its EDE heading at 1507 (`AKOLE ISE: AKOTO EDE YORUBA`) and `Iwa omoluabi ati anfaani re` matches its ASA heading at 1645. Line 47 `Aroko kiko` opens Week 8 (heading 1689).
- The inference is recorded as open item `YORUBA-T1-W06-SCHEME-MAPPING`; hash-accounting and classification of the whole list belong to `YO-PRE-T1-1` (PENDING).

## Section
- Teaching label `OSE KEFA`, line 1285 (stored as `\tOSE KEFA\t` — the only week label wrapped in tab characters), SHA-256 `a63bba1d…56311b5b`; section lines 1285–1502, trimmed section SHA-256 `fc386f54…1c29ad4b`, equal to the YO-INV-T1 value. Week 7 begins at 1503 (`OSE KEJE`).
- Parts: `EKA ISE: EDE` 1287–1433 (`3fd5ba9f…cfe4b088`), `EKA ISE: ASA` 1437–1479 (`f105fcb4…dd1e9ccf`), `Igbelewon` 1481–1489 (`a443aa86…70e8a928`), `Ise asetilewa` 1493 (`8d6dbf80…04e25bbd`). There is **no LITIRESO part** and the word LITIRESO does not occur in the week.
- Week 6 contains **one Word table**, table 7 (4 columns × 5 rows) at 1303–1389 inside the EDE part (block `860cdaf1…b899d41f`): header row `APA | ALEYE | APEERE ORO | APA`, then `Odo` + `Silebu` (1311–1341), `Apaala` (1343–1357), `Abere silebu` (1359–1373) and `Apekun silebu` (1375–1389).
- Week 6 contains **five floating VML connectors** and nothing else visual: `Straight Arrow Connector 572`–`576` sit over the tab gaps in the five segmented examples at 1415–1423 (four of type `#_x0000_t32`, 575 of type `#_x0000_t34`, all at zero height except 575 at 0.05 pt). The document's other 16 `v:shape` elements (duplicated `AutoShape 19`–`26` and `28`–`35`) sit outside the week; `word/media/` is empty and there is no picture, text box, OLE object or equation. `YO-VIS-T1-02` owns the disposition of the five connectors.
- 29 paragraphs carry Word automatic numbering and `extractRawText` drops their markers: the three syllable structures (1397, 1399, 1401), the five segmented examples (1415–1423), the four syllabic-nasal examples (1427–1433), the two ASA group lead-ins (1443, 1453), eleven ASA proverbs (1445–1471) and the four questions (1483–1489). The two lead-ins are therefore numbered as if they were proverbs, and the three trading items at 1475–1479 use manually typed `i.`/`ii.`/`iii.` instead.
- The parser produces **no rows** for this source (Yoruba ordinal headings; `YO-FND-T1-01`), so no `SS1-SRC-48b641249e3b:BODY:<sha256>` identity exists. Every coverage entry therefore cites exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.

## Coverage entries added (12, all PARTIAL)
| ID | Objective | Lines | Block SHA-256 |
|---|---|---|---|
| `YO-T1-W06-SCHEME-EDE` | Scheme topic 16 (`Silebu`) bound to the EDE part | 39; 1287–1433 | `de31a8b4…bc3d41f4`; `3fd5ba9f…cfe4b088` |
| `YO-T1-W06-SCHEME-ASA` | Scheme topic 17 bound to the ASA part | 41; 1437–1479 | `9a14381c…a4d567e1`; `f105fcb4…dd1e9ccf` |
| `YO-T1-W06-EDE-01` | Syllable defined; `batani` and `ihun silebu` introduced | 1291–1295 | `e1602b66…ff7a5926` |
| `YO-T1-W06-EDE-02` | The four parts of a syllable in table 7 | 1301–1389 | `860cdaf1…b899d41f` |
| `YO-T1-W06-EDE-03` | The three syllable structures named | 1393–1401 | `234b2b47…deb42c32` |
| `YO-T1-W06-EDE-04` | Vowel-only syllables, with four examples | 1403–1411 | `0e239041…026b24a9` |
| `YO-T1-W06-EDE-05` | Consonant-plus-vowel syllables, five segmented examples | 1413–1423 | `1a0b9444…37305db2` |
| `YO-T1-W06-EDE-06` | The syllabic nasal as a syllable, four examples | 1425–1433 | `c0a440eb…81fbf868` |
| `YO-T1-W06-ASA-01` | Proverbs as condensed wisdom; four on character | 1441–1451 | `0100e1b1…0d12c2eb` |
| `YO-T1-W06-ASA-02` | Proverbs on work: `ise agba` and `Ise ode` | 1453–1471 | `49006d7b…b34fbc1b` |
| `YO-T1-W06-ASA-03` | Proverbs on trading, three items | 1473–1479 | `bbf4602a…64a75c16` |
| `YO-T1-W06-ASSESS` | Four questions and one practical, no key | 1481–1489; 1493 | `a443aa86…70e8a928`; `8d6dbf80…04e25bbd` |

Full values are reproducible with the method above. All twelve entries are PARTIAL: they record what the source does teach while no deliverable lesson exists and no parsed row identity exists. No entry was marked SUPPORTED or UNRESOLVED; every Week 6 objective is addressed by the source body, unlike Week 5's empty LITIRESO strand.

## Source defects (open item `YORUBA-T1-W06-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 1291 | The definition has no final stop and reads `okere julo` (for `ti o kere julo`) and `isemii` (for `isemi`) |
| 2 | 1293–1295 | `Batani / Ihun Silebu` is one heading for two distinct terms, and the definition at 1295 never separates them |
| 3 | 1303–1389 | Table 7 has four headers for three labels (`APA` twice, 1303 and 1309); the first cell splits `Odo` and `Silebu` and the examples and letters are stacked paragraphs that extraction joins (`I – leI – tanDu-n-du`); the example column gives whole words with no segmentation shown; two of the Apaala row's three examples (`I – tan`, `Du-n-du`) repeat the Odo Silebu row verbatim; a capital `I` stands where a lower-case `i` or `l` is needed in the letter cells at 1333, 1371 and 1373 (the last reads `‘I’ ati ‘I’`); and `Kun` in the Apekun row ends in a consonant although the definition calls the apekun the vowel that ends the syllable |
| 4 | 1395 | `ni .` — a space before the full stop |
| 5 | 1403, 1413, 1425 | The three lead-ins are unpunctuated and garbled: `Faweli airanmupe faweli aranmupe` (no conjunction), `leje` (for `le je`) and `ase silebu` |
| 6 | 1415–1423 | The five segmentations depend on tab stops and on the floating arrows, so extraction gives `Kek – e`, `Jej – e` and `Suns – un` with the split blurred; `Sun` is written with a plain ASCII `s` where the sub-dot `s` is required |
| 7 | 1427–1433 | The syllabic-nasal examples mix spaced and closed hyphens (`Ko m ko – ko – n-ko` against `Gbangba – gba – n-gba`), `Ko m` carries a stray space, and only the last line has `abbl.` |
| 8 | 1441–1479 | ASA: `ogbon lari pe` (1441), `Eni roar pa eere` (1449), the split `wony i-` and the numbered lead-in (1453), the indented lower-case sub-heading `ise agba` (1455), `Iti ogede ko to ohun a a pon ada si` (1461), a lone `(D)` group label with no (A)–(C) (1473), `to yo egba dani` (1475), manual roman numerals beside automatic numbering (1475–1479), and no translation, explanation or occupational link for any of the fourteen proverbs |

No correction wording is authored here; the lessons must not copy the uncorrected text and must not reuse the table's misaligned rows.

## Notation (open item `YORUBA-T1-W06-NOTATION`)
- Lines 1285–1502 contain **no** tone-marked or sub-dot character: 0 characters in U+00C0–U+024F and 0 combining marks. The 66 non-ASCII characters are 21 pairs of curly single quotes (U+2018/U+2019) in the table's letter cells and at 1317, and 24 en dashes (U+2013) in the examples.
- This is the same document-wide condition as `YORUBA-T1-W01..W05-NOTATION`. It is less fatal here than in Week 5, because syllabification itself can be shown without tone, but it still matters: the syllabic-nasal segmentations at 1427–1433 rest on syllables that tone distinguishes, `s` at 1423 cannot be told from sub-dot `s`, and all fourteen proverbs at 1445–1479 are tone-dependent.
- Where the text does mark a boundary it uses an en dash, never a tone mark; no marks or symbols were added or normalised.

## Assessment and visuals
- `Igbelewon` (1481–1489) has four questions: the definition of the syllable (1483), the components as `batani silebu` (1485), the syllable structures with examples (1487) and proverbs on Yoruba work (1489). `Ise asetilewa` (1493) has one item asking for proverbs connected with two indigenous occupations. Neither has answers, marking or completion criteria (open item `YORUBA-T1-W06-ASSESSMENT-GAPS`).
- The exercise block is not answerable from the text as it stands: the practical names `ise abinibi` while the ASA part groups its material as `ise agba`, `Ise ode` and trading, and question 1485 asks for `batani silebu`, a term the body never defines separately from `ihun silebu`.
- The five arrow connectors are the only mark linking each word (`Ke`, `Je`, `Fe`, `Gba`, `Sun`) to its segmentation, and they are invisible to text extraction; `YO-VIS-T1-02` owns their disposition.

## Queue changes
- YO-WK-T1-W06 → `IMPLEMENTED_TESTING_DEFERRED`; the previous `next_runnable` value is consumed.
- Appended 3 PENDING/BLOCKED items directly after YO-WK-T1-W06: `YO-LES-T1-W06-EDE` and `YO-LES-T1-W06-ASA` (LESSON, PENDING, depending on `YO-SRC-T1`, `YO-WK-T1-W06` and `YO-FACT-T1-W06-DEFECTS`) and `YO-FACT-T1-W06-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED, depending on `YO-SRC-T1` and `YO-WK-T1-W06`).
- Counts: 72 items, kinds add LESSON 2 and FACTUAL_DEPENDENCY 1; status 12 implemented / 54 pending / 6 blocked; `next_runnable` → `YO-WK-T1-W07`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` updated to Weeks 1–6 (15/15/23/19/14/12) and its required action now starts at `YO-WK-T1-W07`.

## Limits
- Indexing only: no lesson authored, no asset, no package delivery change, no schema or compiler edit, no parser/importer run. `yoruba.json` was edited only to add coverage and open items.
- Not approved and not verified. The scheme mapping for Weeks 6–8 is inferred and flagged: Week 6 has two topics and no third, and no objective was invented beyond the source text.

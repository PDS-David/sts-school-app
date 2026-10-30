# YO-WK-T3-W05 — Yoruba, 3rd Term, Week 5 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 5 is **not delivered**: 12 coverage entries are PARTIAL and 3 are UNRESOLVED, and three lesson items plus two factual-dependency items are appended.

## Inputs
- Base: `origin/master` `017b172` (merge of PR #271, Bookkeeping Week 4). No open PR touched the Yoruba package or queue when work started.
- Prerequisite `YO-SRC-T3` and predecessors `YO-WK-T3-W01`..`W04` are `IMPLEMENTED_TESTING_DEFERRED`.
- Source `SS1-SRC-4cc6aae9ed7d`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`, 68,373 bytes, SHA-256 `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`, unchanged from the YO-INV-T3 measurement. Nothing from the archive or the extract is committed.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 63,445 characters, 2,463 lines, whole-file SHA-256 `4def7729a08d67235d5a7c6fbbcb19a15a93ffdacb96cafc6e477a14edb4d726`. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run.

## Scheme mapping
- The scheme is flat and unnumbered. Week 5 is the fifth triple, lines 35-39, SHA-256 `50c7df0b38e40a9016b0a6508d7587ad6db802a9767bdf8edba8cbdb3bb3442b` (149 characters). The mapping is documentary by position, confirmed by the teaching label `OSE KARUN-UN` at line 1281.
- Rows 17, 23 and 39 are byte-identical (48 characters, SHA-256 `877c508bb10a799b4103aff69547f7f9171524e212c5aeb6c5a975ab1e721547`); row 33 differs only by one space after the tab.

| Scheme item | Lines | SHA-256 | Body binding |
|---|---|---|---|
| `EDE: Aroko Ajemo Isipaya` | 35 | `a16e52b243a3f273f19d807a051dbfc77d55d80a548b471299921fcd1946ff1d` | EDE part 1285-1303, `ef1575b1867b3e51482a1279942165d91f64c82d5305ce6029fd6315a992a0e5` |
| `ASA: Ere idaraya-;Ere igbalode. Ayipada ti o ti de ba ere idaraya abinibi` | 37 | `291fba4ee382d54643291ce23aa08b40224f5d9e3712042018c5518c11ed4f89` | ASA part 1313-1323, `d583c5e55d735c82aca3df2ee1c0b4f0b9a1e35cedc8672ef5255394b56d5e20` (first clause only) |
| `LIT: Itupale iwe asayan ti ijoba yan. WAEC/NECO.` | 39 | `877c508bb10a799b4103aff69547f7f9171524e212c5aeb6c5a975ab1e721547` | none: no LITIRESO heading or body |

- The EDE row names one topic, `Aroko Ajemo Isipaya`, and the body defines it, lists five examples and states a planning approach before setting an essay.
- The ASA row names two topics in one line: `Ere igbalode` (modern games) and `Ayipada ti o ti de ba ere idaraya abinibi` (the changes that traditional games have undergone). The body teaches the first and never mentions the second.
- The LIT row repeats the generic WAEC/NECO requirement for the fifth week running and names no text.
- The mapping question is recorded as `YORUBA-T3-W05-SCHEME-MAPPING`; term-wide classification stays with `YO-PRE-T3-1` and `YO-FND-T3-01` (both PENDING).

## Section
- Teaching label `OSE KARUN-UN`, line 1281, SHA-256 `c38d7fb8bf630de53c8e0cb026405e464d01a67b867bd47da84a7d66891e936f`; section lines 1281-1356, SHA-256 `b35e84fdb051d5e6bbe0af565db59832c6a94a2b12e8548b78d5b3f6ae0adbbc`, 1,598 characters, equal to the YO-INV-T3 value. Week 6 begins at 1357.
- Parts: EDE 1285-1303 (`ef1575b1…9915a992a0e5`) with heading 1285 (`52669a63…4b4e669fc0`), definition 1287 (`ec6089d8…f66aeb49c0`), examples 1289-1297 (`7536879f…5b1b7e20`), planning 1299 (`d7a54962…05662efb54`) and Igbelewon 1303 (`bb2056d9…90ac3b0ddc`); IWE ITOKASI 1307-1309 (`f2eb75f6…068f30ab770`); ASA 1313-1323 (`d583c5e5…5394b56d5e20`) with heading 1315 (`bd71bcd7…54c43503658b`), modern games 1317 (`7459a8ce…0356e20a91f8`) and IWE AKATILEWA 1321-1323 (`81aaad3c…f083edef3c78`, byte-identical to the Week 4 citation at 1219-1221); APAPO IGBELEWON 1327-1331 (`1ba594a2…ae3aed645e5df`); ISE AMURELE 1335-1345 (`f19d01a7…48e11e7c3c530`); APA KEJI 1349-1353 (`8a6b2df1…e108bf956a03`).
- The parser still produces **no rows** for this source. `OSE KARUN-UN` occurs exactly once and is line-initial. Every entry cites line ranges and block hashes with `lesson_ids: []`; row identity stays with `YO-FND-T3-01`.

## Coverage entries added (15)
| ID | Objective | Lines | Status |
|---|---|---|---|
| `YO-T3-W05-SCHEME-EDE` | Scheme EDE row: Aroko Ajemo Isipaya | 35; 1285-1303 | PARTIAL |
| `YO-T3-W05-EDE-01` | Definition and the contrast with a mere description | 1287 | PARTIAL |
| `YO-T3-W05-EDE-02` | Five example subjects | 1289-1297 | PARTIAL |
| `YO-T3-W05-EDE-03` | The planning approach (meaning, attributes, advantages, disadvantages) | 1299 | PARTIAL |
| `YO-T3-W05-EDE-04` | Igbelewon: essay on Oge sise or omi | 1303 | PARTIAL |
| `YO-T3-W05-SCHEME-ASA` | Scheme ASA row: modern games and the traditional-game change | 37; 1313-1323 | PARTIAL |
| `YO-T3-W05-ASA-01` | Modern games with three examples | 1317 | PARTIAL |
| `YO-T3-W05-ASA-02` | Changes traditional games have undergone | 37 only | UNRESOLVED |
| `YO-T3-W05-SCHEME-LIT` | Scheme LIT row: analysis of the selected text | 39 only | UNRESOLVED |
| `YO-T3-W05-LIT-01` | Read and analyse the selected text | 39; 1281-1356 | UNRESOLVED |
| `YO-T3-W05-ASSESS-01` | Ise amurele items 1-3: aroko and game recognition | 1337-1341 | PARTIAL |
| `YO-T3-W05-ASSESS-02` | Ise amurele items 4-5: grammar terms | 1343-1345 | PARTIAL |
| `YO-T3-W05-ASSESS-03` | Apapo igbelewon | 1327-1331 | PARTIAL |
| `YO-T3-W05-ASSESS-04` | Apa keji: eight titles; explain modern games | 1349-1353 | PARTIAL |
| `YO-T3-W05-REF-01` | The two references given | 1307-1309; 1321-1323 | PARTIAL |

Full hashes are in `yoruba.json` and reproducible with the method above. PARTIAL means the source teaches the objective (or sets the exercise) but no deliverable lesson exists, row identity is unresolved and the defects below must be corrected first. UNRESOLVED means the scheme names the objective but the body supplies no content.

## What each part teaches
| Part | Teaching | Exercise |
|---|---|---|
| Aroko ajemo isipaya | 1287: an essay that gives a full explanation of something in one's environment, with one contrast clause against a plain description | none before 1303 |
| Examples | 1289-1297: Ise Tisa, Oge Seise, Aso Ebi, Imototo, Ise ti mo fe lojo iwaju, titles only | 1351 asks for eight |
| Planning | 1299: know the subject, its meaning and lost meanings, attributes, benefits and drawbacks, then organise the ideas; no paragraph plan | none |
| Modern games | 1317: one sentence names ludo tita, dirafuti and boolu afesegba and ends `abbl.` | 1329, 1353 |
| Traditional-game change | none: the scheme clause at 37 has no teaching | none |
| LITIRESO | none: no heading, title, chapter or analysis in 1281-1356 | none |
| References | 1309 Adewoyin 2014, pages 155-156; 1323 Adewoyin 2006, pages 256-299 | not supplied |

## Source defects (open item `YORUBA-T3-W05-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 1287 | Definition is one run-on paragraph; `ounjeti` appears to have lost a space and `yato si pa ki a se apejuwe re` is ungrammatical |
| 2 | 1287 | `ajemo-isipaya` is hyphenated here although 1285 and the first sentence use `ajemo isipaya` |
| 3 | 1289-1297 | Five titles only, with inconsistent closing stops at 1291 and 1295 and no content for any |
| 4 | 1299 | One 221-character sentence; `arojnle` appears to misspell `arojinle`; `itumo ati itumo won miiran` repeats `itumo` |
| 5 | 1303 | Lower-case opening; `omi` set as an essay subject without context; no model or marks |
| 6 | 1309 | `O.I 155-156` uses an unexplained abbreviation; no edition or ISBN |
| 7 | 1317 | Three games named, `abbl.` closes the list, no rule, equipment or benefit |
| 8 | 1323 | `Publihers` misspelt; publisher runs into the page range without punctuation after a double space; 44 pages for one topic |
| 9 | 1331 | Repeats 1303 verbatim, so Apapo igbelewon adds nothing |
| 10 | 1337-1345 | Options `[a] [b] [d]` with no closing bracket and no `(c)`; 1343 uses `(a) (b) (d)`; option capitalisation inconsistent |
| 11 | 1343 | `Atenumo oro ju ni` is a fragment, not a question |
| 12 | 1345 | Options mix `akanlo ede` (general) with `afiwe` and `asorege` (specific) in one item |
| 13 | 1351 | Asks for eight titles although the section teaches six including `omi` |
| 14 | 37, 39 | ASA row's traditional-game change untaught; LIT row set for the fifth week running with no LITIRESO part |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T3-W05-NOTATION`)
- Week 5 (lines 1281-1356) contains **zero non-ASCII characters**: no precomposed diacritic, combining mark, en dash or non-ASCII quotation mark.
- It contains **exactly two tab characters**, at 1343 and 1345, where the Ise amurele item numbers are followed by a tab instead of a space.
- Because the text is unmarked, e and o with sub-dot and all three tones are indistinguishable. `Oge sise`, `omi`, `ilu Ibadan`, `koro isin`, `Ere idaraya` and the three game names at 1317 all depend on tone or sub-dot for their standard spelling. No mark was added or normalised.

## Assessment, visuals and references
- Five exercise blocks, none with an answer, solution, mark allocation or completion criterion: Igbelewon 1303, Apapo igbelewon 1327-1331, Ise amurele 1335-1345 and Apa keji 1349-1353. Recorded as `YORUBA-T3-W05-ASSESSMENT-GAPS`.
- Items 4-5 of the Ise amurele (1343, 1345) test figures of speech taught in earlier weeks, not the Week 5 essay topic.
- `IWE ITOKASI` 1309 cites Adewoyin S.Y (2014), pages 155-156; `IWE AKATILEWA` 1323 cites Adewoyin S.Y (2006), pages 256-299, the same line used in Week 4 at 1219-1221. Neither edition nor ISBN is given and the pages are not supplied.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (YO-INV-T3); the example list at 1289-1297 is plain prose lines. No VISUAL_DISPOSITION item is raised.
- Week 5 names no selected text at all, so a WAEC/NECO title and its permission position are unknown; `YORUBA-T3-W05-SELECTED-TEXT` is an OWNER_ACTION.

## Queue changes
- `YO-WK-T3-W05` then `IMPLEMENTED_TESTING_DEFERRED`; its `Not yet indexed…` reference replaced.
- Appended 5 items depending on `YO-SRC-T3` and `YO-WK-T3-W05`: `YO-LES-T3-W05-EDE`, `-ASA` (LESSON, PENDING, also depending on `YO-FACT-T3-W05-DEFECTS`), `YO-LES-T3-W05-LIT` (LESSON, BLOCKED on `YO-FACT-T3-W05-SELECTED-TEXT`) and `YO-FACT-T3-W05-DEFECTS`, `YO-FACT-T3-W05-SELECTED-TEXT` (FACTUAL_DEPENDENCY, BLOCKED).
- Counts: items 137 -> 142; LESSON 64 -> 67 and FACTUAL_DEPENDENCY 23 -> 25; coverage 369 -> 384; open items 139 -> 146; source_rules 7; lessons 0; status 38 implemented / 76 pending / 28 blocked; `next_runnable` -> `YO-WK-T3-W06` followed by the two PENDING Week 4 lessons and the two PENDING Week 5 lessons.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`.
- Not approved and not verified. Three objectives have no taught content, the essay lesson has no model to copy, and the LIT strand cannot be taught from this document at all.
- The seven open items opened by this task are `YORUBA-T3-W05-SCHEME-MAPPING`, `YORUBA-T3-W05-ROW-IDENTITY`, `YORUBA-T3-W05-SOURCE-DEFECTS`, `YORUBA-T3-W05-NOTATION`, `YORUBA-T3-W05-ASSESSMENT-GAPS`, `YORUBA-T3-W05-CONTENT-GAPS` and `YORUBA-T3-W05-SELECTED-TEXT`. None is closed by this note.

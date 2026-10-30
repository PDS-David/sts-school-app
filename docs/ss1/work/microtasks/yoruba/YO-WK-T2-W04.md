# YO-WK-T2-W04 — Yoruba, 2nd Term, Week 4 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 4 is **not delivered**: 15 coverage entries are PARTIAL and 3 UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `bbb7303` (the `ss1/yo-wk-t2-w03` tip; PR #212 open against `ss1/yo-wk-t2-w02` and PR #211 open against `ss1/yo-wk-t2-w01`), stacked on the merged #199–#207 chain. `origin/master` is still `9f745bb` and carries only PR #199. This item's PR targets `ss1/yo-wk-t2-w03`.
- Prerequisites `YO-SRC-T2` and `YO-WK-T2-W03` are `IMPLEMENTED_TESTING_DEFERRED`. No open PR owned YO-WK-T2-W04 when work started.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run**, matching the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically to the same extraction, as noted below.

## Scheme mapping
- The 2nd Term scheme is a paragraph list headed `ILANA ISE OSOOSE FUN SAA KEJI` (line 7). The Week 4 row is lines 45–55, SHA-256 `21818e1ffba31b71926e8292140cacf0315b00187358446a68feea8297baf6d2`.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| `Ose kerin Ede- Aroko  Asapejuwe;ilana kiko aroko` | 45 | `dcd688b9…18c337d5654` | EDE part 1305–1329 |
| `        - Awon ori-oro to je mo aroko asapejuwe.` | 47 | `c23dc8a6…4259980e577e32d7` | Topic list 1311–1321 |
| `Asa-   Asa Igbeyawo Ni Ile Yoruba.` | 49 | `aedaaef3…4c51eead144591bdb` | ASA part 1333–1397 |
| `Awon igbese igbeyawo abinibi` | 51 | `8615fae7…398f60b63dcd419f` | Step list 1347–1363 |
| `Awon ohun elo idana. ` | 53 | `8b05f8b8…05fa8fced2fe371` | **No list** |
| `Litireso – Itupale asayan iwe litireso.` | 55 | `c92dc5f3…49812015eac6855` | **No teaching body** |

- The body teaches **aroko alapejuwe** at 1305–1329: definition at 1307, purpose at 1309, five topics at 1313–1321 and one essay task at 1325–1329. It teaches **no `ilana kiko aroko`**, although scheme line 45 names it. That gap is `YO-T2-W04-EDE-03` (UNRESOLVED).
- The scheme writes `Asapejuwe`; the body heading at 1305 writes `ALAPEJUWE`. The two are treated as the same essay type and the spelling difference is recorded in `YORUBA-T2-W04-SOURCE-DEFECTS` and in `YORUBA-T2-W04-SCHEME-MAPPING`.
- The ASA strand covers scheme lines 49–53: meaning and value of marriage at 1335–1345, the seven abinibi steps at 1347–1363 and each step at 1369–1397. **`Awon ohun elo idana` (line 53) is never listed**; 1391 says only that the husband's family pays everything demanded, and `Ara eru idana` appears only as an MCQ option at 1419. That gap is `YO-T2-W04-ASA-08` (UNRESOLVED).
- Line 55 uses an en dash after `Litireso` where the other rows use a hyphen. There is **no literature heading, text or instruction** in the section; the only occurrence of `Litireso` is the reference title at 1411. Recorded as `YO-T2-W04-SCHEME-LIT` (UNRESOLVED).
- The `Apa keji` essay task at 1441 (`Ko aroko lori egbon re`) belongs to the EDE strand but sits in the ASA exercise block. Recorded in the scheme-mapping open item.
- The mapping inference is recorded as `YORUBA-T2-W04-SCHEME-MAPPING`; classification of the whole 12-row scheme belongs to `YO-PRE-T2-1` (PENDING).

## Section
- Teaching label `OSE KERIN`, line 1303, SHA-256 `bab86961830e5bba67f9143ca9d195c7744ce0e8029dcab3b61dd67772c4c14b`; section lines 1303–1450, SHA-256 `2db6479730bcda31005348909fae7b943526f50a818b0b25df5ad9591b6d076a`, equal to the YO-INV-T2 value.
- Parts: `ORI-ORO-;AROKO ALAPEJUWE` 1305–1329 (`75ef5d0b…1d8c66db0611b80a`), `ASA` 1333–1397 (`b5b2c9b8…0770f40506ea5180`), `IGBELEWON` 1399–1407 (`6d8924c9…8f13f6a16c221ecb`), `AKATILEWA ` 1409–1411 (`459e7424…3b0d9655fc848e39`), `ISE ASETILEWA` 1413–1433 (`74dd8f0f…8c510a371859f4`), `APA KEJI` 1435–1441 (`012bdb87…17cd06f85e811422`).
- There is **no LITIRESO part**.
- The parser produces **no rows** for this source: the extraction contains zero `week` substrings and zero bare-number lines, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run. No `SS1-SRC-ec4a5095420d:BODY:<sha256>` identity exists; all 18 coverage entries cite exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (`word/document.xml` has zero `w:tbl`, `w:drawing`, `w:pict`, `w:object`, `w:OLEObject` and `m:oMath`). The five topics and the seven steps are plain paragraphs.

## Coverage entries added (18)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W04-SCHEME-EDE` | Scheme EDE objectives: aroko asapejuwe, ilana kiko aroko, ori-oro | 45–47; 1305–1329 | `21818e1f…`; `75ef5d0b…` | PARTIAL |
| `YO-T2-W04-EDE-01` | Aroko alapejuwe defined; purpose stated | 1305–1309 | `da54d676…` | PARTIAL |
| `YO-T2-W04-EDE-02` | Five ori-oro for aroko alapejuwe | 1311–1321 | `8b9e5093…` | PARTIAL |
| `YO-T2-W04-EDE-03` | Ilana kiko aroko: the writing procedure | 45; none | `dcd688b9…` | UNRESOLVED |
| `YO-T2-W04-SCHEME-ASA` | Scheme ASA objectives: marriage, steps, ohun elo idana | 49–53; 1333–1397 | `aedaaef3…`; `8615fae7…`; `8b05f8b8…`; `b5b2c9b8…` | PARTIAL |
| `YO-T2-W04-ASA-01` | Igbeyawo: meaning, value, two families, purpose | 1335–1345 | `c83185b1…` | PARTIAL |
| `YO-T2-W04-ASA-02` | The seven abinibi steps listed | 1347–1363 | `99100b36…` | PARTIAL |
| `YO-T2-W04-ASA-03` | Ifojusode and Iwadii | 1369–1375 | `824fd0a1…` | PARTIAL |
| `YO-T2-W04-ASA-04` | Alarina: intermediary and investigation | 1377–1379 | `9af2a68c…` | PARTIAL |
| `YO-T2-W04-ASA-05` | Ijohen / Isihun: acceptance and fee | 1381–1383 | `55bffffc…` | PARTIAL |
| `YO-T2-W04-ASA-06` | Itoro and Idana | 1385–1391 | `45d9bb70…` | PARTIAL |
| `YO-T2-W04-ASA-07` | Igbeyawo ceremony and third-night custom | 1393–1397 | `71bc3949…` | PARTIAL |
| `YO-T2-W04-ASA-08` | Awon ohun elo idana: the idana items | 53; none | `8b05f8b8…` | UNRESOLVED |
| `YO-T2-W04-SCHEME-LIT` | Scheme LITIRESO objective: Itupale asayan iwe litireso | 55; none | `c92dc5f3…` | UNRESOLVED |
| `YO-T2-W04-ASSESS-EDE` | Igbelewon: write an essay on your school | 1325–1329 | `cd668d81…` | PARTIAL |
| `YO-T2-W04-ASSESS-ASA` | Igbelewon: ifojusode, alarina, ijohen/isihun, itoro vs idana | 1399–1407 | `6d8924c9…` | PARTIAL |
| `YO-T2-W04-ASSESS-ISE` | Akatilewa reference; five MCQs | 1409–1411; 1413–1433 | `459e7424…`; `74dd8f0f…` | PARTIAL |
| `YO-T2-W04-ASSESS-APA` | Apa keji: define, list steps, essay; 1, b, 2 | 1435–1441 | `012bdb87…` | PARTIAL |

Full values are reproducible with the method above. The 15 PARTIAL entries mean the source teaches the objective (or sets the exercise) but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching. The 3 UNRESOLVED entries mean the objective is in the scheme but the body teaches nothing.

## What each part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| Aroko alapejuwe | 1307 | Purpose 1309; five topics 1313–1321 | Igbelewon 1325–1329 |
| Ilana kiko aroko | — | **Not taught** | — |
| Igbeyawo | 1339, 1341 | Value 1337; two families 1339; helper and love 1343–1345 | Igbelewon 1399–1407 |
| Steps | 1349 | Seven steps 1351–1363 | Ise asetilewa 1413–1433 |
| Ifojusode | 1369 | Parents look out; beauty and character | — |
| Iwadii | 1373 | Mother's character; disease; Ifa consultation 1375 | — |
| Alarina | 1377 | Investigation and proverb 1379 | — |
| Ijohen / Isihun | 1383 | Acceptance; fee poun meji sile meji | — |
| Itoro / Idana | 1387, 1391 | Betrothal visit; payment day; small feast | — |
| Igbeyawo | 1395 | Wedding scale; third-night custom 1397 | — |
| Ohun elo idana | — | **Not listed** | MCQ option only (1419) |

## Source defects (open item `YORUBA-T2-W04-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 45 | Double space after `Aroko`; no space after the semicolon; `Asapejuwe` against `ALAPEJUWE` at 1305 |
| 2 | 55 | En dash after `Litireso` where other rows use a hyphen |
| 3 | 1305 | `ORI-ORO-;AROKO` runs the separator into the title |
| 4 | 1307 | `aroko alapejuwe-;` fused punctuation; `nnkan,nnkan`; doubled vowels in `elemii`/`alailemii` |
| 5 | 1309 | One run-on sentence with missing spaces (`si nibe`, `isele`) |
| 6 | 1311 | No full stop; `apeere` unaccented |
| 7 | 1313–1321 | Five topics unnumbered; 1313–1317 lack a full stop while 1319 and 1321 have one; 1313 `wo ri` unmarked |
| 8 | 1325–1329 | One essay topic, no plan, length or model |
| 9 | 1335 | `ORI-ORO-;ASA IGBEYAWO` runs the separator into the title |
| 10 | 1337 | Missing spaces after commas; `owo yepere`; `ro mo` for `ro mọ` |
| 11 | 1339 | `won o ka si mo` for `won kò kà sí mọ́`; space before comma; `ko je ki igbeyawo pe mo` garbled |
| 12 | 1341 | `isopo` for `ìsopọ̀`; `gbe po` for `gbé pọ̀` |
| 13 | 1343 | `n gbe` for `ń gbé` |
| 14 | 1345 | `ba a le ni aaro laye` garbled; `aaro` unclear |
| 15 | 1349 | `igbese igbese` duplicated |
| 16 | 1351–1363 | Seven steps marked with hyphens, not numbered; step 4 `Isihun/ Ijohen` reversed against the heading at 1381 |
| 17 | 1369 | `Ifojusode` has no space after the hyphen; `bi ko se ati iwa` garbled |
| 18 | 1373 | One huge paragraph; `ete`, `warapa` and `ikofee` unexplained; `ajigbese` unclear; `abbl` undefined |
| 19 | 1375 | `Paripari re` and `bi ifa ba fore abusebuse` garbled |
| 20 | 1377 | `gbokegbodo` garbled; `fe fe` duplicated |
| 21 | 1379 | `alarena` alternates with `alarina`; `se e finu tan`, `hoo`, `powe` and `moju` unclear |
| 22 | 1383 | `fe fe` duplicated; `dun mo`; missing space before `Poun`; `sile`; `afesona` undefined |
| 23 | 1387 | `lodo awon obi omokunrin naa` repeats the boy's parents where the girl's are meant; no full stop |
| 24 | 1391 | `laiku eyokan`, `Ariya ranpe lewaye` and `won to sese ma mo` garbled |
| 25 | 1395 | `se lowo to`, `larinrin`, `alariwo` and `gege bi iwadii ti won base` unmarked or garbled |
| 26 | 1397 | One long paragraph; `owo irole`, `ero`, `gba a` and `n la` unclear |
| 27 | 1399, 1403 | `IGBELEWON` in capitals against `Igbelewon` at 1325; `alarena` for `alarina` |
| 28 | 1411 | Missing spaces after commas; irregular spacing in `o .i`; no edition |
| 29 | 1415–1433 | Options `(a)`, `(b)`, `(d)` with `c` omitted; Q1 no final stop; Q2 stem unclear; Q4 stem is a run of dashes; Q5 `rara` beside two plausible chants |
| 30 | 1435–1441 | Numbering runs `1`, `b`, `2`; EDE essay task placed in the ASA block |
| 31 | 1303–1450 | The whole section is ASCII: no tone, no sub-dot, no `ẹ` or `ọ` |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T2-W04-NOTATION`)
- Week 4 (lines 1303–1450) contains **no non-ASCII character at all**: no precomposed diacritic, no combining mark, no curly quote and no dash. This is stricter than Week 2 (13 non-ASCII characters) and Week 3 (124), and it matches Week 1 in having no diacritics.
- Consequently e/ẹ and o/ọ cannot be distinguished anywhere in the week and no tone is marked, although the topic titles, the marriage terms and the proverb at 1379 depend on both. The scheme row carries one en dash at line 55, outside the section. No marks were added or normalised.

## Assessment, visuals and references
- Five exercise sets, none with an answer, solution or marking scheme: Igbelewon 1325–1329 (one essay topic), Igbelewon 1399–1407 (four questions), Akatilewa 1409–1411 (one reference), Ise asetilewa 1413–1433 (five MCQs) and Apa keji 1435–1441 (define, list steps, essay; numbered 1, b, 2). Recorded as `YORUBA-T2-W04-ASSESSMENT-GAPS`.
- The essay tasks have no plan, length or rubric; every MCQ option list omits `c`; Q5 at 1431 offers `rara` beside `ekun iyawo` and `orin iyawo`, so two options name a wedding chant.
- `AKATILEWA` 1409–1411 lists one reference: `Imo,Ede,Asa Ati Litireso. Adewoyin S.Y. o .i 286-294.` The abbreviation `o .i` is spaced irregularly and undefined, and no edition or place is given.
- The document contains **no Word table, drawing, picture, OLE object, equation or media file**. The topics and steps are plain paragraphs; no VISUAL_DISPOSITION item is raised.

## Queue changes
- YO-WK-T2-W04 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 items, all depending on `YO-SRC-T2` and `YO-WK-T2-W04`:
  - `YO-LES-T2-W04-EDE`, `YO-LES-T2-W04-ASA`, `YO-LES-T2-W04-LIT` (LESSON, PENDING, also depending on `YO-FACT-T2-W04-DEFECTS`) — replacement lessons for the EDE and ASA strands and for the absent literature objective.
  - `YO-FACT-T2-W04-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) — one recorded expert decision on the defects and the notation.
- Counts: items 92 → 96; kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 23 implemented / 60 pending / 13 blocked; `counts` sums to 96. Coverage 172 → 190; open items 67 → 73; notes 27 → 28; `next_runnable` → `YO-WK-T2-W05`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records Weeks 1–4 (14, 15, 18 and 18 coverage entries) and leaves Weeks 5–12, the 2nd Term preamble and foundation item, and the 3rd Term outstanding.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The row identity gap is recorded, not resolved: whether the nine 2nd Term section labels can be introduced by `split_before` belongs to `YO-FND-T2-01` (PENDING). No objective was invented beyond the text, and the essay-procedure, idana-item and literature gaps are recorded as open items rather than filled.

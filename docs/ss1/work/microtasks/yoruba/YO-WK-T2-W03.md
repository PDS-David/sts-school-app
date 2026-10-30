# YO-WK-T2-W03 — Yoruba, 2nd Term, Week 3 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 3 is **not delivered**: 16 coverage entries are PARTIAL and 2 UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `275e41c` (the `ss1/yo-wk-t2-w02` tip; PR #211 open against `ss1/yo-wk-t2-w01`), stacked on the merged #199–#207 chain. `origin/master` is still `9f745bb` and carries only PR #199. This item's PR targets `ss1/yo-wk-t2-w02`.
- Prerequisites `YO-SRC-T2` and `YO-WK-T2-W02` are `IMPLEMENTED_TESTING_DEFERRED`. No open PR owned YO-WK-T2-W03 when work started.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run**, matching the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically to the same extraction, as noted below.

## Scheme mapping
- The 2nd Term scheme is a paragraph list headed `ILANA ISE OSOOSE FUN SAA KEJI` (line 7). The Week 3 row is lines 37–43, SHA-256 `2d55c9d18854ce5458f51a5afc2542918b006d82b6e7426a78e2f72f6f7208fb`. The EDE objective shares its line with the week label; the ASA objective runs across two paragraphs and LITIRESO closes the row.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| ` Ose keta    Ede- Awon isori gbolohun gege bi ise won.` | 37 | `1ad195a3…a1190ed31` | EDE part 1077–1197 |
| `   Asa-  Asa ila kiko` | 39 | `04874af3…5fdfd3a50c7` | ASA introduction 1203–1207 |
| `         - pataki ati iwulo ila.` | 41 | `f1638428…db058cd8d04` | ASA importance and reasons 1209–1247 |
| `Litireso- Itupale asayan iwe litireso.` | 43 | `f698bad3…e5fd542e` | **No teaching body** |

- The body classifies sentences **by function** at 1077–1187, as the scheme asks. The ori-oro at 1081 nevertheless says `gege bi ihun won` (by structure), repeating the Week 2 wording, while 1077 and 1083 say `ise won` (by function). The contradiction is recorded in `YORUBA-T2-W03-SOURCE-DEFECTS`.
- Six types are listed at 1105–1119: Ibeere, Ase, Alaye, Akiyesi alatenumo, Kani and Iyisodi. Five are taught (Ase at 1121–1131, Ibeere at 1133–1143, Kani at 1145–1155, Akiyesi alatenumo at 1157–1169, Iyisodi at 1171–1187). **Alaye is never defined or exemplified** and is recorded as `YO-T2-W03-EDE-08` (UNRESOLVED).
- The definition of `gbolohun ase` at 1121 is the teaching counterpart of the stray Week 2 line 911, which the Week 2 index recorded as Week 3 material; the record now closes.
- ASA covers both scheme lines: the craft and its practitioners at 1203–1207 and 1249, importance and body placement at 1209–1217, and the reasons, seven patterns and three definitions at 1219–1247.
- LITIRESO is absent again: no heading, no selected text, no instruction in 1075–1302, and line 43 is identical to Week 2 line 35.
- The mapping inference is recorded as `YORUBA-T2-W03-SCHEME-MAPPING`; classification of the whole 12-row scheme belongs to `YO-PRE-T2-1` (PENDING).

## Section
- Teaching label ` OSE KETA `, line 1075, SHA-256 `d663275164cf0d8595d778f9faf9cf39e3dec71c06ca7f79b69c878e4786e55c`; section lines 1075–1302, SHA-256 `d209b73a0145a6f038ce24c5dde16416f0908ff92c963d9ab017ec990be4f206`, equal to the YO-INV-T2 value.
- Parts: `ORI-ORO-;AWON ISORI GBOLOHUN EDE YORUBA GEGE BI ISE WON.` 1077–1197 (`74139c3a…d387be9de`), `ASA` 1201–1257 (`135a4af0…06b7c2fb45`), `Iwe A katilewa.` 1259–1261 (`335aca7f…17a5b3c3bf`), `ISE ASETILEWA` 1263–1283 (`3f6475c5…8a8cc424c1`), `APA KEJI` 1285–1297 (`e714fe7e…76bcd3e5bd`).
- There is **no LITIRESO part**.
- The parser produces **no rows** for this source: the extraction contains zero `week` substrings and zero bare-number lines, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run. No `SS1-SRC-ec4a5095420d:BODY:<sha256>` identity exists; all 18 coverage entries cite exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (`word/document.xml` has zero `w:tbl`, `w:drawing`, `w:pict`, `w:object`, `w:OLEObject` and `m:oMath`). The six-type list and the seven-pattern list are tab-aligned paragraphs, so their layout is flattened in the extraction but recoverable from the tabs.

## Coverage entries added (18)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W03-SCHEME-EDE` | Scheme EDE objective bound to the function classification | 37–43; 1077–1197 | `2d55c9d1…`; `74139c3a…` | PARTIAL |
| `YO-T2-W03-EDE-01` | Heading, gbolohun defined, naming by function, two examples | 1077–1103 | `425108c6…` | PARTIAL |
| `YO-T2-W03-EDE-02` | The six eya gbolohun listed | 1105–1119 | `d8052677…` | PARTIAL |
| `YO-T2-W03-EDE-03` | Gbolohun ase: definition and four examples | 1121–1131 | `d214205a…` | PARTIAL |
| `YO-T2-W03-EDE-04` | Gbolohun ibeere: definition, question words, five examples | 1133–1143 | `74cb2e51…` | PARTIAL |
| `YO-T2-W03-EDE-05` | Gbolohun kani: definition and three examples | 1145–1155 | `2bdb80e1…` | PARTIAL |
| `YO-T2-W03-EDE-06` | Gbolohun akiyesi alatenumo: definition, ni, three focus examples | 1157–1169 | `6d71cc00…` | PARTIAL |
| `YO-T2-W03-EDE-07` | Gbolohun iyisodi: definition and six examples | 1171–1187 | `d0951a59…` | PARTIAL |
| `YO-T2-W03-EDE-08` | Gbolohun alaye: listed but never taught | 1113; none | `8bae165c…` | UNRESOLVED |
| `YO-T2-W03-SCHEME-ASA` | Scheme ASA objectives: Asa ila kiko and pataki ati iwulo ila | 39–41; 1201–1257 | `04874af3…`; `f1638428…`; `135a4af0…` | PARTIAL |
| `YO-T2-W03-ASA-01` | Ila kiko: definition, practitioners, tools and time | 1203–1207; 1249 | `4c22c7f2…`; `dc9ce9c5…` | PARTIAL |
| `YO-T2-W03-ASA-02` | Importance and uses of ila; body placement | 1209–1217 | `2842111d…` | PARTIAL |
| `YO-T2-W03-ASA-03` | Reasons, seven patterns and three definitions | 1219–1247 | `71060240…` | PARTIAL |
| `YO-T2-W03-SCHEME-LIT` | Scheme LITIRESO objective: Itupale asayan iwe litireso | 43; none | `f698bad3…` | UNRESOLVED |
| `YO-T2-W03-ASSESS-EDE` | Igbelewon: define gbolohun; five types with one example each | 1191–1197 | `7c3d777d…` | PARTIAL |
| `YO-T2-W03-ASSESS-ASA` | Igbelewon: oge sise, body adornment, patterns and reasons | 1251–1257 | `c239fc6b…` | PARTIAL |
| `YO-T2-W03-ASSESS-ISE` | Iwe akatilewa and Ise asetilewa: reference and five MCQs | 1259–1283 | `335aca7f…`; `3f6475c5…` | PARTIAL |
| `YO-T2-W03-ASSESS-APA` | Apa keji: three types, four patterns, three tools | 1285–1297 | `e714fe7e…` | PARTIAL |

Full values are reproducible with the method above. The 16 PARTIAL entries mean the source teaches the objective (or sets the exercise) but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching. The 2 UNRESOLVED entries mean the objective is in the scheme or the type list but the body teaches nothing.

## What each part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| EDE introduction | 1091–1095 | Heading 1077; contradictory ori-oro 1081/1083; two examples 1101–1103 | Igbelewon 1191–1197 |
| Eya gbolohun list | 1105–1107 | Six types 1109–1119 (Ibeere, Ase, Alaye, Akiyesi alatenumo, Kani, Iyisodi), unnumbered; Alaye not taught | — |
| Gbolohun ase | 1121 | Four imperatives 1125–1131 (Wa, Jade, Dake, Lo pon omi wa) | — |
| Gbolohun ibeere | 1133 | Five questions 1135–1143 with question words | — |
| Gbolohun kani | 1145 | Three examples 1151–1155, two garbled | — |
| Gbolohun akiyesi alatenumo | 1157 | Base sentence 1163; object, verb and subject focus 1165–1169 | — |
| Gbolohun iyisodi | 1171 | Two negatives 1177–1179; two question-answer pairs 1181–1187 | — |
| Ila kiko | 1205–1207 | Practitioners and tools 1207 (repeated with a different list at 1249); time 1207 | Igbelewon 1251–1257 |
| Importance and placement | 1211–1217 | Cheek, forehead, jaw; chest to lower abdomen; back to buttocks | Ise asetilewa 1263–1283 |
| Reasons and patterns | 1219–1225 | Two reasons (identification, beauty); seven patterns 1229–1241; three definitions 1243–1247 | Apa keji 1285–1297 |

## Source defects (open item `YORUBA-T2-W03-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 1081 | Ori-oro says `ihun won` (structure) while the heading 1077 and 1083 say `ise won` (function); a copy of Week 2 wording |
| 2 | 1091 | Tone errors in the definition (`o sí` where `ó sì` is expected; `ìse` for `iṣẹ́`) |
| 3 | 1109–1119 | Six-type list is unnumbered; `lyisodi` at 1119 uses a lowercase l for I |
| 4 | 1113 | Alaye is listed as a type but never defined or exemplified |
| 5 | 1133 | `lbeere` twice with a lowercase l for I; question words run together without commas |
| 6 | 1145 | `wulewule` is unclear |
| 7 | 1151 | `maa kole` is garbled |
| 8 | 1155 | `yoo jeko` is garbled |
| 9 | 1157 | Curly quotes around `Ni`; spaces before commas and the full stop |
| 10 | 1167 | `Rira ni mo iwe` omits `ra` and is not a well-formed verb-focus sentence |
| 11 | 1171 | Iyisodi is defined as denying an event but no formation rule is given |
| 12 | 1181–1187 | Question-answer pairs are given under iyisodi instead of transformed negative sentences |
| 13 | 1189 | Stray comma |
| 14 | 1195 | Exercise asks for five types while six are listed |
| 15 | 1197 | Stray `I` |
| 16 | 1205 | `Tokunrin`, `ayijo` for `atijo`, names run together; says men, women and children all marked, while 1207 and 1249 say the oloola did it and it was men's work |
| 17 | 1207 | Missing spaces after commas and the full stop; tool list `abe sekele, osun, ose dudu, omi ogbin ewe feru` |
| 18 | 1209 | `AKOON` for `AKOONU` |
| 19 | 1213–1217 | One sentence split across three lines with missing spaces |
| 20 | 1221 | Reasons said to be `ona m`; the count word is truncated and only two reasons follow |
| 21 | 1227 | Missing space after the comma; trailing `ni-;` |
| 22 | 1229–1241 | Seven patterns are unnumbered; Baamu, Abaja, Keke and Ture are never described |
| 23 | 1243 | `ooro` where three vertical lines are meant |
| 24 | 1249 | Repeats the 1207 statement with a different tool list (`abe, omi igbin, abbl`); the two lists conflict and neither is complete |
| 25 | 1253 | Exercise asks `oge sise`, a Week 1 and Week 2 objective not in the Week 3 scheme |
| 26 | 1255 | Exercise asks about body adornment generally while the body teaches facial marks only |
| 27 | 1259 | `Iwe A katilewa.` spacing |
| 28 | 1261 | Reference gives no edition or book number and no space after the comma |
| 29 | 1265–1283 | Every MCQ option list is `(a)`, `(b)`, `(d)`; `c` is omitted |
| 30 | 1269–1271 | Q2 option `(b)` repeats the stem phrase `ila meta` |
| 31 | 1281–1283 | Q5 tests `alakanpo`, a Week 2 structural type not taught in Week 3 |
| 32 | 1287–1297 | Numbering runs `1`, `2`, `b`; `a` is missing |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T2-W03-NOTATION`)
- Week 3 (lines 1075–1302) contains **124 non-ASCII characters**: 40 `ó`, 18 `ù`, 16 `í`, 7 `ú`, 6 `é`, 6 `è`, 6 `ì`, 6 `ẹ`, 5 `à`, 4 `ọ`, 2 `ń`, 2 `á`, one each of `Ì`, `À` and `È`, one en dash and one pair of curly quotes.
- The diacritics are confined to lines 1083–1105 (the heading, the definitions and the two introductory examples at 1101 and 1103), the type list 1109–1119, and the definition lines 1121, 1133, 1145 and 1157. Every example from 1125 onwards, the whole ASA part and all exercises are unmarked, so e/ẹ and o/ọ are distinguished in a few early lines but not in the later examples they explain, and tone is largely unmarked. No marks were added or normalised.

## Assessment, visuals and references
- Four exercise sets, none with an answer, solution or marking scheme: Igbelewon 1191–1197 (define gbolohun; explain five types with one example each), Igbelewon 1251–1257 (oge sise, body adornment, patterns and two reasons), Iwe akatilewa 1259–1261 and Ise asetilewa 1263–1283 (five MCQs, options `(a)`, `(b)`, `(d)`) and Apa keji 1285–1297 (three types plus four patterns and three tools, numbered 1, 2, b). Recorded as `YORUBA-T2-W03-ASSESSMENT-GAPS`.
- The EDE exercise asks for five types while six are listed; the ASA exercise asks `oge sise`, which Week 3 does not teach; Q2 option `(b)` repeats the stem; Q5 tests `alakanpo` from Week 2.
- `Iwe A katilewa.` 1259–1261 lists one reference: `Eko Ede Yoruba Titun, Oyebamiji Mustapha et al. 203-215.` No edition or book number is given, and the comma has no following space.
- The document contains **no Word table, drawing, picture, OLE object, equation or media file**. The type list and pattern list are tab-aligned paragraphs; no VISUAL_DISPOSITION item is raised.

## Queue changes
- YO-WK-T2-W03 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 items, all depending on `YO-SRC-T2` and `YO-WK-T2-W03`:
  - `YO-LES-T2-W03-EDE`, `YO-LES-T2-W03-ASA`, `YO-LES-T2-W03-LIT` (LESSON, PENDING, also depending on `YO-FACT-T2-W03-DEFECTS`) — replacement lessons for the EDE and ASA strands and for the untaught literature objective. `Oge sise` is not duplicated; it stays with `YO-LES-T2-W01-ASA`.
  - `YO-FACT-T2-W03-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) — one recorded expert decision on the defects and the notation.
- Counts: items 88 → 92; kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 22 implemented / 58 pending / 12 blocked; `counts` sums to 92. Coverage 154 → 172; open items 61 → 67; notes 26 → 27; `next_runnable` → `YO-WK-T2-W04`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records Weeks 1–3 (14, 15 and 18 coverage entries), with the Week 1 duplicate sentence removed, and leaves Weeks 4–12, the 2nd Term preamble and foundation item, and the 3rd Term outstanding.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The row identity gap is recorded, not resolved: whether the nine 2nd Term section labels can be introduced by `split_before` belongs to `YO-FND-T2-01` (PENDING). No objective was invented beyond the text, and the alaye, pattern-definition and literature gaps are recorded as open items rather than filled.

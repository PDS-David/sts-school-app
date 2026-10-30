# YO-WK-T2-W05 — Yoruba, 2nd Term, Week 5 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 5 is **not delivered**: 14 coverage entries are PARTIAL and 2 UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `c1ff92a` (the `ss1/yo-wk-t2-w04` tip; PR #213 open against `ss1/yo-wk-t2-w03`, PR #212 against `ss1/yo-wk-t2-w02` and PR #211 against `ss1/yo-wk-t2-w01`), stacked on the merged #199–#207 chain. `origin/master` is still `9f745bb` and carries only PR #199. This item's PR targets `ss1/yo-wk-t2-w04`.
- Prerequisites `YO-SRC-T2` and `YO-WK-T2-W04` are `IMPLEMENTED_TESTING_DEFERRED`. No open PR owned YO-WK-T2-W05 when work started.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run**, matching the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically to the same extraction, as noted below.

## Scheme mapping
- The 2nd Term scheme is a paragraph list headed `ILANA ISE OSOOSE FUN SAA KEJI` (line 7). The Week 5 row is lines 57–67, SHA-256 `55c53e211535fa77ed6c031487d304be3141521cf8e093de9408c34abd5f659a`.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| ` Ose karun-un  Ede- Aayan Ogbufo; ilana sise aayan ogbufo.` | 57 | `230a463d2f757b40408156c71986d50af86e16607ac0ceae7c4186fe6ba96796` | EDE part 1453–1543 |
| `   Asa – Orisii igbeyawo ti o wa` | 59 | `a783988e32e25db572df3e0d0fe997ac045dbb500d091b9e90ade0e2e691ac49` | ASA part 1547–1569 |
| `igbeyawo nisu loka` | 61 | `32f02dc56368c48da4a8fa2093b70392db700bc01a539f48d1ff587c17c5a00b` | Type list 1549–1561 |
| `            gbigbe ese le iyawo` | 63 | `cc2910751ba9f1e327c0e5f8832ac8e0750f0584784144fa5c536b5f5695f1a3` | Type list 1549–1561 |
| `            ana sise ni ile Yoruba.` | 65 | `37a0081bc24815b100e48718a249ba758e8d02d4cd02876af038ee38e984855a` | **No teaching** |
| `Litireso- Itupale asayan iwe litireso.` | 67 | `f698bad3bad40c8162c89b56708183affc2874035ce768561aa26550e5fd542e` | **No teaching body** |

- The body teaches **aayan ogbufo** at 1453–1543: definition at 1461, translator prerequisites at 1465, six prohibitions and directives at 1469–1489, six English–Yoruba pairs at 1491–1529 and a passage exercise at 1531–1543. The six points are rules, not an ordered `ilana sise aayan ogbufo`, and no worked demonstration links them to the pairs; that shortfall is recorded in `YO-T2-W05-SCHEME-EDE`, `YO-T2-W05-EDE-03` and `YORUBA-T2-W05-CONTENT-GAPS`.
- The scheme names `ana sise ni ile Yoruba` at line 65, but the ASA body teaches only the four marriage types at 1549–1569 and never mentions it. The only `ana` substrings in the section are inside `ilana` at 1563 and 1591. That gap is `YO-T2-W05-ASA-06` (UNRESOLVED).
- The body lists four types at 1549–1561 and defines each at 1563–1569. Two of them (`jiji iyawo gbe`, `pade mi ni diiko`) are not in the scheme, whose sub-items name only `igbeyawo nisu loka`, `gbigbe ese le iyawo` and `ana sise ni ile Yoruba`. Recorded in `YORUBA-T2-W05-SCHEME-MAPPING`.
- Line 59 uses an en dash after `Asa` where the EDE row at 57 uses a hyphen; line 67 uses a hyphen after `Litireso`. There is **no literature heading, text or instruction** in the section, and the word `Litireso` does not occur in it. Recorded as `YO-T2-W05-SCHEME-LIT` (UNRESOLVED).
- `IWE AKATILEWA` at 1571–1575 is heading only: the Week 5 section lists **no reference at all**.
- The mapping inference is recorded as `YORUBA-T2-W05-SCHEME-MAPPING`; classification of the whole 12-row scheme belongs to `YO-PRE-T2-1` (PENDING).

## Section
- Teaching label `OSE  KARUN-UN`, line 1451, SHA-256 `53a1c9d8f3cd11c93502bae43b938c39b9d12f8db273e09bf7a6e0849a612e99`; section lines 1451–1610, SHA-256 `3514d24ba56cf7c4997e9014a23f984c3c4acb462c5b3fec7cc79302f9bce41a`, equal to the YO-INV-T2 value.
- Parts: `ORI-ORO-;Aayan  Ogbufo` 1453–1543 (`4975303b…c2fe035cea50`), `ASA` 1547–1569 (`fa33ca7c…49d56f46`), `IWE AKATILEWA` 1571–1575 (`0d43a86e…c9f9d2ad`), `ISE ASETILEWA` 1577–1597 (`c07a37ab…840a999e`), `APA KEJI` 1599–1609 (`c3041498…aab11ad9`).
- There is **no LITIRESO part**, and the EDE and ASA strands have no label beyond their part headings.
- The parser produces **no rows** for this source: the extraction contains zero `week` substrings and zero bare-number lines, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run. No `SS1-SRC-ec4a5095420d:BODY:<sha256>` identity exists; all 16 coverage entries cite exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (`word/document.xml` has zero `w:tbl`, `w:drawing`, `w:pict`, `w:object`, `w:OLEObject` and `m:oMath`). The four types, the six rules and the six pairs are plain paragraphs.

## Coverage entries added (16)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W05-SCHEME-EDE` | Scheme EDE objectives: aayan ogbufo and ilana sise aayan ogbufo | 57; 1453–1543 | `230a463d…`; `4975303b…` | PARTIAL |
| `YO-T2-W05-EDE-01` | Aayan ogbufo defined: rendering one language in another | 1453–1461 | `0fb18f89…` | PARTIAL |
| `YO-T2-W05-EDE-02` | Translator prerequisites: English knowledge and Yoruba depth | 1465 | `4187ceb0…` | PARTIAL |
| `YO-T2-W05-EDE-03` | Six translation rules and cautions | 1469–1489 | `eee9b750…` | PARTIAL |
| `YO-T2-W05-EDE-04` | Six English–Yoruba translation pairs | 1491–1529 | `8f3d1af1…` | PARTIAL |
| `YO-T2-W05-ASSESS-EDE` | Passage translation exercise with an unlabelled rendering | 1531–1543 | `cbaa6f58…` | PARTIAL |
| `YO-T2-W05-SCHEME-ASA` | Scheme ASA objectives: four types, nisu loka, gbigbe ese le iyawo, ana sise | 59–65; 1547–1569 | `a783988e…`; `cc291075…`; `37a0081b…`; `fa33ca7c…` | PARTIAL |
| `YO-T2-W05-ASA-01` | The four marriage types listed | 1549–1561 | `e73b977a…` | PARTIAL |
| `YO-T2-W05-ASA-02` | Igbeyawo nisu loka: the proper marriage | 1563 | `01c89bbb…` | PARTIAL |
| `YO-T2-W05-ASA-03` | Jiji iyawo gbe: the irregular marriage | 1565 | `61c0c02b…` | PARTIAL |
| `YO-T2-W05-ASA-04` | Pade mi ni diiko: agreement and meeting at the farm | 1567 | `c45958c9…` | PARTIAL |
| `YO-T2-W05-ASA-05` | Gbigbe ese le iyawo: the oba taking an asesegbe | 1569 | `90a4dd8b…` | PARTIAL |
| `YO-T2-W05-ASA-06` | Ana sise ni ile Yoruba | 65; none | `37a0081b…` | UNRESOLVED |
| `YO-T2-W05-SCHEME-LIT` | Scheme LITIRESO objective: itupale asayan iwe litireso | 67; none | `f698bad3…` | UNRESOLVED |
| `YO-T2-W05-ASSESS-ISE` | Empty Iwe akatilewa; five MCQs | 1571–1575; 1577–1597 | `0d43a86e…`; `c07a37ab…` | PARTIAL |
| `YO-T2-W05-ASSESS-APA` | Apa keji: explain three marriages; four things before translating | 1599–1609 | `c3041498…` | PARTIAL |

Full values are reproducible with the method above. The 14 PARTIAL entries mean the source teaches the objective (or sets the exercise) but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching. The 2 UNRESOLVED entries mean the objective is in the scheme but the body teaches nothing.

## What each part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| Aayan ogbufo | 1461 | Prerequisites 1465; six rules 1469–1489; six pairs 1491–1529 | Passage 1531–1543 |
| Ilana sise aayan ogbufo | — | **Rules only, no ordered procedure** | — |
| Igbeyawo nisu loka | 1563 | Full rites, procedure and steps; both families contribute | MCQ 1591; Apa keji 1603 |
| Jiji iyawo gbe | 1565 | Snatched on the market or river road; not proper | — |
| Pade mi ni diiko | 1567 | Agreement to flee; meeting at `idi oko` | MCQ 1593; Apa keji 1605 |
| Gbigbe ese le iyawo | 1569 | Oba takes an `asesegbe`; she becomes his wife at once; husband silent | MCQ 1587; Apa keji 1607 |
| Ana sise | — | **Not taught** | — |
| Itupale asayan iwe litireso | — | **No body** | — |

## Source defects (open item `YORUBA-T2-W05-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 57 | Double space after `karun-un`; the two EDE objectives joined by a semicolon; `Ede-` hyphen |
| 2 | 59 | En dash after `Asa` where the EDE row uses a hyphen |
| 3 | 61, 63 | Sub-items unpunctuated; 63 and 65 indented |
| 4 | 67 | `Litireso-` hyphen run into the title; no teaching body |
| 5 | 1453 | `ORI-ORO-;Aayan` runs the separator into the title; double space |
| 6 | 1461 | No full stop; no example |
| 7 | 1465 | Space before comma; `tifun tedo` and `tusu` garbled |
| 8 | 1469 | `ode miiran` for `ede miiran` |
| 9 | 1473 | `okookan`; long run-on ending `so ewa ati itumo iru ayoka bee nii` |
| 10 | 1477 | `tu nu` split |
| 11 | 1481 | Double space; trailing space; capital `Pataki`; `akoto to muna doko` garbled |
| 12 | 1485 | `erefee` unclear |
| 13 | 1489 | `lo oruko` |
| 14 | 1495 | `harchet` for hatchet |
| 15 | 1497 | No full stop |
| 16 | 1501 | `fight` for fights; proverb altered |
| 17 | 1515 | Trailing tab |
| 18 | 1519 | Trailing space |
| 19 | 1531 | No full stop; `Tumo ayoka` unmarked |
| 20 | 1535 | `good good` for good food; `hard-shelled egg` singular |
| 21 | 1543 | `farablae`; the English clause out of their reach dropped |
| 22 | 1549 | `ORISIIRISII`; trailing tabs |
| 23 | 1553 | `Orisiirisii` |
| 24 | 1555–1561 | Four types indented and unnumbered |
| 25 | 1563 | Hyphen and colon fused; no space after the commas in `to,ati` and `o ye,ti`; no space after `ye.Eyi` |
| 26 | 1565 | Double space; hyphen and semicolon fused; `ko tona`; space before comma; `fe fe`; `oja,lona` |
| 27 | 1567 | `idiko` against `diiko` at 1559; `nip e`; trailing space and no full stop |
| 28 | 1569 | Double spaces; hyphen and semicolon fused; `asesegbe`, `sese`, `lesekese`, `nnkankan`, `tie yin re wa` unclear |
| 29 | 1571 | `IWE AKATILEWA` heading with no reference |
| 30 | 1579–1581 | Run of dashes; `Ologbifo`; option `(d) ogbufo` repeats the stem |
| 31 | 1583 | `problem.tumo si` run together |
| 32 | 1585 | Capital in option `(a)` only; no stop after the option list |
| 33 | 1577–1597 | Every option list `(a)`, `(b)`, `(d)` with `c` omitted; no key |
| 34 | 1593, 1597, 1607 | Body form `gbigbe ese le iyawo` reworded as `iyawo gbigbe ese le` and `Iyawo ti a gbese le` |
| 35 | 1599–1609 | Two questions with no answer; `jiji iyawo gbe` omitted; four things requested where six rules are listed |
| 36 | 1451–1610 | The whole section is ASCII: no tone, no sub-dot, no `ẹ` or `ọ` |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T2-W05-NOTATION`)
- Week 5 (lines 1451–1610) contains **no non-ASCII character at all**: no precomposed diacritic, no combining mark, no curly quote and no dash. It is as unmarked as Weeks 1 and 4 and stricter than Week 2, which carried 13 non-ASCII characters (8 o-acute, 4 u-grave and one soft hyphen), and Week 3, which carried 124 diacritics confined to its heading, definition and type-list lines.
- Consequently e/ẹ and o/ọ cannot be distinguished anywhere in the week and no tone is marked, although every key term depends on both: `aayan`, `ogbufo`, `titumo`, `ayoka`, `igbeyawo`, `nisu loka`, `jiji iyawo gbe`, `pade mi ni diiko`, `gbigbe ese le iyawo`, `ana sise`, `oba`, `asesegbe`, `afesona` and `idi oko`. The scheme row carries one en dash at line 59, outside the section. No marks were added or normalised.

## Assessment, visuals and references
- Five exercise blocks, none with an answer, solution or marking scheme: the six pairs 1491–1529 (both sides given, no reasoning), the passage exercise 1531–1543 (an unlabelled Yoruba rendering, no commentary), Ise asetilewa 1577–1597 (five MCQs), Apa keji 1599–1609 (two questions) and Iwe akatilewa 1571–1575 (heading only). Recorded as `YORUBA-T2-W05-ASSESSMENT-GAPS`.
- Every MCQ option list is `(a)`, `(b)`, `(d)` with `c` omitted; Q1's stem is a run of dashes and offers `Ologbifo` beside `ogbufo`; Q2 runs `problem.tumo si` together; Q5's option `(b)` rewords the body form. The pairs and the passage give no explanation of why each rendering was chosen.
- `IWE AKATILEWA` 1571–1575 lists **no reference at all**, so Week 5 has none. Recorded in `YORUBA-T2-W05-ASSESSMENT-GAPS` and `YORUBA-T2-W05-CONTENT-GAPS`.
- The document contains **no Word table, drawing, picture, OLE object, equation or media file**. The rules, types and pairs are plain paragraphs; no VISUAL_DISPOSITION item is raised.

## Queue changes
- YO-WK-T2-W05 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 items, all depending on `YO-SRC-T2` and `YO-WK-T2-W05`:
  - `YO-LES-T2-W05-EDE`, `YO-LES-T2-W05-ASA`, `YO-LES-T2-W05-LIT` (LESSON, PENDING, also depending on `YO-FACT-T2-W05-DEFECTS`) — replacement lessons for the translation, marriage-type and absent literature strands.
  - `YO-FACT-T2-W05-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) — one recorded expert decision on the defects and the notation.
- Counts: items 96 → 100; kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 24 implemented / 62 pending / 14 blocked; `counts` sums to 100. Coverage 190 → 206; open items 73 → 79; notes 28 → 29; `next_runnable` → `YO-WK-T2-W06`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records Weeks 1–5 (14, 15, 18, 18 and 16 coverage entries) and leaves Weeks 6–12, the 2nd Term preamble and foundation item, and the 3rd Term outstanding.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The row identity gap is recorded, not resolved: whether the nine 2nd Term section labels can be introduced by `split_before` belongs to `YO-FND-T2-01` (PENDING). No objective was invented beyond the text, and the translation-procedure, `ana sise` and literature gaps are recorded as open items rather than filled.

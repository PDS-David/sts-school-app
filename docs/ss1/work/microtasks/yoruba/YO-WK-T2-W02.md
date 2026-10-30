# YO-WK-T2-W02 — Yoruba, 2nd Term, Week 2 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 2 is **not delivered**: 13 coverage entries are PARTIAL and 2 UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `aa51b1b` (the `ss1/yo-wk-t2-w01` tip; PR #210 open against `ss1/yo-fnd-t1-01`), stacked on the merged #199–#207 chain. `origin/master` is still `9f745bb` and carries only PR #199. This item's PR targets `ss1/yo-wk-t2-w01`.
- Prerequisites `YO-SRC-T2` and `YO-WK-T2-W01` are `IMPLEMENTED_TESTING_DEFERRED`. No open PR owned YO-WK-T2-W02 when work started.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run**, matching the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically to the same extraction, as noted below.

## Scheme mapping
- The 2nd Term scheme is a paragraph list headed `ILANA ISE OSOOSE FUN SAA KEJI` (line 7). The Week 2 row is lines 27–35, SHA-256 `b53285363baae5728ce43137e19f236e58d9c264234c8cb54fdaee1319d33650`. The EDE objective shares its line with the week label (`Ose keji  Ede- Awon isori gbolohun gege bi ihun won.`, line 27); the two ASA items and the LITIRESO item follow as separate paragraphs.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| `Ose keji  Ede- Awon isori gbolohun gege bi ihun won.` | 27 | `4ace69f0…95c49564` | EDE part 859–937 |
| `Asa-  Oge sise` | 29 | `a20e828e…c7bb3711` | **No teaching body** |
| `Aso wiwo laarin okunrin ati obinrin` | 31 | `a2cb3bae…58786627` | ASA part 947–997 |
| `Awon ayipada ti o de ba aso wiwo aye atijo ati ode-oni.` | 33 | `e0e13ec1…f64289cc` | ASA part 999–1019 |
| `Litireso- Itupale asayan iwe litireso.` | 35 | `f698bad3…e5fd542e` | **No teaching body** |

- The body teaches three **structural** sentence types (`eleyo oro-ise`, `olopo oro-ise`, `alakanpo`) at 859–927. Line 863 nevertheless says sentences are named by the work they do, and line 911 defines `gbolohun ase`; both belong to the Week 3 function classification (`Ose keta    Ede- Awon isori gbolohun gege bi ise won.`, line 37). The exercises at 1035, 1039 and 1063–1065 also test the function types `alaye`, `ase` and `ibeere`, which Week 2 does not teach.
- `Oge sise` is named in the scheme at line 29 and recurs from Week 1 (line 21), but Week 2 teaches nothing: it appears only as `Oge odi sise` at 1005 and in the questions at 1023, 1025, 1067 and 1069. The Week 1 replacement lesson `YO-LES-T2-W01-ASA` is therefore reused rather than duplicated.
- LITIRESO has no body at all: no heading, no selected text, no instruction in 855–1074.
- The mapping inference is recorded as `YORUBA-T2-W02-SCHEME-MAPPING`; classification of the whole 12-row scheme belongs to `YO-PRE-T2-1` (PENDING).

## Section
- Teaching label `OSE KEJI`, line 855, SHA-256 `a22da429bb21ce15cdb9daf531aebe39dbae2143a01bad8841d6ff34b1211409`; section lines 855–1074, SHA-256 `95fd2ac951255d2721b66c9c3017933c6ad7cb7f9b8a25ee576f1bf059f0d61a`, equal to the YO-INV-T2 value.
- Parts: `ORI-ORO-   AWON ISORI GBOLOHUN GEGE BI IHUN WON.` 859–937 (`ac85e3c5…0f51caf4`), `ASA` 943–1027 (`e0e18801…32734ff8`), `IWE AKATILEWA` 1029–1031 (`b6a0e958…c3bb1054`), `ISE ASETILEWA` 1033–1053 (`9e13532f…366ed68`), `APA KEJI` 1055–1071 (`f9fd256a…647bb95`).
- There is **no LITIRESO part**. The ASA part carries three headings: `ORI-ORO-;ASO WIWO LAARIN OKUNRIN ATI OBINRIN` (945), `Ayipada ti o de baa so wiwo aye atijo` (999), and `Igbelewon` (1021); line 943 is the part heading.
- The parser produces **no rows** for this source: the extraction contains zero `week` substrings and zero bare-number lines, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run. No `SS1-SRC-ec4a5095420d:BODY:<sha256>` identity exists; all 15 coverage entries cite exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.
- The document contains no Word table, drawing, picture, OLE object, equation or media file: `word/document.xml` has zero `w:tbl`, `w:drawing`, `w:pict`, `w:object`, `w:OLEObject` and `m:oMath` elements. The sentence-example grid and the garment lists are tab-aligned paragraphs, so their column pairing is flattened in the extraction but recoverable from the tabs.

## Coverage entries added (15)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W02-SCHEME-EDE` | Scheme EDE objective bound to the structural sentence part | 27–35; 859–937 | `b5328536…`; `ac85e3c5…` | PARTIAL |
| `YO-T2-W02-EDE-01` | Gbolohun defined; the three ihun types named | 861–871 | `d62c1c11…`; `5a1206ba…` | PARTIAL |
| `YO-T2-W02-EDE-02` | Gbolohun eleyo oro-ise: definition, two constituents, four examples | 873–891 | `8e7838be…` | PARTIAL |
| `YO-T2-W02-EDE-03` | Gbolohun olopo oro-ise: definition, verb-count rule, examples | 895–909 | `915b3b96…` | PARTIAL |
| `YO-T2-W02-EDE-04` | Gbolohun alakanpo: definition, part independence, connectors, examples | 911–927 | `931e5dcb…` | PARTIAL |
| `YO-T2-W02-SCHEME-ASA` | Scheme ASA objectives: Oge sise, aso wiwo, changes in dress | 29–33; 943–1027 | `a20e828e…`; `a2cb3bae…`; `e0e13ec1…`; `e0e18801…` | PARTIAL |
| `YO-T2-W02-ASA-01` | Oge sise: definition and old-time forms | 29; none | `a20e828e…` | UNRESOLVED |
| `YO-T2-W02-ASA-02` | Aso wiwo: definition and the three classes | 947–959 | `2cabca20…` | PARTIAL |
| `YO-T2-W02-ASA-03` | Men and women clothing compared, with garment lists | 961–997 | `091bcd76…` | PARTIAL |
| `YO-T2-W02-ASA-04` | Changes in dress from the old days to the present | 999–1019 | `16a18796…` | PARTIAL |
| `YO-T2-W02-SCHEME-LIT` | Scheme LITIRESO objective: Itupale asayan iwe litireso | 35; none | `f698bad3…` | UNRESOLVED |
| `YO-T2-W02-ASSESS-EDE` | Igbelewon: explain the three structural types with two examples each | 929–937 | `81260ebd…` | PARTIAL |
| `YO-T2-W02-ASSESS-ASA` | Igbelewon: oge sise, old-time adornment, five garments per sex | 1021–1027 | `5e4b3466…` | PARTIAL |
| `YO-T2-W02-ASSESS-ISE` | Ise asetilewa: five MCQs; reading list | 1029–1053 | `b6a0e958…`; `9e13532f…` | PARTIAL |
| `YO-T2-W02-ASSESS-APA` | Apa keji: alakanpo, ase and ibeere prompts; repeated oge/garment questions | 1055–1071 | `f9fd256a…` | PARTIAL |

Full values are reproducible with the method above. The 13 PARTIAL entries mean the source teaches the objective (or sets the exercise) but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching. The 2 UNRESOLVED entries mean the objective is in the scheme but the body teaches nothing.

## What each part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| EDE introduction | 861 (garbled) | 863 naming by function (Week 3 material); 865 introduction by structure; type list 867–871 unnumbered | Igbelewon 929–937 |
| Gbolohun eleyo oro-ise | 873–877 | Two constituents (apola oro-oruko, apola oro-ise); four examples 879–891 in a tab grid, headings at 883 | none |
| Gbolohun olopo oro-ise | 895–897 | Verb-count rule 895; example 901 decomposed into two clauses 903–905; two further examples 907 and 909 left undecomposed | none |
| Gbolohun alakanpo | 913 | Parts can stand alone; example 917–921; connectors 923 (`ati, amo, sugbon`); examples 925 and 927; stray `gbolohun ase` definition at 911 | none |
| Aso wiwo | 947–951 | Kinds of dress 953–959 (`Aso ise`, `Aso iwole`, `Aso imurode`), unnumbered | Igbelewon 1021–1027 |
| Men and women compared | 961 | Tab list 963–997: five paired rows (965–973), women column ends at `ipele` 973, men column to `Adiro` 997 | Ise asetilewa 1033–1053 |
| Changes in dress | 999–1005 | Modern dress 1007–1019: six garments (`Kootu`, `Seeti`, `Tai`, `Sokoto`, `Kaba`, `Sikeeeti`) | Apa keji 1055–1071 |

## Source defects (open item `YORUBA-T2-W02-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 861 | Definition garbled: `ni ipede ti o kun to si ni ise ti on je` |
| 2 | 863 | Sentences named by the work they do inside a structure lesson; this is the Week 3 classification |
| 3 | 875 | `oro-lse` for `oro-ise` |
| 4 | 883–891 | Two-column example grid is tab-aligned paragraphs, not a table; pairing is flattened in the extraction |
| 5 | 901–909 | Only the first `olopo` example is decomposed; 907 and 909 are not, although the stated rule requires it |
| 6 | 911 | `gbolohun ase` definition interrupts the alakanpo section and belongs to Week 3 |
| 7 | 915 | Stray `ap` fragment between the alakanpo definition and its example |
| 8 | 923 | Connector list ends with a comma and names only `ati`, `amo` and `sugbon` |
| 9 | 925 | `gbafe` in `Titi ati Folake n gbafe ni ita` is unclear |
| 10 | 933 | `Gblolohun` for `Gbolohun` |
| 11 | 947, 949 | `Aso wiwo-;` punctuation; `Bakan naa` and `dun un wo` phrasing |
| 12 | 951, 961, 1001 | `Orisiirisii` |
| 13 | 961 | Run-on paragraph: missing spaces (`ki i`, `afinju niyi`), `yato gedegbe si`, and `ki I` later in the line |
| 14 | 963–997 | Five paired rows then the columns collapse: the women column stops at `ipele` 973 while the men column continues to 997; `buba` appears in both columns (965) although 961 forbids sharing; `Adiro` appears twice (967, 997) |
| 15 | 967, 969 | Column pairs run `Adiro`/`iro` and `Dandoogo`/`gele`; garment lists are unnumbered |
| 16 | 975–997 | Case is inconsistent (`sooro` lowercase, `Kamu` capitalised); 995 writes `Origi/ ikori` |
| 17 | 999 | `de baa so wiwo` for `de ba aso wiwo` |
| 18 | 1001 | `aye-ode oni` hyphenated and joined to `asa igbalode` without a space |
| 19 | 1003 | Garbled sentence (`Aso lo n basiri ara ju sugbon...`) |
| 20 | 1005 | `Oge odi sise`; `on wo` for `n wo` |
| 21 | 1007 | `ode-ni` for `ode-oni` |
| 22 | 1023–1027 | Numbering runs `1`, `b`, `d`; `a` and `c` are missing |
| 23 | 1027 | `marun-unmarun-un` |
| 24 | 1031 | Reference abbreviation `o.i` undefined; double space in the title; no author or edition |
| 25 | 1035–1053 | Every MCQ option list is `(a)`, `(b)`, `(d)`; `c` is omitted |
| 26 | 1039 | `Gbolohun kani` |
| 27 | 1047 | `pea so` for `pe aso` |
| 28 | 1053 | U+00AD produced by a single `w:softHyphen` run before option `(a)` |
| 29 | 1067–1071 | Numbering runs `2`, `b`, `d`; 1067 writes `2,`; the three questions repeat 1023–1027 with slight rewording |
| 30 | 873, 895, 911 | Orthography: `gbolohun` carries diacritics only at these lines and is unmarked elsewhere |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T2-W02-NOTATION`)
- Week 2 (lines 855–1074) contains **13 non-ASCII characters**: 8 `ó` and 4 `ù`, all inside the word `gbolohun` at 873, 895 (twice) and 911, plus one U+00AD produced by a single `w:softHyphen` run at 1053. The soft hyphen is not in a `w:t` run; `word/document.xml` contains no literal U+00AD.
- There is no `ẹ` and no `ọ`, and tone is unmarked except for those four words, so e/ẹ and o/ọ cannot be distinguished and the orthography is inconsistent within the week as well as incomplete. No marks were added or normalised.

## Assessment, visuals and references
- Four exercise sets, none with an answer, solution or marking scheme: Igbelewon 929–937 (explain the three structural types with two examples each), Igbelewon 1021–1027 (define oge sise, name old-time adornment, name five clothes per sex; numbered 1, b, d), Ise asetilewa 1033–1053 (five MCQs, options `(a)`, `(b)`, `(d)`) and Apa keji 1055–1071 (three prompts plus a rewording of the oge and garment questions numbered 2, b, d). Recorded as `YORUBA-T2-W02-ASSESSMENT-GAPS`.
- Two MCQ items and two Apa keji prompts test `alaye`, `ase` and `ibeere`, which Week 2 does not teach. Q5 (1051–1053) offers `iro`, `sikeeti` and `oyala`, all still worn, so the single-answer intent is unstated.
- `IWE AKATILEWA` 1029–1031 lists one reference: `Simplified Yoruba Language Literature and  Culture bk 1 o.i 82-85,21-27.` The abbreviation `o.i` is undefined and no author or edition is given.
- The document contains **no Word table, drawing, picture, OLE object, equation or media file**. The `Aso okunrin`/`Aso obinrin` grid and the sentence-example grid are tab-aligned paragraphs; no VISUAL_DISPOSITION item is raised.

## Queue changes
- YO-WK-T2-W02 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 items, all depending on `YO-SRC-T2` and `YO-WK-T2-W02`:
  - `YO-LES-T2-W02-EDE`, `YO-LES-T2-W02-ASA`, `YO-LES-T2-W02-LIT` (LESSON, PENDING, also depending on `YO-FACT-T2-W02-DEFECTS`) — replacement lessons for the EDE and ASA strands and for the untaught literature objective. `Oge sise` is not duplicated; it stays with `YO-LES-T2-W01-ASA`.
  - `YO-FACT-T2-W02-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) — one recorded expert decision on the defects and the notation.
- Counts: items 84 → 88; kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 21 implemented / 56 pending / 11 blocked; `counts` sums to 88. Coverage 139 → 154; open items 55 → 61; notes 25 → 26; `next_runnable` → `YO-WK-T2-W03`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records Weeks 1 and 2 (14 and 15 coverage entries) and leaves Weeks 3–12, the 2nd Term preamble and foundation item, and the 3rd Term outstanding.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The row identity gap is recorded, not resolved: whether the nine 2nd Term section labels can be introduced by `split_before` belongs to `YO-FND-T2-01` (PENDING). No objective was invented beyond the text, and the `Oge sise` and literature gaps are recorded as open items rather than filled.

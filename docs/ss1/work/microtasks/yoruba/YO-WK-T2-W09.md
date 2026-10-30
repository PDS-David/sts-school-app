# YO-WK-T2-W09 — Yoruba, 2nd Term, Week 9 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 9 **has** a body: 13 coverage entries are PARTIAL and 4 are UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `5b2f80a` (the `ss1/yo-wk-t2-w08` tip, PR #220 still open against `ss1/yo-wk-t2-w07`), stacked on the merged chain: the owner merged PR #211 (W02 into W01), #212 (W03), #213 (W04), #215 (W05), #216 (W06), #218 (W07) and #219 (W01 into master), so `origin/master` is now `b85fd07` and contains Weeks 1–2 while Weeks 3–8 exist only in the stacked branches and PR #220 remains open; the whole chain still sits on the merged #199–#207 base. This item's PR targets `ss1/yo-wk-t2-w08`.
- Prerequisites `YO-SRC-T2` and `YO-WK-T2-W08` are `IMPLEMENTED_TESTING_DEFERRED`. No open PR owned YO-WK-T2-W09 when work started.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run**, matching the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically to the same extraction, as noted below.

## Scheme mapping
- The 2nd Term scheme is a paragraph list headed `ILANA ISE OSOOSE FUN SAA KEJI` (line 7). The Week 9 row is lines 107–123, SHA-256 `d6f35818a8c31544d32b7324e5e17c62e5c2ab03c70b71b42b11fb7b0dda6027`, equal to the YO-INV-T2 value.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| `Ose kesan-an` | 107 | `e7e643ec…fd6c6b79` | Label; body `OSE KESAN-AN` 2017 |
| `  EDE-Aroko asotan/ oniroyin.` | 109 | `f4f5c780…7ab66a08` | Aroko oniroyin 2019–2039; `asotan` never used |
| `           Orisii  ori-oro ti o je mo aroko oniroyin` | 111 | `d3524479…713d9fe5` | Six example headings 2027–2039 (examples only) |
| `  Asa-  Orisii oruko ti a le so omo` | 113 | `d3104e4b…1b10c034` | 2049–2063, four types |
| `oruko amutorunwa` | 115 | `dbcfe89c…3ff24af5` | 2065–2091 |
| `abiso abbl` | 117 | `ff8852f7…5e6fe9f3` | 2127–2181 (abbl. also covers abiku 2093–2111 and inagije 2115–2123) |
| `Litireso alohun oloro wuuru; Aalo orisirisi- apamo, apagbe,` | 119 | `849536f6…423e6ce19` | **None** |
| `iwulo aalo` | 121 | `79703d93…f83f36` | **None** |
| `awon ona ede ti o wa ninu aalo.` | 123 | `df21f697…ab680308` | **None** |

- The row names three strands: EDE at 109 with an unlabelled second item at 111, ASA at 113 with two sub-items (115, 117) and LITIRESO at 119 with two sub-items (121, 123). Line 111 carries no strand prefix; it is read as an EDE sub-item because it follows 109 and repeats that line's `aroko oniroyin`, matching the pattern of Week 4's line 47 (`Awon ori-oro to je mo aroko asapejuwe`). The inference is recorded as `YORUBA-T2-W09-SCHEME-MAPPING`; classification of the whole 12-row scheme belongs to `YO-PRE-T2-1` (PENDING).
- The EDE objectives bind to the body: line 109's `aroko oniroyin` is taught at 2019–2039 and tested at 2041–2045, but **`asotan` occurs only at line 109 in the whole extraction**, so whether it names the same genre or a second one is unresolved. Line 111's objective is met only by six bare example headings.
- The ASA objectives bind: 113 → 2049–2063 and the four type lessons; 115 → 2065–2091; 117 → 2127–2181, with `abbl.` also covering the two types the scheme does not name (abiku, inagije). The body teaches **four** types while Apa keji 2217 asks for **five**.
- The LITIRESO objectives have **no binding anywhere**: `aalo`, `apamo` and `apagbe` occur only at 119, 121 and 123 in the whole 2,433-line extraction, no exercise mentions `aalo`, Week 10 names a different literature objective (`ewi alohun`, line 137) and its body has no literature part either, and Week 7's literature body (1927–1961) teaches `litireso atenudenu` and burial customs.

## Section
- Teaching label `OSE KESAN-AN`, line 2017, SHA-256 `500bb67fad1eddfec7685119697b9a6db9c67b03cce73cad17a738f371d4aeab`, char offset 44,273; section lines 2017–2220, SHA-256 `3e932ecb11eccf939fc6ce930c950547a896cdac5dc7959903fb24632d9d48d9`, equal to the YO-INV-T2 value.
- Parts: EDE 2019–2045 (`732c20d3…0ee4220c`), with `Ori-oro-; Aroko oniroyin` 2019, `Akoonu:` 2021, definition 2023, prerequisite 2025, examples 2027–2039 and `Igbelewon` 2041–2045; `ASA` 2047–2189 (`29ed1c7e…a002689d`), with the heading 2049, `Akoonu` 2051, importance 2053, the four-type outline 2055–2063, amutorunwa 2065–2091, abiku 2093–2111, inagije 2115–2123, abiso 2127–2181 and `Igbelewon` 2185–2189; `IWE AKATILEWA` 2191–2193 (`b298f229…dc59644a`); `ISE ASETILEWA` 2195–2213 (`6f53546c…da785d2`); `APA KEJI` 2215–2219 (`69ba4c1b…0a41538ec`).
- **There is no LITIRESO part.** The section has no literature heading, no `aalo` text, no literature exercise and no literature reference; the only literature word inside 2017–2220 is the book title in the reference at 2193. The single reference, `Imo,Ede ASA Ati Litireso.Adewoyin S.Y o.i 298-301.` at 2193, cites a general textbook (the same book cited at 1411 for pages 286–294), not a selected or oral text. Recorded as `YORUBA-T2-W09-LITIRESO-ABSENT`.
- The name lists are tab-aligned paragraphs, not Word tables: 2069–2091, 2097–2111, 2133–2163 and 2171–2181. The document contains no Word table, drawing, picture, OLE object, equation or media file (YO-INV-T2).
- The parser produces **no rows** for this source: the extraction contains zero `week` substrings and zero bare-number lines, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run. No `SS1-SRC-ec4a5095420d:BODY:<sha256>` identity exists; all 17 coverage entries cite exact line ranges and UTF-8 block hashes, with `lesson_ids: []`. Recorded as `YORUBA-T2-W09-ROW-IDENTITY`.

## Coverage entries added (17)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W09-SCHEME-EDE` | Scheme EDE objectives: aroko asotan/oniroyin and the ori-oro that belong to it | 109–111; 2019–2045 | `bfc9052a…24374d1`; `732c20d3…0ee4220c` | PARTIAL |
| `YO-T2-W09-EDE-01` | Aroko oniroyin: definition, likeness to aroko asapejuwe, reading prerequisite | 2023–2025 | `8359b8b6…ed72551` | PARTIAL |
| `YO-T2-W09-EDE-02` | Orisii ori-oro: the six example report headings | 2027–2039 | `3ed14ec2…a0bfa0` | PARTIAL |
| `YO-T2-W09-SCHEME-ASA` | Scheme ASA objectives: orisii oruko, oruko amutorunwa, abiso abbl. | 113–117; 2047–2189 | `813c8cc4…fab7cbb`; `29ed1c7e…a002689d` | PARTIAL |
| `YO-T2-W09-ASA-01` | Why names matter and the four types listed | 2049–2063 | `41570e95…f8f499b2` | PARTIAL |
| `YO-T2-W09-ASA-02` | Oruko amutorunwa: definition and ten names | 2065–2091 | `42ab059e…18a6742e` | PARTIAL |
| `YO-T2-W09-ASA-03` | Oruko abiku: definition, purpose and seven names | 2093–2111 | `6cd68a62…6f83ae176` | PARTIAL |
| `YO-T2-W09-ASA-04` | Oruko inagije: definition and four praise names | 2115–2123 | `26329c9c…d19dcd3b` | PARTIAL |
| `YO-T2-W09-ASA-05` | Oruko abiso: definition, eight positions/religions, three circumstance names | 2127–2181 | `8e9c07be…4f4bc42b5f` | PARTIAL |
| `YO-T2-W09-SCHEME-LIT` | Scheme LITIRESO: litireso alohun oloro wuuru, aalo types, iwulo aalo, ona ede | 119–123 | `516dbfa2…7396d18cb` | UNRESOLVED |
| `YO-T2-W09-LIT-01` | Aalo: the types apamo and apagbe | 119 | `849536f6…423e6ce19` | UNRESOLVED |
| `YO-T2-W09-LIT-02` | Iwulo aalo: the uses of aalo | 121 | `79703d93…f83f36` | UNRESOLVED |
| `YO-T2-W09-LIT-03` | Awon ona ede ninu aalo: the language devices | 123 | `df21f697…ab680308` | UNRESOLVED |
| `YO-T2-W09-ASSESS-EDE` | Igbelewon 2041–2045: report on a recent naming | 2041–2045 | `7e78b604…420e700c2` | PARTIAL |
| `YO-T2-W09-ASSESS-ASA` | Igbelewon 2185–2189: define oruko, name the types | 2185–2189 | `072f590b…4a10e3a0` | PARTIAL |
| `YO-T2-W09-ASSESS-ISE` | Iwe akatilewa 2191–2193 and Ise asetilewa 2195–2213 | 2191–2193; 2195–2213 | `b298f229…dc59644a`; `6f53546c…da785d2` | PARTIAL |
| `YO-T2-W09-ASSESS-APA` | Apa keji 2215–2219: five name types; essay on Christmas | 2215–2219 | `69ba4c1b…0a41538ec` | PARTIAL |

Full values are reproducible with the method above. The 13 PARTIAL entries mean the source teaches or exercises the objective but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects and gaps below must be resolved before teaching. The 4 UNRESOLVED entries are the whole literature strand, which is named in the scheme and taught nowhere; `asotan` and the unnumbered types are recorded as gaps rather than as missing objectives.

## What each part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| EDE aroko oniroyin | 2019; `Akoonu:` 2021 (no outline follows) | Definition and likeness to aroko asapejuwe 2023; reading prerequisite 2025; six example headings 2029–2039 | Igbelewon 2041–2045 (one report task) |
| ASA name types | 2049; `Akoonu` 2051 (no outline follows); importance 2053; outline 2055–2063 | amutorunwa 2065–2091 (ten rows); abiku 2093–2111 (seven); inagije 2115–2123 (four); abiso 2127–2181 (eight position/religion rows, three glossed circumstance names) | Igbelewon 2185–2189 |
| LITIRESO aalo | None | None | None |

- Thin and missing content is recorded as `YORUBA-T2-W09-CONTENT-GAPS`: the untaught report structure and the never-used `asotan`, the unglossed `Abiona` row and the twice-glossed `Oke` in `amutorunwa`, the unexplained abiku principle, the thin inagije and abiso decoding, and the naming day tested by Ise asetilewa Q1 but never taught.

## Source defects (open item `YORUBA-T2-W09-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 109 | `EDE-Aroko` fuses the strand and topic with a hyphen; `asotan/ oniroyin` joins two topics with a slash |
| 2 | 111 | Nine leading spaces; double space in `Orisii  ori-oro`; no punctuation |
| 3 | 113 | `Asa-` with no space after the hyphen, then two spaces |
| 4 | 115 | Bare label with no strand, no punctuation |
| 5 | 117 | `abiso abbl` leaves the abbreviation unexpanded and has no full stop |
| 6 | 119 | `Litireso alohun` fused; hyphen before `apamo`; list ends in a comma, suggesting truncation |
| 7 | 121, 123 | Bare phrases with no punctuation; `ona ede` never defined |
| 8 | 2019 | `Ori-oro-; Aroko oniroyin` runs the separator into the title; no full stop |
| 9 | 2021, 2051 | `Akoonu:` with a colon at 2021 against `Akoonu` with a trailing space and no colon at 2051; neither introduces an outline |
| 10 | 2023 | One unpunctuated run-on; `je mo`, `itan isle`, `sise-n-tele` and `fi ara pe` are fused or garbled; `A rii wi pe o fi ara pe aroko asapejuwe` is the only link to the descriptive essay |
| 11 | 2025 | `iroyin yori` garbled; no final punctuation |
| 12 | 2027 | `ori-or` truncates `ori-oro`; trailing space |
| 13 | 2029 | Garbled `Iroyin ipade maje - o - baje`; two en dashes |
| 14 | 2031 | Lower-case `eko`; no full stop |
| 15 | 2033, 2035, 2037 | No punctuation; `esu gbomi mu` unexplained |
| 16 | 2039 | `odede wa` where the parallel title at 2045 reads `adugbo wa` |
| 17 | 2041, 2043, 2045 | `Igbelewon.` with a full stop; prompt `Ko aroko lori` split from its topic; no length, plan or marks |
| 18 | 2049 | Separator run into the title; lower case after it; no full stop |
| 19 | 2053 | One long run-on; `kii sii deede`, `esin idile baba` and `Yoruba ni ile laawo` are unclear; the whole statement of importance is one sentence |
| 20 | 2057–2063 | The first item `Oruko amutorunwa` has no `i.` while the rest are `ii.`, `iii.`, `iv.`; the list is a bare outline |
| 21 | 2067 | Orphan fragment `Ap` |
| 22 | 2069 | Repeats a heading without the `Oruko / Itumo` headers used at 2097 and 2171 |
| 23 | 2071–2091 | Tab-aligned paragraphs, not a table; `Oke` heads two rows with different glosses (2077, 2081); 2077's gloss runs onto 2079; `Abiona` at 2091 has no gloss; tab counts vary |
| 24 | 2093 | Double space in `fun  omo`; `sit un` fused |
| 25 | 2095 | Ends `duro.ap`, fusing the abbreviation; `ebe` and `epe` undefined |
| 26 | 2099–2111 | Hyphen separators follow differing tab runs; `Kosoko` presupposes an unexplained burial practice; `Aja` is glossed as unfit for a human name |
| 27 | 2115 | Ends `ap` fused to the sentence; `atowoda` unclear |
| 28 | 2117–2123 | `Eyinafe` and `tie` garbled; `Ajisafe` has no full stop; `Oginni` contains the English word `roar` and `n tele`; no praise name is shown being chanted |
| 29 | 2127, 2129 | Trailing space; heading has no punctuation; blank lines separate every row (38 blank lines between 2130 and 2180) |
| 30 | 2135 | `Oba – A` has an en dash and a lone `A` |
| 31 | 2139 | `Eegunjo bi` and a trailing space |
| 32 | 2159 | `Orisa Oko/Idobatala` fuses two deities with a slash |
| 33 | 2167–2181 | Second table gives three glossed names only; heading unpunctuated |
| 34 | 2185–2189 | `IGBELEWON` unpunctuated; numbered `1.` then `b.`; no answer or marks |
| 35 | 2193 | Four-space indent; `Imo,Ede ASA Ati Litireso.Adewoyin S.Y o.i 298-301.` fuses title, author and page reference; `o.i` unexplained; plain hyphen in the page range |
| 36 | 2195–2213 | `ISE ASETILEWA ` trailing space; every option list is `(a)`, `(b)`, `(d)`; blanks of differing length; no space after the question number; line 2205 ends with a slash; `Efunyela` (2207) against the body's `Efunjoke`; `ibule` (2211) against `idubule` (2081); `Oke` repeated as both `(a)` and `(b)` (2213) |
| 37 | 2215–2219 | `APA KEJI` tab-indented; comma fused in `marun-un,pelu`; five types asked against four taught; essay topic on Christmas is not aroko oniroyin; trailing spaces |
| 38 | 2017–2220 | Notation: 3 non-ASCII characters only (three en dashes); no tone, no sub-dot, no `ẹ` or `ọ` |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T2-W09-NOTATION`)
- The Week 9 section contains **three non-ASCII characters**: two U+2013 en dashes inside the garbled title at 2029 (`Iroyin ipade maje – o – baje`) and one U+2013 in `Oba – A` at 2135. The scheme row 107–123 contains none.
- There is therefore no tone mark, no sub-dot and no e-dot or o-dot anywhere in the week, so e/ẹ, o/ọ and s/ṣ cannot be distinguished and no tone is shown, although the objectives depend on both: `oruko`, `isomoloruko`, `amutorunwa`, `abiku`, `inagije`, `abiso`, the `inagije` names such as `Durojaye` and `Kasimaawoo`, the `orisa` names, and `aalo`, `apamo`, `apagbe` and `iwulo` all require tone, and several require sub-dots.
- Week 9 has 3 non-ASCII characters, against 15 in Week 7 and 11 in Week 10; Weeks 4, 5 and 8 have none. No marks were added or normalised.

## Assessment, visuals and references
- Week 9 sets four exercised blocks, none with an answer, key, mark allocation or completion criterion: Igbelewon 2041–2045 (one report task), Igbelewon 2185–2189 (define `oruko`, name the types), Iwe akatilewa 2191–2193 (one book reference) and Ise asetilewa 2195–2213 (five multiple-choice questions), with Apa keji 2215–2219 adding two tasks. Recorded as `YORUBA-T2-W09-ASSESSMENT-GAPS`.
- Every option list is `(a)`, `(b)`, `(d)`, so `c` is omitted throughout; the Igbelewon numbering is `1.` then `b.`; Q1 tests the naming day and weekday names, which the week never teaches; Q3 offers the undefined `abikudanu`; Q4 asks about `Efunyela`, a name the body does not list; Q5 offers `Oke` twice and includes the unglossed `Abiona`; Apa keji 2217 asks for five types of name when four are taught; Apa keji 2219 asks for an essay on last Christmas, which is not an aroko oniroyin.
- Week 9's only reference is `Imo,Ede ASA Ati Litireso.Adewoyin S.Y o.i 298-301.` at 2193: a general grammar, culture and literature textbook, pages 298–301, not a selected literature text, and it supports no literature exercise (there is none). Recorded in `YORUBA-T2-W09-ASSESSMENT-GAPS` and `YORUBA-T2-W09-LITIRESO-ABSENT`.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (YO-INV-T2); the tab-aligned name lists are paragraphs, so no VISUAL_DISPOSITION item is raised.

## Queue changes
- YO-WK-T2-W09 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 items, all depending on `YO-SRC-T2` and `YO-WK-T2-W09`:
  - `YO-LES-T2-W09-EDE`, `YO-LES-T2-W09-ASA`, `YO-LES-T2-W09-LIT` (LESSON, PENDING, also depending on `YO-FACT-T2-W09-DEFECTS`) — replacement lessons for the thin report strand, the name-type inventory and the absent aalo strand.
  - `YO-FACT-T2-W09-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) — one recorded expert decision on the defects, the `asotan` mapping, the five name types, the absent literature content, the reference and the notation.
- Counts: items 112 → 116; kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 28 implemented / 70 pending / 18 blocked; `counts` sums to 116. Coverage 246 → 263; open items 98 → 105; notes 32 → 33; source rules 4; lessons 0; assets 0; `next_runnable` → `YO-WK-T2-W10`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records Weeks 1–9 (14, 15, 18, 18, 16, 14, 17, 9 and 17 coverage entries) and leaves Weeks 10–12, the 2nd Term preamble and foundation item, and the 3rd Term outstanding.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The row identity gap is recorded, not resolved: whether the nine 2nd Term section labels can be introduced by `split_before` belongs to `YO-FND-T2-01` (PENDING). The absent literature strand and the unresolved `asotan` mapping are recorded as open items, not filled: no objective was invented beyond the text, `asotan` is not equated with `oniroyin`, and no fifth name type or aalo content is supplied.

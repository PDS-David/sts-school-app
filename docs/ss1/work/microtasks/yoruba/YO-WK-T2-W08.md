# YO-WK-T2-W08 — Yoruba, 2nd Term, Week 8 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 8 is **not delivered**: the source has **no Week 8 teaching section at all**, so 9 coverage entries are added (3 PARTIAL, 6 UNRESOLVED), 7 open items are raised, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `3942045` (the `ss1/yo-wk-t2-w07` tip; PR #218 open against `ss1/yo-wk-t2-w06`, PR #216 open against `ss1/yo-wk-t2-w05`, PR #215 against `ss1/yo-wk-t2-w04`, PR #213 against `ss1/yo-wk-t2-w03`, PR #212 against `ss1/yo-wk-t2-w02` and PR #211 against `ss1/yo-wk-t2-w01`), stacked on the merged #199–#207 chain. `origin/master` is still `9f745bb` and carries only PR #199. This item's PR targets `ss1/yo-wk-t2-w07`.
- Prerequisites `YO-SRC-T2` and `YO-WK-T2-W07` are `IMPLEMENTED_TESTING_DEFERRED`. No open PR owned YO-WK-T2-W08 when work started.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run**, matching the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically to the same extraction, as noted below.

## Scheme mapping
- The 2nd Term scheme is a paragraph list headed `ILANA ISE OSOOSE FUN SAA KEJI` (line 7). The Week 8 row is lines 93–105, SHA-256 `5e8dee089a86032a35e024eaaf1bffb5a95dafd66ad0971eeca5e0a64e825d37`, equal to the YO-INV-T2 value.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| `Ose kejo- Ede- Atunyewo eko lori eka ede Yoruba; Ijesa, Ekiti,Oyo.abbl.` | 93 | `a96d7616…4bb24be2` | **None** |
| `iwulo Yoruba  Ajumolo` | 95 | `19055b98…0d3f39b3` | **None** |
| `Fifi  eka ede we Yoruba ajumolo` | 97 | `0ff8acc1…03d25063` | **None** |
| `Asa-    Isomoloruko Ni Ile Yoruba` | 99 | `d40b8770…ffea6553` | Week 9 name types 2049–2181 (partial only) |
| `Pataki siso omo loruko` | 101 | `ff07dd17…1bdebfbd` | Week 9 line 2053 (one sentence) |
| `Ohun elo ati isomoloruko.` | 103 | `e4314398…63c1daf8` | **None** |
| `Litireso-Itupale asayan iwe litireso.` | 105 | `ee217196…33f4aedd` | **None** |

- The row names seven lines in three strands: EDE at 93 with two unlabelled followers (95, 97), ASA at 99 with two sub-items (101, 103) and LITIRESO at 105. Lines 95 and 97 carry no strand prefix; they are read as EDE sub-items because they follow 93 and concern the standard language, matching the pattern by which Week 5's unlabelled lines 61–65 follow the ASA line 59. The inference is recorded as `YORUBA-T2-W08-SCHEME-MAPPING`; classification of the whole 12-row scheme belongs to `YO-PRE-T2-1` (PENDING).
- **Every Week 8 objective is untaught in its own week**, because there is no body (below). The EDE objectives have **no binding anywhere**: `Ijesa` and `Ekiti` occur only at line 93 in the whole 2,433-line extraction; the only other `Oyo` is at 1245 (Week 3's account of the gombo tribal mark, said to be common among `awon Oyo,Ogbomoso,Iwo,Ede ati Osogbo`) and the remaining matches are incidental inside `yoboyobo` at 477 and `olooyo` at 2363. `Ajumolo` occurs only at 95 and 97.
- The ASA objectives have one **partial** binding to Week 9: its ASA part at 2049–2181 teaches an inventory of name types — `amutorunwa` (2065–2091), `abiku` (2093–2111), `inagije` (2115–2123) and `abiso` (2127–2181) — and line 2053 states in one sentence that names are important and that elders consider birth circumstances, family position and family religion before naming. Week 9 never describes the naming ceremony, its officiants, order or time, and lists no material.
- The LITIRESO objective at 105 has **no binding anywhere**: `Itupale asayan` occurs only in scheme rows 23, 35, 43, 55, 67 and 105, never in a teaching body. Week 9's own scheme row at 119–123 names `aalo`, but the Week 9 body has no literature part; Week 10's body has only EDE and ASA. The reference at 2193 cites a grammar, culture and literature textbook, not a selected literary text.

## Section
- **There is no Week 8 section.** The extraction contains exactly nine all-capitals `OSE` labels — `OSE KINNI` 149, `OSE KEJI` 855, `OSE KETA` 1075, `OSE KERIN` 1303, `OSE KARUN-UN` 1451, `OSE KEFA` 1611, `OSE KEJE` 1683, `OSE KESAN-AN` 2017 and `OSE KEWAA` 2221 — and none for `OSE KEJO`. A case-insensitive search for `kejo` finds only scheme line 93 and the unrelated `Ikejo (iko ejo) = 8th` at 1719, an ordinal row in Week 7's number table.
- Week 7's `APA KEJI` ends at 2007; lines 2008–2016 are blank and Week 9 begins at 2017. There is no gap into which an extracted section could have been lost, so the only Week 8 text is the scheme row. Recorded as `YORUBA-T2-W08-BODY-ABSENT`.
- Week 8 is an instructional week, unlike Weeks 11 and 12, which are the review and examination rows `Ose kokanla- Agbeyewo ise saa keji lapapo..` (139) and `Ose kejila- Idanwo saa keji.` (141) and have no section by design. Week 8 is the only instructional week of the term with no teaching section.
- Week 9 (2017–2220, SHA-256 `3e932ecb11eccf939fc6ce930c950547a896cdac5dc7959903fb24632d9d48d9`) is the next section: EDE `Aroko oniroyin` 2019–2045 (`732c20d3…0ee4220c`), ASA 2047–2219 (`dbbb5a6e…d5da7baa`), with naming types 2049–2181 and Igbelewon 2185–2189, Iwe akatilewa 2191–2193, Ise asetilewa 2195–2213 and Apa keji 2215–2219. It contains no dialect term, no naming ceremony and no literature part.
- Week 10 (2221–2433, SHA-256 `4f053c8c065a7260053db902b189ad6ce0c0a1a6a8e165cecd2054fcd44e0bd5`) teaches `ISORI ORO-ORUKO` in EDE 2223–2319 (`d0df5e56…8b9e101b`) and `IPOLOWO OJA` in ASA 2323–2433 (`606355a7…ccddfe60`) and has no literature part either, so no later section supplies the missing dialect, naming or literature material.
- The parser produces **no rows** for this source: the extraction contains zero `week` substrings and zero bare-number lines, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run. No `SS1-SRC-ec4a5095420d:BODY:<sha256>` identity can exist for Week 8 at all, because no Week 8 section exists; all 9 coverage entries cite scheme line numbers and UTF-8 line or block hashes, with `lesson_ids: []`.
- Because there is no body, Week 8 has no Word table, drawing, picture, OLE object, equation, media file, exercise or reference. The document-wide finding of YO-INV-T2 is unaffected.

## Coverage entries added (9)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W08-SCHEME-EDE` | Scheme EDE objectives: dialect review (Ijesa, Ekiti, Oyo), iwulo Yoruba ajumolo, comparison with ajumolo | 93–97 | `b1c1e377…534c3322` | UNRESOLVED |
| `YO-T2-W08-EDE-01` | Atunyewo eko lori eka ede Yoruba: the dialect review | 93 | `a96d7616…` | UNRESOLVED |
| `YO-T2-W08-EDE-02` | Iwulo Yoruba ajumolo: the usefulness of standard Yoruba | 95 | `19055b98…` | UNRESOLVED |
| `YO-T2-W08-EDE-03` | Fifi eka ede we Yoruba ajumolo: comparing a dialect with standard Yoruba | 97 | `0ff8acc1…` | UNRESOLVED |
| `YO-T2-W08-SCHEME-ASA` | Scheme ASA objectives: isomoloruko, pataki siso omo loruko, ohun elo ati isomoloruko | 99–103; Week 9 2049–2181 | `dd334eba…0d35e501`; `8ea6a58a…2e6739a7` | PARTIAL |
| `YO-T2-W08-ASA-01` | Isomoloruko ni ile Yoruba: the naming ceremony | 99; Week 9 2049–2181 | `d40b8770…`; `8ea6a58a…` | PARTIAL |
| `YO-T2-W08-ASA-02` | Pataki siso omo loruko: the importance of naming a child | 101; Week 9 2053 | `ff07dd17…`; `392b8477…` | PARTIAL |
| `YO-T2-W08-ASA-03` | Ohun elo ati isomoloruko: the materials used in naming | 103 | `e4314398…` | UNRESOLVED |
| `YO-T2-W08-SCHEME-LIT` | Scheme LITIRESO objective: itupale asayan iwe litireso | 105 | `ee217196…` | UNRESOLVED |

Full values are reproducible with the method above. The 3 PARTIAL entries mean the only taught material is Week 9's name-type inventory and its one-sentence statement of importance, which do not cover the naming ceremony, its importance as a topic or its materials; the 6 UNRESOLVED entries mean the objective is in the Week 8 scheme but nothing anywhere in the extraction teaches it.

## What each part teaches
| Part | Week 8 body | Nearest taught content | Effect |
|---|---|---|---|
| EDE dialect review | None | Week 9 EDE is `Aroko oniroyin` 2019–2045; Week 10 EDE is `oro-oruko` | UNRESOLVED |
| Iwulo ajumolo / comparison | None | Nothing; `ajumolo` only at 95 and 97 | UNRESOLVED |
| Isomoloruko | None | Week 9 name types 2049–2181; `Isomoloruko` at 2039 and 2045 are aroko topics | PARTIAL |
| Pataki siso omo loruko | None | Line 2053, one sentence inside the name-type lesson | PARTIAL |
| Ohun elo ati isomoloruko | None | Nothing; `ohun elo` only at 53 (Week 4 scheme) and 1297 (Week 3 exercise) | UNRESOLVED |
| Itupale asayan iwe litireso | None | Nothing; phrase only in scheme rows 23–105 | UNRESOLVED |

## Source defects (open item `YORUBA-T2-W08-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 93 | `Ose kejo- Ede-` attaches a hyphen directly to `kejo` and to `Ede` (a space follows each) instead of a dash; `Ekiti,Oyo.abbl.` fuses the second and third dialect with no space after that comma and leaves the abbreviation unexpanded; no dialect is marked |
| 2 | 95 | Double space between `Yoruba` and `Ajumolo`; lower-case `iwulo` with no strand prefix; no punctuation |
| 3 | 97 | Double space after `Fifi`; no strand prefix; no punctuation; `we` (to compare) is unglossed |
| 4 | 99 | `Asa-` uses a hyphen without a space and is followed by four spaces; no punctuation |
| 5 | 101 | No strand prefix and no punctuation; a bare phrase |
| 6 | 103 | `ati` fuses the materials objective to isomoloruko; the only one of the three ASA lines with a full stop |
| 7 | 105 | `Litireso-Itupale` fuses the strand label and the objective with no space after the hyphen; unlike 93–101 it ends with a full stop |
| 8 | 93–105 | Notation: zero non-ASCII characters; no tone, no sub-dot, no `ẹ` or `ọ` |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T2-W08-NOTATION`)
- The whole of Week 8's text is the seven scheme lines 93–105, and they contain **zero non-ASCII characters** (nothing above U+007F). There is therefore no tone mark, no sub-dot and no e-dot or o-dot anywhere in the week, so e/ẹ, o/ọ and s/ṣ cannot be distinguished.
- The objectives depend on them: `Ijesa`, `Ekiti` and `Oyo` are dialect names whose spellings require sub-dots and tone; `isomoloruko`, `oruko`, `pataki`, `siso`, `ohun elo`, `ajumolo`, `itupale` and `asayan` all require tone, and several require sub-dots.
- Week 8 has no non-ASCII character at all, as do Weeks 4 and 5; Week 6 had six punctuation characters and Week 7 had fifteen. No marks were added or normalised.

## Assessment, visuals and references
- Week 8 sets **no exercise of any kind**: no Igbelewon, Iwe akatilewa, Ise asetilewa or Apa keji, because there is no body. Recorded as `YORUBA-T2-W08-ASSESSMENT-GAPS`.
- The nearest exercises are Week 9's Igbelewon 2185–2189, Iwe akatilewa 2191–2193, Ise asetilewa 2195–2213 and Apa keji 2215–2219; all test Week 9 content (name types and the aroko oniroyin), not Week 8's objectives. Document-wide the source gives no answers, keys, mark allocation or completion criteria.
- Week 8 has no references. The only reference near it, `Imo,Ede ASA Ati Litireso.Adewoyin S.Y o.i 298-301.` at 2193, belongs to Week 9 and is not a selected literature text.
- Week 8 has no body and therefore no visual; no VISUAL_DISPOSITION item is raised.

## Queue changes
- YO-WK-T2-W08 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 items, all depending on `YO-SRC-T2` and `YO-WK-T2-W08`:
  - `YO-LES-T2-W08-EDE`, `YO-LES-T2-W08-ASA`, `YO-LES-T2-W08-LIT` (LESSON, PENDING, also depending on `YO-FACT-T2-W08-DEFECTS`) — replacement lessons for the absent dialect/ajumolo strand, the naming ceremony and its materials, and the absent literature objective.
  - `YO-FACT-T2-W08-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) — one recorded expert decision on the absent body, the selected literature text, the scheme defects and the notation.
- Counts: items 108 → 112; kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 27 implemented / 68 pending / 17 blocked; `counts` sums to 112. Coverage 237 → 246; open items 91 → 98; notes 31 → 32; source rules 4; lessons 0; assets 0; `next_runnable` → `YO-WK-T2-W09`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records Weeks 1–8 (14, 15, 18, 18, 16, 14, 17 and 9 coverage entries) and leaves Weeks 9–12, the 2nd Term preamble and foundation item, and the 3rd Term outstanding.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The absence of a Week 8 body is recorded, not filled: whether a week with no section can be represented by `split_before` belongs to `YO-FND-T2-01` (PENDING). No objective was invented beyond the text, and the missing dialect, naming and literature content is recorded as open items rather than supplied.

# YO-WK-T2-W10 — Yoruba, 2nd Term, Week 10 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 10 **has** a body: 15 coverage entries are PARTIAL and 2 are UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `3b2628f` (the `ss1/yo-wk-t2-w09` tip). Since W09 was published the owner merged PR #222 (W09 into `ss1/yo-wk-t2-w08`), #220 (W08 into W07), #218 (W07), #216 (W06), #215 (W05), #213 (W04), #212 (W03) and #211 (W02), plus #219 (W01 into master), and merged PR #221 into master at `331fa37`. That master commit advances the NEXT_ASSIGNMENTS pointer only: it still contains Weeks 1–2, while Weeks 3–9 exist only in the stacked branches. This item's PR targets `ss1/yo-wk-t2-w09`.
- Prerequisites `YO-SRC-T2` and `YO-WK-T2-W09` are `IMPLEMENTED_TESTING_DEFERRED`. No open PR owned YO-WK-T2-W10 when work started.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run**, matching the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically to the same extraction, as noted below.

## Scheme mapping
- The 2nd Term scheme is a paragraph list headed `ILANA ISE OSOOSE FUN SAA KEJI` (line 7). The Week 10 row is lines 125–137, SHA-256 `6f81346dd5b5fb196cf342cad485c8e10474df2337d60cbb53ae713b8716fb8f`, equal to the YO-INV-T2 value.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| `Ose  kewaa-  Ede- Isori oro-oruko` | 125 | `14cd5c90…7d208956` | Label; body `OSE KEWAA` 2221; EDE 2223–2319 |
| `Oriki` | 127 | `6f8ecec2…4bb0dd03` | **None**; listed in AKOONU 2227 but never taught |
| `Orisii` | 129 | `14a5392d…e0728508` | `EYA ORO ORUKO` 2243–2273 |
| `Ise ti oro-oruko n se ninu gbolohun.` | 131 | `b720d376…7db9e78f` | 2275–2319 |
| `Asa- Ipolowo oja; Iwulo ati pataki ipolowo oja.` | 133 | `60df64cf…b5fa5a9b` | ASA 2323–2389; definition 2329, benefits 2341–2351 |
| `Orisiirisii ona ipolowo oja ti abinibi-ikiri, ipate,ipolowo pelu ohun enu.` | 135 | `978a56cd…42b568a1` | Kinds 2331–2339; **`ohun enu` never taught** |
| `Litireso -  Ewi alohun gege bi orisun itan isedale ati asa Yoruba; oriki orile,ijala  abbl` | 137 | `473ab930…d2471c21` | **None** |

- The row names two strands, EDE at 125–131 with three items and ASA at 133–135 with two, plus LITIRESO at 137. Line 127 `Oriki` has no prefix; it is read as an EDE sub-item because it sits between the EDE label at 125 and `Ise ti oro-oruko` at 131, matching the body's AKOONU order at 2227–2233. Whether it means oriki as a grammar topic or the literature `oriki orile` at 137 is unresolved. The inference is recorded as `YORUBA-T2-W10-SCHEME-MAPPING`; classification of the whole 13-row scheme belongs to `YO-PRE-T2-1` (PENDING).
- The EDE objectives bind partly: 129 → 2243–2273 and 131 → 2275–2319, but 127 → nothing beyond the bare AKOONU word at 2227. The ASA objectives bind partly: 133 → 2325–2351 and 135 → 2331–2339 for abinibi and ode-oni, but `ipolowo pelu ohun enu` occurs only at 135, so the third kind is untaught and `ipate` and `ikiri` are never described as oral.
- The LITIRESO objective has **no binding inside Week 10**: line 137 names ewi alohun, oriki orile and ijala, but the section has no literature part. `ijala` occurs only at 137 in the whole extraction and `orile` only inside `oriki orile` at 137. `ewi` occurs at 137, 1431, 1931 and 1933 only; Week 7 (1929–1933) teaches litireso atenudenu as ewi and itan inherited from the forebears and as a source of itan and asa Yoruba, which partly supports the first clause but never names ewi alohun.

## Section
- Teaching label `OSE KEWAA`, line 2221, SHA-256 `6fdfd50ec38bb5d78b7d619ae509bf9cb1305a253f37fcf65ad14bbd8c931528`, char offset 48,527; section lines 2221–2433, SHA-256 `4f053c8c065a7260053db902b189ad6ce0c0a1a6a8e165cecd2054fcd44e0bd5`, equal to the YO-INV-T2 value.
- Parts: EDE 2223–2319 (`d0df5e56…8b9e101b`), with `ORI-ORO-;ISORI ORO-ORUKO` 2223, `AKOONU` 2225–2233, definition 2235, examples 2237–2241, `EYA ORO ORUKO` 2243–2273 and `ISE TI ORO-ORUKO` 2275–2319; `ASA` 2323–2389 (`63a0c570…cb7a66bd`), with the heading 2325, `AKOONU` 2327, definition 2329, two kinds 2331–2339, `IWULO/PATAKI` 2341–2351, `ORISII OJA` 2353–2371, `OGBON` skills 2373–2381 and `Igbelewon` 2383–2389; `IWE AKATILEWA` 2391–2393 (`ccd93358…6aa2ba18c`); `ISE ASETILEWA` 2395–2415 (`e377413a…f8238413e`); `APA KEJI` 2417–2423 (`d8a3d2db…c8ef975e30`).
- **There is no LITIRESO part.** The section has no literature heading, no poem, no literature exercise and no literature reference; the only reference at 2393 is the general textbook `Iwe imodotun Yoruba fun olodun kin-in-ni o.i 93, 98`. Recorded as `YORUBA-T2-W10-LITIRESO-ABSENT`.
- The OJA/IPOLOWO list at 2359–2371 is a tab-aligned paragraph pair, not a Word table. The document contains no Word table, drawing, picture, OLE object, equation or media file; re-checked this run (`<w:tbl>`, `<w:drawing`, `<w:pict`, `<w:object`, `m:oMath`, `w:media` and `v:shape` all occur zero times in `word/document.xml`).
- The parser produces **no rows** for this source: the extraction contains zero `week` substrings and zero bare-number lines, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run. No `SS1-SRC-ec4a5095420d:BODY:<sha256>` identity exists; all 17 coverage entries cite exact line ranges and UTF-8 block hashes, with `lesson_ids: []`. Recorded as `YORUBA-T2-W10-ROW-IDENTITY`.

## Coverage entries added (17)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W10-SCHEME-EDE` | Scheme EDE objectives: Oriki, Orisii oro-oruko, ise ti oro-oruko | 125–131; 2223–2319 | `fb84bd29…f7676559d3`; `d0df5e56…8b9e101b` | PARTIAL |
| `YO-T2-W10-EDE-01` | Oro-oruko: definition and the subject/object/qualifier test | 2223–2241 | `53147861…519c59cb` | PARTIAL |
| `YO-T2-W10-EDE-02` | Eya oro oruko: the ten type headings and example lists | 2243–2273 | `0960f91d…24b9e100` | PARTIAL |
| `YO-T2-W10-EDE-03` | Ise ti oro-oruko: oluwa, abo and eyan | 2275–2305 | `6af6e914…36db59f81` | PARTIAL |
| `YO-T2-W10-EDE-04` | Further uses: pronoun replacement and ni-emphasis | 2307–2319 | `7194ea11…87de68f0` | PARTIAL |
| `YO-T2-W10-SCHEME-ASA` | Scheme ASA objectives: ipolowo oja, its benefits and kinds including ohun enu | 133–135; 2323–2389 | `2c698740…d847eb7`; `63a0c570…cb7a66bd` | PARTIAL |
| `YO-T2-W10-ASA-01` | Ipolowo oja: definition and the two kinds | 2325–2339 | `7671aa50…c4c16576b` | PARTIAL |
| `YO-T2-W10-ASA-02` | Iwulo ati pataki: the four benefits | 2341–2351 | `34350744…bd9d2baa` | PARTIAL |
| `YO-T2-W10-ASA-03` | Orisii oja and their market calls | 2353–2371 | `c9a135f6…96c2ac4` | PARTIAL |
| `YO-T2-W10-ASA-04` | Ogbon ipolowo: itowo, isiwo, awin and aponle | 2373–2381 | `5b2d0a88…bb8db383` | PARTIAL |
| `YO-T2-W10-SCHEME-LIT` | Scheme LITIRESO: ewi alohun as source, oriki orile, ijala | 137; 1929–1933 | `473ab930…d2471c21`; `96eb1d63…1f036aa4e` | PARTIAL |
| `YO-T2-W10-LIT-01` | Ewi alohun as a source of history and culture | 137; 1929–1933 | `473ab930…d2471c21`; `96eb1d63…1f036aa4e` | PARTIAL |
| `YO-T2-W10-LIT-02` | Oriki orile: lineage and town praise poetry | 137 | `473ab930…d2471c21` | UNRESOLVED |
| `YO-T2-W10-LIT-03` | Ijala: the hunters praise chant | 137 | `473ab930…d2471c21` | UNRESOLVED |
| `YO-T2-W10-ASSESS-EDE` | Igbelewon 2383–2389: goods, advertisements, five noun types | 2383–2389 | `a0b31c20…43225c9d6` | PARTIAL |
| `YO-T2-W10-ASSESS-ISE` | Iwe akatilewa 2391–2393 and Ise asetilewa 2395–2415 | 2391–2393; 2395–2415 | `ccd93358…6aa2ba18c`; `e377413a…f8238413e` | PARTIAL |
| `YO-T2-W10-ASSESS-APA` | Apa keji 2417–2423: define, advertise five goods, explain three functions | 2417–2423 | `d8a3d2db…c8ef975e30` | PARTIAL |

Full values are reproducible with the method above. The 15 PARTIAL entries mean the source teaches or exercises the objective but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects and gaps below must be resolved before teaching. The 2 UNRESOLVED entries are `oriki orile` and `ijala`, which the scheme names and no section teaches; ewi alohun is PARTIAL only because Week 7's literature section partly covers the concept. The scheme's Oriki and ipolowo pelu ohun enu are recorded as gaps rather than as missing objectives.

## What each part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| EDE isori oro-oruko | 2223; `AKOONU` 2225–2233 lists oriki, orisii, ise and lilo (oriki never taught) | Definition 2235; ten type headings 2243–2273; three functions 2275–2305; pronoun and ni-emphasis uses 2307–2319 | Igbelewon 2383–2389 (three tasks) |
| ASA ipolowo oja | 2325; `AKOONU` 2327 (no outline) | Definition 2329; two kinds 2331–2339; four benefits 2343–2351; six goods and market calls 2357–2371; three skills and aponle 2373–2381 | Igbelewon 2383–2389; Ise asetilewa 2395–2415; Apa keji 2419–2421 |
| LITIRESO ewi alohun | None | Week 7's atenudenu section only (1929–1933); no Week 10 literature text | None |

- Thin and missing content is recorded as `YORUBA-T2-W10-CONTENT-GAPS`: the untaught Oriki, the overlapping ten-type taxonomy, the unglossed definition and functions, the five-line blank gap before an unlabelled example, the garbled `wunren`, the run-on ASA definition and benefits sentence, the cryptic market calls, the untaught `ipolowo pelu ohun enu`, and the unclosed aponle quotation.

## Source defects (open item `YORUBA-T2-W10-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 125 | Double space in `Ose  kewaa`; hyphen after `kewaa`; no full stop |
| 2 | 127–131 | Three bare EDE items; `Oriki` and `Orisii` are single words with no punctuation or elaboration |
| 3 | 133 | `Asa-` with no space after the hyphen; two topics joined by a semicolon; label `Asa` not `ASA` |
| 4 | 135 | `Orisiirisii` spelling; `abinibi-ikiri` joins a category to one example; `ipate,ipolowo` comma-fused; `ohun enu` undefined |
| 5 | 137 | `Litireso -` double space; `oriki orile,ijala  abbl` comma-fused with a double space; `abbl` unexpanded; no full stop; three topics in one line |
| 6 | 2221 | Body label `OSE KEWAA` has no hyphen or punctuation, unlike scheme 125 |
| 7 | 2223 | `ORI-ORO-;ISORI ORO-ORUKO` fuses two headings with a semicolon; no full stop |
| 8 | 2225–2233 | `AKOONU` has no colon and no outline; four dash items with no punctuation; `oriki` is never taught |
| 9 | 2235 | `Oro –oruko` uses an en dash with no space; one run-on definition; fused `.AP.`; no gloss |
| 10 | 2237–2241 | Three unlabelled examples with inconsistent tabs; no analysis |
| 11 | 2243 | `EYA ORO ORUKO.` mismatches the scheme's `Orisii` and the title's `ISORI` |
| 12 | 2245–2255 | First type unnumbered; `.Ap` fused; dashes and tabs vary; list ends `Iyalaje…abbl`; no name glossed |
| 13 | 2257 | `. AP.` fused and spaced; `alaiseeyan` overlaps types 3 and 4 |
| 14 | 2259–2263 | `.ap`, `. ape` and `.Ap` fused; `abbl` unexpanded; `elemi`, `alailemii` and `aridimu` unglossed |
| 15 | 2265 | `Ap ibo lo n lo?` fused; `Osodi,Meka,Soosi` comma-fused; the place-name test is asserted, not explained |
| 16 | 2267 | `afoyemo` unglossed; `nip aero opolo` garbled |
| 17 | 2269–2271 | `aseeka` and `alaiseeka` unglossed and overlapping; `tatapupu` unexplained |
| 18 | 2273 | `oruko igba` examples comma-fused and unglossed; `ijeta` unclear |
| 19 | 2275–2283 | Heading and `Ona meta Pataki` run on; `i.`, `ii.` and `iii.` punctuation and spacing vary |
| 20 | 2285–2297 | `OLUWA;`, `ABO;` and `EYAN;` use semicolons; `ap` fused three times; example sets inconsistent; `eja yiyan` is the only qualifier and is unglossed |
| 21 | 2299–2305 | Five blank lines; `Bola se isu ewura` at 2305 is an unlabelled qualifier example after the gap |
| 22 | 2307–2319 | `da oro oruko mo` and `wunren` garbled; `ap` fused at 2309 and 2315; three quoted sentences unanalysed; 2319 restates 2317 |
| 23 | 2325–2329 | Trailing space at 2325; `AKOONU` alone at 2327; one run-on definition with unclear `ke gbajare` and `etigbo` |
| 24 | 2331–2339 | `awon naa ni` typographical; `i.` and `ii.` unindented; `telifisan` and `magasinni` spellings; `ipate` and `ikiri` undescribed |
| 25 | 2341–2351 | Garbled sentence at 2343; first benefit `i.` unindented; fourth is `.iv.` with a leading full stop; no line-end punctuation |
| 26 | 2353–2371 | Two unpunctuated headings; `O fere je` garbled; tab-aligned six-good list with cryptic calls and inconsistent full stops |
| 27 | 2373–2381 | `da` and `ara awon ogbon` garbled; three skills one clause each; `lati fi fa oju won mora` unclear; curly quote at 2381 never closed and the example is cryptic |
| 28 | 2383–2389 | `Igbelewon` unpunctuated; 2385 and 2387 are one instruction split; 2389 ends with a double full stop; no marks |
| 29 | 2391–2393 | Title, grade, `o.i` and pages fused; `o.i` unexplained; pages 93 and 98 in one plain list |
| 30 | 2395–2415 | `ISE ASETILEWA ` trailing space; dash blanks vary; no space after the number in Q1 and Q3; every option list `(a)`, `(b)`, `(d)`; Q2 offers the untaught `eebu`; Q4 answer printed as `(d)`; no key |
| 31 | 2417–2423 | `1,Kin` comma; `b.` with no `a.`; five goods asked against six listed; `gbolohun,pelu` fused; no marks |
| 32 | 2221–2433 | Notation: 11 non-ASCII characters only (one en dash, one ellipsis, four curly-quote pairs, one unpaired open quote); no tone, no sub-dot, no `ẹ` or `ọ` |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T2-W10-NOTATION`)
- The Week 10 section contains **11 non-ASCII characters**: one U+2013 en dash at 2235, one U+2026 ellipsis at 2255, four curly single-quote pairs at 2311, 2313, 2315 and 2317, and one unpaired U+201C at 2381. The scheme row 125–137 contains none.
- There is therefore no tone mark, no sub-dot and no e-dot or o-dot anywhere in the week, so e/ẹ, o/ọ and s/ṣ cannot be distinguished and no tone is shown, although the objectives depend on both: `oro-oruko`, `oriki`, `isori`, `oruko eniyan`, `alaiseeyan`, `elemi`, `alailemii`, `aridimu`, `ibikan`, `afoyemo`, `aseeka`, `alaiseeka`, `oruko igba`, `oluwa`, `abo`, `eyan`, `ipolowo`, `abinibi`, `ipate`, `ikiri`, `itowo`, `isiwo`, `awin` and `aponle` all require tone, and several require sub-dots.
- Week 10 has 11 non-ASCII characters, against 3 in Week 9 and 15 in Week 7; Weeks 4, 5 and 8 have none. No marks were added or normalised.

## Assessment, visuals and references
- Week 10 sets four exercised blocks, none with an answer, key, mark allocation or completion criterion: Igbelewon 2383–2389 (name the advertised goods, advertise four, name five noun types with three examples each), Iwe akatilewa 2391–2393 (one textbook reference), Ise asetilewa 2395–2415 (five multiple-choice questions) and Apa keji 2417–2423 (define ipolowo oja, advertise five goods, explain the three functions with three examples each). Recorded as `YORUBA-T2-W10-ASSESSMENT-GAPS`.
- Every option list is `(a)`, `(b)`, `(d)`, so `c` is omitted throughout and Q4's correct answer `tutu` is printed as `(d)`; Q2 offers the untaught `eebu`; the Igbelewon asks five noun types while the body lists ten; Apa keji asks five goods while 2361–2371 lists six; Apa keji 2419 uses a comma after `1` and 2421 is labelled `b.` with no `a.`.
- Week 10's only reference is `Iwe imodotun Yoruba fun olodun kin-in-ni o.i 93, 98.` at 2393: a general Yoruba textbook, pages 93 and 98, with the edition unidentified and `o.i` unexplained. It is a different book from Week 9's Adewoyin reference and supports no literature exercise (there is none). Recorded in `YORUBA-T2-W10-ASSESSMENT-GAPS` and `YORUBA-T2-W10-LITIRESO-ABSENT`.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (re-checked this run); the OJA/IPOLOWO list is a tab-aligned paragraph pair, so no VISUAL_DISPOSITION item is raised.

## Queue changes
- YO-WK-T2-W10 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 items, all depending on `YO-SRC-T2` and `YO-WK-T2-W10`:
  - `YO-LES-T2-W10-EDE`, `YO-LES-T2-W10-ASA`, `YO-LES-T2-W10-LIT` (LESSON, PENDING, also depending on `YO-FACT-T2-W10-DEFECTS`) — replacement lessons for the thin noun strand, the defective advertising strand and the absent literature strand.
  - `YO-FACT-T2-W10-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) — one recorded expert decision on the defects, the untaught Oriki and `ohun enu`, the ten-type classification, the count conflicts, the absent literature content, the reference and the notation.
- Counts: items 116 → 120; kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 29 implemented / 72 pending / 19 blocked; `counts` sums to 120. Coverage 263 → 280; open items 105 → 112; notes 33 → 34; source rules 4; lessons 0; assets 0; `next_runnable` → `YO-WK-T2-W11`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records Weeks 1–10 (14, 15, 18, 18, 16, 14, 17, 9, 17 and 17 coverage entries) and leaves Weeks 11–12, the 2nd Term preamble and foundation item, and the 3rd Term outstanding.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The row identity gap is recorded, not resolved: whether the nine 2nd Term section labels can be introduced by `split_before` belongs to `YO-FND-T2-01` (PENDING). The untaught Oriki and `ohun enu`, the absent literature strand and the count conflicts are recorded as open items, not filled: no objective was invented beyond the text, no fifth or eleventh noun type or literature content is supplied, and Week 7's atenudenu teaching is cited only as partial evidence, not as a Week 10 lesson.

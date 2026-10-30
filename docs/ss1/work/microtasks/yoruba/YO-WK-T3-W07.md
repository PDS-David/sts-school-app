# YO-WK-T3-W07 — Yoruba, 3rd Term, Week 7 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 7 is **not delivered**: 20 coverage entries are PARTIAL and 5 are UNRESOLVED, and the four untaught EDE and LITIRESO sub-topics, the two absent ASA terms, the six unkeyed exercise blocks, the fifteen source defects and the two unsupplied books are appended as bounded tasks.

## Inputs
- Base: `origin/master` `e271842` (merge of PR #286, Bookkeeping 1st Term Week 3). No open PR touched the Yoruba package or queue when work started; #286 had merged and left the Yoruba files free.
- Prerequisite `YO-SRC-T3` and predecessors `YO-WK-T3-W01` to `YO-WK-T3-W06` are `IMPLEMENTED_TESTING_DEFERRED`.
- Source `SS1-SRC-4cc6aae9ed7d`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`, 68,373 bytes, SHA-256 `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`, unchanged from the YO-INV-T3 measurement. Nothing from the archive or the extract is committed.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 63,445 characters, 2,463 lines, whole-file SHA-256 `4def7729a08d67235d5a7c6fbbcb19a15a93ffdacb96cafc6e477a14edb4d726`. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run.
- Inventory reconciliation: `YO-INV-T3` records SHA-256 `f16c3f349bea61c867441a3073c63eb114a2e905a7680c4361e4a72155ae2368` for the Week 7 section, lines 1625-1878; that value does not reproduce under the stated method (the Week 5 value in the same inventory does), so the recomputed `959e6d08…a69e2` is used and the discrepancy is carried by `YORUBA-T3-W07-ROW-IDENTITY`, as for Week 6.

## Scheme mapping
- The scheme is flat and unnumbered. Week 7 is the seventh triple, lines 53-59, SHA-256 `bc4ea6d4912b5e8e8835e851182c143dc8b67dfcc12bdb6a444b4cbe32ef9676` (241 characters, three tab characters). The mapping is documentary by position, confirmed by the teaching label `OSE KEJE` at line 1625 and by the same three strands in the body.

| Scheme item | Lines | SHA-256 | Body binding |
|---|---|---|---|
| `EDE: Itupale gbolohun oniponna: oriki, Dida gbolohun oniponna mo,` | 53 | `d76ac4d208e754d7d7c9278f21a5c29058dfce9e3a6a128da2d844ec090f8d33` (65) | EDE part 1625-1715, `f16702c1d42c6f69a93d03880b6df4e327dff6257bd563f5f39a015a0d96afe1` (1,485) |
| `ASA: Ona ti a n gba gba gbese – osomaalo,elemun-un. Ipa ti awon elesin / ati ijoye n ko ninu gbigba gbese.` | 55-57 | `d622a2d588bce69975b587338eca44ef99b9823e60165d91fda2bc07f26b4e41` (106) | ASA part 1717-1781, `56eb04de3bd587f555d7109cf061d5d8aa08a7b056c1528c82e0884306a9d798` (1,900) |
| `LIT: Ewi Alohun gege bi orison ironu Yoruba: Ofo, Ogede, Itan riro` | 59 | `944659966f63388148d7db283d0d1efd8807414270f41d03dd8d4833f4d236cf` (66) | LITIRESO part 1783-1847, `263b3964c3e26b7153a04a1db8218307a0803c21894a927889be4da50e8a0892` (2,051) |

- The EDE row names two sub-topics and trails a comma, so its list is left open. The body approaches only the second, by example, and teaches neither fully.
- The ASA row names **two** methods (`osomaalo`, `elemun-un`); the body teaches **five** and never uses the word `osomaalo`. The row also names religious leaders and chiefs; the body uses neither `elesin` nor `ijoye` in the ASA teaching.
- The LIT row names three strands and calls them `orison ironu Yoruba`; the body heading reads `ORISUN AGBARA ATI IMO IJINLE YORUBA`, which is the same title the section uses. The body teaches `ofo` only.
- The flat scheme has no week numbers; the term-wide mapping rule belongs to `YO-PRE-T3-1` and `YO-FND-T3-01` (both PENDING). The documentary mapping only is recorded in `YORUBA-T3-W07-SCHEME-MAPPING`.

## Section
- Teaching label `OSE KEJE`, line 1625, SHA-256 `da1345dfd886a58a9cecfdad7f0909aba73123f5abff15c85a468fb375743e88` (8 characters); section lines 1625-1878, SHA-256 `959e6d0882d7b3c6d96c337bd9feeabbbcd4bab7e767e900660c4230d57a69e2`, 6,113 characters (6,120 untrimmed). The section ends before `OSE KEJO` at 1879; lines 1876-1878 are empty, and 1877 nevertheless carries three tabs.
- EDE 1625-1715 (`f16702c1d42c6f69a93d03880b6df4e327dff6257bd563f5f39a015a0d96afe1`) with heading 1629-1631 (`825e7a0772d6061829758857930a986a302998eb8e18756733f04319b4c41366`, 51); the two bare sub-headings 1633-1635 (`390dd5a3d9fd9119ea4b8d7fd7145dfded2cc7295761a33ef9dff482c1bff889`, 26); example heading 1637 (`874fcbf288131231f094f86aa7a47013a0383c61cd4ca6da9e39f5f3551faa9e`, 42); `AKOONU : - ` 1639 (`861cb31e691474fde5a6be9b5f13da39808e3e371d89ac50bed520757a3f1330`, 10); definition 1641 (`79c80dc1cfec9710ff20d5753b8eacd4d200f0cd1c62cc75f7770825f5a29a78`, 121); word-level parses 1643-1655 (`d9a130d83a15efcdc06616c422ff081fe1d19acdd2579bd3349a5aaa17c85133`, 278) and 1657-1661 (`4b41bbedaefd05341c0b1fe8c1436cc1e3e5f40f796f9c5fea88404457901e26`, 152); phrase table 1663-1679 (`abef838b1ad61adde4765b1f16bc6114e1afc2a88156dc3bcc2e289af2ff9685`, 275) and idiom table 1681-1689 (`9d37a9d9fec7e4e4f081d9dba5cf839cbd77b77efd27d41a10bcbd9ebb25bcf1`, 150), the two together `48787225…458664` (427); `IGBELEWON` 1693-1709 (`3e56f6baa373b335fce50607f3fd48088201b22eb629110aa80e06e39d95c8f8`, 196); `IWE ITOKASI` 1711-1713 (`cb15f34e5106abd4e14c562038d653a6d8f0e81dc3357e86d2e818805e9bf337`, 141).
- ASA 1717-1781 (`56eb04de3bd587f555d7109cf061d5d8aa08a7b056c1528c82e0884306a9d798`) with strand label 1717-1721 (`494a5fe3a41028a2c3c6cb808a0190daeb65927ff49c0fe12c55c37014d6c92c`, 57); AKOONU and the five-item list 1723-1735 (`cd30d86bfefbe5dc6d8afc58a8dfc7ccab169066905a860488b6469488446ec8`, 275); the five method paragraphs 1737-1753 (`6079a00998102abfa02ab89c1882b13347a4aecdcaba475d2cf6f565857bf2f1`, 1,297); `IGBELEWON` 1755-1761 (`1156fe4ac11ffc234b92c270d8f037930210039c23c34fa3bb0dcd0bf9067ae6`, 98); `APAPO IGBELEWON` 1763-1781 (`418c32205df99bbae7ad50c916b0ca743fd071b5f8f43997971a8aeead933ae3`, 157).
- LITIRESO 1783-1847 (`263b3964c3e26b7153a04a1db8218307a0803c21894a927889be4da50e8a0892`) with strand label, title and the three bullets 1783-1793 (`8c9dd66a6d6dfbf8c1918417974b06dc8bc15022ad904257eb0a817d02b64a1f`, 112); `AKOONU` on ofo 1795-1811 (`17116ba25ad2e85b881650b9add5cf499f601dc703dfd83602eb29c697fa092f`, 1,223); the quoted ofo and its materials 1813-1829 (`1c46c9a80435b11c1609f20098879b33210e88266eddb2b5607af28b007a5aab`, 462); `IWE KIKA` 1831-1837 (`3d2facbeb33622b899c1127a82de346a88d35c346b7fa0c73ca52dd8dfb9515c`, 55); `APAPO IGBELEWON` 1839-1845 (`7f095446b87c3397567d724083677adb02915c371cf7d5ab385f1e89b447bcf4`, 175). `IWE KIKA` sits inside the LITIRESO part, so the part hash and the reading block overlap.
- Exercises 1849-1877 (`d926f291aa12c2ca24cdb0ffbc50e855b94857c2e719897c3a26bd36b022c033`, 652): `ISE AMURELE` 1849-1869 (`36c849733649766a912311cab3ae438276de2a2c3a452d376072fa8698822df0`, 540) and `Apa keji` 1871-1875 (`67b9c0e18c777b4541b5e4bfc496e195b4524e59297d8dea33ea81908b791a78`, 108).
- The parser still produces **no rows** for this source. `OSE KEJE` occurs exactly once and is line-initial. Every entry cites line ranges and hashes with `lesson_ids: []`; row identity stays with `YO-FND-T3-01`.

## Coverage entries added (25)
| ID | Objective | Lines | Status |
|---|---|---|---|
| `YO-T3-W07-SCHEME-EDE` | Scheme EDE row: itupale gbolohun oniponna, its oriki and its identification | 53; 1625-1878 | PARTIAL |
| `YO-T3-W07-EDE-01` | Oriki gbolohun oniponna: the characteristics of an ambiguous sentence | 1633-1635 | UNRESOLVED |
| `YO-T3-W07-EDE-02` | Ibi ti o ti n jeyo: where an ambiguous sentence occurs | 1635 | UNRESOLVED |
| `YO-T3-W07-EDE-03` | The definition of gbolohun oniponna | 1641 | PARTIAL |
| `YO-T3-W07-EDE-04` | Itupale eyo oro oniponna: parsing a one-word ambiguity | 1643-1661 | PARTIAL |
| `YO-T3-W07-EDE-05` | Itupale apola oniponna: parsing a phrase-level ambiguity | 1663-1679 | PARTIAL |
| `YO-T3-W07-EDE-06` | Akanlo-ede oniponna: an idiom with two readings | 1681-1689 | PARTIAL |
| `YO-T3-W07-EDE-07` | Dida gbolohun oniponna mo: identifying and naming the readings | 1625-1715 | PARTIAL |
| `YO-T3-W07-SCHEME-ASA` | Scheme ASA row: osomaalo and elemun-un, and the part of elesin and ijoye | 55-57; 1717-1781 | PARTIAL |
| `YO-T3-W07-ASA-01` | The five ways of recovering a debt taught in the body | 1723-1751 | PARTIAL |
| `YO-T3-W07-ASA-02` | Riran elemun-un: the hired collector and who he is | 1743-1745 | PARTIAL |
| `YO-T3-W07-ASA-03` | Osomaalo: the method named first in the scheme | 55; 1717-1781 | UNRESOLVED |
| `YO-T3-W07-ASA-04` | Ipa ti awon elesin ati ijoye: the leaders' part in recovery | 1749 | PARTIAL |
| `YO-T3-W07-SCHEME-LIT` | Scheme LIT row: ofo, ogede and itan riro as ewi alohun | 59; 1783-1847 | PARTIAL |
| `YO-T3-W07-LIT-01` | Ofo: what it is, the power of words, and its use with medicine | 1795-1811 | PARTIAL |
| `YO-T3-W07-LIT-02` | The quoted ofo: its lines, its plants and objects, and the commentary | 1813-1829 | PARTIAL |
| `YO-T3-W07-LIT-03` | Ogede as the second ewi alohun named in the scheme | 59; 1783-1847 | UNRESOLVED |
| `YO-T3-W07-LIT-04` | Itan riro as the third ewi alohun named in the scheme | 59; 1783-1847 | UNRESOLVED |
| `YO-T3-W07-REF-01` | IWE ITOKASI and IWE KIKA: the two readings set for the week | 1711-1713; 1833-1835 | PARTIAL |
| `YO-T3-W07-ASSESS-01` | IGBELEWON EDE: parse the four sentences | 1693-1709 | PARTIAL |
| `YO-T3-W07-ASSESS-02` | IGBELEWON ASA: name the ways of recovering a debt | 1755-1761 | PARTIAL |
| `YO-T3-W07-ASSESS-03` | APAPO IGBELEWON: the combined EDE and ASA questions | 1763-1781 | PARTIAL |
| `YO-T3-W07-ASSESS-04` | LITIRESO APAPO IGBELEWON: ofo and ogede, itan riro, four ways | 1839-1845 | PARTIAL |
| `YO-T3-W07-ASSESS-05` | ISE AMURELE: the five multiple-choice items | 1849-1869 | PARTIAL |
| `YO-T3-W07-ASSESS-06` | Apa keji: the two written questions | 1871-1875 | PARTIAL |

Full hashes are in `yoruba.json` and reproducible with the method above. PARTIAL means the source teaches the objective (or sets the exercise) but no deliverable lesson exists, row identity is unresolved and the defects below must be corrected first. UNRESOLVED means the scheme names the objective but the body supplies no teaching: `oriki` and `ibi ti o ti n jeyo` are headings only, `osomaalo` never occurs, and `ogede` and `itan riro` are bullets.

## What each part teaches
| Part | Definition | Teaching | Exercise |
|---|---|---|---|
| Gbolohun oniponna | 1641: a sentence with more than one meaning; the ambiguity may lie in one word or in one phrase | 1641 | 1695-1705; 1765 |
| Oriki | none: bare heading at 1633, the only occurrence of the word in the section | none | none |
| Ibi ti o ti n jeyo | none: bare heading with a full stop at 1635 | none | none |
| Eyo oro oniponna | 1643: parsing a word-level ambiguity; three worked cases at 1645-1661, each with two readings | 1643-1661 | 1695-1705 |
| Apola oniponna | 1663: parsing a phrase-level ambiguity; a tab-separated two-column table of three sentences and five glosses | 1663-1679 | 1695-1705 |
| Akanlo-ede oniponna | 1681: an idiom with a literal and a figurative reading; two idioms (`Mo buta`, `Oba waja`) in the same tab layout | 1681-1689 | none |
| Sisingbese | 1737: the creditor sends himself or another to the debtor | 1737 | 1757-1759; 1769 |
| Idogoti | 1739: the creditor stands by and stakes his person until paid, eating whatever is served | 1739 | none |
| Riran elemun-un | 1743-1745: the creditor hires a `gende` man to stay with the debtor and consume what is found | 1743-1745 | none |
| Gbigbe edan lo sile ajegbese | 1749: the creditor takes the case to the `ogboni`, who send an emissary with the `edan` and order payment | 1749 | none |
| Ifibiya | 1751: the creditor buys goods from the debtor or his family up to the debt | 1751 | none |
| Osomaalo | none: named only in the scheme at 55 | none | none |
| Elesin and ijoye | none: not the words used; the `ogboni` role at 1749 is the only leader body taught | 1749 | none |
| Ofo | 1795-1811: incantation and partly medicine, exact repetition, every thing having its power and secret name | 1795-1811 | 1841; 1863; 1875 |
| Quoted ofo | 1813-1829: eight lines, then the barks and the axe and the statement that the ofo assists the medicine | 1813-1829 | none |
| Ogede | none: bullet at 1789 plus `Ofo ni awon miiran maa n pe ni ogede` at 1799 | none | 1841; 1863; 1875 |
| Itan riro | none: bullet at 1791 | none | 1843 |
| References | 1713: Adewoyin 2014, pages 226-230; 1835: Eko Ede Yoruba Titun, book two, pages 39-43 | 1711-1713; 1833-1835 | none |

## Source defects (open item `YORUBA-T3-W07-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 1631, 1639 | Both open with spaces, 1639 closes with a bare hyphen, and the sub-headings at 1633-1635 carry no body |
| 2 | 1641 | Hyphen and semicolon after the term, no space after the first full stop, and `ponna` printed as a free-standing word never explained |
| 3 | 1647 | Opens with two spaces, a full stop and eight spaces; the bracket device `[ … ]` at 1647, 1653 and 1659 is never introduced |
| 4 | 1651, 1657 | No space after `gbin.`; `Tumo si-;` and `ba.tumo si  pe-;` print a hyphen and semicolon after the device |
| 5 | 1659 | A bracketed `[20]` with no note, footnote or reference anywhere in the section |
| 6 | 1665-1689 | The `Gbolohun`/`Itumo` table is tab-separated with no rules, and each second gloss sits on a row whose first cell is empty, so binding is positional only |
| 7 | 1697 | The only sentence of the four without a full stop; 1701 reads as a proverb fragment rather than a sentence to parse |
| 8 | 1721-1751 | `AKOONU` indented with tab and trailing hyphen; 1723-1727, 1739, 1743, 1749 and 1751 are single run-ons of 135-411 characters |
| 9 | 1727, 1733, 1739 | The list names the second method `didogo` while its heading prints `IDOGOTI`; `Ifibiya.` takes a full stop the other four items do not |
| 10 | 1743, 1749 | 1749 embeds the unexplained gloss `[amin ase ogboni]`; 1743 uses `gende` before 1745 defines it |
| 11 | 1755-1769 | The same two questions are set twice; the second block adds only the request for five examples |
| 12 | 1769 | An item numbered `2.` in a list whose first item is lettered `(a)`-`(b)` |
| 13 | 1813, 1823 | The heading is the truncated `Ap ` with a trailing space, apparently `Apeere`; `lagbja` for `lagbaja`; the quoted ofo has no title |
| 14 | 1845 | `gbeses` for `gbese`; asks for four ways where the body teaches five |
| 15 | 1849-1869 | All five items print options `(a)`, `(b)` and `(d)`: no option `(c)` anywhere, and no answer key |

No correction wording is authored here; the lessons must not copy the uncorrected text, and `YO-FACT-T3-W07-DEFECTS` must record one decision per defect.

## Notation (open item `YORUBA-T3-W07-NOTATION`)
- Week 7 (lines 1625-1878) contains **exactly zero non-ASCII characters**: no tone marks, sub-dots, precomposed or combining characters and no soft hyphen. The source carries no Yoruba diacritics anywhere in the 3rd Term document (96 non-ASCII characters in total, all of them punctuation: 28 en dashes, 23 left single and 33 right single quotation marks, two left and one right double quotation marks).
- The only non-ASCII character in the Week 7 scheme group is the **en dash U+2013 at line 55**, separating `gbese` from `osomaalo,elemun-un`.
- The section contains **71 tab characters over 30 lines**: 4 tabs each at 1665, 1669, 1673, 1675, 1679, 1685 and 1689; 3 each at 1667, 1671, 1683, 1687, 1693, 1695 and 1877; 2 each at 1677, 1783, 1787, 1789, 1791 and 1871; 1 each at 1645, 1715, 1721, 1723, 1745, 1769, 1799, 1807, 1809 and 1875. The three tabs in scheme lines 53-59 are the spacing after `EDE:`, `ASA:` and `LIT:`.
- Because the section marks neither tone nor sub-dot, the ambiguous-sentence material cannot be checked against it: `ofo`, `ogede`, `awo`, `oko`, `igba` and the rest are printed as bare letters, so at least some of the ambiguity the week teaches is a diacritic artefact of the print rather than a property of the language. No mark was added, removed or normalised.
- No mark, symbol, figure or tab was normalised, and no tab was converted.

## Assessment and references
- Six exercise blocks, none with an answer, solution, mark allocation or completion criterion: IGBELEWON EDE 1693-1709, IGBELEWON ASA 1755-1761, APAPO IGBELEWON 1763-1781, LITIRESO APAPO IGBELEWON 1839-1845, ISE AMURELE 1849-1869 and Apa keji 1871-1875. Recorded as `YORUBA-T3-W07-ASSESSMENT-GAPS`.
- Nothing assesses the phrase table at 1663-1679 or the idiom table at 1681-1689 directly, and no exercise refers to either cited book.
- All five multiple-choice items omit option `(c)`. Four of the five (items 1, 2, 3 and 5) test `isinku oba`, which is the Week 9 ASA row at scheme line 71 (general burial customs are the Week 8 ASA row at line 65), so Week 7 examines content two weeks ahead of itself. Apa keji question 1 is on the same topic.
- `IWE ITOKASI` 1713 cites Adewoyin S.Y (2014), *Imo, Ede, Asa ati Litireso Yoruba fun Ile Eko Girama Agba S.S.1*, Corpromutt, pages 226-230, covering both the EDE and the ASA parts. `IWE KIKA` 1835 assigns pages 39-43 of *Eko Ede Yoruba Titun, Iwe keji*, with no author. Neither book nor any page image accompanies the archive; `YORUBA-T3-W07-EXTERNAL-TEXT` is an OWNER_ACTION.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (YO-INV-T3); both word tables and the idiom pairs at 1665-1689 are tab-separated prose. No VISUAL_DISPOSITION item is raised.

## Queue changes
- `YO-WK-T3-W07` → `IMPLEMENTED_TESTING_DEFERRED`; its `Not yet indexed…` reference replaced.
- Appended 5 items depending on `YO-SRC-T3` and `YO-WK-T3-W07`: `YO-LES-T3-W07-EDE` and `-ASA` (LESSON, PENDING, also depending on `YO-FACT-T3-W07-DEFECTS`), `YO-LES-T3-W07-LIT` (LESSON, BLOCKED on `YO-FACT-T3-W07-CONTENT-DECISIONS`) and `YO-FACT-T3-W07-DEFECTS`, `YO-FACT-T3-W07-CONTENT-DECISIONS` (FACTUAL_DEPENDENCY, BLOCKED).
- Counts: items 147 → 152; LESSON 70 → 73 and FACTUAL_DEPENDENCY 27 → 29; coverage 412 → 437; open items 153 → 160; source_rules 7; lessons 0; assets 0; status 40 implemented / 78 pending / 34 blocked; `next_runnable` head → `YO-WK-T3-W08`.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`.
- Not approved and not verified. Five objectives have no teaching (`oriki`, `ibi ti o ti n jeyo`, `osomaalo`, `ogede` and `itan riro`), the LIT title and the osomaalo term need a recorded decision, and six exercise blocks are unkeyed.
- The seven open items opened by this task are `YORUBA-T3-W07-SCHEME-MAPPING`, `YORUBA-T3-W07-ROW-IDENTITY`, `YORUBA-T3-W07-SOURCE-DEFECTS`, `YORUBA-T3-W07-CONTENT-GAPS`, `YORUBA-T3-W07-ASSESSMENT-GAPS`, `YORUBA-T3-W07-NOTATION` and `YORUBA-T3-W07-EXTERNAL-TEXT`. None is closed by this note.

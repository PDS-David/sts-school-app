# YO-WK-T2-W07 — Yoruba, 2nd Term, Week 7 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 7 is **not delivered**: all 17 coverage entries are PARTIAL and none is UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `e2cfeef` (the `ss1/yo-wk-t2-w06` tip; PR #216 open against `ss1/yo-wk-t2-w05`, PR #215 open against `ss1/yo-wk-t2-w04`, PR #213 against `ss1/yo-wk-t2-w03`, PR #212 against `ss1/yo-wk-t2-w02` and PR #211 against `ss1/yo-wk-t2-w01`), stacked on the merged #199–#207 chain. `origin/master` is still `9f745bb` and carries only PR #199. This item's PR targets `ss1/yo-wk-t2-w06`.
- Prerequisites `YO-SRC-T2` and `YO-WK-T2-W06` are `IMPLEMENTED_TESTING_DEFERRED`. No open PR owned YO-WK-T2-W07 when work started.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run**, matching the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically to the same extraction, as noted below.

## Scheme mapping
- The 2nd Term scheme is a paragraph list headed `ILANA ISE OSOOSE FUN SAA KEJI` (line 7). The Week 7 row is lines 81–91, SHA-256 `90af69d72b37b7347417348791b180ad3d5b37aab457eefc80e2ea0d077a0d88`.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| `ose keje- Ede- Onka  Yoruba;onkaye lati ori  ookan titi de Egbaa (1- 2000)` | 81 | `805a19d9…0492db6b` | Divisions 1691–1697; 1–30 1701–1779; 40–200 1781–1821; 220–2000 1823–1873 |
| `Asa-  Oyun nini,itoju oyun,ibimo.` | 83 | `1029223f…fbc04927` | 1893; 1895–1899; 1901–1909 |
| `Igbagbo Yorubanipa agan,omo bibi ati abiku ` + tab | 85 | `f0229664…1736b3cc` | Children and agan 1893; omo bibi 1901–1909; abiku 1915–1919 |
| `                      Aajo lati tete ni oyun.` | 87 | `2ccd5613…ea602e9d` | 1893 (one clause only) |
| `\t\tEewo ati Oro idile.` | 89 | `fedc068b…98ab03a1` | 1911–1913, which says `Oro ile` |
| `  Litireso -    Itan oloro geere … Asa bi Yoruba se n sin  oku sinu\t\tile.` | 91 | `331eeb58…acd2be78` | 1927–1961 |

- The EDE objective at line 81 is one row with `Ede-` followed by the topic and a semicolon; the body heads it `ORI-ORO-;ONKA  YORUBA` at 1685 and `OOKAN  DE EGBAA` at 1687. Every part of the range is addressed: 1–30, 40–200 and selected numbers from 220 to 2000, but the sequence omits 31–39, 201–219, many hundreds and every number between the named ones.
- The ASA objectives at lines 83–89 are four rows. The body heads `ASA` at 1877, `ASA OYUN NINI` at 1879, gives an outline at 1881–1891 and then teaches children, agan and aajo at 1893, itoju oyun at 1895–1899, ibimo at 1901–1909, eewo/oro ile at 1911–1913 and abiku at 1915–1919. Every objective is addressed at least thinly: **`aajo` gets one clause**, `eewo` and `oro` are never defined, and the body says `Oro ile` where line 89 says `Oro idile`.
- The LITIRESO objective at line 91 names `itan oloro geere` and `Asa bi Yoruba se n sin oku sinu ile`. The body is the **only literature section in the nine 2nd Term weeks**: it heads `LITIRESO` at 1927, fuses both objectives into the 1929 heading, defines `Litireso atenudenu` at 1931, argues at 1933 that ewi atenudenu are a source of itan and asa, and tells the Orunmila and Idi story at 1935–1961 to explain why the dead are buried. It never defines `itan oloro geere`; `oloro` occurs in the body only in the 1929 heading, and the 1929 heading writes `GEEREGEGE` where line 91 writes `geere`.
- There is **no IWE AKATILEWA block and no bibliographic reference** anywhere in Week 7; lines 2009–2016 are blank.
- The mapping inference is recorded as `YORUBA-T2-W07-SCHEME-MAPPING`; classification of the whole 12-row scheme belongs to `YO-PRE-T2-1` (PENDING).

## Section
- Teaching label `\tOSE  KEJE`, line 1683, SHA-256 `b107e004fb3df918a9400fa76f9195db3561434e81a4e699e42553e026a97ee8`, char offset 32,669; section lines 1683–2016, SHA-256 `e4dcfd052a675c0e1795a5944b1dbb8fb6d905a014276722f459f4772edc5625`, equal to the YO-INV-T2 value.
- Parts: EDE onka 1683–1875 (`5a85ac89…2bbb1252`), with the two divisions 1685–1697 (`013f07a0…e7845efb`), 1–30 at 1701–1779 (`d4ab013e…8ca60a79`), 40–200 at 1781–1821 (`59c4000c…ee7cd706`) and 220–2000 at 1823–1873 (`92fc3364…d2e56df0`); `ASA` 1877–1919 (`97d66c93…18e4a9f7`); `IGBELEWON` 1921–1923 (`25fee575…f777109a`); `LITIRESO` 1927–1961 (`00025aec…2d5dc1fb`); `IGBELEWON` 1971–1975 (`db8e370f…ee4c57aa`); `ISE ASETILEWA` 1977–1997 (`441a755f…3aa28e19`); `APA KEJI` 1999–2007 (`b0853885…6ee00a34`).
- The ASA part opens with an outline (1881 `AKOONU`, 1885 `ITOJU OYUN  ATI  IBIMO`, 1887 `IGBAGBO YORUBA NIPA AGAN, OMOBIBI ATI ABIKU`, 1889 `ITOJU OYUN`, 1891 `IBIMO`) and then teaches the same five topics in prose.
- The exercises are split across the section: an ASA Igbelewon after the ASA prose at 1921–1923, an EDE Igbelewon at 1971–1975 after the literature part, five EDE multiple-choice questions at 1977–1997, and a mixed `APA KEJI` at 1999–2007.
- The parser produces **no rows** for this source: the extraction contains zero `week` substrings and zero bare-number lines, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run. No `SS1-SRC-ec4a5095420d:BODY:<sha256>` identity exists; all 17 coverage entries cite exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (YO-INV-T2). The number columns at 1703–1779 and 1783–1873 are tab-aligned paragraphs, not a Word table.

## Coverage entries added (17)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W07-SCHEME-EDE` | Scheme EDE objective: Onka Yoruba, counting from one to Egbaa (1-2000) | 81; 1683–1875 | `805a19d9…`; `5a85ac89…` | PARTIAL |
| `YO-T2-W07-EDE-01` | Two divisions, onkaye and onkapo, marked by m and i | 1691–1697 | `013f07a0…` | PARTIAL |
| `YO-T2-W07-EDE-02` | Onkaye and onkapo forms 1–30, including 15–19 and 21–29 | 1701–1779 | `d4ab013e…` | PARTIAL |
| `YO-T2-W07-EDE-03` | Multiples of twenty 40–200 and the ten-less 50–190 | 1781–1821 | `59c4000c…` | PARTIAL |
| `YO-T2-W07-EDE-04` | The 200-based forms 220–2000 | 1823–1873 | `92fc3364…` | PARTIAL |
| `YO-T2-W07-SCHEME-ASA` | Scheme ASA objectives: oyun nini, itoju oyun, ibimo; agan, omo bibi, abiku; aajo; eewo ati oro idile | 83–89; 1877–1919 | `1029223f…`; `f0229664…`; `2ccd5613…`; `fedc068b…`; `97d66c93…` | PARTIAL |
| `YO-T2-W07-ASA-01` | Children as the purpose of marriage; agan; the aajo sought from elders | 1893 | `1f3c9b17…` | PARTIAL |
| `YO-T2-W07-ASA-02` | Itoju oyun: care and medicines, including oyun dide and de e | 1895–1899 | `2ef96b74…` | PARTIAL |
| `YO-T2-W07-ASA-03` | Ibimo and ojo ikunle: the delivery and the agbebi | 1901–1909 | `de7cb1a0…` | PARTIAL |
| `YO-T2-W07-ASA-04` | Eewo ati oro idile: the family food prohibitions after childbirth | 1911–1913 | `e8177e0c…` | PARTIAL |
| `YO-T2-W07-ASA-05` | Igbagbo nipa abiku: the belief and the naming practice | 1915–1919 | `4dc984d6…` | PARTIAL |
| `YO-T2-W07-SCHEME-LIT` | Scheme LITIRESO objectives: itan oloro geere as a source; how the Yoruba bury the dead at home | 91; 1927–1961 | `331eeb58…`; `00025aec…` | PARTIAL |
| `YO-T2-W07-LIT-01` | Litireso atenudenu as a source of history and culture | 1927–1933 | `5c6aad54…` | PARTIAL |
| `YO-T2-W07-LIT-02` | Asa bi Yoruba se n sin oku: the Orunmila and Idi story and the two reasons given | 1935–1961 | `03753dd4…` | PARTIAL |
| `YO-T2-W07-ASSESS-EDE` | Igbelewon 1971–1975 and Ise asetilewa 1977–1997: two questions and five multiple-choice questions | 1971–1997 | `db8e370f…`; `441a755f…` | PARTIAL |
| `YO-T2-W07-ASSESS-ASA` | Igbelewon 1921–1923 and Apa keji 2005–2007: itoju oyun, lekun-un-rere, burial | 1921–1923; 2005–2007 | `25fee575…`; `d5757867…` | PARTIAL |
| `YO-T2-W07-ASSESS-APA` | Apa keji 2001–2003: the two divisions of onka and their markers | 1999–2003 | `b0853885…` | PARTIAL |

Full values are reproducible with the method above. The 17 PARTIAL entries mean the source teaches or exercises each objective, but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching. None is UNRESOLVED because every scheme objective is addressed at least thinly; the thin spots are recorded as `YORUBA-T2-W07-CONTENT-GAPS` rather than as missing objectives.

## What each part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| EDE onka | Headings 1685, 1687 | Two divisions 1691–1697; 1–30 1701–1779; 40–200 1781–1821; 220–2000 1823–1873 | Igbelewon 1971–1975; Ise asetilewa 1977–1997; Apa keji 2001–2003 |
| ASA | 1877, 1879; outline 1881–1891 | Children, agan and aajo 1893; itoju oyun 1895–1899; ibimo 1901–1909; eewo/oro ile 1911–1913; abiku 1915–1919 | Igbelewon 1921–1923; Apa keji 2005–2007 |
| LITIRESO | 1927; fused heading 1929 | Atenudenu 1931–1933; Orunmila and Idi 1935–1961 | One sub-question at 2007(b) |

## Source defects (open item `YORUBA-T2-W07-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 81 | Double spaces after `Onka` and `ori`; a space inside `(1- 2000)`; a semicolon fuses two clauses; no full stop |
| 2 | 83 | En dash after `Asa`; no space after `Oyun nini,` |
| 3 | 85 | `Yorubanipa` fused; no space after `agan,`; line ends with a space and a tab |
| 4 | 87 | Heavily indented row with no strand prefix; `Aajo` capitalised mid-list |
| 5 | 89 | Double-tab indent; `Oro idile` unmarked and never defined; no full stop |
| 6 | 91 | Hyphen after `Litireso`; semicolons and commas fuse the objectives; run of spaces around `sinu`; tabs inside `ile`; no full stop; `geere` against body `GEEREGEGE` |
| 7 | 1683 | Label `OSE  KEJE` is tab-indented with a double space |
| 8 | 1685 | `ORI-ORO-;ONKA` runs the separator into the title and doubles a space |
| 9 | 1687 | `OOKAN  DE EGBAA` doubles a space and has no punctuation |
| 10 | 1693, 1695 | En dashes inside the syllabic glosses; `iye` and `ipo` are never explained |
| 11 | 1697 | Curly single quotes around `m`; no final punctuation; `(i)` parenthesised against bare `m` |
| 12 | 1703 | Two tab-aligned headers, not a table, with no rule for reading the columns |
| 13 | 1705–1731 | 1713 `Marun-un  (mu aarun` leaves a bracket open and doubles a space; the equals sign disappears from 1725; 1727 capitalises `Mu`; 1725 and 1759 begin lower case; trailing tabs at 1711 and 1715 |
| 14 | 1733, 1767 | Run-on and garbled (`ki ato le mo`, `ki a tun woe yin`, `A o wo iwaju ri ogbon`) |
| 15 | 1735–1777 | Ordinals 15th–19th are printed on separate lines; 21–29 and 30 have no ordinals at all |
| 16 | 1755–1757 | The Ogun sentence is split across lines and garbled (`ko si tumo si / eewa meji`) |
| 17 | 1779 | `Ogbon` has no equals sign and no ordinal |
| 18 | 1781 | Fragment `Bi a o se kaa niyi titi de ori` with no object |
| 19 | 1783, 1789, 1809 | 1783 leaves `Ogoji (ogun eji` unclosed; 1789 and 1809 omit the equals sign |
| 20 | 1799, 1821 | `Ogowaa` is glossed `(ogun ewa)` at 1799 and `(ogun mewaa)` at 1821 |
| 21 | 1803 | `Ilo aadin-(ewa din)` fuses the hyphen with the bracket |
| 22 | 1819 | `Aadowaa (ewa-din-ni-owa)` writes `owa` for `ewa` |
| 23 | 1825–1851 | The series of twenties omits 250, 270 and 290 and stops at 460 |
| 24 | 1853 | 500 is explained as `(200 x 30) - 100`, where 200 x 30 is 6,000 |
| 25 | 1855–1861 | 1855 gives two equals signs; 1857, 1859 and 1861 use three different arithmetic layouts for 700–900 |
| 26 | 1865 | `(200 x 6) (Igba mefa)` juxtaposes two bracketed forms with no operator |
| 27 | 1867, 1869 | `(Igba meje` and `(200 x 8 (igba mejo` leave brackets open |
| 28 | 1871 | No equals sign before `egbesan`, which is also lower case |
| 29 | 1873 | `Igba mewaa)` closes a bracket never opened; `Egbawa (egbaa)` |
| 30 | 1879–1891 | Subheadings alternate tab indents, `OMOBIBI` is fused, 1885 doubles spaces, and 1881–1891 are an outline with no text |
| 31 | 1893 | One long run-on sentence with double spaces; `tetede wonu de fun okunrin naa niyen` garbled; `aajo` described in one clause; `agan` used without definition |
| 32 | 1895 | `de e` used without definition; long run-on; double spaces |
| 33 | 1897–1899 | `ese`, `fuye`, `were` and `abiwere` undefined; no source, dose or authority for the medicines; `Oogun ki omo le maa gbera daadaa` garbled |
| 34 | 1901–1903 | The sentence runs across the line break; `gbin kikan-kikan` undefined; `ekeji` begins lower case |
| 35 | 1905 | `OMO BIBI/ OJO IKUNLE` has an unpunctuated slash and a stray tab indent |
| 36 | 1909 | `bimo.Bi` fused; `Ori ikunle` and `agbebi` undefined |
| 37 | 1911 | `Eewo/Oro ile` slash heading; the body says `Oro ile` where line 89 says `Oro idile`; neither term is defined; space before the full stop in `bi .` |
| 38 | 1913 | Unpunctuated; `idile olu oje`, `onigbeeti`, `olokun esin`, `olofa`, `igbako`, `lemeeta` and `lojumo` unclear |
| 39 | 1919 | `Inu le bi` and `ge ika ese` garbled; `Abuku` undefined; `Kosoko` appears twice; the heading has no full stop |
| 40 | 1929 | Two titles fused under `ORI-ORO-;`; `GEEREGEGE` against scheme `geere`; double spaces |
| 41 | 1931 | `atenudenu-;` fuses the hyphen and semicolon; `pea` and `mo-on-ko` garbled |
| 42 | 1933 | `orison`, `aria won`, `abajo` and `ogunto` unclear |
| 43 | 1935 | Trailing space and no final punctuation |
| 44 | 1937 | `ki i.oku` fused; `lebaa` and `won ni won n ju u si` garbled |
| 45 | 1939–1959 | Narrative garbled (`Kop e ko jinna`, `Were ,Idi`, `bag be`, `togbe`, `tubo n ww o`); the song lines are tab-indented; `maasin` unclear |
| 46 | 1961 | `Idi abajo keji` unclear; trailing tab |
| 47 | 1973–1975 | Numbered `1.` then `b.`; no question marks or full stops |
| 48 | 1979–1997 | Every option list is `(a)`, `(b)`, `(d)`; blank lengths differ; Q5 puts its options on the question line |
| 49 | 2001–2003 | `1.` then `b.`; repeats 1973–1975 |
| 50 | 2005–2007 | `2.` then `b.`; 2005 repeats 1923; 2007 mixes the undefined `lekun-un-rere` with the burial objective |
| 51 | 1683–2016 | Notation: 15 non-ASCII characters only (13 en dashes, two curly single quotes); no tone, no sub-dot, no `ẹ` or `ọ` |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T2-W07-NOTATION`)
- Week 7 contains 15 non-ASCII characters: 13 U+2013 en dashes and one pair of U+2018/U+2019 curly single quotes. The en dashes are two each in the glosses at 1693 and 1695, six across the ten-less forms at 1809–1819, and one each in the arithmetic at 1853, 1857 and 1861. The curly quotes wrap `m` at 1697. The scheme row is ASCII.
- Consequently e/ẹ and o/ọ cannot be distinguished and no tone is marked, although the number terms, the ASA terms and the literature terms depend on both. This is the only 2nd Term week with curly quotes and the most en dashes; Week 6 had six non-ASCII characters and Week 5 none. No marks were added or normalised.

## Assessment, visuals and references
- Four exercise blocks, none with an answer, key or marking scheme: Igbelewon 1921–1923 (one question on itoju oyun), Igbelewon 1971–1975 (a two-part question on the divisions), Ise asetilewa 1977–1997 (five multiple-choice questions) and Apa keji 1999–2007 (two two-part questions). Recorded as `YORUBA-T2-W07-ASSESSMENT-GAPS`.
- Every option list is `(a)`, `(b)`, `(d)`, so `c` is omitted throughout; the numbering is `1.` then `b.` in three places; Q5 puts its options on the question line; no key, marks or completion criteria are given.
- 2005 repeats the 1923 question almost word for word, 2001–2003 repeats 1973–1975, and 2007 mixes an undefined term with the literature objective.
- There is **no IWE AKATILEWA block and no book reference** in Week 7; the section ends at 2007 and 2009–2016 are blank.
- The document contains **no Word table, drawing, picture, OLE object, equation or media file** (YO-INV-T2); no VISUAL_DISPOSITION item is raised.

## Queue changes
- YO-WK-T2-W07 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 items, all depending on `YO-SRC-T2` and `YO-WK-T2-W07`:
  - `YO-LES-T2-W07-EDE`, `YO-LES-T2-W07-ASA`, `YO-LES-T2-W07-LIT` (LESSON, PENDING, also depending on `YO-FACT-T2-W07-DEFECTS`) — replacement lessons for the thin number coverage, the thin ASA content and the only literature body in the term.
  - `YO-FACT-T2-W07-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) — one recorded expert decision on the defects and the notation.
- Counts: items 104 → 108; kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 26 implemented / 66 pending / 16 blocked; `counts` sums to 108. Coverage 220 → 237; open items 85 → 91; notes 30 → 31; `next_runnable` → `YO-WK-T2-W08`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records Weeks 1–7 (14, 15, 18, 18, 16, 14 and 17 coverage entries) and leaves Weeks 8–12, the 2nd Term preamble and foundation item, and the 3rd Term outstanding.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The row identity gap is recorded, not resolved: whether the nine 2nd Term section labels can be introduced by `split_before` belongs to `YO-FND-T2-01` (PENDING). No objective was invented beyond the text; the thin areas are recorded as open items rather than filled.

# YO-WK-T2-W06 — Yoruba, 2nd Term, Week 6 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 6 is **not delivered**: 9 coverage entries are PARTIAL and 5 UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `4c0b521` (the `ss1/yo-wk-t2-w05` tip; PR #215 open against `ss1/yo-wk-t2-w04`, PR #213 open against `ss1/yo-wk-t2-w03`, PR #212 against `ss1/yo-wk-t2-w02` and PR #211 against `ss1/yo-wk-t2-w01`), stacked on the merged #199–#207 chain. `origin/master` is still `9f745bb` and carries only PR #199. This item's PR targets `ss1/yo-wk-t2-w05`.
- Prerequisites `YO-SRC-T2` and `YO-WK-T2-W05` are `IMPLEMENTED_TESTING_DEFERRED`. No open PR owned YO-WK-T2-W06 when work started.
- Source `SS1-SRC-ec4a5095420d`, manifest member `SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx`, 66,197 bytes, SHA-256 `73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac` **re-verified this run**, matching the package and YO-SRC-T2.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 53,525 characters, 2,433 lines. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. Importer, parser and compiler were not run; the parser regexes were applied statically to the same extraction, as noted below.

## Scheme mapping
- The 2nd Term scheme is a paragraph list headed `ILANA ISE OSOOSE FUN SAA KEJI` (line 7). The Week 6 row is lines 69–79, SHA-256 `2de02ce7721cc33f01b7ade59a9be44cce27128c7302d955b7c284e4688f2810`.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| `Ose kefa Ede – Aayan Ogbufo; sise ogbufo ayoka ede Geesi si ede Yoruba.` | 69 | `8e47fcde…36bab922` | Heading only 1613 |
| ` Asa – Igbeyawo ode-oni-soosi, Yigi,Kootu.` | 71 | `5c8b207c…bb89a133` | Types 1619–1635 |
| `iyato ati ijora ti o wa ninu igbeyawo ode-oni ati atijo. ` | 73 | `46f196fc…198da530` | Fragments 1633, 1637; Q3 1645 |
| `Litireso- itan olorogeere gege bi orisun itan isedale ati asa Yoruba` | 75 | `584b9efb…e776e290` | **No literature body** |
| `            -itan isedale Yoruba` | 77 | `20e1dd62…4604a053` | **No literature body** |
| `            - itan awon eya Yoruba` | 79 | `39c407f0…765fd585` | **No literature body** |

- The EDE strand has **no teaching at all**: line 69 names `Aayan Ogbufo` and `sise ogbufo ayoka ede Geesi si ede Yoruba`, and the body supplies only the heading at 1613 (`ORI-ORO-;SISE AYOKA EDE GEESI SI EDE YORUBA`); 1614–1616 are blank and the section moves to ASA at 1617. The words `ogbufo` and `aayan` do not occur in the section, and `AYOKA` occurs once, inside that heading. Both EDE entries are therefore UNRESOLVED and a replacement lesson is appended.
- The ASA strand teaches three modern types: church (`IGBEYAWO SOOSI` 1621, 1629), Muslim (`IGBEYAWO MOSOLASI` 1623, 1631) and court/registry (`IGBEYAWO KOOTU` 1625, 1635), with a general introduction at 1627 and fragments of comparison at 1633 and 1637. The scheme names `soosi`, `Yigi` and `Kootu`; **`Yigi` occurs nowhere else in the 2,433-line extraction** and `mosolasi` is absent from the scheme. `Yigi` is recorded as UNRESOLVED (`YO-T2-W06-ASA-06`).
- The comparison objective at line 73 is taught only as two fragments: 1633 says the modern forms are rooted because Christianity and Islam are established and that the whole procedure from `itoro` to `idana` is usually still followed; 1637 says there is no `ekun iyawo` today and that youths only want to go to the husband. There is no side-by-side list, and Igbelewon Q3 at 1645 asks for the comparison with no guidance.
- The LITIRESO strand (lines 75–79) has **no heading, text or instruction** in Week 6; the words `itan`, `Litireso` and `isedale` do not occur in the section. The two references at 1651 and 1653 are grammar and culture textbooks, not literature texts. Recorded as `YO-T2-W06-SCHEME-LIT` (UNRESOLVED).
- The mapping inference is recorded as `YORUBA-T2-W06-SCHEME-MAPPING`; classification of the whole 12-row scheme belongs to `YO-PRE-T2-1` (PENDING).

## Section
- Teaching label `OSE KEFA`, line 1611, SHA-256 `cc60973748bee614244ffe08213a29f8864a7472a7fd1be81b1a9adc29ad8e8e`, char offset 30,167; section lines 1611–1682, SHA-256 `756396228f6d585c2a83b3a571212f34241c41a58bd149bd2199564d3528e789`, equal to the YO-INV-T2 value.
- Parts: EDE heading 1613 (`d3cb1a1f…6563481e`), `ASA` 1617–1637 (`e6330e72…9e1d724d`; type headings 1619–1625 `9d94eb25644f33988af7ca730f7866673ff38403c9f925b28595bc7619d7b3c0`, introduction to 1627 `5e020bcfb5c0aea80b10800a4783b4fe8ffd2b2b5a547caf5dc0fe082b23ba90`), `IGBELEWON` 1639–1647 (`3a6e7881…86e42f56`), `IWE AKATILEWA` 1649–1653 (`b8688a67…dbf0d8df`), `ISE ASETILEWA` 1655–1667 (`a53c474b…6d6713ea`), part two 1669–1677 (`072f1f28…9560fc97`).
- There is **no LITIRESO part**, and the EDE part is a heading only.
- The part-two heading is mangled at 1669 as `4.` followed by nine spaces and `kEJI`; the expected `APA KEJI` label is lost, and the stray `4.` follows the three numbered MCQs.
- The parser produces **no rows** for this source: the extraction contains zero `week` substrings and zero bare-number lines, so `WEEK_MARKER` and `BARE_NUMBER_LINE` match zero times and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run. No `SS1-SRC-ec4a5095420d:BODY:<sha256>` identity exists; all 14 coverage entries cite exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (YO-INV-T2). The headings, type list and questions are plain paragraphs.

## Coverage entries added (14)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T2-W06-SCHEME-EDE` | Scheme EDE objectives: aayan ogbufo and sise ogbufo ayoka ede Geesi si ede Yoruba | 69; 1613 | `8e47fcde…`; `d3cb1a1f…` | UNRESOLVED |
| `YO-T2-W06-EDE-01` | Aayan Ogbufo defined | 69; 1613 | `d3cb1a1f…` | UNRESOLVED |
| `YO-T2-W06-EDE-02` | Sise ogbufo ayoka: rendering idiomatic English into Yoruba | 69; 1613 | `8e47fcde…` | UNRESOLVED |
| `YO-T2-W06-SCHEME-ASA` | Scheme ASA objectives: igbeyawo ode-oni (soosi, Yigi, kootu) and iyato ati ijora | 71–73; 1617–1637 | `5c8b207c…`; `46f196fc…`; `e6330e72…` | PARTIAL |
| `YO-T2-W06-ASA-01` | Igbeyawo soosi: church marriage, announcement, one wife | 1621; 1629 | `82e9b91f…`; `4168ed9a…` | PARTIAL |
| `YO-T2-W06-ASA-02` | Igbeyawo mosolasi: Muslim marriage, more than one wife, iyawo saara | 1623; 1631 | `acd8ad5f…`; `b14ff477…` | PARTIAL |
| `YO-T2-W06-ASA-03` | Igbeyawo kootu / alarede: office or court, certificate, ring, one wife | 1625; 1635 | `cc11fc55…`; `f5ab020b…` | PARTIAL |
| `YO-T2-W06-ASA-04` | Iyato ati ijora: modern against traditional marriage | 73; 1633; 1637; 1645 | `46f196fc…`; `ead0f46d…`; `e748f56f…` | PARTIAL |
| `YO-T2-W06-ASA-05` | Igbeyawo ode-oni in general: church, court and mosque | 1617–1619; 1627 | `92a9d661…`; `6e53f3bb…`; `842f8199…` | PARTIAL |
| `YO-T2-W06-ASA-06` | Yigi: the third modern type named in the scheme | 71; none | `5c8b207c…` | UNRESOLVED |
| `YO-T2-W06-SCHEME-LIT` | Scheme LITIRESO objectives: itan olorogeere, itan isedale, itan awon eya | 75–79; none | `584b9efb…`; `20e1dd62…`; `39c407f0…` | UNRESOLVED |
| `YO-T2-W06-ASSESS-ASA` | Igbelewon: four questions on soosi, kootu, comparison, Muslim marriage | 1639–1647 | `3a6e7881…` | PARTIAL |
| `YO-T2-W06-ASSESS-ISE` | Iwe akatilewa references; three fill-in questions | 1649–1653; 1655–1667 | `b8688a67…`; `a53c474b…` | PARTIAL |
| `YO-T2-W06-ASSESS-APA` | Apa keji: explain soosi, mosalasi and kootu | 1669–1677 | `072f1f28…` | PARTIAL |

Full values are reproducible with the method above. The 9 PARTIAL entries mean the source teaches the objective (or sets the exercise) but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching. The 5 UNRESOLVED entries mean the objective is in the scheme but the body teaches nothing: both translation objectives, the Yigi type and the literature objectives.

## What each part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| Aayan Ogbufo / sise ogbufo ayoka | — | **Not taught; heading only at 1613** | — |
| Igbeyawo soosi | 1629 | Place of worship; announcement; one wife | Igbelewon 1641 |
| Igbeyawo mosolasi | 1631 | Muslims; more than one wife; iyawo saara | Igbelewon 1647 |
| Igbeyawo kootu | 1635 | Office or court; government paper; oruka arede; one wife | Igbelewon 1643 |
| Iyato ati ijora | — | Fragments 1633, 1637 | Igbelewon 1645 |
| Yigi | — | **Not taught; absent from the body** | — |
| Itan olorogeere / isedale / eya | — | **Not taught; no literature part** | — |

## Source defects (open item `YORUBA-T2-W06-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 69 | En dash after `Ede`; a semicolon joins two objectives; `Ogbufo` capitalised while `sise ogbufo` is not |
| 2 | 71 | En dash after `Asa`; `Yigi,Kootu` has no space after the comma; `Yigi` is undefined and never taught |
| 3 | 73 | Row begins lowercase, has no `Asa-` prefix, ends with a full stop and a trailing space; its status as a separate objective is unclear |
| 4 | 75 | No full stop; `olorogeere` and `isedale` unmarked; `gege` for `gẹ́gẹ́` |
| 5 | 77, 79 | Indented dash sub-items with no full stops; 77 has no space after the hyphen, 79 has one |
| 6 | 1613 | `ORI-ORO-;SISE` runs the separator into the title; no full stop; nothing follows the heading |
| 7 | 1619 | No space before the semicolon in `ORI-ORO-; IGBEYAWO` |
| 8 | 1621–1625 | Three type headings indented inconsistently (nine spaces at 1621, none at 1623 and 1625), unnumbered, no full stops |
| 9 | 1627 | Double spaces after two full stops; `amulumala` unmarked; `fese mule` for soosi against `si mule` for mosalasi; closing mapping omits kootu |
| 10 | 1629 | Double space after `laelae.`; `ko  ko` doubled and double-spaced; `tiri enikeni`, `ko yoju` and `faye gba` unclear |
| 11 | 1631 | Double space after `kaa.`; curly quotes around `me`; `lae je pe`, `onitohun fi okan sii tele` and `lairo tele` garbled; `saara` used but undefined; `mosolasi` here against `mosalasi` at 1627/1675 and `Mosolasi` at 1661 |
| 12 | 1633 | Double space after `oni.`; `esin igbagbo` for Christianity; `saba` unmarked |
| 13 | 1635 | `Awon loko laya miiran` unclear and apparently contradicts the monogamy stated later in the paragraph; `olu ile-ise`, `Eleyii` and `fowo si` unclear |
| 14 | 1637 | Double space after `oko.`; `daju`, `iwoyi`, `Ko tile sohun to fe pawon lekun` and `babara` unclear; two unqualified general claims |
| 15 | 1641–1647 | Questions have no full stop or question mark |
| 16 | 1651 | `(J S S )` spaced with a space before `)`; `iwe keji` without a comma; no publisher, place or edition |
| 17 | 1653 | `iwe114` fused; the author is `egbe akomolede ati asa Yoruba`, a society; no publisher, place or edition |
| 18 | 1657 | Four U+2026 ellipsis characters and two full stops used as the blank; no final punctuation |
| 19 | 1659 | Options `(a)`, `(b)`, `(d)` with `c` omitted; `Musulumi` capitalised where 1663 is lower case |
| 20 | 1661 | Trailing space; underscores fused to `lo`; mid-sentence capital `Mosolasi`; no final punctuation |
| 21 | 1663 | Options `(a)`, `(b)`, `(d)` with `c` omitted |
| 22 | 1665 | Trailing space; underscores fused to `lo`; no final punctuation |
| 23 | 1667 | Trailing tab; options `(a)`, `(b)`, `(d)` |
| 24 | 1669 | Part-two heading mangled as `4.` + nine spaces + `kEJI` |
| 25 | 1671 | No full stop after `1`; double space; no final punctuation |
| 26 | 1673–1677 | Hyphen list unnumbered; 1675 and 1677 double the space after `igbeyawo`; 1673 and 1675 have no full stop while 1677 does |
| 27 | 1611–1682 | Notation: six non-ASCII characters only (two curly quotes, four ellipses); no tone, no sub-dot, no `ẹ` or `ọ` |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T2-W06-NOTATION`)
- Week 6 contains six non-ASCII characters: `“` and `”` around `me` at 1631 and four U+2026 ellipses plus two full stops as the first fill-in blank at 1657. Everything else is ASCII.
- Consequently e/ẹ and o/ọ cannot be distinguished and no tone is marked, although the topic titles, the marriage terms and the literature objectives depend on both. Fewer non-ASCII characters than Week 2 (13) and Week 3 (124); the six here are punctuation, not Yoruba orthography. The scheme row has one en dash at 69 and one at 71, outside the section. No marks were added or normalised.

## Assessment, visuals and references
- Four exercise sets, none with an answer, solution or marking scheme: Igbelewon 1639–1647 (four questions), Iwe akatilewa 1649–1653 (two references), Ise asetilewa 1655–1667 (three fill-ins) and part two 1669–1677 (one question, three hyphenated items). Recorded as `YORUBA-T2-W06-ASSESSMENT-GAPS`.
- Every option list omits `c`, no key is given, capitals are inconsistent, and the part-two heading is mangled at 1669.
- References: `Eko ede Yoruba titun (J S S ) iwe keji oju iwe 35-54 lati owo Oyebamiji Mustapha.` at 1651 and `Eko ede ati asa Yoruba iwe keji oju iwe114-118 lati owo egbe akomolede ati asa Yoruba.` at 1653. Neither gives a publisher, place or edition; `(J S S )` is spaced irregularly, `iwe114` is fused, and the second author is a society. Neither is a literature text.
- The document contains **no Word table, drawing, picture, OLE object, equation or media file** (YO-INV-T2); no VISUAL_DISPOSITION item is raised.

## Queue changes
- YO-WK-T2-W06 → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 items, all depending on `YO-SRC-T2` and `YO-WK-T2-W06`:
  - `YO-LES-T2-W06-EDE`, `YO-LES-T2-W06-ASA`, `YO-LES-T2-W06-LIT` (LESSON, PENDING, also depending on `YO-FACT-T2-W06-DEFECTS`) — replacement lessons for the missing translation strand, the ASA strand including Yigi, and the absent literature objectives.
  - `YO-FACT-T2-W06-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) — one recorded expert decision on the defects and the notation.
- Counts: items 100 → 104; kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 25 implemented / 64 pending / 15 blocked; `counts` sums to 104. Coverage 206 → 220; open items 79 → 85; notes 29 → 30; `next_runnable` → `YO-WK-T2-W07`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` now records Weeks 1–6 (14, 15, 18, 18, 16 and 14 coverage entries) and leaves Weeks 7–12, the 2nd Term preamble and foundation item, and the 3rd Term outstanding.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The row identity gap is recorded, not resolved: whether the nine 2nd Term section labels can be introduced by `split_before` belongs to `YO-FND-T2-01` (PENDING). No objective was invented beyond the text, and the missing translation content, the Yigi term and the literature objectives are recorded as open items rather than filled.

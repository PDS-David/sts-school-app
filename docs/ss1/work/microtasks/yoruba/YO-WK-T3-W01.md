# YO-WK-T3-W01 — Yoruba, 3rd Term, Week 1 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 1 is **not delivered**: 17 coverage entries are PARTIAL and 2 are UNRESOLVED, and three lesson items plus one factual-dependency item are appended.

## Inputs
- Base: `origin/master` `5a780540d41e130f86ec26bd21fdf60c7cfec244`, the master on which the refreshed assignment index `docs/ss1/work/NEXT_ASSIGNMENTS_20261030.md` assigns `YO-WK-T3-W01`. The previous Yoruba stack is merged: PR #227 merged 2026-10-30T01:48:28Z and PR #229 merged 2026-10-30T01:56:50Z, and master already carries `YO-PRE-T2-1` and `YO-FND-T2-01` as `IMPLEMENTED_TESTING_DEFERRED`.
- Prerequisite `YO-SRC-T3` is `IMPLEMENTED_TESTING_DEFERRED`. No open PR owned the Yoruba package or queue when work started.
- Source `SS1-SRC-4cc6aae9ed7d`, manifest member `SSS 1/3rd Term SS1_/3RD TERM S1 YORUBA.docx`, 68,373 bytes, SHA-256 `a057f7f70d7e99fc34acdb6e725f3d44a426d96f756039bf6f3e6216767416e3`, **re-verified this run** against the supplied archive (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`). Nothing from the archive or the extract is committed.
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` of the member: 63,445 characters, 2,463 lines, whole-file SHA-256 `4def7729a08d67235d5a7c6fbbcb19a15a93ffdacb96cafc6e477a14edb4d726`. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run; the parser's own regexes were applied statically to the same extraction.

## Scheme mapping
- The scheme is flat and unnumbered: line 5 is only `Ose: ` and the eleven groups at 7–83 are separated only by position and the repeated `EDE:`/`ASA:`/`LIT:` prefixes. Week 1 is the first triple, lines 7–11, SHA-256 `62d8c558c9d8d7d25842a84a51e4c20d27b5e3922b26c39a310fb62ce891aa8e` (188 characters). The mapping is documentary by position, confirmed by the teaching label `OSE KINNI` at line 121.

| Scheme item | Line | Line SHA-256 | Body binding |
|---|---|---|---|
| `EDE:\tIsori oro;Oro Oruko: Oriki, Orisii Oruko, Ise Oro-Oruko ninu Gbolohun` | 7 | `62087120c9ffa2229e23a6955a5fba01c61168b08ddbda544e768f8c47ffa2ea` | EDE part 125–213, `d2c2d686d2520be9417362f5758ceedee15bf3a39f617d9bd72b409770e92c51` |
| `ASA:\tAsa- Asa Isomoloruko: Amutorunwa, abiso, inagije abbl.` | 9 | `c0bb982e8d72a27d18fd1f454318a307413ca2cc7c77938b11e1733fa0d864bd` | ASA part 223–345, `7fb7228a0007d353b7bf6daaffbd820c05761f19af9b5c8b437b0af6e00ed307` |
| `LIT:\tItupale ewi apileko. Amuye ewi, koko ewi abbl.` | 11 | `a3b6191c4b57f77dcbf853c733ee019d9521eb09f209ca4d00cbfc6b6bfea206` | LITIRESO part 363–385, `e12aaf57954e421b722ac1b0bb9bd5ff5ae2f27a137fb4874877ee73b5975718` |

- The EDE row names four sub-topics; the body teaches the definition, ten noun types and three functions but never teaches `oriki` (listed at 127 only) and never develops `lilo` (133) as a section.
- The ASA row names `Amutorunwa`, `abiso` and `inagije` with `abbl.`; the body teaches those three plus `oruko abiku` (235, 271–289), which is in scope only through the open-ended `abbl.`.
- The LIT row names `Amuye ewi` and `koko ewi`; the body teaches `ewi apileko` and the `akanlo ede ayaworan` devices and uses neither scheme term.
- Whether Week 1 is the first triple and whether the scheme terms are satisfied by the body wording is recorded as `YORUBA-T3-W01-SCHEME-MAPPING`; classification of the whole flat scheme belongs to `YO-PRE-T3-1` and `YO-FND-T3-01` (both PENDING).

## Section
- Teaching label `OSE KINNI`, line 121, 9 characters, SHA-256 `3ec2404b1133235660a37e10356a14795fb26c6fc1e2206aa73de767c8e4f5eb`, char offset 2,970; section lines 121–426, SHA-256 `b9d0b35a3b6075c9c1565b6bdda3c263fa85324eaa443f99f18fe9253afd21f3`, 7,314 characters, equal to the YO-INV-T3 value.
- Parts: `ORO- ORUKO` 125–213 (`d2c2d686d2520be9417362f5758ceedee15bf3a39f617d9bd72b409770e92c51`) with definition 135–141 (`b3efad3d3ee0ec17104d8ee6114e16d0377daab71cf97c14263ea6dd8585c624`), ten `EYA ORO ORUKO` types 145–175 (`51881a0fda6b098fa707451e9ac20ac637185320f8c27acfaf5b6fdf29956c08`) and three functions 179–211 (`53d039ae2d22d50e03dc5323ab5b5187e34c398d4b6ab3bb1e01737ebd60aa98`); `IWE AKATILEWA` 217–219 (`b2a723f6cb2bd47cf34d53db264da86d8902885fd53333e518e63aa6dd469b8e`); `ASA` and `ORISII ORUKO TI A LE SO OMO NILE YORUBA` 223–345 (`7fb7228a0007d353b7bf6daaffbd820c05761f19af9b5c8b437b0af6e00ed307`); `IGBELEWON` 349–353 (`18c35d4f5f8f7838b148a8d444a1e43ddb5ec8f517f0266bfcba915985907089`); `IWE AKATILEWA` 357–359 (`bccdd23c18af81656cd339d6a1010826e9d3f846a2bab5be29d5e1ab328ab4f0`); `ITUPALE EWI APILEKO` 363–385 (`e12aaf57954e421b722ac1b0bb9bd5ff5ae2f27a137fb4874877ee73b5975718`); `IGBELEWON` 389–391 (`3eb47fdacfcd73eaa065da0e943121b6f225ccf81c99438da7cbb5f0bcef0145`); `APAPO IGBELEWON` 395–401 (`af93b7cf4e98c8c460140b58fdb869d571def9d74d8b8225300f5a3cae610827`); `ISE AMURELE` 407–417 (`09deae4610f1d9d553e013d858fe3239650c51bf72c19d889855b3677c2dbc08`); `APA KEJI` 419–423 (`670a27bfb7428ae824f60e3269d11db8dd17a326eb82074454481f87dc321772`). Line 425 is whitespace only.
- The parser produces **no rows** for this source: the extraction contains zero `week` substrings, `WEEK_MARKER` and `BARE_NUMBER_LINE` both match zero times, and `parseTopics` returns `[]` (`NO_PARSED_LESSONS`). These are the parser's own regexes applied statically to the same extraction, not a parser run.
- No `SS1-SRC-4cc6aae9ed7d:BODY:<sha256>` identity exists, so every coverage entry cites exact line ranges and UTF-8 block hashes with `lesson_ids: []`. Static check this run: each of the ten teaching labels `OSE KINNI`, `OSE KEJI`, `OSE KETA`, `OSE KERIN`, `OSE KARUN-UN`, `OSE KEFA`, `OSE KEJE`, `OSE KEJO`, `OSE KESAN-AN` and `OSE KEWAA` occurs exactly once, and their lines 121, 427, 679, 963, 1,281, 1,357, 1,625, 1,879, 2,161 and 2,313 are line-initial. Row identity is left to `YO-FND-T3-01`.

## Coverage entries added (19)
| ID | Objective | Lines | Block SHA-256 | Status |
|---|---|---|---|---|
| `YO-T3-W01-SCHEME-EDE` | Scheme EDE row: Isori oro; oro oruko with oriki, orisii oro oruko and ise | 7; 125–213 | `62087120…47ffa2ea`; `d2c2d686…9770e92c` | PARTIAL |
| `YO-T3-W01-SCHEME-ASA` | Scheme ASA row: asa isomoloruko - amutorunwa, abiso, inagije | 9; 223–345 | `c0bb982e…0d864bd`; `7fb7228a…6e00ed30` | PARTIAL |
| `YO-T3-W01-SCHEME-LIT` | Scheme LIT row: itupale ewi apileko with amuye ewi and koko ewi | 11; 363–385 | `a3b6191c…6bfea206`; `e12aaf57…b5975718` | PARTIAL |
| `YO-T3-W01-EDE-01` | Oro-oruko definition with three example sentences | 135–141 | `b3efad3d…8585c624` | PARTIAL |
| `YO-T3-W01-EDE-02` | Ten eya oro oruko (person to time) | 145–175 | `51881a0f…9956c08` | PARTIAL |
| `YO-T3-W01-EDE-03` | Ise oro-oruko: oluwa, abo, eyan with examples | 179–211 | `53d039ae…bd60aa98` | PARTIAL |
| `YO-T3-W01-EDE-04` | Oriki as a named sub-topic | 127 only | `e45b1925…94a5a3ac`; line `…` | UNRESOLVED |
| `YO-T3-W01-EDE-05` | Lilo oro oruko in sentences | 133; 137–141; 193–211; 213 | `dba5963e…676f4557` | PARTIAL |
| `YO-T3-W01-ASA-01` | Oruko amutorunwa definition and table | 241–267 | `37413dfe…2630bc9c` | PARTIAL |
| `YO-T3-W01-ASA-02` | Oruko abiku definition and seven names | 271–289 | `6cd68a62…f83ae176` | PARTIAL |
| `YO-T3-W01-ASA-03` | Oruko inagije definition and four examples | 293–301 | `daa745fa…cf161da9` | PARTIAL |
| `YO-T3-W01-ASA-04` | Oruko abiso: position/religion and parents' circumstances | 305–345 | `0c9e4067…fe70542b` | PARTIAL |
| `YO-T3-W01-LIT-01` | Ewi apileko definition and akanlo ede ayaworan devices | 363–385 | `e12aaf57…b5975718` | PARTIAL |
| `YO-T3-W01-LIT-02` | Scheme terms amuye ewi and koko ewi | 11; none | `a3b6191c…6bfea206` | UNRESOLVED |
| `YO-T3-W01-ASSESS-01` | Igbelewon: five naming-ceremony items; five names with explanations | 349–353 | `18c35d4f…85907089` | PARTIAL |
| `YO-T3-W01-ASSESS-02` | Igbelewon: analyse the first selected poetry text | 389–391 | `3eb47fda…bcef0145` | PARTIAL |
| `YO-T3-W01-ASSESS-03` | Apapo igbelewon: ten nouns; five names per type; six devices | 395–401 | `af93b7cf…ae610827` | PARTIAL |
| `YO-T3-W01-ASSESS-04` | Ise amurele: five multiple-choice questions | 407–417 | `09deae46…7c2dbc08` | PARTIAL |
| `YO-T3-W01-ASSESS-05` | Apa keji: five amutorunwa names; five abuda with examples | 419–423 | `670a27bf…dc321772` | PARTIAL |

Full values are reproducible with the method above. The 17 PARTIAL entries mean the source teaches the objective (or sets the exercise) but no deliverable lesson exists, the row identity gap blocks parsed delivery, and the defects below must be corrected before teaching. The 2 UNRESOLVED entries mean the objective is in the scheme or the contents list but the body teaches nothing.

## What each part teaches
| Part | Definition | Teaching blocks | Exercise |
|---|---|---|---|
| Oro-oruko | 135 | Ten types 147–175 (person, non-person, animate, inanimate, visible, place, abstract, countable, uncountable, time), examples only | Task 213 asks for four types of ere idaraya, unrelated to nouns |
| Ise oro-oruko | 181 | Oluwa 191–195, abo 199–203, eyan 207–211, two examples each | none |
| Amutorunwa | 241 (heading repeated 245) | Table 247–267: ten rows, Oke twice, Abiona without a meaning | Igbelewon 349–353 |
| Abiku | 271–273 | Table 275–289: seven names with meanings | Igbelewon 349–353 |
| Inagije | 293 | Four examples 295–301 | Igbelewon 349–353 |
| Abiso | 305 | Position/religion table 311–327 (eight rows); circumstances table 331–345 (three names) | Igbelewon 349–353 |
| Ewi apileko | 365 | Awitunwi 367, asorege/asodun 369, owe 371, akanlo ede 373, iforodara 375–385 | Igbelewon 389–391; task 401 |

## Source defects (open item `YORUBA-T3-W01-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 147, 159–175 | The first of the ten noun types carries no numeral while the other nine are numbered 2–10 |
| 2 | 233–239 | The first ASA category (Oruko amutorunwa) is unnumbered while the next three are ii, iii, iv; item i is missing |
| 3 | 241, 245 | The heading `Oruko amutorunwa:-` is repeated immediately before the table |
| 4 | 253, 257, 267 | `Oke` appears twice with different meanings; `Abiona` has no meaning |
| 5 | 343–345 | The Tokunbo meaning is split across two table cells |
| 6 | 213 | A task asking for four types of ere idaraya sits inside the EDE part, unrelated to noun use |
| 7 | 135, 147, 159, 187 | The undefined abbreviation `AP.` stands for apeere |
| 8 | 125 | `ORO- ORUKO` carries a stray space |
| 9 | 273, 315 | `sit un` is split; `Eegunjo bi` ends as a fragment |
| 10 | 365 | `akanlo ede ayaworan` is repeated twice in one sentence |
| 11 | 367 | `awitun` and `Awiunwi` for awitunwi |
| 12 | 373, 383–385 | `Baba agba tit a teru` is garbled and both iforodara examples are garbled |
| 13 | 411, 415, 423 | The stem ends `oluwa, ..... ati eyan`; Q4 pairs a name list with unrelated options; `marun-n` |
| 14 | 409–417 | Every option list is `[a]`, `[b]`, `[d]` with c omitted |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T3-W01-NOTATION`)
- Week 1 (lines 121–426) contains **exactly two non-ASCII characters**: one en dash U+2013 in `Oro –oruko` at 135 and one ellipsis U+2026 in `Iyalaje…abbl` at 157.
- There is no precomposed diacritic, combining mark or soft hyphen anywhere in the section. e/ẹ and o/ọ cannot be distinguished and no tone is marked, although the name tables and the grammar examples depend on both. No marks were added or normalised.

## Assessment, visuals and references
- Six exercise sets, none with an answer, solution or marking scheme: Igbelewon 349–353, Igbelewon 389–391, Apapo igbelewon 395–401, Ise amurele 407–417 and Apa keji 419–423, plus the stranded task at 213. Recorded as `YORUBA-T3-W01-ASSESSMENT-GAPS`.
- `IWE AKATILEWA` 217–219 cites Adewoyin S.Y (2014), *Imo, Ede, Asa Ati Litireso fun ile Sekondiri Agba*, pages 137–141; the ASA reference at 357–359 cites pages 101–119. No edition statement or ISBN is given and the pages themselves are not supplied.
- The document contains no Word table, drawing, picture, OLE object, equation or media file (YO-INV-T3); the name lists are tab-aligned paragraphs and their column structure is flattened in the extraction. No VISUAL_DISPOSITION item is raised.

## Queue changes
- `YO-WK-T3-W01` → `IMPLEMENTED_TESTING_DEFERRED`; previous `next_runnable` value consumed.
- Appended 4 items, all depending on `YO-SRC-T3` and `YO-WK-T3-W01`:
  - `YO-LES-T3-W01-EDE`, `YO-LES-T3-W01-ASA`, `YO-LES-T3-W01-LIT` (LESSON, PENDING, also depending on `YO-FACT-T3-W01-DEFECTS`).
  - `YO-FACT-T3-W01-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED) - one recorded expert decision on the defects and the notation.
- Counts: items 120 → 124; kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; coverage 284 → 303; open items 114 → 120; source_rules 7; lessons 0; status 34 implemented / 70 pending / 20 blocked; `next_runnable` → `YO-WK-T3-W02`, the first eligible PENDING item in queue order.

## Limits
- Indexing only: no lesson authored, no source rule added, no asset, no package delivery change, no schema, compiler, parser or importer edit, no importer or plan run. `yoruba.json` was edited only to add coverage and open items and to update `YORUBA-OBJECTIVE-INDEXING`. Testing deferred by owner.
- Not approved and not verified. The row identity gap is recorded, not resolved: the ten ordinal labels are unique and line-initial, but the scheme carries no week numbers, so whether `split_before` rules can bind this term belongs to `YO-FND-T3-01` (PENDING). The oriki, lilo and LIT gaps and the scheme mapping are recorded as open items; no objective was invented beyond the text.
- The six open items opened by this task are `YORUBA-T3-W01-SCHEME-MAPPING`, `YORUBA-T3-W01-ROW-IDENTITY`, `YORUBA-T3-W01-SOURCE-DEFECTS`, `YORUBA-T3-W01-NOTATION`, `YORUBA-T3-W01-ASSESSMENT-GAPS` and `YORUBA-T3-W01-CONTENT-GAPS`. Each names its own follow-up; none is closed by this note.

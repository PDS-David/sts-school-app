# YO-WK-T1-W08 — Yoruba, 1st Term, Week 8 objective indexing

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. Week 8 is **not delivered**: 10 of its 12 coverage entries are PARTIAL and two (`YO-T1-W08-SCHEME-LIT` and `YO-T1-W08-LIT-01`) are UNRESOLVED because the LITIRESO strand is a heading only. Three lesson items plus one factual-dependency item are appended. Week 8 has **three strands**, and it is the last week of the document.

## Inputs
- Base: `ss1/yo-wk-t1-w07` at `90c935b` (PR #202, Week 7), which is stacked on `ss1/yo-wk-t1-w06` at `7c0e86c` (PR #201), `ss1/yo-wk-t1-w05` at `4dc44d5` (PR #200) and `ss1/yo-wk-t1-w04` at `3d72c04` (PR #199), and on master `f4f0719d57b11fba39b499501060da59efe6532b` (the merge of PR #198, Week 3). PRs #199–#202 are open and unmerged, so this branch is **stacked** and its PR targets `ss1/yo-wk-t1-w07`; it is merged after #199–#202, following the precedent recorded in `ceb9a31` ("Stacked on ss1/yo-wk-t1-w01 (PR #196); merge after #193-#196").
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED`. `YO-WK-T1-W08` was the `next_runnable` recorded by Week 7 in #202.
- Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, 55,974 bytes, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef` **re-verified this run** from the supplied archive (SHA-256 `02448712…65c9a3e`).
- Method (private, outside Git): the same mammoth 1.12.2 `extractRawText` output as Weeks 1–7 (1,781 lines) and a top-level walk of `word/document.xml` to locate tables, automatic numbering, VML shapes and media. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run.

## Scheme mapping
- The opening list (lines 9–51, 22 topic paragraphs, SHA-256 `afccd54e…5b4f6af6`) carries **no week numbers and no week markers**. Week 8 has **three topics**, 20–22, and closes the list:

| Scheme topic | Line | Hash (1 line) | Matches |
|---|---|---|---|
| `Aroko kiko` | 47 | `9cc37dda…079cab45` | EDE heading line 1689 `AKOLE ISE: AROKO KIKO` — word for word apart from the label |
| `Ise abinibi ile Yoruba` | 49 | `bb95eae1…779799e2` | ASA heading line 1727, word for word (case and label aside) |
| `Itupale asayan iwe ti ajo WAEC/NECO yan.` | 51 | `992009c8…6646bafa` | LITIRESO heading line 1765, which inserts `LITIRESO APILEKO` and a space before `/NECO` |

- Week 8 has **three strands and three topics**, the first week since Week 5 with three. Its LITIRESO section, however, is a heading only. Week 8 is the last week of the document: line 1781 is the final trimmed line and there is no examination or revision section after it.
- Weeks 6 and 7 each carry two topics (19–20 in total), which is recorded in their own notes; the Week 8 mapping is recorded as open item `YORUBA-T1-W08-SCHEME-MAPPING`; hash-accounting and classification of the whole list belong to `YO-PRE-T1-1` (PENDING).

## Section
- Teaching label `OSE KEJO`, line 1685, SHA-256 `17b96c33…24fe6dc8`; section lines 1685–1781, trimmed section SHA-256 `1df0a9b8…672d28fd`, equal to the YO-INV-T1 value. The document ends at 1781.
- Parts: `EKA ISE: EDE` 1687–1721 (`2b977b36…f843ca4b`), `EKA ISE: ASA` 1725–1759 (`8661224a…a8ed1cf5`), `EKA ISE: LITIRESO` 1763–1765 (`184c9bfc…4ed9656d`), `Igbelewon` 1767–1777 (`db192f0c…ba4b75c3`), `Ise asetilewa` 1779 (`a711b83b…956da8e7`). The LITIRESO part is a heading only and no literature question occurs in the exercise block.
- Week 8 contains **no Word table, no drawing, no picture, no text box, no OLE object, no equation, no VML shape and no media file**. `word/media/` is empty; the document's 21 `v:shape` elements and 7 `w:drawing`/`w:pict` objects all sit in earlier weeks. Week 8 is a plain list week.
- 31 paragraphs carry Word automatic numbering and `extractRawText` drops their markers: the seven essay types (1695–1707), the six principles of essay writing (1711–1721), thirteen occupation and material items (1735–1759) and the five questions (1769–1777). The thirteen run as one sequence although the last four are a sub-list, so the three `Ona` materials are numbered as if they were occupations.
- The parser produces **no rows** for this source (Yoruba ordinal headings; `YO-FND-T1-01`), so no `SS1-SRC-48b641249e3b:BODY:<sha256>` identity exists. Every coverage entry therefore cites exact line ranges and UTF-8 block hashes, with `lesson_ids: []`.

## Coverage entries added (12: 10 PARTIAL, 2 UNRESOLVED)
| ID | Objective | Lines | Block SHA-256 |
|---|---|---|---|
| `YO-T1-W08-SCHEME-EDE` | Scheme topic 20 (`Aroko kiko`) bound to the EDE part | 47; 1687–1721 | `9cc37dda…079cab45`; `2b977b36…f843ca4b` |
| `YO-T1-W08-SCHEME-ASA` | Scheme topic 21 (`Ise abinibi ile Yoruba`) bound to the ASA part | 49; 1725–1759 | `bb95eae1…779799e2`; `8661224a…a8ed1cf5` |
| `YO-T1-W08-SCHEME-LIT` | **UNRESOLVED** — scheme topic 22 bound to the empty LITIRESO heading | 51; 1763–1765 | `992009c8…6646bafa`; `184c9bfc…4ed9656d` |
| `YO-T1-W08-EDE-01` | `Aroko` defined as thought written on one subject | 1691 | `3fcb3d22…b83a8db0` |
| `YO-T1-W08-EDE-02` | The seven named essay types | 1693–1707 | `9eaa117a…98a05f70` |
| `YO-T1-W08-EDE-03` | First three principles: subject, planning, writing to time | 1709–1715 | `a27ad9f8…1cc7ee94` |
| `YO-T1-W08-EDE-04` | Remaining principles: paragraphing, full language, conclusion | 1717–1721 | `32395195…0ea752ab` |
| `YO-T1-W08-ASA-01` | `Ise abinibi` defined as inherited traditional work | 1729–1731 | `08363e8c…b6fda3a1` |
| `YO-T1-W08-ASA-02` | Ten named indigenous occupations | 1733–1753 | `f15a1a54…3ead068e` |
| `YO-T1-W08-ASA-03` | The `Ise ona` sub-list: wood, stone and leather work | 1753–1759 | `a699870a…4ca3bf6c` |
| `YO-T1-W08-LIT-01` | **UNRESOLVED** — analysis of the set WAEC/NECO literature text | 1763–1765 (heading only) | `184c9bfc…4ed9656d` |
| `YO-T1-W08-ASSESS` | Five questions and one practical, no key | 1767–1777; 1779 | `db192f0c…ba4b75c3`; `a711b83b…956da8e7` |

Full values are reproducible with the method above. Ten entries are PARTIAL: they record what the source does teach while no deliverable lesson exists and no parsed row identity exists. `YO-T1-W08-SCHEME-LIT` and `YO-T1-W08-LIT-01` are **UNRESOLVED**: the LITIRESO strand is only `EKA ISE: LITIRESO` (1763) and a heading (1765), names no text, author, edition or year, and teaches nothing. That gap is raised as an OWNER_ACTION open item, not filled.

## Source defects (open item `YORUBA-T1-W08-SOURCE-DEFECTS`)
| # | Line | Defect |
|---|---|---|
| 1 | 1691 | The definition capitalises `Pataki` mid-sentence, leaves `ori oro` un-hyphenated and writes `si inu` for `sinu`, and gives no purpose or audience beyond `onkawe` |
| 2 | 1693–1707 | Seven essay types are named but none is described or illustrated; `Aroko ojemo – isipaya` joins two names with the week's only en dash without saying whether it is one type or two; and the exercise at 1771 asks for six |
| 3 | 1709–1721 | The section heading has no colon or final stop; six items are numbered as one list although `ILO-EDE` states an importance rather than a principle; `IGUNLE/IKADi` mixes capital and lower case; and 1721 is unpunctuated between `aroko` and `o gbodo` |
| 4 | 1729–1733 | The same term is spelled three ways — `abinibi` in the heading and definition, `isenbeye` in the definition headword and `isembaye` at 1733, 1775, 1777 and 1779 — and 1733 is an indented duplicate lead-in with trailing spaces |
| 5 | 1731 | `f ease-file omo lowo`, `Ni geere` and `ti ele daa yan` are garbled, and `abinibi  Yoruba` has a double space |
| 6 | 1735–1759 | Capitalisation is inconsistent (`Ise Agbe` against `eni hihun`); the list mixes occupations (`Ise Agbe`, `Ise ode`) with tasks (`Ikoko mimo`, `aro dida`); `Ise ona bii;` is numbered as an occupation although the three items under it are materials; `Ona awo ` has a trailing space; and no occupation has a definition, tool or product |
| 7 | 1763–1765 | The LITIRESO strand is a heading only; the heading ends with a full stop and `WAEC /NECO` has a space before the slash; and no set text is named |
| 8 | 1767–1779 | Five questions rather than six, with no answers or marks; 1771 asks for six types against seven listed; 1775 ends with a slash instead of a question mark; no question covers literature; and 1779 misspells `asetilewa` as `aetilewa` and asks for a full explanation of an occupation that the body never explains |

No correction wording is authored here; the lessons must not copy the uncorrected text.

## Notation (open item `YORUBA-T1-W08-NOTATION`)
- Lines 1685–1781 contain **no** tone-marked or sub-dot character: 0 characters in U+00C0–U+024F and 0 combining marks. The only non-ASCII character in the week is the en dash (U+2013) in `Aroko ojemo – isipaya` at 1703.
- This is the same document-wide condition as `YORUBA-T1-W01..W07-NOTATION`, and it bears on the EDE strand because essay writing is where correct spelling is taught: the definition, the seven type names and the six principles are all written without tone or sub-dot, and the model essays the lesson must supply cannot be checked against the source.
- No tone mark, sub-dot or other symbol was added or normalised.

## Assessment and the literature gap
- `Igbelewon` (1767–1777) has five questions: a profile of an essay (1769), six essay types (1771), the principles a writer should follow (1773), the definition of `ise isembaye` (1775, ending in a slash) and the list of indigenous occupations (1777). `Ise asetilewa` (1779) asks for one occupation explained fully and is misspelled `Ise aetilewa`. Neither has answers, marking or completion criteria (open item `YORUBA-T1-W08-ASSESSMENT-GAPS`).
- The exercises are not answerable from the text as it stands: 1771 asks for six types against seven listed, the practical asks for a full explanation although no occupation is explained, and no question covers the LITIRESO strand.
- The LITIRESO strand stops at the heading: `EKA ISE: LITIRESO` (1763) and `AKOLE ISE: ITUPALE ASAYAN IWE LITIRESO APILEKO TI AJO WAEC /NECO YAN.` (1765). No text, author, edition or year is recorded, so `YO-T1-W08-SCHEME-LIT` and `YO-T1-W08-LIT-01` are UNRESOLVED and `YORUBA-T1-W08-LITIRESO-EMPTY` (OWNER_ACTION) requires the owner to name the text or drop the strand.

## Queue changes
- YO-WK-T1-W08 → `IMPLEMENTED_TESTING_DEFERRED`; the previous `next_runnable` value is consumed.
- Appended 4 items directly after YO-WK-T1-W08: `YO-LES-T1-W08-EDE`, `YO-LES-T1-W08-ASA` and `YO-LES-T1-W08-LIT` (LESSON, PENDING, depending on `YO-SRC-T1`, `YO-WK-T1-W08` and `YO-FACT-T1-W08-DEFECTS`) and `YO-FACT-T1-W08-DEFECTS` (FACTUAL_DEPENDENCY, BLOCKED, depending on `YO-SRC-T1` and `YO-WK-T1-W08`).
- Counts: 79 items (from 75), kinds add LESSON 3 and FACTUAL_DEPENDENCY 1; status 14 implemented / 57 pending / 8 blocked; `next_runnable` → `YO-PRE-T1-1`, the first eligible PENDING item in queue order.
- `YORUBA-OBJECTIVE-INDEXING` updated to all eight weeks of the 1st Term (15/15/23/19/14/12/12/12): the 1st Term is now fully indexed at objective level, and its required action moves to the pending preamble, visual and foundation items, then the 2nd- and 3rd-Term indexes.

## Limits
- Indexing only: no lesson authored, no asset, no package delivery change, no schema or compiler edit, no parser/importer run. `yoruba.json` was edited only to add coverage and open items.
- Not approved and not verified. The scheme mapping for Weeks 6–8 is inferred and flagged, and no objective was invented beyond the source text. The missing literature text is recorded as UNRESOLVED and raised to the owner, not supplied.

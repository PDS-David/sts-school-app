# YO-VIS-T1-01 — Yoruba, 1st Term, ATE FAWELI vowel chart

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. The figure is identified and disposed of; the disposition is **recreate as structured data**, and the authored asset is queued as `YO-ASSET-T1-W03-VOWEL-CHART` (BLOCKED). No render of the source is committed.

## Inputs
- Base: `ss1/yo-pre-t1-1` at `d5e5069` (PR #204, the 1st Term preamble), itself stacked on #199–#203 and on master `4159336c7068d2235209221f5f14adc4986acec5`. This branch is stacked and its PR targets `ss1/yo-pre-t1-1`; it merges after #199–#204.
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED`. Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, 55,974 bytes, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef`, re-verified this run from the supplied archive (SHA-256 `02448712…65c9a3e`).
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` (1,781 lines) plus a depth-aware walk of `word/document.xml` top-level body elements and of the one paragraph that carries the figure, to read `mc:AlternateContent`, `wpg`, `v:group` and `v:shape` geometry, `wps:txbx`/`w:txbxContent` and `word/media/`. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run; nothing was rendered.

## Locator, corrected
- The chart is **lines 551–569** (`ATE FAWELI` at 551, header 553, rows 555–569), block SHA-256 `2710e096a6c18874b9321936f332893863db6d11c496f2a3a53353dc58489cc0`; the heading line 551 hashes to `37020eb70f719b6f414807431e3925f1a101df35117541a9502c7c8c249070d9`.
- It sits inside **Week 3**, not Week 1: the `EKA ISE: EDE` part runs 485–573 between `OSE KETA` (483, SHA-256 `4ed1dfb7…5012d83b`) and `OSE KERIN` (725, SHA-256 `bab86961…72c4c14b`). The assignment text says "Week 1 EDE"; the enclosing objective is scheme topic 7 and coverage entry `YO-T1-W03-EDE-07`.
- In XML it is the `w:p` whose first text run is `Iwaju ` and which contains two `mc:AlternateContent` blocks — the **277th** `<w:p` start tag of `word/document.xml` (275 closed paragraphs precede it; the assignment text says paragraph 275). It holds **16** `v:shape`, not 17 (see below), 2 `w:drawing`, 2 `w:pict`, 2 `v:group`, 0 `wps:txbx`, 0 `w:txbxContent`, 0 `w:object`, 0 `m:oMath`; `word/media/` is empty.

## What the drawing is
- Two **side-by-side copies of the same vowel quadrilateral**, each carried as an `mc:AlternateContent` pair: `Group 563` anchored at `margin-left:48.2pt`, 210 × 148.5pt, `z-index:251659264`; `Group 554` at `margin-left:282.7pt`, 191.5 × 140.55pt, `z-index:251660288` (the same grid at 0.912 scale, 3pt lower).
- Each copy holds 8 modern `wps` shapes and a VML fallback of 8 `v:shape`, all of type `#_x0000_t32` (straight arrow connector, `arrowok="t"`, no stroke element). The 16 `v:shape` are therefore **8 connectors × 2 copies**, and the document total of 21 `v:shape` is these 16 plus the 5 Week 6 connectors. The children are `AutoShape 19–26` in Group 563 and `AutoShape 28–35` in Group 554.
- Both groups use `coordorigin="2550,10950"` and `coordsize="4410,2790"` with identical child geometry, normalised here to that space:

| Element | Coordinates | Role |
|---|---|---|
| top edge | (0,0)–(4410,0) | wide upper boundary |
| left side | (0,0)–(1020,2715) | slopes inward |
| right side | (4410,0)–(3345,2790) | slopes inward |
| base | (1020,2715)–(3345,2790) | narrow lower boundary |
| horizontal 1 | (285,765)–(4110,780) | close / close-mid boundary |
| horizontal 2 | (705,1785)–(3705,1785) | close-mid / open-mid boundary |
| interior line | (705,0)–(1995,2310) | front / central divider |
| interior line | (3585,0)–(1995,2310) | central / back divider |

So each copy is a four-band by three-column grid whose central column narrows to a point at the base — the standard vowel trapezoid, not a picture, photograph, text box or equation. It contains no labels of any kind.

## What it depicts
- The height bands are the four classes named in the prose: `ahanupe` (close), `ahanu diepe` (close-mid), `ayanu diepe` (open-mid) and `ayanupe` (open); the columns are `iwaju` (front), `aarin` (central) and `eyin` (back). The header at 553 repeats those three column names twice, once per copy.
- Read with the prose at 519–545, the **left panel carries the seven oral vowels** — `i` and `U` (555), `e` and `o` (561), `e` and `o` (567), `a` (569) — and the **right panel the five nasal ones** — `in` (555), `un` (557), `en` and `on` (565), `an` (567). `an` is the central open-mid nasal, not a back vowel; the earlier evidence entry in `YO-T1-W03-EDE-07` read the chart as "nasal vowels interleaved" in one grid and is corrected by the entry appended in this task.
- The letters alone cannot supply the grid: they are ordinary tab-positioned paragraphs, and extraction flattens them (the header repeats, `U` is a capital, `an` follows a repeated `Ayanudiepe`). The per-vowel descriptions in prose are the authoritative source for the asset: seven oral rows at 521–533 and five nasal rows at 537–545, each naming height, backness and lip posture (`perese` or `roboto`).

## Source defects in the artefact
| # | Locator | Defect |
|---|---|---|
| 1 | 551–569 | The grid is drawn twice, side by side, at different scales (210 × 148.5pt against 191.5 × 140.55pt) and 3pt apart vertically; nothing says whether the pair is intended or a copy-paste duplicate |
| 2 | 555–569 | No right-panel label is repeated for the close-mid nasal row: `Ahanupe` (557), `Ayanudiepe` (567) and `Ayanupe` (569) are repeated for the second panel, `Ahanudiepe` is not, so 565 (`en`, `on`) has no row label |
| 3 | 553 | The axis header `Iwaju / aarin / eyin` is typed twice in one paragraph and separated only by tabs, so a reader cannot tell which set belongs to which panel |
| 4 | 555, 561, 567, 569 | No letter carries a tone mark or a sub-dot: `e` stands for both `e` and `ẹ`, `o` for both `o` and `ọ`, and `U` is a capital where `u` is meant, so the seven oral vowels cannot be read off the figure |
| 5 | 551–569 | The figure has no text boxes and no media: every letter is a tab-positioned paragraph outside the drawing, so the drawings and the labels are only aligned on screen and are lost as a unit in text extraction |
| 6 | 521, 527 | In the prose that the figure summarises, the `a` and `i` rows have lost their leading letters and row 527 reads `Faweli airanmupe hanupe` (for `ahanupe`), so the grid cannot be checked row by row against the prose without a correction decision |

These are recorded, not corrected. No letter is invented and no label is moved.

## Decision
- **Recreate**, as structured data (two grids: seven oral vowels in four height bands by three columns, five nasal vowels in three bands by three columns), to be authored as an SVG asset under `YO-ASSET-T1-W03-VOWEL-CHART` once the notation and defect decisions land. Reason: the figure is the only place where the grid layout is shown, and its letters are unmarked, so neither the source drawing nor a crop of it can be reused faithfully.
- **Reference** was rejected: no external figure is named by the document, and the nearest authority (the prose at 519–545) is itself the material to be turned into the grid.
- **Omit** was rejected: the grid carries the classification the week teaches, and without it the tab-flattened labels at 553–569 are unreadable.
- No render of the source is committed and no asset file is created in this task.

## Package and queue changes
- `YO-T1-W03-EDE-07` keeps `PARTIAL` and gains a third evidence entry that records the structural capture, the two-panel reading and the correction of the earlier "interleaved" reading. No coverage entry was added: the objective already exists.
- New open item `YORUBA-T1-W03-VISUALS` (VERIFICATION, `blocks_delivery` true) inserted after the Week 3 block, affected ids `YO-T1-W03-EDE-03`, `-05`, `-06` and `-07`, recording the geometry, the assignment corrections and the decision, and directing the asset.
- `YO-VIS-T1-01` → `IMPLEMENTED_TESTING_DEFERRED` with the corrected locator and counts.
- Appended `YO-ASSET-T1-W03-VOWEL-CHART` (ASSET, BLOCKED, depending on `YO-FACT-T1-W03-DEFECTS` and `YO-LES-T1-W03-EDE`).
- Counts: 80 items, kinds add ASSET 1; status 16 implemented / 55 pending / 9 blocked; `next_runnable` → `YO-VIS-T1-02` (the first eligible PENDING item in queue order).

## Limits
- Indexing and disposition only: no lesson authored, no asset created, no package delivery change, no schema or compiler edit, no parser/importer run, no render produced or inspected, nothing displayed in the app.
- The cell assignment of each vowel is inferred from the connector geometry together with the prose at 519–545; without a render the exact on-screen column of each letter cannot be confirmed, and the asset must be built from the prose rather than from tab positions. That inference is the reason the asset is BLOCKED rather than authored here.
- Pre-existing inconsistency noted, not changed: the Week 3 note records the `EKA ISE: EDE` part hash `3ee35b93…5ac1566c` for 485–573, which recomputes only over the **untrimmed** range (the trailing blank line 573 included); with the stated edge-trimming convention the value is `b4db99d0…fdaec403`. `YO-WK-T1-W03.md` is outside this task's write paths.
- Not approved and not verified.

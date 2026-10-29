# YO-VIS-T1-02 — Yoruba, 1st Term, Week 6 syllable arrows

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. The five objects are identified and disposed of; the disposition is **omit the drawings and write each pair as text**. No render is committed and no asset is created.

## Inputs
- Base: `ss1/yo-vis-t1-01` at `3a8c278` (PR #205), stacked on #199–#205 and on master `4159336c7068d2235209221f5f14adc4986acec5`. This branch is stacked and its PR targets `ss1/yo-vis-t1-01`; it merges after #199–#205.
- Prerequisite `YO-SRC-T1` is `IMPLEMENTED_TESTING_DEFERRED`. Source `SS1-SRC-48b641249e3b`, manifest member `SSS 1/1st Term SS1_/YORUBA.docx`, SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef`, re-verified from the supplied archive (SHA-256 `02448712…65c9a3e`).
- Method (private, outside Git): mammoth 1.12.2 `extractRawText` plus a depth-aware walk of `word/document.xml` over the five example paragraphs, reading `mc:AlternateContent`, `w:drawing`, `wps:wsp` (`a:prstGeom`, `a:ln`, `a:headEnd`, `a:tailEnd`), `w:pict`, `v:shape` and `v:path`. Line numbers are 1-based lines of `extractRawText().split('\n')`; hashes are SHA-256 over the stated lines joined with `\n`, edge blanks trimmed, UTF-8. The importer, parser and compiler were not run; nothing was rendered.

## Locator, corrected
- The five example lines are **1415–1423** (lead-in 1413), block SHA-256 `1a0b94445d2c6821f698d589d1798d0e8a9047d814b07f15ae1f36e437305db2`, in Week 6 EDE (`OSE KEFA` at 1285, next `OSE KEJE` at 1503).
- The five paragraphs are the **708th–712th** `<w:p` start tags of `word/document.xml` (700–704 closed paragraphs precede them — the numbering the assignment text used) and the 451st–455th top-level body paragraphs. The assignment text says "XML paragraphs 700-704".
- The week holds **five** `v:shape`, not six: one per paragraph. The document total of 21 is these five plus the sixteen in the Week 3 ATE FAWELI chart. There are 5 `w:drawing`, 5 `w:pict` and 5 `mc:AlternateContent` in these paragraphs, and `word/media/` is empty.

## What each object is
- Each paragraph holds one horizontally drawn arrow. The `mc:AlternateContent` has a `Choice` that is a `w:drawing` with a single `wps:wsp`, and a `Fallback` that is a `w:pict` with a single VML `v:shape`: the modern form is `a:prstGeom prst="straightConnector1"` (575 is `bentConnector3`) and the fallback is type `#_x0000_t32` (575 is `#_x0000_t34`).
- All five are unfilled 0.75pt lines with `tailEnd type="triangle"` and no `headEnd`, so each one is a right-pointing arrowhead on a thin line. None has a text box (`wps:txbx` 0, `w:txbxContent` 0) and none is a picture, OLE object or equation.

| Paragraph | Word and segmentation | Shape | Modern / VML form | Size | Anchor (left, top) | z-index |
|---|---|---|---|---|---|---|
| 451 | `Ke` → `k – e` | Straight Arrow Connector 572 | straightConnector1 / t32 | 60 × 0pt | 51pt, 6.7pt | 251661312 |
| 452 | `Je` → `j – e` | Straight Arrow Connector 573 | straightConnector1 / t32 | 60 × 0pt | 51pt, 10.15pt | 251662336 |
| 453 | `Fe` → `f – e` | Straight Arrow Connector 574 | straightConnector1 / t32 | 60 × 0pt | 51pt, 9.05pt | 251663360 |
| 454 | `Gba` → `gb – a` | Straight Arrow Connector 575 | bentConnector3 / t34 | 56.25 × 0.05pt | 54.75pt, 6.15pt | 251664384 |
| 455 | `Sun` → `s – un` | Straight Arrow Connector 576 | straightConnector1 / t32 | 60 × 0pt | 54.75pt, 4.95pt | 251665408 |

## Teaching role
- Each arrow is anchored to the text and laid across the tab gap between the word and its segmentation, pointing right from the word to the split form. It marks the relation for the eye: `Ke` is segmented `k – e`, `Gba` is `gb – a`, and so on.
- The relation is **already carried by the text**: the word and its segmentation are in the same paragraph separated by three tabs, so extraction returns `Ke [tabs] k – e` and a lesson can pair them without the drawing. What the arrow adds is direction and emphasis, not information.
- The five split forms are the substance of the week: consonant-plus-vowel syllables where the consonant is `k`, `j`, `f`, `gb` and `s`, and the vowel is `e`, `e`, `e`, `a` and `un`. That content is in the paragraphs, not in the arrows.

## Source defects in the objects
| # | Locator | Defect |
|---|---|---|
| 1 | 1415–1423, shapes 572–576 | The five arrows do not share one anchor: 572–574 start at 51pt and 575–576 at 54.75pt, and their vertical offsets run 6.7, 10.15, 9.05, 6.15 and 4.95pt in no order, so they cannot be aligned to one rule by reading the file |
| 2 | 1421, shape 575 | The `Gba` arrow is a different shape (`bentConnector3` / `#_x0000_t34`, 56.25 × 0.05pt) from the other four (`straightConnector1` / `#_x0000_t32`, 60 × 0pt) |
| 3 | 1415–1423 | Every arrow is duplicated by an `mc:AlternateContent` pair (modern `wps` shape plus VML fallback), which is why the document looks like it has twice as many drawing objects as arrows; there are five arrows, not ten and not six |
| 4 | 1415–1423 | No arrow carries a label or alt text, and the arrowheads are the only directional cue; in text extraction they vanish without a trace |
| 5 | 1423 | `Sun` is written with a plain ASCII `s` where the sub-dot `s` belongs, so the example itself is unmarked (a separate notation defect) |

## Decision
- **Omit** the five objects. Reason: the word-to-segmentation pairing survives extraction because both members sit in one paragraph, so the arrows carry no information that a lesson cannot state in text; reproducing five 60pt arrows as figures would add alt text, geometry and an asset for no teaching gain.
- Each pair is to be written as text in `YO-LES-T1-W06-EDE`: the word, a colon or right arrow, then the segmentation (`Ke: k – e`, `Gba: gb – a`). That rule is recorded on `YORUBA-T1-W06-VISUALS` and in the new evidence entry on `YO-T1-W06-EDE-05`.
- **Recreate as a figure** was rejected for that reason; **reference** was rejected because nothing outside the document is named and the content is fully present in the text.
- No render of the source is committed and no asset file is created.

## Package and queue changes
- `YO-T1-W06-EDE-05` keeps `PARTIAL` and gains a third evidence entry: the structural capture, the corrected count, the geometry and the decision; it also corrects the first evidence entry's claim that the arrow is the only link between word and segmentation.
- `YORUBA-T1-W06-VISUALS` keeps `blocks_delivery` true, records the disposition and now requires the text-pair rule instead of offering two options. No new open item was needed.
- `YO-VIS-T1-02` → `IMPLEMENTED_TESTING_DEFERRED` with the corrected locators and counts.
- Counts: 80 items unchanged; status 17 implemented / 54 pending / 9 blocked; `next_runnable` → `YO-VIS-T1-03`.

## Limits
- Indexing and disposition only: no lesson authored, no asset, no package delivery change, no schema or compiler edit, no parser/importer run, no render produced or inspected, nothing displayed in the app.
- Whether each 60pt arrow actually spans its tab gap and sits under the intended word is inferred from the anchor coordinates; without a render the on-screen alignment is not confirmed, and the decision does not depend on it because the arrows are omitted.
- Not approved and not verified.

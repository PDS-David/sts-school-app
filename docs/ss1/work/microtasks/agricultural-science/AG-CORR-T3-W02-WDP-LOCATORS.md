# AG-CORR-T3-W02-WDP-LOCATORS — Agricultural Science, Third Term

Status: **IMPLEMENTED_TESTING_DEFERRED**. Reverified the DOCX XML relationships and corrected only the WDP effect-layer associations in `AG-INV-T3.md`. No source bytes or independent visual records were created.

## Source identity

- Source ID: `SS1-SRC-458a07f7ea5a`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`
- Manifest row in `SOURCE_ASSIGNMENTS.csv`: `SS1-SRC-458a07f7ea5a,...,9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a,5406306,3rd Term,agricultural-science,C,...`
- XML source: `word/document.xml`; relationship map: `word/_rels/document.xml.rels`.

Archive/member hashes were independently recomputed from the Library archive and match the manifest.

## Verified image relationships

| Direct-body block | C14N XML SHA-256 | Ordinary image relationships | WDP effect layer |
|---|---|---|---|
| 211 (Week Two) | `eb7fa7f9efaa71470249fb6c5e4b8f6f95517db2a656f26f0bfdc277bf3e8027` | `rId11 → media/image5.png`; `rId12 → media/image6.png` | **None.** No `a14:imgLayer` occurs in this block. |
| 487 (Week Four) | `83769c0683fdbafe2907881e8038e6317812f2d873a017da30b66f6459749081` | `rId16 → media/image10.jpeg`; `rId22 → media/image11.jpeg` | `a14:imgLayer rId21 → media/hdphoto1.wdp` |
| 494 (Week Four) | `bc1c82e7330ecd257d1353d95e0d7f3654ba4aa4e9a61ce3c77a6cf42c403790` | `rId24 → media/image13.jpeg` | `a14:imgLayer rId25 → media/hdphoto2.wdp` |

The relationship file maps:
- `rId21` to `media/hdphoto1.wdp`, 143,121 bytes, SHA-256 `eb9d245d8a2733802fb09c6b50e0c86624589039e4ce60c2981d617c13cd11bc`.
- `rId25` to `media/hdphoto2.wdp`, 173,752 bytes, SHA-256 `8ed46166179ef62e3209445f407491dd0aa99e284a853d2d4c963ecf2595cb11`.

The two WDP files are alternate/effect layers inside the Week Four DrawingML groups at blocks 487 and 494. They are not independent teaching figures and must not be counted as additional standalone visual assets.

## Inventory corrections applied

Only the WDP associations in `AG-INV-T3.md` were changed:

1. The summary now states that the two WDP effect layers belong to **two Week Four groups**, not one Week Two group.
2. Week Two block 211 now lists only `image5.png` and `image6.png`; all WDP references have been removed from that row.
3. Week Four block 487 now records `hdphoto1.wdp` as the effect layer alongside `image10.jpeg` and `image11.jpeg`.
4. Week Four block 494 now records `hdphoto2.wdp` as the effect layer alongside `image13.jpeg`.
5. The inventory's relationship-map paragraph now gives the exact Week Four block locators.

No separate WDP rows or visual records were added. The existing `AG-VIS-T3-W02-ELECTRIC-WATER.md` note already records the same correct mapping and was not changed.

## Changes and verification

- Updated `docs/ss1/work/microtasks/agricultural-science/AG-INV-T3.md` with the verified WDP associations and exact XML block hashes.
- Added this correction record.
- Marked `AG-CORR-T3-W02-WDP-LOCATORS` `IMPLEMENTED_TESTING_DEFERRED`.
- Recomputed archive/member hashes, inspected the three body elements, checked `a:blip` and `a14:imgLayer` references, resolved relationship IDs to exact media targets, and rehashed both WDP files.
- No source bytes, package lesson rows, visual asset rows, source images, or other inventory content changed.
- No importer, compiler, tests, TypeScript, database, learner rendering or device checks were run; testing remains deferred.

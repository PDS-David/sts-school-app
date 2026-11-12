# TD-VIS-W04 — Week Four plain-scale figure-by-figure disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. All nine embedded AutoCAD objects and their nine WMF previews were located and visually inspected through the rendered source pages. Nine bounded derivative tasks have been created. The native OLE controls were not executed; this note records visible previews and source text only.

## Source and method

- Source member: `SS1-SRC-af4868d2c026`; SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`.
- Week Four row: parsed row 14; `word/document.xml` body children [697, 859); rendered PDF pages 19–22.
- Nine embedded `AutoCAD.Drawing.15` objects are anchored at body children 718, 729, 742, 758, 773, 796, 810, 827 and 841. Each object has one VML preview, respectively `word/media/image36.wmf` through `image44.wmf`.
- Rendered the DOCX with LibreOffice 25.2.3.2 and inspected pages 19–22 at high resolution. The WMF previews were inspected visually; no OLE control was activated or executed. Original WMF/OLE bytes and PDF previews remain outside Git.

## Object inventory and disposition

| Figure | XML body child / OLE and WMF part | Visible subject and source context | WMF bytes / SHA-256 | Disposition |
|---|---|---|---|---|
| F01 | 718 / `oleObject1.bin`, `image36.wmf` | Plain scale for RF 1:2½, maximum 400 mm and minimum 10 mm. Text specifies a 160 mm scale, four 40 mm major units, first unit divided into ten, and readings X = 280 mm and Y = 130 mm. Preview shows labelled major graduations and diagonal reading construction. | 36,500 / `51f4c161a02d372de6177971a95935ca509a6eb7cedec181c17cb905169f52f2` | Bind a faithful derivative preserving every graduation, label and diagonal. |
| F02 | 729 / `oleObject2.bin`, `image37.wmf` | Plain scale 2 cm = 1 m (RF 1:50), maximum 6 m in decimetres; total length 120 mm, six 20 mm units and ten subdivisions in the first unit. The example reads 2.4 m / 24 dm. | 71,792 / `dcb5600cbe868389be027ea502559b271ee32d3d1cb80bcf0ddea6193c24aeb8` | Bind a faithful derivative preserving metres, decimetres, zero and subdivisions. |
| F03 | 742 / `oleObject3.bin`, `image38.wmf` | Plain scale 3 cm = 1 dm (10 cm), maximum 4 dm in centimetres; total length 120 mm, four 30 mm units and ten subdivisions in the first unit. The worked reading is 22 cm. | 60,228 / `6614747895550767b8aaf2851ea7b157ea101ba091e55a12d883c5321a72b6ec` | Bind a faithful derivative preserving centimetre graduations and the reading construction. |
| F04 | 758 / `oleObject4.bin`, `image39.wmf` | Enlargement scale 1½ times full size, maximum 8 cm in millimetres; text specifies a 120 mm total length, eight equal units and ten subdivisions in the first unit. | 59,856 / `5303c1555e9c33be841bc614fa91c13ae7adb514f39e4a718f867b1184f8861c` | Bind a faithful derivative; preserve the enlargement ratio and millimetre graduations. |
| F05 | 773 / `oleObject5.bin`, `image40.wmf` | Reduction scale 1/3, maximum 4 dm in centimetres; method divides a 1 dm base interval into three equal parts and subdivides the first unit into ten. | 44,004 / `285d30656f6b92950794c6e22d638b78105cdf6e541cdb17b68d3e5054423ff9` | Bind a faithful derivative preserving the 1/3 ratio and the scale divisions. |
| F06 | 796 / `oleObject6.bin`, `image41.wmf` | Dimensioned furniture/support-like outline used by the exercise to draw a figure at 1:5 (20 cm = 1 m) up to 6 m in millimetres. The preview shows a symmetric frame/stand with a cross-member and dimension lines; some small dimension labels are not reliably legible in the rendered preview. | 47,660 / `65bce7fac66086b258c501e0812ce7d77814fa6be28796f08280db4ffff595de` | Bind a faithful derivative; preserve visible linework. Transcribe small dimensions only from a higher-resolution/native preview; do not guess. |
| F07 | 810 / `oleObject7.bin`, `image42.wmf` | Weekend-assignment composite containing two plain-scale rulers. Upper ruler is labelled from 0 to 120 in tens; lower ruler from 0 to 500 in hundreds. The X and Z reading spans and the 53/70 offset marks are part of the assessment figure. | 120,872 / `2619d4b706481a57c0f210acf4019edbdbf9370e6d7756eec60d5677cb699090` | Bind one faithful composite derivative; preserve both rulers, all labels and the X/Z dimension arrows. |
| F08 | 827 / `oleObject8.bin`, `image43.wmf` | Dimensioned ornamental pedestal/stand used in the theory drawing-to-scale question. Visible labels include overall height 240, base width 180, intermediate widths/heights and a 10×45° chamfer; several smaller labels need native-resolution confirmation. | 51,840 / `9f3c64c1a20090b5d0141149cfefaffb4613d39632ab366a87930f6d774273fe` | Bind a faithful derivative; retain all visible dimensions and mark any illegible native labels for follow-up rather than infer them. |
| F09 | 841 / `oleObject9.bin`, `image44.wmf` | Ornamental gate elevation. Source text supplies overall length 2100 mm and end/post width 300 mm; A–E are the unknown dimensions to measure from the drawing. | 43,964 / `10a083ad382f5e55bc642fbeae1cc6620586afe068d17e21543e40898b926f14` | Bind a faithful derivative preserving the gate bars, posts, dimensions and A–E callouts. |

All nine objects are embedded as `AutoCAD.Drawing.15`; their paired WMF preview is the safe visual representation used for this inspection. The scale rulers are instructional figures, not decorative images. Figures F06, F08 and F09 are assessment-bearing dimensioned drawings and must retain their dimension lines and labels.

## Queue follow-ups

Nine bounded ASSET tasks have been appended: `TD-ASSET-W04-F01` through `TD-ASSET-W04-F09`. Each task names the OLE object and WMF preview, exact XML locator, original WMF SHA-256, intended scale/dimension information and a unique SVG output path. Tasks require faithful geometry, labels, dimension lines, verified derivative hash/byte count, alt text and provenance. They do not permit OLE execution, guessed dimensions or committing original WMF/OLE bytes.

## Checks and limits

- Confirmed nine OLE objects and nine VML preview references in the Week Four body-child range; all nine have `AutoCAD.Drawing.15` ProgID.
- Recomputed all nine original WMF-part SHA-256 values and recorded byte counts.
- Inspected the rendered scale and dimensioned figures on pages 20–22; page 19 contains the scale definition and introductory RF ratios.
- Did not execute embedded controls, create SVG derivatives, bind package assets, run the subject schema/tests/compiler/importer, or verify app display. Those remain outstanding.
- The small dimension labels in F06 and F08 require a higher-resolution/native inspection before transcription; they are explicitly not guessed here.
- No approval, certification or deployment is claimed.

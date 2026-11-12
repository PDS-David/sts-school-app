# TD-VIS-W05 — Week Five diagonal/chordal-scale figure disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. All seven embedded AutoCAD objects and their seven WMF previews were located and visually inspected through the rendered source pages. Seven bounded derivative tasks have been created. Native OLE controls were not executed; this note records visible previews and source text only.

## Source and method

- Source member: `SS1-SRC-af4868d2c026`; SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`.
- Week Five row: parsed row 15; `word/document.xml` body children [859, 1009); rendered PDF pages 23–26.
- Seven embedded `AutoCAD.Drawing.15` objects are anchored at body children 866, 886, 895, 908, 927, 941 and 964. Each has one WMF preview, respectively `word/media/image45.wmf` through `image51.wmf`.
- Rendered the DOCX with LibreOffice 25.2.3.2 and visually inspected pages 23–26 at high resolution and the individual WMF previews. OLE controls were not executed. Original WMF/OLE bytes and PDF previews remain outside Git.

## Object inventory and disposition

| Figure | XML body child / OLE and WMF part | Visible subject and source context | WMF bytes / SHA-256 | Disposition |
|---|---|---|---|---|
| F01 | 866 / `oleObject10.bin`, `image45.wmf` | Diagonal scale of centimetres to read up to 7 cm in millimetres and tenths of a millimetre. Text specifies seven 1 cm major units, ten subdivisions in the first unit and diagonal subdivisions; worked value S = 4.66 cm = 46.6 mm (4 cm + 6 mm + 0.6 mm). | 108,600 / `d0fd9b686031c19366518a6e4859a459aee2d354d4321b389da3e4a5bd4133b1` | Bind a faithful derivative preserving all three measurement scales and diagonal graduations. |
| F02 | 886 / `oleObject11.bin`, `image46.wmf` | Diagonal scale at twice full size, reading up to 6 cm in millimetres and tenths of a millimetre; worked value X = 2.49 cm = 24.9 mm. | 98,288 / `002e7f9be5a38217742a62069cb5f1423cfbb114c4d44a3fc826ca3ba7fd2fab` | Bind a faithful derivative preserving the X reading and diagonal grid. |
| F03 | 895 / `oleObject12.bin`, `image47.wmf` | Diagonal scale 3 cm = 1 m, maximum 4 m, read in decimetres and centimetres; worked value S = 1.93 m = 19.3 dm = 193 cm. | 83,720 / `412a2335cdfe01e5d410232a13597ea05919fecfc37e8daf3075e3b077f96521` | Bind a faithful derivative preserving metre/decimetre/centimetre labels and S. |
| F04 | 908 / `oleObject13.bin`, `image48.wmf` | Diagonal reduction scale 1/4 full size, maximum 5 dm, read in centimetres and millimetres; worked value Z = 3.93 dm = 39.3 cm = 393 mm. | 89,860 / `9d39f0a5baf3d6050accf691002d58bf25162f02f169d18b52ea57d4d7d3348a` | Bind a faithful derivative preserving the reduction ratio, graduations and Z. |
| F05 | 927 / `oleObject14.bin`, `image49.wmf` | Evaluation figure for the question asking for the difference between k and n. It is a diagonal-scale grid with labelled major divisions and k/n measurement spans. The exact k/n reading is not inferred here. | 50,944 / `f826cda7e02e702657d050f6a0cafea8d53e79180ef0aa4b7b68a3cada6b2754` | Bind a faithful derivative; retain the k/n arrows and labels. Exact numeric answer belongs to the keyed-assessment task. |
| F06 | 941 / `oleObject15.bin`, `image50.wmf` | Chordal scale construction for 5° increments. The source method divides a quadrant into 18 equal 5° divisions and transfers chord lengths to the scale. | 150,500 / `94b7a15d4de3836cff7a8dec2d99a14f524cf53ffa601039c948a5981570c1bf` | Bind a faithful derivative preserving the quadrant, chord arcs, degree labels and scale baseline. |
| F07 | 964 / `oleObject16.bin`, `image51.wmf` | Worked 25° angle construction using a scale of chords; radius R is taken from the quadrant, chord r represents 25°, and line PS produces angle SPM. | 56,420 / `0ffa14db4c8b9b9e4e425c553c0119185ae12d51afffd8be68d564ff2da75206` | Bind a faithful derivative preserving the quadrant/scale reference, chord transfer and labelled 25° construction. |

All seven figures are instructional or assessment-bearing. The first five are diagonal-scale figures; F06–F07 are chordal-scale figures. No figure is excluded.

## Queue follow-ups

Seven bounded ASSET tasks have been appended: `TD-ASSET-W05-F01` through `TD-ASSET-W05-F07`. Each names its OLE object, WMF preview, exact XML locator, original WMF SHA-256, scale/construction purpose and unique SVG output path. Tasks require faithful linework, graduations, labels and dimension/angle callouts, plus derivative hash, byte count, alt text and provenance. No embedded control may be executed and no original WMF/OLE bytes may be committed.

## Checks and limits

- Confirmed seven OLE objects and seven VML preview references in the Week Five body-child range; all have `AutoCAD.Drawing.15` ProgID.
- Recomputed all seven original WMF-part SHA-256 values and recorded byte counts.
- Inspected all seven WMF previews and rendered pages 23–26; matched each object to its surrounding source text.
- Did not create SVG derivatives, bind package assets, run subject schema/tests/compiler/importer, or verify app display. Those remain outstanding.
- No approval, certification or deployment is claimed.

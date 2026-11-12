# TD-FACT-W05-SCALE-CONSTRUCTIONS — Diagonal and chordal scale facts

**Status:** IMPLEMENTED — TESTING DEFERRED. All four diagonal-scale constructions, the evaluation construction, the chordal-scale method, angle values and worked readings have been transcribed and checked. Two chordal-scale source inconsistencies remain explicit blockers; no angle value or centre label is silently corrected.

## Source and locators

- Source ID: `SS1-SRC-af4868d2c026`.
- Source member SHA-256: `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`.
- Week Five lesson ID/body SHA-256: `SS1-SRC-af4868d2c026:BODY:2b5d6f2948b4bc9b9684315e7ebcd5ecd033f68849bb19a5e65890ccd435d1cc`.
- Parsed row 15; `word/document.xml` body children [859, 1009); rendered PDF pages 23–26.
- All measurements below are transcribed from the source or derived by applying its stated representative fraction. Source member remains unchanged.

## Diagonal-scale definition and construction

The source says a diagonal scale provides three units of measurement: centimetres, millimetres and tenths of a millimetre (body child 866). It is read from the highest unit to the smallest.

| XML body child / figure | Scale / RF | Range and units | Construction and verified length | Source reading |
|---|---|---|---|---|
| 868–884 / OLE 10, PDF p.23 | Full size, 1:1 | Up to 7 cm; cm, mm and tenths of mm | Draw 7 cm and divide into seven equal 1 cm units. Divide the first unit into ten; draw a convenient height and divide it into ten; project horizontal and vertical lines and draw diagonals through the first unit. | S = **4.66 cm = 46.6 mm = 40 mm + 6 mm + 0.6 mm**. |
| 886–896 / OLE 11, PDF p.24 | Twice full size, 2:1 | Up to 6 cm; mm and tenths of mm | Length = 2×6 cm = **12 cm**; divide into six equal units and use the same diagonal construction. | X = **2.49 cm = 24.9 mm**. |
| 897–910 / OLE 12, PDF p.24–25 | 3 cm = 1 m; RF 3:100 = **3:100** | Up to 4 m; metres, decimetres and centimetres | Length = 3×4 cm = **12 cm**; divide into four equal 3 cm units and use the diagonal construction. | S = **1.93 m = 19.3 dm = 193 cm**. |
| 912–925 / OLE 13, PDF p.25 | Quarter full size, 1:4 | Up to 5 dm; centimetres and millimetres | Length = (1/4)×5 dm = **1.25 dm = 12.5 cm = 125 mm**; divide into five equal units and use the diagonal construction. | Z = **3.93 dm = 39.3 cm = 393 mm**. |

### Evaluation construction

- Body child 928: construct a diagonal scale at **2/5 full size (RF 2:5)**, maximum **3 dm**, read in centimetres and millimetres.
- Verified total length = 3 dm × 2/5 = 1.2 dm = **12 cm = 120 mm**. Three 40 mm major units represent 1 dm each; the first unit's ten subdivisions represent 1 cm actual. The diagonal grid supplies the finer millimetre/tenth-millimetre reading.
- Body child 929 asks for the difference between readings k and n on the diagonal-scale assessment figure (OLE 14 / WMF image49). The figure is legible, but the precise grid intersection values have not been independently calculated in this factual note; answer-key task TD-KEY-W05-ANSWERS must resolve and show the reading path.

## Chordal-scale construction

- Body children 938–965; source PDF page 25.
- The source defines a chordal scale as a means of constructing angles and specifies **5° increments**.
- Draw a quadrant of any radius; divide its 90° arc into 18 equal parts because **5°×18 = 90°**. Extend the baseline and, using the quadrant centre, transfer the chord length for each division to the baseline. The resulting scale has 5° chord increments; the rendered diagram labels 0°, 10°, 20° … 90° and shows intermediate 5° divisions.
- The source diagram labels the quadrant centre A. The method paragraph at body child 962 renders “With 0⁰ as centre”; this does not agree cleanly with the diagram's A label and is left as a source-label issue, not silently rewritten.
- Example 1, body children 967–980, PDF page 26: construct **25°**. Draw PM; use the chord corresponding to 60° (equal to the quadrant radius) as radius R from P to meet PM at Q; from Q use chord r corresponding to 25° to intersect the previous arc at S; draw PS. The resulting ∠SPM is 25°.
- The diagram's radius annotation is 0°–60° and its smaller transferred chord is 0°–25°; these are chord lengths on the constructed scale, not additional scale ratios.

## Recovered angle notation

The original DOCX uses a superscript zero as its degree marker. These are the normalized degree values, located by body child:

| Body child | Degree values |
|---:|---|
| 938 | 5°, 5° |
| 941 | 5° |
| 959 | 5°, 90° |
| 962 | 0° marker in the ambiguous “With 0⁰ as centre” text |
| 967 | 25° |
| 976 | 0°, 60° |
| 978 | 0°, 25° |
| 981 | 24°, 37° |
| 986 | 40° |
| 987 | 27° |
| 988 | 15°, 75°, 105°, 120°, 150° |
| 994 | 27° |
| 1005 | 50° |

The fraction formatting in 1/4, 2/5 and 6/10 is not degree notation. In particular, the superscript 6/subscript 10 in the Week Five worked decomposition is the fraction 6/10 mm.

## Source inconsistency requiring resolution

The source says the chordal scale is for angles that are multiples of 5° (body child 938) and constructs it at 5° increments, but it also cites 24° and 37° as examples (body child 981), asks for 27° in the evaluation (body child 987), and asks which scale constructs 27° in the weekend assignment (body child 994). None of 24°, 37° or 27° is a multiple of 5°. The source does not explain interpolation or provide a finer angular graduation. Do not claim these are exact constructions from the illustrated 5° scale without a corrected method or author confirmation.

## Checks and limits

- Recomputed all four diagonal-scale lengths and the 2/5 evaluation scale length.
- Matched all four worked readings S, X, S and Z to their source figures.
- Recovered the 5°/90° chordal-scale construction and the 25° worked example from source text and figure.
- Recorded all superscript-zero degree markers in the row; fractions were distinguished from angle notation.
- Did not resolve k−n, answer all evaluation/assignment questions, create derivatives, run package schema/tests/compiler/importer, or verify app display.
- No approval, certification or deployment is claimed.

# TD-FACT-W04-SCALE-DETAILS — Week Four plain-scale measurements and arithmetic

**Status:** IMPLEMENTED — TESTING DEFERRED. The source's plain-scale ratios, ranges, construction lengths, divisions and worked readings have been transcribed and checked. Two source issues are isolated: a millimetre/decimetre mismatch in Evaluation Question 6 and a dimensional inconsistency in the ornamental-gate drawing. Those are retained as explicit blockers; no missing value is guessed.

## Source and locators

- Source ID: `SS1-SRC-af4868d2c026`.
- Source member SHA-256: `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`.
- Week Four lesson ID: `SS1-SRC-af4868d2c026:BODY:d9141b54433dff4d82e5eabd00defc9c226eb3f265396382624e1c1da2aac9cd`.
- Parsed row 14; `word/document.xml` body children [697, 859); rendered PDF pages 19–22.
- The source defines representative fraction as drawn size divided by represented/actual size (body children 704–705).
- All dimensions below are source values unless explicitly labelled as a derived calculation. Original source bytes are unchanged.

## General scale ratios taught

The source lists these common representative fractions (body children 707–712):

| RF | Meaning |
|---|---|
| 1:1 | Full size |
| 1:2 | Half full size |
| 1:5 | One-fifth full size |
| 1:10 | One-tenth full size |
| 2:1 | Twice full size |
| 5:1 | Five times full size |

The source also states that a plain scale represents two units, identified as metres and decimetres (body child 714).

## Worked plain-scale constructions

| XML body child / rendered figure | Scale / RF | Range and unit | Source construction and verified arithmetic | Worked reading |
|---|---|---|---|---|
| 721–734 / OLE 1, PDF p.20 | 1:2½ = 1:2.5 | Maximum 400 mm; minimum 10 mm | Scale length = 400/2.5 = **160 mm**. Divide into four 40 mm major units; subdivide the first 40 mm into ten, so each 4 mm on paper represents 10 mm actual. | X = **280 mm**; Y = **130 mm** (body child 734). |
| 736–748 / OLE 2, PDF p.20 | 2 cm = 1 m; RF 2:100 = **1:50** | Maximum 6 m; read in decimetres | Length = 6×2 cm = **12 cm = 120 mm**. Six 20 mm major units; first unit divided into ten, so each 2 mm on paper represents 1 dm actual. | Source example: **2.4 m = 24 dm**. |
| 750–762 / OLE 3, PDF p.20 | 3 cm = 1 dm (10 cm); RF **3:10 = 1:3⅓** | Maximum 4 dm; read in centimetres | Length = 4×3 cm = **12 cm = 120 mm**. Four 30 mm major units; first unit divided into ten, so each 3 mm on paper represents 1 cm actual. | Source example: **22 cm**. |
| 763–772 / OLE 4, PDF p.20–21 | 1½× full size; RF **3:2** | Maximum 8 cm; read in millimetres | Length = 8×1.5 cm = **12 cm = 120 mm**. Eight equal 15 mm major units; first unit divided into ten, so each 1.5 mm on paper represents 1 mm actual. | No separate numerical reading is stated in the source. |
| 774–786 / OLE 5, PDF p.21 | 1:3 reduction | Maximum 4 dm; read in centimetres | One 1 dm actual unit is represented by 100/3 = **33⅓ mm** on paper. Four units give a derived total length of **133⅓ mm**. Source method: draw 1 dm, divide it into three equal parts, each part represents 1 dm; step off one part to obtain 4 dm; divide the first unit into ten. | No separate numerical reading is stated in the source. |

## Revision and evaluation questions

| XML body child | Source question | Verified result / construction data |
|---:|---|---|
| 790 | Construct 4 cm = 2 dm to read up to 5 dm in centimetres. | RF = 4:20 = **1:5**. Maximum 50 cm; length = 50/5 = **10 cm = 100 mm**. Five 20 mm major units; first unit divided into ten, each 2 mm represents 1 cm. |
| 791 | Construct 2½ times full size to read up to 6 cm in millimetres. | RF = **2.5:1**. Length = 6×2.5 = **15 cm = 150 mm**. Six 25 mm major units; divide the first unit into ten for 1 mm actual increments (2.5 mm on paper). |
| 792 | Construct 1/4 scale to read up to 7 dm in centimetres. | RF = **1:4**. Maximum 70 cm; length = 70/4 = **17.5 cm = 175 mm**. Seven 25 mm major units; first unit divided into ten, each 2.5 mm represents 1 cm. |
| 793–794 | A 6.50 km land length at 1:500; find the scale-rule reading in millimetres. | Literal source data gives 6.50 km = 6,500,000 mm; 6,500,000/500 = **13,000 mm = 13 m**. This is a very long drawing length, but the arithmetic follows the stated units; no silent km-to-m correction is made. |
| 795–796 | Construct 20 cm = 1 m to read up to 6 m in millimetres; use it to draw the dimensioned figure. | RF = **1:5**; length = 6×20 cm = **120 cm = 1,200 mm**. Each 1 m major unit is 200 mm on paper. The stated millimetre reading unit is inconsistent with the source's normal ten-part plain-scale subdivision; see blocker below. |
| 821–822 / OLE 7, PDF p.22 | Read X and Z on the two scale rulers. | The measured subdivision offsets give **X = 87 mm, Z = 390 mm**, matching option A. The upper ruler is numbered 0–120 in tens; the lower 0–500 in hundreds. |
| 823 | Length of a 3 m line at 1:50. | 3,000/50 = **60 mm** (option B). |
| 824 | Number of units represented by a plain scale. | **Two** (metres and decimetres; option B). |
| 825–826 | Scale ratio of rulers in a mathematical set. | **1:1** (full size; option B). |
| 827 | Which is not an enlargement scale: 5:3, 3:4, 2:1, 3:2. | **3:4** is a reduction (option B). |

## Dimensioned theory figures

- **Pedestal (body child 827, OLE 8, PDF p.22):** scale 1:2. Visible source dimensions are overall height 240, base width 180, stem width 40, upper platform width 100, vertical segments 40 and 30, vertical dimension 190, base height 50, step 10, and a 100×45° chamfer. Units are not printed beside each number; the exercise asks for a 1:2 drawing, so the source dimensions are treated as millimetres only if the teacher confirms the drawing convention.
- **Ornamental gate (body children 841–843, OLE 9, PDF p.22):** known overall length 2100 mm and left post dimension 300 mm; A–E are to be measured. The rendered preview's pixel proportion between the 2100 and 300 dimension lines is approximately 7.6:1, while the stated actual proportion is 7:1. This discrepancy means a scale and A–E values cannot be reliably derived from the rendered preview alone. The original native drawing or a corrected dimensioned source is required.

## Explicit source issues (not guessed)

1. **Evaluation Question 6 unit mismatch:** 20 cm = 1 m gives RF 1:5. If the first 1 m unit is divided into ten, each division represents 1 dm, not 1 mm. To read 1 mm actual at this RF would require 1,000 subdivisions per metre (0.2 mm on paper per division), not a practical plain-scale graduation. The source may have intended “decimetres”; this correction must be confirmed before the question is published as written.
2. **Ornamental gate scale inconsistency:** the 2100 mm and 300 mm dimension lines do not have the same proportional ratio in the rendered preview as the stated actual dimensions. Do not infer A–E or a scale until the native drawing or corrected source is obtained.
3. **Dimensioned frame exercise:** small labels in OLE 6 are not reliably legible in the WMF preview; exact labels remain deferred to native-resolution inspection.

## Coverage and follow-up

The source supports the Week Four common-ratio, construction and scale-reading objectives. The exact evidence is now recorded so the three previously PARTIAL coverage entries can be upgraded to SUPPORTED without changing the original lesson identity. Visual assets remain separate and pending in `TD-ASSET-W04-F01..F09`; complete answer keys/marking remain in `TD-KEY-W04-ANSWERS`.

## Checks and limits

- Recomputed all stated scale lengths and RF calculations from the source text.
- Read the two worked readings and the X/Z scale rulers from the rendered source figures.
- Transcribed the visible pedestal dimensions and recorded the gate proportion inconsistency.
- Did not create asset derivatives, resolve the unit/gate source issues, add an answer-key supplement, run package schema/tests/compiler/importer, or verify app display.
- No approval, certification or deployment is claimed.

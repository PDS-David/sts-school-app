# PHYS-WK-T3-W02 — Third Term Week Two: resistors and cells in series and parallel

Status: **IMPLEMENTED_TESTING_DEFERRED** — the exact registered source row and rendered pages 3–5 have been inspected. Source indexing and answer keys are complete; original SVG teaching aids cover the connection diagrams.

## Registered source identity

- Source ID: `SS1-SRC-bed91bb4ef0e`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 PHYSICS.doc`
- Member SHA-256: `bcd7daab57432b5c2b74a29e4afc1f162276e5fe360fab50345426fc3503e688`
- Parsed row: index 1, WEEK 2
- Parsed body ID: `SS1-SRC-bed91bb4ef0e:BODY:6f3000c945cc9e520159fffb8af5b8bea8eb50bf57f72f5a96dc7ab3c7aef3d7`
- Parsed body length: 2,728 characters
- Parsed body SHA-256: `6f3000c945cc9e520159fffb8af5b8bea8eb50bf57f72f5a96dc7ab3c7aef3d7`
- Original member hash verified against the registered archive manifest in workflow run 43126374868.

## Source content inventory

The original row covers:
- Resistors in series: same current, additive p.d. and resistance.
- Resistors in parallel: same p.d. across branches, additive branch current and conductance.
- Equivalent-resistance formulae for series and parallel networks.
- Cells in series-aiding and parallel; equivalent emf for identical cells.
- Calculations using 2 Ω, 3 Ω and 5 Ω in series/parallel; 2 Ω, 2 Ω and 1 Ω in series/parallel; a 2 kΩ resistor carrying 1 mA; and two 1 Ω resistors in parallel with a 2 Ω resistor.
- Conductance and its relationship to resistance.
- A 15 V battery with 5 Ω internal resistance and 20 Ω external resistance: current, terminal voltage and lost voltage.
- A charge of 8 C passing in 2 s.
- Two evaluation blocks, five weekend MCQs and two theory questions.

## Source correction

Correction record: `CORR-PHYSICS-T3-W02-PARALLEL-CELL-EMF`.

The source's identical-cell parallel emf equation is typeset without grouping as `E_T=E+E+E/3=3E/3=E`. The lesson gives the correct result for identical cells in parallel, `E_T=E`, and explains the reduced effective internal resistance for matched cells. It does not silently treat the ambiguous expression as a valid ungrouped arithmetic statement.

## Source assessments and answer keys

The existing lesson already keys the resistor series/parallel calculations, four-cell series/parallel emf, internal-resistance/terminal/lost-voltage calculation, and 8 C in 2 s current question. Two exact source gaps were added:
- Q19: two 1 Ω resistors in parallel with a 2 Ω resistor, equivalent resistance 0.4 Ω (3 marks).
- Q20: relationship between resistance and conductance, `G=1/R` (2 marks).

The lesson now has 20 questions with complete answers and marking. The five weekend MCQs are covered by Q08, Q09, Q15, Q16 and Q19; the two theory questions are covered by Q11/Q12 and Q18.

## Rendered-source and visual disposition

WEEK TWO occupies rendered source pages 3–5:
- The original pages contain text and formulae but no clear resistor/cell connection diagrams.
- Registered original teaching aids attached to the lesson:
  - `PHYS-ASSET-T3-W02-SERIES-PARALLEL`
  - `PHYS-ASSET-T3-W02-CELLS-SERIES-PARALLEL`
- These are original instructional SVG equivalents, not recovered source images.
- The recurring provider logo is a watermark, not a teaching asset.

## Package mapping

- Coverage entries `COV-PHYS-T3-W02-OBJ-1` through `OBJ-5` remain `IMPLEMENTED_EQUIVALENT` and now cite the exact original row and both visual assets.
- Lesson: `SUP-SS1-PHYSICS-T3-W02-RESISTORS-CELLS-SERIES-PARALLEL`
- Practice: 20 questions.
- `content_approval=PENDING`; `verification=DEFERRED`.

## Checks

- Original row text and rendered source pages 3–5 inspected.
- Original archive member hash verified against the source manifest.
- JSON parse, unique practice IDs, answer presence, marking totals, coverage references and queue recount checked before commit.
- Full package tests, importer and SVG safety for this commit: pending CI.

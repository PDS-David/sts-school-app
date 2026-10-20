# M1: two Mathematics equation layouts (before / after)

Base master `02e596e8e53e1beea7a4b4b0aa52ba9308638a4d`. Scope: First Term `JSS 3 MATHEMATICS.docx`, paragraphs 704 and 708 (with 705 and 709) only.

## Locator convention (verified)
Zero-based index over every `w:p` in `word/document.xml` (828 paragraphs; no nested paragraphs, so equal to the body index). Indexes 704/708 carry the connectors; 705/709 carry the y rows. The register's "equation layouts with fractions" label was wrong: these are four graph tables of values (two per example) in lesson SIMPLE EQUATIONS INVOLVING FRACTIONS (order 9).

## Before
Imported text puts both tables of an example into the same lines (`x 0 2 4 … x -1 0 5 = 2`), so the pairing of values with their line and the drawn grid are lost. Plain LibreOffice also drops the inline x/y labels. Register row M1-O04: NOT VISUALLY RESOLVED.

## After
- Two figures (scratch-copy render, Office Math in these four paragraphs turned into ordinary runs with the same characters; nothing redrawn or corrected): `curriculum-assets/jss3/m1-equations/`, bound by `M1_EQUATIONS_MANIFEST.csv` (title guard + row guard `M1_ROW_GUARDS.csv`) to the original lesson. Captions/alt text are labelled; the explanation of the slips is added text, not source.
- Verified by calculation: (a) crosses at (2, −1). (b) tables fit 2x+y=10 and 4x−2y=4 (existing INFERRED correction M1-GRAPH-PAIR); they cross at (3, 4), beyond the last tabulated x = 2.
- Source slips found, **not edited**: the note prints "x = 2 / x = −1" beside both examples. In (a) the second label is typed `x` where `y` is meant. In (b) the labels repeat (a) and fit neither the corrected pair nor the printed parallel pair. The existing lesson SUP-MATH-SIMULT-GRAPH already works both examples correctly.
- Original row text and body hash unchanged (no importer or correction file touched). Only register row M1-O04 changed.
- Regression `tests/jss3-m1-equation-layouts.test.mts`: recomputes every table value and crossing; checks that the flat text interleaves both tables; asset bytes/identity; negative cases; and (with `JSS3_ALL_ROOT`) the real source's values, math labels (including the typed-x slip) and 8 connectors per example.

## Not done / limits
- Rendered in LibreOffice, not Word, and not checked on a device. Assets are not attached to any database by this task (dry run only; no production action).
- Intended (b) pair still needs the teacher. Other Mathematics items untouched.

## Reproduce
```
python3 -I scripts/jss3/m1/render_equation_layouts.py --m1 "$IN/ALL/JSS3 1ST TERM /JSS 3 MATHEMATICS.docx" --spec scripts/jss3/m1/m1_equation_layouts.json --out curriculum-assets/jss3/m1-equations
python3 -I scripts/jss3/m1/build_m1_manifest.py --capture CAP/supplemented-rows.json --assets curriculum-assets/jss3/m1-equations --out curriculum-assets/jss3/m1-equations --expect-guards curriculum-assets/jss3/m1-equations/M1_ROW_GUARDS.csv
JSS3_ALL_ROOT="$IN/ALL" node --import tsx --test tests/jss3-m1-equation-layouts.test.mts
```

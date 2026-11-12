# Second Term equation/format extraction audit

**Source member:** `SSS 1/2nd Term SS1_/2ND TERM S1 FURTHER MATHEMATICS.docx`  
**Source SHA-256:** `3f9b36a0d90af06f9eb82bacd4dbc29a7737290566fd1109f51983537844bb36`  
**Method:** Inspected original DOCX WordprocessingML paragraph content and formatting. Counts below are source XML formatting markers grouped by week; they indicate formatting/embedded math risk, not unique equation counts. Plain paragraph text does not preserve superscript/subscript presentation and can omit Office Math content. No source file or anchor was changed.

| Source week | Superscript runs | Subscript runs | OMML equations | Drawing/picture markers | Delivery/usability finding |
|---|---:|---:|---:|---:|---|
| 1 — Sequences/AP | 75 | 129 | 0 | 4 | Formula indices/subscripts are formatting-dependent. Replacement AP lesson supplies explicit nth-term, mean and sum formulas, worked examples and keyed questions. |
| 2 — GP | 98 | 68 | 0 | 4 | Powers/subscripts and radical notation are at risk. Replacement GP lesson states finite-sum and convergence conditions and corrects sign ambiguity. |
| 3 — Linear inequalities | 39 | 1 | 0 | 11 | Inequality signs and roots need exact rendering; replacement includes corrected intervals and original sign/number-line diagrams. |
| 4 — Two-variable inequalities/LP | 16 | 0 | 0 | 1 | Inequality signs and graph regions are essential. Replacement includes corrected feasible-region/optimisation examples and five original graphs. |
| 5 — Mapping/functions | 31 | 4 | 0 | 46 | Function notation and mapping figures are formatting/image-dependent. Replacement includes corrected function definition, mapping types and an original mapping diagram. |
| 6 — Revision marker | 0 | 0 | 0 | 0 | Source row contains only the revision marker; separate 50-mark assessment covers Weeks 1–5. |
| 7 — Composite/inverse mappings | 31 | 0 | 0 | 23 | Composition and inverse notation can flatten; replacement gives order-sensitive composition, bijectivity, algebraic inverses and domain restrictions. |
| 8 — Trigonometry | 100 | 0 | 13 | 36 | Dense superscript/OMML notation and missing figures make text extraction unsafe. Replacement supplies identities, quadrant rules, special/general angles and five original SVGs. The source expression y=sinθ/2 remains ambiguous pending teacher clarification. |
| 9 — Logic | 8 | 12 | 0 | 8 | Logical subscripts/symbols and figures need careful rendering; replacement corrects invalid conditional/biconditional examples and includes keyed practice. |
| 10 — Logical connectives | 0 | 0 | 38 | 0 | Most symbolic logic is embedded as Office Math. Replacement explicitly renders connectives and truth tables and corrects tautology/contradiction and distributive-law errors. |

**Finding:** a plain-text import alone cannot be considered student-ready for these source rows. The current replacement lessons provide the mathematical content and practice in ordinary text/math notation; no source equations were guessed or source anchors altered. Week 6 remains a marker plus separate assessment, not a source teaching lesson.


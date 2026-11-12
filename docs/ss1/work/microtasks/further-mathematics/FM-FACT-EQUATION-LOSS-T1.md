# First Term equation/format extraction audit

**Source member:** `SSS 1/1st Term SS1_/1ST TERM S1 FURTHER MATHEMATICS.doc`  
**Source SHA-256:** `995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145`  
**Method:** Original archive member hash verified; a working DOCX conversion was made with LibreOffice solely to inspect paragraph formatting and embedded objects. Counts below are XML formatting markers in the converted working copy, grouped by source week. They are evidence of mathematical formatting/embedded material, not counts of unique mathematical equations. Conversion may alter legacy OLE internals. No source file or anchor was changed.

| Source week | Superscript runs | Subscript runs | OMML equations | OLE objects | Drawing/picture markers | Delivery/usability finding |
|---|---:|---:|---:|---:|---:|---|
| 1 — Indices | 146 | 0 | 0 | 0 | 0 | Exponent structure is formatting-dependent. Replacement indices lesson supplies explicit laws, fractional/negative indices, worked examples and keyed practice. |
| 2 — Indicial/exponential equations | 113 | 0 | 0 | 0 | 2 drawings | Powers are formatting-dependent. Two 41-byte Equation Native objects remain separately unresolved under FM-FACT-T1-W02-EQ-OBJECTS; their displayed content and ObjectLocation mapping were not guessed. Replacement lesson covers the recoverable equation methods. |
| 3 — Logarithms | 125 | 116 | 0 | 1 | 118 | Dense superscript/subscript use and an embedded OLE object make plain-text extraction unsafe. Replacement lesson rewrites logarithm laws, domains, change of base and standard-form work; source defects are separately recorded. |
| 4 — Set review | 0 | 0 | 0 | 0 | 0 | Only a short review heading/label is present; no substantive teaching body. Replacement review lesson supplies the missing material. |
| 5 — Sets/Venn diagrams | 73 | 0 | 0 | 0 | 307 | Many embedded pictures plus mathematical notation. Replacement lesson supplies set operations, counting examples and four original Venn visuals; source arithmetic/diagram defects are recorded. |
| 6 — Revision | 31 | 24 | 0 | 0 | 2 | Revision material uses formatted indices/logs; source revision is narrow. Replacement lesson now revises indices, logarithms and set theory; separate 50-mark periodic test exists. |
| 7 — Binary operations | 9 | 0 | 10 | 0 | 0 | Equation objects are used for operation notation/tables. Replacement binary-operation lesson is present with worked examples and keyed practice. |
| 8 — Identity/inverse tables | 29 | 1 | 0 | 0 | 0 | Superscript/subscript notation can flatten; replacement lesson explains identity, inverse and operation tables. |
| 9 — Surds | 17 | 1 | 0 | 0 | 16 | Root/radical notation and embedded figures require visual/math-aware handling; replacement lesson covers simplification, rationalisation and equality of surds. |
| 10 — Statistics | 2 | 19 | 0 | 0 | 48 | Subscripted frequency notation and embedded charts are extraction risks; replacement lesson covers grouped/ungrouped measures and histogram mode. |

**Finding:** plain-text extraction is not sufficient as a student delivery format for several rows. The replacement lessons supply the instructional mathematics for all listed teaching rows. The two unresolved Equation Native objects in Week 2 remain a separate, explicit source fact gate; their meaning has not been invented. First Term Week 6 is a revision marker plus authored replacement, not a new source lesson.


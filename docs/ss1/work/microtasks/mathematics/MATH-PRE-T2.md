# MATH-PRE-T2 — Mathematics: 2nd Term preamble inventory

Status: `IMPLEMENTED_TESTING_DEFERRED`. One task only; nothing was run (no schema parse, compiler/plan, test, typecheck, importer, database, device, migration, import or deployment). Base: master `89d8fbc` (fetched 2026-10-30; local HEAD equals `origin/master`). Open PRs at start: #249 (Literature LIT-INV-T2) only; it does not touch Mathematics, and no open PR owns this subject.

## Inputs

- Member `SSS 1/2nd Term SS1_/2ND TERM S1 MATHEMATICS.docx`, 1,110,196 bytes, SHA-256 `9bcc6573d7b3c9babd7c984db1bf79cae6385e9fa3fd5820fdf8cf26af9b3368` (verified against the manifest value; supplied inside the partial ZIP `2nd_Term_SS1_-20230730T171417Z-001.zip`; the composite archive hash was not checked). Dependencies `MATH-SRC-T2` and `MATH-FACT-HEADER-T2` are `IMPLEMENTED_TESTING_DEFERRED`.
- Extraction: mammoth 1.12.2 `extractRawText()`: 70,220 characters, 5,609 lines, 1,889 non-blank. `word/document.xml`: `w:tbl` 7 (none in the opening region), `w:pict` 617, `m:oMath` 62, `w:sectPr` 1; one header part (`word/header1.xml`, one `w:drawing`, no text) and one footer part.
- Line numbers are 1-based lines of that extract. Block hashes are SHA-256 over the stated lines joined with `\n`, UTF-8, no trailing newline, leading/trailing blank lines trimmed; lines keep trailing spaces and tabs. Week boundaries were found by applying the importer's `WEEK_MARKER` pattern by hand (the importer was not run): ten labels, `WEEK ONE` (line 83) to `WEEK TEN` (line 5151).

## Non-week region (lines 1-82)

| Lines | Content | SHA-256 | Disposition |
| --- | --- | --- | --- |
| 1 | `SECOND TERM E-LEARNING NOTE` | `c3a8dc39c250fd530499bc2d27d4d50ed829835a1e586e85165d2d16dad0edd9` | `RULE-MATH-T2-TITLE`, `COV-MATH-T2-TITLE` |
| 5 | `SUBJECT: MATHEMATICS\t\t\t\t\t\t\t\tCLASS: SS 1\t` (trailing tab; the registered `header_text` omits it) | `af4cb4b9d92b6ef817117fad4273be49afd11d835472fddeebab3c4af85016cb` | `RULE-MATH-T2-ALIAS` (source registration) and `COV-MATH-T2-TITLE` |
| 9 | `SCHEME OF WORK` | `8104f5ba0f84b6d0bd6c7197460d87d05b526578cebae1ae784ad29a8b48f15e` | `COV-MATH-T2-TITLE` |
| 13 | `WEEK\tTOPIC ` (one trailing space) | `0a7bcefdb62032fcabc408940fc69708f54b2d2b8d2daa70f3af30be038a450e` | `COV-MATH-T2-TITLE` |
| 1-13 | title, subject line, scheme heading and column header | `8675f847251f5d8e5a29b97ac819869ec7fd04b83c2b4e74ad1587006e1917b0` | `COV-MATH-T2-TITLE` (MARKER) |
| 15-73 | ten scheme rows (next table) | `f36a6acce562c3133ec10472d24ea5e4d986c439c7664ab06786728f0b052151` | one row per week: `MATH-WK-T2-W01`..`W10`; existing `COV-MATH-T2-R00`..`R09` cite scheme topics 1-10 |
| 77-81 | `REFERENCE BOOK` and two titles | `5701d218625e6ca58d67b9a72e50505a9450895a05fc4fa74ec0dab9365a3714` | `COV-MATH-T2-REFERENCES` (MARKER, `RULE-MATH-T2-REFERENCES`) |
| 1-81 | whole non-week region | `ae5daacc723ce3eabd2000ff7da0b57e039f7e308edab410cd80a75bce072a52` | accounted by the two coverages above plus `COV-MATH-T2-R00`..`R09` |
| before line 83 | `text.slice(0, index of the first parsed body)` (lines 1-82, offset 1675) | `ccfe36eee1ca42b3df6f30f2c4b828bdf5633f7750476d96288c59ff8e8b84c9` | exact value the compiler's `PREAMBLE_REQUIRES_COVERAGE` detail will hold; computed by slicing, the importer was not run |
| footer part | `MR OSHO/1ST TERM/SS 1/MATHEMATICS Page 1` and field ` PAGE   \* MERGEFORMAT ` | `941819e3e89523c5a23c8f48d4fcb38c609abe1fa7aff67a60aa4bbdb29b19dd` / `fab861c4365bb71c462128ad93450c22e1a85882991ce8b9c49ad51e3addcc45` | page furniture, recorded here only (not body text) |
| header part | one drawing, no text | — | page furniture, recorded here only; already noted in `MATH-FACT-HEADER-T2` |

Blank lines in 1-82 are the paragraph separators and the empty paragraphs at lines 3, 7, 11 and 75. Line 83 is `WEEK ONE`, the first parsed label; parsed bodies start there. There is no examination row and no revision row outside the Week 6 scheme row (line 41); nothing resembling a reference block or a revision/examination row appears after line 83 (case-insensitive search: `reference` and `revision` do not occur; `review` and `periodic test` occur only in the Week 6 body line 2637; `examination` occurs only inside worked-example text at lines 2527, 5283, 5475, 5477 and 5487).

## The scheme rows are an auto-numbered list

- `word/document.xml` body children 7-36 (0-based) are the scheme paragraphs. Ten of them carry `numId` 48, level 0, `numbering.xml` abstractNum 24: decimal, start 1, level text `%1.`; Word therefore renders the week numbers 1-10. Their lettered sub-items use other lists (`numId` 49-53, lower-letter `(%1)`), and the unnumbered continuation paragraphs are line 19 and the `(b)`/`(c)` lines 57, 59, 63 and 65.
- `mammoth.extractRawText()` emits no list markers, so the extract has no numbers and the column header `WEEK\tTOPIC ` is textually followed by unnumbered rows. Row grouping below follows the `numId` 48 paragraphs (each starts a new row), not the extract text.
- The parsed body has ten explicit labels (`WEEK ONE`..`WEEK TEN`), so scheme rows 1-10 correspond one-to-one by order with body weeks 1-10. Week 6 is a revision/periodic-test body of two non-blank lines, `WEEK SIX` (2635) and `Review of the first half term’s work and periodic test ` (2637) (`RULE-MATH-T2-W06-REVISION`, `COV-MATH-T2-R05`).

## Scheme topic rows (lines 15-73) mapped to the week items

| Scheme row | Lines | Block hash | Week item | Existing coverage | Text (verbatim, lines joined with ` / `) |
| --- | --- | --- | --- | --- | --- |
| 1 | 15 | `92cf07d56f7f525b88244ddcac74a4053da3ad0f6f735bff670ce6708c0b777f` | `MATH-WK-T2-W01` | `COV-MATH-T2-R00` | `Quadratic Equation by (a) Factorization (b) Completing the square method ` |
| 2 | 17-19 | `8150fab571a6d765cc50f9f96a69fe2f535aa86890d5f68ebaf0f8c8190acb60` | `MATH-WK-T2-W02` | `COV-MATH-T2-R01` | `General Form of Quadratic Equation leading to Formular Method  / from ax2 + bx + c = 0 ` |
| 3 | 21-27 | `f6bd431ceef5944016e829a3f3e56a0393b46b47611306289cf324724d135dc7` | `MATH-WK-T2-W03` | `COV-MATH-T2-R02` | `Solutions of Quadratic Equation by Graphical Methods:  / Reading the Roots from the Graph  / Determination of the Minimum and Maximum Values  / Line of Symmetry. ` |
| 4 | 29-33 | `43757f557315c68dcf0ed374526df00db3cd61a6747c65ef2a9add7cf1a5f510` | `MATH-WK-T2-W04` | `COV-MATH-T2-R03` | `Idea of Sets: / Universal Sets, Finite and Infinite Sets, Empty Set, Subset  / Idea of Notation for Union and Intersection of Sets ` |
| 5 | 35-39 | `b08fc103eb9a2cf28f4884bbfa952d77f7110df212fd0167d90d06f892722fbc` | `MATH-WK-T2-W05` | `COV-MATH-T2-R04` | `Complements of Sets:  / Disjoints of Null.  / Venn Diagramand its Use in Solving Problems Involving two and three Sets Relation to Real Life Situations. ` |
| 6 | 41 | `a898d66d655f2db35a5e2dfbd927c91d73c9400ea087523051137e33f667f214` | `MATH-WK-T2-W06` | `COV-MATH-T2-R05` | `Review of the First Half Term’s Work and Periodic Test ` |
| 7 | 43-53 | `837959f3a14d1aa1d01b80e0607b5316cce0b8262ede0951ae55b28590e3ce47` | `MATH-WK-T2-W07` | `COV-MATH-T2-R06` | `Trigonometric Ratios  / Sine, Cosine, Targentof Acute Angles  / Use of Tables of Trigonometric Ratios  / Determination of Length of Chord  / Using Trigonometric Ratios  / Graph of Sine and Cosine for Angles 0o = x` |
| 8 | 55-59 | `0174c7e0d1cbe78a6b1f37d7a9dca36846f128f44371b4db0c1e29abff2bb2ca` | `MATH-WK-T2-W08` | `COV-MATH-T2-R07` | `(a) Application of Sine, Cosine and Tangent, Simple Problems with Respect to Right Angle Triangles.  / (b) Angles of Elevation and Depression  / (c) Bearing and Distances of Places Strictly Application of Trigonometric Ratio. ` |
| 9 | 61-65 | `a4d87bf5dbc27d44517f329e03f60b6a80d3c8b39aea3503efb52b468836b741` | `MATH-WK-T2-W09` | `COV-MATH-T2-R08` | `(a) Introduction of Circle and its Properties  / (b) Calculation of Length of Arc and Perimeter of a Sector  / (c) Area of Sectors and Segments. Area of triangles ` |
| 10 | 67-73 | `c81e5498fd1ebe93390a5699fd768beb1f6c3b0014c4b4028e098d21902b1917` | `MATH-WK-T2-W10` | `COV-MATH-T2-R09` | `Logic / Simple True and False Statements  / Negative and Contra Positive of Simple Statement.  / Antecedents, Consequence and Conditional Statement (implication) ` |

No lesson task is appended: the scheme rows name objectives that the existing `MATH-WK-T2-W01`..`W10` items own, and this task identifies no new uncovered objective. The existing coverages and their statuses are unchanged.

## Reference-book list (lines 77-81)

- Block hash `5701d218625e6ca58d67b9a72e50505a9450895a05fc4fa74ec0dab9365a3714`. Heading `REFERENCE BOOK` (one space). The two entries are bulleted paragraphs (`numId` 85, bullet); mammoth drops the bullets. Line 79 ends with one trailing space.
- New `RULE-MATH-T2-REFERENCES` (classify_marker, kind `SCHEME_ONLY`) uses the exact 140-character anchor of lines 77-81; it occurs exactly once in the extract, before line 83, and matches no parsed row. New `COV-MATH-T2-REFERENCES` (MARKER) maps it.
- Titles verbatim: `New General Mathematics SSS 1 M.F. Macrae et al `; `WABP Essential Mathematics For Senior Secondary Schools 1 A.J.S Oluwasanmi`. No edition, publisher or year is stated in the source and none is added; the leading `WABP` is quoted as written and is not expanded.

## Title and scheme header (lines 1-13)

- New `RULE-MATH-T2-TITLE` (classify_marker, kind `SCHEME_ONLY`) anchors on the 27-character title line 1 (`SECOND TERM E-LEARNING NOTE`), which occurs once and matches no parsed row. New `COV-MATH-T2-TITLE` (MARKER) records line 1 `c3a8dc39c250fd530499bc2d27d4d50ed829835a1e586e85165d2d16dad0edd9`, line 5 `af4cb4b9d92b6ef817117fad4273be49afd11d835472fddeebab3c4af85016cb`, line 9 `8104f5ba0f84b6d0bd6c7197460d87d05b526578cebae1ae784ad29a8b48f15e`, line 13 `0a7bcefdb62032fcabc408940fc69708f54b2d2b8d2daa70f3af30be038a450e`, lines 1-13 `8675f847251f5d8e5a29b97ac819869ec7fd04b83c2b4e74ad1587006e1917b0` and the pre-body slice `ccfe36eee1ca42b3df6f30f2c4b828bdf5633f7750476d96288c59ff8e8b84c9`.
- The rule states document identity only; the registered header (line 5) stays with `RULE-MATH-T2-ALIAS`, whose anchor is not changed.

## Package changes

`backend/src/db/ss1/subjects/mathematics.json` only:

- Added `RULE-MATH-T2-TITLE` and `RULE-MATH-T2-REFERENCES` (both `classify_marker` / `SCHEME_ONLY`); now 12 source rules.
- Added `COV-MATH-T2-TITLE` and `COV-MATH-T2-REFERENCES` (both `MARKER`); now 38 coverage entries.
- Unchanged: 3 sources, 6 lessons, 6 delivery corrections, 0 assets, 7 open items, `package_status` `PENDING`; every 1st and 3rd Term entry and the existing 2nd Term rules and coverages untouched.

`docs/ss1/work/microtasks/mathematics/QUEUE.json`: `MATH-PRE-T2` set to `IMPLEMENTED_TESTING_DEFERRED` with this evidence; `status_counts` now 21 implemented / 65 pending / 9 blocked (95 total); `runnable_now` recomputed (58 pending items whose dependencies are implemented); `next_runnable` is `MATH-PRE-T3`. The `review` block is not touched.

## Validation performed (authoring checks only)

- `JSON.parse`-equivalent load of both changed JSON files; both still round-trip byte-for-byte at 2-space indentation with LF endings and a trailing newline (the repository files already end with a newline, which is preserved).
- Rule and coverage IDs unique; both new anchors occur exactly once in the raw extract (plain string count, not the importer) and are absent from lines 83 onward, so no parsed body can bind them; each new `MARKER` coverage names an existing rule ID; queue counts and `runnable_now` recomputed from items.
- Diff reviewed; only the three allowed paths are touched.

Not run (deferred by owner): zod schema parse, compiler/plan, tests/typechecks, importer, database/device checks, migration, import, deployment.

## Findings for later work

- The scheme is not a table object: it is auto-numbered paragraphs whose numbers mammoth drops. The mapping does not depend on the numbers because row order and row text are stable.
- There is no examination row in this term's scheme; none is invented. Only Week 6 carries a revision/periodic-test row.
- Reference titles carry no edition, publisher or year; later lessons must not cite page numbers or editions.
- Source wording defects in the scheme (`Formular`, `Diagramand`, `Targentof`, `Disjoints of Null.`, `0o = x`, `ax2`) are quoted, not corrected. The footer reads `1ST TERM` in a 2nd Term document (already recorded in `MATH-FACT-HEADER-T2`).
- The preamble will still surface as `PREAMBLE_REQUIRES_COVERAGE` in a compiler plan because the compiler emits that disposition for any text before the first parsed body; the coverages above map the whole region and the slice hash lets a later run check it without guessing.

## Remaining

`MATH-PRE-T2` is complete with testing deferred. Next runnable: `MATH-PRE-T3`. Still open in this queue: `MATH-VIS-T1`..`T3` (and `MATH-VIS-T3-OLE`), 32 `MATH-WK-*` items, `MATH-FACT-LOG-TABLES`, `MATH-FACT-ADVERT-T2`/`T3`, `MATH-PORT-D2-*`, `MATH-CMP-D4-*` and the approval items. No subject or class completion is claimed.

# AG-CORR-T3-W05-RESPIRATION-EQUATION-LOCATORS — Agricultural Science, Third Term Week Five

Status: **IMPLEMENTED_TESTING_DEFERRED**. Corrected the equation and label paragraph locators in `AG-INV-T3.md` after independently re-verifying the source DOCX. No equation wording, run formatting or source bytes were changed.

## Source identity

- Source ID: `SS1-SRC-458a07f7ea5a`
- Archive member: `SSS 1/3rd Term SS1_/3RD TERM S1 AGRICULTURAL SCIENCE.docx`
- Composite archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a`

Archive/member hashes were independently recomputed from the Library archive and match the source assignment.

## Verified direct-body positions and hashes

The locator convention is the zero-based direct child of `w:body` in `word/document.xml`. Block text is the concatenation of `w:t` runs in document order, UTF-8, without normalization.

| Content | Correct block | SHA-256 of block text |
|---|---:|---|
| General respiration equation | 532 | `afcc926b0937742f62643dfaf20d388c097d6af220e16cd420eb1a95314732f6` |
| General equation word labels | 533 | `055c66c3e56aa9803e63c128451475fe22ec1910d46ef46d2a470b0993cb7896` |
| Aerobic respiration equation | 537 | `c17645e396c8d15a624516565074d3250fcbfc6f58777a740cb06e3fce2074f5` |
| Aerobic equation word labels | 538 | `acbe3519428365d4967baf94a9323887afe469109f0758d428c98cbadfcbf036` |
| Anaerobic respiration equation | 540 | `1c18292c9659a843e71343a1d6c465386dc08e19b83651ab70470b074e845e25` |
| Anaerobic equation word labels | 541 | `400a62fbb1d3786226c64996f593459e8eb6e5dc577af2d7ef957fef2c3cc178` |

The old locator sequence (530, 535, 538) is incorrect:
- Block 530 is the “RESPIRATORY SYSTEM” heading.
- Block 535 is aerobic-respiration explanatory prose.
- Block 538 is the aerobic equation's word-label line.

## Run-level formatting and Office Math verification

The three equation paragraphs are ordinary Word text paragraphs with run-level formatting and tab characters:
- Formula digits that represent chemical subscripts carry `w:vertAlign val="subscript"`.
- Coefficient numerals remain baseline text.
- Associated word-label paragraphs 533, 538 and 541 have `w:vertAlign val="superscript"` on their text runs.
- Tab characters align formula/product labels in the source.
- No `m:oMath` or `m:oMathPara` object occurs in any of the six equation/label paragraphs.
- The document has one separate Office Math object at block 1165, in the cattle gestation-characteristics sentence; it is unrelated to the Week Five respiration equations.

The equations remain exactly as extracted:
- Block 532: `C6H12O6+6O26CO2+ 6H2O + ENERGY`
- Block 537: `C6 H12 O6+6O26CO2+ 6H2O +            ENERGY`
- Block 540: `C6H12O6 2C2H5OH + 2CO2+ ENERGY`

The source strings do not contain reaction arrows. In blocks 532 and 537, oxygen and carbon-dioxide terms run together; in block 540, the glucose and ethanol terms lack an explicit reaction arrow/separator. **No reaction arrows, plus signs, coefficients, spaces or formula characters have been added or normalized.** This task corrects locators and structural description only; scientific equation accuracy is handled by the separate fact-review task.

## Inventory change

Updated the Week Five visual/structured-content row in `AG-INV-T3.md`:
- Old equation locators: 530, 535, 538.
- Correct equation paragraphs: 532, 537, 540.
- Associated word-label paragraphs: 533, 538, 541.
- Added the exact text hashes and the run-level subscript/superscript/no-Office-Math description.

No other inventory entries were changed. The existing `AG-VIS-T3-W05-RESPIRATION-EQUATIONS.md` note already contains the correct locator and formatting details; it was not changed.

## Changes and validation

- Added this locator correction record.
- Re-extracted blocks 530–541 from the verified DOCX and checked all six paragraph hashes.
- Inspected `w:rPr/w:vertAlign`, tab elements and Office Math elements; confirmed subscripts, superscript labels, tabs and no Office Math in the equation/label paragraphs.
- Confirmed the only Office Math object in the document is at block 1165.
- Updated only the equation locator row/details in `AG-INV-T3.md`.
- Marked `AG-CORR-T3-W05-RESPIRATION-EQUATION-LOCATORS` `IMPLEMENTED_TESTING_DEFERRED`.
- No source bytes, equation text, formula characters, package rows, corrections, assets or other subject were changed.
- Tests, importer/compiler, TypeScript, database, learner rendering and device checks remain deferred.

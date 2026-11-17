# CHEM-VIS-T2-SHAPES — Chemistry Second Term drawing-layer inventory

Status: **IMPLEMENTED_TESTING_DEFERRED** (structural disposition only; original shape bytes/positions not modified).

## Source
- Member `SSS 1/2nd Term SS1_/CHEMISTRY.docx`, SHA-256 `236b1bdb2e752f652dd22e8f2df831279237e669ceeec356825cecc4ef8911e7`.
- Whole body blocks 0-2220; SHA-256 `60db0c49b150ebdab160d6d3ee7cb86629788cd1a73c58ace7f1cef831f74c72`.
- Locator: 0-based direct children of `w:body` in `word/document.xml`.

## Drawing-layer counts and disposition
- 114 `w:drawing` occurrences total.
- 42 drawings contain raster images; the remaining 72 are non-raster drawing objects.
- 69 AutoShape straight connectors/arrowheads are used for fraction bars and arrows, concentrated in Week Nine (28 drawings). Preserve their positions and line relationships; they are not separate photographs or diagrams.
- 3 text boxes contain the labels “Jelly” (block 1343), “CuSO4 CRYSTALS” (block 1347) and “Rubber bung” (block 1349). Preserve as text objects associated with the adjacent illustration.
- 72 `w:pict` elements are VML fallback representations of the same drawing layer; they are not 72 additional figures and must not be double-counted.
- Drawings at blocks 156, 523, 529 and 592 contain no raster image. They are shapes/connectors, not missing bitmap assets.

## Rendering implications
The Week Eight/Week Nine equation layouts use connector shapes for fraction bars and arrows. A plain text extraction drops the geometric relationships; it cannot safely reconstruct the equations. Any future conversion must preserve the original shape positions and groupings or independently typeset a reviewed equation, with the original source retained separately.

## Rights and preservation
This record is structural, not an asset-reuse grant. Raster image rights remain unresolved in the related visual records. Per-shape hashes were not recorded in the inventory and are not invented. Original drawing objects and VML fallback data remain in the owner-supplied source DOCX.

## Disposition
Counts, block locators, shape types and fallback relationships are accounted for. The source's shapes are not discarded or replaced. No lesson, correction, approval or verification is claimed.

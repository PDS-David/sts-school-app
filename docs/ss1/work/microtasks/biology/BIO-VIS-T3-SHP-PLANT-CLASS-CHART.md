# BIO-VIS-T3-SHP-PLANT-CLASS-CHART — botanical-classification chart disposition

Status: **IMPLEMENTED — TESTING DEFERRED BY OWNER**. Source-structure disposition only; taxonomy claims remain under factual review.

## Source identity and locator

- Source: `SS1-SRC-78059230037f`, 3rd Term SS1 Biology.
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified).
- DOCX member SHA-256: `1e9a758cdd07bd13511059b6d8ef6db0f618f99b14cdf11d20d33c183cb1bca4` (verified).
- Chart shapes: `word/document.xml`, body blocks 350-355; range SHA-256 `050aad2b5ea0d4374eeb6aa0680c2bef70bffa9ee0b8316ee745bdeea0ac852f` (recomputed from the exact block text).
- Definitions: blocks 345-348. Chart heading: block 357. Key: block 358.
- Method: inspected native VML shapes in the verified DOCX and made a fresh private PDF render with LibreOffice. The chart was visually inspected on rendered PDF page 18 of 38. No source file or rendering was committed.

## Source labels and relationships

The source defines the letter labels as follows:

| Letter | Source group |
|---|---|
| A | Thallophytes |
| B | Bryophytes |
| C | Tracheophytes |
| D | Pteridophytes |
| E | Spermatophytes |
| F | Gymnosperms |
| G | Angiosperms |
| H | Dicot |
| I | Monocot |

The fresh render shows these connector relationships:

- Plants → A, B and C.
- C → D and E.
- E → F and G.
- G → H and I.

These are the visible connections in the rendered source; no additional links are inferred. The prose at blocks 345-348 independently states the same hierarchy, and block 358 provides the additional source key for non-vascular/vascular, non-flowering/seed and flowering group descriptions.

## Extraction and delivery disposition

1. Blocks 350-355 contain VML shapes and line connectors. Plain-text extraction retains scattered letters and the word `Plants` (for example, block 352 concatenates `PlantsB DF H`, block 354 `C E`, and block 355 `GI`); it does not preserve the connector geometry or parent-child associations.
2. The chart's visual layout is therefore not preserved by text extraction. However, the adjacent source prose at blocks 345-348 explicitly describes every parent-child relationship listed above. A text-accessible hierarchy can be delivered from that existing prose without inventing links or requiring a new diagram asset solely to recover the relationships.
3. The chart and its source wording remain unchanged. No source image or VML geometry has been copied into a new asset.
4. Botanical taxonomy accuracy is not certified by this structural disposition. The existing package FACT item `BIOLOGY-T3-W05-AGRICULTURE-FACTS` now explicitly includes the A-I labels and hierarchy in its review scope.

## Verification and remaining gates

- Archive and DOCX member hashes: verified.
- Block-range hash: recomputed and matched.
- VML shapes and rendered connector relationships: inspected.
- Source text hierarchy: checked against the chart labels and visible connectors.
- Botanical accuracy, importer/compiler, package tests, app/device rendering and content approval: not verified or run; testing deferred by owner.
- No student-facing approval is implied.

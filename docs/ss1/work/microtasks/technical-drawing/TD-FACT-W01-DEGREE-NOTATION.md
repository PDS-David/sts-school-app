# TD-FACT-W01-DEGREE-NOTATION — Week One angle-value recovery

**Status:** IMPLEMENTED — TESTING DEFERRED. All superscript-zero angle markers in the Week One teaching row have been recovered from the original DOCX run formatting. The audit found **seven** paragraph occurrences, not the six listed in the initial queue locator. No original source bytes or body text were modified.

## Source and method

- Source ID: `SS1-SRC-af4868d2c026`.
- Source member SHA-256: `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`.
- Parsed Week One lesson ID: `SS1-SRC-af4868d2c026:BODY:a4e3d54d3b4f61aaea4abaf5c2ed3b4d3644563bbe904d5db1c57c69cf4082b6`.
- Parsed body SHA-256: `a4e3d54d3b4f61aaea4abaf5c2ed3b4d3644563bbe904d5db1c57c69cf4082b6`.
- Examined `word/document.xml` directly. Each value is a literal `0` in run index 1, with `w:rPr/w:vertAlign @w:val="superscript"`. In every case the number is explicitly introduced by angle wording or an angle symbol; the superscript zero is the source's degree notation, not a trailing decimal zero or exponent.
- Locators are zero-based body-child indices in `word/document.xml`; run indices are zero-based within the paragraph.

## Recovered values

| XML body child | Source paragraph text (flattened form) | Superscript run | Intended angle |
|---:|---|---|---:|
| 92 | `angle CAB = 670` | run 1: literal `0`, superscript | **∠CAB = 67°** |
| 113 | `< ABC = 1050` | run 1: literal `0`, superscript | **∠ABC = 105°** |
| 118 | `base angle 1050` | run 1: literal `0`, superscript | **base angle = 105°** |
| 120 | `vertical angle = 550` | run 1: literal `0`, superscript | **vertical angle = 55°** |
| 123 | `< ABC = 600` | run 1: literal `0`, superscript | **∠ABC = 60°** |
| 157 | `angle PQR = QPR = 600` | run 1: literal `0`, superscript | **∠PQR = ∠QPR = 60°** |
| 159 | `< ABC = 1050` | run 1: literal `0`, superscript | **∠ABC = 105°** |

All seven values are resolved. The original queue's six-line locator was incomplete: body child 159 is an additional 105° occurrence and must not be omitted. The two equal angles in body child 157 share one terminal superscript degree marker.

## Correction decision

No character-level edit or delivery-correction replacement was made. The registered DOCX remains authoritative and unchanged; its source formatting unambiguously identifies the superscript zero as a degree marker. This evidence note records the normalized degree values for authoring and review. Before student delivery, any plain-text renderer must display these as `67°`, `105°`, `55°`, `60°` rather than `670`, `1050`, `550`, `600`. Runtime rendering verification remains a separate deferred check; this source-level task does not claim that the app already renders the glyph correctly.

## Checks and limits

- Confirmed seven superscript-zero runs in the Week One row, all in run index 1 of their paragraphs.
- Confirmed each marker is superscript in the source XML and each context is an angle measure.
- Preserved the original source DOCX, parsed lesson identity and body hash.
- Did not modify the package lesson body, create a correction replacement, run the subject schema/tests/compiler/importer, or verify the student UI. Runtime degree-glyph verification remains open.

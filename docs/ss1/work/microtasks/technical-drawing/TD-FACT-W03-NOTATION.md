# TD-FACT-W03-NOTATION — Week Three degree values and equation recovery

**Status:** IMPLEMENTED — TESTING DEFERRED. The original DOCX contains 26 superscript-zero degree markers and one additional subscript punctuation run (27 vertical-alignment runs in total). It also contains two recoverable OMML equation objects. The queue's initial “27 superscript runs / missing equation object” description was imprecise and is corrected here. Original source bytes remain unchanged.

## Source and method

- Source ID: `SS1-SRC-af4868d2c026`.
- Source member SHA-256: `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`.
- Parsed Week Three lesson ID: `SS1-SRC-af4868d2c026:BODY:032f7d5dee7e629db1c14d2cec1893d434e3e315aced4f243197b4f8d61223cf`.
- Parsed body SHA-256: `032f7d5dee7e629db1c14d2cec1893d434e3e315aced4f243197b4f8d61223cf`.
- Inspected `word/document.xml` directly. Superscript-zero markers are literal `0` runs with `w:vertAlign @w:val="superscript"`; each is in an angle or polygon-angle context. Locators are zero-based body-child indices; run indices are zero-based within the paragraph.
- Both Office Math objects (`m:oMath`) were read from their native XML. No equation was guessed from flattened text.

## Recovered degree values

| XML body child | Superscript run index(es) | Source context / normalized reading |
|---:|---:|---|
| 343 | 2, 4, 10 | Interior-angle sum ((n-2)\times180°); four right angles (=360°); re-entrant interior angle (>180°). |
| 365 | 6, 8 | (360°) divided by (N); regular pentagon exterior angle (72°). |
| 366 | 3, 5, 7, 9 | Regular hexagon (60°); heptagon (52°); octagon (45°); nonagon (40°). |
| 381 | 1, 3 | (360°/5=72°) in the pentagon construction steps. |
| 383 | 1 | (72°) clockwise at point A. |
| 420 | 1, 3 | (360°/6=60°) for a regular hexagon. |
| 422 | 1 | (60°) setsquare/protractor construction. |
| 455 | 1 | (45°) construction lines for the octagon. |
| 459 | 1 | (45°) construction lines for the octagon. |
| 584 | 1, 3 | Two base angles: (45°) and (60°). |
| 605 | 1 | (angle DEA=90°). |
| 611 | 1, 3 | (angle FAB=110°); (angle ABC=88°). |
| 679 | 3 | Repeated weekend-assignment occurrence: (angle DEA=90°). |
| 691 | 1, 3 | Repeated weekend-assignment occurrence: (angle FAB=110°); (angle ABC=88°). |

The source uses the same superscript-zero convention throughout. These values are degree measures, not trailing zeroes. Repeated 90°, 110° and 88° values in the weekend assignment are distinct source occurrences and are retained in the table.

## Recovered Office Math objects

| XML body child | Native object | Exact mathematical reading |
|---:|---|---|
| 365 | `m:oMath` | (\text{i.e. }\dfrac{360°}{N}=\dfrac{360°}{5}=72°) |
| 453 | `m:oMath` | (\dfrac{360°}{8}=45°) |

The second equation is at body child 453; the same paragraph also contains a subscript run containing a literal period. That punctuation run is **not** a degree marker. The queue's earlier “missing equation” description is corrected: the native equation is present and recoverable in the source XML. The parsed-row metadata's `eqExtra: 38` corresponds to equation text not included in the flattened row text.

## Correction decision

No source-character edit or delivery-correction replacement was made. The original DOCX formatting resolves every angle value and both formulas. The normalized values above are the authoring reference. As with Week One, any plain-text student renderer must display superscript-zero degree notation as a proper degree glyph; UI/runtime verification remains deferred. Do not replace the source row with a partial notation-only lesson.

## Checks and limits

- Counted 26 superscript-zero runs and one subscript punctuation run in the Week Three teaching row.
- Recovered both native OMML objects and their exact formula text.
- Recomputed and matched the registered source member hash; recorded source lesson ID and body hash.
- Did not modify original source text, create a correction replacement, run subject schema/tests/compiler/importer, or verify app display.
- No approval, certification or deployment is claimed.

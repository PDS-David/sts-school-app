# AG-VIS-T3-W01-TBL-TOOLS — Agricultural Science, Third Term Week One

Status: **IMPLEMENTED_TESTING_DEFERRED**. The source table was inspected; no drawings were inferred or created.

## Integrity and locator
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; exact Third Term member SHA-256 `9e920bff3769d9d977c4b2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- Farm-tools table: `word/document.xml` direct `w:body` block 36 (0-based); table cell-text joined with spaces SHA-256 `0e24371a1169758b82a4429bdd59167fc63282d90887b024caae7757ed6b105e` (matches inventory). Raw concatenated `w:t` block text SHA-256 `28bfedef98dd4d82e8b4f6500a7edc48557034eae883aac5b663e5e0c054736f`.

## What the source contains
- Block 36 is a 6-row × 10-cell grid of 30 alternating number/name pairs, not 30 drawings.
- Listed tools, in source order: Cutlass; Hoe; Bolt and nut; Shovel; Garden fork; Hand fork; Axe; Screw driver; Digger; Head pan; Spanner; Mallet; Budding knife; Plier; Harvesting knife; Crowbar; Sickle; Wheel barrow; Shear; Emasculator; Mattock; Hammer; Watering can; Chisel; Pruning saw; Secateurs; Rake; Hand trowel; Spade; Manure drag.
- Project instruction at block 38 asks learners to draw all 30 tools in a drawing book, describe them, and state maintenance and uses.
- The source contains the list but no corresponding 30 tool drawings. The five selected tool descriptions are at blocks 40–45; general maintenance points are at 49–54. The other 25 tools are not individually illustrated/described in this source.

## Disposition
- Preserve the 30 numbered names in their original order and keep each number paired with its exact name in any delivered table/list; do not rely on a flattened string.
- A separate illustration/reference supplement **is required** to support the drawing-book project. It must provide one rights-cleared, provenance-recorded illustration per tool, paired with the exact source number/name. It must also provide verified descriptions, functions/uses and maintenance for all 30 tools, while retaining the five source descriptions and six general maintenance points. The supplement is not part of the original DOCX.
- Existing task `AG-LES-T3-W01-TOOL-REFERENCE` and open item `AGRICULTURAL-SCIENCE-T3-W01-TOOL-REFERENCE` were refined to require the illustrations; no duplicate task was created. No original media or generated drawing is committed in this disposition.

## Changes and validation
- Marked `AG-VIS-T3-W01-TBL-TOOLS` `IMPLEMENTED_TESTING_DEFERRED`; recomputed queue counts and `next_runnable`.
- Verified archive/member and table hashes; inspected all 6×10 cells; confirmed the 30 entries and absence of corresponding embedded drawings from the inventory; parsed package/queue JSON and checked unique IDs/open-item references.
- Importer, tests, TypeScript, DB and learner rendering **not run**; testing remains deferred.
- No source bytes, lesson bodies, corrections, assets, schema or compiler changed.

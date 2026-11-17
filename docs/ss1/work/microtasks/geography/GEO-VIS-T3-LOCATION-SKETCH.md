# GEO-VIS-T3-LOCATION-SKETCH — locator map disposition

Status: **IMPLEMENTED — ACCESSIBLE REPLACEMENT LINKED**. The original sketch is retained as source evidence only.

## Source evidence
- Source ID: `SS1-SRC-74a10d374306`
- Original Week One–Two source span: antiword lines 28–165
- Original block SHA-256: `0b967f0cbb4795d3d7f45f8313859ae178706cc352a67fa81a5e6610c228b433`
- Sketch locator: original source line 35.
- The sketch is not treated as a sufficiently detailed learner-facing map.

## Decision

A properly sourced, accessible Nigeria locator map is required instead of redrawing or enhancing the original sketch. The lesson now links to the **United Nations Map of Nigeria, Map No. 4228 Rev. 1 (August 2014)**:

https://www.un.org/geospatial/sites/default/files/files/documents/2020/Apr/nigeria_4228_r1_aug14_120.pdf

The UN map supplies:
- the 36 states and the Federal Capital Territory;
- national-capital and state-capital symbols;
- neighbouring countries and international boundaries;
- major towns, rivers, lakes and coastal features;
- a legend, scale and north orientation.

The map's publication date and disclaimer are stated in the learner lesson. The UN disclaimer says that names and boundaries shown do not imply official endorsement or acceptance by the United Nations. The map is used as a link only; its image is not copied into the package.

## Implementation

Added `SUP-SS1-GEOGRAPHY-T3-W01-02-LOCATOR-MAP` to `backend/src/db/ss1/subjects/geography.json`. It explains the map legend, neighbours, states/FCT and date limitations and contains four original questions with answer keys and integer marking criteria (10 marks total).

Added coverage `COV-GEO-T3-W01-02-LOCATOR-MAP` as `IMPLEMENTED_EQUIVALENT`, bound to the supplementary lesson. The original sketch remains unchanged and is not used as the learner-facing map.

## Provenance

- United Nations, Department of Field Support, Cartographic Section, Map No. 4228 Rev. 1, August 2014: https://www.un.org/geospatial/sites/default/files/files/documents/2020/Apr/nigeria_4228_r1_aug14_120.pdf
- Map details: 36 states/FCT, capital symbols, neighbouring countries, water features, legend, scale and orientation; map disclaimer appears on the final map page.

## Release state
- Visual disposition: IMPLEMENTED
- Accessible map link: IMPLEMENTED
- Content approval: PENDING
- Verification/testing: DEFERRED
- No tests, importer, database or device runs were performed.

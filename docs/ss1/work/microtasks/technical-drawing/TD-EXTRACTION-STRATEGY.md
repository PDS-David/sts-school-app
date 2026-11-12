# Technical Drawing source extraction and preservation strategy

**Decision:** Preserve the source document byte-for-byte and use a hybrid extraction pipeline: structured source-row ingestion for text, native OOXML recovery for equations/superscripts, exact media extraction for raster figures, and bounded conversion for embedded WMF previews. Where the source is ambiguous, incomplete or malformed, add a clearly labelled teaching supplement and keep the original defect in the open-item register until an authorised source correction is received.

## Why this strategy

A text-only extraction is insufficient for Technical Drawing: it loses or flattens degree glyphs, superscripts/subscripts, native OMML equations, diagram labels, construction marks and dimensions. Replacing the source with a reconstructed document would risk silently changing geometry and mathematical intent. Executing embedded AutoCAD/OLE objects is also unnecessary and introduces avoidable execution risk.

## Implemented controls

1. **Immutable source identity:** retain the original archive and DOCX member; verify both SHA-256 hashes before extraction.
2. **Text and row provenance:** preserve parsed row identities, source body hashes, source-child locators and explicit scheme-only/source-alias rules.
3. **Mathematical notation:** inspect OOXML vertical-alignment runs and native OMML objects; record exact normalized values/formulas in fact notes. Do not infer lost equations from surrounding prose.
4. **Figures:** extract original PNG/JPEG media byte-for-byte; convert WMF previews using LibreOffice Draw to SVG and Inkscape drawing-area rendering to PNG; register source hashes, output hashes, byte counts, media types, alt text and lesson bindings.
5. **Cross-row reuse:** permit reuse only when the source figure is visually reconciled and the reused output hash/path match; document both source task IDs.
6. **OLE/AutoCAD:** do not execute embedded OLE controls. Use the paired WMF preview as a static reference; keep any missing dimensions or lossy-preview discrepancies open.
7. **Student teaching content:** author independent lessons and marked practice where source extraction is inadequate. Label source-derived facts, inferred geometric constraints and unresolved author decisions distinctly.
8. **Source defects:** do not silently rewrite the original. Record exact locator, literal source reading, mathematically correct interpretation and the required owner decision.
9. **Verification:** run schema, hash, marking, asset-integrity, source-manifest reconciliation, compiler plan and student-rendering checks before readiness can be advanced.

## Decision status

This is the implementation strategy used by the Technical Drawing package and the extraction workflow. It does not approve lesson content, source corrections, or publication. Those remain separate owner/teacher approval gates.
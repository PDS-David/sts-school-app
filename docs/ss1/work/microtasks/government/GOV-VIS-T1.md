# GOV-VIS-T1 — Government, 1st Term visual disposition

**Status:** IMPLEMENTED — TESTING DEFERRED. No asset is registered and no image bytes or private render are committed.

## Source identity

- Source ID: SS1-SRC-40ce7dcaf672
- Archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e
- Member: `SSS 1/1st Term SS1_/1ST TERM S1 GOVERNMENT.doc`
- Member SHA-256: 50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a
- Re-opened the archive member and parsed the legacy OLE compound file. The archive/member hashes and both embedded JPEG byte hashes were verified.

## Visual group 1 — cover image

- OLE stream: `Data`
- Stream offset: 432
- Format/dimensions: JPEG, 3306 × 2515 px
- Byte count: 870,389
- SHA-256: `b334a0e127cb7f94bf10dd46672a8545fe303971ba10d0dc9a50600962ddea9a`
- Disposition: vendor/template cover, not a Government-specific teaching figure. It contains vendor branding and personal contact details. The existing cross-subject inventory records the same bytes in the Geography 1st Term cover.

**Decision:** no asset binding. Reuse permission is not established. Do not copy the image, branding or contact details into Git or student delivery until explicit rights/permission is recorded.

## Visual group 2 — header/letterhead image

- OLE stream: `WordDocument`
- Stream offset: 96,337
- Format/dimensions: JPEG, 949 × 359 px
- Byte count: 106,941
- SHA-256: `edd416d4bec3d9f5c64d7907a1407ff3e04981018c613f0cf551e2a1e1078c14`
- Disposition: generic vendor letterhead/header image, also recorded as byte-identical in Further Mathematics 2nd Term and Geography 1st Term.
- The picture character is referenced from the legacy header story at paragraph 881.

**Decision:** no asset binding. A Word/LibreOffice render was unavailable, so whether this header prints on every page or only in a particular section is **not established**. A separate VISUAL open item records the need for a private page-by-page render. No assumption is made from the header-story reference or cached page-count metadata.

## Visual group 3 — table structure and absent figures

- The only table structure in the legacy document is an empty one-row/one-column layout row above the cover. It contains no teaching text and is disposed as a layout artefact.
- The teaching body contains no table, diagram, map or figure.
- Week Seven THEORY at `getBody()` line 632 asks for a tabular comparison of democracy and fascism, but the document does not print that table. This is a source omission, not a recoverable image/table asset.

**Decision:** do not fabricate a source table or figure. A separate CONTENT open item requires any needed comparison table to be created as visibly original teaching in `GOV-LES-T1-W07-CORRECTED-WEEK`, with sourced criteria and no claim that it came from the source.

## Open items added

1. `GOVERNMENT-T1-VISUAL-BRANDING-PERMISSION` — obtain permission for vendor branding and personal contact details before reuse; no asset is bound.
2. `GOVERNMENT-T1-VISUAL-HEADER-RENDER` — render the original privately to determine whether the letterhead repeats on every page; no placement is guessed.
3. `GOVERNMENT-T1-W07-COMPARISON-TABLE-MISSING` — the source requests a comparison table but does not contain one; any teaching table must be original and labelled.

## Checks and limits

- Verified the archive and member SHA-256 values.
- Extracted the two JPEG byte ranges from the OLE streams and verified both hashes, dimensions, formats and byte counts against the inventory.
- Disposed the empty layout row; confirmed no body table, diagram, map or figure exists.
- Kept package `assets[]` empty. No source image, private contact detail, render or reconstructed table was added.
- No tests, typechecks, importer/compiler, database, app/device or page-render checks run; testing remains deferred by owner.

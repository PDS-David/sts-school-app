# CUR-03 — Dispose of SS1 visual-disposition items

Status: READY (per item; source document required) · Depends: CUR-02 where the figure belongs to a lesson · Owner decision: none
Writes: `backend/src/db/ss1/subjects/<subject>.json`, `docs/ss1/work/microtasks/<subject>/QUEUE.json`, `docs/ss1/work/microtasks/<subject>/<TASK-ID>.md`, `backend/src/db/ss1/assets/<subject>/<file>`

## Why

Text extraction through Mammoth does not preserve drawings, tables rendered as images, maps, graphs or notation — the manual says this explicitly. Each SS1 package carries visual-disposition queue items whose outcome must be one of: a recovered asset with bytes/hash/metadata, a labelled authored replacement, or an explicit recorded absence. A row cannot be closed by saying "the source has a diagram"; the bytes or the absence must be recorded.

Existing assets show the expected shape (`further-mathematics.json` asset `ASSET-SS1-FM-T3-W02-FLOWCHART-PERIMETER`): path under `backend/src/db/ss1/assets/<subject>/`, SHA-256, byte count, media type, alt text, order, source locator, provenance with rights and `reuse_status`, and state. Preservation of bytes is not proof of legibility, animation or notation correctness — do not claim that.

## Do

1. Take one `VISUAL_DISPOSITION` queue item. Locate the figure in the original document (member path, page/section, relationship ID). Record what the extraction lost.
2. Choose one disposition and record it:
   - **Recovered**: extract the original bytes; keep provenance and rights; compute SHA-256 and byte count; write the file under `backend/src/db/ss1/assets/<subject>/`; add the asset object with a specific alt text describing the content, not "diagram".
   - **Authored replacement**: create a deterministic, labelled derivative (e.g. SVG built from the formula or table in the source), state that it is authored and not a source image, and mark rights accordingly.
   - **Absent/withheld**: record why no usable figure exists and which objective therefore stays `PARTIAL`/`UNRESOLVED`. No fabricated image.
3. Link the asset to its lesson (`lesson_id`) only if the lesson exists; otherwise record the asset and leave the queue item's objective status unchanged.
4. Evidence note: item ID, source locator, disposition, hash, bytes, alt text, rights basis, and what remains unproven (device legibility, animation, notation correctness).
5. One PR per item. Do not merge.

## Acceptance (static)

- File exists at the declared path with the declared byte count and SHA-256; media type is from the schema's allowed list.
- Alt text is content-descriptive and does not claim to be the source when it is a derivative.
- No scanned page is included when it reproduces third-party artwork without a rights basis.

## Do not

- Run OCR, image recognition or any external service on student or licensed material.
- Add an asset whose bytes you did not verify, or reuse a JSS3 asset.
- Claim the figure renders correctly on a device.

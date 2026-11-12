# TD-VIS-INVENTORY — Technical Drawing SS1, Second Term

**Status:** IMPLEMENTED — TESTING DEFERRED. This is a source inventory, not visual disposition, lesson approval, package verification, or app verification.

## Inputs and provenance

- Started from current master `d47c1daa7d9ae657f5ea65f9a79ac34e343acf79`; dedicated branch: `agent/technical-drawing`.
- Source archive receipt: PR #570 records archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` and its verified member hash.
- Inspected member: `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx`, 2,865,886 bytes; SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d` (recomputed from the materialized DOCX and matched exactly).
- The DOCX is the registered `SS1-SRC-af4868d2c026` source. Private extracted bytes, rendered pages, and previews remain outside Git.

## Inspection method

Parsed `word/document.xml` with Python `zipfile` and `lxml` 6.1.1, including document relationships and embedded object references. Rendered the DOCX to a 54-page PDF with LibreOffice 25.2.3.2, extracted page text with Poppler `pdftotext` 25.06.0, and visually reviewed a 54-page contact sheet plus representative pages at higher resolution. OLE controls were not executed. The PDF and image previews are inspection artefacts only and are not committed.

## Document-wide counts

| Object / feature | Count | Interpretation |
|---|---:|---|
| Parsed source rows | 19 | Rows 0–10 are scheme-table lines; rows 11–18 are eight teaching rows |
| `w:drawing` / `a:blip` placements | 94 | 94 DrawingML picture placements across the eight teaching rows |
| Unique raster media parts | 87 | 60 PNG and 27 JPEG parts; seven placements reuse an already-referenced raster part |
| OLE objects | 17 | All are embedded `AutoCAD.Drawing.15` objects |
| VML preview image references | 17 | One WMF preview reference per embedded OLE object |
| WMF media parts | 17 | Not an allowed package asset MIME; retain originals privately pending a faithful-conversion decision |
| Total media parts | 104 | 87 raster + 17 WMF; every media part is referenced |
| Word tables (`w:tbl`) | 0 | Scale diagrams are embedded AutoCAD objects, not Word tables |
| OMML objects | 2 | Both occur in the Week Three polygon row |

The 94 DrawingML placements and 17 OLE objects are separate object classes. The 17 WMF parts are previews associated with the 17 OLE objects; do not add them as another 17 independent teaching figures. The source contains 124 legacy `w:pict` containers; this wrapper count is not an additional figure count.

## Per-row inventory and visual clusters

Body-child ranges are zero-based, half-open ranges in `word/document.xml` (the first index is inclusive, the second exclusive). Teaching-row indices refer to `docs/ss1/work/SS1-03/evidence/parsed_rows.json`.

| Teaching row | Parsed row | XML body children | Rendered PDF pages | DrawingML placements | OLE / WMF | Observed visual cluster |
|---|---:|---:|---:|---:|---:|---|
| Week One — inscribed and circumscribed circles | 11 | [29, 163) | 1–3 | 8 | 0 / 0 | Circle and triangle construction diagrams: inscribed/circumscribed relationships, centres, arcs, radii, and construction lines |
| Week Two — escribed circles | 12 | [163, 336) | 4–8 | 11 | 0 / 0 | Triangle/polygon escribed-circle constructions, excentres, and circles touching specified sides or points |
| Week Three — polygons | 13 | [336, 697) | 9–18 | 19 | 0 / 0 | Regular/irregular polygon examples and construction methods, including triangle, quadrilateral, pentagon, hexagon and heptagon geometry; two OMML objects are in this row |
| Week Four — plain scales | 14 | [697, 859) | 19–22 | 0 | 9 / 9 | AutoCAD scale-bar and plain-scale layouts with divisions/subdivisions and measurement-reading examples |
| Week Five — diagonal and chordal scales | 15 | [859, 1009) | 23–26 | 0 | 7 / 7 | AutoCAD diagonal/chordal scale grids, diagonal subdivisions and measurement layouts |
| Weeks Six and Seven — reduction of plain figures | 16 | [1009, 1210) | 27–30 | 11 | 1 / 1 | Similar-figure reduction constructions, centre/ray relationships, corresponding vertices and proportional dimensions; one AutoCAD object with WMF preview |
| Weeks Eight and Nine — equal area of plane figures | 17 | [1210, 1581) | 31–42 | 26 | 0 / 0 | Equal-area geometric transformations and constructions involving triangles, polygons, quadrilaterals, parallel lines and equivalent figures |
| Week Ten — tangency involving circles, arcs and lines | 18 | [1581, 1983) | 43–54 | 19 | 0 / 0 | Tangency constructions for circles, arcs and straight lines; internal/external contacts, known radii, centres and contact points |

Row totals reconcile to 94 DrawingML placements, 17 OLE objects and 17 WMF previews. The page ranges were located by the week headings in the rendered PDF text; they are navigation aids, not source-document page labels.

## Branding and advertising scan

The page footer repeats `GSS/2nd TERM/SS1/TD` and the tagline “Heaven! Getting there is by Righteousness, not Religion. By Christ and none else. Acts 4:12”. This is a repeated footer, not a separate advertising page. No standalone advert, phone number, email address, website URL, or social-media contact was found in the extracted page text or the visual page review. No contact details were copied into Git.

## Queue changes and remaining work

- `TD-VIS-INVENTORY` is marked `IMPLEMENTED_TESTING_DEFERRED` because counts, row locators, rendered page ranges and visual-cluster descriptions are now recorded.
- The per-row `TD-VIS-W01` through `TD-VIS-W10` items and the OLE/WMF asset items remain `PENDING`; their implementation references now carry the inventory counts and observed cluster types. No per-figure disposition, asset binding, WMF conversion, OLE transcription, or learner-facing display verification is claimed.
- The AutoCAD controls remain unexecuted. Exact per-figure identification, faithful derivative decisions and the package's allowed-MIME asset work remain in the dependent queue items.
- No subject package content, coverage status, approval state, or lesson was changed.

## Checks actually performed

- Recomputed source DOCX SHA-256 and matched the registered member hash.
- Parsed DOCX XML and relationships; counted object classes and media parts by teaching-row boundary.
- Confirmed all 104 media parts are referenced; counted 94 DrawingML placements, 17 embedded AutoCAD objects and 17 WMF previews.
- Rendered all 54 pages and visually reviewed the page contact sheet and representative high-resolution pages.
- Scanned extracted page text for email addresses, URLs, phone numbers and advertising/contact terms.
- Did not run the repository schema checker, subject tests, compiler/importer, TypeScript checks, database operations, or app/device verification. Those checks remain deferred and must not be described as passed.

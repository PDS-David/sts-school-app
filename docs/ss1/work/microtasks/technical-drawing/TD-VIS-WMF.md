# TD-VIS-WMF — WMF-to-allowed-asset conversion decision

**Status:** IMPLEMENTED — TESTING DEFERRED. All 17 WMF previews have been identified, hashed, paired to their OLE object and assigned a per-object SVG derivative task. A representative WMF-to-SVG export was tested. No WMF conversion has been committed because each output still requires per-object geometry, label and crop verification.

## Decision

- WMF is not an allowed package asset MIME. Do not bind a `.wmf` file directly.
- Preferred candidate: LibreOffice Draw's vector export, `libreoffice --headless --convert-to svg --outdir <outdir> <source.wmf>`.
- Representative test: `word/media/image36.wmf` exported successfully to SVG using LibreOffice 25.2.3.2 (115 KB, SVG 1.2, vector paths preserved). Its output uses an A4-sized viewBox with substantial whitespace; the asset task must crop the SVG viewBox to the actual drawing bounds without changing geometry or labels.
- A PNG raster fallback is not preferred for these scale and construction diagrams because thin diagonals, subdivisions, small dimension labels and text can become less legible. Use PNG only if SVG fidelity fails and the raster can meet the project's image quality/resolution requirements.
- The tested SVG is a private scratch artefact and is not committed. It has not been accepted as a production asset.

## Per-figure conversion register

| OLE object | Original WMF part | Original bytes | Original SHA-256 | Bounded derivative task | Decision |
|---|---|---:|---|---|---|
| W4 OLE 1 | `word/media/image36.wmf` | 36500 | `51f4c161a02d372de6177971a95935ca509a6eb7cedec181c17cb905169f52f2` | TD-ASSET-W04-F01 | SVG export candidate; per-object verification pending. |
| W4 OLE 2 | `word/media/image37.wmf` | 71792 | `dcb5600cbe868389be027ea502559b271ee32d3d1cb80bcf0ddea6193c24aeb8` | TD-ASSET-W04-F02 | SVG export candidate; per-object verification pending. |
| W4 OLE 3 | `word/media/image38.wmf` | 60228 | `6614747895550767b8aaf2851ea7b157ea101ba091e55a12d883c5321a72b6ec` | TD-ASSET-W04-F03 | SVG export candidate; per-object verification pending. |
| W4 OLE 4 | `word/media/image39.wmf` | 59856 | `5303c1555e9c33be841bc614fa91c13ae7adb514f39e4a718f867b1184f8861c` | TD-ASSET-W04-F04 | SVG export candidate; per-object verification pending. |
| W4 OLE 5 | `word/media/image40.wmf` | 44004 | `285d30656f6b92950794c6e22d638b78105cdf6e541cdb17b68d3e5054423ff9` | TD-ASSET-W04-F05 | SVG export candidate; per-object verification pending. |
| W4 OLE 6 | `word/media/image41.wmf` | 47660 | `65bce7fac66086b258c501e0812ce7d77814fa6be28796f08280db4ffff595de` | TD-ASSET-W04-F06 | SVG export candidate; per-object verification pending. |
| W4 OLE 7 | `word/media/image42.wmf` | 120872 | `2619d4b706481a57c0f210acf4019edbdbf9370e6d7756eec60d5677cb699090` | TD-ASSET-W04-F07 | SVG export candidate; per-object verification pending. |
| W4 OLE 8 | `word/media/image43.wmf` | 51840 | `9f3c64c1a20090b5d0141149cfefaffb4613d39632ab366a87930f6d774273fe` | TD-ASSET-W04-F08 | SVG export candidate; per-object verification pending. |
| W4 OLE 9 | `word/media/image44.wmf` | 43964 | `10a083ad382f5e55bc642fbeae1cc6620586afe068d17e21543e40898b926f14` | TD-ASSET-W04-F09 | SVG export candidate; per-object verification pending. |
| W5 OLE 10 | `word/media/image45.wmf` | 108600 | `d0fd9b686031c19366518a6e4859a459aee2d354d4321b389da3e4a5bd4133b1` | TD-ASSET-W05-F01 | SVG export candidate; per-object verification pending. |
| W5 OLE 11 | `word/media/image46.wmf` | 98288 | `002e7f9be5a38217742a62069cb5f1423cfbb114c4d44a3fc826ca3ba7fd2fab` | TD-ASSET-W05-F02 | SVG export candidate; per-object verification pending. |
| W5 OLE 12 | `word/media/image47.wmf` | 83720 | `412a2335cdfe01e5d410232a13597ea05919fecfc37e8daf3075e3b077f96521` | TD-ASSET-W05-F03 | SVG export candidate; per-object verification pending. |
| W5 OLE 13 | `word/media/image48.wmf` | 89860 | `9d39f0a5baf3d6050accf691002d58bf25162f02f169d18b52ea57d4d7d3348a` | TD-ASSET-W05-F04 | SVG export candidate; per-object verification pending. |
| W5 OLE 14 | `word/media/image49.wmf` | 50944 | `f826cda7e02e702657d050f6a0cafea8d53e79180ef0aa4b7b68a3cada6b2754` | TD-ASSET-W05-F05 | SVG export candidate; per-object verification pending. |
| W5 OLE 15 | `word/media/image50.wmf` | 150500 | `94b7a15d4de3836cff7a8dec2d99a14f524cf53ffa601039c948a5981570c1bf` | TD-ASSET-W05-F06 | SVG export candidate; per-object verification pending. |
| W5 OLE 16 | `word/media/image51.wmf` | 56420 | `0ffa14db4c8b9b9e4e425c553c0119185ae12d51afffd8be68d564ff2da75206` | TD-ASSET-W05-F07 | SVG export candidate; per-object verification pending. |
| W6-7 OLE 17 | `word/media/image63.wmf` | 19308 | `aff737699c5bbbb3ee5435a5920be3bd11c6459b7549fc4ed26f4f4cbbe276a5` | TD-ASSET-W06-W07-F12 | SVG export candidate; per-object verification pending. |

## Acceptance criteria for each derivative

1. Export to SVG without executing the OLE binary.
2. Crop the page-sized viewBox to the drawing bounds; retain a clean white/transparent background consistent with the package asset contract.
3. Compare the SVG render against the source WMF preview and the source PDF page at sufficient resolution. Preserve every graduation, diagonal, centre, tangent point, radius, dimension, unit label and construction mark.
4. If text/labels overlap, disappear, change value or become unreadable, reject the conversion and use a separately documented faithful reconstruction or keep the asset task open. Do not silently omit labels.
5. Record source WMF SHA-256, derivative SHA-256, byte count, source row/body-child locator, alt text, truthful provenance and the matching OLE object ID in the asset evidence.
6. Bind only the accepted SVG derivative to the correct Week Four, Week Five or Week Six–Seven lesson record. Never commit original WMF/OLE bytes.

## Current state

- 17/17 WMF files have source hashes and byte counts recorded; all 17 are paired with AutoCAD.Drawing.15 OLE objects.
- 17 per-object asset tasks are already in the queue: Week Four F01–F09, Week Five F01–F07 and Week Six–Seven F12 (cross-row reuse validation).
- No derivative file is committed and no package asset binding is made. The asset tasks are the open production work; this conversion decision does not claim a successful end-to-end asset conversion.
- No app display, package schema, test, compiler/importer or deployment verification is claimed.

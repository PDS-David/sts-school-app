# AG-VIS-T3-W02-ELECTRIC-WATER — Agricultural Science, Third Term Week Two

Status: **IMPLEMENTED_TESTING_DEFERRED**. The two source images were inspected; neither is reused, modified or committed.

## Integrity and locators
- Composite archive SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` and exact Third Term DOCX member SHA-256 `9e920bff3769d9d977c4c2849cc77c769b6033be9176f4f6b35c27935999e12a` — verified.
- `word/media/image5.png`: 58,417 bytes, 216×193 pixels, SHA-256 `64c22c9d1d7bf0529a369609aa0e99038c03b6dbf05d22759fdcc83f9fcfee8e`.
- `word/media/image6.png`: 41,168 bytes, 530×318 pixels, SHA-256 `c41581779456eaf4f6d966d31cf783925e8869459f4bb661497bb67a67becdcc`.
- Both are embedded in `word/document.xml` direct-body block 211: `rId11 → image5.png`; `rId12 → image6.png`.

## Visual disposition
- **Image 5:** a photograph of a generator hall with multiple generator units. It is recognizable but small (216×193), so fine mechanical detail is limited. The visible credit reads **“Porterfield-Chickering/Photo Researchers, Inc.”**
- **Image 6:** a cross-sectional illustration of a hydroelectric dam/reservoir, with water-flow arrows and numbered callouts 1–6. At 530×318, the dam, reservoir, downstream flow and numbers are legible. The visible notice reads **“Encarta Encyclopedia, © Microsoft Corporation. All Rights Reserved.”**
- The following heading at block 212 is **“Electricity Generators”**; block 213 describes generators at Bonneville Dam on the Columbia River. This supports the generator photograph context. The diagram's numbered callouts have no legend/key in the adjacent source text; their identities must not be guessed or supplied from inference.
- **Rights:** neither the photo credit nor the copyright notice supplies a licence or permission. The DOCX includes no reuse terms. Do not reuse either image in learner-facing delivery unless licence or written permission is obtained and attribution requirements are met. If permission is unavailable, use separately sourced rights-cleared visuals for generator equipment and a hydroelectric dam. Any replacement diagram with numbered labels must have a verified key, or use an unnumbered visual.
- Preserve the source order: both images in the same paragraph at block 211, followed by heading 212 and explanatory paragraph 213. No crop, redraw, derivative or new asset was created.

## XML locator correction: WDP layers
The task locator says `hdphoto1.wdp` and `hdphoto2.wdp` are alternate layers in the block-211 drawing group. Direct XML inspection does **not** support that:
- Block 211 contains only two `a:blip` references: `rId11` → `image5.png` and `rId12` → `image6.png`; it contains no `a14:imgLayer`.
- `hdphoto1.wdp` is relationship `rId21`, referenced as an `a14:imgLayer` at block 487, alongside `image10.jpeg` and `image11.jpeg`.
- `hdphoto2.wdp` is relationship `rId25`, referenced as an `a14:imgLayer` at block 494, alongside `image13.jpeg`.
- These are alternate/effect layers in the Week Four reproductive-system groups, not additional independent figures and not part of this Week Two group.
- Appended `AG-CORR-T3-W02-WDP-LOCATORS` to correct the inventory; no inventory file was edited in this task because it is outside this item's allowed paths.

## Original rights-cleared replacement overview

An original eight-panel SVG is now registered as `AG-ART-T3-W02-FARM-POWER-SOURCES-01` for `SUP-SS1-AGRICULTURAL-SCIENCE-T3-W02-HUMAN-ANIMAL-WATER-BIOGAS`: `backend/src/db/ss1/assets/agricultural-science/t3-w02-eight-farm-power-sources.svg`; 8,924 bytes; SHA-256 `0f0fd56ae248279292364256c810cd54fd9198634733bef4d5768e705fee455d`. It is original vector artwork showing human, animal, mechanical, electrical, solar, wind, water and biogas power. It is not copied, traced or derived from any source image. The original unlicensed image in this task remains excluded from learner delivery; importer/learner-route replacement delivery is not yet verified. Asset approval remains PENDING and verification DEFERRED.

## Changes and validation
- Added open item `AGRICULTURAL-SCIENCE-T3-W02-ELECTRIC-WATER-RIGHTS` as a delivery blocker pending rights clearance or rights-cleared replacements.
- Marked `AG-VIS-T3-W02-ELECTRIC-WATER` `IMPLEMENTED_TESTING_DEFERRED`; appended the bounded inventory-correction task; recomputed queue counts and `next_runnable`.
- Verified archive/member and both image hashes/dimensions; opened both images; checked XML relationships, direct-body block 211, adjacent heading/paragraph and WDP layer locations.
- Parsed package/queue JSON; checked unique IDs and that every PARTIAL/UNRESOLVED coverage row has an open-item reference.
- Importer, learner rendering and app/device display **not run**; testing remains deferred.
- No source bytes, media, lessons, shared schema/compiler, other subject or delivery assets changed.

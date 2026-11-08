# BIO-SEC-T1-AGRI-ECOLOGY — Unlisted agricultural-activity and farming-system sections

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is a source-section index, not an approved syllabus placement or a new lesson.

## Source identity and locator

- Source ID: `SS1-SRC-422e0e6ddde9`; member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`.
- Verified member SHA-256: `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8` (957,703 bytes); matches the archive and assignment manifest.
- Locator rule: direct child of `w:body` in `word/document.xml`, zero-based. Block text is concatenated `w:t` runs; range hash is SHA-256 of block texts joined with newlines, including empty blocks.
- First heading block 448: `EFFECTS OF AGRICULTURAL ACTIVITIES ON ECOLOGICAL SYSTEM`.
- Second heading block 502: `EFFECTS OF DIFFERENT KIND OF FARMING ON ECOLOGICAL SYSTEM`.
- Combined range blocks 448-549: `9b687134eb1369508738f144502584713f5c27da3cfd92abe30df000c7d29cc9` (matches queue).

## Section A — Effects of agricultural activities on ecological systems (blocks 448-501)

| Subtopic | Locator | What the source covers |
|---|---|---|
| Ecosystem introduction | 448-449 (`6f62aa6fbf39a1a0096feb13c7b6438cad463b10497febfd3ffca121e992e1fe`) | Defines an ecosystem and introduces human agricultural activities as possible disruptors of ecological balance. |
| Bush clearing | 450-458 (`1b72ee1b0ce27b296e257b8ff78c18c615451a7ad32e2e624c6c4567b4b1b8d1`) | Lists effects on soil exposure, erosion/leaching, desertification, wildlife displacement, succession and useful plant species. |
| Bush burning | 459-473 (`1ed71154e74380160ed690b8cd7900cfcdb163f21b64a20abd541e4e02279815`) | Lists source-stated ecological effects and claimed advantages. The claims are preserved, not independently endorsed. |
| Tillage | 475-486 (`6712a4d9817b55cd926a9ff69182b4059cb8d093589e29ceb1968bebf022eb25`) | Defines tillage and lists effects/advantages concerning soil structure, erosion, leaching, soil organisms and aeration. |
| Fertilizer, pesticides and herbicides | 487-501 (`b24b1a0e9c707a6a3a56194421ad0d115241ba1c0393ce661f1c6bc962716212`) | Defines organic/chemical fertilizer, pesticide, herbicide and insecticide, then lists source-stated soil/water/organism effects. No rates, doses or handling instructions occur in this indexed section. |

## Section B — Effects of different farming systems on ecological systems (blocks 502-547)

| Farming system | Locator | What the source covers |
|---|---|---|
| Crop rotation | 503-514 (`275620a8c22589dd82e1acc30763cca2ad801e389fc2aea509bdbfe44a234032`) | Defines crop rotation and lists claimed benefits. Block 514 is a 6-row × 6-column table with five plots rotated across five years, plus header row. |
| Mixed farming | 515-520 (`5831bce9e9d240aef0f8d498ead815b04dc2f788403f1f0a0329beee265f4bae`) | Defines crop and animal production on the same farm and lists claimed benefits. |
| Mixed cropping | 521-522 (`545d57ee313e5531fc7843e2fd9ee62f54b67d8ab19b920401afe710cbf8cce0`) | Defines growing more than one crop on the same land at the same time. |
| Continuous cropping | 523-530 (`00f4a983c466a7edbf7edacc6d94c4912f5e9d2fb9b8b51dcbbbc4bc07025e60`) | Defines permanent cultivation of a plot and lists source-stated effects. |
| Monoculture/monocropping | 531-537 (`6bfe46c8405d79b43e7a62ea5d3f56c6ef8ff16b3d21bd90c3917582d0a40feb`) | Defines growing the same crop on the same plot each year and lists source-stated ecological effects. |
| Shifting cultivation | 541-547 (`f4fd46d6b51dabfd966f968fa229232c788a6248d8dbe6296ddfb9b8024cc32b`) | Defines cultivation followed by abandonment after yields decline and lists effects including deforestation, land wastage, erosion and animal migration. |

## Scheme relationship and disposition

Both sections are inside the Week 3 body range (133-644), but neither is named by scheme row 3, `Classification of Living things`. They are separate agricultural/ecological teaching sections and are not silently folded into the classification objective.

The intended placement is unresolved. The source does not establish whether the sections are intended as Week 3 supplementary content, belong to another scheme week or should remain separate. The package therefore records:

- `COV-BIO-T1-W03-AGRICULTURAL-ACTIVITIES` — UNRESOLVED.
- `COV-BIO-T1-W03-FARMING-SYSTEMS` — UNRESOLVED.
- `BIOLOGY-T1-W03-AGRICULTURAL-ACTIVITIES-PLACEMENT` and `BIOLOGY-T1-W03-FARMING-SYSTEMS-PLACEMENT` — non-blocking owner-placement decisions.
- `BIOLOGY-T1-W03-AGRICULTURE-FACTS` — blocking factual review for agricultural/soil claims.

## Safety and factual boundary

The section defines fertilizer, pesticide, herbicide and insecticide and describes their ecological effects. It does not provide rates or doses in the indexed range. No chemical-use instructions, concentrations or handling procedures are added. Soil and ecological claims remain source statements pending approved agricultural/soil-science review.

## Package and queue changes

- `biology.json`: added two UNRESOLVED coverage records and owner-placement/factual-review open items. No existing scheme coverage was overwritten.
- `QUEUE.json`: marked `BIO-SEC-T1-AGRI-ECOLOGY` IMPLEMENTED_TESTING_DEFERRED and recomputed status counts and `next_runnable`.
- No source text was moved, deleted, corrected or rewritten; no lesson or chemical-use procedure was invented.

## Verification boundary

The archive member hash, heading blocks, all listed block/range hashes and the crop-rotation table dimensions were checked. No tests, importer/compiler, database rehearsal or production import was run, as required by the owner's testing deferral.

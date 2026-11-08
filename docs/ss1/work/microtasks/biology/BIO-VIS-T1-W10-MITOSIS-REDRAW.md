# BIO-VIS-T1-W10-MITOSIS-REDRAW — verified stages and lesson-binding gate

Status: **BLOCKED — EXACT LESSON ID REQUIRED**. Source structure is already verified; no unregistered asset is committed.

## Source evidence reused

- Source: `SS1-SRC-422e0e6ddde9`, 1st Term SS1 Biology.
- Exact member SHA-256: `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8` (verified).
- Existing visual-disposition report: `BIO-VIS-T1-MITOSIS.md`.
- Original figures: blocks 997, 1006, 1015 and 1021; written stage descriptions: blocks 994-996, 1005, 1014 and 1020-1021.
- The source images are raster-only and their reuse rights are not recorded, so the redraw must be project-authored rather than copied.

## Verified four-panel content

| Panel | Stage group | Source evidence |
|---|---|---|
| 1 | Interphase and Prophase | Block 997; written descriptions at 994-996 |
| 2 | Metaphase | Spindle fibre, centromeres on the equator and chromatids; block 1006 and text at 1005 |
| 3 | Anaphase | Daughter chromatids move apart; block 1015 and text at 1014 |
| 4 | Telophase/Cytokinesis | Two daughter cells form; block 1021 and text at 1020-1021 |

The previous visual inspection confirms that the four source figures match the written stage sequence. Their labels are embedded in raster images and do not survive plain-text extraction.

## Why no asset is created or registered yet

1. The Biology package currently has no registered lessons.
2. The compiler requires every `asset.lesson_id` to resolve to an identified original source lesson or an authored supplement.
3. No verified parser-generated lesson ID for this Week 10 source row is recorded.
4. Importer/compiler execution is deferred by the owner, and project instructions prohibit inventing an original parsed lesson ID.
5. Creating an SVG without a valid lesson binding would leave an unregistered orphan asset and would not satisfy the task's completion condition.

The shared package gate `BIOLOGY-ASSET-LESSON-ID-BINDING` now tracks this and the other visual redraws requiring lesson registration.

## Next action after the gate

Once a valid lesson ID is identified through an owner-authorized parser run or an approved supplement lesson, create an original four-panel diagram with readable labels and a clear two-daughter-cell outcome. Register it with the exact bytes/hash, accessible alt text, source locator, project-created provenance, pending approval and deferred verification. Keep all original source images unchanged.

## Verification boundary

- Source member hash and prior visual report: verified/reused.
- Four-stage sequence and labels: confirmed by the prior direct inspection.
- Asset creation and registration: deliberately deferred because no valid lesson ID exists.
- Importer/compiler, package tests, app/device rendering and content approval: not run or granted.

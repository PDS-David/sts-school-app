# BIO-VIS-T1-W03-RHINO-BEETLE-CYCLE-REDRAW — source review and binding gate

Status: **BLOCKED — OWNER/LESSON DEPENDENCY**. The source cycle is clear enough to redraw, but no valid lesson target exists and the pest-section placement decision remains open. No asset was committed or registered.

## Source identity and inspection

- Source: `SS1-SRC-422e0e6ddde9`, 1st Term SS1 Biology.
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` (verified).
- Exact member: `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`.
- Member SHA-256: `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8` (verified; 957,703 bytes).
- Source heading: block 591, `Life Cycle of Rhinoceros beetle`.
- Supporting prose: blocks 592-593.
- Figure: block 593, native VML group with text boxes and directional connectors; rendered in a private LibreOffice PDF on page 22 of 46.
- The first, nymph-bearing pest-cycle fragment visible above the heading belongs to the preceding figure (blocks 582-590) and is not part of the rhinoceros-beetle cycle. The lower four-stage loop is the block 593 figure.

## Source-supported cycle

The block 593 diagram and adjacent prose support these stages:

`Egg → Larvae → Pupa → Adults → Egg`

The four labels are visible in the lower loop, and the rendered connectors establish the direction. The adjacent prose describes eggs hatching into larvae, larvae changing into a pupa, and adults emerging. No stage from the separate preceding nymph-bearing drawing is imported into this cycle.

## Why the redraw cannot yet be registered

1. The Week 3 indexing report identifies the pest/disease section (blocks 550-629) as an unlisted section not named by scheme row 3, which is `Classification of Living things`.
2. The existing owner action `BIOLOGY-T1-W03-PESTS-PLACEMENT` asks: should these pest/disease sections remain in Week 3, belong to another scheme week/subject, or remain supplemental? That placement decision has not been made.
3. The Biology package currently has no lessons. The compiler requires every asset's `lesson_id` to resolve to an identified original parsed row or an authored supplement. No verified lesson ID for this pest section is present, and the project instructions explicitly prohibit inventing an original parsed lesson ID.
4. Therefore, creating an SVG file without a valid lesson binding would leave an unregistered orphan asset and would not satisfy this task's completion condition. No source drawing is copied or changed.

## Next action after the gate is resolved

Once the owner/teacher confirms the section's placement and a real lesson ID exists, create a project-authored vector diagram with the source-supported loop `Egg → Larvae → Pupa → Adults → Egg`, then register it with exact bytes/hash, accessible alt text, source locator, project-created provenance, pending content approval and deferred verification. Keep the source VML figure unchanged.

## Verification boundary

- Archive and exact DOCX member hashes: verified.
- Original VML figure and page-22 render: inspected.
- Four-stage sequence and connector direction: confirmed from the lower figure and adjacent prose.
- Asset file, lesson binding and package registration: deliberately not created because the required lesson/placement gates are unresolved.
- Importer/compiler, package tests, app/device rendering and content approval: not run; testing remains deferred by owner.

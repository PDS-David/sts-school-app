# BIO-SEC-T1-RELEVANCE — Unlisted “Relevance of Biology to Agriculture” section

Status: **IMPLEMENTED_TESTING_DEFERRED**. This is a source-section index, not an approved syllabus placement or a new lesson.

## Source identity and locator

- Source ID: `SS1-SRC-422e0e6ddde9`; member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx`.
- Verified member SHA-256: `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8` (957,703 bytes); matches the archive and assignment manifest.
- Locator rule: direct child of `w:body` in `word/document.xml`, zero-based. Block text is concatenated `w:t` runs; range hash is SHA-256 of block texts joined with newlines, including empty blocks.
- Heading block 265: `Relevance of Biology to Agriculture`.
- Definition block 266: agriculture is described as growing crops and rearing farm animals to provide basic needs.
- Needs block 267: food, shelter, clothing and materials for industrial purposes.
- Blocks 265-267 range SHA-256: `d65058818f5615666c88631e669991c237a13e89aad11c12712f4a6ac145f766`, matching the queue attachment locator.

## Scheme relationship and disposition

The heading is within the Week 3 body range (blocks 133-644), but it is not named by scheme row 3, `Classification of Living things`. It is a separate short teaching section, not part of the classification objective itself.

No scheme line explicitly names this agriculture-relevance objective. It may be an intended Week 3 subtopic, a misplaced section or supplemental material; the source does not resolve the placement. The package therefore records `COV-BIO-T1-W03-RELEVANCE` as UNRESOLVED and a non-blocking owner-placement item `BIOLOGY-T1-W03-RELEVANCE-PLACEMENT`.

## Package and queue changes

- `biology.json`: added one UNRESOLVED coverage record and a non-blocking owner-placement open item. No existing coverage was overwritten.
- `QUEUE.json`: marked `BIO-SEC-T1-RELEVANCE` IMPLEMENTED_TESTING_DEFERRED and recomputed status counts and `next_runnable`.
- No source text was moved, deleted, corrected or rewritten; no lesson was invented.

## Verification boundary

The member hash, block text and range hash were checked against the verified archive member. No tests, importer/compiler, database rehearsal or production import was run, as required by the owner's testing deferral.

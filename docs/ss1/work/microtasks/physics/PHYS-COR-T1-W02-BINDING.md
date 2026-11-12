# PHYS-COR-T1-W02-BINDING — delivery correction

Status: **IMPLEMENTED_TESTING_DEFERRED**. Technical correction binding is registered in `physics.json`; content approval is still PENDING.

## Exact identity

- Source: `SS1-SRC-5c0149cda71d`
- Original member SHA-256: `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206`
- Original parsed row: `SS1-SRC-5c0149cda71d:BODY:b25cc5e52fe3eda43e116bfe65a3e741092f5690683031f26fc44ddbc2fea94e`
- Original row body SHA-256: `b25cc5e52fe3eda43e116bfe65a3e741092f5690683031f26fc44ddbc2fea94e`
- Primary replacement: `SUP-SS1-PHYSICS-T1-W02-MEASUREMENT-BASICS`
- Companion lessons: `SUP-SS1-PHYSICS-T1-W02-MICROMETER-READING`, `SUP-SS1-PHYSICS-T1-W02-VOLUME-MEASUREMENT`

## Correction

The original source Week Two row is replaced for learner delivery by the authored measurement-basics primary supplement. Companion supplements deliver the micrometer and volume objectives. This prevents the source's inconsistent Example 3.2 result from being shown as authoritative: 17.00 mm + 0.11 mm = 17.11 mm = 1.711 cm, not 17.1 mm.

The correction also prevents the text-extractor's U+001F-to-`undefined` artefact from becoming student text. The rendered original PDF shows the intended three blanks and embedded figures; the source member itself is unchanged.

## Evidence and limits

- Original source PDF pages 7–10; Example 3.2 on page 9.
- New original measurement assets: micrometer, volume displacement and clear worked micrometer/vernier reading examples.
- Proposed teacher-only assessment key: `PHYS-LES-T1-W02-KEY-ASSESSMENT.md`.
- Correction record ID: `PHYS-COR-T1-W02-BINDING` in `backend/src/db/ss1/subjects/physics.json`.

This is a technical source-to-supplement binding, not approval of the lesson or its assessment. Source alias approval, content approval and verification remain separate. The replacement and all new assets remain PENDING content approval and DEFERRED verification.

# BIO-LES-T2-W06-ECOLOGY — implementation audit

Status: **IMPLEMENTED — TESTING DEFERRED; CONTENT APPROVAL PENDING.**

## Source identity
- Source: `SS1-SRC-eb6e9665f42c`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`
- Week 6 label block 481; topic block 482; teaching blocks 489–548; Earth-sphere figures blocks 511–513.
- Archive/member integrity was verified in the current work session. The original archive and DOC remain unchanged and are not committed.

## Registered lesson
- Lesson ID: `SUP-SS1-BIOLOGY-T2-W06-ECOLOGY`
- Lesson title: Supplementary Lesson: Basic Ecological Concepts
- Lesson body SHA-256: `fb4437099b76e8566d7039010b014d469db69564c0735adfe0a5e7c23884dc80`
- Six objectives cover ecology, autecology/synecology, environment and Earth-system spheres, habitat/niche/population/community/ecosystem/biome, habitat subdivisions and ecosystem components.
- Ten keyed practice questions with criterion-level marking; total **24 marks**.
- No new diagram or image asset is required.

## Scientific corrections and scope
- Earth surface coverage is stated as approximately 71% ocean and 29% land. The source's lithosphere/hydrosphere percentages are not reused as definitions of those entire Earth-system spheres.
- Lithosphere is defined as the rigid outer part of Earth; hydrosphere includes water in liquid, solid and gaseous forms; atmosphere is the surrounding gaseous envelope.
- Dry-air composition is stated approximately as nitrogen 78.084%, oxygen 20.946%, argon 0.934% and carbon dioxide 0.042%, with other trace gases. Variable water vapour is excluded.
- Habitat is distinguished from ecological niche; niche includes an organism's ecological role and resource use.
- The completed scope disposition `BIO-SCOPE-T2-W06-BIOMES.md` identifies Week 6's biome definition as an introductory vocabulary preview. Detailed biome teaching remains in Week 7 and is not duplicated here.

## Package and queue changes
- Added the supplement to `backend/src/db/ss1/subjects/biology.json`.
- Mapped `COV-BIO-T2-W06-ECOLOGY` and `COV-BIO-T2-W06-ECOSYSTEM-COMPONENTS` to the new lesson as IMPLEMENTED_EQUIVALENT.
- Removed the stale Week 6 open item claiming no lesson existed.
- Preserved the teacher approval gate for updated environmental figures and the unresolved Week 6 source-assessment key.
- Updated `BIO-LES-T2-W06-ECOLOGY` to IMPLEMENTED_TESTING_DEFERRED.
- Queue counts: 126 IMPLEMENTED_TESTING_DEFERRED, 17 BLOCKED, 25 PENDING.

## Verification boundary
Source identity, source locators, package JSON, lesson body hash, 10-question/24-mark practice, coverage and queue reconciliation were inspected. Zod/package schema execution, importer/compiler, TypeScript checks, database rehearsal, production import and device testing were not run; owner-deferred verification remains in force. Content approval is PENDING and verification is DEFERRED.

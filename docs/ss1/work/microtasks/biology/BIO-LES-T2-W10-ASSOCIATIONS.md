# BIO-LES-T2-W10-ASSOCIATIONS — implementation audit

Status: **IMPLEMENTED — TESTING DEFERRED; CONTENT APPROVAL PENDING.**

## Source identity
- Source: `SS1-SRC-eb6e9665f42c`
- Archive member: `SSS 1/2nd Term SS1_/2ND TERM S1 BIOLOGY.doc`
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
- Member SHA-256: `41cfcb1848a8e67fe486674bf4dc94dcb13acd3e4d6477428e659f97a08f4b44`
- Week 10 label block 887; topic block 888; biological-association teaching blocks 892–938; assessment blocks 917–961.
- Archive/member integrity was verified in the current work session. The original archive and DOC remain unchanged and are not committed.

## Registered lesson
- Lesson ID: `SUP-SS1-BIOLOGY-T2-W10-ASSOCIATIONS`
- Lesson title: Supplementary Lesson: Types of Biological Associations
- Lesson body SHA-256: `d8367dc7e4ff2ad64f12aab42c5c90da920c4a625747e6c78ac5131e5174c7ca`
- Six objectives cover all six association types, interaction signs, verified examples, modern symbiosis terminology and parasitism/predation distinction.
- Ten keyed practice questions with criterion-level marking; total **21 marks**.
- No diagram or image asset is required.

## Scientific corrections and source-example decisions
- Mutualism is taught as +/+; protocooperation as non-obligatory/facultative mutual benefit; commensalism as +/0; amensalism as −/0; parasitism and predation as +/− with different mechanisms.
- Modern use of “symbiosis” is distinguished from the narrower school-text use of the term as a synonym for mutualism.
- Lichen, Rhizobium/legume, rumen microbes, termite gut microbes, flowers/pollinators, remora/shark, antibiotic-producing microbes, tapeworm/host, mistletoe/host and predator/prey examples are used with qualifications.
- The popular plover/crocodile cleaning story is not used as a keyed example; oyster/crab and human gut bacteria are not presented as simple commensalism examples.
- Tick feeding on blood is included as a supplemental ectoparasitism example.
- The source's statement that prey is “completely eliminated” is qualified: the prey individual is killed, not necessarily the prey species.
- “Allochemics” is identified as the older/source wording; the modern term is “allelochemicals”.

## Scheme/body mismatch and assessment limits

The scheme row and Week 10 topic line say **Ecological Management**, while the body teaches biological associations. This lesson is explicitly a supplement for the association content only; it does not invent an ecological-management syllabus. `BIO-SCOPE-T2-W10-MANAGEMENT` remains pending for the owner/subject expert's decision and approved source/material.

The source weekend Q952 asks for an association where “one member benefits” but omits commensalism from its options; more than one answer may fit the wording. It is not given a single keyed answer. Q953's tick question is supported by the added fact-checked tick example. Cross-term questions on growth hormones and mitosis remain subject to teacher confirmation.

## Package and queue changes
- Added the supplement to `backend/src/db/ss1/subjects/biology.json`.
- Mapped `COV-BIO-T2-W10-ASSOCIATIONS` to the new lesson as IMPLEMENTED_EQUIVALENT.
- Removed the stale open item claiming no associations lesson existed.
- Updated the association-facts open item to reflect the completed review and retain teacher approval for the corrected example set and Q952 wording.
- Preserved the separate UNRESOLVED `COV-BIO-T2-W10-ECOLOGICAL-MANAGEMENT` objective and the unresolved assessment key.
- Updated `BIO-LES-T2-W10-ASSOCIATIONS` to IMPLEMENTED_TESTING_DEFERRED.
- Queue counts: 129 IMPLEMENTED_TESTING_DEFERRED, 17 BLOCKED, 22 PENDING.

## Verification boundary
Source identity, source locators, package JSON, lesson body hash, 10-question/21-mark practice, coverage and queue reconciliation were inspected. Zod/package schema execution, importer/compiler, TypeScript checks, database rehearsal, production import and device testing were not run; owner-deferred verification remains in force. Content approval is PENDING and verification is DEFERRED.

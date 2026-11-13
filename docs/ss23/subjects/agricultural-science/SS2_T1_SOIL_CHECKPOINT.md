# Agricultural Science — SS2 First Term soil draft checkpoint

Updated: 2026-11-13
Task ID: SS23-AGRIC-SS2-T1-SOIL
Branch: `agent/ss23-agriculture-soil-unit-20261113`
Base: package-contract branch `agent/ss23-package-contract-20261113` (PR #794).

## Status

**TWO DRAFT LESSON UNITS IMPLEMENTED; NOT READY FOR STUDENT RELEASE.**

## Implemented

File: `backend/src/db/ss23/subjects/agricultural-science.json`

- SS2 Agricultural Science First Term Week 1: soil meaning, types, composition and properties.
- SS2 Agricultural Science First Term Week 2: soil formation, weathering, texture, structure, pH, profile and a settling-jar demonstration.
- Five assessment items per week, each with a model answer, explanation and marking criteria whose marks sum to the question total.
- Original-source provenance pinned to `SS23-SRC-225f920d3751` and member SHA-256 `225f920d3751892fcdd870b7c2bfb35ed6d773e70f317a60e72c07445e621316`.
- Four external factual references recorded separately as authored supplements; summaries are content-hashed, including Penn State Extension's gypsum/liming distinction.
- Source-to-scheme mapping is documented in PR #791.

## Explicit blockers — package remains PENDING

1. The school source calls the 5% soil fraction “living organisms”; the common mineral-soil model uses “organic matter”. Subject-lead decision required.
2. The school's silt/sand particle-size boundaries differ from the USDA classification. Confirm the required convention.
3. The source lists gypsum as a liming material. A subject specialist must review this before it is taught as a general acidity-correction material.
4. Five embedded figures were located and extracted from a LibreOffice-converted DOCX for review (two structure figures, three profile figures); derivative hashes and alt text are recorded in the package. The image bytes are not yet stored as delivery assets. The figures conflict with the written vocabulary: structure labels differ, and the profile diagrams use descriptive layers or O/A/B/C/R while the text uses A-D.
5. The source names six soil experiments but does not supply complete procedures, apparatus, safety notes or practical marking guides. Only a clearly labelled settling-jar demonstration is drafted.
6. The selected assessment questions have worked answers and marking criteria, but all original evaluation, weekend assignment and theory questions have not yet been reconciled.
7. Original-source reuse approval remains pending; authored lesson text is a draft and must not be student-delivered.

## Verification

- Package data is added to the SS23 package-contract test suite. The integration test parses the actual JSON file and asserts that its status and lesson approval remain pending and all blockers prevent delivery.
- The package schema enforces class/mode separation, source/hash binding, body hashes, provenance roles, minimum body length, answer explanations and marking totals.
- The Node/backend workflow is defined in PR #794's base branch and should run for this stacked PR. No successful CI result is claimed until the workflow reports it.
- No student-facing delivery route exists yet; accessibility has not been tested.

## Exact next action

Run the schema test and backend typecheck on this branch. Fix every failure. Then implement the SS23 package loader/compiler and class-safe student delivery route, with tests proving that pending content, wrong-class access, missing assets and unresolved blockers cannot be served. Inspect and recover the original figures before requesting subject approval.

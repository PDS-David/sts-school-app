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
- Five external factual references recorded separately as authored supplements; summaries are content-hashed, including Penn State Extension's gypsum/liming distinction and Clemson Extension's jar-test procedure.
- Source-to-scheme mapping is documented in PR #791.

## Explicit blockers — package remains PENDING

1. The school source calls the 5% soil fraction “living organisms”; the common mineral-soil model uses “organic matter”. Subject-lead decision required.
2. The school's silt/sand particle-size boundaries differ from the USDA classification. Confirm the required convention.
3. The source lists gypsum as a liming material. A subject specialist must review this before it is taught as a general acidity-correction material.
4. Five embedded figures were located and extracted from a LibreOffice-converted DOCX for review (two structure figures, three profile figures); five asset metadata entries record derivative hashes, byte counts, source locators and alt text, but those original figure bytes are not stored as delivery assets. A sixth, original SVG sedimentation-jar diagram is stored in the repository and referenced by the package. The figures conflict with the written vocabulary: structure labels differ, and the profile diagrams use descriptive layers or O/A/B/C/R while the text uses A-D.
5. The source names six soil experiments but does not supply complete procedures, apparatus, safety notes or practical marking guides. Only a clearly labelled settling-jar demonstration is drafted.
6. The selected assessment questions have worked answers and marking criteria, but all original evaluation, weekend assignment and theory questions have not yet been reconciled.
7. Original-source reuse approval remains pending; authored lesson text is a draft and must not be student-delivered.

## Verification

- Package data is added to the SS23 package-contract test suite. The integration test parses the actual JSON file and asserts that its status and lesson approval remain pending and all blockers prevent delivery.
- The package schema enforces class/mode separation, source/hash binding, body hashes, provenance roles, minimum body length, answer explanations and marking totals.
- The Node/backend workflow is defined in PR #794's base branch and should run for this stacked PR. GitHub Actions run 43471333725 passed: backend TypeScript typecheck and all 13 SS23 Node tests succeeded.
- No student-facing delivery route exists yet; accessibility has not been tested.

## Exact next action

Run the schema test and backend typecheck on this branch. Fix every failure. Then implement the SS23 package loader/compiler and class-safe student delivery route, with tests proving that pending content, wrong-class access, missing assets and unresolved blockers cannot be served. Inspect and recover the original figures before requesting subject approval.


## Student delivery implementation

The SS23 package loader and fail-closed student delivery service are implemented. Student routes were added in `backend/src/routes/learning.ts`:

- `GET /learning/ss23/lessons` — SS2 instructional lessons only.
- `GET /learning/ss23/preparation` — SS3 exam-preparation resources only.
- `GET /learning/ss23/units/:unitId` — class-bound unit access.
- `GET /learning/ss23/assets/:assetId` — class- and term-bound verified assets.

The server resolves a student's class membership; clients cannot choose a class. Term PIN redemption is checked. Student projections omit model answers, explanations, marking criteria and source provenance. Assets are served only after approval, implementation, verification, permitted reuse and byte/hash checks. The current Agriculture package remains PENDING with seven blockers, so **these routes currently return no Agriculture lesson content**.

GitHub Actions run 43472999779 passed after Week 3 was added: backend TypeScript typecheck and 24/24 SS23 Node tests. Tests cover package loading, wrong-class access, fail-closed pending packages, answer-key hiding, term/asset gating, path traversal and stale asset hashes.


## Week 3 — Farm machinery and implements

Week 3 is now drafted with a substantive lesson covering tractor systems, functions, daily and periodic maintenance, bulldozers and tree pullers, shellers, dryers, incubators, milking machines, ploughs, harrows, cultivators, ridgers, planters, harvesters, sprayers and safe operation. All 17 distinct source assessment prompts have authored answers, explanations and mark-by-mark criteria. Fifteen embedded machinery figures have derivative hashes, byte counts, source locators and alt text recorded; original bytes are not stored for student delivery.

Three technical references support the authored corrections and safety guidance: Penn State Extension (PTO), UF/IFAS Extension (tractor safety), and Tamil Nadu Agricultural University (sprayer safety). Two source inaccuracies are explicitly flagged: the PTO is a power-transmission shaft, not the pulling hitch; petrol engines use spark plugs whereas diesel engines normally use compression ignition.

The scheme assigns Plant Nutrients and Nutrient Cycles to Weeks 8-9, while the body has a single Week Eight heading for that range and no separate Week Nine heading. The source map records this as a two-week scheme range extending beyond the body heading, not proof of a missing separate Week Nine lesson. Full Week Eight content and assessment coverage must be verified before treating the range as complete; no separate Week Nine lesson will be invented. The Week Three reading assignment also cites O.A. Iwena, *Essential Agricultural Science*, Chapter 12, pages 101–115, but the edition was not supplied; this is recorded as a non-blocking unverified reference.

The package now contains 3 units, 54 questions (44 original-source prompts and 10 authored supplements), 21 asset records (20 source-extract references and one stored SVG), 8 external factual references and 11 open items (10 delivery-blocking, one non-blocking). All package content remains PENDING; student routes therefore serve no lessons yet.


## Weeks 4–5 — Farm surveying and planning of farmstead

Weeks 4–5 are drafted as one combined source unit, matching the original heading and source map. The lesson covers surveying meaning and importance, eight surveying instruments and their uses, chaining precautions, instrument maintenance, farm planning, farmstead definition and siting, area formulas, hectare conversion and plant-population calculations. Fourteen clear original-source assessment prompts have authored answers, explanations and mark-by-mark criteria; two additional calculation exercises are authored supplements.

Two verified factual references support the work: the WAEC 2018 Agricultural Science examiner report for farm surveying definitions and instrument uses, and NIST Handbook 44 for the exact hectare conversion. The source's statement that 1 hectare = 100,000 m² is corrected to 10,000 m². The source's siting rule that livestock buildings should always occupy the poorest soil is flagged for subject review. The General Evaluation item "List five factors coupled implements" is malformed and remains unresolved rather than guessed.

Three embedded source figures (a watermarked farmstead layout and two calculation graphics) have derivative hashes, byte counts, source locators and alt text recorded as pending source-extract references. The watermarked layout requires permission or replacement. The O.A. Iwena Chapter 22 pages 214-222 reading reference remains unverified because the cited edition was not supplied.

## Current First Term package totals

- 4 units: Weeks 1, 2, 3 and combined Weeks 4-5.
- 70 assessment/practice items: 58 original-source prompts and 12 authored supplements.
- 24 asset records: 23 pending source-extract references and one stored authored SVG.
- 10 external factual references.
- 16 open items: 14 delivery-blocking and two non-blocking.
- Package status remains PENDING; the student routes intentionally serve no lessons until blocking items are resolved and evidence-backed approval/verification is recorded.

**Next exact task:** audit and draft Week 6 (Irrigation and Drainage), preserving its source text, assessments and figures. Then proceed to Week 7, and only after that verify the combined Week 8-9 nutrient-cycle coverage and Week 10 nutrient-availability content.


## Week 6 — Irrigation and drainage

Week 6 is drafted with irrigation meaning and selection factors; surface, sprinkler, drip/micro and subsurface irrigation; advantages and limitations; irrigation problems and disease prevention; drainage meaning, importance and surface/subsurface systems; and the relationship between irrigation, leaching and drainage. Seventeen original-source assessment prompts have authored answers, explanations and mark-by-mark criteria, with two authored application questions.

Two external factual references support the technical corrections: USDA NRCS on irrigation-method classification and selection, and FAO on salinity, leaching and drainage. The lesson flags four source issues for specialist approval: drip is incorrectly grouped under overhead irrigation; surface irrigation is confused with removal of excess rainwater (drainage); irrigation is said to reduce salt without the conditions of suitable water and adequate drainage; and the statement about using high-salt water in drip systems is ambiguous/incomplete.

Fourteen embedded source images (image26-image39) have hashes, byte counts, locators and alt text recorded. Several are third-party mobile screenshots and one centre-pivot photograph carries an Alamy watermark; rights remain pending. Two original diagrams have been added: irrigation methods and surface/subsurface drainage.

The Week Six reading assignment cites O.A. Iwena, Chapter 19, pages 204-208; the edition was not supplied, so the reference is recorded as non-blocking and unverified.

## Updated First Term package totals

- 5 units: Weeks 1, 2, 3, combined Weeks 4-5, and Week 6.
- 89 assessment/practice items: 75 original-source prompts and 14 authored supplements.
- 40 asset records: 37 pending source-extract references and 3 stored authored SVG diagrams.
- 12 external factual references.
- 22 open items: 19 delivery-blocking and 3 non-blocking.
- Package status remains PENDING; the student routes intentionally serve no lessons until blocking items are resolved and evidence-backed approval/verification is recorded.

**Next exact task:** audit and draft Week 7, preserving the source text, assessments and figures; then verify the combined Weeks 8-9 nutrient-cycle coverage and Week 10.

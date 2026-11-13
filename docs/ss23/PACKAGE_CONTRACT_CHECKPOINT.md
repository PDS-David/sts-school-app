# SS2 / SS3 package contract — checkpoint

Updated: 2026-11-13
Task ID: SS23-01
Branch: `agent/ss23-package-contract-20261113`
Base: `master` @ `b8651cebaa480097fd1c40c9b02c11b228187caa`

## Status

**PACKAGE CONTRACT IMPLEMENTED; RUNTIME / CI VALIDATION PENDING.** No SS2 or SS3 lesson package is certified by this change.

## Changed files

- `backend/src/db/ss23/subjectPackageSchema.ts`
- `backend/src/db/ss23/subjectPackageSchema.test.ts`
- `backend/src/db/ss23/subjects/agricultural-science.json` (SS2 First Term Weeks 1-2 draft with 27 source assessment prompts and 10 authored practice supplements)
- `backend/src/db/ss23/assets/agricultural-science/soil-sedimentation-jar.svg` (authored practical diagram)
- `backend/src/db/ss23/loader.ts` and `studentDelivery.ts` (registered package loading and fail-closed student delivery)
- `backend/src/db/ss23/studentDelivery.test.ts` and SS23 routes in `backend/src/routes/learning.ts`
- `.github/workflows/ss23-package-schema.yml`

## Contract boundaries

- SS2 package: class `SS 2`, mode `INSTRUCTIONAL`, terms 1-3, unit kind `LESSON`.
- SS3 package: class `SS 3`, mode `EXAM_PREPARATION`, terms 1-2 only, unit kinds limited to revision units, practical guides, past-question sets, mock exams and exam strategies. Examination targets must be declared (WAEC, NECO, JAMB or cross-board).
- No SS3 third-term package or normal SS3 instructional mode is accepted.
- Original source records use SHA-derived `SS23-SRC-` IDs. External source records use separate `SS23-EXT-` IDs and content hashes.
- Every unit requires substantive body text (minimum 500 non-whitespace characters), at least two practice items, answer explanations, mark allocations and marking criteria whose totals equal the question marks.
- Every unit and asset must have provenance bound to an existing source ID and SHA. Original and authored supplementary material have distinct provenance roles.
- Every source requires a coverage disposition. Supported coverage must link to a unit.
- Body and external-source hashes are checked during schema validation. Asset byte/hash verification remains the responsibility of the forthcoming loader.
- Approval, implementation, verification, reuse rights and delivery blockers remain explicit states; schema validity does not imply student-release approval.

## Tests authored

Twenty-four Node tests cover valid SS2/SS3 package shapes, question/answer provenance, the real Agricultural Science draft package, registered-package loading, class separation, answer-key hiding, term/asset gating and file integrity.
- SS3 third-term sources;
- SS3 normal instructional mode;
- stale lesson body hashes;
- marking totals that do not equal the awarded marks;
- missing answer explanations;
- mismatched source provenance;
- superficial lesson bodies;
- approval or verification claims without supporting references.

The workflow installs locked dependencies, type-checks the backend and runs the schema tests. Because this workflow is introduced in this PR, it cannot execute on this PR until it is present on the base branch. Latest package-contract commit: `943d9be62030d9c6c9c821c07ab3ef17b2157e8d`. GitHub Actions run 43472154140 completed successfully on the stacked Agriculture PR: backend TypeScript typecheck passed and all 24 SS23 Node tests passed.

## Remaining work

1. Run the schema test and backend typecheck on the stacked Agricultural Science PR; fix every issue found.
2. Implement the SS23 package loader/compiler. Verify source archive-member paths, byte counts and SHA-256 values; apply source rules without rewriting instructional text; build coverage and blockers.
3. Implement separate SS2 instructional and SS3 exam-preparation student delivery routes. Enforce class, term and approval gates; prevent locked content from exposing answers or assets.
4. Add delivery integration tests for authorized SS2/SS3 students, wrong-class access, locked terms, stale hashes, missing assets, and unapproved content.
5. Create subject packages only after source mapping is complete; no subject is ready merely because it passes schema validation.

## Exact next action

The SS2 Agricultural Science First Term Weeks 1-2 Soil draft now includes all 27 original-source assessment prompts with authored answers and mark-by-mark guidance, five source-figure references, and an authored sedimentation diagram. Resolve the remaining technical/rights/visual blockers, verify the assessment set, complete the remaining five practicals and continue source-complete SS2 Agriculture lessons. The loader and class-safe routes are implemented but currently serve no lessons because the package is PENDING and all seven blockers remain. Preserve SS3 as exam preparation only.

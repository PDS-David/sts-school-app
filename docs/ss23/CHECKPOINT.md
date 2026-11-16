## SS23-Q-DELIVERY-TESTS-01 — 2026-11-16

- Status: **PR OPEN (#854), STACKED ON #853; EXPANDED SS23 TESTS GREEN.**
- Base: `agent/ss23-validator-contract-alignment-20261116` (PR #853), which is based on `master`.
- Changed files:
  - `backend/src/db/ss23/studentDelivery.test.ts` — every approved SS2 unit must be retrievable by ID; no unit may be retrieved as SS3; every current pending draft unit must remain unavailable to both classes; student projections must omit answers, explanations, marking criteria and provenance for every question.
  - `package.json` — `test:ss23` now runs validator tests plus all `backend/src/db/ss23/*.test.ts` package and delivery tests.
  - `.github/workflows/ss23-package-schema.yml` — invokes the unified `npm run test:ss23` command rather than only the schema test.
- Commits:
  - Delivery regression tests: `3471ec3856884be719627b8c9754669147c305b6`
  - Unified SS23 test command: `2ef7a138cd5200e8f2839099ce76713a21663e5e`
  - Package-contract workflow: `d1be5aaa435e2306cc5ba62d16fe99e3fa43c206`
- Test results:
  - Local execution: NOT RUN (GitHub DNS unavailable in this execution environment).
  - `npm run test:ss23`: pending PR CI; expected to include validator, schema and student-delivery tests.
  - Route-level HTTP integration tests are still outstanding; these tests exercise the delivery service called by the SS2/SS3 routes.
- PR: [#854](https://github.com/PDS-David/sts-school-app/pull/854), base `agent/ss23-validator-contract-alignment-20261116` (PR #853); head branch `agent/ss23-student-delivery-regression-20261116`; code commits `3471ec3856884be719627b8c9754669147c305b6`, `2ef7a138cd5200e8f2839099ce76713a21663e5e`, `d1be5aaa435e2306cc5ba62d16fe99e3fa43c206`.
- CI: SS23 package-contract run `43788396221` completed SUCCESS on commit `0414325dbe38e27ec669fae8837628beb6e9f835`: locked install passed, backend typecheck passed, unified `npm run test:ss23` passed **70/70** (0 failed, 0 skipped). SS2/SS3 source-validation run `43788396255` also passed. The earlier run `43788373905` was cancelled by a newer branch commit; it was not a test failure.
- Exact next action: retain route-level HTTP integration as a separate outstanding check; do not merge either PR.

---

## Live-state update — 2026-11-16

This section supersedes the historical branch/PR status in the checkpoint below. Historical source-receipt evidence is retained.

### Current master and merged work

- Current master baseline at task start: `28c0f808565aae243b113ab5b0c261d9d34a90d5`.
- PR #791 Agricultural Science source map merged: `8176e6e27b8ea30261d9464c89748f0c5a09845c`.
- PR #794 SS2/SS3 unit package contract merged: `53ceca40c70c1ea8634cfbffe86fe12bdf9ba884`.
- PR #819 Agricultural Science package, loader and gated SS2/SS3 student delivery merged: `d341acf855c9eb240e51991aa9e6eaa62fe0efe5`.
- PR #846 source registry, validator and integrity workflow merged: `02081f769999d1d6be33b97be5b11f6d7a8d86d1`.
- SS3 scope is owner-authorized exam preparation only (WAEC/NECO/JAMB), not normal instructional progression. This is stated in the owner-supplied `STS_School_Completion_Plan_and_Required_Files.docx` and enforced by merged PR #794; substantive teaching ends by SS2. No SS3 audit-only vs normal-curriculum decision is outstanding.

### Current curriculum status

- SS2 Agricultural Science has one root-level package with 8 units (First Term), 150 practice/assessment items, 47 asset records (42 pending source-extract references and 5 stored SVGs), and 43 open items (37 delivery-blocking, 6 non-blocking). Package and unit approvals remain PENDING. This is not student-release readiness.
- The package's First-Term source member SHA/byte identity matches the source registry. The merged source map provides week/topic mapping. Subject-lead decisions and figure/source-use blockers remain.
- No other SS2 subject package is recorded as implemented. SS3 exam-preparation subject packages remain outstanding.
- SS23-Q student delivery is already implemented in master by PR #819: class-resolved routes, term PIN gating, approval/verification/reuse gates, asset integrity checks, and student projections that omit answers, explanations, marking criteria and provenance. PR #819 workflow run 43476440171 passed backend typecheck and all 25 SS23 tests. The current SS23 integrity workflow also revalidated the backend after the validator fix. Route-level HTTP reachability still requires focused verification.

### SS23-VALIDATOR-ALIGN-01 — current task

- Branch: `agent/ss23-validator-contract-alignment-20261116`
- Status: **PR OPEN (#853); SS23 INTEGRITY GATE GREEN.**
- Changed files:
  - `backend/src/db/ss23/validateSubjectPackages.ts` — validates current root-level unit packages with the merged unit schema and registry, while retaining legacy audit-package validation; readiness now counts the current package.
  - `backend/src/db/ss23/refreshIntegrityHashes.ts` — checks root-level unit packages and legacy class subdirectories; refreshes unit/lesson body hashes and stored asset hashes; missing unapproved source-extract references remain non-deliverable metadata, while approved missing assets fail.
  - `tests/ss23/unit-package-validator.test.mts` — regression coverage for root package discovery, readiness, source hash/byte mismatch, pending assets, approved missing assets, path traversal and consolidated-archive member path variants.
- Commits:
  - Validator initial alignment: `407d5d57c0e42cb1060472e9c682806f2753e969`; term-readiness correction: `aea1b6c920e8a96bbd13e2dddbb4a3f0ab79786e`
  - Hash refresh (final): `0bb5c2740b004e35bc00df86a852a77e24730a4c`
  - Regression tests initial: `5b0373917dd253db480fae31c03860a846b8237b`; term-readiness regression: `e9308bc131eaec34cfba50b6e8fa2b22b7771b14`
- Test evidence:
  - Local clone/install could not run: `git clone` failed because this execution environment could not resolve `github.com`.
  - `npm ci --ignore-scripts --workspace backend`: NOT RUN.
  - `npm run ss23:refresh-hashes -- --check`: NOT RUN locally.
  - `npm run validate:ss23`: NOT RUN locally.
  - `npm run test:ss23`: NOT RUN locally.
  - Backend TypeScript typecheck: NOT RUN locally.
  - PR CI: pending; do not describe this task as tested until the SS23 integrity gate passes.
- PR: [#853](https://github.com/PDS-David/sts-school-app/pull/853), base `master`, head `agent/ss23-validator-contract-alignment-20261116`; latest code commit before this checkpoint update: `e9308bc131eaec34cfba50b6e8fa2b22b7771b14`.
- Initial run `43787842843` passed but exposed a term-classification defect; the fix and regression test were committed before the successful rerun.
- Latest SS23 integrity-gate run `43787952505` on commit `44ee7e4306f5405b16fc4f592ddb1fe0339f9c58` completed SUCCESS. `npm ci --ignore-scripts`, backend typecheck, `npm run ss23:refresh-hashes -- --check`, `npm run validate:ss23`, `npm run test:ss23` (33 passed, 0 failed, 0 skipped) and `npm run validate:ss1` all passed.
- `validate:ss23` returned valid=true, errors=[], packages=1; readiness summary: `IN_PROGRESS: 1`, `MISSING_TERM_PACKAGE: 2`, `MISSING_PACKAGE: 96`, `SOURCE_MISSING: 27` (126 term rows). SS2 Agricultural Science T1 is the only in-progress term; T2/T3 are explicitly missing term packages.
- Additional PR checks: SS23 package contract tests run `43787952618` SUCCESS; SS2/SS3 source validation run `43787952587` SUCCESS; SS1 integrity gate run `43787952572` SUCCESS. JSS3 workflow run `43787952603` was still running at this checkpoint and is outside this task's scope.
- Exact next action: continue SS2 Agricultural Science Terms 2-3 only after the original source files and owner decisions are available; then continue SS2 alphabetical. Keep SS3 exam-preparation scope pending explicit owner confirmation. Do not merge PR #853.

### Owner decisions and source limitations

- SS3 scope: resolved by the owner-supplied completion plan. Deliver exam-preparation only (WAEC/NECO/JAMB); do not add normal SS3 instructional topics. The empty SS3 Third-Term archive is not a reason to invent teaching content.
- The live source-receipt checkpoint records two consolidated archives, with 96/100 exact member matches and four different-content versions: SS2 T2 Economics, SS2 T3 Further Mathematics, SS3 T1 Mathematics and SS3 T1 Economics. Owner decision is still required before substituting any of those four versions.
- SS2 T2 Geography still has a header/class mismatch requiring confirmation that it is SS2 content with a header typo.
- Missing source terms remain explicit: SS3 Third-Term archive; Technical Drawing SS2 T1 and SS3 T1; Catering Craft SS2 T1, SS2 T3 and SS3 T1; Food & Nutrition SS3 T2. SS3 Literature T1/T2 and Book-keeping term duplicates remain unresolved source distinctions.
- SS2 T2 Data Processing starts at Week 2 without a scheme; SS2 T2 Food & Nutrition has a T1 duplicate. Do not invent missing original source material.
- No curriculum approval, acceptance or student-release approval is inferred from merged code or CI success.

---

# SS2 / SS3 curriculum readiness — checkpoint

Task: SS23-00 baseline inspection and SS23-S0 source receipt. Updated: 2026-11-13.
Current implementation branch: `agent/ss2-ss3-readiness-source-receipt-20261113`.
Base: `master` @ `b8651cebaa480097fd1c40c9b02c11b228187caa`.

Status: **SOURCE ARCHIVES RE-SUPPLIED; member-level reconciliation and curriculum implementation remain in progress.** This is not a curriculum-completion claim.

## Scope and policy
- SS2 is a normal instructional class. Validate all registered subjects and all three terms against original sources before packaging or student release.
- SS3 is **EXAM PREPARATION ONLY (WAEC / NECO / JAMB)**, not normal instructional progression. Do not import SS3 as a normal class curriculum or create new term-3 teaching topics.
- Preserve original source wording/provenance. Authored supplements must be explicitly labelled and separately evidenced; do not silently represent them as original source material.
- Do not alter Primary, JSS, SS1 or existing certified records while implementing SS2/SS3.

## Repository baseline and coordination
- Master inspected at `b8651cebaa480097fd1c40c9b02c11b228187caa`.
- Earlier source-intake checkpoint PR #684 is merged (merge commit `96d93d49f79db6a0bdb46565d5faf982e135c258`).
- Open PRs #787 and #788 are unrelated mobile/CI repairs.
- Existing subject workers and SS1 files are out of scope. No other SS2/SS3 subject implementation branch was found during the branch search.
- Existing SS1 package schema is hard-coded to `SS 1` and IDs `SUP-SS1-`; it cannot be reused unchanged as proof of SS2/SS3 readiness.
- Existing `ingestTopics.ts` explicitly excludes SS3 from normal curriculum ingestion. Preserve that exclusion; SS3 exam-prep delivery needs its own explicit model/route rather than changing SS3 into a normal term progression.

## Source receipt (re-supplied 2026-11-13)
See `docs/ss23/sources/RECEIPT_20261113.md`.
- SS2 archive: 61 files; SHA-256 `a97506c7f030a6e9604a13ae0aab30f59563a1473ec682f647459549dd9e1153`.
- SS2 term folder counts: T1 19, T2 22, T3 20.
- SS3 archive: 39 files; SHA-256 `045e261aba9475b32b4cb963a2495faf3ddd503860b205aa1e89f0ac07d3c741`.
- SS3 term folder counts: T1 19, T2 20; no T3 folder/source documents.
- Archives were inspected in-session and are not committed. No repository-upload authorization was given.
- The earlier `SOURCE_ASSIGNMENTS.csv` records 100 members from six separately packaged archives. The new uploads combine those term folders into two archives and use different member path prefixes. Reconcile all 100 member SHA-256 values against the existing register before asserting byte-for-byte identity or updating source assignments.

## Task log
| Task ID | Status | Changed files | Commit / evidence | Remaining work |
|---|---|---|---|---|
| SS23-00 | DONE | `docs/ss23/CHECKPOINT.md`, `docs/ss23/sources/README.md`, `docs/ss23/sources/SOURCE_ASSIGNMENTS.csv` (prior merged checkpoint) | PR #684 merged; baseline recorded | None for baseline |
| SS23-S0 | 96/100 EXACT MEMBER MATCHES; 4 VERSION DIFFERENCES RECORDED | `docs/ss23/sources/RECEIPT_20261113.md`, `RECEIPT_DIFFS_20261113.csv`, `scripts/ss23/reconcile_received_archives.py`, reconciliation tests | 100/100 paths classified; independent class/term/hash/byte multiset comparison: 96 exact, 4 different-content files (SS2 T2 Economics; SS2 T3 Further Mathematics; SS3 T1 Maths and Economics). Differences preserved in versioned receipt; original register not overwritten. Utility and 5 focused tests in commit `c3fa10e85c7f33a7ab3f9fad8380d1829e8527fd`; isolated Python tests 5/5 passed. | Obtain owner decision on four alternate versions; continue independent subjects using confirmed sources |
| SS23-S0 (PR #847: 100-member inventory) | done | `docs/ss23/sources/`, `scripts/ss23/build_registry.py`, `backend/src/db/ss23/sourceRegistry.json` | `docs/ss23/sources/` (100 members hashed; not committed as extracts) | See owner decisions below |
| SS23-S1 (PR #847: header verification) | done | `docs/ss23/sources/HEADER_VERIFICATION.csv`, `scripts/ss23/verify_headers.py` | `docs/ss23/sources/HEADER_VERIFICATION.csv`; `scripts/ss23/verify_headers.py`. 84 verified; 11 subject+class OK but term label absent (term taken from folder); 5 flagged (below). Screen is regex-based on the first 1500 chars; not a content review. Not run through any validator | See owner decisions below |
| SS23-01b (PR #847: registry-based validator; distinct from SS23-01 package contract, #794) | done (code), not run in CI | `backend/src/db/ss23/registrySchema.ts`, `validateSubjectPackages.ts`, `refreshIntegrityHashes.ts`, `tests/ss23/validator.test.mts`, `.github/workflows/ss23-integrity-gate.yml` | additive `backend/src/db/ss23/` (schema, validator, refresh-hashes, registry of 100 sources); SS1 untouched except `export` on `openItemSchema`. Local: `npm run test:ss23` 23/23 pass (incl. negative controls); `npm run validate:ss23` valid, 0 packages, readiness 99 MISSING_PACKAGE + 27 SOURCE_MISSING; `npm run validate:ss1` still valid; backend `tsc --noEmit` clean (Node 22.23.4; CI pins 24.19.0). New CI gate `.github/workflows/ss23-integrity-gate.yml` NOT yet run. Student delivery (`studentDelivery.ts`, `routes/learning.ts`) is SS1-only and NOT yet extended (SS23-Q) | See owner decisions below |
| SS23-AGRIC-SOURCE-MAP | PR OPEN (#791) | `docs/ss23/subjects/agricultural-science/SOURCE_MAP.json`, subject checkpoint, source-map tests, SS23 test workflow | Latest branch commit `8eea8d823ac2f980e895050ae68195cbce205741`; 5 source documents mapped; T1 Agriculture source ID corrected against the 100-row register; manifest and consistency assertions passed | Complete actual SS2 Agriculture lessons and student delivery; SS3 exam-prep gaps remain open |
| SS23-01 | PR OPEN (#794) | SS23 Zod package schema, 10 contract tests, package validation workflow, checkpoint | Branch `agent/ss23-package-contract-20261113`; enforces SS2 instructional vs SS3 exam-prep, provenance, hashes, answers and marking. CI not yet run because workflow is new to master. | Run backend typecheck and schema tests once workflow is on default branch; implement loader and student delivery |
| SS23-AGRIC-SS2-T1-SOIL | PR OPEN (#819; stacked on #794; schema CI passed) | `backend/src/db/ss23/subjects/agricultural-science.json`, integration test, subject checkpoint | Two source-based lesson drafts; 10 questions with answers/explanations/marking; 4 external references; 7 blockers; package remains PENDING. JSON and structural checks passed. | Inspect original figures, resolve composition/texture/gypsum issues, reconcile all source assessments, implement loader and student access |
| SS23-02 onward | PENDING | One subject package and focused tests per PR | No SS2/SS3 subject package is certified or student-accessible | Work SS2 alphabetical, then SS3 exam-prep subjects; source headers, week coverage, lesson depth, assessments, answers, explanations, marking and student delivery |

## Known source gaps from the earlier inventory (must be rechecked against the re-supplied archives)
- SS3 has no Third-Term source archive.
- Previously reported missing files: Technical Drawing SS2 T1 and SS3 T1; Catering Craft SS2 T1, SS2 T3 and SS3 T1; Food & Nutrition SS3 T2.
- SS3 Literature T1/T2 were byte-identical in the earlier inventory.
- SS2 Food & Nutrition T2 included a duplicate T1-named document; the distinct T2 file was separately identified.
- Book-keeping T1/T2 appeared identical after the header line for SS2 and SS3.
- Filename/term labels are not authoritative: verify document headers and week/topic content before mapping.

## Verification requirements
A subject is not ready until evidence demonstrates:
1. every registered source is accounted for and mapped to the correct subject/class/term;
2. expected teaching weeks and source topics are covered, with explicit unresolved gaps;
3. each student-facing lesson has substantive explanations, worked examples where appropriate, and usable practice;
4. assessment answers and mark-by-mark marking guidance are present and checked;
5. source references, source/member hashes, lesson-body hashes and asset hashes validate;
6. student delivery resolves the lesson and its required assets/answers correctly;
7. focused tests and relevant package/importer checks pass without changing SS1 or unrelated classes.

## SS23-S1 flagged members
- SS2 T2 Geography: header says `CLASS: SS3`, but topics (environmental conservation, manufacturing, relief landforms, population, settlement) differ from the SS3 T2 Geography file (tourism, remote sensing, GIS, mock exams). Likely an SS2 note with a header typo; owner to confirm.
- SS2 T2 Data processing: file has no scheme of work or header; it starts at "WEEK : 2 Relational Database". Week 1 and the scheme are missing from this file.
- SS2 T2 `F _ N (1) (1).docx`: header says FIRST term (known T1 duplicate).
- SS2 T1 Financial Accounting: header names no class or term. SS2 T3 English Language: no class in header.

## Owner decisions still needed (one message)
0. SS2 T2 Geography header says SS3: confirm it is SS2 content with a typo.
1. SS3 policy: `ingestTopics.ts` treats SS 3 as audit-only. Keep that, or deliver SS3 as normal curriculum?
2. SS3 Third Term (empty archive), missing Technical Drawing / Catering Craft / SS3 T2 Food & Nutrition, and duplicated Literature and Book-keeping terms: supply the real files, or authorise clearly-labelled authored supplementary content from the national syllabus?

## Exact next action
1. Preserve both old and new source receipts. The 96/100 member match is established; four alternate versions remain pending owner decision and must not be silently substituted.
2. Once PR #794's schema workflow is on master, run its backend typecheck and Node tests; fix any failures before using the contract for further packages.
3. Continue Agricultural Science: inspect/recover the original figures; resolve the 5% composition, texture-classification and gypsum questions; reconcile every original assessment item; complete practical procedures and marking; then implement and test the class-safe loader/student route. Keep the package PENDING until every blocker is resolved.
4. Finish all SS2 Agricultural Science terms before moving to the next SS2 subject. After SS2, complete SS3 exam-preparation resources only (WAEC/NECO/JAMB), without a normal third term.

The reconciliation utility and its five focused unit tests are in branch `agent/ss2-ss3-readiness-source-receipt-20261113`. The test logic was executed in an isolated Python run (5/5 passed). The actual uploaded archives were also checked for class/term path classification (100/100 members; zero path errors). GitHub workflows triggered for PR #789 completed with failures in unrelated mobile TypeScript code: `mobile/src/screens/NotificationsScreen.tsx:35` passes a `size` prop not declared by `BtnProps`. Both the SS1 package integrity gate (run 43467409098) and JSS3 implementation checks (run 43467409239) stopped at the same typecheck error; their later checks were skipped. No mobile file was changed because it is outside SS2/SS3 scope. The dedicated SS23 workflow is introduced separately in PR #791 and is not yet available on master. Member-vs-register reconciliation remains pending.

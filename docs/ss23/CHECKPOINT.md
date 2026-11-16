# Authoritative live state — 2026-11-16

> **This section supersedes every historical live-update section below.** Older entries are retained as an audit trail; do not use their old branch names, PR states, counts or next-action claims as the current state.

## Repository and pull requests

- Current `master`: `70cd4a8cb1a5f7fcbd1a103e6812bbe96d4e711e` (includes PRs #857, #858, #859 and #860).
- PR #857 — SS2 Agricultural Science Terms 2 and 3 drafts: **merged**.
- PR #858 — Agricultural Science evidence register: **merged**.
- PR #859 — refreshed SS2/SS3 handoff and execution queue: **merged**.
- PR #860 — re-supplied source archives and exam-only SS3 scope: **merged** at the current master SHA above.
- PR #861 — temporary Agricultural Science audit-only PR: **closed unmerged**; its checkpoint work was consolidated into PR #862.
- PR #862 — source-verified Agricultural Science clarifications and checkpoint: **open, unmerged**. Head `e35e404203b5584ffbdfd00dbdd80fa6b29e0fee`. Relevant checks passed: SS23 package contract, SS23 integrity, SS2/SS3 source validation, SS1 integrity and JSS3 workflow.
- PR #863 — subject order, archive term gaps and this checkpoint correction: **open, unmerged**. Always recheck its live head and CI before relying on this snapshot.

No PR may be merged by an agent. Owner retains merge and release authority.

## SS2 Agricultural Science

### State on master

- 19 draft units: First Term 8, Second Term 6, Third Term 5.
- 195 practice/assessment items.
- 31 external factual references.
- 47 asset records.
- 53 open items: 46 delivery-blocking and 7 non-blocking.
- Coverage rows: 56 SUPPORTED, 25 PARTIAL, 5 UNRESOLVED, 4 MARKER.
- Package remains `PENDING`; every unit remains `DRAFT`. It is not student-deliverable.

### Additional draft state in unmerged PR #862

PR #862 adds 13 source-hashed external references and 13 supported coverage rows for T2 floriculture, crop-disease examples and safe pest-control/IPM guidance. On that branch:
- 44 external factual references.
- 103 coverage rows: 69 SUPPORTED, 25 PARTIAL, 5 UNRESOLVED, 4 MARKER.
- 53 open items remain: 46 delivery-blocking and 7 non-blocking.
- Package remains `PENDING`; all 19 units remain `DRAFT`.

The PR preserves the unresolved floriculture spelling `carnality`, the complete crop-disease table review, pest-species verification, source-assessment reconciliation and specialist approvals. The new external supplements do not certify the subject or close the readiness gate. Do not treat PR #862's branch state as merged master state.

**Do not advance to SS2 Biology until the Agricultural Science source, assessment and required teacher-approval gates are satisfied.**

## Registered source inventory and alphabetical SS2 queue

The 100-row source register contains 61 SS2 members across 21 subject labels and 39 SS3 members across 21 subject labels. The complete alphabetical SS2 subject order is:

Agricultural Science; Biology; Bookkeeping; Catering Craft; Chemistry; Civic Education; Commerce; Data Processing; Economics; English; Financial Accounting; Food & Nutrition; French; Further Mathematics; Geography; Government; Literature in English; Mathematics; Physics; Technical Drawing; Yoruba.

SS2 member gaps:
- Catering Craft: no First-Term or Third-Term member.
- Technical Drawing: no First-Term member.
- Food & Nutrition has a duplicate-looking T2 member; do not count it as additional content without header/body verification.

SS3 member gaps:
- No Third-Term source members in the received archive.
- First Term: no Catering Craft or Technical Drawing member.
- Second Term: no Food & Nutrition member.
- SS3 Literature in English T1 and T2 files are byte-identical; this does not establish distinct T2 content.

The register's `mapping_status` currently records 96 members as `FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER` and four duplicate-across-members records (two SS2, two SS3). Separately, the archive-to-register comparison reports 96 exact member matches out of 100 and four different-content versions pending owner version decisions. These are separate checks; do not conflate them. Preserve both versions of each disputed file.

## SS3 policy

SS3 is examination preparation ONLY (WAEC, NECO and JAMB): revision, verified past-question practice, mocks, marking, feedback and reassessment. Do not create or import new SS3 instructional-topic lessons. No Third-Term archive source was supplied.

## Next execution

1. Continue SS2 Agricultural Science from the live PR #862 branch and resolve every source-supported task that does not require owner/specialist authority.
2. Keep genuine source-version, content-approval, asset-rights and specialist decisions explicitly blocked; continue independent work.
3. After Agricultural Science passes its source, assessment and teacher-approval gates, proceed through the SS2 subject list alphabetically, one focused PR per subject.
4. Then complete SS3 examination preparation only.
5. Preserve fail-closed student delivery, answer-key protection, certified curriculum outside scope and all production/merge restrictions.


## Live execution update — 2026-11-16

### SS23-02 Agricultural Science (current branch state)

- PR [#857](https://github.com/PDS-David/sts-school-app/pull/857) remains open and unmerged. Branch `agent/ss23-agricultural-science-terms2-3-r2-20261116`; verified code head `1377fdaa116143fcf9add283bfb9580a22537d11`; base master `2b3ec92b99d016b450858cce5b87d5d6056d990b`.
- SS2 Agricultural Science now has 19 implemented draft units across T1/T2/T3 (8/6/5), 195 practice/assessment items, 45 newly authored/source-derived practice items, 22 added assessment answer guides and nine external factual references.
- Current-head GitHub Actions [run 43791853155](https://github.com/PDS-David/sts-school-app/actions/runs/43791853155) is GREEN: hash check, SS23 validation (zero errors), SS23 tests (39/39), package/student-delivery contract tests (37/37), SS2/SS3 source-map tests (11/11), SS1 validation and backend typecheck all passed.
- The package remains `PENDING`; all new lessons are `DRAFT`. Readiness reports T1/T2/T3 as `IN_PROGRESS`, with 14/9/7 unresolved coverage rows and 24 blocking open items per term. No teacher approval or owner acceptance has been granted. Do not release or merge.
- Earlier run 43791400716 failed 38/39 on a stale expected count after assessment expansion; corrected without weakening validation. The current-head run above passes.
- Exact next action: continue Agricultural Science source assessment reconciliation and remaining technical blockers. Do not advance to Biology until the full Agricultural Science readiness and approval gates pass.

## Live-state update — 2026-11-16

This section supersedes the historical branch/PR status in the checkpoint below. Historical source-receipt evidence is retained.

### Latest master state after delivery integration

- Current master: `2b3ec92b99d016b450858cce5b87d5d6056d990b`.
- PR #853 validator alignment merged (merge commit `1afbb5cafb7cbb770dfe90b9ac54f29dd3880eba`).
- PR #854 student-delivery service regression tests merged (merge commit `6a03ad0f9875a7c949cd8f6511571f797961fef0`).
- PR #855 PostgreSQL HTTP student-delivery regression merged (merge commit `326860f5464eaf8fbfa564c771a0402c69d5c9cd`).
- SS23-Q delivery and its service/HTTP regression coverage are now in master. The approved-fixture service test checks positive SS2 reachability and SS3 isolation; the HTTP integration test verifies pending SS23 content fails closed for real SS2/SS3 student tokens.
- The current task branch is rebased from this master; it does not depend on the older pre-merge validator base.

### SS23-02 — SS2 Agricultural Science Terms 2 and 3

- Branch: `agent/ss23-agricultural-science-terms2-3-r2-20261116`.
- PR: [#857](https://github.com/PDS-David/sts-school-app/pull/857), open, unmerged; head `6a653bff4c61fa1657cf5a7b7742a0b5ad7cf87a`.
- Base: `master` @ `2b3ec92b99d016b450858cce5b87d5d6056d990b`.
- Status: **11 new lessons implemented as drafts; source identities verified; pre-rebase tests passed; current-master PR CI pending; teacher approval and acceptance outstanding.**
- Package now contains 19 SS2 Agricultural Science units (8 T1, 6 T2, 5 T3), 195 practice/assessment items, 47 asset records and 57 open items (50 blocking, 7 non-blocking). Package and new unit approval states remain PENDING/DRAFT.
- Added 15 coverage rows and two original-source records for SS2 T2/T3. The two combined archive hashes match the November 13 source receipt; the extracted Agricultural Science T2/T3 members match their registered SHA-256 values and byte counts.
- Original T3 printed pages 12-16 were visually reviewed. Page 12 fertilizer/maize yield values were independently recalculated; page 13 confirms the Week 7-8 Farm Records heading; pages 14-15 show an egg-sales label discrepancy in the profit-and-loss example; page 16 confirms the straight-line depreciation formula.
- Source/content blockers remain explicit: disease taxonomy, ornamental and weed nomenclature, obsolete pesticide guidance, insecticide classification, Mendelian-law nuance, account-table transcription, animal nutrient classification, feed thresholds, full assessment-answer reconciliation and teacher review.
- Latest assessment verification [run 43791593121](https://github.com/PDS-David/sts-school-app/actions/runs/43791593121): locked install passed; hash check passed; `npm run validate:ss23` passed with zero errors; `npm run test:ss23` passed 39/39; package/schema/student-delivery contract tests passed 37/37; source-map tests passed 11/11; `npm run validate:ss1` and backend typecheck passed. All nine external factual summaries and the 22 additional assessment answer guides passed package schema/integrity tests.
- Current-master checks on commit `3abe0e06bb90ecb7003c07154528f2fbb11f9684`: SS23 integrity gate `43790632810` SUCCESS (38/38 SS23 tests, hash check, package validation, backend typecheck, SS1 validation); package-contract `43790632965` SUCCESS (25/25, including all 19 approved-fixture SS2 units reachable and SS3 isolation); SS2/SS3 source validation `43790632910` SUCCESS (11 tests); SS1 integrity gate `43790632799` SUCCESS. JSS3 workflow `43790632575` was still running and is unrelated.
- Exact next action: continue the Agricultural Science technical and assessment-answer blockers. Do not move to Biology until all Agricultural Science terms pass source, assessment and teacher-approval gates. Do not merge.



### Current master and merged work

- Current master baseline before PRs #853-855 merged: `28c0f808565aae243b113ab5b0c261d9d34a90d5`; current master after those merges: `2b3ec92b99d016b450858cce5b87d5d6056d990b`.
- PR #791 Agricultural Science source map merged: `8176e6e27b8ea30261d9464c89748f0c5a09845c`.
- PR #794 SS2/SS3 unit package contract merged: `53ceca40c70c1ea8634cfbffe86fe12bdf9ba884`.
- PR #819 Agricultural Science package, loader and gated SS2/SS3 student delivery merged: `d341acf855c9eb240e51991aa9e6eaa62fe0efe5`.
- PR #846 source registry, validator and integrity workflow merged: `02081f769999d1d6be33b97be5b11f6d7a8d86d1`.
- SS3 scope is owner-authorized exam preparation only (WAEC/NECO/JAMB), not normal instructional progression. This is stated in the owner-supplied `STS_School_Completion_Plan_and_Required_Files.docx` and enforced by merged PR #794; substantive teaching ends by SS2. No SS3 audit-only vs normal-curriculum decision is outstanding.

### Current curriculum status

- SS2 Agricultural Science has one root-level package with 19 units across First, Second and Third Terms (8/6/5), 173 practice/assessment items, 47 asset records (42 pending source-extract references and 5 stored SVGs), and 53 open items (46 delivery-blocking, 7 non-blocking). Package and unit approvals remain PENDING. This is not student-release readiness.
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

## SS23-Q-HTTP-01 — 2026-11-16

- Status: **PR OPEN (#855); POSTGRESQL HTTP REGRESSION AND SS23 INTEGRITY GATE GREEN.**
- Base: `master`.
- Changed files:
  - `tests/backend-ss23-student-delivery.integration.test.mts` — PostgreSQL-backed HTTP regression for SS2 and SS3 student contexts; checks class-specific list endpoints, cross-mode requests, every pending unit ID and a pending asset return no student content.
  - `.github/workflows/backend-learning-content-reference-scope.yml` — reuses the existing PostgreSQL 16 integration job, adds the SS23 route test path and command, and pins Node 24.19.0. A separate workflow draft was deleted to avoid adding a workflow that would not run until merged.
- Commits:
  - HTTP regression test: `c4df0e5db9167886416c63507eb95d661a2c0dfa`
  - Initial standalone workflow (removed in favour of existing PostgreSQL job): `75784d9fdb318fdf963268a0fa2ac893052e83ee`; deletion: `a2c7f52b3df07ed2b4f53360dea3eddb0edd1a75`
  - Existing PostgreSQL workflow extension: `a0345fff0aa84132cf65cdef686477d2686717b5`
  - Failure-safe fixture cleanup: `e3994e60f1e9a949dfee2875591ff2fe193ef1c7`
  - Identifier-length correction: `ff436df80265cc56e02296a4f426d5a1aa37c27c`
- PR: [#855](https://github.com/PDS-David/sts-school-app/pull/855), base `master`, head branch `agent/ss23-route-delivery-integration-20261116`, current checkpoint head `c879d1898cc188ff55b034ec0af6f17252b19174`.
- Test results:
  - Local execution: NOT RUN (GitHub DNS unavailable in this execution environment).
  - PostgreSQL HTTP integration run `43788785465`: SUCCESS on commit `ff436df80265cc56e02296a4f426d5a1aa37c27c`; dependency install, PostgreSQL bootstrap, both HTTP integration test files and backend typecheck passed on Node 24.19.0.
  - SS23 integrity gate `43788785535`: SUCCESS on the same commit; backend typecheck, hash check, package validation, validator tests and SS1 validation passed.
  - SS2/SS3 source validation `43788785431`: SUCCESS; SS1 integrity gate `43788785415`: SUCCESS.
  - Positive reachability of all eight approved-fixture units and no-draft leakage at the delivery-service layer is covered by stacked PR #854 (70/70 tests passed on its tested code commit).
- Superseded standalone workflow draft run `43788699166` failed before creating a job; its workflow file was deleted. The active existing PostgreSQL workflow run `43788785465` passed.
- Exact next action: retain route-level HTTP integration as verified; no merge or deployment. Continue SS2 Agricultural Science T2/T3 when the original source archives and outstanding source decisions are available.


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

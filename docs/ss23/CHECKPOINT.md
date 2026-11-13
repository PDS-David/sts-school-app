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
| SS23-AGRIC-SOURCE-MAP | PR OPEN (#791) | `docs/ss23/subjects/agricultural-science/SOURCE_MAP.json`, subject checkpoint, source-map tests, SS23 test workflow | Latest branch commit `8eea8d823ac2f980e895050ae68195cbce205741`; 5 source documents mapped; T1 Agriculture source ID corrected against the 100-row register; manifest and consistency assertions passed | Complete actual SS2 Agriculture lessons and student delivery; SS3 exam-prep gaps remain open |
| SS23-01 | PR OPEN (#794) | SS23 Zod package schema, 10 contract tests, package validation workflow, checkpoint | Branch `agent/ss23-package-contract-20261113`; enforces SS2 instructional vs SS3 exam-prep, provenance, hashes, answers and marking. CI not yet run because workflow is new to master. | Run backend typecheck and schema tests once workflow is on default branch; implement loader and student delivery |
| SS23-AGRIC-SS2-T1-SOIL | PR OPEN (#800; stacked on #794) | `backend/src/db/ss23/subjects/agricultural-science.json`, integration test, subject checkpoint | Two source-based lesson drafts; 10 questions with answers/explanations/marking; 4 external references; 7 blockers; package remains PENDING. JSON and structural checks passed. | Inspect original figures, resolve composition/texture/gypsum issues, reconcile all source assessments, implement loader and student access |
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

## Exact next action
1. Preserve both old and new source receipts. The 96/100 member match is established; four alternate versions remain pending owner decision and must not be silently substituted.
2. Once PR #794's schema workflow is on master, run its backend typecheck and Node tests; fix any failures before using the contract for further packages.
3. Continue Agricultural Science: inspect/recover the original figures; resolve the 5% composition, texture-classification and gypsum questions; reconcile every original assessment item; complete practical procedures and marking; then implement and test the class-safe loader/student route. Keep the package PENDING until every blocker is resolved.
4. Finish all SS2 Agricultural Science terms before moving to the next SS2 subject. After SS2, complete SS3 exam-preparation resources only (WAEC/NECO/JAMB), without a normal third term.

The reconciliation utility and its five focused unit tests are in branch `agent/ss2-ss3-readiness-source-receipt-20261113`. The test logic was executed in an isolated Python run (5/5 passed). The actual uploaded archives were also checked for class/term path classification (100/100 members; zero path errors). GitHub workflows triggered for PR #789 completed with failures in unrelated mobile TypeScript code: `mobile/src/screens/NotificationsScreen.tsx:35` passes a `size` prop not declared by `BtnProps`. Both the SS1 package integrity gate (run 43467409098) and JSS3 implementation checks (run 43467409239) stopped at the same typecheck error; their later checks were skipped. No mobile file was changed because it is outside SS2/SS3 scope. The dedicated SS23 workflow is introduced separately in PR #791 and is not yet available on master. Member-vs-register reconciliation remains pending.

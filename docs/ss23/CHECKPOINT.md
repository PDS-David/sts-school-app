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
| SS23-S0 | TOOL IMPLEMENTED; MEMBER RECONCILIATION PENDING | `docs/ss23/sources/RECEIPT_20261113.md`, `scripts/ss23/reconcile_received_archives.py`, `tests/test_ss23_source_reconciliation.py`, source README | Archive structure parsed: 61 SS2 + 39 SS3; all 100 members classified into expected term folders with no path errors. Utility and 5 focused tests committed by `c3fa10e85c7f33a7ab3f9fad8380d1829e8527fd`; isolated Python test execution: 5/5 passed | Run utility against both attached ZIPs and authoritative CSV; then resolve any mismatches |
| SS23-01 | PENDING | Package contract / validator / tests | Existing SS1 schema is SS1-only; SS3 ingestion exclusion confirmed | Design SS2 instructional and SS3 exam-prep contracts without weakening SS1 validation |
| SS23-02 onward | PENDING | One subject package and focused tests per PR | No SS2/SS3 subject package is currently certified | Work SS2 alphabetical, then SS3 exam-prep subjects; source headers, week coverage, lesson depth, assessments, answers, explanations, marking and student delivery |

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
1. Run `scripts/ss23/reconcile_received_archives.py` against the two re-supplied ZIPs and `SOURCE_ASSIGNMENTS.csv`; preserve both old archive receipt and new archive receipt.
2. Begin SS2 Agricultural Science source-header and week/topic verification (T1–T3) as the first alphabetical subject task. Do not author lessons until the actual source topics and structure are extracted and mapped.
3. In parallel, design SS23-01 contract boundaries: SS2 instructional terms vs SS3 exam-preparation resources, with explicit provenance and separate student-delivery tests.

The reconciliation utility and its five focused unit tests are in branch `agent/ss2-ss3-readiness-source-receipt-20261113`. The test logic was executed in an isolated Python run (5/5 passed). The actual uploaded archives were also checked for class/term path classification (100/100 members; zero path errors). Full repository test workflows and member-vs-register reconciliation have not yet run.

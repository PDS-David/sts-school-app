# SS1 independent QA snapshot — 14 November 2026

Repository: `PDS-David/sts-school-app`  
Integration base reviewed: `849462bfa6c7fa0871a75d1f6bff08acae338f21` (merge of PR #832)  
Scope: live microtask queues for all 21 SS1 subjects, selected package metadata, queue protocol, and the latest available SS1 CI evidence. This is a QA snapshot, not final acceptance.

## Executive result

- 21 subject queues and 2,315 task records were read from the integration branch.
- Status totals: **1,593 IMPLEMENTED_TESTING_DEFERRED; 570 PENDING; 92 BLOCKED; 56 VERIFIED; 4 IN_PROGRESS**.
- No task in IMPLEMENTED_TESTING_DEFERRED is counted as tested, teacher-approved or accepted by this report.
- No full source archive/member re-hash or student-device test was performed in this QA pass.
- Owner instructions defer manual suites, typechecks, importer/database rehearsals and device checks until source implementation is complete. Those checks are therefore **NOT RUN**, not passed.

## Live subject queue totals

| Subject | Tasks | Implemented — testing deferred | Pending | Blocked | Verified | In progress |
|---|---:|---:|---:|---:|---:|---:|
| Agricultural Science | 169 | 168 | 0 | 0 | 1 | 0 |
| Biology | 168 | 168 | 0 | 0 | 0 | 0 |
| Bookkeeping | 107 | 107 | 0 | 0 | 0 | 0 |
| Catering Craft | 97 | 97 | 0 | 0 | 0 | 0 |
| Chemistry | 123 | 30 | 92 | 1 | 0 | 0 |
| Civic Education | 55 | 54 | 0 | 1 | 0 | 0 |
| Commerce | 73 | 15 | 54 | 4 | 0 | 0 |
| Data Processing | 83 | 14 | 65 | 4 | 0 | 0 |
| Economics | 95 | 13 | 79 | 3 | 0 | 0 |
| English | 242 | 242 | 0 | 0 | 0 | 0 |
| Financial Accounting | 74 | 12 | 58 | 3 | 0 | 1 |
| Food and Nutrition | 68 | 10 | 55 | 2 | 0 | 1 |
| French | 122 | 112 | 4 | 6 | 0 | 0 |
| Further Mathematics | 115 | 108 | 0 | 7 | 0 | 0 |
| Geography | 51 | 9 | 39 | 2 | 0 | 1 |
| Government | 78 | 77 | 0 | 1 | 0 | 0 |
| Literature | 70 | 14 | 0 | 1 | 55 | 0 |
| Mathematics | 102 | 61 | 33 | 8 | 0 | 0 |
| Physics | 100 | 82 | 11 | 7 | 0 | 0 |
| Technical Drawing | 158 | 155 | 0 | 2 | 0 | 1 |
| Yoruba | 165 | 45 | 80 | 40 | 0 | 0 |
| **TOTAL** | **2,315** | **1,593** | **570** | **92** | **56** | **4** |

## Defects and risks

### QA-SS1-001 — stale `next_runnable` entries
**Severity: P2 — workflow/governance defect**

The queue generator in `scripts/ss1/refresh_next_tasks.py` defines runnable tasks as `PENDING` items whose dependencies are `IMPLEMENTED_TESTING_DEFERRED`. However, the live `next_runnable` arrays include tasks whose current status is not PENDING. Directly checked examples:

- Chemistry: `CHEM-CMP-T1` and `CHEM-TEST-PACKAGE` are both `IMPLEMENTED_TESTING_DEFERRED`, yet appear before pending items in `next_runnable`.
- Further Mathematics: the first five advertised items are `IMPLEMENTED_TESTING_DEFERRED`; the queue has no PENDING items.
- Government: the first five advertised corrected-week lesson items are `IMPLEMENTED_TESTING_DEFERRED`; the queue has no PENDING items.
- Literature: the first five advertised week-indexing items are `VERIFIED`; the queue has no PENDING items.
- Physics: `PHYS-WK-T3-W03` is `IMPLEMENTED_TESTING_DEFERRED` but appears first in `next_runnable`.
- Technical Drawing: the first five advertised answer-key/asset items are `IMPLEMENTED_TESTING_DEFERRED`; the queue has no PENDING items.

Required correction: regenerate each affected queue's `next_runnable` from the current item statuses and dependencies using the repository generator; preserve all task records and statuses. Then review the generated assignment index. Do not mark any task complete as part of this correction.

### QA-SS1-002 — non-contract `IN_PROGRESS` queue states
**Severity: P2 — task governance defect**

The protocol explicitly says not to use `IN_PROGRESS` in a queue; the claim/branch is the in-progress marker. Four current queue records violate that rule:

- Financial Accounting: `FA-WK-T1-W02` — waits for the registered-subject compiler workflow to pass.
- Food and Nutrition: `FN-WK-T1-W03` — waits for exact compiler row identity to be confirmed after the failed PR compiler run.
- Geography: `GEO-PRE-T1` — waits for a fresh clean compiler run after repeated coverage-target errors.
- Technical Drawing: `TD-SCOPE-AUTHORING-FINISH` — umbrella task remains open while child lessons/assets/source anomalies and later verification are outstanding.

Required correction: retain the implementation evidence and exact blockers, but move these records to the protocol-supported state that matches the actual evidence (normally PENDING if work remains, or BLOCKED only when an external gate genuinely prevents progress). Do not erase or downgrade the evidence.

### QA-SS1-003 — implementation counts are not student-readiness counts
**Severity: P1 — acceptance risk**

The largest queues remain materially incomplete: Chemistry (92 pending), Yoruba (80 pending and 40 blocked), Economics (79 pending), Data Processing (65 pending), Financial Accounting (58 pending), Food and Nutrition (55 pending), Commerce (54 pending), Geography (39 pending), Mathematics (33 pending), and Physics (11 pending). In addition, zero pending items in a queue does not prove subject acceptance: Biology, Bookkeeping, Catering Craft, English, Government and other queues still carry testing/approval/acceptance gates outside the queue's pending count.

Required correction: complete each remaining eligible task in its exclusive subject workstream; reconcile every blocked item against its exact owner/source/permission/rights/notation decision; then run the separately authorised final verification and student-delivery checks.

### QA-SS1-004 — final student-delivery verification remains outstanding
**Severity: P1 — acceptance risk**

The repository's integration and later-verification instructions require actual app/runtime delivery, source-scoped loading, lesson and assessment rendering, asset delivery, answer-key isolation, and later DB/staging/device checks. The queue snapshot and the current PR checks do not establish those end-to-end properties. No such tests were run in this QA pass because the owner explicitly deferred them until source-code implementation is complete.

Required correction: finish source implementation first; then execute SS1-08 integration and SS1-09 later verification/release under the owner-authorised gate. Record exact commands, outputs and environment limitations. Do not deploy or mark accepted without the separate release decision.

## CI evidence checked

PR #832 (`docs(yoruba): index third-term scheme preamble`) is merged at commit `849462bfa6c7fa0871a75d1f6bff08acae338f21`.

- SS1 package integrity gate, run 43534159834: **SUCCESS**.
- SS1 cross-subject package audit, run 43534159714: **SUCCESS**.
- The cross-subject job completed the all-registered-subject source-anchor/compiler step successfully.
- These are CI results for the PR commit. They do not replace the deferred final suites, source-member re-hash, app delivery, database or device verification.

## Test and evidence disposition

| Check | Result | Reason |
|---|---|---|
| Live queue JSON parsing and per-subject status aggregation | PASS (read-only QA inspection) | 21 queue files parsed; 2,315 task records counted |
| `next_runnable` consistency spot-check | FAIL | Stale/non-PENDING task IDs found in six subject queues |
| Queue status vocabulary spot-check | FAIL | Four records use `IN_PROGRESS` |
| PR #832 package integrity gate | PASS | GitHub Actions run 43534159834 |
| PR #832 cross-subject package audit/compiler | PASS | GitHub Actions run 43534159714 |
| Full `npm run validate:ss1` on the current master tree | NOT RUN | No local repository checkout/runtime in this QA session; owner defers manual validation until source implementation is complete |
| Subject test suites/typechecks/importer/database/device tests | NOT RUN | Explicit owner deferral |
| Full 61-member archive and source-member re-hash | NOT RUN in this QA pass | No archive bytes were opened in this QA session |
| Student-facing app end-to-end verification | NOT RUN | SS1-08/SS1-09 gates remain |

## Acceptance recommendation

**NOT READY FOR FINAL ACCEPTANCE.** Continue source implementation and correct the queue metadata defects. Keep all approval, verification and release gates honest. The successful PR #832 integrity/compiler checks are positive but narrow evidence; they do not make the full SS1 curriculum student-ready.

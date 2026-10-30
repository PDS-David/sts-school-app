# Remaining work — prompt pack (30 October 2026)

This pack turns the system reference (`STS_School_App_System_Reference.docx`, SHA-256 `dfcfac5d26193dd95a8e31cf9bac893ac4d2a05d4eed310ff360aa033e9c5ace`, written against commit `2392713`) into one bounded, copy-pasteable prompt per remaining task.

It is **not** an approval, a test result, a queue status change, or a claim that anything here works. Every prompt keeps the owner's standing rule: testing deferred, no merge, scoped PR.

## Snapshot this pack was built from

| Fact | Value |
|---|---|
| Base | `origin/master` `8ffcd12` (merge of PR #256), 2026-10-30 |
| SS1 queues (21 subjects) | 1,225 items: 246 `IMPLEMENTED_TESTING_DEFERRED`, 909 `PENDING`, 70 `BLOCKED` |
| SS1 packages | 21 strict `ss1-subject-v1` packages; only English, French, Further Mathematics, Mathematics, Technical Drawing, Literature, Physics, Yoruba and Catering Craft carry coverage or lessons |
| App tests | 55 root JS/TS test files + 3 SS1 package tests + 7 Python tooling tests; no `test`/`typecheck` npm script; one CI workflow (`jss3-assets.yml`) that never runs 17 of the `.mts` suites and never deploys |
| Schema | `backend/schema.sql` replayed by `migrate.ts`; no ledger, no RLS, no transaction in any route |

Counts are implementation counts. They are not content completeness, curriculum approval or test evidence.

## How to use

1. Read `PROTOCOL.md` once. It overrides every prompt on safety.
2. Pick a task. Copy its prompt (the whole file) to the worker, attach nothing unless the prompt says so.
3. Run at most one worker per file set. Parallelism is safe only across disjoint write sets (table below).
4. The worker stops after one task, opens a PR to `master`, and does not merge.

`CUR-01` is the only curriculum prompt that fans out to many tasks; it delegates per-task detail to the live `docs/ss1/work/microtasks/<subject>/NEXT_TASK.md`, which is regenerated from the queues. Do not fork that generator's output into static prompts.

## Task list

### Curriculum (4)

| ID | Task | Gated by |
|---|---|---|
| [CUR-01](curriculum/CUR-01-queue-runner.md) | Drain the 21 SS1 queues, one task per PR, subject by subject | none |
| [CUR-02](curriculum/CUR-02-lesson-authoring.md) | Author the SS1 `LESSON` items (55 pending) with body, practice, provenance | source documents |
| [CUR-03](curriculum/CUR-03-visual-assets.md) | Dispose of SS1 `VISUAL_DISPOSITION` items with bytes, hashes, alt text, attribution | source documents |
| [CUR-04](curriculum/CUR-04-package-validator.md) | Add a static SS1 package validator CLI and use it before every package PR | none |

### Authorization and data exposure (5)

| ID | Task | Gated by |
|---|---|---|
| [SEC-01](app/SEC-01-report-scope.md) | Close `finance_admin` fall-through and teacher class-scope gap on score reports | none |
| [SEC-02](app/SEC-02-messages-contacts.md) | Fail-closed message contacts for `finance_admin`; decide its Chats tab | decision D2 |
| [SEC-03](app/SEC-03-promotion-scope.md) | Require teacher-school equality on promotion/demotion/retention | none |
| [SEC-04](app/SEC-04-parent-notifications.md) | Fix parent notification requesting an assessment list it cannot read | decision D3 |
| [SEC-05](app/SEC-05-admin-null-fields.md) | Stop writing empty strings for `school_code`/`assigned_class` on admin accounts | none |

### Assessment behaviour (4)

| ID | Task | Gated by |
|---|---|---|
| [ASM-01](app/ASM-01-essay-finality.md) | Make aggregate and per-answer essay marks tell the same truth | decision D1 |
| [ASM-02](app/ASM-02-retake-policy.md) | Let a failed single-submission assessment be retaken without breaking uniqueness | decision D4 |
| [ASM-03](app/ASM-03-assessment-transactions.md) | Make assessment creation, generation and submission atomic | none |
| [ASM-04](app/ASM-04-marking-backlog.md) | Distinguish graded from ungraded essay answers for admin review | none |

### Data integrity (4)

| ID | Task | Gated by |
|---|---|---|
| [DATA-01](app/DATA-01-finance-transaction.md) | Make invoice header + lines one transaction | none |
| [DATA-02](app/DATA-02-offline-idempotency.md) | Make offline-replayed writes exactly-once | none |
| [DATA-03](app/DATA-03-class-history.md) | Preserve the class used for historical reports instead of today's `class_name` | decision D5 |
| [DATA-04](app/DATA-04-push-receipts.md) | Add a durable push delivery/receipt ledger | none |

### Operations (5)

| ID | Task | Gated by |
|---|---|---|
| [OPS-01](ops/OPS-01-migration-ledger.md) | Replace schema replay with numbered migrations plus a ledger (keep fresh-install path) | none — **run first** |
| [OPS-02](ops/OPS-02-tls-verification.md) | Stop disabling certificate validation on the production database connection | none |
| [OPS-03](ops/OPS-03-rls-decision.md) | Decide and document row-level security posture; implement if chosen | decision D6 |
| [OPS-04](ops/OPS-04-erasure-retention.md) | Define and implement student-data erasure/retention workflow | decision D7 |
| [OPS-05](ops/OPS-05-drift-backup.md) | Run drift check, rehearsal and backup/restore plan | owner credentials — execution gated |

### Product gaps (2)

| ID | Task | Gated by |
|---|---|---|
| [PRD-01](app/PRD-01-announcements.md) | Add announcements (endpoint, table, mobile surface) | decision D8 |
| [PRD-02](app/PRD-02-placeholders.md) | Replace the six "Coming soon" placeholders or remove them | decision D9 |

### Verification and release (4)

| ID | Task | Gated by |
|---|---|---|
| [VER-01](verify/VER-01-test-harness.md) | Add repeatable test/typecheck npm scripts and a single runner | none |
| [VER-02](verify/VER-02-ci-coverage.md) | Extend CI to the 17 `.mts` suites it never runs | none |
| [VER-03](verify/VER-03-curriculum-acceptance.md) | Run SS1 + JSS3 acceptance when testing resumes | owner re-enables testing |
| [VER-04](verify/VER-04-device-release.md) | Device acceptance and production release | owner credentials, device, approval |

### JSS3 (2)

| ID | Task | Gated by |
|---|---|---|
| [JSS3-01](jss3/JSS3-01-external-evidence.md) | Resolve C01/E01–E05 (Ọya passage, exact-source intent, licensed distribution) | owner/scholar evidence |
| [JSS3-02](jss3/JSS3-02-release.md) | R01 release plan and designated-target rehearsal | owner approval |

## Collision table (never run two of these at once)

| File | Tasks that write it |
|---|---|
| `backend/src/index.ts` | DATA-02, OPS-01 (mount order only) |
| `backend/src/routes/learning.ts` | ASM-01, ASM-02, ASM-03, ASM-04 |
| `backend/schema.sql` | OPS-01 first, then DATA-03, DATA-04, PRD-01, OPS-03, OPS-04, ASM-02 (attempt table) |
| `backend/src/db/migrate.ts` | OPS-01 only |
| `backend/src/db/pool.ts` | OPS-02 only |
| `backend/src/routes/scores.ts` | SEC-01, DATA-03 |
| `backend/src/routes/messages.ts` | SEC-02, DATA-02 (dedupe hook) |
| `backend/src/utils/scope.ts` | SEC-02 only |
| `backend/src/routes/students.ts` | SEC-03 only |
| `backend/src/routes/admin.ts` | SEC-05 only |
| `backend/src/routes/finance.ts` | DATA-01 only |
| `mobile/src/screens/AdminUsersScreen.tsx` | SEC-05 only |
| `mobile/src/components/NotificationsContext.tsx` | SEC-04 only |
| `mobile/src/api/client.ts`, `offline/*` | DATA-02 only |
| `mobile/src/navigation/FinanceAdminTabs.tsx` | SEC-02 only |

`OPS-01` must merge before any other schema-writing task, or that task must also add its migration by hand in the same style.

## Owner decisions

| ID | Question | Recommended default | Blocks |
|---|---|---|---|
| D1 | May a student see an AI essay mark before an admin confirms it? | No — hide in both aggregate and detail until `teacher_reviewed`; show "pending review" | ASM-01 |
| D2 | Should Finance Admin have Chats? | No — remove the tab and reject the role in `getMessageableUsers` | SEC-02 |
| D3 | Should parents receive assessment-open notifications? | Not until a ward-scoped endpoint exists; stop requesting for parents | SEC-04 |
| D4 | Retake policy after a failed single submission | 3 attempts per assessment, best score kept, teacher/admin see attempts | ASM-02 |
| D5 | Preserve class-at-time for reports? | Yes — snapshot class on score/attendance rows; new table only if history must predate | DATA-03 |
| D6 | Database RLS? | Document app-only scope now; RLS only if the DB is ever exposed beyond the API | OPS-03 |
| D7 | Erasure on request | Soft-delete + field redaction + retained aggregate history, with an admin-only workflow | OPS-04 |
| D8 | Announcements feature | Build read-only announcements (admin writes, role/class targeted, no push) | PRD-01 |
| D9 | The six placeholders | Remove parent/student/teacher entries from navigation until built; don't ship "Coming soon" | PRD-02 |

## Already implemented — do not assign

Verified present in code; do not "fix" these again:

- Role navigation, activation codes, self-registration, self-claim, password recovery lockouts.
- Class locks and `checkTeacherStudentScope` for **writes**; attendance class-records and weekly-feedback reads are already ownership-checked.
- Assessment question access (`/assessments/:id/questions`) and submission answers are already role/ward scoped.
- Offline cache (500 entries), synthetic 202 queueing, serial flush, 4xx drop.
- Term PIN, progression, completion gateway, JSS3 correction registries.
- Finance: fee-item/term/school validation, `finance_admin`-only writes, admin/teacher block.
- Reports, Excel export, PDF, push tokens, topic assets with hashes and attribution.
- SS1 compiler/loader/schema, source registry, 21 packages, queue generator.

## SS1 curriculum state (21 queues, 2026-10-30)

| Subject | Items | Impl | Pending | Blocked | First eligible |
|---|---:|---:|---:|---:|---|
| agricultural-science | 38 | 5 | 32 | 1 | AG-INV-T3 |
| biology | 57 | 5 | 51 | 1 | BIO-INV-T3 |
| bookkeeping | 34 | 5 | 28 | 1 | BK-INV-T3 |
| catering-craft | 53 | 5 | 47 | 1 | CC-TEST-PACKAGE |
| chemistry | 58 | 6 | 51 | 1 | CHEM-INV-T2 |
| civic-education | 41 | 5 | 35 | 1 | CIV-INV-T3 |
| commerce | 41 | 5 | 35 | 1 | COM-INV-T3 |
| data-processing | 45 | 5 | 39 | 1 | DP-INV-T3 |
| economics | 51 | 5 | 45 | 1 | ECON-INV-T3 |
| english | 106 | 25 | 77 | 4 | ENG-WK-T1-W04 |
| financial-accounting | 46 | 5 | 40 | 1 | FA-INV-T3 |
| food-and-nutrition | 45 | 5 | 39 | 1 | FN-INV-T3 |
| french | 115 | 63 | 48 | 4 | FR-WK-T1-W05 |
| further-mathematics | 86 | 22 | 57 | 7 | FM-WK-T1-W02 |
| geography | 32 | 5 | 26 | 1 | GEO-INV-T3 |
| government | 22 | 4 | 17 | 1 | GOV-INV-T2 |
| literature | 31 | 6 | 24 | 1 | LIT-INV-T3 |
| mathematics | 95 | 21 | 65 | 9 | MATH-PRE-T3 |
| physics | 66 | 5 | 54 | 7 | PHYS-PRE-T3 |
| technical-drawing | 39 | 5 | 29 | 5 | TD-SCH-W04 |
| yoruba | 124 | 34 | 70 | 20 | YO-WK-T3-W02 |
| **Total** | **1,225** | **246** | **909** | **70** | |

A finished inventory is not a finished lesson, and a merged indexing PR is not complete curriculum. `CUR-02` is where coverage becomes teaching.

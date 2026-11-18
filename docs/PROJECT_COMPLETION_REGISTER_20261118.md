# STS School Application — Consolidated Completion Register

**Snapshot:** 18 November 2026, 18:55 UTC  
**Repository:** [PDS-David/sts-school-app](https://github.com/PDS-David/sts-school-app)  
**Branch:** `master`  
**Inspected commit:** `aae0b0b2f3908ba800abade0dde217840a6beb5b`  
**Purpose:** A point-in-time, evidence-linked register. A file existing, a schema passing, or a CI workflow passing does not by itself mean a feature is production-ready or accepted by the school.

## Status definitions

- **GREEN — implemented and specifically verified:** code and a named test, workflow, or live acceptance evidence support the claim.
- **AMBER — implemented / partial; acceptance outstanding:** meaningful implementation exists, but coverage, source approval, end-to-end, production, device, or owner acceptance is incomplete.
- **RED — missing or materially blocked:** the required capability or content is not present/usable to the required standard.
- **GREY — not audited / evidence unavailable:** do not assume either complete or missing.

Keep these states separate: **implemented ≠ tested ≠ approved ≠ deployed ≠ accepted**.

## 1. Executive snapshot

| Area | Status | Repository-backed finding |
|---|---|---|
| Production backend and database | AMBER | Canonical Render `sts-school-app` is live on this inspected master commit; `sts-school-db-2` is available with 11 recorded migrations. Public HTTP/authenticated smoke tests remain unverified; the Free database expires 12 December 2026. |
| Physical school reports | AMBER | Report/attendance/score code and scoped tests exist, and the 104-student physical roster is imported. Live production currently has 0 teacher users, 0 teacher-subject assignments, 0 scores and 0 attendance rows; teacher entry and report delivery therefore remain unaccepted end-to-end. |
| Online learning and AI assessments | AMBER / RED | Curriculum delivery, topic progression and assessment/submission structures exist. The question bank was observed empty in the previous live DB check; complete AI marking and remediation are not certified end-to-end. |
| Curriculum | AMBER | 21 SS1 subject package files exist; SS2 has seven package files; SS3 has two exam-preparation package files. Schema/integrity workflows pass, but package presence is not lesson/source/rights/approval acceptance. Primary and JSS require class-by-class evidence closeout. |
| Student, parent, teacher, admin | AMBER | Student, parent, teacher and admin code-path audits are substantially/fully closed in `APP_WIDE_AUDIT.md`; production currently has 0 teacher users and 0 teacher-subject assignments. Finance_admin and pre-login onboarding still need separate acceptance. |
| Mobile release | AMBER | Expo mobile application and Android readiness/release workflows exist; real-device, production API, offline/recovery and release acceptance must be evidenced. |
| Operational controls | AMBER | Migration, backup, security, roster-import and dependency workflows exist; restore drills, operational monitoring and full rollout sign-off remain explicit gates. |

### Latest CI evidence at the inspected commit

At the previous application commit `d33f973` (before the current documentation-only commit), the latest runs for these five named workflows were successful:

- SS1 package integrity gate
- SS23 package integrity gate
- JSS3 implementation and asset checks
- Backend score subject scope and batch atomicity
- Backend physical report-roster isolation

The application and live database were inspected at application commit `aae0b0b`; this register refresh is committed separately. No open PRs were found at that inspection. This is not a claim that every workflow in the repository is green; older commits show canceled runs when newer commits superseded them.

## 2. Application modules

| Module / workflow | Status | Evidence and remaining acceptance |
|---|---|---|
| Login, authentication, activation, password reset | AMBER | `backend/src/routes/auth.ts`; activation, self-registration, student self-claim, forced password change and security-question flows exist. Complete fresh-account, locked-account, expiry and recovery acceptance for every role. |
| Role routing and RBAC | GREEN / AMBER | `mobile/src/navigation/RootNavigator.tsx`, role tab navigators and backend permission middleware exist. Student/parent/teacher/admin audits are documented; finance_admin still needs a dedicated role audit and live acceptance. |
| Student profiles and roster | GREEN / AMBER | Live production contains 104 students, 104 active physical report-roster memberships and 104 append-only membership events. All ten workbook class totals match. Parent links, duplicate edge cases and teacher promote/demote acceptance remain to be tested. |
| Parent accounts and wards | GREEN / AMBER | Parent role audit closed in `APP_WIDE_AUDIT.md`; cross-campus parent provisioning fix documented. Complete real multi-ward and cross-school family acceptance. |
| Teacher accounts and assignments | AMBER | Teacher role, class/subject scope and school-scoped username code exist; production currently contains 0 teacher users and 0 teacher-subject assignments. Create/verify real teacher accounts and allocations before live report acceptance. |
| Admin and school setup | GREEN / AMBER | Admin role audit closed; user management, term PINs, class codes, audit log and Excel export are traced. Follow up the flagged NULL-vs-empty school_code edit path and validate school setup on production. |
| Finance admin / fees / invoices | GREY / AMBER | Finance routes, finance screens, invoices and fee-item tables exist. Finance_admin was explicitly outside the prior admin-role audit; verify permissions, invoice lifecycle, payment reconciliation, balances, exports and live data. |
| Classes, subjects, terms and class locks | AMBER | `academic.ts`, AcademicMgmt screens and seed definitions exist. Confirm class-by-class subject eligibility, term transitions, locks and school isolation against the school's approved structure. |
| Attendance (physical school) | GREEN / AMBER | Attendance route/screen and teacher permission tests exist; teachers cannot edit admin-only remarks. Complete live attendance entry, correction, days-opened calculation and report rendering acceptance. |
| Scores and school report cards | GREEN / AMBER | Score entry, class/subject scope, report roster and report routes exist; latest scope/atomicity workflows passed. Complete full report-card calculation, PDF/print, remarks, parent/student visibility and live sign-off. This is NOT the online-learning AI assessment system. |
| Online curriculum lessons | AMBER | `learning.ts`, topic import, source grounding, PIN/sequence gates, lesson generation/cache and learner progress exist. Validate complete lesson coverage, generated lesson quality, cache invalidation, assets, rights and student delivery for every class/subject. |
| Online question bank | RED | Live production currently has **0 questions, 0 assessments, 0 assessment-question rows and 0 submissions**. Populate and validate sourced or AI-generated questions before claiming online exams/practice are ready. |
| Online class practice (AI-generated) | RED / AMBER | Required product behaviour is not yet certified: generate only from lessons actually covered, diagnose each student's weak concepts, adapt question selection and track improvement. |
| Online terminal/exam assessments | RED / AMBER | Required product behaviour is not yet certified: timed exam conditions, exam-style paper structure, authentic past-question sourcing where legally usable, provenance and AI-generated exam-standard replacements where sourced papers are unavailable. |
| AI marking and feedback (online learning) | AMBER / RED | Submission and AI grading fields exist (`ai_suggested_points`, `ai_feedback`, grading status). Prove objective and subjective marking, rubrics, score persistence, explanations, confidence/uncertain-case handling and remedial recommendations end-to-end. Keep this separate from school report scores. |
| Brainee chat / explain / text study | AMBER | `ai.ts`, `utils/ai.ts` and student UI exist; AI access is rate-limited. Test model availability, fallback, safeguarding, cost controls and grounding against the student's actual class/subject/covered lessons. |
| Study timetable / weak-subject prioritisation | AMBER | Student self-study settings and study-plan feature are documented in `APP_WIDE_AUDIT.md`. Verify allocations against current scores and actual curriculum subjects on production. |
| Materials / learning resources | AMBER | Materials route and screen exist. Verify upload, storage, preview/download, MIME/size checks, authorization, broken links and mobile rendering with real files. |
| Messages / chat | AMBER | Messages routes, screens and RBAC tests exist. Complete student-parent-teacher-admin conversation acceptance and cross-school isolation checks. |
| Announcements / school events / notifications | AMBER | Routes/tables/screens and push-token/delivery structures exist. Verify audience targeting, delivery, read state, disabled devices and retry/failure handling. |
| Weekly efforts and feedback | GREEN / AMBER | Route/screen and role-scope fixes exist; student feedback-compose mismatch was fixed. Complete full role-specific live workflow and report visibility. |
| Reports / analytics / exports | AMBER | School report endpoints, session reports and Excel export exist. Teacher analytics/reporting and management analytics need complete role-based data validation and live acceptance. |
| Backup, restore and disaster recovery | RED / AMBER | An earlier PostgreSQL 18 backup was restored in isolation, but it is stale (agent audit reports six migrations and old production data) and is not acceptable as current recovery evidence. A fresh full backup, durable off-site copy and isolated restore against all 11 migrations are required. Application backup email was not sent because `ADMIN_LOG_RECIPIENTS` is empty. Render Free expiry is 12 December 2026. |
| Security, audit and privacy | AMBER | RBAC, scope guards, rate limiting, audit logs, credential controls and security workflows exist. Complete end-to-end authorization matrix, dependency remediation, secret checks, retention and privacy review. |
| Mobile Android / iOS / offline | AMBER / GREY | Expo mobile app and Android readiness/release workflows exist. Prove production API configuration, login, core workflows, poor-network recovery, offline queue/sync, device matrix and signed release. Do not claim iOS release readiness without evidence. |
| CI/CD and deployment | AMBER | Many focused GitHub Actions workflows exist; latest named curriculum/report-scope workflows passed. Audit every current failing workflow, verify production deploy SHA and rollback procedure. |
| Documentation and operational handover | AMBER | README, handoff, audit and test-plan files exist. Update stale historical snapshots only after the relevant work is actually verified. |

## 3. Every school class — curriculum and subject register

The class inventory below is taken from `backend/src/db/seed.ts`. The subject lists are the repository's seed-level subject catalogues, not proof that every subject is appropriate for every year. Subject-to-class mapping must follow the approved scheme of work and, in senior secondary, the student's department.

### 3.1 Early Years and Primary

Seeded classes: **Pre-Nursery, Reception, Nursery 1, Nursery 2, KG 1, KG 2, Primary 1, Primary 2, Primary 3, Primary 4, Primary 5, Primary 6.**

Seed-level primary subject catalogue (11):

1. English Language
2. Mathematics
3. Basic Science
4. Social Studies
5. Yoruba
6. CRS/IRS
7. Civic Education
8. Physical & Health Education
9. Cultural & Creative Arts
10. Computer Studies
11. Home Economics

| Class | Repository evidence | Status / closeout |
|---|---|---|
| Pre-Nursery | Class seeded; early-years audit and import/resolution support present | GREY — obtain current class/term source and learner-delivery evidence; do not assume empty or complete. |
| Reception | Class seeded; early-years audit and import/resolution support present | GREY — same evidence gate. |
| Nursery 1 | Class seeded | GREY — class-specific subject/term coverage and acceptance not certified. |
| Nursery 2 | Class seeded | GREY — class-specific subject/term coverage and acceptance not certified. |
| KG 1 | Class seeded | GREY — class-specific subject/term coverage and acceptance not certified. |
| KG 2 | Class seeded | GREY — class-specific subject/term coverage and acceptance not certified. |
| Primary 1 | Class seeded; primary curriculum resolution infrastructure exists | AMBER — source/term coverage and live delivery receipt required. |
| Primary 2 | Class seeded; primary curriculum resolution infrastructure exists | AMBER — source/term coverage and live delivery receipt required. |
| Primary 3 | Class seeded; early-years/primary1-3 audit exists | AMBER — close the specific evidence gaps in the audit and verify learner delivery. |
| Primary 4 | Class seeded; researched packages, source manifest, supplements and coverage report exist | AMBER — validate all terms/subjects, source coverage, approvals, assets and production delivery. |
| Primary 5 | Class seeded | GREY — no current class-level completion receipt established in this snapshot. |
| Primary 6 | Class seeded | GREY — no current class-level completion receipt established in this snapshot. |

### 3.2 Junior Secondary

Seeded classes: **JSS 1, JSS 2, JSS 3.**

Seed-level secondary subject catalogue (16):

1. English Language
2. Mathematics
3. Physics
4. Chemistry
5. Biology
6. Further Mathematics
7. Economics
8. Commerce
9. Government
10. Literature-in-English
11. Yoruba
12. CRS/IRS
13. Computer Studies
14. Agricultural Science
15. Technical Drawing
16. Physical & Health Education

| Class | Repository evidence | Status / closeout |
|---|---|---|
| JSS 1 | `jss1CurriculumResolutions.ts` and existing importer path | AMBER — preserve existing content; certify source/term coverage and learner delivery. |
| JSS 2 | `jss2CurriculumResolutions.ts` and existing importer path | AMBER — preserve existing content; certify source/term coverage and learner delivery. |
| JSS 3 | Resolution, sequencing, attribution, correction, supplement and asset tooling; dedicated CI passes at inspected SHA | AMBER — final source/attribution decisions, practical competence, protected preservation, device delivery and release acceptance remain. |

The 16-subject list is a shared seed catalogue; it must not be interpreted as a mandate that all 16 subjects apply to every JSS learner or class. Confirm the school's actual JSS scheme and subject offering.

### 3.3 Senior Secondary

The seed-level secondary catalogue above is 16 subjects. The SS1 package catalogue is broader and contains 21 subject files.

**SS1 — 21 package files present on master:**

1. Agricultural Science
2. Biology
3. Bookkeeping
4. Catering Craft
5. Chemistry
6. Civic Education
7. Commerce
8. Data Processing
9. Economics
10. English
11. Financial Accounting
12. Food and Nutrition
13. French
14. Further Mathematics
15. Geography
16. Government
17. Literature
18. Mathematics
19. Physics
20. Technical Drawing
21. Yoruba

**SS2 — seven subject package files present:**

1. Agricultural Science
2. Biology
3. Chemistry
4. Civic Education
5. Government
6. Mathematics
7. Physics

**SS3 — two subject package files present for exam preparation:**

1. Agricultural Science
2. Biology

| Class | Required mode | Status / closeout |
|---|---|---|
| SS1 | Instructional curriculum, First–Third Terms | AMBER — 21/21 package files exist and the SS1 integrity workflow passed at inspected SHA. This is not proof that all lessons, original-source coverage, answer keys, rights, approvals and learner delivery are complete. Close every subject's live task queue and acceptance gate. |
| SS2 | Instructional curriculum, First–Third Terms | AMBER / RED — seven package files exist. The SS23 checkpoint explicitly says the Agricultural Science draft remains pending curriculum approval/final validation and that no SS2 package is certified for student release. The other subjects need equivalent source, content, assessment, rights and approval evidence. |
| SS3 | Exam preparation only; First–Second Terms; no normal Third-Term teaching package | AMBER / RED — two subject exam-preparation package files exist. Build/verify the full approved exam-subject scope, past-paper provenance, mock papers, marking and feedback. Do not treat generic SS2 packages as SS3 teaching content. |

**Important SS3 product rule:** SS3 online assessment must simulate the relevant examination (WAEC, NECO, JAMB or another explicitly selected board). Use authentic past questions only where access/reuse is lawful and provenance is recorded; otherwise generate exam-standard questions. SS3 is not to be filled with ordinary new-term lessons.

## 4. Online assessment acceptance contract

This is a separate learner-facing system, not the physical teacher report workflow.

| Assessment type | Required behaviour | Acceptance test |
|---|---|---|
| Class practice | AI uses only topics/lessons the student has completed or been taught. It diagnoses weak concepts from attempts and scores, then generates targeted practice at the right difficulty. | Student who struggles with a specific concept receives more questions on that concept; untaught topics are excluded; improvement changes the next question mix. |
| Terminal / exam-class assessment | Timed examination interface, exam instructions, sections, mark allocation, shuffle rules where appropriate and exam-standard difficulty. | Exam can be started, timed, submitted, resumed only under approved rules, marked and reviewed. |
| Past-question retrieval | Search/import lawful and accessible past questions from named examination boards; store board, year, paper, question number, source URL/reference, rights status and content hash. | Every retrieved item has traceable provenance and approved reuse status; unavailable or restricted items are not copied. |
| AI-generated exam questions | When suitable past questions cannot be used, generate equivalent board-standard questions from approved syllabus objectives and taught content. | Subject specialist checks syllabus alignment, ambiguity, mark scheme, answer correctness and difficulty. |
| AI marking | Auto-mark objective questions; mark structured/essay answers against explicit rubrics and mark allocations. Return total, per-question feedback, explanations and confidence. | Marking is persisted, repeatable and auditable; low-confidence subjective answers are flagged for review rather than falsely represented as certain. |
| Remediation | Translate wrong answers into weak-concept records and recommend a lesson, worked example or new practice set. | Student's next practice set is targeted; mastery updates only from valid evidence; teacher report scores/attendance/remarks are untouched. |

## 5. Production data evidence and limits

Live read-only verification at 18 November 2026 18:55 UTC recorded **48 public tables, 104 students, 104 active report-roster memberships, 104 membership events, 11 schema migrations, 0 teacher users, 0 teacher-subject assignments, 0 questions, 0 assessments, 0 assessment-question rows and 0 submissions**. The 104 roster rows match all ten owner-approved workbook class totals. The audit log records a successful `Student_Class_List.xlsx` import with source SHA-256 `e68e62448a5251d850e40d02d8b15167ebe386c143a7be3d8f7331cbe2cb69c2`. The canonical Render service is live on this commit; public HTTP smoke tests remain unverified. The database is PostgreSQL 18 on Render Free and expires **12 December 2026 01:30:29 UTC**. An earlier isolated restore succeeded, but the artifact is stale (six migrations per the latest audit) and does not establish current recovery readiness. `ADMIN_LOG_RECIPIENTS` is empty, so the latest application backup was not emailed. Full schema parity against `backend/schema.sql` remains unverified. Treat these as dated observations, not live values at every later commit.

## 6. Required completion gates

1. **Production stability:** verify `sts-school-app` service health, `sts-school-db-2` availability, latest deployed SHA, migration state, API smoke tests and logs.
2. **Data integrity:** reconcile every supplied student/class list with live students, active report roster, school, class, parent links and subject eligibility; produce duplicate/missing/mismatch exceptions.
3. **Curriculum:** complete all class/subject/term source coverage, lessons, assessments, answer keys, assets, rights, specialist/owner approvals and learner-device delivery.
4. **Online assessments:** populate sourced/AI-generated question bank, separate class-practice and exam modes, complete AI marking and weak-area remediation, then run student acceptance tests.
5. **Physical reports:** validate attendance, teacher marks, class/subject permissions, report calculations, PDF/export, student/parent viewing and term close.
6. **All roles/modules:** close finance_admin, onboarding, finance, notifications, materials, messaging, analytics and admin workflows with role-specific end-to-end tests.
7. **Mobile release:** test supported Android devices, production API, poor connectivity/offline behaviour, sync recovery and signed release. Record iOS status explicitly.
8. **Operational readiness:** perform a real restore drill, security/dependency audit, monitoring check, rollback rehearsal and owner sign-off.

## 7. Repository evidence index

- `backend/src/db/seed.ts` — canonical seeded classes and subject catalogues.
- `backend/src/db/ss1/subjects/*.json` — 21 SS1 subject package files.
- `backend/src/db/ss23/subjects/*.json` and `ss3/*.json` — SS2/SS3 package files.
- `docs/curriculum/20261102/README.md` — curriculum execution snapshot and class-group caveats (historical base SHA; do not treat its counts as live).
- `docs/curriculum/20261102/STATUS.json` — historical SS1 queue counts (base SHA 541e8b0; refresh before using).
- `docs/ss23/PACKAGE_CONTRACT_CHECKPOINT.md` — SS2/SS3 package contract and approval gates.
- `docs/ss23/OWNER_APPROVED_CURRICULUM_CLARIFICATION_20261116.md` — approved SS2/SS3 scope clarification.
- `docs/curriculum/20261113/EARLY_YEARS_PRIMARY1_3_AUDIT.md` — early-years and Primary 1–3 audit evidence.
- `APP_WIDE_AUDIT.md` — student, parent, teacher and admin role audit findings and fixes.
- `.github/workflows/backend-score-subject-scope-atomicity.yml`, `.github/workflows/backend-report-roster.yml`, `.github/workflows/backend-attendance-report-scope.yml` — physical report scope checks.
- `.github/workflows/ss1-integrity-gate.yml` (actual workflow filename may differ; inspect current tree before invoking) and `.github/workflows/ss23-integrity-gate.yml` — curriculum package integrity.
- `.github/workflows/jss3-assets.yml` — JSS3 implementation and asset checks.
- `backend/src/routes/ai.ts`, `backend/src/routes/learning.ts`, `backend/src/routes/scores.ts` — distinct AI learning and physical report routes.

**Maintenance rule:** update this register only from a fresh master SHA, actual current queue/package data, relevant CI run IDs and live acceptance evidence. Never change a row to GREEN merely because its files exist or a schema test passes.

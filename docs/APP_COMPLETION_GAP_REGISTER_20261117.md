# Application completion gap register — 2026-11-17

This register records verified implementation gaps in the repository and the live Render environment. It separates **not implemented**, **implemented but not verified**, **partially implemented**, and **blocked by external authorization/configuration**. A feature is not called complete merely because a screen, route or package exists.

## 1. Executive status

- Repository: `PDS-David/sts-school-app`
- Integration branch: `master`
- Application: Expo React Native mobile client plus Node/Express API and PostgreSQL.
- SS2/SS3 source register: 100 source-member records — 61 SS2 and 39 SS3 — across 21 subjects.
- Source archive identities verified:
  - SS2 `SSS 2-20260507T072840Z-3-001.zip`: `a97506c7f030a6e9604a13ae0aab30f59563a1473ec682f647459549dd9e1153` (61 members).
  - SS3 `SSS 3-20260507T072839Z-3-001.zip`: `045e261aba9475b32b4cb963a2495faf3ddd503860b205aa1e89f0ac07d3c741` (39 members).
- Current master registers five SS2 subject packages and two SS3 subject packages. SS2 Civic Education is implemented on PR #969 and SS2 Government First Term is implemented on PR #974; neither is yet merged. No student-delivery gate has been opened.
- All seven packages on master are still `PENDING`; lesson implementation is draft and verification is deferred. The additional Civic Education and Government PRs preserve the same release gates.
- There are five open GitHub issues after consolidating duplicate recovery issue #975 into canonical issue #976, and seven open PRs including this gap register. No PR has been merged by this work.

## 2. SS2 and SS3 curriculum work remaining

### 2.1 Subject inventory

The 21 source subject slugs are:

Agricultural Science, Biology, Bookkeeping, Catering Craft, Chemistry, Civic Education, Commerce, Data Processing, Economics, English, Financial Accounting, Food & Nutrition, French, Further Mathematics, Geography, Government, Literature, Mathematics, Physics, Technical Drawing and Yoruba.

| Class | Subjects with a package on master | Additional package in open PR | No package yet |
|---|---:|---:|---:|
| SS2 | 5 of 21 | 3 (Civic Education, PR #969; Government, PR #974; Mathematics T2/T3 extension, draft PR #980) | 14 |
| SS3 | 2 of 21 | 0 | 19 |

**SS2 subjects with no package yet:** Bookkeeping, Catering Craft, Commerce, Data Processing, Economics, English, Financial Accounting, Food & Nutrition, French, Further Mathematics, Geography, Literature, Technical Drawing and Yoruba.

**SS3 subjects with no package yet:** Bookkeeping, Catering Craft, Chemistry, Civic Education, Commerce, Data Processing, Economics, English, Financial Accounting, Food & Nutrition, French, Further Mathematics, Geography, Government, Literature, Mathematics, Physics, Technical Drawing and Yoruba.

The source registry contains 61 SS2 and 39 SS3 members because some class/term source files are missing or duplicated. Do not infer that every subject has three source terms.

### 2.2 Existing SS2 packages

| Subject | Implemented units | Practice records | Current status / remaining work |
|---|---:|---:|---|
| Agricultural Science | 19 | 195 | Three terms represented, but 47 open items remain. The package has 52 asset records, including 42 unresolved source-extract placeholders. Original question reconciliation, source visuals, practical safety/marking, rights and independent QA remain open. |
| Biology | 25 | 50 | Three terms represented. Source audit maps 139 labelled assessment/assignment blocks, but this is not proof that every original prompt, answer and visual is implemented. Seven open items; no package assets. Source question reconciliation, examples/answers, rights and independent QA remain open. |
| Chemistry | 28 | 56 | Three terms represented. All 28 coverage rows remain PARTIAL; four open items and no assets. Full source question/answer, worked-example, equation, visual and practical reconciliation remains open. |
| Mathematics | 10 | 20 | Master contains First-Term only. Draft PR #980 adds 11 Second-Term and 10 Third-Term units (31 total; 82 practice records: 62 authored supplements and 20 original source prompts). Nine blocking open items remain for other assessments, source anomalies, visuals and independent QA. |
| Physics | 26 | 52 | Three terms represented. All coverage rows remain PARTIAL; three open items and no assets. Full source assessment, equation, diagram, practical and independent QA reconciliation remains open. |
| Civic Education (PR #969) | 26 | 52 | Nine First-Term, nine Second-Term and eight Third-Term draft units. Source-located evaluation prompts and authored practice are distinct. Seven open items remain for full assignment reconciliation, visuals, source rights and independent QA. PR is open and not merged. |
| Government (PR #974) | 30 | 60 | Ten source-week draft units per term. Source-located evaluation prompts and authored practice are distinct. Seven open items remain for complete assignment reconciliation, historical fact-check, visuals, rights and independent QA. |

All authored answers and supplementary practice must remain separately attributed from original source questions. Package counts are implementation counts, not proof of full source coverage.

### 2.3 Existing SS3 packages

| Subject | Implemented units | Practice records | Current status / remaining work |
|---|---:|---:|---|
| Agricultural Science | 12 | 24 | First- and Second-Term exam-preparation units only. Seven open items; prior-learning evidence, source assessment coverage, model-answer/marking verification, practical evidence and independent QA remain open. |
| Biology | 2 | 4 | One First-Term and one Second-Term revision unit. Four open items. Unsupported topics remain held until SS2 prior-learning evidence is established. |

SS3 is examination preparation only. No new instructional topics may be introduced. The SS3 Third-Term source archive has zero members; no Third-Term source curriculum may be invented.

### 2.4 Source anomalies that remain open

- Four received source members differ from the previously registered versions: SS2 Economics T2, SS2 Further Mathematics T3, SS3 Mathematics T1 and SS3 Economics T1. Both versions must remain traceable until the authoritative version is established.
- SS3 Literature T1 and T2 are byte-identical; there is no distinct Second-Term content to certify.
- SS2 and SS3 Bookkeeping T1 and T2 are identical after the header; do not invent a distinct T2 syllabus.
- SS2 Food & Nutrition has a misleading T2 duplicate whose internal header says First Term.
- SS2 Technical Drawing T1 and SS3 Technical Drawing T1 are missing.
- SS2 Catering Craft T1/T3 and SS3 Catering Craft T1 are missing.
- SS3 Food & Nutrition T2 is missing.
- SS3 Third Term is empty.
- Filename/header mismatches and Alpha/Sigma term labels require explicit reconciliation.
- Source reuse rights for original wording and images remain separate from the owner's curriculum approval.

### 2.5 Curriculum release gates still required

1. Implement the remaining 15 SS2 subjects and 19 SS3 subjects from verified source members.
2. Complete all three SS2 terms wherever source material exists; preserve combined weeks and missing-source markers.
3. Convert eligible SS3 material to revision/exam practice only after verifying prior learning in the earlier-class source.
4. Map every original assessment, assignment, worked example, diagram, table, equation and practical item to a disposition.
5. Verify all authored answers and marking schemes independently.
6. Reconcile missing, duplicate and conflicting source versions without choosing arbitrarily.
7. Complete rendered-page visual review and source-asset rights review.
8. Complete independent subject QA and close blocking open items.
9. Merge and verify PR #977, which connects the existing gated SS2/SS3 student-delivery API to mobile subject discovery and lesson screens. Until that PR is merged, the mobile client fetches only database subjects and SS1 package lessons.
10. Keep every package unavailable to students until the applicable gates and owner release authorization pass.

## 3. Production backend and Render gaps

### 3.1 Live service health

Two Render web services point at the same repository but are not healthy:

- `sts-school-app` (`srv-dbqmsa142hec73foh6i0`) connects to the inspected current database but fails startup because `public.rate_limit_counters` does not exist (PostgreSQL SQLSTATE `42P01`).
- `sts-school-backend` (`srv-d9bl507aqgkc739ji4i0`) fails startup because its configured database hostname is stale: `dpg-dad2f32jnfac73e5j6r0-a` returns DNS `ENOTFOUND`, while the current database is `dpg-dbqhddbrjlhs738a4s4g-a`.

The mobile app currently points to `https://sts-school-backend.onrender.com`. Both services currently have no configured Render health-check path. The canonical service must be selected and repaired before mobile release.

### 3.2 Production database and schema drift

The inspected Render database `sts_school_db_2` is PostgreSQL 18 on the Free plan. A read-only catalog comparison against current `backend/schema.sql` and migrations 0002/0003 found:

- Expected public tables: 41; live tables: 40.
- Missing live tables: `schema_migrations`, `school_events`, `rate_limit_counters`.
- Live-only tables: `app_bootstrap`, `backup_log`.
- Nine expected `audit_log` columns are missing: `actor_role`, `actor_school_code`, `actor_ip`, `request_id`, `user_agent`, `metadata`, `outcome`, `previous_hash`, `event_hash`.
- Live-only columns exist in users (10), students (2), scores (1), weekly_efforts (2), assessments (1), submissions (1), topics (5), topic_completions (2) and topic_assets (1). They must be preserved and their historical migration origin reconciled.
- Six expected indexes are absent, including audit hash-chain and school-event indexes.
- Both expected append-only audit triggers and `audit_log_reject_mutation()` are absent.
- `app_bootstrap` contains version 1 with checksum `e910acd83dc81786f370311f97e0d1e7aae6a3e6bc8a430188e49dc57cc1d7f6`; it is not a `schema_migrations` ledger.
- `backup_log` contains one reminder record and zero backup records.

A read-only row-count query returned zero for students, parent wards, teacher-subject assignments, scores, attendance, weekly efforts, class records, questions, assessments, submissions, materials, invoices, fee items, messages and announcements. Confirm that this is the intended production database before any migration or service cutover.

The replacement database is **not completely empty**. Current read-only counts are:

| Entity | Count |
|---|---:|
| Schools | 2 |
| Classes | 18 (12 Primary campus classes, JSS 1–3 and SS 1–3 at the secondary campus) |
| Subjects | 12 |
| Terms | 6 |
| Users | 1 (admin) |
| Students / parent wards / teacher-subject assignments | 0 |
| Curriculum topics | 1,408 |
| Topic completions / term PINs / class access codes | 0 |
| Questions / assessments / assessment questions / submissions | 0 |
| Materials | 0 |
| Scores / attendance / weekly efforts / class records | 0 |
| Fee items / invoices / messages / announcements | 0 |

All 1,408 imported topics are for **Primary 1–6 only** (all three terms). There are no imported JSS or SS topics in the replacement database. The 12 subject rows are Cultural & Creative Arts, English Language, Civic Education, Computer Studies, Mathematics, Physical & Health Education, Social Studies, Agricultural Science, Basic Science, Home Economics, Basic Technology and Basic Science and Technology. The database has the JSS 1–3 and SS 1–3 class rows, but no secondary subject, topic, assessment, material or student records. The 12 subject rows belong only to the `primary` school; the `secondary` school currently has zero subject rows.

This indicates that the replacement DB has retained/imported Primary curriculum topics and basic school/class setup, but it is not a restored copy of the previous operational school database. The SS2/SS3 JSON packages in the repository are not yet imported into the live topics system.



No production schema or data has been changed. Do not run `--fresh`, stamp a baseline, drop live-only columns or apply pending migrations until the historical baseline and backup are verified and the owner approves the exact plan.

### 3.3 Backup and continuity

- Current Render Free Postgres expires at **2026-12-12 01:30:29 UTC**.
- Render Free Postgres has no Render-managed backups or point-in-time recovery.
- PR #971 adds a daily encrypted PostgreSQL 18 `pg_dump` GitHub Actions workflow and restore procedure. It requires repository secrets `RENDER_POSTGRES_EXTERNAL_URL` and `BACKUP_AGE_RECIPIENT`; no successful backup artifact or restore rehearsal is claimed yet.
- Long-term encrypted off-site retention (Cloudflare R2 or another approved destination) remains to be configured.
- A paid Postgres plan or tested replacement database is required before expiry. No paid plan has been selected.

### 3.4 Network exposure

The database's external IP allowlist is `0.0.0.0/0`. No complete inventory of external admin, CI, backup and developer clients has been approved. Restricting this without that inventory risks lockout; the issue remains open. Routine service traffic should use Render private networking, with external access restricted to known fixed CIDRs.


### 3.5 Previous production database recovery

The previous handoff `AGENT_CONTINUATION.md` identifies the former live database as `sts-school-db` on Render Free Postgres and records Render's dashboard warning that it would be deleted on **2026-10-04** unless upgraded. The current Render workspace lists only `sts-school-db-2`, created on **2026-11-12**. The old hostname referenced by the stale backend service returns `404 not found`, and the old database ID is no longer retrievable.

This is consistent with the former Free database expiring and being deleted. It is not yet proven that its data is irrecoverable: the repository's encrypted backup implementation can email a backup attachment when `ADMIN_LOG_RECIPIENTS` is configured and the encrypted file is under 17 MiB; larger files produce a notice directing an operator to run `npm run db:backup-export` locally. The new database's `backup_log` has one reminder and zero backup records, but that log belongs to the new database and cannot establish what happened on the deleted database.

**Recovery is an urgent unresolved workstream:** search the project-owner/admin email accounts for subjects beginning `[STS School] Encrypted database backup`, inspect local `db:backup-export` output and any off-host storage, verify any candidate backup's age-encryption identity and archive integrity, then restore only into an isolated PostgreSQL database. Do not overwrite the current database or claim old student data recovered until row counts and representative records are validated. A Gmail connection is required to search the owner's email; it has been suggested but is not yet connected.

## 4. Mobile application and release gaps

### Implemented, but not fully verified

- Expo React Native client has student, parent, teacher, admin and finance-admin navigation.
- Offline cache/outbox, FIFO replay, account-scoped queueing and handling for 401/403/409 failures have focused regression tests.
- PDF/DOC material download and share support exists; other link/video types open externally.
- Push token registration and Expo delivery integration exist, but real device delivery has not been verified.
- Android debug APK compilation has passed in CI. The emulator smoke workflow and SDK 57 candidate export have not both passed on a fresh exact-head run.

### Remaining mobile work

1. Complete PR #972's conventional Expo `App.tsx` entrypoint fix and obtain fresh passing SDK 56/57 export, Android debug build and emulator install/launch checks.
2. Review and safely commit the SDK 57 dependency/lockfile alignment after the candidate export passes. The SDK 56 audit reported 15 findings (4 high, 11 moderate); the SDK 57 candidate reduced this to 3 moderate findings but its export previously failed.
3. Configure an authorized EAS `EXPO_TOKEN`; staging APK and signed production AAB builds have been skipped without it.
4. Run authenticated staging journeys for all five roles, including permissions, token expiry/revocation, account switching, assessments, scores, fees, messaging, materials and exports.
5. Verify real FCM/Expo push delivery on physical Android devices. Announcements currently appear in in-app feeds and are not sent as push notifications.
6. Perform physical Android device/OS acceptance and a release-signing review. No signed production AAB or Play Store release is verified.
7. Verify iOS build, signing, push and distribution; no iOS release acceptance is recorded.
8. Add user-facing conflict review/recovery for queued writes that remain blocked by 401/403/409 responses; document cache freshness and stale-data behavior.
9. Offline login, logout, password changes, AI/Brainee calls and Admin Excel export still require a live connection.
10. The app has no in-app resource upload workflow; current materials support download/share for PDF/DOC and external opening for other link/video types.
11. Finance workflows do not yet have an integrated online payment gateway and automated payment reconciliation; payment recording remains manual.
12. A separate production web portal is not verified; the current product is the Expo mobile client with a web-bundle readiness check.

## 5. GitHub Issues and active PRs

### Open issues (six currently open; #975 consolidated as duplicate of #976)

| Issue | Severity | Current finding | Required resolution |
|---|---|---|---|
| [#951](https://github.com/PDS-David/sts-school-app/issues/951) | P1 | Both Render backend services fail startup: missing PostgreSQL rate-limit table on one, stale DB host on the other. | Reconcile the canonical service/connection, complete approved migration adoption, configure readiness health and verify both services. |
| [#952](https://github.com/PDS-David/sts-school-app/issues/952) | P1 | Production schema drift, absent migration ledger, missing school-events/rate-limit tables and audit controls. | Recover historical migration origin, verify encrypted backup/restore, prepare exact baseline plan and apply only after owner approval. |
| [#954](https://github.com/PDS-David/sts-school-app/issues/954) | P1 | Free database expires 2026-12-12; Free plan has no backups/PITR. | Configure encrypted backups, pass restore rehearsal, then approve paid-plan upgrade or replacement migration before expiry. |
| [#955](https://github.com/PDS-David/sts-school-app/issues/955) | P2 | External database allowlist is `0.0.0.0/0`. | Inventory legitimate external clients, move service traffic to private networking and restrict external CIDRs. |
| [#976](https://github.com/PDS-David/sts-school-app/issues/976) | P1 | Previous production database `sts-school-db` is absent; current replacement has zero student/attendance/score/invoice/message rows, 1 admin user and 1,408 Primary-only curriculum topics. Curriculum archives are recovered; database/roster backup recovery remains open. Duplicate #975 is closed as duplicate of this canonical issue. | Search encrypted email backups, local exports and off-host storage; verify and restore only into an isolated database. |
| [#979](https://github.com/PDS-David/sts-school-app/issues/979) | P1 | Public self-claim roster endpoint exposes unclaimed student names/UUIDs before checking the class code. | Require class code before roster lookup or use a single-student lookup; add no-store and regression tests. |

### Open PRs (none merged by this work)

| PR | Purpose | State |
|---|---|---|
| [#969](https://github.com/PDS-David/sts-school-app/pull/969) | SS2 Civic Education, all three terms: 26 draft units and 52 practice records. | Open; SS23 contract/integrity and SS1 integrity pass. An unrelated JSS3 check fails on its existing prompt-count assertion; JSS3 was not changed. |
| [#970](https://github.com/PDS-David/sts-school-app/pull/970) | Full read-only Render schema-drift inventory. | Open; documentation only. |
| [#971](https://github.com/PDS-David/sts-school-app/pull/971) | Encrypted scheduled Render Postgres backup workflow and restore instructions. | Open; workflow syntax validation passed, but the backup job was skipped and no encrypted artifact was produced. Secrets and a manual/scheduled backup run are still required. |
| [#972](https://github.com/PDS-David/sts-school-app/pull/972) | Conventional Expo App entrypoint and updated Android readiness notes. | Open; Android debug APK build and emulator verification are running. |
| [#973](https://github.com/PDS-David/sts-school-app/pull/973) | This evidence-based application completion gap register. | Open; documentation only. |
| [#974](https://github.com/PDS-David/sts-school-app/pull/974) | SS2 Government: 30 draft units and 60 practice records across all three terms. | Open; SS23 contract, SS23 integrity and SS1 integrity pass on head `67f6b241c6bb174454f8075a825916712c498d5b`; shared JSS3 workflow fails on `tests/jss3-yo-license.db.test.mts` assertion `prompts.length >= 2`. |
| [#977](https://github.com/PDS-David/sts-school-app/pull/977) | Connect delivery-gated SS2/SS3 packages to student subject discovery and lesson screens. | Open; backend, mobile, package and cross-project CI running. |
| [#978](https://github.com/PDS-David/sts-school-app/pull/978) | Finance-admin role audit; enforce `messages.read` on inbox/conversation/contacts; align messaging and shared-quota CI with PostgreSQL migrations. | Open; focused Messages RBAC test passes on latest run; PostgreSQL integration workflows rerun after harness repair. |
| [#980](https://github.com/PDS-David/sts-school-app/pull/980) | Extend SS2 Mathematics to 31 draft units and 82 practice records across all three terms; transcribe 20 original T3 probability prompts; record rendered-source reconciliation. | Draft; all 31 body hashes match; nine open items remain for assessment, source anomalies, visuals, rights and independent QA. |


## 8. Additional product and administration gaps

### Verified implemented — not outstanding

The current codebase already contains these features; older TODO/handoff notes describing them as missing are stale:

- Student enrolment: `AddStudentScreen` is registered in Admin navigation and calls the student creation workflow.
- Finance administration: `FinanceScreen` has Add Fee Item and New Invoice modals; finance admins can mark invoices paid. This is manual reconciliation, not an online payment gateway.
- Announcements: admin create/delete UI, role/class-scoped API and Student/Parent home feeds exist. Owner decision D8 explicitly excludes push/SMS for announcements.
- School events: admin create/edit/delete UI, API, teacher calendar and parent Activities feed exist. The current replacement database is missing the `school_events` table, so this implemented feature is blocked by schema repair, not absent code.
- Teacher Analytics and School Calendar screens exist; teacher analytics uses answer-level grading status and pending-review counts.
- Parent Upcoming Tests, School Calendar & Events, and Assignments/Results sections exist.
- Student Achievements screen and backend badge calculations exist.
- Admin Edit User already normalizes empty `school_code` and `assigned_class` values to SQL NULL; the old audit warning is fixed in current master.

### Remaining product and administration gaps

1. **Class management:** `GET /academic/classes` exists, but there is no `POST` or `PUT` class endpoint and no create/edit class screen. Classes are seed-defined.
2. **School onboarding:** `GET /academic/schools` exists, but no create-school/onboard-campus workflow is present for adding a new school, its branding, users, classes and fee configuration.
3. **Class-specific subject availability and secondary curriculum population:** `GET /academic/subjects` returns the school's subject catalogue, not a class-specific catalogue. The current database has zero subject rows for the secondary school and no JSS/SS topics; all 1,408 topic rows are Primary 1–6. PR #977 exposes only approved SS2/SS3 package subjects. JSS1–3 and SS1 content/subject discovery remain separate and were not modified under the current SS2/SS3-only scope. Class-specific availability and teacher-subject assignments for the remaining secondary curriculum still need population and verification.
4. **Finance-admin role audit:** PR #978 completes the source-level finance-admin screen/API/RBAC audit and adds `messages.read` guards to inbox, conversation and contacts routes. The PR is open; live finance-admin token testing remains blocked by the absence of student/finance data in the replacement database.
5. **Pre-login flow QA:** `StudentSelfClaimScreen` and `ActivateAccountScreen` were not included in the completed student-role audit. Their full error-path, enumeration-resistance, rate-limit and abuse-case review remains unverified.
6. **Report-card school details:** the term-report PDF code reflects the agreed layout (position included; motto embedded in the crest; attendance/remarks/next-term excluded), but the Primary school's address and phone in `mobile/src/schoolBranding.ts` remain placeholders copied from Model College.
7. **Report position/permission decision:** the term report currently always includes subject and overall position. The older TODO's optional position-column setting is not implemented. Print/export remains admin and parent only; whether teachers should gain access remains an unresolved product decision.
8. **PDF acceptance:** the report PDF has A4/one-page styling, but a fresh physical-device print/export acceptance with the actual Primary and Secondary logos/contact details is not recorded.
9. **Online payments:** finance admins can create fee items/invoices and manually mark invoices paid. No payment gateway, automated payment confirmation or reconciliation integration is present.
10. **Resource file upload:** materials can be managed as records/links, but there is no verified in-app binary file upload/storage workflow; current resources are linked by URL.
11. **Offline completeness:** topic caching exists, but login/logout, password changes, AI actions and Excel exports require a live connection. A user-facing offline conflict/reconciliation workflow is not established.
12. **Parent messaging scope:** parent messaging is scoped to the ward's class teacher. Whether parents should also contact subject teachers or school admins (for example, for billing) remains a product decision.

## 9. Existing app-wide audit status

`APP_WIDE_AUDIT.md` records Parts 0–5 as completed or resolved: database compatibility against the schema at the time, student/parent/teacher/admin audits, parent cross-campus provisioning, and AdminUsers layout. That audit was performed against the former database before its recorded 2026-10-04 expiry. It does **not** prove the current `sts_school_db_2` is the same database or contains the same data. The new Render database has a different ID and must be treated as a fresh, separate production state until recovery is proven.

The four-role audit does not include `finance_admin`. The old app-wide audit also records that the mobile-to-backend route map had zero endpoint mismatches at the time of that audit; this should be rerun after the current deployment/database repair, not treated as a live production health check.

## 6. Work order to finish

1. Complete PR #972 mobile CI; fix any actual export/emulator failures without masking them.
2. Complete PR #969's remaining SS2 Civic Education assessment/visual/QA work; keep it blocked from student delivery until those gates pass.
3. Complete PR #980's original-assessment and visual reconciliation; then add the next source-backed SS2 subject package and tests, continuing subject-by-subject through the 14 subjects without a package.
4. Complete SS3 revision packages only after the corresponding prior-learning topics are implemented and verified in earlier classes.
5. Complete all source assessment, answer, marking, visual, rights and independent QA reconciliation for existing packages.
6. Configure and run the encrypted backup workflow; download and restore into an isolated database.
7. Resolve the production schema baseline from historical evidence; obtain owner approval for the exact migration plan.
8. Reconcile the stale backend service connection and choose one canonical Render service; add a readiness health check.
9. Select a durable database plan/replacement before the Free database expiry and restrict external IP access after client inventory.
10. Complete authenticated staging, physical-device, push, signed Android and iOS acceptance.
11. Close each GitHub issue only after its acceptance evidence is attached; do not close issues because a report or PR exists.

## 7. Safety boundaries

- No production database rows or schema were changed by the audits documented here.
- No Render plan, environment secret, IP allowlist or deployment was changed.
- No student-delivery gate was opened.
- No PR was merged.
- Curriculum approval is not source-rights approval, technical verification or independent subject QA.
- A successful schema test is not educational correctness; a successful build is not production release acceptance.


## 10. Live revalidation addendum — 2026-11-17 01:27 UTC

This addendum supersedes the earlier counts and CI descriptions above where they differ.

### Repository and curriculum
- `master` is the only integration branch; no PR was merged by this execution.
- Current master package loader registers five SS2 subjects (Agricultural Science, Biology, Chemistry, Mathematics, Physics) and two SS3 exam-preparation subjects (Agricultural Science, Biology).
- PR #969 adds SS2 Civic Education (26 draft units / 52 practice records); PR #974 adds SS2 Government (30 draft units / 60 practice records). Both remain open and student-delivery blocked.
- PR #974 head `67f6b241c6bb174454f8075a825916712c498d5b`: SS23 package contract, SS23 integrity and SS1 integrity passed. The shared JSS3 workflow failed only in the existing database test `tests/jss3-yo-license.db.test.mts`, assertion `prompts.length >= 2`. This execution did not modify JSS3.
- PR #977 adds gated SS23 subject discovery and student lesson UI. Its SS23 contract/integrity, SS1 integrity and backend learning-reference checks have passed on the observed head; mobile release and other project checks were still running at last inspection.
- Current open PRs: #969, #970, #971, #972, #973, #974, #977. Owner retains merge authority.

### Render live findings
- Workspace: My Workspace; Postgres resource `sts-school-db-2`, ID `dpg-dbqhddbrjlhs738a4s4g-a`, PostgreSQL 18.6, Frankfurt, Free, expiry `2026-12-12T01:30:29Z`.
- Database is 12 MB. Read-only counts: 1 user, 0 students, 0 attendance, 0 scores, 0 invoices, 0 messages; `backup_log` has one reminder and zero backup records.
- Live catalog: 40 public tables. `schema_migrations`, `school_events` and `rate_limit_counters` are absent; `app_bootstrap` and `backup_log` are live-only tables. Existing OPS-05 report documents nine missing audit columns, six missing indexes, two missing append-only triggers, one missing function and additional live-only columns that must be preserved.
- `sts-school-app` starts against the current database but exits with SQLSTATE `42P01` because `public.rate_limit_counters` is missing.
- `sts-school-backend` exits because it resolves stale hostname `dpg-dad2f32jnfac73e5j6r0-a` (`ENOTFOUND`), not the current DB hostname. The mobile client is configured to use this second service.
- Both backend services are on Free, deploy from `master`, point to the same repository, have no Render health-check path configured and permit all IPv4 sources (`0.0.0.0/0`). The database external allowlist is also `0.0.0.0/0`.
- No environment values, service settings, IP allowlists, production rows or schema were changed. The existing migration runner correctly refuses to adopt this drifted database without a reviewed baseline; do not bypass OPS-05.

### Backup workflow status
- PR #971's workflow run `43993155199` passed its actionlint validation job, but its actual backup job was skipped. The run produced no artifact. Therefore there is still no verified current backup or restore rehearsal.
- The Render Free database expires on 12 December 2026; a durable plan, backup destination and restore test remain urgent.

### Issue register
- Open: #951, #952, #954, #955, #976.
- #975 was confirmed to be a duplicate of #976, commented and closed with GitHub duplicate reason. The recovery task itself remains open.

## 11. Source archive recovery and curriculum continuation — 2026-11-17

The SS2 and SS3 combined source archives have now been recovered from the existing execution workspace and verified against their exact recorded SHA-256 values. The original source-access blocker is removed; no re-upload is required. See [SS23 source archive recovery register](../ss23/SOURCE_ARCHIVE_RECOVERY_20261117.md) on the Mathematics continuation branch / PR #980 for the full 100-member inventory, hashes, internal-header status and four version conflicts.

- SS2 archive: 61 members (47 DOCX, 13 DOC, 1 PPTX), SHA-256 `a97506c7f030a6e9604a13ae0aab30f59563a1473ec682f647459549dd9e1153`.
- SS3 archive: 39 members (28 DOCX, 11 DOC), SHA-256 `045e261aba9475b32b4cb963a2495faf3ddd503860b205aa1e89f0ac07d3c741`.
- The 100 member records span 21 subjects. All 100 archive members match the extraction manifest by byte count and SHA-256; 96 also match the earlier register, while four received candidate versions remain on hold pending a defensible version decision.
- Header reconciliation: 84 fully verified; 11 do not state term internally; five additional class/term anomalies require quarantine or review. The malformed SS2 T3 Mathematics DOCX was recovered from its exact OpenXML package (27 tables, 3 images and one embedded worksheet); visual reconciliation remains open.
- SS3 Third Term remains empty. Missing SS2/SS3 term sources remain missing and must not be fabricated.
- PR #980 extends SS2 Mathematics to 31 draft units and 82 practice records across all three terms (62 authored supplements plus 20 original source prompts). It retains unresolved source Week 2 and Week 10/11 sequence discrepancies, and does not clear assessments, visuals, rights or independent QA.

The remaining curriculum work is now source-backed and can proceed subject by subject. PR #980 is the current Mathematics continuation; the next subject work should follow the recovered source inventory. Packages remain pending until source assessments, visuals, answer marking, rights and independent subject QA are reconciled.


## 12. Latest PR and source implementation state — 2026-11-17 01:42 UTC

- PR #980 is now open: [SS2 Mathematics T2/T3 implementation and source archive recovery](https://github.com/PDS-David/sts-school-app/pull/980). It extends Mathematics from 10 First-Term units to 31 draft units across all three terms and 82 practice records (62 authored supplements plus 20 original source prompts). It also commits the recovered archive verification report and updates the SS23 checkpoint/handoff.
- PR #980 current head is the source-reconciliation update; all 31 Mathematics unit body hashes independently match. The current CI run must be checked against that latest head; the earlier head's SS23 package integrity, package contract tests, source validation and SS1 integrity passed. No JSS3 files were changed.
- Mathematics remains PENDING with all units DRAFT and verification DEFERRED. T2 Week 2 is explicitly unresolved; T2 Week 10/11 scheme/body mismatch remains blocking; 20 original T3 Week 8-9 prompts are transcribed; remaining original assessment blocks and visual items remain to be reconciled. Nine open items block delivery.
- Open PRs now include #969, #970, #971, #972, #973, #974, #977, #978 and #980 (nine total: eight implementation/operations PRs plus this gap-register PR). The owner retains merge authority; no PR has been merged by this execution.
- The two original curriculum archives are verified and available. The remaining source blockers are not archive access: they are the four unresolved version differences, five header anomalies, missing source terms, assessment/visual reconciliation, rights and independent subject QA.

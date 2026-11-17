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
- All seven packages on master are still `PENDING`; lesson implementation is draft and verification is deferred. The additional Civic Education PR preserves the same release gates.
- There are four open GitHub issues, four active implementation/operations PRs, and this gap-register PR.

## 2. SS2 and SS3 curriculum work remaining

### 2.1 Subject inventory

The 21 source subject slugs are:

Agricultural Science, Biology, Bookkeeping, Catering Craft, Chemistry, Civic Education, Commerce, Data Processing, Economics, English, Financial Accounting, Food & Nutrition, French, Further Mathematics, Geography, Government, Literature, Mathematics, Physics, Technical Drawing and Yoruba.

| Class | Subjects with a package on master | Additional package in open PR | No package yet |
|---|---:|---:|---:|
| SS2 | 5 of 21 | 2 (Civic Education, PR #969; Government, PR #974) | 14 |
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
| Mathematics | 10 | 20 | First Term only. Second- and Third-Term implementation is absent; coverage has UNRESOLVED rows. Three open items; no assets. |
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
9. Keep every package unavailable to students until the applicable gates and owner release authorization pass.

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

A read-only row-count query returned zero for students, attendance, scores, invoices and messages in this database. Confirm that this is the intended production database before any migration or service cutover.

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

### Open issues (all four currently open)

| Issue | Severity | Current finding | Required resolution |
|---|---|---|---|
| [#951](https://github.com/PDS-David/sts-school-app/issues/951) | P1 | Both Render backend services fail startup: missing PostgreSQL rate-limit table on one, stale DB host on the other. | Reconcile the canonical service/connection, complete approved migration adoption, configure readiness health and verify both services. |
| [#952](https://github.com/PDS-David/sts-school-app/issues/952) | P1 | Production schema drift, absent migration ledger, missing school-events/rate-limit tables and audit controls. | Recover historical migration origin, verify encrypted backup/restore, prepare exact baseline plan and apply only after owner approval. |
| [#954](https://github.com/PDS-David/sts-school-app/issues/954) | P1 | Free database expires 2026-12-12; Free plan has no backups/PITR. | Configure encrypted backups, pass restore rehearsal, then approve paid-plan upgrade or replacement migration before expiry. |
| [#955](https://github.com/PDS-David/sts-school-app/issues/955) | P2 | External database allowlist is `0.0.0.0/0`. | Inventory legitimate external clients, move service traffic to private networking and restrict external CIDRs. |

### Open PRs (none merged by this work)

| PR | Purpose | State |
|---|---|---|
| [#969](https://github.com/PDS-David/sts-school-app/pull/969) | SS2 Civic Education, all three terms: 26 draft units and 52 practice records. | Open; SS23 contract/integrity and SS1 integrity pass. An unrelated JSS3 check fails on its existing prompt-count assertion; JSS3 was not changed. |
| [#970](https://github.com/PDS-David/sts-school-app/pull/970) | Full read-only Render schema-drift inventory. | Open; documentation only. |
| [#971](https://github.com/PDS-David/sts-school-app/pull/971) | Encrypted scheduled Render Postgres backup workflow and restore instructions. | Open; requires two repository secrets before first successful run. |
| [#972](https://github.com/PDS-David/sts-school-app/pull/972) | Conventional Expo App entrypoint and updated Android readiness notes. | Open; Android debug APK build and emulator verification are running. |
| [#973](https://github.com/PDS-David/sts-school-app/pull/973) | This evidence-based application completion gap register. | Open; documentation only. |
| [#974](https://github.com/PDS-David/sts-school-app/pull/974) | SS2 Government First-Term: 10 draft units and 20 practice records; T2/T3 explicitly unresolved. | Open; package/loader regression checks pending. |


## 8. Additional product and administration gaps recorded in the existing app audit

These items were present in `APP_WIDE_AUDIT.md`, `AGENT_CONTINUATION.md` and `TODO.md`. They are distinct from the SS2/SS3 curriculum work and from the four current GitHub Issues.

### Not implemented or not complete

1. **Student creation UI:** `POST /students` and parent auto-provisioning exist, but the mobile Students screen is read-only. There is no Add Student form to collect the student and parent details; current creation relies on legacy import scripts.
2. **Fee-item and invoice creation UI:** backend endpoints exist and have validation, but Finance screens can only view existing fee items/invoices and mark an invoice paid. There is no in-app form to create fee items or invoices.
3. **Announcements:** no complete announcements/school-notice backend endpoint and delivery workflow is present; Student/Parent Home currently shows an empty-state placeholder.
4. **Teacher marking backlog:** submissions have no graded/ungraded marker, so the teacher dashboard's open-assessment count is not a true pending-marking count.
5. **Coming-soon modules:** Teacher Analytics and Calendar, Student Badges, Parent Upcoming Tests, Parent Calendar and School Events do not have complete backing data/workflows.
6. **Parent messaging scope decision:** parent messaging is scoped to the ward's class teacher. Whether parents should also contact subject teachers or school admins (for example, for billing) remains a product decision.
7. **Admin Edit User data integrity:** the edit modal still sends empty strings for nullable `school_code` and `assigned_class`. For admin/finance-admin accounts this can replace intended SQL NULL values with empty strings. This was flagged in `APP_WIDE_AUDIT.md` Part 4 and not fixed.
8. **Finance-admin role audit:** student, parent, teacher and admin surfaces were audited in `APP_WIDE_AUDIT.md`; the separate `finance_admin` role was explicitly out of scope and has not had the same full screen-to-route, RBAC and data-scope audit.
9. **Pre-login flow audit:** `StudentSelfClaimScreen` and `ActivateAccountScreen` were not included in the completed student-role audit; their full error-path and abuse-case review remains unverified.
10. **Report-card school details:** the term-report PDF code now implements the agreed layout (position included; motto is embedded in the crest; attendance/remarks/next-term are excluded), but the Primary school's address and phone in `mobile/src/schoolBranding.ts` are still placeholders copied from Model College.
11. **Report position/permission decision:** the term report currently always includes subject and overall position. The older TODO's requested optional position-column setting and the question of whether teachers should gain print/export access were not evidenced as implemented. Current print/export remains intentionally restricted to admin and parent.
12. **Class management:** classes are seed-defined; there is no create/edit class route or admin workflow. The existing admin class-summary ranking query uses class name without school code, which is not currently reachable as a cross-school bug because class names are seed-defined and non-overlapping, but must be fixed if class management or overlapping names are introduced.
13. **School onboarding:** the app is configured around the two seeded campuses (`primary` and `secondary`). No self-service workflow for onboarding a new school/campus and its branding, users, classes and fee configuration is verified.
14. **PDF acceptance:** report PDF HTML has A4/one-page styling and the owner-approved content decisions are reflected in code comments, but a fresh physical-device print/export acceptance with the actual Primary and Secondary logos/contact details is not recorded.

### Intentionally restricted — do not build these as missing features

- Students view their own attendance; they do not enter or edit physical-classroom attendance. Teachers enter attendance from the physical register.
- Students may view their report card on-screen but cannot print/export it. Report-card printing/export is admin and parent only.
- Teachers do not create assessments or question prompts; these are admin/Brainee responsibilities under the explicit RBAC policy.
- Teachers do not use security-question self-service password recovery; password reset is admin-managed.
- Topic-completion AI content is available once the account is active; there is no per-item admin approval gate.
- Locked curriculum topics are deliberately disabled until the required PIN/prior-topic completion condition is satisfied.

## 9. Existing app-wide audit status

`APP_WIDE_AUDIT.md` records Parts 0–5 as completed or resolved: database compatibility against the schema at the time, student/parent/teacher/admin audits, parent cross-campus provisioning, and AdminUsers layout. That audit was performed against the former database before its recorded 2026-10-04 expiry. It does **not** prove the current `sts_school_db_2` is the same database or contains the same data. The new Render database has a different ID and must be treated as a fresh, separate production state until recovery is proven.

The four-role audit does not include `finance_admin`. The old app-wide audit also records that the mobile-to-backend route map had zero endpoint mismatches at the time of that audit; this should be rerun after the current deployment/database repair, not treated as a live production health check.

## 6. Work order to finish

1. Complete PR #972 mobile CI; fix any actual export/emulator failures without masking them.
2. Complete PR #969's remaining SS2 Civic Education assessment/visual/QA work; keep it blocked from student delivery until those gates pass.
3. Add the next source-backed SS2 subject package and tests, then continue subject-by-subject through the 15 remaining SS2 subjects.
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

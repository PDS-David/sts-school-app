# R7 — JSS3 production release plan (PREPARED, NOT APPROVED, NOT EXECUTED)

> **Status banner.** This is a plan. Nothing was deployed, imported, migrated, attached or restored. No production system, production database or backup was contacted or provided. No staging copy exists, so **no rehearsal on an isolated staging copy was performed** (§7). Owner approval has **not** been given. Do not describe this as "released" or "students are using the update". Operations below may only be run by a separately assigned release operator after the owner approves the concrete, filled-in plan (§9).

Every `<PLACEHOLDER>` below is something this task was not given. Placeholders are deliberately not guessed (no hosting paths, service names, database URLs, backup tools or thresholds were invented).

## 1. Identity of the release

| Item | Value | Source / status |
|---|---|---|
| Repository / target branch | `PDS-David/sts-school-app`, `master` | task |
| Functional candidate | `1adf443d33a864b130d519ca45182eb56625674b` (merge of PR #48) | `CURRENT_INTEGRATION_STATUS.md` |
| `master` HEAD when this plan was written | `3678e0e04e873d9f1f181cc64987db937e5f2e5f` — differs from the candidate by **one documentation file** (`git diff --stat`: `CURRENT_INTEGRATION_STATUS.md` only) | observed |
| **Release SHA to be executed** | `<CANDIDATE_SHA>` — **the owner must pin one full 40-character SHA at approval.** It must be a commit that passed §6 of PREFLIGHT.md. This plan does not pin one because the candidate is not yet release-eligible (§8). | OPEN |
| Currently deployed version | `<DEPLOYED_SHA>` — **unknown**. Nobody has supplied read access or a deployment record. | OPEN |
| Production API / DB / hosting | `<PROD_API_BASE_URL>`, `<PROD_DB_HOST>`, `<PROD_DB_NAME>`, `<DEPLOY_METHOD>` — **not designated** | OPEN |
| School scope | `school_code = 'secondary'` | importer flag `--school-code secondary` (`ingestTopics.ts`) |
| Class scope | `class_name = 'JSS 3'` only. SS 3 is audit-only in the importer (`ingestTopics.ts:57,807-808`). All other classes (Primary, JSS 1, JSS 2, SS 1–3) must be byte-unchanged. | code + contract |
| Term scope | 1st Term (83 supplements) and 2nd Term (87). 3rd Term: **0** instructional rows (BECE preparation; the importer has a gate for this, `ingestTopics.ts:851`). | observed from `jss3Supplements.json`; contract |
| Content in the candidate | 170 supplement lessons, 65 delivery corrections, 3 third-party attribution records, ~15 MB of assets under `curriculum-assets/jss3` | counted from the checked-in data files on `3678e0e`; **historical totals (313/483/317/41) are not used** |

## 2. Separate production writes — each needs its own approval

The contract forbids bundled implicit approval. Each row is an independent decision; the owner may approve some and not others. "Proposed order" is a hypothesis to be confirmed in the rehearsal.

| ID | Write | What it changes | Reversible how | Command source |
|---|---|---|---|---|
| **W0** | Backup (read-only on production) | nothing in production | n/a | PREFLIGHT §3 |
| **W1** | Schema (`schema.sql`) — **only if the schema diff in PREFLIGHT §5 shows a needed change** | adds columns/tables/indexes; see §3.1 for the lock | restore from W0 (additive changes are otherwise left in place) | `npm run db:migrate` |
| **W4** | Backend code deployment | the running API: delivery-correction resolver, attribution register, supplements JSON bundled into the build | redeploy `<DEPLOYED_SHA>` (but see ROLLBACK §2 ordering rule) | `<DEPLOY_METHOD>` |
| **W2** | Curriculum rows | **inserts** up to 170 `topics` rows (+ `subjects` if missing), JSS 3 only, appended at the end of each bucket | scoped delete of added rows (ROLLBACK §3) or restore | `ingestTopics.ts --jss3-supplements --yes` |
| **W3** | Assets | inserts `topic_assets` rows (image bytes are stored **in the database**, `topic_assets.bytes`) | scoped delete of added assets / restore | `attachTopicAssets.ts --apply`, one run per manifest |
| **W5** | Stale generated caches | **no separate write exists.** Retirement happens lazily, on first contact per topic, after W4 (§5.3). There is no eager sweep script in the repository; this plan does not invent one. | n/a | — |
| **W6** | Mobile app binary | **not part of this plan.** R5 changed only staging build/URL guards; no lesson/asset/progression logic was changed. Whether the currently distributed app renders the new assets/attribution is **unverified** (device gate open, §8 B6). | n/a | — |

Proposed order: W0 → (W1 if needed) → W4 → W2 → W3, with the post-step checks in PREFLIGHT §8 after each. Reasoning (code-read, to be confirmed): the delivery-correction resolver matches **already-imported audited rows by hash** (`jss3DeliveryCorrection.ts`), so deploying W4 first makes corrections effective for existing rows without touching them; W2/W3 then add the new lessons and their images. App deployment (W4) and database content (W2/W3) are distinct operations and are never run as one step.

## 3. What the real code does — and what it does not prove

Evidence below is from reading `3678e0e`; "proves" means the code path exists and is covered by tests R6 reports passing, **not** that production data is compatible.

### 3.1 Importer (`backend/src/db/ingestTopics.ts`) and existing topics
- **Insert-only, never overwrites.** The only topic write is `INSERT … ON CONFLICT ON CONSTRAINT topics_ingestion_dedupe DO NOTHING` (batches of 200, inside one transaction: `BEGIN` at line 1014, `COMMIT` at 1181, any error → `ROLLBACK`). The constraint is `UNIQUE (school_code, subject_id, class_name, term_label, order_index)` (`schema.sql:637-639`), so a duplicate identity cannot be created (observed on a disposable DB: second insert at an existing identity → `topics_ingestion_dedupe` violation).
- **Original identities are preserved because supplements are appended.** With `--jss3-supplements`, supplements are "appended, never interleaved" (`ingestTopics.ts:793-802`); `order_index` is a per-(class,subject,term) counter (`:809-813`), so existing positions only stay stable if the originals come first in the same order as when production was imported.
- **Other classes are not overwritten.** Before inserting, the importer compares *every existing row in the affected (subject, class, term) buckets* with the audited plan and **aborts the whole transaction** with "Existing curriculum differs from audited sequence … nothing will be overwritten" if any existing row differs in `order_index`, `title`, `source_file` or `source_reference`. After inserting it re-verifies every planned row and aborts if any is missing/changed. Only buckets named in the plan are examined; classes not in the plan are never read or written. **Gate:** the dry-run output must list `JSS 3` as the only class (PREFLIGHT §7).
- **What this does *not* prove:** (a) The dry run (no `--yes`) "does no database connection" (`ingestTopics.ts:1000`), so **no dry run can show compatibility with production**. Compatibility is checked only inside the write transaction. Therefore compatibility must be *rehearsed on a restored copy* (§7); in production the in-transaction check is the safety net (failure ⇒ nothing written). (b) It cannot apply a corrected body to a row that already exists: a changed body at an existing position is an abort, by design. If production already contains earlier supplement rows whose text has since changed, W2 will abort; the remedy is a separate, owner-approved decision — **not** an ad-hoc `UPDATE`. Whether this applies is unknown until `<DEPLOYED_SHA>` and production contents are known.
- **Lock / maintenance:** W2 takes `LOCK TABLE subjects, topics IN SHARE ROW EXCLUSIVE MODE` for the life of the transaction (`:1015`). Reads continue; **writes to `topics`/`subjects` wait**, including `learning.ts` lines 491 and 572 (`UPDATE topics SET summary / generated_assessment_id`) and the cache retirement (`SELECT … FOR UPDATE`). The expected duration (≈170 rows, 1 batch) is short but **not measured** — measure it in the rehearsal and decide `<MAINTENANCE_DECISION>` (low-traffic window vs. announced pause).
- **Schema (W1) lock:** `npm run db:migrate` re-runs the whole `schema.sql`, which contains `DROP CONSTRAINT IF EXISTS topics_ingestion_dedupe` followed by `ADD CONSTRAINT … UNIQUE` (`schema.sql:637-639`). On a populated production `topics` table that rebuilds the unique index under an exclusive table lock and fails if duplicates exist. Deployment does **not** run migrations automatically (`index.ts:108-113`), so W1 is a deliberate step. Applying `schema.sql` twice to an empty disposable database succeeded (observed); behaviour on a populated table is **untested**. Decide W1 from the schema diff (PREFLIGHT §5), not by habit.

### 3.2 Things that must never be run for this release
`topicsDuplicatePairs.ts --yes` (it `DELETE`s topics; `topic_completions` and `topic_assets` cascade — real student progress would be lost), `resetAcademicData`, `renameClassNaming`, `cleanupStaleClasses`, `fixStaleAssignedClasses`, `db:seed`, `db:bootstrap` (clean-install only), and any run of `run_acceptance.py` or the importer with `--yes` against production URL without W2 approval. **`npm run db:check-drift` is *not* read-only:** it creates and drops a throw-away schema inside the target database (`checkDrift.ts:127,230`). Run it only on the restored copy, never on production under the read-only preflight.

## 4. Protected-row comparison before and after the release

Two different things must not be conflated:

1. **Historical certification (R4) — still BLOCKED.** The owner-held certified export/provenance and release snapshot were never supplied; the 2,179 figure is neither confirmed nor refuted. This plan does **not** claim or substitute for it. Its status is carried into §8 as B3 for the owner to decide whether it gates this release. Commands: `R4_PROTECTED_COMPARISON/REPORT.md`.
2. **Release-delta guard (this task) — tooling ready, not yet run on real data.** Proves "this release changed nothing it was not meant to" by comparing production **just before** with production **just after**:
   - `snapshot_release_state.sql` (read-only, `REPEATABLE READ`): per-topic identity (`school_code, class_name, subject_name, term_label, order_index`), SHA-256 digests of the audited columns (`title, description, source_reference, source_file`) and, separately, of the mutable cache columns (`summary, generated_assessment_id`), plus per-topic completion/asset counts and table counts. Hashes and counts only. It covers **every class**; the existing protected export covers only Primary/JSS1/JSS2 and would not see JSS 3 or SS rows.
   - `compare_release_delta.py`: **FAIL** if any pre-existing row disappears, any pre-existing row's audited-column digest changes (any class, including the 313 JSS3 originals), an addition falls outside `--allow-add-class "JSS 3"`, an addition is not strictly after the highest pre-release `order_index` in its bucket, a duplicate identity appears, or `topic_completions`/`submissions`/`students` counts fall. Cache-digest changes are reported as INFO (students legitimately generate summaries; JSS3 corrections retire caches).
   - Negative controls observed on a disposable PG 16 database (REPORT.md): append-only JSS 3 additions → PASS; the same additions with the class not allowed → FAIL; overwritten JSS 2 original → FAIL; deleted Primary 1 row → FAIL; changed JSS 3 original title → FAIL; added row below existing indexes → FAIL; malformed input → exit 2.
   - Take the "before" snapshot immediately before W2 (after W4 if W4 is done first) so live student activity between snapshots is minimal; completion counts may legitimately rise, they must not fall.
   - Run the same snapshot on the **restored copy** to show the restored copy equals production at backup time (PREFLIGHT §4).

## 5. Assets, attribution, corrected content, obsolete generated assessments

### 5.1 Assets (W3)
`attachTopicAssets.ts` never inserts/updates/deletes `topics`; it resolves each topic by importer identity (school, subject, class, term, `order_index`), optionally guarded by an expected title, verifies every file's SHA-256 against the manifest *before* any database work, runs `--apply` in one transaction, and is idempotent (`ON CONFLICT (topic_id, asset_key) DO NOTHING`; same key with different bytes → abort, never overwritten). Dry run is the default. Per-manifest arguments come from `scripts/jss3/staging_attach_plan.py` (needs the importer dry-run log); the manifest/row totals must be **recomputed from current manifests**. The asset files live in the repository at the pinned SHA and are **not** part of the app deployment: the operator needs that exact checkout. Images are served by `GET /learning/topics/:id/assets` and `/learning/assets/:id` (`learning.ts:235-322`) from the database. Database growth ≈ asset bytes (~15 MB) — confirm headroom.

### 5.2 Attribution
Three third-party lessons (`SUP-YO-ORAL-TEXTS`, `SUP-YO-ORAL-GENRES`, `SUP-YO-LICENSED-STORY`) carry attribution records in `jss3Attributions.json` bound to the lesson body hash (PR #46 tests, incl. negative controls). Attribution is delivered by **code (W4)** and requires the lessons to exist (**W2**). Rolling code back while leaving those rows in place could serve them without credit — see ROLLBACK §2.

### 5.3 Corrected content and obsolete generated assessments
- **Corrected teaching for already-imported audited rows is delivered at read time from code**, not by editing rows (`jss3DeliveryCorrection.ts`: SHA-256 of the stored `source_reference` matches a correction → corrected text; the audited original is never served; stored changed text → "withheld"). `topics.source_reference`, `submissions` and `topic_completions` are never rewritten. This lives in **W4**.
- **Obsolete generated assessments** (built from the original text) are retired **lazily**: on first contact with a corrected topic (`learning.ts:452`, `:848`, `:979`, `:1039`) the cached `summary` is replaced and a linked assessment whose fingerprint differs is set to `status='closed'` and unlinked (submissions and completions untouched). Consequences to put in front of the owner: (a) retirement happens after W4 as students/teachers touch topics, not at a controlled moment; (b) a student with such an assessment open will be told it was withdrawn; (c) the size of exposure can be bounded before release with `preflight_cache_exposure.sql` (counts by status; an upper bound, not the in-scope set). Choose a window with no JSS 3 assessments in progress: `<RELEASE_WINDOW>`.
- **Gap:** there is no eager retirement tool. If the owner wants all caches retired at a controlled moment, that is a new code task with its own approval; it is not in this plan.

## 6. Transaction boundaries, maintenance, failure conditions

| Step | Atomic unit | On failure |
|---|---|---|
| W1 schema | one `pool.query(schema.sql)` (multi-statement; whether PostgreSQL treats it as one implicit transaction on this script is **to be confirmed in rehearsal** — `schema.sql` has no explicit `BEGIN/COMMIT`, checked) | stop; do not retry blindly; owner decides restore vs. fix-forward |
| W2 curriculum | one transaction (`BEGIN`…`COMMIT`), `SHARE ROW EXCLUSIVE` lock | automatic `ROLLBACK`; verify with snapshot that nothing changed |
| W3 assets | one transaction **per manifest** (so earlier manifests stay applied if a later one fails) | automatic rollback of the failing manifest; earlier ones are idempotent and may remain |
| W4 deploy | `<DEPLOY_METHOD>` | redeploy previous build per ROLLBACK §2 |

**Stop-and-rollback decision rules (thresholds are *proposals*; the owner confirms or changes them in §9):**
1. Any importer/attach error → stop; nothing was committed by the failing transaction; do not proceed to the next write.
2. Post-step `compare_release_delta.py` verdict FAIL (any class) → stop; **owner decides** between fix-forward, scoped data rollback (ROLLBACK §3) and restore (ROLLBACK §4). Never "repair" with ad-hoc SQL.
3. Smoke failure (PREFLIGHT §9): a corrected topic returns the audited original text; an attributed lesson is shown without its credit; login or JSS 3 topic list fails; asset endpoint returns non-200 for an attached asset.
4. Sustained 5xx on `/learning/*` above `<ERROR_RATE_THRESHOLD>` for `<OBSERVATION_MINUTES>` after W4. (No health endpoint exists; `GET /` returns `{status:'ok'}` and only proves the process is up.)
5. Restored-progress integrity (only if ROLLBACK §4 is used): see ROLLBACK §4.3.

## 7. Rehearsal on an isolated staging copy — NOT PERFORMED

No staging target, restored copy, accounts or devices were supplied (`D_PREP/TARGET_CHECKLIST.md` rows still NOT PROVIDED; R5 Phase 2 not performed). The rehearsal must cover, on a **restore of the real production backup** (so compatibility with real rows is actually tested), with results recorded in `REHEARSAL_RESULTS.md` (to be created by whoever runs it; no fabricated PASS):

| # | Rehearsal item | Why it cannot be inferred |
|---|---|---|
| 1 | restore the W0 backup into `<STAGING_DB_NAME>` (name must match `staging_*`/`stg_*`/`jss3_staging_*`/`jss3_test_*`); run `snapshot_release_state.sql`; equals production-at-backup | proves the backup is restorable |
| 2 | `db:check-drift` on the copy; apply W1 only if drift requires it; measure lock time | `schema.sql` on a populated `topics` is untested |
| 3 | importer `--yes` on the copy | the only way to exercise the in-transaction compatibility check on real rows; expected line `Inserted N new topic row(s); verified M identical` |
| 4 | asset dry-run then `--apply` for every manifest; second dry-run shows 0 planned | idempotency on real topics |
| 5 | backend build from `<CANDIDATE_SHA>`; confirm `dist` contains the JSON data (`resolveJsonModule`) and the server starts | build artefact not inspected |
| 6 | smoke against the copy (PREFLIGHT §9) incl. corrected-topic text, attribution, asset bytes, lazy cache retirement | end-to-end behaviour |
| 7 | before/after `compare_release_delta.py` on the copy | real-data PASS |
| 8 | rehearse ROLLBACK §3 on the copy and re-snapshot | rollback must be proven, not assumed |
| 9 | measure W2 lock time and W4 downtime | to set `<MAINTENANCE_DECISION>` |

Tooling checks that *were* performed (synthetic data only, disposable local PostgreSQL 16) are in REPORT.md §3.

## 8. Remaining release blockers (visible, not waived)

| ID | Blocker | Owner | Evidence |
|---|---|---|---|
| B1 | No designated production target, read-only access, or record of `<DEPLOYED_SHA>`; school/DB/host values unknown | owner | this task |
| B2 | Backup method, location, completion evidence and restore procedure not supplied; no restore rehearsal | owner / operator | PREFLIGHT §3-4 |
| B3 | R4 protected-row historical comparison BLOCKED (certified export + provenance + release snapshot + I4/I6/I7/I8 decisions not supplied). The new release-delta guard does **not** replace it; owner to state whether R4 gates this release | owner | `R4_PROTECTED_COMPARISON/REPORT.md` |
| B4 | R6 full-source acceptance **not run** at any candidate (private `JSS3_NEXT_STAGE_INPUTS_20261016.zip` unavailable): 54 static + 5 real-DB tests skipped, including the delivery-correction/assessment-cache DB test, batch2/v1/v2/v3 asset tests; fresh capture, 313-original equality and regenerated records not re-observed | owner → integrator | `CURRENT_INTEGRATION_STATUS.md` |
| B5 | No isolated staging copy; §7 rehearsal not performed | owner / operator | §7 |
| B6 | Device acceptance not performed (R5 Phase 2): images, GIFs, Yoruba diacritics and attribution text on a phone; whether the currently distributed app build suffices (no new app build is planned) | owner / tester | `R5_STAGING_DEVICE/REPORT.md` |
| B7 | Yoruba distribution choice (keep BY-SA excerpts vs. pointers) for `SUP-YO-ORAL-TEXTS` and `SUP-YO-ORAL-GENRES` | owner | `CURRENT_INTEGRATION_STATUS.md` |
| B8 | Sequencing policy D1–D8 / placement unapproved and Task 05 unimplemented: owner must state that this release ships the current appended order and that any later re-sequencing is a separate release (re-sequencing changes `order_index`, which the importer would abort on) | owner / teacher | `S_PREP`, `R2_SEQUENCING` |
| B9 | No approved smoke account in production and no health endpoint; without one, authenticated smoke checks (§6 rule 3) cannot be run in production without using a real student's account, which this plan forbids | owner | PREFLIGHT §9 |
| B10 | `<DEPLOY_METHOD>`, `<RELEASE_WINDOW>`, `<MAINTENANCE_DECISION>`, thresholds, operator identity not decided | owner | §6 |

**Not blockers (scope, not waivers):** Ọya and iwì text lessons are **not in this candidate** (no Ọya/iwì lesson was delivered; PRs #36/#38/#45), so their missing permission/source does not gate shipping what *is* in it; labelled source-backed equivalent teaching already accepted by the owner is not re-listed as a blocker. Practical performance observation and school approval remain separate and are **not** inferred from tests. "Y3 remaining wording/book work" was not touched by R6; the owner should confirm whether it gates this release (it is listed in the status file as the coordinating agent's item).

## 9. Owner approval statement (to be completed and signed off *after* B1–B10 are closed)

> I, `<OWNER_NAME>`, approve release operator `<OPERATOR_NAME>` to execute **only** the operations ticked below, on **`<PROD_ENV_NAME>`** (`<PROD_API_BASE_URL>`, database `<PROD_DB_NAME>` on `<PROD_DB_HOST>`), from the repository at the exact commit **`<CANDIDATE_SHA — 40 hex>`** (functional candidate `1adf443d33a864b130d519ca45182eb56625674b` unless re-pinned), for **school `secondary`, class `JSS 3`, terms 1st and 2nd**, adding at most **`<N_EXPECTED_ADDED_TOPICS>`** topic rows and `<N_EXPECTED_ASSETS>` assets and changing **no** existing row in any class.
> - [ ] W0 backup `<BACKUP_ID>` taken by `<BACKUP_METHOD>` at `<UTC_TIME>`, restore rehearsed on `<STAGING_DB_NAME>` (result recorded in `REHEARSAL_RESULTS.md`).
> - [ ] W1 schema, only the changes listed in the signed schema diff `<SCHEMA_DIFF_REF>`.
> - [ ] W4 backend deployment via `<DEPLOY_METHOD>`.
> - [ ] W2 curriculum import (`ingestTopics.ts --school-code secondary --jss3-supplements --yes`).
> - [ ] W3 asset attach for manifests `<MANIFEST_LIST>`.
> Window: `<RELEASE_WINDOW>`. Rollback: PLAN §6 rules with thresholds `<ERROR_RATE_THRESHOLD>` / `<OBSERVATION_MINUTES>`, and the choice between ROLLBACK §2/§3/§4 reserved to me. Not approved: mobile app release, cache sweep, re-sequencing, any other class, any other school, any deletion.
> Date/time and signature: `<OWNER_SIGNATURE>`

Until this statement is completed by the owner, **no production write is authorised.**

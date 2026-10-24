# R7 — JSS3 production release plan: report

**Plan prepared. Nothing deployed, imported, migrated, attached or restored. No production or staging system, backup, credential for those, or real student data was contacted or used. Owner approval: not given. Rehearsal on an isolated staging copy: NOT PERFORMED.** This report must not be cited as "released" or "students are using the update".

## 1. Inputs and base
- Task: R7 (prompt of 24 Oct 2026). Repository `PDS-David/sts-school-app`, target `master`.
- Base: `master` `3678e0e04e873d9f1f181cc64987db937e5f2e5f` (R6 integration status merged). Functional candidate per R6: `1adf443d33a864b130d519ca45182eb56625674b`; the two differ by one documentation file (`git diff --stat`).
- Branch: `jss3/r7-release-plan-20261024-q4n8`. PR: see §6.
- `AGENTS.md`: does not exist (consistent with R4/R5). Read: `EXECUTION_CONTRACT.md`, `14_FINAL_RELEASE_PLAN_ONLY.md`, `CURRENT_INTEGRATION_STATUS.md`, `R4_PROTECTED_COMPARISON/REPORT.md`, `R5_STAGING_DEVICE/REPORT.md`, and the actual code: `ingestTopics.ts`, `attachTopicAssets.ts`, `jss3DeliveryCorrection.ts`, `learning.ts` (cache/assessment paths), `schema.sql`, `migrate.ts`, `checkDrift.ts`, `pool.ts`, `index.ts`.
- **R6 "acceptance evidence" is a status report, not an acceptance run.** R6 (`CURRENT_INTEGRATION_STATUS.md`) states it did *not* run the full-source acceptance (private ZIP unavailable) and that 54 static + 5 real-DB tests were skipped. R4 is BLOCKED; R5 Phase 2 (staging/device) was not performed. This plan therefore treats the candidate as **not release-eligible**, per the task's instruction not to assume prerequisites passed.

## 2. Findings from the code that shaped the plan
1. The importer is **insert-only** with a strong in-transaction guard, but its dry run never connects to a database, so **compatibility with production cannot be shown by a dry run** — only by rehearsal on a restore (PLAN §3.1).
2. It cannot apply changed text to an existing row; corrected teaching for already-imported audited rows is delivered **at read time by code** (hash match), and stale generated assessments are retired **lazily** on first contact, closing any open one. There is no eager sweep tool (PLAN §5.3).
3. `db:migrate` re-runs all of `schema.sql`, including a drop-and-recreate of the `topics` unique constraint (exclusive lock on a populated table); deployment never runs it (PLAN §3.1).
4. `db:check-drift` writes (creates/drops a throw-away schema) — unsafe under a read-only production preflight; restricted to the restored copy (PLAN §3.2, PREFLIGHT §5).
5. The existing protected-row export covers **Primary/JSS1/JSS2 only**; it cannot see JSS 3 or SS rows. A release-delta guard over every class was added (PLAN §4).
6. `topics` deletion cascades to `topic_completions` and `topic_assets`; this drives the rollback design (ROLLBACK §1, §3).
7. Rolling back code while leaving the attributed Yoruba lessons live could serve them without credit; ordering rule in ROLLBACK §2.
8. There is no health endpoint; `GET /` only proves the process is up (PREFLIGHT §9).

## 3. What was actually run (disposable local PostgreSQL 16.15, synthetic rows only; no real data)
| Check | Result (observed 24 Oct 2026) |
|---|---|
| `psql -f backend/schema.sql` on an empty `jss3_test_r7`, twice | both exit 0, no errors (idempotent on an empty DB; **not** evidence about a populated production table) |
| `snapshot_release_state.sql` under `default_transaction_read_only=on` | ran; JSON with counts and digests only (10 synthetic rows) |
| `compare_release_delta.py` case 1: append-only JSS 3 additions, `--allow-add-class "JSS 3"` | exit 0, PASS, `added_by_bucket` = JSS 3 / Mathematics / 1st Term: 2 |
| case 2: same additions, class not allowed | exit 1, FAIL (`unexpected addition in class JSS 3`) |
| case 3: JSS 2 original `source_reference` overwritten | exit 1, FAIL (`content changed`) |
| case 4: Primary 1 row deleted | exit 1, FAIL (`removed/missing`) |
| case 5: JSS 3 original title changed | exit 1, FAIL (`content changed`) |
| case 6: added row with `order_index` below the existing maximum | exit 1, FAIL (`not appended after existing rows`) |
| case 7: malformed snapshot | exit 2 (BLOCKED) |
| case 8: insert at an existing identity | rejected by `topics_ingestion_dedupe` |
| `preflight_cache_exposure.sql` (read-only) | ran, returns `[]` on the synthetic data |
| `rollback_added_rows.sql.template` with correct boundary, inside `BEGIN … ROLLBACK` | selected exactly the 2 added rows |
| same template, boundary off by one | refused: `R7 rollback guard: 3 rows selected, expected 2`; nothing deleted |

These show the **tooling** does what it claims on synthetic data. They are **not** a rehearsal of the release and say nothing about production data or the real backup. Not re-run here (no change since R6 on `1adf443`, which differs from this base by documentation only): `tsc`, `node --test tests/*.cjs` (32/32), static TS suites, Python unittests, real-PostgreSQL route tests. Not run at all (inputs unavailable): `run_acceptance.py --archive …`, the importer, the attach tool, any backend build/deploy.

## 4. Deliverables
`PLAN.md`, `PREFLIGHT.md` (preflight + apply + postflight), `ROLLBACK.md`, `REPORT.md`, and supporting tooling in the same folder: `snapshot_release_state.sql`, `compare_release_delta.py`, `preflight_cache_exposure.sql`, `rollback_added_rows.sql.template`. No credentials, raw student data, row exports or database dumps are in Git (checked: a search of the folder for the access token and for dump/export file types found nothing).

## 5. Statuses (kept separate)
| Dimension | Status |
|---|---|
| Plan documents | prepared; for review |
| Tooling | written; tested on synthetic data only |
| Candidate verification (R6 gate) | **not done** (B4) |
| Protected-row historical comparison (R4) | **BLOCKED** (B3); release-delta guard ready, not run on real data |
| Backup / restore evidence | **not supplied** (B2) |
| Rehearsal on isolated staging copy | **NOT PERFORMED** (B5) |
| Device / learner acceptance | **NOT PERFORMED** (B6) |
| Owner decisions outstanding | B1, B3, B7, B8, B9, B10 (PLAN §8) |
| Owner approval of the concrete plan | **not given**; statement template in PLAN §9 |
| Production writes | **none**; none authorised |
| Deployment / "students are using the update" | **no** |

## 6. Publication
Branch pushed and PR opened by this task; **not merged** (integrator merges documentation after review, per the contract). PR URL: recorded in the PR itself and in the hand-off message.

## 7. Security note
The GitHub personal access token written in the task prompt was used only to clone, push the branch and open the PR, passed through a request header for each command and never stored in a remote URL, git config, file or log of this repository. `CURRENT_INTEGRATION_STATUS.md` already records that a token pasted in plain text was used in earlier sessions and should be revoked. **Revoke this token and issue a narrowly scoped replacement (single repository; Contents and Pull requests write only) delivered by a secret store, not chat.**

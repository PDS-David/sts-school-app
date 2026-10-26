# Task 08 — staging/device acceptance, then an authorised production release

**TASK 08: BLOCKED.** No staging target, population authority, HTTPS origin, credentials, EAS access, accounts, tester or device were supplied, and the gates it depends on are open. Therefore: **no staging was populated, no build was made, no device observation was made, no production operation was prepared for approval or executed, and nothing was deployed.** This is not "fully complete", and no restricted pilot is proposed (that would be a separate owner decision).

Base: master `2f2232fc74de417ebf29e3feb33246bbf8980325` (PR #62 merged; no open PRs). Branch `jss3/task08-20261026-staging-release`. Tested tree = that base; this PR adds this report and `R7_RELEASE_PLAN/UPDATE_20261026.md` only. `AGENTS.md` does not exist.

## Dependencies required by the task
| Required | State |
|---|---|
| Final candidate SHA | **not pinned** (owner pins at approval) |
| Task 06 PASS | **BLOCKED** — private ZIP absent; full acceptance never run |
| Task 07 actual comparison | **BLOCKED** — inputs A/B not supplied |
| Task 05 approved policy or explicit blocked state | policy recorded (D1 non-gating, legacy floor); implementation **merged but inert** (empty plan); activation needs D6, D7, placement response — PARTIAL |
| Task 04 content status | **BLOCKED** — no eligible Ọya passage; YO-SL-094 open |

## External values needed — all NOT PROVIDED (checked the existing task/chat/repo first; nothing to reuse)
Named staging target with confirmation it holds no real students · authority to populate it · bare HTTPS API origin · disposable PostgreSQL 16 target · JWT secrets and DB credentials held securely · intended `TERM_PIN_ENFORCED` value (D7) · Expo/EAS access · synthetic admin, JSS 3 student and other-class accounts · named tester, Android model/OS, TalkBack availability · the private corpus ZIP. No secret belongs in chat or Git.

## Independent work done (observed, node v24.19.0, Python 3.12.3, PostgreSQL 16.15 loopback; `npm ci --ignore-scripts` exit 0, lockfile unchanged)
| Check | Result |
|---|---|
| `tsc --noEmit` mobile / backend | exit 0 / exit 0 |
| `node --test tests/*.cjs` (includes the staging API-target guard and real-bundle tests) | 32 pass, 0 fail, 0 skipped |
| `tests/test_jss3_device1_preflight.py` | 10 tests OK |
| `device1_preflight.py` refusal paths (no network; no output directory created) | exit 3 with no `JSS3_STUDENT_TOKEN`; exit 3 without `--staging-confirmed`; exit 3 for the app.json production host |
| Contract confirmations | token variables are `JSS3_STUDENT_TOKEN` and `JSS3_OTHER_CLASS_TOKEN`; `eas.json` `staging` profile extends `preview` and sets only `STS_BUILD_TARGET=staging` (the API origin must come from `EXPO_PUBLIC_API_URL`); STAGE1 runbook, TARGET_CHECKLIST, DEVICE1 observation CSV and R5 report all exist at their documented paths |
| R7 B11 (is master auto-deploy on?) | **not closable here.** GitHub shows no deployments/environments and no host status on master; webhooks unreadable (403). Owner must read the host dashboard |

## Important finding (observed on a disposable database)
Task 05 made `GET /learning/topics` and `POST /learning/topics/:id/complete` depend on a new column, `topics.sequence_rank`, while deployment never runs migrations. On the pre-Task-05 schema the topic-list ORDER BY fails with `column t.sequence_rank does not exist`; it works after the additive `ADD COLUMN` alone. If production auto-deploys from master and the schema was not migrated, learner topic listing may already be failing. I did not look at production (not authorised). **Owner: check the host deploy history for `d8151f4` or later and the live topic list.** Details, W1 options and the corrected ordering (W0→W1→W4→W2→W3 is now required, not proposed) are in `R7_RELEASE_PLAN/UPDATE_20261026.md`, which also refreshes the supplement/attribution counts (171 / 4), narrows B8 and adds B12.

## Not performed (each needs the inputs above; none was fabricated or substituted)
STAGE1 §0–§8 (bootstrap, importer dry-run review, staging import, asset plan and attach, synthetic accounts, schema/HTTPS check) · EAS `staging` build, resolved-config and installed-build verification, build ID / APK hash · API preflight against staging · every student journey (sign-in/PIN, lesson order, revised supplements and stale-assessment rejection, submission/progress, Third-Term mode, other-class isolation, figures/animations, Yoruba diacritics/attribution, narrow-screen/zoom, TalkBack, resume/offline) · teacher/practical observations · the concrete production approval request and any production operation. `DEVICE1/OBSERVATION_RESULTS.csv` is unchanged (all NOT OBSERVED).

## Unblock, in order
1. Owner: check production for the §2 problem now; confirm the auto-deploy setting; decide whether to pause it.
2. Supply the staging values above and the private ZIP; then Task 06 full acceptance, then STAGE1 → API preflight → EAS staging build → device sessions.
3. Supply Task 07 inputs A/B (or decide a prospective baseline, which cannot prove the historical claim).
4. D6, D7 and the placement response if sequencing activation is wanted (separate W7).
5. Owner pins `<CANDIDATE_SHA>`; the operator fills the R7 placeholders; the owner approves the exact operations (PLAN §9). Only then may a separately assigned operator execute them, serially.

## Statuses (separate)
Stage: **NOT STARTED (BLOCKED)** · Device: **NOT OBSERVED** · Release plan: refreshed, **not approved** · Production operations: **none prepared for approval, none executed** · IMPLEMENTED: documentation only · VERIFIED: as tabulated · PUBLISHED: see PR · MERGED: no · DEPLOYED: no · Full JSS3: **not done**.

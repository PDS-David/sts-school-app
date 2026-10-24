# D_PREP — staging target and access checklist (single list; blank until the owner fills it)

Nothing below is pre-filled and nothing here is PASS. A row is complete only when the owner (or the named person) has supplied the value **and** the evidence column is filled by someone who actually checked it. Credentials never go in this file, Git, chat or logs: write only *where* they are held.

Run sequence, commands, cleanup and handoff record already exist and are **not repeated**: `docs/jss3/completion/STAGE1/RUNBOOK.md` §0–§8. Observation template: `docs/jss3/completion/DEVICE1/OBSERVATION_RESULTS.csv` (all rows currently BLOCKED / NOT OBSERVED).

## A. Owner designation (RUNBOOK §1, STAGE1 REPORT §4)
| # | Item | Value (owner supplies) | Evidence / who checked | Status |
|---|---|---|---|---|
| A1 | Named staging target (one sentence: what it is, who owns it) | | | NOT PROVIDED |
| A2 | Statement that the target is **not** production and holds no real student data | | | NOT PROVIDED |
| A3 | Permission to populate it (curriculum import + asset attach + synthetic accounts) and to remove it afterwards | | | NOT PROVIDED |

## B. API (RUNBOOK §6)
| # | Item | Value | Evidence | Status |
|---|---|---|---|---|
| B1 | HTTPS API origin the phone can reach: bare `https://host[:port]`, no path, no trailing slash, **not** the host in `mobile/app.json` | | `STS_BUILD_TARGET=staging EXPO_PUBLIC_API_URL=<origin> npx expo config --json --type public` (in `mobile/`) shows `extra.apiUrl` = origin, `extra.buildTarget` = `staging` | NOT PROVIDED |
| B2 | Hosting for the backend, database port not exposed | | | NOT PROVIDED |
| B3 | `JWT_SECRET`, `JWT_REFRESH_SECRET`: long, random, staging-only; **where held** (not the value) | | | NOT PROVIDED |
| B4 | `NODE_ENV` (set `production` only as the SSL switch if the managed DB needs SSL) | | | NOT PROVIDED |
| B5 | `TERM_PIN_ENFORCED`: `true` or `false` (backend env only; opt-in, default off). If `true`, PINs issued via `POST /admin/term-pins` | | | NOT PROVIDED |

## C. Disposable database (RUNBOOK §1, §5a)
| # | Item | Value | Evidence | Status |
|---|---|---|---|---|
| C1 | New PostgreSQL 16 database, name matching `staging_*`, `stg_*`, `jss3_staging_*` or `jss3_test_*` (never containing `prod`/`live`) | | `SELECT version(), current_database();` | NOT PROVIDED |
| C2 | Where `DATABASE_URL` is held (shell only) | | | NOT PROVIDED |
| C3 | Bootstrap result (`2 schools, 18 classes, 6 terms…`) | | RUNBOOK §2 | NOT PERFORMED |
| C4 | Schema evidence: both `topic_assets.alt_text` and `assessments.content_fingerprint` rows | | RUNBOOK §5b query | NOT PERFORMED |

## D. Inputs (RUNBOOK §0, §3)
| # | Item | Value | Evidence | Status |
|---|---|---|---|---|
| D1 | `JSS3_NEXT_STAGE_INPUTS_20261016.zip` (or its (1)/(2) copy), sha256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c` | | `sha256sum` output | NOT PROVIDED (STAGE1 attempt had the wrong archive) |
| D2 | Importer dry-run log reviewed, then `--yes` permitted | | `FILE AUDIT PASSED`, JSS 3 lines 483 (313 + 170) | NOT PERFORMED |
| D3 | Attach plan recomputed from the real importer log (do not force historical 17/103 or 16/101) | | `staging_attach_plan.py` output; dry-runs show zero conflicts | NOT PERFORMED |

## E. Build (RUNBOOK §6)
| # | Item | Value | Evidence | Status |
|---|---|---|---|---|
| E1 | Expo/EAS account or token held by the owner; who runs the build | | | NOT PROVIDED |
| E2 | Profile: **`staging`** (not `preview`, not `production`) | `staging` | `mobile/eas.json` | READY (code) |
| E3 | `EXPO_PUBLIC_API_URL` supplied via EAS for environment `preview` (= B1); no `mobile/.env` on the building machine | | `eas env:list` output without secrets | NOT PERFORMED |
| E4 | Build identity: app commit SHA, EAS build id, APK sha256 | | | NOT PERFORMED |
| E5 | Evidence the installed build calls staging and production receives nothing | | staging API log shows the login; owner confirms production log silent | NOT PERFORMED |

## F. Accounts, device, tester (RUNBOOK §5a–§5b, §7)
| # | Item | Value | Evidence | Status |
|---|---|---|---|---|
| F1 | Staging admin username / school `secondary`; password chosen by the owner, held privately | | | NOT PROVIDED |
| F2 | Synthetic JSS 3 student and one other-class student (names are synthetic); credentials delivered privately to the DEVICE1 runner | | | NOT PERFORMED |
| F3 | Android phone: model, OS, viewport, screen reader (TalkBack) | | | NOT PROVIDED |
| F4 | Named tester (the person who writes the observations) | | | NOT PROVIDED |
| F5 | iOS: out of scope for this build route (needs a separate route and Apple account) | n/a | | NOT PLANNED |

## G. Order of work once A–F are supplied (pointers only)
1. RUNBOOK §0 verify checkout/Node/archive hash → §1 database → §2 bootstrap → §3 import (dry run, review, `--yes`) → §4 attach plan, dry-runs, apply → §5a admin → §5b students/schema check → §6 backend up on HTTPS, offline `expo config` pre-check, EAS variable, `eas build --profile staging` → install APK.
2. `python3 scripts/jss3/device1_preflight.py --base-url <B1> --output "$PWD/device1-evidence-api" --staging-confirmed` (tokens exported privately). Exit 0 is an API pass only, never a device pass.
3. Phone observations: fill `DEVICE1/OBSERVATION_RESULTS.csv` row by row (values only from the person holding the phone; leave NOT OBSERVED otherwise), fill RUNBOOK §7.
4. Cleanup per RUNBOOK §8 (only resources created for this test, only after owner confirmation; revoke staging JWT secrets and synthetic accounts; remove the EAS variable; production is never part of cleanup).

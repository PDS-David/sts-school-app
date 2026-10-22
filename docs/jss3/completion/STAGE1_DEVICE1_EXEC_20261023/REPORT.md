# STAGE1 + DEVICE1 execution — STATUS = BLOCKED (no designated target, phone or correct input archive)

Base master `dd23d3e7a1dd174acb7e54926b6ae093fca2d9de` (fetched 23 Oct 2026; differs from the coordinating SHA f28c119 because PR30-32 merged). PR27 (`db:create-staging-admin`) and the STAGE1 tooling are on this master. Branch `jss3/stage1-device1-exec-20261023-b6k2`.

**Nothing was provisioned, imported, attached, built or observed. No database, host, Expo/EAS account or production service was contacted. No phone check was made and no DEVICE1 row is marked PASS.**

## Results (kept separate)
| Label | What |
|---|---|
| IMPLEMENTED | RUNBOOK §6: exact EAS command to supply `EXPO_PUBLIC_API_URL` to the `preview` build. Nothing else changed. |
| VERIFIED (offline) | Node 24.19.0, `npm ci --ignore-scripts`; backend and mobile `tsc --noEmit` clean; `test_jss3_staging_attach_plan` + `test_jss3_device1_preflight` 16/16 OK; `lesson-image` 2/2. eas-cli 25.3.0 flags read from `--help`. |
| BLOCKED | Staging bootstrap, import dry-run/apply, attach plan (needs importer log), attach dry-run/apply, admin and student accounts, API hosting, EAS build, preflight, every DEVICE1 phone observation, schema check. |
| NOT PERFORMED | Any app/defect fix: no defect was reproduced. Cleanup was not needed because nothing was created. |

## Findings
1. **Wrong input archive.** The attached `JSS_3-20260507T071107Z-3-001.zip` (sha256 `a127e5750c2284f795c3b4b124c2b368b5a37576fb9ca8149d212447b5a1e965`) is a raw JSS 3 Drive export (nested term zips), not `JSS3_NEXT_STAGE_INPUTS_20261016.zip` (required `0a5b0d92…ea3c`). Not used; the importer, attach plan and acceptance runner need the correct file.
2. `mobile/eas.json` `preview` has no `env`; `app.json` still bakes the Render production URL. A build without the EAS variable silently targets production.
3. Recorded counts (17 manifests/103 rows at consolidation; 16/101 in STAGE1 REPORT) are historical. Recompute with `staging_attach_plan.py` against the real importer log.

## Exact access still needed
1. Owner designation: named target, new database name (`staging_*`/`stg_*`/`jss3_staging_*`/`jss3_test_*`), HTTPS API URL, permission to populate; confirm no production use.
2. The correct inputs ZIP (hash above).
3. Hosting for the API on an HTTPS URL the phone can reach, with JWT secrets set privately; `TERM_PIN_ENFORCED` choice.
4. Expo/EAS access held by the owner (Android APK via `preview`; iOS needs a separate route) and an Android phone/tester (model, OS, screen reader).

Then follow RUNBOOK §0–§8 and fill §7; DEVICE1 observations go in `DEVICE1/OBSERVATION_RESULTS.csv`.

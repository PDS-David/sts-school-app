# D_PREP — safe staging build and execution preflight

Base: master `cf1b559f2f5ba72de3f48429409f8b7f4a4b77ed` at start; rebased onto `6a3c4bad355d948260ccfad1154a1945a408d370` (upstream added only S_PREP and I-CURRENT docs/scripts, no overlap) and tests re-run on the rebased head (23 Oct 2026). Branch `d-prep/staging-preflight`. Contract: `NEXT_AGENT_TASKS/EXECUTION_CONTRACT.md`. No `AGENTS.md` exists in the repository.

**Nothing was provisioned, imported, attached, built, installed or observed. No staging or production host, database, Expo/EAS account or device was contacted.** Every provisioning, import, build-installation and device-observation item remains **NOT PERFORMED / BLOCKED**; none is marked PASS.

## Results (kept separate)
| Label | What |
|---|---|
| CONFIRMED DEFECT | The STAGE1 finding still held on master: `mobile/eas.json` `preview` had no `env`; `mobile/app.json` bakes `extra.apiUrl` = the Render production host; `src/api/client.ts` resolves `EXPO_PUBLIC_API_URL ?? extra.apiUrl ?? 10.0.2.2`. A build without the variable silently targeted production. |
| OBSERVED (not assumed) | `expo config` (Expo CLI 56.1.20) reports `extra.apiUrl` = production **even when `EXPO_PUBLIC_API_URL` is set**: the override exists only at Metro bundle time. Expo does load `mobile/.env` when the shell variable is absent; a shell variable wins over `.env`. |
| IMPLEMENTED | `mobile/eas.json`: new `staging` profile (extends `preview`, `environment: preview`, `env.STS_BUILD_TARGET=staging`, no URL). `mobile/app.config.js` (wraps `app.json`): for `STS_BUILD_TARGET=staging` the config **fails** unless `EXPO_PUBLIC_API_URL` is a bare https origin that is not the `app.json` host (also rejects http, loopback, `10.0.2.2`, placeholders, whitespace, credentials, path/query/fragment); on success it writes `extra.apiUrl`, `extra.buildTarget`, `extra.productionApiUrl`. Unknown `STS_BUILD_TARGET` values (typos) fail. `mobile/config/apiTarget.js` (+ `.d.ts`): the shared validator. `mobile/src/api/client.ts`: 8 lines re-validating at startup, only when `extra.buildTarget === 'staging'`. No production URL or staging URL is hard-coded in code or `eas.json`. |
| PRESERVED | No `STS_BUILD_TARGET` ⇒ `app.config.js` returns the `app.json` config unchanged; `preview` and `production` profiles untouched (tested). |
| DOCS | `STAGE1/RUNBOOK.md` §6/§7 now name the `staging` profile and add an offline pre-check (no second runbook). `D_PREP/TARGET_CHECKLIST.md` is the single access list. |
| VERIFIED (offline) | See below. |
| BLOCKED / NOT PERFORMED | Target designation, bootstrap, import, attach, accounts, API hosting, EAS variable and build, APK install, preflight against a real API, every phone observation, schema check, cleanup (nothing created). |

## Verification (this sandbox: Node v22.22.2, Python 3.12.3 — CI pins Node 24.19.0)
- `npm ci --ignore-scripts --workspace mobile --include-workspace-root`; `tsc --noEmit -p mobile/tsconfig.json`: clean.
- `node --test tests/mobile-staging-api-target.test.cjs`: 11/11. It runs the real `expo config` in a clean environment for: normal build (production preserved, with and without the variable); staging with variable absent, empty, the **known production URL** (read from `app.json`, also upper-cased) and a placeholder (all refused); valid HTTPS staging origin (accepted; project id and Android package unchanged); `.env` behaviour (loaded when the shell is silent, shell wins, production in `.env` refused); typo target; validator edge cases; `eas.json` shape; static check that `client.ts` calls the guard and hard-codes no production URL. Mutation check: with `app.config.js` removed, 5 tests fail; restored, 11 pass. Test staging origin uses the reserved `.invalid` TLD.
- `node --test tests/*.cjs`: 27/27 (CI already runs this glob, so the new test runs in CI with no workflow change).
- `python3 -m unittest tests.test_jss3_staging_attach_plan tests.test_jss3_device1_preflight`: 16/16 OK (existing tests, unmodified).
- `device1_preflight.py` offline refusals (exit 3, nothing created, no network): no `--staging-confirmed`; the `app.json` production host; `http://` non-loopback; missing `JSS3_STUDENT_TOKEN`.
- `@expo/eas-json` 25.3.0 (offline schema reader): `staging` resolves to `distribution internal`, `buildType apk`, `environment preview`, env as above; a mistyped profile name is rejected; `preview`/`production` unchanged.
- `tsc --noEmit -p backend/tsconfig.json` is **not clean in this sandbox** (301 output lines) and prints the same on unmodified master; only the mobile workspace was installed here and the cause was not investigated. No backend file was changed.

## Not verified (needs the owner's accounts or a build)
- That EAS injects the `staging` profile env into `app.config.js` and that Metro inlines `EXPO_PUBLIC_API_URL` in the produced APK. `eas config` needs an Expo login (not available). The guard is built so a failure here is loud (build fails) rather than silent, but only the first real build proves it. Record the evidence in checklist E3–E5.
- `eas env:set preview …` / `eas build --profile staging` were not executed.
- Runtime guard behaviour inside a running app (TypeScript compiles; behaviour is covered statically only).

## Residual and notes
- `DEVICE1/REPORT.md` (historical evidence) still says `eas build --profile preview`; superseded by RUNBOOK §6, not edited.
- `mobile/.env.example` still says an absent `.env` uses the production URL; true for normal builds, and left unchanged.
- Historical counts (17 manifests/103 rows; 16/101) must be recomputed from the real importer log.

## Exact access still missing
Listed once, with fields, in `TARGET_CHECKLIST.md`: A1–A3 owner designation and permission; B1–B5 HTTPS API origin, hosting, private JWT secrets, `NODE_ENV`, `TERM_PIN_ENFORCED`; C1–C2 new disposable database; D1 the correct inputs ZIP (sha256 `0a5b0d92…ea3c`); E1 Expo/EAS access; F1–F4 admin credentials held privately, phone model/OS/screen reader, named tester.

## Statuses
Implementation: done. Testing: offline only, as above. Publication: branch `d-prep/staging-preflight` pushed and PR opened to master (see PR). Merge, provisioning, build, installation, device observation: not done.

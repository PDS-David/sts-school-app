# R5 — staging safeguards and device verification

Base: master `f036a63243117e511da3d9b49844134c5c635fa0`. Branch `r5-staging-device-20261024-w3x8`. Contract: `NEXT_AGENT_TASKS/EXECUTION_CONTRACT.md` (no `AGENTS.md` exists). Node v24.19.0 (installed from the npm registry; `node@24.19.0` package), locked dependencies (`npm ci --ignore-scripts --workspace mobile --include-workspace-root`).

## PR42 state — prerequisite, and a deviation to review
PR #42 (`d-prep/staging-preflight`, head `fb469acb0fb720aea1d796b4240cfb822d5752f9`) was **closed without merging by PDS-David on 2026-10-24 10:44 UTC and its branch was deleted** (issue events: `closed`, `head_ref_deleted`). Its last CI (`verify`) was green; the only discussion is an automated CodeRabbit notice. **None of its files are on master.** The task covers "merged" and "open" only; I did not recreate it from scratch or force-push anyone's branch. I created this branch from the preserved commits of `fb469ac` (still in the author's local clone), merged current master into it (no conflicts), and added the R5 changes on top. **This PR therefore contains the three PR42 commits plus R5.** If the owner closed PR42 to reject the approach, close this PR too; if PR42 was closed in favour of this follow-up, merge only this one. Merge order is the integrator's call; nothing was merged.

## Phase 1 — review of the real code (findings are from running it, not from the earlier report)
| Finding | Evidence | Action |
|---|---|---|
| **DEFECT: trailing-dot production host bypass.** `https://<production-host>.` (DNS-equivalent to production) was accepted for a staging build, as was `..`. | Probed the unmodified PR42 validator before editing: ACCEPTED. | Fixed: hosts normalised (lower-case, trailing dots stripped) for every comparison, and a trailing-dot host is refused outright. Tested at validator and real `expo config` level. |
| **DEFECT: fail-open comparison.** If the production reference was missing/empty/garbage the "is this production?" check was silently skipped. | Probed: ACCEPTED for `undefined`, `''`, `'not a url'`. | Fixed: a staging build now fails closed when `app.json` `expo.extra.apiUrl` is missing or unusable. |
| **DEFECT (minor): unreachable/invalid hosts accepted** — `localhost.`, `*.localhost`, `0.0.0.0`, `[::]`, port `0`. | Probed: ACCEPTED. | Refused. |
| **Weak runtime test.** The PR42 runtime guard was only checked by reading `client.ts` text. | Review. | The resolution (`envUrl ?? configuredUrl ?? emulator`, plus staging re-validation) moved unchanged into `mobile/config/apiTarget.js` as `resolveApiBaseUrl`; `client.ts` calls it and still holds the literal `process.env.EXPO_PUBLIC_API_URL` Metro needs. Tests execute the exact function the app runs. |
| Bundled runtime path (OBSERVED) | Real `expo export --platform android --no-minify --no-bytecode` with `STS_BUILD_TARGET=staging EXPO_PUBLIC_API_URL=<test origin>` (offline, 30 s): the origin is inlined as a literal (`var envUrl = "…"`), no executable `process.env.EXPO_PUBLIC_API_URL` remains, **the production host appears 0 times in the bundle**, the guard code is present. Staging without the URL fails at config evaluation and produces no bundle. | Now a regression test. |
| `.env` precedence (OBSERVED, unchanged) | Expo CLI 56.1.20 loads `mobile/.env` when the shell is silent; shell variable wins; production in `.env` is refused for staging. | Already tested. |
| Ordinary/production/preview behaviour | Ordinary `expo config` `extra` deep-equals `app.json` `extra`; `preview` and `production` profiles asserted equal to their exact pre-change values; resolver for ordinary manifests asserted identical to the old chain (`.env` override, emulator fallback kept). | Unchanged; tested. |

Changed code: `mobile/config/apiTarget.js` (+`.d.ts`), `mobile/src/api/client.ts` (net diff vs master: import + one call replacing one line), `tests/mobile-staging-api-target.test.cjs` (11 → 16 tests), a one-sentence clarification in `STAGE1/RUNBOOK.md` §6. Nothing else; no lesson, content, backend or UI change.

### Verification (Node v24.19.0)
- `tsc --noEmit -p mobile/tsconfig.json`: clean.
- `node --test tests/mobile-staging-api-target.test.cjs`: 16/16 (includes: absent, empty, malformed, placeholder, known production URL, trailing-dot production, valid staging, unknown target, `.env` precedence, resolver for ordinary and staging manifests, real Metro bundle).
- `node --test tests/*.cjs`: 32/32 (CI already runs this glob).
- Mutation checks: removing the trailing-dot handling, the fail-closed production check, or the runtime re-check each makes ≥1 test fail; restored, 16/16.
- Not re-run: Python JSS3 tests (no Python file changed).

### Still not verified
- EAS injecting the `staging` profile `env`/`environment` into `app.config.js` and which wins if both define a variable (only `STS_BUILD_TARGET` is in `eas.json`; only `EXPO_PUBLIC_API_URL` should come from EAS, so no overlap by design): needs the owner's Expo account.
- `eas build --profile staging` itself, and that a **different** profile (`preview`) is not used for staging: the guard cannot stop a human choosing `preview`; the runbook names `staging`.
- EAS Update/OTA is not configured in `app.json` (no `updates`/`runtimeVersion`); if enabled later, the update must be published with the same env.

## Phase 2 — staging and device work: NOT PERFORMED (no access supplied)
No owner-designated staging API/database, secure access, accounts/population scope, Expo/EAS access, `TERM_PIN_ENFORCED` value, or Android device/emulator was provided in this task or exists in the repository. Nothing was provisioned, imported, attached, built, installed or observed. No production system or staging host was contacted, and no paid infrastructure was created. Screenshots, CI and configuration inspection above are **not** a device PASS.

**The single access checklist is `docs/jss3/completion/D_PREP/TARGET_CHECKLIST.md` (rows A1–F5; unchanged, all NOT PROVIDED).** Mapping of this task's list: staging API + database → B1–B2, C1–C2; secure access → B3, C2, F1–F2 (held outside Git/chat); permitted school/accounts/population scope → A3, F1–F2, D2–D3; Expo/build access and profile → E1–E3 (`staging`); `TERM_PIN_ENFORCED` → B5; device/emulator and tester → F3–F4; build identity → E4–E5. Run order is `STAGE1/RUNBOOK.md` §0–§8; cleanup §8 applies only to resources created for the test.

### Observation record (all NOT PERFORMED; fill only from the person holding the build)
Picture rows (13) use the existing `DEVICE1/OBSERVATION_RESULTS.csv` template, currently BLOCKED/NOT OBSERVED. Categories the task lists that the CSV does not cover; asset keys and lesson identities must come from the current attach plan, none are invented here:
| Item | Result |
|---|---|
| Device / OS / build id / app commit / APK sha256 | NOT PERFORMED |
| Login and topic access (no-token and other-class rejection on staging) | NOT PERFORMED |
| Corrected lesson delivery; generated-assessment behaviour | NOT PERFORMED |
| Diagrams; Music notation images; animated Basic Technology GIFs (CSV rows BT-10/12/16) | NOT PERFORMED |
| Yoruba diacritics rendering and attribution text | NOT PERFORMED |
| Text/image readability, scrolling, TalkBack/accessibility behaviour | NOT PERFORMED |
| PIN/progression behaviour for the configured `TERM_PIN_ENFORCED` value | NOT PERFORMED |
| Cleanup of test resources created by this task | NOTHING CREATED; NOTHING TO CLEAN |

## Statuses
Implementation (Phase 1 fixes): done. Testing: offline as above. Publication: see PR. Provisioning, import, build installation, device observation: **NOT PERFORMED**. Merge and deployment: not done.

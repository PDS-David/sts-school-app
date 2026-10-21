# STAGE1 — STATUS = PREPARED, AWAITING OWNER DESIGNATION (nothing provisioned or populated)

Base master `a1db3dc3a23017bbb305cce4d8422ff7c4158b67` (fetched 21 Oct 2026). Node 24.19.0, `npm ci --ignore-scripts`, Python 3.13. Branch `jss3/stage1-20261021-n4x7`.

**No database, host, build or account was created, changed or contacted. Production was not touched. No phone test was done or implied. DEVICE1 was not started.** Code/plan preparation, observed offline checks, environment availability, owner approval, deployment and device acceptance are separate claims and only the first two are made here.

## 1. Which nonproduction environment is actually available

| Candidate | Finding |
|---|---|
| This agent's sandbox | Linux, no Docker, no PostgreSQL, outbound network limited to a package/GitHub allow-list (no Expo, no Render/Supabase). Cannot host a phone-reachable API or run an EAS build. Offline checks only. |
| Existing Render service | `mobile/app.json` bakes `https://sts-school-backend.onrender.com` (the app's production default). Not established as staging; **not contacted**. Do not use it. |
| Owner's Windows PC with Docker Desktop | Docker is reported running; container state unknown. A cloud agent cannot reach or control it. Usable only if the owner runs command groups and exposes an HTTPS address (see §4). |
| Anything else | None designated. **No target exists until the owner names one.** |

## 2. Observed offline results (sanitised: `evidence/attach_plan_and_dry_run_summary.json`)

- Inputs ZIP SHA256 `0a5b0d92…ea3c` matches the known value; its 61 internal checksums verify.
- Importer no-database dry run (`ingestTopics.ts --school-code secondary`, no `--yes`, no `DATABASE_URL`): exit 0, FILE AUDIT PASSED. 313 JSS 3 original rows; with `--jss3-supplements` 483 (313 + 170), matching DEVICE1's required load. 8 pending entries are held and not imported. "Audit passed" does not certify completeness or database compatibility.
- New `scripts/jss3/staging_attach_plan.py` proves each of the 16 asset manifests (101 asset rows) resolves to exactly one subject/term in that plan by order index and title, with every file present and sha256-correct, and prints the exact `attachTopicAssets.ts` **dry-run** commands. Note the Basic Technology picture manifest targets **2nd Term**, not 1st: a guessed command would have been wrong. Four synthetic unit tests (CI-hooked) cover success, title mismatch, hash mismatch and ambiguity.
- The full importer logs hold private lesson titles and stay out of Git (hashes recorded).
- Not run: bootstrap, attach dry-runs against a database (they connect to one), RELEASE-DB suites, `device1_preflight` (needs a staging URL and tokens).

## 3. Findings that change the plan

1. **No supported first-admin step.** `db:bootstrap` creates schema, 2 schools, 18 classes, 6 terms, and no login (README says admin provisioning is a separate controlled step). `db:seed` creates a demo admin/teacher with hard-coded passwords and a partial subject list; it must not be used on a phone-reachable URL. Student/teacher creation needs an admin token. **Owner decision:** (a) approve a small, guarded `createInitialAdmin` script (password from an environment variable, host acknowledgement, tested on disposable PostgreSQL before use), or (b) a one-time reviewed SQL insert with a locally generated bcrypt hash. Not built now: it is security-sensitive and cannot be tested without PostgreSQL.
2. **SSL switch.** `pool.ts` enables SSL only when `NODE_ENV=production`. A managed cloud database therefore needs that value for the scripts and server. It is not evidence of production data; the `seed.ts` guard also keys on it.
3. **Mobile base URL.** Priority is `EXPO_PUBLIC_API_URL` (build time) > `app.json` `extra.apiUrl` (production Render) > emulator fallback. `mobile/.env` is gitignored, so an EAS cloud build will not see it; the value must be supplied to the build through EAS (verify the installed `eas-cli` options; none are guessed here). A build without it silently targets production.
4. **Cleartext HTTP.** No cleartext/`expo-build-properties` setting exists in `mobile/app.json`; a release APK should be assumed unable to call `http://<LAN-IP>`. Prefer an HTTPS address (hosted service or tunnel); confirm on the built APK.
5. **Preview profile** is Android APK only (`eas.json` `preview`, internal distribution). An iPhone needs a different, owner-decided route (Apple account, device registration).
6. **Lesson locks.** Later topics in a sequence require the previous topic passed; `TERM_PIN_ENFORCED=true` additionally requires a redeemed term PIN. Whether DEVICE1's student can open every picture lesson with free access must be verified on the populated staging (list/locked flags) before the phone session; not assumed.

## 4. Owner inputs required (exact)

1. **Target designation and permission**, in these words or equivalent: "Provision and populate `<named target>` (new database `<name>`, API at `<https URL>`) for synthetic JSS 3 staging; production untouched."
   - **A. Hosted:** a new, separate database and API service on a provider/account you name (never the existing Render service/database). Needs account access path and who creates resources.
   - **B. Your PC:** Docker PostgreSQL 16 on a new container name/port bound to loopback, API on the PC, exposed to the phone by an HTTPS tunnel/address you control. You run each command group (PowerShell syntax; bash only in WSL).
2. First-admin option (§3.1).
3. Phone platform (Android APK via `preview`, or an iOS route) and who runs/owns the EAS build (Expo login or token stays with you; never in chat).
4. Whether DEVICE1 accounts use free access (`TERM_PIN_ENFORCED` unset) or issued term PINs.

## 5. Reusable changes published

`scripts/jss3/staging_attach_plan.py`, `tests/test_jss3_staging_attach_plan.py` (CI step added), this report, `RUNBOOK.md`, sanitised evidence with `SHA256SUMS`. No application, schema or curriculum change.

## 6. Handoff to DEVICE1

Not yet deliverable: it needs the populated target URL, the build identifier and two synthetic accounts' credentials (kept private). `RUNBOOK.md` §7 is the template to fill once they exist.

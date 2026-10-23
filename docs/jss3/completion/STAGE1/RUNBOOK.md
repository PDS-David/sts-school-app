# STAGE1 runbook — set up, populate, build, hand off, clean up

Execute **only after** the owner has designated the target and granted permission (REPORT §4). Use repository commands exactly as below; stop on any unexpected output. No credentials in Git, chat, logs or URLs: export them in the shell only. Replace `<…>` placeholders; nothing here is pre-filled for an unspecified target.

## 0. Checkout and verify
```
git fetch origin && git checkout <recorded master SHA>
npm ci --ignore-scripts          # Node 24.19.0
sha256sum JSS3_NEXT_STAGE_INPUTS_20261016.zip   # expect 0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c
```
Unzip keeping trailing-space folder names. Private inputs never go into Git.

## 1. Empty target database (PostgreSQL 16, new, not shared)
- Option B only: new container name/port, loopback bind; do not touch other containers.
- Export the designated URL for this shell only: `DATABASE_URL`. Managed SSL database: also `NODE_ENV=production` (SSL switch; not a production claim).
- Schema checks: `SELECT version();` and confirm the database name is the designated one. The name must be new and match `staging_*`, `stg_*`, `jss3_staging_*` or `jss3_test_*` (required by the §5a first-admin CLI).

## 2. Bootstrap (backend stopped)
`npm run db:bootstrap --workspace backend` → expect "2 schools, 18 classes, 6 terms. No users or curriculum seeded." Repeat is a no-op. Never run `db:seed` or `db:migrate` first.

## 3. Curriculum import (dry run, review, then apply)
From `backend/`:
```
node --import tsx src/db/ingestTopics.ts --root "<INPUT>/ALL" --school-code secondary --jss3-supplements   > importer-dry.log
```
Expect JSS 3 lines 483 (313 + 170), "FILE AUDIT PASSED". Only after review and permission, repeat the identical command with `--yes`. Supplements are part of the staged DEVICE1 load.

## 4. Assets
```
python3 scripts/jss3/staging_attach_plan.py --importer-log importer-dry.log --assets-root curriculum-assets/jss3 --json-out attach-plan.json
```
At consolidation: 17 manifests, 103 rows, 0 problems (including NOUN cover/logo). Recompute from current manifests; do not force historical counts. Run each printed `--dry-run` command from `backend/`; apply by changing `--dry-run` to `--apply` (single transaction, idempotent). Dry-run outputs must show zero conflicts.

## 5. Accounts (synthetic only) and schema check

### 5a. First admin (supported CLI: `db:create-staging-admin`)
Status of the helper: implemented and tested on disposable PostgreSQL 16 (`tests/staging-admin.db.test.mts`, CI). **Target designation and actual execution remain outstanding until the owner designates a target and runs this.** Never use `db:seed` (fixed demo passwords).

Rules enforced by the CLI (it refuses otherwise, writing nothing):
- The target database name must be new and designated: `staging_*`, `stg_*`, `jss3_staging_*` or `jss3_test_*` (never containing `prod`/`live`). Name the staging database accordingly in §1. Any other name is refused, with every flag.
- The target must be bootstrapped (§2) and have **zero** user rows. It never overwrites an account, resets a password or grants a role; a repeat run is refused.
- Default is a **dry run** (guards only, nothing written). Writing needs all of `--apply`, `--acknowledge-staging-only` and `--confirm-database <exact name>`; the confirmation must equal the connected `current_database()`.
- The password comes from a **named environment variable** (`--password-env <NAME>`), never argv. Minimum 12 characters (the application minimum is 8), at most 72 bytes, at least three of lower/upper/digit/symbol, no leading/trailing whitespace, not a demo/common value, must not contain the username. The password and hash are never printed.
- Creates one `admin` for the school you name (`primary` or `secondary`), `must_change_pw=FALSE` (you chose the password), and an `audit_log` row `bootstrap_first_admin`. No email or external call.

Placeholders (replace; nothing is pre-filled): `<STAGING_DATABASE_URL>` = the designated database URL (credentials stay in this shell only); `<DB_NAME>` = its exact database name; `<ADMIN_USERNAME>` = lower-case login name, 3-32 chars (not `admin`/`root`); `<SCHOOL_CODE>` = `secondary` for JSS 3. `STG_ADMIN_PASSWORD` is only the **name** of the variable; choose another name if you prefer (upper-case, not `DATABASE_URL`/`JWT_*`).

**PowerShell (run from the repository root, Node 24.19.0):**
```powershell
$env:DATABASE_URL = '<STAGING_DATABASE_URL>'
# Add $env:NODE_ENV = 'production' ONLY if a managed database requires SSL (SSL switch, not a production claim).
$sec = Read-Host -AsSecureString 'Staging admin password'
$env:STG_ADMIN_PASSWORD = [System.Net.NetworkCredential]::new('', $sec).Password
# 1) Dry run (writes nothing; shows the exact apply command):
npm run db:create-staging-admin --workspace backend -- --username <ADMIN_USERNAME> --school <SCHOOL_CODE> --password-env STG_ADMIN_PASSWORD
# 2) Apply, only after reviewing the dry run:
npm run db:create-staging-admin --workspace backend -- --username <ADMIN_USERNAME> --school <SCHOOL_CODE> --password-env STG_ADMIN_PASSWORD --apply --acknowledge-staging-only --confirm-database <DB_NAME>
Remove-Item Env:STG_ADMIN_PASSWORD, Env:DATABASE_URL
```

**bash (Linux, macOS or WSL):**
```bash
export DATABASE_URL='<STAGING_DATABASE_URL>'
# export NODE_ENV=production   # ONLY if a managed database requires SSL
read -rs -p 'Staging admin password: ' STG_ADMIN_PASSWORD; echo; export STG_ADMIN_PASSWORD
# 1) Dry run:
npm run db:create-staging-admin --workspace backend -- --username <ADMIN_USERNAME> --school <SCHOOL_CODE> --password-env STG_ADMIN_PASSWORD
# 2) Apply, only after reviewing the dry run:
npm run db:create-staging-admin --workspace backend -- --username <ADMIN_USERNAME> --school <SCHOOL_CODE> --password-env STG_ADMIN_PASSWORD --apply --acknowledge-staging-only --confirm-database <DB_NAME>
unset STG_ADMIN_PASSWORD DATABASE_URL
```
Then, with the staging API running (§6), `POST /auth/login` with that username/password returns the admin token used below. Keep the token and password out of Git, chat and logs. Exit codes: 0 ok/dry run, 1 refused or failed, 2 usage error; `--help` lists the options.

### 5b. Synthetic student accounts
Needs the admin token from §5a. Supported flow: `POST /students` (JSS 3 student and one other-class student, synthetic names) → `POST /admin/users` role `student` returns a one-time `activation_code` → `POST /auth/activate` (owner sets password, ≥8 chars) → `POST /students/:id/link-user`. Login via `POST /auth/login`. Set `TERM_PIN_ENFORCED` per the owner's choice; if `true`, issue PINs with `POST /admin/term-pins`. Verify as the JSS 3 student that Business, Mathematics, Basic Science and Basic Technology lessons with pictures are listed and openable under the chosen lock mode.
Schema evidence (must return both rows):
```
SELECT table_name, column_name FROM information_schema.columns WHERE (table_name='topic_assets' AND column_name='alt_text') OR (table_name='assessments' AND column_name='content_fingerprint');
```

## 6. API address and mobile build
- Run the backend with the designated env (`DATABASE_URL`, long random `JWT_SECRET`/`JWT_REFRESH_SECRET`, `NODE_ENV`, `TERM_PIN_ENFORCED`), reachable at an **HTTPS** URL; do not expose the database port.
- Build with the repo's **`staging`** profile (`mobile/eas.json`; extends `preview`, Android APK, sets `STS_BUILD_TARGET=staging`). Do not use `preview` or `production` for staging: they have no guard and `app.json` bakes in the Render production host. The `staging` profile carries no URL; `mobile/app.config.js` makes the build **fail** unless `EXPO_PUBLIC_API_URL` is a bare `https://host[:port]` origin that is not the `app.json` host (also not http, loopback, `10.0.2.2`, a placeholder, or carrying a path/query/credentials), and `src/api/client.ts` re-checks the resolved URL at startup. Keep **no `mobile/.env`** on the building machine anyway (Expo does load it when the shell variable is absent).
- Supply the URL through EAS, then build (owner's Expo login/token required; eas-cli 25.3.0 flags read from `--help`, not executed here):
  `eas env:set preview --name EXPO_PUBLIC_API_URL --value https://<staging-host> --visibility plaintext --scope project --non-interactive`
  then `eas build --platform android --profile staging`. (`env:create` still exists but is marked deprecated.) Remove the variable afterwards if it should not outlive the test.
- Offline pre-check before spending a build (no account, no network): `cd mobile && STS_BUILD_TARGET=staging EXPO_PUBLIC_API_URL=https://<staging-host> npx expo config --json --type public` must print `extra.apiUrl` = the staging origin and `extra.buildTarget` = `staging`; with the variable unset it must exit non-zero. Regression test: `node --test tests/mobile-staging-api-target.test.cjs`.
- Confirm the produced build does not call the Render production host (the staging API's server logs receive the login; confirm production receives nothing).
- Record the app commit SHA, EAS build id and APK sha256.

## 7. DEVICE1 handoff record (fill in; keep credentials out)
```
Backend/app commit: <sha>      Schema check: <both rows present?>
API base URL: <https://…>      Import: 483 JSS3 topics (313+170); assets attached: <actual current plan and applied counts; consolidation plan 103 rows / 17 manifests>
Build: profile staging, EAS id <id>, APK sha256 <hash>, EXPO_PUBLIC_API_URL baked: <yes/verified how>
Accounts: JSS3 student <username>, other-class <username>; passwords/tokens delivered privately to the DEVICE1 runner
Lock mode: TERM_PIN_ENFORCED=<…>; picture lessons openable: <evidence>
Preflight: JSS3_STUDENT_TOKEN / JSS3_OTHER_CLASS_TOKEN exported privately, then
  python3 scripts/jss3/device1_preflight.py --base-url <https URL> --output "$PWD/device1-evidence-api" --staging-confirmed
Phone: <model/OS/viewport/screen reader>  (observations are DEVICE1's, not this record's)
```

## 8. Cleanup
Option B: stop and remove only the containers created in §1 (by their exact new names). Option A: delete only the resources created for staging, after owner confirmation. Revoke the staging JWT secrets and synthetic accounts. Production is never part of cleanup.

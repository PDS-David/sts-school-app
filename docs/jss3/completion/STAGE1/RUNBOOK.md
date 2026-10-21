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
- Schema checks: `SELECT version();` and confirm the database name is the designated one.

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
Needs an admin token (first-admin option, REPORT §3.1). Supported flow: `POST /students` (JSS 3 student and one other-class student, synthetic names) → `POST /admin/users` role `student` returns a one-time `activation_code` → `POST /auth/activate` (owner sets password, ≥8 chars) → `POST /students/:id/link-user`. Login via `POST /auth/login`. Set `TERM_PIN_ENFORCED` per the owner's choice; if `true`, issue PINs with `POST /admin/term-pins`. Verify as the JSS 3 student that Business, Mathematics, Basic Science and Basic Technology lessons with pictures are listed and openable under the chosen lock mode.
Schema evidence (must return both rows):
```
SELECT table_name, column_name FROM information_schema.columns WHERE (table_name='topic_assets' AND column_name='alt_text') OR (table_name='assessments' AND column_name='content_fingerprint');
```

## 6. API address and mobile build
- Run the backend with the designated env (`DATABASE_URL`, long random `JWT_SECRET`/`JWT_REFRESH_SECRET`, `NODE_ENV`, `TERM_PIN_ENFORCED`), reachable at an **HTTPS** URL; do not expose the database port.
- Build with the repo's `preview` profile (`mobile/eas.json`, Android APK) with `EXPO_PUBLIC_API_URL=<https URL>` supplied through EAS, and **no `mobile/.env`** on the building machine. Confirm the produced build does not call the Render production host (e.g. watch server logs of the staging API receive the login; confirm production receives nothing).
- Record the app commit SHA, EAS build id and APK sha256.

## 7. DEVICE1 handoff record (fill in; keep credentials out)
```
Backend/app commit: <sha>      Schema check: <both rows present?>
API base URL: <https://…>      Import: 483 JSS3 topics (313+170); assets attached: <actual current plan and applied counts; consolidation plan 103 rows / 17 manifests>
Build: profile preview, EAS id <id>, APK sha256 <hash>, EXPO_PUBLIC_API_URL baked: <yes/verified how>
Accounts: JSS3 student <username>, other-class <username>; passwords/tokens delivered privately to the DEVICE1 runner
Lock mode: TERM_PIN_ENFORCED=<…>; picture lessons openable: <evidence>
Preflight: JSS3_STUDENT_TOKEN / JSS3_OTHER_CLASS_TOKEN exported privately, then
  python3 scripts/jss3/device1_preflight.py --base-url <https URL> --output "$PWD/device1-evidence-api" --staging-confirmed
Phone: <model/OS/viewport/screen reader>  (observations are DEVICE1's, not this record's)
```

## 8. Cleanup
Option B: stop and remove only the containers created in §1 (by their exact new names). Option A: delete only the resources created for staging, after owner confirmation. Revoke the staging JWT secrets and synthetic accounts. Production is never part of cleanup.

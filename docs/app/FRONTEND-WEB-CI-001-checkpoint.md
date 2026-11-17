# FRONTEND-WEB-CI-001 — Expo web bundle readiness checkpoint

Task ID: FRONTEND-WEB-CI-001
Status: IMPLEMENTED — awaiting first workflow execution
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Base commit: `bb9564bb9282b3ab68af60c646041487d6da054c`
Worker branch: `agent/frontend-web-readiness-20261116`

## Finding

The repository had mobile TypeScript and Android bundle checks, but no CI job exported the Expo web bundle. This left cross-platform web bundling regressions undetected by the existing mobile gates.

## Implemented

- Add a PR/push workflow that installs the existing npm workspace and runs `npx expo export --platform web`.
- Upload the generated web bundle as a short-retention artifact for inspection.
- Keep permissions read-only and use Node 22/npm ci, matching existing mobile CI conventions.
- Trigger on mobile/app configuration changes and workflow dispatch.

## Changed files

- `.github/workflows/mobile-web-readiness.yml`
- `docs/app/FRONTEND-WEB-CI-001-checkpoint.md`

## Verification

- Workflow syntax and commands reviewed against the existing Android readiness workflow and Expo project configuration.
- No new package dependency, API target, application code or production configuration changed.
- The first web export is pending this PR's GitHub Actions run; no web build pass is claimed.

## Remaining

- Confirm the first PR run completes successfully and uploads the web artifact.
- Fix genuine Expo web bundling errors without weakening the build gate.
- Follow up with browser-level role journey tests when a browser test runner and safe test-account fixture are available.

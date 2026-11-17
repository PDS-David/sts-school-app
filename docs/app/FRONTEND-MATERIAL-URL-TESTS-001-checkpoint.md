# FRONTEND-MATERIAL-URL-TESTS-001 — Align fixtures with safe download URL policy

Task ID: FRONTEND-MATERIAL-URL-TESTS-001
Status: IMPLEMENTED — awaiting PR CI
Repository: `PDS-David/sts-school-app`
Base branch: `master`
Worker branch: `agent/frontend-material-test-fixtures-20261116`

## Finding

The mobile offline regression suite contained material URL fixtures that no longer matched the helper's intentional SSRF protections:
- `.test` and `.example` reserved host suffixes are blocked.
- Non-default HTTPS ports are blocked.
- `getMaterialDownloadTarget` returns the configured `maxBytes` field.

The existing test expected those reserved hosts and a non-default port to be accepted, and omitted `maxBytes` from its expected result.

## Implemented

- Use `cdn.example.com` and `school.example.com` as valid test hostnames.
- Assert reserved `.test` and `.example` suffixes are rejected.
- Assert port 443 is accepted and port 8443 is rejected.
- Include the helper's `maxBytes` field in the expected download target.

## Changed files

- `tests/mobile/offline-replay.test.mts`

## Verification

- Static comparison confirms test expectations now match `materialDownload.ts` without weakening its URL security policy.
- CI rerun is pending; no pass is claimed.

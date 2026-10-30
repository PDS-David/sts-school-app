# VER-04 — Device acceptance and production release

Status: BLOCKED (owner credentials, device and approval) · Depends: VER-03 · Base: the pinned release candidate
Writes: `docs/app/remaining-20261030/evidence/VER-04.md` only

## Why

The repository can be inspected but not released by an agent. The manual records that the committed workflow "does not deploy the API or publish an APK", that `EXPO_PUBLIC_API_URL` points at `sts-school-backend.onrender.com` without a live-health result, and that the package identifiers and EAS profiles prove configuration, not installation.

It also gives the release sequence that must be followed: pin source and candidate; run authorised acceptance; identify staging target/build; rehearse schema/import/assets/rollback with synthetic identities; observe device roles, progression, grading, reports, offline and push; prepare backup/protection/cache plans; obtain operation approval; deploy and verify the actual SHA/build/data.

## Do (plan only until the owner authorises execution)

1. Fill the evidence file with the concrete release plan:
   - candidate SHA(s), backend and mobile; EAS profile (`preview` internal APK, `production` AAB); build id/hash once built;
   - API target per build (staging HTTPS origin, no silent production fallback), and how the installed build is rebuilt if the target changes;
   - synthetic accounts per role (student, parent, teacher, admin, finance_admin) with no real pupil data;
   - the observation matrix: activation, login, class codes, attendance, score entry, term report, session report, assessment take/result, Brainee, essay review, messages/push, finance invoice, offline queue and flush, PIN redeem, topic progression;
   - pass criteria per row, and what "blocked" looks like;
   - backup, restore and rollback checkpoints; who approves; the paused window.
2. When authorised, execute only what the owner approves, record observed results per row, and keep screenshots and logs private.
3. Report the actual deployed SHA, build number and database target — never "the latest".

## Acceptance

- Every row has an observer, a device/build, a timestamp and a result.
- No row is filled from source inspection.
- The plan names the approver and the rollback point.

## Do not

- Build, deploy, install, push, or contact a provider without explicit approval.
- Put credentials, student data or screenshots in Git.
- Announce a production release on CI success.

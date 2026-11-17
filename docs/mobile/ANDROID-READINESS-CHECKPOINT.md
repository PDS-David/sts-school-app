# Android/mobile readiness checkpoint

- Task ID: MOB-ANDROID-001
- Status: IN PROGRESS — core mobile hardening and PR #947 are merged; the SDK 57 AppEntry fix is PR #972.
- Base branch: `master` at `53f6d1d2498e77e5744bdc1f52e460afa5e50a8f` when PR #947 was opened.
- Core implementation PR [#727](https://github.com/PDS-David/sts-school-app/pull/727) merged on 2026-11-13 (merge commit `2542dd1bc8910b2d7ce53ebf5663ae82c94f86ad`).
- Follow-up PR [#792](https://github.com/PDS-David/sts-school-app/pull/792) was closed without merge. The two TypeScript fixes from that work are present on current `master`: per-account flush-promise cleanup in `mobile/src/api/client.ts`, and supported button styling in `mobile/src/screens/NotificationsScreen.tsx`.
- PR [#947](https://github.com/PDS-David/sts-school-app/pull/947) is merged (head `1388705e9416bd0bf9b128667c9bfb93e20d59bf`). Follow-up [#972](https://github.com/PDS-David/sts-school-app/pull/972) adds a conventional `mobile/App.tsx` entrypoint after the SDK 57 candidate export failed to resolve `../../App`.
- PR #947 adds `.github/workflows/mobile-release-audit.yml`, an Android debug APK build, emulator smoke validation, dependency audits and an isolated SDK 57 candidate check. The SDK 57 package/lockfile upgrade is still not committed.
- The previous PR #696 was closed as superseded by #727.

## Core implementation already merged

1. Outbox replay failures no longer re-enqueue replacement writes; the original item remains pending.
2. Outbox mutations are FIFO serialized. Durable storage errors and malformed JSON/records propagate instead of appearing as an empty/successful queue.
3. Queue operations capture the originating account namespace before waiting. GET caching, cache invalidation, queued writes and replay are bound to the request's account namespace.
4. Requests are cancelled if the active account changes before credentials are attached; these cancellations are not misclassified as network failures or queued.
5. 401/403/409 queued-write failures are retained for re-authentication, restored permissions or conflict resolution. Replay pauses after 401 instead of repeatedly sending remaining writes with an expired session.
6. Logout does not silently proceed if the pending queue cannot be inspected. OfflineBanner reports queue-storage failures rather than displaying a false zero.
7. Cold-start session restoration catches storage/parse failures, validates user ID, username, school code and supported role, discards malformed records and always releases the startup loading gate.
8. Previously authorized push tokens are re-registered after session restore without prompting at startup. The account's pending outbox is flushed after restore/login even if connectivity did not emit a reconnect event.
9. Learning-material PDF/DOC downloads use the SDK 56 FileSystem download task, persist under the app Documents directory and open the system share sheet. Material links are restricted to HTTPS and local filenames are sanitized.
10. README push documentation was corrected. Existing push registration/backend Expo delivery/foreground handling are present; real Android delivery remains unverified.
11. Added 17 focused Node regression cases and `npm run test:mobile:offline`.
12. Added the original Android readiness CI for offline tests, mobile TypeScript validation and Android JS bundle export.

## Static audit findings

- `mobile/app.json` targets the HTTPS production API and its Android package identifier matches the Firebase Android client entry.
- Separate student, parent and teacher navigation trees exist; admin and finance-admin roles are routed separately in the root navigator.
- Backend `requireAuth` checks account active/expiry/deleted-student/pending-review state on requests; route-level permission and content-scope middleware remain authoritative. No backend permission logic was weakened.
- Assessments use assessment-scoped question endpoints and server submission routes.
- Materials were previously external-URL-only; direct HTTPS PDF/DOC download/share support is now implemented. Other link/video types continue to open externally.
- Announcements are in-app feeds and the backend explicitly does not push them. Push provider delivery to a real device is not verified.
- Existing GET cache has a per-user 500-entry cap and write invalidation. Cache freshness remains best-effort; no explicit max-age policy was added.

## Dependency security audit

- Current SDK 56 workspace lockfile audit: **15 findings** — 4 high and 11 moderate, 0 critical.
- The production-only `npm audit --omit=dev` report returned the same 15 findings, so these are not merely development-only issues.
- High findings include the Expo CLI/config dependency chain, `image-size` and `zod`; moderate findings include Expo config packages, `glob` and `minimatch`.
- A non-mutating `npm audit fix --dry-run` did not propose safe non-breaking vulnerability updates. Its suggested complete Expo fix was a major SDK 58 upgrade.
- An isolated SDK 57 package-alignment attempt changed Expo SDK modules and React Native from 0.85.3 to 0.86.3. The npm install output reduced the count to 3 moderate findings and 0 high, but the first attempt stopped because Expo could not auto-edit the dynamic `app.config.js`.
- PR #947 now explicitly declares the five required config plugins in `mobile/app.config.js` and re-runs SDK 57 alignment, typecheck, Expo export and full/production audit. **The SDK 57 candidate is not yet verified or merged.**

## Current verification evidence

- Latest master mobile readiness workflow [43468513417](https://github.com/PDS-David/sts-school-app/actions/runs/43468513417) passed dependency installation, 17/17 offline tests, mobile TypeScript validation, Android Expo JS export and artifact upload. Its artifact was a JavaScript bundle, not an installable APK/AAB.
- PR #947 workflow includes locked install, offline and frontend-contract tests, mobile TypeScript validation, Android JS export, Android native prebuild, local debug APK build, emulator install/launch, full and production-only audits, and an isolated SDK 57 candidate check.
- On branch-push run [43965226416](https://github.com/PDS-David/sts-school-app/actions/runs/43965226416), locked install, both regression suites, TypeScript, JS export, Java setup, Android SDK setup and native prebuild passed. The Gradle debug APK build was still running when this checkpoint was updated; no APK or emulator launch is claimed from that run.
- The workflow setup initially failed because `android-actions/setup-android@v3` tried to install the removed `tools` package. PR #947 now supplies explicit current SDK packages and targets compile SDK 36.
- A later workflow revision adds a 25-minute timeout and plain Gradle stack traces. Newer branch-push run [43966378423](https://github.com/PDS-David/sts-school-app/actions/runs/43966378423) was pending when this checkpoint was updated.
- Earlier EAS steps confirmed that repository secret `EXPO_TOKEN` is absent: staging APK and production AAB cloud builds were skipped. No EAS APK/AAB was produced.
- No authenticated staging role journey, physical Android device test, actual FCM push delivery test or production AAB installation has been completed.

## Remaining acceptance work

- Complete the local debug APK build and verify install/launch on the Android emulator; retain the APK and logcat artifact.
- Complete the SDK 57 candidate alignment and inspect the resulting full and production-only audit reports. Resolve remaining findings safely before production release; consider SDK 58 only with a separately tested upgrade path.
- Obtain an authorized EAS `EXPO_TOKEN` secret to build a staging APK and signed production AAB. Do not commit or expose credentials.
- Run authenticated student, parent, teacher, admin and finance-admin smoke journeys against staging, including token expiry/revocation, logout/account switching and backend 401/403 authorization behavior.
- Verify outbox replay against the backend for duplicate-message/idempotency and 401/403/409 recovery semantics.
- Verify offline cache behavior and stale-data UX, assessments, materials download/share/open, file formats, push registration and actual Expo/FCM device delivery.
- Verify installation/startup on supported Android versions and at least one physical device. Record device/OS versions, test run URLs and results before changing task status.

## Exact next action

Finish the active Android build/emulator and SDK 57 candidate workflows. If they pass, export the generated SDK 57 package files into a dedicated code change, rerun CI, review PR #947 and merge only after all required checks pass. The remaining external gates are the EAS token, staging test accounts and a physical Android device. Do not mark this task complete until those acceptance results are recorded.


## Continuation update — 2026-11-17

- PR #947 head before this update was `2b05ccecf014b86639189406b5e9d1ac66a9f61b`. On that exact head, locked install, offline queue tests, frontend contract tests, mobile TypeScript, Android JS export, native prebuild and debug APK build passed.
- The emulator booted, but `adb install` failed with Android package-manager `Broken pipe (32)`. The workflow then skipped dependency audit and SDK 57 candidate work because these steps were in the same fail-fast job. The workflow failure is a real failed device smoke test, not a pass.
- The other seven workflow groups on that PR head passed: SS1 French source/package/hash/regression, SS23 package integrity, Mobile TypeScript, SS1 package integrity, JSS3 implementation/assets, Android mobile readiness and web mobile bundle readiness.
- The failed emulator job did not reach full/production npm audit or the SDK 57 candidate evaluation. The earlier missing `EXPO_TOKEN` condition remains an external gate for EAS staging APK and production AAB builds.
- Follow-up commit `55b641b0ebd92b5b3ffd96bd92e619ace81b3b68` updates `.github/workflows/mobile-release-audit.yml`: wait for Android's package manager, retry ADB installation up to four times, allow independent audit/SDK-candidate steps and evidence upload to complete even if emulator smoke fails, then preserve the emulator failure as the final job result. This does not turn a failed device test green or suppress its failure.
- New exact-head checks must complete before PR #947 is mergeable for release. The branch has not been merged and no signed production AAB or physical-device acceptance is claimed.

**Next action:** inspect the fresh CI runs for commit `55b641b0ebd92b5b3ffd96bd92e619ace81b3b68`, resolve any failure, then rebase/refresh against current master and rerun before considering merge. Separately obtain owner authorization for a production Key Value instance and EAS credentials; do not create billable resources or alter production service configuration without approval.


## Continuation update — 2026-11-17 01:15 UTC

- PR #947 is merged. The latest exact-head run `43984569495` completed locked install, offline tests, frontend-contract tests, mobile TypeScript, Android JS export, native prebuild and **Gradle debug APK build successfully**.
- The emulator smoke step failed before install because the action executed an inline Bash loop through `/usr/bin/sh` (`Syntax error: end of file unexpected (expecting "done")`). The current master workflow now invokes the dedicated Bash script `.github/scripts/android-emulator-smoke.sh`; this exact path still needs a fresh CI run to prove install/launch.
- The SDK 57 candidate alignment reduced the audit count from 15 (4 high, 11 moderate) to 3 moderate findings, but its Android export failed with `Unable to resolve module ../../App from node_modules/expo/AppEntry.js`.
- PR #972 adds `mobile/App.tsx` as a default re-export of the existing `src/App`, retaining `mobile/index.js` registration while satisfying Expo's conventional AppEntry fallback. The PR must pass mobile typecheck, SDK 56 export, debug APK build, emulator smoke and SDK 57 export before merge.
- EAS staging APK and signed production AAB remain skipped because repository secret `EXPO_TOKEN` is not configured.
- The app's production API URL remains `https://sts-school-backend.onrender.com`; that Render service currently fails startup due a stale database hostname. The alternate `sts-school-app` service also fails startup because `rate_limit_counters` is missing. Do not release a build against either until service health is restored.
- No physical-device acceptance, actual FCM delivery, authenticated end-to-end role journeys or production AAB has been verified.

# Android/mobile readiness checkpoint

- Task ID: MOB-ANDROID-001
- Status: IN PROGRESS — implementation expanded and rebased onto current master; automated/device/release gates remain open.
- Branch: `agent/mobile-android-readiness-20261113-v2`
- Base: `master` at `03aa60f0f448caed371e8da9a30ff1f91cb0cbf5`
- Latest implementation commit before this checkpoint: `3afd0c18aeb826ba122002d8c8f6adb5fdda9d6e`
- Current PR: [#727](https://github.com/PDS-David/sts-school-app/pull/727), draft and awaiting CI/review.
- Prior PR #696 was based on an older master, became 82 commits behind, and was closed as superseded by #727.
- Ownership/rebase check:
  - Master advanced after the original branch was created. Its changes touched notification context, role dashboards/navigation and curriculum/backend files, but did not overlap the 18 paths carried forward here.
  - Created this branch from the current master and reapplied only the mobile readiness paths. Comparison is 18 commits ahead, 0 behind.
  - Open work on current master includes messaging, notification and backend authorization PRs; the changed files in this branch do not overlap those PR paths.
- Changed files:
  - `.github/workflows/mobile-android-readiness.yml`
  - `README.md`
  - `docs/mobile/ANDROID-READINESS-CHECKPOINT.md`
  - `mobile/src/api/AuthContext.tsx`
  - `mobile/src/api/authSession.ts`
  - `mobile/src/api/client.ts`
  - `mobile/src/api/pushRegistration.ts`
  - `mobile/src/components/OfflineBanner.tsx`
  - `mobile/src/offline/outboxFailurePolicy.ts`
  - `mobile/src/offline/outboxFlushPolicy.ts`
  - `mobile/src/offline/outboxStore.ts`
  - `mobile/src/offline/replayPolicy.ts`
  - `mobile/src/offline/serialQueue.ts`
  - `mobile/src/offline/storage.ts`
  - `mobile/src/screens/MaterialsScreen.tsx`
  - `mobile/src/utils/materialDownload.ts`
  - `package.json`
  - `tests/mobile/offline-replay.test.mts`

## Implemented

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
12. Added a CI workflow for offline tests, mobile TypeScript validation and Android JS bundle export with artifact upload.

## Static audit findings

- `mobile/app.json` targets the HTTPS production API and its Android package identifier matches the Firebase Android client entry.
- Separate student, parent and teacher navigation trees exist; admin and finance-admin roles are routed separately in the root navigator.
- Backend `requireAuth` checks account active/expiry/deleted-student/pending-review state on requests; route-level permission and content-scope middleware remain authoritative. No backend permission logic was weakened.
- Assessments use assessment-scoped question endpoints and server submission routes.
- Materials were previously external-URL-only; direct HTTPS PDF/DOC download/share support is now implemented. Other link/video types continue to open externally.
- Announcements are in-app feeds and the backend explicitly does not push them. Push provider delivery to a real device is not verified.
- Existing GET cache has a per-user 500-entry cap and write invalidation. Cache freshness remains best-effort; no explicit max-age policy was added.

## Verification and limitations

- Static source inspection and branch comparison completed.
- 17 regression tests are authored; **they have not been executed**.
- Latest PR workflow run: [43452096073](https://github.com/PDS-David/sts-school-app/actions/runs/43452096073), still queued with no job steps reported at the last check.
- A local checkout was attempted, but the environment could not resolve github.com. No local npm install, Node test, TypeScript check, Expo export, emulator or device test was run.
- The new GitHub Actions workflow was added. Recent workflow attempts were reported as cancelled before any test/type/export steps produced results; no successful CI result or artifact is claimed.
- No EAS APK/AAB build was produced. Release credentials/availability were not verified.
- No physical-device verification is claimed.

## Remaining acceptance work

- Obtain a successful run of `npm ci`, `npm run test:mobile:offline`, mobile TypeScript validation and Android Expo bundle export; fix all failures.
- Run authenticated student, parent, teacher, admin and finance-admin smoke journeys against staging, including token expiry/revocation, logout/account switching and backend 401/403 authorization behavior.
- Verify outbox replay against the backend for duplicate-message/idempotency and 401/403/409 recovery semantics.
- Verify offline cache behavior and stale-data UX, assessments, materials download/share/open, file formats, push registration and actual Expo/FCM device delivery.
- Build an installable internal APK and production AAB where EAS credentials/runner access are available; verify installation/startup on supported Android versions and at least one physical device.
- Record test run URLs, artifact URLs, device/OS versions and results before changing task status.

## Exact next action

Check the current branch's Android readiness workflow runs. If they remain cancelled without starting, ask the repository owner to enable/retry Actions for this workflow or provide a runner; then run the 17 regression tests, TypeScript check and Android export before proceeding to emulator/device and EAS build verification.

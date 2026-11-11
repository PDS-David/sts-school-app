# SS1 French — software verification and delivery readiness

**Audit date:** 11 November 2026  
**Repository:** `PDS-David/sts-school-app`  
**Baseline:** `master` at `9645538538c3ecfb3e3df7cd61b3a8250c0e855c` before this verification-hardening PR  
**Database integration:** explicitly deferred by owner; no production or staging database was accessed or changed.

## Current package facts

The current `backend/src/db/ss1/subjects/french.json` package is `IMPLEMENTED` and contains:

- 40 authored lessons across three terms.
- 55 coverage records: 53 `IMPLEMENTED_EQUIVALENT`, 2 `MARKER`, and no `PARTIAL` or `UNRESOLVED` records.
- 28 source-to-replacement correction bindings.
- 218 practice items and 715 total assessment marks.
- 10 documented open items, all with `blocks_delivery=false`. These preserve source ambiguities and human-only follow-ups; they are not software release blockers.

The separate historical microtask queue contains 122 task records (112 `IMPLEMENTED_TESTING_DEFERRED`, 4 `PENDING`, 6 `BLOCKED`). Those statuses describe individual legacy work items and owner/human follow-ups; they must not be read as the current package status or as 10 current package delivery blockers. Several old queue descriptions still assert superseded package states. The queue's current-state audit note supersedes those descriptions.

## Automated verification already green

French workflow run [#138](https://github.com/PDS-David/sts-school-app/actions/runs/43082275703), on the commit merged by PR #600, completed successfully:

1. Verify the original source archive hash and the three registered DOCX member hashes.
2. Extract only the registered French source members using safe member-path checks.
3. Verify authored lesson body SHA-256 values.
4. Compile all three term source documents using the production parser.
5. Run French package tests and structural schema validation.
6. Install mobile dependencies and pass the mobile TypeScript check.
7. Pass student-launch static regression checks, including French lesson routing, listening screen, offline audio asset references and assessment request guards.
8. Pass the additional French resolver/cache safety tests added in PR #600.

PR #600: https://github.com/PDS-David/sts-school-app/pull/600

## Additional tests added in this change

- Move the dialogue transcript and ten-question listening assessment into a pure TypeScript module so it can be tested without React Native.
- Test the dialogue's eight translated lines and two speakers.
- Test that all ten questions have exactly three distinct options and valid answer indices.
- Test perfect, wrong, incomplete and invalid answer submissions and their score/completion results.
- Inspect the two committed MP3 files for ID3 headers, valid MPEG frame-header sequences, non-trivial file size and distinct standard/slow encodings.
- Include these tests in `npm run test:ss1:french` and trigger the French workflow when the dialogue module or audio assets change.

## Further CI checks

This PR also adds a full backend TypeScript build and an Android-targeted Expo bundle export to the French verification workflow. These check that the integrated backend compiles and that the student app can bundle the French screen and its local MP3 assets for Android without requiring an Android SDK or a database connection.

## Explicitly deferred / not software-certifiable here

- Database integration, importer execution against a database, and live student data: deferred by owner as requested.
- Physical Android playback, device-specific text-to-speech voice availability and Bluetooth/audio-focus behavior: require real devices.
- Classroom observation of student pronunciation, oral alphabet recitation and teacher scoring: require real learners/teachers.
- EAS production signing and Google Play publication: require the appropriate external build credentials and release approval.
- Any future teacher/owner clarification of ambiguous source phrases remains a human decision; no interpretation is fabricated.

## Acceptance rule

The additional work is complete only when the new French GitHub Actions run is green. A green CI run establishes repository-side build, package, unit, source-integrity and bundle checks; it does not claim database or classroom validation.

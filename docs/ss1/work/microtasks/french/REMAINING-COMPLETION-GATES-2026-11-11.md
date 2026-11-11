# SS1 French — student delivery and release status

**Status date:** 11 November 2026  
**Package:** 40 authored lessons; 218 practice items; 715 marks.  
**Coverage:** 53 IMPLEMENTED_EQUIVALENT records; 2 scheme markers; no PARTIAL or UNRESOLVED delivery coverage.  
**Approvals:** 40/40 lessons approved for the owner-directed replacement scope.  
**Follow-ups:** 10 recorded, 0 delivery-blocking.  
**Learner verification:** DEFERRED for all 40 lessons; no classroom cohort observation is claimed.

## Student-facing curriculum decisions

1. Unsupported historical/legal superlatives and unverified government motives are omitted. The Week 1 replacement teaches documented Nigerian curriculum and institutional context with dated attribution and clear limits.
2. The source's 15-country Anglophone classification is not repeated as a legal fact. The replacement teaches a clearly labelled, non-exhaustive set of verified examples and how to verify official-language status.
3. The bare head-of-state heading is taught as a dated-information task. The country/capital/currency reference remains available; current office-holders must always be dated.
4. Malformed greeting strings are replaced with conventional French forms. Ambiguous source wording is not guessed.
5. The two unreadable profession entries are excluded from assessed vocabulary. Students learn the clear profession list and informaticien/informaticienne as a modern term.
6. The oral-accent and alphabet tasks are included as teacher-led practice. Their presence in the lesson does not claim that a learner has already demonstrated pronunciation or recitation.
7. The unidentified textbook pages 63–64 are replaced by original, keyed comprehension homework in the flight lesson.
8. The Third-Term dialogue has two bundled synthetic MP3 recordings (standard and slow), transcript, translations and a ten-question comprehension activity. The recordings are original classroom resources, not official WAEC/NECO audio or human/native-speaker recordings.

## App delivery

- The student subject list identifies the SS1 French dialogue lesson and routes it into the French Listening activity.
- The activity plays the bundled standard/slow MP3 files offline and includes line-by-line device speech as a fallback.
- The backend now has a French delivery adapter that matches the exact source lesson body fingerprint and serves the approved authored replacement with objectives, full teaching text, keyed practice, marking guide and source attribution.
- The source-verification workflow checks all 28 correction bindings against extracted source DOCX rows and verifies that each exact row resolves to the corresponding student-delivery lesson.
- The mobile bundle export has passed. A new Android production binary is still required because Expo Audio is a native dependency.

## Non-blocking follow-ups

The ten open records preserve the original-source uncertainties and classroom checks for future teacher refinement. They no longer block the approved replacement lessons. They must not be represented as resolved source facts:
- official WAEC/NECO audio identity/rights;
- the exact intended meanings of malformed source strings;
- the exact source occupations behind “computateur” and “couteur”;
- exhaustive Anglophone classification for all 15 source entries;
- exact scope of the bare heads-of-state heading;
- the textbook identity/pages 63–64;
- live oral accent and alphabet observations.

## Production release requirement

The Android production workflow already completed dependency installation and Expo/Metro bundle export successfully, including both MP3 assets. EAS build stopped because the GitHub repository secret `EXPO_TOKEN` is not configured. Add that secret in repository Settings → Secrets and variables → Actions, then rerun **Build SS1 French mobile listening release**. The workflow builds but does not submit to Google Play.

## Final distinction

The authored replacement curriculum and source-exercise audit are approved and implemented for student delivery. The live classroom observations remain deferred. The app source changes are not yet a released Android binary until the Expo production build succeeds and the build is distributed to students.

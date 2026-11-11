# SS1 French verification record — 11 November 2026

## Automated result

GitHub Actions run: https://github.com/PDS-David/sts-school-app/actions/runs/42983017031

Workflow: **SS1 French source and package verification**  
Run result: **SUCCESS**  
Source archive/member hash checks: passed  
Production DOCX extraction/compiler: passed  
French package tests: **10 passed, 0 failed**  
Package structural validator: passed

Compiler summary:
- Canonical subject: French (SS 1)
- Original source rows parsed: 28
- Authored supplements compiled: 40
- Delivery corrections bound to exact source-row identities: 28
- Coverage records: 55
- Package status: PENDING
- Compiler ready: false

The run proves source extraction, exact source-row identities, package schema/hash integrity, correction identity binding, coverage reference integrity, and the 10 automated package assertions. It does not prove lesson content approval, production database import, student/teacher UI delivery, device operation, oral performance, or classroom acceptance.

## Remaining compiler blockers

The compiler correctly reports incomplete coverage for:
- FRENCH-BODY-001 and T1 Week 1 objective records 1–3: unsupported historical/legal-status/superlative claims remain excluded pending authenticated evidence or teacher-approved exclusion.
- FRENCH-BODY-005: written accent/diacritic content is present; oral recognition/pronunciation requires a separately observed activity.
- FRENCH-BODY-006: the original profession entries “computateur” and “couteur” remain unresolved; no guessed correction is asserted.
- FRENCH-BODY-019: the source asks for a WAEC/NECO cassette/CD but does not identify a recording or supply rights evidence.

Other open owner decisions:
- T1 Week 2: intended scope of the bare “Chefs d'etats/presidents” and “Mornaies” headings.
- T1 Week 3: intended meanings of five incomplete greeting/celebration strings.
- T1 Week 3 self-presentation: state of origin versus marital status is covered as alternatives, but the intended source reading remains unconfirmed.
- T1 Week 6: owner/teacher decision on the two unclear occupation strings.
- T3 Week 1: exact recording/rights evidence or explicit owner approval of the original printed-dialogue/teacher-read equivalent.

All 40 authored lessons remain content_approval=PENDING and verification=DEFERRED. No approval or oral verification has been fabricated. The package is not deployable/complete until the scope and owner gates are closed and the application/database delivery path is separately verified.


## Follow-up changes after the initial verification record

- The replacement-side objective/practice alignment inventory is now recorded in `OBJECTIVE-PRACTICE-ALIGNMENT-2026-11-11.md` for all 40 authored lessons.
- The complete alphabet sequence and irregular simple-future paradigms gained explicit practice items; package totals are now 191 practice items / 557 marks.
- The oral-accent objective is explicitly PARTIAL until actual learner pronunciation is observed.
- Two synthetic MP3 dialogue recordings (standard and slow) have been generated with the Piper UPMC two-speaker French model, committed to `mobile/assets/french/`, and integrated into the student listening screen via Expo Audio. They are offline assets, not official WAEC/NECO recordings or human/native-speaker certification.
- The mobile listening activity now includes a scored ten-question multiple-choice quiz and a device-speech fallback for individual line practice.
- The source-exercise-by-source-exercise audit remains blocked until the original First-, Second- and Third-Term French DOCX files are supplied; their archive member names and hashes alone are not enough to verify unseen exercise wording.


## Additional oral-verification blockers

The full alphabet sequence is now tested in writing, but the source objective includes recitation of all twenty-six French letter names. The oral accent lesson also has five prompts and a 10-point checklist. Neither oral outcome has been observed in learners. The package now records two explicit blocking items: `FRENCH-ALPHABET-RECITATION-OBSERVATION` and `FRENCH-ORAL-ACCENT-OBSERVATION`. A French teacher must conduct and document these live observations before either objective is marked complete.


## Mobile build verification — 11 November 2026

- The two standard/slow French MP3 files are committed under `mobile/assets/french/` and the student listening screen uses Expo Audio for offline playback.
- GitHub Actions mobile TypeScript, static/focused regressions, live PostgreSQL/asset tests and the integration verification job passed for the French audio player branch.
- The dedicated Android production-build workflow successfully completed `npm ci` and `npx expo export --platform android`; Metro confirmed that the local MP3 assets bundle correctly.
- The EAS production build did not start because the repository secret `EXPO_TOKEN` is not configured. Add an Expo access token as the GitHub Actions secret `EXPO_TOKEN`, then rerun **Build SS1 French mobile listening release**. No APK/AAB or student rollout is claimed until that build succeeds.


## Full original-source exercise audit

The First-, Second- and Third-Term French DOCX members were extracted from the repository source archive through the hash-verifying GitHub Actions artifact. All 28 source correction bindings now have per-exercise mappings and verdicts in `SOURCE-EXERCISE-RECONCILIATION-2026-11-11.md`. The replacement practice set has been expanded to cover the original homework/exercise types, including tréma words, ten land-transport modes, the five flight comprehension tasks, imparfait and passé-composé conjugation homework, village/city composition, ten preference sentences, text-equivalent image matching, true/false health comprehension and grammar/revision questions. The source's page 63–64 reference remains open because the textbook identity/pages are not supplied.

Current package totals: 40 lessons, 216 questions, 710 marks; coverage 40 implemented-equivalent, 13 partial, 2 scheme markers; 10 open items, 9 blocking.

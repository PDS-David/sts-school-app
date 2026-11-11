# SS1 French — remaining completion gates and owner decisions

**Status date:** 11 November 2026  
**Current package:** 40 lessons; 191 practice items; 557 marks.  
**Coverage:** 41 IMPLEMENTED_EQUIVALENT, 12 PARTIAL, 2 scheme markers.  
**Open items:** 10 total, 9 delivery-blocking.

This register separates work the project team can author and test from decisions or evidence that only the curriculum owner, French teacher, learners or account administrator can supply. No item below is treated as approved by silence.

## Source material and audit status

The three original DOCX members were extracted from the repository's registered SS1 source archive by the hash-verifying French GitHub Actions workflow. All 28 correction bindings have now been reconciled against the original source exercise instructions. See `SOURCE-EXERCISE-RECONCILIATION-2026-11-11.md`. No additional source upload is needed for that audit.

## Curriculum-owner decisions

### 1. First Term Week 1 — historical/legal claims

The lesson deliberately avoids asserting that French is currently Nigeria's second official language, the most important foreign language after English, or that it was selected for a specific set of motives. Those claims lack sufficient authenticated primary evidence in the inspected materials.

**Recommended safe disposition:** approve omission of those unsupported claims and retain the evidence-backed practical benefits and neighbour-language rationale. Otherwise provide the authenticated primary source and exact passage. Until approved, Week 1 objectives 1–3 remain PARTIAL.

### 2. First Term Week 2 — Anglophone countries

The source gives 15 countries but does not define whether *Anglophone* means legal official language, official working language, or broader English use. Current legal evidence contradicts treating every source entry as an English-official country. The replacement currently teaches three verified examples only.

**Required decision:** choose the intended criterion and either provide/approve the complete 15-country evidence list under that criterion, or approve narrowing the objective to selected examples. The exhaustive 15-country exercise remains PARTIAL.

### 3. First Term Week 2 — heads of state and currencies

The source ends with bare headings “Chefs d'etats/presidents” and “Mornaies” and gives no country set or list length.

**Required decision:** confirm which countries the head-of-state activity should cover. The currency supplement already provides a country/currency reference for the Francophone country set; confirm whether the bare heading was intended to extend that same set to the Anglophone list. Do not certify an invented scope.

### 4. First Term Week 3 — incomplete expressions and “Votre état”

The source has five incomplete strings: “Bonsoir nuit”, “Bonjour nee”, “Bon paque”, “Bonjour maman, comment?” and “Vous avez bien”. Conventional replacements are taught, but their intended source meanings have not been confirmed. The “Votre état” prompt can mean state of origin or marital status; the replacement teaches both alternatives.

**Required decision:** approve omission/replacement of the five incomplete strings or provide the intended meanings; select whether “Votre état” means state of origin or marital status.

### 5. First Term Week 6 — unclear occupations

The source table contains “computateur” and “couteur” in entries that do not establish the intended professions. The replacement teaches 44 clear entries and separately identifies informaticien/informaticienne as a modern computing profession; it does not silently rewrite the source.

**Recommended safe disposition:** omit the two unclear source rows and retain the clear vocabulary, including the explicitly modern informaticien/informaticienne entry. Otherwise provide the intended occupations. Week 6 remains PARTIAL until approved.

### 6. Third Term Week 1 — official exam-board audio

The source refers to a WAEC/NECO cassette/CD but supplies no year, session, paper, track, title, publisher or rights holder. Two original synthetic recordings of the classroom dialogue are now bundled in the app for offline playback.

**Required decision:** approve the original synthetic dialogue as the classroom listening equivalent and accept omission of the unidentified official recording, or supply the exact rights-cleared WAEC/NECO recording. The generated recordings must never be labelled official exam audio.

## Teacher and learner evidence required

1. **Oral accents:** a French teacher must conduct the five-prompt oral activity and record a dated 10-point observation checklist for real learners.
2. **Alphabet recitation:** a French teacher must listen to learners recite the 26 French letter names and record a dated result.
3. **All 40 lessons:** content approval remains PENDING and learner verification remains DEFERRED. Teacher review and classroom evidence are still required before the package can be certified as completed.

## Production-build credential required

The Android production workflow successfully installed locked dependencies and exported the Metro bundle, including both local MP3 assets. The EAS production build stopped because GitHub secret `EXPO_TOKEN` is not configured.

**Required:** add an Expo access token to the repository's GitHub Actions secrets under the name `EXPO_TOKEN`, then rerun **Build SS1 French mobile listening release**. The workflow builds an Android production app but does not submit it to Google Play.

## Completion rule

Do not change the package to COMPLETE until the source exercise audit, owner decisions, live oral observations, all 40 content approvals, staging/database and teacher/student runtime verification, and a successful production mobile build are evidenced. Automated CI passing is necessary but is not curriculum approval or classroom acceptance.


## Source audit closure

The original DOCX members were extracted from the repository archive and all 28 correction bindings were reconciled. The umbrella authoring audit is no longer a blocker. Remaining source-related blockers are the undefined Anglophone criterion, unscoped heads-of-state/currency headings, ambiguous greetings and occupation entries, the unidentified textbook pages 63–64, and the unapproved synthetic-vs-official exam-audio disposition.

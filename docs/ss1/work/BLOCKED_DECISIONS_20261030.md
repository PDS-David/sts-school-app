# Blocked-item decision register — 30 October 2026 (UNR-03)

Base: `origin/master` `db897f6`. Status: `IMPLEMENTED_TESTING_DEFERRED`. Nothing was run (no tests, typechecks, importer, compiler, DB or device checks); no queue, package or status was changed; no decision is answered here. Every "recommendation" below is a suggestion for the owner, not an approval.

## 1. Counts re-read at this base

The prompt cited 70 BLOCKED items and 209 open items at `8ffcd12`. At `db897f6` the queues hold **71 BLOCKED** items and the packages hold **215 open items**. Differences against the prompt: BLOCKED 71 vs 70 and `FACTUAL_DEPENDENCY` 45 vs 44, because the Yoruba queue now has 20 `YO-FACT-*-DEFECTS` items (the prompt said 19; `YO-FACT-T3-W02-DEFECTS` arrived with PR #259); open items 215 vs 209, with `CONTENT` 126 vs 121 and `VERIFICATION` 27 vs 26, all in the Yoruba package. `OWNER_ACTION` (55), `FACT` (5) and `PERMISSION` (2) match the prompt.

Blocked by kind: FACTUAL_DEPENDENCY 45, TEST 6, OWNER_DECISION 6, ASSET 4, OWNER_APPROVAL 4, LESSON 2, BRANCH_COMPARISON 2, MISSING_MATERIAL 2.
Open items by kind: CONTENT 126, OWNER_ACTION 55, VERIFICATION 27, FACT 5, PERMISSION 2.

## 2. Decision register

27 rows. All 71 blocked IDs appear exactly once (Annex A); all 55 `OWNER_ACTION` open items map to exactly one row (Annex B).

| Decision | Question | Affected blocked items | Evidence the owner must supply | Recommended default | Subject | Becomes runnable when answered |
|---|---|---|---|---|---|---|
| **DEC-01** | Which named role signs content approvals, and does one signature per subject close its blocked approval item? (protocol defined in UNR-04) | `AG-FACT-CONTENT-APPROVAL`<br>`BIO-FACT-CONTENT-APPROVAL`<br>`BK-FACT-CONTENT-APPROVAL`<br>`CC-FACT-CONTENT-APPROVAL`<br>`CHEM-FACT-CONTENT-APPROVAL`<br>`CIV-FACT-CONTENT-APPROVAL`<br>`COM-FACT-CONTENT-APPROVAL`<br>`DP-FACT-CONTENT-APPROVAL`<br>… +11 more (Annex A) | Named approver role per subject, date, scope and version for each `approval_reference`; for subjects with no authored lessons, confirmation that nothing exists to approve. | Recommendation: adopt the UNR-04 protocol. One owner-signed reference per subject, approve only subjects that have authored lessons, record the rest as "nothing to approve". | 19 subjects (all except Technical Drawing and Yoruba) | 19 approval items become signable; `state.content_approval` can be set once signed. Delivery still also needs the verification stage. |
| **DEC-02** | Is the deferred-testing stage now open (resume tests, typechecks, importer/compiler runs and the PR #71 test comparisons)? | `FM-TEST-FULL-SOURCE-REGRESSION`<br>`MATH-TEST-FULL-SOURCE-REGRESSION`<br>`PHYS-TEST-PACKAGE-NEW`<br>`PHYS-TEST-FULL-SOURCE-REGRESSION`<br>`TD-TEST-PACKAGE-NEW`<br>`TD-TEST-FULL-SOURCE-REGRESSION`<br>`MATH-CMP-D4-TESTS`<br>`PHYS-CMP-D4-TESTS` | One owner statement that testing may resume, naming the authorised environment and which worker owns the run. | Recommendation: one switch, flipped only when the curriculum worker is idle and the content PRs are merged; run package tests first (PHYS, TD), then full-source regressions, then the two PR #71 comparisons. | FM, MATH, PHYS, TD | 8 test and comparison items become runnable. Several still depend on authoring-finish items, which stay in their own queues. |
| **DEC-03** | Does the Technical Drawing 1st or 3rd Term source exist, and where is it? | `TD-MISSING-T1`<br>`TD-MISSING-T3` | Each missing term document (title, class, term, file) with its sha256, or a written statement that it does not exist. | Recommendation: if no file is supplied, keep both terms UNRESOLVED and invent no scheme. | Technical Drawing | A new registration/indexing item per supplied term; TD-T2-W01-REVISION-SCOPE can then be checked. |
| **DEC-04** | Does the Further Mathematics 3rd Term material (scheme and Weeks 1, 7, 9-12) exist, or is the supplied document the whole term? | `FM-FACT-T3-MISSING-MATERIAL` | The missing material with sha256, or the owner's written confirmation that the supplied document is complete. | Recommendation: ask the owner first; if neither answer arrives, leave COV-FM-T3-SCHEME UNRESOLVED. | Further Mathematics | A registration/indexing item for the new material, or closure of OI-FM-003. Queue items that depend on it: 1 (e.g. `FM-SCOPE-OI-FM-003`). |
| **DEC-05** | Is the French T3 Week 1 exam audio supplied, or is the original equivalent approved instead; if supplied, is it installed and later observed? | `FR-ASSET-EXAM-AUDIO-ACQUISITION`<br>`FR-ASSET-EXAM-AUDIO-INSTALL`<br>`FR-VERIFY-ORAL-OBSERVATION` | Audio identity, file, rights/provenance record (audio/mpeg or audio/wav), or the owner's approval of the equivalent. | Recommendation: approve the original equivalent for now; treat real audio as an optional later upgrade. Oral observation stays DEFERRED either way. | French | ACQUISITION closes on either answer; INSTALL runs only if audio is supplied; oral observation needs a device run. |
| **DEC-06** | Is an authorised audio model supplied for the English phonetics and stress lessons? | `ENG-FACT-ORAL-AUDIO`<br>`ENG-ASSET-AUDIO-MODEL` | Audio file or accessible authorised recording, its permission basis, and the phonetics/stress objectives it supports. | Recommendation: leave the oral-observation item open and ship the written lessons without audio until supplied. | English | ENG-ASSET-AUDIO-MODEL can hold the audio; the oral-observation open item stays deferred. |
| **DEC-07** | Will the owner supply the exact prescribed-book extracts and textbook pages, or accept a labelled equivalent reading activity? | `ENG-FACT-PRESCRIBED-PASSAGES` | Edition and authorised extracts for the prescribed books, and the textbook pages cited by the UNRESOLVED English entries (see UNR-06), or a written acceptance of the equivalent activity. | Recommendation: accept the labelled equivalent activity for the reading supplements unless the exact texts are supplied. | English | The reading supplements can be reviewed for approval; the W01-W03 external-material open items can be resolved or closed. |
| **DEC-08** | Is the Yoruba Week 3 two-panel vowel chart (authored rebuild, not a copy) approved? | `YO-ASSET-T1-W03-VOWEL-CHART` | Subject-expert approval of the seven oral and five nasal vowels and the grid layout (depends on DEC-Y1). | Recommendation: decide together with DEC-Y1; build the chart as structured data only after that. | Yoruba | The asset can be authored once DEC-Y1 is answered. |
| **DEC-Y1** | Yoruba 1st Term: one recorded subject-expert decision on the Week 1-8 source defects, tone/sub-dot and IPA notation, and the Week 7 benefits source. | `YO-FACT-T1-W01-DEFECTS`<br>`YO-FACT-T1-W02-DEFECTS`<br>`YO-FACT-T1-W03-DEFECTS`<br>`YO-FACT-T1-W04-DEFECTS`<br>`YO-FACT-T1-W05-DEFECTS`<br>`YO-FACT-T1-W06-DEFECTS`<br>`YO-FACT-T1-W07-DEFECTS`<br>`YO-FACT-T1-W08-DEFECTS` | One expert decision record per week (or one covering all eight), naming the authority used for each defect; for Week 7, the named source of the benefits or an agreement to defer them. | Recommendation: one sitting with one expert for all eight weeks, using the Yoruba evidence notes as the agenda. | Yoruba | The three lessons per week can be authored for each decided week (24 lessons for the term). Queue items that depend on it: 23 (e.g. `YO-ASSET-T1-W03-VOWEL-CHART`, `YO-LES-T1-W01-ASA`, `YO-LES-T1-W01-EDE`, `YO-LES-T1-W01-LIT`). |
| **DEC-Y2** | Yoruba 2nd Term: one recorded subject-expert decision on the Week 1-10 defects (including the absent Week 8 body and the literature text). | `YO-FACT-T2-W01-DEFECTS`<br>`YO-FACT-T2-W02-DEFECTS`<br>`YO-FACT-T2-W03-DEFECTS`<br>`YO-FACT-T2-W04-DEFECTS`<br>`YO-FACT-T2-W05-DEFECTS`<br>`YO-FACT-T2-W06-DEFECTS`<br>`YO-FACT-T2-W07-DEFECTS`<br>`YO-FACT-T2-W08-DEFECTS`<br>… +2 more (Annex A) | Expert decision per week, the selected literature text for Week 8, and rulings on the aroko/oniroyin mapping, the noun classification and the untaught Oriki and ipolowo. | Recommendation: same expert and sitting as DEC-Y1 to keep tone and notation consistent across terms. | Yoruba | Lessons for each decided week. Queue items that depend on it: 30 (e.g. `YO-LES-T2-W01-ASA`, `YO-LES-T2-W01-EDE`, `YO-LES-T2-W01-LIT`, `YO-LES-T2-W02-ASA`). |
| **DEC-Y3** | Yoruba 3rd Term: one recorded subject-expert decision on the Week 1 and Week 2 defects. | `YO-FACT-T3-W01-DEFECTS`<br>`YO-FACT-T3-W02-DEFECTS` | Expert decision for each of the two weeks on defects and tone/sub-dot notation. | Recommendation: take with DEC-Y1 and DEC-Y2. | Yoruba | Lessons for the two decided weeks. Queue items that depend on it: 6 (e.g. `YO-LES-T3-W01-ASA`, `YO-LES-T3-W01-EDE`, `YO-LES-T3-W01-LIT`, `YO-LES-T3-W02-ASA`). |
| **DEC-Y4** | Which row-identity option for the Yoruba week labels: A (add split_before rules), B (foundation change for explicit labels) or C? | — (open items only; see Annex B) | A recorded choice of option for T1 and T2, and the T3 approach named in YO-FND-T3-01. | Recommendation: option A, which the package itself marks as recommended and which needs no foundation change. This touches yoruba.json, so it must be scheduled with the curriculum worker. | Yoruba | The ROW-IDENTITY verification open items and the later re-binding of coverage. |
| **DEC-Y5** | Which WAEC/NECO prose and literature texts apply to Yoruba, or is the strand dropped for the term? | — (open items only; see Annex B) | Title, author, edition and syllabus year per text, or a written decision to drop the strand. | Recommendation: name the texts; if they cannot be named, drop the strand and record that. | Yoruba | YO-LES-T1-W05-LIT and the Week 8 literature objective stop being UNRESOLVED. |
| **DEC-AL** | Does the owner approve the source-alias rules (heading differs from the canonical subject name) for every subject? | `MATH-APPROVAL-ALIASES`<br>`FM-FACT-ALIAS-APPROVAL` | One approval reference per alias rule (or a rejection), replacing `PENDING-OWNER`. Listed in Annex B. Civic Education T2 also allows choosing the bare-name header_text. | Recommendation: approve all aliases in a single owner sheet; each differs only by label or class text. Reject any that does not. | ALL | Every `PENDING-OWNER` alias reference can be replaced; no other change. |
| **DEC-PH3** | Is the Physics 3rd Term document (no subject heading, opens "THIRD TERM E-LEARNING NOTE") assigned to Physics? | `PHYS-OWNER-ALIAS-T3` | Owner confirmation of the filename/manifest assignment, recorded as the alias approval_reference. | Recommendation: confirm only after PHYS-SRC-T3 shows the heading is truly absent; otherwise close as not needed. | Physics | PHYSICS-T3-ALIAS-APPROVAL can be completed. |
| **DEC-M1** | Do Mathematics logarithm lessons use mathematical tables (with edition and reuse permission) or a calculator method? | `MATH-OWNER-LOG-METHOD`<br>`MATH-LES-T1-W08-LOGARITHMS`<br>`MATH-LES-T1-W09-LOG-POWERS` | Method choice; if tables, the edition and a reuse permission. | Recommendation: calculator method, because it needs no third-party edition or permission. | Mathematics | Both T1 logarithm replacement lessons (W08, W09) can be authored. |
| **DEC-M2** | Mathematics: equation-aware extractor with a reviewed ID migration (A), or replacement lessons for every affected row (B)? | `MATH-OWNER-EQUATION-STRATEGY` | A recorded choice. A changes content-bound row IDs; B means authoring replacements for each row with lost notation. | Recommendation: decide once for MATH, PHYS, TD and FM (DEC-M2, DEC-P2, DEC-T1, DEC-F1 share the same question). Option B needs no foundation change; A is the larger investment. | Mathematics | Replacement items are appended only for rows the decision leaves uncovered. |
| **DEC-M3** | May embedded third-party tutor material in Mathematics (T2/T3 adverts) be reused, or must it be excluded? | `MATH-OWNER-RIGHTS-PERMISSION` | Owner rights decision, with licence reference if reuse is allowed. | Recommendation: exclude it from delivery unless a licence is shown. | Mathematics | The advert-inspection open item can be closed. |
| **DEC-P1** | Does a revision/examination plan exist for the Physics scheme weeks that have no body? | `PHYS-OWNER-REVISION-PLAN` | Teacher confirmation that a plan exists (with the document) or that none does. | Recommendation: if none is supplied, record "none exists" and invent no content. | Physics | The no-body weeks can be dispositioned. |
| **DEC-P2** | Physics: how should extraction handle flattened superscripts, subscripts, fractions and figures in the .doc sources? | `PHYS-OWNER-EXTRACTION-STRATEGY` | A recorded choice between an equation-aware extractor and replacement lessons. | Recommendation: same answer as DEC-M2. | Physics | Follow-up replacement items for uncovered rows. |
| **DEC-T1** | Technical Drawing: how should extraction handle dropped equations, sub/superscripts and figures? | `TD-OWNER-EXTRACTION-STRATEGY` | A recorded choice between an equation-aware extractor and replacement lessons. | Recommendation: same answer as DEC-M2. | Technical Drawing | Follow-up replacement items for uncovered rows. |
| **DEC-F1** | Further Mathematics: adopt an equation-aware extractor with a reviewed ID migration, or rely on replacement lessons? | `FM-FACT-EQUATION-EXTRACTOR-DECISION` | A recorded choice. A prototype `recover_equations.mts` exists but was not run. | Recommendation: same answer as DEC-M2. | Further Mathematics | Replacement items for uncovered rows. |
| **DEC-F2** | May the school deliver the commercial tutor's Further Mathematics notes, and may branding and contact details be removed? | `FM-FACT-VENDOR-PERMISSION` | Licence or permission reference, and approval to remove branding and contact details. | Recommendation: treat as not permitted until a licence is shown; keep the open item blocking delivery. | Further Mathematics | OI-FM-004 and OI-FM-007 can be settled. |
| **DEC-F3** | Further Mathematics T1 Week 1: is the printed exponent 3/8 intended, or a slip for 3/4? | `FM-FACT-T1-W01-GEN-EVAL-F` | Teacher or owner answer. | Recommendation: ask the teacher; the replacement lesson must not reuse the printed item either way. | Further Mathematics | The Week 1 replacement can state the correct value. Queue items that depend on it: 1 (e.g. `FM-SCOPE-OI-FM-002`). |
| **DEC-B1** | Bookkeeping: is the supplied 2nd Term file the intended document, given its text matches the 1st Term? | — (open items only; see Annex B) | Owner confirmation, or the correct 2nd Term document. | Recommendation: ask for the correct file; indexing BK-INV-T2 should wait. | Bookkeeping | BK-INV-T2 and duplicate-coverage handling. |
| **DEC-FR1** | French T1 Week 2: what was each heading meant to teach (for example which countries' leaders)? | — (open items only; see Annex B) | Owner or teacher statement per heading. | Recommendation: no leaders or dates are to be invented; ask the teacher. | French | The Week 2 supplements can be authored. |
| **DEC-T2** | Technical Drawing T2: are the footer and header non-instructional and not to be reproduced? | — (open items only; see Annex B) | Owner confirmation. | Recommendation: confirm they are non-instructional. | Technical Drawing | The footer/tagline open item closes. |

## 3. How the collapses were made

- 19 content approvals (17 `*-FACT-CONTENT-APPROVAL`, `MATH-APPROVAL-CONTENT`, `PHYS-APPROVAL-CONTENT`) become DEC-01, the protocol UNR-04 defines.
- 20 `YO-FACT-*-DEFECTS` items become three per-term decisions (DEC-Y1, DEC-Y2, DEC-Y3).
- The 6 `TEST` items and the 2 `BRANCH_COMPARISON` items become one switch, DEC-02, because the comparisons also wait on the testing stage.
- The 2 `MISSING_MATERIAL` items, the `ASSET` items and the matching `FACTUAL_DEPENDENCY` supply items become supply requests (DEC-03 to DEC-08); UNR-06 holds the acquisition detail.
- Distinct technical decisions keep their own rows: MATH log method (DEC-M1), MATH equation strategy (DEC-M2), MATH rights (DEC-M3), PHYS revision plan (DEC-P1), PHYS and TD extraction (DEC-P2, DEC-T1), FM extractor (DEC-F1), FM vendor rights (DEC-F2), alias approvals (DEC-AL, DEC-PH3).
- DEC-M2, DEC-P2, DEC-T1 and DEC-F1 ask the same foundation question four times; answering it once is cleaner, but each row stays separate because each closes a different blocked ID.
- `YO-ASSET-T1-W03-VOWEL-CHART` is an authored asset rather than something the owner supplies, so it sits in DEC-08 behind DEC-Y1.
- `FR-VERIFY-ORAL-OBSERVATION` is placed with the French audio chain (DEC-05) because it depends on the installed audio.

## 4. Not covered here

The non-`OWNER_ACTION` open items (`CONTENT`, `VERIFICATION`, `FACT`, `PERMISSION`) are mostly authoring or verification work, not owner decisions. Only the ones directly gated by a register row are linked in the table. The three French `FACT` items (`FRENCH-UNCLEAR-OCCUPATIONS`, `FRENCH-T1-W01-FACT-CLAIMS`, `FRENCH-T1-W01-NEIGHBOURS-LANGUAGE-STATUS`) need dated authoritative sources, not an owner choice, so they have no row.

## Annex A — every blocked ID and its row

| Blocked ID | Queue | Kind | Row |
|---|---|---|---|
| `AG-FACT-CONTENT-APPROVAL` | agricultural-science | FACTUAL_DEPENDENCY | DEC-01 |
| `BIO-FACT-CONTENT-APPROVAL` | biology | FACTUAL_DEPENDENCY | DEC-01 |
| `BK-FACT-CONTENT-APPROVAL` | bookkeeping | FACTUAL_DEPENDENCY | DEC-01 |
| `CC-FACT-CONTENT-APPROVAL` | catering-craft | FACTUAL_DEPENDENCY | DEC-01 |
| `CHEM-FACT-CONTENT-APPROVAL` | chemistry | FACTUAL_DEPENDENCY | DEC-01 |
| `CIV-FACT-CONTENT-APPROVAL` | civic-education | FACTUAL_DEPENDENCY | DEC-01 |
| `COM-FACT-CONTENT-APPROVAL` | commerce | FACTUAL_DEPENDENCY | DEC-01 |
| `DP-FACT-CONTENT-APPROVAL` | data-processing | FACTUAL_DEPENDENCY | DEC-01 |
| `ECON-FACT-CONTENT-APPROVAL` | economics | FACTUAL_DEPENDENCY | DEC-01 |
| `ENG-ASSET-AUDIO-MODEL` | english | ASSET | DEC-06 |
| `ENG-FACT-CONTENT-APPROVAL` | english | FACTUAL_DEPENDENCY | DEC-01 |
| `ENG-FACT-ORAL-AUDIO` | english | FACTUAL_DEPENDENCY | DEC-06 |
| `ENG-FACT-PRESCRIBED-PASSAGES` | english | FACTUAL_DEPENDENCY | DEC-07 |
| `FA-FACT-CONTENT-APPROVAL` | financial-accounting | FACTUAL_DEPENDENCY | DEC-01 |
| `FM-FACT-ALIAS-APPROVAL` | further-mathematics | FACTUAL_DEPENDENCY | DEC-AL |
| `FM-FACT-CONTENT-APPROVAL` | further-mathematics | FACTUAL_DEPENDENCY | DEC-01 |
| `FM-FACT-EQUATION-EXTRACTOR-DECISION` | further-mathematics | FACTUAL_DEPENDENCY | DEC-F1 |
| `FM-FACT-T1-W01-GEN-EVAL-F` | further-mathematics | FACTUAL_DEPENDENCY | DEC-F3 |
| `FM-FACT-T3-MISSING-MATERIAL` | further-mathematics | FACTUAL_DEPENDENCY | DEC-04 |
| `FM-FACT-VENDOR-PERMISSION` | further-mathematics | FACTUAL_DEPENDENCY | DEC-F2 |
| `FM-TEST-FULL-SOURCE-REGRESSION` | further-mathematics | TEST | DEC-02 |
| `FN-FACT-CONTENT-APPROVAL` | food-and-nutrition | FACTUAL_DEPENDENCY | DEC-01 |
| `FR-ASSET-EXAM-AUDIO-ACQUISITION` | french | ASSET | DEC-05 |
| `FR-ASSET-EXAM-AUDIO-INSTALL` | french | ASSET | DEC-05 |
| `FR-FACT-CONTENT-APPROVAL` | french | FACTUAL_DEPENDENCY | DEC-01 |
| `FR-VERIFY-ORAL-OBSERVATION` | french | FACTUAL_DEPENDENCY | DEC-05 |
| `GEO-FACT-CONTENT-APPROVAL` | geography | FACTUAL_DEPENDENCY | DEC-01 |
| `GOV-FACT-CONTENT-APPROVAL` | government | FACTUAL_DEPENDENCY | DEC-01 |
| `LIT-FACT-CONTENT-APPROVAL` | literature | FACTUAL_DEPENDENCY | DEC-01 |
| `MATH-APPROVAL-ALIASES` | mathematics | OWNER_APPROVAL | DEC-AL |
| `MATH-APPROVAL-CONTENT` | mathematics | OWNER_APPROVAL | DEC-01 |
| `MATH-CMP-D4-TESTS` | mathematics | BRANCH_COMPARISON | DEC-02 |
| `MATH-LES-T1-W08-LOGARITHMS` | mathematics | LESSON | DEC-M1 |
| `MATH-LES-T1-W09-LOG-POWERS` | mathematics | LESSON | DEC-M1 |
| `MATH-OWNER-EQUATION-STRATEGY` | mathematics | OWNER_DECISION | DEC-M2 |
| `MATH-OWNER-LOG-METHOD` | mathematics | OWNER_DECISION | DEC-M1 |
| `MATH-OWNER-RIGHTS-PERMISSION` | mathematics | OWNER_DECISION | DEC-M3 |
| `MATH-TEST-FULL-SOURCE-REGRESSION` | mathematics | TEST | DEC-02 |
| `PHYS-APPROVAL-CONTENT` | physics | OWNER_APPROVAL | DEC-01 |
| `PHYS-CMP-D4-TESTS` | physics | BRANCH_COMPARISON | DEC-02 |
| `PHYS-OWNER-ALIAS-T3` | physics | OWNER_APPROVAL | DEC-PH3 |
| `PHYS-OWNER-EXTRACTION-STRATEGY` | physics | OWNER_DECISION | DEC-P2 |
| `PHYS-OWNER-REVISION-PLAN` | physics | OWNER_DECISION | DEC-P1 |
| `PHYS-TEST-FULL-SOURCE-REGRESSION` | physics | TEST | DEC-02 |
| `PHYS-TEST-PACKAGE-NEW` | physics | TEST | DEC-02 |
| `TD-MISSING-T1` | technical-drawing | MISSING_MATERIAL | DEC-03 |
| `TD-MISSING-T3` | technical-drawing | MISSING_MATERIAL | DEC-03 |
| `TD-OWNER-EXTRACTION-STRATEGY` | technical-drawing | OWNER_DECISION | DEC-T1 |
| `TD-TEST-FULL-SOURCE-REGRESSION` | technical-drawing | TEST | DEC-02 |
| `TD-TEST-PACKAGE-NEW` | technical-drawing | TEST | DEC-02 |
| `YO-ASSET-T1-W03-VOWEL-CHART` | yoruba | ASSET | DEC-08 |
| `YO-FACT-T1-W01-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y1 |
| `YO-FACT-T1-W02-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y1 |
| `YO-FACT-T1-W03-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y1 |
| `YO-FACT-T1-W04-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y1 |
| `YO-FACT-T1-W05-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y1 |
| `YO-FACT-T1-W06-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y1 |
| `YO-FACT-T1-W07-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y1 |
| `YO-FACT-T1-W08-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y1 |
| `YO-FACT-T2-W01-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y2 |
| `YO-FACT-T2-W02-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y2 |
| `YO-FACT-T2-W03-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y2 |
| `YO-FACT-T2-W04-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y2 |
| `YO-FACT-T2-W05-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y2 |
| `YO-FACT-T2-W06-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y2 |
| `YO-FACT-T2-W07-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y2 |
| `YO-FACT-T2-W08-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y2 |
| `YO-FACT-T2-W09-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y2 |
| `YO-FACT-T2-W10-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y2 |
| `YO-FACT-T3-W01-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y3 |
| `YO-FACT-T3-W02-DEFECTS` | yoruba | FACTUAL_DEPENDENCY | DEC-Y3 |

## Annex B — every `OWNER_ACTION` open item and its row

| Open item | Package | Row |
|---|---|---|
| `AGRICULTURAL-SCIENCE-ALIAS-APPROVAL` | agricultural-science | DEC-AL |
| `AGRICULTURAL-SCIENCE-ALIAS-APPROVAL-T2` | agricultural-science | DEC-AL |
| `AGRICULTURAL-SCIENCE-ALIAS-APPROVAL-T3` | agricultural-science | DEC-AL |
| `BIOLOGY-ALIAS-APPROVAL` | biology | DEC-AL |
| `BIOLOGY-ALIAS-APPROVAL-T2` | biology | DEC-AL |
| `BIOLOGY-ALIAS-APPROVAL-T3` | biology | DEC-AL |
| `BOOKKEEPING-ALIAS-APPROVAL` | bookkeeping | DEC-AL |
| `BOOKKEEPING-ALIAS-APPROVAL-T2` | bookkeeping | DEC-AL |
| `BOOKKEEPING-ALIAS-APPROVAL-T3` | bookkeeping | DEC-AL |
| `BOOKKEEPING-T2-TEXT-MATCHES-T1` | bookkeeping | DEC-B1 |
| `CATERING-CRAFT-ALIAS-APPROVAL` | catering-craft | DEC-AL |
| `CHEMISTRY-ALIAS-APPROVAL` | chemistry | DEC-AL |
| `CHEMISTRY-ALIAS-APPROVAL-T1B` | chemistry | DEC-AL |
| `CHEMISTRY-ALIAS-APPROVAL-T2` | chemistry | DEC-AL |
| `CHEMISTRY-ALIAS-APPROVAL-T3` | chemistry | DEC-AL |
| `CIVIC-EDUCATION-ALIAS-APPROVAL` | civic-education | DEC-AL |
| `CIVIC-EDUCATION-ALIAS-APPROVAL-T2` | civic-education | DEC-AL |
| `CIVIC-EDUCATION-ALIAS-APPROVAL-T3` | civic-education | DEC-AL |
| `COMMERCE-ALIAS-APPROVAL` | commerce | DEC-AL |
| `COMMERCE-ALIAS-APPROVAL-T2` | commerce | DEC-AL |
| `COMMERCE-ALIAS-APPROVAL-T3` | commerce | DEC-AL |
| `DATA-PROCESSING-ALIAS-APPROVAL` | data-processing | DEC-AL |
| `DATA-PROCESSING-ALIAS-APPROVAL-T3` | data-processing | DEC-AL |
| `ECONOMICS-ALIAS-APPROVAL` | economics | DEC-AL |
| `ECONOMICS-ALIAS-APPROVAL-T2` | economics | DEC-AL |
| `ECONOMICS-ALIAS-APPROVAL-T3` | economics | DEC-AL |
| `FINANCIAL-ACCOUNTING-ALIAS-APPROVAL` | financial-accounting | DEC-AL |
| `FINANCIAL-ACCOUNTING-ALIAS-APPROVAL-3RD-TERM` | financial-accounting | DEC-AL |
| `FOOD-AND-NUTRITION-ALIAS-APPROVAL` | food-and-nutrition | DEC-AL |
| `FOOD-AND-NUTRITION-ALIAS-APPROVAL-3RD-TERM` | food-and-nutrition | DEC-AL |
| `FRENCH-EXAM-AUDIO` | french | DEC-05 |
| `FRENCH-T1-W02-HEADINGS-INTENT` | french | DEC-FR1 |
| `GEOGRAPHY-ALIAS-APPROVAL` | geography | DEC-AL |
| `GEOGRAPHY-T2-ALIAS-APPROVAL` | geography | DEC-AL |
| `GEOGRAPHY-T3-ALIAS-APPROVAL` | geography | DEC-AL |
| `GOVERNMENT-ALIAS-APPROVAL` | government | DEC-AL |
| `GOVERNMENT-T2-ALIAS-APPROVAL` | government | DEC-AL |
| `GOVERNMENT-T3-ALIAS-APPROVAL` | government | DEC-AL |
| `LITERATURE-ALIAS-APPROVAL` | literature | DEC-AL |
| `LITERATURE-T2-ALIAS-APPROVAL` | literature | DEC-AL |
| `LITERATURE-T3-ALIAS-APPROVAL` | literature | DEC-AL |
| `OI-FM-001` | further-mathematics | DEC-F1 |
| `OI-FM-005` | further-mathematics | DEC-01 |
| `OI-MATH-001` | mathematics | DEC-M2 |
| `OI-MATH-005` | mathematics | DEC-01 |
| `PHYSICS-ALIAS-APPROVAL` | physics | DEC-AL |
| `PHYSICS-T2-ALIAS-APPROVAL` | physics | DEC-AL |
| `PHYSICS-T3-ALIAS-APPROVAL` | physics | DEC-PH3 |
| `TD-T2-FOOTER-TAGLINE` | technical-drawing | DEC-T2 |
| `TECHNICAL-DRAWING-ALIAS-APPROVAL` | technical-drawing | DEC-AL |
| `YORUBA-T1-W05-LITIRESO-EMPTY` | yoruba | DEC-Y5 |
| `YORUBA-T1-W07-BENEFITS-MISSING` | yoruba | DEC-Y1 |
| `YORUBA-T1-W08-LITIRESO-EMPTY` | yoruba | DEC-Y5 |
| `YORUBA-T1-WEEK-LABELS` | yoruba | DEC-Y4 |
| `YORUBA-T2-WEEK-LABELS` | yoruba | DEC-Y4 |

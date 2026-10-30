# Technical owner decisions — Mathematics, Physics, Technical Drawing, Further Mathematics (UNR-08)

Base: `origin/master` `52d60c9` (30 October 2026). Status: `IMPLEMENTED_TESTING_DEFERRED`; not approved, not verified.
Scope: the 11 blocked decision IDs below. This file records questions, options and recommendations only. No decision is made, no package, queue or source file is edited, and nothing was run (no tests, typechecks, importer, compiler, plan, extractor, database or device check).
Recommendations are labelled **Recommendation** and are the author's reading of the repository evidence; each decision belongs to the owner.

## Summary

| Group | IDs | One decision closes |
|---|---|---|
| A. Extraction strategy | `MATH-OWNER-EQUATION-STRATEGY`, `PHYS-OWNER-EXTRACTION-STRATEGY`, `TD-OWNER-EXTRACTION-STRATEGY`, `FM-FACT-EQUATION-EXTRACTOR-DECISION` | One foundation choice (A or B) answers all four; per-subject evidence differs |
| B. Rights | `MATH-OWNER-RIGHTS-PERMISSION`, `FM-FACT-VENDOR-PERMISSION` | One licence answer for the commercial tutor's material covers both |
| C. Logarithm method | `MATH-OWNER-LOG-METHOD` | Unblocks `MATH-LES-T1-W08-LOGARITHMS`, `MATH-LES-T1-W09-LOG-POWERS` |
| D. Physics revision plan | `PHYS-OWNER-REVISION-PLAN` | Not yet askable (see its row) |
| E. Alias approvals | `MATH-APPROVAL-ALIASES`, `PHYS-OWNER-ALIAS-T3`, `FM-FACT-ALIAS-APPROVAL` | Seven source-alias rules (3 Mathematics, 1 Physics 3rd Term, 3 Further Mathematics) |

---

## Group A — Extraction strategy (one foundation question, four IDs)

**Shared question.** Plain extraction (mammoth for `.docx`, word-extractor for legacy `.doc`) drops Word equations and flattens superscripts and subscripts. Should SS1 get an equation-aware extractor, or should every affected row be replaced by an authored lesson?

- **Option A — equation-aware extractor.** Recover equations into the extracted text, as `backend/src/db/jss3EquationRecovery.ts` already does for two JSS3 Mathematics files (379 and 75 equations recovered). Cost: changes the content-bound row IDs (`<source_id>:BODY:<sha256>`) of every row it touches, so it needs a reviewed ID migration and re-review of coverage and lessons that cite those IDs; the JSS3 module rewrites `word/document.xml`, so it works on `.docx` only and is deliberately scoped to named files; it does not read embedded WMF/OLE equation objects or figures; and its result cannot be checked while testing is deferred.
- **Option B — replacement lessons.** Author one labelled lesson per affected row and leave extraction unchanged. Cost: authoring plus review for every affected row; row IDs stay stable; no code change; source rows keep their lost notation in the original text until replaced.
- **Recommendation (shared):** B as the standing default while testing is deferred, because it needs no ID migration and no unverifiable code change, and because A cannot reach the `.doc` sources, the WMF/OLE objects or the figures in any case. Before authoring for Physics or Technical Drawing, record the actual loss per row (not yet measured). The owner may choose A for the `.docx` Mathematics and Technical Drawing sources; if so, the migration review is the gating task.

### A1. `MATH-OWNER-EQUATION-STRATEGY` (Mathematics, `OI-MATH-001`)
- **Evidence in `mathematics.json`:** 1st Term 333 equations; 2nd Term 62 equations and 510 superscript runs; 3rd Term 53 equations, 504 superscript runs and 13 embedded WMF equation objects. 26 affected row IDs (1st Term 5, 2nd Term 10, 3rd Term 11). Six replacement lessons already exist, all for 1st Term weeks (W01, W03, W04, W05, W06, W10). `OI-MATH-002` records that the 2nd Term (10 rows) and 3rd Term (11 rows) bodies are unreviewed. `OI-MATH-004` (11 3rd Term rows) needs WMF transcription under either option, since OMML recovery does not read those objects.
- **Unblocks:** a recorded choice, then follow-up tasks appended by the owner or integration worker. Nothing is dependent on it in the queue today.

### A2. `PHYS-OWNER-EXTRACTION-STRATEGY` (Physics)
- **Evidence:** all three Physics sources are legacy `.doc`. The queue states that equation-recovery loss was not measured for Physics and that the question is recorded only on a branch (`OI-PHYS-001`); no counts exist on master. Option A has no existing code for `.doc`.
- **Unblocks:** a recorded choice. Recommend first adding a measured-loss step per week (count of flattened superscripts/subscripts/fractions and figure references), so the owner decides on figures.

### A3. `TD-OWNER-EXTRACTION-STRATEGY` (Technical Drawing, `TD-SRC-T2`)
- **Evidence:** one source only (2nd Term `.docx`). `HANDOFF.json` (`SS1-03`) lists Technical Drawing among sources where plain extraction drops equations and sub/superscripts; no loss counts are recorded, and one scheme-row note says no superscript runs occur in that row. For a drawing subject the larger loss is probably figures, which an equation extractor does not recover: ask the owner whether figures are in scope.
- **Unblocks:** a recorded choice; same recommendation as above, applied after loss is measured.

### A4. `FM-FACT-EQUATION-EXTRACTOR-DECISION` (Further Mathematics, `OI-FM-001`)
- **Evidence:** 2nd Term 51 equations, 401 superscripts, 214 subscripts; 3rd Term 129 equations, 2 superscripts, 26 subscripts; 1st Term is a legacy `.doc` whose MathType/OLE objects are not read and has no per-row counts. 20 affected row IDs are listed (1st Term 11, 2nd Term 9; none for the 3rd Term, although the text gives 3rd Term counts, which should be reconciled). Seven authored lessons exist (1 for 1st Term W01, 6 for 3rd Term). A prototype driver `docs/ss1/work/SS1-03/author/recover_equations.mts` (5 lines) imports `./eqrec.ts`, which is not in the repository, so the prototype cannot run as committed and was not run.
- **Dependencies not yet done:** `FM-FACT-EQUATION-LOSS-T1` and `-T2` are PENDING; the 2nd Term per-row figures (52 and 45) and the SS1-03 totals differ in kind and are unreconciled.
- **Unblocks:** a recorded choice; replacement items appended only for rows the decision leaves uncovered.

---

## Group B — Rights (one licence answer, two IDs)

**Shared question.** Are the commercial tutor's notes and advertising material in the Mathematics and Further Mathematics 1st/2nd/3rd Term sources licensed for delivery to students? Contact details and branding must not be copied into the repository.

### B1. `MATH-OWNER-RIGHTS-PERMISSION` (Mathematics)
- **Question:** may any embedded third-party tutor material in the Mathematics sources be reused, or must it be excluded?
- **Option A:** reuse permitted; supply the licence reference, and approve removal of branding and contact details from anything delivered.
- **Option B:** exclude all third-party material from delivery; Mathematics lessons are school-authored.
- **Evidence and gap:** `mathematics.json` has no open item for this. The claim rests on one sentence in `docs/ss1/work/SS1-03/CHECKPOINT.md` ("the same branding is in Mathematics 2nd/3rd term"); `MATH-FACT-ADVERT-T2` and `-T3`, which would inspect the originals, are PENDING. The question is therefore premised on an uninspected claim.
- **Recommendation:** run the two advert inspections first; if the material is confirmed and no licence reference is supplied, choose B.
- **Unblocks:** a recorded decision in the open item the inspections raise; no queue item depends on it today.

### B2. `FM-FACT-VENDOR-PERMISSION` (Further Mathematics, `OI-FM-004` and `OI-FM-007`)
- **Question:** under what licence may the school deliver the commercial tutor's Further Mathematics notes, and may branding and contact details be removed?
- **Evidence:** 2nd and 3rd Term sources embed a letterhead and cover page (images); the 1st Term source has an image cover page, image letterhead and a running header/footer naming the tutor. The package says the notes themselves appear to be the vendor's product, so the question may cover the body text and not only the images. The images are not bound as assets. `FM-VIS-T1/T2/T3-BRANDING` are PENDING.
- **Option A:** licence confirmed (supply reference) and removal of branding/contact approved. **Option B:** not licensed; the notes are not delivered and Further Mathematics rests on school-authored lessons (7 exist today).
- **Recommendation:** B unless a licence reference is supplied; the images stay unbound either way.
- **Unblocks:** closes `OI-FM-004` and `OI-FM-007` (both `blocks_delivery`).

---

## Group C — `MATH-OWNER-LOG-METHOD` (Mathematics, `OI-MATH-003`)

- **Question:** do the Week 8 and Week 9 logarithm lessons use four-figure mathematical tables or a calculator method?
- **Option A — tables:** supply the edition used and its reuse permission; the tables are not in the supplied archive. Cost: external material and rights; closest to the source.
- **Option B — calculator method:** no external material; changes the teaching method away from the source's tables.
- **Evidence:** `OI-MATH-003` (`blocks_delivery`, 2 affected 1st Term rows). `MATH-FACT-LOG-TABLES` (its dependency) is PENDING and the repository does not record which members or pages were searched for the tables.
- **Recommendation:** complete `MATH-FACT-LOG-TABLES`; then B unless an edition with reuse permission is supplied.
- **Unblocks:** `MATH-LES-T1-W08-LOGARITHMS` and `MATH-LES-T1-W09-LOG-POWERS` (both BLOCKED on this item).

---

## Group D — `PHYS-OWNER-REVISION-PLAN` (Physics, `OI-PHYS-003`)

- **Question:** does a revision/examination plan exist for scheme weeks that have no body?
- **Option A:** a plan exists; supply the document. **Option B:** none exists; record that, and the weeks stay without body content.
- **Evidence:** per a branch-only note, 1st Term coverage `PHYS-1-011` and 3rd Term `PHYS-3-011` are UNRESOLVED, and 3rd Term scheme Weeks 11-12 including the examination have no body. None of this is on master (`physics.json` has no `OI-PHYS-003`). `PHYS-PRE-T3` is PENDING: master records no 3rd Term scheme text, and `PHYS-RULE-T1-REVISION-SCHEME` and `PHYS-RULE-T3-REVISION-EXAM` are PENDING.
- **Recommendation:** do not ask the teacher yet; complete `PHYS-PRE-T3` and the two rule items so the question names exact weeks. Default thereafter: B (record "none supplied"); no revision content is invented.
- **Unblocks:** a recorded answer; no queue item depends on it today.

---

## Group E — Source-alias approvals

For every rule the contract allows a heading that differs from the canonical subject only through a `source_alias` rule carrying an `approval_reference`; each currently reads `PENDING-OWNER`. Approval is separate from implementation and verification, and no reference may be invented.
**Shared options:** A approve (supply a named, dated reference per rule); B reject or change the canonical subject (the source is then re-assigned).

### E1. `MATH-APPROVAL-ALIASES`
| Rule | Source | Heading evidence |
|---|---|---|
| `RULE-MATH-T1-ALIAS` | `SS1-SRC-0c9004137f95` (1st Term) | Title line "SS1 GENERAL MATHEMATICS SCHEME OF WORK FOR FIRST TERM"; no SUBJECT/CLASS line (`MATH-FACT-HEADER-T1`) |
| `RULE-MATH-T2-ALIAS` | `SS1-SRC-b802686e83d2` (2nd Term) | "SUBJECT: MATHEMATICS … CLASS: SS 1" |
| `RULE-MATH-T3-ALIAS` | `SS1-SRC-ca00ca94afb9` (3rd Term) | "SUBJECT: MATHEMATICS … CLASS: SSS 1" |
- All three also match the `SOURCE_ASSIGNMENTS.csv` filename assignment. Header inspections `MATH-FACT-HEADER-T1/T2/T3` are implemented.
- **Recommendation:** approve all three. One point for the owner: the 1st Term heading says "General Mathematics" - confirm it is the SS1 Mathematics course and not a separate subject.

### E2. `PHYS-OWNER-ALIAS-T3`
- **Rule:** `SS1-SRC-bed91bb4ef0e-R001` (3rd Term). The body opens "THIRD TERM E-LEARNING NOTE" and names no subject; the page header/footer outside the body reads "WKLAS/SS1/3rd term/Physics"; the only in-body occurrences of "physics" are reading-assignment textbook titles; the scheme is Physics teaching. Assignment otherwise rests on the archive path and manifest (`PHYS-SRC-T3`).
- **Recommendation:** approve (Option A). Need is confirmed by direct reading.

### E3. `FM-FACT-ALIAS-APPROVAL`
| Rule | Source | Heading evidence |
|---|---|---|
| `RULE-FM-T1-ALIAS` | `SS1-SRC-e9efc9a976ed` | "SUBJECT: FURTHER MATHEMATICS … CLASS: SS1" |
| `RULE-FM-T2-ALIAS` | `SS1-SRC-43c5ab51b87f` | "SUBJECT: FURTHER MATHEMATICS" |
| `RULE-FM-T3-ALIAS` | `SS1-SRC-c7a7523bdb0d` | No heading; anchored on a cited textbook title on the first reference line |
- `FM-INV-T3` confirms the 3rd Term document has no scheme, title or subject line, only six week labels (Weeks 2-6 and 8), and that Weeks 1, 7 and 9-12 are absent.
- **Recommendation:** approve T1 and T2. For T3 the in-document evidence is a textbook title only; approve only on the owner's own confirmation that this file is the SS1 Further Mathematics 3rd Term document.

---

## Related approvals outside this register (same protocol, not covered here)
`PHYSICS-ALIAS-APPROVAL` and `PHYSICS-T2-ALIAS-APPROVAL` (Physics 1st and 2nd Term rules) and `TECHNICAL-DRAWING-ALIAS-APPROVAL` are package open items with the same `PENDING-OWNER` pattern.

## What each answer makes runnable
- A1-A4: a recorded strategy; follow-up authoring or migration tasks are then appended by the owner or integration worker (none exist yet).
- B1, B2: close the two rights items; B2 clears two `blocks_delivery` permission items.
- C: `MATH-LES-T1-W08-LOGARITHMS`, `MATH-LES-T1-W09-LOG-POWERS`.
- D: nothing until `PHYS-PRE-T3` and the two revision rule items are done.
- E1-E3: each rule's `approval_reference` can replace `PENDING-OWNER`.

## Checks performed (static)
Read the 11 queue items and their dependencies and dependents, the `open_items` and alias rules in the Mathematics, Physics, Technical Drawing and Further Mathematics packages, `HANDOFF.json`, the JSS3 recovery module header, and the prototype driver; cross-checked IDs against `docs/ss1/work/BLOCKED_DECISIONS_20261030.md` (DEC-AL, DEC-PH3, DEC-M1..M3, DEC-P1/P2, DEC-T1, DEC-F1/F2). This is document reading, not a test.

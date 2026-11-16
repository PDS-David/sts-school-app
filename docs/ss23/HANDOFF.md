# Latest handoff supplement — 2026-11-16

This supplement supersedes earlier live-state claims in this historical handoff.

- Current master: `658c1f7b7dcee9ecdf73a972d2dfdc36b1842560`; PRs #867/#868 merged.
- PR #869 (checkpoint/handoff and Agriculture review documents) remains open/unmerged at `2d110494b76174b95fad6267a95882f9aa6340ed`.
- PR #870 remains open/unmerged at `a9c8345ac8f8a588b810f73c60023be000b3473d`; all four workflows passed. It explicitly excludes `source-extract://` placeholders from student asset listings even if approval metadata is erroneously advanced; its negative-control test simulates that state.
- PR #871 remains open/unmerged at `361b0f5659f3654b89d6c6d8590fbbafd641532d`. SS23 contract (43802113031), SS23 integrity (43802113039) and SS1 gate (43802113001) passed; JSS3 verification (43802113022) was still running at last check. It updates the practical blocker, current cassava blight nomenclature, two hashed external sources and two supported coverage rows.
- Agricultural Science master remains 19 draft units, 195 practice/assessment items, 45 external factual references, 47 asset records, 109 coverage records and 47 open items (46 blocking). Package `PENDING`, units `DRAFT`, approval `PENDING`, verification `DEFERRED`; no student delivery.
- PR #871 branch has 47 external references and 111 coverage rows; still 47 open items (46 blocking). Not on master until owner merges.
- The five supplemental soil practical procedures are on master in `SOIL_PRACTICALS_REVIEW_DRAFT.md`; not teacher-approved and no official marking guide.
- Assessment structure audit: 195 unique question IDs; required question/answer/explanation/locators/provenance are present; provenance references resolve; declared mark totals reconcile. This is not answer accuracy or teacher approval. T2/T3 practice questions are authored supplements, not original-source transcriptions. Four repeated First-Term prompt groups remain pending source confirmation.
- The teacher/specialist review register and draft correction/assessment audit are in PR #869. These documents help reviewers, but they do not grant approvals.
- The combined original ZIP archives are private Library files, but their contents were not readable through the Files text interface this session. No new page-level verification is claimed. The four source-version differences remain owner decisions.
- Keep no-merge/no-deploy/no-import/no-student-release rules. Do not start Biology until Agriculture's source, assessment and teacher-approval gates pass.
- Continue SS2 alphabetically after Agriculture is genuinely clear; complete SS3 examination preparation only after SS2, without introducing new instructional topics.

---

# Current handoff correction — post PR #867/#868 merges — 2026-11-16

This section supersedes stale repository/PR/current-status claims below. Keep the remainder as historical context unless a newer verified record supersedes it.

- Current master merge commit: `658c1f7b7dcee9ecdf73a972d2dfdc36b1842560` (Merge pull request #867).
- PR #868 merged at 2026-11-16 03:50:05Z. PR #867 merged at 03:51:18Z.
- PR #867 final branch head was `d850b46b675e5e8e2b83b56ba9d9c026c463dba5`; PR #868 final branch head was `b80f8aa3d733578b051e1646741692b0408b715a`.
- Do not merge any future PR. These merges happened outside this agent's actions and do not change the owner's no-merge instruction.
- Agricultural Science on master: 19 draft units (8/6/5), 195 practice items, 45 external factual references, 47 asset records, 109 coverage rows and 47 open items (46 delivery-blocking, one non-blocking). Package `PENDING`; all units `DRAFT`; no student delivery.
- New review-only document: `docs/ss23/subjects/agricultural-science/SOIL_PRACTICALS_REVIEW_DRAFT.md`, covering moisture, porosity, capillarity, soil-organism observation and organic-matter observation. It is not teacher-approved, does not assign an official mark scheme and does not close `AG2-T1-SOIL-PRACTICALS`.
- Final PR #867 head workflows 43800366597, 43800366507, 43800366581, 43800366585 and 43800366501 all passed. This is technical CI only.
- The original combined SS2 and SS3 ZIPs are present in the private Library but are not committed to the repository. The Files text reader cannot read ZIP contents; do not claim new direct document/page inspection from the archive until member content is actually available. Keep the archive receipt, source assignments and the four old/new version differences authoritative. The four disputed members require an owner source-version decision.
- Keep SS2 alphabetical. Do not proceed to Biology until Agriculture's source, assessment and required teacher-approval gates are satisfied.
- SS3 remains examination preparation only (WAEC/NECO/JAMB); no new instructional topics.

## Exact next steps

1. Continue source-supported Agriculture work; preserve all 47 open items unless a specific item is genuinely resolved by evidence and the package/checkpoint are updated together.
2. Complete item-by-item source-question and answer/mark reconciliation only when the original assessment text is accessible. Current 45 T2/T3 answers are authored supplements, not original-source answer keys.
3. Resolve practical apparatus/safety/marking decisions, image rights and specialist corrections through genuine teacher/specialist approval; never impersonate the approver.
4. Recheck the merged package integrity and CI when code/package files change.
5. After Agriculture passes, proceed through SS2 subjects alphabetically, one focused PR per subject.
6. Complete SS3 examination-preparation materials only after SS2 is complete; preserve answer-key protection and verified past-question provenance.

---

# SS2 / SS3 curriculum — agent handoff

Updated: 2026-11-16. Repository: `PDS-David/sts-school-app`; primary branch: `master`. Read this file, `CHECKPOINT.md`, and `sources/README.md` before resuming. The historical 2026-11-13 instructions below are superseded where marked.

## 1. Assignment

Complete SS2 instructional curriculum and SS3 exam-preparation curriculum, subject by subject, in small independently verifiable tasks. Find and resolve missing terms/weeks, shallow lessons, incorrect topic associations, incomplete assessment answers/explanations/marking guidance, broken source references, invalid hashes, and inaccessible lessons.

Preserve original-source provenance and distinguish authored supplements. Never fabricate source text or claim completion from tests alone. Implementation, source verification, assessment reconciliation, teacher approval, owner acceptance, and student release are separate gates.

## 2. Standing rules

- One scoped PR per subject or independent infrastructure task. Do not merge PRs or deploy/import without explicit owner authorization.
- Never weaken validation or tests to make a package pass.
- Do not commit extracted source archives or private conversions; retain them in private scratch.
- Do not invent curriculum content, source page references, answers, or teacher decisions. If evidence is absent, record the blocker.
- Keep all new units in draft/pending states until the source, assessment, approval, and release gates pass.
- Owner prefers sequential small steps, concise prompts and reports, and a clear account of completed work versus remaining work.

## 3. Current verified repository state

- Current master at this handoff: `5e0df2da9e322a31ded7641cef3081207574edf8`.
- SS23 package contract, validator, integrity workflow, and fail-closed student-delivery integration are merged. The delivery service has service and HTTP regression coverage. Pending SS2/SS3 content is not served to students.
- SS2 Agricultural Science is the only subject package currently implemented. PR #857 merged on 2026-11-16 (merge commit `5e0df2da9e322a31ded7641cef3081207574edf8`). It contains 19 draft units across T1/T2/T3 (8/6/5), with assessment/practice content and explicit open blockers. Package status remains `PENDING`; units remain `DRAFT`. Passing CI does not certify the curriculum or authorize delivery.
- The SS23 integrity, package-contract, source-map, SS1 integrity, and backend typecheck workflows passed for the latest Agricultural Science changes. See `CHECKPOINT.md` for run IDs and detailed blocker counts.
- No other SS2 subject package and no SS3 exam-preparation package is currently recorded as implemented.
- SS3 scope is exam preparation (WAEC/NECO/JAMB), not normal instructional progression. Substantive teaching ends by SS2. This is an owner-supplied project decision already reflected in the package contract; do not reopen it as an unresolved choice.
- The evidence-register documentation PR #858 is separate and must be reviewed before merge; it does not close any curriculum blocker.

## 4. Source archive status and limitations

The owner re-attached the two combined archives on 2026-11-16. They remain private and are not committed to the repository. Direct inspection confirms:

| Archive | SHA-256 | Members | Term folders |
|---|---|---:|---|
| `SSS 2-20260507T072840Z-3-001.zip` | `a97506c7f030a6e9604a13ae0aab30f59563a1473ec682f647459549dd9e1153` | 61 | T1 19; T2 22; T3 20 |
| `SSS 3-20260507T072839Z-3-001.zip` | `045e261aba9475b32b4cb963a2495faf3ddd503860b205aa1e89f0ac07d3c741` | 39 | T1 19; T2 20; T3 0 |

Both ZIP integrity checks pass. These exact outer hashes and member counts match the combined-archive receipt in `sources/RECEIPT_20261113.md`. Its multiset comparison reports 96 exact member matches against the 100-row `SOURCE_ASSIGNMENTS.csv`; four received documents are alternate content versions and must remain separately identified pending owner choice:

- SS2 T2 `ECONOMICS (1).docx`
- SS2 T3 `3RD TERM S2 FURTHER MATHEMATICS.docx`
- SS3 T1 `MATHS.docx`
- SS3 T1 `1ST TERM S3 ECONOMICS.docx`

Do not silently overwrite the old register or choose between these versions. The exact old/new hashes and byte counts are in `RECEIPT_20261113.md` and `RECEIPT_DIFFS_20261113.csv`.

Direct duplicate-content checks on the re-attached archives confirm:
1. SS3 Literature in English T1 and T2 are byte-identical; this does not establish a distinct T2 source.
2. SS2 `F _ N (1) (1).docx` in the T2 folder is byte-identical to T1 `F _ N (1).docx`; the other SS2 T2 Food & Nutrition file is a distinct version.
3. Historical register notes also identify repeated Book-keeping bodies across T1/T2; verify actual body/header distinctions before treating them as separate instructional coverage.

The received SS3 archive contains no Third-Term source. SS3 scope is exam preparation ONLY (WAEC, NECO and JAMB): revision, verified past-question practice, mocks, marking, feedback and reassessment. Do not create or import new SS3 instructional-topic lessons. This is a fixed owner instruction, not an open policy decision.

Source filenames are not sufficient to certify subject/class/term. Continue document-header and body verification, including tables, embedded visuals, equations and week/topic labels. Do not infer missing content or invent replacements.

## 4A. Registered subject and term inventory

The following is derived from the 100-row `sources/SOURCE_ASSIGNMENTS.csv` register and the re-attached archive member inventory. It records **file/member presence only**; it does not certify document headers, subject identity, instructional content, week coverage or assessment completeness. Continue direct document-header and body verification before changing source mapping status.

### SS2 — alphabetical execution order

The register contains 61 SS2 source members and 21 subject labels. Use this order for the SS2 subject queue:

1. Agricultural Science
2. Biology
3. Bookkeeping
4. Catering Craft
5. Chemistry
6. Civic Education
7. Commerce
8. Data Processing
9. Economics
10. English
11. Financial Accounting
12. Food & Nutrition
13. French
14. Further Mathematics
15. Geography
16. Government
17. Literature in English
18. Mathematics
19. Physics
20. Technical Drawing
21. Yoruba

Term-member gaps recorded for SS2:
- Catering Craft: no First-Term or Third-Term source member.
- Technical Drawing: no First-Term source member.
- All other registered subject labels have at least one member in each term; Food & Nutrition has a duplicate-looking T2 member that must not be counted as extra content without header/body verification.

### SS3 — examination-preparation inventory

The register contains 39 SS3 source members and 21 subject labels. It includes First- and Second-Term archive members only; the received combined archive has no Third-Term folder. The subject labels are:

Agricultural Science; Biology; Bookkeeping; Catering Craft; Chemistry; Civic Education; Commerce; Data Processing; Economics; English; Financial Accounting; Food & Nutrition; French; Further Mathematics; Geography; Government; Literature in English; Mathematics; Physics; Technical Drawing; Yoruba.

Term-member gaps/anomalies recorded for SS3:
- First Term: no Catering Craft or Technical Drawing source member.
- Second Term: no Food & Nutrition source member.
- Third Term: no source members for any subject.
- SS3 Literature in English First- and Second-Term files are byte-identical; this does not establish distinct Second-Term instructional content.

SS3 remains examination preparation ONLY (WAEC, NECO and JAMB). Do not fill missing terms with new instructional lessons.

### Source-mapping status — do not confuse the separate audits

The 100-row register's `mapping_status` field currently records 96 rows as `FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER` and four duplicate-across-members records (two SS2 and two SS3). This means most registered members still need direct header/body mapping.

Separately, the received archive comparison found 96 exact member matches against the earlier 100-row inventory and four different-content versions pending owner version decision. These are separate checks and must not be conflated. Preserve both versions of each disputed file until the owner resolves the version choice.

## 4B. Current Agricultural Science continuation snapshot (2026-11-16)

At this checkpoint, PR #867 is open and unmerged. It adds source-hashed external clarifications for T2 floriculture, crop-disease examples and safe pest-control/IPM guidance, plus six accessible T1 further-reading alternatives, regression tests and an updated Agricultural Science checkpoint. Fresh CI is running on its final head; recheck the live PR and all required checks before relying on this snapshot.

The PR branch records 45 external factual references and 109 coverage rows (75 SUPPORTED, 25 PARTIAL, 5 UNRESOLVED and 4 MARKER). The package remains `PENDING`, all 19 units remain `DRAFT`, and 47 open items remain (46 delivery-blocking). The full original source tables, disputed text, assessment reconciliation and subject-specialist approvals are not complete. These external supplements do not certify the subject or make it student-deliverable.

Do not advance to SS2 Biology until Agricultural Science's source, assessment and required teacher-approval gates are satisfied. Never merge PR #867 without owner authorisation.

## 5. Work queue

| ID | Task | Status / next action |
|---|---|---|
| SS23-00 | Baseline and package-contract infrastructure | Implemented and merged; see PR history in `CHECKPOINT.md`. |
| SS23-S0 | Archive hash and member inventory | Combined archives re-received and outer hashes/member counts verified; 96/100 member identities match, with four alternate versions explicitly held. Continue source-header verification. |
| SS23-S1 | Verify each member's document-header subject/class/term against its assignment | In progress from re-attached combined archives; 96 member matches are pinned, four alternate versions are held, and document-header/body mapping remains to be verified. Update `mapping_status` only with direct evidence. |
| SS23-Q | Student-delivery safeguards | Implemented and merged; pending SS2/SS3 lessons remain fail-closed. Re-run integration checks after package changes. |
| SS23-02 | SS2 Agricultural Science | Draft package implemented and merged; technical, source, assessment and teacher-approval blockers remain. Continue closing these from original pages and documented subject-lead decisions. |
| SS23-03 | SS2 Biology | Next subject after the Agriculture gate and source archive availability. Do not create a package from filenames or inferred topics. |
| SS23-04+ | Remaining SS2 subjects | Continue alphabetically, one subject per focused PR, only after source files are available and assigned. |
| SS23-SS3 | SS3 exam preparation | Build exam-preparation packages only, with declared WAEC/NECO/JAMB targets and verified past-question sources. No normal SS3 instructional lessons. |

## 6. Exact resume procedure

1. Check current master, open PRs, and active branches before touching files. Avoid overlapping another agent's work.
2. Use the two re-attached combined archives. Their outer hashes are pinned in `sources/RECEIPT_20261113.md`; preserve the four alternate member versions without silent substitution.
3. Continue member/header verification from the re-attached archives; preserve source files privately and inspect DOC/DOCX tables, PPTX slides, images, equations, and page references directly.
4. Continue the Agricultural Science open blockers first. Do not advance the subject sequence until its source, assessment, and teacher-approval gates are satisfied.
5. Then proceed to SS2 Biology and subsequent subjects alphabetically. Keep each task small, tested, and in a dedicated branch/PR.
6. For SS3, build only the approved exam-preparation scope. Keep pending packages inaccessible to students.

## 7. Useful commands

- Rebuild source inventory: `python3 -I scripts/ss23/build_source_inventory.py <dir-of-zips> docs/ss23/sources/SOURCE_ASSIGNMENTS.csv`
- SS23 validation: `npm run validate:ss23`
- SS23 tests: `npm run test:ss23`
- SS23 hash check: `npm run ss23:refresh-hashes -- --check`
- SS1 regression gate: `npm run validate:ss1`
- Backend typecheck (as CI runs it): `./node_modules/.bin/tsc --noEmit -p backend/tsconfig.json` (the root `npm run typecheck` also checks mobile; the backend package has no `typecheck` script)

Record commands actually run and their outcomes; never report a check as passed if it was not run.

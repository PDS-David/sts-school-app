# JSS3 — authoritative remaining work (29 October 2026)

This is the current closeout index. Older reports, OPEN_BLOCKERS.csv and historical semantic rows remain evidence of their own dates; do not use their unchecked wording as a new work queue. This file does not certify curriculum, change school policy or authorise a production operation.

## Completed implementation — do not repeat

- P1 JSS3 write guards and the subsequent latest-audit rollback repair are merged.
- P2 read-only current-state preservation tools are merged: scripts/jss3/current_state_preservation/{preserve.py,snapshot.sql}. The tool is implemented; no real target before/after comparison has been observed.
- P3 supported ta/kí and contextual question teaching, complete answers and reference records are merged. Raw taki/iwure is not silently decoded.
- P4 retains existing ordering, PIN policy, progression and stored ranks. Empty committed placements do not prove an empty live database. Optional sequence-column compatibility is already implemented.
- PR171 repaired the two stale P3 assertions. Master run 40869354816 and updated Biology PR170 run 40869382121 passed. These are CI, not production deployments.
- PR172, merged as 23e9b55d4129738f1b425e451f6388016ad208ed, completes five written lesson defects: elision, syllable definition, French auxiliary/agreement exceptions, unambiguous Music replacement practice, self-contained PHE achievements. Existing exact-reference delivery updates are connected. Its PR run 40871258583 and master run 40917201079 passed. See CONTENT_FINISH.md and CONTENT_FINISH_EVIDENCE.json.
- Ṣàngó short-text study, modern iwì equivalent, Ifá/ìjálá excerpts, selected Yoruba story exercise, owner-accepted marriage accounts, English equivalent texts/exam-style practice, practical tasks/rubrics and recovered/engraved visual assets are implemented. Do not assign them again merely because an old row calls them absent.
- The supplement JSON contains 171 lessons. PR172 changes five existing objects; the other 166 are equal. No lesson/title/term/order was added or moved. Last full private-source observation was 484 rows (235 First,249 Second,0 Third), including 313 original rows; that is historical evidence, NOT a new capture after PR172. Computer Studies remains excluded by policy and code.

- PR173, merged as 600bd5c8574b26af9b4b4faf89a06b2ea41bccff, completes the actual 47-page Zenodo PDF inspection and receipt. PR run 40918326951 passed. No eligible Ọya chant was found; the source check is complete, the text-study objective remains open.

## Remaining requirements

“Blocks” describes the claim that cannot yet be made, not permission to bypass an earlier policy.

| ID | Category | Exact unmet requirement / evidence | Blocks | Next action and precise input |
|---|---|---|---|---|
| JSS3-C01 | CODE_OR_CONTENT + EXTERNAL_EVIDENCE | No identified reusable Ọya pípè text-study passage. See YO_TEXT/SOURCE_RIGHTS_REGISTER.json (oya-pipe) and MICROTASKS_20261028/J01_RESULT.md. Actual Zenodo PDF now inspected; no eligible chant. | Full source/objective completeness; a genuine text-study lesson cannot be claimed | Obtain one identified passage, accurate translation and reuse basis, then implement its lesson/answers/attribution and scoped delivery. The Zenodo questionnaire and its bilingual saying are not substitutes for a chant. Do not request that PDF again. |
| JSS3-E01 | EXTERNAL_EVIDENCE | Exact original intent of iparoje, taki/iwure, obese, obalale, Week-3 ijale and the particular ojo keje rite remains unconfirmed. SCHOOL_DECISIONS_REQUIRED.md A1–A7; supported alternatives are already taught. | Exact-source interpretation/certification; any missing objective not established by the equivalents | A source-author/competent scholarly identification with locator, or explicit policy acceptance of a named equivalent. Do not invent an answer or keep pupils answering provenance questions. |
| JSS3-E02 | EXTERNAL_EVIDENCE | Original prescribed books and authentic prior examination paper identities are absent. Selected-story/English stand-ins and original exam-style practice exist. SCHOOL_DECISIONS_REQUIRED.md B/E; SUP-YO-LIT-METHOD links to SUP-YO-LICENSED-STORY. | Claims about those particular prescribed books/past papers, not existence of equivalent written practice | If exact identity is required, obtain title/edition/paper and rights; otherwise retain explicit equivalent labels. Do not rewrite complete stand-ins or claim they are the originals. |
| JSS3-E03 | EXTERNAL_EVIDENCE | BY-SA distribution decision is not recorded. Attribution/cover/logo implementation is not the owner's distribution decision. YO_LICENSE/OWNER_DECISION.md and R3_DISTRIBUTION/REPORT.md. | Release of affected third-party material under the intended access conditions | Record a supported distribution route for the exact licensed lessons. Existing permission to author equivalents is not a fabricated signed licence decision. No excerpts are silently removed. |
| JSS3-E04 | EXTERNAL_EVIDENCE | Historical certified 2,179-row set and designated comparison snapshot are unproven. SEQUENTIAL_CLOSEOUT_20261025/TASK_07_REPORT.md and B_PREP/ACQUISITION.md. | Historical certification and any release claim requiring that proof | Actual A/B inputs with origin, export_taken_utc, data_as_of_utc, scope, approval_record, export_method, sha256; or the documented authorised certified-set definition. No new current export can create historic certification; no trimming to 2179. |
| JSS3-V01 | DEFERRED_VERIFICATION | Final candidate full private-source + disposable-DB acceptance has not been observed after PR172. CI is a different scope. | Final-candidate acceptance | When the owner resumes full testing, pin the candidate SHA and use scripts/jss3/run_acceptance.py, the exact source archive and disposable PostgreSQL 16. See NEXT_ACTIONS.md. Retain all skipped/blocked counts; do not weaken gates. |
| JSS3-V02 | DEFERRED_VERIFICATION | P2 has not been exercised on an authorised real protected scope. P2_CURRENT_STATE_PRESERVATION.md includes its deferred failure cases. | Current non-JSS3 preservation claim for a particular operation | Validate the utility on disposable fixtures first; capture before/after on the same designated target during a paused window for the separately authorised JSS3 operation. Keep snapshots private. This is separate from E04. |
| JSS3-V03 | DEFERRED_VERIFICATION | No observed Android/device acceptance for the release candidate: notation, diagrams/animation, alt text, terms/progression, lesson/assessment updates. DEVICE1/OBSERVATION_RESULTS.csv and D_PREP/TARGET_CHECKLIST.md. | Device usability/release acceptance | Named non-production HTTPS API, private staging credentials, synthetic accounts, EAS build identity/APK hash, actual Android device and observed results. Do not fill PASS from source-code inspection. |
| JSS3-E05 | EXTERNAL_EVIDENCE | No observed spoken, sung, performed or practical competence / teacher certification. Practical tasks and rubrics exist. | Learner performance and teacher-certified claims | Actual observations by an appropriate assessor. Do not confuse this with unfinished written source code. |
| JSS3-O01 | OPTIONAL_ACTIVATION | New sequence placements remain unactivated, intentionally. P4_EXISTING_ORDER.md; backend/src/db/data/jss3SequencePlan.json. | Only a request to activate new placements | Leave existing ordering untouched. D6/D7/approved placement rows are needed only if that separate activation is requested. Do not run applyTopicSequence for unchanged-order release. |
| JSS3-R01 | RELEASE_OPERATION | Target/deployed SHA, backup/restore evidence, release snapshot, cache/assessment preflight, stage rehearsal and operation approval have not been supplied or observed. R7_RELEASE_PLAN and STAGE1/RUNBOOK.md. | Production release / “in use” claim | Designate actual target and private secret locations; pin reviewed candidate; rehearse backup/restore and rollback; verify schema/plan/assets/caches and protected snapshots; approve the concrete import/deploy operation. GitHub success alone is not deployment. |

## Evidence availability and rules

The source archive is JSS3_NEXT_STAGE_INPUTS_20261016.zip (copies may have (1)/(2)), SHA-256 0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c. It is private; recover the named file from the user's supplied files or Library and verify its hash before requesting another upload. Original JSS3/SS1 ZIPs cannot serve as historical protected exports.

P2's current-state snapshots include every non-exact-JSS3 topic and referenced subject/asset across all schools, including SS classes and legacy names. They are not a full database backup, not proof of transient changes, and not evidence of historic certification. Their result cannot waive E04.

Preserve substantive source content in First/Second Terms; Third Term introduces no new topics and stays BECE preparation/revision/reassessment. Computer Studies is excluded. Preserve other classes and UI. No unresolved row becomes CLOSED just because a report was merged.

## What next

1. Do not reopen completed content or the examined Zenodo lead. Resolve C01 only from a defensible text source; its absence stays explicit.
2. Continue SS1 implementation independently: its files are separate and need not wait for JSS3's historical receipts or device observations.
3. When full testing resumes, run the pinned final-candidate acceptance once, resolve actual failures, then perform designated staging/device checks.
4. Proceed to production only with concrete target, preservation/backup evidence, licensing route and explicit operation approval. Do not announce JSS3 fully complete or deployed before the requirements for those claims are met.

See NEXT_ACTIONS.md for small bounded follow-ups. There is no reason to repeat the entire JSS3 audit.

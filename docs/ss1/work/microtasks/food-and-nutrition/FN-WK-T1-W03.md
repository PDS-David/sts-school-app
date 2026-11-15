# FN-WK-T1-W03 — Food and Nutrition: relationship to other subjects

Status: IN_PROGRESS. No lesson is authored in this task; content approval and verification remain pending.

## Source evidence
- Source ID: SS1-SRC-de2cdd0b85f6.
- Archive member: SSS 1/1st Term SS1_/F _ N.docx.
- Member SHA-256: 398b0e1f1383e88f7d71148253f8466fbfed95fefdca068907b5ba35083f4ff7; composite archive SHA-256: 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. Both were verified in FN-INV-T1.md.
- Week 3 extracted-text lines 189-225; SHA-256 5ea5a6577e5feea1074ed64173cafae653c2634b6975d45cc17013b66f60e606.
- General statement: line 193. Agriculture and FAO/Rome statements: lines 195-197. Thirteen-subject list: lines 199-225.

## Objective-level coverage

1. Overall relationship objective: PARTIAL. Line 193 states that Food and Nutrition cuts across disciplines. Lines 195-197 give a brief agriculture relationship, then make the FAO/Rome claim. The list at lines 199-225 names thirteen subjects but supplies no per-subject explanations.
2. Agricultural science: PARTIAL. The source gives a short agriculture relationship at lines 195-197, but not a developed explanation or student example.
3. Biology: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.
4. Chemistry: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.
5. Physiology: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.
6. Food technology: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.
7. Home economics: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.
8. Food science: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.
9. Food engineering: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.
10. Microbiology: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.
11. Medicine: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.
12. Economics: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.
13. Physics: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.
14. Physical and health education: UNRESOLVED — named in the list at lines 199-225; no relationship is explained.

The inventory gives the thirteen-name list as one continuous range (lines 199-225); it does not provide separately hashed line boundaries for each list item. This note therefore records the exact list range for each name and does not invent sub-line offsets. The package contains one coverage record per named subject, each tied to the exact Week 3 body hash.

## Missing teaching and assessment
- The source lists disciplines but does not explain the relationship to each one. Open item FOOD-AND-NUTRITION-T1-W03-RELATIONSHIP-DETAILS blocks delivery. Lesson task FN-LES-T1-W03-RELATIONSHIPS asks for original, accurate, SS1-level explanations and examples for all thirteen subjects.
- No evaluation, reading assignment, weekend assignment, theory question or other assessment appears in lines 189-225. Open item FOOD-AND-NUTRITION-T1-W03-NO-ASSESSMENT blocks delivery. Lesson task FN-LES-T1-W03-ASSESSMENT requires newly authored questions, complete answers and criterion-level marking; no question is attributed to the source.

## Factual handoff
The source wording at lines 195-197 says that both come under one world organization, FAO, and that its headquarters are in Rome. This is not treated as verified. Open item FOOD-AND-NUTRITION-T1-W03-FAO-CLAIM blocks delivery of that claim as endorsed teaching and is handed to FN-FACT-T1-NUTRITION-CLAIMS. The fact task now depends on this Week 3 indexing item. No external citation or correction is fabricated here.

## Validation and limits
- Added 15 coverage records: overall relationship, thirteen subject entries, and absent-assessment coverage. Existing package coverage and lessons were preserved.
- Added three precise open items and two bounded lesson tasks; the fact task dependency now includes FN-WK-T1-W03.
- Parsed pre-change and post-change package/queue JSON; checked all new coverage, open-item and task IDs for uniqueness; updated queue status counts and next_runnable for the task transition and new eligible lesson task.
- No tests, TypeScript checks, importer/compiler, database or device checks were run; owner protocol defers these gates. No approval, answer, health advice, dose or practical observation is claimed.

## Checkpoint
- Task: FN-WK-T1-W03
- Status: IMPLEMENTED_TESTING_DEFERRED
- Changed files: backend/src/db/ss1/subjects/food-and-nutrition.json, docs/ss1/work/microtasks/food-and-nutrition/QUEUE.json, this evidence note.
- Next eligible task: FN-WK-T1-W04 (and FN-LES-T1-W03-RELATIONSHIPS), subject to current-master refresh and branch-ownership check.

## Durable checkpoint
- Task ID: FN-WK-T1-W03
- Status: IMPLEMENTED_TESTING_DEFERRED
- Changed files: backend/src/db/ss1/subjects/food-and-nutrition.json; docs/ss1/work/microtasks/food-and-nutrition/QUEUE.json; docs/ss1/work/microtasks/food-and-nutrition/FN-WK-T1-W03.md.
- Implementation commits: package 3dd10c725bb4e2b821551fb123bf0bb9a46d1c47; queue 95ca68b7ba71351e849a0bb4500b218352b44598; queue-count reconciliation 279e0f9b38a847e18ed856af32c7e92c570d2bf0. Evidence-note creation commit: 1759b8eb5461d0afb75f4fc516ff7c72e16efcaa.
- Tests: package/queue JSON parsing and ID uniqueness checks performed in the authoring session; no subject test suite, TypeScript, importer/compiler, database or device checks run (owner protocol defers these gates).
- Remaining work: explain all thirteen subject relationships in a new lesson; author an original assessment with answer and marking guide; verify the FAO/Rome statement; later complete Week 4–11 and other term tasks.
- Exact next action after this PR is integrated: implement FN-LES-T1-W03-RELATIONSHIPS before continuing the next week index; it is now eligible in QUEUE.json.


## Compiler validation correction
- PR #699 registered-subject compiler check run 131951457883 failed at coverage target COV-FN-T1-W03-RELATIONSHIP / SS1-SRC-de2cdd0b85f6:BODY:5ea5a6577e5feea1074ed64173cafae653c2634b6975d45cc17013b66f60e606.
- The inventory section digest is not sufficient evidence that the compiler's parsed row ID is identical. The unverified lesson_ids were removed from all new Week 3 PARTIAL/UNRESOLVED entries. Exact source line ranges, section hash and evidence remain. No body ID is asserted until the loader's parsed row identity is confirmed.
- Queue task status is IN_PROGRESS; the Week 3 relationship lesson is no longer runnable until this task is revalidated. A fresh CI run will determine whether the package compiles without a target-identity error.

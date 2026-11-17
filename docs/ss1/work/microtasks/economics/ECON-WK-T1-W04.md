# Economics SS1 First Term — Week Four implementation checkpoint

## Task identity and status
- Task ID: `ECON-WK-T1-W04`
- Status: `IMPLEMENTED_TESTING_DEFERRED` (content indexing and supplement authored; importer/compiler and runtime verification not claimed)
- Subject: Economics, SS1, First Term
- Topic as printed: “Importance of opportunity cost to individual”
- Scope retained: the CONTENTS and teaching body also cover firms/organisations and government. The source heading is not silently rewritten.

## Source receipt and provenance
- Owner-supplied archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e` — exact match.
- Member: `SSS 1/1st Term SS1_/1ST TERM S1 ECONOMICS (1) (1).doc`
- Member SHA-256: `8ad05c78b18edee3d6a011391d6ae057af457ab27f68a1ff05381d9c32e962bc` — exact match.
- Registered source: `SS1-SRC-2ab0c50bcab6`.
- Week Four source section digest from the task inventory: `3f34480ce990164ec6ea6007b4eb1e0b4b107de63687ea63549f030c8f8b3cb9`, Mammoth/getBody lines 250–300.
- Cross-check with antiword extraction of the verified binary member: Week Four begins at line 415; contents 417–421; individual 423–428; firms 430–434; government 436–440; evaluation 442–444; reading 446–447; revision 449–454; weekend assignment 456–468; Section B 470–473. These antiword line numbers are a separate extractor's locator, not a replacement for the inventory's Mammoth line numbering.

## Implemented student-facing material
- Lesson ID: `SUP-SS1-ECONOMICS-T1-W04-OPPORTUNITY-COST-APPLICATIONS`
- Body SHA-256: `f63e6476c93cc64a0526fe081cadd96d3badbf13619da5e05e75845c3a9268aa`
- Explains all five individual applications, all four firm/organisation applications and all four government applications.
- Includes three clearly hypothetical worked examples, a six-step opportunity-cost decision method, common misconception guidance, and original practice with answers and criterion-level marking.
- Answers the two printed EVALUATION questions and Section B question 2.
- Gives proposed answers for Weekend Assignment items 1, 2, 4 and 5. Item 1 is qualified: “left unbought” is only the closest option; the precise concept is the benefit of the next best alternative forgone.
- No real-world price, firm result or government priority is presented as fact.

## Question and gap disposition
- EVALUATION (Mammoth 277–279): both questions are answered with model responses and marking.
- REVISION/GENERAL EVALUATION (Mammoth 284–289):
  1. “List ten renowned Economics in the world.” — unresolved; the source does not provide ten, and Week One attributions are still under fact review.
  2. “Why is the scale of preference important?” — unresolved until Week Three lesson coverage is complete.
  3. “Mention five importance of studying economics.” — covered by existing Week One supplement `SUP-SS1-ECONOMICS-T1-W01-WHY-STUDY`.
  4. “Give five definitions of Economics by various prominent Economists.” — unresolved; Week One quotations and attributions remain unverified.
  5. “Differentiate between Want and Needs.” — unresolved; the source teaches wants but does not define needs.
- WEEKEND ASSIGNMENT:
  1. “Opportunity cost is the item............. (a) left unbought (b) nominal cost (c) bought (d) money cost” — closest option (a), with the next-best-alternative qualification.
  2. “Opportunity cost helps to ensure........ allocation of resources (a) wrong (b) optimum (c) minimum (d) unhealthy” — proposed answer (b).
  3. “Nominal cost is the same thing as............ (a) real cost (b) fixed cost (c) money cost (d) variable cost” — unresolved; neither term is defined in the assigned source.
  4. “.................... is a situation where a particular goods is traded off in favour of another goods (a) Explicit cost (b) opportunity cost (c) implicit cost (d) marginal cost” — proposed answer (b).
  5. “The problem of making the right choice is resolved with the use of........... (a) consumer price index (b) preferential treatment (c) scale of preference (d) allocation of resources” — proposed answer (c).
- SECTION B:
  1. “Differentiate between nominal cost and real cost” — unresolved pending terminology research/teacher decision.
  2. “State three importance of opportunity cost to each of the economic agents” — answered for individuals, firms and government with a nine-mark guide.
- READING ASSIGNMENT (Mammoth 281–282): the Femi Longe pages 6–7 pointer is recorded; no textbook content imported. Exact edition and reuse rights remain unverified.
- Updated existing Week Three money-cost open item to include the Week Four nominal/money/real-cost questions.
- Added explicit open items for unresolved revision questions, reading rights and the title/body scope mismatch.
- Added three follow-up tasks: `ECON-FACT-T1-W04-NOMINAL-REAL-COST`, `ECON-LES-T1-W04-NOMINAL-REAL-COST`, and `ECON-LES-T1-W04-REVISION-QUESTIONS`.

## Changed files
1. `backend/src/db/ss1/subjects/economics.json`
2. `docs/ss1/work/microtasks/economics/QUEUE.json`
3. `docs/ss1/work/microtasks/economics/ECON-WK-T1-W04.md`

## Commits
- Package implementation: `8aa4e128c05378d94c6d4ceab3157e06b6097c12`
- Queue and follow-up tasks: `2c5a4547e2a6407b899c1d875e2a348d70b4c85c`
- This checkpoint note is the next commit on the same branch.

## Verification performed
- Verified archive SHA-256 and exact source-member SHA-256 against the registered task attachment.
- Extracted the original legacy .doc with antiword and read the complete Week Four block and all its exercises.
- Computed the new lesson body's SHA-256 and embedded it in the package.
- Parsed the edited package and queue JSON before writing.
- Added 18 objective/assessment coverage records with unique IDs.
- Recomputed queue status counts: 13 IMPLEMENTED_TESTING_DEFERRED, 3 BLOCKED, 79 PENDING (95 tasks total).
- Removed Week Four from next_runnable; Week Five is now first.
- No importer, subject compiler, TypeScript, database, device or student UI test was run. The owner has deferred those validation gates; verification remains DEFERRED. Content approval remains PENDING. No approval is fabricated.

## Remaining work
- Complete the nominal/money/real-cost fact review and its follow-on lesson.
- Resolve the four open revision questions after the linked Week One/Week Three work and owner decisions.
- Verify the reading-book edition and rights.
- Continue with `ECON-WK-T1-W05` next, after this PR is integrated and the current master/branch state is rechecked.
- The subject still has other First, Second and Third Term gaps; this checkpoint does not claim Economics or SS1 is complete.

## Exact next action
After PR integration, refresh the Economics package and queue from current master, check branch ownership again, then implement `ECON-WK-T1-W05` using the matching source section and its recorded hashes.

## CI integrity correction
- The first PR integrity workflow detected that the manually stored `body_sha256` included a trailing newline not present in the actual serialized lesson body. The lesson text itself was not changed.
- Recomputed the digest from the exact stored body bytes and updated `body_sha256` to `f63e6476c93cc64a0526fe081cadd96d3badbf13619da5e05e75845c3a9268aa` in package commit `f8e62cdf2a04514ca6b2dcd84cf687c2ae66b3dc`.
- Updated the queue task to IN_PROGRESS and its checkpoint reference in commit `a55b43e9ee087d6623e7eed6dac3b504b47df1ba`. Do not mark this task implemented/testing-deferred again until the integrity and registered-subject compiler workflows rerun successfully.


## Automated validation result
- Package integrity workflow passed (package integrity 43454377693 SUCCESS).
- Registered-subject source-anchor/compiler audit passed ( all-subject source-anchor/compiler audit 43454377717 SUCCESS).
- This verifies automated package integrity and plan-only compilation for this branch. Owner content approval remains PENDING; independent verification remains DEFERRED. No database or student-device/runtime test is claimed.
- Queue/checkpoint update commit: `f63e29447059b8dca49d454d32c888a6139c7e4e`.

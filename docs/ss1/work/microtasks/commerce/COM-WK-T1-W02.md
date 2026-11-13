# Commerce SS1 First Term — Week Two implementation checkpoint

## Task identity and status
- Task ID: `COM-WK-T1-W02`
- Status: `IMPLEMENTED_TESTING_DEFERRED`
- Subject: Commerce, SS1, First Term
- Source topic: `TOPIC: OCCUPATION`
- Supplement implemented; content approval remains PENDING and importer/compiler/runtime verification remains DEFERRED.

## Source verification
- Archive SHA-256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`.
- Member: `SSS 1/1st Term SS1_/1ST TERM S1 COMMERCE.doc`.
- Member SHA-256: `ba6b7fee7987713d60e598066f9f718d1ad042e38e09507a7980b087b577c42a` — exact match.
- Source ID: `SS1-SRC-d96373071a7e`.
- Week Two body digest: `85dc81676442434e28c7a8e1568f8e576741de98eaef0fc6b0be27d4bcc44b57`, Mammoth/getBody lines 124–183.
- Independent antiword cross-check: Week Two marker line 141; occupation definition 146–148; six divisions 150–157; extractive 159–161; manufacturing 164–167; constructive 168–172; first evaluation 173–175; commercial/direct/indirect 177–190; factors 192–200; second evaluation 202–204; reading 206–208; weekend 210–224; theory 226–228; general evaluation 230–237.

## Implemented student-facing material
- Lesson ID: `SUP-SS1-COMMERCE-T1-W02-OCCUPATIONS`.
- Body SHA-256 (expected from the exact body string): `b43d131f2f0d6328f77cfbcb51ea5a3b696b2190485360c126e9bd123a8485c2`.
- Explains occupation and all six divisions in the school source.
- Gives familiar examples and a text classification tree.
- Explains all twelve factors influencing occupational choice.
- Treats age and sex neutrally; no occupation is described as belonging to one sex.
- Explains direct/indirect services using the source's payment-based scheme and notes that the payer/employer matters.
- Answers both EVALUATION blocks, THEORY questions and four unambiguous WEEKEND ASSIGNMENT items with proposed criterion-level marking.
- Weekend item 4 remains ungraded because the source lists policemen as indirect and then identifies a teacher as indirect in item 5, making both options defensible under the source's own model.
- The lesson distinguishes commercial activities from the primary/secondary/tertiary sector model. The source's “secondary occupation” wording is preserved and explicitly flagged as inconsistent, supported by official NCERT and MOHEST SS1 Commerce materials.

## Exact assessment disposition
- First EVALUATION (Mammoth 145–151):
  1. “Give four examples of extractive occupations.” — farming, fishing, hunting, mining; forestry/lumbering and quarrying also accepted.
  2. “Give three examples of commercial occupations.” — transport, banking, insurance; advertising, warehousing, communication and finance also accepted.
- Second EVALUATION (Mammoth 159–161):
  1. “Draw a diagram showing the six classifications of occupations.” — answered with a six-branch text tree and six examples.
  2. “Differentiate between Direct Services and Indirect Services.” — answered with the source's payment-based distinction and caveat.
- WEEKEND ASSIGNMENT (Mammoth 167–172):
  1. “Which of the following is concerned with changing raw materials to finished goods?” — (b) Manufacturing occupation.
  2. “Which of the following is not a function of commerce?” — (b) creation of goods.
  3. “An industry whose major actors consist of those engaged in sourcing raw materials from the earth surface is known as ______ industry” — (c) extractive.
  4. “The services offered by the following people could be grouped under direct services except (a) Doctors (b) entertainers (c) policemen (d) teachers.” — ambiguous; intended (c) policemen, but (d) teachers can also be indirect when government-paid. Do not grade as a single-answer question until corrected.
  5. “The services of a teacher is in the classification of (a) commerce (b) direct services (c) extractive occupation (d) indirect services.” — (d) for a government-paid teacher under the source's scheme.
- THEORY (Mammoth 174–176):
  1. “List any four factors that affect employment.” — any four from the twelve factors in the lesson.
  2. “Give four examples of commercial occupations.” — transport, insurance, advertising, warehousing; banking, finance and communication also accepted.
- GENERAL EVALUATION (Mammoth 178–183): all five prompts are recorded as out-of-scope; no invented answers are supplied.
- READING ASSIGNMENT (Mammoth 163–165): both cited books/pages are recorded; editions/rights are not verified and no pages are reproduced.

## Coverage and open items
- Added 21 objective/assessment coverage records for scheme row, occupation definition, six divisions, all sub-divisions, factors, both evaluations, five weekend items, two theory questions, general evaluation and reading.
- Updated scheme row 2 coverage to IMPLEMENTED_EQUIVALENT based on the complete lesson, not the one-line scheme heading alone.
- Added open items for the commercial/secondary label, ambiguous Weekend item 4, out-of-scope General Evaluation and external reading rights.
- Fact task `COM-FACT-T1-OCCUPATION-CLASSIFICATION` is completed as a source-vs-standard finding and has its own evidence note. Owner approval remains pending.
- Added follow-up tasks `COM-LES-T1-W02-GENERAL-EVALUATION` (PENDING), `COM-OWNER-T1-W02-WEEKEND-Q4` (BLOCKED) and `COM-OWNER-T1-W02-READING-RIGHTS` (BLOCKED).

## Changed files
1. `backend/src/db/ss1/subjects/commerce.json`
2. `docs/ss1/work/microtasks/commerce/QUEUE.json`
3. `docs/ss1/work/microtasks/commerce/COM-WK-T1-W02.md`
4. `docs/ss1/work/microtasks/commerce/COM-FACT-T1-OCCUPATION-CLASSIFICATION.md`

## Commits
- Package implementation: `3a8f9d14b5d54e8f64e28430a588a619b4f6c354`.
- Queue and follow-up tasks: `6defaf1d537b49cdabda06ebe6649e77fc1f378a`.
- Evidence notes are committed next on the same branch.

## Verification performed
- Verified the archive and exact legacy .doc member SHA-256 against the registered task attachment.
- Read the complete Week Two source block and every EVALUATION, READING, WEEKEND, THEORY and GENERAL EVALUATION item.
- Added 21 unique coverage records; lesson ID is unique.
- Practice questions have proposed mark allocations and criterion sums.
- Queue counts reconciled after two task completions and three follow-up tasks: 15 IMPLEMENTED_TESTING_DEFERRED, 4 BLOCKED, 54 PENDING (73 total); Week Three is first in `next_runnable`.
- No importer, subject compiler, TypeScript, database, device or student UI test was run. Owner-deferred validation remains DEFERRED. Content approval remains PENDING.

## Remaining work
- Obtain teacher/owner approval for the commercial/secondary-sector correction.
- Clarify Weekend item 4 before grading it.
- Complete the five General Evaluation questions after the relevant Commerce weeks are indexed.
- Verify external reading editions/rights.
- Continue Week Three and subsequent weeks/terms; this checkpoint does not claim Commerce or SS1 is complete.

## Exact next action
After PR integration, refresh Commerce package and queue from current master, check branch ownership again, then implement `COM-WK-T1-W03`.
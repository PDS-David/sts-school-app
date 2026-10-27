# ENG-WK-T1-W02 — English Language

Copy the following prompt into one worker session. Attach the composite archive named below.

```text
TASK: SS1 ENG-WK-T1-W02 ONLY
Repository: PDS-David/sts-school-app
Subject slug: english
Queue: docs/ss1/work/microtasks/english/QUEUE.json
Reviewed base: d01704cd15aa69241a8775c5e072fd2297b1d71b; start from latest origin/master, not this historical SHA.

Implement exactly ENG-WK-T1-W02 (SOURCE_WEEK_INDEXING). Do not perform other weeks, other sources or the entire subject.

START
Fetch master, record SHA, read applicable AGENTS.md and check open PRs for this exact item. Use a separate branch/worktree. If already completed on master, report its evidence and stop without duplicating it. If another worker owns an open PR for it, report that PR and do not overwrite it. Confirm the queue prerequisites: ENG-SRC-T1. Do not treat implementation-deferred status as approval or successful testing.

OBJECTIVE
Index 1st Term Week 2 at objective level: list each scheme objective, bind it to exact source rows and/or supplements, and confirm each replacement's scope.

EXISTING EVIDENCE
backend/src/db/ss1/subjects/english.json coverage ENGLISH-BODY-004, ENGLISH-BODY-005, ENGLISH-BODY-006, ENGLISH-BODY-007 (4 body-level rows; statuses {'PARTIAL': 4}). Row titles: ENGLISH-BODY-004='TOPICS: COMPREHENSION, READING SKILLS; RELIGION.'; ENGLISH-BODY-005='B.  TOPIC: STRUCTURE: INTRODUCTION TO PHRASAL VERBS.'; ENGLISH-BODY-006='C. Adverbs, Conjunction and Preposition'; ENGLISH-BODY-007='D. TOPIC: VOCABULARY DEVELOPMENT: WORDS ASSOCIATED WITH LIBRARY'. Row-level only: coverage entries say a row-level association is not an exhaustive scheme-objective certification. Rows whose locator labels are spelled-out week numbers (ONE, TWO, …) appear to be scheme-table rows; no classify_marker/SCHEME_ONLY rule exists in the package yet.

COMPLETION CONDITION
Every objective of Week 2 has its own coverage entry with exact locator and evidence; scheme-table rows are classified; no PARTIAL/UNRESOLVED entry lacks an OPEN open item. No lesson is invented for unreviewed content: new lesson items are appended to the queue only after this indexing.

READ
- docs/ss1/work/microtasks/english/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/subjects/english.json
- docs/ss1/work/SS1-02/CHECKPOINT.md
- docs/ss1/work/SS1-02/author_english.py
Read the subject QUEUE_BUILD.md and relevant existing note if available. A package absent because this task creates it is not a missing input; use the strict contract's required envelope and arrays. Preserve existing package content if another completed task has since created it.

ATTACHMENTS
[
  {
    "archive": "SSS 1-20260507T072431Z-3-001 (1).zip",
    "archive_sha256": "024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e",
    "member": "SSS 1/1st Term SS1_/1ST TERM S1 ENGLISH LANGUAGE.doc",
    "member_sha256": "4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef"
  }
]
The shared archive's display filename is SSS 1-20260507T072431Z-3-001 (1).zip. Verify its SHA-256 and the assigned member hash. Use only the source(s) specified above. If archive access is missing, request that exact archive; do not treat missing access as missing curriculum. Convert/render legacy DOC privately if necessary. Record tool/method and reproducible locators. Do not substitute a different document based on filename or size.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/english.json
- docs/ss1/work/microtasks/english/QUEUE.json
- docs/ss1/work/microtasks/english/ENG-WK-T1-W02.md
No shared schema/compiler/importer, other subject, UI or JSS3 changes. The task note path above is explicitly authorised even if not previously present in the queue.

IMPLEMENTATION RULES
- Registration creates/adds only this source and justified metadata under master's schema; package stays PENDING. Do not fabricate header text or alias approval. A real subject/header mismatch becomes a precise open item, not silent reassignment.
- Indexing records exact objectives, evidence and existing lesson associations for this item only. Add small PENDING follow-up tasks for genuine uncovered objectives; do not invent coverage or write the follow-up lessons now.
- Header/preamble checks inspect only their stated scope; do not expand into a whole-subject audit.
- Preserve original source wording, stable identities and other workers' changes. Correct teaching through separately tracked replacements, not silent source edits.
- Source rules or coverage requiring unavailable exact parser identities must remain explicitly unresolved; never guess a hash or claim runtime validation. Parsing/importer execution is deferred in this stage.
- Use the strict schema's supported fields. If required structure is unsupported, record the precise foundation dependency rather than changing the schema.
- Do not assert approval, certification or successful verification. Keep genuinely unresolved items open.
- Do not commit original documents, full extracts, private renders or credentials.

FINISH
Update this item's status only when its implementation completion condition is met; recompute queue counts and next_runnable from actual satisfied dependencies. Retain completed evidence and add a short note at docs/ss1/work/microtasks/english/ENG-WK-T1-W02.md with input hashes, edits, remaining dependencies and starting SHA. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts.

CHECKS
Only hashes, JSON syntax, reference consistency and diff inspection. No tests, typechecks, importer runs, database, device checks or deployment. Testing deferred by owner.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with ENG-WK-T1-W02 in its title. Do not merge. If push access is unavailable, provide a downloadable binary-capable patch with its exact base SHA; do not request a token in chat.
Report completion or precise blocker, files changed, commit/PR or patch, and the next eligible item. Stop after this ONE task.
```

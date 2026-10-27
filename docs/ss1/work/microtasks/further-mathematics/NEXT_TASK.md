# FM-PRE-T1 — Further Mathematics

Copy the following prompt into one worker session. Attach the composite archive named below.

```text
TASK: SS1 FM-PRE-T1 ONLY
Repository: PDS-David/sts-school-app
Subject slug: further-mathematics
Queue: docs/ss1/work/microtasks/further-mathematics/QUEUE.json
Reviewed base: d01704cd15aa69241a8775c5e072fd2297b1d71b; start from latest origin/master, not this historical SHA.

Implement exactly FM-PRE-T1 (SOURCE_PREAMBLE_INDEXING). Do not perform other weeks, other sources or the entire subject.

START
Fetch master, record SHA, read applicable AGENTS.md and check open PRs for this exact item. Use a separate branch/worktree. If already completed on master, report its evidence and stop without duplicating it. If another worker owns an open PR for it, report that PR and do not overwrite it. Confirm the queue prerequisites: FM-SRC-T1. Do not treat implementation-deferred status as approval or successful testing.

OBJECTIVE
Inventory all 1st Term text outside the ten parsed week rows (header, scheme-of-work table, revision/examination lines, reference list, any cover or letterhead page) and record the scheme topic listed for each week 1-10 so the week items can bind objectives to it. Re-read the header and record whether it verifies the subject.

EXISTING EVIDENCE
Package holds marker coverage COV-FM-T1-EXAM (objective "Revision and examination weeks; reference list", locator "scheme lines 11-12") bound to RULE-FM-T1-SCHEME-EXAM (classify_marker SCHEME_ONLY). Row-level coverage locators cite "scheme weeks 1-10" / "scheme topic n", so a scheme table exists, but its text and its week-to-topic list are not recorded in the repository. The header text was recorded by SS1-03 and is not re-verified. OI-FM-004 reports advertising letterhead/cover pages in the 2nd and 3rd Term sources; the 1st Term has no such record. Legacy .doc: parsed by word-extractor in the importer.

COMPLETION CONDITION
Every non-week text block is hash-accounted and either mapped to coverage or recorded as an open item; the week-to-scheme-topic list is written to the FM-PRE note; header verification result (matches / differs) is recorded; any letterhead or vendor branding is listed for FM-VIS-T1-BRANDING handling (or recorded as absent for the 1st Term). No lesson is authored in this item.

READ
- docs/ss1/work/microtasks/further-mathematics/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/subjects/further-mathematics.json
- backend/src/db/ss1/compiler.ts
- docs/ss1/work/SS1-03/CHECKPOINT.md
- docs/ss1/work/SS1-03/evidence/parsed_rows.json
Read the subject QUEUE_BUILD.md and relevant existing note if available. A package absent because this task creates it is not a missing input; use the strict contract's required envelope and arrays. Preserve existing package content if another completed task has since created it.

ATTACHMENTS
[
  {
    "archive": "SSS 1-20260507T072431Z-3-001.zip (display name may be \"SSS 1-20260507T072431Z-3-001 (1).zip\"; the hash decides)",
    "archive_sha256": "024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e",
    "member": "SSS 1/1st Term SS1_/1ST TERM S1 FURTHER MATHEMATICS.doc",
    "member_sha256": "995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145"
  }
]
The shared archive's display filename is SSS 1-20260507T072431Z-3-001 (1).zip. Verify its SHA-256 and the assigned member hash. Use only the source(s) specified above. If archive access is missing, request that exact archive; do not treat missing access as missing curriculum. Convert/render legacy DOC privately if necessary. Record tool/method and reproducible locators. Do not substitute a different document based on filename or size.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/further-mathematics.json
- docs/ss1/work/microtasks/further-mathematics/QUEUE.json
- docs/ss1/work/microtasks/further-mathematics/FM-PRE-T1.md
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
Update this item's status only when its implementation completion condition is met; recompute queue counts and next_runnable from actual satisfied dependencies. Retain completed evidence and add a short note at docs/ss1/work/microtasks/further-mathematics/FM-PRE-T1.md with input hashes, edits, remaining dependencies and starting SHA. Do not edit shared NEXT_ASSIGNMENTS.md or other subjects' prompts.

CHECKS
Only hashes, JSON syntax, reference consistency and diff inspection. No tests, typechecks, importer runs, database, device checks or deployment. Testing deferred by owner.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with FM-PRE-T1 in its title. Do not merge. If push access is unavailable, provide a downloadable binary-capable patch with its exact base SHA; do not request a token in chat.
Report completion or precise blocker, files changed, commit/PR or patch, and the next eligible item. Stop after this ONE task.
```

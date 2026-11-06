# Prompt 16 — GOV-WK-T1-W01

Repository: PDS-David/sts-school-app. Target branch: master. This instruction authorises ONE task only. All three SS1 terms are instructional, including Data Processing. Do not edit JSS3, other subjects, workflows, shared schemas, routes, or production data.

Start from fresh origin/master in an isolated working tree. Read any applicable AGENTS.md, docs/ss1/contracts/CONTRACT.md and backend/src/db/ss1/subjectPackageSchema.ts. Inspect the named task and its dependencies. Reuse completed source registration/inventory; do not rebuild all subjects or repeat prior audits. If this exact task is already implemented, inspect its stated deliverables, correct only a concrete defect, and report the commit containing them. Do not create duplicate lessons or move to another task.

Only the paths listed below may change. Existing approval references and source hashes are immutable unless there is explicit evidence of an error. Preserve original source wording and content; author equivalents as visibly original teaching, with truthful provenance. Drafting can proceed with content_approval=PENDING and verification=DEFERRED; do not claim teacher approval, certification, practical performance, device display or production delivery. Never mark the whole package complete for one task.

Testing remains deferred by the owner: do not run full suites, type checks, importer/capture, DB scripts or deployments. Do check JSON syntax, stable-ID uniqueness, reference integrity, UTF-8 body hashes, source file hashes, marking arithmetic and the task's source evidence. Do not disable automatic CI. Read the current schema rather than adding invented fields. Inspect actual text/figures where needed; an inventory or word overlap alone cannot prove teaching coverage.

If an original source is needed, use ONLY the listed member(s), not the entire ZIP. Hash original bytes before conversion; preserve originals privately, reproduce the already-recorded extraction locator convention, and inspect equations/tables in the original when plain text loses structure. Do not commit full source documents or private extracts. Source-reading tools may be installed narrowly from the repository's pinned dependencies; no full build is needed. A standalone member with the correct hash is sufficient even if its uploaded name differs.

If a genuine curriculum choice, missing material, permission or credential is necessary, ask the OWNER immediately in the chat: name the exact task/claim, the evidence, the concrete options and the recommended option. Continue independent work while awaiting a required answer. Do not silently invent an answer, bypass a blocked dependency, ask a teacher who is unavailable, or finish with an unexplained request. Routine mathematical derivation, JSON editing and original drafting are implementation work, not teacher-approval requests. If this prompt and a stale task note conflict on scope/publication, follow this prompt; preserve genuine source/content/rights gates.

Save the implementation before producing a long report. Update this task's implementation reference, status and queue counts truthfully. Recompute counts from items; if updating next_runnable, include only tasks with satisfied dependencies and exclude deferred TEST tasks. Keep open items until their exact condition is met. Report any newly discovered gap once with a bounded follow-up, not multiple duplicate investigation tasks.

Publication: the owner does NOT require a separate PR per task. Commit only the named paths, fetch origin/master again, and publish by a normal non-force fast-forward push to master. If master moved on unrelated paths, rebase the commit and recheck changed-file hashes/references. If the same subject changed, reconcile by stable ID after reading the new changes; never overwrite the new package. Do not force push, bypass branch protections or disable CI. If protection requires a PR, use one integration PR for your subject/session where practical and explain the enforced restriction. If write access is unavailable, finish the work, provide a binary-capable patch plus base SHA, and ask the owner to connect GitHub; never request a pasted token. A committed workflow is not evidence that lesson changes are deployed. Report the final remote SHA and automatic workflow status separately.

Final response: task ID; actual lesson/coverage/asset change; exact files; checks performed (and deferred checks); remote commit or downloadable patch; remaining content/approval blocker. Stop after this one task.

## Your ONE task

Subject: **government**. Task ID: **GOV-WK-T1-W01**. Recorded kind: SOURCE_WEEK_INDEXING.

Attach ONLY `1ST TERM S1 GOVERNMENT.doc`. Original archive member: `SSS 1/1st Term SS1_/1ST TERM S1 GOVERNMENT.doc`. SHA-256: `50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a`; bytes: 1163776. No other source files are required for this task.

### Read these repository files

- `backend/src/db/ss1/subjectPackageSchema.ts`
- `docs/ss1/contracts/CONTRACT.md`
- `docs/ss1/work/microtasks/government/QUEUE.json`
- `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`
- `backend/src/db/ss1/compiler.ts`
- `docs/ss1/IMPLEMENTATION_20261026/06_WORKER_E_CIVIC_GOVERNMENT_DATA.md`
- `backend/src/db/ss1/subjects/government.json`

### Exact boundary

getBody lines 45-102 (block SHA-256 cbce46f8555ccf042f113c0d5694daeb0e617e2cb7dfdb915fe1c7b939990e04)

Index week 1 of the 1st Term source: lines 45-102, block SHA-256 cbce46f8555ccf042f113c0d5694daeb0e617e2cb7dfdb915fe1c7b939990e04. Labels and sections: `WEEK ONE` 45, `TOPIC: THE MEANING AND SCOPE OF THE SUBJECT MATTER: GOVERNMENT` 46, `CONTENT` 47; sections `GOVERNMENT AS AN INSTITUTION OF THE STATE` 52, `GOVERNMENT AS A PROCESS OR ART OF GOVERNING` 62, `GOVERNMENT AS AN ACADEMIC FIELD OF STUDY` 69; markers 58, 74, 78, 84, 88, 100. Read every objective and exercise inside the span (the week's evaluation questions, general evaluation, reading assignment, weekend assignment and theory questions) before writing anything. Implement actual objective-level coverage under the existing schema, with the exact anchor that occurs once and the source hash, and add a source rule only if the structure genuinely needs one. Missing content gets a precise open item and a small lesson task; an evaluation or assignment heading cannot erase teaching. Verify against primary texts: the Hobbes attribution and the quoted description at 53-54 (the source says `solitary, poor, wicked and short`; keep the source wording separate from the primary wording), the `primitive society` framing, and the duplicated evaluation that asks about the academic field at 59 and 75 before and after its section. Keep approval PENDING and verification DEFERRED, keep Government separate from Civic Education, and teach contested political questions neutrally with attribution.

 Implement the mappings in the subject JSON, not just a Markdown report. For a fully taught source objective, reuse its exact existing originalLessonId and add SUPPORTED coverage with evidence; do not create a replacement merely to increase the supplement count. Missing teaching or unkeyed exercises need precise PARTIAL/UNRESOLVED records and bounded authoring follow-ups, not fabricated answers. Limit the read to this named span and the scheme lines needed to identify it. Do not expand to a whole term.

### Dependencies already implemented at dispatch

GOV-INV-T1, GOV-SRC-T1. Recheck on current master; approval/verification remain separate.

### Allowed write paths

- `backend/src/db/ss1/subjects/government.json`
- `docs/ss1/work/microtasks/government/QUEUE.json`
- `docs/ss1/work/microtasks/government/GOV-WK-T1-W01.md`

### Done means

Objective-level coverage for the stated span exists with exact anchors and the source hash; every exercise in the span is accounted for; missing content has an open item and a small lesson task; no lesson claims approval or verification; no week is merged into Civic Education. Follow the schema. A missing or unsupported schema field needs a precise separate dependency, not a silent edit. Do not copy unavailable textbook pages (the READING ASSIGNMENT citations name books and pages that are not supplied) and do not infer whole-row coverage from one objective.

Do not close this task merely because a report was written if its completion condition requires package changes. No whole-subject or release completion is implied.

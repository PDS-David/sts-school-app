# Prompt 14 — FN-WK-T1-W01

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

Subject: **food-and-nutrition**. Task ID: **FN-WK-T1-W01**. Recorded kind: SOURCE_WEEK_INDEXING.

Attach ONLY `F _ N.docx`. Original archive member: `SSS 1/1st Term SS1_/F _ N.docx`. SHA-256: `398b0e1f1383e88f7d71148253f8466fbfed95fefdca068907b5ba35083f4ff7`; bytes: 38569. No other source files are required for this task.

### Read these repository files

- `backend/src/db/ss1/subjectPackageSchema.ts`
- `docs/ss1/contracts/CONTRACT.md`
- `docs/ss1/work/microtasks/food-and-nutrition/QUEUE.json`
- `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`
- `backend/src/db/ss1/compiler.ts`
- `docs/ss1/IMPLEMENTATION_20261026/07_WORKER_F_FOOD_CATERING.md`
- `backend/src/db/ss1/subjects/food-and-nutrition.json`

### Exact boundary

lines 107-153 (marker 'WEEK 1', title 'INTRODUCTION TO FOOD AND NUTRITION'), SHA-256 f34469bf0472df86f85c5153d24d5e71b4cf734aeeee66718569fd146867ba97

Index Week 1 of the 1st Term Food and Nutrition source and implement actual objective-level coverage/rules under the existing schema. Read the whole section (lines 107-153, body SHA-256 f34469bf0472df86f85c5153d24d5e71b4cf734aeeee66718569fd146867ba97): the title (109), the opening statements on the search for food (111), the definitions of food and of nutrients (113-115), the definition of nutrition including the printed duplication 'Nutrition is therefore is the science of food in relation to health' (117), 'Importance of human nutrition' with eight numbered points (119-135), and 'Factors affecting human nutrition' with six numbered points (141-153). There is no evaluation, weekend assignment or theory block inside this section; the only evaluation in the document that addresses this content is printed at 185 at the end of Week 2. Record the objectives and every question/assignment with exact wording and line numbers, note that Week 1 carries no assessment of its own, and record any missing assessment as a precise open item plus a small lesson task. Every question or assignment the source does not answer gets a precise open item plus a small lesson task, never an invented answer. A one-line scheme heading is not evidence of coverage; do not import a scheme row as a complete lesson, do not infer whole-row coverage from one objective, and do not merge Food and Nutrition into Catering Craft. Do not record a classroom practical observation that was not made and do not prescribe treatment or doses.

 Implement the mappings in the subject JSON, not just a Markdown report. For a fully taught source objective, reuse its exact existing originalLessonId and add SUPPORTED coverage with evidence; do not create a replacement merely to increase the supplement count. Missing teaching or unkeyed exercises need precise PARTIAL/UNRESOLVED records and bounded authoring follow-ups, not fabricated answers. Limit the read to this named span and the scheme lines needed to identify it. Do not expand to a whole term.

### Dependencies already implemented at dispatch

FN-INV-T1, FN-SRC-T1. Recheck on current master; approval/verification remain separate.

### Allowed write paths

- `backend/src/db/ss1/subjects/food-and-nutrition.json`
- `docs/ss1/work/microtasks/food-and-nutrition/QUEUE.json`
- `docs/ss1/work/microtasks/food-and-nutrition/FN-WK-T1-W01.md`

### Done means

Week 1 objective-level coverage or marker rules exist under the existing schema for the definitions, the eight importance points and the six factors, with exact locators; the absent Week 1 assessment is recorded as an open item plus a small lesson task; nothing is marked approved or verified.

Do not close this task merely because a report was written if its completion condition requires package changes. No whole-subject or release completion is implied.

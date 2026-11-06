# Prompt 13 — FA-WK-T1-W01

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

Subject: **financial-accounting**. Task ID: **FA-WK-T1-W01**. Recorded kind: SOURCE_WEEK_INDEXING.

Attach ONLY `1ST TERM S1 FINANCIAL ACCOUNT.docx`. Original archive member: `SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx`. SHA-256: `c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb`; bytes: 1166213. No other source files are required for this task.

### Read these repository files

- `backend/src/db/ss1/subjectPackageSchema.ts`
- `docs/ss1/contracts/CONTRACT.md`
- `docs/ss1/work/microtasks/financial-accounting/QUEUE.json`
- `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`
- `backend/src/db/ss1/compiler.ts`
- `docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md`
- `backend/src/db/ss1/subjects/financial-accounting.json`

### Exact boundary

lines 65-263 (marker 'WEEK ONE', topic 'TOPIC: INTRODUCTION TO BOOK – KEEPING AND ACCOUNTING'), SHA-256 9c7f09369d4ed8878008d314426d26e60575fde599764f2cd6b6e1849d6f7e17

Index Week 1 of the 1st Term Financial Accounting source and implement actual objective-level coverage/rules under the existing schema. Read the whole section (lines 65-263, body SHA-256 9c7f09369d4ed8878008d314426d26e60575fde599764f2cd6b6e1849d6f7e17): CONTENT (69-75), the definition of book-keeping and accounting (79-81), DIFFERENCES BETWEEN BOOK-KEEPING AND ACCOUNTING (85-93), USERS OF ACCOUNTING INFORMATION/FINANCIAL STATEMENTS (97-179, owners, shareholders, loan creditors, trade creditors, competitors, customers, employees, tax authorities naming LSBIR and FBIR, government naming CBN/NDIC/SEC/CAC/NSE, the public), EVALUATION QUESTIONS (185-189), IMPORTANCE OF BOOK-KEEPING AND ACCOUNTING (191-213), HISTORY OF THE DEVELOPMENT OF ACCOUNTING (215-223), EVALUATION QUESTIONS (229-233), READING ASSIGNMENT (237-239), WEEKEND ASSIGNMENT (243-255, five multiple-choice items with no printed key), THEORY (257-263). Record every evaluation, weekend and theory question with exact wording and line numbers; a question the source does not answer gets a precise open item and a small lesson task, not an invented answer. The history paragraph is a dated factual claim (Luca Pacioli 1494; a royal charter to the Royal Niger Company in 1886; the Institute of Chartered Accountants of Nigeria on 1st September 1965; the Association of National Accountants of Nigeria on 31st July 1979 as the second professional body) and belongs to FA-FACT-T1-DATED-REFERENCES; the regulator abbreviations belong to the same item. The reading assignment names 'Simplified and Amplified Financial Accounting Page 1 - 7', a textbook that was not supplied: FA-FACT-T1-EXTERNAL-MATERIALS holds that disposition. Do not import the scheme row as a complete lesson and do not infer whole-row coverage from one objective.

 Implement the mappings in the subject JSON, not just a Markdown report. For a fully taught source objective, reuse its exact existing originalLessonId and add SUPPORTED coverage with evidence; do not create a replacement merely to increase the supplement count. Missing teaching or unkeyed exercises need precise PARTIAL/UNRESOLVED records and bounded authoring follow-ups, not fabricated answers. Limit the read to this named span and the scheme lines needed to identify it. Do not expand to a whole term.

### Dependencies already implemented at dispatch

FA-INV-T1, FA-SRC-T1. Recheck on current master; approval/verification remain separate.

### Allowed write paths

- `backend/src/db/ss1/subjects/financial-accounting.json`
- `docs/ss1/work/microtasks/financial-accounting/QUEUE.json`
- `docs/ss1/work/microtasks/financial-accounting/FA-WK-T1-W01.md`

### Done means

Week 1 objective-level coverage or marker rules exist under the existing schema for every CONTENT objective and assessment block, with exact locators; unanswered questions are recorded as precise open items plus a small lesson task; nothing is marked approved, verified or implemented beyond what was actually written.

Do not close this task merely because a report was written if its completion condition requires package changes. No whole-subject or release completion is implied.

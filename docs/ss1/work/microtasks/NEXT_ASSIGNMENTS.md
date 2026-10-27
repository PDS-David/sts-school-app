# SS1 next assignments — one small task per subject

Integration review of master `881a214e08cf5fee1c783d507c86e8679bcaa62e` (2026-10-27). Documentation only: no tests, typechecks, importer, database, deployment or device work was run, and no assignment below has been executed. Testing deferred by owner.

## Review result

- **Subjects:** 21 unique slugs in `SOURCE_ASSIGNMENTS.csv` (61 sources). **20 have a queue on master** (queue PRs #75–#95, all merged); **geography has none** and no PR or branch for it exists.
- **Open PRs:** only #71 (alternate foundation, DO NOT MERGE). It was neither merged nor used. No queue-adding PR was open, so there was nothing to merge, reconcile or claim-protect; this PR adds only `NEXT_ASSIGNMENTS.md`.
- **Active claims:** no item in any queue is `IN_PROGRESS`; no other agent's claim exists to preserve.
- **Queue checks (all 20):** valid JSON; unique IDs; every `depends_on` resolves; no cycles; `counts`/`status_counts` equal recomputed totals; every source ID, member and SHA-256 in an attachment equals the CSV row for that subject; every referenced repository file exists except each subject's own package JSON, which its registration item is permitted to create.
- **Packages and weeks:** subjects without a package have registration items; unknown source weeks have `SOURCE_WEEK_INVENTORY` items rather than invented weeks. Packages already on master: English, French, Mathematics, Further Mathematics (registrations implemented).

## Queue defects found (not fixed: their owning PRs are already merged; none blocks assignment)

1. `english/QUEUE.json` has no `next_runnable` and no `QUEUE_BUILD.md`, no item has `required_attachments`, and each item lists the combined archive file name in `required_files` as if it were a repository path. The English assignment below supplies the exact member and hash from the CSV.
2. `english/QUEUE.json` `generated_from.master_sha` is `fc6f8e27…`, not current master. The ENG-WK-T1-W01 record notes the combined archive was supplied as three term archives and its hash was not re-verified; member hashes are the binding check.
3. Geography has no queue (below).

## Assignment summary (one task per subject; different subjects may run concurrently)

| Subject | Queue | Next item | Kind |
|---|---|---|---|
| Agricultural Science | `agricultural-science` | `AG-SRC-T1` | SOURCE_REGISTRATION |
| Biology | `biology` | `BIO-SRC-T1` | SOURCE_REGISTRATION |
| Bookkeeping | `bookkeeping` | `BK-SRC-T1` | SOURCE_REGISTRATION |
| Catering Craft | `catering-craft` | `CC-SRC-T2` | SOURCE_REGISTRATION |
| Chemistry | `chemistry` | `CHEM-SRC-T1A` | SOURCE_REGISTRATION |
| Civic Education | `civic-education` | `CIV-SRC-T1` | SOURCE_REGISTRATION |
| Commerce | `commerce` | `COM-SRC-T1` | SOURCE_REGISTRATION |
| Data Processing | `data-processing` | `DP-SRC-T1` | SOURCE_REGISTRATION |
| Economics | `economics` | `ECON-SRC-T1` | SOURCE_REGISTRATION |
| English Language | `english` | `ENG-WK-T1-W02` | SOURCE_WEEK_INDEXING |
| Financial Accounting | `financial-accounting` | `FA-SRC-T1` | SOURCE_REGISTRATION |
| Food and Nutrition | `food-and-nutrition` | `FN-SRC-T1` | SOURCE_REGISTRATION |
| French | `french` | `FR-WK-T1-W01` | SOURCE_WEEK_INDEXING |
| Further Mathematics | `further-mathematics` | `FM-PRE-T1` | SOURCE_PREAMBLE_INDEXING |
| Government | `government` | `GOV-SRC-T1` | SOURCE_REGISTRATION |
| Literature | `literature` | `LIT-SRC-T1` | SOURCE_REGISTRATION |
| Mathematics | `mathematics` | `MATH-FACT-HEADER-T1` | FACTUAL_DEPENDENCY |
| Physics | `physics` | `PHYS-SRC-T1` | SOURCE_REGISTRATION |
| Technical Drawing | `technical-drawing` | `TD-SRC-T2` | SOURCE_REGISTRATION |
| Yoruba | `yoruba` | `YO-SRC-T1` | SOURCE_REGISTRATION |
| Geography | none | queue-building task `GEO-QUEUE-BUILD` | queue creation |

Concurrency: no two assignments share a write path (checked), so different subjects can proceed together. Within a subject every item writes that subject's `QUEUE.json`, so same-subject items must run one after another; run the next item only after the previous PR is reviewed.

## Specific remaining work and input blockers

- **Geography queue is missing** — a queue-building task (prompt at the end). The stage is not complete until it merges.
- **Attachment required for every source-reading item below:** the combined archive (or the exact member). The archive has not been supplied in the repository (by design). A worker without it must report the exact member filename and stop.
- **Physics 1st Term member is 8,479,232 bytes** (legacy `.doc`); allow for the large upload.
- No other input is missing. Mathematics and Further Mathematics unmerged PR #71 work remains preserved at `b5ced7ebb0efe22df2351baa140266fbf40cbf41`; those queues carry the port items.

# Assignments

## Agricultural Science (`agricultural-science`)

- **Queue:** `docs/ss1/work/microtasks/agricultural-science/QUEUE.json`
- **Next runnable item:** `AG-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Agricultural Science source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx` (SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/agricultural-science.json`, `docs/ss1/work/microtasks/agricultural-science/QUEUE.json`, `docs/ss1/work/microtasks/agricultural-science/AG-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/agricultural-science.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for AG-SRC-T1</summary>

```text
TASK: SS1 Agricultural Science — QUEUE ITEM AG-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/agricultural-science/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item AG-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Agricultural Science source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug agricultural-science, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject, record an explicit handoff open item; do not delete or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 AGRICULTURAL SCIENCE.docx` (SHA-256 `df1b516cdd8855d069a329d7aa627dbd0dcd3612dd10d254c53af9cb93a56526`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/agricultural-science.json
- docs/ss1/work/microtasks/agricultural-science/QUEUE.json
- docs/ss1/work/microtasks/agricultural-science/AG-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/agricultural-science.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/ag-src-t1, push it, open a PR to master with 'AG-SRC-T1' in its title and do not merge it. Report: whether AG-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Biology (`biology`)

- **Queue:** `docs/ss1/work/microtasks/biology/QUEUE.json`
- **Next runnable item:** `BIO-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Biology source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx` (SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/biology.json`, `docs/ss1/work/microtasks/biology/QUEUE.json`, `docs/ss1/work/microtasks/biology/BIO-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/biology.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for BIO-SRC-T1</summary>

```text
TASK: SS1 Biology — QUEUE ITEM BIO-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/biology/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item BIO-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Biology source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug biology, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject, record an explicit handoff open item; do not delete or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/BIOLOGY 1 alfa term - Copy.docx` (SHA-256 `936fb6374ca206d17275d6e9be6ff0947219af221b144aafc162bb1f78087ce8`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/biology.json
- docs/ss1/work/microtasks/biology/QUEUE.json
- docs/ss1/work/microtasks/biology/BIO-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/biology.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/bio-src-t1, push it, open a PR to master with 'BIO-SRC-T1' in its title and do not merge it. Report: whether BIO-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Bookkeeping (`bookkeeping`)

- **Queue:** `docs/ss1/work/microtasks/bookkeeping/QUEUE.json`
- **Next runnable item:** `BK-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Bookkeeping source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/book keeping.docx` (SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/bookkeeping.json`, `docs/ss1/work/microtasks/bookkeeping/QUEUE.json`, `docs/ss1/work/microtasks/bookkeeping/BK-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/bookkeeping.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for BK-SRC-T1</summary>

```text
TASK: SS1 Bookkeeping — QUEUE ITEM BK-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/bookkeeping/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item BK-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Bookkeeping source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug bookkeeping, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject (for example Financial Accounting), record an explicit handoff open item; do not delete, merge into financial-accounting or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/book keeping.docx` (SHA-256 `9b24550136a914c0056299abdb8aeed897244929a2c330ff3892d1fa07efdce0`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/bookkeeping.json
- docs/ss1/work/microtasks/bookkeeping/QUEUE.json
- docs/ss1/work/microtasks/bookkeeping/BK-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/bookkeeping.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/bk-src-t1, push it, open a PR to master with 'BK-SRC-T1' in its title and do not merge it. Report: whether BK-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Catering Craft (`catering-craft`)

- **Queue:** `docs/ss1/work/microtasks/catering-craft/QUEUE.json`
- **Next runnable item:** `CC-SRC-T2` — SOURCE_REGISTRATION
- **Objective:** Register the 2nd Term Catering Craft source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/07_WORKER_F_FOOD_CATERING.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc` (SHA-256 `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/catering-craft.json`, `docs/ss1/work/microtasks/catering-craft/QUEUE.json`, `docs/ss1/work/microtasks/catering-craft/CC-SRC-T2.md` Permission: `backend/src/db/ss1/subjects/catering-craft.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for CC-SRC-T2</summary>

```text
TASK: SS1 Catering Craft — QUEUE ITEM CC-SRC-T2 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/catering-craft/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item CC-SRC-T2 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 2nd Term Catering Craft source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug catering-craft, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. No 1st Term scheme is created or implied. If the header names a different subject (for example Food and Nutrition), record an explicit handoff open item; do not delete, merge into food-and-nutrition or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/07_WORKER_F_FOOD_CATERING.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/2nd Term SS1_/2ND TERM S1 CATERING CRAFT PRACTICES.doc` (SHA-256 `fd8115ff99dd3c370b86b4b5a326fe647e49328bc83f2d041c73f29b1b84ad59`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/catering-craft.json
- docs/ss1/work/microtasks/catering-craft/QUEUE.json
- docs/ss1/work/microtasks/catering-craft/CC-SRC-T2.md
Permission: `backend/src/db/ss1/subjects/catering-craft.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/cc-src-t2, push it, open a PR to master with 'CC-SRC-T2' in its title and do not merge it. Report: whether CC-SRC-T2 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Chemistry (`chemistry`)

- **Queue:** `docs/ss1/work/microtasks/chemistry/QUEUE.json`
- **Next runnable item:** `CHEM-SRC-T1A` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Chemistry source (first 1st Term file): open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx` (SHA-256 `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/chemistry.json`, `docs/ss1/work/microtasks/chemistry/QUEUE.json`, `docs/ss1/work/microtasks/chemistry/CHEM-SRC-T1A.md` Permission: `backend/src/db/ss1/subjects/chemistry.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for CHEM-SRC-T1A</summary>

```text
TASK: SS1 Chemistry — QUEUE ITEM CHEM-SRC-T1A ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/chemistry/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item CHEM-SRC-T1A (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Chemistry source (first 1st Term file): open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug chemistry, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject, record an explicit handoff open item; do not delete or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 CHEMISTRY.docx` (SHA-256 `07053f977dcbef91ee05d74a2e4dab9c3fa921cbb3792dc8698287a55197bb3a`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/chemistry.json
- docs/ss1/work/microtasks/chemistry/QUEUE.json
- docs/ss1/work/microtasks/chemistry/CHEM-SRC-T1A.md
Permission: `backend/src/db/ss1/subjects/chemistry.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/chem-src-t1a, push it, open a PR to master with 'CHEM-SRC-T1A' in its title and do not merge it. Report: whether CHEM-SRC-T1A is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Civic Education (`civic-education`)

- **Queue:** `docs/ss1/work/microtasks/civic-education/QUEUE.json`
- **Next runnable item:** `CIV-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Civic Education source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/06_WORKER_E_CIVIC_GOVERNMENT_DATA.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/CIVIC SSS1.docx` (SHA-256 `ee459b07229cc9ddea7b338c10fc4080261afdbceb2fe5d8765ef1ce520ce80a`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/civic-education.json`, `docs/ss1/work/microtasks/civic-education/QUEUE.json`, `docs/ss1/work/microtasks/civic-education/CIV-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/civic-education.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for CIV-SRC-T1</summary>

```text
TASK: SS1 Civic Education — QUEUE ITEM CIV-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/civic-education/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item CIV-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Civic Education source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug civic-education, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject (for example Government), record an explicit handoff open item; do not delete, merge into government or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/06_WORKER_E_CIVIC_GOVERNMENT_DATA.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/CIVIC SSS1.docx` (SHA-256 `ee459b07229cc9ddea7b338c10fc4080261afdbceb2fe5d8765ef1ce520ce80a`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/civic-education.json
- docs/ss1/work/microtasks/civic-education/QUEUE.json
- docs/ss1/work/microtasks/civic-education/CIV-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/civic-education.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/civ-src-t1, push it, open a PR to master with 'CIV-SRC-T1' in its title and do not merge it. Report: whether CIV-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Commerce (`commerce`)

- **Queue:** `docs/ss1/work/microtasks/commerce/QUEUE.json`
- **Next runnable item:** `COM-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Commerce source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 COMMERCE.doc` (SHA-256 `ba6b7fee7987713d60e598066f9f718d1ad042e38e09507a7980b087b577c42a`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/commerce.json`, `docs/ss1/work/microtasks/commerce/QUEUE.json`, `docs/ss1/work/microtasks/commerce/COM-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/commerce.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for COM-SRC-T1</summary>

```text
TASK: SS1 Commerce — QUEUE ITEM COM-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/commerce/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item COM-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Commerce source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug commerce, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject (for example Economics), record an explicit handoff open item; do not delete, merge into another business subject or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 COMMERCE.doc` (SHA-256 `ba6b7fee7987713d60e598066f9f718d1ad042e38e09507a7980b087b577c42a`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/commerce.json
- docs/ss1/work/microtasks/commerce/QUEUE.json
- docs/ss1/work/microtasks/commerce/COM-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/commerce.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/com-src-t1, push it, open a PR to master with 'COM-SRC-T1' in its title and do not merge it. Report: whether COM-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Data Processing (`data-processing`)

- **Queue:** `docs/ss1/work/microtasks/data-processing/QUEUE.json`
- **Next runnable item:** `DP-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Data Processing source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/06_WORKER_E_CIVIC_GOVERNMENT_DATA.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 DATA PROCESSING.docx` (SHA-256 `a74e8492e632dc43368c7fc49e34389ae034381d4da3617b78824998e29e854b`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/data-processing.json`, `docs/ss1/work/microtasks/data-processing/QUEUE.json`, `docs/ss1/work/microtasks/data-processing/DP-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/data-processing.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for DP-SRC-T1</summary>

```text
TASK: SS1 Data Processing — QUEUE ITEM DP-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/data-processing/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item DP-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Data Processing source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug data-processing, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject, record an explicit handoff open item; do not delete or silently reassign. Do not map Data Processing to Computer Studies or ICT: if the header supports such an alias, record an open item (an alias needs an approval_reference; do not invent it). The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/06_WORKER_E_CIVIC_GOVERNMENT_DATA.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 DATA PROCESSING.docx` (SHA-256 `a74e8492e632dc43368c7fc49e34389ae034381d4da3617b78824998e29e854b`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/data-processing.json
- docs/ss1/work/microtasks/data-processing/QUEUE.json
- docs/ss1/work/microtasks/data-processing/DP-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/data-processing.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/dp-src-t1, push it, open a PR to master with 'DP-SRC-T1' in its title and do not merge it. Report: whether DP-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Economics (`economics`)

- **Queue:** `docs/ss1/work/microtasks/economics/QUEUE.json`
- **Next runnable item:** `ECON-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Economics source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 ECONOMICS (1) (1).doc` (SHA-256 `8ad05c78b18edee3d6a011391d6ae057af457ab27f68a1ff05381d9c32e962bc`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/economics.json`, `docs/ss1/work/microtasks/economics/QUEUE.json`, `docs/ss1/work/microtasks/economics/ECON-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/economics.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for ECON-SRC-T1</summary>

```text
TASK: SS1 Economics — QUEUE ITEM ECON-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/economics/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item ECON-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Economics source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug economics, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject (for example Commerce), record an explicit handoff open item; do not delete, merge into another business subject or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 ECONOMICS (1) (1).doc` (SHA-256 `8ad05c78b18edee3d6a011391d6ae057af457ab27f68a1ff05381d9c32e962bc`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/economics.json
- docs/ss1/work/microtasks/economics/QUEUE.json
- docs/ss1/work/microtasks/economics/ECON-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/economics.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/econ-src-t1, push it, open a PR to master with 'ECON-SRC-T1' in its title and do not merge it. Report: whether ECON-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## English Language (`english`)

- **Queue:** `docs/ss1/work/microtasks/english/QUEUE.json`
- **Next runnable item:** `ENG-WK-T1-W02` — SOURCE_WEEK_INDEXING
- **Objective:** Index 1st Term Week 2 at objective level: list each scheme objective, bind it to exact source rows and/or supplements, and confirm each replacement's scope.
- **Required repository paths:** `backend/src/db/ss1/subjects/english.json`, `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/work/SS1-02/CHECKPOINT.md`, `docs/ss1/contracts/CONTRACT.md`, `docs/ss1/work/SS1-02/author_english.py`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 ENGLISH LANGUAGE.doc` (SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/english.json`, `docs/ss1/work/microtasks/english/QUEUE.json`
- **Prerequisites:** `ENG-SRC-T1` is IMPLEMENTED_TESTING_DEFERRED. All prerequisites are satisfied. Registration and the Week 1 indexing are complete on master; Week 2 is the next sequential indexing item. The English queue has no next_runnable field, so this choice was made here (see defects).

<details><summary>Copy-and-paste prompt for ENG-WK-T1-W02</summary>

```text
TASK: SS1 English Language — QUEUE ITEM ENG-WK-T1-W02 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/english/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item ENG-WK-T1-W02 (SOURCE_WEEK_INDEXING). Do not implement any other item, subject or week.

OBJECTIVE
Index 1st Term Week 2 at objective level: list each scheme objective, bind it to exact source rows and/or supplements, and confirm each replacement's scope.

COMPLETION CONDITION
Every objective of Week 2 has its own coverage entry with exact locator and evidence; scheme-table rows are classified; no PARTIAL/UNRESOLVED entry lacks an OPEN open item. No lesson is invented for unreviewed content: new lesson items are appended to the queue only after this indexing.

READ
- backend/src/db/ss1/subjects/english.json
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/work/SS1-02/CHECKPOINT.md
- docs/ss1/contracts/CONTRACT.md
- docs/ss1/work/SS1-02/author_english.py

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 ENGLISH LANGUAGE.doc` (SHA-256 `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/english.json
- docs/ss1/work/microtasks/english/QUEUE.json


RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/eng-wk-t1-w02, push it, open a PR to master with 'ENG-WK-T1-W02' in its title and do not merge it. Report: whether ENG-WK-T1-W02 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Financial Accounting (`financial-accounting`)

- **Queue:** `docs/ss1/work/microtasks/financial-accounting/QUEUE.json`
- **Next runnable item:** `FA-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Financial Accounting source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx` (SHA-256 `c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/financial-accounting.json`, `docs/ss1/work/microtasks/financial-accounting/QUEUE.json`, `docs/ss1/work/microtasks/financial-accounting/FA-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/financial-accounting.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for FA-SRC-T1</summary>

```text
TASK: SS1 Financial Accounting — QUEUE ITEM FA-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/financial-accounting/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item FA-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Financial Accounting source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug financial-accounting, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject (for example Bookkeeping), record an explicit handoff open item; do not delete, merge into bookkeeping or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/05_WORKER_D_BUSINESS.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 FINANCIAL ACCOUNT.docx` (SHA-256 `c6d4a1b32ff8eb5377f8e7f1014cccfc4345a706bbeb333131a5d50afa6a3edb`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/financial-accounting.json
- docs/ss1/work/microtasks/financial-accounting/QUEUE.json
- docs/ss1/work/microtasks/financial-accounting/FA-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/financial-accounting.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/fa-src-t1, push it, open a PR to master with 'FA-SRC-T1' in its title and do not merge it. Report: whether FA-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Food and Nutrition (`food-and-nutrition`)

- **Queue:** `docs/ss1/work/microtasks/food-and-nutrition/QUEUE.json`
- **Next runnable item:** `FN-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Food and Nutrition source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/07_WORKER_F_FOOD_CATERING.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/F _ N.docx` (SHA-256 `398b0e1f1383e88f7d71148253f8466fbfed95fefdca068907b5ba35083f4ff7`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/food-and-nutrition.json`, `docs/ss1/work/microtasks/food-and-nutrition/QUEUE.json`, `docs/ss1/work/microtasks/food-and-nutrition/FN-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/food-and-nutrition.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for FN-SRC-T1</summary>

```text
TASK: SS1 Food and Nutrition — QUEUE ITEM FN-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/food-and-nutrition/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item FN-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Food and Nutrition source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug food-and-nutrition, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject (for example Catering Craft), record an explicit handoff open item; do not delete, merge into catering-craft or silently reassign. If the header differs from the canonical subject only by an alias needing an approval_reference, record an open item; do not invent the reference. The filename variation between the terms ('F _ N' versus 'FOOD _ NUTRITION') is a candidate for source-backed aliasing only: record what the header shows, never discard a file. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/07_WORKER_F_FOOD_CATERING.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/F _ N.docx` (SHA-256 `398b0e1f1383e88f7d71148253f8466fbfed95fefdca068907b5ba35083f4ff7`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/food-and-nutrition.json
- docs/ss1/work/microtasks/food-and-nutrition/QUEUE.json
- docs/ss1/work/microtasks/food-and-nutrition/FN-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/food-and-nutrition.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/fn-src-t1, push it, open a PR to master with 'FN-SRC-T1' in its title and do not merge it. Report: whether FN-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## French (`french`)

- **Queue:** `docs/ss1/work/microtasks/french/QUEUE.json`
- **Next runnable item:** `FR-WK-T1-W01` — SOURCE_WEEK_INDEXING
- **Objective:** Index 1st Term Week 1 at objective level: list each scheme objective for the week, bind it to exact source rows and/or supplements with reproducible locators, and confirm the replacement's scope against every exercise in the row it displaces.
- **Required repository paths:** `backend/src/db/ss1/subjects/french.json`, `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/work/SS1-02/CHECKPOINT.md`, `docs/ss1/work/SS1-02/FRENCH_SOURCE_NOTES.md`, `docs/ss1/work/microtasks/french/QUEUE.json`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/FRENCH Ss1.docx` (SHA-256 `2bedee524a17700d40d81dc1df8d10f529b49d4a918f38a83914ce7b0c43e864`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/french.json`, `docs/ss1/work/microtasks/french/QUEUE.json`, `docs/ss1/work/microtasks/french/FR-WK-T1-W01.md`
- **Prerequisites:** `FR-SRC-T1` is IMPLEMENTED_TESTING_DEFERRED. All prerequisites are satisfied. All French registrations are implemented; this is the queue's own next_runnable.

<details><summary>Copy-and-paste prompt for FR-WK-T1-W01</summary>

```text
TASK: SS1 French — QUEUE ITEM FR-WK-T1-W01 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/french/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item FR-WK-T1-W01 (SOURCE_WEEK_INDEXING). Do not implement any other item, subject or week.

OBJECTIVE
Index 1st Term Week 1 at objective level: list each scheme objective for the week, bind it to exact source rows and/or supplements with reproducible locators, and confirm the replacement's scope against every exercise in the row it displaces.

COMPLETION CONDITION
Every objective of the week has its own coverage entry with exact locator and evidence; scheme rows are classified; any PARTIAL/UNRESOLVED entry has an OPEN open item and, where content is missing, a separate small PENDING queue item. No lesson is authored in this item. Original source must be read: attach the member listed in required_attachments.

READ
- backend/src/db/ss1/subjects/french.json
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/work/SS1-02/CHECKPOINT.md
- docs/ss1/work/SS1-02/FRENCH_SOURCE_NOTES.md
- docs/ss1/work/microtasks/french/QUEUE.json

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/FRENCH Ss1.docx` (SHA-256 `2bedee524a17700d40d81dc1df8d10f529b49d4a918f38a83914ce7b0c43e864`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/french.json
- docs/ss1/work/microtasks/french/QUEUE.json
- docs/ss1/work/microtasks/french/FR-WK-T1-W01.md


RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/fr-wk-t1-w01, push it, open a PR to master with 'FR-WK-T1-W01' in its title and do not merge it. Report: whether FR-WK-T1-W01 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Further Mathematics (`further-mathematics`)

- **Queue:** `docs/ss1/work/microtasks/further-mathematics/QUEUE.json`
- **Next runnable item:** `FM-PRE-T1` — SOURCE_PREAMBLE_INDEXING
- **Objective:** Inventory all 1st Term text outside the ten parsed week rows (header, scheme-of-work table, revision/examination lines, reference list, any cover or letterhead page) and record the scheme topic listed for each week 1-10 so the week items can bind objectives to it.
- **Required repository paths:** `backend/src/db/ss1/subjects/further-mathematics.json`, `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/work/SS1-03/CHECKPOINT.md`, `docs/ss1/work/SS1-03/evidence/parsed_rows.json`, `docs/ss1/work/microtasks/further-mathematics/QUEUE.json`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 FURTHER MATHEMATICS.doc` (SHA-256 `995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/further-mathematics.json`, `docs/ss1/work/microtasks/further-mathematics/QUEUE.json`, `docs/ss1/work/microtasks/further-mathematics/FM-PRE-T1.md`
- **Prerequisites:** `FM-SRC-T1` is IMPLEMENTED_TESTING_DEFERRED. All prerequisites are satisfied. Chosen over FM-INV-T3 because FM-PRE-T1 is the explicit dependency of all ten 1st Term week items and three FM-FACT/SCOPE items; both would write the same QUEUE.json, so FM-INV-T3 follows sequentially.

<details><summary>Copy-and-paste prompt for FM-PRE-T1</summary>

```text
TASK: SS1 Further Mathematics — QUEUE ITEM FM-PRE-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/further-mathematics/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item FM-PRE-T1 (SOURCE_PREAMBLE_INDEXING). Do not implement any other item, subject or week.

OBJECTIVE
Inventory all 1st Term text outside the ten parsed week rows (header, scheme-of-work table, revision/examination lines, reference list, any cover or letterhead page) and record the scheme topic listed for each week 1-10 so the week items can bind objectives to it. Re-read the header and record whether it verifies the subject.

COMPLETION CONDITION
Every non-week text block is hash-accounted and either mapped to coverage or recorded as an open item; the week-to-scheme-topic list is written to the FM-PRE note; header verification result (matches / differs) is recorded; any letterhead or vendor branding is listed for FM-VIS-T1-BRANDING handling (or recorded as absent for the 1st Term). No lesson is authored in this item.

READ
- backend/src/db/ss1/subjects/further-mathematics.json
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/work/SS1-03/CHECKPOINT.md
- docs/ss1/work/SS1-03/evidence/parsed_rows.json
- docs/ss1/work/microtasks/further-mathematics/QUEUE.json

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 FURTHER MATHEMATICS.doc` (SHA-256 `995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/further-mathematics.json
- docs/ss1/work/microtasks/further-mathematics/QUEUE.json
- docs/ss1/work/microtasks/further-mathematics/FM-PRE-T1.md


RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/fm-pre-t1, push it, open a PR to master with 'FM-PRE-T1' in its title and do not merge it. Report: whether FM-PRE-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Government (`government`)

- **Queue:** `docs/ss1/work/microtasks/government/QUEUE.json`
- **Next runnable item:** `GOV-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Government source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/06_WORKER_E_CIVIC_GOVERNMENT_DATA.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 GOVERNMENT.doc` (SHA-256 `50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/government.json`, `docs/ss1/work/microtasks/government/QUEUE.json`, `docs/ss1/work/microtasks/government/GOV-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/government.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for GOV-SRC-T1</summary>

```text
TASK: SS1 Government — QUEUE ITEM GOV-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/government/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item GOV-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Government source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug government, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject, record an explicit handoff open item; do not delete or silently reassign. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/06_WORKER_E_CIVIC_GOVERNMENT_DATA.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 GOVERNMENT.doc` (SHA-256 `50508a226b21bc5862b1f814d14a3d6bf2a56ff9d29867116931f5a7e58c9c1a`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/government.json
- docs/ss1/work/microtasks/government/QUEUE.json
- docs/ss1/work/microtasks/government/GOV-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/government.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/gov-src-t1, push it, open a PR to master with 'GOV-SRC-T1' in its title and do not merge it. Report: whether GOV-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Literature (`literature`)

- **Queue:** `docs/ss1/work/microtasks/literature/QUEUE.json`
- **Next runnable item:** `LIT-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Literature source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence).
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/IMPLEMENTATION_20261026/02_WORKER_A_LANGUAGES.md`, `docs/ss1/work/SS1-02/CHECKPOINT.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/LIT. IN ENGLISH.docx` (SHA-256 `732deed1d3e0c4e3c2218cde0d2e3fce1678f39c8730633b20af9fdc4d602dea`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/literature.json`, `docs/ss1/work/microtasks/literature/QUEUE.json`, `docs/ss1/work/microtasks/literature/LIT-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/literature.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for LIT-SRC-T1</summary>

```text
TASK: SS1 Literature — QUEUE ITEM LIT-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/literature/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item LIT-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Literature source: open the document, read its exact opening heading and teaching content, confirm the subject from the header (not from the filename), and add its sources[] entry (source_id, sha256, archive_member verbatim, term, canonical_subject, uniquely occurring header_text, header_evidence). PERMISSION: because no package exists, this item may create the minimum package under the existing contract (schema_version ss1-subject-v1, subject_slug literature, canonical_subject confirmed from the header, package_status PENDING, all other arrays empty) and register this one source in it.

COMPLETION CONDITION
Package file exists with the minimum envelope and this one registered source; no lessons, coverage, corrections or assets are invented. If the header names a different subject (for example English Language), record an explicit handoff open item; do not delete or silently reassign. The package stays PENDING; the 'source without coverage' blocker remains until indexing. Registration is not performed by the queue-building task.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/IMPLEMENTATION_20261026/02_WORKER_A_LANGUAGES.md
- docs/ss1/work/SS1-02/CHECKPOINT.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip (display name may be "SSS 1-20260507T072431Z-3-001 (1).zip"; the hash decides)` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/LIT. IN ENGLISH.docx` (SHA-256 `732deed1d3e0c4e3c2218cde0d2e3fce1678f39c8730633b20af9fdc4d602dea`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/literature.json
- docs/ss1/work/microtasks/literature/QUEUE.json
- docs/ss1/work/microtasks/literature/LIT-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/literature.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/lit-src-t1, push it, open a PR to master with 'LIT-SRC-T1' in its title and do not merge it. Report: whether LIT-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Mathematics (`mathematics`)

- **Queue:** `docs/ss1/work/microtasks/mathematics/QUEUE.json`
- **Next runnable item:** `MATH-FACT-HEADER-T1` — FACTUAL_DEPENDENCY
- **Objective:** Verify against the original 1st Term document the exact header/title text, class line and subject wording recorded in mathematics.json, and record whether it names Mathematics (and not Further Mathematics or another subject).
- **Required repository paths:** `backend/src/db/ss1/subjects/mathematics.json`, `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/work/SS1-03/CHECKPOINT.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001 (1).zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/MATHss1.docx` (SHA-256 `d8cd49545976d4d35687bb7a8efc93cf387489bf190e00b20f981c9592e671cb`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/mathematics.json`, `docs/ss1/work/microtasks/mathematics/QUEUE.json`, `docs/ss1/work/microtasks/mathematics/MATH-FACT-HEADER-T1.md`
- **Prerequisites:** `MATH-SRC-T1` is IMPLEMENTED_TESTING_DEFERRED. All prerequisites are satisfied. All three Mathematics registrations are already implemented; this header verification is the first-listed runnable item and the source-identity check that precedes objective indexing. MATH-FACT-HEADER-T2/T3 and the MATH-PORT items all edit mathematics.json or the same QUEUE.json, so they follow sequentially.

<details><summary>Copy-and-paste prompt for MATH-FACT-HEADER-T1</summary>

```text
TASK: SS1 Mathematics — QUEUE ITEM MATH-FACT-HEADER-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/mathematics/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item MATH-FACT-HEADER-T1 (FACTUAL_DEPENDENCY). Do not implement any other item, subject or week.

OBJECTIVE
Verify against the original 1st Term document the exact header/title text, class line and subject wording recorded in mathematics.json, and record whether it names Mathematics (and not Further Mathematics or another subject). Inspection of the document only; no owner decision is needed for what the header says.

COMPLETION CONDITION
Exact header lines (verbatim, short) and their locator recorded in the item note and in the source's header_evidence where they differ; any mismatch with Mathematics recorded as an open item and reported. The alias approval_reference is NOT changed here (see MATH-APPROVAL-ALIASES).

READ
- backend/src/db/ss1/subjects/mathematics.json
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/work/SS1-03/CHECKPOINT.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001 (1).zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/MATHss1.docx` (SHA-256 `d8cd49545976d4d35687bb7a8efc93cf387489bf190e00b20f981c9592e671cb`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/mathematics.json
- docs/ss1/work/microtasks/mathematics/QUEUE.json
- docs/ss1/work/microtasks/mathematics/MATH-FACT-HEADER-T1.md


RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/math-fact-header-t1, push it, open a PR to master with 'MATH-FACT-HEADER-T1' in its title and do not merge it. Report: whether MATH-FACT-HEADER-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Physics (`physics`)

- **Queue:** `docs/ss1/work/microtasks/physics/QUEUE.json`
- **Next runnable item:** `PHYS-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Physics source with manifest hash, member, term, canonical subject and verified header_text/header_evidence read from the original document.
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/subjects/README.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001 (1).zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 PHYSICS.doc` (SHA-256 `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/physics.json`, `docs/ss1/work/microtasks/physics/QUEUE.json`, `docs/ss1/work/microtasks/physics/PHYS-SRC-T1.md` Permission: `backend/src/db/ss1/subjects/physics.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty. Registration first. PHYS-CMP-D4-NOTES is also runnable but writes the same QUEUE.json, so it follows sequentially.

<details><summary>Copy-and-paste prompt for PHYS-SRC-T1</summary>

```text
TASK: SS1 Physics — QUEUE ITEM PHYS-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/physics/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item PHYS-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Physics source with manifest hash, member, term, canonical subject and verified header_text/header_evidence read from the original document. Create the minimum package first (see completion condition).

COMPLETION CONDITION
Source entry added with sha256, archive_member and term equal to the CSV row, canonical_subject from the document, exact uniquely occurring header_text and a reproducible header_evidence locator; if the document names no subject, record that fact and a source_alias need as an open item rather than guessing. PERMISSION TO CREATE THE MINIMUM PACKAGE: because no physics.json exists on master, this item may create backend/src/db/ss1/subjects/physics.json containing only the envelope (schema_version ss1-subject-v1, subject_slug physics, canonical_subject confirmed from the document, package_status PENDING), this source entry, and empty arrays for every other required section. Nothing else may be authored in it. Do not author lessons, rules or coverage here.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/subjects/README.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001 (1).zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/1ST TERM S1 PHYSICS.doc` (SHA-256 `cb61f336ac93a3fbbb820d6c9b4adc0703e7363aff7659b7953a75bdb92f2206`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/physics.json
- docs/ss1/work/microtasks/physics/QUEUE.json
- docs/ss1/work/microtasks/physics/PHYS-SRC-T1.md
Permission: `backend/src/db/ss1/subjects/physics.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/phys-src-t1, push it, open a PR to master with 'PHYS-SRC-T1' in its title and do not merge it. Report: whether PHYS-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Technical Drawing (`technical-drawing`)

- **Queue:** `docs/ss1/work/microtasks/technical-drawing/QUEUE.json`
- **Next runnable item:** `TD-SRC-T2` — SOURCE_REGISTRATION
- **Objective:** Register the 2nd Term Technical Drawing source with manifest hash, member, term, canonical subject and verified header_text/header_evidence read from the original document, creating the minimum package.
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/subjects/README.md`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001 (1).zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx` (SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/technical-drawing.json`, `docs/ss1/work/microtasks/technical-drawing/QUEUE.json`, `docs/ss1/work/microtasks/technical-drawing/TD-SRC-T2.md` Permission: `backend/src/db/ss1/subjects/technical-drawing.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for TD-SRC-T2</summary>

```text
TASK: SS1 Technical Drawing — QUEUE ITEM TD-SRC-T2 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/technical-drawing/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item TD-SRC-T2 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 2nd Term Technical Drawing source with manifest hash, member, term, canonical subject and verified header_text/header_evidence read from the original document, creating the minimum package.

COMPLETION CONDITION
Source entry added with sha256, archive_member and term equal to the CSV row, canonical_subject from the document, exact uniquely occurring header_text and a reproducible header_evidence locator; if the document names no subject, record that and any source_alias need as an open item without guessing. PERMISSION TO CREATE THE MINIMUM PACKAGE: because no technical-drawing.json exists on master, this item may create backend/src/db/ss1/subjects/technical-drawing.json containing only the envelope (schema_version ss1-subject-v1, subject_slug technical-drawing, canonical_subject confirmed from the document, package_status PENDING), this source entry, and empty arrays for every other required section. Nothing else may be authored in it.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/subjects/README.md

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001 (1).zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/2nd Term SS1_/2ND TERM S1 TECHNICAL DRAWING.docx` (SHA-256 `69198ac66432c31717d084b8a736741065119b14b1622c2f494c8575294e095d`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/technical-drawing.json
- docs/ss1/work/microtasks/technical-drawing/QUEUE.json
- docs/ss1/work/microtasks/technical-drawing/TD-SRC-T2.md
Permission: `backend/src/db/ss1/subjects/technical-drawing.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/td-src-t2, push it, open a PR to master with 'TD-SRC-T2' in its title and do not merge it. Report: whether TD-SRC-T2 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Yoruba (`yoruba`)

- **Queue:** `docs/ss1/work/microtasks/yoruba/QUEUE.json`
- **Next runnable item:** `YO-SRC-T1` — SOURCE_REGISTRATION
- **Objective:** Register the 1st Term Yoruba source in the Yoruba package, creating the minimum package because none exists: header-verified source entry (and source_alias rule only if the heading requires it) plus the blocking open item YORUBA-OBJECTIVE-INDEXING.
- **Required repository paths:** `docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv`, `docs/ss1/contracts/CONTRACT.md`, `backend/src/db/ss1/subjectPackageSchema.ts`, `backend/src/db/ss1/compiler.ts`, `docs/ss1/work/SS1-02/CHECKPOINT.md`, `docs/ss1/work/SS1-02/author_packages.py`, `docs/ss1/work/SS1-02/extract_sources.cjs`, `scripts/ss1/prepare_sources.py`, `docs/ss1/work/microtasks/yoruba/QUEUE.json`
- **Required attachment(s):**
  - archive `SSS 1-20260507T072431Z-3-001.zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/YORUBA.docx` (SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef`)
- **Allowed write paths:** `backend/src/db/ss1/subjects/yoruba.json`, `docs/ss1/work/microtasks/yoruba/QUEUE.json` Permission: `backend/src/db/ss1/subjects/yoruba.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.
- **Prerequisites:** No dependencies in the queue; `depends_on` is empty.

<details><summary>Copy-and-paste prompt for YO-SRC-T1</summary>

```text
TASK: SS1 Yoruba — QUEUE ITEM YO-SRC-T1 ONLY

Repository: PDS-David/sts-school-app
Start from: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)
Queue: docs/ss1/work/microtasks/yoruba/QUEUE.json (read its QUEUE_BUILD.md too if present). Implement ONLY item YO-SRC-T1 (SOURCE_REGISTRATION). Do not implement any other item, subject or week.

OBJECTIVE
Register the 1st Term Yoruba source in the Yoruba package, creating the minimum package because none exists: header-verified source entry (and source_alias rule only if the heading requires it) plus the blocking open item YORUBA-OBJECTIVE-INDEXING.

COMPLETION CONDITION
PERMISSION: yoruba.json (an allowed write path) does not exist on master and this item is explicitly permitted to CREATE it, using only the existing ss1-subject-v1 contract and no other file. Done when yoruba.json exists and is schema-valid by inspection: schema_version ss1-subject-v1, subject_slug yoruba, canonical_subject confirmed from the document, package_status PENDING, sources contains exactly this source with archive_member/sha256/term equal to the CSV row, lessons/delivery_corrections/assets/coverage empty, and one open item YORUBA-OBJECTIVE-INDEXING (kind CONTENT, blocks_delivery true, affected_ids = registered source IDs, required_action pointing to the YO-INV items). Archive and member SHA-256 verified before reading. Open the member, read its exact opening heading and record it as sources[].header_text (exact, uniquely occurring in the unmodified extracted text; follow the convention in author_packages.py source()). Confirm canonical_subject from that heading ('Yoruba' is only the name author_packages.py uses for the slug, not evidence). If the heading differs from canonical_subject beyond case/whitespace (for example by Yoruba diacritics), add a source_alias rule with a unique exact anchor and honest evidence; approval_reference must state only that the assigned-subject mapping is supported by this heading, not teacher approval. If the heading shows a different subject, do NOT register: record the specific discrepancy as a FACT open item/queue note and stop. Also record whether Yoruba diacritics/subdots survive the extraction unchanged (no normalisation of anchors or text). Do not author lessons, coverage, approval or verification. Do not run tests, typechecks, importer or database. Testing deferred by owner.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- backend/src/db/ss1/compiler.ts
- docs/ss1/work/SS1-02/CHECKPOINT.md
- docs/ss1/work/SS1-02/author_packages.py
- docs/ss1/work/SS1-02/extract_sources.cjs
- scripts/ss1/prepare_sources.py
- docs/ss1/work/microtasks/yoruba/QUEUE.json

ATTACHMENT (verify hashes before reading; do not commit the archive, source text, extracts or renders)
  - archive `SSS 1-20260507T072431Z-3-001.zip` (SHA-256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`; a `(1)` display name is fine if the hash matches) → member `SSS 1/1st Term SS1_/YORUBA.docx` (SHA-256 `7403d8243ee646a221bb3d92fe18d202c73be0bde4deb10fa68a3dec0b4a6aef`)
If the attachment is unavailable, report the exact missing filename and stop; do not infer source content.

ALLOWED WRITE PATHS (nothing else)
- backend/src/db/ss1/subjects/yoruba.json
- docs/ss1/work/microtasks/yoruba/QUEUE.json
Permission: `backend/src/db/ss1/subjects/yoruba.json` does not exist and this item is explicitly permitted to create it as the minimum package under the existing contract.

RULES
- Use master's existing foundation and schema; do not use PR71. No schema or compiler changes.
- Update the item's status honestly in QUEUE.json (IMPLEMENTED_TESTING_DEFERRED only when its completion condition is met), refresh counts, and set next_runnable consistently.
- No invented content, approval or certification. Tests, typechecks, importer runs, database operations and device checks are deferred by the owner: do not run them.
- Do not request or accept a token in chat.

DELIVERY
Commit to a new branch ss1/yo-src-t1, push it, open a PR to master with 'YO-SRC-T1' in its title and do not merge it. Report: whether YO-SRC-T1 is complete or specifically blocked, files changed, commit and PR URL, remaining items identified, and 'Testing deferred by owner.' Then STOP.
```
</details>

## Geography (`geography`) — queue missing

- **Queue path:** none yet (`docs/ss1/work/microtasks/geography/QUEUE.json` to be created).
- **Next item:** `GEO-QUEUE-BUILD` — queue creation (not a queue item): build the Geography queue.
- **Required repository paths / attachment:** see prompt; no attachment required.
- **Allowed write paths:** `docs/ss1/work/microtasks/geography/QUEUE.json`, `docs/ss1/work/microtasks/geography/QUEUE_BUILD.md`
- **Prerequisites:** none; no geography PR or branch exists. Geography sources: three (1st, 2nd, 3rd Term), all registered in the CSV and `sourceRegistry.json`.

<details><summary>Copy-and-paste prompt for GEO-QUEUE-BUILD</summary>

```text
TASK: SS1 SUBJECT QUEUE — ONE SUBJECT ONLY (GEOGRAPHY)

SUBJECT_SLUG = geography
Repository: PDS-David/sts-school-app
Base: latest origin/master (integration review master was 881a214e08cf5fee1c783d507c86e8679bcaa62e)

MISSION
Create the repository-grounded work queue for this ONE subject. Documentation only. Do not implement curriculum or process other subjects. No geography queue, package, PR or branch exists.

READ
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv, docs/ss1/contracts/CONTRACT.md, backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/04_WORKER_C_SCIENCE_AGRICULTURE_GEOGRAPHY.md
- docs/ss1/work/microtasks/yoruba/QUEUE.json and QUEUE_BUILD.md (structural conventions for a subject with no package and unknown weeks; copy structure, not content)
- docs/ss1/work/FOUNDATION_RECONCILIATION.md
- Any docs/ss1/work/ checkpoint or notes mentioning Geography (static inspection only)

SOURCES (from SOURCE_ASSIGNMENTS.csv; verify against the file)
- SS1-SRC-1c1c1bdcecb4 | 1st Term | SSS 1/1st Term SS1_/1ST TERM S1 GEOGRAPHY.doc | 4220757cb96c6d6ac5153f7a862b45725a7d87c8e64be5b11ec39a843ca1491c | 1163776 bytes
- SS1-SRC-ba9dee61c27c | 2nd Term | SSS 1/2nd Term SS1_/2ND TERM S1 GEOGRAPHY.doc | fa120c0e9f2f7a47df2c775afdfe049b41ab2acb1972c1457b31c85e70b3a2e5 | 239616 bytes
- SS1-SRC-74a10d374306 | 3rd Term | SSS 1/3rd Term SS1_/3RD TERM S1 GEOGRAPHY.doc | 54931bac00bfde6b2ff5d32e2b645872af74dc32d8e0f69d0585f40e443726c6 | 200192 bytes
Archive: SSS 1-20260507T072431Z-3-001.zip, SHA-256 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e (a '(1)' display name is fine if the hash matches). No attachment is needed for this task; originals are inputs to the future items.

BUILD
- One SOURCE_REGISTRATION item per document; the first may create backend/src/db/ss1/subjects/geography.json as the minimum package (state that permission in its allowed paths and completion condition). Registration reads the document header; all three rows are FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER.
- Week inventory is unknown: one SOURCE_WEEK_INVENTORY item per document, not invented weeks.
- Exactly the item fields used by the Yoruba queue: id, kind, source_id, term, week_or_locator, objective, required_files, required_attachments (member + SHA-256), allowed_write_paths, depends_on (real IDs, no cycles), status (honest), implementation_reference, completion_condition. Add counts, status_counts, notes, review and next_runnable.
- No lesson-writing, correction or asset items unless repository evidence names a specific need. Tests stay deferred by owner.

ALLOWED WRITE PATHS (only)
- docs/ss1/work/microtasks/geography/QUEUE.json
- docs/ss1/work/microtasks/geography/QUEUE_BUILD.md

CHECKS
JSON syntax, unique IDs, dependency references, cycles, totals, hashes against the CSV, final diff. Do not run tests, typechecks, importer, database or device checks.

DELIVERY
Commit to branch ss1/geography-queue, push, open a PR to master (do not merge). QUEUE_BUILD.md states reviewed master SHA, existing work recognised (none expected), evidence limitations, totals, exact next runnable task ID and its attachments. Report the PR, task counts and next runnable item. Never request a token in chat. Then STOP.
```
</details>

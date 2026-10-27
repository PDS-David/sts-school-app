# YO-SRC-T2 — Yoruba

```text
Execute YO-SRC-T2 ONLY for SS1 Yoruba.
Repository: PDS-David/sts-school-app
Subject slug: yoruba
Start from latest origin/master. Reviewed base was d016a10730dac538589e42009ca749de1f9dd4aa.

START
Read applicable AGENTS.md. Fetch master and inspect open PRs for this task. Use an isolated branch/worktree. If this exact item is already complete on master, report the evidence and stop; do not repeat it or silently select another item. If an open PR owns it, do not overwrite that worker.

QUEUE
docs/ss1/work/microtasks/yoruba/QUEUE.json
Prerequisites: YO-SRC-T1.
Confirm each prerequisite's implementation is complete, without treating deferred verification as passed.

OBJECTIVE
Register the 2nd Term Yoruba source in yoruba.json with a header-verified source entry (and source_alias rule only if its heading requires it).

EXISTING EVIDENCE
backend/src/db/ss1/sourceRegistry.json and docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv both list SS1-SRC-ec4a5095420d with member 'SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx', sha256 73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac, 66197 bytes, term '2nd Term', slug 'yoruba', worker A, mapping_status FILENAME_ASSIGNMENT_VERIFY_DOCUMENT_HEADER (the two copies were compared statically and are equal). This is REGISTERED METADATA ONLY: the document heading has not been recorded as verified in the repository. Depends on YO-SRC-T1 only because that item creates yoruba.json. If YO-SRC-T2 and YO-SRC-T3 are run concurrently they edit the same file: rebase, do not overwrite the other's source entry.

COMPLETION CONDITION
Archive and member SHA-256 verified. A single sources[] entry for this source is added with fields equal to the CSV row; the open item YORUBA-OBJECTIVE-INDEXING affected_ids gains this source ID. Open the member, read its exact opening heading and record it as sources[].header_text (exact, uniquely occurring in the unmodified extracted text; follow the convention in author_packages.py source()). Confirm canonical_subject from that heading ('Yoruba' is only the name author_packages.py uses for the slug, not evidence). If the heading differs from canonical_subject beyond case/whitespace (for example by Yoruba diacritics), add a source_alias rule with a unique exact anchor and honest evidence; approval_reference must state only that the assigned-subject mapping is supported by this heading, not teacher approval. If the heading shows a different subject, do NOT register: record the specific discrepancy as a FACT open item/queue note and stop. Also record whether Yoruba diacritics/subdots survive the extraction unchanged (no normalisation of anchors or text). Do not repeat T1 registration, author lessons or invent approval. Testing deferred by owner.


ATTACH ONLY THIS ORIGINAL DOCUMENT
Filename: 2ND TERM S1 YORUBA.docx
Term: 2nd Term
Manifest source ID: SS1-SRC-ec4a5095420d
Manifest archive member: SSS 1/2nd Term SS1_/2ND TERM S1 YORUBA.docx
SHA-256: 73bfb9760a678e113e9a44c4d5073c5d59eb463d0846e384483726fc94bcc9ac

A standalone original matching this member hash is AUTHORISED and sufficient. Do NOT ask for the full ZIP or require its folder structure. Hash before conversion; render/extract a separate private working copy. A member extracted from another enclosing ZIP is equally acceptable if its exact bytes match this SHA-256. Record the actual supplied container and whether its hash was checked; never claim a composite hash check not performed. Keep archive_member in the package exactly as the manifest.
If the complete composite ZIP is supplied instead, expected SHA-256 is 024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e. If the document hash differs, report the exact mismatch and do not substitute by name or size.

READ
- docs/ss1/work/microtasks/yoruba/QUEUE.json
- docs/ss1/contracts/CONTRACT.md
- backend/src/db/ss1/subjectPackageSchema.ts
- docs/ss1/IMPLEMENTATION_20261026/SOURCE_ASSIGNMENTS.csv
- backend/src/db/ss1/compiler.ts
- docs/ss1/work/SS1-02/CHECKPOINT.md
- docs/ss1/work/SS1-02/author_packages.py
- docs/ss1/work/SS1-02/extract_sources.cjs
- scripts/ss1/prepare_sources.py
- backend/src/db/ss1/subjects/yoruba.json
Read the subject QUEUE_BUILD.md and relevant task notes where available. They are historical evidence; latest QUEUE.json and this assignment govern current scope. Reuse completed reviews; inspect originals only as needed for this exact task.

ALLOWED WRITE PATHS
- backend/src/db/ss1/subjects/yoruba.json
- docs/ss1/work/microtasks/yoruba/QUEUE.json
- docs/ss1/work/microtasks/yoruba/YO-SRC-T2.md
The task note is explicitly authorised even if absent from the original item's list. No other subject, shared schema/compiler/importer, UI or JSS3 changes. Do not overwrite an existing package; preserve unrelated entries and stable IDs. If a required representation is unsupported, record the exact foundation dependency rather than adding unknown fields.

IMPLEMENT
- For source registration, add ONLY this source to the existing package with its exact header, manifest identity and evidence. Inspect the document; never infer the subject solely from its filename. Keep package PENDING. Record genuine ambiguity; never fabricate alias approval or release existing holds.
- For indexing, implement objective-level coverage using exact evidence and existing identities. Add separate small pending tasks for demonstrated gaps; do not author those follow-ups in this run.
- For lesson authoring, implement teaching, examples, objectives, original practice, answers, marking breakdown, exact body hash and provenance under the existing contract. Marks must sum correctly. Content approval remains PENDING; implementation may be IMPLEMENTED; verification remains DEFERRED with no invented references. Citations do not by themselves grant copying rights.
- For header verification, inspect only the assigned heading and update exact evidence where required; do not audit the whole term.
- Existing source rows remain unchanged. Do not guess parser-generated hashes or activate whole-row corrections whose complete teaching scope is unresolved.
- Pure source extraction/rendering is allowed. No tests, typechecks, importer/plan runs, database operations, device checks, deployment or production import. Check hashes, JSON syntax, references and diff only. Testing deferred by owner.
- Do not commit original documents, full extracts, private renders or credentials.

FINISH
Update this queue item honestly; record unresolved dependencies rather than declaring the subject complete. Recompute counts and next_runnable. Write a short task note with source hash, method/locators, changes and remaining work. Do not edit other subjects or shared NEXT_ASSIGNMENTS.md.

DELIVERY
Commit and push a unique subject/item branch; open a PR to master with YO-SRC-T2 in its title. Do not merge. If push access is unavailable, supply a downloadable binary-capable patch with its exact base SHA. Do not request a token in chat.
Report completion or precise blocker, files changed, commit/PR or patch, next eligible item and "Testing deferred by owner." Stop after this ONE item.
```

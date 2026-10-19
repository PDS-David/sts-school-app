# JSS3 remaining work — executable agent prompts

Issued 19 October 2026 after reviewing master through c2d1c2f and the follow-up correction in this directory. These are separate tasks, not permission to begin every batch. The owner chooses the next prompt/batch. Do not restart F or replace already merged G1–G4 work.

## Common instructions — include with every prompt

Repository: PDS-David/sts-school-app, default branch `master` (not `main`). Read any AGENTS.md, `docs/jss3/completion/REVIEW.md`, `docs/jss3/batch2-close/F_INTEGRATION/REMAINING_GAPS.csv` and your task-specific files. Fetch current master, record its full SHA and work in an isolated branch/worktree. Never assume the issue is unchanged since this document. Check the current implementation first.

Preserve all 313 original JSS3 rows and the existing supplement IDs, source provenance, delivery corrections, asset bytes, holds and other agents' changes. Current supplemented plan has 162 supplements and 475 total rows (230 First, 245 Second, zero Third). These are observed baselines, not targets to force. No JSS3 Computer Studies; substantive teaching ends in Second Term. Third Term is exclusively examination preparation/revision/feedback/reassessment. Other classes must remain unchanged. Owner authorises properly attributed internet-equivalent teaching; never label newly composed material as recovered source text. Never invent school decisions, prescribed titles, missing phonetic symbols, traditional verses, source geometry or certification. Do not claim a green test suite is curriculum certification.

Required input for any corpus-dependent task: **JSS3_NEXT_STAGE_INPUTS_20261016.zip**, containing `ALL/`, `SOURCE_INVENTORY.csv` and `scheme_only_integration_manifest.csv`. Validate all 39 document hashes. Keep the original Music RTF outside the importer roots; use the supplied Music DOCX under its inventoried filename inside ALL. If the ZIP's ALL includes extra files, stage only the 39 inventoried documents into a separate clean root. Do not commit private curriculum documents or complete row dumps to GitHub.

Use Node 24.19.0 and the repository lockfile (`npm ci --ignore-scripts`). Run `scripts/jss3/capture_rows.py` before/after substantive changes. Run `scripts/jss3/verify_handoff.py --inputs <clean-inputs> --output <evidence>` with the real-source variables and capture variables required by the tests. Use `--tsx-no-ipc` only if sandbox IPC fails and record the reason. For database tests use an isolated local PostgreSQL database and the explicit test variables from the test files; never production credentials. Report skips and missing inputs. Preserve original row identities and bodies against the before capture, not just totals. Update generated hashes/records with repository generators when bodies change. Do not re-pin tests merely to match output.

Produce code/assets/tests plus a short report, commands, environment, source hashes, before/after identity checks and an exact remaining-issues list. Save a checkpoint early. Commit tested work and publish your branch. If GitHub is unavailable, provide a binary-capable patch, git bundle and checksummed ZIP including the exact base SHA and apply instructions; never depend on an unpushed commit being fetchable.

Master publication is authorised for completed, verified work. Before updating master, fetch again, reconcile concurrent changes in a separate integration tree, rerun affected checks and the full-source gate for content changes, and use a fast-forward or expected-SHA update. Never force-push, replace the current supplements file with an old copy, or overwrite another agent's registers. Parallel workers publish isolated branches; integrate their deliveries one at a time. No production deployment, schema application, import, asset attachment or data cleanup is authorised by these prompts. Prepare and present the concrete plan for separate owner approval.

## Prompt V1 — Business Studies visual recovery and usable account layouts

Execute this prompt only when assigned. Read G4_VISUAL/FINDINGS.md and DRAWN_OBJECT_INVENTORY.csv; the 555 entries are individual objects, not 555 missing lessons. Your owned scope is Business Studies only.

Inputs: repository + JSS3_NEXT_STAGE_INPUTS_20261016.zip. Exact originals inside ALL:
- `JSS3 1ST TERM /BUSINESS STUDIES_1.docx`
- `JSS3 2ND TERM /business_studies JSS3.docx`
- `JSS3 3RD TERM /BUSINESS STUDIES FOR JSS3.docx` for cross-term context.

Render and inspect complete accounting examples, including First-Term double entry/trial balance and Second-Term trading/profit-and-loss accounts. Match each figure to source paragraph/table/drawing IDs and the actual executable row (source hash + term/week/title). Review source table structure as well as drawings; do not treat line objects as separate illustrations. Confirm debit/credit sides, labels, balances and all instructional numbers. Distinguish original errors from extraction loss.

Implement recovery into the existing authenticated topic-assets path: source-faithful legible images with source hashes, captions and descriptive alt text; stable identity resolved to the captured destination with title/hash guards. Preserve raw source rows. Where a source error needs correction, use the established delivery-correction mechanism and sourced replacement teaching; retain the original for audit. Do not just inventory or package pictures. Verify manifests resolve to the intended rows and learners can retrieve the bytes through the route. Test complete worked examples and answer keys, wrong-row rejection, missing asset and metadata drift. Do not touch other subject assets. Publish under `docs/jss3/completion/V1_BUSINESS/` plus implementation files. Register every inspected occurrence as instructional/recovered, already delivered, decorative or unresolved with evidence. Stop only genuinely unresolvable items, not the entire task.

## Prompt V2 — Mathematics visual and equation fidelity

Inputs: repository + the same input ZIP. Exact originals:
- `JSS3 1ST TERM /JSS 3 MATHEMATICS.docx`
- `JSS3 2ND TERM /BASIC 9 MATHEMATICS E-NOTE.docx`

Read G4 inventory, OB-14/18/21 and A_MATH_TECH_BUSINESS delivery. Preserve the equation-recovery and corrected-data work already on master. Inspect binary division ladders, pictograms, tally/frequency tables, triangles, bearings, compass diagrams, labels and superscripts/subscripts. Group related shapes into complete figures. Reconcile source → extracted body → correction/supplement → displayed asset. Recover only missing instructional visuals, preserve source geometry and document any source ambiguity. Do not infer a dimension, dataset or symbol just to finish a calculation.

Implement missing assets and any supported delivery corrections with complete worked solutions, exercise answers, accessible descriptions and stable bindings. Add tests for figure/lesson identity, authentic numerical labels, meaningful solution correctness and unchanged original rows. Record textbook-only exercises separately: require the actual authorised exercise or write an explicitly labelled equivalent that covers the objective; never fabricate a textbook page. Deliver under `docs/jss3/completion/V2_MATH/`. School-dependent T formula, disputed source angles and other INFERRED readings remain explicit until supported.

## Prompt V3 — Basic Science visuals and Basic Technology reconciliation

Inputs: repository + the same ZIP. Exact originals:
- `JSS3 1ST TERM /BASIC SCIENCE.docx`
- `JSS3 2ND TERM /Basic science.docx`
- `JSS3 3RD TERM /Basic science.docx`
- `JSS3 3RD TERM /BASIC TECH.docx`
Use the inventory to identify any additional Basic Technology source documents; list their exact staged paths before reviewing them.

Inspect genetics/Mendel crosses, light-ray/reflection/refraction diagrams and every other instructional figure in this scope. Resolve tables, arrows and text boxes together. For Basic Technology first compare existing `curriculum-assets/jss3` manifests and source mappings; preserve original GIF animation and avoid duplicating the 12 recovered content illustrations. Decorative Wikipedia icons and ActiveX placeholders are not new lessons. Confirm the complete atom diagram is delivered rather than its clipped page rendering.

Recover missing visuals into the actual asset-delivery path, with accessible alt text and row binding tests. Keep G1 science/health corrections intact. Do not repeat medical teaching from a superseded original merely because it is in a diagram. Verify science labels/relationships against reliable sources when correcting errors. Publish evidence and implementation under `docs/jss3/completion/V3_SCIENCE/`. This task does not authorise unsafe practical demonstrations or certify performance.

V1–V3 can run concurrently because their subject assets and delivery folders differ. Each produces declarative additions for shared records; the integration agent merges those additions rather than replacing whole shared files.

## Prompt L — close source/permission gaps that evidence can settle

Read SCHOOL_DECISIONS_REQUIRED.md, G2_REVIEW/SOURCE_CHECKS.json, G3_D_VERIFICATION/REPORT.md and RG-10/14/16–24. Work from current master. Inputs: repository + input ZIP; ask for the following only if unavailable:
- actual school Yoruba and English prescribed books (title, author, edition and authorised access), or explicit named stand-in decisions;
- actual previous-term French examination paper and mark scheme for SL-281 (no filename has yet been supplied);
- school project guidelines (no filename yet supplied);
- written answers to SCHOOL_DECISIONS_REQUIRED.md and G4's SL-559 questions, where evidence remains ambiguous.

Do all independently resolvable work before asking the owner. For NOUN, retrieve the exact ENG105_02.pdf URL already in SOURCE_CHECKS.json; preserve its cover/logo and attribution requirements, implement accessible lesson asset binding, and verify display. Do not ask the owner to supply a PDF already publicly available. Document applicable reuse terms accurately; do not assume permission to redistribute unrelated third-party text. For missing Ṣàngó/Ọya/egúngún texts investigate authenticated, lawfully reusable sources, including the unexamined Johnson lead. An accessible web copy is not evidence of reuse permission. Do not invent or silently modernise traditional verse; verify line/tone/translation and attribution. If no suitable text is established, report exactly what is needed.

Implement supported teaching, questions, marking guides and correction records. A title choice, permission or profile alone does not close objective coverage. For G3's remaining economic figures obtain the underlying NBS table or retain dated, clearly attributed secondary evidence; do not turn uncertain current policy into settled law. Teacher proofreading and practical observations remain separate. Output a compact decision sheet containing only irreducible school choices, with gap ID, exact source, alternatives supported by evidence, impact, and required follow-through. Update statuses only after implementation verification. Publish under `docs/jss3/completion/L_SOURCES/` and the actual lesson files.

## Prompt S — implement teaching sequence safely (Batch 3)

Start only after the owner explicitly starts Batch 3. Read `docs/jss3/replacements/TEACHING_SEQUENCE.md` as historical analysis and regenerate the current schedule (it is no longer 41 supplements). Input: repository + input ZIP + any documented owner week-placement decisions. Use current capture, not stale order numbers.

Implement a separate stable lesson scheduling layer for display and progression, or an equivalent design that preserves existing topic IDs, source order_index, asset associations and completion history. Do not renumber originals in place. Put substantive supplements before the relevant assessment/revision markers in First/Second Term. Do not invent an exact source week where none exists: identify necessary placement decisions. Define behaviour for returning students, completed topics, newly inserted prerequisites and corrections. No completed student work may silently disappear or become permanently locked.

Prepare an additive, reversible migration and dry-run plan; do not apply it to production. Cover topic listing, next-topic resolution, unlock/completion routes, source import idempotency, asset resolution and other classes with tests. Verify on an isolated database with representative existing students/completions. Present concrete unresolved placement choices, implement all settled buckets, and publish code plus migration/runbook. Do not confuse a teacher-only schedule CSV with a working student progression fix.

## Prompt H — integrate, verify and prepare the controlled release

Run after the assigned V/L/S deliveries are available. Inputs: current repo, the same 39-source ZIP, each unpublished worker patch/bundle if not on a remote branch, and a protected-row baseline. The protected baseline must be an actual export of the 2,179 certified Primary/JSS1/JSS2 rows with stable identity and full content, or the original source set and certified output. No verified filename exists yet; request the real file, do not pretend a count is a baseline. Primary/JSS1/JSS2 ZIPs alone do not prove the identity of a historical export.

Merge reviewed branches one at a time onto latest master; preserve all current runtime fixes and regenerate shared records/manifests with the current generators. Run Node24.19 types, static tests, all corpus tests, asset tests, lesson-image tests and all three local PostgreSQL suites: topic-assets.db, jss3-delivery-correction.db, jss3-batch2-assets.db, with their exact environment variables and the current capture. Require zero unexplained failures and no unacknowledged skips. Check all 313 original rows and all 2,179 protected identities/content. Audit each correction's real source hash, replacement and cache retirement behaviour. Test missing/changed source fail-closed behaviour across notes, AI assistance, questions, submission and cached results.

Use an authorised staging environment and phone session to check recovered figures, sideways scrolling, animation, alt text, retry/error handling, teaching sequence and existing completions. Arithmetic about font size is not device acceptance. Verify `assessments.content_fingerprint` and `topic_assets.alt_text` schema readiness. Prepare read-only production preflight queries (no student PII in reports), import/asset dry-run plans, affected-row counts, backup and rollback procedures. Production writes, deployment, cleanup and imports require explicit approval of that concrete plan. Do not put credentials in Git, prompts or logs.

Before publication re-fetch master, integrate concurrent changes, rerun the relevant gates and push without force. Produce a final readiness matrix distinguishing: implemented/tested in repo; staged and observed; production verified; teacher/practical certified; blocked. If a genuine blocker remains, name the exact input or decision; do not declare all JSS3 settled. Provide the owner one bounded release approval request only after the plan is reviewable.

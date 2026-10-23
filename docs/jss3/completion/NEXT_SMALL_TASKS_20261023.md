# Small remaining tasks — 23 October 2026

## Common instruction: include with every task

Work in https://github.com/PDS-David/sts-school-app, default branch master. Fetch current master, record its SHA, read AGENTS.md if present and docs/jss3/completion/NEXT_AGENT_TASKS/EXECUTION_CONTRACT.md. Work on an isolated branch. Check whether your exact task has already landed; finish actual residuals rather than repeating audits. Implement and test, commit and push your branch, then open a PR targeting master. Workers do not merge; the designated integrator merges serially after CI. Never force-push master.

Preserve 313 original JSS3 rows, other classes, assets, existing IDs and UI. First/Second contain teaching; Third is BECE preparation; Computer Studies excluded. Clearly labelled sourced equivalents are authorised. No production deployment/import/migration, student cleanup, fabricated school approval or invented historical baseline. Existing English and practical fixes are on master through PR34. Read YO_TEXT_IMPLEMENTATION/REPORT.md for the latest Ṣàngó implementation; do not repeat its earlier absence finding.

Use Node24.19.0, npm ci --ignore-scripts and repository Python requirements. Run relevant regressions and backend/mobile types as applicable. Tests alone do not certify teaching. Save a small REPORT.md in your task directory with base/head, implementation, observed checks, exact remaining inputs, PR URL. If write credentials fail, supply a binary patch AND git bundle with APPLY.md; do not report an unpublished commit as fetchable.

No old audit ZIPs are required for repository work. When an actual three-term capture is required, the private input is JSS3_NEXT_STAGE_INPUTS_20261016.zip (suffix (1)/(2) acceptable), SHA256 0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c. This archive is NOT in Git. Ask for it only if not available, finish independent work meanwhile, and never invent a full-source pass. The integrator must have it for final combined verification.

## Y1 — Ọya text study

Implement only the missing Ọya pípè text-study lesson. Read docs/jss3/completion/YO_TEXT/SOURCE_RIGHTS_REGISTER.json, PERMISSION_AND_TRANSCRIPTION_REQUIREMENTS.md, YO_TEXT_IMPLEMENTATION/REPORT.md, backend/src/db/data/jss3Supplements.json, jss3Attributions.json and tests/jss3-yo-text.test.mts.

Find and inspect an age-appropriate primary published passage with a defensible reuse basis; download actual source bytes, record SHA256 and exact locator, check Yoruba/translation, and distinguish a documented traditional text from a labelled modern equivalent. Do not manufacture verse or claim a lyric-free profile is text study. Add a separate stable lesson ID SUP-YO-OYA-TEXT, First Term, using existing relevant gap IDs. Include objectives, passage, teaching, practice, marking key, source and licence. Bind attribution to its exact body and test authenticated delivery. Update only the Ọya source-register entry when evidence supports it; do not close iwì or whole mixed objectives.

Regenerate applicable lesson records from a fresh capture when the private archive is available. Add meaningful negative controls. Push a tested PR. If no reusable passage is supportable, preserve the open status and give the exact missing passage/permission, not a false completion. Do not contact anyone on the owner's behalf.

## Y2 — Iwì egúngún text study

Implement only iwì egúngún, using the same repository inputs and verification requirements as Y1. Use separate stable lesson ID SUP-YO-IWI-TEXT in First Term and existing gap IDs. Verify any equivalence between èsà and iwì from primary scholarship; do not present a modern experiment poem as an inherited traditional chant. Assess suitability for JSS3: Aransi2024's Humour excerpt contains adult sexual comparisons and is not selected for this pupil lesson. An openly licensed article is not proof of an unknown underlying text's provenance. Preserve accurate source limitations without inventing additional consent requirements.

Deliver actual teaching, questions, answers, attribution, runtime binding and tests; update only this genre's status. Do not change the Ṣàngó/Ọya sections or claim observed performance. Push a PR. If a necessary text/right is unavailable, identify that exact dependency and finish independent verification. No unsolicited messages to authors/performers.

## B1 — Protected baseline evidence

Read docs/jss3/completion/BASELINE3/REPORT.md and evidence/combined_counts.json, docs/jss3/completion/P1_BASELINE, and scripts/jss3/export_protected_curriculum.sql. Do not rerun reconstruction or reduce counts to force2179. Current reconstructions are not an identified certified2179 export.

Locate an existing identified pre-JSS3 certified export/backup and a release snapshot from owner-provided files or an explicitly designated read-only database/backup source. These are external inputs, not files guaranteed to exist in Git. Record provenance and scope, export without writes, run the repository comparer and negative control. Keep raw student/private data out of Git; publish redacted hashes/results only. If the historical artifact cannot be identified, state that exact unresolved gate; a current export cannot be relabelled historical. Finish comparison tooling defects if found and push a PR. Never weaken the gate or invent certification.

## S1 — Approved sequencing implementation

Before starting, obtain the owner's recorded answer to the concrete student-state policy: supplements gate later lessons; protect both passed topics and the already-accessible unpassed frontier; keep the first PIN-gated original identity stable; approve ambiguous supplement placements. A general desire to finish is not evidence of those exact choices.

Once approved, implement docs/jss3/completion/NEXT_AGENT_TASKS/05_SEQUENCE2_IMPLEMENT_APPROVED_POLICY.md and S1_SEQUENCE_DESIGN.md with its documented corrections. Shared GET/POST unlock logic; stable order_index/topic IDs; additive metadata; scoped dry-run/apply/rollback; persisted/reproducible grandfathering; explicit approved placements only. Verify the full disposable-PostgreSQL matrix, including frontier preservation and direct API bypass. Never write pending placements or apply production migrations. Push working code and tests as a PR; a design alone is not completion. Attach the policy record and private source archive to this worker if not already available.

## D1 — Staging and device verification

Read docs/jss3/completion/STAGE1_DEVICE1_EXEC_20261023/REPORT.md and its referenced runbook; PR33 is already merged. The owner must designate the staging backend/database, secure access, mobile build profile and available devices. Production is not a fallback.

Use the existing staging tools to prepare a disposable test school/account and mobile build; verify lesson text, corrected delivery, images/animations, Yoruba attribution/diacritics, assessment behaviour, PIN/progression and phone readability. Record actual device/build/version and evidence without credentials. Fix reproducible defects in an isolated branch, add regression tests, and push a PR. Do not label CI or a screenshot from another build as a device pass. If a target/device is missing, finish independent preflight and name the exact missing access.

## I1 — Serial integration and final release candidate

Owner must explicitly designate this agent as integrator. Start after Y1/Y2 and any approved S1 work have deliverable PRs; integrate one at a time. Fetch current master, inspect diffs, merge shared JSON records by stable IDs (never replace the whole file with an older worker copy), reconcile attribution hashes and coverage, regenerate IMPLEMENTED_LESSONS.csv and the teacher schedule from a fresh capture. Run full source acceptance with the private ZIP and disposable PostgreSQL16, plus relevant CI. Preserve313 originals and other classes; verify First/Second-only instruction and no Computer Studies. Record all skips and unresolved content honestly.

Combine B1 baseline evidence, D1 observed device results, and the owner's distribution decision under YO_LICENSE/OWNER_DECISION.md. Produce one current release-candidate status with commit SHA, implemented/verified/external-blocked distinctions, backup/import/cache reconciliation/rollback plan. Merge tested PRs to master as authorised; do NOT deploy or import production. Request production approval only for a concrete reviewed plan. If a gate remains unmet, report it without proposing another general audit.

## Dependencies and attachments

Y1 and Y2 can run concurrently on separate branches. B1 can run independently when its two external artifacts/access exist. S1 needs specific policy and placement approval before implementation. D1 needs designated staging/device access; final device tests must use the integrated candidate. I1 merges serially and runs last. Conflicts in supplements/attributions/registers belong to I1, never to a destructive overwrite.

Attachments: Y1/Y2 need no historical audit packages; primary sources are researched directly, with the private source ZIP needed for full-corpus verification. B1 needs the identified historical certified export/backup AND release snapshot (no guaranteed filenames exist). S1 needs written policy/placement decisions and the private source ZIP. D1 needs secure access/device availability, not source ZIPs for ordinary UI checks. I1 needs the private source ZIP and evidence links/results from completed workers. Do not attach passwords or database dumps to public GitHub.

## Y3 — Remaining Yoruba wording and prescribed-text claims

Read SCHOOL_DECISIONS_REQUIRED.md A1–A7 and B1–B2 and current coverage/lessons. Resolve factual meanings from inspected authoritative Yoruba sources where possible, implement supported explanations with exercises/keys, and preserve the difference between a labelled equivalent and the original author's intended word. Do not reopen owner-confirmed Week2 yala=ìjálá. Do not claim a government-prescribed book without its identity. Ask only for the exact school readings/titles that evidence cannot settle. Preserve raw source wording. Own this task's glossary/lesson changes only; coordinate shared-file merges through I1. Push implementation/tests and a per-item result, not another general questionnaire. No old ZIP is required unless rechecking original wording; then request the single private source archive.

## L1 — Implement the selected Yoruba distribution option

Read YO_LICENSE/OWNER_DECISION.md, YO_LICENSE/REPORT.md, YO_TEXT_IMPLEMENTATION/REPORT.md and current jss3Attributions.json. The owner chooses the concrete distribution option before dependent changes: retain attributed share-alike excerpts and permit recipients' licensed reuse, use identified authorised/public-domain alternatives, or the documented reference-only route (which must not be misrepresented as offline text completeness). Do not claim legal clearance or choose on the owner's behalf. With the choice recorded, implement it consistently in lesson content and learner-facing attribution/download/reuse behaviour; preserve existing NOUN cover/logo obligations, body-hash guards and correct licences. Verify authenticated delivery and regenerate affected records. New Ṣàngó credit must be included in the review. Push a tested PR. This can proceed independently of new Y1/Y2 texts, but I1 must reconcile their eventual licences too.

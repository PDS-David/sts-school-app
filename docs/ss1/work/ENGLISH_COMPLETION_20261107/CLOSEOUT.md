# SS1 English closeout — 7 November 2026

## Decision

**INCOMPLETE — not accepted as content-complete, not verified, and not released.**

This is the verification handoff and current acceptance decision required by English prompts 086–088. It is deliberately not a certification. The live package still has unresolved instructional coverage, owner/resource decisions, content approvals, deferred verification, and a separate shared-runtime integration dependency.

## Exact checkpoint and repository evidence

- Repository: `PDS-David/sts-school-app`
- Branch: `master`
- Base remote SHA for this handoff: `6533dca6141e2f2029b7c63aa9bd51f3f23ccd50`
- English queue SHA: `534f9055331d0b0df369baa405146e7ae9f49fe2`
- English package SHA: `ceccd3ac1365a55f154acc649148489d17348acc`
- Contract SHA: `7b8bcf283f700bd4031473e17ca9a8e50982edad`
- Schema SHA: `886c7720629c011058eca2ccba76dc2493aa37a6`
- English test draft SHA: `84b83b4effb050202a9de4cc5194ad15853fd416`
- Deferred verification instructions SHA: `07c8c8263e605b966b98f93fff7ae254f5aefb11`

The base commit's combined-status query returned no status records. This is **not** evidence that CI passed.

## Live queue decision

The English queue contains 242 tracked items:

| Status | Count |
|---|---:|
| IMPLEMENTED_TESTING_DEFERRED | 117 |
| PENDING | 119 |
| BLOCKED | 6 |

The six blocked items and their exact missing inputs are:

1. `ENG-FACT-PRESCRIBED-PASSAGES` — owner must supply authorised prescribed extracts/edition and permission details for T1/T2/T3, or explicitly accept each labelled original equivalent.
2. `ENG-FACT-ORAL-AUDIO` — owner must supply an accessible authorised audio model, creator/provider, licence or written permission, accent/model, and supported phonetics/stress objectives.
3. `ENG-FACT-CONTENT-APPROVAL` — teacher/owner must review all 46 authored lessons and provide an individual auditable approval reference for each, or a specific revision request.
4. `ENG-ASSET-AUDIO-MODEL` — depends on the actual authorised audio bytes and rights evidence; no placeholder asset is permitted.
5. `ENG-OWNER-T1-W07-TEXTBOOKS` — owner must supply authorised editions/pages or accept labelled original equivalents for Countdown p.221, Standard Speech Book 10 pp.1–10, Countdown pp.5–6, and Countdown questions 41–50 pp.275–276.
6. `ENG-LES-T1-W07-REVISION` — visually inspect the underlining in the registered 1st Term Word document at source locator lines 1164–1170 after verifying the archive and member hashes; then author only the matching original keyed practice. Do not infer the underlined targets from flattened text.

The queue's first raw `next_runnable` item is `ENG-LES-T3-W01-REVISION`, but its own completion condition requires owner/teacher confirmation of revision scope. The next independent authoring candidate is `ENG-LES-T3-W01-WORD-MEANING`, whose dependency `ENG-WK-T3-W01` is already IMPLEMENTED_TESTING_DEFERRED. The other pending tasks must continue in dependency order; do not bypass owner gates.

## Three-term curriculum and package reconciliation

The live package is `PENDING`, with 3 registered sources, 46 authored lessons, 24 delivery-correction records, 0 registered assets, 668 objective-level coverage records, and 139 open items (133 blocking delivery; 6 non-blocking).

Coverage entries by term and status:

| Term | SUPPORTED | IMPLEMENTED_EQUIVALENT | PARTIAL | UNRESOLVED | MARKER | Total |
|---|---:|---:|---:|---:|---:|---:|
| 1st Term | 12 | 130 | 87 | 62 | 11 | 302 |
| 2nd Term | 0 | 22 | 53 | 20 | 10 | 105 |
| 3rd Term | 0 | 14 | 175 | 61 | 11 | 261 |
| **Total** | **12** | **166** | **315** | **143** | **32** | **668** |

PARTIAL and UNRESOLVED entries remain delivery blockers; the existence of an index entry is not lesson completion. The open-item register in `backend/src/db/ss1/subjects/english.json` is the authoritative detailed list of exact gaps and follow-ups. The 24 correction records do not authorise activating narrower replacements while displaced source objectives remain unresolved; the package retains `ENGLISH-REPLACEMENT-SCOPE-RECONCILIATION`.

All 46 lessons currently have `content_approval=PENDING`, `approval_reference=null`, `verification=DEFERRED`, and `verification_reference=null`. No English asset is registered. The package must remain PENDING. No approval, rights, oral observation, or runtime delivery is inferred from implementation.

The registered source archive is `docs/ss1/sources/SSS1-original.zip`, expected SHA256 `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`. Its three English source members are:

- 1st Term: `SSS 1/1st Term SS1_/1ST TERM S1 ENGLISH LANGUAGE.doc` — `4852226f4a00e0058b7f516837e21bfa38954a8fea904fa8811dd45f7ff4ddef`
- 2nd Term: `SSS 1/2nd Term SS1_/ENGLISH.docx` — `ea9c7d70ffb8682fcf9dd9c4ebc2155fc6aa17aededc4743354add0cfeb72966`
- 3rd Term: `SSS 1/3rd Term SS1_/3RD TERM S1 ENGLISH LANGUAGE.doc` — `3a2174ad562794b593c42cbd61fc68843703846651fc0d2bbac3b38b0d9c0f5f`

These are the registered expected identities. The source stager must verify the archive and each exact member before any later source-dependent run; extract only named members into private scratch space and never commit extracted originals.

## Verification handoff — exact commands and checks

**Execution remains deferred by the owner. Do not run these commands or the importer until the owner explicitly lifts the deferral and starts the authorised verification stage.**

Use Node 24.19.0 and the existing lockfile. From repository root, the repository's deferred-verification instructions specify:

```bash
npm ci --ignore-scripts
node --import tsx --test scripts/ss1/foundation.test.mts
python -m unittest discover -s scripts/ss1 -p 'test_*.py'
npx tsc --noEmit -p backend/tsconfig.json
python scripts/ss1/prepare_sources.py --archive '/private/SSS 1-20260507T072431Z-3-001.zip' --output /private/ss1-staged
python scripts/ss1/build_subject_packages.py --root /private/ss1-staged --output /private/ss1-plan.json
python scripts/ss1/capture_preservation.py --before /private/base-other-class-rows.json --after /private/candidate-other-class-rows.json
```

The English-only test draft is already present at `tests/ss1/english.package.test.mts`. Its exact deferred command is:

```bash
node --import tsx --test tests/ss1/english.package.test.mts
```

The six drafted test areas are: strict package schema and three-term registration; exact UTF-8 lesson hashes, unique identities and complete marking totals; all 24 correction identities and same-term replacements; no fabricated approval/verification state; source-rule hash/anchor guards and character preservation; and corrected phonetics/rhyme/stress regression examples.

The verification review must also explicitly inspect: JSON/schema validity; unique source, lesson, practice, correction and asset IDs; all references and source/body hashes; marking criteria totals; source-rule anchors and hashes; coverage targets and open-item links; asset bytes/hash/rights/lesson binding; correction source/body identity and same-term replacement scope; and preservation of existing stored row identity.

The repository's deferred-verification document also requires source-dependent negative controls for changed source hash, repeated boundary anchor, invalid alias, false duplicate proof, missing package, pending approval, incomplete coverage, wrong asset hash, ambiguous correction, and shifted stored-row identity. Use synthetic fixtures only; do not mutate production files or a production database.

Before any release decision, SS1-08 must separately provide and verify the full-source acceptance runner, runtime correction/cache/asset checks, MIME sanitisation, and device checks. Database compatibility requires a designated snapshot and transaction rehearsal. The two preservation captures must come from actual base and candidate importers using identical authorised source sets; an empty or JSS3-only capture is not a substitute for the certified protected-row fixture.

## Execution and CI record at this checkpoint

- English test file: drafted; **not run**.
- Foundation tests: **not run**.
- Python SS1 unit tests: **not run**.
- Backend TypeScript typecheck: **not run**.
- Source preparation and package-plan importer: **not run**.
- Preservation capture / database snapshot / transaction rehearsal: **not run**.
- Runtime, asset sanitisation and device checks: **not run**.
- Combined CI status for base SHA: no status records returned; no pass is claimed.
- Deployment/release: **not performed**.

## Shortest path to acceptance

1. Execute the 119 PENDING non-test English follow-ups in dependency order, reusing exact existing evidence and stopping only at genuine owner/material/visual-inspection gates. Recompute queue counts and `next_runnable` after every bounded commit.
2. Obtain the six blocked inputs listed above. Keep the oral-observation verification distinct from acquiring an audio asset.
3. Resolve all 315 PARTIAL and 143 UNRESOLVED coverage entries and every associated blocking open item; review all 24 correction replacements against the complete displaced objectives. Do not mark content complete while gaps or rights decisions remain.
4. Obtain an auditable owner/teacher decision for each of the 46 lessons. Keep approval and implementation as separate states.
5. After the owner explicitly lifts testing deferral, run the exact verification commands, record versions, exit codes, logs and skips, complete SS1-08 integration checks, and conduct the authorised database compatibility rehearsal.
6. Only after real approval and verification evidence exists, update package/queue states and this closeout with passed/failed results and exact coverage. Then assess release separately. A subject JSON file alone does not establish student delivery.

**Acceptance result:** English remains incomplete and blocked from delivery. French is the next subject in the established sequence, but this English pack does not generate or modify French.

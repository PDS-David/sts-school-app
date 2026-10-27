# SS1 foundation reconciliation: master vs PR #71

Status: **DOCUMENTATION ONLY. Static read of both trees. Nothing was run** (no tests, typechecks, importer dry runs, DB or device checks). Nothing merged or closed.

## 1. Compared SHAs

| Side | Ref | SHA |
|---|---|---|
| Master (foundation of record: PR #69 + #70 + #73) | `master` | `ca23085415450feb287dc41da4e8b3b9695016da` |
| PR #71 head (includes merged PR #72 Worker B) | `ss1/SS1-01-20261026-claude` | `b5ced7ebb0efe22df2351baa140266fbf40cbf41` |
| PR #71 foundation commit (the SHA its description names) | | `4182582d537712dbc73d6ce411b8b2feabd9c05b` |
| Merge base | | `198b86eae4b6b9384d0cd2932f8bac02b1e383fb` |

- #71 was built before #69 merged. Both are named `ss1-subject-v1` but are different implementations. GitHub reports #71 as not mergeable.
- No `AGENTS.md` exists in the repository.
- Compared: `subjectPackageSchema.ts`, `compiler.ts`, `loader.ts`, `CONTRACT.md`, `WORKER_START.json`, `ingestTopics.ts` SS1 hooks, `scripts/ss1/*`, `sourceRegistry.json` vs `data/sourceManifest.json`, SS1 tests, package JSON.
- Shared and identical: `SOURCE_ASSIGNMENTS.csv`, the `IMPLEMENTATION_20261026` prompts, and the 61 registry/manifest entries (same IDs, SHA-256, members, terms, slugs).

## 2. Incompatibilities (master is authoritative; none are to be renamed)

**Operations**

| Master op | #71 op | Difference |
|---|---|---|
| `split_before` (`anchor`, numeric `week_label`) | `split_before_anchor` (`anchor`, `week_label`, `new_title?`) | Master inserts `WEEK n` into the extracted text before parsing. #71 splits an already-parsed topic. |
| `attach_stranded_label` (`week_label`, `following_anchor`) | `attach_stranded_label` (`week_label`, `label_anchor`, `direction`, `use_label_as_title`) | Same name, different fields and mechanism. Master supports only "attach to following". |
| `classify_marker` kind `REVISION` / `EXAMINATION` / `SCHEME_ONLY` | `classify_marker` `classification` `SCHEME_ONLY` / `EVALUATION_ONLY` / `HEADING_ONLY` / `EXAM_OR_REVISION_MARKER` | Different field name and vocabulary. Not 1:1. |
| `source_alias` (`observed_subject`, `canonical_subject`, `approval_reference`) | `explicit_source_alias` (`inferred_subject`, `canonical_subject`, `header_evidence`) | Master requires an approval reference. |
| `exclude_duplicate` (byte-identical, same-term **source**) | `exclude_proven_duplicate` (normalized-**body** hash, per topic) | Different granularity. |

**Fields**

| Area | Master | #71 |
|---|---|---|
| `package_status` | string `PENDING` / `IMPLEMENTED` | object: `implementation`, `content_approval`, `verification`, `updated_by`, `note` |
| Approval/verification state | per lesson and per asset (`state`) | package level only |
| source | `term`, `header_text`, `header_evidence{locator,explanation}` | `term_label`, `document_header_subject`, `assignment_confirmed`, `role`, `handoff_to_slug`, `evidence_locator{kind,value}` |
| rule | `id`, `evidence{locator,explanation}` | `rule_id` (`CHEM-R01` pattern), `reason` |
| lesson | `subject`, `term`, `body_sha256` (body only), `practice[{question,answer,marks,marking[{criterion,marks}]}]`, `provenance[]` | `canonical_subject`, `term_label`, `content_hash` (title+objectives+body+practice), `practice[{prompt,answer,marking:string}]`, `sequence`, `covers_objectives`, `provenance{}`, `reuse[]`, `references[]`, body ≥ 300 chars |
| lesson ID | `SUP-SS1-<SLUG-WITH-HYPHENS>-<SUFFIX>` | `SUP-SS1-<TOKEN>-NNN` (`FMATHS`, `DATAPROC`, …) |
| correction | `source_lesson_id` (full original ID), `body_sha256`, single `replacement_id`, `evidence` | `source_week_label`, `source_title`, `source_body_sha256`, `replacement_lesson_ids[]`, `previous_source_body_sha256[]`, `severity`, ID `DC-SS1-…` |
| asset | `id`, `lesson_id`, `path` (under repo `assets/<slug>/`), `alt`, `order` (≥0), `provenance`, `state`; MIME png/jpeg/gif/svg/pdf/mp3/wav | `asset_key`, `binding{}`, `file` (private dir), `alt_text`, `figure_order` (≥1), `displayed`, `rights{}`; MIME png/jpeg/webp |
| coverage | `id`, `objective`, `objective_locator`, `lesson_ids`, `evidence[{locator,explanation}]` | `objective_id`, `term_label`, `objective_text`, `scheme_locator{}`, `evidence[{kind…}]`, `open_item_ids`, `note` |
| open item | `kind` CONTENT/FACT/PERMISSION/OWNER_ACTION/VERIFICATION; `detail`, `required_action`, `blocks_delivery` | `kind` MISSING_FACT/…/OTHER; `description`, `owner_action`, `blocks_student_delivery`, `status` OPEN/RESOLVED |

**Behaviour**

- **Original lesson identity.** Master: `SS1-SRC-…:BODY:<sha256(parsed body)>`. #71: (source ID, canonical week label, raw body hash).
- **Supplement stored identity.** Master: filePath `__ss1_supplements__/<slug>/<ID>`, week `supplement`. #71: `<ID>.json`, week `SUPPLEMENT <ID>`. This matters for any stored-row compatibility check.
- **Supplement order.** Master: sorted by stable ID. #71: sorted by `sequence`, then ID.
- **PENDING packages.** Master packages may be PENDING and still carry lessons (English, French, Mathematics and Further Mathematics are). #71 rejects PENDING packages that have lessons.
- **Canonical subject names.** Master takes them from the document header. #71 hard-codes them in `constants.ts`.
- **Plan shape.** Master: `ss1-plan-v1` `{rows, identified_rows, dispositions, assets, corrections, blockers, ready}` + `source_previews`. #71: plan file `{subjects, rows, assets, delivery_corrections, scheme_only_rows, excluded_duplicates, gates, …}`.
- **Write safety.** Master `--ss1-reviewed --ss1-plan` is plan-only and `--yes` is refused. In #71's `ingestTopics.ts` diff no SS1-specific `--yes` refusal appears. SS1 gates feed the generic blocked count, so SS1 rows could be written once no gates remain. Incompatible with the owner's plan-only stance until SS1-08.
- **CLI/scripts.** Master: `build_subject_packages.py`, `prepare_sources.py` (composite archive only, hash-bound). #71: `.mts` builder, `--ss1-*` importer flags, multi-archive staging with `--allow-partial`.
- **Tests.** Master: `scripts/ss1/foundation.test.mts`, `tests/ss1/*.package.test.mts`. #71: `tests/ss1/*.test.mts`. #71 tests are written against #71's schema and cannot be ported verbatim.

## 3. Useful #71 capabilities absent from master (each a separate future item)

These are candidate capabilities, not 17 automatically mandatory tasks or closure gates. Adopt an item only where a concrete requirement justifies it; any adopted item must extend master's existing schema/compiler without renaming existing fields. Items marked **[schema]** need an additive, owner-approved foundation version decision (the contract says unsupported structure requires a versioned foundation change). Others need no schema change.

| ID | Item | #71 source | Notes |
|---|---|---|---|
| R-01 | Non-throwing per-subject status/disposition report (state, original/marker/split/supplement counts, coverage tallies, honest "NOT COMPLETE" claim) | `loader.ts` statuses, `compiler.ts` `subjects[]`, `reportLines()` | Master throws on the first invalid package and has no per-subject summary. |
| R-02 | Placeholder-text scan (`TODO`/`TBD`/`FIXME`/lorem…) over lesson, objective and practice text | `loader.ts` | Pure check. |
| R-03 | Coverage ↔ open-item linkage: PARTIAL/UNRESOLVED must reference an OPEN open item; resolved items kept with status | `coverageSchema.open_item_ids`, `openItemSchema.status` | **[schema]** |
| R-04 | Hash-based stored-snapshot compatibility (rows as `{subject, term, order, title, source_file, body_sha256}`) plus "no planned row inserted inside the existing sequence" | `compareToSnapshot` | Extends, does not replace, `assertExistingCompatible`. Must use master's supplement `source_file` representation. |
| R-05 | Cross-check the compiler's computed `orderIndex` against the importer's real per-bucket numbering; carry final `order_index` into asset/correction plans | `buildIdentityPlan`, `attachRow`, plan `assets[].order_index` | Guards stored-row identity. Master computes its own order. |
| R-06 | Private-plan exporters for SS1-08: asset attach manifest for `backend/src/db/attachTopicAssets.ts`, corrections file with final topic identities, human-readable disposition report | `scripts/ss1/build_subject_packages.mts` | `attachTopicAssets.ts` is on master. |
| R-07 | Render provenance, origin, required credits and attributions into the delivered supplement text | `ss1SupplementReference` | Master `renderLesson` omits them. Master's `provenance[].attribution` already exists, so no schema change. |
| R-08 | Explicit teaching `sequence` for supplements instead of ID-lexical order | `lessonSchema.sequence` | **[schema]**. Interim: owner-set zero-padded ID suffix convention. |
| R-09 | Body-level duplicate exclusion by normalized-body hash with a kept-target check | `exclude_proven_duplicate`, `normalizedBodyHash` | **[schema]** (new op). Master only excludes whole byte-identical sources. |
| R-10 | Declare cross-subject (misfiled) source material as a handoff, never silent deletion | `source.role` / `handoff_to_slug` | **[schema]**. Master: one canonical subject per source. |
| R-11 | Extra marker classes `EVALUATION_ONLY` and `HEADING_ONLY` | `markerClassification` | **[schema]**. Master has only REVISION/EXAMINATION/SCHEME_ONLY. |
| R-12 | Stranded-label attach to the PREVIOUS row, label-as-title, retitle on split, non-numeric week labels (canonical week normalizer incl. "9 and 10", "OSE") | `sourceRules.ts`, `canonicalWeekLabel` | **[schema]**. Master's week labels are numeric only. |
| R-13 | Delivery corrections: one-to-many replacements, prior body hashes, severity (UNSAFE/INCORRECT/UNUSABLE/SUPERSEDED) | `deliveryCorrectionSchema` | **[schema]**. Master is one replacement per original. |
| R-14 | Whole-lesson content hash (canonical JSON of title, objectives, body, practice) beside `body_sha256` | `lessonContentHash`, `canonicalJson` | **[schema]** (additive field). |
| R-15 | Staging report + source inventory CSV (hash, size, status per source) | `prepare_sources.py` | Reporting only. Keep composite-archive-only staging. |
| R-16 | Manual-dispatch (`workflow_dispatch`) CI workflow for the later SS1-09 verification | `.github/workflows/ss1-foundation.yml` | Re-point to master's test paths. Do not enable automatic triggers. |
| R-17 | `image/webp` media type | `assetSchema` | **[schema]**, minor. |

**Not adopted** (conflicts with master or owner rules): #71's schema and field names; object-valued `package_status`; "PENDING must have zero lessons"; ≥300-character lesson-body rule (master states no character count proves completeness); `SUP-SS1-<TOKEN>-NNN` IDs and hard-coded canonical names; plan-writing import path without `--yes` refusal; multi-archive/`--allow-partial` staging (the owner rule is to use the named composite archive only).

## 4. Open worker PRs that still depend on #71

- **Open PRs at `ca23085`:** only #71 itself. No open worker PR is based on, or targets, #71 or its branch.
- **#72** (Worker B: Mathematics, Further Mathematics, Physics) targeted the #71 branch and is already merged **into that branch**, not into master.
- **#69, #70, #73** are merged to master on master's foundation. #70 and #73 authored English, French, Mathematics and Further Mathematics against master's schema. The SS1-03 checkpoint on master states it follows the merged #69 contract, not #71.
- **Branch-level dependency that remains.** Only #71's branch holds the following, all authored in #71's schema:
  - **D-1:** `physics.json` (IMPLEMENTED/NOT COMPLETE; 5 lessons, 1 rule, 32 coverage entries, 5 open items). Absent from master; master's SS1-03 checkpoint lists Physics as NOT STARTED.
  - **D-2:** `mathematics.json` (IN_PROGRESS; 16 lessons for 2nd/3rd Term, 2 rules, 7 open items). Master's version has 6 lessons and 6 corrections for 1st Term.
  - **D-3:** `further-mathematics.json` (IMPLEMENTED/NOT COMPLETE; 14 lessons, 3 rules, 7 open items, 0 corrections). Master's version has 6 lessons, 6 corrections, 1 asset.
  - **D-4:** `docs/ss1/work/SS1-03/` notes and `tests/ss1/{mathematics,further-mathematics,physics}.test.mts` (#71 schema).
  - Overlap between the D-2/D-3 lessons and master's lessons was **not** assessed here.
- Each D item needs a separate bounded port task into master's schema, reusing existing reviews and evidence. Compare overlap and changed mappings where necessary; do not repeat unrelated source audits. Until then #71's head `b5ced7e` is their only home.

## 5. PR disposition (reviewed 2026-10-27)

- Do not merge #71 into master: the foundations are incompatible.
- Closure is now appropriate without merging: D-1 to D-4 have explicit comparison/port tasks in the Physics, Mathematics and Further Mathematics queues. New workers must branch from current master.
- Preserve branch `ss1/SS1-01-20261026-claude` and full head `b5ced7ebb0efe22df2351baa140266fbf40cbf41`. Closing a PR does not itself delete that branch or its commits.
- Before closing, make the unique content's disposition explicit: bounded port tasks with immutable source paths/SHAs, or completed ports. Do not silently discard D-1 to D-4.
- R-01 to R-17 are proposals, not prerequisites for closing this PR or blanket requirements to implement all 17 features. Evaluate each against an actual product requirement.
- The PR description's historical foundation SHA is not its current head; retain the distinction above.

### Port tracking established on 2026-10-27

- D-1: physics/QUEUE.json, PHYS-PORT-D1-*.
- D-2: mathematics/QUEUE.json, MATH-PORT-D2-*.
- D-3: further-mathematics/QUEUE.json, FM-PORT-D3-*.
- D-4: PHYS-CMP-D4-NOTES and FM-PORT-D4-* plus the Mathematics branch-comparison entries.

All paths above are relative to docs/ss1/work/microtasks/. These are outstanding tasks, not completed ports. Their evidence points to immutable commit b5ced7ebb0efe22df2351baa140266fbf40cbf41. PR closure must retain the source branch; no unique content is being discarded.

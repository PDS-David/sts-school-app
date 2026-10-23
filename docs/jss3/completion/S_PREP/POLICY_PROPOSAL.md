# S-PREP — Reviewable sequencing policy and placement proposal

**Proposal version:** `S-PREP-PROPOSAL-v1`
**Base:** `master` @ `3d0b78adf37f4b373b0c42caa44a0102bbce06b0` (23 Oct 2026, PR #37 merge)
**Status:** PROPOSAL FOR OWNER REVIEW. **No approval is recorded.** No schema, unlock behaviour, topic identity, asset, completion or production data is changed by this branch. Sequencing implementation is not started.
**Supersedes for decision purposes:** the policy choices in `../S1_SEQUENCE_DESIGN.md` §3 (see §6 for the corrections). S1's mechanism (a rank that never touches `order_index`) is kept.

Companion files: `PLACEMENT_PROPOSAL.csv` (170 rows), `APPROVAL_FORM.md` (carries the exact hashes), `REPORT.md`. Reproducible with `scripts/jss3/build_s_prep_placement_proposal.py` and `scripts/jss3/s_prep_sequence_policy_model.py`.

---

## 1. Verified facts this proposal rests on

| Fact | Source at base SHA |
|---|---|
| Student unlock is computed twice, independently: `GET /learning/topics` and the direct guard in `POST /learning/topics/:id/complete`. Both walk `order_index` within subject + class + term. | `backend/src/routes/learning.ts` (~L152–215, ~L419–445) |
| Topic N+1 opens only when topic N has `passed = true`; `passed` is written by assessment submission (`topic_completions.passed`), not by the bare completion insert. | `learning.ts` L464, L1167 |
| The first ordered topic needs a redeemed term PIN **only when `TERM_PIN_ENFORCED === 'true'`**. Default is off. | `learning.ts` L12 |
| Locks are computed for `role === 'student'` only; teacher/admin lists are ordered but never locked. | `learning.ts` L180 |
| Mobile detects the PIN-gated topic by `t.order_index === min(order_index in term)`. | `mobile/src/screens/SubjectTopicsScreen.tsx` L39–40 |
| `topic_completions.completed_at` is set once at first insert; the assessment upsert updates `passed`/`score_percent` only. So **`completed_at` is the first-completion time, not the time of passing.** | `backend/schema.sql` L399–405; `learning.ts` L1167–1170 |
| Current inventory: **170** supplements (83 First Term, 87 Second Term) over **313** originals (151 + 162) in 28 buckets; 0 in Third Term. `jss3Supplements.json`, `IMPLEMENTED_LESSONS.csv` and `TEACHER_SCHEDULE_SUPPLEMENTS.csv` agree on ids, titles, terms and append `order_index`; append indices are contiguous `n+1…n+m` in every bucket. | generator assertions |
| Largest buckets: English 1st 24 originals + 18; English 2nd 31 + 18; Yoruba 1st 8 + 14. | `PLACEMENT_PROPOSAL.csv` |
| Scheme numbers exceed the bucket's original count in **17** rows (13 `scheme_week`, 4 `scheme_list_item`). Week and list-item numbers are therefore not `order_index` values and are never used as such here. | `PLACEMENT_PROPOSAL.csv` col `schedule_number_exceeds_original_count` |
| Original row bodies and titles are **not in Git**; the private source archive was not available in this task. | — |

## 2. Recommended policy

Four decisions were requested; each is answered, with the alternative and its cost.

### D1 — Do supplements gate later lessons? **Recommended: No. Placed supplements are optional (non-gating).**

* Originals keep exactly today's chain among themselves: original k+1 opens when original k is passed (first original: PIN). The supplement is *displayed* between its anchor and the next original, but original k+1 does not wait for it.
* A placed supplement opens when its **anchor original is passed**. Supplements after the same anchor open together; they do not form a chain with each other.
* An **unplaced** supplement stays in the legacy tail chain (after the last original, behind earlier unplaced supplements). Because placed supplements leave that tail, an unplaced supplement can open *earlier* than today; it never opens later.
* **Legacy floor:** a topic is also open if today's `order_index` rule would open it. This makes "no student loses access" hold for every possible state, not only states reachable through normal progress.

Why: (a) all 170 supplements are new, source-labelled equivalent teaching that no teacher has certified; making them mandatory would let one unreviewed lesson or its auto-generated assessment block a student's entire remaining term; (b) with non-gating, every original's lock state is byte-for-byte what it is today for every student, so the returning-student problem in D2 disappears by construction instead of needing a snapshot; (c) teaching order is still shown in the app and in the teacher schedule.

*Alternative G (supplements gate).* Matches "teach before the related assessment" more tightly but needs a persisted per-student frontier snapshot (see §6.2), makes up to 18 supplements per bucket mandatory, and cannot be rolled back without re-reasoning about students who progressed under it. Not recommended for first release; it can be adopted later per supplement once a teacher certifies it, without changing the data model.

### D2 — Returning students: passed topics **and** the accessible unpassed frontier

**Recommended invariant (testable):** for every student and every topic, if the topic is passed **or** is open under today's rule, it is open after placement. Under D1 this holds because original chains are unchanged and the legacy floor covers the rest. The frontier is the topic that is open and unpassed under the legacy rule at activation (one per bucket, plus the first topic if the PIN is redeemed); it is protected, not merely passed topics.

If the owner instead chooses Alternative G, protection must come from a **persisted snapshot** of each student's legacy-open, unpassed topics taken at activation (table keyed by plan version, school, student, topic). A timestamp rule using `completed_at` is **unsound** (first-completion time, §1) and must not be used.

### D3 — May a supplement precede original #1? **Recommended: No.**
The first PIN-gated identity is original #1 of each bucket. `afterOriginalOrderIndex >= 1` is mandatory; supplements wanting a "week 1" slot go immediately after original #1. The API exposes `is_sequence_first`; the mobile screen uses it instead of comparing `order_index`. Original #1 is therefore always first and always the PIN topic.

### D4 — Supplements without an approved placement
Keep `sequence_rank = NULL`: appended at the end, legacy tail chain, exactly today's behaviour. Nothing is guessed. Approval states: `APPROVED(k)`, `KEEP_AT_END` (a deliberate owner decision to leave it appended), `PENDING`. Only `APPROVED(k)` is ever written. Of 170 supplements, the repository supports a proposed anchor for **23** (16 MEDIUM, 7 LOW); **147 are UNRESOLVED** and remain at the end until a teacher or the private archive supplies the anchor.

## 3. Worked cases (output of `s_prep_sequence_policy_model.py`)

Model bucket: originals O1–O4; supplements S1 and S2 proposed after O2; S3 unplaced. Display order after placement: `O1 O2 S1 S2 O3 O4 S3`. Legacy order: `O1 O2 O3 O4 S1 S2 S3`. Columns: **legacy** = today; **S1** = S1 design rule (self-passed exception only); **N** = recommended; **G** = gating + snapshot.

```
FRESH student, PIN redeemed, nothing passed
  O1 open in all policies; every other topic locked in all policies.
FRESH student, no PIN
  everything locked in all policies (PIN identity unchanged).
RETURNING A — passed O1,O2; frontier O3 (open, unpassed today)
  topic  legacy S1   N    G
  S1     lock   open open open
  S2     lock   lock open lock
  O3     open   LOCK open open      <- S1 design re-locks the frontier
RETURNING B — passed O1,O2,O3; frontier O4
  O4 open in all policies; S1 open in S1/N/G; S2 open only in N.
RETURNING C — all originals + S1 passed
  S2 open all; S3 locked today, open in S1/N/G (an unplaced item opens earlier, never later).
```

* A fresh student gets the same PIN gate and first topic as today. Under D1 they may open O3 straight after passing O2 even if S1/S2 are unattempted; the supplements appear in the list in between.
* Returning case A is the defect S1 missed: S1's "topic itself already passed" exception does not protect O3 (unpassed), whose new predecessor S2 is unpassed. Counterexample found exhaustively by the model: one original, one supplement after O1 — a student who passed only O1 sees O2 re-locked under the S1 rule.
* Model property check: 25,640 (bucket shape × reachable-state) pairs; N and G never re-lock a legacy-open or passed topic; the S1 rule does.

## 4. Placement proposal summary

`PLACEMENT_PROPOSAL.csv`: one row per supplement id (170), current counts (not historical pins), proposed anchor, evidence, confidence, and separate **approval columns that are all empty / `NOT_APPROVED`**.

| Result | Rows |
|---|---:|
| PROPOSED, MEDIUM (repository names the original, or the scheme item pairs with it, or both neighbours agree) | 16 |
| PROPOSED, LOW (range ≤ 3 originals; lower bound proposed) | 7 |
| UNRESOLVED (no supported anchor) | 147 |
| — of which a repository lower bound exists but range is too wide | 44 |
| — of which scheme order disagrees with original order for the bucket | 16 |
| — of which no usable link in Git | 87 |

Evidence used (all in Git): `SEMANTIC_DECISIONS.csv` (scheme item → original row index and title fragment), `WIDER_WORKSTREAMS.csv` (supplement → scheme items; seven locators naming an original by number), `TEACHER_SCHEDULE_SUPPLEMENTS.csv` (week/list-item anchors, counts). A scheme-order bound is trusted only if no scheme item of another subject/term lies between it and the supplement. `verified_against_private_archive` is `NO` on every row. Anchors from scheme order assume original row order follows scheme order, which was not verifiable without the capture; that is why they are LOW or UNRESOLVED, not approved. Rows within one anchor keep their current append order.

Not determined from Git: whether any bucket's last original is an assessment/revision row (44 scheme items are exam-week markers in `SEMANTIC_DECISIONS.csv`, but whether any original topic row is one needs the capture). If one exists, supplements must be placed before it.

## 5. Mechanism (unchanged from S1 except where §6 says)

Additive nullable `topics.sequence_rank NUMERIC(12,6)`; effective sequence `COALESCE(sequence_rank, order_index)`; placed rank `k + n/1000`; originals never get a rank; `order_index`, the unique key, importer identity check, asset targeting, `topic_id`s, completions and assets untouched. One shared helper used by `GET /topics` and `POST /topics/:id/complete`; API gains `sequence_position` and `is_sequence_first`, existing fields kept. Placement data in a reviewed file with `approved` rows only written, title-guarded.

## 6. Corrections to the S1 design

1. **Frontier omission.** S1 rule 1 protects only topics already passed. It re-locks the open-but-unpassed next topic (§3, case A). Replaced by the D2 invariant and, if gating is chosen, a persisted snapshot.
2. **Rollback scope.** S1's rollback (`UPDATE topics SET sequence_rank = NULL WHERE term_label IN (…) AND class_name='JSS 3'`) is not scoped to a school, plan or the rows this change wrote: topics are per `school_code`, so it would clear every school's JSS 3 placements and any later plan. Corrected: the apply tool writes an audit table (plan version + hash, `school_code`, `topic_id`, previous rank, new rank, applied time); rollback is `--dry-run` by default, takes one school and one plan version, resets only those rows, and only where the current rank still equals the recorded new rank (so later edits are never overwritten). With Alternative G it also removes that plan's snapshot rows. Unlock behaviour after rollback is exactly legacy for that school.
3. **Snapshot by timestamp is unsound** (`completed_at` ≠ pass time).
4. **S1's claim that originals' lock behaviour is "byte-for-byte" unchanged** holds only under non-gating; under gating it is false for fresh students (O3 waits for S2).
5. **Stale counts.** Prior prose still says 41 supplements / 354 rows; current is 170 / 483 and the implementation must assert counts from the capture.
6. **Teacher/admin lists** are re-ordered by the same rank (display only); S1 did not say so.

## 7. Executable test matrix (for the later implementation task)

"Model" = the case already asserted in `s_prep_sequence_policy_model.py`; implementation tests must reproduce it against real routes. DB tests: disposable PostgreSQL 16, `jss3_test_*`, `JSS3_LOCAL_TEST_DATABASE_URL`, fresh capture, no production, no mocks.

| ID | Setup → action | Expected |
|---|---|---|
| U1 | Placement validator: unknown id; Third Term; `k < 1`; `k > originals`; duplicate id; `pending`/unapproved row; wrong anchor title | each rejected before any write |
| U2 | Rank builder: ties by append `order_index`; `k < rank < k+1`; deterministic; input not mutated | pass |
| U3 | Counts asserted from data: 170 / 313 / 483; per-bucket contiguity | pass |
| U4 | Policy property test over all bucket shapes (n ≤ 5, ≤ 4 supplements) | no re-lock of passed or legacy-open topic; originals' relative order preserved; O1 always first |
| M1 | Migration run twice; originals' `order_index`, title, `source_reference` hash, `topic_id` before/after for all 313 | identical; rank column NULL everywhere |
| M2 | Apply dry-run | writes nothing, prints every intended change |
| M3 | Apply with approved rows only | sets `sequence_rank` on approved supplements of the named school only; audit rows written; no title/body/summary/asset change |
| M4 | Apply twice | second run no-op |
| M5 | Row whose stored title/hash differs from plan | aborts before any write |
| M6 | Approved row anchored beyond bucket originals, or to a non-original | aborts |
| M7 | `KEEP_AT_END` / pending row | rank stays NULL |
| A1 | `GET /topics` order | placed supplement between anchor and next original; `sequence_position` contiguous; manual (NULL `order_index`) topics last |
| A2 | Fresh student, PIN redeemed (`TERM_PIN_ENFORCED=true`) | only O1 open; GET and direct POST agree |
| A3 | Fresh student, no PIN, enforced | O1 locked; direct POST 403 |
| A4 | Pin not enforced (default) | behaviour equals today |
| A5 | Model case A: passed O1,O2 before placement | O3 open, S1 open, S2 open (N) |
| A6 | Model case B/C | per model table |
| A7 | Failed (`passed=false`) predecessor | next stays locked |
| A8 | Pass a placed supplement | O3 unaffected (non-gating); no other lock changes |
| A9 | Direct `POST /complete` on every locked topic, all roles/schools | 403; cross-school and cross-class rejected as today |
| A10 | Parity: for each student state in a generated set, GET `locked` equals POST guard decision for every topic | identical (shared helper) |
| A11 | Legacy floor: states unreachable by normal progress (e.g. S passed, predecessor not) | still open if legacy-open |
| A12 | `is_sequence_first` true only for O1; mobile PIN banner driven by it | pass (mobile unit test) |
| R1 | Rollback dry-run, then apply, for one school and plan | only that school's audited rows reset; other school's ranks untouched |
| R2 | Rank edited after apply, then rollback | edited row skipped and reported |
| R3 | After rollback | `GET /topics` response equals the pre-apply capture exactly |
| D1 | `topic_completions` and `topic_assets` row counts and `topic_id` bindings; authenticated asset fetch for placed supplements; existing manifests (`BUSINESS`, `BASIC_TECH`, `MUSIC`, `V1`, `V2`, `V3`, `BATCH2`) still attach by `[order_index + title guard]` | unchanged |
| D2 | Existing suites with their variables (`jss3-supplements`, `jss3-delivery-correction(.db)`, `jss3-v2-math-assets.db`, `jss3-batch2-assets.db`, `jss3-v1-business.db`, `topic-assets.db`) and the eight-suite runner | pass; skips reported |
| G1 *(only if Alternative G is chosen)* | Snapshot taken at activation; frontier student; later pass of S1 | frontier stays open; fresh student gated; snapshot removed by rollback |

## 8. Not claimed
No placement is certified. Proposed anchors are repository-derived suggestions with stated evidence; none was verified against original row bodies. Not decided here: Batch 3 content, any teacher week choice, production rollout, Third Term (no supplements; BECE preparation only).

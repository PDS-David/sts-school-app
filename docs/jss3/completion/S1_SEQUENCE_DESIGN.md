# S1 — JSS3 supplement sequence design and acceptance test plan

Status: **design for owner review. No code, schema, data or database change.** Base: `master` @ `02e596e8e53e1beea7a4b4b0aa52ba9308638a4d` (20 Oct 2026). Authorised by the owner on 20 Oct 2026 as S1 only; Batch 3 implementation is not started. A separate small task implements this after approval.

## 1. Problem (verified in current code)

- Supplements are appended after the originals in each class/subject/term bucket (`ingestTopics.ts` assigns `order_index` 1..n in row order; `jss3Supplements.ts` builds rows with `orderIndex: 0`). A student therefore meets every supplement after the last original topic.
- Student progression follows `order_index` in two places that duplicate the same logic: `GET /learning/topics` (lock computation, `learning.ts` ~L190-210) and the direct-call guard in `POST /learning/topics/:id/complete` (~L415-440). Topic N opens only when N-1 is **passed**; the first topic needs the term PIN. The mobile `SubjectTopicsScreen.tsx` (L39) also uses `order_index` to detect the PIN-gated first topic.
- `order_index` is also an **identity**: `UNIQUE (school_code, subject_id, class_name, term_label, order_index)`; the importer verifies `[bucket, orderIndex]`; `attachTopicAssets.ts` targets topics by `order_index` with a title guard; supplement asset manifests already target appended positions (e.g. 12). Renumbering is rejected.
- Completions (`topic_completions`) and assets (`topic_assets`) are keyed by `topic_id`, not `order_index`.
- `TEACHER_SCHEDULE_SUPPLEMENTS.csv` only says "teach from week N, before assessment week". A CSV does not change what students can open.

### Stale figures to correct (found while reading)
`TEACHING_SEQUENCE.md` and `IMPLEMENTATION.md` still say 41 supplements / 354 rows. `backend/src/db/data/jss3Supplements.json`, `IMPLEMENTED_LESSONS.csv` and the schedule CSV all hold **170** supplements (83 First Term, 87 Second Term) over 151 + 162 originals = **483** planned rows. The implementation must assert these counts from the capture, not from the older prose.

## 2. Design: add a rank, never touch `order_index`

**One nullable column** on `topics`: `sequence_rank NUMERIC(12,6) NULL`.

- Effective sequence = `COALESCE(sequence_rank, order_index)`.
- All 313 originals keep `sequence_rank = NULL`, so their behaviour is byte-for-byte what it is today. Manual topics (NULL `order_index`) remain unordered/always unlocked.
- A placed supplement with `order_index = m` gets `sequence_rank = k + n/1000`, where `k` is the `order_index` of the original it follows and `n` is its 1-based place among supplements placed after that same original (ties broken by existing append `order_index`). Up to 999 per anchor; max in any bucket is 18.
- A supplement with no approved placement keeps `sequence_rank = NULL` and stays appended (current behaviour). **Unapproved week choices are never guessed.**
- `order_index`, the unique constraint, the importer identity check, asset targeting, `topic_id`s, completions and assets are untouched. Existing asset manifests stay valid because they address `order_index`.

**Placement data** lives in a reviewed, versioned file `backend/src/db/data/jss3SupplementPlacement.json`: `{supplementId, afterOriginalOrderIndex, status: "approved" | "pending", evidence}`. A validator checks: id exists in `jss3Supplements.json`; term is 1st/2nd only; `afterOriginalOrderIndex` is an integer `>= 1` and `<=` the bucket's original count; original titles guard (store the expected original title to catch a shifted index, like the asset title guard); no `pending` row is written.

**Write path:** a metadata-only step (in the importer apply path or a dedicated script, `--dry-run` default) that sets `sequence_rank` only for approved supplements, matched by `[bucket, order_index]` plus the supplement's stored title/hash. It never updates titles, bodies, summaries or `source_reference`. Idempotent; refuses wrong-identity rows before any write; reports every change.

**Shared lock helper:** extract one function (SQL ordering + chain rule) used by `GET /topics` and `POST /topics/:id/complete` so the two can no longer diverge. `GET /topics` orders by `COALESCE(sequence_rank, order_index) NULLS LAST` and additionally returns `sequence_position` (1..n ordinal in the bucket) and `is_sequence_first`; the mobile screen uses `is_sequence_first` instead of comparing `order_index`.

**Rollback:** `UPDATE topics SET sequence_rank = NULL WHERE term_label IN ('1st Term','2nd Term') AND class_name='JSS 3'` restores today's behaviour exactly. The column can remain unused.

## 3. Student-state rules (owner decisions; recommended default marked)

1. **No re-locking.** A topic is open if the previous topic in the new sequence is passed **or the topic itself already has a passed completion**. Without this, a student who already passed original k+1 would find it locked again behind a newly inserted supplement. *Recommended.*
2. **Supplements gate later originals** (they sit in the chain) vs. supplements are optional (skipped by the chain). Gating matches "placed before their related assessments"; optional avoids blocking students on new material. *Recommended: gate, with rule 1 protecting existing progress.*
3. **Never before original #1.** Keeps the PIN-gated first topic identity stable. Week-1 supplements go immediately after original #1. *Recommended.*
4. **Term assessment/exam week.** The CSV says "before the term's assessment/exam week", but the original row bodies are not in Git, so it is **unverified whether any bucket ends with an assessment/revision topic row**. If one exists, supplements must be placed before it; if the exam week is not a topic row, the term-end position is only teacher scheduling and the app cannot enforce it.

## 4. Exact choices that need school input

From `TEACHER_SCHEDULE_SUPPLEMENTS.csv` (170 rows):

| Category | Count | What the school must supply |
|---|---:|---|
| No scheme week recorded (owner/teacher chooses) | 46 | The original topic each follows. Per bucket: English 1st 7, English 2nd 8, Yoruba 1st 4, Basic Technology 2nd 4, Civic 2nd 3, Mathematics 1st 3, plus 1-2 each in Basic Science, Business, Civic 1st, CCA, Home Economics, Music, PHE, Social Studies, Mathematics 2nd, Yoruba 2nd |
| Anchored to a scheme **list item**, not a week | 29 | French 10, Agricultural 4, Home Economics 4, Mathematics 3, PHE 3, Basic Technology 2, CCA 2, Civic 1: confirm list item to original topic |
| Anchored to a scheme **week** | 95 | Week to original-topic mapping. Week numbers are not `order_index` values: in **17** rows the anchored week number exceeds the bucket's original count (e.g. SUP-AGRIC-STOCK-EXCHANGE week 9 vs 8 originals; SUP-BUS-DIVISION week 8 vs 6), and several weeks hold several originals or none |
| Third Term | 0 | Out of scope: Third Term is BECE preparation only; no supplement is placed there |

The week-to-original mapping needs the captured rows' `weekLabel` (importer in-memory field; `topics` does not store it) from the capture/input ZIP, which is not in Git. This design therefore does not fill `jss3SupplementPlacement.json`; the implementation task generates a **proposal** from the capture (earliest original whose week >= anchor, flagged where ambiguous) for the teachers to approve. Only approved rows are applied.

## 5. Acceptance test plan

**Unit (no database):** placement validator rejects unknown ids, Third Term, `afterOriginalOrderIndex` out of range, `pending` written, duplicate ids; rank builder is deterministic, strictly between `k` and `k+1`, stable for ties; unapproved => NULL; builder does not mutate its input; originals' objects (313) deep-equal before/after; counts assert 170 / 313 / 483.

**Database (disposable local PostgreSQL, fresh capture; no production):**
1. Migration is idempotent; existing rows unchanged; originals' `order_index`, title, `source_reference` hash, `topic_id` identical before/after (compare all 313).
2. Apply step: dry-run writes nothing; apply sets only `sequence_rank` on approved supplements; second run is a no-op; wrong-title/identity row aborts before any write; no body/summary/asset change.
3. `GET /topics` ordering: supplement appears between its anchor original and the next; `sequence_position` is contiguous; manual topics stay last.
4. Unlock matrix, GET and direct POST agree for each: fresh student (PIN needed only for the first topic); student at original k (supplement open, k+1 locked); student who passed originals 1..n **before** placement (rule 1: none re-locked, supplement open); student who passed the supplement (k+1 opens); failed (not passed) previous topic keeps next locked; student without PIN still blocked at first topic; direct `POST /complete` on a locked topic returns 403 and cannot bypass; cross-school and cross-class rejection unchanged.
5. `topic_completions` and `topic_assets` row counts and `topic_id` bindings unchanged; authenticated asset retrieval still works for placed supplements; existing asset manifests (`BUSINESS/BASIC_TECH/MUSIC/V1/V2/V3/BATCH2`) still attach by `[order_index + title guard]` unchanged.
6. Rollback: setting `sequence_rank = NULL` reproduces the pre-change `GET /topics` response exactly.
7. Existing suites run with their declared variables: `jss3-supplements`, `jss3-delivery-correction(.db)`, `jss3-v2-math-assets.db`, `jss3-batch2-assets.db`, `jss3-v1-business.db`, `topic-assets.db`, and report skips.

**Mobile:** `SubjectTopicsScreen` first-topic/PIN banner driven by `is_sequence_first`; a staging pass belongs to A2, not this task.

## 6. Out of scope / not claimed
No production migration, import or cache change. Placement is not teacher certification of the order. This design does not fill any week choice, decide Batch 3 content, or change originals.

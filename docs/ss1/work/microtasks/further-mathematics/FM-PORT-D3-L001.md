# FM-PORT-D3-L001 — Further Mathematics, port of PR71 indices lesson

Status: **IMPLEMENTED_TESTING_DEFERRED** (implemented; not approved, not verified). Testing deferred by owner. The lesson is a corrected supplement; the Week 1 row is **not** bound to it and nothing is activated for delivery.

## Inputs
- Starting SHA: `b7a0cdb070cdcb24c49968ecd802e8b8029f21c9` (origin/master, after PR #153). GitHub API listed 0 open PRs; no `fm-port-d3-l001` branch existed. Prerequisites FM-SRC-T1 and FM-WK-T1-W01 are IMPLEMENTED_TESTING_DEFERRED on master. No `AGENTS.md`.
- Original member `1ST TERM S1 FURTHER MATHEMATICS.doc`, SHA-256 `995cba8c37479850ffa65824ad90df34c3294c970f091c8a576d7831a7839145` **verified**; source `SS1-SRC-e9efc9a976ed`.
- Container supplied: a "1st Term SS1" zip (SHA-256 `8055d852938afa44d20b03139af9958b0c9f7da6874419aa667174854895e636`), member path `1st Term SS1 /1ST TERM S1 FURTHER MATHEMATICS.doc`. The composite archive hash (`024487…c9a3e`) was **not** checked.
- Source read with word-extractor `getBody()` (the importer's call); the SHA-256 of lines 65–144 re-derives the row id `621448ae…4cc2`. PR71 lesson read from the immutable commit `b5ced7ebb0efe22df2351baa140266fbf40cbf41`; the package blob there is `2a5849ac9566caebd8051af526e492d983f3a3ee` (matches the prompt).

## Comparison: PR71 `SUP-SS1-FMATHS-001` against the Week 1 defect list
- **Arithmetic:** all seven worked examples and five practice answers recomputed and correct.
- **Not reusable as written:** says a is multiplied by itself m times (defect 4); states every law for non-zero reals and rational indices, wrong for even roots of negative bases (defect 5); seven laws against the source's eight; free-text marking with no integer marks; five practice items; two references that are preface pages. It uses a different schema (`term_label`, `covers_objectives`, `content_hash`), so it could not be copied.
- **Decision:** reusable only after correction, so one supplement was authored in master's schema, keeping PR71's choice of topics and rewriting all text. Only ONE replacement is added.

## The ported lesson
- `lessons[id=SUP-SS1-FURTHER-MATHEMATICS-T1-W01-INDICES]`: definition with m factors; Laws 1–8 each with a reason or example; conditions stated; Example A–E; nine original answered practice items (30 marks, every breakdown sums); every index, root and fraction written explicitly. `body_sha256` `7745eb2b4ea9f09762f8fefac60339a4a998569ac635b13ceca9d6ab4aa2d4c8` over the UTF-8 body. State: content approval PENDING, implementation IMPLEMENTED, verification DEFERRED.
- All numbers in the body and answer key were recomputed with sympy (exact rationals) before filing.
- **Reference checked:** OpenStax Intermediate Algebra section 8.3, opened on 28 October 2026. It confirms the `a ≠ 0` conditions, the root-first method and that (−16)^(1/4) has no real value. It is cited with CC BY attribution; nothing was copied. PR71's two preface references were dropped. The reading assignment in the source (page range) was not checked.

## Coverage
- `COV-FM-T1-W01-OBJ-1` → IMPLEMENTED_EQUIVALENT (definition and eight laws).
- `COV-FM-T1-W01-OBJ-2` stays PARTIAL: exponential-equation items (source weekend items 1, 3, 4) belong to scheme week 2 and are not reproduced, pending FM-WK-T1-W02; general evaluation (f) is not reused (intended exponent unconfirmed); reading assignment unchecked.
- Both entries keep the row id in `lesson_ids` and add the new lesson id. The three `OI-FM-T1-W01-*` open items are unchanged and remain blocking.

## Edits
- `further-mathematics.json`: one lesson added; two coverage entries updated. No delivery correction, asset, rule or other lesson touched.
- `QUEUE.json`: FM-PORT-D3-L001 → IMPLEMENTED_TESTING_DEFERRED; counts and `next_runnable` recomputed (first dependency-satisfied PENDING item in queue order).

## Remaining
- `FM-LES-T1-W01-INDICES` can be closed by reference to this lesson (that item's own completion condition allows it); `FM-COR-T1-W01` then binds the row. Owner or teacher approval, and verification, are not invented.

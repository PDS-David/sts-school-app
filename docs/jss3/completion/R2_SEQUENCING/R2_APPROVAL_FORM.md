# R2 / Task 05 approval form — `S-PREP-PROPOSAL-v2`

Supersedes the blank v1 form for decisions. All v1 files are unchanged. **Nothing is approved until the owner (or a person the owner names in writing) commits the response file in step 3 and the hashes below still match.**

## 1. Proposal this form binds to

| Item | Value |
|---|---|
| Evidence baseline | `master` @ `d1c5f6ac802ff490330f052806a08ca0d57532a5` (171 supplements, 313 originals) |
| `PLACEMENT_PROPOSAL_R2.csv` | `d6ea6959452b3e213a029c727a17d8c570c1058c32e6771a39353c34d07f522b` |
| `R2_RELATION_DECISIONS.csv` | `afe2baa07be74c3515d6be4791920daf9f308af95af918a7e6b4bc889564bf8d` |
| `../S_PREP/POLICY_PROPOSAL.md` | `f13a82933c810c9ee4c2e0e604745c0e8f81c0b4f2cae27e8e3c48e097c0b0ad` |
| **Combined hash** | `a86989bf0c3711b25f84a24ecd26d625f23e5b0924d811506266310820f11e15` |

Combined = SHA-256 of these four lines, each ending `\n`: `S-PREP-PROPOSAL-v2`, the baseline SHA, `PLACEMENT_PROPOSAL_R2.csv <sha>`, `R2_RELATION_DECISIONS.csv <sha>`, `POLICY_PROPOSAL.md <sha>` (that order). Regenerate with `python3 scripts/jss3/build_r2_placement_proposal.py --archive <JSS3_NEXT_STAGE_INPUTS_20261016.zip>`; verify committed files with `--check`.

## 2. Decisions already answered (do not ask again)

Owner reply in chat, 24 Oct 2026, to the D1–D8 list: **"Okay. Go by your recommendations."** Recorded as:

| # | Recorded choice | Affects students |
|---|---|---|
| D1 | Placed supplements do **not** gate later originals; legacy floor keeps anything open today open | Yes |
| D2 | Passed topics **and** the open-but-unpassed frontier stay open (holds automatically under D1) | Yes |
| D3 | No supplement before original #1; original #1 keeps the PIN identity | Yes |
| D4 | Supplements without an approved placement stay appended at the end | Yes |
| D5 | Evidence rule as in the v1 form (read conservatively, see step 3) | No |
| D8 | Implementation of sequencing authorised | No |

This is the owner's chat answer, not a committed signature. The sign-off block below is still blank.

## 3. Still needed from the owner

1. **D6** — the exact `school_code` value(s) to activate first (JSS 3, First and Second Term only). *Affects students.*
2. **D7** — `TERM_PIN_ENFORCED` at activation: On or Off (today's default is Off). *Affects students.*
3. **Placement response** — fill `PLACEMENT_APPROVAL_RESPONSE_TEMPLATE.csv` and commit it as `PLACEMENT_APPROVAL_RESPONSE.csv`. The template's `decision` and approver columns are **empty**; `recommended_decision` is advice, not an approval.

| Recommended | Rows | Who decides |
|---|---:|---|
| `APPROVE_AS_PROPOSED` (anchor checked against the original lesson text, independent overlap agrees) | 90 | Owner |
| `PENDING` (anchor is MEDIUM/LOW, or overlap does not agree) | 37 | A named teacher confirms, overrides, or sets `KEEP_AT_END` |
| `KEEP_AT_END` (no supported anchor) | 44 | Stays appended unless a teacher picks an anchor |

Fill, per row: `decision` (`APPROVE_AS_PROPOSED`, `OVERRIDE` + `approved_after_original_index`, `KEEP_AT_END`, `PENDING`), `approver_name`, `approver_role`, `decided_on`, `basis`. Rows left out or `PENDING` stay appended. A scheme week is not an anchor.

**What students see:** an approved supplement appears between its anchor and the next original; originals keep today's lock chain; an unplaced supplement can open earlier than today, never later.

## 4. What changed since v1

* Supplements: 170 → **171** (`SUP-YO-IWI-TEXT` added; no original match, stays appended). Tasks 02 and 03 added none; Task 04 (Ọya) is blocked, so no Ọya lesson exists.
* Anchors: 127 proposed (98 HIGH, 22 MEDIUM, 7 LOW); 44 unresolved (was 147). 13 unchanged from v1, 104 new, none dropped.
* Ten v1 anchors moved after reading the original lessons: `SUP-BS-OZONE-CLIMATE` 8→9, `SUP-CIVIC-SELF-EMPLOYMENT` 5→6, `SUP-MUSIC-STAFF-TO-SOLFA` 9→10, `SUP-AGRIC-RECORDS` 3→4, `SUP-BT-TROUBLESHOOT` 14→11, `SUP-BT-ELECTRONIC-DEVICES` 14→13, `SUP-CIVIC-FREE-FAIR` 2→7, `SUP-CIVIC-CONSTITUTION` 8→10, `SUP-HE-CHILD-STAGES` 9→10, `SUP-YO-MARRIAGE` 6→3.
* Limit: anchors are my reading of titles, bodies and "Link to your notes" lines plus a keyword cross-check, not a teacher's judgement. For 20 rows the keyword check does not support the named originals: 16 of them carry an anchor and are `PENDING`; the other 4 are strand-only and stay appended.

## 5. Sign-off (blank)

| | |
|---|---|
| Approver name | |
| Role / authority | |
| Date | |
| Combined hash confirmed (paste) | |
| Commit reference | |

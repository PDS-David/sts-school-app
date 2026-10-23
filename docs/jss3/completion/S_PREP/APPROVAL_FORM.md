# S-PREP approval form — `S-PREP-PROPOSAL-v1`

**This form is blank. No decision below has been made by the owner.** Nothing in the repository treats any item as approved until a completed copy of this form is committed by the owner (or a person the owner designates in writing) and passes the hash check.

## 1. Exact proposal being approved

| Item | Value |
|---|---|
| Proposal version | `S-PREP-PROPOSAL-v1` |
| Repository / base | `PDS-David/sts-school-app`, `master` @ `3d0b78adf37f4b373b0c42caa44a0102bbce06b0` |
| `PLACEMENT_PROPOSAL.csv` SHA-256 | `e11762990137e2ef03ef6a1f8c3875b6e649c6ee78e8b3082386a54bb5b1617f` |
| `POLICY_PROPOSAL.md` SHA-256 | `f13a82933c810c9ee4c2e0e604745c0e8f81c0b4f2cae27e8e3c48e097c0b0ad` |
| Combined proposal hash | `5e53dbfcb6000352e192c000ea78f8631453c5248f83c57b661dc4bff0d645ed` |

Combined hash = SHA-256 of the UTF-8 text
```
S-PREP-PROPOSAL-v1
<base SHA>
PLACEMENT_PROPOSAL.csv <csv sha256>
POLICY_PROPOSAL.md <policy sha256>
```
(each line ending with `\n`). Verify before signing:
```bash
sha256sum docs/jss3/completion/S_PREP/PLACEMENT_PROPOSAL.csv docs/jss3/completion/S_PREP/POLICY_PROPOSAL.md
```
If either file differs from the table, **this form does not apply** to it; a new proposal version and form are required. Regenerating the CSV: `python3 scripts/jss3/build_s_prep_placement_proposal.py` (deterministic).

## 2. Policy decisions (tick exactly one per row; leave unticked if undecided)

| # | Decision | Recommended | Choice |
|---|---|---|---|
| D1 | Do placed supplements gate later originals? | **No (non-gating) + legacy floor** | ☐ No, as recommended  ☐ Yes (gating; requires frontier snapshot, see Policy §2) ☐ Undecided |
| D2 | Protect returning students | **Invariant: any passed or legacy-open topic stays open** (automatic under D1=No) | ☐ Approve as recommended  ☐ Approve with snapshot (only with D1=Yes)  ☐ Undecided |
| D3 | May a supplement precede original #1? | **No; PIN identity of original #1 stays** | ☐ No, as recommended  ☐ Yes (state reason): ________  ☐ Undecided |
| D4 | Supplement with no approved placement | **Stay appended at the end (legacy behaviour)** | ☐ As recommended  ☐ Other: ________  ☐ Undecided |
| D5 | Minimum evidence for a placement to be approved | MEDIUM rows need a named teacher's confirmation or private-archive check; LOW and UNRESOLVED rows need both a teacher's choice and archive/teacher verification | ☐ As recommended  ☐ Other: ________ |
| D6 | Scope of first activation | Named `school_code` values, JSS 3, First and Second Term only | School codes: ________ |
| D7 | `TERM_PIN_ENFORCED` state at activation (today default off) | Owner to state intended value | ☐ On  ☐ Off  ☐ Not applicable |
| D8 | Authorisation to **start** sequencing implementation (Task 05) | Separate, explicit | ☐ Authorised  ☐ Not authorised |

## 3. Placement decisions

The proposal lists 170 supplements: 16 MEDIUM, 7 LOW, 147 UNRESOLVED. Record placement decisions in a **new** file `PLACEMENT_APPROVAL_RESPONSE.csv` (do not edit the proposal CSV; that would change its hash) with columns:

`supplement_id, decision, approved_after_original_index, approver_name, approver_role, decided_on, basis`

* `decision` ∈ `APPROVE_AS_PROPOSED` (only for rows whose `proposed_status` is `PROPOSED`), `OVERRIDE` (supply `approved_after_original_index`, an integer from 1 to the bucket's `current_original_count`), `KEEP_AT_END`, `PENDING`.
* `basis` names the evidence (e.g. "checked against source row #n title", "teacher confirmation"). A scheme week or list-item number is **not** an `approved_after_original_index`.
* Rows missing from the response file are `PENDING` and stay appended.

## 4. Sign-off

| | |
|---|---|
| Approver name | |
| Role / authority | |
| Date | |
| Combined proposal hash confirmed (paste) | |
| Signature / commit reference | |

## 5. Decisions still needed to unlock implementation

D1–D8 above and a response file for every supplement the school wants placed. Anchors for the 147 UNRESOLVED rows need the private source archive (`JSS3_NEXT_STAGE_INPUTS_20261016.zip`, SHA-256 `0a5b0d929e1dc61801cde43f8a85235d2e236ced334d2091583f5fa16524ea3c`) or a teacher's choice.

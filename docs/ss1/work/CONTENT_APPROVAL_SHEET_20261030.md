# Content-approval protocol and sheet — 30 October 2026 (UNR-04)

Base: `origin/master` `b94c6ea` (counts re-read from the packages at this SHA; the bookkeeping row was refreshed after BK-WK-T1-W02, PR #263). Status: `IMPLEMENTED_TESTING_DEFERRED`. This is a protocol and a blank sheet. **No approval is recorded, no approver is named, no `content_approval` was changed to APPROVED, and no package or queue was edited.** Every signature field below is `PENDING`. Nothing was run (no tests, typechecks, compiler or importer).

## 1. What the contract and compiler require

- Each lesson and each asset carries `state.content_approval` (`PENDING`/`APPROVED`) and `state.approval_reference` (a non-empty evidence reference, or null). The contract forbids agents from inventing either (`docs/ss1/contracts/CONTRACT.md`, "state").
- `backend/src/db/ss1/compiler.ts` raises `LESSON_NOT_APPROVED:<id>` unless a lesson is `IMPLEMENTED`, `APPROVED`, has a non-empty `approval_reference`, and every provenance entry has `reuse_status` `PERMITTED`. Assets get the same check.
- Approval is a separate state from implementation and verification. An approval does not set `verification` to `VERIFIED`; that needs later evidence.
- Source-alias approvals (`PENDING-OWNER` in `source_rules`) are a different thing. They confirm a source heading maps to a subject. They are tracked by `DEC-AL` in `BLOCKED_DECISIONS_20261030.md` and are not closed by a content signature.

## 2. Minimum content of an `approval_reference`

One signature closes the item for a subject only if the signed record contains all six fields, and the string written into each lesson/asset names them:

| Field | Requirement |
|---|---|
| Role | Named role of the signer (for example "Subject teacher" or "Owner"), plus the signer's name. The owner decides who may sign for each subject. |
| Date | Date of the decision, `YYYY-MM-DD`. |
| Scope | The exact lesson IDs and asset IDs approved, or a stated exclusion list. Anything not listed is not approved. |
| Subject | The `subject_slug` and `canonical_subject` of the package. |
| Version | The git commit SHA of the package file reviewed, and the `body_sha256` of each approved lesson (listed in Annex A). A lesson whose body later changes has a different hash and needs a fresh signature. |
| Decision | `APPROVED`, or `RETURNED` with the defects listed (a returned lesson stays `PENDING`). |

Recommended single-line form for the package field, so it is greppable and bound to the record:

`CA|<subject_slug>|<YYYY-MM-DD>|<role>:<name>|<scope: all-lessons or ID list>|<package-commit-sha>|<sheet reference>`

where `<sheet reference>` points at the signed sheet kept outside the package (file name or message reference). The same string is copied to every lesson and asset in scope. It is a proposal for the owner to accept or change, not a rule the compiler enforces (the schema only needs non-empty text).

## 3. Procedure

1. The approver reads each lesson in Annex A's scope and records `APPROVED` or `RETURNED` per lesson on the sheet.
2. The owner or integration worker copies the reference string into `state.approval_reference` and sets `content_approval` to `APPROVED` only for lessons marked `APPROVED`.
3. The matching queue item (column "Queue item" below) may then be updated by the integrator. A subject whose lessons were only partly approved keeps its queue item open.
4. Approval does not clear the other delivery blockers in the package (Section 4 gives the counts).

## 4. Per-subject summary (counts read from the packages)

19 rows, one per blocked approval item. Coverage split uses the package statuses. "Blocking open items" counts items with `blocks_delivery: true`; approving lessons does not close these.

| # | Subject | Queue item | Lessons | Assets | Coverage entries (status split) | Blocking open items | Pending alias rules | What a signature would approve |
|---|---|---|---|---|---|---|---|---|
| 1 | agricultural-science | `AG-FACT-CONTENT-APPROVAL` | 0 | 0 | 0 (none) | 3 (OWNER_ACTION 3) | 3 of 3 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 2 | biology | `BIO-FACT-CONTENT-APPROVAL` | 0 | 0 | 0 (none) | 3 (OWNER_ACTION 3) | 3 of 3 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 3 | bookkeeping | `BK-FACT-CONTENT-APPROVAL` | 0 | 0 | 9 (PARTIAL 7, UNRESOLVED 2) | 9 (CONTENT 5, OWNER_ACTION 4) | 3 of 3 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 4 | catering-craft | `CC-FACT-CONTENT-APPROVAL` | 0 | 0 | 1 (PARTIAL 1) | 1 (OWNER_ACTION 1) | 2 of 2 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 5 | chemistry | `CHEM-FACT-CONTENT-APPROVAL` | 0 | 0 | 0 (none) | 4 (OWNER_ACTION 4) | 4 of 4 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 6 | civic-education | `CIV-FACT-CONTENT-APPROVAL` | 0 | 0 | 0 (none) | 3 (OWNER_ACTION 3) | 3 of 3 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 7 | commerce | `COM-FACT-CONTENT-APPROVAL` | 0 | 0 | 0 (none) | 3 (OWNER_ACTION 3) | 3 of 3 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 8 | data-processing | `DP-FACT-CONTENT-APPROVAL` | 0 | 0 | 0 (none) | 2 (OWNER_ACTION 2) | 2 of 2 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 9 | economics | `ECON-FACT-CONTENT-APPROVAL` | 0 | 0 | 0 (none) | 3 (OWNER_ACTION 3) | 3 of 3 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 10 | english | `ENG-FACT-CONTENT-APPROVAL` | 19 | 0 | 155 (PARTIAL 84, IMPLEMENTED_EQUIVALENT 45, SUPPORTED 13, UNRESOLVED 10, MARKER 3) | 13 (CONTENT 12, VERIFICATION 1) | 0 of 3 | 19 authored supplement lessons (1st Term 8, 2nd Term 5, 3rd Term 6); reuse basis and provenance of each; not the source coverage judgments. |
| 11 | financial-accounting | `FA-FACT-CONTENT-APPROVAL` | 0 | 0 | 0 (none) | 2 (OWNER_ACTION 2) | 2 of 2 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 12 | food-and-nutrition | `FN-FACT-CONTENT-APPROVAL` | 0 | 0 | 0 (none) | 2 (OWNER_ACTION 2) | 2 of 2 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 13 | french | `FR-FACT-CONTENT-APPROVAL` | 28 | 0 | 46 (IMPLEMENTED_EQUIVALENT 33, PARTIAL 10, UNRESOLVED 3) | 13 (CONTENT 8, FACT 3, OWNER_ACTION 2) | 0 of 3 | 28 authored supplement lessons (1st Term 10, 2nd Term 9, 3rd Term 9); reuse basis and provenance of each; not the source coverage judgments. |
| 14 | further-mathematics | `FM-FACT-CONTENT-APPROVAL` | 7 | 1 | 34 (PARTIAL 20, IMPLEMENTED_EQUIVALENT 7, MARKER 6, UNRESOLVED 1) | 9 (CONTENT 4, OWNER_ACTION 2, PERMISSION 2, FACT 1) | 3 of 3 | 7 authored supplement lessons (1st Term 1, 3rd Term 6) and 1 asset; reuse basis and provenance of each; not the source coverage judgments. |
| 15 | geography | `GEO-FACT-CONTENT-APPROVAL` | 0 | 0 | 0 (none) | 3 (OWNER_ACTION 3) | 3 of 3 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 16 | government | `GOV-FACT-CONTENT-APPROVAL` | 0 | 0 | 0 (none) | 3 (OWNER_ACTION 3) | 3 of 3 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 17 | literature | `LIT-FACT-CONTENT-APPROVAL` | 0 | 0 | 2 (MARKER 2) | 3 (OWNER_ACTION 3) | 3 of 3 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |
| 18 | mathematics | `MATH-APPROVAL-CONTENT` | 6 | 0 | 38 (PARTIAL 22, MARKER 9, IMPLEMENTED_EQUIVALENT 6, UNRESOLVED 1) | 6 (CONTENT 3, OWNER_ACTION 2, FACT 1) | 3 of 3 | 6 authored supplement lessons (1st Term 6); reuse basis and provenance of each; not the source coverage judgments. |
| 19 | physics | `PHYS-APPROVAL-CONTENT` | 0 | 0 | 4 (MARKER 4) | 3 (OWNER_ACTION 3) | 3 of 3 | Nothing: no lessons or assets exist. A signature now would approve nothing and must not be recorded. |

### Notes that affect the sheet

- **No lessons yet (15 of the 19 subjects; only English, French, Further Mathematics and Mathematics have lessons):** physics (see below), agricultural-science, biology, bookkeeping, catering-craft, chemistry, civic-education, commerce, data-processing, economics, financial-accounting, food-and-nutrition, geography, government, literature. Their queue items say there is nothing to approve. Leave them `PENDING` until lessons are authored; the signature block exists so it can be used later.
- **Physics:** `PHYS-APPROVAL-CONTENT` refers to five lessons (`PHYS-PORT-D1-T2-L001/L002`, `-T3-L003/L004/L005`) that exist only on the PR #71 branch, not on master. The master package has 0 lessons, so there is nothing to sign yet.
- **Mathematics:** six T1 lessons exist (W01, W03, W04, W05, W06, W10). The queue item `MATH-APPROVAL-CONTENT` lists exactly these six.
- **Further Mathematics:** the package holds 7 lessons: one 1st Term (`...-T1-W01-INDICES`) and six 3rd Term, plus the flowchart SVG asset. `FM-FACT-CONTENT-APPROVAL` and `OI-FM-005` name only the six 3rd Term lessons and the asset, so the T1 Week 1 lesson is not covered by any queue approval item. The sheet below includes it so the approver sees it; the owner should decide whether to extend the queue item.
- **French:** the package holds 28 lessons; the queue item text says "27", which is out of date (`SUP-SS1-FRENCH-NEIGHBOURS-T1` was added later). The sheet uses 28.
- **English:** 19 lessons, all `PENDING`. The three reading supplements are still pending binding to coverage (UNR-01), so their approval scope may change if their text changes.
- **Technical Drawing and Yoruba** have no approval queue item and no lessons. They are outside the 19.

## 5. Signature blocks

One block per subject. All fields are `PENDING`. Do not pre-fill. A subject with no lessons is marked "NOT APPLICABLE YET" by the integrator, never by a signer.


### 1. Agricultural Science (`agricultural-science`) — `AG-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 2. Biology (`biology`) — `BIO-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 3. Bookkeeping (`bookkeeping`) — `BK-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 4. Catering Craft (`catering-craft`) — `CC-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 5. Chemistry (`chemistry`) — `CHEM-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 6. Civic Education (`civic-education`) — `CIV-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 7. Commerce (`commerce`) — `COM-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 8. Data Processing (`data-processing`) — `DP-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 9. Economics (`economics`) — `ECON-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 10. English Language (`english`) — `ENG-FACT-CONTENT-APPROVAL`
Scope at drafting: 19 lessons, 0 assets (Annex A).

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 11. Financial Accounting (`financial-accounting`) — `FA-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 12. Food and Nutrition (`food-and-nutrition`) — `FN-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 13. French (`french`) — `FR-FACT-CONTENT-APPROVAL`
Scope at drafting: 28 lessons, 0 assets (Annex A).

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 14. Further Mathematics (`further-mathematics`) — `FM-FACT-CONTENT-APPROVAL`
Scope at drafting: 7 lessons, 1 assets (Annex A).

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 15. Geography (`geography`) — `GEO-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 16. Government (`government`) — `GOV-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 17. Literature-in-English (`literature`) — `LIT-FACT-CONTENT-APPROVAL`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 18. Mathematics (`mathematics`) — `MATH-APPROVAL-CONTENT`
Scope at drafting: 6 lessons, 0 assets (Annex A).

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

### 19. Physics (`physics`) — `PHYS-APPROVAL-CONTENT`
Scope at drafting: 0 lessons, 0 assets (Annex A). **Nothing to approve yet.**

| Field | Entry |
|---|---|
| Signer role | PENDING |
| Signer name | PENDING |
| Date | PENDING |
| Scope (IDs approved / excluded) | PENDING |
| Package commit SHA reviewed | PENDING |
| Decision per lesson (APPROVED / RETURNED) | PENDING |
| Defects returned (if any) | PENDING |
| `approval_reference` string to copy | PENDING |

## Annex A — lessons and assets in scope, with the hash an approval is bound to

Hashes are `body_sha256` values read from each package (first 16 hex characters shown; the full value is in the package). Assets show the file `sha256`. All current states are `content_approval: PENDING`, `approval_reference: null`.

| Subject | Lesson / asset ID | Term | Practice items | Hash (first 16) |
|---|---|---|---|---|
| english | `SUP-SS1-ENGLISH-WORD-CLASSES-T1` | 1st Term | 3 | `ecd8402e03e21cfa` |
| english | `SUP-SS1-ENGLISH-PHRASES-CLAUSES-T1` | 1st Term | 3 | `119a7559dfd40cf4` |
| english | `SUP-SS1-ENGLISH-PHONETICS-T1` | 1st Term | 3 | `5bade9733d303e9d` |
| english | `SUP-SS1-ENGLISH-LETTERS-T1` | 1st Term | 3 | `54b42b21fb0c1b74` |
| english | `SUP-SS1-ENGLISH-AFFIXES-T2` | 2nd Term | 3 | `96c15f6b58eb8699` |
| english | `SUP-SS1-ENGLISH-READING-T2` | 2nd Term | 3 | `7c5883178f99e9d6` |
| english | `SUP-SS1-ENGLISH-MEANING-T2` | 2nd Term | 3 | `2ef041fcc51633f4` |
| english | `SUP-SS1-ENGLISH-ADVERBS-TENSE-T2` | 2nd Term | 3 | `d4ce742b5f802886` |
| english | `SUP-SS1-ENGLISH-ESSAY-TYPES-T2` | 2nd Term | 3 | `e31d747d6cc58c94` |
| english | `SUP-SS1-ENGLISH-PHONETICS-T3` | 3rd Term | 3 | `5bade9733d303e9d` |
| english | `SUP-SS1-ENGLISH-AFFIXES-T3` | 3rd Term | 3 | `96c15f6b58eb8699` |
| english | `SUP-SS1-ENGLISH-STRESS-T3` | 3rd Term | 3 | `8df0269eee4c1bcc` |
| english | `SUP-SS1-ENGLISH-PHRASES-CLAUSES-T3` | 3rd Term | 3 | `119a7559dfd40cf4` |
| english | `SUP-SS1-ENGLISH-MEANING-T3` | 3rd Term | 3 | `2ef041fcc51633f4` |
| english | `SUP-SS1-ENGLISH-READING-T1` | 1st Term | 3 | `7c5883178f99e9d6` |
| english | `SUP-SS1-ENGLISH-READING-T3` | 3rd Term | 3 | `7c5883178f99e9d6` |
| english | `SUP-SS1-ENGLISH-NOUNS-T1` | 1st Term | 8 | `80ff216ed29a38c0` |
| english | `SUP-SS1-ENGLISH-PRONOUN-ADJ-VERB-T1` | 1st Term | 10 | `cd32486d12e63074` |
| english | `SUP-SS1-ENGLISH-MEANING-T1` | 1st Term | 8 | `c3655c8969428d35` |
| french | `SUP-SS1-FRENCH-PURPOSE-T1` | 1st Term | 3 | `5461a11f8cae46ff` |
| french | `SUP-SS1-FRENCH-COUNTRIES-T1` | 1st Term | 4 | `863051d9148d0e4b` |
| french | `SUP-SS1-FRENCH-GREETINGS-T1` | 1st Term | 3 | `0ab4d6296cfc651d` |
| french | `SUP-SS1-FRENCH-AUXILIARIES-T1` | 1st Term | 3 | `4cd0a2b8dbe03b4c` |
| french | `SUP-SS1-FRENCH-ACCENTS-T1` | 1st Term | 3 | `50abf37602ce87d5` |
| french | `SUP-SS1-FRENCH-PROFESSIONS-T1` | 1st Term | 4 | `01117b7b6e950977` |
| french | `SUP-SS1-FRENCH-ENVIRONMENT-T1` | 1st Term | 3 | `88997e296a09e6c7` |
| french | `SUP-SS1-FRENCH-ROUTINE-T1` | 1st Term | 3 | `a8f32b76f2f7400e` |
| french | `SUP-SS1-FRENCH-PREFERENCES-T1` | 1st Term | 3 | `e83e0bde336d1f5c` |
| french | `SUP-SS1-FRENCH-ACCENTS-T2` | 2nd Term | 3 | `50abf37602ce87d5` |
| french | `SUP-SS1-FRENCH-ALPHABET-T2` | 2nd Term | 3 | `95f0e1d5c7631b40` |
| french | `SUP-SS1-FRENCH-SOUNDS-T2` | 2nd Term | 4 | `72472f94c9b1afb7` |
| french | `SUP-SS1-FRENCH-CULTURE-T2` | 2nd Term | 4 | `383ac543e43181b8` |
| french | `SUP-SS1-FRENCH-TRANSPORT-T2` | 2nd Term | 3 | `eedee7548da001da` |
| french | `SUP-SS1-FRENCH-FLIGHT-T2` | 2nd Term | 3 | `4319ddda2231b879` |
| french | `SUP-SS1-FRENCH-IMPARFAIT-T2` | 2nd Term | 3 | `c135f63e2bd5e7f6` |
| french | `SUP-SS1-FRENCH-PASSE-T2` | 2nd Term | 3 | `f0c8bdc478743d86` |
| french | `SUP-SS1-FRENCH-DIALOGUE-T3` | 3rd Term | 3 | `4aec03762d75c155` |
| french | `SUP-SS1-FRENCH-CHANGE-T3` | 3rd Term | 3 | `fb1effc46f6fecfa` |
| french | `SUP-SS1-FRENCH-REACTIONS-T3` | 3rd Term | 3 | `2ecb4af1fd672df1` |
| french | `SUP-SS1-FRENCH-PREFERENCES-T3` | 3rd Term | 3 | `e83e0bde336d1f5c` |
| french | `SUP-SS1-FRENCH-OPINION-T3` | 3rd Term | 3 | `8dd7ca4059e9bf01` |
| french | `SUP-SS1-FRENCH-ILLNESS-T3` | 3rd Term | 3 | `3065292cefe2577a` |
| french | `SUP-SS1-FRENCH-GRAMMAR-T3` | 3rd Term | 3 | `6806a4804d7be345` |
| french | `SUP-SS1-FRENCH-REPORTED-T3` | 3rd Term | 3 | `5899078ad09a58a4` |
| french | `SUP-SS1-FRENCH-VOCABULARY-T3` | 3rd Term | 3 | `6e56c09577c3d3b9` |
| french | `SUP-SS1-FRENCH-FUTURE-T2` | 2nd Term | 3 | `0dfb757147c2833e` |
| french | `SUP-SS1-FRENCH-NEIGHBOURS-T1` | 1st Term | 5 | `557779b0abb60d59` |
| further-mathematics | `SUP-SS1-FURTHER-MATHEMATICS-T1-W01-INDICES` | 1st Term | 9 | `7745eb2b4ea9f097` |
| further-mathematics | `SUP-SS1-FURTHER-MATHEMATICS-T3-W02-FLOWCHARTS` | 3rd Term | 3 | `5511cd2e24491fbd` |
| further-mathematics | `SUP-SS1-FURTHER-MATHEMATICS-T3-W03-GRADIENTS-LINES-CURVES` | 3rd Term | 4 | `acefbf08971d907e` |
| further-mathematics | `SUP-SS1-FURTHER-MATHEMATICS-T3-W04-SLOPE-PARALLEL-PERPENDICULAR` | 3rd Term | 4 | `c3972c936d5b3121` |
| further-mathematics | `SUP-SS1-FURTHER-MATHEMATICS-T3-W05-VECTOR-MAGNITUDE-UNIT` | 3rd Term | 3 | `d7a2fd501d1252d9` |
| further-mathematics | `SUP-SS1-FURTHER-MATHEMATICS-T3-W06-VECTOR-OPERATIONS-DIRECTION-COSINES` | 3rd Term | 3 | `75b626ed82c9d0fd` |
| further-mathematics | `SUP-SS1-FURTHER-MATHEMATICS-T3-W08-ANGLE-BETWEEN-LINES-EQUATION-FORMS` | 3rd Term | 5 | `92163f67f88ed985` |
| further-mathematics | `ASSET-SS1-FM-T3-W02-FLOWCHART-PERIMETER` (asset) | — | — | `c90c42d558ea2d20` |
| mathematics | `SUP-SS1-MATHEMATICS-T1-W01-DIVISIBILITY-INTEGERS` | 1st Term | 3 | `03206bf6b426ad0c` |
| mathematics | `SUP-SS1-MATHEMATICS-T1-W03-BASE-OPERATIONS` | 1st Term | 3 | `9782d282a763a2d9` |
| mathematics | `SUP-SS1-MATHEMATICS-T1-W04-MODULAR-ARITHMETIC` | 1st Term | 3 | `0ed48fe41aba6d86` |
| mathematics | `SUP-SS1-MATHEMATICS-T1-W05-STANDARD-FORM` | 1st Term | 3 | `91ff1d9f686a94b8` |
| mathematics | `SUP-SS1-MATHEMATICS-T1-W06-INDICES` | 1st Term | 3 | `536e4fb821bf48ea` |
| mathematics | `SUP-SS1-MATHEMATICS-T1-W10-EQUATIONS-VARIATION` | 1st Term | 4 | `7694cd042c0e1013` |

Total lessons listed: 60.

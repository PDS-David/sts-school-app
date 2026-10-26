# R2 approval response → JSS3 sequence plan

**Implementation provided; tests deliberately not run, per the owner.** This
tool closes the CSV-to-plan conversion implementation, not placement approval,
DB verification or activation. It is separate from SS1 and PR66's validator fix.

## Files and scope

* New tool: `scripts/jss3/convert_placement_approvals.py` (Python3.10+ standard library).
* Existing input template: `docs/jss3/completion/R2_SEQUENCING/PLACEMENT_APPROVAL_RESPONSE_TEMPLATE.csv`.
* New authority template: `PLACEMENT_AUTHORIZATION_TEMPLATE.json` in this directory.
* Deferred tests: `tests/test_jss3_placement_converter.py`.
* Runtime consumer, unchanged: `backend/src/db/jss3SequencePlan.ts` and
  `backend/src/db/applyTopicSequence.ts`.

The tool never imports application/database modules, reads DB credentials,
connects to a database/network, changes the shipped plan, activates ranks, edits
student progress, or changes TERM_PIN_ENFORCED. It writes only a new output
directory explicitly chosen by the operator. It reads seven inputs once and
binds their exact bytes to the owner's reviewed hashes.

## Prerequisites—do not invent these

1. A real owner/delegate response to `R2_APPROVAL_FORM.md`. D1–D5/D8 already
   recorded there are not asked again. D6 school_code(s), D7 PIN on/off and
   actual per-lesson decisions still need their recorded answers.
2. A copy of the response template, normally named
   `PLACEMENT_APPROVAL_RESPONSE.csv`, containing the actual decisions. Keep the
   nine informational columns unchanged. Blank or omitted rows remain PENDING;
   recommendations never become approvals automatically. Rows may be reordered.
3. A private `original-rows.json` from the real importer capture. Its rows use
   `className`, `termLabel`, `subjectName`, `orderIndex`, `title`,
   `sourceReference`, `filePath` (extra capture fields are allowed). This is not
   a DB export or a supplemented-row capture. No corpus rerun is required merely
   to implement this converter; use the later verified candidate capture when
   actually converting. It is not the protected2179 baseline.
4. Current checked-in `PLACEMENT_PROPOSAL_R2.csv`, the blank response template,
   `R2_RELATION_DECISIONS.csv`, `S_PREP/POLICY_PROPOSAL.md`, and
   `backend/src/db/data/jss3Supplements.json`. The CLI always reads these from its
   checkout. It cannot be redirected to a different catalog using CLI flags.
   If source/lesson metadata changed, refresh the proposal and obtain review of
   the updated inputs instead of copying old approval hashes.

## Complete the authority record

Copy the new JSON template to a file such as `placement-authorization.json`.
The shipped blank template is intentionally rejected. Populate from the real
owner record, not an agent's assumption:

| Field | Required meaning |
|---|---|
| plan_version | New version identifier using letters/digits/dot/underscore/hyphen; no surrounding whitespace. Choose a version not already applied; the converter has no DB history. |
| owner_name | Actual authorising person's name. |
| owner_authority_reference | Specific recorded owner sign-off/delegation (commit/message/document/date reference), not a placeholder. |
| approved_on | Real calendar date YYYY-MM-DD of that sign-off. |
| school_codes | Nonempty, unique exact authorised code(s), no defaults. |
| term_pin_enforced | Boolean true/false from D7, not a string or null. Recorded in the receipt only; changing backend configuration is a later operation. |
| approvers | Each permitted name/role pair and its owner-authority reference. Include the owner here if the owner signs response rows. |
| reviewed_inputs | Seven SHA-256 values, matching the files below byte-for-byte, approved as part of that same sign-off. |

Names/references are **provenance, not digital signatures**. The converter does
not authenticate who filled the files or decide whether a person has school
authority. The owner/integrator must review and commit the actual response and
authority record as the approval form requires before activation. Never publish
private conversation text or student data; use an appropriate approval reference.

Hash keys map to these exact inputs (hash with `sha256sum` or PowerShell
`Get-FileHash -Algorithm SHA256`; use lowercase hex):

| reviewed_inputs key | File |
|---|---|
| response_csv | Completed response supplied with --response |
| original_rows_json | Private original capture supplied with --originals |
| proposal_csv | docs/jss3/completion/R2_SEQUENCING/PLACEMENT_PROPOSAL_R2.csv |
| response_template_csv | docs/jss3/completion/R2_SEQUENCING/PLACEMENT_APPROVAL_RESPONSE_TEMPLATE.csv |
| supplements_json | backend/src/db/data/jss3Supplements.json |
| relations_csv | docs/jss3/completion/R2_SEQUENCING/R2_RELATION_DECISIONS.csv |
| policy_md | docs/jss3/completion/S_PREP/POLICY_PROPOSAL.md |

Changing whitespace/line endings changes the hash. Do not rehash altered
approved files and silently treat them as still owner-approved. The per-file
hash record is additional input binding, not a replacement for the existing
R2 sign-off/proposal review.

## Decision rules

* `APPROVE_AS_PROPOSED`: actual approver name/role/date/basis required; an original
  proposed anchor must exist. The optional approved index must be blank or equal
  to the proposed index. This is an explicit decision even if recommendation is
  PENDING; recommendation alone never authorises anything.
* `OVERRIDE`: same sign-off requirements and an explicit positive integer
  approved_after_original_index. It must be an original in this lesson's same
  JSS3 subject/term bucket. Cross-subject/term/zero/supplement anchors are rejected.
* `KEEP_AT_END`: an explicit signed disposition; no approved index. The emitted
  plan contains no approver/anchor/date for this unapproved placement; the
  reviewed response retains the disposition's provenance.
* `PENDING`: may be bare, or fully signed with a basis; partial signatures are
  rejected. No approved index. Blank/omitted rows also become PENDING.
* Signed dates must be actual calendar dates no later than the owner sign-off.
  Basis is at least10 non-whitespace characters. Every signing name/role pair
  must appear in the authority record. Approval intent is not inferred from a
  title, recommendation, week number, confidence or word overlap.

The tool rejects duplicate/unknown IDs, duplicate JSON keys, malformed CSV,
changed informational cells, stale title/subject/term/bucket metadata and
reviewed-byte hash mismatches. It checks proposed-anchor body hashes against
the proposal's recorded source evidence. Template/proposal previews are80
characters by design; the emitted plan uses the **full original anchor title**.
Plan rows are sorted by supplement ID, and school codes sorted; existing runtime
apply logic determines same-anchor display order using stored original append
order, not this JSON array order.

## Conversion—later, once real decisions exist

From repository root, using actual paths (the parent of NEW_OUTPUT_DIR must
already exist):

```bash
python3 scripts/jss3/convert_placement_approvals.py \
  --response /private/PLACEMENT_APPROVAL_RESPONSE.csv \
  --authorization /private/placement-authorization.json \
  --originals /private/capture/original-rows.json \
  --output /private/NEW_OUTPUT_DIR
```

Outputs:

* `jss3SequencePlan.json`: exactly the runtime's plan fields; only explicit
  approvals have status APPROVED and full anchor/approval metadata.
* `conversion-receipt.json`: reviewed hashes, authority reference, plan-byte
  hash, D6/D7 values, per-ID disposition and counts, status
  `CONVERTED_NOT_ACTIVATED`. No source bodies are copied.

Exit0 means conversion succeeded; exit2 means refusal (argparse also uses2 for
bad CLI syntax). Existing output files/directories/symlinks are never overwritten.
All semantic checks complete before creating output. An OS failure while writing
may leave a partial new output directory: do not use it; choose a fresh directory
after correcting the OS problem. No force/overwrite/apply option exists.

Do not copy the generated plan into the shipped data file automatically. Review
the bundle, commit the real approval record, run the deferred verification, and
then separately authorise a designated staging/production apply through the
existing tool. This converter does not change school/PIN configuration or check
whether school codes exist in a real DB. An empty set of APPROVED rows is a valid
inert conversion, not a successful activation or a reason to release holds.

## Deferred verification commands

No commands below were executed for this delivery. At the owner's later testing
stage, run from repository root:

```bash
python3 -m unittest discover -s tests -p test_jss3_placement_converter.py
```

For an actual generated candidate, verify compatibility with the existing
TypeScript consumer (Node24.19.0, locked dependencies, no database):

```bash
node --import tsx --input-type=module -e '
import {readFileSync} from "node:fs";
import {validateSequencePlan} from "./backend/src/db/jss3SequencePlan.ts";
validateSequencePlan(JSON.parse(readFileSync(process.argv[1], "utf8")));
console.log("Plan schema accepted; nothing applied");
' /private/NEW_OUTPUT_DIR/jss3SequencePlan.json
```

Then run the existing JSS3 sequence unit/real-PostgreSQL suites in the later full
acceptance phase. The new Python suite is invoked explicitly by the command
above; no CI/SS1 runner was changed or falsely claimed to register it.

## Delivery record

Base: `198b86eae4b6b9384d0cd2932f8bac02b1e383fb`.
Only a new JSS3 script, JSS3 Python tests and this directory's converter docs/
blank authority template are owned by this task. No SS1 file, active plan,
application route, DB code, existing CSV, approval or lesson was edited.
Implementation/diff reviewed only. No test, typecheck, importer dry run,
conversion of real decisions, database connection, import or activation run.

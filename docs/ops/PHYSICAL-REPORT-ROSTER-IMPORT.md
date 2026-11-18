# Physical report-roster import

This importer reads the supplied historical `Student_Roster_Reconciliation_with_Identities.xlsx` workbook. It is separate from online learner registration and does not create student login accounts.

## Source and class mapping

The importer reads the `Teacher Verification` sheet and validates both historical identity and the current-enrolment decision:

- Student Name, Last-Term Class and School Section
- Roster Identity and Internal Student UUID
- Current Enrolment Status and Current Class (verified)
- Verified By and Verification Date
- Evidence / Notes for transfers and leavers
- Matched Production Student ID when an existing online student record has been positively identified

The historical class is provenance only. It is never assumed to be the current class. The active physical report-roster placement comes from the verified Current Class field.

| Historical source class | Historical reference class | School |
|---|---|---|
| Grade 1–5 | Primary 1–5 | Primary |
| JSS1–3 | JSS 1–3 | Secondary |
| SS1–2 | SS 1–2 | Secondary |

The current-class dropdown also supports the school's other current classes (Pre-Nursery, Reception, Nursery, KG, Primary 1–6, JSS 1–3 and SS 1–3). The selected class must belong to the student's school section.

## Mandatory verification gate

The workbook's allowed Current Enrolment Status values are:

- `Still enrolled - same class`
- `Promoted`
- `Retained`
- `Transferred`
- `Left school`
- `Unverified`
- `Awaiting confirmation`

Only the first three can become active report-roster memberships. They require a verified current class, a non-empty verifier and a valid verification date. A same-class or retained record must keep its historical class; a promoted record must have a different verified current class.

Transferred and Left school records require a verifier, date and evidence/notes. They are skipped and never become active report-roster memberships.

`Unverified`, `Awaiting confirmation`, missing verifier/date, missing current class, invalid class/section combinations or invalid matched production IDs stop the entire import. The command does not partially import the remaining rows.

The supplied workbook currently has all 104 rows marked `Unverified`, with the current class, verifier, date and matched production ID fields blank. **It will therefore reject the workbook as-is.** The rows must first be checked against current school records and updated by an authorised school administrator. Do not change the status just to make the import pass.

## Identity and separation safeguards

- The deterministic Internal Student UUID is used for a new student-row identity only when Matched Production Student ID is blank.
- If Matched Production Student ID is filled, that exact existing production student must exist and match the verified name and school. The importer will not create a replacement if the match is missing.
- The importer does not invent admission numbers or online login accounts.
- Existing online student class, login links and academic history are not rewritten.
- `source_class_name` preserves the historical class; active membership `class_name` uses the verified current class.
- Transfers and leavers are counted as skipped rows.
- The legacy HTML report-card importer is disabled for writes because historical report cards alone cannot establish current enrolment.

## Safe execution

The command is dry-run by default:

```powershell
cd backend
node --import tsx src/db/importPhysicalReportRoster.ts --file="C:\path\to\Student_Roster_Reconciliation_with_Identities.xlsx"
```

Review the dry-run summary and resolve all conflicts. The importer refuses soft-deleted students, ambiguous same-name records, missing matched production records, administrator-removed memberships and active memberships whose class has changed.

Writes require the explicit `--apply` flag:

```powershell
node --import tsx src/db/importPhysicalReportRoster.ts --file="C:\path\to\Student_Roster_Reconciliation_with_Identities.xlsx" --apply
```

Before any production apply:

1. Confirm migrations 0001–0006 are applied through the guarded production migration workflow.
2. Create and verify a fresh encrypted production backup.
3. Review the dry-run summary and resolve all reported conflicts.
4. Obtain explicit production-import approval.

The workbook is not stored in the repository. No records are imported merely by deploying the application.

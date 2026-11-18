# Physical report-roster import

This importer reads the supplied historical `Student_Roster_Reconciliation_with_Identities.xlsx` workbook. It is separate from online learner registration and does not create student login accounts.

## Source and class mapping

The importer reads only the `Teacher Verification` sheet's historical identity columns:

- Student Name
- Last-Term Class
- School Section
- Roster Identity
- Internal Student UUID

It deliberately ignores Current Enrolment Status, Current Class, verification notes, admission number and login-related fields. The starting placement is the source class exactly as supplied; teachers make later promote, demote, retain, remove and reinstate decisions in the app.

| Source class | Database/report class | School |
|---|---|---|
| Grade 1–5 | Primary 1–5 | Primary |
| JSS1–3 | JSS 1–3 | Secondary |
| SS1–2 | SS 1–2 | Secondary |

The original source class is retained as `source_class_name`. The workbook UUID is used as the stable student-row identity. It is not an admission number, password or login ID.

## Safe execution

The command is dry-run by default:

```powershell
cd backend
npm run db:import-physical-roster -- --file="C:\path\to\Student_Roster_Reconciliation_with_Identities.xlsx"
```

Review the summary and resolve any UUID/name/membership conflicts before applying. The importer refuses soft-deleted students, ambiguous same-name records, teacher-removed memberships and active memberships whose class has changed. It never rewrites an existing student's online class or login link.

Writes require the explicit `--apply` flag:

```powershell
npm run db:import-physical-roster -- --file="C:\path\to\Student_Roster_Reconciliation_with_Identities.xlsx" --apply
```

Before any production apply:

1. Confirm migrations 0005 and 0006 are applied through the guarded production migration workflow.
2. Create and verify a fresh encrypted production backup.
3. Review the dry-run summary and resolve all reported conflicts.
4. Obtain explicit production-import approval.

The workbook is not stored in the repository. No records are imported merely by deploying the application.

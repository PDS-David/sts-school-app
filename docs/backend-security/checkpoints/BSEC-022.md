# Checkpoint — BSEC-022

- **Task ID:** BSEC-022
- **Title:** Restrict parent invoice reads to active linked wards
- **Status:** implementation committed; CI verification pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** e96ab3437e1804f4e9cdac782b03c94531538c3d
- **Working branch:** agent/backend-finance-active-ward-invoices-20261116
- **Changed files:**
  - backend/src/routes/finance.ts
  - tests/backend-finance-invoice-integrity.integration.test.mts
  - docs/backend-security/checkpoints/BSEC-022.md
- **Defect:** GET /finance/invoices limited parent results to parent_wards links but did not exclude soft-deleted students. A parent whose ward had been deleted could continue retrieving that ward's invoices by listing invoices or supplying student_id. This contradicted active-ward restrictions already enforced for weekly-effort feedback and other parent-facing records.
- **Implementation:** parent invoice queries now require st.deleted_at IS NULL in addition to the parent_wards relationship. Student invoice queries also explicitly require a non-deleted student row. Finance administrators retain access to historical invoices, including invoices for deleted students, so school financial records remain available for administration.
- **Regression coverage:** extend the existing PostgreSQL finance invoice integration suite to prove parents see active linked wards only, cannot bypass the rule with a student_id filter, cannot see unrelated students, and finance administrators retain historical invoice access.
- **Verification:** changes committed to a dedicated branch. Existing PostgreSQL finance invoice workflow runs the extended suite and backend typecheck; results pending. No production database or data was accessed or changed.
- **Remaining:** run focused PostgreSQL suite and backend typecheck; verify repository-wide checks; open a focused PR; merge only after all required checks pass.
- **Exact next action:** open a PR from this branch and inspect the finance invoice workflow logs.

# Checkpoint — BSEC-025

- **Task ID:** BSEC-025
- **Title:** Restrict academic class-lock reads to authorized class teachers and administrators
- **Status:** implementation committed; CI verification pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 76de8bb3a8c6c1e91dfca21b4f8975599104ce04
- **Working branch:** agent/backend-class-lock-read-scope-20261116
- **Changed files:**
  - backend/src/routes/academic.ts
  - tests/backend-class-lock-read-scope.integration.test.mts
  - .github/workflows/backend-class-lock-read-scope.yml
  - docs/backend-security/checkpoints/BSEC-025.md
- **Defect:** GET /academic/class-locks was available to every authenticated role and accepted arbitrary class_name values. Students, parents and finance administrators could inspect internal class-lock state; a teacher could inspect lock status for any class in their school despite the write endpoint being restricted to their assigned class.
- **Implementation:** require teacher/admin role; require administrators to specify school_code; require teachers to have an assigned class and request only that class; ignore client-supplied school_code for teachers; validate class name and safe positive term ID; verify the term belongs to the authenticated school and that the class exists in that school before reading lock metadata.
- **Regression coverage:** PostgreSQL HTTP tests cover admin cross-school selection and missing school, class-teacher own class, denial for other classes and subject-only teachers, ignored spoofed school code, foreign-school term, invalid term/class, and denial for student, parent and finance_admin.
- **Verification:** code and tests committed to a dedicated branch. PostgreSQL 16 integration workflow and backend TypeScript check pending. No production data or database was accessed or changed.
- **Remaining:** run focused PostgreSQL suite and backend typecheck; resolve any genuine failures without weakening authorization; open a focused PR; verify repository-wide checks.
- **Exact next action:** open a PR from this branch and inspect the class-lock PostgreSQL workflow.

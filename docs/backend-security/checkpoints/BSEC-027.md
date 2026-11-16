# Checkpoint — BSEC-027

- **Task ID:** BSEC-027
- **Title:** Enforce school-bound administrator scope across academic term, subject and class routes
- **Status:** implementation committed; focused CI verification pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** agent/backend-class-lock-school-admin-scope-20261116 (stacked on BSEC-026)
- **Working branch:** agent/backend-academic-admin-school-scope-final-20261116
- **Changed files:**
  - backend/src/routes/academic.ts
  - tests/backend-class-lock-read-scope.integration.test.mts (extended with academic-route authorization cases)
  - docs/backend-security/checkpoints/BSEC-027.md
- **Defect:** academic routes treated every admin as global when accepting school_code. School-bound admin accounts could override their authenticated school when reading terms, current term, subjects or classes; create terms or subjects for another school; update another school's term; or delete another school's subject.
- **Implementation:** pin school-bound admins to req.user.school_code on academic reads and writes; reject conflicting query/body school codes; retain explicit school selection for global-admin writes and cross-school reads. Restrict term updates and subject deletion by school. Preserve teacher and finance-admin behavior. BSEC-026 class-lock school pinning is included in the stacked base.
- **Regression coverage added:** PostgreSQL HTTP tests cover school-bound admin term/current-term/subject/class reads, forged cross-school filters, term create/update, subject create/delete, and preserved global-admin explicit cross-school reads. The combined workflow also reruns BSEC-026 class-lock authorization regressions.
- **Verification:** initial focused PostgreSQL workflow exposed a fixture defect: the Secondary test class was absent from the disposable database, while the new write validation correctly rejected it. The fixture now inserts that class and cleans it up. The rerun result is pending. No production database or data was accessed or changed.
- **Remaining:** open a refreshed stacked PR against BSEC-026; inspect the combined PostgreSQL regression suite and backend typecheck; resolve genuine failures without weakening assertions; record actual CI evidence.
- **Exact next action:** open the refreshed PR and verify the PostgreSQL class-lock workflow.

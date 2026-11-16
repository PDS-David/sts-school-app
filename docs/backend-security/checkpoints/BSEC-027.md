# Checkpoint — BSEC-027

- **Task ID:** BSEC-027
- **Title:** Enforce school-bound administrator scope across academic term, subject and class routes
- **Status:** implementation committed; focused CI verification pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** agent/backend-class-lock-school-admin-scope-20261116 (stacked on BSEC-026)
- **Base commit:** 7decb89ba6e318ffa449fe5132841f6826b1405a
- **Working branch:** agent/backend-academic-admin-school-scope-20261116
- **Changed files:**
  - backend/src/routes/academic.ts
  - tests/backend-academic-admin-school-scope.integration.test.mts
  - .github/workflows/backend-academic-admin-school-scope.yml
  - docs/backend-security/checkpoints/BSEC-027.md
- **Defect:** academic routes treated every admin as global when accepting school_code. School-bound admin accounts could override their authenticated school when reading terms, current term, subjects or classes; create terms or subjects for another school; update another school's term; or delete another school's subject.
- **Implementation:** pin school-bound admins to req.user.school_code on academic reads and writes; reject conflicting query/body school codes; retain explicit school selection for global-admin writes and cross-school reads. Restrict term updates by school and subject deletion by school. Teacher and finance-admin behavior remains unchanged. The BSEC-026 class-lock school pinning is included in the stacked base.
- **Regression coverage added:** PostgreSQL HTTP tests cover school-bound admin term/current-term/subject/class reads, forged cross-school filters, term create/update, subject create/delete, and preserved global-admin explicit cross-school reads. The combined workflow also reruns BSEC-026 class-lock authorization regressions.
- **Verification:** source, tests and workflow were fetched back from the dedicated branch and reviewed. The focused PostgreSQL 16 workflow and backend TypeScript check are configured; no local test pass is claimed. No production database or data was accessed or changed.
- **Remaining:** open a stacked PR against the BSEC-026 branch; inspect both PostgreSQL regression suites and backend typecheck; resolve genuine failures without weakening assertions; retarget/refresh after BSEC-026 merges; record actual CI evidence.
- **Exact next action:** open the stacked PR and verify its focused PostgreSQL workflow.

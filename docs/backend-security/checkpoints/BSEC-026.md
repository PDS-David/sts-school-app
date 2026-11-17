# Checkpoint — BSEC-026

- **Task ID:** BSEC-026
- **Title:** Enforce school-bound administrator scope on class-lock reads and writes
- **Status:** implementation committed; focused CI verification pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 32d4d1677e4cd236f05bcb2c4fb4a86022dfaed8
- **Working branch:** agent/backend-class-lock-school-admin-scope-20261116
- **Changed files:**
  - backend/src/routes/academic.ts
  - tests/backend-class-lock-read-scope.integration.test.mts
  - docs/backend-security/checkpoints/BSEC-026.md
- **Defect:** BSEC-025 distinguished teachers from administrators, but treated every admin as global. School-bound admin accounts are supported elsewhere in the application. A school-bound administrator could supply another school's school_code to GET /academic/class-locks or PUT /academic/class-locks and inspect or alter that school's lock state.
- **Implementation:** pin school-bound administrators to req.user.school_code for both reads and writes; reject a conflicting client-supplied school_code with HTTP 403. Preserve global-admin cross-school behavior, requiring an explicit school_code. Preserve the existing teacher rule that ignores a client-supplied school_code and uses the authenticated school. Validate class name, positive 32-bit term ID, and boolean lock state on writes; verify the class belongs to the selected school before inserting or deleting a lock.
- **Regression coverage added:** PostgreSQL HTTP coverage for school-bound admin own-school reads/writes, forged cross-school GET/PUT denial, proof the denied write does not delete the other school's lock, global-admin explicit cross-school access, teacher school-code spoofing behavior, invalid term IDs and unknown classes. Existing student, parent, finance-admin, class-teacher and subject-only teacher denials remain.
- **Verification:** source and test files fetched back from the dedicated branch and reviewed. The focused PostgreSQL 16 workflow and backend TypeScript check are configured to run on the PR. No local test execution is claimed. No production database or data was accessed or changed.
- **Remaining:** open the focused PR; inspect the PostgreSQL class-lock authorization workflow and backend typecheck; fix any genuine failures without weakening assertions; verify the merge head and update this checkpoint with actual CI evidence.
- **Exact next action:** open the PR from this branch and verify its focused PostgreSQL workflow.

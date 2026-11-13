# Checkpoint — BSEC-003

- **Task ID:** BSEC-003
- **Title:** Fail closed when finance administrators list students without selecting a school
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Base commit:** 982c1d2d94e9bfbbb890d027c620b8a16e7f3f26
- **Working branch:** agent/backend-finance-student-roster-scope-20261113
- **Last commit:** pending
- **Files planned:** backend/src/routes/students.ts; new pure roster-scope resolver; role-specific regression tests; focused workflow; this checkpoint.
- **Defect:** finance_admin is granted students.read and has school_code NULL by design. GET /students currently computes effectiveSchool as school_code ?? user.school_code for finance_admin. When the caller omits school_code, effectiveSchool is NULL and the SQL query omits the school predicate, exposing both campuses' student rosters.
- **Scope boundary:** BSEC-002 PR #702 also edits backend/src/routes/students.ts, but only the POST /students handler and its imports/helper. This task changes only the GET /students scope logic near the top of that file; do not overwrite or edit the POST handler. Open PR #692 changes auth middleware only. No active PR changes the new roster-scope helper or tests.
- **Acceptance criteria:**
  1. finance_admin requests without a non-empty explicit school_code fail closed with HTTP 400.
  2. finance_admin requests with an explicit school_code are filtered to that school.
  3. admin retains the ability to query all schools when no school_code is supplied.
  4. teacher school/class restrictions remain unchanged and caller-supplied school_code cannot widen them.
  5. Regression tests cover finance_admin, admin and teacher scope behavior; backend typecheck passes.
  6. Focused PR targets master and does not overwrite BSEC-002's POST /students work.
- **Verification:** rbac.ts confirms finance_admin has students.read; students.ts confirms the missing school predicate when school_code and user.school_code are both null. No production data accessed or changed.
- **Remaining:** implement fail-closed resolver, tests and CI; open PR; verify checks.
- **Exact next action:** add a pure roster-scope resolver and use it only in GET /students.

# Checkpoint — BSEC-025

- **Task ID:** BSEC-025
- **Title:** Restrict academic class-lock reads to authorized class teachers and administrators
- **Status:** merged; post-merge PostgreSQL 16 regressions and backend TypeScript check passed
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Implementation branch:** agent/backend-class-lock-read-scope-20261116
- **PR:** https://github.com/PDS-David/sts-school-app/pull/900
- **Merge commit:** 4287d6af058d892a692a6c8cc375911411423c3f
- **Defect:** GET /academic/class-locks was available to every authenticated role and accepted arbitrary class_name values. Students, parents and finance administrators could inspect internal class-lock state; a teacher could inspect lock status for any class in their school despite the write endpoint being restricted to their assigned class.
- **Implementation:** require teacher/admin role; require global administrators to specify school_code; require teachers to have an assigned class and request only that class; ignore client-supplied school_code for teachers; validate class name and safe positive term ID; verify the term belongs to the authenticated school and that the class exists in that school before reading lock metadata.
- **Regression coverage:** PostgreSQL HTTP tests cover admin cross-school selection and missing school, class-teacher own class, denial for other classes and subject-only teachers, ignored spoofed school code, foreign-school term, invalid term/class, and denial for student, parent and finance_admin.
- **Verification:** PR #900 is merged and its merge commit is an ancestor of current master `b24ef36285c4ac481951209e6ac32857c3e405a4`. The original checkpoint's pending CI status was stale: the workflow file was introduced in that PR, and no associated workflow run is currently recorded for the implementation commit. The BSEC-026 reconciliation workflow `43950695156` reran this regression suite and the BSEC-024 messaging abuse-control suite; both passed, along with backend TypeScript typecheck. The master test fixture seeds and cleans up the Secondary `Primary 4` class required by class-membership validation.
- **Production safety:** no production database or data was accessed or changed.
- **Remaining:** none for BSEC-025. The post-merge PostgreSQL regression and backend typecheck evidence is recorded.

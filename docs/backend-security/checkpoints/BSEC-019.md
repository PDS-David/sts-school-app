# Checkpoint — BSEC-019

- **Task ID:** BSEC-019
- **Title:** Enforce same-school subject/term/question references for learning content
- **Status:** implementation and focused verification passed; PR review/merge pending
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Working branch:** agent/backend-learning-content-reference-scope-20261113
- **Base commit:** af35f2f669d10e9b56b2abeae71e7abb3b0a8862
- **Latest implementation commit:** 911621deee4049b15bbb1f3aafa27132f0c327ce
- **Changed files planned:** backend/src/routes/learning.ts; PostgreSQL HTTP integration test; focused workflow; this checkpoint.
- **Agent coordination:** no other active PR changes learning.ts or the learning content reference integration test.
- **Defects found:** checkTeacherContentScope authorizes a teacher based on matching assigned class OR subject ID, but the create routes do not verify that the referenced subject belongs to the target school. POST /materials and POST /questions also accept a term_id from another school. POST /assessments atomically writes the header and question links, but does not verify that linked questions belong to the same school, subject, class and term as the assessment. A teacher assigned to a class can therefore attach a foreign-school subject or question and deliver that content to learners in their own school. Admin-created cross-linked rows can also be returned because material/assessment subject joins do not require matching school_code.
- **Acceptance criteria:**
  1. Require a valid target school (teacher's own non-null school; explicit school_code for global admin).
  2. Lock and verify subject and optional term belong to that school before writing materials, questions or assessments.
  3. For assessments, validate unique question IDs and lock/recheck all questions; each must match assessment school and subject, and any class/term-specific question must match the assessment.
  4. Keep assessment header and question links atomic.
  5. Filter legacy cross-school subject/question links from learner-facing reads.
  6. Add PostgreSQL HTTP regression coverage for teacher/admin, cross-school subject/term/question rejection and valid same-school content.
  7. Backend TypeScript and focused PostgreSQL tests pass; no production data changes.
- **Verification:** Backend learning content reference scope workflow 43473868652 passed (PostgreSQL 16 HTTP regression suite and backend TypeScript typecheck); SS1 package integrity workflow 43473868607 passed. JSS3 implementation/asset checks 43473868642 are still running.
- **Remaining:** complete the JSS3 repository-wide check, then merge PR #822 after all required checks pass. No production data was changed.
- **Exact next action:** review PR #822 and verify remaining repository-wide check before merge.

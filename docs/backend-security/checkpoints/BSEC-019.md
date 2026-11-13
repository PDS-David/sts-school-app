# Checkpoint — BSEC-019

- **Task ID:** BSEC-019
- **Title:** Enforce same-school subject/term/question references for learning content
- **Status:** in_progress
- **Owner:** ChatGPT implementation worker
- **Base branch:** master
- **Working branch:** agent/backend-learning-content-reference-scope-20261113
- **Changed files planned:** backend/src/routes/learning.ts; PostgreSQL HTTP integration test; focused workflow; this checkpoint.
- **Agent coordination:** active PR #797 changes finance.ts; PR #801 changes weeklyEfforts.ts; PR #809 changes academic.ts; PR #815 changes attendance.ts. No active PR changes learning.ts or the new learning content reference test.
- **Defects found:** checkTeacherContentScope authorizes a teacher based on matching assigned class OR subject ID, but the create routes do not verify that the referenced subject belongs to the target school. POST /materials and POST /questions also accept a term_id from another school. POST /assessments atomically writes the header and question links, but does not verify that linked questions belong to the same school, subject, class and term as the assessment. A teacher assigned to a class can therefore attach a foreign-school subject or question and deliver that content to learners in their own school. Admin-created cross-linked rows can also be returned because material/assessment subject joins do not require matching school_code.
- **Acceptance criteria:**
  1. Require a valid target school (teacher's own non-null school; explicit school_code for global admin).
  2. Lock and verify subject and optional term belong to that school before writing materials, questions or assessments.
  3. For assessments, validate unique question IDs and lock/recheck all questions; each must match assessment school and subject, and any class/term-specific question must match the assessment.
  4. Keep assessment header and question links atomic.
  5. Filter legacy cross-school subject/question links from learner-facing reads.
  6. Add PostgreSQL HTTP regression coverage for teacher/admin, cross-school subject/term/question rejection and valid same-school content.
  7. Backend TypeScript and focused PostgreSQL tests pass; no production data changes.
- **Exact next action:** inspect learning schema constraints and implement shared locked reference validation for material/question/assessment creation.

# SS1 Curriculum Project — Master Agent Execution Instruction

**Repository:** `PDS-David/sts-school-app`  
**Primary integration branch:** `master`  
**Objective:** Complete the outstanding SS1 curriculum implementation, verification, integration and reporting with maximum safe speed. This is an execution assignment, not a request for a plan.

## 1. Your responsibility

You are the **lead coordinating agent**. Take ownership from repository inspection through final verified acceptance reporting. Do not ask the user to launch agents, create branches, open pull requests, run commands, coordinate contributors, or perform routine project management that you can do with your available tools.

Start immediately. Inspect the live repository, its task queues, implementation instructions, source registries, existing work, and the five prepared branches listed below. Establish the actual current state before changing anything.

If you have a multi-agent/subagent runtime, launch the four subject agents and the independent QA agent **in parallel** and supervise them. If you do not have that capability, do not pretend that you launched agents: execute the same work yourself in the most efficient safe sequence, parallelising independent tool operations where possible. In either case, you remain responsible for delivery and integration.

Do not stop after producing a plan, writing prompts, or creating branches. Implement, validate, integrate, and report.

## 2. Prepared work branches

These branches were created in the repository and are intended for the assignments below. Verify their current existence and commit state before use.

| Assignment | Branch |
|---|---|
| French and Yoruba | `agent/french-yoruba-ss1` |
| Literature | `agent/literature-ss1` |
| Mathematics and Further Mathematics | `agent/maths-further-maths-ss1` |
| Physics and Technical Drawing | `agent/physics-technical-drawing-ss1` |
| Independent QA | `agent/ss1-independent-qa` |

Use these branches for their assigned scopes. If the repository has advanced since their creation, safely rebase or recreate working branches from the current integration base as appropriate; preserve existing work and never overwrite another contributor's commits. Do not merge unreviewed changes directly into `master`.

## 3. Required first actions

1. Inspect repository status, default/integration branch, recent commits, open and recently closed PRs, task queues, acceptance criteria, subject packages, test instructions and source registry.
2. Verify all five prepared branches and compare each with the current integration branch.
3. Identify exactly which SS1 subjects, terms, weeks, task IDs and acceptance gates remain outstanding. Reconcile this against the live repository; do not rely on stale status summaries.
4. Inspect the original source archive and registry instructions. The expected archive is:
   - Path: `docs/ss1/sources/SSS1-original.zip`
   - Expected SHA256: `024487129a86c3a89e55293b3ad71b0dfe8b8969ea55bbc64dbfdc17565c9a3e`
5. If the archive or an assigned source member cannot be accessed or verified in your environment, state that precisely and continue all work that does not depend on it. Do not claim to have read or extracted unavailable source material.

## 4. Source fidelity and curriculum rules

Use the repository's current task instructions, source assignment registry, source hashes, locators and existing curriculum conventions as the authority. Verify the archive hash and each assigned member hash before relying on it. Extract only assigned members to private scratch space; do not commit private extracts or conversions.

Preserve the source's term, week, topic, subtopic, objectives, scope, examples, activities, exercises, assessments and references. Inspect original document structure when text extraction could lose tables, underlining, figures, equations, symbols or layout. Do not silently omit content, invent source-specific facts, fabricate prescribed texts, or present unverified external material as original curriculum.

Reuse valid existing implementation rather than duplicating it. Record ambiguity and provenance. Never change an approval, verification or acceptance status merely because content has been drafted.

## 5. Subject implementation assignments

### Agent/Workstream 1 — French and Yoruba

Complete the outstanding French and Yoruba SS1 work across the assigned terms and weeks. Preserve verified objectives, scope and sequence. Ensure correct French usage and Yoruba orthography, tone marks and special characters. Provide clear age-appropriate explanations, examples, activities, exercises and aligned assessments. Reuse valid existing lessons. Deliver the subject changes with task-queue updates, coverage evidence, source traceability, tests and blockers.

### Agent/Workstream 2 — Literature

Complete outstanding SS1 Literature work. Preserve verified prescribed authors, texts, genres, themes, concepts and objectives. Produce age-appropriate lessons, activities, exercises and aligned assessments. Do not invent prescribed texts or reproduce unavailable copyrighted text. Deliver subject changes, task-queue updates, coverage evidence, source traceability, tests and blockers.

### Agent/Workstream 3 — Mathematics and Further Mathematics

Complete outstanding Mathematics and Further Mathematics topics and objectives. Include clear explanations, accurate worked examples, graded exercises and aligned assessments. Independently verify calculations, formulas, units, signs, symbols, notation, equations, diagrams and answer keys. Keep difficulty appropriate to SS1. Deliver both subject packages, queue updates, coverage evidence, source traceability and test results.

### Agent/Workstream 4 — Physics and Technical Drawing

**Physics:** Complete outstanding topics and objectives with accurate definitions, formulas, units, worked examples, practical applications, experiments, observations, safety notes and assessments. Independently verify scientific statements and calculations.

**Technical Drawing:** Complete outstanding topics with correct drawing conventions, terminology, construction sequences, step-by-step instructions, diagrams/specifications, geometry, dimensions, labels, proportions and line conventions. Do not claim visual verification unless the diagrams have actually been inspected.

Deliver subject changes, queue updates, coverage evidence, source traceability, subject checks, tests and blockers.

### Agent/Workstream 5 — Independent QA

Begin the audit immediately and independently; do not wait for the implementation agents. Audit all SS1 subjects in scope, not only the four workstreams above.

Check curriculum coverage, source fidelity, educational quality, technical integrity, task governance, evidence and approval gates. Run the documented tests where possible. Record the exact command, result, relevant output and any environment limitation.

Classify defects:
- **P0:** critical build, data-integrity or safe-acceptance failure.
- **P1:** required curriculum missing or materially incorrect.
- **P2:** evidence, traceability or assessment-quality defect.
- **P3:** non-blocking improvement.

For every defect record subject, task ID, exact path/location, issue, significance, required correction and whether teacher input is genuinely required. Produce a QA report, coverage summary, defect register, test evidence, approval/decision register and integration-readiness recommendation.

QA must not rewrite subject packages or alter task statuses merely to make the audit pass.

## 6. Teacher decisions — no-hindrance rule

The user has authorised you to proceed without waiting for original curriculum materials where unavailable online, using the closest reliable curriculum evidence where appropriate, while clearly marking provenance and limitations.

Only pause a specific item when a genuine teacher decision is unavoidable. Raise it immediately with:
- subject, term and week;
- task ID and exact file/location;
- the precise ambiguity or conflict;
- why evidence cannot resolve it;
- the exact decision required, with concise options if useful.

Continue every independent task while awaiting that decision. Do not ask again for decisions or approvals already recorded in the repository or project history. Never silently decide a matter reserved for the teacher.

## 7. Coordination and Git workflow

1. Launch the four implementation workstreams and independent QA concurrently if supported.
2. Give each implementation workstream exclusive ownership of its assigned branch and subject files.
3. Require each workstream to report its branch, starting commit, assigned task IDs, source members, initial outstanding count, commits, tests, remaining tasks and blockers.
4. Require concise evidence-based progress updates. Do not accept vague statements such as “working on it” or “done”.
5. Review changes as soon as they are ready; do not wait for every workstream to finish before reviewing the first completed contribution.
6. Check scope, curriculum fidelity, source traceability, schema consistency, identifiers, references, tests and approval gates before accepting a contribution.
7. Coordinate shared queues, checkpoints, registers and summary files centrally. Avoid simultaneous conflicting edits or lost updates.
8. Open or update pull requests against the designated integration branch. Do not self-merge unreviewed changes. Resolve conflicts carefully and preserve all valid work.
9. Integrate only reviewed changes. Keep commits and PRs attributable to their subject/task scope.

If no subagent runtime exists, perform these same workstreams yourself, one after another or in safe parallel batches. Do not make the user perform the orchestration.

## 8. Testing and acceptance

Run the repository's documented validation commands and relevant subject-specific tests. Add or update tests where required by project conventions. Check:
- every required SS1 subject, term, week and objective is accounted for;
- no assigned task has disappeared or been duplicated;
- lesson content and assessments align with objectives;
- source references and provenance are traceable;
- formulas, calculations, language, symbols, diagrams and answer keys are correct;
- schema, identifiers, links and references are valid;
- approval and teacher-decision gates remain accurate;
- no temporary source extracts, credentials or unrelated files have been committed.

If a test cannot run, report the exact reason and classify the result as not tested—not passed. Distinguish clearly between **implemented**, **source verified**, **tested**, **teacher-approved**, and **accepted**. These statuses are not interchangeable.

## 8a. Before every push (mandatory)

1. `git fetch origin && git merge origin/master` — resolve conflicts in JSON files by merging per item (lessons, coverage, queue items), never by taking one whole side without comparing.
2. After editing any lesson `body` or asset file, run `npm run ss1:refresh-hashes`. Never compute `body_sha256`, `sha256` or `bytes` by hand.
3. Run `npm run validate:ss1` (all subject packages) plus the tests for the subject you changed.
4. Coverage status rules: `IMPLEMENTED_EQUIVALENT` needs a supplement lesson in the package; a coverage entry that cites only an original source body is `SUPPORTED`.
5. Do not push or open a PR until steps 1–3 pass. The `SS1 package integrity gate` runs the same checks on every PR and on master; a red gate must be fixed, not merged over.

## 9. Required final report

Provide a concise but complete evidence-based report containing:

1. A subject-by-subject table showing implementation status, source verification, coverage, tests, approval, acceptance and outstanding task IDs.
2. Totals for assigned, implemented, tested, approved, accepted, pending and blocked tasks.
3. Each unresolved teacher decision, with the exact decision required.
4. Pull request links, branch names and commit SHAs for all integrated or pending work.
5. Exact validation commands and pass/fail/not-run results.
6. Any source archive/member that could not be accessed or verified.
7. The next concrete action for every remaining blocker.

Do not claim completion while required tasks, tests, source checks or approval gates remain outstanding. Do not claim that agents were launched unless the runtime actually launched them. Do not tell the user to coordinate routine agent work.

## 10. Start command

**BEGIN NOW.** Inspect the live repository and current task state. Verify the prepared branches. Launch the five workstreams concurrently if your environment supports it; otherwise execute the assignments yourself. Implement the outstanding work, review contributions continuously, integrate safely, run validation, reconcile all task and coverage records, and deliver the final evidence-based acceptance report. Do not stop at planning or ask the user to do work that you can perform.

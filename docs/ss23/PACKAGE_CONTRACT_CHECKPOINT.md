# SS2 / SS3 package contract — checkpoint

Updated: 2026-11-13
Task ID: SS23-01
Branch: `agent/ss2-agriculture-t1-week8-9-20261113`
Base: `master`

## Status

**PACKAGE CONTRACT, LOADER AND FAIL-CLOSED DELIVERY IMPLEMENTED. SS2 AGRICULTURAL SCIENCE FIRST TERM WEEKS 1-9 DRAFTED; CURRICULUM APPROVAL AND FINAL VALIDATION PENDING.**

The package is structurally validated in CI for the earlier Weeks 1-7 state. The Weeks 8-9 extension is on this branch and requires a fresh CI run. No SS2 or SS3 lesson package is certified for student release by this work. All SS2 Agriculture units and assets remain pending approval; the student routes intentionally serve no lesson content until blockers and evidence-backed approvals are resolved.

## Current SS2 Agricultural Science First Term scope

- 7 units: Weeks 1, 2, 3, combined Weeks 4-5, Week 6, Week 7 and combined Weeks 8-9.
- 128 assessment/practice items: 109 original-source prompts and 19 authored supplements. All have source locators, authored answers, explanations and marking criteria.
- 47 asset records: 42 pending source-extract references and 5 original SVG diagrams.
- 18 separate, content-hashed external factual references.
- 35 open items: 30 delivery-blocking and 5 non-blocking.
- Original source member: `SS23-SRC-225f920d3751`; archive-member SHA-256 and byte count were cross-checked against the existing source register.

Weeks 8-9 are represented as one combined unit because the scheme assigns the Plant Nutrients/Nutrient Cycles topic to Weeks 8-9 while the source body has a single Week Eight heading. The unit uses all supplied content; the subject lead must confirm that it covers the full two-week scheme range. No separate Week Nine lesson has been invented.

## Contract boundaries

- SS2 package: class `SS 2`, mode `INSTRUCTIONAL`, terms 1-3, unit kind `LESSON`.
- SS3 package: class `SS 3`, mode `EXAM_PREPARATION`, terms 1-2 only, unit kinds limited to revision units, practical guides, past-question sets, mock exams and exam strategies. Examination targets must be declared (WAEC, NECO, JAMB or cross-board).
- No SS3 third-term package or normal SS3 instructional mode is accepted.
- Original source records use SHA-derived `SS23-SRC-` IDs. External source records use separate `SS23-EXT-` IDs and content hashes.
- Every unit requires substantive body text, at least two practice items, answer explanations, mark allocations and marking criteria whose totals equal the question marks.
- Every unit and asset requires provenance bound to an existing source ID and SHA. Original and authored supplementary material have distinct provenance roles.
- Every source requires a coverage disposition. Supported coverage must link to a unit.
- Body and external-source hashes are checked during schema validation. Asset byte/hash verification is enforced by the delivery layer before serving.
- Approval, implementation, verification, reuse rights and delivery blockers remain explicit states; schema validity does not imply student-release approval.

## Tests and CI evidence

Twenty-four Node tests cover valid SS2/SS3 package shapes, question/answer provenance, the real Agricultural Science draft package, registered-package loading, class separation, answer-key hiding, term/asset gating and file integrity.

GitHub Actions run **43474891512** passed after Weeks 1-7 and the full First Term source-figure inventory were present: backend TypeScript typecheck passed and all 24 SS23 Node tests passed (24 passed, 0 failed). The Weeks 8-9 package extension and corresponding test assertions were added afterward and await a fresh run.

## Remaining work

1. Complete SS2 Agricultural Science Week 10 (Nutrient Availability) from the supplied source document.
2. Complete all SS2 Agricultural Science Term 2 and Term 3 weeks, with source coverage and assessments.
3. Audit and complete every other registered SS2 subject, term and teaching week.
4. Audit SS3 subject packages as exam preparation only, Terms 1-2; do not create normal instructional units or a third-term package.
5. Resolve technical, content, reading-reference and figure-rights blockers; obtain actual subject-lead approvals rather than fabricating them.
6. Validate all package bodies, source hashes, assets, answer keys and student delivery using authorized SS2 and SS3 accounts.
7. Open focused PRs for coherent subject/term units and keep durable checkpoints current.

## Exact next action

Audit the original SS2 Agricultural Science First Term Week Ten (Nutrient Availability) section, including its lesson body, assessment questions and any embedded figures. Draft the unit only from supplied source material, distinguish authored supplementation, record all corrections and blockers, update tests/checkpoints, then run CI.

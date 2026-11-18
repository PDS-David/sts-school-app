# AI Curriculum Lesson Generation — Architecture Gap Assessment

**Inspected against:** `master` at `64e1ae856528cfd52a91a1f14c809b14191262d4` (2026-11-18)  
**Scope:** DIY Online School curriculum and student learning only. The physical teacher-reporting system is outside this assessment.

## Product contract

The product has two separate AI responsibilities:

1. **Curriculum lesson generation:** approved curriculum topics and available objectives/source material are the input. AI generates the student-facing lesson body and associated practice questions, answers and explanations.
2. **Brainee tutoring:** the separate student-facing avatar tutor helps a learner who is stuck, asks for clarification, or needs another explanation. Brainee chat is not the curriculum generation pipeline.

The approved curriculum remains authoritative. AI teaches the supplied curriculum; it must not invent or silently alter the syllabus.

## Verified implementation on the inspected master commit

### Existing topic-based learning flow

- `backend/src/routes/learning.ts` exposes `POST /topics/:id/complete`.
- That endpoint verifies the authenticated student's school/class access and the topic sequence/term lock.
- It generates a short study summary using `topics.title` and, when available, `topics.source_reference`.
- It stores that summary in `topics.summary`.
- It generates three MCQ practice questions on each call, but does not persist those practice questions.
- It separately generates a five-question standard assessment and stores the questions/assessment in the existing assessment tables, linking it through `topics.generated_assessment_id`.
- The endpoint also inserts the topic completion record. Consequently, lesson generation and marking a topic complete are currently coupled.

### Existing mobile topic screen

- `mobile/src/screens/TopicDetailScreen.tsx` initially displays the topic title/description and a button labelled “Get Study Notes” or “Get Practice Questions”.
- The button calls `POST /learning/topics/:id/complete`.
- The lesson is therefore generated only after the learner presses that button, and that same action records completion.
- The generated summary and ephemeral practice questions are rendered in the screen.
- This is not the intended clean sequence of opening a topic, receiving its AI-generated lesson and practice, studying/attempting them, and only then recording completion.

### SS1 and SS2/SS3 package delivery

- `mobile/src/screens/Ss1PackageLessonScreen.tsx` renders stored package `lesson.body`, `lesson.objectives` and `lesson.practice`.
- `mobile/src/screens/Ss23PackageLessonScreen.tsx` renders stored package `unit.body`, `unit.objectives` and `unit.practice`.
- The SS23 package schema requires a substantive stored body and at least two stored practice questions.
- These package lesson screens do not call the AI generation service to generate the lesson when the learner opens the lesson.
- SS3 remains an exam-preparation delivery mode and must not be silently treated as a new-topic instructional syllabus.

### Existing Brainee role

- `backend/src/routes/ai.ts` provides `POST /ai/chat`, `/ai/explain`, `/ai/notes`, `/ai/hint`, `/ai/text-study`, and admin-authorised question drafting.
- `mobile/src/screens/BraineeChatScreen.tsx` is the separate student-facing Brainee conversation interface.
- Brainee chat is not called by the SS1/SS23 package lesson screens.
- The shared model service in `backend/src/utils/ai.ts` already provides `generate()` and `generateJSON()`; its provider/fallback routing should be reused, not duplicated.

## Data-model implications — documented before schema changes

The current `topics` table has `title`, `description`, `source_reference`, `summary` and `generated_assessment_id`. It does not have a dedicated structured learning-objectives field or a cache for the generated practice set.

The current SS1/SS23 package formats have objectives and practice fields, but those fields are static package content rather than AI generation performed when a student opens a lesson.

A robust implementation needs to separate:

1. **Generation request** — authenticated learner requests the lesson for a curriculum topic/unit they are actually allowed to access.
2. **Generated lesson** — AI-generated full teaching body, grounded in approved topic, objectives and available curriculum source.
3. **Generated practice** — questions tied to that generated lesson, with answer keys and explanations for the practice experience.
4. **Completion/progression** — recorded separately after the learner has studied/attempted the learning activity; opening or generating a lesson must not automatically mark it complete.
5. **Brainee support** — separate contextual tutoring action using the lesson/topic context when the learner asks for help.

Before adding persistence, inspect existing production schema and migration conventions. A likely additive storage requirement is a structured practice cache (and, if needed, structured objective metadata); do not repurpose the formal assessment question bank as an answer-revealing practice cache. Do not expose answer keys through formal assessment endpoints.

No database schema was changed as part of this assessment.

## Required implementation direction

- Provide one reusable curriculum lesson-generation service for all class levels.
- Accept only server-resolved curriculum records/units, never trust student-supplied class, subject, school or objectives as authority.
- Supply the model with the approved class, subject, term, topic, objectives when available, and safe source material/provenance.
- Generate a complete age-appropriate teaching lesson and related practice questions with correct answers and explanations.
- Validate structured AI output before caching or delivery; reject malformed or materially incomplete output.
- Cache generated lesson/practice to avoid repeated model calls and inconsistent lessons for different students studying the same canonical topic.
- Keep lesson generation separate from topic completion and from Brainee conversation.
- Preserve term PINs, sequence gates, student/class/school access checks, source-correction/withholding rules, rate limits and existing UI capabilities.
- Integrate the same generation contract with the existing SS1 and SS2 package delivery paths, and retain SS3's exam-preparation distinction.
- Do not add teacher-reporting dependencies or teacher-approval blockers.

## Verification criteria

A representative topic in each supported class pathway must demonstrate:

- correct server-resolved class/subject/term/topic context;
- AI-generated lesson body grounded in the supplied curriculum;
- AI-generated practice questions with valid answers and explanations;
- stable cached content on subsequent opens;
- opening/generating does not mark the topic complete;
- completion/progression remains a separate action;
- Brainee remains independently available as the student's tutor;
- locked or out-of-scope content cannot be generated or retrieved;
- existing assessment answer confidentiality remains intact.

## Implementation update — 18 November 2026

The first implementation pass has now been pushed directly to `master`:

- `POST /learning/topics/:id/lesson` resolves the authenticated student's topic, school, class, subject, term, approved learning objectives and source-corrected teaching material. It generates and returns the full validated lesson and practice set without inserting a topic-completion record or creating formal assessment/question-bank rows.
- `POST /learning/topics/:id/progress` records completion separately after the learner has studied the generated lesson. It repeats school/class and configured sequence checks.
- The mobile `TopicDetailScreen` requests the AI lesson on topic open, renders the generated introduction, teaching sections, recap and practice questions, and exposes a separate “Mark topic complete” action.
- SS1 package lessons and SS2/SS3 package units use the same generation service and shared cache. The SS3 route passes an explicit exam-preparation mode so it revises established learning rather than creating new instructional syllabus content.
- The shared generator strictly validates lesson structure and practice answer keys. Brainee remains a separate tutor/chat experience.
- `curriculum_generated_lessons` is an additive shared cache keyed by canonical topic/package identity and the SHA-256 fingerprint of the exact approved generation context. Changed objectives/source invalidate the cache. A missing cache table degrades to uncached generation.
- Migration `0007_curriculum_generated_lessons.sql` and fresh-install `backend/schema.sql` are in sync. The migration has **not** been applied to production by this code change; until the approved production migration workflow applies it, generation works without persistent caching.
- The old `POST /topics/:id/complete` route remains for backward compatibility with existing clients. The updated student topic screen no longer calls it.

The implementation preserves school/class access, source correction and withholding checks, learner-safe projections, formal assessment separation, and configurable sequence/term gates. The physical teacher-reporting system remains outside this work.

## Current conclusion

The AI curriculum lesson-generation path is now connected to the canonical topic screen and the SS1/SS2/SS3 package screens. Remaining verification is to complete the new master CI runs, apply migration 0007 only through the approved production migration process, and exercise a representative live topic/package with the configured AI provider. This is an implementation of the original product plan, not a change to it.


## Follow-up hardening — 18 November 2026

- The canonical topic lesson endpoint and both SS1/SS2/SS3 package-generation endpoints now share a per-account, PostgreSQL-backed HTTP rate limit (20 generation requests per minute). This closes the gap where lesson generation in `/learning` bypassed the limiter already applied to Brainee's `/ai` routes.
- SS1 package GET endpoints now use an explicit student projection. They retain the approved lesson body/objectives needed for the lesson experience and AI grounding, but do not serialize teacher practice answers, marking criteria, source provenance, approval state or internal content hashes. The server retains the complete package object for generation and audit.
- Regression coverage now asserts the three generation routes use the shared limiter and that SS1 student payloads use the safe projection.
- GitHub Actions on master `2a9bf0433b0728060302a61c04055d3c9dc3662d`: **AI curriculum lesson generation passed**, including lesson contract, lesson-flow/free-launch regressions, corrected-topic generation/cache with PostgreSQL, fresh-install/incremental migration ledger checks, and backend/mobile typechecks. **SS1 package integrity passed**, including student-delivery eligibility, package validation, stored hashes and byte counts, and TypeScript. **SS2/SS3 package integrity passed**, including hashes, package validation, negative controls, and SS1 non-regression. These are CI results, not production or device acceptance.
- Still not claimed complete: production application of migration 0007; an in-app admin interface for later access-policy changes (current controls remain environment configuration); package-specific progress/completion tracking; retirement of the legacy combined `/topics/:id/complete` route after a full client-compatibility audit; and real student-account/production smoke acceptance. No production migration or deployment was performed.

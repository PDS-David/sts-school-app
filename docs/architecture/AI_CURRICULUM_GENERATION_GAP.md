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

## Current conclusion

The code already has an AI model hub and a partial topic-based summary/practice workflow. It does **not** yet implement the full intended AI curriculum lesson-generation experience consistently across the student topic flow and SS1/SS2/SS3 package screens. This is an implementation gap, not a change to the product plan.

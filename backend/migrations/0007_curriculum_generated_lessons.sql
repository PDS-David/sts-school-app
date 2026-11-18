-- 0007: Persist validated AI-generated curriculum lessons independently
-- of topic completion and the formal assessment question bank.
--
-- This is an additive cache. It does not backfill, rewrite, or delete existing
-- topic summaries, assessments, questions, completion records, or learner data.

CREATE TABLE IF NOT EXISTS public.curriculum_generated_lessons (
  cache_key          TEXT PRIMARY KEY CHECK (length(cache_key) BETWEEN 1 AND 240),
  topic_id           INTEGER REFERENCES public.topics(id) ON DELETE CASCADE,
  class_name         TEXT NOT NULL,
  subject_name       TEXT NOT NULL,
  term_label         TEXT NOT NULL,
  topic_title        TEXT NOT NULL,
  context_sha256     CHAR(64) NOT NULL CHECK (context_sha256 ~ '^[0-9a-f]{64}$'),
  lesson_json        JSONB NOT NULL CHECK (jsonb_typeof(lesson_json) = 'object'),
  generator_version  TEXT NOT NULL,
  generated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_curriculum_generated_lessons_topic
  ON public.curriculum_generated_lessons(topic_id)
  WHERE topic_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_curriculum_generated_lessons_class_subject_term
  ON public.curriculum_generated_lessons(class_name, subject_name, term_label);

COMMENT ON TABLE public.curriculum_generated_lessons IS
  'Validated AI curriculum lesson and practice cache; separate from topic completion and formal assessment records.';
COMMENT ON COLUMN public.curriculum_generated_lessons.lesson_json IS
  'Strictly validated teaching lesson plus student practice questions, correct answers and explanations.';
COMMENT ON COLUMN public.curriculum_generated_lessons.context_sha256 IS
  'Fingerprint of the exact approved class, subject, term, topic, objectives and safe source context used for generation.';

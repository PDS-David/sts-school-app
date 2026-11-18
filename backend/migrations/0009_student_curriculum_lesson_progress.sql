-- 0009: Persist student completion of SS1 and SS2/SS3 AI curriculum lessons.
-- This is separate from topic_completions because package lessons use stable
-- string keys rather than canonical numeric topic IDs. It does not affect
-- physical-class reporting, formal assessments or teacher workflows.

CREATE TABLE IF NOT EXISTS public.student_curriculum_lesson_progress (
  student_id    UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  lesson_key    TEXT NOT NULL CHECK (length(lesson_key) BETWEEN 1 AND 240),
  class_name    TEXT NOT NULL CHECK (class_name IN ('SS 1', 'SS 2', 'SS 3')),
  subject_name  TEXT NOT NULL,
  term_label    TEXT NOT NULL,
  lesson_title  TEXT NOT NULL,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, lesson_key)
);

CREATE INDEX IF NOT EXISTS idx_student_curriculum_progress_class_term
  ON public.student_curriculum_lesson_progress(student_id, class_name, term_label);

COMMENT ON TABLE public.student_curriculum_lesson_progress IS
  'Student completion records for generated SS1/SS2/SS3 package lessons; separate from canonical topic completion and physical-class reporting.';

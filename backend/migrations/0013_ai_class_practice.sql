-- 0013: Student-only AI class practice, attempts and concept remediation.
-- This subsystem is intentionally isolated from scores, attendance and report remarks.
CREATE TABLE IF NOT EXISTS class_practice_sets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  class_name TEXT NOT NULL,
  subject_name TEXT NOT NULL,
  term_label TEXT NOT NULL,
  topic_title TEXT NOT NULL,
  questions JSONB NOT NULL CHECK (jsonb_typeof(questions)='array' AND jsonb_array_length(questions) BETWEEN 1 AND 10),
  weak_concepts JSONB NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(weak_concepts)='array'),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','completed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  completed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_class_practice_sets_student_topic
  ON class_practice_sets(student_id, topic_id, created_at DESC);

CREATE TABLE IF NOT EXISTS class_practice_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  set_id UUID NOT NULL REFERENCES class_practice_sets(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  concept TEXT NOT NULL,
  answer JSONB NOT NULL,
  correct BOOLEAN NOT NULL,
  marks_awarded NUMERIC(6,2) NOT NULL DEFAULT 0,
  marks_available NUMERIC(6,2) NOT NULL DEFAULT 1,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(set_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_class_practice_attempts_concept
  ON class_practice_attempts(student_id, topic_id, concept, submitted_at DESC);

CREATE TABLE IF NOT EXISTS class_practice_concept_performance (
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  concept TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  correct_attempts INTEGER NOT NULL DEFAULT 0,
  accuracy NUMERIC(5,4) NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(student_id, topic_id, concept),
  CHECK (attempts >= 0 AND correct_attempts >= 0 AND correct_attempts <= attempts)
);

CREATE TABLE IF NOT EXISTS class_practice_remediation_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  topic_id INTEGER NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  concept TEXT NOT NULL,
  recommendation TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','improving','resolved')),
  accuracy NUMERIC(5,4) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(student_id, topic_id, concept)
);

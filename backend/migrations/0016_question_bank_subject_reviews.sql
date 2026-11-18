-- 0016: Record subject-teacher review decisions for online question-bank items.
CREATE TABLE IF NOT EXISTS question_bank_question_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES question_bank_questions(id) ON DELETE CASCADE,
  subject_id BIGINT NOT NULL REFERENCES question_bank_subjects(id) ON DELETE RESTRICT,
  reviewer_user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  decision TEXT NOT NULL CHECK (decision IN ('approved','rejected')),
  notes TEXT NOT NULL CHECK (length(trim(notes)) BETWEEN 10 AND 2000),
  reviewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(question_id,reviewer_user_id)
);
CREATE INDEX IF NOT EXISTS question_bank_question_reviews_recent_idx
  ON question_bank_question_reviews(question_id,reviewed_at DESC);

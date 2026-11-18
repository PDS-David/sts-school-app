-- 0014: Formal online examinations. Separate from physical-school assessment/reporting.
CREATE TABLE IF NOT EXISTS online_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_code TEXT NOT NULL REFERENCES schools(code) ON DELETE RESTRICT,
  subject_id BIGINT NOT NULL REFERENCES question_bank_subjects(id) ON DELETE RESTRICT,
  subject_name TEXT NOT NULL,
  class_name TEXT NOT NULL CHECK (class_name IN ('JSS 3','SS 1','SS 2','SS 3')),
  board TEXT NOT NULL CHECK (board IN ('WAEC','NECO','JAMB')),
  examination_type TEXT NOT NULL CHECK (length(trim(examination_type)) BETWEEN 2 AND 80),
  exam_year SMALLINT CHECK (exam_year IS NULL OR exam_year BETWEEN 2020 AND 2100),
  title TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 3 AND 255),
  instructions TEXT NOT NULL CHECK (length(trim(instructions)) BETWEEN 1 AND 8000),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes BETWEEN 1 AND 600),
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','closed')),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (ends_at > starts_at)
);
CREATE INDEX IF NOT EXISTS online_exams_school_class_window_idx
  ON online_exams(school_code,class_name,status,starts_at,ends_at);

CREATE TABLE IF NOT EXISTS online_exam_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES online_exams(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (length(trim(title)) BETWEEN 1 AND 120),
  instructions TEXT,
  position INTEGER NOT NULL CHECK (position >= 0),
  UNIQUE(exam_id,position),
  UNIQUE(id,exam_id)
);

CREATE TABLE IF NOT EXISTS online_exam_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES online_exams(id) ON DELETE CASCADE,
  section_id UUID NOT NULL,
  question_bank_question_id UUID NOT NULL REFERENCES question_bank_questions(id) ON DELETE RESTRICT,
  position INTEGER NOT NULL CHECK (position >= 0),
  marks NUMERIC(7,2) NOT NULL CHECK (marks > 0 AND marks <= 100),
  question_snapshot JSONB NOT NULL,
  provenance JSONB NOT NULL,
  UNIQUE(exam_id,question_bank_question_id),
  UNIQUE(section_id,position),
  FOREIGN KEY(section_id,exam_id) REFERENCES online_exam_sections(id,exam_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS online_exam_questions_exam_order_idx ON online_exam_questions(exam_id,section_id,position);

CREATE OR REPLACE FUNCTION online_exam_question_rights_guard()
RETURNS trigger LANGUAGE plpgsql AS $
DECLARE
  v_question RECORD;
  v_exam RECORD;
BEGIN
  SELECT board,subject_id INTO v_exam
    FROM online_exams WHERE id=NEW.exam_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Online examination does not exist';
  END IF;

  SELECT q.board,q.subject_id,q.exam_year,q.rights_status,q.content_origin,q.review_status,
         s.board AS source_board,s.rights_status AS source_rights,
         s.rights_evidence,s.is_active
    INTO v_question
    FROM question_bank_questions q
    JOIN question_bank_sources s ON s.id=q.source_id
   WHERE q.id=NEW.question_bank_question_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Question-bank item or its source does not exist';
  END IF;
  IF v_question.review_status NOT IN ('approved','published') THEN
    RAISE EXCEPTION 'Only approved or published question-bank items may enter a formal examination';
  END IF;
  IF NOT v_question.is_active OR v_question.source_rights<>v_question.rights_status OR
     length(trim(coalesce(v_question.rights_evidence,'')))<12 OR
     v_question.source_board NOT IN ('GENERAL',v_exam.board) OR
     v_question.board<>v_exam.board OR v_question.subject_id<>v_exam.subject_id THEN
    RAISE EXCEPTION 'Question-bank source, board, subject or reuse-rights evidence is invalid';
  END IF;
  IF v_question.content_origin='past_question' THEN
    IF v_question.rights_status NOT IN ('licensed','public_domain') OR v_question.exam_year IS NULL THEN
      RAISE EXCEPTION 'Historical examination questions require documented reuse rights and an exam year';
    END IF;
  ELSIF v_question.rights_status<>'original_generated' OR v_question.exam_year IS NOT NULL THEN
    RAISE EXCEPTION 'Original examination questions must be rights-cleared original content without a historical exam year';
  END IF;
  RETURN NEW;
END;
$;

CREATE TRIGGER trg_online_exam_question_rights_guard
BEFORE INSERT OR UPDATE OF exam_id,question_bank_question_id
ON online_exam_questions
FOR EACH ROW EXECUTE FUNCTION online_exam_question_rights_guard();


CREATE TABLE IF NOT EXISTS online_exam_candidates (
  exam_id UUID NOT NULL REFERENCES online_exams(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  eligible_class TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY(exam_id,student_id)
);

CREATE TABLE IF NOT EXISTS online_exam_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES online_exams(id) ON DELETE RESTRICT,
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE RESTRICT,
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','submitting','submitted','expired','under_review')),
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deadline_at TIMESTAMPTZ NOT NULL,
  submission_started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  score NUMERIC(9,2),
  total_marks NUMERIC(9,2) NOT NULL CHECK (total_marks > 0),
  percentage NUMERIC(6,2),
  UNIQUE(exam_id,student_id)
);
CREATE INDEX IF NOT EXISTS online_exam_attempts_student_idx ON online_exam_attempts(student_id,started_at DESC);

CREATE TABLE IF NOT EXISTS online_exam_responses (
  attempt_id UUID NOT NULL REFERENCES online_exam_attempts(id) ON DELETE CASCADE,
  exam_question_id UUID NOT NULL REFERENCES online_exam_questions(id) ON DELETE RESTRICT,
  response JSONB NOT NULL,
  saved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  awarded_marks NUMERIC(7,2),
  marking_status TEXT NOT NULL DEFAULT 'unmarked' CHECK (marking_status IN ('unmarked','auto_marked','ai_marked','manual_marked','pending_review')),
  feedback TEXT,
  PRIMARY KEY(attempt_id,exam_question_id)
);

CREATE TABLE IF NOT EXISTS online_exam_audit_events (
  id BIGSERIAL PRIMARY KEY,
  exam_id UUID NOT NULL REFERENCES online_exams(id) ON DELETE CASCADE,
  attempt_id UUID REFERENCES online_exam_attempts(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  event_type TEXT NOT NULL,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS online_exam_audit_exam_time_idx ON online_exam_audit_events(exam_id,created_at DESC);

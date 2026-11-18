-- Independent online-learning question bank and rights-aware ingestion.
-- Deliberately does not reference physical scores, assessments, report cards or roster tables.

CREATE TABLE IF NOT EXISTS question_bank_subjects (
  id BIGSERIAL PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS question_bank_topics (
  id BIGSERIAL PRIMARY KEY,
  subject_id BIGINT NOT NULL REFERENCES question_bank_subjects(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(subject_id, slug),
  UNIQUE(id, subject_id)
);

CREATE TABLE IF NOT EXISTS question_bank_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board TEXT NOT NULL CHECK (board IN ('WAEC','NECO','JAMB','GENERAL')),
  source_name TEXT NOT NULL,
  source_url TEXT,
  access_method TEXT NOT NULL CHECK (access_method IN ('official_portal','licensed_partner','author_uploaded','original_generated','other')),
  rights_status TEXT NOT NULL CHECK (rights_status IN ('licensed','public_domain','original_generated','reference_only','permission_pending','restricted','unknown')),
  rights_evidence TEXT,
  rights_checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (rights_status NOT IN ('licensed','public_domain','original_generated') OR length(trim(COALESCE(rights_evidence,''))) >= 12),
  CHECK (source_url IS NULL OR source_url ~ '^https?://')
);

CREATE TABLE IF NOT EXISTS question_bank_ingestion_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES question_bank_sources(id) ON DELETE RESTRICT,
  batch_key TEXT NOT NULL UNIQUE,
  payload_sha256 TEXT NOT NULL CHECK (payload_sha256 ~ '^[a-f0-9]{64}$'),
  imported_count INTEGER NOT NULL DEFAULT 0 CHECK (imported_count >= 0),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS question_bank_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  board TEXT NOT NULL CHECK (board IN ('WAEC','NECO','JAMB')),
  exam_year SMALLINT,
  subject_id BIGINT NOT NULL REFERENCES question_bank_subjects(id) ON DELETE RESTRICT,
  paper TEXT NOT NULL,
  question_number TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq','short_answer','essay')),
  stem TEXT NOT NULL CHECK (length(trim(stem)) BETWEEN 5 AND 12000),
  options JSONB,
  correct_answer JSONB NOT NULL,
  explanation TEXT NOT NULL CHECK (length(trim(explanation)) BETWEEN 5 AND 12000),
  marks NUMERIC(6,2) NOT NULL CHECK (marks > 0 AND marks <= 100),
  topic_id BIGINT NOT NULL,
  source_id UUID NOT NULL REFERENCES question_bank_sources(id) ON DELETE RESTRICT,
  batch_id UUID REFERENCES question_bank_ingestion_batches(id) ON DELETE RESTRICT,
  source_locator TEXT,
  content_origin TEXT NOT NULL CHECK (content_origin IN ('past_question','ai_generated','original_authored')),
  rights_status TEXT NOT NULL CHECK (rights_status IN ('licensed','public_domain','original_generated')),
  review_status TEXT NOT NULL DEFAULT 'draft' CHECK (review_status IN ('draft','reviewed','approved','published','retired')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  FOREIGN KEY (topic_id, subject_id) REFERENCES question_bank_topics(id, subject_id) ON DELETE RESTRICT,
  CHECK (
    (question_type = 'mcq' AND jsonb_typeof(options) = 'array' AND jsonb_array_length(options) >= 2)
    OR (question_type <> 'mcq' AND options IS NULL)
  ),
  CHECK (
    (content_origin = 'past_question' AND exam_year BETWEEN 1950 AND 2100 AND rights_status IN ('licensed','public_domain'))
    OR
    (content_origin IN ('ai_generated','original_authored') AND exam_year IS NULL AND rights_status = 'original_generated'
      AND question_number LIKE 'AI-GEN-%' AND paper = 'Original practice — not a past paper')
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS question_bank_question_identity_uq
  ON question_bank_questions(source_id, board, subject_id, paper, question_number, COALESCE(exam_year, 0));
CREATE INDEX IF NOT EXISTS question_bank_questions_lookup_idx
  ON question_bank_questions(board, subject_id, review_status, created_at DESC);
CREATE INDEX IF NOT EXISTS question_bank_questions_topic_idx
  ON question_bank_questions(topic_id, board);

CREATE TABLE IF NOT EXISTS question_bank_source_gaps (
  id BIGSERIAL PRIMARY KEY,
  board TEXT NOT NULL CHECK (board IN ('WAEC','NECO','JAMB')),
  subject_id BIGINT NOT NULL REFERENCES question_bank_subjects(id) ON DELETE RESTRICT,
  gap_status TEXT NOT NULL DEFAULT 'rights_permission_required'
    CHECK (gap_status IN ('rights_permission_required','source_not_found','awaiting_source','ready_for_ai_generation','resolved')),
  reason TEXT NOT NULL,
  next_action TEXT NOT NULL,
  source_id UUID REFERENCES question_bank_sources(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(board, subject_id)
);

-- A database-level fail-closed rights gate. The API repeats these checks so
-- operators receive a useful 4xx response before a constraint is reached.
CREATE OR REPLACE FUNCTION question_bank_enforce_source_rights()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  source_row question_bank_sources%ROWTYPE;
BEGIN
  SELECT * INTO source_row
    FROM question_bank_sources
   WHERE id = NEW.source_id
   FOR SHARE;

  IF NOT FOUND OR source_row.is_active IS NOT TRUE THEN
    RAISE EXCEPTION 'Question-bank source is missing or inactive' USING ERRCODE='23514';
  END IF;

  IF source_row.board NOT IN (NEW.board, 'GENERAL') THEN
    RAISE EXCEPTION 'Question board does not match the registered source board' USING ERRCODE='23514';
  END IF;

  IF NEW.content_origin = 'past_question' THEN
    IF source_row.rights_status NOT IN ('licensed','public_domain')
       OR length(trim(COALESCE(source_row.rights_evidence,''))) < 12 THEN
      RAISE EXCEPTION 'Past-question ingestion requires documented licensed or public-domain reuse rights' USING ERRCODE='23514';
    END IF;
  ELSE
    IF source_row.rights_status <> 'original_generated' THEN
      RAISE EXCEPTION 'Original practice content must use an original-generated source record' USING ERRCODE='23514';
    END IF;
  END IF;

  IF NEW.rights_status <> source_row.rights_status THEN
    RAISE EXCEPTION 'Question rights status must match the registered source' USING ERRCODE='23514';
  END IF;

  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS question_bank_source_rights_guard ON question_bank_questions;
CREATE TRIGGER question_bank_source_rights_guard
BEFORE INSERT OR UPDATE OF source_id, board, content_origin, rights_status
ON question_bank_questions
FOR EACH ROW EXECUTE FUNCTION question_bank_enforce_source_rights();

INSERT INTO question_bank_subjects(code, name) VALUES
 ('MATHEMATICS','Mathematics'),
 ('BIOLOGY','Biology'),
 ('CHEMISTRY','Chemistry')
ON CONFLICT (code) DO NOTHING;

INSERT INTO question_bank_topics(subject_id, slug, name, description)
SELECT s.id, v.slug, v.name, v.description
FROM (VALUES
 ('MATHEMATICS','linear-equations','Linear equations','Solving one-variable linear equations.'),
 ('MATHEMATICS','percentages','Percentages','Percentage change, discounts and proportional reasoning.'),
 ('MATHEMATICS','arithmetic-sequences','Arithmetic sequences','Common differences and nth terms.'),
 ('BIOLOGY','osmosis','Osmosis','Water movement across selectively permeable membranes.'),
 ('BIOLOGY','photosynthesis','Photosynthesis','Inputs, outputs and conditions for photosynthesis.'),
 ('CHEMISTRY','atomic-structure','Atomic structure','Protons, neutrons, electrons and atomic number.')
) AS v(subject_code,slug,name,description)
JOIN question_bank_subjects s ON s.code=v.subject_code
ON CONFLICT (subject_id, slug) DO NOTHING;

-- Official portals are recorded as research references only. They are NOT
-- treated as permission to reproduce examination questions.
INSERT INTO question_bank_sources(board,source_name,source_url,access_method,rights_status,rights_evidence)
VALUES
 ('WAEC','WAEC Nigeria e-learning portal','http://e-learning.waecnigeria.com','official_portal','reference_only',
  'Official WAEC FAQ links to this practice portal. No third-party redistribution licence was identified; reference only, no copying.'),
 ('NECO','National Examinations Council official website','https://neco.gov.ng/','official_portal','reference_only',
  'Official examination and syllabus information reference. No open licence to reproduce past questions was identified; reference only.'),
 ('JAMB','Joint Admissions and Matriculation Board official website','https://www.jamb.gov.ng/','official_portal','reference_only',
  'Official JAMB information and syllabus-system reference. No open licence to reproduce past questions was identified; reference only.')
ON CONFLICT DO NOTHING;

INSERT INTO question_bank_sources(board,source_name,source_url,access_method,rights_status,rights_evidence)
SELECT 'GENERAL','STS original practice pilot — AI-assisted, human-verified',NULL,'original_generated','original_generated',
 'Original practice items authored for this application; not transcribed from past papers. Answers and explanations independently checked before approval.'
WHERE NOT EXISTS (
 SELECT 1 FROM question_bank_sources
 WHERE source_name='STS original practice pilot — AI-assisted, human-verified'
);

INSERT INTO question_bank_source_gaps(board,subject_id,gap_status,reason,next_action,source_id)
SELECT b.board, s.id, 'rights_permission_required',
       'No source with documented permission for republication was verified during source research.',
       'Seek written reuse permission or generate and review original exam-style practice questions; do not copy restricted past papers.',
       src.id
FROM (VALUES ('WAEC'),('NECO'),('JAMB')) b(board)
CROSS JOIN question_bank_subjects s
LEFT JOIN question_bank_sources src ON src.board=b.board AND src.rights_status='reference_only'
ON CONFLICT (board,subject_id) DO NOTHING;

-- Six original, answer-checked pilot questions. The board denotes the exam
-- preparation track only: these are NOT represented as questions from a
-- historical examination, and deliberately have no exam year.
WITH src AS (
 SELECT id FROM question_bank_sources
 WHERE source_name='STS original practice pilot — AI-assisted, human-verified'
), pilot(board,subject_code,topic_slug,qno,kind,stem,options,answer,explanation,marks) AS (
 VALUES
 ('WAEC','MATHEMATICS','linear-equations','AI-GEN-001','mcq',
  'Solve the equation 3x − 5 = 16. What is the value of x?',
  '[{"key":"A","text":"5"},{"key":"B","text":"7"},{"key":"C","text":"9"},{"key":"D","text":"11"}]'::jsonb,
  '{"key":"B","value":"7"}'::jsonb,
  'Add 5 to both sides: 3x = 21. Divide both sides by 3 to obtain x = 7.',1),
 ('WAEC','BIOLOGY','osmosis','AI-GEN-002','mcq',
  'A plant cell is placed in distilled water. Which process causes water to enter the cell through its selectively permeable membrane?',
  '[{"key":"A","text":"Diffusion of solute"},{"key":"B","text":"Osmosis"},{"key":"C","text":"Active transport"},{"key":"D","text":"Transpiration"}]'::jsonb,
  '{"key":"B","value":"Osmosis"}'::jsonb,
  'Distilled water has a higher water potential than the cell sap, so water moves into the cell through the selectively permeable membrane by osmosis.',1),
 ('NECO','MATHEMATICS','percentages','AI-GEN-003','mcq',
  'A school bag costs ₦800. A discount of 15% is given. What is the new price?',
  '[{"key":"A","text":"₦620"},{"key":"B","text":"₦660"},{"key":"C","text":"₦680"},{"key":"D","text":"₦700"}]'::jsonb,
  '{"key":"C","value":"₦680"}'::jsonb,
  'The discount is 0.15 × ₦800 = ₦120. Subtracting the discount gives ₦800 − ₦120 = ₦680.',1),
 ('NECO','BIOLOGY','photosynthesis','AI-GEN-004','mcq',
  'Which two substances are the main raw materials used by green plants during photosynthesis?',
  '[{"key":"A","text":"Oxygen and glucose"},{"key":"B","text":"Carbon dioxide and water"},{"key":"C","text":"Nitrogen and oxygen"},{"key":"D","text":"Glucose and water"}]'::jsonb,
  '{"key":"B","value":"Carbon dioxide and water"}'::jsonb,
  'Photosynthesis uses carbon dioxide from the air and water absorbed by roots. Light energy captured by chlorophyll drives the process.',1),
 ('JAMB','MATHEMATICS','arithmetic-sequences','AI-GEN-005','mcq',
  'An arithmetic sequence begins 5, 8, 11, 14, ... What is its 10th term?',
  '[{"key":"A","text":"29"},{"key":"B","text":"30"},{"key":"C","text":"32"},{"key":"D","text":"35"}]'::jsonb,
  '{"key":"C","value":"32"}'::jsonb,
  'The first term is 5 and the common difference is 3. The 10th term is 5 + (10 − 1) × 3 = 32.',1),
 ('JAMB','CHEMISTRY','atomic-structure','AI-GEN-006','mcq',
  'An atom has atomic number 17. How many protons are present in its nucleus?',
  '[{"key":"A","text":"8"},{"key":"B","text":"17"},{"key":"C","text":"18"},{"key":"D","text":"34"}]'::jsonb,
  '{"key":"B","value":"17"}'::jsonb,
  'The atomic number is defined as the number of protons in the nucleus. Therefore, an atom with atomic number 17 has 17 protons.',1)
)
INSERT INTO question_bank_questions
 (board,exam_year,subject_id,paper,question_number,question_type,stem,options,correct_answer,explanation,marks,topic_id,source_id,content_origin,rights_status,review_status)
SELECT p.board,NULL,s.id,'Original practice — not a past paper',p.qno,p.kind,p.stem,p.options,p.answer,p.explanation,p.marks,t.id,src.id,
       'ai_generated','original_generated','approved'
FROM pilot p
JOIN question_bank_subjects s ON s.code=p.subject_code
JOIN question_bank_topics t ON t.subject_id=s.id AND t.slug=p.topic_slug
CROSS JOIN src
ON CONFLICT DO NOTHING;

-- The pilot items have no exam_year and are explicitly labelled as original
-- practice. Resolve only the matching subject/board source gaps for which a
-- usable original practice set now exists; historical past-paper rights gaps
-- remain recorded separately in the source registry's reference_only status.

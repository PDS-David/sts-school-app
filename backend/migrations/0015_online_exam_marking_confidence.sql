-- 0015: Persist structured AI-marking confidence and rubric evidence.
ALTER TABLE online_exam_responses
  ADD COLUMN IF NOT EXISTS marking_confidence NUMERIC(5,4),
  ADD COLUMN IF NOT EXISTS marking_details JSONB NOT NULL DEFAULT '{}'::jsonb;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname='online_exam_responses_marking_confidence_range'
       AND conrelid='online_exam_responses'::regclass
  ) THEN
    ALTER TABLE online_exam_responses
      ADD CONSTRAINT online_exam_responses_marking_confidence_range
      CHECK (marking_confidence IS NULL OR marking_confidence BETWEEN 0 AND 1);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
     WHERE conname='online_exam_responses_marking_details_object'
       AND conrelid='online_exam_responses'::regclass
  ) THEN
    ALTER TABLE online_exam_responses
      ADD CONSTRAINT online_exam_responses_marking_details_object
      CHECK (jsonb_typeof(marking_details)='object');
  END IF;
END $$;

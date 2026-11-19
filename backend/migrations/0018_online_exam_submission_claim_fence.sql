-- 0018: Fence concurrent/reclaimed online-exam grading claims.
ALTER TABLE online_exam_attempts
  ADD COLUMN IF NOT EXISTS submission_claim_token UUID;

-- 0017: Backfill stable provenance locators for the original AI-generated pilot bank.
-- These six records are original practice items, not historical past-paper questions.
UPDATE question_bank_questions q
   SET source_locator = 'pilot-original-ai-2026-11-18:' || q.question_number
  FROM question_bank_ingestion_batches b
  JOIN question_bank_sources s ON s.id=b.source_id
 WHERE q.batch_id=b.id
   AND s.source_name='STS original practice pilot — AI-generated, answer-checked'
   AND b.batch_key='pilot-original-ai-2026-11-18'
   AND q.source_locator IS NULL;

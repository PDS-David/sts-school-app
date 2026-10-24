-- R7 read-only: how many JSS 3 topics currently hold a generated assessment, by assessment status, and how many
-- student submissions would sit behind them. Counts only. Purpose: size what the delivery-correction cache retirement
-- (backend/src/utils/jss3DeliveryCorrection.ts retireStaleJss3Cache) MAY close on first contact after deployment.
-- It does not compute which topics are in correction scope (that is hash-based in code); it is an upper bound.
--   PGOPTIONS='-c default_transaction_read_only=on' psql -X -qAt --set ON_ERROR_STOP=1 --file <this file>
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SELECT COALESCE(jsonb_agg(x ORDER BY x->>'term_label', x->>'assessment_status'), '[]'::jsonb) FROM (
  SELECT jsonb_build_object(
    'term_label', t.term_label,
    'assessment_status', COALESCE(a.status, '(none)'),
    'topics_with_generated_assessment', count(*),
    'submissions_behind_them', COALESCE(sum((SELECT count(*) FROM submissions s WHERE s.assessment_id = a.id)), 0)
  ) AS x
  FROM topics t LEFT JOIN assessments a ON a.id = t.generated_assessment_id
  WHERE t.school_code = 'secondary' AND t.class_name = 'JSS 3' AND t.generated_assessment_id IS NOT NULL
  GROUP BY t.term_label, COALESCE(a.status, '(none)')
) q;
ROLLBACK;

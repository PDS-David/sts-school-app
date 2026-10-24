-- R7 read-only release-state snapshot. Hash/count only: no lesson text, no student identifiers.
-- Run against: (a) the isolated restored copy, (b) production READ-ONLY, before and after the release.
--   PGOPTIONS='-c default_transaction_read_only=on' psql -X -qAt --set ON_ERROR_STOP=1 \
--     -h "$PGHOST" -p "$PGPORT" -d "$PGDATABASE" -U "$PGUSER" \
--     --file docs/jss3/completion/R7_RELEASE_PLAN/snapshot_release_state.sql > "$PRIV/<name>.json"
-- Covers EVERY class (the existing protected export covers Primary/JSS1/JSS2 only, not JSS3 or SS).
-- If a referenced column/table is missing the script errors (ON_ERROR_STOP): stop and report; do not "fix" the target.
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SELECT jsonb_build_object(
  'format', 'r7-release-state-v1',
  'topics', (
    SELECT COALESCE(jsonb_agg(jsonb_build_object(
      'school_code', t.school_code,
      'class_name', t.class_name,
      'subject_name', s.name,
      'term_label', t.term_label,
      'order_index', t.order_index,
      'content_sha256', encode(sha256(convert_to(jsonb_build_array(t.title, t.description, t.source_reference, t.source_file)::text, 'UTF8')), 'hex'),
      'cache_sha256',   encode(sha256(convert_to(jsonb_build_array(t.summary, t.generated_assessment_id::text)::text, 'UTF8')), 'hex'),
      'has_linked_assessment', t.generated_assessment_id IS NOT NULL,
      'completions', (SELECT count(*) FROM topic_completions c WHERE c.topic_id = t.id),
      'assets', (SELECT count(*) FROM topic_assets a WHERE a.topic_id = t.id)
    ) ORDER BY t.school_code, t.class_name, s.name, t.term_label, t.order_index, t.id), '[]'::jsonb)
    FROM topics t LEFT JOIN subjects s ON s.id = t.subject_id
  ),
  'table_counts', jsonb_build_object(
    'topics', (SELECT count(*) FROM topics),
    'topic_assets', (SELECT count(*) FROM topic_assets),
    'topic_completions', (SELECT count(*) FROM topic_completions),
    'submissions', (SELECT count(*) FROM submissions),
    'assessments', (SELECT count(*) FROM assessments),
    'students', (SELECT count(*) FROM students)
  ),
  'assessment_status', (SELECT COALESCE(jsonb_object_agg(st, n), '{}'::jsonb) FROM (SELECT COALESCE(status, '(null)') AS st, count(*) AS n FROM assessments GROUP BY 1) x),
  'snapshot_note', 'counts and digests only'
);
ROLLBACK;

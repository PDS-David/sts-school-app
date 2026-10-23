-- NEW OUTPUT NAME: preflight_protected_curriculum.sql (read-only; counts and names only, no lesson text).
-- Run BEFORE export_protected_curriculum.sql, against the same owner-authorised database.
-- psql -X -qAt --set ON_ERROR_STOP=1 --file scripts/jss3/preflight_protected_curriculum.sql > preflight.json
-- Does not certify anything. Reports what the export would contain and what would block comparison.
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
WITH scope AS (
    SELECT t.*, s.name AS subject_name
    FROM topics t
    LEFT JOIN subjects s ON s.id = t.subject_id AND s.school_code = t.school_code
    WHERE t.class_name ~ '^(Primary|PRY|Grade) [1-6]$' OR t.class_name IN ('JSS 1', 'JSS 2', 'JSS1', 'JSS2')
)
SELECT jsonb_pretty(jsonb_build_object(
    'in_scope_rows', (SELECT count(*) FROM scope),
    'all_topics_rows', (SELECT count(*) FROM topics),
    'rows_with_null_subject_name', (SELECT count(*) FROM scope WHERE subject_name IS NULL),
    'rows_with_null_order_index', (SELECT count(*) FROM scope WHERE order_index IS NULL),
    'rows_with_null_term_label', (SELECT count(*) FROM scope WHERE term_label IS NULL),
    'legacy_class_name_rows', (SELECT count(*) FROM scope WHERE class_name !~ '^Primary [1-6]$' AND class_name NOT IN ('JSS 1', 'JSS 2')),
    'by_school_class_term', COALESCE((SELECT jsonb_agg(jsonb_build_object('school_code', school_code, 'class_name', class_name, 'term_label', term_label, 'rows', n) ORDER BY school_code, class_name, term_label) FROM (SELECT school_code, class_name, term_label, count(*) n FROM scope GROUP BY 1, 2, 3) g), '[]'::jsonb),
    'out_of_scope_class_names', COALESCE((SELECT jsonb_agg(jsonb_build_object('class_name', class_name, 'rows', n) ORDER BY class_name) FROM (SELECT class_name, count(*) n FROM topics WHERE class_name IS NULL OR NOT (class_name ~ '^(Primary|PRY|Grade) [1-6]$' OR class_name IN ('JSS 1', 'JSS 2', 'JSS1', 'JSS2')) GROUP BY 1) o), '[]'::jsonb),
    'duplicate_identity_groups', (SELECT count(*) FROM (SELECT 1 FROM scope GROUP BY school_code, class_name, subject_name, term_label, order_index HAVING count(*) > 1) d)
));
ROLLBACK;

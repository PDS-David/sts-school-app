-- Run only against an owner-authorised backup restore or release-test database.
-- psql -X -qAt --set ON_ERROR_STOP=1 --file scripts/jss3/export_protected_curriculum.sql > protected.json
-- Does not certify provenance, select an arbitrary 2179-row subset, or write data.
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SELECT COALESCE(jsonb_agg(to_jsonb(r) ORDER BY r.school_code, r.class_name, r.subject_name, r.term_label, r.order_index, r.id), '[]'::jsonb)
FROM (
    SELECT t.id, t.school_code, t.subject_id, s.name AS subject_name,
           t.class_name, t.term_label, t.title, t.description,
           t.source_reference, t.source_file, t.order_index
    FROM topics t
    LEFT JOIN subjects s ON s.id = t.subject_id AND s.school_code = t.school_code
    -- Current names plus the legacy spellings that backend/src/db/renameClassNaming.ts maps
    -- to them. Values are exported as stored (never rewritten) so a pre-rename backup is not
    -- silently truncated; scripts/jss3/b_prep/validate_export.py reports any legacy names.
    WHERE t.class_name ~ '^(Primary|PRY|Grade) [1-6]$' OR t.class_name IN ('JSS 1', 'JSS 2', 'JSS1', 'JSS2')
) r;
ROLLBACK;

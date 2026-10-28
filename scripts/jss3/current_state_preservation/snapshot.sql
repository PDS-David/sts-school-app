-- Explicitly invoked only against an authorised target; never writes database data.
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ READ ONLY;
SET LOCAL statement_timeout = '60s';
SET LOCAL lock_timeout = '5s';
SET LOCAL TIME ZONE 'UTC';
-- Refuse an RLS-filtered partial view rather than certify an invisible subset.
SET LOCAL row_security = off;
WITH protected AS (
  SELECT * FROM public.topics WHERE class_name IS DISTINCT FROM 'JSS 3'
), referenced_subjects AS (
  SELECT s.* FROM public.subjects s
  WHERE EXISTS (SELECT 1 FROM protected t WHERE t.subject_id=s.id)
)
SELECT jsonb_build_object(
  'database', jsonb_build_object(
    'name', current_database(),
    'oid', (SELECT oid::text FROM pg_database WHERE datname=current_database()),
    'server_address', inet_server_addr()::text,
    'server_port', inet_server_port()),
  'captured_at', transaction_timestamp(),
  'schema', (SELECT jsonb_agg(to_jsonb(c) ORDER BY c.table_name,c.ordinal_position)
    FROM (SELECT table_name,column_name,ordinal_position,data_type,udt_name,is_nullable
          FROM information_schema.columns WHERE table_schema='public'
          AND table_name IN ('topics','subjects','topic_assets')) c),
  'topics', (SELECT coalesce(jsonb_agg(jsonb_build_object('id',t.id,'data',to_jsonb(t)::text) ORDER BY t.id),'[]'::jsonb) FROM protected t),
  'subjects', (SELECT coalesce(jsonb_agg(jsonb_build_object('id',s.id,'data',to_jsonb(s)::text) ORDER BY s.id),'[]'::jsonb) FROM referenced_subjects s),
  'assets', (SELECT coalesce(jsonb_agg(jsonb_build_object('id',a.id,'data',to_jsonb(a)::text) ORDER BY a.id),'[]'::jsonb)
             FROM public.topic_assets a JOIN protected t ON t.id=a.topic_id)
);
ROLLBACK;

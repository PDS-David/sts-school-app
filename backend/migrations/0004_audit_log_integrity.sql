-- Production schema alignment: restore audit-log protections and the
-- password_hash invariant after OPS-05 baseline adoption.
--
-- This migration intentionally does not synthesize historical actor snapshots
-- or hash-chain values. Existing audit rows remain intact; fields that cannot
-- be recovered faithfully remain NULL. New audit writes may populate them.
--
-- Apply only through the numbered migration runner, after the owner-approved
-- OPS-05 review has adopted 0001 and migrations 0002/0003 have succeeded.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM public.users WHERE password_hash IS NULL) THEN
    RAISE EXCEPTION
      'Refusing to enforce users.password_hash NOT NULL: NULL password hashes exist; review and repair accounts first.';
  END IF;

  ALTER TABLE public.users
    ALTER COLUMN password_hash SET NOT NULL;
END;
$$;

-- Keep audit history independent of user-account deletion. The actor snapshot
-- columns are deliberately nullable for historical events whose original
-- values were never recorded.
ALTER TABLE public.audit_log
  DROP CONSTRAINT IF EXISTS audit_log_actor_id_fkey;

ALTER TABLE public.audit_log ADD COLUMN IF NOT EXISTS actor_role TEXT;
ALTER TABLE public.audit_log ADD COLUMN IF NOT EXISTS actor_school_code TEXT;
ALTER TABLE public.audit_log ADD COLUMN IF NOT EXISTS actor_ip TEXT;
ALTER TABLE public.audit_log ADD COLUMN IF NOT EXISTS request_id UUID;
ALTER TABLE public.audit_log ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE public.audit_log ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.audit_log ADD COLUMN IF NOT EXISTS outcome TEXT NOT NULL DEFAULT 'success';
ALTER TABLE public.audit_log ADD COLUMN IF NOT EXISTS previous_hash TEXT;
ALTER TABLE public.audit_log ADD COLUMN IF NOT EXISTS event_hash TEXT;

UPDATE public.audit_log
   SET created_at = now()
 WHERE created_at IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
      FROM pg_constraint
     WHERE conrelid = 'public.audit_log'::regclass
       AND conname = 'audit_log_outcome_check'
  ) THEN
    ALTER TABLE public.audit_log
      ADD CONSTRAINT audit_log_outcome_check
      CHECK (outcome IN ('success', 'failure', 'denied'));
  END IF;
END;
$$;

CREATE INDEX IF NOT EXISTS idx_audit_log_school_id_desc
  ON public.audit_log (school_code, id DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_id_desc
  ON public.audit_log (actor_id, id DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action_id_desc
  ON public.audit_log (action, id DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_audit_log_event_hash_unique
  ON public.audit_log (event_hash)
  WHERE event_hash IS NOT NULL;

CREATE OR REPLACE FUNCTION public.audit_log_reject_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only; mutation rejected'
    USING ERRCODE = '42501';
END;
$$;

DROP TRIGGER IF EXISTS audit_log_append_only_update_delete ON public.audit_log;
CREATE TRIGGER audit_log_append_only_update_delete
  BEFORE UPDATE OR DELETE ON public.audit_log
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_log_reject_mutation();

DROP TRIGGER IF EXISTS audit_log_append_only_truncate ON public.audit_log;
CREATE TRIGGER audit_log_append_only_truncate
  BEFORE TRUNCATE ON public.audit_log
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.audit_log_reject_mutation();

REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.audit_log FROM PUBLIC;

COMMENT ON TABLE public.audit_log IS
  'Append-only, school-attributed, SHA-256 hash-chained security audit events.';

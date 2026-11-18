-- Physical-class report roster is independent of online student identity.
-- Existing students are backfilled without changing students.class_name,
-- user links, scores, attendance, parent links, or any historical records.

CREATE TABLE IF NOT EXISTS public.report_roster_memberships (
  student_id UUID PRIMARY KEY
    REFERENCES public.students(id) ON DELETE RESTRICT,
  class_name TEXT NOT NULL,
  source_class_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'removed')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  removed_at TIMESTAMPTZ,
  changed_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (status = 'active' AND removed_at IS NULL) OR
    (status = 'removed' AND removed_at IS NOT NULL)
  )
);

CREATE INDEX IF NOT EXISTS idx_report_roster_class_active
  ON public.report_roster_memberships(class_name, student_id)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_report_roster_status_updated
  ON public.report_roster_memberships(status, updated_at DESC);

-- Preserve a complete append-only history of roster membership decisions.
CREATE TABLE IF NOT EXISTS public.report_roster_membership_events (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL
    REFERENCES public.students(id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL
    CHECK (event_type IN ('enrolled', 'class_changed', 'retained', 'removed', 'reinstated')),
  from_class_name TEXT,
  to_class_name TEXT,
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  details JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_report_roster_events_student_time
  ON public.report_roster_membership_events(student_id, occurred_at DESC, id DESC);

-- Backfill every existing student. Soft-deleted students remain represented
-- as removed; their original identity and report history are not deleted.
INSERT INTO public.report_roster_memberships
  (student_id, class_name, source_class_name, status, joined_at, removed_at)
SELECT s.id,
       s.class_name,
       s.class_name,
       CASE WHEN s.deleted_at IS NULL THEN 'active' ELSE 'removed' END,
       COALESCE(s.created_at, now()),
       s.deleted_at
  FROM public.students s
ON CONFLICT (student_id) DO NOTHING;

INSERT INTO public.report_roster_membership_events
  (student_id, event_type, to_class_name, occurred_at, details)
SELECT m.student_id,
       CASE WHEN m.status = 'active' THEN 'enrolled' ELSE 'removed' END,
       m.class_name,
       COALESCE(m.removed_at, m.joined_at),
       jsonb_build_object('source', '0005_report_roster_memberships_backfill')
  FROM public.report_roster_memberships m
 WHERE NOT EXISTS (
   SELECT 1
     FROM public.report_roster_membership_events e
    WHERE e.student_id = m.student_id
 );

CREATE OR REPLACE FUNCTION public.report_roster_events_reject_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'report_roster_membership_events is append-only; mutation rejected'
    USING ERRCODE = '42501';
END;
$$;

DROP TRIGGER IF EXISTS report_roster_events_append_only_update_delete
  ON public.report_roster_membership_events;
CREATE TRIGGER report_roster_events_append_only_update_delete
  BEFORE UPDATE OR DELETE ON public.report_roster_membership_events
  FOR EACH ROW
  EXECUTE FUNCTION public.report_roster_events_reject_mutation();

DROP TRIGGER IF EXISTS report_roster_events_append_only_truncate
  ON public.report_roster_membership_events;
CREATE TRIGGER report_roster_events_append_only_truncate
  BEFORE TRUNCATE ON public.report_roster_membership_events
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.report_roster_events_reject_mutation();

REVOKE UPDATE, DELETE, TRUNCATE ON TABLE public.report_roster_membership_events FROM PUBLIC;

COMMENT ON TABLE public.report_roster_memberships IS
  'Current physical-class report roster membership, independent of online student account linkage.';
COMMENT ON TABLE public.report_roster_membership_events IS
  'Append-only history of physical report-roster enrolment, class changes, removals and reinstatements.';

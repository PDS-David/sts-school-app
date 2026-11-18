-- 0005 could not distinguish physical report-card students from online-only
-- learners, so its provisional backfill must never grant report access.
-- Keep the historical membership/event evidence, but mark every membership
-- created by that backfill as removed until a physical source roster is
-- explicitly reconciled and imported.
--
-- This is safe to apply immediately after 0005, before the new app routes are
-- deployed. It does not alter students, user links, scores, attendance,
-- parent links, or any pre-existing academic history.

WITH unverified AS (
  UPDATE public.report_roster_memberships m
     SET status = 'removed',
         removed_at = COALESCE(m.removed_at, now()),
         changed_by = NULL,
         updated_at = now()
   WHERE m.status = 'active'
     AND EXISTS (
       SELECT 1
         FROM public.report_roster_membership_events e
        WHERE e.student_id = m.student_id
          AND e.event_type = 'enrolled'
          AND e.details->>'source' = '0005_report_roster_memberships_backfill'
     )
  RETURNING m.student_id, m.class_name
)
INSERT INTO public.report_roster_membership_events
  (student_id, event_type, from_class_name, actor_id, occurred_at, details)
SELECT student_id,
       'removed',
       class_name,
       NULL,
       now(),
       jsonb_build_object(
         'source', '0006_explicit_report_roster_enrolment',
         'reason', 'Online student identity does not prove physical report-roster membership',
         'action_required', 'Reconcile against the physical-class source roster before activation'
       )
  FROM unverified;

COMMENT ON TABLE public.report_roster_memberships IS
  'Explicitly reconciled physical-class report roster membership; online-only students are not automatically enrolled.';

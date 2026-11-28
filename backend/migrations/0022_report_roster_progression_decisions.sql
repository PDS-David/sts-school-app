-- Auditable record of physical-class progression decisions (promotion,
-- retention or removal), at most one ACTIVE decision per student per academic
-- year.
--
-- Foundation only: this migration creates structure and database-level
-- safeguards. It does not backfill from report_roster_membership_events and it
-- never modifies students, scores, attendance, remarks, report cards, parent
-- links, online accounts or the report roster tables themselves.
--
-- Model
--   * One row per decision. Decision content is immutable once written.
--   * A decision is 'active' until an administrator ends it. The only permitted
--     UPDATE is the one-way transition active -> superseded | reversed, which
--     records who ended it, when and why.
--   * 'superseded' = replaced by a later decision (the new row points back via
--     supersedes_decision_id). 'reversed' = undone with no replacement.
--   * Superseding or reversing requires an administrator and a written reason,
--     enforced here rather than only in application code.
--   * Rows are never deleted; DELETE and TRUNCATE are rejected.
--   * decided_by / ended_by are immutable actor snapshots, intentionally not
--     user FKs, matching report_roster_membership_events and audit_log.

CREATE TABLE IF NOT EXISTS public.report_roster_progression_decisions (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL
    REFERENCES public.students(id) ON DELETE RESTRICT,
  school_code TEXT NOT NULL
    REFERENCES public.schools(code) ON DELETE RESTRICT,
  academic_year TEXT NOT NULL
    CHECK (btrim(academic_year) <> ''),
  term_id INTEGER NOT NULL
    REFERENCES public.terms(id) ON DELETE RESTRICT,
  term_name TEXT NOT NULL
    CHECK (btrim(term_name) <> ''),
  decision_type TEXT NOT NULL
    CHECK (decision_type IN ('promoted', 'retained', 'removed')),
  from_class_name TEXT NOT NULL
    CHECK (btrim(from_class_name) <> ''),
  to_class_name TEXT,
  decided_by UUID NOT NULL, -- immutable actor snapshot; intentionally not a user FK
  decided_by_role TEXT NOT NULL
    CHECK (decided_by_role IN ('teacher', 'admin')),
  decided_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reason TEXT,
  supersedes_decision_id BIGINT
    REFERENCES public.report_roster_progression_decisions(id) ON DELETE RESTRICT,
  roster_event_id BIGINT
    REFERENCES public.report_roster_membership_events(id) ON DELETE RESTRICT,
  source TEXT NOT NULL DEFAULT 'application'
    CHECK (source IN ('application', 'historical_reconciliation')),
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'superseded', 'reversed')),
  ended_at TIMESTAMPTZ,
  ended_by UUID, -- immutable actor snapshot; intentionally not a user FK
  ended_by_role TEXT
    CHECK (ended_by_role = 'admin'),
  ended_reason TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  CONSTRAINT report_roster_progression_decisions_shape CHECK (
    (decision_type = 'promoted'
       AND to_class_name IS NOT NULL
       AND btrim(to_class_name) <> ''
       AND to_class_name <> from_class_name)
    OR (decision_type = 'retained' AND to_class_name = from_class_name)
    OR (decision_type = 'removed' AND to_class_name IS NULL)
  ),
  CONSTRAINT report_roster_progression_decisions_supersede_requires_admin CHECK (
    supersedes_decision_id IS NULL
    OR (decided_by_role = 'admin' AND btrim(COALESCE(reason, '')) <> '')
  ),
  CONSTRAINT report_roster_progression_decisions_not_self_superseding CHECK (
    supersedes_decision_id IS NULL OR supersedes_decision_id <> id
  ),
  CONSTRAINT report_roster_progression_decisions_end_state CHECK (
    (status = 'active'
       AND ended_at IS NULL AND ended_by IS NULL
       AND ended_by_role IS NULL AND ended_reason IS NULL)
    OR (status IN ('superseded', 'reversed')
       AND ended_at IS NOT NULL AND ended_by IS NOT NULL
       AND ended_by_role = 'admin'
       AND btrim(COALESCE(ended_reason, '')) <> '')
  )
);

-- Database-level guarantee: one active decision per student per academic year.
CREATE UNIQUE INDEX IF NOT EXISTS uq_report_roster_progression_active_student_year
  ON public.report_roster_progression_decisions (student_id, academic_year)
  WHERE status = 'active';

-- A decision can be superseded at most once.
CREATE UNIQUE INDEX IF NOT EXISTS uq_report_roster_progression_supersedes
  ON public.report_roster_progression_decisions (supersedes_decision_id)
  WHERE supersedes_decision_id IS NOT NULL;

-- A roster history event can back at most one decision (for later reconciliation).
CREATE UNIQUE INDEX IF NOT EXISTS uq_report_roster_progression_roster_event
  ON public.report_roster_progression_decisions (roster_event_id)
  WHERE roster_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_report_roster_progression_student_time
  ON public.report_roster_progression_decisions (student_id, decided_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_report_roster_progression_school_year
  ON public.report_roster_progression_decisions (school_code, academic_year, decision_type)
  WHERE status = 'active';

-- Cross-table integrity that a plain CHECK cannot express.
CREATE OR REPLACE FUNCTION public.report_roster_progression_validate_insert()
RETURNS trigger
LANGUAGE plpgsql
AS $progression$
DECLARE
  student_school TEXT;
  term_row RECORD;
  prior RECORD;
BEGIN
  IF NEW.status <> 'active' THEN
    RAISE EXCEPTION 'progression decisions must be inserted as active'
      USING ERRCODE = '23514';
  END IF;

  SELECT s.school_code INTO student_school
    FROM public.students s WHERE s.id = NEW.student_id;
  IF student_school IS DISTINCT FROM NEW.school_code THEN
    RAISE EXCEPTION 'progression decision school_code does not match the student''s school'
      USING ERRCODE = '23514';
  END IF;

  SELECT t.school_code, t.academic_year, t.name INTO term_row
    FROM public.terms t WHERE t.id = NEW.term_id;
  IF term_row.school_code IS DISTINCT FROM NEW.school_code
     OR term_row.academic_year IS DISTINCT FROM NEW.academic_year
     OR term_row.name IS DISTINCT FROM NEW.term_name THEN
    RAISE EXCEPTION 'progression decision term does not match its school, academic year and term name'
      USING ERRCODE = '23514';
  END IF;

  IF NEW.supersedes_decision_id IS NOT NULL THEN
    SELECT d.student_id, d.school_code, d.academic_year, d.status, d.ended_by INTO prior
      FROM public.report_roster_progression_decisions d
     WHERE d.id = NEW.supersedes_decision_id;
    IF NOT FOUND
       OR prior.student_id <> NEW.student_id
       OR prior.school_code <> NEW.school_code
       OR prior.academic_year <> NEW.academic_year THEN
      RAISE EXCEPTION 'a superseding decision must replace a decision for the same student and academic year'
        USING ERRCODE = '23514';
    END IF;
    IF prior.status <> 'superseded' OR prior.ended_by IS DISTINCT FROM NEW.decided_by THEN
      RAISE EXCEPTION 'the superseded decision must first be ended as superseded by the same administrator'
        USING ERRCODE = '23514';
    END IF;
  END IF;

  RETURN NEW;
END;
$progression$;

-- Only the one-way active -> superseded|reversed transition may update a row.
CREATE OR REPLACE FUNCTION public.report_roster_progression_guard_update()
RETURNS trigger
LANGUAGE plpgsql
AS $progression$
DECLARE
  ending_columns CONSTANT TEXT[] :=
    ARRAY['status', 'ended_at', 'ended_by', 'ended_by_role', 'ended_reason'];
BEGIN
  IF (to_jsonb(NEW) - ending_columns) IS DISTINCT FROM (to_jsonb(OLD) - ending_columns) THEN
    RAISE EXCEPTION 'report_roster_progression_decisions is append-only; decision content cannot be changed'
      USING ERRCODE = '42501';
  END IF;
  IF OLD.status <> 'active' THEN
    RAISE EXCEPTION 'an ended progression decision is final and cannot be changed'
      USING ERRCODE = '42501';
  END IF;
  IF NEW.status = 'active' THEN
    RAISE EXCEPTION 'progression decision updates must end the decision (superseded or reversed)'
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$progression$;

CREATE OR REPLACE FUNCTION public.report_roster_progression_reject_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $progression$
BEGIN
  RAISE EXCEPTION 'report_roster_progression_decisions is append-only; mutation rejected'
    USING ERRCODE = '42501';
END;
$progression$;

-- Checked at commit: the old row must be ended first (the insert trigger above
-- enforces that order), and the transaction must then complete the pair, so a
-- 'superseded' row always has a successor and a 'reversed' row never has one.
CREATE OR REPLACE FUNCTION public.report_roster_progression_check_successor()
RETURNS trigger
LANGUAGE plpgsql
AS $progression$
DECLARE
  has_successor BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.report_roster_progression_decisions d
     WHERE d.supersedes_decision_id = NEW.id
  ) INTO has_successor;
  IF NEW.status = 'superseded' AND NOT has_successor THEN
    RAISE EXCEPTION 'a superseded progression decision requires its replacement decision in the same transaction'
      USING ERRCODE = '23514';
  END IF;
  IF NEW.status = 'reversed' AND has_successor THEN
    RAISE EXCEPTION 'a reversed progression decision cannot have a replacement decision'
      USING ERRCODE = '23514';
  END IF;
  RETURN NULL;
END;
$progression$;

DROP TRIGGER IF EXISTS report_roster_progression_validate_insert
  ON public.report_roster_progression_decisions;
CREATE TRIGGER report_roster_progression_validate_insert
  BEFORE INSERT ON public.report_roster_progression_decisions
  FOR EACH ROW
  EXECUTE FUNCTION public.report_roster_progression_validate_insert();

DROP TRIGGER IF EXISTS report_roster_progression_guard_update
  ON public.report_roster_progression_decisions;
CREATE TRIGGER report_roster_progression_guard_update
  BEFORE UPDATE ON public.report_roster_progression_decisions
  FOR EACH ROW
  EXECUTE FUNCTION public.report_roster_progression_guard_update();

DROP TRIGGER IF EXISTS report_roster_progression_append_only_delete
  ON public.report_roster_progression_decisions;
CREATE TRIGGER report_roster_progression_append_only_delete
  BEFORE DELETE ON public.report_roster_progression_decisions
  FOR EACH ROW
  EXECUTE FUNCTION public.report_roster_progression_reject_mutation();

DROP TRIGGER IF EXISTS report_roster_progression_append_only_truncate
  ON public.report_roster_progression_decisions;
CREATE TRIGGER report_roster_progression_append_only_truncate
  BEFORE TRUNCATE ON public.report_roster_progression_decisions
  FOR EACH STATEMENT
  EXECUTE FUNCTION public.report_roster_progression_reject_mutation();

DROP TRIGGER IF EXISTS report_roster_progression_check_successor
  ON public.report_roster_progression_decisions;
CREATE CONSTRAINT TRIGGER report_roster_progression_check_successor
  AFTER INSERT OR UPDATE ON public.report_roster_progression_decisions
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW
  EXECUTE FUNCTION public.report_roster_progression_check_successor();

REVOKE DELETE, TRUNCATE ON TABLE public.report_roster_progression_decisions FROM PUBLIC;

COMMENT ON TABLE public.report_roster_progression_decisions IS
  'Auditable physical-class progression decisions (promoted, retained, removed). At most one active decision per student per academic year; ended decisions are kept and linked to any replacement.';
COMMENT ON COLUMN public.report_roster_progression_decisions.roster_event_id IS
  'Optional link to the report_roster_membership_events row this decision corresponds to; used only by an explicit, evidence-backed reconciliation.';
COMMENT ON COLUMN public.report_roster_progression_decisions.source IS
  'application = recorded by the live workflow; historical_reconciliation = created by an explicit reconciliation of earlier roster events.';

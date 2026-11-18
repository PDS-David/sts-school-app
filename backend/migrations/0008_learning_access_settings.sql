-- 0008: Global administrator controls for online-learning access policy.
-- Defaults preserve the free-launch period. The policy is global because the
-- existing FREE_LAUNCH_MODE, TERM_PIN_ENFORCED and CURRICULUM_SEQUENCE_ENFORCED
-- controls are deployment-wide, not school-tenant settings.

CREATE TABLE IF NOT EXISTS public.learning_access_settings (
  id                         SMALLINT PRIMARY KEY CHECK (id = 1),
  free_launch_mode           BOOLEAN NOT NULL DEFAULT TRUE,
  term_pin_enforced          BOOLEAN NOT NULL DEFAULT FALSE,
  curriculum_sequence_enforced BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by                 UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at                 TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO public.learning_access_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE public.learning_access_settings IS
  'Single global online-learning access policy, editable only by a global admin. Defaults keep the app in free-launch mode.';

ALTER TABLE public.users ADD COLUMN IF NOT EXISTS can_manage_all_schools BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN public.users.can_manage_all_schools IS 'When true for role=admin, grants explicit cross-school administration without changing users.school_code.';

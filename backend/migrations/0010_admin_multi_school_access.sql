ALTER TABLE public.users ADD COLUMN IF NOT EXISTS can_manage_all_schools BOOLEAN NOT NULL DEFAULT FALSE;
COMMENT ON COLUMN public.users.can_manage_all_schools IS 'When true for role=admin, grants explicit cross-school administration without changing users.school_code.';

-- Enable the named existing operations-admin account without changing its school_code.
UPDATE public.users SET can_manage_all_schools = TRUE WHERE username = 'davidadmin' AND role = 'admin';

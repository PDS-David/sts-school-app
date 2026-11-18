-- Explicit class scope for subject teachers. Class teachers continue to use assigned_class.
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS assigned_class_names TEXT[] NOT NULL DEFAULT '{}';

-- Keep teacher PINs as password hashes; this index permits a class/subject
-- username to repeat across schools while preserving uniqueness inside a school.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid='users'::regclass AND contype='u' AND conname='users_username_key') THEN
    ALTER TABLE users DROP CONSTRAINT users_username_key;
  END IF;
END $$;
CREATE UNIQUE INDEX IF NOT EXISTS users_username_global_non_teacher_uq
  ON users (lower(username)) WHERE role <> 'teacher';
CREATE UNIQUE INDEX IF NOT EXISTS users_teacher_school_username_uq
  ON users (school_code, lower(username)) WHERE role = 'teacher';

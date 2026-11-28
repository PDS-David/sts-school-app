-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  Sow the Seed School App  –  Unified PostgreSQL Schema                  ║
-- ║  Roles: student | parent | teacher | admin                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Applied migration history. The runner also creates this table before
-- migrating an existing database, while this definition keeps fresh installs
-- self-contained.
CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version    TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  checksum   TEXT NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Schools ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS schools (
  id          SERIAL PRIMARY KEY,
  code        TEXT UNIQUE NOT NULL,   -- 'primary' | 'secondary'
  name        TEXT NOT NULL,
  address     TEXT,
  phone       TEXT,
  motto       TEXT,
  logo_url    TEXT,
  head_title  TEXT DEFAULT 'Head Teacher',   -- 'Head Teacher' | 'Principal'
  ca1_max     INT  DEFAULT 20,
  ca2_max     INT  DEFAULT 20,
  exam_max    INT  DEFAULT 60,
  admission_prefix TEXT DEFAULT 'STD'
);

INSERT INTO schools(code,name,address,phone,motto,head_title,ca1_max,ca2_max,exam_max,admission_prefix)
VALUES
  ('primary','Sow the Seed Nursery & Primary School','Olosan Road, Alakia, Ibadan',
   '+2348107551000','Growing in Wisdom and finding favour with God and Man. (Luke 2:52)',
   'Head Teacher',20,20,60,'PRI'),
  ('secondary','Sow the Seed Model College','Olosan Road, Alakia, Ibadan',
   '+2348107551000','We all shall be taught of God. John 6:45',
   'Principal',15,15,70,'STD')
ON CONFLICT DO NOTHING;

-- ── Users & Roles ─────────────────────────────────────────────────────────────
-- Postgres has no `CREATE TYPE IF NOT EXISTS`. Keep this guarded so
-- clean schema replay remains idempotent for fresh-install/bootstrap tooling.
-- Incremental production changes belong in numbered backend/migrations files.
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student','parent','teacher','admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username         TEXT NOT NULL,
  password_hash    TEXT NOT NULL,
  role             user_role NOT NULL DEFAULT 'teacher',
  school_code      TEXT REFERENCES schools(code) ON DELETE SET NULL,
  can_manage_all_schools BOOLEAN NOT NULL DEFAULT FALSE,
  full_name        TEXT,
  email            TEXT UNIQUE,
  phone            TEXT,
  assigned_class   TEXT,          -- class_teacher's class e.g. 'JSS1'
  assigned_class_names TEXT[] NOT NULL DEFAULT '{}', -- explicit subject-teacher multi-class scope
  assigned_subject_id INT,        -- subject_teacher's subject
  is_active        BOOLEAN DEFAULT TRUE,
  must_change_pw   BOOLEAN DEFAULT FALSE,
  refresh_token    TEXT,
  access_expires_at TIMESTAMPTZ,   -- admin-set access window for teacher/parent logins; NULL = no expiry (admin accounts)
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Safe to re-run: adds the column on databases created before this field existed.
ALTER TABLE users ADD COLUMN IF NOT EXISTS access_expires_at TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS assigned_class_names TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE users ADD COLUMN IF NOT EXISTS can_manage_all_schools BOOLEAN NOT NULL DEFAULT FALSE;

-- ── Role widened to TEXT + CHECK (Finance Admin / Operations Admin split) ────
-- `role` used to be the fixed `user_role` ENUM above. Adding a new value to a
-- Postgres enum requires `ALTER TYPE ... ADD VALUE`, which Postgres refuses
-- to run inside a transaction block — and migrate.ts sends this entire file
-- to the database as one multi-statement query, which Postgres always wraps
-- in an implicit transaction. That would make adding 'finance_admin' (or any
-- future role) fail the first time it actually needs to be added on a
-- database that already has this table. Converting to TEXT + a CHECK
-- constraint sidesteps this for good: a new role from here on is just a
-- constraint edit — a plain ALTER TABLE, which works fine inside a
-- transaction. Safe to re-run: no-ops once already converted (the `udt_name`
-- check below is only ever true the first time this runs against a given
-- database). The old `user_role` ENUM type itself is left in place, just
-- unused, rather than dropped — nothing depends on dropping it.
DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'role' AND udt_name = 'user_role'
  ) THEN
    ALTER TABLE users ALTER COLUMN role TYPE TEXT USING role::TEXT;
    ALTER TABLE users ALTER COLUMN role SET DEFAULT 'teacher';
  END IF;
END $$;

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check
  CHECK (role IN ('student','parent','teacher','admin','finance_admin'));

CREATE UNIQUE INDEX IF NOT EXISTS users_username_global_non_teacher_uq
  ON users (lower(username)) WHERE role <> 'teacher';
CREATE UNIQUE INDEX IF NOT EXISTS users_teacher_school_username_uq
  ON users (school_code, lower(username)) WHERE role = 'teacher';

-- ── Self-service password recovery ──────────────────────────────────────────
-- No SMTP/SMS delivery channel is relied on for this (email is optional on
-- this table and no SMS gateway is integrated), so recovery is a
-- security-question/answer pair the user sets themselves, checked without
-- requiring a live session. security_answer_hash is bcrypt-hashed exactly
-- like password_hash, never stored in plaintext. must_set_security_question
-- defaults TRUE so both new and pre-existing accounts are prompted to set
-- one on their next login. The fail-count/locked-until pair rate-limits
-- guessing the answer independently of the broader per-IP /auth limiter.
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_question TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer_hash TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS must_set_security_question BOOLEAN DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer_fail_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer_locked_until TIMESTAMPTZ;

-- ── Admin-facing revocation reason ──────────────────────────────────────────
-- Optional free-text note admin attaches when deactivating a user or ending
-- their access early. Surfaced back to the user at login/refresh and in the
-- forgot-password flow instead of a generic "contact admin" message, and
-- kept for admin's own audit trail. NULL means no reason was given.
ALTER TABLE users ADD COLUMN IF NOT EXISTS revocation_reason TEXT;

-- NOTE: the initial admin account is created by `npx tsx src/db/seed.ts`
-- (which hashes a real password with bcrypt), not here. An earlier version of
-- this file inserted a placeholder admin row with a non-functional password
-- hash — if schema.sql was ever run without also running seed.ts afterward,
-- that account could never actually log in. Removed to avoid the confusion;
-- see "Database Setup" in README.md for the correct setup order.

-- ── Terms ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS terms (
  id                SERIAL PRIMARY KEY,
  name              TEXT NOT NULL,              -- '1st Term', '2nd Term', '3rd Term'
  academic_year     TEXT NOT NULL,              -- '2024/2025'
  school_code       TEXT REFERENCES schools(code) ON DELETE CASCADE,
  is_current        BOOLEAN DEFAULT FALSE,
  start_date        DATE,
  end_date          DATE,
  days_opened       INT DEFAULT 0,
  next_term_begins  TEXT,
  UNIQUE(name, academic_year, school_code)
);

-- Ensure only one current term per school
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_current_term
  ON terms(school_code) WHERE is_current = TRUE;

-- ── Classes ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS classes (
  id          SERIAL PRIMARY KEY,
  school_code TEXT REFERENCES schools(code) ON DELETE CASCADE,
  name        TEXT NOT NULL,    -- 'JSS1','JSS2',...,'SS3' | 'Nursery 1',...,'Grade 6'
  arm         TEXT,             -- 'A','B','C' (optional)
  UNIQUE(school_code, name)
);


-- ── Subjects ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subjects (
  id          SERIAL PRIMARY KEY,
  school_code TEXT REFERENCES schools(code) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  code        TEXT,
  UNIQUE(school_code, name)
);

CREATE TABLE IF NOT EXISTS teacher_subjects (
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, subject_id)
);

-- Subject-specialist teaching permissions are granted per class/subject pair.
CREATE TABLE IF NOT EXISTS teacher_class_subjects (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  class_id INTEGER NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  subject_id INTEGER NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, class_id, subject_id)
);
CREATE INDEX IF NOT EXISTS teacher_class_subjects_class_subject_idx
  ON teacher_class_subjects (class_id, subject_id);

INSERT INTO teacher_subjects (user_id, subject_id)
SELECT id, assigned_subject_id FROM users
WHERE assigned_subject_id IS NOT NULL
ON CONFLICT DO NOTHING;


-- ── Students ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS students (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_code      TEXT REFERENCES schools(code) ON DELETE CASCADE,
  admission_number TEXT UNIQUE,
  full_name        TEXT NOT NULL,
  class_name       TEXT NOT NULL,
  gender           TEXT,
  date_of_birth    DATE,
  user_id          UUID REFERENCES users(id) ON DELETE SET NULL,  -- if student has login
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- One user account should never be linked to more than one student row —
-- the app already guards this at the API layer (POST /students/:id/link-user
-- returns 409 if the login is already linked elsewhere), but StudentHomeScreen
-- and MyResultsScreen both trust /students/me to return at most one row and
-- silently use students[0] if it doesn't. This closes the gap at the data
-- layer too, rather than relying solely on that one API-level check.
-- NULL-safe: Postgres UNIQUE constraints allow any number of NULL user_id
-- rows (students with no login yet) without conflict — only a real,
-- non-null duplicate would be rejected.
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_user_id_key;
ALTER TABLE students ADD CONSTRAINT students_user_id_key UNIQUE (user_id);

-- ── Parent–Student link ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS parent_wards (
  parent_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  PRIMARY KEY (parent_id, student_id)
);

-- ── Scores ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS scores (
  id             SERIAL PRIMARY KEY,
  student_id     UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id     INT  REFERENCES subjects(id) ON DELETE CASCADE,
  term_id        INT  REFERENCES terms(id) ON DELETE CASCADE,
  ca1            NUMERIC(5,2) DEFAULT 0,
  ca2            NUMERIC(5,2) DEFAULT 0,
  exam           NUMERIC(5,2) DEFAULT 0,
  total          NUMERIC(5,2) GENERATED ALWAYS AS (ca1 + ca2 + exam) STORED,
  grade          TEXT,
  teacher_remark TEXT,
  entered_by     UUID REFERENCES users(id),
  updated_at     TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject_id, term_id)
);

-- DATA-03: the student's class at the moment this score was first recorded.
-- Stamped server-side by routes/scores.ts (never from client input) and kept
-- on later edits so promotion cannot rewrite a past term's class statistics.
-- Nullable on purpose: existing rows are NOT backfilled (the only source would
-- be today's class, which is the problem being fixed); reports fall back to
-- students.class_name where this is NULL.
ALTER TABLE scores ADD COLUMN IF NOT EXISTS class_name TEXT;

-- ── Attendance ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS attendance (
  id           SERIAL PRIMARY KEY,
  student_id   UUID REFERENCES students(id) ON DELETE CASCADE,
  term_id      INT  REFERENCES terms(id) ON DELETE CASCADE,
  days_present INT DEFAULT 0,
  UNIQUE(student_id, term_id)
);

-- ── Class Records (remarks) ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS class_records (
  id                   SERIAL PRIMARY KEY,
  student_id           UUID REFERENCES students(id) ON DELETE CASCADE,
  term_id              INT  REFERENCES terms(id) ON DELETE CASCADE,
  class_teacher_remark TEXT,
  admin_remark         TEXT,
  updated_at           TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, term_id)
);

-- ── Class Locks ─────────────────────────────────────────────────────────────
-- Added at the school owner's explicit request, as a deliberately simpler
-- alternative to per-record conflict detection: rather than resolving
-- collisions after the fact, a class teacher (or admin) can "close" a whole
-- class's records for a term. While a row exists here, every write to that
-- (school, class, term)'s scores, attendance, class-record remarks, and
-- weekly efforts is rejected — including by the class teacher herself —
-- until the row is deleted (unlocked). Admin writes are never blocked by a
-- lock, matching the "admin unrestricted" pattern used everywhere else in
-- this app. Enforced centrally in checkTeacherStudentScope()
-- (backend/src/utils/scope.ts), which every write route already calls.
CREATE TABLE IF NOT EXISTS class_locks (
  id          SERIAL PRIMARY KEY,
  school_code TEXT REFERENCES schools(code) ON DELETE CASCADE,
  class_name  TEXT NOT NULL,
  term_id     INT  REFERENCES terms(id) ON DELETE CASCADE,
  locked_by   UUID REFERENCES users(id),
  locked_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE(school_code, class_name, term_id)
);

-- ── Weekly Efforts ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS weekly_efforts (
  id                  SERIAL PRIMARY KEY,
  student_id          UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id          INT  REFERENCES subjects(id) ON DELETE SET NULL,
  term_id             INT  REFERENCES terms(id) ON DELETE CASCADE,
  week                INT  CHECK (week BETWEEN 1 AND 13),
  attendance_percent  NUMERIC(5,2),
  tasks_completed     INT,
  tasks_assigned      INT,
  mcq_avg             NUMERIC(5,2),
  teacher_comment     TEXT,
  flags               TEXT[],
  teacher_id          UUID REFERENCES users(id),
  created_at          TIMESTAMPTZ DEFAULT now(),
  UNIQUE(student_id, subject_id, term_id, week)
);

CREATE TABLE IF NOT EXISTS weekly_feedback (
  id               SERIAL PRIMARY KEY,
  weekly_effort_id INT  REFERENCES weekly_efforts(id) ON DELETE CASCADE,
  sender_id        UUID REFERENCES users(id),
  body             TEXT NOT NULL,
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- ── Learning Materials ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS materials (
  id          SERIAL PRIMARY KEY,
  school_code TEXT REFERENCES schools(code) ON DELETE CASCADE,
  subject_id  INT  REFERENCES subjects(id) ON DELETE CASCADE,
  class_name  TEXT,
  term_id     INT  REFERENCES terms(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  type        TEXT NOT NULL,   -- 'pdf','video','doc','link'
  url         TEXT NOT NULL,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Question Bank ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS questions (
  id           SERIAL PRIMARY KEY,
  school_code  TEXT REFERENCES schools(code) ON DELETE CASCADE,
  subject_id   INT  REFERENCES subjects(id) ON DELETE CASCADE,
  class_name   TEXT,
  term_id      INT  REFERENCES terms(id) ON DELETE SET NULL,
  type         TEXT NOT NULL DEFAULT 'mcq',  -- 'mcq' | 'essay'
  stem         TEXT NOT NULL,
  options      JSONB,          -- [{key:'A',text:'...'}, ...]
  correct_keys TEXT[],
  marks        INT DEFAULT 1,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── Assessments ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS assessments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_code TEXT REFERENCES schools(code) ON DELETE CASCADE,
  subject_id  INT  REFERENCES subjects(id) ON DELETE CASCADE,
  class_name  TEXT,
  term_id     INT  REFERENCES terms(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  total_marks INT NOT NULL DEFAULT 0,
  start_at    TIMESTAMPTZ,
  end_at      TIMESTAMPTZ,
  shuffle     BOOLEAN DEFAULT TRUE,
  status      TEXT DEFAULT 'draft',  -- 'draft'|'open'|'closed'
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- JSS3 delivery correction: fingerprint of the corrected teaching a topic-generated assessment was built from
-- (see backend/src/utils/jss3DeliveryCorrection.ts). NULL = built from uncorrected content / legacy.
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS content_fingerprint TEXT;

CREATE TABLE IF NOT EXISTS assessment_questions (
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  question_id   INT  REFERENCES questions(id) ON DELETE CASCADE,
  points        INT NOT NULL DEFAULT 1,
  order_index   INT,
  PRIMARY KEY (assessment_id, question_id)
);

CREATE TABLE IF NOT EXISTS submissions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id UUID REFERENCES assessments(id) ON DELETE CASCADE,
  student_id    UUID REFERENCES students(id) ON DELETE CASCADE,
  answers       JSONB,          -- {question_id: selected_key}
  auto_score    NUMERIC(6,2),
  total_score   NUMERIC(6,2),
  started_at    TIMESTAMPTZ,
  submitted_at  TIMESTAMPTZ,
  UNIQUE(assessment_id, student_id)
);

-- ── Topics ───────────────────────────────────────────────────────────────────
-- Deliberately just rows in a table, created by admin/teacher — same
-- subject/class/term scoping as materials/questions/assessments above, and
-- governed by the same checkTeacherContentScope() rule. No document-parsing
-- ingestion pipeline: "topic" already existed in this app as a free-text
-- string typed into Brainee's explain/notes/generate-questions prompts (see
-- routes/ai.ts) and into CreateAssessmentScreen's draft-topic field; this
-- table just gives that string a persistent identity so completion can be
-- tracked against it.
CREATE TABLE IF NOT EXISTS topics (
  id          SERIAL PRIMARY KEY,
  school_code TEXT REFERENCES schools(code) ON DELETE CASCADE,
  subject_id  INT  REFERENCES subjects(id) ON DELETE CASCADE,
  class_name  TEXT,
  term_id     INT  REFERENCES terms(id) ON DELETE SET NULL,
  title       TEXT NOT NULL,
  description TEXT,
  -- Brainee's study summary, generated once (on the first student to
  -- complete this topic) and cached here rather than regenerated per
  -- student — it's the same canonical content for everyone taking this
  -- topic, unlike the practice exercises below.
  summary     TEXT,
  -- The "standard assessment" Brainee builds for this topic, generated once
  -- and reused for every student who completes it — not one-per-student.
  -- Points at a real row in `assessments`, built from real `questions` rows
  -- exactly like an admin-authored assessment. Created status='open' —
  -- immediately usable, no per-item admin review. The only approval gate is
  -- account-level (is_active/access_expires_at, enforced by requireAuth):
  -- admin approves a student's account access once, not every study
  -- summary/assessment Brainee produces afterward.
  generated_assessment_id UUID REFERENCES assessments(id) ON DELETE SET NULL,
  created_by  UUID REFERENCES users(id),
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Shared AI-generated teaching lesson and practice cache. This is separate
-- from topic completion and from the formal assessment/question bank.
CREATE TABLE IF NOT EXISTS curriculum_generated_lessons (
  cache_key          TEXT PRIMARY KEY CHECK (length(cache_key) BETWEEN 1 AND 240),
  topic_id           INTEGER REFERENCES topics(id) ON DELETE CASCADE,
  class_name         TEXT NOT NULL,
  subject_name       TEXT NOT NULL,
  term_label         TEXT NOT NULL,
  topic_title        TEXT NOT NULL,
  context_sha256     CHAR(64) NOT NULL CHECK (context_sha256 ~ '^[0-9a-f]{64}$'),
  lesson_json        JSONB NOT NULL CHECK (jsonb_typeof(lesson_json) = 'object'),
  generator_version  TEXT NOT NULL,
  generated_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at         TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_curriculum_generated_lessons_topic
  ON curriculum_generated_lessons(topic_id)
  WHERE topic_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_curriculum_generated_lessons_class_subject_term
  ON curriculum_generated_lessons(class_name, subject_name, term_label);

COMMENT ON TABLE curriculum_generated_lessons IS
  'Validated AI curriculum lesson and practice cache; separate from topic completion and formal assessment records.';

-- One row per student per topic they've marked done. No per-student content
-- lives here (see topics.summary above for why) — this table is purely the
-- completion record itself.
CREATE TABLE IF NOT EXISTS topic_completions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id     INT  REFERENCES topics(id) ON DELETE CASCADE,
  student_id   UUID REFERENCES students(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(topic_id, student_id)
);

-- ── Messaging ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
  body         TEXT NOT NULL,
  is_read      BOOLEAN DEFAULT FALSE,
  context_type TEXT,   -- 'weekly_effort' | 'general' | 'report'
  context_id   TEXT,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── Finance ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS fee_items (
  id          SERIAL PRIMARY KEY,
  school_code TEXT REFERENCES schools(code),
  name        TEXT NOT NULL,
  amount      NUMERIC(12,2) NOT NULL,
  class_name  TEXT          -- NULL = applies to all classes
);

CREATE TABLE IF NOT EXISTS invoices (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID REFERENCES students(id) ON DELETE CASCADE,
  term_id    INT  REFERENCES terms(id) ON DELETE SET NULL,
  total      NUMERIC(12,2),
  status     TEXT DEFAULT 'unpaid',   -- 'unpaid'|'partial'|'paid'
  issued_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS invoice_items (
  invoice_id  UUID REFERENCES invoices(id) ON DELETE CASCADE,
  fee_item_id INT  REFERENCES fee_items(id) ON DELETE CASCADE,
  amount      NUMERIC(12,2) NOT NULL,
  PRIMARY KEY (invoice_id, fee_item_id)
);

-- ── Notification Settings ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notification_settings (
  user_id       UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  push_enabled  BOOLEAN DEFAULT TRUE,
  sms_enabled   BOOLEAN DEFAULT FALSE,
  email_enabled BOOLEAN DEFAULT TRUE
);

-- ── Device Push Tokens ──────────────────────────────────────────────────────
-- One row per (user, device). A user logged into the app on two phones should
-- get pushes on both; a token that goes stale on one device shouldn't affect
-- the other. Re-upserted on every login so a reinstalled app naturally
-- replaces its own dead row instead of accumulating duplicates.
CREATE TABLE IF NOT EXISTS device_push_tokens (
  id                BIGSERIAL PRIMARY KEY,
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expo_push_token   TEXT NOT NULL,
  platform          TEXT NOT NULL,  -- 'ios' | 'android'
  last_seen_at      TIMESTAMPTZ DEFAULT now(),
  created_at        TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, expo_push_token)
);

CREATE INDEX IF NOT EXISTS idx_device_push_tokens_user ON device_push_tokens(user_id);

-- DATA-04: durable push delivery ledger — one row per attempted push to one
-- device token, written by utils/push.ts. Records what the provider (Expo)
-- answered at send time ('accepted' = a ticket was issued, which is NOT proof
-- of delivery; Expo receipts are not polled). Only a short body_preview is
-- kept, never the full message. user_id is SET NULL so rows outlive an
-- account. No retention/pruning job exists yet and no route exposes this table.
CREATE TABLE IF NOT EXISTS push_deliveries (
  id                 BIGSERIAL PRIMARY KEY,
  user_id            UUID REFERENCES users(id) ON DELETE SET NULL,
  token              TEXT NOT NULL,
  title              TEXT,
  body_preview       TEXT,
  status             TEXT NOT NULL CHECK (status IN ('queued','accepted','error','pruned')),
  provider_ticket_id TEXT,
  error              TEXT,
  message_id         UUID NULL,
  created_at         TIMESTAMPTZ DEFAULT now(),
  updated_at         TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_push_deliveries_user  ON push_deliveries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_push_deliveries_token ON push_deliveries(token, id DESC);


-- ── Audit Log ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audit_log (
  id          BIGSERIAL PRIMARY KEY,
  actor_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_name  TEXT,
  action      TEXT NOT NULL,
  entity      TEXT NOT NULL,
  entity_id   TEXT,
  school_code TEXT,
  detail      TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- BSEC-029: retain actor snapshots, request attribution and a verifiable
-- append-only hash chain. actor_id is deliberately not an FK: deleting a user
-- must never rewrite historical audit events.
ALTER TABLE audit_log DROP CONSTRAINT IF EXISTS audit_log_actor_id_fkey;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS actor_role TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS actor_school_code TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS actor_ip TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS request_id UUID;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS user_agent TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS metadata JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS outcome TEXT NOT NULL DEFAULT 'success';
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS previous_hash TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS event_hash TEXT;
UPDATE audit_log SET created_at=now() WHERE created_at IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname='audit_log_outcome_check') THEN
    ALTER TABLE audit_log ADD CONSTRAINT audit_log_outcome_check
      CHECK (outcome IN ('success', 'failure', 'denied'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_audit_log_school_id_desc ON audit_log(school_code, id DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_actor_id_desc ON audit_log(actor_id, id DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_action_id_desc ON audit_log(action, id DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_audit_log_event_hash_unique
  ON audit_log(event_hash) WHERE event_hash IS NOT NULL;

CREATE OR REPLACE FUNCTION audit_log_reject_mutation()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  RAISE EXCEPTION 'audit_log is append-only; mutation rejected'
    USING ERRCODE = '42501';
END;
$$;

DROP TRIGGER IF EXISTS audit_log_append_only_update_delete ON audit_log;
CREATE TRIGGER audit_log_append_only_update_delete
  BEFORE UPDATE OR DELETE ON audit_log
  FOR EACH ROW EXECUTE FUNCTION audit_log_reject_mutation();

DROP TRIGGER IF EXISTS audit_log_append_only_truncate ON audit_log;
CREATE TRIGGER audit_log_append_only_truncate
  BEFORE TRUNCATE ON audit_log
  FOR EACH STATEMENT EXECUTE FUNCTION audit_log_reject_mutation();

REVOKE UPDATE, DELETE, TRUNCATE ON TABLE audit_log FROM PUBLIC;
COMMENT ON TABLE audit_log IS 'Append-only, school-attributed, SHA-256 hash-chained security audit events.';


-- ── Email Log Queue ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_log_queue (
  id           BIGSERIAL PRIMARY KEY,
  level        TEXT NOT NULL,   -- 'INFO'|'WARN'|'ERROR'|'SECURITY'
  event        TEXT NOT NULL,
  payload      JSONB,
  processed_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ══════════════════════════════════════════════════════════════════════════════
-- Incremental fixes (schema.sql is re-run in full via `npm run db:migrate`,
-- so changes here must be idempotent — DROP/ADD CONSTRAINT is safe to re-run).
-- ══════════════════════════════════════════════════════════════════════════════

-- Found in QA Pass 3: deleting a subject (DELETE /academic/subjects/:id) had
-- ON DELETE CASCADE from scores, materials, questions, and assessments —
-- so removing one typo'd subject silently, permanently wiped every score,
-- learning material, question-bank entry, and assessment (plus student
-- attempts, via assessments' own cascade) ever recorded against it, with a
-- confirm dialog that didn't even say what would be lost, and returned
-- `{ok:true}` as if nothing of consequence happened. Changed to RESTRICT
-- (default "no action") so Postgres blocks the delete instead — the app's
-- global error handler (see index.ts) already translates that FK violation
-- into a clear "can't delete, still has related records" message. An admin
-- who genuinely needs to remove a subject with history should be told to
-- reassign/archive it, not have it vanish along with everyone's grades.
ALTER TABLE scores      DROP CONSTRAINT IF EXISTS scores_subject_id_fkey;
ALTER TABLE scores      ADD  CONSTRAINT scores_subject_id_fkey      FOREIGN KEY (subject_id) REFERENCES subjects(id);

ALTER TABLE materials    DROP CONSTRAINT IF EXISTS materials_subject_id_fkey;
ALTER TABLE materials    ADD  CONSTRAINT materials_subject_id_fkey   FOREIGN KEY (subject_id) REFERENCES subjects(id);

ALTER TABLE questions    DROP CONSTRAINT IF EXISTS questions_subject_id_fkey;
ALTER TABLE questions    ADD  CONSTRAINT questions_subject_id_fkey   FOREIGN KEY (subject_id) REFERENCES subjects(id);

ALTER TABLE assessments  DROP CONSTRAINT IF EXISTS assessments_subject_id_fkey;
ALTER TABLE assessments  ADD  CONSTRAINT assessments_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES subjects(id);
-- weekly_efforts.subject_id is left as ON DELETE SET NULL — that one only
-- nulls a reference on an effort log, it doesn't delete anyone's data, so
-- CASCADE-adjacent behavior there is fine as originally designed.

-- ── Pass 16: soft-delete for students ─────────────────────────────────────────
-- DELETE /students/:id used to permanently remove the row and, via every
-- other table's `student_id ... ON DELETE CASCADE`, silently wiped every
-- score, attendance record, class record, weekly effort, submission, and
-- invoice ever recorded for that student — with no undo, and (before this
-- same pass) no check that the teacher deleting them had any actual
-- relationship to that student. Converting to a soft delete: the row stays
-- in place (so every historical record still resolves correctly), and is
-- just flagged deleted_at/deleted_by until an admin restores it via
-- POST /students/:id/restore — or, later, a separate deliberate "purge"
-- action is added if a school genuinely needs to permanently erase a record
-- (e.g. for a data-protection request). Additive/nullable columns, so this
-- is safe to run against an existing database with data already in it.
ALTER TABLE students ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE students ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_students_deleted_at ON students(deleted_at);

 
-- ── Physical-class report roster (independent of online student identity) ──
-- A student can have an online account, a physical report-roster membership,
-- both, or neither. Moving/removing a student from this roster never changes
-- students.class_name, students.user_id, scores, attendance or parent links.
CREATE TABLE IF NOT EXISTS report_roster_memberships (
  student_id UUID PRIMARY KEY
    REFERENCES students(id) ON DELETE RESTRICT,
  class_name TEXT NOT NULL,
  source_class_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'removed')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  removed_at TIMESTAMPTZ,
  changed_by UUID REFERENCES users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CHECK (
    (status = 'active' AND removed_at IS NULL) OR
    (status = 'removed' AND removed_at IS NOT NULL)
  )
);
CREATE INDEX IF NOT EXISTS idx_report_roster_class_active
  ON report_roster_memberships(class_name, student_id)
  WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_report_roster_status_updated
  ON report_roster_memberships(status, updated_at DESC);

CREATE TABLE IF NOT EXISTS report_roster_membership_events (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL
    REFERENCES students(id) ON DELETE RESTRICT,
  event_type TEXT NOT NULL
    CHECK (event_type IN ('enrolled', 'class_changed', 'retained', 'removed', 'reinstated')),
  from_class_name TEXT,
  to_class_name TEXT,
  actor_id UUID, -- immutable actor snapshot; intentionally not a user FK
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  details JSONB NOT NULL DEFAULT '{}'::jsonb
);
CREATE INDEX IF NOT EXISTS idx_report_roster_events_student_time
  ON report_roster_membership_events(student_id, occurred_at DESC, id DESC);
CREATE OR REPLACE FUNCTION report_roster_events_reject_mutation()
RETURNS trigger LANGUAGE plpgsql AS $roster$
BEGIN
  RAISE EXCEPTION 'report_roster_membership_events is append-only; mutation rejected'
    USING ERRCODE = '42501';
END;
$roster$;
DROP TRIGGER IF EXISTS report_roster_events_append_only_update_delete
  ON report_roster_membership_events;
CREATE TRIGGER report_roster_events_append_only_update_delete
  BEFORE UPDATE OR DELETE ON report_roster_membership_events
  FOR EACH ROW EXECUTE FUNCTION report_roster_events_reject_mutation();
DROP TRIGGER IF EXISTS report_roster_events_append_only_truncate
  ON report_roster_membership_events;
CREATE TRIGGER report_roster_events_append_only_truncate
  BEFORE TRUNCATE ON report_roster_membership_events
  FOR EACH STATEMENT EXECUTE FUNCTION report_roster_events_reject_mutation();
REVOKE UPDATE, DELETE, TRUNCATE ON TABLE report_roster_membership_events FROM PUBLIC;

-- ── Physical-class progression decisions (promotion / retention / removal) ──
-- At most one ACTIVE decision per student per academic year (partial unique
-- index). Decision content is immutable; the only allowed UPDATE is the
-- one-way active -> superseded|reversed transition, which requires an
-- administrator and a reason. Mirrors migration 0022; keep the two in sync.
CREATE TABLE IF NOT EXISTS report_roster_progression_decisions (
  id BIGSERIAL PRIMARY KEY,
  student_id UUID NOT NULL
    REFERENCES students(id) ON DELETE RESTRICT,
  school_code TEXT NOT NULL
    REFERENCES schools(code) ON DELETE RESTRICT,
  academic_year TEXT NOT NULL
    CHECK (btrim(academic_year) <> ''),
  term_id INTEGER NOT NULL
    REFERENCES terms(id) ON DELETE RESTRICT,
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
    REFERENCES report_roster_progression_decisions(id) ON DELETE RESTRICT,
  roster_event_id BIGINT
    REFERENCES report_roster_membership_events(id) ON DELETE RESTRICT,
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
  ON report_roster_progression_decisions (student_id, academic_year)
  WHERE status = 'active';

-- A decision can be superseded at most once.
CREATE UNIQUE INDEX IF NOT EXISTS uq_report_roster_progression_supersedes
  ON report_roster_progression_decisions (supersedes_decision_id)
  WHERE supersedes_decision_id IS NOT NULL;

-- A roster history event can back at most one decision (for later reconciliation).
CREATE UNIQUE INDEX IF NOT EXISTS uq_report_roster_progression_roster_event
  ON report_roster_progression_decisions (roster_event_id)
  WHERE roster_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_report_roster_progression_student_time
  ON report_roster_progression_decisions (student_id, decided_at DESC, id DESC);

CREATE INDEX IF NOT EXISTS idx_report_roster_progression_school_year
  ON report_roster_progression_decisions (school_code, academic_year, decision_type)
  WHERE status = 'active';

-- Cross-table integrity that a plain CHECK cannot express.
CREATE OR REPLACE FUNCTION report_roster_progression_validate_insert()
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
CREATE OR REPLACE FUNCTION report_roster_progression_guard_update()
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

CREATE OR REPLACE FUNCTION report_roster_progression_reject_mutation()
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
CREATE OR REPLACE FUNCTION report_roster_progression_check_successor()
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
  ON report_roster_progression_decisions;
CREATE TRIGGER report_roster_progression_validate_insert
  BEFORE INSERT ON report_roster_progression_decisions
  FOR EACH ROW
  EXECUTE FUNCTION report_roster_progression_validate_insert();

DROP TRIGGER IF EXISTS report_roster_progression_guard_update
  ON report_roster_progression_decisions;
CREATE TRIGGER report_roster_progression_guard_update
  BEFORE UPDATE ON report_roster_progression_decisions
  FOR EACH ROW
  EXECUTE FUNCTION report_roster_progression_guard_update();

DROP TRIGGER IF EXISTS report_roster_progression_append_only_delete
  ON report_roster_progression_decisions;
CREATE TRIGGER report_roster_progression_append_only_delete
  BEFORE DELETE ON report_roster_progression_decisions
  FOR EACH ROW
  EXECUTE FUNCTION report_roster_progression_reject_mutation();

DROP TRIGGER IF EXISTS report_roster_progression_append_only_truncate
  ON report_roster_progression_decisions;
CREATE TRIGGER report_roster_progression_append_only_truncate
  BEFORE TRUNCATE ON report_roster_progression_decisions
  FOR EACH STATEMENT
  EXECUTE FUNCTION report_roster_progression_reject_mutation();

DROP TRIGGER IF EXISTS report_roster_progression_check_successor
  ON report_roster_progression_decisions;
CREATE CONSTRAINT TRIGGER report_roster_progression_check_successor
  AFTER INSERT OR UPDATE ON report_roster_progression_decisions
  DEFERRABLE INITIALLY DEFERRED
  FOR EACH ROW
  EXECUTE FUNCTION report_roster_progression_check_successor();

REVOKE DELETE, TRUNCATE ON TABLE report_roster_progression_decisions FROM PUBLIC;

COMMENT ON TABLE report_roster_progression_decisions IS
  'Auditable physical-class progression decisions (promoted, retained, removed). At most one active decision per student per academic year; ended decisions are kept and linked to any replacement.';
COMMENT ON COLUMN report_roster_progression_decisions.roster_event_id IS
  'Optional link to the report_roster_membership_events row this decision corresponds to; used only by an explicit, evidence-backed reconciliation.';
COMMENT ON COLUMN report_roster_progression_decisions.source IS
  'application = recorded by the live workflow; historical_reconciliation = created by an explicit reconciliation of earlier roster events.';

-- No online student is automatically enrolled in the physical report roster.
-- Memberships are created only from an explicitly reconciled physical-class source.


-- ── Pass 22: Brainee (AI) — essay grading, weekly-effort summaries ────────────
-- Everything below belongs to the STS Virtual School (questions/assessments/
-- submissions) — the AI grading path. It is intentionally kept on its own
-- tables with no foreign key into `scores`, `attendance`, or `class_records`
-- (the traditional, teacher-entered term-grading system that produces report
-- cards) and no route in this pass writes to any of those three tables.
-- Nothing Brainee suggests or scores can affect a report-card grade.

-- Per-question breakdown of a submission. Before this pass, a submission only
-- had one assessment-wide `answers` JSONB blob and a single `auto_score`
-- number — workable for MCQ-only assessments, but with no way to represent an
-- essay answer's own text, Brainee's suggested score for it, or a teacher's
-- final decision. One row per (submission, question); `answers` on
-- `submissions` is left in place for backward compatibility with any existing
-- code that reads it, but this table is now the authoritative per-question
-- record.
CREATE TABLE IF NOT EXISTS submission_answers (
  id                  SERIAL PRIMARY KEY,
  submission_id       UUID REFERENCES submissions(id) ON DELETE CASCADE,
  question_id         INT  REFERENCES questions(id) ON DELETE CASCADE,
  question_type       TEXT NOT NULL,                  -- 'mcq' | 'essay' (copied at answer time)
  selected_key        TEXT,                            -- mcq only
  answer_text         TEXT,                            -- essay only
  max_points          NUMERIC(6,2) NOT NULL DEFAULT 1,
  awarded_points      NUMERIC(6,2),                     -- final score for this answer, once known
  ai_suggested_points NUMERIC(6,2),                     -- Brainee's suggested score (essay only)
  ai_feedback         TEXT,                             -- Brainee's suggested feedback (essay only)
  -- 'auto'            mcq, machine-graded, final immediately
  -- 'ai_graded'        essay, Brainee graded it, awarded_points = ai_suggested_points, stands as the
  --                    result unless a teacher overrides it
  -- 'teacher_reviewed' essay, a teacher has set/confirmed awarded_points themselves
  -- 'ai_unavailable'   essay, Brainee's call failed (offline/quota/etc) — needs a human to grade it;
  --                    this is the only status with awarded_points still NULL
  grading_status      TEXT NOT NULL DEFAULT 'auto',
  graded_by           UUID REFERENCES users(id) ON DELETE SET NULL,
  graded_at           TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT now(),
  UNIQUE(submission_id, question_id)
);
CREATE INDEX IF NOT EXISTS idx_submission_answers_submission ON submission_answers(submission_id);
CREATE INDEX IF NOT EXISTS idx_submission_answers_needs_review
  ON submission_answers(grading_status) WHERE grading_status = 'ai_unavailable';

-- True unless this submission has at least one essay answer Brainee couldn't
-- grade (grading_status='ai_unavailable') — lets a teacher's "pending
-- marking" count be a real query. (Previously flagged as entirely missing —
-- there was no graded/ungraded flag on submissions at all.)
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS fully_graded BOOLEAN NOT NULL DEFAULT TRUE;

-- Brainee's plain-language weekly summary for a student, generated from the
-- teacher-entered flags/mcq_avg/tasks_* on the same row. Nullable and
-- best-effort by design: if Brainee is unreachable when a weekly effort is
-- saved, this just stays null and the student/parent sees the underlying
-- numbers instead — saving a weekly effort must never depend on Gemini being
-- up (same fail-open principle already used for this app's Redis rate limit).
ALTER TABLE weekly_efforts ADD COLUMN IF NOT EXISTS ai_summary TEXT;
ALTER TABLE weekly_efforts ADD COLUMN IF NOT EXISTS ai_summary_generated_at TIMESTAMPTZ;

-- ── Curriculum ingestion for `topics` (confirmed with Da, 2026-09) ─────────────
-- The `topics` table above was built as an admin/teacher-authored free-text
-- feature, tied to a specific session's term_id. This extends it to also
-- support bulk ingestion from the school's own curriculum documents
-- (schemes of work + lesson notes), which needs two things term_id can't
-- give us:
--   1. Evergreen terms: curriculum content ('1st Term Mathematics — JSS 1')
--      doesn't change year to year, but term_id points at one specific
--      session's row. term_label is a plain string ('1st Term'/'2nd Term'/
--      '3rd Term') so ingested topics survive across sessions without
--      re-ingesting. term_id is left in place, untouched, for any
--      already-existing admin/teacher-authored topic rows that use it —
--      this is additive, not a replacement.
--   2. Content grounding: source_reference holds the raw text extracted
--      from the original curriculum document. It is NEVER shown to a
--      student as-is — Brainee's generated study summary (topics.summary)
--      is what students see, now written FROM this real material instead
--      of just a bare topic title, so quality doesn't depend on generating
--      from nothing. If a Brainee call fails, source_reference is the
--      fallback shown instead of nothing, clearly labeled as unpolished
--      source material rather than presented as the finished lesson.
-- order_index: sequence within (subject_id, class_name, term_label), so a
-- student's topic list renders in the school's actual teaching order.
-- source_file: original filename ingested from — traceability only (e.g.
-- the SS1 1st-term Chemistry duplicate-source situation, still unresolved
-- against the real WAEC/JAMB syllabus per /areas/sts-curriculum-ai.md,
-- needs this to tell the two versions apart).
ALTER TABLE topics ADD COLUMN IF NOT EXISTS term_label TEXT;
ALTER TABLE topics ADD COLUMN IF NOT EXISTS source_reference TEXT;
ALTER TABLE topics ADD COLUMN IF NOT EXISTS order_index INT;
ALTER TABLE topics ADD COLUMN IF NOT EXISTS source_file TEXT;

-- Curriculum ingestion identity is positional within a school's ordered
-- class/subject/term plan. Topic titles may legitimately repeat in different
-- weeks and source_file is traceability only, so neither belongs in identity.
-- NULL order_index values (manually-authored topics outside ingestion) remain
-- unconstrained by ordinary Postgres UNIQUE-with-NULL semantics.
ALTER TABLE topics DROP CONSTRAINT IF EXISTS topics_ingestion_dedupe;
ALTER TABLE topics ADD CONSTRAINT topics_ingestion_dedupe
  UNIQUE (school_code, subject_id, class_name, term_label, order_index);

-- ── Term-PIN gating ──────────────────────────────────────────────────────────
-- Locked decisions (from the original build spec, do not re-litigate):
--   - One PIN per student per term_label, not shared/class-wide.
--   - PIN issuance is independent of Finance/fee payment — no invoice-paid
--     check anywhere in this feature.
--   - A redeemed PIN unlocks only that term's FIRST topic (order_index=1,
--     per subject) in the student's class. Every topic after that is
--     pass-gated automatically (score_percent >= 60 on the previous topic in
--     the same subject/class/term_label sequence), never PIN-gated again.
--   - Topics without an order_index (manually-authored, pre-dating
--     ingestion) are outside this whole scheme — always unlocked, same as
--     before this feature existed.
ALTER TABLE topic_completions ADD COLUMN IF NOT EXISTS passed BOOLEAN;
ALTER TABLE topic_completions ADD COLUMN IF NOT EXISTS score_percent NUMERIC;

CREATE TABLE IF NOT EXISTS term_access_pins (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id   UUID REFERENCES students(id) ON DELETE CASCADE,
  term_label   TEXT NOT NULL,
  pin          TEXT NOT NULL,
  redeemed_at  TIMESTAMPTZ,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT now(),
  -- Re-issuing a PIN for the same (student, term_label) — e.g. a lost slip,
  -- or resetting access — is a plain upsert on this constraint (see
  -- POST /admin/term-pins) rather than a new row, so there's never more
  -- than one live PIN per student per term to keep track of.
  UNIQUE(student_id, term_label)
);

-- ── Self-study timetable (per explicit project-owner spec) ──────────────────
-- Deliberately separate from physical-classroom attendance (see
-- AGENT_CONTINUATION.md's "Confirmed product intent" section) — this is a
-- student-only self-study planning tool, not a real class schedule. Subject
-- list comes from `topics` (DISTINCT subject_id per class_name), not a new
-- class-subject mapping table, since that's already the real source of
-- "what does this class study" for the self-study feature everything here
-- builds on. Priority weighting is computed at query time from `scores`
-- (weaker recent score => more allocated minutes), not stored — see
-- GET /learning/study-plan for the actual formula and its FLOOR/NEUTRAL
-- constants.
CREATE TABLE IF NOT EXISTS student_study_settings (
  student_id     UUID PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
  daily_minutes  INT NOT NULL DEFAULT 120,
  updated_at     TIMESTAMPTZ DEFAULT now()
);

-- Absence of a row means "included" (the default a student sees before ever
-- touching a toggle) — a row only ever gets written the first time a student
-- actually toggles a subject, in either direction. See GET /learning/study-plan
-- for how absence is treated as included=true at read time.
CREATE TABLE IF NOT EXISTS student_study_subjects (
  student_id  UUID REFERENCES students(id) ON DELETE CASCADE,
  subject_id  INTEGER REFERENCES subjects(id) ON DELETE CASCADE,
  included    BOOLEAN NOT NULL DEFAULT true,
  PRIMARY KEY (student_id, subject_id)
);

-- ── Class access codes (Task B — student self-claim) ────────────────────────
-- One code per class (not per student, per explicit decision) — a teacher
-- reads it out once to the room. "Single-use per student" is enforced via
-- students.user_id (already UNIQUE-constrained, see students_user_id_key):
-- once a student's row is linked to a real login account, POST
-- /auth/self-claim refuses to let that same student claim again — but the
-- code itself stays valid for the rest of the class who haven't claimed
-- yet. Plaintext `code`, not hashed — same convention as term_access_pins.pin
-- (a low-stakes, physically-handed-over, admin-re-viewable code, not a
-- long-term account credential like a password).
CREATE TABLE IF NOT EXISTS class_access_codes (
  id           SERIAL PRIMARY KEY,
  school_code  TEXT REFERENCES schools(code) ON DELETE CASCADE,
  class_name   TEXT NOT NULL,
  code         TEXT NOT NULL,
  created_by   UUID REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT now(),
  -- Brute-force protection on the code itself, independent of the broader
  -- per-IP /auth rate limiter — same fail-count/locked-until pattern
  -- already used for security-question answers in users, scoped per class
  -- here since there's no per-student account yet to attach a counter to
  -- at this point in the flow.
  fail_count   INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  -- Regenerating for the same (school_code, class_name) — e.g. the code
  -- leaked, or a fresh term — is a plain upsert (see POST
  -- /admin/class-codes), same reasoning as term_access_pins' upsert.
  UNIQUE(school_code, class_name)
);

-- ── Staff account activation (Task C) ───────────────────────────────────────
-- Unlike Task B's self-claim (a public roster search + two-factor claim,
-- needed because 108 students had no admin-created accounts at all), a
-- staff/teacher account is always created by admin first — identity is
-- already established at creation time. The old flow then made admin
-- generate a temp password and manually relay it before the teacher could
-- ever log in. This replaces that: admin creates the account with no
-- password at all (password_hash nullable specifically for this pending
-- state) plus a short one-time activation code (same plaintext,
-- admin-re-viewable convention as term_access_pins.pin / class_access_codes
-- above — not a long-term credential). The teacher sets their own password
-- once via POST /auth/activate, paired with their specific username server
-- side (same practical tradeoff as term_access_pins), so no temp password
-- ever needs to exist or be communicated. Applies going forward only —
-- accounts already created under the old temp-password flow are untouched.
ALTER TABLE users ALTER COLUMN password_hash DROP NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS activation_code TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS activation_fail_count INT DEFAULT 0;
ALTER TABLE users ADD COLUMN IF NOT EXISTS activation_locked_until TIMESTAMPTZ;

-- students.admission_number was globally UNIQUE, not scoped per school —
-- found while auditing importStudentRoster.ts (Task A of HANDOFF.md):
-- real schools each assign their own admission numbers independently
-- (confirmed in Da's actual report-card data: secondary uses a mix of
-- bare numbers and STD0XX-prefixed ones), so a bare-number primary
-- student and a same-numbered secondary student would collide under the
-- old global constraint — the second insert would be silently dropped by
-- ON CONFLICT DO NOTHING as if already imported, when it's actually a
-- different real student having their record lost. No other route in
-- this codebase looks students up by admission_number alone without
-- school_code (checked: admin.ts, scores.ts only ever SELECT it for
-- display), so narrowing this is safe.
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_admission_number_key;
ALTER TABLE students DROP CONSTRAINT IF EXISTS students_school_admission_unique;
ALTER TABLE students ADD CONSTRAINT students_school_admission_unique
  UNIQUE (school_code, admission_number);

-- Self-registration (student/parent/teacher choose their own username and
-- password directly, no admin-issued activation code or class code needed —
-- see POST /auth/self-register). An account created this way can log in
-- immediately but sees only a waiting screen until an admin reviews and
-- approves it (POST /admin/users/:id/approve) — this is the actual gate,
-- not identity verification at signup time, which is intentionally light
-- per explicit project-owner decision. Distinct from `pending_activation`
-- (Task C, admin-created-but-no-password-yet) — this flag is for an account
-- that already has a real, self-chosen password.
ALTER TABLE users ADD COLUMN IF NOT EXISTS pending_admin_review BOOLEAN DEFAULT FALSE;




-- ── JSS3 supplement sequencing (Task 05; additive, nullable, reversible) ────────
-- sequence_rank positions an APPROVED supplement between two original lessons for
-- display and for its own unlock rule. It never changes order_index, topic ids, the
-- importer identity key, assets or completions. NULL (every row today) means the
-- legacy behaviour: the topic sits at COALESCE(sequence_rank, order_index).
-- Rollback of the column itself is `ALTER TABLE topics DROP COLUMN sequence_rank` and
-- is only safe after every plan was rolled back with applyTopicSequence --rollback.
ALTER TABLE topics ADD COLUMN IF NOT EXISTS sequence_rank NUMERIC(12,6);

-- One row per rank this tool wrote, so rollback is scoped to a school and plan
-- version and never touches rows it did not write or ranks edited afterwards.
CREATE TABLE IF NOT EXISTS topic_sequence_audit (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_version  TEXT NOT NULL,
  plan_hash     TEXT NOT NULL,
  school_code   TEXT NOT NULL,
  topic_id      INT  NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  previous_rank NUMERIC(12,6),
  new_rank      NUMERIC(12,6) NOT NULL,
  applied_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  rolled_back_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_topic_sequence_audit_scope ON topic_sequence_audit(school_code, plan_version);


-- ── Lesson assets (Task 2: Music notation + Basic Technology illustrations) ──
-- ADDITIVE ONLY: one new table, nothing existing is altered. schema.sql is
-- re-run in full on every migration, so every statement here is idempotent.
-- Images are stored in the database (bytea, ~12 MB in total) and are served
-- only by GET /learning/assets/:id — list queries must NEVER select `bytes`.
-- Lesson text (topics.description / summary / source_reference) is untouched:
-- assets are linked to a topic, never embedded in its text.
--   asset_key  : stable human key from the manifest (e.g. 'BT-02', 'W2-1').
--                UNIQUE(topic_id, asset_key) makes re-attaching a no-op while
--                still allowing the same image bytes under two keys.
--   displayed  : false = stored but not shown (e.g. the Wikipedia icon).
--   ON DELETE CASCADE: deleting a topic (e.g. topicsDuplicatePairs.ts) removes
--                its assets with it.
CREATE TABLE IF NOT EXISTS topic_assets (
  id          SERIAL PRIMARY KEY,
  topic_id    INT  NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  asset_key   TEXT NOT NULL,
  kind        TEXT,
  mime        TEXT NOT NULL,
  sha256      TEXT NOT NULL,
  caption     TEXT,
  sort_order  INT  NOT NULL,
  displayed   BOOLEAN NOT NULL DEFAULT true,
  bytes       BYTEA NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE (topic_id, asset_key)
);
-- Screen-reader description of the picture (distinct from the visible caption).
ALTER TABLE topic_assets ADD COLUMN IF NOT EXISTS alt_text TEXT;
CREATE INDEX IF NOT EXISTS idx_topic_assets_topic_id ON topic_assets(topic_id);

-- ── Announcements (PRD-01, owner decision D8: read-only, admin-authored) ───────
-- A notice published by an admin to a school, optionally narrowed to one role
-- and/or one class. Read through GET /announcements; written only through
-- POST/DELETE /announcements (admin). No attachments, comments, read receipts
-- or push in this version.
--   audience_role : NULL = every role.
--   class_name    : NULL = every class in the school; otherwise must name a row
--                   in `classes` for the same school (checked by the route).
--   expires_at    : NULL = never expires.
--   created_by    : ON DELETE SET NULL so deleting an admin account (DELETE
--                   /admin/users/:id) is never blocked by their announcements.
CREATE TABLE IF NOT EXISTS announcements (
  id            BIGSERIAL PRIMARY KEY,
  school_code   TEXT NOT NULL REFERENCES schools(code) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  body          TEXT NOT NULL,
  audience_role TEXT CHECK (audience_role IN ('student','parent','teacher','finance_admin')),
  class_name    TEXT,
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  expires_at    TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_announcements_school ON announcements(school_code, created_at DESC);


-- ── School calendar events ───────────────────────────────────────────────────
-- School calendar events (OPS-01 migration ledger sequence).
CREATE TABLE IF NOT EXISTS school_events (
  id            BIGSERIAL PRIMARY KEY,
  school_code   TEXT NOT NULL REFERENCES schools(code) ON DELETE CASCADE,
  title         TEXT NOT NULL,
  description   TEXT,
  event_type    TEXT NOT NULL DEFAULT 'event'
                CHECK (event_type IN ('event','exam','holiday','meeting','deadline')),
  audience_role TEXT
                CHECK (audience_role IN ('student','parent','teacher')),
  class_name    TEXT,
  start_at      TIMESTAMPTZ NOT NULL,
  end_at        TIMESTAMPTZ,
  created_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ DEFAULT now(),
  CHECK (end_at IS NULL OR end_at >= start_at)
);

CREATE INDEX IF NOT EXISTS idx_school_events_school_start
  ON school_events(school_code, start_at);
CREATE INDEX IF NOT EXISTS idx_school_events_class_start
  ON school_events(school_code, class_name, start_at);

-- ── Global online-learning access policy ──────────────────────────────────
-- One global-admin-controlled policy. Defaults retain free launch and leave
-- term PIN/sequence enforcement off until the owner chooses to enable them.
CREATE TABLE IF NOT EXISTS public.learning_access_settings (
  id                           SMALLINT PRIMARY KEY CHECK (id = 1),
  free_launch_mode             BOOLEAN NOT NULL DEFAULT TRUE,
  term_pin_enforced            BOOLEAN NOT NULL DEFAULT FALSE,
  curriculum_sequence_enforced BOOLEAN NOT NULL DEFAULT FALSE,
  updated_by                   UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at                   TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO public.learning_access_settings (id)
VALUES (1)
ON CONFLICT (id) DO NOTHING;

-- ── Student progress for generated SS1/SS2/SS3 package lessons ─────────────
-- Separate from canonical numeric topic_completions and physical-class reporting.
CREATE TABLE IF NOT EXISTS public.student_curriculum_lesson_progress (
  student_id    UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  lesson_key    TEXT NOT NULL CHECK (length(lesson_key) BETWEEN 1 AND 240),
  class_name    TEXT NOT NULL CHECK (class_name IN ('SS 1', 'SS 2', 'SS 3')),
  subject_name  TEXT NOT NULL,
  term_label    TEXT NOT NULL,
  lesson_title  TEXT NOT NULL,
  completed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (student_id, lesson_key)
);
CREATE INDEX IF NOT EXISTS idx_student_curriculum_progress_class_term
  ON public.student_curriculum_lesson_progress(student_id, class_name, term_label);

-- Stamp the immutable baseline for clean bootstrap/schema.sql installs.
-- Keep this checksum synchronized with backend/migrations/0001_baseline.sql.
INSERT INTO public.schema_migrations(version,name,checksum)
VALUES ('0001','0001_baseline.sql','c7fa9116e76019f76391377e5ec99054bc9f996a61472026b1cced5351e2348e')
ON CONFLICT (version) DO NOTHING;


-- ── 0019: six-digit PIN auth, server-side sessions, layered login throttling ──
-- Mirrors backend/migrations/0019_pin_auth_sessions.sql (idempotent). Keep in sync.
-- 0019: six-digit PIN authentication, server-side sessions, layered login throttling.
--
-- ADDITIVE AND IDEMPOTENT. Nothing here deletes, renames, or invalidates an
-- account, credential, or existing session:
--   * password_hash / refresh_token are untouched. Existing credentials keep
--     working and are verified exactly as before until the user sets a PIN.
--   * No username is renamed and NO unique index on usernames is created here.
--     Global username uniqueness is HELD (docs/auth/held/) until the
--     production duplicate check has been reviewed and approved.
--
-- Safe to re-run, and safe to run after backend/schema.sql (which carries the
-- same statements for fresh installs).

-- ── users: PIN state ─────────────────────────────────────────────────────────
ALTER TABLE users ADD COLUMN IF NOT EXISTS must_set_pin BOOLEAN NOT NULL DEFAULT FALSE;
-- NULL = legacy bcrypt credential (any format, unpeppered). 1 = six-digit PIN,
-- bcrypt over HMAC-SHA256(PIN_PEPPER, pin).
ALTER TABLE users ADD COLUMN IF NOT EXISTS pin_hash_version SMALLINT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pin_set_at TIMESTAMPTZ;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pin_hash_version_check;
ALTER TABLE users ADD CONSTRAINT users_pin_hash_version_check
  CHECK (pin_hash_version IS NULL OR pin_hash_version = 1);

-- Non-unique lookup index matching the login normalisation exactly
-- (lower(btrim(username))). Not a uniqueness rule.
CREATE INDEX IF NOT EXISTS users_username_norm_idx ON users (lower(btrim(username)));

-- ── Any legacy credential write forces PIN setup (public roles only) ─────────
-- The PIN routes set pin_set_at in the same statement as password_hash. Any
-- OTHER write to password_hash (activation, self-claim, forgot-password,
-- admin create/reset, a future route) leaves pin_set_at unchanged, so it can
-- never leave a legacy-format credential that skips the PIN requirement.
-- admin and finance_admin keep their existing credential arrangements: only
-- the hash-version marker is reset, must_set_pin is never set for them.
CREATE OR REPLACE FUNCTION users_enforce_pin_state() RETURNS trigger AS $$
BEGIN
  IF NEW.password_hash IS DISTINCT FROM OLD.password_hash
     AND NEW.pin_set_at IS NOT DISTINCT FROM OLD.pin_set_at THEN
    NEW.pin_hash_version := NULL;
    IF NEW.role IN ('student','parent','teacher') AND NEW.password_hash IS NOT NULL THEN
      NEW.must_set_pin := TRUE;
    END IF;
  END IF;
  RETURN NEW;
END
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_enforce_pin_state_trg ON users;
CREATE TRIGGER users_enforce_pin_state_trg
  BEFORE UPDATE OF password_hash ON users
  FOR EACH ROW EXECUTE FUNCTION users_enforce_pin_state();

-- ── Existing credentials (no one is forced to change a PIN) ─────────────────
-- Existing students, parents and teachers already hold six-digit PINs and are
-- NOT flagged: they sign in and reach their dashboard directly. must_set_pin is
-- set only for administrator-issued temporary credentials (see migration 0020).

-- ── Server-side sessions (multi-device, rotation, revocation) ────────────────
CREATE TABLE IF NOT EXISTS auth_sessions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_hash       TEXT NOT NULL,        -- SHA-256 of the opaque refresh token
  prev_refresh_hash  TEXT,                 -- previous token, honoured only inside the rotation grace window
  prev_rotated_at    TIMESTAMPTZ,
  legacy_refresh_sha TEXT,                 -- SHA-256 of a pre-migration JWT refresh token exchanged into this session
  device_id          TEXT,                 -- client-generated risk signal, never proof of identity
  device_label       TEXT,
  ip                 TEXT,
  remember_me        BOOLEAN NOT NULL DEFAULT FALSE,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_used_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at         TIMESTAMPTZ NOT NULL, -- absolute cap: 30 days (remember me) / 12 hours
  revoked_at         TIMESTAMPTZ,
  revoked_reason     TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS auth_sessions_refresh_hash_uq ON auth_sessions (refresh_hash);
CREATE UNIQUE INDEX IF NOT EXISTS auth_sessions_legacy_sha_uq ON auth_sessions (legacy_refresh_sha) WHERE legacy_refresh_sha IS NOT NULL;
CREATE INDEX IF NOT EXISTS auth_sessions_prev_hash_idx ON auth_sessions (prev_refresh_hash) WHERE prev_refresh_hash IS NOT NULL;
CREATE INDEX IF NOT EXISTS auth_sessions_user_active_idx ON auth_sessions (user_id, last_used_at DESC) WHERE revoked_at IS NULL;
CREATE INDEX IF NOT EXISTS auth_sessions_user_device_idx ON auth_sessions (user_id, device_id) WHERE device_id IS NOT NULL;

-- ── Layered login throttling ─────────────────────────────────────────────────
-- account_key = SHA-256 of the normalised username for EVERY attempt, whether
-- or not the account exists, so throttle behaviour never reveals existence.
CREATE TABLE IF NOT EXISTS auth_login_lanes (
  lane_key        TEXT PRIMARY KEY,         -- 'dev:<account>:<hash>' or 'ip:<account>:<hash>'
  account_key     TEXT NOT NULL,
  fail_count      INTEGER NOT NULL DEFAULT 0,
  locked_until    TIMESTAMPTZ,
  last_failure_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auth_login_lanes_account_idx ON auth_login_lanes (account_key);

CREATE TABLE IF NOT EXISTS auth_login_attempts (
  id           BIGSERIAL PRIMARY KEY,
  account_key  TEXT NOT NULL,
  lane         TEXT NOT NULL CHECK (lane IN ('known','unknown')),
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS auth_login_attempts_window_idx ON auth_login_attempts (account_key, lane, attempted_at DESC);

-- ── PIN recovery requests are NOT created here (administrator-verified reset
-- uses the existing admin reset route; see docs/auth/PROMPT2_PIN_AUTH.md).

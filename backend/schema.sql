-- ╔══════════════════════════════════════════════════════════════════════════╗
-- ║  Sow the Seed School App  –  Unified PostgreSQL Schema                  ║
-- ║  Roles: student | parent | teacher | admin                              ║
-- ╚══════════════════════════════════════════════════════════════════════════╝

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
-- Postgres has no `CREATE TYPE IF NOT EXISTS`, and migrate.ts re-runs this
-- whole file verbatim every time (no migration-tracking table) — so on an
-- already-migrated database this line failed with "type already exists"
-- and aborted the entire migration before anything below it ran (found in
-- QA Pass 3 while adding the ALTER statements further down: `db:migrate`
-- had only ever been tested against a brand-new, never-migrated database).
-- Wrapped so it's a no-op if the type is already there.
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('student','parent','teacher','admin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS users (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username         TEXT UNIQUE NOT NULL,
  password_hash    TEXT NOT NULL,
  role             user_role NOT NULL DEFAULT 'teacher',
  school_code      TEXT REFERENCES schools(code) ON DELETE SET NULL,
  full_name        TEXT,
  email            TEXT UNIQUE,
  phone            TEXT,
  assigned_class   TEXT,          -- class_teacher's class e.g. 'JSS1'
  assigned_subject_id INT,        -- subject_teacher's subject
  is_active        BOOLEAN DEFAULT TRUE,
  must_change_pw   BOOLEAN DEFAULT FALSE,
  refresh_token    TEXT,
  access_expires_at TIMESTAMPTZ,   -- admin-set access window for teacher/parent logins; NULL = no expiry (admin accounts)
  created_at       TIMESTAMPTZ DEFAULT now()
);

-- Safe to re-run: adds the column on databases created before this field existed.
ALTER TABLE users ADD COLUMN IF NOT EXISTS access_expires_at TIMESTAMPTZ;

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



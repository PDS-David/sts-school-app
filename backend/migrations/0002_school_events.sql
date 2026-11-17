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

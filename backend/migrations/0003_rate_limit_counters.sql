-- Shared fixed-window rate-limit counters. Keys are SHA-256 digests;
-- raw IP addresses, account identifiers and usernames are never persisted.
CREATE TABLE IF NOT EXISTS public.rate_limit_counters (
  namespace   TEXT NOT NULL,
  key_hash    CHAR(64) NOT NULL,
  total_hits  BIGINT NOT NULL DEFAULT 0 CHECK (total_hits >= 0),
  reset_at    TIMESTAMPTZ NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (namespace, key_hash),
  CHECK (namespace ~ '^[a-zA-Z0-9:_-]{1,64}$'),
  CHECK (key_hash ~ '^[a-f0-9]{64}$')
);

CREATE INDEX IF NOT EXISTS idx_rate_limit_counters_expiry
  ON public.rate_limit_counters (reset_at);

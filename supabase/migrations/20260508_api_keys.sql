-- Migration: API keys + usage counters for B2B Pro REST API
-- Date: 2026-05-08
-- Phase: 1.4 (B2B Pro tier)

-- ============================================================================
-- API_KEYS TABLE
-- ============================================================================
-- Stores hashed API keys (sha256, never plaintext) issued to B2B Pro users.
-- The key is shown to the user ONCE at creation; only the hash and a 4-char
-- prefix used for display ("gm_live_a1b2…") are persisted.

CREATE TABLE IF NOT EXISTS api_keys (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name         VARCHAR(80) NOT NULL,
    key_prefix   VARCHAR(16) NOT NULL,
    key_hash     VARCHAR(64) NOT NULL UNIQUE,
    last_used_at TIMESTAMPTZ,
    revoked_at   TIMESTAMPTZ,
    created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_hash    ON api_keys(key_hash) WHERE revoked_at IS NULL;

-- ============================================================================
-- API_USAGE TABLE
-- ============================================================================
-- One row per call. Daily aggregate is computed in views; per-call row enables
-- abuse forensics and per-endpoint quota tracking. Row is keyed on
-- (api_key_id, day) for upsert-style increments.

CREATE TABLE IF NOT EXISTS api_usage (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    api_key_id  UUID        NOT NULL REFERENCES api_keys(id) ON DELETE CASCADE,
    user_id     UUID        NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    endpoint    VARCHAR(40) NOT NULL,
    bytes_in    BIGINT      NOT NULL DEFAULT 0,
    bytes_out   BIGINT      NOT NULL DEFAULT 0,
    status_code SMALLINT    NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_api_usage_user_day ON api_usage(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_api_usage_key_day  ON api_usage(api_key_id, created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE api_keys  ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Users can read and manage their own keys; the service role (used by
-- /api/v1/* serverless functions) bypasses RLS for write paths.

CREATE POLICY "Users can view own api keys"
    ON api_keys FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own api keys"
    ON api_keys FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can revoke own api keys"
    ON api_keys FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own api usage"
    ON api_usage FOR SELECT
    USING (auth.uid() = user_id);

-- ============================================================================
-- DAILY USAGE VIEW (for /settings UI)
-- ============================================================================

CREATE OR REPLACE VIEW api_usage_daily AS
SELECT
    user_id,
    api_key_id,
    DATE(created_at) AS day,
    COUNT(*)         AS calls,
    SUM(bytes_in)    AS total_bytes_in,
    SUM(bytes_out)   AS total_bytes_out
FROM api_usage
GROUP BY user_id, api_key_id, DATE(created_at);

GRANT SELECT ON api_usage_daily TO authenticated;

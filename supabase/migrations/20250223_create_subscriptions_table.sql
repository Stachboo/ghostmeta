-- Migration: Create subscriptions table for Lemon Squeezy integration
-- Date: 2025-02-23

-- ============================================================================
-- SUBSCRIPTIONS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL DEFAULT 'lemon_squeezy',
    external_id VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) NOT NULL,
    variant_id INTEGER,
    variant_name VARCHAR(255),
    current_period_end TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast lookups by user_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);

-- Index for fast lookups by external_id
CREATE INDEX IF NOT EXISTS idx_subscriptions_external_id ON subscriptions(external_id);

-- Index for provider lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_provider ON subscriptions(provider);

-- ============================================================================
-- PROFILES TABLE UPDATE (if not exists)
-- ============================================================================

-- Ensure profiles table has is_premium column
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' AND column_name = 'is_premium'
    ) THEN
        ALTER TABLE profiles ADD COLUMN is_premium BOOLEAN DEFAULT false;
    END IF;
END $$;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Enable RLS on subscriptions table
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Service role can manage all subscriptions (for webhook)
-- Note: Edge Functions using Service Role Key bypass RLS

-- ============================================================================
-- TRIGGER FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TRIGGER TO SYNC PROFILE PREMIUM STATUS
-- ============================================================================

CREATE OR REPLACE FUNCTION sync_profile_premium_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update profile is_premium based on active subscription
    UPDATE profiles 
    SET is_premium = (
        SELECT EXISTS (
            SELECT 1 FROM subscriptions 
            WHERE user_id = NEW.user_id 
            AND status IN ('active', 'on_trial')
            AND (current_period_end IS NULL OR current_period_end > now())
        )
    ),
    updated_at = now()
    WHERE id = NEW.user_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER sync_premium_on_subscription_change
    AFTER INSERT OR UPDATE ON subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION sync_profile_premium_status();

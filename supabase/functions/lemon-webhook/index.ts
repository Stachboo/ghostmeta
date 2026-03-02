/**
 * Lemon Squeezy Webhook Handler
 * 
 * This Edge Function securely processes webhooks from Lemon Squeezy
 * for subscription lifecycle events (created, updated, cancelled).
 * 
 * Security:
 * - HMAC-SHA256 signature verification
 * - Service Role Key for database operations (bypasses RLS)
 * - Strict event type validation
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

// ============================================================================
// TYPES
// ============================================================================

interface WebhookPayload {
  meta: {
    event_name: string;
    custom_data?: {
      user_id?: string;
      [key: string]: unknown;
    };
  };
  data: {
    id: string;
    type: string;
    attributes: {
      status: string;
      user_email?: string;
      variant_id?: number;
      variant_name?: string;
      renews_at?: string;
      ends_at?: string | null;
      created_at?: string;
      updated_at?: string;
      test_mode?: boolean;
      [key: string]: unknown;
    };
  };
}

interface SubscriptionRecord {
  id?: string;
  user_id: string;
  provider: 'lemon_squeezy';
  external_id: string;
  status: string;
  variant_id: number | null;
  variant_name: string | null;
  current_period_end: string | null;
  metadata: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const WEBHOOK_SECRET = Deno.env.get('LEMON_SQUEEZY_WEBHOOK_SECRET');

// ============================================================================
// SECURITY: HMAC VERIFICATION
// ============================================================================

/**
 * Verify the webhook signature using HMAC-SHA256
 * @param payload - Raw request body
 * @param signature - X-Signature header value
 * @param secret - Webhook secret
 * @returns boolean indicating if signature is valid
 */
async function verifyWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): Promise<boolean> {
  try {
    // Remove 'sha256=' prefix if present
    const signatureValue = signature.startsWith('sha256=') 
      ? signature.slice(7) 
      : signature;

    // Create HMAC using Web Crypto API
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const messageData = encoder.encode(payload);

    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    );

    const signatureBuffer = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
    const computedSignature = Array.from(new Uint8Array(signatureBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // Constant-time comparison to prevent timing attacks
    if (computedSignature.length !== signatureValue.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < computedSignature.length; i++) {
      result |= computedSignature.charCodeAt(i) ^ signatureValue.charCodeAt(i);
    }

    return result === 0;
  } catch (error) {
    console.error('[VERIFY] HMAC verification error:', error);
    return false;
  }
}

// ============================================================================
// PRIVACY HELPERS
// ============================================================================

/** Masque un email : "user@gmail.com" → "u***@gmail.com" */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return '***';
  return `${local[0]}***@${domain}`;
}

/** Tronque un UUID : "550e8400-e29b-..." → "550e8400" */
function shortId(id: string): string {
  return id.split('-')[0] || id.slice(0, 8);
}

// ============================================================================
// DATABASE OPERATIONS
// ============================================================================

/**
 * Initialize Supabase client with Service Role Key
 */
function getSupabaseClient() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Update user's premium status in profiles table
 */
async function updateUserPremiumStatus(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  isPremium: boolean
): Promise<void> {
  console.log(`[DB] Updating user ${shortId(userId)} premium status to: ${isPremium}`);

  const { error } = await supabase
    .from('profiles')
    .update({ 
      is_premium: isPremium,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('[DB] Failed to update profile:', error);
    throw new Error(`Profile update failed: ${error.message}`);
  }

  console.log(`[DB] Successfully updated profile for user ${shortId(userId)}`);
}

/**
 * Upsert subscription record
 */
async function upsertSubscription(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  payload: WebhookPayload,
  isPremium: boolean
): Promise<void> {
  const { data, meta } = payload;
  const attrs = data.attributes;

  // Determine current_period_end from renews_at or ends_at
  const currentPeriodEnd = attrs.renews_at || attrs.ends_at || null;

  const subscription: SubscriptionRecord = {
    user_id: userId,
    provider: 'lemon_squeezy',
    external_id: data.id,
    status: isPremium ? 'active' : attrs.status.toLowerCase(),
    variant_id: attrs.variant_id || null,
    variant_name: attrs.variant_name || null,
    current_period_end: currentPeriodEnd,
    metadata: {
      event_name: meta.event_name,
      user_email: attrs.user_email,
      test_mode: attrs.test_mode,
      raw_status: attrs.status,
      processed_at: new Date().toISOString(),
    },
    updated_at: new Date().toISOString(),
  };

  console.log('[DB] Upserting subscription:', {
    user: shortId(userId),
    external_id: data.id,
    status: subscription.status,
  });

  const { error } = await supabase
    .from('subscriptions')
    .upsert(subscription, {
      onConflict: 'external_id',
    });

  if (error) {
    console.error('[DB] Failed to upsert subscription:', error);
    throw new Error(`Subscription upsert failed: ${error.message}`);
  }

  console.log(`[DB] Successfully upserted subscription ${data.id}`);
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

/**
 * Process order_created event
 * - Set user as premium
 * - Create subscription record
 */
async function handleOrderCreated(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  payload: WebhookPayload
): Promise<void> {
  console.log('[HANDLER] Processing order_created');
  
  await updateUserPremiumStatus(supabase, userId, true);
  await upsertSubscription(supabase, userId, payload, true);
}

/**
 * Process subscription_created event
 * - Set user as premium
 * - Create subscription record
 */
async function handleSubscriptionCreated(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  payload: WebhookPayload
): Promise<void> {
  console.log('[HANDLER] Processing subscription_created');
  
  await updateUserPremiumStatus(supabase, userId, true);
  await upsertSubscription(supabase, userId, payload, true);
}

/**
 * Process subscription_updated event
 * - Update premium status based on subscription status
 * - Update subscription record
 */
async function handleSubscriptionUpdated(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  payload: WebhookPayload
): Promise<void> {
  console.log('[HANDLER] Processing subscription_updated');
  
  const status = payload.data.attributes.status.toLowerCase();
  const isPremium = ['active', 'on_trial'].includes(status);
  
  console.log(`[HANDLER] Subscription status: ${status}, isPremium: ${isPremium}`);
  
  await updateUserPremiumStatus(supabase, userId, isPremium);
  await upsertSubscription(supabase, userId, payload, isPremium);
}

/**
 * Process subscription_cancelled event
 * - Set user as non-premium (or keep until period end based on business logic)
 * - Update subscription record
 */
async function handleSubscriptionCancelled(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  payload: WebhookPayload
): Promise<void> {
  console.log('[HANDLER] Processing subscription_cancelled');
  
  // Option 1: Immediate downgrade
  // await updateUserPremiumStatus(supabase, userId, false);
  
  // Option 2: Keep premium until period ends (grace period)
  // Check if there's time remaining
  const endsAt = payload.data.attributes.ends_at;
  const now = new Date();
  const hasGracePeriod = endsAt ? new Date(endsAt) > now : false;
  
  console.log(`[HANDLER] Ends at: ${endsAt}, Has grace period: ${hasGracePeriod}`);
  
  // Update subscription but keep premium active until period ends
  await upsertSubscription(supabase, userId, payload, hasGracePeriod);
  
  if (!hasGracePeriod) {
    await updateUserPremiumStatus(supabase, userId, false);
  }
}

// ============================================================================
// MAIN HANDLER
// ============================================================================

serve(async (req: Request) => {
  const requestId = crypto.randomUUID();
  console.log(`\n[${requestId}] ========== WEBHOOK RECEIVED ==========`);
  console.log(`[${requestId}] Method: ${req.method}`);
  console.log(`[${requestId}] URL: ${req.url}`);

  // --------------------------------------------------------------------------
  // VALIDATE REQUEST METHOD
  // --------------------------------------------------------------------------
  if (req.method !== 'POST') {
    console.log(`[${requestId}] ERROR: Method not allowed: ${req.method}`);
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    // ------------------------------------------------------------------------
    // VALIDATE ENVIRONMENT
    // ------------------------------------------------------------------------
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error(`[${requestId}] ERROR: Missing Supabase environment variables`);
      return new Response('Server configuration error', { status: 500 });
    }

    if (!WEBHOOK_SECRET) {
      console.error(`[${requestId}] ERROR: Missing LEMON_SQUEEZY_WEBHOOK_SECRET`);
      return new Response('Webhook secret not configured', { status: 500 });
    }

    // ------------------------------------------------------------------------
    // VERIFY SIGNATURE
    // ------------------------------------------------------------------------
    const signature = req.headers.get('X-Signature');
    
    if (!signature) {
      console.error(`[${requestId}] ERROR: Missing X-Signature header`);
      return new Response('Missing signature', { status: 401 });
    }

    console.log(`[${requestId}] Signature received: ${signature.substring(0, 20)}...`);

    const payload = await req.text();
    console.log(`[${requestId}] Payload length: ${payload.length} bytes`);

    const isValid = await verifyWebhookSignature(payload, signature, WEBHOOK_SECRET);
    
    if (!isValid) {
      console.error(`[${requestId}] ERROR: Invalid webhook signature`);
      return new Response('Invalid signature', { status: 401 });
    }

    console.log(`[${requestId}] Signature verified successfully`);

    // ------------------------------------------------------------------------
    // PARSE PAYLOAD
    // ------------------------------------------------------------------------
    let webhookData: WebhookPayload;
    try {
      webhookData = JSON.parse(payload);
    } catch (e) {
      console.error(`[${requestId}] ERROR: Invalid JSON payload:`, e);
      return new Response('Invalid JSON payload', { status: 400 });
    }

    const { meta, data } = webhookData;
    const eventName = meta.event_name;
    
    console.log(`[${requestId}] Event: ${eventName}`);
    console.log(`[${requestId}] Resource Type: ${data.type}`);
    console.log(`[${requestId}] Resource ID: ${data.id}`);

    // ------------------------------------------------------------------------
    // EXTRACT USER ID
    // ------------------------------------------------------------------------
    const userId = meta.custom_data?.user_id;

    if (!userId) {
      console.error(`[${requestId}] ERROR: Missing user_id in custom_data`);
      return new Response('Missing user_id in custom_data', { status: 400 });
    }

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_REGEX.test(userId)) {
      console.error(`[${requestId}] ERROR: Invalid user_id format: ${userId}`);
      return new Response('Invalid user_id format', { status: 400 });
    }

    console.log(`[${requestId}] User: ${shortId(userId)}`);
    console.log(`[${requestId}] Email: ${maskEmail(data.attributes.user_email || 'N/A')}`);
    console.log(`[${requestId}] Test Mode: ${data.attributes.test_mode || false}`);

    // ------------------------------------------------------------------------
    // INITIALIZE SUPABASE CLIENT
    // ------------------------------------------------------------------------
    const supabase = getSupabaseClient();
    console.log(`[${requestId}] Supabase client initialized`);

    // ------------------------------------------------------------------------
    // ROUTE EVENT TO HANDLER
    // ------------------------------------------------------------------------
    switch (eventName) {
      case 'order_created':
        await handleOrderCreated(supabase, userId, webhookData);
        break;
        
      case 'subscription_created':
        await handleSubscriptionCreated(supabase, userId, webhookData);
        break;
        
      case 'subscription_updated':
        await handleSubscriptionUpdated(supabase, userId, webhookData);
        break;
        
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(supabase, userId, webhookData);
        break;
        
      default:
        console.log(`[${requestId}] WARNING: Unhandled event type: ${eventName}`);
        // Return 200 for unhandled events (idempotent)
        return new Response('Event type not handled', { status: 200 });
    }

    console.log(`[${requestId}] ========== WEBHOOK PROCESSED SUCCESSFULLY ==========\n`);
    
    return new Response(JSON.stringify({
      success: true,
      request_id: requestId,
      event: eventName,
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error(`[${requestId}] CRITICAL ERROR:`, error);
    
    return new Response(JSON.stringify({
      success: false,
      request_id: requestId,
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

# Lemon Squeezy Webhook Handler

Supabase Edge Function for securely processing Lemon Squeezy payment webhooks.

## Features

- ✅ HMAC-SHA256 signature verification
- ✅ Handles order_created, subscription_created, subscription_updated, subscription_cancelled
- ✅ Updates user premium status
- ✅ Maintains subscription history
- ✅ Detailed logging for debugging
- ✅ Grace period handling for cancellations

## Setup

### 1. Database Setup

Run the migration to create the subscriptions table:

```bash
supabase db push
```

Or execute the SQL directly in Supabase SQL Editor:
- File: `supabase/migrations/20250223_create_subscriptions_table.sql`

### 2. Deploy the Edge Function

```bash
# Deploy the function
supabase functions deploy lemon-webhook

# Set the webhook secret
supabase secrets set LEMON_SQUEEZY_WEBHOOK_SECRET=your_signing_secret_here
```

### 3. Configure Lemon Squeezy Webhook

In your Lemon Squeezy dashboard:
1. Go to Settings > Webhooks
2. Add webhook URL: `https://<project-ref>.supabase.co/functions/v1/lemon-webhook`
3. Select events:
   - order_created
   - subscription_created
   - subscription_updated
   - subscription_cancelled
4. Copy the Signing Secret
5. Set it as `LEMON_SQUEEZY_WEBHOOK_SECRET` in Supabase secrets

### 4. Test the Webhook

```bash
# Local testing
curl -X POST http://localhost:54321/functions/v1/lemon-webhook \
  -H "Content-Type: application/json" \
  -H "X-Signature: sha256=your_signature" \
  -d '{
    "meta": {
      "event_name": "subscription_created",
      "custom_data": {"user_id": "test-user-id"}
    },
    "data": {
      "id": "test-sub-id",
      "type": "subscriptions",
      "attributes": {
        "status": "active",
        "variant_id": 123456,
        "variant_name": "Monthly Plan",
        "renews_at": "2025-03-23T00:00:00.000Z"
      }
    }
  }'
```

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Project URL | Auto |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key | Auto |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | Webhook signing secret | Yes |

## Database Schema

### profiles table
```sql
is_premium BOOLEAN DEFAULT false
```

### subscriptions table
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES profiles(id)
provider VARCHAR(50) -- 'lemon_squeezy'
external_id VARCHAR(255) -- Lemon Squeezy ID
status VARCHAR(50) -- 'active', 'cancelled', etc.
variant_id INTEGER
variant_name VARCHAR(255)
current_period_end TIMESTAMPTZ
metadata JSONB
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

## Security

- Signatures verified with HMAC-SHA256
- Constant-time comparison prevents timing attacks
- Service Role Key bypasses RLS for webhook operations
- User ID validated from custom_data

## Logs

View function logs:
```bash
supabase functions logs lemon-webhook --tail
```

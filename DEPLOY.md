# Lemon Squeezy Webhook Deployment Guide

## Prerequisites

- Supabase CLI installed and authenticated
- Lemon Squeezy account with webhook signing secret

## Step-by-Step Deployment

### 1. Deploy the Edge Function

```bash
# Navigate to project directory
cd /home/abdelou/Documents/ghostmeta

# Deploy the function
supabase functions deploy lemon-webhook
```

Output:
```
Deploying lemon-webhook...
Deployed lemon-webhook to https://<project-ref>.supabase.co/functions/v1/lemon-webhook
```

### 2. Set the Webhook Secret

Get your signing secret from Lemon Squeezy Dashboard > Settings > Webhooks

```bash
# Set the secret
supabase secrets set LEMON_SQUEEZY_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxx

# Verify it was set
supabase secrets list
```

### 3. Run Database Migration

```bash
# Push migrations to production
supabase db push

# Or run the SQL directly in Supabase Dashboard > SQL Editor
# Copy contents from: supabase/migrations/20250223_create_subscriptions_table.sql
```

### 4. Configure Lemon Squeezy Webhook URL

In Lemon Squeezy Dashboard:
1. Go to Settings → Webhooks
2. Click "Add Webhook"
3. Set URL to: `https://<project-ref>.supabase.co/functions/v1/lemon-webhook`
4. Select these events:
   - ☑️ order_created
   - ☑️ subscription_created
   - ☑️ subscription_updated
   - ☑️ subscription_cancelled
5. Save and copy the Signing Secret
6. Run step 2 again if you need to update the secret

### 5. Test the Integration

```bash
# Test with curl (requires valid signature)
curl -X POST https://<project-ref>.supabase.co/functions/v1/lemon-webhook \
  -H "Content-Type: application/json" \
  -H "X-Signature: sha256=<valid-signature>" \
  -d '{
    "meta": {
      "event_name": "subscription_created",
      "custom_data": {"user_id": "<test-user-id>"}
    },
    "data": {
      "id": "test-sub-id",
      "type": "subscriptions",
      "attributes": {
        "status": "active",
        "variant_id": 123456,
        "renews_at": "2025-12-31T23:59:59.000Z"
      }
    }
  }'
```

### 6. Monitor Logs

```bash
# Tail function logs
supabase functions logs lemon-webhook --tail

# View recent logs
supabase functions logs lemon-webhook
```

## Troubleshooting

### 401 Unauthorized
- Check that `X-Signature` header is present
- Verify `LEMON_SQUEEZY_WEBHOOK_SECRET` is set correctly
- Ensure signature format matches (with or without `sha256=` prefix)

### 400 Bad Request
- Check that `meta.custom_data.user_id` is present in payload
- Verify JSON is valid

### 500 Server Error
- Check Supabase environment variables are set
- Verify database migration was run
- Check function logs for detailed error

## Useful Commands

```bash
# Redeploy function
supabase functions deploy lemon-webhook

# Update secret
supabase secrets set LEMON_SQUEEZY_WEBHOOK_SECRET=new-secret

# Delete secret
supabase secrets delete LEMON_SQUEEZY_WEBHOOK_SECRET

# List all secrets
supabase secrets list

# Local development
supabase functions serve lemon-webhook --env-file ./supabase/functions/lemon-webhook/.env
```

## Security Checklist

- [ ] Webhook secret stored in Supabase Secrets (not in code)
- [ ] HMAC signature verification enabled
- [ ] Service Role Key used (not Anon Key)
- [ ] RLS enabled on subscriptions table
- [ ] User ID validated from custom_data
- [ ] HTTPS only for production webhook URL

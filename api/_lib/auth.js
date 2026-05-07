/**
 * Server-side API key validation for /api/v1/* endpoints.
 *
 * Auth header: `Authorization: Bearer gm_live_<32 hex>`
 * Lookup is by SHA-256 of the full key against api_keys.key_hash.
 * Records a row in api_usage on success and bumps last_used_at.
 *
 * Requires: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars on Vercel.
 */

import { createHash } from 'node:crypto';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const DAILY_QUOTA_INSPECT = 1000;
const DAILY_QUOTA_STRIP = 500;

function sha256Hex(input) {
  return createHash('sha256').update(input, 'utf8').digest('hex');
}

function extractKey(req) {
  const header = req.headers?.authorization || req.headers?.Authorization;
  if (!header) return null;
  const match = String(header).match(/^Bearer\s+(gm_live_[A-Za-z0-9]{16,})$/);
  return match ? match[1] : null;
}

async function supabaseFetch(path, init = {}) {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase env vars missing');
  }
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

async function lookupKey(keyHash) {
  const url = `api_keys?select=id,user_id,revoked_at&key_hash=eq.${keyHash}&limit=1`;
  const res = await supabaseFetch(url);
  if (!res.ok) return null;
  const rows = await res.json();
  return rows[0] || null;
}

async function countCallsToday(userId, endpoint) {
  const since = new Date();
  since.setUTCHours(0, 0, 0, 0);
  const url = `api_usage?select=id&user_id=eq.${userId}&endpoint=eq.${endpoint}&created_at=gte.${since.toISOString()}`;
  const res = await supabaseFetch(url, { headers: { Prefer: 'count=exact' } });
  if (!res.ok) return 0;
  const range = res.headers.get('content-range') || '';
  const m = range.match(/\/(\d+)$/);
  return m ? parseInt(m[1], 10) : 0;
}

async function recordUsage(record) {
  await supabaseFetch('api_usage', {
    method: 'POST',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify(record),
  });
  await supabaseFetch(`api_keys?id=eq.${record.api_key_id}`, {
    method: 'PATCH',
    headers: { Prefer: 'return=minimal' },
    body: JSON.stringify({ last_used_at: new Date().toISOString() }),
  });
}

/**
 * Validates the Authorization header, returns
 *   { ok: true, apiKeyId, userId, endpoint, quotaRemaining }
 * or { ok: false, status, error } on rejection.
 *
 * The caller is expected to invoke `record(bytesIn, bytesOut, statusCode)`
 * after the response is built so usage is logged precisely once.
 */
export async function authenticateRequest(req, endpoint) {
  const key = extractKey(req);
  if (!key) {
    return { ok: false, status: 401, error: 'Missing or malformed Authorization header' };
  }
  const keyHash = sha256Hex(key);
  const row = await lookupKey(keyHash);
  if (!row) {
    return { ok: false, status: 401, error: 'Invalid API key' };
  }
  if (row.revoked_at) {
    return { ok: false, status: 401, error: 'API key has been revoked' };
  }
  const used = await countCallsToday(row.user_id, endpoint);
  const quota = endpoint === 'strip' ? DAILY_QUOTA_STRIP : DAILY_QUOTA_INSPECT;
  if (used >= quota) {
    return { ok: false, status: 429, error: `Daily quota of ${quota} ${endpoint} calls exceeded` };
  }

  return {
    ok: true,
    apiKeyId: row.id,
    userId: row.user_id,
    endpoint,
    quotaRemaining: quota - used - 1,
    record: (bytesIn, bytesOut, statusCode) =>
      recordUsage({
        api_key_id: row.id,
        user_id: row.user_id,
        endpoint,
        bytes_in: bytesIn,
        bytes_out: bytesOut,
        status_code: statusCode,
      }).catch(() => { /* best effort logging */ }),
  };
}

export { sha256Hex };

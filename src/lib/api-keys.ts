/**
 * Client-side helpers for managing GhostMeta REST API keys.
 *
 * Keys are minted client-side via Web Crypto, hashed (SHA-256), and stored
 * hash-only in Supabase. The plaintext value is shown once on creation and
 * never again. RLS scopes all reads/writes to the authenticated user.
 */
import { supabase } from '@/lib/supabase';

export interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  last_used_at: string | null;
  revoked_at: string | null;
  created_at: string;
}

const KEY_PREFIX = 'gm_live_';
const KEY_BODY_BYTES = 16; // 32 hex chars

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(hashBuffer));
}

export function generateKeyPlaintext(): string {
  const random = new Uint8Array(KEY_BODY_BYTES);
  crypto.getRandomValues(random);
  return KEY_PREFIX + bytesToHex(random);
}

export async function listApiKeys(): Promise<ApiKey[]> {
  const { data, error } = await supabase
    .from('api_keys')
    .select('id, name, key_prefix, last_used_at, revoked_at, created_at')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as ApiKey[];
}

export interface CreatedApiKey {
  meta: ApiKey;
  plaintext: string;
}

export async function createApiKey(name: string): Promise<CreatedApiKey> {
  const trimmed = name.trim().slice(0, 80);
  if (!trimmed) throw new Error('Name is required');

  const plaintext = generateKeyPlaintext();
  const keyHash = await sha256Hex(plaintext);
  const keyPrefix = plaintext.slice(0, KEY_PREFIX.length + 4);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      user_id: user.id,
      name: trimmed,
      key_prefix: keyPrefix,
      key_hash: keyHash,
    })
    .select('id, name, key_prefix, last_used_at, revoked_at, created_at')
    .single();
  if (error) throw error;

  return { meta: data as ApiKey, plaintext };
}

export async function revokeApiKey(id: string): Promise<void> {
  const { error } = await supabase
    .from('api_keys')
    .update({ revoked_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw error;
}

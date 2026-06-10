/**
 * api/v1/inspect.js — POST an image, get back a JSON report.
 *
 * Body: raw image bytes (image/jpeg or image/png), max 10 MB.
 * Auth: Authorization: Bearer gm_live_<...>
 * Response: { format, c2pa, threats[] }
 *
 * Free for B2B Pro tier holders, capped at 1000 calls/day per key.
 */

import { authenticateRequest } from '../_lib/auth.js';
import { detectC2PA } from '../_lib/c2pa-server.js';
import { detectFormat } from '../_lib/strip-server.js';

export const config = {
  api: { bodyParser: false },
};

const MAX_BYTES = 10 * 1024 * 1024;

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BYTES) {
      throw Object.assign(new Error('Payload too large'), { statusCode: 413 });
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://www.ghostmeta.online');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const auth = await authenticateRequest(req, 'inspect');
  if (!auth.ok) {
    return res.status(auth.status).json({ error: auth.error });
  }

  let bodyBuf;
  try {
    bodyBuf = await readBody(req);
  } catch (e) {
    const status = e.statusCode || 400;
    auth.record(0, 0, status);
    return res.status(status).json({ error: e.message });
  }

  const bytes = new Uint8Array(bodyBuf.buffer, bodyBuf.byteOffset, bodyBuf.length);
  const format = detectFormat(bytes);
  if (!format) {
    auth.record(bytes.length, 0, 415);
    return res.status(415).json({ error: 'Unsupported image format. JPEG and PNG only.' });
  }

  const c2pa = detectC2PA(bytes);

  const threats = [];
  if (c2pa.detected) {
    threats.push({
      type: 'c2pa',
      severity: 'warning',
      label: 'AI Content Credentials (C2PA)',
      value: c2pa.generatorLabel || 'Unknown C2PA Generator',
    });
  }

  const payload = {
    format,
    bytes_in: bytes.length,
    c2pa,
    threats,
    quota_remaining: auth.quotaRemaining,
  };
  const json = JSON.stringify(payload);
  auth.record(bytes.length, json.length, 200);

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('X-Quota-Remaining', String(auth.quotaRemaining));
  return res.status(200).send(json);
}

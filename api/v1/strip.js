/**
 * api/v1/strip.js — POST an image, get a cleaned binary back.
 *
 * Body: raw image bytes (image/jpeg or image/png), max 10 MB.
 * Auth: Authorization: Bearer gm_live_<...>
 * Response: cleaned image bytes with the same content type as input.
 *
 * Strip rules: every JPEG APP marker (incl. EXIF / C2PA APP11) and every
 * PNG ancillary text/metadata chunk (tEXt, iTXt, zTXt, eXIf, caBX) is
 * dropped. Image data is preserved byte-for-byte.
 *
 * Free for B2B Pro tier holders, capped at 500 calls/day per key.
 */

import { authenticateRequest } from '../_lib/auth.js';
import { stripBuffer, detectFormat } from '../_lib/strip-server.js';
import { detectC2PA } from '../_lib/c2pa-server.js';

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

  const auth = await authenticateRequest(req, 'strip');
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

  let cleaned;
  try {
    cleaned = stripBuffer(bytes);
  } catch (e) {
    auth.record(bytes.length, 0, 422);
    return res.status(422).json({ error: e.message });
  }

  const c2pa = detectC2PA(bytes);
  auth.record(bytes.length, cleaned.length, 200);

  res.setHeader('Content-Type', format === 'jpeg' ? 'image/jpeg' : 'image/png');
  res.setHeader('X-Quota-Remaining', String(auth.quotaRemaining));
  res.setHeader('X-Original-Size', String(bytes.length));
  res.setHeader('X-Cleaned-Size', String(cleaned.length));
  if (c2pa.detected && c2pa.generatorLabel) {
    res.setHeader('X-C2PA-Detected', c2pa.generatorLabel);
  }
  return res.status(200).send(Buffer.from(cleaned));
}

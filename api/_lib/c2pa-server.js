/**
 * Node-side port of src/lib/c2pa-detector.ts. Identical detection rules,
 * runs in Vercel functions without bundler help. Kept manually in sync.
 */

const JUMB_BOX_TYPE = [0x6A, 0x75, 0x6D, 0x62];
const PNG_SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
const PNG_CABX_CHUNK = [0x63, 0x61, 0x42, 0x58];
const PNG_IEND_CHUNK = [0x49, 0x45, 0x4E, 0x44];

const MANIFEST_SCAN_WINDOW = 16 * 1024;
const MAX_BUFFER_SCAN = 4 * 1024 * 1024;

const GENERATOR_MATCHERS = [
  { generator: 'sora',       label: 'OpenAI Sora',     patterns: [/sora/i, /openai.*sora/i] },
  { generator: 'dalle',      label: 'OpenAI DALL-E',   patterns: [/dall.?e/i, /openai.*dall/i] },
  { generator: 'chatgpt',    label: 'OpenAI ChatGPT',  patterns: [/chatgpt/i, /gpt-?image/i] },
  { generator: 'midjourney', label: 'Midjourney',      patterns: [/midjourney/i] },
  { generator: 'firefly',    label: 'Adobe Firefly',   patterns: [/firefly/i, /adobe.*firefly/i] },
  { generator: 'google',     label: 'Google',          patterns: [/imagen/i, /google\s+ai/i] },
];

function bytesEqual(a, offset, expected) {
  if (a.length < offset + expected.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (a[offset + i] !== expected[i]) return false;
  }
  return true;
}

function readU32BE(bytes, offset) {
  return ((bytes[offset] << 24) >>> 0)
       | (bytes[offset + 1] << 16)
       | (bytes[offset + 2] << 8)
       |  bytes[offset + 3];
}

function identifyGenerator(text) {
  for (const matcher of GENERATOR_MATCHERS) {
    if (matcher.patterns.some((p) => p.test(text))) {
      return { generator: matcher.generator, label: matcher.label };
    }
  }
  if (/openai/i.test(text)) return { generator: 'chatgpt', label: 'OpenAI' };
  if (/adobe/i.test(text))  return { generator: 'firefly', label: 'Adobe' };
  return { generator: 'unknown', label: 'Unknown C2PA Generator' };
}

function detectInJpeg(bytes) {
  const limit = Math.min(bytes.length - 4, MAX_BUFFER_SCAN);
  for (let i = 2; i < limit; i++) {
    if (bytes[i] !== 0xFF || bytes[i + 1] !== 0xEB) continue;
    const segLen = (bytes[i + 2] << 8) | bytes[i + 3];
    const segEnd = Math.min(i + 2 + segLen, bytes.length);
    for (let j = i + 4; j < segEnd - 4; j++) {
      if (bytesEqual(bytes, j, JUMB_BOX_TYPE)) return { offset: j };
    }
    i = segEnd - 1;
  }
  return null;
}

function detectInPng(bytes) {
  if (!bytesEqual(bytes, 0, PNG_SIGNATURE)) return null;
  let offset = 8;
  const limit = Math.min(bytes.length - 12, MAX_BUFFER_SCAN);
  while (offset < limit) {
    const length = readU32BE(bytes, offset);
    if (bytesEqual(bytes, offset + 4, PNG_CABX_CHUNK)) {
      return { offset: offset + 8, length };
    }
    if (bytesEqual(bytes, offset + 4, PNG_IEND_CHUNK)) return null;
    offset += 12 + length;
    if (length < 0 || length > MAX_BUFFER_SCAN) return null;
  }
  return null;
}

function decodeWindow(bytes, offset, size) {
  const end = Math.min(offset + size, bytes.length);
  const slice = bytes.subarray(offset, end);
  try { return new TextDecoder('utf-8', { fatal: false }).decode(slice); }
  catch { return ''; }
}

export function detectC2PA(buffer) {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  if (bytes.length < 16) return { detected: false };

  if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
    const hit = detectInJpeg(bytes);
    if (!hit) return { detected: false, format: 'jpeg' };
    const text = decodeWindow(bytes, hit.offset, MANIFEST_SCAN_WINDOW);
    const { generator, label } = identifyGenerator(text);
    return { detected: true, generator, generatorLabel: label, format: 'jpeg' };
  }

  if (bytesEqual(bytes, 0, PNG_SIGNATURE)) {
    const hit = detectInPng(bytes);
    if (!hit) return { detected: false, format: 'png' };
    const text = decodeWindow(bytes, hit.offset, Math.min(hit.length, MANIFEST_SCAN_WINDOW));
    const { generator, label } = identifyGenerator(text);
    return { detected: true, generator, generatorLabel: label, manifestSize: hit.length, format: 'png' };
  }

  return { detected: false };
}

/**
 * GhostMeta C2PA Detector
 * ───────────────────────
 * Détection légère des Content Credentials C2PA (JUMBF) embarqués dans
 * une image. Couvre JPEG (APP11 segment) et PNG (caBX chunk).
 *
 * Pas de strip ici — le re-encodage canvas dans `stripMetadata()` retire
 * naturellement le manifest puisque `canvas.toBlob()` ne préserve pas les
 * boxes externes. Cette détection sert uniquement à informer l'utilisateur
 * de la présence et de la provenance avant le strip.
 *
 * Identification du générateur IA : heuristique par scan de chaînes connues
 * dans la fenêtre du manifest (OpenAI/Sora, DALL-E, Midjourney, Adobe Firefly,
 * Google, ChatGPT). Suffisant pour l'UI threat-level. Une parsing JUMBF
 * complète viendra avec `@trustnxt/c2pa-ts` quand le package sera stable.
 */
import { logSecurityEvent } from "@/lib/security-logger";

export type C2PAGenerator =
  | 'sora'
  | 'dalle'
  | 'chatgpt'
  | 'midjourney'
  | 'firefly'
  | 'google'
  | 'unknown';

export interface C2PAInfo {
  detected: boolean;
  generator?: C2PAGenerator;
  generatorLabel?: string;
  manifestSize?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

const JUMB_BOX_TYPE = [0x6A, 0x75, 0x6D, 0x62];
const PNG_SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
const PNG_CABX_CHUNK = [0x63, 0x61, 0x42, 0x58];
const PNG_IEND_CHUNK = [0x49, 0x45, 0x4E, 0x44];

const MANIFEST_SCAN_WINDOW = 16 * 1024;
const MAX_BUFFER_SCAN = 4 * 1024 * 1024;

interface GeneratorMatcher {
  generator: C2PAGenerator;
  label: string;
  patterns: RegExp[];
}

const GENERATOR_MATCHERS: readonly GeneratorMatcher[] = [
  { generator: 'sora',       label: 'OpenAI Sora',     patterns: [/sora/i, /openai.*sora/i] },
  { generator: 'dalle',      label: 'OpenAI DALL-E',   patterns: [/dall.?e/i, /openai.*dall/i] },
  { generator: 'chatgpt',    label: 'OpenAI ChatGPT',  patterns: [/chatgpt/i, /gpt-?image/i] },
  { generator: 'midjourney', label: 'Midjourney',      patterns: [/midjourney/i] },
  { generator: 'firefly',    label: 'Adobe Firefly',   patterns: [/firefly/i, /adobe.*firefly/i] },
  { generator: 'google',     label: 'Google',          patterns: [/imagen/i, /google\s+ai/i] },
];

function bytesEqual(a: Uint8Array, offset: number, expected: readonly number[]): boolean {
  if (a.length < offset + expected.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (a[offset + i] !== expected[i]) return false;
  }
  return true;
}

function readU32BE(bytes: Uint8Array, offset: number): number {
  return (
    ((bytes[offset]     ?? 0) << 24) >>> 0 |
    ((bytes[offset + 1] ?? 0) << 16) |
    ((bytes[offset + 2] ?? 0) << 8) |
     (bytes[offset + 3] ?? 0)
  );
}

function identifyGenerator(text: string): { generator: C2PAGenerator; label: string } {
  for (const matcher of GENERATOR_MATCHERS) {
    if (matcher.patterns.some((p) => p.test(text))) {
      return { generator: matcher.generator, label: matcher.label };
    }
  }
  if (/openai/i.test(text)) return { generator: 'chatgpt',  label: 'OpenAI' };
  if (/adobe/i.test(text))  return { generator: 'firefly',  label: 'Adobe' };
  return { generator: 'unknown', label: 'Unknown C2PA Generator' };
}

function detectInJpeg(bytes: Uint8Array): { offset: number } | null {
  // JPEG: scan APP11 markers (0xFF 0xEB) and look for the JUMBF "jumb"
  // box type within the segment payload. APP11 carries C2PA per ISO 19566-5.
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

function detectInPng(bytes: Uint8Array): { offset: number; length: number } | null {
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

function decodeWindow(bytes: Uint8Array, offset: number, size: number): string {
  const end = Math.min(offset + size, bytes.length);
  const slice = bytes.subarray(offset, end);
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(slice);
  } catch {
    return '';
  }
}

/**
 * Détecte la présence de Content Credentials C2PA dans une image et
 * tente d'identifier le générateur IA par heuristique. Retourne toujours
 * un objet — `detected: false` si rien trouvé. Ne lève jamais.
 */
export function detectC2PA(buffer: ArrayBuffer): C2PAInfo {
  try {
    const bytes = new Uint8Array(buffer);
    if (bytes.length < 16) return { detected: false };

    if (bytes[0] === 0xFF && bytes[1] === 0xD8) {
      const hit = detectInJpeg(bytes);
      if (!hit) return { detected: false, format: 'jpeg' };
      const text = decodeWindow(bytes, hit.offset, MANIFEST_SCAN_WINDOW);
      const { generator, label } = identifyGenerator(text);
      return {
        detected: true,
        generator,
        generatorLabel: label,
        format: 'jpeg',
      };
    }

    if (bytesEqual(bytes, 0, PNG_SIGNATURE)) {
      const hit = detectInPng(bytes);
      if (!hit) return { detected: false, format: 'png' };
      const text = decodeWindow(bytes, hit.offset, Math.min(hit.length, MANIFEST_SCAN_WINDOW));
      const { generator, label } = identifyGenerator(text);
      return {
        detected: true,
        generator,
        generatorLabel: label,
        manifestSize: hit.length,
        format: 'png',
      };
    }

    return { detected: false };
  } catch (e) {
    logSecurityEvent('PROCESSING_ERROR', 'C2PA detection failed', {
      error: e instanceof Error ? e.message : String(e),
    });
    return { detected: false };
  }
}

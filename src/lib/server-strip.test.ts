/**
 * Verifies that the pure-JS server-side strip in api/_lib/strip-server.js
 * produces a valid byte sequence that retains image data while dropping
 * APP / metadata segments. Imported via relative path because the api/
 * folder is outside src/ and isn't in the bundler's resolution scope.
 */
import { describe, it, expect } from 'vitest';
// @ts-expect-error — pure-JS server lib, no types
import { stripBuffer, detectFormat } from '../../api/_lib/strip-server.js';
// @ts-expect-error — pure-JS server lib, no types
import { detectC2PA as detectC2PAServer } from '../../api/_lib/c2pa-server.js';

const PNG_SIG = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

function pngChunk(type: string, data: number[]): number[] {
  const length = data.length;
  const lenBytes = [(length >>> 24) & 0xFF, (length >>> 16) & 0xFF, (length >>> 8) & 0xFF, length & 0xFF];
  const typeBytes = Array.from(new TextEncoder().encode(type));
  return [...lenBytes, ...typeBytes, ...data, 0, 0, 0, 0];
}

function bufferOf(...parts: number[][]): Uint8Array {
  const total = parts.reduce((s, p) => s + p.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const p of parts) {
    out.set(p, offset);
    offset += p.length;
  }
  return out;
}

describe('detectFormat (server)', () => {
  it('identifies JPEG by SOI marker', () => {
    expect(detectFormat(new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0]))).toBe('jpeg');
  });
  it('identifies PNG by signature', () => {
    expect(detectFormat(new Uint8Array(PNG_SIG))).toBe('png');
  });
  it('returns null for unknown formats', () => {
    expect(detectFormat(new Uint8Array([0x52, 0x49, 0x46, 0x46]))).toBeNull();
  });
});

describe('stripBuffer JPEG', () => {
  function jpegWithApp(payload: number[] = []): Uint8Array {
    const sos = [0xFF, 0xDA, 0x00, 0x0C, 0x03, 0x01, 0x00, 0x02, 0x11, 0x03, 0x11, 0x00, 0x3F, 0x00];
    const data = [0xAA, 0xBB, 0xCC, 0xFF, 0x00, 0xDD, 0xEE, 0xFF];
    const eoi = [0xFF, 0xD9];
    return bufferOf([0xFF, 0xD8], payload, sos, data, eoi);
  }

  it('drops APP1 (EXIF) segment', () => {
    const app1Payload = [0xFF, 0xE1, 0x00, 0x06, 0x45, 0x78, 0x69, 0x66];
    const original = jpegWithApp(app1Payload);
    const cleaned = stripBuffer(original);
    expect(cleaned[0]).toBe(0xFF);
    expect(cleaned[1]).toBe(0xD8);
    expect(cleaned.length).toBeLessThan(original.length);
    let hasApp1 = false;
    for (let i = 0; i < cleaned.length - 1; i++) {
      if (cleaned[i] === 0xFF && cleaned[i + 1] === 0xE1) hasApp1 = true;
    }
    expect(hasApp1).toBe(false);
  });

  it('drops APP11 (C2PA JUMBF) segment', () => {
    const app11Payload = [0xFF, 0xEB, 0x00, 0x10, 0x4A, 0x50, 0, 0, 0, 0x10, 0x6A, 0x75, 0x6D, 0x62, 0, 0, 0, 0];
    const cleaned = stripBuffer(jpegWithApp(app11Payload));
    let hasJumb = false;
    for (let i = 0; i < cleaned.length - 3; i++) {
      if (cleaned[i] === 0x6A && cleaned[i + 1] === 0x75 && cleaned[i + 2] === 0x6D && cleaned[i + 3] === 0x62) hasJumb = true;
    }
    expect(hasJumb).toBe(false);
  });

  it('preserves SOS and entropy data with 0xFF 0x00 stuffing', () => {
    const cleaned = stripBuffer(jpegWithApp());
    let foundFFStuff = false;
    for (let i = 0; i < cleaned.length - 1; i++) {
      if (cleaned[i] === 0xFF && cleaned[i + 1] === 0x00) foundFFStuff = true;
    }
    expect(foundFFStuff).toBe(true);
  });

  it('always ends in EOI marker', () => {
    const cleaned = stripBuffer(jpegWithApp());
    expect(cleaned[cleaned.length - 2]).toBe(0xFF);
    expect(cleaned[cleaned.length - 1]).toBe(0xD9);
  });

  it('throws on missing SOI', () => {
    expect(() => stripBuffer(new Uint8Array([0x12, 0x34, 0x56, 0x78]))).toThrow();
  });
});

describe('stripBuffer PNG', () => {
  function pngWith(extraChunks: number[][]): Uint8Array {
    const ihdr = pngChunk('IHDR', new Array(13).fill(0));
    const idat = pngChunk('IDAT', [0x78, 0x9C, 0x01, 0x00, 0x00, 0xFF, 0xFF]);
    const iend = pngChunk('IEND', []);
    return bufferOf(PNG_SIG, ihdr, ...extraChunks, idat, iend);
  }

  it('drops tEXt chunks (Stable Diffusion prompt leak)', () => {
    const cleaned = stripBuffer(pngWith([pngChunk('tEXt', Array.from(new TextEncoder().encode('parameters\0prompt')))]));
    const text = new TextDecoder().decode(cleaned);
    expect(text).not.toContain('parameters');
    expect(text).not.toContain('prompt');
  });

  it('drops caBX (C2PA) chunks', () => {
    const cleaned = stripBuffer(pngWith([pngChunk('caBX', Array.from(new TextEncoder().encode('midjourney')))]));
    const text = new TextDecoder().decode(cleaned);
    expect(text).not.toContain('midjourney');
  });

  it('preserves IHDR, IDAT, and IEND', () => {
    const cleaned = stripBuffer(pngWith([]));
    const text = new TextDecoder('utf-8', { fatal: false }).decode(cleaned);
    expect(text).toContain('IHDR');
    expect(text).toContain('IDAT');
    expect(text).toContain('IEND');
  });

  it('throws on missing PNG signature', () => {
    expect(() => stripBuffer(new Uint8Array([0xFF, 0xD8, 0xFF]))).toThrow();
  });
});

describe('detectC2PA (server port matches client behaviour)', () => {
  it('detects Sora signature in JPEG APP11', () => {
    const app11 = [0xFF, 0xEB, 0x00, 0x20, 0x4A, 0x50, 0, 0, 0, 0x18, 0x6A, 0x75, 0x6D, 0x62,
                   ...Array.from(new TextEncoder().encode('openai sora 1.0 manifest'))];
    const buf = bufferOf([0xFF, 0xD8], app11, [0xFF, 0xD9]);
    const info = detectC2PAServer(buf);
    expect(info.detected).toBe(true);
    expect(info.generator).toBe('sora');
  });

  it('returns detected:false for clean JPEG', () => {
    const buf = bufferOf([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], [0xFF, 0xD9]);
    expect(detectC2PAServer(buf).detected).toBe(false);
  });
});

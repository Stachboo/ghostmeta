import { describe, it, expect } from 'vitest';
import { detectC2PA } from './c2pa-detector';

function bufferOf(...parts: Array<number[] | Uint8Array | string>): ArrayBuffer {
  const chunks = parts.map((p) =>
    typeof p === 'string' ? new TextEncoder().encode(p) :
    p instanceof Uint8Array ? p : new Uint8Array(p)
  );
  const total = chunks.reduce((s, c) => s + c.length, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) { out.set(c, offset); offset += c.length; }
  return out.buffer;
}

const JPEG_SOI = [0xFF, 0xD8];
const JPEG_EOI = [0xFF, 0xD9];
const APP11 = [0xFF, 0xEB];
const PNG_SIG = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

function pngChunk(type: string, data: Uint8Array | number[]): number[] {
  const dataArr = data instanceof Uint8Array ? Array.from(data) : data;
  const length = dataArr.length;
  const lenBytes = [(length >>> 24) & 0xFF, (length >>> 16) & 0xFF, (length >>> 8) & 0xFF, length & 0xFF];
  const typeBytes = Array.from(new TextEncoder().encode(type));
  const crc = [0, 0, 0, 0];
  return [...lenBytes, ...typeBytes, ...dataArr, ...crc];
}

function app11WithJumb(payload: string): number[] {
  // APP11 segment: marker + length(2) + identifier "JP" + box len + "jumb" + payload
  const payloadBytes = Array.from(new TextEncoder().encode(payload));
  const jumb = [0x6A, 0x75, 0x6D, 0x62];
  const inner = [0, 0, 0, 0x10, ...jumb, ...payloadBytes];
  const segLen = 2 + 2 + inner.length;
  return [...APP11, (segLen >> 8) & 0xFF, segLen & 0xFF, 0x4A, 0x50, ...inner];
}

describe('detectC2PA', () => {
  it('returns detected:false for an empty buffer', () => {
    expect(detectC2PA(new ArrayBuffer(0)).detected).toBe(false);
  });

  it('returns detected:false for a tiny buffer (< 16 bytes)', () => {
    expect(detectC2PA(bufferOf([0xFF, 0xD8, 0xFF, 0xD9])).detected).toBe(false);
  });

  it('returns detected:false for a JPEG without C2PA', () => {
    const buf = bufferOf(JPEG_SOI, [0xFF, 0xE0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], JPEG_EOI);
    const info = detectC2PA(buf);
    expect(info.detected).toBe(false);
    expect(info.format).toBe('jpeg');
  });

  it('detects OpenAI Sora signature in a JPEG with JUMBF', () => {
    const buf = bufferOf(JPEG_SOI, app11WithJumb('claim_generator: openai sora 1.0'), JPEG_EOI);
    const info = detectC2PA(buf);
    expect(info.detected).toBe(true);
    expect(info.generator).toBe('sora');
    expect(info.generatorLabel).toBe('OpenAI Sora');
    expect(info.format).toBe('jpeg');
  });

  it('detects DALL-E signature in a JPEG with JUMBF', () => {
    const buf = bufferOf(JPEG_SOI, app11WithJumb('OpenAI DALL-E 3 manifest data'), JPEG_EOI);
    const info = detectC2PA(buf);
    expect(info.detected).toBe(true);
    expect(info.generator).toBe('dalle');
  });

  it('detects ChatGPT signature in a JPEG with JUMBF', () => {
    const buf = bufferOf(JPEG_SOI, app11WithJumb('chatgpt image generation v2'), JPEG_EOI);
    const info = detectC2PA(buf);
    expect(info.detected).toBe(true);
    expect(info.generator).toBe('chatgpt');
  });

  it('falls back to unknown for a JUMBF without recognizable generator', () => {
    const buf = bufferOf(JPEG_SOI, app11WithJumb('some random vendor manifest payload'), JPEG_EOI);
    const info = detectC2PA(buf);
    expect(info.detected).toBe(true);
    expect(info.generator).toBe('unknown');
  });

  it('returns detected:false for a PNG without caBX chunk', () => {
    const ihdr = pngChunk('IHDR', new Uint8Array(13));
    const iend = pngChunk('IEND', []);
    const buf = bufferOf(PNG_SIG, ihdr, iend);
    const info = detectC2PA(buf);
    expect(info.detected).toBe(false);
    expect(info.format).toBe('png');
  });

  it('detects Midjourney signature in a PNG caBX chunk', () => {
    const cabx = pngChunk('caBX', Array.from(new TextEncoder().encode('midjourney v6 prompt manifest')));
    const iend = pngChunk('IEND', []);
    const buf = bufferOf(PNG_SIG, pngChunk('IHDR', new Uint8Array(13)), cabx, iend);
    const info = detectC2PA(buf);
    expect(info.detected).toBe(true);
    expect(info.generator).toBe('midjourney');
    expect(info.generatorLabel).toBe('Midjourney');
    expect(info.format).toBe('png');
  });

  it('detects Adobe Firefly signature in a PNG caBX chunk', () => {
    const cabx = pngChunk('caBX', Array.from(new TextEncoder().encode('Adobe Firefly creator manifest')));
    const iend = pngChunk('IEND', []);
    const buf = bufferOf(PNG_SIG, pngChunk('IHDR', new Uint8Array(13)), cabx, iend);
    const info = detectC2PA(buf);
    expect(info.detected).toBe(true);
    expect(info.generator).toBe('firefly');
  });

  it('returns detected:false for a non-image buffer (e.g. WebP-ish bytes)', () => {
    const buf = bufferOf([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50, 0, 0, 0, 0, 0, 0, 0, 0]);
    expect(detectC2PA(buf).detected).toBe(false);
  });

  it('does not throw on malformed buffers', () => {
    const buf = bufferOf([0xFF, 0xD8, 0xFF, 0xEB, 0xFF, 0xFF, 0x00, 0x00, 0x00, 0x00]);
    expect(() => detectC2PA(buf)).not.toThrow();
  });
});

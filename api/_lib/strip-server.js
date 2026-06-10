/**
 * Server-side metadata strip for JPEG and PNG. Pure JS, no native deps.
 *
 * JPEG: scans markers and drops every APP segment (FFE0..FFEF), which
 *       removes EXIF (APP1), JFIF, JFXX, ICC (APP2), Adobe (APP14) and the
 *       APP11 segment that carries the C2PA JUMBF box. Entropy-coded data
 *       between SOS (FFDA) and EOI (FFD9) is copied byte-for-byte and the
 *       0xFF 0x00 stuffing rule is preserved.
 *
 * PNG:  scans chunks and drops every text/metadata chunk (tEXt, iTXt, zTXt,
 *       eXIf, caBX = C2PA, kept ones being IHDR, PLTE, IDAT, IEND, plus
 *       lossless ancillary chunks like tRNS/gAMA/cHRM that affect rendering).
 *       Chunk CRCs are kept as-is (the data is unmodified).
 */

const APP_MARKER_LO = 0xE0;
const APP_MARKER_HI = 0xEF;

// PNG chunks we keep — anything else is dropped.
const PNG_KEEP_CHUNKS = new Set([
  'IHDR', 'PLTE', 'IDAT', 'IEND',
  'tRNS', 'gAMA', 'cHRM', 'sRGB', 'iCCP',
  'sBIT', 'bKGD', 'pHYs', 'sPLT', 'hIST',
  'fcTL', 'fdAT', 'acTL',
]);

const PNG_SIGNATURE = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];

function bytesEqual(a, offset, expected) {
  if (a.length < offset + expected.length) return false;
  for (let i = 0; i < expected.length; i++) {
    if (a[offset + i] !== expected[i]) return false;
  }
  return true;
}

function stripJpeg(input) {
  if (input.length < 4 || input[0] !== 0xFF || input[1] !== 0xD8) {
    throw new Error('Not a JPEG (missing SOI marker)');
  }
  const out = [];
  out.push(0xFF, 0xD8);
  let i = 2;
  while (i < input.length - 1) {
    if (input[i] !== 0xFF) {
      throw new Error(`Malformed JPEG at offset ${i}`);
    }
    let marker = input[i + 1];
    while (marker === 0xFF && i + 2 < input.length) {
      i++;
      marker = input[i + 1];
    }
    if (marker === 0xD9) {
      out.push(0xFF, 0xD9);
      break;
    }
    if (marker === 0xDA) {
      // SOS — copy header then entropy-coded data until next non-stuffed marker
      const segLen = (input[i + 2] << 8) | input[i + 3];
      for (let k = 0; k < segLen + 2; k++) out.push(input[i + k]);
      i += segLen + 2;
      while (i < input.length - 1) {
        const b = input[i];
        if (b === 0xFF) {
          const next = input[i + 1];
          if (next === 0x00) {
            out.push(0xFF, 0x00);
            i += 2;
            continue;
          }
          if (next === 0xD9) {
            out.push(0xFF, 0xD9);
            i += 2;
            return Uint8Array.from(out);
          }
          // Restart markers (D0..D7) inside scan: copy and continue
          if (next >= 0xD0 && next <= 0xD7) {
            out.push(0xFF, next);
            i += 2;
            continue;
          }
          break;
        }
        out.push(b);
        i++;
      }
      continue;
    }
    if (marker >= APP_MARKER_LO && marker <= APP_MARKER_HI) {
      const segLen = (input[i + 2] << 8) | input[i + 3];
      i += 2 + segLen;
      continue;
    }
    if (marker === 0xFE) {
      // COM segment — drop too
      const segLen = (input[i + 2] << 8) | input[i + 3];
      i += 2 + segLen;
      continue;
    }
    // Other segments (DQT, DHT, SOF, etc.) — keep as-is
    if (marker >= 0xD0 && marker <= 0xD9) {
      out.push(0xFF, marker);
      i += 2;
      continue;
    }
    const segLen = (input[i + 2] << 8) | input[i + 3];
    for (let k = 0; k < segLen + 2; k++) out.push(input[i + k]);
    i += segLen + 2;
  }
  return Uint8Array.from(out);
}

function stripPng(input) {
  if (!bytesEqual(input, 0, PNG_SIGNATURE)) {
    throw new Error('Not a PNG (missing signature)');
  }
  const out = [];
  for (const b of PNG_SIGNATURE) out.push(b);
  let offset = 8;
  while (offset + 12 <= input.length) {
    const length = (input[offset] << 24) >>> 0
                 | (input[offset + 1] << 16)
                 | (input[offset + 2] << 8)
                 | input[offset + 3];
    const type = String.fromCharCode(
      input[offset + 4], input[offset + 5], input[offset + 6], input[offset + 7]
    );
    const total = 12 + length;
    if (offset + total > input.length) break;
    if (PNG_KEEP_CHUNKS.has(type)) {
      for (let k = 0; k < total; k++) out.push(input[offset + k]);
    }
    if (type === 'IEND') break;
    offset += total;
  }
  return Uint8Array.from(out);
}

export function detectFormat(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF) return 'jpeg';
  if (bytesEqual(bytes, 0, PNG_SIGNATURE)) return 'png';
  return null;
}

/**
 * Strip metadata from a JPEG or PNG buffer. Returns a Uint8Array of the
 * cleaned image. Throws on malformed input or unsupported format.
 */
export function stripBuffer(input) {
  const bytes = input instanceof Uint8Array ? input : new Uint8Array(input);
  const format = detectFormat(bytes);
  if (format === 'jpeg') return stripJpeg(bytes);
  if (format === 'png') return stripPng(bytes);
  throw new Error('Unsupported format (only JPEG and PNG are supported)');
}

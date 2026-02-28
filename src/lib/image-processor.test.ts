import { describe, it, expect } from 'vitest';
import { isHeicFile, isSupportedImage, validateImageFile, MAX_FILE_SIZE } from './image-processor';

// Helper to create a minimal File object
function makeFile(name: string, type: string): File {
  return new File([], name, { type });
}

// Helper : crée un File avec des octets spécifiques (pour les tests magic bytes)
function makeFileWithBytes(name: string, type: string, bytes: number[]): File {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe('isHeicFile', () => {
  it('returns true for .heic extension', () => {
    expect(isHeicFile(makeFile('photo.heic', ''))).toBe(true);
  });

  it('returns true for .heif extension', () => {
    expect(isHeicFile(makeFile('photo.heif', ''))).toBe(true);
  });

  it('returns true for image/heic MIME type', () => {
    expect(isHeicFile(makeFile('photo', 'image/heic'))).toBe(true);
  });

  it('returns true for image/heif MIME type', () => {
    expect(isHeicFile(makeFile('photo', 'image/heif'))).toBe(true);
  });

  it('returns false for a JPEG file', () => {
    expect(isHeicFile(makeFile('photo.jpg', 'image/jpeg'))).toBe(false);
  });
});

describe('isSupportedImage', () => {
  it('accepts image/jpeg', () => {
    expect(isSupportedImage(makeFile('photo.jpg', 'image/jpeg'))).toBe(true);
  });

  it('accepts image/png', () => {
    expect(isSupportedImage(makeFile('photo.png', 'image/png'))).toBe(true);
  });

  it('accepts image/webp', () => {
    expect(isSupportedImage(makeFile('photo.webp', 'image/webp'))).toBe(true);
  });

  it('accepts image/heic', () => {
    expect(isSupportedImage(makeFile('photo.heic', 'image/heic'))).toBe(true);
  });

  it('accepts image/heif', () => {
    expect(isSupportedImage(makeFile('photo.heif', 'image/heif'))).toBe(true);
  });

  it('accepts files by extension when MIME type is empty', () => {
    expect(isSupportedImage(makeFile('photo.png', ''))).toBe(true);
    expect(isSupportedImage(makeFile('photo.webp', ''))).toBe(true);
    expect(isSupportedImage(makeFile('photo.heic', ''))).toBe(true);
  });

  it('rejects unsupported types', () => {
    expect(isSupportedImage(makeFile('document.pdf', 'application/pdf'))).toBe(false);
    expect(isSupportedImage(makeFile('video.mp4', 'video/mp4'))).toBe(false);
  });
});

// ============================================================================
// SEC-009 : Tests de validation par magic bytes
// ============================================================================

describe('validateImageFile', () => {
  it('accepts valid JPEG magic bytes', async () => {
    // FF D8 FF E0 = JPEG JFIF header
    const file = makeFileWithBytes('photo.jpg', 'image/jpeg', [0xFF, 0xD8, 0xFF, 0xE0, 0, 0, 0, 0, 0, 0, 0, 0]);
    const result = await validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts valid PNG magic bytes', async () => {
    // 89 50 4E 47 0D 0A 1A 0A = PNG signature
    const file = makeFileWithBytes('photo.png', 'image/png', [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, 0, 0, 0, 0]);
    const result = await validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts valid WebP magic bytes', async () => {
    // RIFF....WEBP
    const file = makeFileWithBytes('photo.webp', 'image/webp', [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]);
    const result = await validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('accepts valid HEIC magic bytes (ftyp container)', async () => {
    // ....ftyp at offset 4
    const file = makeFileWithBytes('photo.heic', 'image/heic', [0, 0, 0, 0x1C, 0x66, 0x74, 0x79, 0x70, 0x68, 0x65, 0x69, 0x63]);
    const result = await validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('rejects file with invalid magic bytes', async () => {
    // PDF magic bytes (not an image)
    const file = makeFileWithBytes('fake.jpg', 'image/jpeg', [0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x34, 0, 0, 0, 0]);
    const result = await validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('signature binaire invalide');
  });

  it('rejects file that is too small', async () => {
    const file = makeFileWithBytes('tiny.jpg', 'image/jpeg', [0xFF, 0xD8]);
    const result = await validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('trop petit');
  });

  it('rejects file exceeding 10 MB', async () => {
    // Créer un fichier légèrement au-dessus de la limite
    const bigBuffer = new Uint8Array(MAX_FILE_SIZE + 1);
    bigBuffer[0] = 0xFF; bigBuffer[1] = 0xD8; bigBuffer[2] = 0xFF;
    const file = new File([bigBuffer], 'huge.jpg', { type: 'image/jpeg' });
    const result = await validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('trop volumineux');
  });

  it('rejects a renamed non-image file (MIME spoofing)', async () => {
    // EXE magic bytes MZ disguised as .jpg
    const file = makeFileWithBytes('malware.jpg', 'image/jpeg', [0x4D, 0x5A, 0x90, 0x00, 0, 0, 0, 0, 0, 0, 0, 0]);
    const result = await validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('signature binaire invalide');
  });
});

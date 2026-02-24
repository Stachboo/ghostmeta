import { describe, it, expect } from 'vitest';
import { isHeicFile, isSupportedImage } from './image-processor';

// Helper to create a minimal File object
function makeFile(name: string, type: string): File {
  return new File([], name, { type });
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

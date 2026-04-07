/**
 * Vitest global setup — mocks pour environnement jsdom.
 */

// Mock crypto.randomUUID (absent en jsdom)
if (!globalThis.crypto?.randomUUID) {
  Object.defineProperty(globalThis, "crypto", {
    value: {
      ...globalThis.crypto,
      randomUUID: () =>
        "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
          (
            +c ^
            (Math.random() * 16 >> (+c / 4))
          ).toString(16),
        ),
    },
  });
}

// Mock URL.createObjectURL / revokeObjectURL (absent en jsdom)
if (!URL.createObjectURL) {
  URL.createObjectURL = () => "blob:mock-url";
  URL.revokeObjectURL = () => {};
}

// Mock canvas pour les tests de re-encoding d'image
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(HTMLCanvasElement.prototype as any).getContext = function () {
  return {
    drawImage: () => {},
    fillRect: () => {},
    getImageData: () => ({ data: new Uint8ClampedArray(0) }),
    putImageData: () => {},
    canvas: this,
  } as unknown as CanvasRenderingContext2D;
};

HTMLCanvasElement.prototype.toBlob = function (callback: BlobCallback) {
  callback(new Blob(["mock"], { type: "image/jpeg" }));
};

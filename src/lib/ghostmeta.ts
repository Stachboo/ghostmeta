export const GhostMeta = {
  clean: async (file: File): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        canvas.toBlob((blob) => resolve(blob!), file.type, 0.92);
      };
      img.src = URL.createObjectURL(file);
    });
  }
};

/**
 * GhostMeta Core Engine
 * ---------------------
 * Nettoyage des métadonnées par reconstruction graphique (Canvas).
 * Méthode 100% locale et destructrice pour les métadonnées (Zero-Knowledge).
 */

export const GhostMeta = {
  clean: async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        // 1. Créer un canvas de la taille de l'image
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        // 2. Dessiner l'image (cela supprime les métadonnées cachées)
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(url);
          reject(new Error("Impossible d'initialiser le processeur graphique."));
          return;
        }
        ctx.drawImage(img, 0, 0);

        // 3. Récupérer l'image propre
        // On conserve le format d'origine (sauf HEIC qui devient JPEG pour compatibilité)
        const mimeType = file.type === 'image/heic' ? 'image/jpeg' : file.type;
        
        canvas.toBlob(
          (blob) => {
            URL.revokeObjectURL(url);
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Erreur lors de la reconstruction de l'image."));
            }
          },
          mimeType,
          0.92 // Qualité JPEG/WEBP (92% est un excellent compromis poids/qualité)
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Le fichier image est corrompu ou illisible."));
      };

      img.src = url;
    });
  }
};

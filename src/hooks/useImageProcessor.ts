/**
 * GhostMeta - useImageProcessor Hook (Corrected Version)
 * ──────────────────────────────────────────────────────
 * Gestion robuste de la file d'attente :
 * - Gratuit : Traitement séquentiel (1 par 1) pour tout le lot.
 * - Pro : Traitement parallèle (3 par 3) pour tout le lot.
 */

import { useState, useCallback, useRef } from 'react';
import {
  ProcessedImage,
  createProcessedImage,
  extractMetadata,
  stripMetadata,
  isSupportedImage,
  isHeicFile,
} from '@/lib/image-processor';
import JSZip from 'jszip';
import { saveAs } from 'file-saver'; // Assurez-vous d'avoir installé : pnpm add file-saver @types/file-saver

// Configuration de la parallélisation
const BATCH_SIZE_PRO = 3;
const BATCH_SIZE_FREE = 1;

export function useImageProcessor() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const processingRef = useRef(false);

  // Vérification du statut Pro
  const isPro = useCallback((): boolean => {
    try {
      const token = localStorage.getItem('ghostmeta_pro');
      if (!token) return false;
      const data = JSON.parse(token);
      return data.active === true;
    } catch {
      return false;
    }
  }, []);

  // Ajout de fichiers
  const addFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const supported = fileArray.filter(isSupportedImage);
    const newImages = supported.map(createProcessedImage);

    newImages.forEach((img) => {
      if (!isHeicFile(img.originalFile)) {
        img.previewUrl = URL.createObjectURL(img.originalFile);
      }
    });

    setImages((prev) => [...prev, ...newImages]);
    return { added: supported.length, rejected: fileArray.length - supported.length };
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    setImages((prev) => {
      prev.forEach((img) => {
        if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
      });
      return [];
    });
    setProgress({ current: 0, total: 0 });
  }, []);

  // Utilitaire pour accéder à l'état frais dans les boucles async
  const getCurrentImages = (): Promise<ProcessedImage[]> => {
    return new Promise((resolve) => {
      setImages((prev) => {
        resolve([...prev]);
        return prev;
      });
    });
  };

  // Moteur de Scan (Métadonnées)
  const scanAll = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);

    const currentImages = await getCurrentImages();
    const toScan = currentImages.filter((img) => img.status === 'pending');
    
    // Le scan est rapide, on autorise un peu de parallélisme pour tous
    const CONCURRENCY = 3; 
    setProgress({ current: 0, total: toScan.length });

    for (let i = 0; i < toScan.length; i += CONCURRENCY) {
      const batch = toScan.slice(i, i + CONCURRENCY);
      await Promise.all(
        batch.map(async (img) => {
          setImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'scanning' } : p));
          try {
            const metadata = await extractMetadata(img.originalFile);
            setImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'scanned', metadata } : p));
          } catch {
            setImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'error', error: 'Échec scan' } : p));
          }
          setProgress(prev => ({ ...prev, current: prev.current + 1 }));
        })
      );
    }
    processingRef.current = false;
    setIsProcessing(false);
  }, []);

  // Moteur de Nettoyage (Le coeur du correctif)
  const cleanAll = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);

    const currentImages = await getCurrentImages();
    const userIsPro = isPro();
    
    // On prend TOUTES les images qui ne sont pas finies ou en erreur
    const toProcess = currentImages.filter(
      (img) => img.status !== 'cleaned' && img.status !== 'error'
    );

    // DÉTERMINATION DE LA VITESSE DE TRAITEMENT
    // Gratuit = 1 par 1 (Séquentiel)
    // Pro = 3 par 3 (Parallèle)
    const batchSize = userIsPro ? BATCH_SIZE_PRO : BATCH_SIZE_FREE;
    
    setProgress({ current: 0, total: toProcess.length });

    // Boucle principale qui traite TOUT le tableau
    for (let i = 0; i < toProcess.length; i += batchSize) {
      const chunk = toProcess.slice(i, i + batchSize);
      
      await Promise.all(
        chunk.map(async (img) => {
          // 1. Scan (si pas encore fait)
          if (img.status === 'pending') {
             setImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'scanning' } : p));
             try {
               const metadata = await extractMetadata(img.originalFile);
               setImages(prev => prev.map(p => p.id === img.id ? { ...p, metadata } : p));
             } catch (e) { console.error(e); }
          }

          // 2. Clean
          setImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'cleaning' } : p));
          
          try {
            const cleanedBlob = await stripMetadata(img.originalFile);
            setImages(prev => prev.map(p => p.id === img.id ? { 
              ...p, 
              status: 'cleaned', 
              cleanedBlob, 
              cleanedSize: cleanedBlob.size 
            } : p));
          } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'Échec nettoyage';
            setImages(prev => prev.map(p => p.id === img.id ? { ...p, status: 'error', error: errorMsg } : p));
          }
          
          setProgress(prev => ({ ...prev, current: prev.current + 1 }));
        })
      );
    }

    processingRef.current = false;
    setIsProcessing(false);
  }, [isPro]);

  // Exportation
  const downloadImage = useCallback((id: string) => {
    // Logique simplifiée : on récupère l'image dans l'état courant
    // Note: Dans une vraie app React, utiliser useRef pour l'état images serait plus sûr ici,
    // mais pour l'instant on fait confiance au closure ou on force une re-lecture si besoin.
    // L'implémentation originale utilisait setImages pour lire l'état, ce qui est une astuce valide.
    setImages((prev) => {
      const image = prev.find((i) => i.id === id);
      if (image?.cleanedBlob) {
        const originalName = image.originalName || 'image';
        const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        // On force .png si le blob est PNG, sinon on garde l'extension ou .jpg
        const type = image.cleanedBlob.type;
        const ext = type === 'image/png' ? '.png' : '.jpg';
        
        saveAs(image.cleanedBlob, `${baseName}_ghost${ext}`);
      }
      return prev;
    });
  }, []);

  const downloadAllZip = useCallback(async () => {
    const currentImages = await getCurrentImages();
    const cleaned = currentImages.filter((img) => img.status === 'cleaned' && img.cleanedBlob);
    if (cleaned.length === 0) return;

    if (cleaned.length === 1) {
       // Si une seule image, téléchargement direct
       const img = cleaned[0];
       const baseName = img.originalName.replace(/\.[^.]+$/, '');
       const ext = img.cleanedBlob!.type === 'image/png' ? '.png' : '.jpg';
       saveAs(img.cleanedBlob!, `${baseName}_ghost${ext}`);
       return;
    }

    const zip = new JSZip();
    cleaned.forEach((img) => {
      if (img.cleanedBlob) {
        const baseName = img.originalName.replace(/\.[^.]+$/, '');
        const ext = img.cleanedBlob.type === 'image/png' ? '.png' : '.jpg';
        zip.file(`${baseName}_ghost${ext}`, img.cleanedBlob);
      }
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `ghostmeta_batch_${Date.now()}.zip`);
  }, []);

  return {
    images,
    isProcessing,
    progress,
    stats: {
        total: images.length,
        pending: images.filter(i => i.status === 'pending').length,
        scanning: images.filter(i => i.status === 'scanning').length,
        scanned: images.filter(i => i.status === 'scanned').length,
        cleaning: images.filter(i => i.status === 'cleaning').length,
        cleaned: images.filter(i => i.status === 'cleaned').length,
        errors: images.filter(i => i.status === 'error').length,
        threatsFound: images.filter(i => i.metadata?.threats?.length).length,
        criticalThreats: images.filter(i => i.metadata?.threatLevel === 'critical').length,
    },
    isPro,
    addFiles,
    removeImage,
    clearAll,
    scanAll,
    cleanAll,
    downloadImage,
    downloadAllZip,
  };
}

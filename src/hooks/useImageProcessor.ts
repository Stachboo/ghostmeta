import { useState, useCallback } from 'react';
import { GhostMeta } from '@/lib/ghostmeta';
import { toast } from 'sonner';

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: 'pending' | 'processing' | 'cleaned' | 'error';
  metadata?: any;
}

interface ProcessingStats {
  total: number;
  cleaned: number;
  threatsFound: number;
}

export function useImageProcessor() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [limitReached, setLimitReached] = useState(false); // New state for 12h limit

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const newImages: ImageFile[] = [];
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
    let rejectedCount = 0;

    Array.from(fileList).forEach((file) => {
      if (validTypes.includes(file.type) || file.name.toLowerCase().endsWith('.heic')) {
        newImages.push({
          id: Math.random().toString(36).substring(7),
          file,
          preview: URL.createObjectURL(file),
          status: 'pending',
        });
      } else {
        rejectedCount++;
      }
    });

    setImages((prev) => [...prev, ...newImages]);
    return { added: newImages.length, rejected: rejectedCount };
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages((prev) => {
      const img = prev.find((i) => i.id === id);
      if (img) URL.revokeObjectURL(img.preview);
      return prev.filter((i) => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach((img) => URL.revokeObjectURL(img.preview));
    setImages([]);
    setProgress({ current: 0, total: 0 });
    setLimitReached(false);
  }, [images]);

  // Check if user is allowed to clean (12h limit)
  const checkLimit = () => {
    const lastClean = localStorage.getItem('lastCleanTime');
    if (!lastClean) return true;

    const twelveHours = 12 * 60 * 60 * 1000;
    const timeDiff = Date.now() - parseInt(lastClean);

    if (timeDiff < twelveHours) {
      return false;
    }
    return true;
  };

  const cleanAll = useCallback(async () => {
    // 1. Check 12h Limit
    if (!checkLimit()) {
      setLimitReached(true);
      return;
    }

    setIsProcessing(true);
    setProgress({ current: 0, total: images.length });
    
    // 2. Process
    const processedImages = [...images];
    let cleanedCount = 0;

    for (let i = 0; i < processedImages.length; i++) {
      if (processedImages[i].status === 'cleaned') continue;

      try {
        processedImages[i].status = 'processing';
        setImages([...processedImages]);

        const cleanedBlob = await GhostMeta.clean(processedImages[i].file);
        
        processedImages[i].file = new File([cleanedBlob], processedImages[i].file.name, {
          type: processedImages[i].file.type,
        });
        processedImages[i].status = 'cleaned';
        cleanedCount++;
      } catch (error) {
        console.error(error);
        processedImages[i].status = 'error';
      }

      setProgress({ current: i + 1, total: images.length });
      setImages([...processedImages]);
    }

    // 3. Record Time if successful
    if (cleanedCount > 0) {
      localStorage.setItem('lastCleanTime', Date.now().toString());
      toast.success("Nettoyage terminé !");
    }

    setIsProcessing(false);
  }, [images]);

  const downloadImage = useCallback((id: string) => {
    const img = images.find((i) => i.id === id);
    if (!img || img.status !== 'cleaned') return;
    
    const url = URL.createObjectURL(img.file);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clean_${img.file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [images]);

  const downloadAllZip = useCallback(async () => {
     // ZIP logic implemented in component or here if needed
     // For now, simpler to keep single download or implement JSZip later
     toast.info("Téléchargement ZIP bientôt disponible");
  }, []);

  const stats: ProcessingStats = {
    total: images.length,
    cleaned: images.filter((i) => i.status === 'cleaned').length,
    threatsFound: images.length, // Simulated for now as we strip blind
  };

  const isPro = () => false; // Toujours faux pour l'instant (Mode Gratuit Limité)

  return {
    images,
    isProcessing,
    progress,
    stats,
    limitReached,
    isPro,
    addFiles,
    removeImage,
    clearAll,
    cleanAll,
    downloadImage,
    downloadAllZip,
  };
}

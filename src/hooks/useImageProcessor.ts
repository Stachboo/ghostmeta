import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import {
  ProcessedImage,
  createProcessedImage,
  extractMetadata,
  stripMetadata,
  isSupportedImage,
} from '@/lib/image-processor';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';

interface ProcessingStats {
  total: number;
  cleaned: number;
  threatsFound: number;
}

export function useImageProcessor() {
  const { profile, user, refreshProfile } = useAuth();
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  // Queue-based scan: évite de perdre les lots ajoutés pendant un scan en cours
  const scanQueueRef = useRef<ProcessedImage[][]>([]);
  const isScanningRef = useRef(false);

  const isPro = useCallback(() => {
    return profile?.is_premium === true;
  }, [profile]);

  const getImageLimit = useCallback(() => {
    return isPro() ? 50 : 1;
  }, [isPro]);

  const scanImage = async (img: ProcessedImage): Promise<ProcessedImage> => {
    try {
      const metadata = await extractMetadata(img.originalFile);
      return { ...img, metadata, status: 'scanned' as const };
    } catch {
      return { ...img, status: 'scanned' as const, metadata: { raw: {}, threatLevel: 'safe' as const, threats: [] } };
    }
  };

  // Consomme la queue séquentiellement — chaque lot est traité dans l'ordre d'ajout
  const drainQueue = useCallback(async () => {
    if (isScanningRef.current) return;
    isScanningRef.current = true;

    while (scanQueueRef.current.length > 0) {
      const batch = scanQueueRef.current.shift()!;
      for (const img of batch) {
        setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'scanning' as const } : i));
        const scanned = await scanImage(img);
        setImages(prev => prev.map(i => i.id === img.id ? scanned : i));
      }
    }

    // Marquer has_viewed_metadata=true via la fonction SECURITY DEFINER (bypass RLS)
    if (user && !profile?.is_premium && !profile?.has_viewed_metadata) {
      await supabase.rpc('lock_metadata_view', { user_id: user.id });
      await refreshProfile();
    }

    isScanningRef.current = false;
  }, [user, profile, refreshProfile]);

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const imageLimit = getImageLimit();
    const currentCount = images.length;
    const remainingSlots = imageLimit - currentCount;

    if (remainingSlots <= 0 && !isPro()) {
      return { added: 0, rejected: Array.from(fileList).length, limitReached: true };
    }

    const newImages: ProcessedImage[] = [];
    let rejectedCount = 0;

    Array.from(fileList).forEach((file) => {
      if (!isPro() && newImages.length >= remainingSlots) {
        rejectedCount++;
        return;
      }
      if (isSupportedImage(file)) {
        const processed = createProcessedImage(file);
        processed.previewUrl = URL.createObjectURL(file);
        newImages.push(processed);
      } else {
        rejectedCount++;
      }
    });

    setImages(prev => [...prev, ...newImages]);

    if (newImages.length > 0) {
      scanQueueRef.current.push(newImages);
      drainQueue();
    }

    return { added: newImages.length, rejected: rejectedCount };
  }, [drainQueue, images.length, getImageLimit, isPro]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    // Vider la queue avant de supprimer les images pour ne pas scanner des images orphelines
    scanQueueRef.current = [];
    isScanningRef.current = false;
    setImages(prev => {
      prev.forEach(img => { if (img.previewUrl) URL.revokeObjectURL(img.previewUrl); });
      return [];
    });
    setIsProcessing(false);
    setProgress({ current: 0, total: 0 });
  }, []);

  const cleanAll = useCallback(async () => {
    const toClean = images.filter(i => i.status !== 'cleaned' && i.status !== 'error');
    if (toClean.length === 0) return;

    setIsProcessing(true);
    setProgress({ current: 0, total: toClean.length });

    let cleanedCount = 0;

    for (let i = 0; i < toClean.length; i++) {
      const img = toClean[i];

      setImages(prev => prev.map(x => x.id === img.id ? { ...x, status: 'cleaning' as const } : x));

      try {
        const cleanedBlob = await stripMetadata(img.originalFile);
        setImages(prev => prev.map(x => x.id === img.id ? {
          ...x,
          status: 'cleaned' as const,
          cleanedBlob,
          cleanedSize: cleanedBlob.size,
        } : x));
        cleanedCount++;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Erreur inconnue';
        setImages(prev => prev.map(x => x.id === img.id ? {
          ...x,
          status: 'error' as const,
          error: errorMsg,
        } : x));
      }

      setProgress({ current: i + 1, total: toClean.length });
    }

    if (cleanedCount > 0) {
      toast.success('Nettoyage terminé !');
    }

    setIsProcessing(false);
  }, [images]);

  const downloadImage = useCallback((id: string) => {
    const img = images.find(i => i.id === id);
    if (!img || !img.cleanedBlob) return;

    const url = URL.createObjectURL(img.cleanedBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clean_${img.originalName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [images]);

  const downloadAllZip = useCallback(async () => {
    const cleaned = images.filter(i => i.status === 'cleaned' && i.cleanedBlob);
    if (cleaned.length === 0) return;

    const JSZip = (await import('jszip')).default;
    const { saveAs } = await import('file-saver');

    const zip = new JSZip();
    cleaned.forEach(img => {
      zip.file(`clean_${img.originalName}`, img.cleanedBlob!);
    });

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'ghostmeta_cleaned.zip');
  }, [images]);

  const stats: ProcessingStats = {
    total: images.length,
    cleaned: images.filter(i => i.status === 'cleaned').length,
    threatsFound: images.reduce((acc, i) => acc + (i.metadata?.threats?.length ?? 0), 0),
  };

  return {
    images,
    isProcessing,
    progress,
    stats,
    isPro,
    isLoggedIn: user !== null,
    hasViewedMetadata: profile?.has_viewed_metadata === true,
    addFiles,
    removeImage,
    clearAll,
    cleanAll,
    downloadImage,
    downloadAllZip,
  };
}

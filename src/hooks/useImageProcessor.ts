import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import {
  ProcessedImage,
  createProcessedImage,
  extractMetadata,
  stripMetadata,
  isSupportedImage,
} from '@/lib/image-processor';

interface ProcessingStats {
  total: number;
  cleaned: number;
  threatsFound: number;
}

export function useImageProcessor() {
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [limitReached, setLimitReached] = useState(false);
  const scanningRef = useRef(false);

  const scanImage = async (img: ProcessedImage): Promise<ProcessedImage> => {
    try {
      const metadata = await extractMetadata(img.originalFile);
      return { ...img, metadata, status: 'scanned' as const };
    } catch {
      return { ...img, status: 'scanned' as const, metadata: { raw: {}, threatLevel: 'safe' as const, threats: [] } };
    }
  };

  const scanNewImages = useCallback(async (newImages: ProcessedImage[]) => {
    if (scanningRef.current) return;
    scanningRef.current = true;

    for (const img of newImages) {
      setImages(prev => prev.map(i => i.id === img.id ? { ...i, status: 'scanning' as const } : i));
      const scanned = await scanImage(img);
      setImages(prev => prev.map(i => i.id === img.id ? scanned : i));
    }

    scanningRef.current = false;
  }, []);

  const addFiles = useCallback((fileList: FileList | File[]) => {
    const newImages: ProcessedImage[] = [];
    let rejectedCount = 0;

    Array.from(fileList).forEach((file) => {
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
      scanNewImages(newImages);
    }

    return { added: newImages.length, rejected: rejectedCount };
  }, [scanNewImages]);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img?.previewUrl) URL.revokeObjectURL(img.previewUrl);
      return prev.filter(i => i.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach(img => {
      if (img.previewUrl) URL.revokeObjectURL(img.previewUrl);
    });
    setImages([]);
    setProgress({ current: 0, total: 0 });
    setLimitReached(false);
  }, [images]);

  const checkLimit = () => {
    const lastClean = localStorage.getItem('lastCleanTime');
    if (!lastClean) return true;
    const twelveHours = 12 * 60 * 60 * 1000;
    return (Date.now() - parseInt(lastClean)) >= twelveHours;
  };

  const cleanAll = useCallback(async () => {
    if (!checkLimit()) {
      setLimitReached(true);
      return;
    }

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
      localStorage.setItem('lastCleanTime', Date.now().toString());
      toast.success("Nettoyage terminé !");
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
    threatsFound: images.reduce((acc, i) => acc + (i.metadata?.threats?.length || 0), 0),
  };

  const isPro = () => false;

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

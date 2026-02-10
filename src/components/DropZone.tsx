/**
 * GhostMeta DropZone
 * ──────────────────
 * GHOST PROTOCOL — Vert néon #00ff41
 * Zone de dépôt d'images avec design tactique HUD.
 */

import { useCallback, useState, useRef } from 'react';
import { Upload, ShieldAlert, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropZoneProps {
  onFilesAdded: (files: FileList | File[]) => { added: number; rejected: number };
  hasImages: boolean;
  isProcessing: boolean;
}

export default function DropZone({ onFilesAdded, hasImages, isProcessing }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      if (e.dataTransfer.files.length > 0) {
        onFilesAdded(e.dataTransfer.files);
      }
    },
    [onFilesAdded]
  );

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        onFilesAdded(e.target.files);
        e.target.value = '';
      }
    },
    [onFilesAdded]
  );

  if (hasImages) {
    return (
      <motion.button
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={isProcessing}
        className="w-full border border-dashed border-[#00ff41]/30 rounded-lg p-4 flex items-center justify-center gap-3 
                   hover:border-[#00ff41]/60 hover:bg-[#00ff41]/5 transition-all duration-300
                   disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Plus className="w-5 h-5 text-[#00ff41]" />
        <span className="text-sm text-[#00ff41] font-medium">Ajouter des images</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative overflow-hidden cursor-pointer
          border-2 border-dashed rounded-xl
          transition-all duration-500 ease-out
          min-h-[280px] sm:min-h-[320px]
          flex flex-col items-center justify-center gap-5 p-8
          ${
            isDragOver
              ? 'border-[#00ff41] bg-[#00ff41]/10 ghost-glow-strong scale-[1.02]'
              : 'border-[#00ff41]/25 bg-[#0f172a]/50 hover:border-[#00ff41]/50 hover:bg-[#00ff41]/5'
          }
        `}
      >
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ top: '-2px' }}
              animate={{ top: '100%' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff41] to-transparent"
              style={{ position: 'absolute' }}
            />
          )}
        </AnimatePresence>

        {/* Corner decorations - tactical HUD */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-[#00ff41]/40" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-[#00ff41]/40" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-[#00ff41]/40" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-[#00ff41]/40" />

        <motion.div
          animate={isDragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {isDragOver ? (
            <ShieldAlert className="w-16 h-16 text-[#00ff41]" />
          ) : (
            <Upload className="w-16 h-16 text-[#00ff41]/60" />
          )}
        </motion.div>

        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-foreground">
            {isDragOver ? 'Déposez pour scanner' : 'Glissez vos photos ici'}
          </p>
          <p className="text-sm text-muted-foreground">
            ou <span className="text-[#00ff41] underline underline-offset-4">parcourez vos fichiers</span>
          </p>
          <p className="text-xs text-muted-foreground/60 font-mono mt-3">
            JPEG · PNG · WebP · HEIC — Traitement 100% local
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </motion.div>
  );
}

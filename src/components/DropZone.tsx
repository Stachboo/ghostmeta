import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { motion } from 'framer-motion';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  hasImages: boolean;
  isProcessing: boolean;
}

export default function DropZone({ onFilesAdded, hasImages, isProcessing }: DropZoneProps) {
  const { t } = useTranslation();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles?.length > 0) {
        onFilesAdded(acceptedFiles);
      }
    },
    [onFilesAdded]
  );

  const onDropRejected = useCallback((rejections: FileRejection[]) => {
    for (const r of rejections) {
      if (r.errors.some(e => e.code === 'file-too-large')) {
        toast.error(`${r.file.name} : fichier trop volumineux (max 50 MB)`);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: {
      'image/jpeg': [],
      'image/png': [],
      'image/webp': [],
      'image/heic': [],
      'image/heif': [],
    },
    maxSize: 50 * 1024 * 1024,
    disabled: isProcessing,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        relative group cursor-pointer
        rounded-2xl border-2 border-dashed
        transition-all duration-300 ease-in-out
        ${isDragActive ? 'border-[#00ff41] bg-[#00ff41]/5' : 'border-border hover:border-[#00ff41]/50 hover:bg-[#00ff41]/5'}
        ${hasImages ? 'h-32' : 'h-64 sm:h-80'}
      `}
    >
      <input {...getInputProps()} />
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <motion.div
          animate={{
            scale: isDragActive ? 1.1 : 1,
            y: isDragActive ? -5 : 0,
          }}
          className="p-4 rounded-full bg-background border border-border shadow-2xl group-hover:border-[#00ff41]/50 group-hover:shadow-[#00ff41]/20 transition-all"
        >
          {hasImages ? (
            <ImageIcon className="w-8 h-8 text-muted-foreground group-hover:text-[#00ff41]" />
          ) : (
            <Upload className="w-10 h-10 text-muted-foreground group-hover:text-[#00ff41]" />
          )}
        </motion.div>

        <div className="space-y-1">
          <p className="text-lg font-medium text-foreground">
            {isDragActive ? 'Drop it like it\'s hot!' : t('upload.drop_title')}
          </p>
          <p className="text-sm text-muted-foreground">
            {t('upload.drop_subtitle')}
          </p>
        </div>
      </div>
    </div>
  );
}

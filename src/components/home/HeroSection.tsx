import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Lock } from 'lucide-react';
import DropZone from '@/components/DropZone';

const HERO_BG = "/hero-bg.avif";

interface HeroSectionProps {
  onFilesAdded: (files: FileList | File[]) => { added: number; rejected: number; limitReached?: boolean };
  hasImages: boolean;
  isProcessing: boolean;
}

export default function HeroSection({ onFilesAdded, hasImages, isProcessing }: HeroSectionProps) {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden min-h-[550px] flex items-center">
      <div className="absolute inset-0 z-0">
        <img src={HERO_BG} width="1920" height="1080" alt="GhostMeta Secure Interface Background" className="w-full h-full object-cover opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ghost-dark/60 to-ghost-dark"></div>
      </div>

      <div className="container relative z-10 py-12 text-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-6">
            <Lock className="w-3 h-3 text-ghost-green" /> {t('hero.secure_badge')}
          </div>

          <h1
            className="matrix-hero-title"
            aria-label={`${t('hero.title_start')} ${t('hero.title_color')} ${t('hero.title_end')}`}
          >
            <span className="matrix-outer" data-text={t('hero.title_start')}>{t('hero.title_start')}</span>
            <span className="matrix-core" data-text={t('hero.title_color')}>{t('hero.title_color')}</span>
            <span className="matrix-outer" data-text={t('hero.title_end')}>{t('hero.title_end')}</span>
          </h1>

          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">{t('hero.subtitle')}</p>

          <div className="max-w-2xl mx-auto">
            <DropZone onFilesAdded={onFilesAdded} hasImages={hasImages} isProcessing={isProcessing} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Zap,
  Trash2,
  Download,
  Lock,
  ChevronDown,
  Shield,
  AlertTriangle,
  Globe,
  Smartphone,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  Server,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import GhostLogo from '@/components/GhostLogo';
import DropZone from '@/components/DropZone';
import ImageCard from '@/components/ImageCard';
import ProModal from '@/components/ProModal';
import Footer from '@/components/Footer';
import { useImageProcessor } from '@/hooks/useImageProcessor';

// --- IMAGES LOCALES OPTIMISÉES ---
const HERO_BG_URL = "/assets/hero-bg.webp";
const TABLET_SCAN_URL = "/assets/scan-effect.webp";
const SHIELD_URL = "/assets/shield.webp";

const PAYPAL_LINK = "https://paypal.me/abdus84";

export default function Home() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  const {
    images,
    isProcessing,
    progress,
    stats,
    addFiles,
    removeImage,
    clearAll,
    cleanAll,
    downloadImage,
    downloadAllZip,
  } = useImageProcessor();

  const [showProModal, setShowProModal] = useState(false);

  const handleDonation = () => {
    window.open(PAYPAL_LINK, '_blank');
  };

  const handleCleanAll = useCallback(() => {
    cleanAll();
  }, [cleanAll]);

  const handleFilesAdded = useCallback(
    (files: FileList | File[]) => {
      const result = addFiles(files);
      if (result.added > 0) {
        toast.success(`${result.added} image${result.added > 1 ? 's' : ''}`, {
          description: t('upload.success'),
        });
      }
      if (result.rejected > 0) {
        toast.error(t('upload.error_type'), {
          description: 'JPG, PNG, WebP, HEIC',
        });
      }
      return result;
    },
    [addFiles, t]
  );

  const progressPercent =
    progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-background">

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <GhostLogo size={32} glow />
            <span className="text-lg font-bold tracking-tight text-foreground hidden sm:inline-block">
              Ghost<span className="text-[#00ff41]">Meta</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('fr')}>🇫🇷 Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')}>🇺🇸 English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDonation}
              className="text-xs border-[#ff0055]/30 text-[#ff0055]"
            >
              <Heart className="w-3.5 h-3.5 mr-1 fill-current" />
              {t('pro.price_btn')}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">

        {/* HERO — LCP */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              src={HERO_BG_URL}
              alt=""
              fetchpriority="high"
              width={1920}
              height={1080}
              className="w-full h-full object-cover opacity-15"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
          </div>

          <div className="container relative z-10 pt-8 sm:pt-12 pb-6">
            {/* contenu inchangé */}
          </div>
        </section>

        {/* WHY section */}
        <section className="container py-16 text-center">
          <motion.div className="max-w-3xl mx-auto mb-12 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={TABLET_SCAN_URL}
              alt="Scan analysis example"
              width={1920}
              height={1080}
              className="w-full h-auto object-cover"
            />
          </motion.div>
        </section>

        {/* ARCHITECTURE */}
        <section className="container py-16">
          <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
            <img
              src={SHIELD_URL}
              alt=""
              width={512}
              height={512}
              className="w-48 h-48 object-contain"
            />
          </div>
        </section>

      </main>

      <Footer />
      <ProModal open={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
}


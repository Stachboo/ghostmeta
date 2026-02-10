import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
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
  Server
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

const HERO_BG_URL = 'https://private-us-east-1.manuscdn.com/sessionFile/8huYn2dyWpx9kzHPbMzipj/sandbox/Se7l2axPQPaZFUzuuvo9Se-img-1_1770726687000_na1fn_Z2hvc3RtZXRhLWhlcm8tYmc.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80';

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
    isPro,
    addFiles,
    removeImage,
    clearAll,
    cleanAll,
    downloadImage,
    downloadAllZip,
  } = useImageProcessor();

  const [showProModal, setShowProModal] = useState(false);
  const proActive = isPro();

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

  const handleCleanAll = useCallback(() => {
    if (!proActive && images.length > 1) {
      setShowProModal(true);
      return;
    }
    cleanAll();
  }, [proActive, images.length, cleanAll]);

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
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('fr')}>
                  🇫🇷 Français
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')}>
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {proActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20">
                <Zap className="w-3 h-3" />
                {t('pro.active')}
              </span>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProModal(true)}
                className="text-xs border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10 h-8"
              >
                <Zap className="w-3.5 h-3.5 mr-1" />
                {t('pro.price_btn')}
              </Button>
            )}
            <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>{t('hero.secure_badge')}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={HERO_BG_URL} alt="" className="w-full h-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
          </div>

          <div className="container relative z-10 pt-8 sm:pt-12 pb-6">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center mb-8"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-3">
                {t('hero.title_start')} <span className="text-[#00ff41]">{t('hero.title_color')}</span>
                <br className="hidden sm:block" /> {t('hero.title_end')}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
                {t('hero.subtitle')}
              </p>
            </motion.div>

            <div className="max-w-2xl mx-auto">
              <DropZone
                onFilesAdded={handleFilesAdded}
                hasImages={images.length > 0}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </section>

        {/* Images & Controls */}
        {images.length > 0 && (
          <section className="container pb-12">
            {/* Stats bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-3 gap-3 mb-5"
            >
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-card border border-border">
                <Shield className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <div>
                  <p className="text-lg font-bold text-foreground leading-none">{stats.total}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-card border border-border">
                <AlertTriangle className="w-5 h-5 text-[#ffb000] flex-shrink-0" />
                <div>
                  <p className="text-lg font-bold text-[#ffb000] leading-none">{stats.threatsFound}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-card border border-border">
                <ShieldCheck className="w-5 h-5 text-[#00ff41] flex-shrink-0" />
                <div>
                  <p className="text-lg font-bold text-[#00ff41] leading-none">{stats.cleaned}</p>
                </div>
              </div>
            </motion.div>

            {/* Action bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6 p-4 rounded-lg bg-card border border-border"
            >
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {stats.cleaned < stats.total && (
                  <Button
                    onClick={handleCleanAll}
                    disabled={isProcessing}
                    className="flex-1 sm:flex-none h-11 bg-[#00ff41] hover:bg-[#00dd38] text-black font-bold ghost-glow text-sm"
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        {t('upload.cleaning')}
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        {t('upload.cleaning').replace('...', '')}
                      </>
                    )}
                  </Button>
                )}

                {stats.cleaned > 0 && (
                  <Button
                    onClick={downloadAllZip}
                    variant="outline"
                    className="flex-1 sm:flex-none h-11 border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {t('upload.download_all')}
                  </Button>
                )}
              </div>

              <Button
                onClick={clearAll}
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-destructive h-9"
                disabled={isProcessing}
              >
                <Trash2 className="w-4 h-4 mr-1.5" />
                <span className="text-xs">{t('upload.delete_all')}</span>
              </Button>
            </motion.div>

            {/* Progress bar */}
            <AnimatePresence>
              {isProcessing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="font-mono">
                      {t('upload.processing')} {progress.current}/{progress.total}
                    </span>
                    <span className="font-mono text-[#00ff41]">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2 bg-muted" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Image list */}
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {images.map((image, index) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onRemove={removeImage}
                    onDownload={downloadImage}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Free user batch notice */}
            {!proActive && images.length > 1 && stats.cleaned === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-5 rounded-lg border border-[#ffb000]/20 bg-[#ffb000]/5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-[#ffb000] mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-[#ffb000]">{t('marketing.batch_lock_title')}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {t('marketing.batch_lock_desc')}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowProModal(true)}
                    size="sm"
                    className="bg-[#ffb000] hover:bg-[#e6a000] text-black font-bold h-9 flex-shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    {t('pro.unlock')}
                  </Button>
                </div>
              </motion.div>
            )}
          </section>
        )}

        {/* Scroll indicator */}
        {images.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex justify-center py-4"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-muted-foreground/40"
            >
              <ChevronDown className="w-6 h-6" />
            </motion.div>
          </motion.div>
        )}

        {/* Argumentaire Vinted */}
        <section className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-6 sm:p-10 rounded-xl border border-[#ffb000]/20 bg-[#ffb000]/5 relative overflow-hidden"
          >
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#ffb000]/30" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#ffb000]/30" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#ffb000]/30" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#ffb000]/30" />

            <div className="flex flex-col sm:flex-row items-start gap-6">
              <AlertTriangle className="w-10 h-10 text-[#ffb000] flex-shrink-0 mt-1" />
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#ffb000]">
                  {t('marketing.vinted_title')}
                </h2>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {t('marketing.vinted_text_1')}
                </p>
                <p className="text-muted-foreground text-base leading-relaxed">
                  {t('marketing.vinted_text_2')}
                </p>
                 <p className="text-[#00ff41] font-medium text-base leading-relaxed">
                  {t('marketing.vinted_text_3')}
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* POURQUOI / WHY Section */}
        <section className="container py-16 text-center">
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4">
                    {t('info.why_title')} <span className="text-red-500">{t('info.why_title_highlight')}</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                    {t('info.why_desc')}
                </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {/* Carte 1 */}
                <div className="p-6 rounded-xl bg-card border border-border/50 text-left">
                    <MapPin className="w-8 h-8 text-red-500 mb-4" />
                    <h3 className="font-bold text-lg mb-2">{t('info.geo_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('info.geo_desc')}</p>
                </div>
                {/* Carte 2 */}
                <div className="p-6 rounded-xl bg-card border border-border/50 text-left">
                    <Clock className="w-8 h-8 text-amber-500 mb-4" />
                    <h3 className="font-bold text-lg mb-2">{t('info.meta_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('info.meta_desc')}</p>
                </div>
                {/* Carte 3 */}
                <div className="p-6 rounded-xl bg-card border border-border/50 text-left">
                    <Smartphone className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="font-bold text-lg mb-2">{t('info.hard_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('info.hard_desc')}</p>
                </div>
            </div>
        </section>

        {/* COMMENT / HOW Section */}
        <section className="container py-16 text-center">
            <h2 className="text-3xl font-bold mb-4">
                {t('info.how_title')} <span className="text-[#00ff41]">{t('info.how_highlight')}</span>
            </h2>
            <p className="text-muted-foreground mb-12">{t('info.how_subtitle')}</p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto text-left">
                 {/* Step 1 */}
                 <div className="border border-[#00ff41]/20 bg-[#00ff41]/5 p-6 rounded-lg relative">
                    <span className="text-4xl font-bold text-[#00ff41] opacity-20 absolute top-4 right-4">01</span>
                    <h3 className="text-[#00ff41] font-bold mb-2">{t('info.step_1_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('info.step_1_desc')}</p>
                 </div>
                 {/* Step 2 */}
                 <div className="border border-[#ffb000]/20 bg-[#ffb000]/5 p-6 rounded-lg relative">
                    <span className="text-4xl font-bold text-[#ffb000] opacity-20 absolute top-4 right-4">02</span>
                    <h3 className="text-[#ffb000] font-bold mb-2">{t('info.step_2_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('info.step_2_desc')}</p>
                 </div>
                 {/* Step 3 */}
                 <div className="border border-[#00ff41]/20 bg-[#00ff41]/5 p-6 rounded-lg relative">
                    <span className="text-4xl font-bold text-[#00ff41] opacity-20 absolute top-4 right-4">03</span>
                    <h3 className="text-[#00ff41] font-bold mb-2">{t('info.step_3_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('info.step_3_desc')}</p>
                 </div>
            </div>
        </section>

        {/* ARCHITECTURE Section */}
        <section className="container py-16">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">
                    {t('info.arch_title')} <span className="text-[#00ff41]">{t('info.arch_highlight')}</span>
                </h2>
                <p className="text-muted-foreground">{t('info.arch_subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {/* Bad */}
                <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-xl">
                    <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2">
                        <Server className="w-5 h-5" /> {t('info.arch_bad_title')}
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> {t('info.arch_bad_1')}</li>
                        <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> {t('info.arch_bad_2')}</li>
                        <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> {t('info.arch_bad_3')}</li>
                    </ul>
                </div>

                {/* Good */}
                <div className="border border-[#00ff41]/20 bg-[#00ff41]/5 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[#00ff41]/5 blur-3xl opacity-20 pointer-events-none" />
                    <h3 className="text-[#00ff41] font-bold mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5" /> {t('info.arch_good_title')}
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00ff41]" /> {t('info.arch_good_1')}</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00ff41]" /> {t('info.arch_good_2')}</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00ff41]" /> {t('info.arch_good_3')}</li>
                    </ul>
                </div>
            </div>
        </section>

        {/* PRICING Section */}
        <section className="container py-16 text-center">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-[#00ff41]" /> {t('pro.title')}
            </h2>
            <p className="text-muted-foreground mb-10">{t('pro.subtitle')}</p>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
                {/* Gratuit */}
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="font-bold text-xl mb-4">{t('pro.free_title')}</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {t('pro.free_1')}</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {t('pro.free_2')}</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {t('pro.free_3')}</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {t('pro.free_4')}</li>
                    </ul>
                </div>

                {/* Pro */}
                <div className="p-6 rounded-xl border border-[#00ff41]/30 bg-[#00ff41]/5 relative">
                    <div className="absolute top-4 right-4 text-xs font-bold bg-[#00ff41] text-black px-2 py-1 rounded">PRO</div>
                    <h3 className="font-bold text-xl mb-1">{t('pro.pro_title')}</h3>
                    <p className="text-2xl font-bold text-[#00ff41] mb-4">{t('pro.pro_price')}</p>
                    <ul className="space-y-3 text-sm text-muted-foreground mb-8">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00ff41]" /> {t('pro.pro_1')}</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00ff41]" /> {t('pro.pro_2')}</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00ff41]" /> {t('pro.pro_3')}</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00ff41]" /> {t('pro.pro_4')}</li>
                    </ul>
                    <Button onClick={() => setShowProModal(true)} className="w-full bg-[#00ff41] hover:bg-[#00dd38] text-black font-bold">
                        {t('pro.unlock')}
                    </Button>
                </div>
            </div>
        </section>

        {/* FAQ */}
        <section className="max-w-2xl mx-auto py-16 space-y-6">
            <h2 className="text-2xl font-bold text-center">{t('info.faq_title')}</h2>
            <Accordion type="single" collapsible className="w-full">
            {[1, 2, 3, 4, 5, 6].map((num) => (
                <AccordionItem key={num} value={`item-${num}`}>
                <AccordionTrigger className="text-left">
                    {t(`info.q${num}`)}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                    {t(`info.a${num}`)}
                </AccordionContent>
                </AccordionItem>
            ))}
            </Accordion>
        </section>
      </main>

      <Footer />
      <ProModal open={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
}

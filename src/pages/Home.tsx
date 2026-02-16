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

const HERO_BG_URL = "https://private-us-east-1.manuscdn.com/sessionFile/8huYn2dyWpx9kzHPbMzipj/sandbox/Se7l2axPQPaZFUzuuvo9Se-img-1_1770726687000_na1fn_Z2hvc3RtZXRhLWhlcm8tYmc.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOGh1WW4yZHlXcHg5a3pIUGJNemlwai9zYW5kYm94L1NlN2wyYXhQUVBhWkZVenV1dm85U2UtaW1nLTFfMTc3MDcyNjY4NzAwMF9uYTFmbl9aMmh2YzNSdFpYUmhMV2hsY204dFltYy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=JNX4ezXkHI9~cHMpVXQz9jegOhIM61IQKqOqxFbJiTM9xxzwPGMmVr535OKijZfVicM-2wpovao0YeFfjmA3nikymInRSjxrBU5VfNsGGzM3dI1J9kItLwfbQNgLSDq-cZnwyd0GkwbmVX3CP0UIyjIDfG7Y8Lam6l~U8BI7~jMeMgqIjlTdHFAousFa2uaM34DfbGoeTzefpmfq7ncbuVjECuEY3c82y7M-OKKfPdDZ8HVogC6m3ERW5810TN6Ygdd996YxKryBFIsuNsZ1v~r2SDFobD9y3FQ-80jgvM1pRyqZnV9~P16AdkSKjDzsNsg~bhhhnNC3uMAkH7MP9g__";
const TABLET_SCAN_URL = "https://private-us-east-1.manuscdn.com/sessionFile/8huYn2dyWpx9kzHPbMzipj/sandbox/Se7l2axPQPaZFUzuuvo9Se-img-3_1770726694000_na1fn_Z2hvc3RtZXRhLXNjYW4tZWZmZWN0.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOGh1WW4yZHlXcHg5a3pIUGJNemlwai9zYW5kYm94L1NlN2wyYXhQUVBhWkZVenV1dm85U2UtaW1nLTNfMTc3MDcyNjY4NzAwMF9uYTFmbl9aMmh2YzNSdFpYUmhMWE5qWVc0dFpXWm1aV04wLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=twLze8fBhWRAeXA-ZduyhqoPb4UAc9XaJ8940DzoFSplumzcXlv7qB1BDpnxjzN5qLTTWHal5ajaLp37nzQUO6ba4Tw-wLUQdGgNPYi1d3Zxta8LGHMs0fRqvPWCZDLfp3Uytvzim94eBHn~vPONftZw-bFBz~NYFgRbyvfw4tf311h1gQgtLFLxSvh2VgZu1n~BfhE~9O1yaDo2IXBIvXjlhOUxRBVUQcVWt2p236Pyp6JHG0i3W9b1lj3zFR1Ff2aAjKUJyqdhvCz0I8V1wi28cmSczwI7l81M1uJALrImbArl~rM05CkadftAjadb5TyIuZNgAB8IipZ99iYL8g__";
const SHIELD_URL = "https://private-us-east-1.manuscdn.com/sessionFile/8huYn2dyWpx9kzHPbMzipj/sandbox/Se7l2axPQPaZFUzuuvo9Se_1770726694647_na1fn_Z2hvc3RtZXRhLXNoaWVsZA.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOGh1WW4yZHlXcHg5a3pIUGJNemlwai9zYW5kYm94L1NlN2wyYXhQUVBhWkZVenV1dm85U2VfMTc3MDcyNjY5NDY0N19uYTFmbl9aMmh2YzNSdFpYUmhMWE5vYVdWc1pBLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=j-RcYfWc8jgkoKUBcYlVfFcQ8Y6DZFThE30fFX8gFxpri7UDVcfN5~FBw7mI6qyTsk3nczlyirg9boGlgwzRHcCv2ju6PMb3mh~5oOeBcOs8r-H5HQzRhTJXWunKH5KKGhKrz5RqABOgpVxmi8sxYXWsMGOcLMtB4HWCkqrnAn-fRnEbqFGOGEYZDbkROSa5JS3h63CqOCmf-nUjngooWogsKL07whYqTphVu17RXCQ7wBlDB5LMNb1LJM4I8gdmUix6sLTSD634maL8H~U9FWY8Dvfdf9Lu7qfXH6gHZ36a-8ov3zsUPISR8L6fu2yMOkAqiFp1lSRk05EBI4Ypaw__";
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
    <div className="min-h-screen flex flex-col bg-background font-sans">
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

            <Button
              variant="outline"
              size="sm"
              onClick={handleDonation}
              className="text-xs border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055]/10 h-8 font-bold"
            >
              <Heart className="w-3.5 h-3.5 mr-1 fill-current" />
              {t('pro.price_btn')}
            </Button>
            
            <div className="hidden md:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>{t('hero.secure_badge')}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={HERO_BG_URL} alt="" fetchpriority="high" className="w-full h-full object-cover opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background"></div>
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
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-8">
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

        {images.length > 0 && (
          <section className="container pb-12">
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
                        <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
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
          </section>
        )}

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

        <section className="container py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto p-6 sm:p-10 rounded-xl border border-[#ffb000]/20 bg-[#ffb000]/5 relative overflow-hidden"
          >
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#ffb000]/30"></div>
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#ffb000]/30"></div>
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#ffb000]/30"></div>
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#ffb000]/30"></div>

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

        <section className="container py-16 text-center">
            <div className="mb-12">
                <h2 className="text-3xl font-bold mb-4">
                    {t('info.why_title')} <span className="text-red-500">{t('info.why_title_highlight')}</span>
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                    {t('info.why_desc')}
                </p>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mx-auto mb-12 rounded-xl overflow-hidden border border-white/10 shadow-2xl"
                >
                  <img src={TABLET_SCAN_URL} alt="Scan Analysis" className="w-full h-auto object-cover" />
                </motion.div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
                <div className="p-6 rounded-xl bg-card border border-border/50">
                    <MapPin className="w-8 h-8 text-red-500 mb-4" />
                    <h3 className="font-bold text-lg mb-2">{t('info.geo_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('info.geo_desc')}</p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border/50">
                    <Clock className="w-8 h-8 text-amber-500 mb-4" />
                    <h3 className="font-bold text-lg mb-2">{t('info.meta_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('info.meta_desc')}</p>
                </div>
                <div className="p-6 rounded-xl bg-card border border-border/50">
                    <Smartphone className="w-8 h-8 text-blue-500 mb-4" />
                    <h3 className="font-bold text-lg mb-2">{t('info.hard_title')}</h3>
                    <p className="text-sm text-muted-foreground">{t('info.hard_desc')}</p>
                </div>
            </div>
        </section>

        <section className="container py-16">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold mb-2">
                    {t('info.arch_title')}
                </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
                <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-xl h-full">
                    <h3 className="text-red-500 font-bold mb-4 flex items-center gap-2">
                        <Server className="w-5 h-5" /> {t('info.arch_bad_title')}
                    </h3>
                    <ul className="space-y-3 text-sm text-muted-foreground">
                        <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> {t('info.arch_bad_1')}</li>
                        <li className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-500" /> {t('info.arch_bad_2')}</li>
                    </ul>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                          <img src={SHIELD_URL} alt="" className="w-48 h-48 object-contain" />
                    </div>
                    <div className="border border-[#00ff41]/20 bg-[#00ff41]/5 p-6 rounded-xl relative overflow-hidden h-full z-10">
                        <div className="absolute inset-0 bg-[#00ff41]/5 blur-3xl opacity-20 pointer-events-none"></div>
                        <h3 className="text-[#00ff41] font-bold mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5" /> {t('info.arch_good_title')}
                        </h3>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00ff41]" /> {t('info.arch_good_1')}</li>
                            <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#00ff41]" /> {t('info.arch_good_2')}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <section className="container py-16 border-t border-border/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-[#00ff41]">{t('blog.section_title')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              <Link to="/blog/vinted-securite-photo-guide" className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all">
                <h3 className="font-bold text-sm text-foreground mb-1">{t('blog.posts.vinted-securite-photo-guide.title')}</h3>
                <p className="text-xs text-muted-foreground">{t('blog.posts.vinted-securite-photo-guide.desc')}</p>
              </Link>
              <Link to="/blog/supprimer-exif-iphone-android" className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all">
                <h3 className="font-bold text-sm text-foreground mb-1">{t('blog.posts.supprimer-exif-iphone-android.title')}</h3>
                <p className="text-xs text-muted-foreground">{t('blog.posts.supprimer-exif-iphone-android.desc')}</p>
              </Link>
              <Link to="/blog/comprendre-donnees-exif-gps" className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all">
                <h3 className="font-bold text-sm text-foreground mb-1">{t('blog.posts.comprendre-donnees-exif-gps.title')}</h3>
                <p className="text-xs text-muted-foreground">{t('blog.posts.comprendre-donnees-exif-gps.desc')}</p>
              </Link>
              <Link to="/blog/nettoyage-photo-local-vs-cloud" className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all">
                <h3 className="font-bold text-sm text-foreground mb-1">{t('blog.posts.nettoyage-photo-local-vs-cloud.title')}</h3>
                <p className="text-xs text-muted-foreground">{t('blog.posts.nettoyage-photo-local-vs-cloud.desc')}</p>
              </Link>
              <Link to="/blog/ghostmeta-manifeste-confidentialite" className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all sm:col-span-2 lg:col-span-1">
                <h3 className="font-bold text-sm text-foreground mb-1">{t('blog.posts.ghostmeta-manifeste-confidentialite.title')}</h3>
                <p className="text-xs text-muted-foreground">{t('blog.posts.ghostmeta-manifeste-confidentialite.desc')}</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="container py-16 text-center">
            <h2 className="text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                <Zap className="w-6 h-6 text-[#00ff41]" /> {t('pro.title')}
            </h2>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left mt-10">
                <div className="p-6 rounded-xl border border-border bg-card">
                    <h3 className="font-bold text-xl mb-4">{t('pro.free_title')}</h3>
                    <ul className="space-y-3 text-sm text-muted-foreground mb-6">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> {t('pro.free_1')}</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /> 100% Local & Privé</li>
                    </ul>
                </div>

                <div className="p-6 rounded-xl border border-dashed border-[#00ff41]/20 bg-[#00ff41]/5 relative opacity-80">
                    <div className="absolute top-4 right-4 text-xs font-bold bg-[#00ff41]/20 text-[#00ff41] px-2 py-1 rounded">{t('pro.unlock')}</div>
                    <h3 className="font-bold text-xl mb-1">{t('pro.pro_title')}</h3>
                    <p className="text-2xl font-bold text-[#00ff41] mb-4">{t('pro.pro_price')}</p>
                    <Button onClick={handleDonation} className="w-full bg-[#ff0055] hover:bg-[#d40047] text-white font-bold">
                        <Heart className="w-4 h-4 mr-2 fill-white" />
                        {t('pro.price_btn')}
                    </Button>
                </div>
            </div>
        </section>

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


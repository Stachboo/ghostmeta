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
const TABLET_SCAN_URL = "https://private-us-east-1.manuscdn.com/sessionFile/8huYn2dyWpx9kzHPbMzipj/sandbox/Se7l2axPQPaZFUzuuvo9Se-img-3_1770726694000_na1fn_Z2hvc3RtZXRhLXNjYW4tZWZmZWN0.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOGh1WW4yZHlXcHg5a3pIUGJNemlwai9zYW5kYm94L1NlN2wyYXhQUVBhWkZVenV1dm85U2UtaW1nLTNfMTc3MDcyNjY5NDAwMF9uYTFmbl9aMmh2YzNSdFpYUmhMWE5qWVc0dFpXWm1aV04wLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=twLze8fBhWRAeXA-ZduyhqoPb4UAc9XaJ8940DzoFSplumzcXlv7qB1BDpnxjzN5qLTTWHal5ajaLp37nzQUO6ba4Tw-wLUQdGgNPYi1d3Zxta8LGHMs0fRqvPWCZDLfp3Uytvzim94eBHn~vPONftZw-bFBz~NYFgRbyvfw4tf311h1gQgtLFLxSvh2VgZu1n~BfhE~9O1yaDo2IXBIvXjlhOUxRBVUQcVWt2p236Pyp6JHG0i3W9b1lj3zFR1Ff2aAjKUJyqdhvCz0I8V1wi28cmSczwI7l81M1uJALrImbArl~rM05CkadftAjadb5TyIuZNgAB8IipZ99iYL8g__";
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
    <div className="min-h-screen flex flex-col bg-background">
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
                <DropdownMenuItem onClick={() => changeLanguage('fr')}>🇫🇷 Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')}>🇺🇸 English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDonation}
              className="text-xs border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055]/10 h-8"
            >
              <Heart className="w-3.5 h-3.5 mr-1 fill-current" />
              {t('pro.price_btn')}
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img src={HERO_BG_URL} alt="GhostMeta Background" className="w-full h-full object-cover opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
          </div>
          <div className="container relative z-10 pt-8 sm:pt-12 pb-6">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-3">
                {t('hero.title_start')} <span className="text-[#00ff41]">{t('hero.title_color')}</span>
                <br className="hidden sm:block" /> {t('hero.title_end')}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">{t('hero.subtitle')}</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <DropZone onFilesAdded={handleFilesAdded} hasImages={images.length > 0} isProcessing={isProcessing} />
            </div>
          </div>
        </section>

        {/* Action bar & List (simplifié pour la clarté) */}
        {images.length > 0 && (
          <section className="container pb-12">
            <div className="space-y-3">
              {images.map((image, index) => (
                <ImageCard key={image.id} image={image} onRemove={removeImage} onDownload={downloadImage} index={index} />
              ))}
            </div>
          </section>
        )}

        {/* Section Guides de Sécurité - LES 5 PAGES ICI */}
        <section className="container py-16 border-t border-border/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-[#00ff41]">Guides de Sécurité & Confidentialité</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/blog/vinted-securite-photo-guide" className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all">
                <h3 className="font-bold text-sm text-foreground mb-1">Guide Vendeur Vinted</h3>
                <p className="text-xs text-muted-foreground">Protégez votre domicile lors de vos ventes.</p>
              </Link>
              <Link to="/blog/supprimer-exif-iphone-android" className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all">
                <h3 className="font-bold text-sm text-foreground mb-1">Tuto iPhone & Android</h3>
                <p className="text-xs text-muted-foreground">Supprimer les GPS manuellement.</p>
              </Link>
              <Link to="/blog/comprendre-donnees-exif-gps" className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all">
                <h3 className="font-bold text-sm text-foreground mb-1">Comprendre l'EXIF</h3>
                <p className="text-xs text-muted-foreground">Le danger invisible de vos photos.</p>
              </Link>
              <Link to="/blog/nettoyage-photo-local-vs-cloud" className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all">
                <h3 className="font-bold text-sm text-foreground mb-1">Local vs Cloud</h3>
                <p className="text-xs text-muted-foreground">Pourquoi le traitement local est vital.</p>
              </Link>
              <Link to="/blog/ghostmeta-manifeste-confidentialite" className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all sm:col-span-2 lg:col-span-1">
                <h3 className="font-bold text-sm text-foreground mb-1">Notre Manifeste</h3>
                <p className="text-xs text-muted-foreground">Engagement pour la vie privée.</p>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <ProModal open={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
}

/**
 * GhostMeta — Page Principale
 * ────────────────────────────
 * GHOST PROTOCOL — Cyber-Industrial / Hacker Éthique
 * Couleurs : #00ff41 (vert néon), #ffb000 (ambre alerte), #0f172a (fond)
 * L'outil est visible dès le haut de la page (Above the fold).
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  ShieldCheck,
  Zap,
  Trash2,
  Download,
  Lock,
  ChevronDown,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import GhostLogo from '@/components/GhostLogo';
import DropZone from '@/components/DropZone';
import ImageCard from '@/components/ImageCard';
import ProModal from '@/components/ProModal';
import InfoSection from '@/components/InfoSection';
import Footer from '@/components/Footer';
import { useImageProcessor } from '@/hooks/useImageProcessor';

const HERO_BG_URL = 'https://private-us-east-1.manuscdn.com/sessionFile/8huYn2dyWpx9kzHPbMzipj/sandbox/Se7l2axPQPaZFUzuuvo9Se-img-1_1770726687000_na1fn_Z2hvc3RtZXRhLWhlcm8tYmc.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOGh1WW4yZHlXcHg5a3pIUGJNemlwai9zYW5kYm94L1NlN2wyYXhQUVBhWkZVenV1dm85U2UtaW1nLTFfMTc3MDcyNjY4NzAwMF9uYTFmbl9aMmh2YzNSdFpYUmhMV2hsY204dFltYy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=JNX4ezXkHI9~cHMpVXQz9jegOhIM61IQKqOqxFbJiTM9xxzwPGMmVr535OKijZfVicM-2wpovao0YeFfjmA3nikymInRSjxrBU5VfNsGGzM3dI1J9kItLwfbQNgLSDq-cZnwyd0GkwbmVX3CP0UIyjIDfG7Y8Lam6l~U8BI7~jMeMgqIjlTdHFAousFa2uaM34DfbGoeTzefpmfq7ncbuVjECuEY3c82y7M-OKKfPdDZ8HVogC6m3ERW5810TN6Ygdd996YxKryBFIsuNsZ1v~r2SDFobD9y3FQ-80jgvM1pRyqZnV9~P16AdkSKjDzsNsg~bhhhnNC3uMAkH7MP9g__';

export default function Home() {
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
        toast.success(`${result.added} image${result.added > 1 ? 's' : ''} ajoutée${result.added > 1 ? 's' : ''}`, {
          description: 'Prêtes pour le scan',
        });
      }
      if (result.rejected > 0) {
        toast.error(`${result.rejected} fichier${result.rejected > 1 ? 's' : ''} non supporté${result.rejected > 1 ? 's' : ''}`, {
          description: 'Formats acceptés : JPEG, PNG, WebP, HEIC',
        });
      }
      return result;
    },
    [addFiles]
  );

  const handleCleanAll = useCallback(() => {
    // Free users: unlimited but one by one (cleanAll handles the logic)
    // Pro users: batch all at once
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
            <span className="text-lg font-bold tracking-tight text-foreground">
              Ghost<span className="text-[#00ff41]">Meta</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {proActive ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono bg-[#00ff41]/10 text-[#00ff41] border border-[#00ff41]/20">
                <Zap className="w-3 h-3" />
                PRO ACTIF
              </span>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowProModal(true)}
                className="text-xs border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10 h-8"
              >
                <Zap className="w-3.5 h-3.5 mr-1" />
                Pack Pro — 9€
              </Button>
            )}
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-muted-foreground">
              <Lock className="w-3 h-3" />
              <span>100% Local</span>
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
                Supprimez les <span className="text-[#00ff41]">métadonnées</span>
                <br className="hidden sm:block" /> de vos photos
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto">
                Protégez votre vie privée avant de publier sur Vinted, Leboncoin ou eBay.
                <span className="text-[#00ff41] font-medium"> Traitement 100% local.</span>
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
                  <p className="text-[11px] text-muted-foreground mt-0.5">Image{stats.total > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-card border border-border">
                <AlertTriangle className="w-5 h-5 text-[#ffb000] flex-shrink-0" />
                <div>
                  <p className="text-lg font-bold text-[#ffb000] leading-none">{stats.threatsFound}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Menace{stats.threatsFound > 1 ? 's' : ''}</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5 p-3 rounded-lg bg-card border border-border">
                <ShieldCheck className="w-5 h-5 text-[#00ff41] flex-shrink-0" />
                <div>
                  <p className="text-lg font-bold text-[#00ff41] leading-none">{stats.cleaned}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Nettoyée{stats.cleaned > 1 ? 's' : ''}</p>
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
                        Traitement...
                      </span>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4 mr-2" />
                        {!proActive && images.length > 1 ? (
                          <>NEUTRALISER TOUT <Zap className="w-3.5 h-3.5 ml-1 text-black/60" /></>
                        ) : (
                          <>NEUTRALISER {images.length > 1 ? 'TOUT' : ''}</>
                        )}
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
                    {stats.cleaned > 1 ? 'ZIP' : 'Télécharger'}
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
                <span className="text-xs">Tout supprimer</span>
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
                      OPÉRATION EN COURS : {progress.current}/{progress.total}
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
                      <p className="text-sm font-semibold text-[#ffb000]">Mode Batch verrouillé</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        En mode gratuit, nettoyez vos photos une par une (illimité). 
                        Le Pack Pro débloque le traitement par lots pour {images.length} images d'un coup + export ZIP.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setShowProModal(true)}
                    size="sm"
                    className="bg-[#ffb000] hover:bg-[#e6a000] text-black font-bold h-9 flex-shrink-0"
                  >
                    <Zap className="w-3.5 h-3.5 mr-1.5" />
                    Débloquer — 9€
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
        <section className="container py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto p-6 sm:p-8 rounded-xl border border-[#ffb000]/20 bg-[#ffb000]/5 relative overflow-hidden"
          >
            <div className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-[#ffb000]/30" />
            <div className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-[#ffb000]/30" />
            <div className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-[#ffb000]/30" />
            <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-[#ffb000]/30" />

            <div className="flex items-start gap-4">
              <AlertTriangle className="w-8 h-8 text-[#ffb000] flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#ffb000] mb-3">
                  Vos photos Vinted révèlent votre adresse.
                </h2>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-3">
                  Chaque photo prise avec votre iPhone ou Android embarque vos <strong className="text-foreground">coordonnées GPS exactes</strong>, 
                  la <strong className="text-foreground">date et l'heure</strong> de prise de vue, et le <strong className="text-foreground">modèle de votre téléphone</strong>. 
                  Quand un acheteur vous demande "plus de photos" par WhatsApp, il reçoit tout.
                </p>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  <strong className="text-[#00ff41]">Nettoyez vos photos avant de les poster.</strong> GhostMeta supprime toutes les métadonnées 
                  en un clic, directement dans votre navigateur. Rien n'est envoyé sur internet.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Info sections */}
        <div className="container py-12">
          <InfoSection />
        </div>
      </main>

      <Footer />
      <ProModal open={showProModal} onClose={() => setShowProModal(false)} />
    </div>
  );
}

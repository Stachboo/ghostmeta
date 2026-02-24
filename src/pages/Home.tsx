import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShieldCheck, Zap, Trash2, Download, Lock, ChevronDown, Shield, AlertTriangle, Globe, Smartphone, Clock, MapPin, CheckCircle2, XCircle, Server, Heart, Scan, FileDigit, MousePointerClick
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
import TrustStrip from '@/components/TrustStrip';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import AuthButton from '@/components/AuthButton';

const HERO_BG = "/hero-bg.avif";
const SCAN_EFFECT = "/scan-effect.avif";
const SHIELD_IMG = "/shield.avif";
const PAYPAL_LINK = import.meta.env.VITE_DONATION_URL || "https://paypal.me/abdus84";

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
    isLoggedIn,
    hasViewedMetadata,
    addFiles,
    removeImage,
    clearAll,
    cleanAll, // Restauré : J'avais oublié cette fonction
    downloadImage,
    downloadAllZip,
  } = useImageProcessor();

  // Metadata floutée si : guest OU free user ayant déjà consommé son scan gratuit
  const blurMetadata = !isLoggedIn || (!isPro() && hasViewedMetadata);

  const handleSignIn = async () => {
    if (!isLoggedIn) {
      const { supabase } = await import('@/lib/supabase');
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin },
      });
    } else {
      // Free user ayant épuisé son scan : rediriger vers pricing
      window.location.href = '/pricing';
    }
  };

  // Restauré : Mapping pour correspondre à ton JSX 'onClick={handleCleanAll}'
  const handleCleanAll = cleanAll; 

  const [showProModal, setShowProModal] = useState(false);

  const handleDonation = () => window.open(PAYPAL_LINK, '_blank');

  const handleFilesAdded = useCallback((files: FileList | File[]) => {
    const result = addFiles(files);
    if (result.limitReached) {
      setShowProModal(true);
      return result;
    }
    if (result.added > 0) toast.success(`${result.added} image(s)`, { description: t('upload.success') });
    if (result.rejected > 0) toast.error(t('upload.error_type'), { description: 'JPG, PNG, WebP, HEIC' });
    return result;
  }, [addFiles, t]);

  const progressPercent = progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0;

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0c] font-sans text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-2.5">
            <GhostLogo size={32} glow />
            <span className="text-lg font-bold tracking-tight">Ghost<span className="text-[#00ff41]">Meta</span></span>
          </div>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* MODIFICATION UNIQUE ICI : Ajout du aria-label pour Google */}
                <Button variant="ghost" size="icon" aria-label="Changer la langue / Change Language">
                  <Globe className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => changeLanguage('fr')}>🇫🇷 Français</DropdownMenuItem>
                <DropdownMenuItem onClick={() => changeLanguage('en')}>🇺🇸 English</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/pricing">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10 font-bold h-8 hidden sm:flex"
              >
                <Zap className="w-3.5 h-3.5 mr-1" /> {t("header.upgrade")}
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDonation} 
              className="border-[#ff0055]/30 text-[#ff0055] hover:bg-[#ff0055]/10 font-bold h-8"
            >
              <Heart className="w-3.5 h-3.5 mr-1 fill-current" /> {t('pro.price_btn')}
            </Button>
            
            <AuthButton />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden min-h-[550px] flex items-center">
          <div className="absolute inset-0 z-0">
            <img src={HERO_BG} width="1920" height="1080" alt="GhostMeta Secure Interface Background" className="w-full h-full object-cover opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0a0a0c]/60 to-[#0a0a0c]"></div>
          </div>

          <div className="container relative z-10 py-12 text-center">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium mb-6">
                <Lock className="w-3 h-3 text-[#00ff41]" /> {t('hero.secure_badge')}
              </div>
              
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-4">
                {t('hero.title_start')} <span className="text-[#00ff41]">{t('hero.title_color')}</span> {t('hero.title_end')}
              </h1>
              
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">{t('hero.subtitle')}</p>
              
              <div className="max-w-2xl mx-auto">
                <DropZone onFilesAdded={handleFilesAdded} hasImages={images.length > 0} isProcessing={isProcessing} />
              </div>
            </motion.div>
          </div>
        </section>

        {/* IMAGE PROCESSING UI */}
        {images.length > 0 && (
          <section className="container pb-12">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <AlertTriangle className="w-6 h-6 mx-auto mb-2 text-amber-500" />
                <p className="text-2xl font-bold text-amber-500">{stats.threatsFound}</p>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
                <ShieldCheck className="w-6 h-6 mx-auto mb-2 text-[#00ff41]" />
                <p className="text-2xl font-bold text-[#00ff41]">{stats.cleaned}</p>
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row gap-3 mb-6 p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {stats.cleaned < stats.total && (
                  <Button onClick={handleCleanAll} disabled={isProcessing} className="flex-1 sm:flex-none h-11 bg-[#00ff41] hover:bg-[#00dd38] text-black font-bold ghost-glow text-sm">
                   {isProcessing ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>{t('upload.cleaning')}</span> : <><ShieldCheck className="w-4 h-4 mr-2" />{t('upload.cleaning').replace('...', '')}</>}
                  </Button>
                )}
                
                {stats.cleaned > 0 && (
                  <Button onClick={downloadAllZip} variant="outline" className="flex-1 sm:flex-none h-11 border-[#00ff41]/30 text-[#00ff41] hover:bg-[#00ff41]/10">
                    <Download className="w-4 h-4 mr-2" /> {t('upload.download_all')}
                  </Button>
                )}
              </div>
              
              <Button onClick={clearAll} variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive h-9" disabled={isProcessing}>
                <Trash2 className="w-4 h-4 mr-1.5" /> <span className="text-xs">{t('upload.delete_all')}</span>
              </Button>
            </motion.div>

            <AnimatePresence>
              {isProcessing && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-6">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                    <span className="font-mono">{t('upload.processing')} {progress.current}/{progress.total}</span>
                    <span className="font-mono text-[#00ff41]">{progressPercent}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-2 bg-muted" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {images.map((image, index) => <ImageCard key={image.id} image={image} onRemove={removeImage} onDownload={downloadImage} index={index} blurMetadata={blurMetadata} onSignIn={handleSignIn} />)}
              </AnimatePresence>
            </div>
          </section>
        )}

        <TrustStrip /> 

        {/* SECTION VINTED */}
        <section className="container py-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto p-8 rounded-xl border border-[#ffb000]/20 bg-[#ffb000]/5 relative overflow-hidden">
            <div className="absolute inset-0 z-0">
               <img src={HERO_BG} width="1920" height="1080" alt="GhostMeta Secure Interface Background" className="w-full h-full object-cover opacity-20 mix-blend-overlay" />
            </div>
            <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-[#ffb000]/30 rounded-tl-3xl z-10"></div>
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-[#ffb000]/30 rounded-br-3xl z-10"></div>
            
            <div className="relative z-20 flex flex-col sm:flex-row items-start gap-6">
              <div className="p-3 rounded-lg bg-[#ffb000]/10 border border-[#ffb000]/20">
                <AlertTriangle className="w-8 h-8 text-[#ffb000]" />
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#ffb000]">{t('marketing.vinted_title')}</h2>
                <p className="text-muted-foreground text-base leading-relaxed">{t('marketing.vinted_text_1')}</p>
                <p className="text-muted-foreground text-base leading-relaxed">{t('marketing.vinted_text_2')}</p>
                <p className="text-[#00ff41] font-medium text-base leading-relaxed">{t('marketing.vinted_text_3')}</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* POURQUOI VOS PHOTOS VOUS TRAHISSENT */}
        <section className="container py-16 text-center">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('info.why_title')} <span className="text-red-500">{t('info.why_title_highlight')}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">{t('info.why_desc')}</p>
            
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto mb-12 rounded-xl overflow-hidden border border-white/10 shadow-2xl bg-black">
              <img src={SCAN_EFFECT} width="1200" height="800" alt="Scan Analysis" className="w-full h-auto object-cover opacity-90" />
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
            <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-red-500/30 transition-colors">
              <MapPin className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">{t('info.geo_title')}</h3>
              <p className="text-sm text-muted-foreground">{t('info.geo_desc')}</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-amber-500/30 transition-colors">
              <Clock className="w-8 h-8 text-amber-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">{t('info.meta_title')}</h3>
              <p className="text-sm text-muted-foreground">{t('info.meta_desc')}</p>
            </div>
            <div className="p-6 rounded-xl bg-card border border-border/50 hover:border-blue-500/30 transition-colors">
              <Smartphone className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="font-bold text-lg mb-2">{t('info.hard_title')}</h3>
              <p className="text-sm text-muted-foreground">{t('info.hard_desc')}</p>
            </div>
          </div>
        </section>

        {/* COMMENT ÇA FONCTIONNE */}
        <section className="container py-12">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">{t('info.how_title')} <span className="text-[#00ff41]">{t('info.how_highlight')}</span></h2>
            <p className="text-muted-foreground">{t('info.how_subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {/* Etape 01 */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-[#00ff41]/30 transition-colors relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#00ff41]/10 rounded-lg text-[#00ff41]"><MousePointerClick className="w-6 h-6" /></div>
                <span className="text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">01</span>
              </div>
              <h3 className="font-bold text-[#00ff41] mb-2">{t('info.step_1_title')}</h3>
              <p className="text-xs text-muted-foreground">{t('info.step_1_desc')}</p>
            </div>

            {/* Etape 02 */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-[#ffb000]/30 transition-colors relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#ffb000]/10 rounded-lg text-[#ffb000]"><Scan className="w-6 h-6" /></div>
                <span className="text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">02</span>
              </div>
              <h3 className="font-bold text-[#ffb000] mb-2">{t('info.step_2_title')}</h3>
              <p className="text-xs text-muted-foreground">{t('info.step_2_desc')}</p>
            </div>

            {/* Etape 03 */}
            <div className="p-6 rounded-xl border border-white/10 bg-white/5 hover:border-[#00ff41]/30 transition-colors relative group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-[#00ff41]/10 rounded-lg text-[#00ff41]"><FileDigit className="w-6 h-6" /></div>
                <span className="text-4xl font-bold text-white/5 group-hover:text-white/10 transition-colors">03</span>
              </div>
              <h3 className="font-bold text-[#00ff41] mb-2">{t('info.step_3_title')}</h3>
              <p className="text-xs text-muted-foreground">{t('info.step_3_desc')}</p>
            </div>
          </div>
        </section>

        {/* ARCHITECTURE */}
        <section className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              {t('info.arch_title')} <span className="text-[#00ff41]">{t('info.arch_highlight')}</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              {t('info.arch_subtitle')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Colonne Rouge */}
            <div className="border border-red-500/20 bg-red-500/5 p-8 rounded-xl h-full">
              <h3 className="text-red-500 font-bold mb-6 flex items-center gap-2 text-lg">
                <Server className="w-5 h-5" /> {t('info.arch_bad_title')}
              </h3>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex items-center gap-3"><XCircle className="w-5 h-5 text-red-500 flex-shrink-0" /> {t('info.arch_bad_1')}</li>
                <li className="flex items-center gap-3"><XCircle className="w-5 h-5 text-red-500 flex-shrink-0" /> {t('info.arch_bad_2')}</li>
                <li className="flex items-center gap-3"><XCircle className="w-5 h-5 text-red-500 flex-shrink-0" /> {t('info.arch_bad_3')}</li>
              </ul>
            </div>

            {/* Colonne Verte (GhostMeta) */}
            <div className="relative border border-[#00ff41]/20 bg-[#00ff41]/5 p-8 rounded-xl h-full overflow-hidden">
              <img src={SHIELD_IMG} width="320" height="320" className="absolute -right-16 -bottom-16 w-80 h-80 opacity-10 pointer-events-none z-0 object-contain" alt="GhostMeta Technical Analysis View" />
              
              <div className="relative z-10">
                <h3 className="text-[#00ff41] font-bold mb-6 flex items-center gap-2 text-lg">
                  <ShieldCheck className="w-5 h-5" /> {t('info.arch_good_title')}
                </h3>
                <ul className="space-y-4 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#00ff41] flex-shrink-0" /> {t('info.arch_good_1')}</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#00ff41] flex-shrink-0" /> {t('info.arch_good_2')}</li>
                  <li className="flex items-center gap-3"><CheckCircle2 className="w-5 h-5 text-[#00ff41] flex-shrink-0" /> {t('info.arch_good_3')}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* BLOG SEO */}
        <section className="container py-16 border-t border-border/30">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-[#00ff41]">{t('blog.section_title')}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
              {['vinted-securite-photo-guide', 'supprimer-exif-iphone-android', 'comprendre-donnees-exif-gps', 'nettoyage-photo-local-vs-cloud'].map(slug => (
                <Link key={slug} to={`/blog/${slug}`} className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all">
                  <h3 className="font-bold text-sm text-foreground mb-1">{t(`blog.posts.${slug}.title`)}</h3>
                  <p className="text-xs text-muted-foreground">{t(`blog.posts.${slug}.desc`)}</p>
                </Link>
              ))}
              <Link to="/blog/ghostmeta-manifeste-confidentialite" className="p-4 rounded-lg bg-card border border-border hover:border-[#00ff41]/50 transition-all sm:col-span-2 lg:col-span-1">
                <h3 className="font-bold text-sm text-foreground mb-1">{t('blog.posts.ghostmeta-manifeste-confidentialite.title')}</h3>
                <p className="text-xs text-muted-foreground">{t('blog.posts.ghostmeta-manifeste-confidentialite.desc')}</p>
              </Link>
            </div>
          </div>
        </section>

        {/* PRICING */}
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
                <Heart className="w-4 h-4 mr-2 fill-white" /> {t('pro.price_btn')}
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
                <AccordionTrigger className="text-left">{t(`info.q${num}`)}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{t(`info.a${num}`)}</AccordionContent>
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

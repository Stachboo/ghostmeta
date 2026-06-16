/**
 * GhostMeta Footer (Internationalized)
 * ────────────────────────────────────
 * Mentions légales et confidentialité dynamiques (FR/EN).
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GhostLogo from './GhostLogo';
import { useTranslation } from 'react-i18next';
import landingsData from '@/data/landings.json';

type FooterTool = { slug: string; en: { h1: string }; fr: { h1: string } };
const TOOLS = landingsData as unknown as FooterTool[];

export default function Footer() {
  const { t, i18n } = useTranslation();
  const lang: 'en' | 'fr' = i18n.language === 'en' ? 'en' : 'fr';
  const [showLegal, setShowLegal] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  // SEC-018 : ouvrir la modale privacy depuis le bandeau de consentement
  useEffect(() => {
    const handler = () => setShowPrivacy(true);
    window.addEventListener('open-privacy-policy', handler);
    return () => window.removeEventListener('open-privacy-policy', handler);
  }, []);

  return (
    <>
      <footer className="border-t border-border/30 mt-20 py-8">
        <div className="container">
          {/* Barre de confiance — texte unifié */}
          <p className="text-center text-[0.8rem] text-[#888] mb-6">
            {"SSL A+ · Security A · Mozilla B+ · 100% Client-Side · RGPD Conforme"}
          </p>

          {/* Grille de liens */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
            {/* Colonne 1 — Navigation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
                {t('nav.home')}
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link to="/securite" className="hover:text-ghost-green transition-colors">
                    {t('security.footer_link')}
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-ghost-green transition-colors">
                    {t('nav.pricing')}
                  </Link>
                </li>
                <li>
                  <button onClick={() => setShowPrivacy(true)} className="hover:text-ghost-green transition-colors">
                    {t('footer.privacy_btn')}
                  </button>
                </li>
                <li>
                  <button onClick={() => setShowLegal(true)} className="hover:text-ghost-green transition-colors">
                    {t('footer.legal_btn')}
                  </button>
                </li>
              </ul>
            </div>

            {/* Colonne 2 — Blog */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
                <Link to="/blog" className="hover:text-ghost-green transition-colors">
                  {t('blog.section_title')}
                </Link>
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                {[
                  'vinted-securite-photo-guide',
                  'supprimer-exif-iphone-android',
                  'comprendre-donnees-exif-gps',
                  'nettoyage-photo-local-vs-cloud',
                  'ghostmeta-manifeste-confidentialite',
                ].map(slug => (
                  <li key={slug}>
                    <Link
                      to={`/blog/${slug}`}
                      className="hover:text-ghost-green transition-colors"
                    >
                      {t(`blog.posts.${slug}.title`)}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    to="/blog"
                    className="text-ghost-green/80 hover:text-ghost-green transition-colors"
                  >
                    {t('footer.blog_index')} →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Colonne 3 — Outils IA (maillage SEO des landings /tools) */}
            <div className="sm:col-span-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
                <Link to="/tools" className="hover:text-ghost-green transition-colors">
                  {t('footer.tools_title')}
                </Link>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
                {TOOLS.map(tool => (
                  <li key={tool.slug}>
                    <Link
                      to={`/tools/${tool.slug}`}
                      className="hover:text-ghost-green transition-colors"
                    >
                      {tool[lang].h1}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Barre copyright */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/20">
            <div className="flex items-center gap-2">
              <GhostLogo size={24} />
              <span className="text-sm text-muted-foreground">
                GhostMeta © {new Date().getFullYear()} — {t('footer.rights')}
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      <Dialog open={showPrivacy} onOpenChange={setShowPrivacy}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{t('legal.privacy_title')}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
            <p>
              <strong className="text-foreground">{t('legal.updated')}</strong>
            </p>
            
            <h3 className="text-foreground font-semibold mt-4">{t('legal.privacy_sections.1.title')}</h3>
            <p>{t('legal.privacy_sections.1.content')}</p>

            <h3 className="text-foreground font-semibold mt-4">{t('legal.privacy_sections.2.title')}</h3>
            <p>{t('legal.privacy_sections.2.content')}</p>

            <h3 className="text-foreground font-semibold mt-4">{t('legal.privacy_sections.3.title')}</h3>
            <p>{t('legal.privacy_sections.3.content')}</p>

            <h3 className="text-foreground font-semibold mt-4">{t('legal.privacy_sections.4.title')}</h3>
            <p>
              {t('legal.privacy_sections.4.content')}
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* Legal Notice Modal */}
      <Dialog open={showLegal} onOpenChange={setShowLegal}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">{t('legal.notice_title')}</DialogTitle>
          </DialogHeader>
          <div className="text-sm text-muted-foreground space-y-4 leading-relaxed">
            <h3 className="text-foreground font-semibold">{t('legal.notice_sections.1.title')}</h3>
            <p>{t('legal.notice_sections.1.content')}</p>

            <h3 className="text-foreground font-semibold mt-4">{t('legal.notice_sections.2.title')}</h3>
            <p>{t('legal.notice_sections.2.content')}</p>

            <h3 className="text-foreground font-semibold mt-4">{t('legal.notice_sections.3.title')}</h3>
            <p>{t('legal.notice_sections.3.content')}</p>

            <p className="text-xs text-muted-foreground/60 mt-6">
              TVA non applicable.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

/**
 * GhostMeta Footer (Internationalized)
 * ────────────────────────────────────
 * Liens légaux (mentions légales, confidentialité, CGV, CGU) vers les vraies
 * routes /mentions-legales, /confidentialite, /cgv, /cgu (FR/EN).
 */

import LocaleLink from '@/components/LocaleLink';
import GhostLogo from './GhostLogo';
import { useTranslation } from 'react-i18next';
import landingsData from '@/data/landings.json';

type FooterTool = { slug: string; en: { h1: string }; fr: { h1: string } };
const TOOLS = landingsData as unknown as FooterTool[];

export default function Footer() {
  const { t, i18n } = useTranslation();
  const lang: 'en' | 'fr' = i18n.language === 'en' ? 'en' : 'fr';

  return (
    <footer className="border-t border-border/30 mt-20 py-8">
      <div className="container">
        {/* Barre de confiance — texte unifié */}
        <p className="text-center text-[0.8rem] text-zinc-400 mb-6">
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
                <LocaleLink to="/securite" className="hover:text-ghost-green transition-colors">
                  {t('security.footer_link')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink to="/pricing" className="hover:text-ghost-green transition-colors">
                  {t('nav.pricing')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink to="/confidentialite" className="hover:text-ghost-green transition-colors">
                  {t('footer.privacy_btn')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink to="/mentions-legales" className="hover:text-ghost-green transition-colors">
                  {t('footer.legal_btn')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink to="/cgv" className="hover:text-ghost-green transition-colors">
                  {t('footer.cgv_btn')}
                </LocaleLink>
              </li>
              <li>
                <LocaleLink to="/cgu" className="hover:text-ghost-green transition-colors">
                  {t('footer.cgu_btn')}
                </LocaleLink>
              </li>
            </ul>
          </div>

          {/* Colonne 2 — Blog */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
              <LocaleLink to="/blog" className="hover:text-ghost-green transition-colors">
                {t('blog.section_title')}
              </LocaleLink>
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
                  <LocaleLink
                    to={`/blog/${slug}`}
                    className="hover:text-ghost-green transition-colors"
                  >
                    {t(`blog.posts.${slug}.title`)}
                  </LocaleLink>
                </li>
              ))}
              <li>
                <LocaleLink
                  to="/blog"
                  className="text-ghost-green/80 hover:text-ghost-green transition-colors"
                >
                  {t('footer.blog_index')} →
                </LocaleLink>
              </li>
            </ul>
          </div>

          {/* Colonne 3 — Outils IA (maillage SEO des landings /tools) */}
          <div className="sm:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white/60 mb-3">
              <LocaleLink to="/tools" className="hover:text-ghost-green transition-colors">
                {t('footer.tools_title')}
              </LocaleLink>
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground">
              {TOOLS.map(tool => (
                <li key={tool.slug}>
                  <LocaleLink
                    to={`/tools/${tool.slug}`}
                    className="hover:text-ghost-green transition-colors"
                  >
                    {tool[lang].h1}
                  </LocaleLink>
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
  );
}

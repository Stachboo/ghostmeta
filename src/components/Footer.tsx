/**
 * GhostMeta Footer (Internationalized)
 * ────────────────────────────────────
 * Mentions légales et confidentialité dynamiques (FR/EN).
 */

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GhostLogo from './GhostLogo';
import { useTranslation } from 'react-i18next';

const TRUST_BADGES = [
  {
    src: 'https://img.shields.io/mozilla-observatory/grade-score/www.ghostmeta.online?publish&label=Mozilla%20Observatory',
    alt: 'Mozilla Observatory',
    href: 'https://developer.mozilla.org/en-US/observatory/analyze?host=www.ghostmeta.online',
  },
  {
    src: 'https://img.shields.io/badge/Security%20Headers-A-brightgreen?logo=shield&logoColor=white',
    alt: 'Security Headers A',
    href: 'https://securityheaders.com/?q=www.ghostmeta.online&followRedirects=on',
  },
  {
    src: 'https://img.shields.io/badge/SSL%20Labs-A%2B-brightgreen?logo=letsencrypt&logoColor=white',
    alt: 'SSL Labs A+',
    href: 'https://www.ssllabs.com/ssltest/analyze.html?d=www.ghostmeta.online',
  },
  {
    src: 'https://img.shields.io/badge/Traitement-100%25%20Client%20Side-blueviolet?logo=javascript&logoColor=white',
    alt: '100% Client Side',
  },
  {
    src: 'https://img.shields.io/badge/RGPD-Conforme-blue?logo=european-union&logoColor=white',
    alt: 'RGPD Conforme',
  },
] as const;

export default function Footer() {
  const { t } = useTranslation();
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
          {/* Badges de confiance */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            {TRUST_BADGES.map((badge) =>
              badge.href ? (
                <a
                  key={badge.alt}
                  href={badge.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={badge.src}
                    alt={badge.alt}
                    loading="lazy"
                    className="h-5"
                  />
                </a>
              ) : (
                <img
                  key={badge.alt}
                  src={badge.src}
                  alt={badge.alt}
                  loading="lazy"
                  className="h-5"
                />
              )
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <GhostLogo size={24} />
              <span className="text-sm text-muted-foreground">
                GhostMeta © {new Date().getFullYear()} — {t('footer.rights')}
              </span>
            </div>
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <button
                onClick={() => setShowPrivacy(true)}
                className="hover:text-[#00ff41] transition-colors"
              >
                {t('footer.privacy_btn')}
              </button>
              <button
                onClick={() => setShowLegal(true)}
                className="hover:text-[#00ff41] transition-colors"
              >
                {t('footer.legal_btn')}
              </button>
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

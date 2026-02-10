/**
 * GhostMeta Footer (Internationalized)
 * ────────────────────────────────────
 * Mentions légales et confidentialité dynamiques (FR/EN).
 */

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import GhostLogo from './GhostLogo';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  const [showLegal, setShowLegal] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <>
      <footer className="border-t border-border/30 mt-20 py-8">
        <div className="container">
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

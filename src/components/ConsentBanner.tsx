/**
 * SEC-018 : Bandeau de consentement RGPD pour Vercel Analytics.
 *
 * Barre discrète en bas de page. Le choix est stocké dans localStorage
 * sous la clé `ghostmeta-analytics-consent`. Le composant parent (App.tsx)
 * écoute l'événement `consent-changed` pour conditionner <Analytics />.
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const CONSENT_KEY = 'ghostmeta-analytics-consent';

export default function ConsentBanner() {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (!consent) {
      setShow(true);
      // Slide-in sur le prochain frame pour déclencher la transition CSS
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true));
      });
    }
  }, []);

  const handleChoice = (choice: 'accepted' | 'refused') => {
    setAnimateIn(false);
    setTimeout(() => {
      localStorage.setItem(CONSENT_KEY, choice);
      window.dispatchEvent(new Event('consent-changed'));
      setShow(false);
    }, 300);
  };

  const openPrivacy = () => {
    window.dispatchEvent(new Event('open-privacy-policy'));
  };

  if (!show) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        animateIn ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-[#0a0a0c]/95 backdrop-blur-md border-t border-border/30 px-4 py-3 sm:px-6">
        <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex-1 text-xs text-muted-foreground leading-relaxed m-0">
            {t('consent.text')}
            {' '}
            <button
              onClick={openPrivacy}
              className="text-[#00ff41]/70 hover:text-[#00ff41] underline underline-offset-2 transition-colors"
            >
              {t('consent.learn_more')}
            </button>
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleChoice('refused')}
              className="px-3 py-1.5 text-xs text-muted-foreground border border-border/50 rounded-md hover:border-border hover:text-foreground transition-colors"
            >
              {t('consent.refuse')}
            </button>
            <button
              onClick={() => handleChoice('accepted')}
              className="px-3 py-1.5 text-xs font-medium text-black bg-[#00ff41] rounded-md hover:bg-[#00dd38] transition-colors"
            >
              {t('consent.accept')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

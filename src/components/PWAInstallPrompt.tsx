/**
 * PWAInstallPrompt — Bottom bar d'installation PWA
 * ──────────────────────────────────────────────────
 * - Toujours affiché sur mobile après 5s (non-standalone, non-refusé)
 * - Android/Chrome : si beforeinstallprompt capturé → install natif 1-clic
 *                    sinon → guide manuel (⋮ → Ajouter à l'écran d'accueil)
 * - iOS Safari     : guide manuel (Partager → Sur l'écran d'accueil)
 * - Mémorise le refus en localStorage (clé ghostmeta_pwa_dismissed_v2)
 * - Apparaît après 5s avec animation slide-up (Framer Motion)
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GhostLogo from './GhostLogo';

const DISMISSED_KEY = 'ghostmeta_pwa_dismissed_v2';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function isIOS(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window as any).MSStream;
}

function isStandalone(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches
    || (navigator as any).standalone === true;
}

function isMobile(): boolean {
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);
}

export default function PWAInstallPrompt() {
  const [visible, setVisible] = useState(false);
  const [isIOSDevice, setIsIOSDevice] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Ne pas afficher si déjà installé ou déjà refusé
    if (isStandalone() || localStorage.getItem(DISMISSED_KEY)) return;
    // Ne pas afficher sur desktop
    if (!isMobile()) return;

    const ios = isIOS();
    setIsIOSDevice(ios);

    if (!ios) {
      // Récupérer l'event pré-capturé par le script inline dans index.html
      const precaptured = (window as any).__pwaPromptEvent as BeforeInstallPromptEvent | null;
      if (precaptured) {
        deferredPrompt.current = precaptured;
        (window as any).__pwaPromptEvent = null;
      }

      // Continuer à écouter au cas où l'event arrive après le mount
      const handler = (e: Event) => {
        e.preventDefault();
        deferredPrompt.current = e as BeforeInstallPromptEvent;
      };
      window.addEventListener('beforeinstallprompt', handler);

      // Afficher le banner dans TOUS les cas après 5s
      const timer = setTimeout(() => setVisible(true), 5000);
      return () => {
        window.removeEventListener('beforeinstallprompt', handler);
        clearTimeout(timer);
      };
    } else {
      // iOS : afficher après 5s
      const timer = setTimeout(() => setVisible(true), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
    setShowIOSGuide(false);
    setShowAndroidGuide(false);
  }

  async function handleInstall() {
    if (isIOSDevice) {
      setShowIOSGuide(true);
      return;
    }
    if (deferredPrompt.current) {
      // Install natif Chrome 1-clic
      await deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === 'accepted') dismiss();
      deferredPrompt.current = null;
    } else {
      // Pas d'event natif → guide manuel Android
      setShowAndroidGuide(true);
    }
  }

  return (
    <>
      {/* Bottom Bar */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 220 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9999,
              background: 'rgba(10, 10, 12, 0.92)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              borderTop: '1px solid rgba(0, 255, 65, 0.22)',
              boxShadow: '0 -4px 32px rgba(0, 255, 65, 0.08)',
            }}
          >
            {/* Ligne lumineuse en haut */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: '10%',
                right: '10%',
                height: '1px',
                background: 'linear-gradient(90deg, transparent, #00ff41 40%, #00c8ff 60%, transparent)',
                opacity: 0.6,
              }}
            />

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px 20px',
                maxWidth: '680px',
                margin: '0 auto',
              }}
            >
              {/* Ghost logo */}
              <div style={{ flexShrink: 0 }}>
                <GhostLogo size={36} glow />
              </div>

              {/* Texte */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    fontWeight: 700,
                    letterSpacing: '0.03em',
                    color: '#e5e7eb',
                  }}
                >
                  Installer GhostMeta
                </p>
                <p
                  style={{
                    margin: 0,
                    fontSize: '11px',
                    color: 'rgba(0, 255, 65, 0.7)',
                    fontFamily: 'monospace',
                    letterSpacing: '0.04em',
                  }}
                >
                  {isIOSDevice ? 'Accès rapide depuis ton écran d\'accueil' : 'Accès rapide · Fonctionne hors-ligne'}
                </p>
              </div>

              {/* Bouton Installer */}
              <button
                onClick={handleInstall}
                style={{
                  flexShrink: 0,
                  padding: '7px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.05em',
                  background: 'linear-gradient(135deg, #00ff41, #00c8ff)',
                  color: '#0a0a0c',
                  boxShadow: '0 0 12px rgba(0, 255, 65, 0.35)',
                  transition: 'opacity 0.2s, transform 0.15s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                + Installer
              </button>

              {/* Fermer */}
              <button
                onClick={dismiss}
                aria-label="Fermer"
                style={{
                  flexShrink: 0,
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px',
                  color: 'rgba(255,255,255,0.45)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 0.2s, border-color 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#ff4444';
                  e.currentTarget.style.borderColor = 'rgba(255,68,68,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* iOS Guide Modal */}
      <AnimatePresence>
        {showIOSGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '0 16px 16px',
            }}
            onClick={e => { if (e.target === e.currentTarget) setShowIOSGuide(false); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              style={{
                width: '100%',
                maxWidth: '480px',
                margin: '0 auto',
                background: 'rgba(15, 17, 22, 0.97)',
                border: '1px solid rgba(0, 255, 65, 0.2)',
                borderRadius: '16px',
                padding: '24px 20px 20px',
                boxShadow: '0 -8px 40px rgba(0, 255, 65, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <GhostLogo size={28} glow />
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#e5e7eb' }}>
                  Installer sur iOS
                </span>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  style={{
                    marginLeft: 'auto',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  ✕
                </button>
              </div>

              {[
                { step: '1', icon: '⬆️', text: 'Appuie sur le bouton Partager dans Safari' },
                { step: '2', icon: '📲', text: 'Fais défiler et sélectionne « Sur l\'écran d\'accueil »' },
                { step: '3', icon: '✅', text: 'Appuie sur « Ajouter » en haut à droite' },
              ].map(({ step, icon, text }) => (
                <div
                  key={step}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: step !== '3' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(0, 255, 65, 0.12)',
                      border: '1px solid rgba(0, 255, 65, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#00ff41',
                      flexShrink: 0,
                    }}
                  >
                    {step}
                  </div>
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                    {icon} {text}
                  </span>
                </div>
              ))}

              <button
                onClick={dismiss}
                style={{
                  marginTop: '18px',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 255, 65, 0.2)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                }}
              >
                Ne plus afficher
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Android Guide Modal */}
      <AnimatePresence>
        {showAndroidGuide && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10000,
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'flex-end',
              padding: '0 16px 16px',
            }}
            onClick={e => { if (e.target === e.currentTarget) setShowAndroidGuide(false); }}
          >
            <motion.div
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 60, opacity: 0 }}
              transition={{ type: 'spring', damping: 24, stiffness: 260 }}
              style={{
                width: '100%',
                maxWidth: '480px',
                margin: '0 auto',
                background: 'rgba(15, 17, 22, 0.97)',
                border: '1px solid rgba(0, 255, 65, 0.2)',
                borderRadius: '16px',
                padding: '24px 20px 20px',
                boxShadow: '0 -8px 40px rgba(0, 255, 65, 0.1)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <GhostLogo size={28} glow />
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#e5e7eb' }}>
                  Installer sur Android
                </span>
                <button
                  onClick={() => setShowAndroidGuide(false)}
                  style={{
                    marginLeft: 'auto',
                    background: 'transparent',
                    border: 'none',
                    color: 'rgba(255,255,255,0.4)',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  ✕
                </button>
              </div>

              {[
                { step: '1', icon: '⋮', text: 'Appuie sur les 3 points en haut à droite dans Chrome' },
                { step: '2', icon: '📲', text: 'Sélectionne « Ajouter à l\'écran d\'accueil »' },
                { step: '3', icon: '✅', text: 'Appuie sur « Ajouter » pour confirmer' },
              ].map(({ step, icon, text }) => (
                <div
                  key={step}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 0',
                    borderBottom: step !== '3' ? '1px solid rgba(255,255,255,0.06)' : 'none',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'rgba(0, 255, 65, 0.12)',
                      border: '1px solid rgba(0, 255, 65, 0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#00ff41',
                      flexShrink: 0,
                    }}
                  >
                    {step}
                  </div>
                  <span style={{ fontSize: '13px', color: '#9ca3af' }}>
                    {icon} {text}
                  </span>
                </div>
              ))}

              <button
                onClick={dismiss}
                style={{
                  marginTop: '18px',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '8px',
                  border: '1px solid rgba(0, 255, 65, 0.2)',
                  background: 'transparent',
                  color: 'rgba(255,255,255,0.5)',
                  cursor: 'pointer',
                  fontSize: '12px',
                  letterSpacing: '0.05em',
                }}
              >
                Ne plus afficher
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

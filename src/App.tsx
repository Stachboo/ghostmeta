import { Suspense, lazy, useLayoutEffect, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import ErrorBoundary from './components/ErrorBoundary';
import PWAInstallPrompt from './components/PWAInstallPrompt';
import ConsentBanner from './components/ConsentBanner';

// Imports dynamiques (Optimisation pour charger le site vite)
const Home = lazy(() => import('./pages/Home'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const PricingPage = lazy(() => import('./pages/PricingPage'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * HideLoader — Masque le loader HTML uniquement après que React
 * a résolu le lazy chunk et est prêt à rendre le contenu réel.
 * useLayoutEffect s'exécute de manière synchrone après le DOM paint
 * → transition invisible entre loader HTML et contenu React.
 */
function HideLoader() {
  useLayoutEffect(() => {
    const loader = document.getElementById('global-loader');
    if (loader) {
      loader.classList.add('loader-hidden');
    }
  }, []);

  return null;
}

/**
 * LoadingFallback — Affiché par Suspense pendant la résolution du chunk.
 * Design cohérent avec le loader HTML (#0a0a0c / #00ff41) pour éviter
 * tout flash visuel pendant la fenêtre de chargement.
 */
function LoadingFallback() {
  return (
    <div
      style={{ backgroundColor: '#0a0a0c' }}
      className="min-h-screen flex flex-col items-center justify-center"
    >
      <div
        className="text-sm font-bold tracking-[4px] uppercase mb-5 animate-pulse"
        style={{ color: '#00ff41' }}
      >
        INITIALISATION...
      </div>
      <div className="w-[200px] h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: '#1f2937' }}>
        <div
          className="h-full rounded-full"
          style={{
            backgroundColor: '#00ff41',
            boxShadow: '0 0 10px #00ff41',
            animation: 'loading 1.5s infinite ease-in-out',
          }}
        />
      </div>
    </div>
  );
}

function App() {
  // SEC-018 : conditionner Vercel Analytics au consentement RGPD
  const [analyticsConsent, setAnalyticsConsent] = useState(() => {
    return localStorage.getItem('ghostmeta-analytics-consent') === 'accepted';
  });

  useEffect(() => {
    const handler = () => {
      setAnalyticsConsent(
        localStorage.getItem('ghostmeta-analytics-consent') === 'accepted'
      );
    };
    window.addEventListener('storage', handler);
    window.addEventListener('consent-changed', handler);
    return () => {
      window.removeEventListener('storage', handler);
      window.removeEventListener('consent-changed', handler);
    };
  }, []);

  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          {/*
           * HideLoader est rendu à l'intérieur de Suspense.
           * Il ne s'exécute que quand Suspense sort du mode "pending"
           * (i.e. le lazy chunk est résolu). Le loader HTML reste donc
           * visible exactement le temps nécessaire — ni plus, ni moins.
           */}
          <HideLoader />
          <Routes>
            {/* 1. La Page d'Accueil */}
            <Route path="/" element={<Home />} />

            {/* 2. Pricing Page */}
            <Route path="/pricing" element={<PricingPage />} />

            {/* 3. Le Blog (Route dynamique) */}
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* 4. Page 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      {/* PWA Install Prompt — hors Suspense pour ne pas bloquer sur le lazy loading */}
      <PWAInstallPrompt />

      {/* SEC-018 : bandeau RGPD */}
      <ConsentBanner />

      {/* Analytics — conditionné au consentement, hors ErrorBoundary */}
      {analyticsConsent && <Analytics />}
    </BrowserRouter>
  );
}

export default App;

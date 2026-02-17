import { Suspense, lazy, useLayoutEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import ErrorBoundary from './components/ErrorBoundary';

// Imports dynamiques (Optimisation pour charger le site vite)
const Home = lazy(() => import('./pages/Home'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
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




function App() {
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

            {/* 2. Le Blog (Route dynamique) */}
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* 3. Page 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>

      {/* Analytics — hors ErrorBoundary pour ne pas perdre les events en cas d'erreur */}
      <Analytics />
    </BrowserRouter>
  );
}

export default App;

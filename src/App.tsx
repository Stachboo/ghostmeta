import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

// Imports dynamiques (Optimisation pour charger le site vite)
const Home = lazy(() => import('./pages/Home'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="bg-[#0a0a0c] min-h-screen flex items-center justify-center text-[#00ff41]">Loading System...</div>}>
        <Routes>
          {/* 1. La Page d'Accueil (Le Tank) */}
          <Route path="/" element={<Home />} />
          
          {/* 2. Le Blog (Route dynamique pour tes 5 articles) */}
          <Route path="/blog/:slug" element={<BlogPost />} />

          {/* 3. Page 404 (Si l'utilisateur se perd) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      {/* Analytics pour suivre tes visiteurs */}
      <Analytics />
    </BrowserRouter>
  );
}

export default App;

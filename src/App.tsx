import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from '@vercel/analytics/react';

// Imports dynamiques
const Home = lazy(() => import('./pages/Home'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<div className="bg-[#0a0a0c] min-h-screen" />}>
          <Routes>
            {/* Page d'accueil */}
            <Route path="/" element={<Home />} />
            
            {/* Route du Blog (Gère tes 5 articles SEO) */}
            <Route path="/blog/:slug" element={<BlogPost />} />

            {/* Capture 404 (L'étoile est importante) */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <Analytics />
    </QueryClientProvider>
  );
}

export default App;

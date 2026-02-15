import { lazy, Suspense } from "react";
const BlogPage = lazy(() => import("./pages/BlogPage"));
import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';

const Home = lazy(() => import('./pages/Home'));
const NotFound = lazy(() => import('./pages/NotFound'));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="bg-[#0a0a0c] min-h-screen" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        <Route path="/blog/:slug" element={<Suspense fallback={<div>Loading...</div>}><BlogPage /></Suspense>} />
        </Routes>
      </Suspense>
      <Analytics />
    </BrowserRouter>
  );
}

export default App;

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Pricing from '@/components/Pricing';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';

export default function PricingPage() {
  const { t } = useTranslation();

  // Supprimer le bot-content injecté par le prerender
  useEffect(() => {
    document.getElementById('bot-content')?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <Helmet>
        <title>Tarifs GhostMeta | Image privacy &amp; AI fingerprint cleaner</title>
        <meta name="description" content="Gratuit pour usage personnel. Pro B2B pour créateurs, agences et revendeurs IA — strip C2PA + EXIF en batch, REST API, sans limite. 100% navigateur." />
        <link rel="canonical" href="https://www.ghostmeta.online/pricing" />
        <link rel="alternate" hrefLang="fr" href="https://www.ghostmeta.online/pricing" />
        <link rel="alternate" hrefLang="en" href="https://www.ghostmeta.online/pricing?lng=en" />
        <link rel="alternate" hrefLang="x-default" href="https://www.ghostmeta.online/pricing" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Tarifs GhostMeta | Free + Pro B2B" />
        <meta property="og:description" content="Gratuit pour usage personnel. Pro B2B pour créateurs IA, agences et revendeurs : batch unlimited, REST API, strip C2PA en masse." />
        <meta property="og:url" content="https://www.ghostmeta.online/pricing" />
        <meta property="og:image" content="https://www.ghostmeta.online/og-image-v2.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tarifs GhostMeta | Free + Pro B2B" />
        <meta name="twitter:description" content="Free for personal use. Pro B2B with REST API for creators, agencies & AI resellers." />
      </Helmet>
      <Header />
      <Breadcrumb items={[{ label: t('breadcrumb.pricing') }]} />

      {/* Main Content */}
      <main className="flex-1">
        <Pricing />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

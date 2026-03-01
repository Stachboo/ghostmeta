import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import Pricing from '@/components/Pricing';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';

export default function PricingPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <Helmet>
        <title>Tarifs GhostMeta | Nettoyeur Photo Gratuit pour Vendeurs</title>
        <meta name="description" content="GhostMeta est 100% gratuit. Nettoyez vos photos de métadonnées EXIF/GPS pour vendre en ligne en toute sécurité sur Vinted, Leboncoin et eBay." />
        <link rel="canonical" href="https://www.ghostmeta.online/pricing" />
        <link rel="alternate" hreflang="fr" href="https://www.ghostmeta.online/pricing" />
        <link rel="alternate" hreflang="en" href="https://www.ghostmeta.online/pricing?lng=en" />
        <link rel="alternate" hreflang="x-default" href="https://www.ghostmeta.online/pricing" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Tarifs GhostMeta | Nettoyeur Photo Gratuit" />
        <meta property="og:description" content="GhostMeta est 100% gratuit. Supprimez le GPS et les EXIF de vos photos avant de vendre sur Vinted ou Leboncoin." />
        <meta property="og:url" content="https://www.ghostmeta.online/pricing" />
        <meta property="og:image" content="https://www.ghostmeta.online/og-image-v2.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Tarifs GhostMeta | Nettoyeur Photo Gratuit" />
        <meta name="twitter:description" content="GhostMeta est 100% gratuit. Supprimez le GPS et les EXIF en 1 clic." />
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

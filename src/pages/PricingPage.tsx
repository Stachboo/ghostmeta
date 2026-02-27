import { Helmet } from 'react-helmet-async';
import Pricing from '@/components/Pricing';
import Footer from '@/components/Footer';
import GhostLogo from '@/components/GhostLogo';
import { Link } from 'react-router-dom';

export default function PricingPage() {
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
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="container h-16 flex items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <GhostLogo size={32} />
            <span className="font-bold text-white tracking-tight">
              Ghost<span className="text-[#00ff41]">Meta</span>
            </span>
          </Link>
          <Link 
            to="/" 
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Back to App
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Pricing />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { seoUrls, localeFromPath } from '@/lib/locale';
import Pricing from '@/components/Pricing';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';

export default function PricingPage() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const seo = seoUrls(pathname);
  const isEn = localeFromPath(pathname) === 'en';

  // Supprimer le bot-content injecté par le prerender
  useEffect(() => {
    document.getElementById('bot-content')?.remove();
  }, []);

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col">
      <Helmet>
        <title>
          {isEn
            ? 'Pricing GhostMeta | Image privacy & AI fingerprint cleaner'
            : 'Tarifs GhostMeta | Image privacy & AI fingerprint cleaner'}
        </title>
        <meta
          name="description"
          content={
            isEn
              ? 'Free for personal use. Pro B2B for AI creators, agencies and resellers: unlimited batch, REST API, bulk C2PA + EXIF stripping. 100% in-browser.'
              : 'Gratuit pour usage personnel. Pro B2B pour créateurs IA, agences et revendeurs : batch unlimited, REST API, strip C2PA + EXIF en masse. 100% navigateur.'
          }
        />
        <link rel="canonical" href={seo.canonical} />
        <link rel="alternate" hrefLang="fr" href={seo.fr} />
        <link rel="alternate" hrefLang="en" href={seo.en} />
        <link rel="alternate" hrefLang="x-default" href={seo.xDefault} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={isEn ? 'Pricing GhostMeta | Free + Pro B2B' : 'Tarifs GhostMeta | Free + Pro B2B'}
        />
        <meta
          property="og:description"
          content={
            isEn
              ? 'Free for personal use. Pro B2B for AI creators, agencies and resellers: unlimited batch, REST API, bulk C2PA + EXIF stripping.'
              : 'Gratuit pour usage personnel. Pro B2B pour créateurs IA, agences et revendeurs : batch unlimited, REST API, strip C2PA en masse.'
          }
        />
        <meta property="og:url" content={seo.canonical} />
        <meta property="og:image" content="https://www.ghostmeta.online/og-image-v2.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={isEn ? 'Pricing GhostMeta | Free + Pro B2B' : 'Tarifs GhostMeta | Free + Pro B2B'}
        />
        <meta
          name="twitter:description"
          content={
            isEn
              ? 'Free for personal use. Pro B2B with REST API for creators, agencies & AI resellers.'
              : 'Gratuit pour usage perso. Pro B2B avec API REST pour créateurs, agences & revendeurs IA.'
          }
        />
        {/* App.tsx retire les JSON-LD prérendus au mount : sans ce miroir
            runtime, /pricing perdrait son schema pour tout crawler qui
            exécute le JS. Doit rester aligné sur OFFERS (prerender.mjs). */}
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            '@id': `${seo.canonical}#product`,
            name: 'GhostMeta',
            url: seo.canonical,
            inLanguage: isEn ? 'en' : 'fr',
            brand: { '@type': 'Brand', name: 'GhostMeta' },
            isPartOf: { '@id': 'https://www.ghostmeta.online/#website' },
            offers: [
              { name: 'Standard', price: '0' },
              { name: 'Full Access', price: '5' },
              { name: 'Full Access (annuel)', price: '40' },
            ].map(o => ({
              '@type': 'Offer',
              name: o.name,
              price: o.price,
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
              url: seo.canonical,
            })),
          })}
        </script>
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

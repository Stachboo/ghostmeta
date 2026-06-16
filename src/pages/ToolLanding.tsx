import { useEffect } from 'react';
import { useParams, Navigate, useLocation } from 'react-router-dom';
import LocaleLink from '@/components/LocaleLink';
import { seoUrls, localePath, localeFromPath, ORIGIN } from '@/lib/locale';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ShieldCheck, Sparkles, Lock } from 'lucide-react';
import Header from '@/components/Header';
import Breadcrumb from '@/components/Breadcrumb';
import Footer from '@/components/Footer';
import landingsData from '@/data/landings.json';

interface LandingFAQ {
  q: string;
  a: string;
}

interface LandingLocale {
  title: string;
  description: string;
  h1: string;
  intro: string;
  wedge: string;
  faq: LandingFAQ[];
}

interface Landing {
  slug: string;
  generator: string;
  format: string;
  en: LandingLocale;
  fr: LandingLocale;
}

const ALL: readonly Landing[] = landingsData as Landing[];

export default function ToolLanding() {
  const { slug } = useParams<{ slug: string }>();
  const { i18n } = useTranslation();
  const lang: 'en' | 'fr' = i18n.language === 'en' ? 'en' : 'fr';

  useEffect(() => {
    document.getElementById('bot-content')?.remove();
    document
      .querySelectorAll('script[type="application/ld+json"][data-prerender="true"]')
      .forEach((node) => node.remove());
  }, []);

  const landing = ALL.find((l) => l.slug === slug);
  if (!landing) return <Navigate to="/404" replace />;

  const c = lang === 'en' ? landing.en : landing.fr;
  const otherLocale = lang === 'en' ? landing.fr : landing.en;
  const { pathname } = useLocation();
  const seo = seoUrls(pathname);
  const locale = localeFromPath(pathname);
  const canonical = seo.canonical;

  // Related: prefer same generator, fall back to "generic" landings
  const related = ALL
    .filter((l) => l.slug !== landing.slug)
    .sort((a, b) => {
      const aMatch = a.generator === landing.generator ? 0 : 1;
      const bMatch = b.generator === landing.generator ? 0 : 1;
      return aMatch - bMatch;
    })
    .slice(0, 3);

  const ctaLabel = lang === 'en' ? 'Open the tool' : "Ouvrir l'outil";
  const faqLabel = lang === 'en' ? 'FAQ' : 'FAQ';
  const relatedLabel = lang === 'en' ? 'Related tools' : 'Outils liés';
  const trustLabel1 = lang === 'en' ? 'In-browser' : 'Navigateur';
  const trustLabel2 = lang === 'en' ? 'No upload' : 'Sans upload';
  const trustLabel3 = lang === 'en' ? 'C2PA aware' : 'Compatible C2PA';

  return (
    <div className="min-h-screen bg-ghost-dark text-white flex flex-col">
      <Helmet>
        <title>{c.title}</title>
        <meta name="description" content={c.description} />
        <meta name="keywords" content={`${c.wedge}, ${otherLocale.wedge}, C2PA, Content Credentials, GhostMeta`} />
        <link rel="canonical" href={seo.canonical} />
        <link rel="alternate" hrefLang="fr" href={seo.fr} />
        <link rel="alternate" hrefLang="en" href={seo.en} />
        <link rel="alternate" hrefLang="x-default" href={seo.xDefault} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GhostMeta" />
        <meta property="og:title" content={c.title} />
        <meta property="og:description" content={c.description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content="https://www.ghostmeta.online/og-image-v2.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content={lang === 'en' ? 'en_US' : 'fr_FR'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={c.title} />
        <meta name="twitter:description" content={c.description} />
        <meta name="twitter:image" content="https://www.ghostmeta.online/og-image-v2.jpg" />
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: c.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          '@id': canonical,
          url: canonical,
          name: c.title,
          description: c.description,
          inLanguage: lang === 'en' ? 'en' : 'fr',
          isPartOf: { '@id': 'https://www.ghostmeta.online/#website' },
          breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
              { '@type': 'ListItem', position: 1, name: 'Home', item: `${ORIGIN}${localePath('/', locale)}` },
              { '@type': 'ListItem', position: 2, name: 'Tools', item: `${ORIGIN}${localePath('/tools', locale)}` },
              { '@type': 'ListItem', position: 3, name: c.h1, item: canonical },
            ],
          },
        })}</script>
      </Helmet>

      <Header />
      <Breadcrumb items={[{ label: lang === 'en' ? 'Tools' : 'Outils', to: '/tools' }, { label: c.h1 }]} />

      <main className="flex-1">
        <section className="container max-w-4xl py-12 md:py-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-ghost-green/30 bg-ghost-green/10 text-ghost-green text-xs font-mono uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            {landing.generator === 'generic' ? 'AI image privacy' : landing.generator}
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">{c.h1}</h1>
          <p className="text-lg text-white/80 leading-relaxed mb-8">{c.intro}</p>

          <div className="flex flex-wrap items-center gap-3 mb-10">
            <LocaleLink
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-ghost-green text-black font-semibold hover:bg-ghost-green/90 transition-colors"
            >
              {ctaLabel}
              <ArrowRight className="w-4 h-4" />
            </LocaleLink>
            <LocaleLink
              to="/pricing"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-white/15 hover:border-white/30 transition-colors text-white/90"
            >
              {lang === 'en' ? 'Pricing' : 'Tarifs'}
            </LocaleLink>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-12">
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-sm">
              <ShieldCheck className="w-4 h-4 text-ghost-green flex-shrink-0" />
              <span>{trustLabel1}</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-sm">
              <Lock className="w-4 h-4 text-ghost-green flex-shrink-0" />
              <span>{trustLabel2}</span>
            </div>
            <div className="flex items-center gap-2.5 px-4 py-3 rounded-lg border border-white/10 bg-white/5 text-sm">
              <Sparkles className="w-4 h-4 text-ghost-green flex-shrink-0" />
              <span>{trustLabel3}</span>
            </div>
          </div>
        </section>

        <section className="container max-w-4xl py-8 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-8">{faqLabel}</h2>
          <div className="space-y-6">
            {c.faq.map((f, i) => (
              <div key={i} className="border border-white/10 rounded-lg p-5 bg-white/5">
                <h3 className="font-semibold text-base mb-2 text-white">{f.q}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container max-w-4xl py-12 border-t border-white/10">
          <h2 className="text-2xl font-bold mb-6">{relatedLabel}</h2>
          <ul className="grid md:grid-cols-3 gap-4">
            {related.map((r) => {
              const rc = lang === 'en' ? r.en : r.fr;
              return (
                <li key={r.slug}>
                  <LocaleLink
                    to={`/tools/${r.slug}`}
                    className="block p-5 border border-white/10 rounded-lg hover:border-ghost-green/50 hover:bg-white/5 transition-colors h-full"
                  >
                    <div className="text-xs font-mono text-ghost-green uppercase tracking-wider mb-2">
                      {r.generator === 'generic' ? 'AI privacy' : r.generator}
                    </div>
                    <div className="font-semibold text-sm text-white">{rc.h1}</div>
                  </LocaleLink>
                </li>
              );
            })}
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
}

/**
 * ToolsIndex — Page hub des landings /tools
 * ──────────────────────────────────────────
 * Liste les 13 outils de confidentialité image IA et distribue le maillage
 * interne vers chaque /tools/:slug (corrige les pages orphelines).
 * Le prerender génère dist/tools/index.html avec des <a> visibles aux crawlers ;
 * React retire #bot-content au mount.
 */

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LocaleLink from "@/components/LocaleLink";
import { seoUrls, localePath, localeFromPath, ORIGIN } from "@/lib/locale";
import landingsData from "@/data/landings.json";

type ToolLocale = { title: string; description: string; h1: string; wedge: string };
type Tool = { slug: string; generator: string; en: ToolLocale; fr: ToolLocale };
const TOOLS = landingsData as unknown as Tool[];

export default function ToolsIndex() {
  const { i18n } = useTranslation();
  const lang: "en" | "fr" = i18n.language === "en" ? "en" : "fr";
  const isEn = lang === "en";

  // Supprimer le bot-content injecté par le prerender
  useEffect(() => {
    document.getElementById("bot-content")?.remove();
  }, []);

  const { pathname } = useLocation();
  const seo = seoUrls(pathname);
  const locale = localeFromPath(pathname);
  const canonicalUrl = seo.canonical;
  const title = isEn
    ? "AI Image Privacy Tools — Strip C2PA, Metadata & Watermarks"
    : "Outils confidentialité image IA — Strip C2PA, métadonnées & watermarks";
  const description = isEn
    ? "13 free in-browser tools to remove C2PA Content Credentials, EXIF/GPS and AI fingerprints from Sora, Midjourney, DALL-E, ChatGPT, Firefly, Flux and more. No upload, no signup."
    : "13 outils gratuits en navigateur pour retirer les Content Credentials C2PA, l'EXIF/GPS et les empreintes IA de Sora, Midjourney, DALL-E, ChatGPT, Firefly, Flux et plus. Sans upload.";

  return (
    <div className="min-h-screen bg-ghost-dark text-foreground font-sans">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={seo.canonical} />
        <link rel="alternate" hrefLang="fr" href={seo.fr} />
        <link rel="alternate" hrefLang="en" href={seo.en} />
        <link rel="alternate" hrefLang="x-default" href={seo.xDefault} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:image"
          content="https://www.ghostmeta.online/og-image-v2.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "@id": canonicalUrl,
            url: canonicalUrl,
            name: title,
            description,
            inLanguage: isEn ? "en" : "fr",
            isPartOf: { "@id": "https://www.ghostmeta.online/#website" },
            mainEntity: {
              "@type": "ItemList",
              itemListElement: TOOLS.map((tool, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: tool[lang].h1,
                url: `${ORIGIN}${localePath(`/tools/${tool.slug}`, locale)}`,
              })),
            },
          })}
        </script>
      </Helmet>

      <Header />

      <main className="container max-w-5xl py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Heading */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-ghost-green">
              <Sparkles className="w-3 h-3" /> {isEn ? "AI Tools" : "Outils IA"}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              {isEn ? "AI Image Privacy " : "Confidentialité image "}
              <span className="text-ghost-green">{isEn ? "Tools" : "IA"}</span>
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
          </div>

          {/* Tools grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool, index) => {
              const c = tool[lang];
              return (
                <motion.div
                  key={tool.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <LocaleLink
                    to={`/tools/${tool.slug}`}
                    className="block h-full p-6 rounded-xl bg-white/[0.02] border border-zinc-800 hover:border-ghost-green/50 transition-all duration-300 group"
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-ghost-green/70 mb-2">
                      {tool.generator === "generic" ? "AI privacy" : tool.generator}
                    </div>
                    <h2 className="font-bold text-white text-base mb-2 group-hover:text-ghost-green transition-colors">
                      {c.h1}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {c.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-ghost-green group-hover:gap-2 transition-all">
                      {isEn ? "Open tool" : "Ouvrir l'outil"}
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </LocaleLink>
                </motion.div>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center pt-8 border-t border-zinc-800">
            <LocaleLink
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-black bg-ghost-green rounded-full hover:bg-ghost-green-hover transition-all duration-300"
            >
              {isEn ? "Clean your image now" : "Nettoyez votre image maintenant"}
              <ArrowRight className="w-4 h-4" />
            </LocaleLink>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

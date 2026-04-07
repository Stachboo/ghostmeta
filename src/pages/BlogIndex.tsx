import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const BLOG_SLUGS = [
  "vinted-securite-photo-guide",
  "supprimer-exif-iphone-android",
  "comprendre-donnees-exif-gps",
  "nettoyage-photo-local-vs-cloud",
  "ghostmeta-manifeste-confidentialite",
];

export default function BlogIndex() {
  const { t } = useTranslation();

  // Supprimer le bot-content injecté par le prerender
  useEffect(() => {
    document.getElementById("bot-content")?.remove();
  }, []);

  const canonicalUrl = "https://www.ghostmeta.online/blog";

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-foreground font-sans">
      <Helmet>
        <title>Blog GhostMeta | Guides Confidentialit&eacute; Photo</title>
        <meta
          name="description"
          content="Guides pratiques pour prot&eacute;ger votre vie priv&eacute;e en ligne : supprimer les m&eacute;tadonn&eacute;es EXIF, s&eacute;curiser vos photos Vinted, comprendre les donn&eacute;es GPS cach&eacute;es."
        />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="alternate" hrefLang="fr" href={canonicalUrl} />
        <link rel="alternate" hrefLang="en" href={`${canonicalUrl}?lng=en`} />
        <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Blog GhostMeta | Guides Confidentialit&eacute; Photo"
        />
        <meta
          property="og:description"
          content="Guides pratiques pour prot&eacute;ger votre vie priv&eacute;e en ligne : supprimer les m&eacute;tadonn&eacute;es EXIF, s&eacute;curiser vos photos Vinted."
        />
        <meta property="og:url" content={canonicalUrl} />
        <meta
          property="og:image"
          content="https://www.ghostmeta.online/og-image-v2.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Blog GhostMeta | Guides Confidentialit&eacute; Photo"
        />
        <meta
          name="twitter:description"
          content="Guides pratiques pour prot&eacute;ger votre vie priv&eacute;e en ligne."
        />
      </Helmet>

      <Header />

      <main className="container max-w-4xl py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Heading */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-[#00ff41]">
              <BookOpen className="w-3 h-3" /> Blog
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Guides{" "}
              <span className="text-[#00ff41]">Confidentialit&eacute;</span>{" "}
              Photo
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Conseils pratiques pour prot&eacute;ger votre vie priv&eacute;e
              en ligne et s&eacute;curiser vos photos avant de les publier.
            </p>
          </div>

          {/* Articles grid */}
          <div className="grid sm:grid-cols-2 gap-6">
            {BLOG_SLUGS.map((slug, index) => (
              <motion.div
                key={slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <Link
                  to={`/blog/${slug}`}
                  className="block h-full p-6 rounded-xl bg-white/[0.02] border border-zinc-800 hover:border-[#00ff41]/50 transition-all duration-300 group"
                >
                  <h2 className="font-bold text-white text-lg mb-2 group-hover:text-[#00ff41] transition-colors">
                    {t(`blog.posts.${slug}.title`)}
                  </h2>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {t(`blog.posts.${slug}.desc`)}
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-[#00ff41] group-hover:gap-2 transition-all">
                    Lire l&apos;article{" "}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center pt-8 border-t border-zinc-800">
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-black bg-[#00ff41] rounded-full hover:bg-[#00dd38] transition-all duration-300"
            >
              Prot&eacute;gez vos photos maintenant
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

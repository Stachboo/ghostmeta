/**
 * LegalPage — page générique de document légal (mentions légales, confidentialité,
 * CGV, CGU). Rend le Markdown source de `/legal-templates/*.md` via react-markdown.
 *
 * Route : /mentions-legales, /confidentialite, /cgv, /cgu (+ variantes /en).
 * SEO : `noindex` tant que les documents contiennent des `[À FOURNIR : …]`
 *       (versions de travail non encore validées par un juriste).
 * i18n : titres/descriptions via clés legal.pages.* ; corps en français (langue
 *        du contrat) avec une note de langue pour les visiteurs anglophones.
 */

import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import LocaleLink from "@/components/LocaleLink";
import Header from "@/components/Header";
import Breadcrumb from "@/components/Breadcrumb";
import Footer from "@/components/Footer";
import { seoUrls, localeFromPath } from "@/lib/locale";
import { legalMarkdown, LEGAL_DOC_KEYS, type LegalDocKey } from "@/content/legal";

interface LegalPageProps {
  doc: LegalDocKey;
}

export default function LegalPage({ doc }: LegalPageProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const seo = seoUrls(pathname);
  const locale = localeFromPath(pathname);

  const base = LEGAL_DOC_KEYS[doc];
  const title = t(`${base}.title`);
  const description = t(`${base}.description`);
  const md = legalMarkdown(doc);

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0c] text-white relative">
      <Helmet>
        <title>{`${title} — GhostMeta`}</title>
        <meta name="description" content={description} />
        {/* Versions de travail (placeholders [À FOURNIR]) → ne pas indexer */}
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href={seo.canonical} />
        <link rel="alternate" hrefLang="fr" href={seo.fr} />
        <link rel="alternate" hrefLang="en" href={seo.en} />
        <link rel="alternate" hrefLang="x-default" href={seo.xDefault} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="GhostMeta" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={seo.canonical} />
      </Helmet>

      <Header />
      <Breadcrumb items={[{ label: title }]} />

      <main className="flex-1 relative">
        <div className="container max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold mb-2">{title}</h1>

          {locale === "en" && (
            <p className="text-xs text-zinc-400 italic mb-6">
              {t("legal.lang_note")}
            </p>
          )}

          {/* Avertissement version de travail */}
          <div className="rounded-md border border-amber-500/30 bg-amber-500/5 px-4 py-3 mb-8 text-xs text-amber-200/80 leading-relaxed">
            {t("legal.draft_notice")}
          </div>

          <article
            className="
              text-sm text-zinc-300 leading-relaxed
              [&_h1]:hidden
              [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-3
              [&_h3]:text-base [&_h3]:font-semibold [&_h3]:text-white [&_h3]:mt-6 [&_h3]:mb-2
              [&_p]:my-3
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:space-y-1
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_ol]:space-y-1
              [&_a]:text-ghost-green [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-ghost-green/80
              [&_strong]:text-white
              [&_em]:text-zinc-400
              [&_code]:text-[0.8em] [&_code]:text-amber-300/90 [&_code]:bg-white/5 [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded
              [&_blockquote]:border-l-2 [&_blockquote]:border-ghost-green/40 [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:text-zinc-400
              [&_hr]:border-border/30 [&_hr]:my-8
              [&_table]:w-full [&_table]:my-4 [&_table]:text-xs [&_table]:border-collapse
              [&_th]:border [&_th]:border-border/40 [&_th]:bg-white/5 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left
              [&_td]:border [&_td]:border-border/30 [&_td]:px-2 [&_td]:py-1 [&_td]:align-top
            "
          >
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
          </article>

          <div className="mt-12 pt-6 border-t border-border/20 text-xs text-zinc-500">
            <LocaleLink to="/mentions-legales" className="hover:text-ghost-green mr-4">
              {t("footer.legal_btn")}
            </LocaleLink>
            <LocaleLink to="/confidentialite" className="hover:text-ghost-green mr-4">
              {t("footer.privacy_btn")}
            </LocaleLink>
            <LocaleLink to="/cgv" className="hover:text-ghost-green mr-4">
              {t("footer.cgv_btn")}
            </LocaleLink>
            <LocaleLink to="/cgu" className="hover:text-ghost-green">
              {t("footer.cgu_btn")}
            </LocaleLink>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

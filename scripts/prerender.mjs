/**
 * scripts/prerender.mjs — Prerendering bilingue (FR + EN), SANS navigateur
 *
 * Génère pour CHAQUE page une version FR (chemin nu) et une version EN (préfixe
 * /en) en HTML statique distinct : <html lang>, title/description/contenu
 * localisés, hreflang full-mesh (self-ref + return tags fr↔en + x-default→fr),
 * canonical self. Les liens internes du bot-content sont préfixés /en en anglais.
 *
 * Pour les bots (Bingbot, ChatGPT, Perplexity, ClaudeBot) : HTML statique réel.
 * Pour les utilisateurs : React hydrate et retire #bot-content au mount.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const ORIGIN = 'https://www.ghostmeta.online';

// Template Vite (avec chunks hashés)
const template = readFileSync(join(ROOT, 'dist', 'index.html'), 'utf-8');

// Traductions (source de vérité titres/desc/contenu)
const fr = JSON.parse(readFileSync(join(ROOT, 'src', 'locales', 'fr', 'translation.json'), 'utf-8'));
const en = JSON.parse(readFileSync(join(ROOT, 'src', 'locales', 'en', 'translation.json'), 'utf-8'));
const LOCALES = { fr, en };

// Landings programmatiques (FR + EN dans le même JSON)
const LANDINGS = JSON.parse(readFileSync(join(ROOT, 'src', 'data', 'landings.json'), 'utf-8'));

const get = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);
const escAttr = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Helpers de chemin localisé (FR = nu, EN = préfixe /en)
const LP = (lang, base) => (lang === 'en' ? (base === '/' ? '/en' : `/en${base}`) : base);
const urlFor = (lang, base) => `${ORIGIN}${LP(lang, base)}`;
const relFor = (lang, base) => {
  const p = LP(lang, base);
  return p === '/' ? 'dist/index.html' : `dist${p}/index.html`;
};

/**
 * Construit le HTML final pour une page dans une langue donnée.
 * hreflang full-mesh : self + fr + en + x-default(→fr). canonical = self.
 */
function buildHtml(lang, base, { title, description, ogType = 'website', bodyContent = '', jsonLd = null }) {
  let html = template;
  if (lang === 'en') html = html.replace('<html lang="fr">', '<html lang="en">');

  const frUrl = urlFor('fr', base);
  const enUrl = urlFor('en', base);
  const canonical = lang === 'en' ? enUrl : frUrl;

  const seoHead = [
    `<title>${escHtml(title)}</title>`,
    // data-rh="true" : marque ces balises comme "possédées" par react-helmet-async.
    // Au montage, Helmet remplace les [data-rh] existantes au lieu d'en ajouter une 2e
    // série → supprime les doublons canonical/description/hreflang vus par les crawlers
    // qui exécutent le JS (cf. audit SE Ranking 175207 : 46 pages canonical_multiple).
    `<meta name="description" content="${escAttr(description)}" data-rh="true">`,
    `<link rel="canonical" href="${escAttr(canonical)}" data-rh="true">`,
    `<link rel="alternate" hreflang="fr" href="${escAttr(frUrl)}" data-rh="true">`,
    `<link rel="alternate" hreflang="en" href="${escAttr(enUrl)}" data-rh="true">`,
    `<link rel="alternate" hreflang="x-default" href="${escAttr(frUrl)}" data-rh="true">`,
    `<meta property="og:type" content="${escAttr(ogType)}">`,
    `<meta property="og:title" content="${escAttr(title)}">`,
    `<meta property="og:description" content="${escAttr(description)}">`,
    `<meta property="og:url" content="${escAttr(canonical)}">`,
    `<meta property="og:locale" content="${lang === 'en' ? 'en_US' : 'fr_FR'}">`,
    `<meta property="og:image" content="${ORIGIN}/og-image-v2.jpg">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escAttr(title)}">`,
    `<meta name="twitter:description" content="${escAttr(description)}">`,
  ].join('\n  ');

  const jsonLdTag = jsonLd
    ? `\n  <script type="application/ld+json" data-prerender="true">${JSON.stringify(jsonLd)}</script>`
    : '';

  html = html.replace('</head>', `  ${seoHead}${jsonLdTag}\n</head>`);

  if (bodyContent) {
    const botDiv = `<div id="bot-content" style="display:none">${bodyContent}</div>\n  `;
    html = html.replace('<div id="root">', botDiv + '<div id="root">');
  }
  return html;
}

function saveHtml(relPath, html) {
  const fullPath = join(ROOT, relPath);
  const dir = join(fullPath, '..');
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  writeFileSync(fullPath, html, 'utf-8');
}

// ─── Strings hardcodées par langue (pages sans clés i18n dédiées) ──────────────
const T = {
  homeTitle: {
    fr: 'GhostMeta — Supprimer les métadonnées EXIF, GPS & C2PA de vos images',
    en: 'GhostMeta | Strip EXIF, GPS, C2PA & AI Watermarks — 100% Browser',
  },
  homeDesc: {
    fr: 'Supprimez EXIF, GPS, Content Credentials C2PA et empreintes IA de vos images. Compatible Sora, Midjourney, DALL-E, ChatGPT, Adobe Firefly. 100% navigateur, zéro upload.',
    en: 'Remove EXIF, GPS, C2PA Content Credentials and AI fingerprints from your images. Works with Sora, Midjourney, DALL-E, ChatGPT, Adobe Firefly. 100% in-browser, zero upload.',
  },
  pricingTitle: {
    fr: 'Tarifs GhostMeta | Image privacy & AI fingerprint cleaner',
    en: 'Pricing GhostMeta | Image privacy & AI fingerprint cleaner',
  },
  pricingDesc: {
    fr: 'Gratuit pour usage personnel. Pro B2B pour créateurs IA, agences et revendeurs : batch unlimited, REST API, strip C2PA + EXIF en masse. 100% navigateur.',
    en: 'Free for personal use. Pro B2B for AI creators, agencies and resellers: unlimited batch, REST API, bulk C2PA + EXIF stripping. 100% in-browser.',
  },
  pricingH1: {
    fr: 'Tarifs GhostMeta | Image privacy &amp; AI fingerprint cleaner',
    en: 'GhostMeta Pricing | Image privacy &amp; AI fingerprint cleaner',
  },
  blogTitle: {
    fr: 'Blog GhostMeta | Image privacy, EXIF/GPS & C2PA guides',
    en: 'GhostMeta Blog | Image privacy, EXIF/GPS & C2PA guides',
  },
  blogDesc: {
    fr: 'Guides pratiques pour protéger vos images : supprimer métadonnées EXIF/GPS, comprendre les Content Credentials C2PA, nettoyer les empreintes IA (Sora, Midjourney, DALL-E), sécuriser vos photos avant publication.',
    en: 'Practical guides to protect your images: remove EXIF/GPS metadata, understand C2PA Content Credentials, clean AI fingerprints (Sora, Midjourney, DALL-E), secure your photos before publishing.',
  },
  blogH1: {
    fr: 'Blog GhostMeta — Guides Confidentialité Photo',
    en: 'GhostMeta Blog — Photo Privacy Guides',
  },
  blogIntro: {
    fr: 'Conseils pratiques pour protéger votre vie privée en ligne et sécuriser vos photos avant de les publier.',
    en: 'Practical tips to protect your online privacy and secure your photos before publishing.',
  },
  toolsTitle: {
    fr: 'Outils confidentialité image IA — Strip C2PA, métadonnées & empreintes | GhostMeta',
    en: 'AI Image Privacy Tools — Strip C2PA, Metadata & Fingerprints | GhostMeta',
  },
  toolsDesc: {
    fr: "13 outils gratuits en navigateur pour retirer les Content Credentials C2PA, l'EXIF/GPS et les empreintes IA de Sora, Midjourney, DALL-E, ChatGPT, Firefly, Flux et plus. Sans upload.",
    en: '13 free in-browser tools to remove C2PA Content Credentials, EXIF/GPS and AI fingerprints from Sora, Midjourney, DALL-E, ChatGPT, Firefly, Flux and more. No upload.',
  },
  toolsH1: {
    fr: 'Outils confidentialité image IA — Strip C2PA, métadonnées &amp; empreintes',
    en: 'AI image privacy tools — strip C2PA, metadata &amp; fingerprints',
  },
  toolsIntro: {
    fr: "13 outils gratuits en navigateur pour retirer les Content Credentials C2PA, l'EXIF/GPS et les empreintes IA des images générées par Sora, Midjourney, DALL-E, ChatGPT, Firefly, Flux et plus. Sans upload.",
    en: '13 free in-browser tools to remove C2PA Content Credentials, EXIF/GPS and AI fingerprints from images generated by Sora, Midjourney, DALL-E, ChatGPT, Firefly, Flux and more. No upload.',
  },
};

const BLOG_DATES = {
  'vinted-securite-photo-guide': '2026-02-17',
  'supprimer-exif-iphone-android': '2026-03-11',
  'comprendre-donnees-exif-gps': '2026-04-02',
  'nettoyage-photo-local-vs-cloud': '2026-04-24',
  'ghostmeta-manifeste-confidentialite': '2026-05-19',
};
const SLUGS = Object.keys(BLOG_DATES);

// ─── Build ─────────────────────────────────────────────────────────────────────
console.log('\n[prerender] ─── Démarrage bilingue (FR + EN) ─────────────────');

let ok = 0;
let fail = 0;
const logLine = (p, out) => console.log(`[prerender] ✓  ${p.padEnd(40)} → ${out}`);
const errLine = (p, e) => { console.error(`[prerender] ✗  ${p}  —  ${e.message}`); fail++; };

function emit(lang, base, args) {
  try {
    saveHtml(relFor(lang, base), buildHtml(lang, base, args));
    logLine(LP(lang, base), relFor(lang, base)); ok++;
  } catch (e) { errLine(LP(lang, base), e); }
}

for (const lang of ['fr', 'en']) {
  const L = LOCALES[lang];
  const lp = (p) => LP(lang, p);

  // ── / ──
  {
    const h1 = `${escHtml(get(L, 'hero.title_start'))} ${escHtml(get(L, 'hero.title_color'))} ${escHtml(get(L, 'hero.title_end'))}`;
    const body = [
      `<h1>${h1}</h1>`,
      `<p>${escHtml(get(L, 'hero.subtitle'))}</p>`,
      `<h2>${escHtml(get(L, 'info.why_title'))} ${escHtml(get(L, 'info.why_title_highlight'))}</h2>`,
      `<p>${escHtml(get(L, 'info.why_desc'))}</p>`,
      `<h2>${escHtml(get(L, 'info.how_title'))} ${escHtml(get(L, 'info.how_highlight'))}</h2>`,
      `<p>${escHtml(get(L, 'info.how_subtitle'))}</p>`,
      `<h2>${escHtml(get(L, 'info.arch_title'))} ${escHtml(get(L, 'info.arch_highlight'))}</h2>`,
      `<p>${escHtml(get(L, 'info.arch_subtitle'))}</p>`,
      `<h2>${escHtml(get(L, 'info.faq_title'))}</h2>`,
    ].join('\n');

    // FAQ : 2-3 Q/R issues des clés info.qN/aN de la locale, sinon génériques
    const faqPairs = [];
    for (let i = 1; i <= 3; i++) {
      const q = get(L, `info.q${i}`);
      const a = get(L, `info.a${i}`);
      if (q && a) faqPairs.push({ q, a });
    }
    if (faqPairs.length === 0) {
      faqPairs.push(
        lang === 'en'
          ? {
              q: 'Are my photos uploaded to a server?',
              a: 'No. All EXIF, GPS and C2PA stripping happens locally in your browser. No image ever leaves your device.',
            }
          : {
              q: 'Mes photos sont-elles envoyées sur un serveur ?',
              a: "Non. La suppression EXIF, GPS et C2PA se fait localement dans votre navigateur. Aucune image ne quitte votre appareil.",
            }
      );
      faqPairs.push(
        lang === 'en'
          ? {
              q: 'What metadata does GhostMeta remove?',
              a: 'EXIF, GPS coordinates, IPTC, XMP and C2PA Content Credentials are all stripped from your images.',
            }
          : {
              q: 'Quelles métadonnées GhostMeta supprime-t-il ?',
              a: "L'EXIF, les coordonnées GPS, l'IPTC, le XMP et les Content Credentials C2PA sont tous retirés de vos images.",
            }
      );
    }

    const homeJsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': `${ORIGIN}/#website`,
          url: ORIGIN,
          name: 'GhostMeta',
          inLanguage: lang,
        },
        {
          '@type': ['WebApplication', 'SoftwareApplication'],
          '@id': `${urlFor(lang, '/')}#webapp`,
          name: 'GhostMeta',
          url: urlFor(lang, '/'),
          applicationCategory: ['SecurityApplication', 'UtilitiesApplication'],
          operatingSystem: 'Web browser',
          browserRequirements: 'Requires a modern browser with Canvas API support (Chrome, Firefox, Safari, Edge)',
          inLanguage: lang,
          isPartOf: { '@id': `${ORIGIN}/#website` },
          description:
            lang === 'en'
              ? 'GhostMeta strips image metadata (EXIF, IPTC, XMP, GPS) and the C2PA Content Credentials manifest (JUMBF) from JPEG and PNG files, 100% in your browser via canvas re-encoding — no upload, no server. It does NOT remove visible or invisible pixel watermarks (e.g. SynthID), does not process video, and cannot undo server-side soft-binding fingerprints.'
              : "GhostMeta retire les métadonnées image (EXIF, IPTC, XMP, GPS) et le manifest C2PA Content Credentials (JUMBF) des fichiers JPEG et PNG, 100% dans votre navigateur par ré-encodage canvas — sans upload, sans serveur. Il ne retire PAS les watermarks visibles ni invisibles au niveau pixel (ex. SynthID), ne traite pas la vidéo, et ne peut pas annuler les empreintes soft-binding côté serveur.",
          featureList:
            lang === 'en'
              ? [
                  'Strip EXIF, IPTC, XMP and GPS metadata',
                  'Remove C2PA Content Credentials manifest (JUMBF) from JPEG and PNG',
                  '100% in-browser processing via Canvas API (zero upload)',
                  'Batch processing with ZIP download',
                  'Threat classification of each metadata field (critical / warning / safe)',
                ]
              : [
                  'Suppression des métadonnées EXIF, IPTC, XMP et GPS',
                  'Retrait du manifest C2PA Content Credentials (JUMBF) sur JPEG et PNG',
                  'Traitement 100% navigateur via Canvas API (zéro upload)',
                  'Traitement par lot avec téléchargement ZIP',
                  'Classification des menaces par champ de métadonnée (critique / warning / safe)',
                ],
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description:
              lang === 'en'
                ? 'Free for personal use; Pro B2B plan for creators, agencies and resellers (unlimited batch, REST API).'
                : 'Gratuit pour usage personnel ; offre Pro B2B pour créateurs, agences et revendeurs (batch illimité, API REST).',
          },
        },
        {
          '@type': 'FAQPage',
          '@id': `${urlFor(lang, '/')}#faq`,
          inLanguage: lang,
          isPartOf: { '@id': `${ORIGIN}/#website` },
          mainEntity: faqPairs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        },
      ],
    };

    emit(lang, '/', {
      title: T.homeTitle[lang],
      description: T.homeDesc[lang],
      bodyContent: body,
      jsonLd: homeJsonLd,
    });
  }

  // ── /pricing ──
  {
    const body = [
      `<h1>${T.pricingH1[lang]}</h1>`,
      `<p>${escHtml(get(L, 'pro.subtitle'))}</p>`,
      `<h2>${escHtml(get(L, 'pro.free_title'))}</h2>`,
      `<p>${escHtml(get(L, 'pro.free_1'))}. ${escHtml(get(L, 'pro.free_2'))}. ${escHtml(get(L, 'pro.free_3'))}. ${escHtml(get(L, 'pro.free_4'))}.</p>`,
      `<h2>${escHtml(get(L, 'pro.pro_title'))}</h2>`,
      `<p>${escHtml(get(L, 'pro.pro_1'))}. ${escHtml(get(L, 'pro.pro_2'))}. ${escHtml(get(L, 'pro.pro_3'))}. ${escHtml(get(L, 'pro.pro_4'))}.</p>`,
    ].join('\n');
    emit(lang, '/pricing', { title: T.pricingTitle[lang], description: T.pricingDesc[lang], bodyContent: body });
  }

  // ── /blog (index) ──
  {
    const body = [
      `<h1>${escHtml(T.blogH1[lang])}</h1>`,
      `<p>${escHtml(T.blogIntro[lang])}</p>`,
      ...SLUGS.map((slug) => {
        const title = get(L, `blog.posts.${slug}.title`);
        const desc = get(L, `blog.posts.${slug}.desc`);
        return `<h2><a href="${lp(`/blog/${slug}`)}">${escHtml(title)}</a></h2><p>${escHtml(desc)}</p>`;
      }),
    ].join('\n');
    emit(lang, '/blog', { title: T.blogTitle[lang], description: T.blogDesc[lang], bodyContent: body });
  }

  // ── /blog/:slug ──
  for (const slug of SLUGS) {
    const title = get(L, `blog.posts.${slug}.title`);
    const desc = get(L, `blog.posts.${slug}.desc`);
    const content = get(L, `blog.posts.${slug}.content`) ?? '';
    if (!title) { errLine(LP(lang, `/blog/${slug}`), new Error('clé absente')); continue; }
    const canonical = urlFor(lang, `/blog/${slug}`);
    emit(lang, `/blog/${slug}`, {
      title: `${title} | GhostMeta`,
      description: desc,
      ogType: 'article',
      bodyContent: `<h1>${escHtml(title)}</h1><p>${escHtml(desc)}</p>${content}`,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: desc,
        inLanguage: lang,
        author: { '@type': 'Organization', name: 'GhostMeta Labs' },
        publisher: {
          '@type': 'Organization',
          name: 'GhostMeta Labs',
          logo: { '@type': 'ImageObject', url: `${ORIGIN}/icon-192.png` },
        },
        datePublished: BLOG_DATES[slug],
        dateModified: BLOG_DATES[slug],
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        image: { '@type': 'ImageObject', url: `${ORIGIN}/og-image-v2.jpg`, width: 1200, height: 630 },
      },
    });
  }

  // ── /securite ──
  {
    const secTitle = get(L, 'security.seo.title');
    const secDesc = get(L, 'security.seo.description');
    const body = [
      `<h1>${escHtml(get(L, 'security.h1.line1'))} ${escHtml(get(L, 'security.h1.line2'))} ${escHtml(get(L, 'security.h1.accent'))} ${escHtml(get(L, 'security.h1.line3'))}</h1>`,
      `<p>${escHtml(get(L, 'security.intro'))}</p>`,
      `<h2>${escHtml(get(L, 'security.s1.title'))}</h2>`,
      `<p>${escHtml(get(L, 'security.s1.p1'))}</p>`,
      `<p>${escHtml(get(L, 'security.s1.p2'))}</p>`,
      `<p>${escHtml(get(L, 'security.s1.p3'))}</p>`,
      `<h2>${escHtml(get(L, 'security.s2.title'))}</h2>`,
      `<p>${escHtml(get(L, 'security.s2.intro'))}</p>`,
      `<h2>${escHtml(get(L, 'security.s3.title'))}</h2>`,
      `<p>${escHtml(get(L, 'security.s3.intro'))}</p>`,
      `<h2>${escHtml(get(L, 'security.s4.title'))}</h2>`,
    ].join('\n');
    emit(lang, '/securite', {
      title: secTitle,
      description: secDesc,
      bodyContent: body,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': urlFor(lang, '/securite'),
        url: urlFor(lang, '/securite'),
        name: secTitle,
        description: secDesc,
        inLanguage: lang,
        isPartOf: { '@id': `${ORIGIN}/#website` },
      },
    });
  }

  // ── /tools (index hub) ──
  {
    const body = [
      `<h1>${T.toolsH1[lang]}</h1>`,
      `<p>${escHtml(T.toolsIntro[lang])}</p>`,
      ...LANDINGS.map((l) =>
        `<h2><a href="${lp(`/tools/${l.slug}`)}">${escHtml(l[lang].h1)}</a></h2><p>${escHtml(l[lang].description)}</p>`
      ),
    ].join('\n');
    emit(lang, '/tools', {
      title: T.toolsTitle[lang],
      description: T.toolsDesc[lang],
      bodyContent: body,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        '@id': urlFor(lang, '/tools'),
        url: urlFor(lang, '/tools'),
        name: T.toolsTitle[lang],
        description: T.toolsDesc[lang],
        inLanguage: lang,
        isPartOf: { '@id': `${ORIGIN}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          itemListElement: LANDINGS.map((l, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: l[lang].h1,
            url: urlFor(lang, `/tools/${l.slug}`),
          })),
        },
      },
    });
  }

  // ── /tools/:slug ──
  for (const l of LANDINGS) {
    const c = l[lang];
    const body = [
      `<h1>${escHtml(c.h1)}</h1>`,
      `<p>${escHtml(c.intro)}</p>`,
      `<h2>FAQ</h2>`,
      ...c.faq.map((f) => `<h3>${escHtml(f.q)}</h3><p>${escHtml(f.a)}</p>`),
    ].join('\n');
    emit(lang, `/tools/${l.slug}`, {
      title: c.title,
      description: c.description,
      bodyContent: body,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        inLanguage: lang,
        mainEntity: c.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    });
  }
}

// ── sitemap.xml (FR + EN, full-mesh) ───────────────────────────────────────────
try {
  const today = new Date().toISOString().slice(0, 10);
  const PAGES = [
    { base: '/', changefreq: 'daily', priority: '1.0' },
    { base: '/pricing', changefreq: 'monthly', priority: '0.7' },
    { base: '/securite', changefreq: 'monthly', priority: '0.8' },
    { base: '/blog', changefreq: 'weekly', priority: '0.7' },
    { base: '/tools', changefreq: 'weekly', priority: '0.8' },
    ...SLUGS.map((slug) => ({
      base: `/blog/${slug}`,
      changefreq: 'weekly',
      priority: slug === 'ghostmeta-manifeste-confidentialite' ? '0.6' : '0.8',
    })),
    ...LANDINGS.map((l) => ({ base: `/tools/${l.slug}`, changefreq: 'monthly', priority: '0.75' })),
  ];

  const entries = [];
  for (const { base, changefreq, priority } of PAGES) {
    const frU = urlFor('fr', base);
    const enU = urlFor('en', base);
    for (const loc of [frU, enU]) {
      entries.push([
        `  <url>`,
        `    <loc>${loc}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>${changefreq}</changefreq>`,
        `    <priority>${priority}</priority>`,
        `    <xhtml:link rel="alternate" hreflang="fr" href="${frU}"/>`,
        `    <xhtml:link rel="alternate" hreflang="en" href="${enU}"/>`,
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${frU}"/>`,
        `  </url>`,
      ].join('\n'));
    }
  }

  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`,
    ...entries,
    `</urlset>`,
    ``,
  ].join('\n');

  saveHtml('dist/sitemap.xml', xml);
  logLine('sitemap.xml', `dist/sitemap.xml (${entries.length} URLs, lastmod=${today})`); ok++;
} catch (e) { errLine('sitemap.xml', e); }

console.log(`\n[prerender] ─── Résultat : ${ok} OK, ${fail} erreur(s) ─────────────\n`);
process.exit(fail > 0 ? 1 : 0);

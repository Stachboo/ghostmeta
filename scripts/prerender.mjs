/**
 * scripts/prerender.mjs — Prerendering SANS navigateur
 *
 * Stratégie : injecter les balises SEO et le contenu article directement dans
 * dist/index.html (template Vite) pour chaque route du sitemap.
 *
 * Avantages vs Puppeteer :
 * - Zéro dépendance système (pas de libnspr4, libX11, etc.)
 * - Compatible Vercel, GitHub Actions, tout environnement Node.js
 * - 10× plus rapide (pas de démarrage navigateur)
 *
 * Pour les bots (Bingbot, ChatGPT, Perplexity, ClaudeBot) :
 * - Ils reçoivent le fichier HTML statique avec title, description, canonical, contenu réel
 *
 * Pour les utilisateurs :
 * - React hydrate et affiche l'appli normalement
 * - Le composant BlogPost.tsx supprime #bot-content au mount (pas de doublon)
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));

// Template de base : dist/index.html produit par Vite (avec les chunks hashés)
const template = readFileSync(join(ROOT, 'dist', 'index.html'), 'utf-8');

// Traductions françaises — source de vérité pour les titres, descriptions, contenu
const fr = JSON.parse(
  readFileSync(join(ROOT, 'src', 'locales', 'fr', 'translation.json'), 'utf-8')
);

// Accès à une clé pointée dans un objet imbriqué
const get = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj);

// Échapper les caractères spéciaux HTML pour les attributs et le texte
const escAttr = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escHtml = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/**
 * Construit le HTML final pour une route en injectant dans le template Vite :
 * 1. Les balises SEO dans <head>
 * 2. Le contenu textuel dans un div caché (pour les crawlers sans JS)
 */
function buildHtml({ title, description, canonical, hreflangEn, ogType = 'website', bodyContent = '', jsonLd = null }) {
  let html = template;

  // Balises SEO injectées avant </head>
  const seoHead = [
    `<title>${escHtml(title)}</title>`,
    `<meta name="description" content="${escAttr(description)}">`,
    `<link rel="canonical" href="${escAttr(canonical)}">`,
    `<link rel="alternate" hreflang="fr" href="${escAttr(canonical)}">`,
    `<link rel="alternate" hreflang="en" href="${escAttr(hreflangEn)}">`,
    `<link rel="alternate" hreflang="x-default" href="${escAttr(canonical)}">`,
    `<meta property="og:type" content="${escAttr(ogType)}">`,
    `<meta property="og:title" content="${escAttr(title)}">`,
    `<meta property="og:description" content="${escAttr(description)}">`,
    `<meta property="og:url" content="${escAttr(canonical)}">`,
    `<meta property="og:image" content="https://www.ghostmeta.online/og-image-v2.jpg">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${escAttr(title)}">`,
    `<meta name="twitter:description" content="${escAttr(description)}">`,
  ].join('\n  ');

  const jsonLdTag = jsonLd
    ? `\n  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`
    : '';

  html = html.replace('</head>', `  ${seoHead}${jsonLdTag}\n</head>`);

  // Contenu visible par défaut pour les crawlers (Bingbot ne rend pas le JS)
  // React supprime ce div au mount → pas de doublon pour les utilisateurs
  if (bodyContent) {
    const botDiv = `<div id="bot-content">${bodyContent}</div>\n  `;
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

// ─── Build ───────────────────────────────────────────────────────────────────

console.log('\n[prerender] ─── Démarrage (sans navigateur) ─────────────────');

let ok = 0;
let fail = 0;

const log = (path, out) => console.log(`[prerender] ✓  ${path.padEnd(52)} → ${out}`);
const err = (path, e)   => { console.error(`[prerender] ✗  ${path}  —  ${e.message}`); fail++; };

// ── / ────────────────────────────────────────────────────────────────────────
try {
  saveHtml('dist/index.html', buildHtml({
    title:       'GhostMeta | Nettoyeur Photo pour Vinted & Leboncoin (Gratuit)',
    description: 'Sécurisez vos ventes : supprimez immédiatement le GPS et les métadonnées cachées de vos photos Vinted, Leboncoin et eBay. Protection 100% locale et anonyme.',
    canonical:   'https://www.ghostmeta.online/',
    hreflangEn:  'https://www.ghostmeta.online/?lng=en',
  }));
  log('/', 'dist/index.html'); ok++;
} catch(e) { err('/', e); }

// ── /pricing ─────────────────────────────────────────────────────────────────
try {
  saveHtml('dist/pricing/index.html', buildHtml({
    title:       'Tarifs GhostMeta | Nettoyeur Photo Gratuit pour Vendeurs',
    description: 'GhostMeta est 100% gratuit. Nettoyez vos photos de métadonnées EXIF/GPS pour vendre en ligne en toute sécurité sur Vinted, Leboncoin et eBay.',
    canonical:   'https://www.ghostmeta.online/pricing',
    hreflangEn:  'https://www.ghostmeta.online/pricing?lng=en',
  }));
  log('/pricing', 'dist/pricing/index.html'); ok++;
} catch(e) { err('/pricing', e); }

// ── /blog/:slug ───────────────────────────────────────────────────────────────
const SLUGS = [
  'vinted-securite-photo-guide',
  'supprimer-exif-iphone-android',
  'comprendre-donnees-exif-gps',
  'nettoyage-photo-local-vs-cloud',
  'ghostmeta-manifeste-confidentialite',
];

for (const slug of SLUGS) {
  try {
    const title   = get(fr, `blog.posts.${slug}.title`);
    const desc    = get(fr, `blog.posts.${slug}.desc`);
    const content = get(fr, `blog.posts.${slug}.content`) ?? '';

    if (!title) throw new Error(`clé de traduction absente pour "${slug}"`);

    const canonical = `https://www.ghostmeta.online/blog/${slug}`;

    // bodyContent : titre + description + HTML de l'article (stocké en FR dans i18n)
    const bodyContent = `<h1>${escHtml(title)}</h1><p>${escHtml(desc)}</p>${content}`;

    saveHtml(`dist/blog/${slug}/index.html`, buildHtml({
      title:      `${title} | GhostMeta`,
      description: desc,
      canonical,
      hreflangEn: `${canonical}?lng=en`,
      ogType:     'article',
      bodyContent,
      jsonLd: {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: title,
        description: desc,
        author: { '@type': 'Organization', name: 'GhostMeta Labs' },
        publisher: {
          '@type': 'Organization',
          name: 'GhostMeta Labs',
          logo: { '@type': 'ImageObject', url: 'https://www.ghostmeta.online/icon-192.png' },
        },
        datePublished: '2026-02-20',
        dateModified: '2026-02-20',
        mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
        image: { '@type': 'ImageObject', url: 'https://www.ghostmeta.online/og-image-v2.jpg', width: 1200, height: 630 },
      },
    }));
    log(`/blog/${slug}`, `dist/blog/${slug}/index.html`); ok++;
  } catch(e) { err(`/blog/${slug}`, e); }
}

// ── /fr/securite ──────────────────────────────────────────────────────────────
try {
  const secTitle = get(fr, 'security.seo.title');
  const secDesc  = get(fr, 'security.seo.description');
  const secFaqItems = Array.from({ length: 5 }, (_, i) => ({
    q: get(fr, `security.faq.q${i + 1}`),
    a: get(fr, `security.faq.a${i + 1}`),
  }));
  const secBodyContent = [
    `<h1>${escHtml(get(fr, 'security.h1.line1'))} ${escHtml(get(fr, 'security.h1.line2'))} ${escHtml(get(fr, 'security.h1.accent'))} ${escHtml(get(fr, 'security.h1.line3'))}</h1>`,
    `<p>${escHtml(get(fr, 'security.intro'))}</p>`,
    `<h2>${escHtml(get(fr, 'security.s1.title'))}</h2>`,
    `<p>${escHtml(get(fr, 'security.s1.p1'))}</p>`,
    `<p>${escHtml(get(fr, 'security.s1.p2'))}</p>`,
    `<p>${escHtml(get(fr, 'security.s1.p3'))}</p>`,
    `<h2>${escHtml(get(fr, 'security.s2.title'))}</h2>`,
    `<p>${escHtml(get(fr, 'security.s2.intro'))}</p>`,
    `<h2>${escHtml(get(fr, 'security.s3.title'))}</h2>`,
    `<p>${escHtml(get(fr, 'security.s3.intro'))}</p>`,
    `<h2>${escHtml(get(fr, 'security.s4.title'))}</h2>`,
    `<h2>${escHtml(get(fr, 'security.faq.title'))}</h2>`,
    ...secFaqItems.map(item => `<h3>${escHtml(item.q)}</h3><p>${escHtml(item.a)}</p>`),
  ].join('\n');

  saveHtml('dist/fr/securite/index.html', buildHtml({
    title:       secTitle,
    description: secDesc,
    canonical:   'https://www.ghostmeta.online/fr/securite',
    hreflangEn:  'https://www.ghostmeta.online/en/security',
    bodyContent: secBodyContent,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://www.ghostmeta.online/fr/securite',
          url: 'https://www.ghostmeta.online/fr/securite',
          name: secTitle,
          description: secDesc,
          inLanguage: 'fr',
          isPartOf: { '@id': 'https://www.ghostmeta.online/#website' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: secFaqItems.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        },
      ],
    },
  }));
  log('/fr/securite', 'dist/fr/securite/index.html'); ok++;
} catch(e) { err('/fr/securite', e); }

// ── /en/security ─────────────────────────────────────────────────────────────
try {
  // Charger les traductions anglaises
  const en = JSON.parse(
    readFileSync(join(ROOT, 'src', 'locales', 'en', 'translation.json'), 'utf-8')
  );
  const secTitleEn = get(en, 'security.seo.title');
  const secDescEn  = get(en, 'security.seo.description');
  const secFaqItemsEn = Array.from({ length: 5 }, (_, i) => ({
    q: get(en, `security.faq.q${i + 1}`),
    a: get(en, `security.faq.a${i + 1}`),
  }));
  const secBodyContentEn = [
    `<h1>${escHtml(get(en, 'security.h1.line1'))} ${escHtml(get(en, 'security.h1.line2'))} ${escHtml(get(en, 'security.h1.accent'))} ${escHtml(get(en, 'security.h1.line3'))}</h1>`,
    `<p>${escHtml(get(en, 'security.intro'))}</p>`,
    `<h2>${escHtml(get(en, 'security.s1.title'))}</h2>`,
    `<p>${escHtml(get(en, 'security.s1.p1'))}</p>`,
    `<p>${escHtml(get(en, 'security.s1.p2'))}</p>`,
    `<p>${escHtml(get(en, 'security.s1.p3'))}</p>`,
    `<h2>${escHtml(get(en, 'security.s2.title'))}</h2>`,
    `<p>${escHtml(get(en, 'security.s2.intro'))}</p>`,
    `<h2>${escHtml(get(en, 'security.s3.title'))}</h2>`,
    `<p>${escHtml(get(en, 'security.s3.intro'))}</p>`,
    `<h2>${escHtml(get(en, 'security.s4.title'))}</h2>`,
    `<h2>${escHtml(get(en, 'security.faq.title'))}</h2>`,
    ...secFaqItemsEn.map(item => `<h3>${escHtml(item.q)}</h3><p>${escHtml(item.a)}</p>`),
  ].join('\n');

  saveHtml('dist/en/security/index.html', buildHtml({
    title:       secTitleEn,
    description: secDescEn,
    canonical:   'https://www.ghostmeta.online/en/security',
    hreflangEn:  'https://www.ghostmeta.online/en/security',
    bodyContent: secBodyContentEn,
    jsonLd: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': 'https://www.ghostmeta.online/en/security',
          url: 'https://www.ghostmeta.online/en/security',
          name: secTitleEn,
          description: secDescEn,
          inLanguage: 'en',
          isPartOf: { '@id': 'https://www.ghostmeta.online/#website' },
        },
        {
          '@type': 'FAQPage',
          mainEntity: secFaqItemsEn.map(item => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        },
      ],
    },
  }));
  log('/en/security', 'dist/en/security/index.html'); ok++;
} catch(e) { err('/en/security', e); }

console.log(`\n[prerender] ─── Résultat : ${ok} OK, ${fail} erreur(s) ─────────────\n`);
process.exit(fail > 0 ? 1 : 0);

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
 * - Le contenu #bot-content est caché (display:none)
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
function buildHtml({ title, description, canonical, hreflangEn, ogType = 'website', bodyContent = '' }) {
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

  html = html.replace('</head>', `  ${seoHead}\n</head>`);

  // Contenu textuel visible par les crawlers, caché aux utilisateurs
  // display:none est indexé par Google et Bing (≠ cloaking car contenu identique)
  if (bodyContent) {
    const botDiv = `<div id="bot-content" style="display:none" aria-hidden="true">${bodyContent}</div>\n  `;
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
    }));
    log(`/blog/${slug}`, `dist/blog/${slug}/index.html`); ok++;
  } catch(e) { err(`/blog/${slug}`, e); }
}

console.log(`\n[prerender] ─── Résultat : ${ok} OK, ${fail} erreur(s) ─────────────\n`);
process.exit(fail > 0 ? 1 : 0);

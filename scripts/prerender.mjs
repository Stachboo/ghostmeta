/**
 * scripts/prerender.mjs
 *
 * Script postbuild — génère du HTML statique pour chaque route du sitemap.
 * Exécuté automatiquement par le hook pnpm `postbuild` après `vite build`.
 *
 * Stratégie :
 * 1. Démarre l'API `vite preview` pour servir le dist/ (SPA + fallback index.html)
 * 2. Lance Puppeteer (Chromium headless) — vrai navigateur = i18n, React, Helmet OK
 * 3. Navigue vers chaque route avec `?lng=fr` (querystring = priorité maximale i18next)
 * 4. Attend `<footer>` dans le DOM (= React a rendu la page, loader masqué)
 * 5. Capture le HTML complet et l'écrit dans dist/ à l'emplacement correct
 * 6. Arrête le serveur et Chromium
 *
 * Résultat : dist/blog/slug/index.html contient le vrai contenu FR + balises Helmet.
 * Bingbot, ChatGPT Search, Perplexity, ClaudeBot voient du HTML réel, pas un div vide.
 */

import { preview } from 'vite';
import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const PORT = 3737;
const BASE = `http://localhost:${PORT}`;

// Routes à prerender — ?lng=fr force le contenu français via le détecteur querystring.
// Les balises <link rel="canonical"> injectées par Helmet pointent vers l'URL sans param.
const ROUTES = [
  { url: '/?lng=fr',                                         out: 'dist/index.html' },
  { url: '/pricing?lng=fr',                                  out: 'dist/pricing/index.html' },
  { url: '/blog/vinted-securite-photo-guide?lng=fr',         out: 'dist/blog/vinted-securite-photo-guide/index.html' },
  { url: '/blog/supprimer-exif-iphone-android?lng=fr',       out: 'dist/blog/supprimer-exif-iphone-android/index.html' },
  { url: '/blog/comprendre-donnees-exif-gps?lng=fr',         out: 'dist/blog/comprendre-donnees-exif-gps/index.html' },
  { url: '/blog/nettoyage-photo-local-vs-cloud?lng=fr',      out: 'dist/blog/nettoyage-photo-local-vs-cloud/index.html' },
  { url: '/blog/ghostmeta-manifeste-confidentialite?lng=fr', out: 'dist/blog/ghostmeta-manifeste-confidentialite/index.html' },
];

async function main() {
  console.log('\n[prerender] ─── Démarrage ───────────────────────────────');
  console.log(`[prerender] ${ROUTES.length} routes à traiter\n`);

  // Démarrer le serveur Vite preview (sert dist/ avec fallback SPA vers index.html)
  const server = await preview({
    preview: { port: PORT, open: false },
  });

  // Lancer Chromium headless — --no-sandbox requis en CI/CD (Vercel, Docker)
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  let success = 0;
  let failure = 0;

  for (const route of ROUTES) {
    try {
      const page = await browser.newPage();

      // domcontentloaded = navigation rapide, sans attendre scripts tiers (Analytics, Fonts)
      await page.goto(`${BASE}${route.url}`, { waitUntil: 'domcontentloaded' });

      // Attendre que <footer> soit dans le DOM = React a rendu, loader masqué
      // Home, PricingPage et BlogPost importent tous <Footer />
      await page.waitForSelector('footer', { timeout: 15000 });

      const html = await page.content();

      const outPath = join(ROOT, route.out);
      const outDir  = join(outPath, '..');
      if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
      writeFileSync(outPath, html, 'utf-8');

      console.log(`[prerender] ✓  ${route.url.padEnd(52)} → ${route.out}`);
      success++;
      await page.close();
    } catch (err) {
      console.error(`[prerender] ✗  ${route.url}`);
      console.error(`           ${err.message}`);
      failure++;
    }
  }

  await browser.close();
  server.httpServer.close();

  console.log(`\n[prerender] ─── Résultat : ${success} OK, ${failure} erreur(s) ─────────────\n`);
  process.exit(failure > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error('[prerender] Erreur fatale :', err);
  process.exit(1);
});

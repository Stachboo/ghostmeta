# AUDIT EXHAUSTIF MULTI-DIMENSIONNEL — GHOSTMETA

**Date :** 2026-04-04
**Site :** https://www.ghostmeta.online/
**Repo :** https://github.com/Stachboo/ghostmeta
**Stack :** React 19 + Vite 7 + TypeScript strict + Supabase + Vercel
**Agents deployes :** 12 agents specialises en parallele

---

## TABLEAU DE BORD — SCORES PAR DIMENSION

| # | Dimension | Score | Tendance | Priorite |
|---|-----------|-------|----------|----------|
| 1 | **Securite** | 6.5/10 | ⚠️ | HAUTE |
| 2 | **Qualite du code** | 6/10 | ⚠️ | HAUTE |
| 3 | **Architecture** | 7/10 | ✓ | MOYENNE |
| 4 | **Dependencies** | 4/10 | ❌ | CRITIQUE |
| 5 | **Tests** | 1.5/10 | ❌ | CRITIQUE |
| 6 | **Build & CI/CD** | 5/10 | ⚠️ | HAUTE |
| 7 | **Performance** | 7.5/10 | ✓ | BASSE |
| 8 | **SEO** | 7.9/10 | ✓ | MOYENNE |
| 9 | **UX/Design** | 5.5/10 | ⚠️ | HAUTE |
| 10 | **Marketing** | 5/10 | ⚠️ | HAUTE |
| 11 | **Infrastructure** | 7/10 | ✓ | MOYENNE |
| 12 | **Documentation** | 6.5/10 | ⚠️ | MOYENNE |
| 13 | **Observabilite** | 1.6/10 | ❌ | CRITIQUE |
| | **SCORE GLOBAL** | **5.5/10** | | |

---

## FINDINGS CRITIQUES (Action immediate requise)

### CRIT-1 : DOMPurify a 3 CVEs XSS non patchees
- **Dimension :** Securite + Dependencies
- **Fichier :** `package.json` — dompurify <=3.3.1
- **Impact :** Mutation-XSS, prototype pollution, ADD_ATTR bypass. DOMPurify est utilise pour sanitiser les valeurs EXIF affichees aux utilisateurs. Un EXIF craft pourrait injecter du JS.
- **Fix :** `pnpm update dompurify` (vers >=3.3.2)

### CRIT-2 : Packages parasites dangereux
- **Dimension :** Securite + Dependencies
- **Fichier :** `package.json`
- **Impact :**
  - `add` (v2.0.6) — typo-squatting, jamais importe
  - `vite-plugin-manus-runtime` (v0.0.57) — artefact AI avec capacites de screenshot, licence "Proprietary", mainteneur anonyme
  - `@builder.io/vite-plugin-jsx-loc` — jamais charge
- **Fix :** `pnpm remove add vite-plugin-manus-runtime @builder.io/vite-plugin-jsx-loc`

### CRIT-3 : 3% de couverture de tests (1 fichier sur 33)
- **Dimension :** Tests
- **Impact :** Zero test sur : webhook paiement (gere de l'argent), auth/premium, metadata stripping (coeur produit), sanitization XSS. Pas de vitest.config.ts, pas de script `test` dans package.json, pas de coverage reporter.
- **Fix :** Setup test infrastructure + ecrire tests P0 (webhook, auth, sanitizeExifValue)

### CRIT-4 : Zero CI/CD pipeline
- **Dimension :** Build
- **Impact :** Pas de GitHub Actions. TypeScript errors et test regressions peuvent shipper en prod. Vite build ne fait PAS de type-checking.
- **Fix :** Creer `.github/workflows/ci.yml` avec tsc --noEmit + vitest + build

### CRIT-5 : Aveugle en production (observabilite 1.6/10)
- **Dimension :** Observabilite
- **Impact :** Pas d'error tracking (pas de Sentry), pas de health check, pas de `@vercel/speed-insights`, pas d'alerting. Les erreurs disparaissent dans la console du navigateur.
- **Fix :** Ajouter Sentry + @vercel/speed-insights + /api/health

---

## FINDINGS HAUTE PRIORITE

### HIGH-1 : Silent catch masque les erreurs securite
- **Fichier :** `src/lib/image-processor.ts:147-149`
- **Impact :** `extractMetadata` catch silencieux retourne "safe" sans threats. Un outil de securite qui rapporte "safe" sur erreur = faux sentiment de securite.
- **Fix :** Ajouter `logSecurityEvent('PROCESSING_ERROR', ...)` dans le catch

### HIGH-2 : OAuth Google duplique 3 fois
- **Fichier :** `Home.tsx:61`, `AuthButton.tsx:26`, `Pricing.tsx:15`
- **Impact :** Meme appel `supabase.auth.signInWithOAuth` copie-colle. Changement de config = 3 endroits.
- **Fix :** Extraire `signInWithGoogle()` dans `src/lib/auth-utils.ts` ou ajouter a `useAuth`

### HIGH-3 : 20+ strings francaises hardcodees hors i18n
- **Fichiers :** PWAInstallPrompt, ImageCard, useImageProcessor, AuthButton, DropZone, Pricing, App.tsx
- **Impact :** Utilisateurs anglais voient des toasts et prompts en francais. Le Pricing a des strings anglaises hardcodees dans un produit French-first.
- **Fix :** Migrer toutes les strings vers les fichiers de traduction

### HIGH-4 : Supabase client leake dans composants UI
- **Fichier :** `AuthButton.tsx:4`, `Pricing.tsx:3`
- **Impact :** Viole la separation pages→composants→hooks→lib. Composants appellent `supabase.auth.*` directement au lieu de passer par `useAuth`.
- **Fix :** Ajouter `signInWithGoogle()`, `signOut()` a `useAuth` et supprimer les imports directs

### HIGH-5 : Pas de `.env.example` a la racine
- **Impact :** Nouveau developpeur n'a aucune guidance sur les 7+ variables requises.
- **Fix :** Creer `.env.example` listant toutes les variables avec placeholders

### HIGH-6 : Secret en query parameter (IndexNow)
- **Fichier :** `api/indexnow.js:41`
- **Impact :** `?secret=` est logge par CDN/proxies/browser history.
- **Fix :** Supprimer l'auth par query param, garder uniquement `Authorization: Bearer`

### HIGH-7 : Pas de replay protection webhook
- **Fichier :** `supabase/functions/lemon-webhook/index.ts`
- **Impact :** Un webhook valide capture en transit peut etre rejoue pour reactiver un abonnement annule.
- **Fix :** Stocker les event IDs deja traites et rejeter les doublons

### HIGH-8 : Aucun support `prefers-reduced-motion` (WCAG)
- **Impact :** Framer Motion animations partout sans respect des preferences utilisateur. Affecte les personnes avec troubles vestibulaires.
- **Fix :** Ajouter `<MotionConfig reducedMotion="user">` et media query CSS

### HIGH-9 : Pas de `<label>` sur inputs email/password
- **Fichier :** `AuthButton.tsx:178-200`
- **Impact :** Echec WCAG — placeholders ne sont pas des labels accessibles.
- **Fix :** Ajouter des elements `<label>` associes aux inputs

### HIGH-10 : Pas de README.md
- **Impact :** Aucun onboarding pour nouveaux contributeurs ou visiteurs GitHub.
- **Fix :** Creer un README avec description, setup, usage, contributing

---

## FINDINGS MOYENNE PRIORITE

### MED-1 : Home.tsx = god component (436 lignes, 20 imports)
- **Fix :** Extraire HeroSection, ProcessingDashboard, FAQSection

### MED-2 : Couleurs brand hardcodees partout (#00ff41, #0a0a0c, #ffb000)
- **40+ occurrences** — Definir dans tailwind.config comme theme colors

### MED-3 : changeLanguage duplique (Home.tsx + Header.tsx)
- **Fix :** Extraire hook `useLanguage()`

### MED-4 : `as any` casts (PWAInstallPrompt, dialog, input, textarea)
- **Fix :** Declarer type augmentations globales

### MED-5 : JSON-LD duplique sur toutes les pages
- WebApplication/FAQPage/HowTo dans index.html apparaissent sur les blogs aussi
- **Fix :** Deplacer dans Home.tsx Helmet

### MED-6 : Blog meta descriptions trop courtes et generiques
- **Fix :** Reecrire a 120-160 chars avec keywords et CTA

### MED-7 : Zero conversion tracking
- Uploads, cleans, signups, checkout clicks non mesures
- **Fix :** Ajouter `track()` de @vercel/analytics pour les events cles

### MED-8 : Blog sans cross-linking ni CTA
- Articles isoles sans liens internes ni retour vers l'outil
- **Fix :** Ajouter "Articles lies" + CTA fin d'article

### MED-9 : text-zinc-500 sous ratio WCAG 4.5:1
- **Fix :** Remplacer par text-zinc-400 minimum

### MED-10 : Pas de page /blog index
- **Fix :** Creer et ajouter au sitemap

### MED-11 : heic2any chunk a 1,353 KB (depasse 600KB threshold)
- Deja lazy-load, mais warning build. Ajouter a manualChunks.

### MED-12 : .gitignore ne couvre pas .env.production/.env.development
- **Fix :** Ajouter `.env*` avec exception `.env.example`

### MED-13 : PWAInstallPrompt utilise inline styles au lieu de Tailwind
- Inconsistant avec le reste du projet

### MED-14 : CLAUDE.md dit "7" au lieu de "8" (page securite ajoutee)
- 3 mentions stale a corriger

### MED-15 : twitter:image manquant dans le script prerender

---

## FINDINGS BASSE PRIORITE

- SEC-001 : IndexNow key hardcodee (pas un secret, cosmetic)
- SEC-007 : Pas de Deno lockfile pour edge function imports
- SEC-009 : `unsafe-inline` en style-src (risque faible)
- `noUnusedLocals`/`noUnusedParameters` manquants dans tsconfig principal
- Blog `dateModified` identique a `datePublished` partout
- Timeout magic number (10000ms) non extrait en constante
- Import inutilise `ChevronDown` dans Home.tsx
- `handleCleanAll` alias trivial inutile
- Pas de `Disallow: /api/` dans robots.txt
- `/securite` manquant dans llms.txt
- Pas de BreadcrumbList JSON-LD
- 8+ deps inutilisees a nettoyer (@types/google.maps, @types/express, tw-animate-css, baseline-browser-mapping, etc.)

---

## POINTS FORTS DU PROJET

| Domaine | Ce qui est bien fait |
|---------|---------------------|
| **Securite** | HMAC-SHA256 webhook avec timing-attack resistance, magic bytes validation, DOMPurify sanitization, CSP comprehensive, HSTS preload, Permissions-Policy restrictive |
| **Architecture** | Zero cycles de dependances, lib/ layer pure (zero React imports), code splitting bien fait avec lazy routes + secondary dynamic imports (heic2any, jszip, leaflet) |
| **SEO** | Prerendering sans navigateur, 3 schemas JSON-LD, hreflang FR/EN, IndexNow, llms.txt, robots.txt permissif pour AI crawlers |
| **Performance** | TTFB 26ms, load 793ms, LCP image preloaded en AVIF, vendor chunks bien separes, heic2any/jszip/leaflet lazy-loaded |
| **Privacy** | 100% client-side processing, GDPR consent, zero upload, Vercel Analytics conditionnel |
| **i18n** | 298 cles FR/EN en parfaite synchronisation, detection navigateur + localStorage + querystring |
| **Infra** | Headers securite complets, SW avec cache busting, PWA installable |

---

## ROADMAP DE REMEDIATION

### Sprint 1 — Quick Wins (1-2 jours)

1. `pnpm update dompurify` (CRIT-1)
2. `pnpm remove add vite-plugin-manus-runtime @builder.io/vite-plugin-jsx-loc @types/google.maps @types/express tw-animate-css baseline-browser-mapping` (CRIT-2)
3. Creer `.env.example` (HIGH-5)
4. Ajouter `logSecurityEvent` dans le catch de `extractMetadata` (HIGH-1)
5. Supprimer auth query param dans `api/indexnow.js` (HIGH-6)
6. Corriger CLAUDE.md "7" → "8" (MED-14)
7. Ajouter `/securite` dans `llms.txt` (LOW)
8. Supprimer import `ChevronDown` inutilise (LOW)

### Sprint 2 — Securite & Qualite (3-5 jours)

1. Creer `.github/workflows/ci.yml` (CRIT-4)
2. Setup vitest.config.ts + coverage reporter (CRIT-3 partial)
3. Ecrire tests pour `sanitizeExifValue`, `extractMetadata`, `formatGPSCoord` (CRIT-3 partial)
4. Extraire `signInWithGoogle()` dans useAuth (HIGH-2 + HIGH-4)
5. Ajouter `<MotionConfig reducedMotion="user">` (HIGH-8)
6. Ajouter `<label>` aux inputs auth (HIGH-9)
7. Ajouter replay protection webhook (HIGH-7)
8. Ajouter Sentry free tier (CRIT-5 partial)
9. Ajouter `@vercel/speed-insights` (CRIT-5 partial)

### Sprint 3 — SEO & Marketing (3-5 jours)

1. Deplacer JSON-LD de index.html vers Home.tsx (MED-5)
2. Reecrire blog meta descriptions (MED-6)
3. Creer page /blog index (MED-10)
4. Ajouter cross-linking et CTA dans articles (MED-8)
5. Internationaliser les 20+ strings hardcodees (HIGH-3)
6. Ajouter conversion tracking (MED-7)
7. Creer README.md (HIGH-10)
8. Ajouter twitter:image au prerender (MED-15)

### Sprint 4 — Architecture & Polish (3-5 jours)

1. Refactorer Home.tsx en sous-composants (MED-1)
2. Definir couleurs brand dans tailwind.config (MED-2)
3. Extraire hook `useLanguage()` (MED-3)
4. Migrer PWAInstallPrompt vers Tailwind (MED-13)
5. Ecrire tests webhook lemon-squeezy (CRIT-3 continuation)
6. Ecrire tests useAuth (CRIT-3 continuation)
7. Ajouter `/api/health` endpoint (CRIT-5 continuation)

---

## VERIFICATION

Pour valider les corrections :
- `pnpm run check` — zero erreurs TypeScript
- `pnpm vitest run` — tous les tests passent
- `pnpm run build` — build propre sans warnings
- `pnpm audit --prod` — zero CVE high/critical
- Lighthouse (via browse ou Chrome DevTools) — scores Accessibility 90+, SEO 90+
- `curl -A Googlebot https://www.ghostmeta.online/` — verifier que les meta tags sont dans le HTML
- `curl -A Googlebot https://www.ghostmeta.online/pricing` — idem pour prerender

---

*Rapport genere par 12 agents specialises en execution parallele.*
*Dimensions auditees : securite, code quality, architecture, dependencies, tests, build/CI, performance, SEO, UX/design, marketing, infrastructure, documentation, observabilite.*

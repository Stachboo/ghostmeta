# GhostMeta — Plan de Correction & Amelioration Complet

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Corriger les 5 findings critiques et 10 high-priority de l'audit exhaustif, passant le score global de 5.5/10 a 8+/10.

**Architecture:** Corrections organisees en 4 sprints independants. Chaque sprint produit du code testable et commitrable. TDD pour tout code nouveau. Subagents paralleles pour les taches independantes.

**Tech Stack:** React 19, Vite 7, TypeScript strict, Vitest, pnpm, GitHub Actions, Sentry, @vercel/speed-insights

**Rapport d'audit source:** `AUDIT_REPORT.md` a la racine du repo.

---

## Mapping Skill/Plugin par Tache

| Tache | Skill/Plugin | Status |
|-------|-------------|--------|
| Cleanup deps + CVE | `optimization-suite:ln-821-npm-upgrader` | Installe |
| CI/CD pipeline | `project-bootstrap:ln-732-cicd-generator` | Installe |
| Test infrastructure | `project-bootstrap:ln-743-test-infrastructure` | Installe |
| TDD pour chaque test | `superpowers:test-driven-development` | Installe |
| Security validation | `codebase-audit-suite:ln-621-security-auditor` | Installe |
| Code review post-sprint | `superpowers:requesting-code-review` | Installe |
| Parallel execution | `superpowers:dispatching-parallel-agents` | Installe |
| A11y fixes | `design-review` + `browse` QA | Installe |
| Bundle check | `optimization-suite:ln-832-bundle-optimizer` | Installe |
| Docs generation | `documentation-pipeline:ln-111-root-docs-creator` | Installe |
| Frontend polish | `frontend-design:frontend-design` | Installe |
| Code simplification | `code-simplifier:code-simplifier` | Installe |
| Verification | `superpowers:verification-before-completion` | Installe |

---

## Sprint 1 — Quick Wins & Securite (Tasks 1-6)

### Task 1: Nettoyer les dependencies dangereuses
- Remove: add, vite-plugin-manus-runtime, @builder.io/vite-plugin-jsx-loc, @types/google.maps, @types/express, tw-animate-css, baseline-browser-mapping, pnpm (devDep self-ref)
- Remove override: @builder.io/vite-plugin-jsx-loc>vite
- Update: dompurify >=3.3.2 (3 CVEs XSS)
- Verify: `pnpm audit --prod` = 0 high/critical

### Task 2: Fix silent catch in extractMetadata
- File: `src/lib/image-processor.ts:147-149`
- Add logSecurityEvent('PROCESSING_ERROR') in catch block
- TDD: write test first verifying error logging

### Task 3: Remove query param auth from IndexNow
- File: `api/indexnow.js:39-42`
- Keep only Bearer token auth
- Update CLAUDE.md

### Task 4: Create .env.example
- List all 9 env vars with section headers
- Broaden .gitignore to `.env*` with `!.env.example`

### Task 5: Centralize OAuth in useAuth
- Add signInWithGoogle(), handleSignOut() to useAuth hook
- Remove direct supabase imports from AuthButton, Pricing, Home
- Fixes 3 DRY violations + architecture layer leak

### Task 6: Fix CLAUDE.md counts (7 → 8)

---

## Sprint 2 — CI/CD, Tests & Observabilite (Tasks 7-10)

### Task 7: Create GitHub Actions CI pipeline
- TypeScript check + Vitest + Build + Audit
- Add test/test:watch/test:coverage scripts to package.json

### Task 8: Setup test infrastructure
- Create vitest.config.ts (jsdom, coverage, path aliases)
- Create src/test/setup.ts (crypto, URL, canvas mocks)
- Install @vitest/coverage-v8

### Task 9: Write tests for core functions
- sanitizeExifValue: XSS, truncation, null handling
- formatGPSCoord: N/S/E/W formatting
- formatFileSize: B/KB/MB formatting

### Task 10: Add Sentry + Speed Insights
- Install @sentry/react, @vercel/speed-insights
- Init Sentry in main.tsx with PII stripping
- Wire security-logger dispatch() to Sentry
- Gate SpeedInsights behind GDPR consent

---

## Sprint 3 — SEO, i18n & Accessibilite (Tasks 11-15)

### Task 11: Add prefers-reduced-motion support
- Wrap app in MotionConfig reducedMotion="user"
- Add CSS media query for animation override

### Task 12: Add accessible labels to auth inputs
- Add sr-only labels to email/password inputs

### Task 13: Migrate 20+ hardcoded strings to i18n
- PWAInstallPrompt, ImageCard, DropZone, Pricing, useImageProcessor, useAuth, App.tsx
- Add keys to both FR and EN translation files

### Task 14: Move JSON-LD from index.html to Home.tsx
- Remove WebApplication/FAQPage/HowTo from shell
- Add via Helmet in Home.tsx only

### Task 15: Create /blog index page + cross-linking
- New BlogIndex.tsx page
- Add "Related articles" section to BlogPost
- Add CTA at end of articles
- Update sitemap.xml and prerender script

---

## Sprint 4 — Architecture, Docs & Polish (Tasks 16-19)

### Task 16: Create README.md
- Description, badges, screenshot, features, quick start, stack, license

### Task 17: Refactor Home.tsx (436 → ~100 lines)
- Extract HeroSection, MarketingSection, FAQSection

### Task 18: Define brand colors in Tailwind config
- ghost-green, ghost-green-hover, ghost-dark, ghost-amber
- Replace 40+ hardcoded hex values

### Task 19: Create /api/health endpoint
- Returns status, timestamp, commit SHA

---

## Verification

After each sprint:
```bash
pnpm run check          # TypeScript
pnpm vitest run         # Tests
pnpm run build          # Build
pnpm audit --prod       # Security
```

Post-deploy QA via browse skill:
```bash
$B goto https://www.ghostmeta.online/
$B console --errors
$B responsive /tmp/post-fix
```

## Target Scores

| Dimension | Before | After |
|-----------|--------|-------|
| Dependencies | 4 | 9 |
| Tests | 1.5 | 6 |
| Observabilite | 1.6 | 7 |
| Build/CI | 5 | 9 |
| Securite | 6.5 | 8.5 |
| UX/Design | 5.5 | 7.5 |
| **GLOBAL** | **5.5** | **8+** |

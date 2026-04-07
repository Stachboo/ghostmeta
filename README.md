# GhostMeta

> Privacy-first photo metadata cleaner for Vinted, eBay & marketplace sellers.

## Features

- 🔒 100% local processing — no server upload
- 📸 EXIF/IPTC/XMP/GPS metadata extraction & stripping
- 🗺️ GPS location detection with map visualization
- 🛡️ Threat level analysis (critical/warning/safe)
- 📱 PWA — installable on mobile & desktop
- 🌍 Bilingual (French & English)
- ♿ Accessible (WCAG 2.1 AA)

## Quick Start

```bash
pnpm install
pnpm dev
```

## Scripts

| Command              | Description                          |
| -------------------- | ------------------------------------ |
| `pnpm dev`           | Start dev server                     |
| `pnpm build`         | Production build + prerender         |
| `pnpm preview`       | Preview the built app                |
| `pnpm test`          | Run tests (Vitest)                   |
| `pnpm test:coverage` | Tests with coverage report           |
| `pnpm check`         | TypeScript type check                |
| `pnpm format`        | Format with Prettier                 |

## Tech Stack

- **Frontend:** React 19, TypeScript, Vite 7, Tailwind CSS 3, shadcn/ui
- **Routing:** React Router 7
- **Auth & DB:** Supabase (PostgreSQL + Google OAuth)
- **Payments:** Lemon Squeezy
- **Hosting:** Vercel
- **Monitoring:** Sentry, Vercel Speed Insights & Analytics
- **i18n:** i18next (English + French)

## Architecture

All image processing runs client-side via `src/lib/image-processor.ts`:

1. **Extract** — Parse EXIF/IPTC/XMP/GPS via ExifReader
2. **Analyze** — Classify metadata fields by threat level (critical/warning/safe)
3. **Strip** — Re-encode image via canvas (removes all metadata)
4. **HEIC support** — Dynamic import of `heic2any` for iOS photos
5. **Max resolution** — Capped at 4096px to prevent mobile memory crashes

The React hook `src/hooks/useImageProcessor.ts` wraps this pipeline with state management.

### SEO & Prerendering

- Static HTML prerendering for 7 pages (home, pricing, 5 blog articles)
- JSON-LD `BlogPosting` schema on each article
- Sitemap with `hreflang` (fr/en/x-default)
- `llms.txt` for AI crawlers

### Path Alias

`@/*` resolves to `./src/*` (configured in `tsconfig.json` and `vite.config.ts`).

## License

[MIT](LICENSE)

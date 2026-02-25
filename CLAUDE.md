# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (exposed on all interfaces)
pnpm build        # Production build
pnpm preview      # Preview the built app
pnpm check        # TypeScript type checking (tsc --noEmit)
pnpm format       # Format code with Prettier
```

Tests are located in `src/lib/image-processor.test.ts` and run with Vitest. To run them:
```bash
pnpm vitest run                              # Run all tests once
pnpm vitest run src/lib/image-processor.test.ts  # Run a single test file
```

## Architecture

**GhostMeta** is a privacy-focused PWA that extracts, analyzes, and strips EXIF metadata from images. It uses a freemium model (free tier limited, premium via Lemon Squeezy payments).

### Stack
- **Frontend:** React 19 + TypeScript, Vite 7, React Router 7, Tailwind CSS 3 + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions), Vercel (hosting + API routes)
- **Payments:** Lemon Squeezy webhooks → Supabase Edge Function (`supabase/functions/lemon-webhook/`)
- **i18n:** i18next, English + French (`src/locales/`)

### Core image processing pipeline (`src/lib/image-processor.ts`)
1. `extractMetadata()` — Parses EXIF/IPTC/XMP/GPS via ExifReader
2. Threat detection — Classifies metadata fields as `critical` / `warning` / `safe`
3. Image re-encoding — Strips metadata by drawing to canvas and re-exporting
4. HEIC support — Loaded dynamically via `heic2any` (only for iOS photos, ~1.2MB)
5. Max resolution: 4096px to prevent mobile memory crashes

The hook `src/hooks/useImageProcessor.ts` wraps this pipeline with React state.

### Auth & premium (`src/hooks/useAuth.ts`, `src/lib/supabase.ts`)
- Google OAuth via Supabase
- Premium status stored in Supabase `subscriptions` table
- Lemon Squeezy webhooks verified with HMAC-SHA256 in the edge function

### Performance
- Routes are code-split with `React.lazy()` in `src/App.tsx`
- Vendor chunks defined in `vite.config.ts`: React, Framer Motion, i18n, UI, JSZip
- Chunk size warning at 600KB

### Path alias
`@/*` resolves to `./src/*` (configured in `tsconfig.json` and `vite.config.ts`).

### Code style
- Prettier: double quotes, 80 chars, semicolons, no arrow parens
- Strict TypeScript (`strict: true`, incremental builds)
- Functional components only, React Hooks pattern
- French inline comments are normal in this codebase

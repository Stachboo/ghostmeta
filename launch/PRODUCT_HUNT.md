# Product Hunt submission

## Submission form fields

**Name:** GhostMeta

**Tagline (60 chars max):**
> Strip C2PA, EXIF & AI watermarks from images, in your browser

**(alt taglines — A/B test)**
- Remove the AI fingerprint from any image, locally
- Free in-browser C2PA remover for AI images

**Topics:**
- Privacy
- Productivity
- Artificial Intelligence
- Photography
- Developer Tools

**Description (260 chars):**
> Sora, Midjourney, DALL-E and ChatGPT all stamp your images with C2PA Content Credentials. GhostMeta strips them in your browser — no upload, no signup. Free for personal use. REST API and batch unlimited on the $19/mo Pro tier.

**First link (web):** https://www.ghostmeta.online
**Pricing:** Freemium

## Gallery images (5 slots)

Each image is 1270×760 PNG. See `MEDIA_BRIEF.md` for the design system.

1. **Hero** — black bg, neon-green title "Strip metadata from any image", 4 generator logos under it (Sora / Midjourney / DALL-E / ChatGPT)
2. **In action** — screenshot of GhostMeta with a Midjourney image dropped, threat panel visible showing "Midjourney" detected, EXIF rows, C2PA row. Annotate with arrows
3. **Privacy** — split screen. Left: cloud tools uploading; right: browser tab green-bordered "100% local". Tagline at bottom: "Your image never leaves your browser"
4. **API** — terminal screenshot showing `curl -X POST .../api/v1/strip ...` returning a clean JPEG. Tagline: "Pro: REST API for agencies & resellers"
5. **Pricing** — 3 cards (Free / 5€ Pro / $19 Pro B2B) clean side by side

## Maker's first comment (post immediately at 00:01 PST)

```
Hey Product Hunt! Maker here.

Quick story: I built GhostMeta last year as a privacy tool for marketplace
sellers (Vinted, eBay) — strip GPS coordinates from photos before
listing. In Q1 2026 I noticed traffic shifting to a different question:
"how do I remove the C2PA from my Sora image?" Turns out every major
generator now stamps a Content Credentials manifest into every output.

Some of those manifests carry the prompt. Most carry an OpenAI / Adobe /
Midjourney signature plus a unique content_binding hash that lets any
free C2PA viewer fingerprint the file. If you publish a generated image
to LinkedIn, Pinterest, a marketplace, or a client deck, that fingerprint
goes with it. Some platforms now read the manifest and label your post
"AI-generated" automatically.

GhostMeta detects the manifest in the JPEG APP11 segment or PNG caBX
chunk, identifies the generator (Sora, DALL-E, Midjourney, ChatGPT,
Adobe Firefly, Stable Diffusion, Flux, Leonardo, Runway, Imagen), shows
you what's there, and strips it via canvas re-encode — all in your
browser. No upload. No signup.

Free for personal use, capped to one session per 12h. Pro Pack at €5/mo
unlocks batch + ZIP. New Pro B2B at $19/mo adds a REST API
(/api/v1/inspect + /api/v1/strip) with daily quotas — built for
agencies, dropshippers, and AI resellers cleaning hundreds of files.

Tech notes for the curious:
- Pure browser. No WASM, no native deps, no server upload.
- C2PA detector is ~150 lines of TypeScript scanning JPEG APP11 / PNG
  caBX boundaries. Generator identification is heuristic (string match
  in the manifest window).
- Server-side strip is also pure JS — JPEG APP-marker drop, PNG
  chunk-allowlist. Open-source-friendly, easy to audit.
- Supports Sora, Midjourney, DALL-E, ChatGPT, Adobe Firefly, Stable
  Diffusion (A1111 / ComfyUI), Flux, Leonardo, Runway Gen-3, Imagen.

I'd love feedback. The thing I most want to know: which generator do
you use most, and what does it embed that I haven't covered yet?

Honest answers, hard questions, ideas for what to build next — all
welcome. I'll be in the comments all day.
```

## Hunter strategy

- Submit yourself; don't wait for a top hunter (they rarely accept cold).
- Tag accounts you genuinely respect that have engaged with C2PA / privacy / AI tooling discourse — not for upvotes, for honest critique.

## Day-of monitoring

- Open PH page on a phone tab + desktop tab; refresh every 15 min for the first 4 hours
- Reply to comments in <30 min during the first 8h
- If you crack top 5, screenshot for Twitter share at hour 6
- Don't reply to negative comments defensively. "Fair point — here's what we'll do" beats "Actually..."

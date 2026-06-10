# Show HN post

**URL field:** https://www.ghostmeta.online

**Title (Show HN format):**
> Show HN: GhostMeta – pure-JS C2PA + EXIF strip, runs entirely in the browser

## First comment (post immediately as the maker)

```
Maker here. Two design choices I want to surface for HN since they
might interest folks here:

1. The C2PA detector is pure TypeScript, no WASM, no Rust toolchain.
   It scans JPEG APP11 segments and PNG caBX chunks, finds the JUMBF
   "jumb" box, and identifies the claim_generator via string match
   against a small allowlist (Sora, DALL-E, ChatGPT, Midjourney,
   Firefly, Imagen, etc.). Total ~150 lines. Source is in
   src/lib/c2pa-detector.ts.

   I started by trying to use @trustnxt/c2pa-ts (the only pure-TS C2PA
   lib I found) and the official Adobe c2pa-js (WASM, ~2MB). Both are
   built for full manifest parsing and validation, which I don't need
   for a "did I find one and which generator" check. The naive scan is
   ~3 orders of magnitude smaller and good enough for the privacy-tool
   use case.

2. Stripping is also pure JS, both client and server.
   - Client: drawing the image to canvas and calling toBlob() loses
     metadata for free, because the canvas spec doesn't carry external
     metadata boxes. The C2PA spec actually calls this a "strip
     attack" and acknowledges it's trivial — there's no cryptographic
     enforcement preventing it.
   - Server (api/v1/strip.js for the Pro tier REST API): pure-JS
     segment-walker. JPEG: drop every APP marker (incl APP1 EXIF and
     APP11 C2PA), preserve SOS scan with 0xFF 0x00 stuffing. PNG:
     allowlist the chunks we keep (IHDR, PLTE, IDAT, IEND, plus
     rendering-affecting ancillaries like tRNS, gAMA, sRGB), drop the
     rest. No `sharp`, no `imagemagick`, no native bindings. Easier to
     audit and ~50ms colder-start on Vercel functions.

The free tier runs everything in the browser. No upload, no telemetry.
The $19/mo Pro tier adds a REST API for agencies and AI resellers who
need batch ops; auth via SHA-256 hashed API keys against Supabase, daily
quota of 500 strips + 1000 inspects per key.

Feedback I'm specifically looking for:
- Edge cases in the JPEG segment walker — anything beyond APP / COM /
  scan I should defensively handle?
- Better generator identification heuristic. The string-match
  approach works for the major generators but breaks if the manifest
  is encoded oddly (e.g. CBOR-only with no plain text in the window).
- Anything you've seen that strips a JUMBF box badly and corrupts the
  pixels — I tested with sample images from each generator but the
  long tail is large.

Happy to AMA on the tech.
```

## Submission notes

- HN auto-detects "Show HN" prefix, applies the special tag and a higher decay rate. Don't omit the prefix.
- Best window: weekday 09:00-12:00 PST. Avoid Mondays (busy from weekend posts), Friday (decays into the weekend).
- The first 30 minutes determine ranking. Have your maker comment ready to paste IMMEDIATELY after submission. Empty Show HNs sink fast.
- HN hates marketing language. The submission title and first comment are deliberately understated. Resist the urge to add "🚀" or "free" or "the best".
- HN will probably ask: "what's the privacy threat model? doesn't this just enable AI deepfakes?" Have a calm one-paragraph answer pinned in a draft.
- If the post hits front page, the tool will get hammered. The Vercel free tier rate limits at ~12 invocations/sec. Watch logs and be ready to upgrade plan or temporarily disable the API endpoint if it tips over.
- A comment from a verified maker that says "we run a similar service and we've seen X" is gold. Don't refute it; engage and learn.

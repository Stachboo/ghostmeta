# Media brief — visual assets to capture before launch

All assets in the existing brand palette: bg `#0a0a0c`, accent green
`#22c55e`, B2B accent cyan `#06b6d4`, font Rajdhani for headings,
system sans for body.

## 1. Demo GIF (the most important asset)

**Spec:** 1280×720, ≤4 MB, ≤15 seconds, 24 fps, looping.

**Storyboard (15 seconds):**

| t | Visible |
|---|---|
| 0:00 | GhostMeta home, idle dropzone |
| 0:01 | A Midjourney PNG drops in. "Scanning…" overlay |
| 0:03 | Card flips: threat level CRITICAL, list shows GPS / EXIF / Midjourney C2PA / "midjourney v6 prompt" detected |
| 0:06 | Cursor hovers "Clean" button |
| 0:07 | Click. Card animates to "NEUTRALIZED". Original size → cleaned size |
| 0:10 | Click "Download" — clean PNG saved |
| 0:12 | Cut to second screen: re-drop the cleaned file. Threat level: SAFE. "No metadata detected" |
| 0:15 | Logo + URL `ghostmeta.online` |

Recording tools: Cleanshot X / Kap (macOS), ScreenToGif (Windows).
Compress with gifski or ffmpeg → palette → GIF.

## 2. Hero / OG image

**File:** `public/og-image-v2.jpg` (1200×630).

**Composition:**
- Black background, light grain overlay
- Big neon-green title (Rajdhani 800): "Strip the AI fingerprint."
- Subtitle (Rajdhani 300): "C2PA · EXIF · GPS · AI watermarks. In your browser."
- Right side: a clean rendering of an "image card" with a `C2PA: Sora` chip
- Bottom right: GhostMeta logo + `ghostmeta.online`

Keep critical text above 25% margin top / bottom — Twitter and LinkedIn crop OG images aggressively.

## 3. Product Hunt gallery (5 images, 1270×760)

| # | Composition |
|---|---|
| 1 | Hero text "Strip metadata from any image" + 4 generator badges (Sora, Midjourney, DALL-E, ChatGPT) |
| 2 | UI screenshot of a Midjourney image dropped, threat panel open with annotated arrows |
| 3 | "100% local" split screen: cloud upload (left, red) vs browser bunker (right, green) |
| 4 | Terminal: `curl -X POST -H "Authorization: Bearer gm_live_..." --data-binary @img.png /api/v1/strip > clean.png` |
| 5 | 3 pricing cards side by side (Free / 5€ Pro / $19 Pro B2B) |

## 4. Per-platform OG variants

PH and X both crop OG to 1200×630 but Reddit prefers 1200×675 with the
title in the lower third (because Reddit overlays its own UI on the
top). For Reddit posts, generate a second OG with title at the bottom.

## 5. Screenshots for Reddit / HN

Take CLEAN screenshots (no browser chrome) of:
- The main GhostMeta UI with a Stable Diffusion image dropped, prompt visible
- The per-generator landing page (`/tools/remove-midjourney-metadata`) for the r/midjourney post
- The Settings page with one API key + the reveal-once modal (for HN technical post)

## 6. Generator logos (use carefully)

Use generator logos ONLY as small monochrome badges, max 80×80 px, in
"detected by" context. Do NOT use full-color logos in marketing — risk
of trademark complaint. For all 10 generators, the safer bet is to use
the GENERATOR NAME in matching font, not the logo glyph.

## 7. File hygiene

- Keep all source design files in `launch/assets/` (not committed if
  they contain proprietary fonts; .gitignore them otherwise)
- Export PNGs / GIFs to `public/launch/` so they're CDN-served by Vercel
- After launch, archive everything to `launch/2026-05-launch-archive/`
  and unlink from public. Don't keep loud campaign assets live forever —
  they go stale and look dated.

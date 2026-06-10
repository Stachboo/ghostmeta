# Twitter / X launch thread

8 tweets. Post the first one, wait 60s, post replies in sequence. Pin tweet #1.

---

**Tweet 1 — Hook (the bait)**

```
Every image you generate with Sora, DALL-E, Midjourney or ChatGPT
carries a hidden manifest that announces it's AI-generated.

Some platforms already read it and auto-label your post.

Here's what's in there — and a free browser tool to strip it. 🧵
```

(Attach: hero image / GIF showing manifest content)

---

**Tweet 2 — The reveal**

```
The standard is called C2PA Content Credentials. It lives in:

· JPEG APP11 segment (Sora, Firefly, Imagen)
· PNG caBX chunk (DALL-E, ChatGPT, Midjourney Pro, Flux)
· PNG tEXt chunks (Stable Diffusion's full prompt + LoRA stack)

Most users have no idea their files carry it.
```

---

**Tweet 3 — Why it matters**

```
Why care?

· LinkedIn and Adobe Bridge already read C2PA. Pinterest is testing.
· Stable Diffusion's tEXt chunks leak your full prompt + workflow to
  anyone who downloads the file.
· Midjourney's job_id ties the file back to your gallery.
· ChatGPT's content_binding hash uniquely fingerprints the image.
```

---

**Tweet 4 — Solution**

```
GhostMeta is a free browser tool that:

1. Detects the manifest (JUMBF box scan)
2. Identifies the generator (Sora / Midjourney / DALL-E / ChatGPT /
   Adobe Firefly / SD / Flux / Leonardo / Runway / Imagen)
3. Strips it via canvas re-encode

100% in your tab. No upload. No signup.
```

(Attach: GIF of the flow)

---

**Tweet 5 — How**

```
The trick is that the C2PA spec calls this a "strip attack" — and
acknowledges it's trivial. Drawing the image to an HTML canvas and
re-exporting drops the JUMBF box for free, because the canvas spec
doesn't carry external metadata boxes.

GhostMeta is ~150 lines of TS for detection.
```

---

**Tweet 6 — For builders**

```
For agencies / dropshippers / AI resellers:

A Pro B2B tier ($19/mo) adds a REST API:

  POST /api/v1/strip      → cleaned bytes
  POST /api/v1/inspect    → JSON report

Bearer-auth API keys, daily quota, no native deps in the strip path.
```

---

**Tweet 7 — Honest limits**

```
What it does NOT do:

· Doesn't remove visible pixel watermarks (Runway logos, etc.)
· Doesn't remove pixel-level steganographic watermarks (Google's
  SynthID, OpenAI's announced pixel watermark for DALL-E 3)
· Doesn't strip MP4 video metadata — use ffmpeg for that (v1 is stills)

The metadata layer is what 90%+ of platforms read TODAY.
```

---

**Tweet 8 — CTA + close**

```
Try it: https://www.ghostmeta.online

Free for personal use, Pro $5/mo for batch, Pro B2B $19/mo for the
REST API.

If you build with AI images and ship them anywhere, this is worth 30s
to bookmark.

Reply with the file format that's giving you the most trouble — happy
to dig in.
```

---

## Posting notes

- Don't add hashtags inside the tweets (algo penalty since 2024). One #C2PA on tweet 1 only is fine.
- Tag accounts that have publicly engaged with C2PA / AI-image privacy discourse. Don't tag generic AI accounts hoping for an RT — that screams spam.
- After 24h, screenshot any especially good comment / question and quote-tweet with the answer. Free engagement.
- DO NOT delete and repost if engagement is bad in the first hour. The penalty for deletion is worse than a slow tweet. Let it ride 48h.

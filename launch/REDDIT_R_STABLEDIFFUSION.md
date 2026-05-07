# r/StableDiffusion post

**Sub:** r/StableDiffusion (~640k members, very active, technical, allergic to spam)

**Best time:** Weekday morning PT (afternoon Paris). Avoid weekends — feed moves too fast.

**Title:**
> Quick reminder: A1111/ComfyUI write your full prompt + LoRA stack into PNG tEXt chunks. Built a free browser tool to strip them.

**Body:**

```
Was helping a client clean a batch of SDXL outputs they wanted to ship
without their workflow leaking. Turns out a lot of folks don't realize
how loud A1111's default PNG export is. The "parameters" tEXt chunk in
each image carries:

- The full positive prompt (verbatim)
- The full negative prompt
- Sampler, CFG, seed, steps
- Model hash + filename
- LoRA stack (filenames + weights)
- ControlNet inputs and preprocessor chain
- ComfyUI: the entire JSON workflow graph

Anyone with a free PNG inspector reads this back word-for-word. If you
sell on a stock site or hand off a deliverable, you're shipping your
recipe with the file.

I built a browser-only tool that drops all PNG tEXt / iTXt / zTXt
chunks (and the C2PA caBX chunk if you're on a hosted SD service that
adds one) via canvas re-encode. Pixels stay byte-equivalent, metadata
is gone. No upload, no signup, no install — pure JS that runs in your
tab.

https://www.ghostmeta.online/tools/clean-stable-diffusion-metadata

Three things I want to flag honestly:

1. Re-exporting from A1111 or ComfyUI re-attaches the metadata. Run
   GhostMeta as the LAST step before sharing.
2. It's all-or-nothing on metadata. If you need to keep certain fields
   (e.g. seed for reproducibility), use a dedicated EXIF/PNG editor.
3. The visible pixels are unchanged. If a platform uses a content-based
   AI detector (not metadata-based), it'll still flag the image.

Source for the strip logic is in the same repo as the front-end if
you'd rather verify or self-host.

Open to feedback — what fields am I missing? ComfyUI has gotten weird
lately with custom nodes writing to non-standard chunks; I'd love to
hear about edge cases.
```

**Notes:**
- Do NOT cross-post the same body to other subs. Each sub gets a different angle (see other REDDIT_*.md files).
- Engage every reply within an hour for the first 8h.
- If someone says "this exists already" — confirm what they mean, name the alternative, explain the differentiator (browser-only, no upload, broader generator coverage).
- If the post gets removed — message the mods politely once asking what rule was tripped. Don't repost.

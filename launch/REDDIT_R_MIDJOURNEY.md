# r/midjourney post

**Sub:** r/midjourney (~2M members, very visual, image-heavy posts dominate)

**Best time:** Tuesday/Wednesday afternoon PT. Avoid Mondays (clogged with weekend output).

**Title:**
> Your Midjourney PNG carries your prompt + job ID by default. Built a free browser tool that strips them.

**Body:**

```
Was sharing some v6.1 output to a client deck last month and noticed my
prompt was sitting in the file metadata. Anyone who hovers over the
file in Finder/Explorer sees it. Anyone who runs a free PNG inspector
sees the job_id, version, and a Discord-user-id reference too.

What Midjourney embeds (PNG tEXt + iTXt chunks):
- Description (your prompt — verbatim)
- parameters (weights, --ar, --chaos, --niji, etc.)
- Software (the MJ build that generated it)
- job_id (looks up the original generation in your gallery)
- user_id (older versions wrote it raw, recent ones hash or omit)
- caBX C2PA chunk on Pro/Mega tiers

If your gallery is public, the job_id alone is enough for someone to
walk back to the original prompt + variations + your username.

I built a free browser tool that drops every text chunk and the caBX
boundary in one click. No upload, runs in your tab.

https://www.ghostmeta.online/tools/remove-midjourney-metadata

Caveats up front:
- Re-exporting through MJ web re-attaches everything. Strip is the LAST
  step, after any web edit.
- The tool also detects metadata from Sora, DALL-E, ChatGPT, Firefly,
  Stable Diffusion, Flux, Leonardo, Runway, Imagen — handy if you're
  mixing generators in a workflow.
- If your original is already public on the gallery, stripping the file
  doesn't make the gallery entry private. Set the original to private
  in your MJ dashboard separately.

Anyone else dealing with this on client work? Curious how others handle
the pipeline — do you re-export through Photoshop, run exiftool, or
just not think about it?
```

**Sub culture notes:**
- This sub LOVES showing off images. A purely-text post will get less love than a post with a "before/after metadata" screenshot. Add one if you have time.
- Mods are picky about self-promo. Frame as "tool I made because I needed it", not "check out my product".
- Don't crosspost from r/StableDiffusion — communities overlap and mods notice.

# r/sora post

**Sub:** r/sora (newer sub, ~tens of thousands, hot topic, OpenAI-watching mods)

**Best time:** Any weekday. Sub moves slower than r/StableDiffusion so a post stays visible longer.

**Title:**
> Reminder: Sora frames carry a C2PA manifest that survives screenshots and edits. Free browser tool to strip it.

**Body:**

```
Quick PSA after a few questions in the comments of last week's "is my
Sora video labeled as AI on Twitter" thread.

Every still and every video frame from Sora ships with a C2PA Content
Credentials manifest. Specifically:
- A claim_generator string identifying OpenAI Sora and version
- A signing certificate chain tying the output to OpenAI's signing key
- A timestamped assertion saying when the file was created
- A content_binding hash that uniquely identifies the bytes

The manifest sits in the JPEG APP11 segment for stills and in the MP4
metadata containers for video. It survives most editor exports. It
survives format conversion (JPEG→PNG round-trip). It does NOT survive a
clean canvas re-encode in a browser, which is the simplest way to strip
it.

I built a free browser tool that detects the Sora signature, shows you
what's in the manifest, and strips it via canvas re-encode — for stills
only in v1. No upload. No signup.

https://www.ghostmeta.online/tools/remove-sora-c2pa

What it does NOT do (be honest about limits):
- It does not strip Sora metadata from MP4 video. For that, ffmpeg with
  `-map_metadata -1 -c copy` is the easiest path.
- It does not remove pixel-level watermarks (Sora doesn't have an
  announced one, but assume future versions will — they survive
  re-encoding by design).
- Once stripped, the image is no longer cryptographically attributable
  to Sora. That's the whole point. Only do this when you control the
  publishing context and have a legitimate reason.

Open question for the sub: has anyone confirmed whether the most recent
Sora release embeds account-level identifiers in the assertion list? My
testing on stills shows generic OpenAI signing, but I haven't tested
across enough accounts to be sure. If you have a sample I can verify
against, I'd appreciate a DM.
```

**Notes:**
- This sub is sensitive about content moderation and platform policies. Frame the tool as a legitimate privacy tool, NOT as "evade Sora detection". You will get flagged otherwise.
- Be transparent about what the tool can't do. The audience is technical and will spot puffing.
- Reply to "is this against OpenAI's TOS" comments with a calm read of the actual TOS — most providers permit metadata stripping for non-deceptive use.

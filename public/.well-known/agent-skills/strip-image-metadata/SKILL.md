---
name: strip-image-metadata
description: Remove EXIF, IPTC, XMP and GPS metadata from JPEG, PNG, WebP and HEIC images entirely in the browser via Canvas re-encoding. No server upload. Explains exactly which fields are stripped and the scope limits (no pixel watermark removal).
---

# Strip Image Metadata

GhostMeta removes the metadata layer attached to an image file — **not** anything baked into the pixels. All processing happens locally in the browser; the file is never uploaded.

## How it works

```
1. Decode the image to raw pixels (Canvas API)
2. Re-encode from pixels to a new JPEG/PNG/WebP
3. The re-encoded output carries no EXIF / IPTC / XMP / GPS block
```

Because the output is rebuilt from raw pixels, the metadata segments simply do not exist in the new file. There is no "best-effort scrub" — the container is regenerated.

## What is removed

| Layer | Examples |
|---|---|
| EXIF | Camera make/model, serial number, capture date/time, exposure settings, software |
| GPS | Latitude / longitude / altitude where the photo was taken |
| IPTC | Author, caption, copyright, keywords |
| XMP | Editing history, rights, ratings, AI-tool tags |

## Supported input formats

JPEG, PNG, WebP, and HEIC (iPhone photos — converted in-browser via `heic2any`). Max resolution 4096px to avoid mobile memory crashes. Batch processing exports a ZIP.

## Scope limits (honest)

- Does **not** remove visible/burned-in watermarks (logos, banners) — that needs an image editor.
- Does **not** remove pixel-level invisible watermarks (e.g. Google SynthID) — they live in the pixels, not the metadata.
- Does **not** process video.
- Cannot undo server-side "soft binding" (a fingerprint the provider stores on its own servers, independent of the file).

## Live implementation

The tool at `https://www.ghostmeta.online/` performs this in-browser. Per-source cleaners are listed at `https://www.ghostmeta.online/tools`.

## Related

- `remove-c2pa-content-credentials` — strip the AI provenance manifest specifically
- `detect-metadata-threats` — classify fields before removal

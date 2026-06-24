---
name: detect-metadata-threats
description: Classify image metadata fields as critical, warning or safe before removal (GPS coordinates, device serial, capture timestamp, AI provenance manifest). Reference for what personal/provenance data an image can leak.
---

# Detect Metadata Threats

Before stripping, GhostMeta classifies each metadata field by how much it can expose. This lets a user (or an agent) understand what an image is leaking.

## Classification

| Level | Meaning | Typical fields |
|---|---|---|
| **critical** | Directly identifies a person, place, or AI origin | GPS latitude/longitude, device serial number, C2PA provenance manifest |
| **warning** | Contextual leak, sensitive in aggregate | Capture date/time, camera make/model, editing software, author/copyright (IPTC/XMP) |
| **safe** | Technical, low privacy impact | Color profile, image dimensions, orientation flag |

## Why it matters per audience

- **AI creators**: the C2PA `claim_generator` (critical) flags an image as AI-generated; marketplaces and stock libraries scan for it.
- **Journalists / activists**: GPS (critical) can reveal a source's location.
- **Marketplace sellers** (Vinted, eBay, Etsy…): GPS + timestamp reveal home location and habits.

## Scope note

This skill classifies and removes **metadata**. It cannot detect or remove pixel-level watermarks (SynthID) or server-side fingerprints — those are not metadata fields.

## Live implementation

The classifier runs automatically before removal at `https://www.ghostmeta.online/`. Details on local processing and guarantees at `https://www.ghostmeta.online/securite`.

## Related

- `strip-image-metadata` — remove the classified fields
- `remove-c2pa-content-credentials` — remove the AI provenance manifest specifically

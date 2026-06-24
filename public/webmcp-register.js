// WebMCP tool registration for GhostMeta.
// Exposes read-only, reference/redirection tools to AI agents running inside the
// browser via the WebMCP API (navigator.modelContext). Progressively enhances:
// no-op if the API is absent. Works with the spec method `registerTool` and the
// Chrome EPP name `provideContext`.
//
// NOTE on scope: GhostMeta strips metadata from a binary image file, locally in
// the browser (Canvas re-encoding). A text agent cannot hand a raw image file to
// a JS function through WebMCP, so we do NOT expose a fake "strip" calculator.
// Instead we expose honest reference tools: describe the capability, classify an
// EXIF field by threat level, and build the correct cleaner URL to redirect the
// user to the actual in-browser tool.

(function () {
  var ctx = typeof navigator !== "undefined" && navigator.modelContext;
  if (!ctx) return;

  var SITE = "https://www.ghostmeta.online";

  // Threat classification mirrors detect-metadata-threats SKILL.md.
  var CRITICAL = ["gpslatitude", "gpslongitude", "gpsposition", "gpsaltitude", "serialnumber", "bodyserialnumber", "c2pa", "contentcredentials", "claim_generator"];
  var WARNING = ["datetimeoriginal", "datetime", "createdate", "make", "model", "software", "lensmodel", "artist", "copyright", "creator", "by-line"];

  // Maps a generator name (lowercase) to its dedicated cleaner slug under /tools.
  var CLEANERS = {
    sora: "remove-sora-c2pa",
    midjourney: "remove-midjourney-metadata",
    chatgpt: "clean-chatgpt-image-metadata",
    "gpt-image": "clean-chatgpt-image-metadata",
    dalle: "strip-dalle-fingerprint",
    "dall-e": "strip-dalle-fingerprint",
    firefly: "remove-firefly-content-credentials",
    "adobe-firefly": "remove-firefly-content-credentials",
    "stable-diffusion": "clean-stable-diffusion-metadata",
    flux: "remove-flux-image-metadata",
    leonardo: "remove-leonardo-ai-metadata",
    runway: "strip-runway-ml-watermark",
    imagen: "clean-google-imagen-metadata",
    "google-imagen": "clean-google-imagen-metadata",
    c2pa: "browser-c2pa-remover"
  };

  var tools = [
    {
      name: "describe_metadata_capability",
      title: "What GhostMeta can and cannot strip",
      description: "Return an honest description of GhostMeta's capability: which metadata layers it removes (EXIF, IPTC, XMP, GPS, C2PA manifest, PNG text chunks) and the explicit scope limits (no pixel watermark / SynthID removal, no video, no server-side soft binding).",
      inputSchema: { type: "object", properties: {} },
      execute: function () {
        return Promise.resolve({
          removes: ["EXIF", "IPTC", "XMP", "GPS coordinates", "C2PA Content Credentials manifest (JUMBF)", "PNG text chunks (prompt/seed/model)"],
          does_not_remove: ["visible/burned-in watermarks", "pixel-level invisible watermarks (e.g. Google SynthID)", "server-side soft-binding fingerprints", "video metadata"],
          method: "Local Canvas re-encoding in the browser. No server upload.",
          input_formats: ["JPEG", "PNG", "WebP", "HEIC"],
          tool_url: SITE + "/"
        });
      }
    },
    {
      name: "classify_metadata_field",
      title: "Classify a metadata field by threat level",
      description: "Given a metadata field name (e.g. GPSLatitude, DateTimeOriginal, Make), classify it as critical, warning or safe for privacy/provenance exposure.",
      inputSchema: {
        type: "object",
        properties: {
          field: { type: "string", description: "Metadata field name, e.g. GPSLatitude, SerialNumber, DateTimeOriginal, C2PA." }
        },
        required: ["field"]
      },
      execute: function (input) {
        var f = String(input.field || "").toLowerCase().replace(/[^a-z0-9_]/g, "");
        var level = "safe";
        for (var i = 0; i < CRITICAL.length; i++) { if (f.indexOf(CRITICAL[i]) !== -1) { level = "critical"; break; } }
        if (level === "safe") { for (var j = 0; j < WARNING.length; j++) { if (f.indexOf(WARNING[j]) !== -1) { level = "warning"; break; } } }
        return Promise.resolve({ field: input.field, level: level });
      }
    },
    {
      name: "get_cleaner_url",
      title: "Get the GhostMeta cleaner URL for a source",
      description: "Build the canonical GhostMeta cleaner page URL for a given AI image generator (or generic C2PA). Returns the in-browser tool a user should open to strip that source's metadata. Locale en/fr supported.",
      inputSchema: {
        type: "object",
        properties: {
          source: {
            type: "string",
            description: "Generator key: sora, midjourney, chatgpt, dalle, firefly, stable-diffusion, flux, leonardo, runway, imagen, or c2pa for the generic remover."
          },
          locale: { type: "string", enum: ["en", "fr"], description: "Page locale. Defaults to fr (site default)." }
        },
        required: ["source"]
      },
      execute: function (input) {
        var key = String(input.source || "").toLowerCase().trim();
        var slug = CLEANERS[key] || "browser-c2pa-remover";
        var locale = input.locale === "en" ? "en" : "fr";
        var prefix = locale === "en" ? "/en" : "";
        var url = SITE + prefix + "/tools/" + slug;
        return Promise.resolve({ url: url, slug: slug, locale: locale, hub: SITE + prefix + "/tools" });
      }
    }
  ];

  var register = typeof ctx.registerTool === "function"
    ? function (t) { ctx.registerTool(t); }
    : typeof ctx.provideContext === "function"
      ? function (t) { ctx.provideContext({ tools: [t] }); }
      : null;

  if (!register) return;

  for (var i = 0; i < tools.length; i++) {
    try { register(tools[i]); } catch (e) { /* no-op */ }
  }
})();

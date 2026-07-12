/**
 * MetaIllustration — bloc illustratif self-contained (SVG + CSS, zéro image
 * externe) pour les templates blog et /tools. Il met en scène le geste central
 * de GhostMeta : révéler les métadonnées cachées d'une photo, puis les caviarder.
 *
 * Composition : grille type carte/données, "chips" EXIF en mono dont certaines
 * sont redigées (barre verte = donnée retirée), ligne de scan (motif du site,
 * animée uniquement en motion-safe), et un glyphe focal selon la variante.
 *
 * Pensé pour être beau tel quel ; une vraie image pourra venir se superposer
 * plus tard sans changer l'API (children en overlay).
 */
import type { ReactNode } from "react";

type Variant = "exif" | "gps" | "viewer" | "c2pa";

interface Chip {
  key: string;
  value: string;
  /** true = donnée sensible, affichée caviardée (retirée par GhostMeta) */
  redacted?: boolean;
}

const CHIPSETS: Record<Variant, Chip[]> = {
  exif: [
    { key: "Make", value: "Apple iPhone 15" },
    { key: "DateTimeOriginal", value: "2026:03:14 09:22" },
    { key: "GPS", value: "48.8566, 2.3522", redacted: true },
    { key: "SerialNumber", value: "F2LZ9K3QX1", redacted: true },
  ],
  gps: [
    { key: "GPSLatitude", value: "48.8566° N", redacted: true },
    { key: "GPSLongitude", value: "2.3522° E", redacted: true },
    { key: "GPSAltitude", value: "35 m", redacted: true },
    { key: "DateTimeOriginal", value: "2026:03:14 09:22" },
  ],
  viewer: [
    { key: "Make", value: "Canon EOS R6" },
    { key: "Lens", value: "ƒ/1.8 · 35mm" },
    { key: "GPS", value: "48.8566, 2.3522" },
    { key: "Artist", value: "© photographe" },
  ],
  c2pa: [
    { key: "c2pa.manifest", value: "urn:uuid:9f3a…" },
    { key: "claim_generator", value: "OpenAI / DALL·E", redacted: true },
    { key: "c2pa.actions", value: "created", redacted: true },
    { key: "DateTimeOriginal", value: "2026:03:14 09:22" },
  ],
};

// Photo de fond par variante (libre de droit, Pexels — commercial, sans
// attribution). Affichée très assombrie + teintée pour rester texture, pas
// sujet. c2pa réutilise le visuel code (thème génération IA).
const BG: Record<Variant, string> = {
  exif: "/illu/illu-exif.jpg",
  gps: "/illu/illu-gps.jpg",
  viewer: "/illu/illu-viewer.jpg",
  c2pa: "/illu/illu-exif.jpg",
};

const LABELS: Record<Variant, string> = {
  exif: "EXIF · IPTC · XMP · GPS",
  gps: "GPS IFD · localisation",
  viewer: "Lecture des métadonnées",
  c2pa: "C2PA · Content Credentials",
};

// Glyphe focal (SVG path, tracé sur une grille 24×24), discret en bas à droite.
function Glyph({ variant }: { variant: Variant }) {
  const common = {
    fill: "none",
    stroke: "#00ff41",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (variant) {
    case "gps":
      return (
        <g {...common}>
          <path d="M12 2.5c-3.6 0-6.5 2.9-6.5 6.5 0 4.6 6.5 12 6.5 12s6.5-7.4 6.5-12c0-3.6-2.9-6.5-6.5-6.5Z" />
          <circle cx="12" cy="9" r="2.4" />
        </g>
      );
    case "viewer":
      return (
        <g {...common}>
          <circle cx="10.5" cy="10.5" r="6.5" />
          <path d="M15.5 15.5 21 21" />
        </g>
      );
    case "c2pa":
      // empreinte stylisée
      return (
        <g {...common}>
          <path d="M12 3.2a8.8 8.8 0 0 0-8.8 8.8" />
          <path d="M12 6.6a5.4 5.4 0 0 0-5.4 5.4v3" />
          <path d="M12 10a2 2 0 0 0-2 2v6" />
          <path d="M15.4 12a3.4 3.4 0 0 0-3.4-3.4" />
          <path d="M18.8 12A6.8 6.8 0 0 0 12 5.2" />
        </g>
      );
    default:
      // couches de métadonnées empilées
      return (
        <g {...common}>
          <path d="M12 3 21 8l-9 5-9-5 9-5Z" />
          <path d="m3 12 9 5 9-5" />
          <path d="m3 16 9 5 9-5" />
        </g>
      );
  }
}

interface Props {
  variant?: Variant;
  /** overlay optionnel (future vraie image), rendu au-dessus de l'illustration */
  children?: ReactNode;
  className?: string;
}

export default function MetaIllustration({
  variant = "exif",
  children,
  className = "",
}: Props) {
  const chips = CHIPSETS[variant];

  return (
    <div
      role="img"
      aria-label={`Illustration : métadonnées ${LABELS[variant]} d'une photo, révélées puis retirées par GhostMeta`}
      className={`meta-illu relative w-full aspect-video overflow-hidden rounded-xl border border-white/10 bg-ghost-dark ${className}`}
    >
      {/* Photo de fond (texture) : très assombrie + désaturée pour ne pas
          concurrencer les chips. object-cover, lazy. */}
      <img
        src={BG[variant]}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        style={{ filter: "grayscale(0.55) contrast(1.05) brightness(0.9)" }}
      />
      {/* Voile sombre dégradé pour garantir la lisibilité par-dessus la photo */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(10,10,12,0.72), rgba(10,10,12,0.88)), radial-gradient(120% 100% at 15% 20%, transparent, rgba(10,10,12,0.6) 70%)",
        }}
      />
      {/* Teinte verte discrète (mélange multiply) pour cohérence de marque */}
      <div
        className="pointer-events-none absolute inset-0 mix-blend-overlay"
        style={{ background: "rgba(0,255,65,0.12)" }}
      />

      {/* Halo radial vert très discret */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 90% at 78% 15%, rgba(0,255,65,0.10), transparent 55%)",
        }}
      />

      {/* Grille type carte / table de données */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 320 180"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <pattern id="mi-grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path
              d="M20 0H0V20"
              fill="none"
              stroke="#00ff41"
              strokeOpacity="0.07"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="320" height="180" fill="url(#mi-grid)" />

        {/* Chips de métadonnées en mono : key à gauche, valeur (ou caviardage) */}
        {chips.map((chip, i) => {
          const y = 30 + i * 32;
          return (
            <g key={chip.key} fontFamily="ui-monospace, SFMono-Regular, monospace">
              <text x="26" y={y} fontSize="9" fill="#7dd6a0" fillOpacity="0.85">
                {chip.key}
              </text>
              {chip.redacted ? (
                <>
                  <rect
                    x="150"
                    y={y - 9}
                    width="118"
                    height="13"
                    rx="2"
                    fill="#00ff41"
                    fillOpacity="0.16"
                    stroke="#00ff41"
                    strokeOpacity="0.5"
                    strokeWidth="0.8"
                  />
                  <text
                    x="209"
                    y={y}
                    fontSize="9"
                    textAnchor="middle"
                    fill="#00ff41"
                    fillOpacity="0.9"
                    letterSpacing="1.5"
                  >
                     █ RETIRÉ █
                  </text>
                </>
              ) : (
                <text x="150" y={y} fontSize="9" fill="#e6f6ec" fillOpacity="0.7">
                  {chip.value}
                </text>
              )}
            </g>
          );
        })}

        {/* Glyphe focal, discret en bas à droite */}
        <g transform="translate(266 128) scale(1.9)" opacity="0.9">
          <Glyph variant={variant} />
        </g>
      </svg>

      {/* Ligne de scan verte (motif du site) — animée en motion-safe seulement */}
      <div className="meta-illu__scan pointer-events-none absolute inset-x-0 h-px" />

      {/* Étiquette mono en bas */}
      <div className="absolute bottom-2.5 left-3 font-mono text-[10px] uppercase tracking-widest text-ghost-green/70">
        {LABELS[variant]}
      </div>

      {/* Overlay futur (vraie image) */}
      {children}
    </div>
  );
}

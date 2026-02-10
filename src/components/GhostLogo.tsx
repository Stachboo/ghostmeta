/**
 * GhostMeta Logo SVG Component
 * GHOST PROTOCOL — #00ff41 (vert néon)
 * Style : fantôme géométrique angulaire (stealth aircraft)
 */

interface GhostLogoProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

export default function GhostLogo({ size = 40, className = '', glow = false }: GhostLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={glow ? { filter: 'drop-shadow(0 0 8px rgba(0, 255, 65, 0.5))' } : undefined}
    >
      {/* Ghost body - angular stealth shape */}
      <path
        d="M32 4L12 20V48L18 56L24 48L32 56L40 48L46 56L52 48V20L32 4Z"
        stroke="#00ff41"
        strokeWidth="2.5"
        fill="rgba(0, 255, 65, 0.08)"
        strokeLinejoin="bevel"
      />
      {/* Left eye */}
      <rect x="22" y="26" width="7" height="5" rx="1" fill="#00ff41" />
      {/* Right eye */}
      <rect x="35" y="26" width="7" height="5" rx="1" fill="#00ff41" />
      {/* Inner detail lines */}
      <line x1="20" y1="38" x2="44" y2="38" stroke="#00ff41" strokeWidth="0.8" opacity="0.4" />
      <line x1="22" y1="42" x2="42" y2="42" stroke="#00ff41" strokeWidth="0.8" opacity="0.3" />
    </svg>
  );
}

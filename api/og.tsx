import { ImageResponse } from '@vercel/og';

export default function handler() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0a0a0c',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'monospace',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* ── GRID BACKGROUND ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(57,255,20,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(57,255,20,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* ── RADIAL GLOW CENTER ── */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '700px',
            height: '400px',
            background:
              'radial-gradient(ellipse at center, rgba(57,255,20,0.12) 0%, rgba(255,191,0,0.06) 50%, transparent 80%)',
            borderRadius: '50%',
          }}
        />

        {/* ── TOP CORNER DECORATORS ── */}
        <div
          style={{
            position: 'absolute',
            top: '24px',
            left: '24px',
            width: '48px',
            height: '48px',
            borderTop: '2px solid rgba(0,229,255,0.5)',
            borderLeft: '2px solid rgba(0,229,255,0.5)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            width: '48px',
            height: '48px',
            borderTop: '2px solid rgba(0,229,255,0.5)',
            borderRight: '2px solid rgba(0,229,255,0.5)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            width: '48px',
            height: '48px',
            borderBottom: '2px solid rgba(0,229,255,0.5)',
            borderLeft: '2px solid rgba(0,229,255,0.5)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '24px',
            width: '48px',
            height: '48px',
            borderBottom: '2px solid rgba(0,229,255,0.5)',
            borderRight: '2px solid rgba(0,229,255,0.5)',
          }}
        />

        {/* ── SCAN LINE ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(57,255,20,0.6), rgba(0,229,255,0.4), transparent)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '1px',
            background:
              'linear-gradient(90deg, transparent, rgba(57,255,20,0.6), rgba(0,229,255,0.4), transparent)',
          }}
        />

        {/* ── BADGE TOP ── */}
        <div
          style={{
            position: 'absolute',
            top: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(57,255,20,0.08)',
            border: '1px solid rgba(57,255,20,0.2)',
            borderRadius: '999px',
            padding: '6px 16px',
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#39ff14',
              boxShadow: '0 0 8px #39ff14',
            }}
          />
          <span
            style={{
              fontSize: '13px',
              color: '#39ff14',
              letterSpacing: '3px',
              fontWeight: 700,
            }}
          >
            100% LOCAL · ZÉRO SERVEUR
          </span>
        </div>

        {/* ── MAIN TITLE BLOCK ── */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            textAlign: 'center',
            lineHeight: 1,
          }}
        >
          {/* Line 1 — holographic */}
          <span
            style={{
              fontSize: '36px',
              fontWeight: 300,
              letterSpacing: '8px',
              color: 'rgba(0,229,255,0.7)',
              textTransform: 'uppercase',
              textShadow:
                '-2px 0 rgba(255,0,80,0.5), 2px 0 rgba(0,229,255,0.5)',
            }}
          >
            RETIRER LES
          </span>

          {/* Line 2 — core focal point */}
          <span
            style={{
              fontSize: '112px',
              fontWeight: 900,
              letterSpacing: '6px',
              textTransform: 'uppercase',
              background:
                'radial-gradient(ellipse at 40% 50%, #39ff14 0%, #a8ff00 35%, #ffbf00 80%, #ff8c00 100%)',
              backgroundClip: 'text',
              color: 'transparent',
              filter: 'drop-shadow(0 0 30px rgba(57,255,20,0.6)) drop-shadow(0 0 60px rgba(255,191,0,0.3))',
              lineHeight: 1,
            }}
          >
            MÉTADONNÉES
          </span>

          {/* Line 3 — holographic */}
          <span
            style={{
              fontSize: '36px',
              fontWeight: 300,
              letterSpacing: '8px',
              color: 'rgba(0,229,255,0.7)',
              textTransform: 'uppercase',
              textShadow:
                '-2px 0 rgba(255,0,80,0.5), 2px 0 rgba(0,229,255,0.5)',
            }}
          >
            DE VOS PHOTOS
          </span>
        </div>

        {/* ── DIVIDER ── */}
        <div
          style={{
            width: '320px',
            height: '1px',
            marginTop: '32px',
            background:
              'linear-gradient(90deg, transparent, rgba(57,255,20,0.5), rgba(255,191,0,0.3), transparent)',
          }}
        />

        {/* ── BOTTOM BAR ── */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          {/* Logo wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Ghost SVG icon inline */}
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16 2C9.373 2 4 7.373 4 14v14l4-3 4 3 4-3 4 3 4-3V14C24 7.373 18.627 2 16 2z"
                fill="none"
                stroke="#39ff14"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="14" r="2" fill="#39ff14" />
              <circle cx="20" cy="14" r="2" fill="#39ff14" />
            </svg>
            <span
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#ffffff',
                letterSpacing: '2px',
              }}
            >
              Ghost
              <span style={{ color: '#39ff14' }}>Meta</span>
            </span>
          </div>

          <div
            style={{
              width: '1px',
              height: '24px',
              background: 'rgba(255,255,255,0.1)',
            }}
          />

          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '13px',
              color: 'rgba(255,255,255,0.4)',
              letterSpacing: '1px',
            }}
          >
            <span>GPS ✓</span>
            <span>EXIF ✓</span>
            <span>XMP ✓</span>
            <span>IPTC ✓</span>
          </div>

          <div
            style={{
              width: '1px',
              height: '24px',
              background: 'rgba(255,255,255,0.1)',
            }}
          />

          <span
            style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '1px',
            }}
          >
            ghostmeta.online
          </span>
        </div>

        {/* ── HEX DECORATORS LEFT ── */}
        <div
          style={{
            position: 'absolute',
            left: '48px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {['0x4750', '0x5320', '0x4C41'].map((hex) => (
            <span
              key={hex}
              style={{
                fontSize: '11px',
                color: 'rgba(57,255,20,0.25)',
                letterSpacing: '2px',
                fontFamily: 'monospace',
              }}
            >
              {hex}
            </span>
          ))}
        </div>

        {/* ── HEX DECORATORS RIGHT ── */}
        <div
          style={{
            position: 'absolute',
            right: '48px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            alignItems: 'flex-end',
          }}
        >
          {['0xFF14', '0xBF00', '0x00E5'].map((hex) => (
            <span
              key={hex}
              style={{
                fontSize: '11px',
                color: 'rgba(255,191,0,0.25)',
                letterSpacing: '2px',
                fontFamily: 'monospace',
              }}
            >
              {hex}
            </span>
          ))}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // SEC-020 : restreindre CORS à notre domaine uniquement
        'Access-Control-Allow-Origin': 'https://www.ghostmeta.online',
      },
    },
  );
}

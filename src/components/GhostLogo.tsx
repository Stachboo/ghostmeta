import { motion } from 'framer-motion';

const LOGO_URL = "/logo_optimized.webp";

interface GhostLogoProps {
  size?: number;
  glow?: boolean;
  className?: string;
}

export default function GhostLogo({ size = 32, glow = false, className }: GhostLogoProps) {
  return (
    <div className={`relative flex items-center justify-center${className ? ' ' + className : ''}`}>
      {glow && (
        <div className="absolute inset-0 bg-[#00ff41] blur-xl opacity-20 rounded-full" />
      )}
      <motion.img
        src={LOGO_URL}
        alt="GhostMeta Logo"
        style={{ width: size, height: size }}
        className="relative z-10"
        whileHover={{ scale: 1.05 }}
      />
    </div>
  );
}

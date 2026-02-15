import { motion } from 'framer-motion';

const LOGO_URL = "/logo.webp";

interface GhostLogoProps {
  size?: number;
  glow?: boolean;
}

export default function GhostLogo({ size = 32, glow = false }: GhostLogoProps) {
  return (
    <div className="relative flex items-center justify-center">
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

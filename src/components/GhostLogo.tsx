import { motion } from 'framer-motion';

const LOGO_URL = "https://private-us-east-1.manuscdn.com/sessionFile/8huYn2dyWpx9kzHPbMzipj/sandbox/Se7l2axPQPaZFUzuuvo9Se_1770726694646_na1fn_Z2hvc3RtZXRhLWxvZ28.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvOGh1WW4yZHlXcHg5a3pIUGJNemlwai9zYW5kYm94L1NlN2wyYXhQUVBhWkZVenV1dm85U2VfMTc3MDcyNjY5NDY0Nl9uYTFmbl9aMmh2YzNSdFpYUmhMV3h2WjI4LnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=g3GN0ry94-z5uFdw0X5eAqB6VBY0XTMD-SNTqxSbFGtLlngbWezdkm5hXFs3ih1GQY3v-G8TdhyDkptk4wvdXkAkTBCnJQzdL5IEGD2NviJfh0R25bGWN7Ek0ETAjrFSk5dyARaqaaMC~6QvPO8piNhDuRUvTf3HyF-1rRL2SZxs7Z6mUPnGRzOSVehBmsylgRIFtzWpsXJV91c2kJvEo4uPQ~glPIiunVZR4muq14gIG3kKQHy4LqxI682AOdG-ryR3XOTmTVudVsNU4vrxN~e53I84Pum-R4k2fy1YXQ5NoCdRCdWnwz3JtxFOO2mwdZGxHeG3SR14ApiTTk1kGw__";

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

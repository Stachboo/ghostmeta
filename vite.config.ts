import fs from "fs"
import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'sw-cache-buster',
      apply: 'build' as const,
      closeBundle() {
        const swPath = path.resolve(__dirname, 'dist/sw.js');
        if (fs.existsSync(swPath)) {
          const content = fs.readFileSync(swPath, 'utf-8').replace(
            "const CACHE_NAME = 'ghostmeta-v1'",
            `const CACHE_NAME = 'ghostmeta-v${Date.now()}'`
          );
          fs.writeFileSync(swPath, content);
        }
      },
    },
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor React core
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Framer Motion isolé — lourd, chargé séparément
          'vendor-motion': ['framer-motion'],
          // i18n isolé
          'vendor-i18n': ['i18next', 'react-i18next', 'i18next-browser-languagedetector'],
          // UI components
          'vendor-ui': ['lucide-react', '@radix-ui/react-accordion', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tooltip'],
          // JSZip isolé — très lourd
          'vendor-zip': ['jszip'],
        },
      },
    },
    // Augmente le seuil d'avertissement — les chunks sont maintenant splittés
    chunkSizeWarningLimit: 600,
  },
})

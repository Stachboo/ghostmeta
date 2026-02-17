import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [
    react(),
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

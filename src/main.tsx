import { createRoot } from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async';
import App from "./App";
import "./index.css";
import "./i18n";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// Enregistrement du Service Worker (requis par Chrome pour beforeinstallprompt)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {/* silently fail */});
  });
}

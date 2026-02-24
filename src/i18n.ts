import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import fr from './locales/fr/translation.json';
import en from './locales/en/translation.json';

// Guard : valider la valeur stockée avant que i18next la lise
// Si la valeur n'est pas une langue supportée → on purge
const SUPPORTED_LANGS = ['fr', 'en'];
const STORAGE_KEY = 'i18nextLng';

try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && !SUPPORTED_LANGS.includes(stored.split('-')[0])) {
    localStorage.removeItem(STORAGE_KEY);
  }
} catch {
  // localStorage inaccessible (mode privé strict, iframe sandboxé) → silencieux
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en }
    },
    fallbackLng: 'fr',
    supportedLngs: SUPPORTED_LANGS,
    detection: {
      // querystring en premier : les liens hreflang ?lng=en sont honorés immédiatement
      order: ['querystring', 'localStorage', 'navigator'],
      lookupQuerystring: 'lng',
      caches: ['localStorage'],
      lookupLocalStorage: STORAGE_KEY,
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

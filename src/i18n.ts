import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Importation directe des fichiers JSON que nous avons créés
import fr from './locales/fr/translation.json';
import en from './locales/en/translation.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: { translation: fr },
      en: { translation: en }
    },
    lng: "fr", // Langue par défaut
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false // React protège déjà contre les XSS
    }
  });

export default i18n;

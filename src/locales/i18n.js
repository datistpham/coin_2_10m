import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import viLocales from './vi.json';
import enLocales from './en.json';

// ----------------------------------------------------------------------

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      vi : { translations : viLocales},
      en: { translations: enLocales },
    },
    lng: (typeof window !== 'undefined') && (localStorage.getItem('i18nextLng') || 'vi') || "vi",
    fallbackLng: 'en',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;

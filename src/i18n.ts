import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './assets/locales/en/translation.json'
import ptTranslation from './assets/locales/pt/translation.json';

i18n
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		resources: {
			en: { translation: enTranslation },
			pt: { translation: ptTranslation },
		},
		fallbackLng: 'en',
		detection: {
			order: ['path', 'navigator'],
			lookupFromPathIndex: 0,
			caches: ['localStorage', 'cookie'],
		},
		interpolation: { escapeValue: false },
	});

export default i18n;

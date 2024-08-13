import { initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './assets/locales/en/translation.json';
import ptTranslation from './assets/locales/pt/translation.json';
import { LANGKEY } from './components/localization/Localization';

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
			order: ['path', 'localStorage', 'navigator'],
			lookupLocalStorage: LANGKEY,
			caches: ['localStorage'],
		},
		interpolation: { escapeValue: false },
	});

export default i18n;

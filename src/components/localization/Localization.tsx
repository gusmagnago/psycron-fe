import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Select } from '../Select/Select';

import { StyledSelectWrapper } from './Localization.styles';

export const LANGKEY = 'i18nextLng';

export const Localization = () => {
	const { i18n } = useTranslation();
	const { locale } = useParams<{ locale: string }>();
	const navigate = useNavigate();
	const location = useLocation();

	const availableLanguages = [
		{ name: 'EN', value: 'en' },
		{ name: 'PT', value: 'pt' },
	];

	const getBrowserLang = () => {
		const browserLang = navigator.languages
			? navigator.languages[0]
			: navigator.language;
		return browserLang.split('-')[0].toLowerCase();
	};

	const getDefaultLang = () => {
		const storedLang = localStorage.getItem(LANGKEY);
		if (storedLang) {
			return storedLang.toLowerCase();
		} else {
			const browserLang = getBrowserLang();
			if (availableLanguages.some((lang) => lang.value === browserLang)) {
				return browserLang;
			} else {
				return 'en';
			}
		}
	};

	const [defaultLang, setDefaultLang] = useState<string>(getDefaultLang());

	const changeLanguage = (lng: string) => {
		const newLang = lng.toLowerCase();
		i18n.changeLanguage(newLang);
		setDefaultLang(newLang);
		localStorage.setItem(LANGKEY, newLang);

		const newPath = location.pathname.replace(`/${locale}`, `/${newLang}`);
		navigate(newPath);
	};

	useEffect(() => {
		const storedLang = localStorage.getItem(LANGKEY);
		if (storedLang && i18n.language !== storedLang) {
			changeLanguage(storedLang.toLowerCase());
		} else if (locale && i18n.language !== locale) {
			changeLanguage(locale.toLowerCase());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [i18n, locale]);

	return (
		<StyledSelectWrapper>
			<Select
				name='language-select'
				// selectLabel={t('components.header.language')}
				value={defaultLang.split('-')[0]}
				onChangeSelect={(e) => changeLanguage(e.target.value as string)}
				items={availableLanguages}
			/>
		</StyledSelectWrapper>
	);
};

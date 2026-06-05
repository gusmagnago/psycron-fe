import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
	Menu as MuiMenu,
	MenuItem as MuiMenuItem,
	Tooltip as MuiTooltip,
} from '@mui/material';
import { Globe } from '@psycron/components/icons';
import { Select } from '@psycron/components/select/Select';
import Cookies from 'js-cookie';

import { LanguageTrigger, StyledSelectWrapper } from './Localization.styles';
import type { ILocalization } from './Localization.types';

export const LANGKEY = 'i18nextLng';

export const Localization = ({ hasMargin, iconVariant }: ILocalization) => {
	const { i18n, t } = useTranslation();
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
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
		const storedLang = Cookies.get(LANGKEY);
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
		Cookies.set(LANGKEY, newLang, { expires: 7 });

		const newPath = location.pathname.replace(`/${locale}`, `/${newLang}`);
		navigate(newPath);
	};

	useEffect(() => {
		const storedLang = Cookies.get(LANGKEY);
		if (storedLang && i18n.language !== storedLang) {
			changeLanguage(storedLang.toLowerCase());
		} else if (locale && i18n.language !== locale) {
			changeLanguage(locale.toLowerCase());
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [i18n, locale]);

	const currentLang = defaultLang.split('-')[0];

	if (iconVariant) {
		return (
			<>
				<MuiTooltip
					arrow
					placement='right'
					title={t('globals.change-language')}
				>
					<LanguageTrigger
						aria-label={t('globals.change-language')}
						onClick={(e) => {
							e.stopPropagation();
							setAnchorEl(e.currentTarget);
						}}
					>
						<Globe />
					</LanguageTrigger>
				</MuiTooltip>
				<MuiMenu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={() => setAnchorEl(null)}
				>
					{availableLanguages.map((lang) => (
						<MuiMenuItem
							key={lang.value}
							selected={currentLang === lang.value}
							onClick={(e) => {
								e.stopPropagation();
								changeLanguage(lang.value);
								setAnchorEl(null);
							}}
						>
							{lang.name}
						</MuiMenuItem>
					))}
				</MuiMenu>
			</>
		);
	}

	return (
		<StyledSelectWrapper hasMargin={hasMargin}>
			<Select
				name='language-select'
				value={currentLang}
				onChangeSelect={(e) => changeLanguage(e.target.value as string)}
				items={availableLanguages}
			/>
		</StyledSelectWrapper>
	);
};

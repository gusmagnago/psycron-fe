import type { FC } from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { AlertProvider } from '@psycron/context/alert/AlertContext';
import { UserGeoLocationProvider } from '@psycron/context/CountryContext';
import { AuthProvider } from '@psycron/context/user/UserAuthenticationContext';
import { UserDetailsProvider } from '@psycron/context/user/UserDetailsContext';
import i18n from '@psycron/i18n';
import { AnalyticsTracker } from '@psycron/routes/AnalyticsTracker';

export const LanguageLayout: FC = () => {
	const { lang } = useParams<{ lang: string }>();

	const navigate = useNavigate();

	useEffect(() => {
		if (!lang) {
			const resolvedLang = i18n.resolvedLanguage || 'en';
			navigate(`/${resolvedLang}`, { replace: true });
		} else {
			if (i18n.language !== lang) {
				i18n.changeLanguage(lang);
			}
		}
	}, [lang, navigate]);

	return (
		<AlertProvider>
			<AuthProvider>
				<UserDetailsProvider>
					<UserGeoLocationProvider>
						<AnalyticsTracker />
						<Outlet />
					</UserGeoLocationProvider>
				</UserDetailsProvider>
			</AuthProvider>
		</AlertProvider>
	);
};

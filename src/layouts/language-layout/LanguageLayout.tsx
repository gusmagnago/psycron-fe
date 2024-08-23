import type { FC } from 'react';
import { useEffect } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { AlertProvider } from '@psycron/context/alert/AlertContext';
import { UserGeoLocationProvider } from '@psycron/context/CountryContext';
import { AuthProvider } from '@psycron/context/user/auth/UserAuthenticationContext';
import { UserDetailsProvider } from '@psycron/context/user/details/UserDetailsContext';
import i18n from '@psycron/i18n';
import { AnalyticsTracker } from '@psycron/routes/AnalyticsTracker';

export const LanguageLayout: FC = () => {
	const { locale } = useParams<{ locale: string }>();

	useEffect(() => {
		if (locale && i18n.language !== locale) {
			i18n.changeLanguage(locale);
		}
	}, [locale]);

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

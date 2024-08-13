import type { FC } from 'react';
import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { HelmetProvider } from 'react-helmet-async';
import {
	createBrowserRouter,
	Navigate,
	Outlet,
	RouterProvider,
	useLocation,
} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import App from '@psycron/App';
import { AlertProvider } from '@psycron/context/alert/AlertContext';
import { UserGeoLocationProvider } from '@psycron/context/CountryContext';
import { AuthProvider } from '@psycron/context/user/UserAuthenticationContext';
import { UserDetailsProvider } from '@psycron/context/user/UserDetailsContext';
import i18n from '@psycron/i18n';
import { AppLayout } from '@psycron/layouts/app-layout/AppLayout';
import { PublicLayout } from '@psycron/layouts/public-layout/PublicLayout';
import { AuthPage } from '@psycron/pages/auth';
import { NotFound } from '@psycron/pages/error/NotFound';
import { Unsubscribe } from '@psycron/pages/unsubscribe/Unsubscribe';
import {
	HOMEPAGE,
	LOCALISATION,
	SIGNIN,
	SIGNUP,
	UNSUBSCRIBE,
} from '@psycron/pages/urls';

const AnalyticsTracker: FC = () => {
	const location = useLocation();

	useEffect(() => {
		ReactGA.send({
			hitType: 'pageview',
			page: location.pathname + location.search,
			title: document.title,
		});
	}, [location]);

	return null;
};

const LanguageLayout: FC = () => {
	const { lang } = useParams<{ lang: string }>();

	useEffect(() => {
		if (lang && i18n.language !== lang) {
			i18n.changeLanguage(lang);
		}
	}, [lang]);

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

const router = createBrowserRouter([
	{
		path: HOMEPAGE,
		element: <Navigate to={`/${i18n.resolvedLanguage}`} replace />,
	},
	{
		path: LOCALISATION,
		element: <LanguageLayout />,
		children: [
			{
				path: '',
				element: <PublicLayout />,
				children: [
					{ index: true, element: <App /> },
					{ path: UNSUBSCRIBE, element: <Unsubscribe /> },
					{ path: SIGNIN, element: <AuthPage /> },
					{ path: SIGNUP, element: <AuthPage /> },
				],
			},
			{
				path: 'dashboard',
				element: <AppLayout />,
				children: [{ index: true, element: <div>Dashboard Homepage</div> }],
			},
		],
	},
	{
		path: '*',
		element: <NotFound />,
	},
]);

const AppRouter: FC = () => {
	return (
		<HelmetProvider>
			<RouterProvider router={router} />
		</HelmetProvider>
	);
};

export default AppRouter;

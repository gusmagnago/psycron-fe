import type { FC } from 'react';
import { useEffect } from 'react';
import {
	createBrowserRouter,
	Navigate,
	Outlet,
	RouterProvider,
} from 'react-router-dom';
import { useParams } from 'react-router-dom';
import App from '@psycron/App';
import { UserGeoLocationProvider } from '@psycron/context/CountryContext';
import { UserDetailsProvider } from '@psycron/context/user/UserDetailsContext';
import { AppLayout } from '@psycron/layouts/app-layout/AppLayout';

import i18n from '../i18n';

const LanguageLayout: FC = () => {
	const { lang } = useParams<{ lang: string }>();

	useEffect(() => {
		if (lang && i18n.language !== lang) {
			i18n.changeLanguage(lang);
		}
	}, [lang]);

	return (
		<>
			<UserDetailsProvider>
				<UserGeoLocationProvider>
					<Outlet />
				</UserGeoLocationProvider>
			</UserDetailsProvider>
		</>
	);
};

const router = createBrowserRouter([
	{
		path: '/',
		element: <Navigate to={`/${i18n.resolvedLanguage}`} replace />,
	},
	{
		path: '/:lang',
		element: <LanguageLayout />,
		children: [
			{
				element: <AppLayout />,
				children: [
					{ index: true, element: <App /> },
					{ path: 'edit-user/:section', element: <App /> },
				],
			},
		],
	},
]);

const AppRouter: FC = () => {
	return <RouterProvider router={router} />;
};

export default AppRouter;

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
import { AppLayout } from '@psycron/layouts/AppLayout/AppLayout';

import i18n from '../i18n';

const LanguageLayout: FC = () => {
	const { lang } = useParams<{ lang: string }>();
    
	useEffect(() => {
		if (lang && i18n.language !== lang) {
			i18n.changeLanguage(lang);
		}
	}, [lang]);

	return <Outlet />;
};

export const router = createBrowserRouter([
	{
		path: '/',
		element: <Navigate to={`/${i18n.resolvedLanguage}`} replace />,
	},
	{
		path: '/:lang',
		element: (
			<AppLayout>
				<LanguageLayout />
			</AppLayout>
		),
		children: [
			{
				index: true,
				element: <App />,
			},
		],
	},
]);

const AppRouter: FC = () => {
	return <RouterProvider router={router} />;
};

export default AppRouter;

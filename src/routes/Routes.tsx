import { createBrowserRouter, Navigate } from 'react-router-dom';
import i18n from '@psycron/i18n';
import { LanguageLayout } from '@psycron/layouts/language-layout/LanguageLayout';
import { NotFound } from '@psycron/pages/error/NotFound';
import { HOMEPAGE, LOCALISATION } from '@psycron/pages/urls';

import privateRoutes from './PrivateRoutes';
import publicRoutes from './PublicRoutes';

const router = createBrowserRouter([
	{
		path: HOMEPAGE,
		element: <Navigate to={`/${i18n.resolvedLanguage}`} replace />,
	},
	{
		path: LOCALISATION,
		element: <LanguageLayout />,
		children: [...publicRoutes, ...privateRoutes],
	},
	{
		path: '*',
		element: <NotFound />,
	},
]);

export default router;

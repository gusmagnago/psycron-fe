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

import { HOMEPAGE, LOCALISATION, SIGNIN, SIGNUP } from '@psycron/pages/urls';

import { AuthPage } from '@psycron/pages/auth';
import { AuthProvider } from '@psycron/context/user/UserAuthenticationContext';
import { PublicLayout } from '@psycron/layouts/public-layout/PublicLayout';
import { HelmetProvider } from 'react-helmet-async';
import i18n from '@psycron/i18n';

const LanguageLayout: FC = () => {
  const { lang } = useParams<{ lang: string }>();

  useEffect(() => {
    if (lang && i18n.language !== lang) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  return (
    <>
      <AuthProvider>
        <UserDetailsProvider>
          <UserGeoLocationProvider>
            <Outlet />
          </UserGeoLocationProvider>
        </UserDetailsProvider>
      </AuthProvider>
    </>
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
]);

const AppRouter: FC = () => {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
};

export default AppRouter;

import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { Loader } from './components/loader/Loader';
import { AppLayout } from './layouts/app-layout/AppLayout';
import { LanguageLayout } from './layouts/language-layout/LanguageLayout';
import { PublicLayout } from './layouts/public-layout/PublicLayout';
import { LOCALISATION } from './pages/urls';
import privateRoutes from './routes/PrivateRoutes';
import publicRoutes from './routes/PublicRoutes';
import i18n from './i18n';

const App = () => (
	<HelmetProvider>
		<BrowserRouter>
			<Suspense fallback={<Loader />}>
				<Routes>
					<Route
						path='/'
						element={<Navigate to={`/${i18n.resolvedLanguage}`} replace />}
					/>
					<Route path={LOCALISATION} element={<LanguageLayout />}>
						<Route element={<PublicLayout />}>
							{publicRoutes.map(({ path, element }, index) => (
								<Route path={path} element={element} key={index} />
							))}
						</Route>
						<Route element={<AppLayout />}>
							{privateRoutes.map(({ path, element }, index) => (
								<Route path={path} element={element} key={index} />
							))}
						</Route>
					</Route>
				</Routes>
			</Suspense>
		</BrowserRouter>
	</HelmetProvider>
);

export default App;

import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader } from '@psycron/components/loader/Loader';
import { AppLayout } from '@psycron/layouts/app/app-layout/AppLayout';
import { BackofficeLayout } from '@psycron/layouts/backoffice/BackooficeLayout';
import { LanguageLayout } from '@psycron/layouts/language-layout/LanguageLayout';
import { WorkerAppProviders } from '@psycron/layouts/providers/WorkerAppProviders';
import { PublicLayout } from '@psycron/layouts/public-layout/PublicLayout';
import { NotFound } from '@psycron/pages/error/not-found/NotFound';

import privateRoutes from './PrivateRoutes';
import publicRoutes from './PublicRoutes';
import { RootRedirect } from './RootRedirect';
import workerRoutes from './WorkerRoutes';

const Router = () => {
	return (
		<HelmetProvider>
			<Suspense fallback={<Loader />}>
				<Routes>
					<Route path='/' element={<RootRedirect />} />
					<Route
						path='/availability/workflow'
						element={<Navigate replace to='/en/availability/workflow' />}
					/>
					<Route path='/:locale' element={<LanguageLayout />}>
						<Route element={<PublicLayout />}>
							{publicRoutes.map(({ path, element }, index) => (
								<Route key={index} path={path} element={element} />
							))}
							<Route path='*' element={<NotFound />} />
						</Route>
						<Route element={<WorkerAppProviders />}>
							<Route element={<BackofficeLayout />}>
								{workerRoutes.map(({ path, element }, index) => (
									<Route key={index} path={path} element={element} />
								))}
							</Route>
						</Route>
						<Route element={<AppLayout />}>
							{privateRoutes.map(({ path, element }, index) => (
								<Route key={index} path={path} element={element} />
							))}
							<Route path='*' element={<NotFound />} />
						</Route>
					</Route>
					<Route path='*' element={<NotFound />} />
				</Routes>
			</Suspense>
		</HelmetProvider>
	);
};

export default Router;

import { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader } from '@psycron/components/loader/Loader';
import { AppLayout } from '@psycron/layouts/app/app-layout/AppLayout';
import { BackofficeLayout } from '@psycron/layouts/backoffice/BackooficeLayout';
import { LanguageLayout } from '@psycron/layouts/language-layout/LanguageLayout';
import { WorkerAppProviders } from '@psycron/layouts/providers/WorkerAppProviders';
import { PublicLayout } from '@psycron/layouts/public-layout/PublicLayout';
import { AvailabilityComponentsPreview } from '@psycron/pages/availability/preview/AvailabilityComponentsPreview';
import { NotFound } from '@psycron/pages/error/not-found/NotFound';
import { PREVIEW } from '@psycron/pages/urls';

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
					<Route
						path='/preview-2'
						element={<Navigate replace to='/en/preview-2' />}
					/>
					<Route
						path='/preview'
						element={<Navigate replace to='/en/preview' />}
					/>
					<Route path='/:locale' element={<LanguageLayout />}>
						{/* Dev-only component catalog. Mounted here, outside AppLayout,
						    so it renders without auth or the availability gate. */}
						<Route path={PREVIEW} element={<AvailabilityComponentsPreview />} />
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

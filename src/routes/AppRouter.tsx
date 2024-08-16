import { type FC, Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { RouterProvider } from 'react-router-dom';
import { Loader } from '@psycron/components/loader/Loader';

import router from './Routes';

const AppRouter: FC = () => {
	return (
		<HelmetProvider>
			<Suspense fallback={<Loader />}>
				<RouterProvider router={router} />
			</Suspense>
		</HelmetProvider>
	);
};

export default AppRouter;

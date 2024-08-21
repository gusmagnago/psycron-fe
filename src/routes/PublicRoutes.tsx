import App from '@psycron/App';
import { PublicLayout } from '@psycron/layouts/public-layout/PublicLayout';
import { AuthPage } from '@psycron/pages/auth';
import { Testing } from '@psycron/pages/testing/indext';
import { Unsubscribe } from '@psycron/pages/unsubscribe/Unsubscribe';
import { SIGNIN, SIGNUP, UNSUBSCRIBE } from '@psycron/pages/urls';

const publicRoutes = [
	{
		path: '',
		element: <PublicLayout />,
		children: [
			{ index: true, element: <App /> },
			{ path: UNSUBSCRIBE, element: <Unsubscribe /> },
			{ path: SIGNIN, element: <AuthPage /> },
			{ path: SIGNUP, element: <AuthPage /> },
			{ path: 'testing', element: <Testing /> },
		],
	},
];

export default publicRoutes;

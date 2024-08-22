import App from '@psycron/App';
import { PublicLayout } from '@psycron/layouts/public-layout/PublicLayout';
import { AuthPage } from '@psycron/pages/auth';
import { ResetPassword } from '@psycron/pages/auth/password/ResetPassword';
import { Unsubscribe } from '@psycron/pages/unsubscribe/Unsubscribe';
import { REQPASSRESET, SIGNIN, SIGNUP, UNSUBSCRIBE } from '@psycron/pages/urls';

const publicRoutes = [
	{
		path: '',
		element: <PublicLayout />,
		children: [
			{ index: true, element: <App /> },
			{ path: UNSUBSCRIBE, element: <Unsubscribe /> },
			{ path: SIGNIN, element: <AuthPage /> },
			{ path: SIGNUP, element: <AuthPage /> },
			{ path: REQPASSRESET, element: <ResetPassword /> },
		],
	},
];

export default publicRoutes;

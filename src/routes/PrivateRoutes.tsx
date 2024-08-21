import { Navigate } from 'react-router-dom';
import { useAuth } from '@psycron/context/user/auth/UserAuthenticationContext';
import { AppLayout } from '@psycron/layouts/app-layout/AppLayout';
import { Dashboard } from '@psycron/pages/dashboard/Dashboard';
import { DASHBOARD, SIGNIN } from '@psycron/pages/urls';

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
	const isAuthenticated = useAuth();
	return isAuthenticated ? element : <Navigate to={SIGNIN} />;
};

const privateRoutes = [
	{
		path: DASHBOARD,
		element: <PrivateRoute element={<AppLayout />} />,
		children: [{ index: true, element: <Dashboard /> }],
	},
];

export default privateRoutes;

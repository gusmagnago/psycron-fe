import { Navigate } from 'react-router-dom';
import { useAuth } from '@psycron/context/user/UserAuthenticationContext';
import { AppLayout } from '@psycron/layouts/app-layout/AppLayout';
import { SIGNIN } from '@psycron/pages/urls';

const PrivateRoute = ({ element }: { element: JSX.Element }) => {
	const isAuthenticated = useAuth();
	return isAuthenticated ? element : <Navigate to={SIGNIN} />;
};

const privateRoutes = [
	{
		path: 'dashboard',
		element: <PrivateRoute element={<AppLayout />} />,
		children: [{ index: true, element: <div>Dashboard Homepage</div> }],
	},
];

export default privateRoutes;

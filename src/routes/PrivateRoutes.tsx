import { Dashboard } from '@psycron/pages/dashboard/Dashboard';
import { DASHBOARD, EDITUSER } from '@psycron/pages/urls';
import { EditUser } from '@psycron/pages/user/edit-user/EditUser';

const privateRoutes = [
	{
		path: DASHBOARD,
		element: <Dashboard />,
	},
	{ path: EDITUSER, element: <EditUser /> },
];

export default privateRoutes;

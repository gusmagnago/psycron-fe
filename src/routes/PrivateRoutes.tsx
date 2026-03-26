import { AvailabilitySettings } from '@psycron/pages/availability/availability-settings/AvailabilitySettings';
import { GenerateAvailability } from '@psycron/pages/availability/GenerateAvailability';
import { AvailabilityCalendarPage } from '@psycron/pages/availability/page-calendar/AvailabilityCalendarPage';
import { AvailabilityWeekPage } from '@psycron/pages/availability/week/AvailabilityWeekPage';
import { Dashboard } from '@psycron/pages/dashboard/Dashboard';
import {
	AVAILABILITYGENERATE,
	AVAILABILITYPATH,
	AVAILABILITYSETTINGS,
	AVAILABILITYWEEK,
	CHANGEPASSWORD,
	DASHBOARD,
	EDITUSER,
	EDITUSERBYSESSION,
	USERDETAILS,
} from '@psycron/pages/urls';
// import { AddPatient } from '@psycron/pages/user/appointment/add-patient/AddPatient';
// import { CancelAppointment } from '@psycron/pages/user/appointment/cancel/CancelAppointment';
import { UserDetailsPage } from '@psycron/pages/user/details/UserDetailsPage';
import { EditPassword } from '@psycron/pages/user/edit-password/EditPassword';
import { EditUser } from '@psycron/pages/user/edit-user/EditUser';

const privateRoutes = [
	{
		path: DASHBOARD,
		element: <Dashboard />,
	},
	{ path: USERDETAILS, element: <UserDetailsPage /> },
	{ path: EDITUSER, element: <EditUser /> },
	{ path: EDITUSERBYSESSION, element: <EditUser /> },
	{ path: CHANGEPASSWORD, element: <EditPassword /> },
	{ path: AVAILABILITYPATH, element: <AvailabilityCalendarPage /> },
	{ path: AVAILABILITYWEEK, element: <AvailabilityWeekPage /> },
	{ path: AVAILABILITYGENERATE, element: <GenerateAvailability /> },
	{ path: AVAILABILITYSETTINGS, element: <AvailabilitySettings /> },
	// { path: `${APPOINTMENTS}/cancel/:patientId`, element: <CancelAppointment /> },
	// { path: ADDPATIENT, element: <AddPatient /> },
];

export default privateRoutes;

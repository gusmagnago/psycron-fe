import { Navigate } from 'react-router-dom';
import { ActionCenterPage } from '@psycron/pages/action-center/ActionCenterPage';
import { AvailabilitySettings } from '@psycron/pages/availability/availability-settings/AvailabilitySettings';
import { GenerateAvailability } from '@psycron/pages/availability/GenerateAvailability';
import { AvailabilityCalendarPage } from '@psycron/pages/availability/page-calendar/AvailabilityCalendarPage';
import { AvailabilityWeekPage } from '@psycron/pages/availability/week/AvailabilityWeekPage';
import { Dashboard } from '@psycron/pages/dashboard/Dashboard';
import { NotificationsPage } from '@psycron/pages/notifications/NotificationsPage';
import { PatientProfilePage } from '@psycron/pages/patients/patient-details/PatientProfilePage';
import { PatientListPage } from '@psycron/pages/patients/PatientListPage';
import { PracticeImportReview } from '@psycron/pages/practice-import/PracticeImportReview';
import {
	ACTIONCENTER,
	AGENDA,
	APPOINTMENTS,
	AVAILABILITYGENERATE,
	AVAILABILITYPATH,
	AVAILABILITYRECOVERY,
	AVAILABILITYSETTINGS,
	AVAILABILITYWEEK,
	CHANGEPASSWORD,
	CONFLICTS,
	DASHBOARD,
	EDITUSER,
	EDITUSERBYSESSION,
	NOTIFICATIONS,
	NOTIFICATIONSETTINGS,
	PATIENTPROFILE,
	PATIENTS,
	PRACTICEIMPORT,
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
	{ path: ACTIONCENTER, element: <ActionCenterPage /> },
	{ path: CONFLICTS, element: <ActionCenterPage initialTab='conflicts' /> },
	{ path: NOTIFICATIONS, element: <NotificationsPage /> },
	{ path: NOTIFICATIONSETTINGS, element: <NotificationsPage initialSettingsOpen /> },
	{ path: APPOINTMENTS, element: <Navigate replace to={`../${AVAILABILITYPATH}`} /> },
	{ path: AGENDA, element: <Navigate replace to={`../${AVAILABILITYPATH}`} /> },
	{ path: PATIENTS, element: <PatientListPage /> },
	{ path: PATIENTPROFILE, element: <PatientProfilePage /> },
	{ path: USERDETAILS, element: <UserDetailsPage /> },
	{ path: EDITUSER, element: <EditUser /> },
	{ path: EDITUSERBYSESSION, element: <EditUser /> },
	{ path: CHANGEPASSWORD, element: <EditPassword /> },
	{ path: AVAILABILITYPATH, element: <AvailabilityCalendarPage /> },
	{ path: AVAILABILITYRECOVERY, element: <ActionCenterPage initialTab='recovery' /> },
	{ path: AVAILABILITYWEEK, element: <AvailabilityWeekPage /> },
	{ path: AVAILABILITYGENERATE, element: <GenerateAvailability /> },
	{ path: AVAILABILITYSETTINGS, element: <AvailabilitySettings /> },
	{ path: PRACTICEIMPORT, element: <PracticeImportReview /> },
	// { path: `${APPOINTMENTS}/cancel/:patientId`, element: <CancelAppointment /> },
	// { path: ADDPATIENT, element: <AddPatient /> },
];

export default privateRoutes;

// MAIN
export const DOMAIN = 'https://psycron.app';
export const HOMEPAGE = '';
export const LOCALISATION = ':locale';
export const BASE_API_URL = 'https://api.psycron.app/api/v1/';

// ID
export const USERID = ':userId';
export const PATIENTID = ':patientId';
export const APPOINTMENTID = ':appointmentId';
export const THERAPISTID = ':therapistId';

// PUBLIC
// AUTH
export const SIGNIN = 'sign-in';
export const SIGNUP = 'sign-up';
export const LOGOUT = 'logout';
export const REQPASSRESET = 'reset-password';
export const PASSRESET = 'password-reset/:token';
export const VERIFYEMAIL = 'auth/verify-email';
export const AUTHCALLBACK = 'auth/callback';

// UNSUBSCRIBE
export const UNSUBSCRIBE = ':token/unsubscribe';

// PRIVATE
export const DASHBOARD = 'dashboard';
export const BACKOFFICE = 'backoffice';
// PRIVATE - USER
export const USERDETAILS = USERID;
export const EDITUSERPATH = 'edit';
export const EDITUSER = `${EDITUSERPATH}/${USERID}`;
export const EDITUSERBYSESSION = `${EDITUSER}/:session`;
export const CHANGEPASSWORD = `${EDITUSER}/password`;
export const PATIENTS = 'patients';
export const PAYMENTS = 'payments';
export const AVAILABILITYPATH = 'availability';
export const APPOINTMENTS = 'appointments';
export const APPOINTMENT = 'appointment';
export const APPOINTMENTCONFIRMATION = `${APPOINTMENT}-confirmation`;

export const AVAILABILITY = `${AVAILABILITYPATH}/${USERID}`;
export const AVAILABILITYWIZARD = `${AVAILABILITYPATH}/create`;
export const AVAILABILITYGENERATE = `${AVAILABILITYPATH}/generate`;
export const AVAILABILITYWEEK_BASE = `${AVAILABILITYPATH}/week`;
export const AVAILABILITYWEEK = `${AVAILABILITYWEEK_BASE}/:date`;
export const AGENDA = 'agenda';
export const BOOKAPPOINTMENT = `${USERID}/book-appointment`;
export const PATIENTEDITAPPOINTMENT = 'book-appointment';
export const APPOINTMENTCONFIRMATIONPATH = `${THERAPISTID}/${PATIENTID}/${APPOINTMENTCONFIRMATION}`;
export const RESCHEDULEAPPOINTMENT = `${DOMAIN}/${APPOINTMENTID}/edit-appointment`;
export const PATIENTAPPOINTMENTSLIST = `${PATIENTID}/${APPOINTMENTS}`;

export const ADDPATIENT = 'patient/create';

export const PRIVACY_POLICY = 'privacy-policy';
export const TERMS_OF_SERVICE = 'terms-of-use';
export const MARKETING_COMMS = 'marketing-communications';

export const externalUrls = (locale: string) => ({
	PRIVACY: `${DOMAIN}/${locale}/${PRIVACY_POLICY}`,
	TERMS: `${DOMAIN}/${locale}/${TERMS_OF_SERVICE}`,
	MARKETING: `${DOMAIN}/${locale}/${MARKETING_COMMS}`,
});

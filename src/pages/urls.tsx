// MAIN
export const DOMAIN = 'https://psycron.app';
export const HOMEPAGE = '';
export const LOCALISATION = ':locale';
export const BASE_API_URL = 'https://api.psycron.app/api/v1/';

// PUBLIC
// AUTH
export const SIGNIN = 'sign-in';
export const SIGNUP = 'sign-up';
export const LOGOUT = 'logout';
export const REQPASSRESET = 'reset-password';
export const PASSRESET = 'password-reset/:token';

// UNSUBSCRIBE
export const UNSUBSCRIBE = ':token/unsubscribe';

// PRIVATE
export const DASHBOARD = 'dashboard';
// PRIVATE - USER
export const EDITUSERPATH = 'edit';
export const EDITUSER = 'edit/:userId';
export const EDITUSERBYSESSION = `${EDITUSER}/:session`;
export const CHANGEPASSWORD = `${EDITUSER}/password`;

export const PATIENTS = 'patients';
export const PAYMENTS = 'payments';
export const APPOINTMENTS = 'appointments';

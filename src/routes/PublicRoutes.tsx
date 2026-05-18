import { AuthPage } from '@psycron/pages/auth';
import { AuthCallback } from '@psycron/pages/auth/callback/AuthCallback';
import { ChangePassword } from '@psycron/pages/auth/password/ChangePassword';
import { ResetPassword } from '@psycron/pages/auth/password/ResetPassword';
import { VerifyEmail } from '@psycron/pages/auth/verification/email/VerifyEmail';
import { WhatsAppOtpChallenge } from '@psycron/pages/auth/whatsapp-otp/WhatsAppOtpChallenge';
import { TestHomePage } from '@psycron/pages/back-office/home/TestHomePage';
import { Unsubscribe } from '@psycron/pages/unsubscribe/Unsubscribe';
import { UnsubscribePreferences } from '@psycron/pages/unsubscribe-preferences/UnsubscribePreferences';
import {
	APPOINTMENTCONFIRMATIONPATH,
	AUTHCALLBACK,
	BOOKAPPOINTMENT,
	HOMEPAGE,
	PASSRESET,
	PATIENTAPPOINTMENTSLIST,
	REQPASSRESET,
	SIGNIN,
	SIGNUP,
	UNSUBSCRIBE,
	UNSUBSCRIBE_PREFERENCES,
	VERIFYEMAIL,
	WHATSAPP_OTP_CHALLENGE,
} from '@psycron/pages/urls';
import { BookAppointment } from '@psycron/pages/user/appointment/booking/BookAppointment';
import { AppointmentConfirmation } from '@psycron/pages/user/appointment/confirmation/AppointmentConfirmation';
import { AppointmentsList } from '@psycron/pages/user/appointment/list/patient/AppointmentsList';

const publicRoutes = [
	{ path: HOMEPAGE, element: <TestHomePage /> },
	{ path: UNSUBSCRIBE, element: <Unsubscribe /> },
	{ path: UNSUBSCRIBE_PREFERENCES, element: <UnsubscribePreferences /> },
	{ path: SIGNIN, element: <AuthPage /> },
	{ path: SIGNUP, element: <AuthPage /> },
	{ path: AUTHCALLBACK, element: <AuthCallback /> },
	{ path: VERIFYEMAIL, element: <VerifyEmail /> },
	{ path: WHATSAPP_OTP_CHALLENGE, element: <WhatsAppOtpChallenge /> },
	{ path: REQPASSRESET, element: <ResetPassword /> },
	{ path: PASSRESET, element: <ChangePassword /> },
	{ path: BOOKAPPOINTMENT, element: <BookAppointment /> },
	{ path: APPOINTMENTCONFIRMATIONPATH, element: <AppointmentConfirmation /> },
	{ path: PATIENTAPPOINTMENTSLIST, element: <AppointmentsList /> },
];

export default publicRoutes;

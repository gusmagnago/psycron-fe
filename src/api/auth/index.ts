import type {
	IRefreshToken,
	ISignInForm,
	ISignInResponse,
	IVerifyEmailResponse,
} from '@psycron/components/form/SignIn/SignIn.types';
import type { ISignUpForm } from '@psycron/components/form/SignUp/SignUpEmail.types';
import type {
	IResetPass,
	IResetPassResponse,
} from '@psycron/pages/auth/password/ChangePassword.types';
import type {
	IEmailForm,
	IEmailResponse,
} from '@psycron/pages/auth/password/ResetPassword.types';

import apiClient from '../axios-instance';

import { mapSignUpFormToRegisterPayload } from './utils/auth-utils';
import type { RegisterResponse, SessionResponse } from './index.types';

export const signUpFc = async (
	data: ISignUpForm
): Promise<RegisterResponse> => {
	const payload = mapSignUpFormToRegisterPayload(data);

	const response = await apiClient.post<RegisterResponse>(
		'/users/register',
		payload
	);

	return response.data;
};

export const signInFc = async (data: ISignInForm): Promise<ISignInResponse> => {
	const response = await apiClient.post<ISignInResponse>('/users/login', data);
	return response.data;
};

export const logoutFc = async (): Promise<void> => {
	await apiClient.post('/users/logout');
};

export const getSession = async (): Promise<SessionResponse> => {
	const response = await apiClient.get<SessionResponse>('/users/session');
	return response.data;
};

export const requestPassReset = async (
	data: IEmailForm
): Promise<IEmailResponse> => {
	const response = await apiClient.post('/users/request-password-reset', data);
	return response.data;
};

export const resetPassword = async (
	data: IResetPass
): Promise<IResetPassResponse> => {
	const { token, password, confirmPassword } = data;

	const response = await apiClient.post(`/users/password-reset/${token}`, {
		password,
		confirmPassword,
	});
	return response.data;
};

export const refreshTokenService = async (
	refreshToken: string
): Promise<IRefreshToken> => {
	const { data } = await apiClient.post<IRefreshToken>('/token/refresh-token', {
		refreshToken,
	});

	return data;
};

export const requestEmailVerification = async (email: string): Promise<void> => {
	await apiClient.post('/users/request-email-verification', { email });
};

export const verifyEmail = async (
	token: string
): Promise<IVerifyEmailResponse> => {
	const { data } = await apiClient.post<IVerifyEmailResponse>(
		'/users/verify-email',
		{
			token,
		}
	);

	return data;
};

export const getGoogleCalendarConnectUrl = async (params: {
	locale: string;
	returnTo: string;
}): Promise<{ url: string }> => {
	const response = await apiClient.get<{ url: string }>(
		'/auth/google/calendar',
		{ params }
	);
	return response.data;
};

export type GoogleCalendarStatus = {
	calendarId?: string;
	connected: boolean;
	lastSyncAt?: string;
	syncEnabled: boolean;
};

export const getGoogleCalendarStatus =
	async (): Promise<GoogleCalendarStatus> => {
		const response = await apiClient.get<GoogleCalendarStatus>(
			'/auth/google/calendar/status'
		);
		return response.data;
	};

export type CalendarItem = {
	backgroundColor?: string;
	id: string;
	primary: boolean;
	summary: string;
};

export const getGoogleCalendarList = async (): Promise<CalendarItem[]> => {
	const response = await apiClient.get<{ calendars: CalendarItem[] }>(
		'/auth/google/calendar/list'
	);
	return response.data.calendars;
};

export const selectGoogleCalendar = async (
	calendarId: string
): Promise<void> => {
	await apiClient.patch('/auth/google/calendar/select', { calendarId });
};

export const disconnectGoogleCalendar = async (): Promise<void> => {
	await apiClient.delete('/auth/google/calendar');
};

export const toggleGoogleCalendarSync = async (
	enabled: boolean
): Promise<void> => {
	await apiClient.post('/auth/google/calendar/toggle', { enabled });
};

export const syncGoogleCalendar = async (): Promise<GoogleCalendarStatus> => {
	const response = await apiClient.post<{ status: string } & GoogleCalendarStatus>(
		'/auth/google/calendar/sync'
	);
	return response.data;
};

export type VerifyWhatsAppOtpResponse = {
	refreshToken: string;
	status: 'success';
	token: string;
	user: { _id: string; firstName: string; lastName: string; role: string };
};

export const verifyWhatsAppOtpFc = async (data: {
	otp: string;
	therapistId: string;
}): Promise<VerifyWhatsAppOtpResponse> => {
	const response = await apiClient.post<VerifyWhatsAppOtpResponse>(
		'/users/whatsapp-otp/verify',
		data
	);
	return response.data;
};

/**
 * @deprecated getEncryptionKey removed for security (P1.3)
 * The encryption key endpoint was removed from the backend.
 * Use useSecureStorage without encryption for non-sensitive IDs.
 */

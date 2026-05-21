import type { ITherapist } from '@psycron/context/user/auth/UserAuthenticationContext.types';

export type RegisterRequestPayload = {
	consent: ConsentPayload;
	// Service expects this:
	contacts: { email: string };

	// Controller expects these:
	email: string;
	firstName: string;

	lastName: string;

	password: string;
	stayConnected?: boolean;

	timeZone?: string;
};

export type SessionResponse = {
	isAuthenticated: boolean;
	user: ITherapist;
};

export type RegisterNeedsVerification = {
	message: string;
	status: 'success';
};

export type RegisterLoggedIn = {
	message: string;
	refreshToken: string;
	status: 'success';
	token: string;
};

export type RegisterResponse = RegisterNeedsVerification | RegisterLoggedIn;

export type ConsentPayload = {
	dataProcessingAccepted?: boolean;
	marketingEmailsAccepted?: boolean;
	privacyPolicyAccepted: boolean;
	termsAccepted: boolean;
};

export type SignUpLocalRequest = {
	authProvider?: 'local';
	consent: ConsentPayload;
	// Service/DTO-friendly (keep for future + internal consistency):
	contacts: { email: string };

	// Controller expects:
	email: string;
	firstName: string;

	lastName: string;

	password: string;
	stayConnected?: boolean;

	timeZone?: string;
};

export type SignUpRequest = SignUpLocalRequest;

export type RefreshTokenResponse = {
	accessToken: string;
	refreshToken: string;
};

export type RefreshTokenPayload = {
	refreshToken: string;
};

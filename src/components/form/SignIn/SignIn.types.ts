import type { SubmitHandler } from 'react-hook-form';

export interface ISignInForm {
	email: string;
	password: string;
	stayConnected?: boolean;
}

export type SignInFormTypes = {
	onSubmit: SubmitHandler<ISignInForm>;
};

export type ISignInResponse =
	| {
			mode?: never;
			refreshToken: string;
			status: 'success';
			token: string;
			user: { email: string; id: string };
	  }
	| {
			mode: 'whatsapp_challenge';
			refreshToken?: never;
			status: 'success';
			therapistId: string;
			token?: never;
			user?: never;
	  };

export interface IRefreshToken {
	accessToken: string;
	refreshToken: string;
}

export interface IVerifyEmailResponse {
	message: string;
	status: 'success' | 'error';
}

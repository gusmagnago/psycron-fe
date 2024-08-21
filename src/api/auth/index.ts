import type {
	ISignInForm,
	ISignInResponse,
} from '@psycron/components/form/SignIn/SignIn.types';
import type { ISignUpForm } from '@psycron/components/form/SignUp/SignUp.types';

import apiClient from '../axios-instance';

export const signInFc = async (data: ISignInForm): Promise<ISignInResponse> => {
	const response = await apiClient.post<ISignInResponse>('/users/login', data);
	return response.data;
};

export const signUpFc = async (data: ISignUpForm): Promise<ISignInResponse> => {
	const response = await apiClient.post<ISignInResponse>(
		'/users/register',
		data
	);

	return response.data;
};

export const logoutFc = async (): Promise<void> => {
	await apiClient.post('/users/logout');
};

export const getSession = async (): Promise<{ isAuthenticated: boolean }> => {
	const response = await apiClient.get('/users/session');
	return response.data;
};

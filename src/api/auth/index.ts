import type {
	ISignInForm,
	ISignInResponse,
} from '@psycron/components/form/SignIn/SignIn.types';
import type { ISignUpForm } from '@psycron/components/form/SignUp/SignUp.types';
import axios from 'axios';

export const signInFc = async (data: ISignInForm): Promise<ISignInResponse> => {
	const response = await axios.post<ISignInResponse>(
		'http://localhost:2008/api/v1/users/login',
		data
	);
	return response.data;
};

export const signUpFc = async (data: ISignUpForm): Promise<ISignInResponse> => {
	const response = await axios.post<ISignInResponse>(
		'http://localhost:2008/api/v1/users/register',
		data
	);
	return response.data;
};

export const logoutFc = async (): Promise<void> => {
	await axios.post('http://localhost:2008/api/v1/users/logout');
};

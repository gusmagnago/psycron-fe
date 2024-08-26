import type { ITherapist } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import apiClient from '../axios-instance';

export interface IGetUserByIdResponse {
	user: ITherapist;
}

export const getUserById = async (userId: string): Promise<ITherapist> => {
	const response = await apiClient.get<IGetUserByIdResponse>(
		`/users/${userId}`
	);

	return response.data.user;
};

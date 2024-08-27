import type { ITherapist } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import apiClient from '../axios-instance';

export interface IUserByIdResponse {
	user: ITherapist;
}

export interface IEditUser {
	data: Partial<ITherapist>;
	userId: string;
}

export const getUserById = async (userId: string): Promise<ITherapist> => {
	const response = await apiClient.get<IUserByIdResponse>(`/users/${userId}`);

	return response.data.user;
};

export const editUserById = async ({
	data,
	userId,
}: IEditUser): Promise<IUserByIdResponse> => {
	const response = await apiClient.post<IUserByIdResponse>(
		`/users/edit/${userId}`,
		data
	);

	return response.data;
};

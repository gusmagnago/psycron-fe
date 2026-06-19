import type { ITherapist } from '@psycron/context/user/auth/UserAuthenticationContext.types';

import apiClient from '../axios-instance';

import type {
	DateInfoParams,
	IAvailabilityResponse,
	IChangePass,
	IEditUser,
	IPaginatedAvailability,
	IResponse,
	IUserByIdResponse,
} from './index.types';

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

export const resyncGoogleProfile = async (
	userId: string
): Promise<IUserByIdResponse> => {
	const response = await apiClient.post<IUserByIdResponse>(
		`/users/${userId}/google/resync`
	);

	return response.data;
};

export const changePassword = async ({ data, userId }: IChangePass) => {
	const response = await apiClient.post<IResponse>(
		`/users/password-change/${userId}`,
		data
	);

	return response.data;
};

export const getTherapistLatestAvailability = async (therapistId: string): Promise<IAvailabilityResponse> => {
	const response = await apiClient.get<IAvailabilityResponse>(
		`/users/${therapistId}/availability?latest=true`
	);
	return response.data;
};

export const getAvailabilityCalendar = async (
	therapistId: string,
	params?: { from?: string; to?: string }
): Promise<IAvailabilityResponse> => {
	const response = await apiClient.get<IAvailabilityResponse>(
		`/users/${therapistId}/availability`,
		{ params: { latest: 'true', ...params } }
	);
	return response.data;
};

export const getAvailabilityByDayId = async (
	therapistId: string,
	params: DateInfoParams
) => {
	const response = await apiClient.get<IPaginatedAvailability>(
		`/users/${therapistId}/availability/by-day`,
		{
			params: {
				dayId: params.dateId,
				cursor: params.cursor,
			},
		}
	);

	return response.data;
};

export const deleteUserById = async (userId: string): Promise<IResponse> => {
	const response = await apiClient.delete<IResponse>(`/users/delete/${userId}`);
	return response.data;
};

export const exportUserDataById = async (userId: string): Promise<Blob> => {
	const response = await apiClient.get(`/users/${userId}/export`, {
		responseType: 'blob',
	});

	return response.data as Blob;
};

export const updateMarketingConsent = async (
	userId: string,
	granted: boolean
) => {
	return await apiClient.post(`/users/${userId}/consent`, {
		consentType: 'marketingEmailsAccepted',
		granted,
	});
};

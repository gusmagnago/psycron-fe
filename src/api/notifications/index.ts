import apiClient from '@psycron/api/axios-instance';

import type {
	IArchiveNotificationResponse,
	IGetNotificationsParams,
	IGetNotificationsResponse,
	INotificationPreferencesPayload,
	IRetryNotificationResponse,
	IUpdateNotificationPreferencesResponse,
} from './index.types';

export const getNotifications = async (
	params: IGetNotificationsParams
): Promise<IGetNotificationsResponse> => {
	const response = await apiClient.get<IGetNotificationsResponse>(
		'/notifications',
		{ params }
	);

	return response.data;
};

export const archiveNotification = async (
	notificationId: string
): Promise<IArchiveNotificationResponse> => {
	const response = await apiClient.patch<IArchiveNotificationResponse>(
		`/notifications/${notificationId}/archive`
	);

	return response.data;
};

export const retryNotification = async (
	notificationId: string
): Promise<IRetryNotificationResponse> => {
	const response = await apiClient.post<IRetryNotificationResponse>(
		`/notifications/${notificationId}/retry`
	);

	return response.data;
};

export const updateNotificationPreferences = async (
	therapistId: string,
	payload: INotificationPreferencesPayload
): Promise<IUpdateNotificationPreferencesResponse> => {
	const response =
		await apiClient.patch<IUpdateNotificationPreferencesResponse>(
			`/users/${therapistId}/notification-preferences`,
			payload
		);

	return response.data;
};

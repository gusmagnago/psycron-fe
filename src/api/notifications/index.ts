import apiClient from '@psycron/api/axios-instance';

import type {
	IArchiveNotificationResponse,
	IGetNotificationsParams,
	IGetNotificationsResponse,
	IMarkAllNotificationsReadResponse,
	IMarkNotificationReadResponse,
	INotificationPreferencesPayload,
	IRetryNotificationResponse,
	IUnreadNotificationsCountResponse,
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

export const getUnreadNotificationsCount =
	async (): Promise<IUnreadNotificationsCountResponse> => {
		const response = await apiClient.get<IUnreadNotificationsCountResponse>(
			'/notifications/unread-count'
		);

		return response.data;
	};

export const markNotificationRead = async (
	notificationId: string
): Promise<IMarkNotificationReadResponse> => {
	const response = await apiClient.patch<IMarkNotificationReadResponse>(
		`/notifications/${notificationId}/read`
	);

	return response.data;
};

export const markAllNotificationsRead =
	async (): Promise<IMarkAllNotificationsReadResponse> => {
		const response = await apiClient.patch<IMarkAllNotificationsReadResponse>(
			'/notifications/read-all'
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

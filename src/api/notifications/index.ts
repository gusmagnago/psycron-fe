import apiClient from '@psycron/api/axios-instance';

import type {
	IGetNotificationsParams,
	IGetNotificationsResponse,
	IRetryNotificationResponse,
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

export const retryNotification = async (
	notificationId: string
): Promise<IRetryNotificationResponse> => {
	const response = await apiClient.post<IRetryNotificationResponse>(
		`/notifications/${notificationId}/retry`
	);

	return response.data;
};

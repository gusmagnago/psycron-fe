import apiClient from '../axios-instance';

import type {
	IWaitlistSubs,
	Subscriber,
	UnsubscribeResponse,
	WaitlistResponse,
} from './index.types';

export const waitlistSubscription = async (
	data: IWaitlistSubs
): Promise<WaitlistResponse> => {
	const response = await apiClient.post<WaitlistResponse>(
		'/subs/waitlist',
		data
	);
	return response.data;
};

export const getSubscriber = async (token: string): Promise<Subscriber> => {
	const response = await apiClient.get<Subscriber>(`/subs/subscriber/${token}`);
	return response.data;
};

export const unSubscribe = async (
	token: string
): Promise<UnsubscribeResponse> => {
	const response = await apiClient.patch<UnsubscribeResponse>(
		`/subs/unsubscribe/${token}`
	);
	return response.data;
};

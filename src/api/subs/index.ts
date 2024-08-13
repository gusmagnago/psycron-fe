import type { IWaitlistSubs } from '@psycron/components/c2action/C2Action.types';
import axios from 'axios';

import apiClient from '../axios-instance';

import type { IGetSubscriber } from './index.types';

class CustomError extends Error {
	public statusCode: number;
	constructor(message: string, statusCode: number) {
		super(message);
		this.statusCode = statusCode;
	}
}

export const waitlistSubscription = async ({
	email,
	language,
}: IWaitlistSubs) => {
	try {
		const response = await apiClient.post('/subs/waitlist', {
			email,
			language,
		});

		if (!response.data.success) {
			throw new CustomError(response.data.message, 400);
		}

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			const errorMessage = error.response.data.message || 'Request failed';
			const statusCode = error.response.status || 500;
			throw new CustomError(errorMessage, statusCode);
		}
		throw new CustomError('An unexpected error occurred', 500);
	}
};

export const getSubscriber = async ({ token }: IGetSubscriber) => {
	try {
		const response = await apiClient.get(`/subs/subscriber/${token}`);

		if (!response.data.success) {
			throw new CustomError(response.data.message, 400);
		}
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			const errorMessage = error.response.data.message || 'Request failed';
			const statusCode = error.response.status || 500;
			throw new CustomError(errorMessage, statusCode);
		}
		throw new CustomError('An unexpected error occurred', 500);
	}
};

export const unSubscribe = async ({ token }: IGetSubscriber) => {
	try {
		const response = await apiClient.patch(`/subs/unsubscribe/${token}`);

		if (!response.data.success) {
			throw new CustomError(response.data.message, 400);
		}

		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error) && error.response) {
			const errorMessage = error.response.data.message || 'Request failed';
			const statusCode = error.response.status || 500;
			throw new CustomError(errorMessage, statusCode);
		}
		throw new CustomError('An unexpected error occurred', 500);
	}
};

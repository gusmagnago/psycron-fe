import type { IWaitlistSubs } from '@psycron/components/c2action/C2Action.types';
import axios from 'axios';

import apiClient from '../axios-instance';

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

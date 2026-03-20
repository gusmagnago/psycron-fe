import apiClient from '../axios-instance';

import type { IAvailabilityRecord } from './index.types';

export const getAvailability = async (params?: {
	from?: string;
	to?: string;
}): Promise<IAvailabilityRecord | null> => {
	try {
		const response = await apiClient.get<IAvailabilityRecord>('/jupiter/availability', {
			params,
		});
		return response.data;
	} catch {
		return null;
	}
};

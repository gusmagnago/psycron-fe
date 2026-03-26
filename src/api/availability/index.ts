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

export interface IUpdateAvailabilitySettingsPayload {
	bufferTimeMinutes?: number;
	sessionDuration?: string;
	sessionType?: string;
	timeRange?: string;
	timezone?: string;
	workingDays?: string[];
}

export const updateAvailabilitySettings = async (
	data: IUpdateAvailabilitySettingsPayload
): Promise<IAvailabilityRecord> => {
	const response = await apiClient.patch<IAvailabilityRecord>(
		'/jupiter/availability/settings',
		data
	);
	return response.data;
};

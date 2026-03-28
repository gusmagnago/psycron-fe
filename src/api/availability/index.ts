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
	recurrencePattern?: 'MONTHLY' | 'WEEKLY';
	sessionDuration?: string;
	sessionType?: string;
	timeRange?: string;
	timezone?: string;
	workingDays?: string[];
}

export interface ISlotAddressPayload {
	city: string;
	country: string;
	postcode: string;
	street: string;
}

export interface IEditSlotPayload {
	address?: ISlotAddressPayload | null;
	availabilityDayId: string;
	endTime?: string;
	note?: string;
	slotId: string;
	startTime?: string;
	therapistId: string;
}

export interface IEditSlotResponse {
	slot: {
		_id: string;
		endTime: string;
		note?: string;
		startTime: string;
		status: string;
	};
	wasBooked: boolean;
}

export const editSlot = async ({
	address,
	availabilityDayId,
	endTime,
	note,
	startTime,
	therapistId,
	slotId,
}: IEditSlotPayload): Promise<IEditSlotResponse> => {
	const response = await apiClient.patch<IEditSlotResponse>(
		`/users/${therapistId}/availability/${availabilityDayId}/slot/${slotId}`,
		{ address, endTime, note, startTime }
	);
	return response.data;
};

export const updateAvailabilitySettings = async (
	data: IUpdateAvailabilitySettingsPayload
): Promise<IAvailabilityRecord> => {
	const response = await apiClient.patch<IAvailabilityRecord>(
		'/jupiter/availability/settings',
		data
	);
	return response.data;
};

import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';

import apiClient from '../axios-instance';

export interface IWeekSlotDay {
	availabilityDayId: string;
	date: string;
	slots: Omit<IWeekSlot, 'id'>[];
}

export interface IGetWeekSlotsResponse {
	days: IWeekSlotDay[];
}

export type ParseField = 'working-days' | 'time-range' | 'session-duration' | 'specialty';

export type ParseSpecialtyFlag = 'accepted' | 'rejected' | 'rephrase';

export type ParseInputResult =
	| { flag: ParseSpecialtyFlag; parsed: string[]; valid: true }
	| { parsed: string[], valid: true; }
	| { parsed: string, valid: true; }
	| { valid: false };

export const parseJupiterInput = async (
	field: ParseField,
	value: string
): Promise<ParseInputResult> => {
	const response = await apiClient.post<ParseInputResult>(
		'/jupiter/availability/parse-input',
		{ field, value }
	);
	return response.data;
};

export interface JupiterPublishPayload {
	recurrencePattern: RecurrencePattern;
	sessionDuration: string;
	sessionType: string;
	timeRange: string;
	timezone: string;
	workingDays: string[];
}

export const generateJupiterAvailability = async (
	payload: JupiterPublishPayload
): Promise<{ availabilityId: string }> => {
	const response = await apiClient.post<{ availabilityId: string }>(
		'/jupiter/availability/generate',
		payload
	);
	return response.data;
};

export interface GoogleCalendarSchedule {
	endTime: string;
	startTime: string;
	workingDays: string[];
}

export const importGoogleCalendarSchedule =
	async (): Promise<GoogleCalendarSchedule | null> => {
		try {
			const response = await apiClient.get<GoogleCalendarSchedule>(
				'/jupiter/availability/google-calendar/import'
			);
			return response.data;
		} catch {
			return null;
		}
	};

export const getWeekSlots = async (
	from: string,
	to: string
): Promise<IGetWeekSlotsResponse> => {
	const response = await apiClient.get<IGetWeekSlotsResponse>(
		'/jupiter/availability/slots',
		{ params: { from, to } }
	);
	return response.data;
};

export type RecurrencePattern = 'MONTHLY' | 'WEEKLY';

export const extendAvailability = async (
	recurrencePattern: RecurrencePattern
): Promise<{ availabilityId: string }> => {
	const response = await apiClient.post<{ availabilityId: string }>(
		'/jupiter/availability/extend',
		{ recurrencePattern }
	);
	return response.data;
};

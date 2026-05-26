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

export interface IBufferTimeAdviceRequestDay {
	bookedSessions: number;
	bookingDensity: number;
	capacityImpactMinutes: number;
	currentScheduleImpactMinutes: number;
	date: string;
	overflowMinutes: number;
	totalSessions: number;
	workloadBand: 'available' | 'busy' | 'full' | 'partial';
}

export interface IBufferTimeAdviceRequest {
	futureDays: IBufferTimeAdviceRequestDay[];
	locale: 'en' | 'pt';
	overallWorkloadBand: 'available' | 'busy' | 'full' | 'partial';
	selectedBufferMinutes: number;
	sessionDurationMinutes: number | null;
	timezone: string | null;
	weeklyCapacityImpactMinutes: number;
	weeklyCurrentImpactMinutes: number;
	workingHours: string | null;
}

export interface IBufferTimeAdviceResponse {
	lightDaySummary: string | null;
	packedDaySummary: string | null;
	recommendationSummary: string;
	recommendedBufferMinutes: number;
	warningSummary: string | null;
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
	recurrencePattern?: 'WEEKLY' | 'MONTHLY';
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

export const getBufferTimeAdvice = async (
	payload: IBufferTimeAdviceRequest
): Promise<IBufferTimeAdviceResponse> => {
	const response = await apiClient.post<IBufferTimeAdviceResponse>(
		'/jupiter/availability/buffer-advice',
		payload
	);

	return response.data;
};

export type RecurrencePattern = 'MONTHLY' | 'WEEKLY';

export type InsightTier = 'active' | 'growing' | 'onboarding';

export type InsightSource = 'ai' | 'cache' | 'fallback';

export type BeInsightType =
	| 'billing-readiness'
	| 'blocked-admin-time'
	| 'busy-day-pattern'
	| 'dashboard-summary'
	| 'low-week-volume'
	| 'missed-rebooking'
	| 'no-patients-yet'
	| 'patient-milestone'
	| 'reminder-delivery-risk'
	| 'session-count-today'
	| 'setup-availability'
	| 'week-cancellations'
	| 'whatsapp-reminders-off';

export type BeInsightCategory =
	| 'daily-briefing'
	| 'growth'
	| 'operations'
	| 'patient-care'
	| 'schedule'
	| 'setup';

export type BeInsightActionTarget =
	| { date?: string; type: 'availability-week' }
	| { type: 'availability-wizard' }
	| { patientId: string; type: 'patient-profile' }
	| { type: 'notification-settings' }
	| { type: 'patients' };

export interface BeInsightAction {
	labelKey: string;
	target: BeInsightActionTarget;
}

export interface BeInsightMeta {
	[key: string]: boolean | null | number | string | undefined;
}

export interface BeInsightItem {
	action?: BeInsightAction;
	category: Exclude<BeInsightCategory, 'daily-briefing'>;
	id: string;
	insightType: BeInsightType;
	meta?: BeInsightMeta;
	source: InsightSource;
	text: string;
	tier: InsightTier;
}

export interface BeInsightSummary {
	category: 'daily-briefing';
	generatedAt: string;
	id: string;
	source: InsightSource;
	text: string;
}

export interface BeJupiterInsightsResponse {
	insights: BeInsightItem[];
	summary: BeInsightSummary;
}

export const getJupiterInsights = async (
	locale: 'en' | 'pt'
): Promise<BeJupiterInsightsResponse | null> => {
	try {
		const response = await apiClient.get<BeJupiterInsightsResponse>(
			'/jupiter/insights',
			{ params: { locale } }
		);
		return response.data;
	} catch {
		return null;
	}
};

import type { IBufferTimeAdviceRequest } from '@psycron/api/jupiter';

export type BufferWarningLevel = 'none' | 'soft' | 'strong';
export type BufferWorkloadBand = 'available' | 'busy' | 'full' | 'partial';

export interface IBufferTimeDayInsight {
	bookedSessions: number;
	bookingDensity: number;
	bufferEvents: number;
	capacityImpactMinutes: number;
	currentScheduleImpactMinutes: number;
	dailyImpactMinutes: number;
	date: string;
	overflowMinutes: number;
	recommendedMinutes: number;
	totalSessions: number;
	workloadBand: BufferWorkloadBand;
}

export interface IBufferTimeInsights {
	capacityWeeklyImpactMinutes: number;
	currentScheduleWeeklyImpactMinutes: number;
	highlightDay: IBufferTimeDayInsight | null;
	lightDay: IBufferTimeDayInsight | null;
	packedDay: IBufferTimeDayInsight | null;
	recommendedBufferMinutes: number;
	selectedMinutes: number;
	warningLevel: BufferWarningLevel;
	weeklyImpactMinutes: number;
}

export interface IBufferTimeAdvice {
	lightDaySummary: string | null;
	packedDaySummary: string | null;
	recommendationSummary: string;
	recommendedBufferMinutes: number;
	warningSummary: string | null;
}

export interface IBufferTimeEditorProps {
	adviceRequest: IBufferTimeAdviceRequest | null;
	bufferInput: string;
	insights: IBufferTimeInsights;
	onChange: (value: string) => void;
}

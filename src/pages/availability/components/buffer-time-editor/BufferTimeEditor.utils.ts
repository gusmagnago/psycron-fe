import type { IAvailabilityRecord } from '@psycron/api/availability/index.types';
import type { IBufferTimeAdviceRequest } from '@psycron/api/jupiter';
import type { IAvailabilityResponse } from '@psycron/api/user/index.types';
import i18n from '@psycron/i18n';
import { addDays } from 'date-fns';

import type {
	BufferWarningLevel,
	BufferWorkloadBand,
	IBufferTimeDayInsight,
	IBufferTimeInsights,
} from './BufferTimeEditor.types';

export const BUFFER_TIME_OPTIONS = [5, 10, 15, 20] as const;
export const BUFFER_TIME_MIN = BUFFER_TIME_OPTIONS[0];
export const BUFFER_TIME_MAX =
	BUFFER_TIME_OPTIONS[BUFFER_TIME_OPTIONS.length - 1];
const DEFAULT_BUFFER_RECOMMENDATION = 15;
const FORECAST_WINDOW_DAYS = 7;

const parseTimeToMinutes = (time?: string): number | null => {
	if (!time) return null;
	const [hours, minutes] = time.split(':').map(Number);
	if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;
	return hours * 60 + minutes;
};

const parseWorkingDayEnd = (timeRange?: string): number | null => {
	if (!timeRange) return null;
	const parts = timeRange.split(/\s*[-–—]\s*/);
	if (parts.length !== 2) return null;
	return parseTimeToMinutes(parts[1]);
};

const getNearestAllowedBuffer = (minutes: number): number =>
	BUFFER_TIME_OPTIONS.reduce((closest, option) =>
		Math.abs(option - minutes) < Math.abs(closest - minutes) ? option : closest
	);

const getDateKey = (value: string): string => value.slice(0, 10);

const getWorkloadBand = (
	bookedSessions: number,
	totalSessions: number
): BufferWorkloadBand => {
	if (totalSessions === 0) return 'available';
	const ratio = bookedSessions / totalSessions;
	if (ratio === 0) return 'available';
	if (ratio < 0.5) return 'partial';
	if (ratio < 1) return 'busy';
	return 'full';
};

const getDayRecommendation = (
	bookingDensity: number,
	overflowMinutes: number,
	bookedSessions: number
): number => {
	if (overflowMinutes > 0 || bookingDensity >= 0.75) return 10;
	if (bookingDensity >= 0.4) return 15;
	if (bookedSessions <= 1) return 25;
	return 20;
};

const getLatestEndMinutes = (
	slots: Array<{ endTime: string; status: string }>,
	onlyBooked = false
): number | null =>
	slots.reduce<number | null>((currentLatest, slot) => {
		if (onlyBooked && slot.status !== 'BOOKED') return currentLatest;
		const endMinutes = parseTimeToMinutes(slot.endTime);
		if (endMinutes == null) return currentLatest;
		if (currentLatest == null) return endMinutes;
		return Math.max(currentLatest, endMinutes);
	}, null);

export const sanitizeBufferInput = (value: string): string =>
	value.replace(/\D/g, '').slice(0, 2);

export const normalizeBufferMinutes = (value: string): string => {
	if (!value.trim()) return '';
	const parsed = Number(value);
	if (Number.isNaN(parsed)) return '';
	return String(Math.min(BUFFER_TIME_MAX, Math.max(BUFFER_TIME_MIN, parsed)));
};

export const isBufferMinutesValid = (value: string): boolean => {
	if (!value.trim()) return false;
	const parsed = Number(value);
	return (
		Number.isInteger(parsed) &&
		parsed >= BUFFER_TIME_MIN &&
		parsed <= BUFFER_TIME_MAX
	);
};

export const getBufferInputValue = (
	currentBufferMinutes?: number | null
): string =>
	currentBufferMinutes && currentBufferMinutes >= BUFFER_TIME_MIN
		? String(Math.min(BUFFER_TIME_MAX, currentBufferMinutes))
		: String(DEFAULT_BUFFER_RECOMMENDATION);

export const getBufferInsights = ({
	availability,
	availabilityData,
	bufferInput,
}: {
	availability?: IAvailabilityRecord | null;
	availabilityData?: IAvailabilityResponse | null;
	bufferInput: string;
}): IBufferTimeInsights => {
	const parsedMinutes = Number(bufferInput);
	const selectedMinutes = Number.isNaN(parsedMinutes)
		? DEFAULT_BUFFER_RECOMMENDATION
		: Math.min(BUFFER_TIME_MAX, Math.max(BUFFER_TIME_MIN, parsedMinutes));
	const today = new Date();
	const todayKey = today.toISOString().slice(0, 10);
	const forecastEndKey = addDays(today, FORECAST_WINDOW_DAYS - 1)
		.toISOString()
		.slice(0, 10);
	const workingDayEnd = parseWorkingDayEnd(availability?.timeRange);

	const dayInsights: IBufferTimeDayInsight[] = (availabilityData?.dates ?? [])
		.filter((day) => {
			const dateKey = getDateKey(day.date);
			return dateKey >= todayKey && dateKey <= forecastEndKey;
		})
		.map((day) => {
			const relevantSlots = (day.slots ?? []).filter(
				(slot) => slot.status === 'AVAILABLE' || slot.status === 'BOOKED'
			);
			const totalSessions = relevantSlots.length;
			const bookedSessions = relevantSlots.filter(
				(slot) => slot.status === 'BOOKED'
			).length;
			const latestBookedEndMinutes = getLatestEndMinutes(relevantSlots, true);
			const capacityBufferEvents = Math.max(totalSessions - 1, 0);
			const currentScheduleBufferEvents = Math.max(bookedSessions - 1, 0);
			const currentScheduleImpactMinutes =
				currentScheduleBufferEvents * selectedMinutes;
			const capacityImpactMinutes = capacityBufferEvents * selectedMinutes;
			const bufferEvents =
				bookedSessions > 0 ? currentScheduleBufferEvents : capacityBufferEvents;
			const dailyImpactMinutes =
				bookedSessions > 0
					? currentScheduleImpactMinutes
					: capacityImpactMinutes;
			const projectedEndTime =
				latestBookedEndMinutes == null
					? null
					: latestBookedEndMinutes + selectedMinutes;
			const overflowMinutes =
				projectedEndTime != null && workingDayEnd != null
					? Math.max(projectedEndTime - workingDayEnd, 0)
					: 0;
			const bookingDensity =
				totalSessions > 0 ? bookedSessions / totalSessions : 0;

			return {
				bookingDensity,
				bufferEvents,
				bookedSessions,
				capacityImpactMinutes,
				currentScheduleImpactMinutes,
				dailyImpactMinutes,
				date: getDateKey(day.date),
				overflowMinutes,
				recommendedMinutes: getDayRecommendation(
					bookingDensity,
					overflowMinutes,
					bookedSessions
				),
				totalSessions,
				workloadBand: getWorkloadBand(bookedSessions, totalSessions),
			};
		})
		.filter((day) => day.totalSessions > 0);

	const currentScheduleWeeklyImpactMinutes = dayInsights.reduce(
		(sum, day) => sum + day.currentScheduleImpactMinutes,
		0
	);
	const capacityWeeklyImpactMinutes = dayInsights.reduce(
		(sum, day) => sum + day.capacityImpactMinutes,
		0
	);
	const scheduledDayInsights = dayInsights.filter(
		(day) => day.bookedSessions > 0
	);
	const highlightCandidates =
		dayInsights.length > 0 ? dayInsights : scheduledDayInsights;
	const packedDay =
		scheduledDayInsights.length > 0
			? [...scheduledDayInsights].sort(
					(a, b) =>
						b.bookedSessions - a.bookedSessions ||
						b.bookingDensity - a.bookingDensity
				)[0]
			: null;
	const lightDay =
		scheduledDayInsights.length > 0
			? [...scheduledDayInsights].sort(
					(a, b) =>
						a.bookedSessions - b.bookedSessions ||
						a.bookingDensity - b.bookingDensity
				)[0]
			: null;
	const highlightDay =
		highlightCandidates.length > 0
			? [...highlightCandidates].sort(
					(a, b) => b.capacityImpactMinutes - a.capacityImpactMinutes
				)[0]
			: null;

	const averageRecommendation =
		scheduledDayInsights.length > 0
			? scheduledDayInsights.reduce(
					(sum, day) => sum + day.recommendedMinutes,
					0
				) / scheduledDayInsights.length
			: DEFAULT_BUFFER_RECOMMENDATION;
	const recommendedBufferMinutes = getNearestAllowedBuffer(
		Math.round(averageRecommendation)
	);

	let warningLevel: BufferWarningLevel = 'none';
	if (
		scheduledDayInsights.some((day) => day.overflowMinutes > 0) ||
		currentScheduleWeeklyImpactMinutes >= 150
	) {
		warningLevel = 'strong';
	} else if (
		scheduledDayInsights.some(
			(day) => day.currentScheduleImpactMinutes >= 30
		) ||
		currentScheduleWeeklyImpactMinutes >= 90
	) {
		warningLevel = 'soft';
	}

	return {
		capacityWeeklyImpactMinutes,
		currentScheduleWeeklyImpactMinutes,
		highlightDay,
		lightDay,
		packedDay,
		recommendedBufferMinutes,
		selectedMinutes,
		weeklyImpactMinutes: capacityWeeklyImpactMinutes,
		warningLevel,
	};
};

export const buildBufferAdviceRequest = ({
	availability,
	availabilityData,
	bufferInput,
	locale,
}: {
	availability?: IAvailabilityRecord | null;
	availabilityData?: IAvailabilityResponse | null;
	bufferInput: string;
	locale: 'en' | 'pt';
}): IBufferTimeAdviceRequest | null => {
	const insights = getBufferInsights({
		availability,
		availabilityData,
		bufferInput,
	});

	const selectedBufferMinutes = insights.selectedMinutes;
	const today = new Date();
	const todayKey = today.toISOString().slice(0, 10);
	const forecastEndKey = addDays(today, FORECAST_WINDOW_DAYS - 1)
		.toISOString()
		.slice(0, 10);
	const futureDays = (availabilityData?.dates ?? [])
		.filter((day) => {
			const dateKey = getDateKey(day.date);
			return dateKey >= todayKey && dateKey <= forecastEndKey;
		})
		.map((day) => {
			const relevantSlots = (day.slots ?? []).filter(
				(slot) => slot.status === 'AVAILABLE' || slot.status === 'BOOKED'
			);
			const totalSessions = relevantSlots.length;
			const bookedSessions = relevantSlots.filter(
				(slot) => slot.status === 'BOOKED'
			).length;
			if (totalSessions === 0) return null;

			const latestBookedEndMinutes = getLatestEndMinutes(relevantSlots, true);
			const workingDayEnd = parseWorkingDayEnd(availability?.timeRange);
			const overflowMinutes =
				latestBookedEndMinutes != null && workingDayEnd != null
					? Math.max(
							latestBookedEndMinutes + selectedBufferMinutes - workingDayEnd,
							0
						)
					: 0;

			return {
				bookedSessions,
				bookingDensity: totalSessions > 0 ? bookedSessions / totalSessions : 0,
				capacityImpactMinutes:
					Math.max(totalSessions - 1, 0) * selectedBufferMinutes,
				currentScheduleImpactMinutes:
					Math.max(bookedSessions - 1, 0) * selectedBufferMinutes,
				date: getDateKey(day.date),
				overflowMinutes,
				totalSessions,
				workloadBand: getWorkloadBand(bookedSessions, totalSessions),
			};
		})
		.filter(
			(day): day is NonNullable<typeof day> =>
				day !== null && day.bookedSessions > 0
		);

	if (futureDays.length === 0) return null;

	const totalBookedSessions = futureDays.reduce(
		(sum, day) => sum + day.bookedSessions,
		0
	);
	const totalFutureSessions = futureDays.reduce(
		(sum, day) => sum + day.totalSessions,
		0
	);

	return {
		futureDays,
		locale,
		overallWorkloadBand: getWorkloadBand(
			totalBookedSessions,
			totalFutureSessions
		),
		selectedBufferMinutes,
		sessionDurationMinutes:
			Number(availability?.sessionDuration?.match(/\d+/)?.[0] ?? 0) || null,
		timezone: availability?.timezone ?? null,
		weeklyCapacityImpactMinutes: insights.capacityWeeklyImpactMinutes,
		weeklyCurrentImpactMinutes: insights.currentScheduleWeeklyImpactMinutes,
		workingHours: availability?.timeRange ?? null,
	};
};

export const formatDuration = (
	minutes: number,
	t: (key: string, options?: Record<string, unknown>) => string
): string => {
	if (minutes <= 0)
		return t('jupiter.post-publish.buffer-impact-minutes-value', {
			minutes: 0,
		});

	const locale = i18n.language.startsWith('pt') ? 'pt-PT' : 'en-GB';
	const hoursFormatter = new Intl.NumberFormat(locale, {
		style: 'unit',
		unit: 'hour',
		unitDisplay: 'short',
	});
	const minutesFormatter = new Intl.NumberFormat(locale, {
		style: 'unit',
		unit: 'minute',
		unitDisplay: 'short',
	});
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (hours > 0 && remainingMinutes > 0) {
		return `${hoursFormatter.format(hours)} ${minutesFormatter.format(
			remainingMinutes
		)}`;
	}

	if (hours > 0) {
		return hoursFormatter.format(hours);
	}

	return minutesFormatter.format(minutes);
};

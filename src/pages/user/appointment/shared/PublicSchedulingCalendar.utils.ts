import {
	capitalizeDateLabel,
	getDateLocale,
} from '@psycron/utils/date/date.utils';
import { WEEK_STARTS_ON } from '@psycron/utils/variables';
import {
	addMonths,
	addWeeks,
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isBefore,
	isSameDay,
	isSameMonth,
	startOfMonth,
	startOfWeek,
	subMonths,
	subWeeks,
} from 'date-fns';

import type { PublicSchedulingViewMode } from './PublicSchedulingCalendar.types';

const WEEKDAY_SAMPLE_DATES = [
	new Date(2024, 0, 7),
	new Date(2024, 0, 8),
	new Date(2024, 0, 9),
	new Date(2024, 0, 10),
	new Date(2024, 0, 11),
	new Date(2024, 0, 12),
	new Date(2024, 0, 13),
];

export const getSchedulingWeekdayLabels = (language: string): string[] =>
	WEEKDAY_SAMPLE_DATES.map((date) =>
		capitalizeDateLabel(format(date, 'EEE', { locale: getDateLocale(language) }))
	);

export const getSchedulingCalendarDays = (
	date: Date,
	viewMode: PublicSchedulingViewMode
): Date[] => {
	if (viewMode === 'week') {
		return eachDayOfInterval({
			start: startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON }),
			end: endOfWeek(date, { weekStartsOn: WEEK_STARTS_ON }),
		});
	}

	return eachDayOfInterval({
		start: startOfWeek(startOfMonth(date), { weekStartsOn: WEEK_STARTS_ON }),
		end: endOfWeek(endOfMonth(date), { weekStartsOn: WEEK_STARTS_ON }),
	});
};

export const getSchedulingPeriodLabel = (
	date: Date,
	viewMode: PublicSchedulingViewMode,
	language: string
): string => {
	const locale = getDateLocale(language);

	if (viewMode === 'week') {
		const weekStart = startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON });
		const weekEnd = endOfWeek(date, { weekStartsOn: WEEK_STARTS_ON });

		return `${capitalizeDateLabel(format(weekStart, 'MMM d', { locale }))} - ${capitalizeDateLabel(format(weekEnd, 'MMM d, yyyy', { locale }))}`;
	}

	return capitalizeDateLabel(format(date, 'MMMM yyyy', { locale }));
};

export const getPreviousSchedulingPeriod = (
	date: Date,
	viewMode: PublicSchedulingViewMode
): Date => (viewMode === 'week' ? subWeeks(date, 1) : subMonths(date, 1));

export const getNextSchedulingPeriod = (
	date: Date,
	viewMode: PublicSchedulingViewMode
): Date => (viewMode === 'week' ? addWeeks(date, 1) : addMonths(date, 1));

export const canNavigateToPreviousSchedulingPeriod = (
	date: Date,
	viewMode: PublicSchedulingViewMode,
	minNavigableDate?: Date | null
): boolean => {
	if (!minNavigableDate) return true;

	const getPeriodStart = (value: Date) =>
		viewMode === 'week'
			? startOfWeek(value, { weekStartsOn: WEEK_STARTS_ON })
			: startOfMonth(value);

	const previousPeriodStart = getPeriodStart(
		getPreviousSchedulingPeriod(date, viewMode)
	);
	const minPeriodStart = getPeriodStart(minNavigableDate);

	return !isBefore(previousPeriodStart, minPeriodStart);
};

export const isSchedulingDateInCurrentPeriod = (
	targetDate: Date,
	date: Date,
	viewMode: PublicSchedulingViewMode
): boolean => {
	if (viewMode === 'week') {
		return (
			startOfWeek(targetDate, { weekStartsOn: WEEK_STARTS_ON }).getTime() ===
			startOfWeek(date, { weekStartsOn: WEEK_STARTS_ON }).getTime()
		);
	}

	return isSameMonth(targetDate, date);
};

export const isSchedulingDaySelected = (
	day: Date,
	selectedDate: Date | null
): boolean => (selectedDate ? isSameDay(day, selectedDate) : false);

export const isSchedulingDayInPeriod = (
	day: Date,
	date: Date,
	viewMode: PublicSchedulingViewMode
): boolean => viewMode === 'week' || isSameMonth(day, date);

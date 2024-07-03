import { differenceInDays, differenceInHours, differenceInMinutes, format } from 'date-fns';
import type { TFunction } from 'i18next';

export * from './env'
export * from './urls'

export const formatDateTime = (
	dateTimeString: string,
	t: TFunction
): string => {
	const date = new Date(dateTimeString);
	return format(
		date,
		t('globals.date-time-format', { format: 'MMMM d, yyyy h:mmaaa' })
	);
};

export const getTimeRemaining = (targetDateTime: string, t: TFunction): string => {
	const targetDate = new Date(targetDateTime);
	const currentDate = new Date();

	const days = differenceInDays(targetDate, currentDate);
	const hours = differenceInHours(targetDate, currentDate) % 24;
	const minutes = differenceInMinutes(targetDate, currentDate) % 60;

	let result = '';
	if (days > 0) {
		result = t('globals.time-remaining.days', { count: days });
	} else if (hours > 0) {
		result = t('globals.time-remaining.hours', { count: hours });
	} else if (minutes > 0) {
		result = t('globals.time-remaining.minutes', { count: minutes });
	} else {
		result = t('globals.time-remaining.less-than-a-minute');
	}

	return result.trim();
};
export const checkAppointmentTimes = (targetDateTime: string) => {
	const targetDate = new Date(targetDateTime);
	const currentDate = new Date();

	const minutesDifference = differenceInMinutes(targetDate, currentDate);

	return {
		lessThanThirtyMinutes: minutesDifference < 30,
	};
};
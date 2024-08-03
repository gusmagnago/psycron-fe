import ReactGA from 'react-ga4';
import {
	addMinutes,
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	format,
} from 'date-fns';
import type { TFunction } from 'i18next';

export * from './env';
export * from './urls';

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

export const getTimeRemaining = (
	targetDateTime: string,
	t: TFunction,
	paused: boolean
): string => {
	const targetDate = new Date(targetDateTime);
	const currentDate = new Date();

	const days = differenceInDays(targetDate, currentDate);
	const hours = differenceInHours(targetDate, currentDate) % 24;
	const minutes = differenceInMinutes(targetDate, currentDate) % 60;

	const status = paused ? t('globals.paused') : t('globals.in-progress');

	let result = '';
	if (days > 0) {
		result = t('globals.time-remaining.days', { count: days });
	} else if (hours > 0) {
		result = t('globals.time-remaining.hours', { count: hours });
	} else if (minutes > 0) {
		result = t('globals.time-remaining.minutes', { count: minutes });
	} else {
		result = t('globals.time-remaining.less-than-a-minute', {
			status: status,
		});
	}

	return result.trim();
};
export const checkAppointmentTimes = (
	targetDateTime: string,
	appointmentDuration: number
) => {
	const targetDate = new Date(targetDateTime);
	const currentDate = new Date();

	const minutesDifference = differenceInMinutes(targetDate, currentDate);
	const endDate = addMinutes(targetDate, appointmentDuration);

	const isNow = currentDate >= targetDate && currentDate <= endDate;

	return {
		lessThanThirtyMinutes: minutesDifference < 30,
		isNow: isNow,
	};
};

export const scrollToSection = (id: string) => {
	ReactGA.event({
		category: 'User',
		action: 'Click Button',
		value: 10,
		label: `User clicked ${id} header button`,
	});

	const element = document.getElementById(id);
	if (element) {
		element.scrollIntoView({ behavior: 'smooth' });
	}
};

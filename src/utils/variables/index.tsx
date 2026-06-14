import ReactGA from 'react-ga4';
import type { Locale } from 'date-fns';
import {
	addDays,
	addMinutes,
	differenceInDays,
	differenceInHours,
	differenceInMinutes,
	format,
	startOfDay,
	startOfToday,
	startOfWeek,
} from 'date-fns';
import { de, enUS, es, fr, ptBR } from 'date-fns/locale';
import { format as TZFormat, toZonedTime } from 'date-fns-tz';
import type { TFunction } from 'i18next';

export * from './env';
export * from './urls';

const locales: Record<string, Locale> = {
	en: enUS,
	pt: ptBR,
	es: es,
	fr: fr,
	de: de,
};

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

export const formatDate = (date: Date, locale: string): string => {
	const selectedLocale = locales[locale] || enUS;
	return format(date, 'EEEE, dd/MM/yy', { locale: selectedLocale });
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

export const generateTimeSlots = (duration: number) => {
	const slots = [];
	let currentTime = startOfDay(new Date());

	while (currentTime.getDate() === startOfDay(new Date()).getDate()) {
		slots.push(format(currentTime, 'HH:mm'));
		currentTime = addMinutes(currentTime, duration);
	}

	return slots;
};

// Calendars across the app run Sunday → Saturday (matches Google Calendar's
// default and Brazilian convention). Single source of truth for date-fns.
export const WEEK_STARTS_ON = 0 as const;

export const generateWeekDays = (startDate: Date) => {
	const weekStart = startOfWeek(startDate, {
		weekStartsOn: WEEK_STARTS_ON,
	});

	return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
};

export const getWeekDays = (today: Date, dateLocale: Locale) => {
	const start = startOfWeek(today, { locale: dateLocale });
	return Array.from({ length: 7 }).map((_, index) => {
		const day = addDays(start, index);
		return format(day, 'EEEE', { locale: dateLocale }).charAt(0).toUpperCase();
	});
};

export const generateUserTimeZone = () => {
	return Intl.DateTimeFormat().resolvedOptions().timeZone;
};

export const formatTimeToTimeZone = (
	time: string,
	date: Date,
	timeZone: string
): string => {
	// Example: '19:00', 'Thu Oct 17 2024 19:00:00 GMT+0300', Europe/Tallinn
	const dateISO = new Date(date).toISOString().split('T')[0];
	const dateTimeString = `${dateISO}T${time}:00`;

	const zonedDate = toZonedTime(new Date(dateTimeString), timeZone);

	const is12HourFormat =
		timeZone.includes('America') || timeZone === 'US/Eastern';

	return TZFormat(zonedDate, is12HourFormat ? 'hh:mm a' : 'HH:mm', {
		timeZone,
	});
};

export const formatSessionDateToLocale = (
	dateString: string,
	locale: string
): string => {
	const date = new Date(dateString);

	if (isNaN(date.getTime())) {
		throw new Error('Data inválida');
	}

	const formattedTime = new Intl.DateTimeFormat(locale, {
		hour: 'numeric',
		minute: 'numeric',
		hour12: true,
	}).format(date);

	if (locale === 'en') {
		return `${date.toDateString()} at ${formattedTime}`;
	}

	if (locale === 'pt') {
		const dayOfWeek = new Intl.DateTimeFormat('pt', { weekday: 'long' }).format(
			date
		);
		const formattedDate = `${dayOfWeek} (${date.toLocaleDateString('pt', {
			day: '2-digit',
			month: '2-digit',
		})})`;
		return `${formattedDate} às ${formattedTime}`;
	}

	return new Intl.DateTimeFormat(locale, {
		dateStyle: 'full',
		timeStyle: 'short',
	}).format(date);
};
export const isCurrentDay = (day: Date) => {
	const today = startOfToday();

	return (
		day.getDate() === today.getDate() &&
		day.getMonth() === today.getMonth() &&
		day.getFullYear() === today.getFullYear()
	);
};

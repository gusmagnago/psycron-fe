import { palette } from '@psycron/theme/palette/palette.theme';
import type { Locale } from 'date-fns';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

import type { IWeekSlot } from '../AvailabilityWeekPage.types';

export const STATUS_CONFIG: Record<
	string,
	{ badgeColor: string; labelKey: string }
> = {
	'booked-google': {
		badgeColor: palette.brand.purple,
		labelKey: 'availability.week.drawer.status-confirmed',
	},
	'booked-jupiter': {
		badgeColor: palette.brand.purple,
		labelKey: 'availability.week.drawer.status-confirmed',
	},
	cancelled: {
		badgeColor: palette.error.main,
		labelKey: 'availability.week.drawer.status-cancelled',
	},
};

// "America/Sao_Paulo" → "São Paulo", "Europe/Tallinn" → "Tallinn"
export const getCityFromTZ = (tz: string): string =>
	tz.split('/').pop()?.replace(/_/g, ' ') ?? tz;

export const isValidIANATZ = (tz: string): boolean => {
	try {
		Intl.DateTimeFormat(undefined, { timeZone: tz });
		return true;
	} catch {
		return false;
	}
};

// Correctly handles durations that cross the hour boundary (e.g. 45 min slots)
export const computeEndTime = (startTime: string, duration: number): string => {
	const [h, m] = startTime.split(':').map(Number);
	const total = h * 60 + m + duration;
	return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
};

export const computeTimeStrings = (
	slot: IWeekSlot,
	endTime: string,
	therapistTZ: string,
	dateLocale: Locale,
	patientTZOverride?: string
): { patientTimeStr: string | null; therapistTimeStr: string } => {
	const rawPatientTZ = patientTZOverride ?? slot.timezone;
	const patientTZ =
		rawPatientTZ && isValidIANATZ(rawPatientTZ) ? rawPatientTZ : therapistTZ;

	const slotDate = parseISO(slot.date);
	const [startH, startM] = slot.startTime.split(':').map(Number);
	const [endH, endM] = endTime.split(':').map(Number);

	const startBase = new Date(slotDate);
	startBase.setHours(startH, startM, 0, 0);
	const endBase = new Date(slotDate);
	endBase.setHours(endH, endM, 0, 0);

	try {
		const tStart = toZonedTime(startBase, therapistTZ);
		const tEnd = toZonedTime(endBase, therapistTZ);
		const pStart = toZonedTime(startBase, patientTZ);
		const pEnd = toZonedTime(endBase, patientTZ);

		const fmt = (d: Date, f: string) => format(d, f, { locale: dateLocale });

		const dateDiffers =
			fmt(tStart, 'yyyy-MM-dd') !== fmt(pStart, 'yyyy-MM-dd');

		const patientDatePrefix = dateDiffers
			? `${fmt(pStart, 'd MMM')} · `
			: '';

		const patientCity = rawPatientTZ ? getCityFromTZ(patientTZ) : null;

		return {
			therapistTimeStr: `${fmt(tStart, 'HH:mm')} – ${fmt(tEnd, 'HH:mm')}`,
			patientTimeStr: rawPatientTZ
				? `${patientDatePrefix}${fmt(pStart, 'HH:mm')} – ${fmt(pEnd, 'HH:mm')}${patientCity ? ` (${patientCity})` : ''}`
				: null,
		};
	} catch {
		return {
			therapistTimeStr: `${slot.startTime} – ${endTime}`,
			patientTimeStr: rawPatientTZ
				? `${slot.startTime} – ${endTime} (${rawPatientTZ})`
				: null,
		};
	}
};

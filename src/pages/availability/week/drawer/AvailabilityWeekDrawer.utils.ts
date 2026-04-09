import type {
	IPreferredContact,
	ISlotAddress,
} from '@psycron/context/user/auth/UserAuthenticationContext.types';
import { DOMAIN } from '@psycron/pages/urls';
import { palette } from '@psycron/theme/palette/palette.theme';
import type { Locale } from 'date-fns';
import { format, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import type { TFunction } from 'i18next';

import type { IWeekSlot } from '../AvailabilityWeekPage.types';

import type {
	IAvailabilityWeekDrawerProps,
	LocationChoice,
} from './AvailabilityWeekDrawer.types';

export interface IContactLink {
	href: string;
	labelKey: string;
	type: IPreferredContact['type'];
}

export const EMPTY_ADDRESS: ISlotAddress = {
	city: '',
	country: '',
	postcode: '',
	street: '',
};

const CONTACT_LINK_LABEL: Record<IPreferredContact['type'], string> = {
	google_meet: 'availability.week.drawer.join-meet',
	phone: 'availability.week.drawer.call-phone',
	whatsapp: 'availability.week.drawer.call-whatsapp',
	zoom: 'availability.week.drawer.join-zoom',
};

/**
 * Builds the appropriate contact link for a booked patient.
 * Uses preferredContact as the single source of truth.
 */
export const buildContactLink = (
	preferredContact?: IPreferredContact | null
): IContactLink | null => {
	if (!preferredContact?.value) return null;

	const { type, value } = preferredContact;

	const href =
		type === 'whatsapp'
			? `https://wa.me/${value.replace(/\D/g, '')}`
			: type === 'phone'
				? `tel:${value}`
				: value;

	return { href, labelKey: CONTACT_LINK_LABEL[type], type };
};

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

export const buildAvailabilityBookingLink = (
	therapistId: string,
	slotId: string
): string => {
	const url = new URL(`${DOMAIN}/${therapistId}/book-appointment`);
	url.searchParams.set('slotId', slotId);

	return url.toString();
};

export const getInitialLocationChoice = (
	slot: IAvailabilityWeekDrawerProps['slot']
): LocationChoice => {
	if (slot.letPatientChooseAddress) return 'patient';
	if (slot.address) return 'custom';
	return 'clinic';
};

export const getCancelledSubtitle = (
	t: TFunction,
	triggeredBy?: string | null
): string =>
	triggeredBy
		? t(`availability.week.drawer.cancelled-by-${triggeredBy.toLowerCase()}`)
		: t('availability.week.drawer.cancelled-subtitle');

export const getDrawerTitle = ({
	isAvailable,
	isBuffer,
	isBlocked,
	isCancelled,
	patientName,
	t,
}: {
	isAvailable: boolean;
	isBlocked: boolean;
	isBuffer: boolean;
	isCancelled: boolean;
	patientName?: string;
	t: TFunction;
}): string => {
	if (isCancelled) return t('availability.week.drawer.cancelled-title');
	if (isBlocked) return t('availability.week.drawer.blocked-title');
	if (isBuffer) return t('availability.week.drawer.break-title');
	if (isAvailable) return t('availability.week.drawer.book-slot');
	return patientName ?? '';
};

export const getAvailableSessionDeliveryLabel = (
	t: TFunction,
	sessionType?: string
): string | null => {
	if (!sessionType) return null;
	if (sessionType === 'ONLINE') {
		return t('availability.week.drawer.session-delivery-online');
	}
	if (sessionType === 'IN_PERSON') {
		return t('availability.week.drawer.session-delivery-in-person');
	}
	return t('availability.week.drawer.booked-hybrid');
};

export const getBookedDeliveryLabel = (
	t: TFunction,
	isBookedOnline: boolean
): string =>
	isBookedOnline
		? t('availability.week.drawer.booked-online-session')
		: t('availability.week.drawer.booked-in-person');

export const getBookedShareWith = (
	t: TFunction,
	patientName?: string
): string | undefined =>
	patientName
		? t('components.share-button.share-with-name', { name: patientName })
		: undefined;

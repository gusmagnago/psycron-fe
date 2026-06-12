import { isFuture, isToday } from 'date-fns';

import type { IWeekSlot, SlotStatus } from './AvailabilityWeekPage.types';

export const LEGEND_STATUSES: { labelKey: string; status: SlotStatus }[] = [
	{ status: 'available', labelKey: 'availability.week.legend-available' },
	{ status: 'blocked', labelKey: 'availability.week.legend-blocked' },
	{
		status: 'booked-jupiter',
		labelKey: 'availability.week.legend-booked-jupiter',
	},
	// Google events and BUSY slots are one concept in the legend: time that
	// is taken but is not a Psycron session.
	{ status: 'busy', labelKey: 'availability.week.legend-busy' },
	// { status: 'buffer', labelKey: 'availability.week.legend-buffer' },
	{ status: 'cancelled', labelKey: 'availability.week.legend-cancelled' },
];

export const isClickable = (status: SlotStatus, slotDate: Date) => {
	const isBooked = status === 'booked-jupiter' || status === 'booked-google';

	const today = isToday(slotDate);
	const isFutureFromToday = today || isFuture(slotDate);
	const isAvailable = status === 'available' && isFutureFromToday;
	const isBlocked = status === 'blocked' && isFutureFromToday;

	const isBuffer = status === 'buffer' && isFutureFromToday;
	const isCancelled = status === 'cancelled';

	const result =
		isBooked || isAvailable || isBlocked || isBuffer || isCancelled;

	return result;
};

export const isDayFullyBlocked = (slots: IWeekSlot[]): boolean => {
	const realSlots = slots.filter((s) => s.status !== 'buffer');
	return realSlots.length > 0 && realSlots.every((s) => s.status === 'blocked');
};

export const formatTimeRange = (startTime: string, durationMin: number) => {
	const [h, m] = startTime.split(':').map(Number);
	const totalEndMin = h * 60 + m + durationMin;
	const endH = Math.floor(totalEndMin / 60);
	const endM = totalEndMin % 60;
	return `${startTime} – ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
};

export const isBookedMobileSlot = (slot: IWeekSlot): boolean =>
	slot.status === 'booked-jupiter' || slot.status === 'booked-google';

export const isFreeMobileSlot = (slot: IWeekSlot): boolean =>
	slot.status === 'available' || slot.status === 'blocked';

export const sortMobileDaySlots = (slots: IWeekSlot[]): IWeekSlot[] =>
	[...slots].sort((a, b) => a.startTime.localeCompare(b.startTime));

export const isFreeOnlyMobileDay = (slots: IWeekSlot[]): boolean =>
	slots.length > 0 && slots.every(isFreeMobileSlot);

// ─── Buffer height ────────────────────────────────────────────────────────────

const MIN_BUFFER_HEIGHT_DESKTOP = 16;
const MIN_BUFFER_HEIGHT_MOBILE = 24;

export const getBufferHeight = (
	bufferMinutes: number,
	platform: 'desktop' | 'mobile'
): number => {
	const minHeight =
		platform === 'desktop'
			? MIN_BUFFER_HEIGHT_DESKTOP
			: MIN_BUFFER_HEIGHT_MOBILE;
	return Math.max(bufferMinutes * 2, minHeight);
};

export const parseTimeRange = (
	timeRange: string
): { endTime: string; startTime: string } => {
	const parts = timeRange.split(/\s*[–—-]\s*/);

	if (parts.length !== 2) {
		throw new Error(`Invalid time range format: ${timeRange}`);
	}

	return {
		endTime: parts[1].trim(),
		startTime: parts[0].trim(),
	};
};

export const parseDurationMinutes = (sessionDuration: string): number => {
	const match = sessionDuration.match(/(\d+)/);
	if (!match) {
		throw new Error(`Invalid session duration: ${sessionDuration}`);
	}

	return Number(match[1]);
};

const addMinutes = (time: string, minutes: number): string => {
	const [hours, mins] = time.split(':').map(Number);
	const totalMinutes = hours * 60 + mins + minutes;
	return `${String(Math.floor(totalMinutes / 60)).padStart(2, '0')}:${String(totalMinutes % 60).padStart(2, '0')}`;
};

export const generateSlotStartTimes = (
	startTime: string,
	endTime: string,
	durationMinutes: number
): string[] => {
	const slots: string[] = [];
	let current = startTime;

	while (addMinutes(current, durationMinutes) <= endTime) {
		slots.push(current);
		current = addMinutes(current, durationMinutes);
	}

	return slots;
};

export const parseDebugNowMinutes = (value: string | null): number | null => {
	if (!value || !import.meta.env.DEV) return null;

	const match = value.match(/^(\d{1,2}):(\d{2})$/);
	if (!match) return null;

	const hours = Number(match[1]);
	const minutes = Number(match[2]);

	if (
		Number.isNaN(hours) ||
		Number.isNaN(minutes) ||
		hours < 0 ||
		hours > 23 ||
		minutes < 0 ||
		minutes > 59
	) {
		return null;
	}

	return hours * 60 + minutes;
};

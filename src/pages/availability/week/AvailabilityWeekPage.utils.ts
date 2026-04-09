import { isFuture, isToday } from 'date-fns';

import type { IWeekSlot, SlotStatus } from './AvailabilityWeekPage.types';

export const LEGEND_STATUSES: { labelKey: string; status: SlotStatus }[] = [
	{ status: 'available', labelKey: 'availability.week.legend-available' },
	{ status: 'blocked', labelKey: 'availability.week.legend-blocked' },
	{
		status: 'booked-jupiter',
		labelKey: 'availability.week.legend-booked-jupiter',
	},
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

	const result = isBooked || isAvailable || isBlocked || isBuffer;

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

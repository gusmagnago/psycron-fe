import { isFuture, isToday } from 'date-fns';

import type { SlotStatus } from './AvailabilityWeekPage.types';

export const LEGEND_STATUSES: { labelKey: string; status: SlotStatus }[] = [
	{ status: 'available', labelKey: 'availability.week.legend-available' },
	{
		status: 'booked-jupiter',
		labelKey: 'availability.week.legend-booked-jupiter',
	},
	{
		status: 'booked-google',
		labelKey: 'availability.week.legend-booked-google',
	},
	{ status: 'buffer', labelKey: 'availability.week.legend-buffer' },
	{ status: 'cancelled', labelKey: 'availability.week.legend-cancelled' },
];

export const isClickable = (status: SlotStatus, slotDate: Date) => {
	const isBooked = status === 'booked-jupiter' || status === 'booked-google';

	const today = isToday(slotDate);
	const isFutureFromToday = today || isFuture(slotDate);
	const isAvailable = status === 'available' && isFutureFromToday;

	const isBuffer = status === 'buffer' && isFutureFromToday;

	const result = isBooked || isAvailable || isBuffer;

	return result;
};

export const formatTimeRange = (startTime: string, durationMin: number) => {
	const [h, m] = startTime.split(':').map(Number);
	const totalEndMin = h * 60 + m + durationMin;
	const endH = Math.floor(totalEndMin / 60);
	const endM = totalEndMin % 60;
	return `${startTime} – ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}`;
};

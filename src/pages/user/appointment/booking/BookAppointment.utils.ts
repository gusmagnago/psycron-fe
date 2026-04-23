import type { IAvailabilityDateRef } from '@psycron/api/user/index.types';
import { format, isAfter, parseISO } from 'date-fns';

import type { IBookingFilters, IPublicSlot, TimeOfDay } from './BookAppointment.types';

export const matchesTimeOfDay = (
	startTime: string,
	timeOfDay: TimeOfDay
): boolean => {
	if (timeOfDay === 'all') return true;

	const [hour] = startTime.split(':').map(Number);

	if (timeOfDay === 'morning') return hour < 12;
	if (timeOfDay === 'afternoon') return hour >= 12 && hour < 17;

	return hour >= 17;
};

const isPubliclyVisibleSlot = (status: string): boolean =>
	status === 'AVAILABLE' || status === 'BOOKED';

const hasBookableSlot = (slots: IPublicSlot[]): boolean =>
	slots.some((slot) => !slot.isBooked);

export const buildPublicSlotsByDay = ({
	dates,
	filters,
	today,
}: {
	dates: IAvailabilityDateRef[];
	filters: IBookingFilters;
	today: Date;
}): Map<string, IPublicSlot[]> => {
	const fromDate = parseISO(filters.dateFrom);
	const toDate = parseISO(filters.dateTo);
	const groupedSlots = new Map<string, IPublicSlot[]>();

	for (const day of dates) {
		const dayDate = parseISO(day.date);
		const isVisibleDay =
			isAfter(dayDate, today) &&
			!isAfter(fromDate, dayDate) &&
			!isAfter(dayDate, toDate);

		if (!isVisibleDay) continue;

		const daySlots = (day.slots ?? [])
			.filter(
				(slot) =>
					isPubliclyVisibleSlot(slot.status) &&
					matchesTimeOfDay(slot.startTime, filters.timeOfDay)
			)
			.map(
				(slot): IPublicSlot => ({
					address: slot.address ?? null,
					availabilityDayId: String(day.dateId),
					date: day.date,
					deliveryMode: slot.deliveryMode ?? null,
					endTime: slot.endTime,
					isBooked: slot.status === 'BOOKED',
					letPatientChooseAddress: slot.letPatientChooseAddress ?? false,
					slotId: slot._id,
					startTime: slot.startTime,
				})
			);

		if (!hasBookableSlot(daySlots)) continue;

		groupedSlots.set(format(dayDate, 'yyyy-MM-dd'), daySlots);
	}

	return groupedSlots;
};

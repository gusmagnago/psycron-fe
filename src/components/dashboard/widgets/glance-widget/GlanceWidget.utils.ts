import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';
import { isAfter, parseISO } from 'date-fns';

const isBookedSlot = (slot: IWeekSlot): boolean =>
	slot.status === 'booked-jupiter' || slot.status === 'booked-google';

const getSlotStartDate = (slot: IWeekSlot): Date =>
	parseISO(`${slot.date}T${slot.startTime}`);

export const getNextBookedSlot = (
	slots: IWeekSlot[],
	now = new Date()
): IWeekSlot | undefined =>
	slots
		.filter((slot) => isBookedSlot(slot) && isAfter(getSlotStartDate(slot), now))
		.sort(
			(a, b) =>
				getSlotStartDate(a).getTime() - getSlotStartDate(b).getTime()
		)[0];

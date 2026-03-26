import type { IAvailabilityDateRef } from '@psycron/api/user/index.types';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import { format, isWithinInterval, parseISO } from 'date-fns';

import type { IWeekSlot, SlotStatus } from './AvailabilityWeekPage.types';

const computeDuration = (startTime: string, endTime: string): number => {
	const [sh, sm] = startTime.split(':').map(Number);
	const [eh, em] = endTime.split(':').map(Number);
	return eh * 60 + em - (sh * 60 + sm);
};

const toSlotStatus = (status: string): SlotStatus | null => {
	if (status === 'AVAILABLE') return 'available';
	if (status === 'BOOKED') return 'booked-jupiter';
	if (status === 'CANCELLED' || status === 'CANCELED') return 'cancelled';
	return null;
};

export const useWeekSlots = (weekStart: Date, weekEnd: Date) => {
	const { availabilityData, availabilityDataIsLoading, isAvailabilityDatesEmpty } = useAvailability();

	const weekDates = (availabilityData?.dates ?? [] as IAvailabilityDateRef[]).filter((d) =>
		isWithinInterval(parseISO(d.date), { start: weekStart, end: weekEnd })
	);

	const weekData: Record<string, IWeekSlot[]> = {};

	weekDates.forEach((d) => {
		const slots = d.slots ?? [];
		if (!slots.length) return;

		const dayStr = format(parseISO(d.date), 'yyyy-MM-dd');

		weekData[dayStr] = slots
			.map((slot, j): IWeekSlot | null => {
				const status = toSlotStatus(slot.status);
				if (!status) return null;
				return {
					_id: slot._id,
					availabilityDayId: String(d.dateId),
					date: dayStr,
					duration: computeDuration(slot.startTime, slot.endTime),
					id: slot._id ?? `${dayStr}-${j}`,
					notes: slot.note,
					startTime: slot.startTime,
					status,
				};
			})
			.filter((s): s is IWeekSlot => s !== null);
	});

	return { isAvailabilityDatesEmpty, isLoading: availabilityDataIsLoading, weekData };
};

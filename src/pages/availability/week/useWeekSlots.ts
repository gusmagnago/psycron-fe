import { getAvailabilityByDayId } from '@psycron/api/user';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { useQueries } from '@tanstack/react-query';
import { format, isWithinInterval, parseISO } from 'date-fns';

import type { IWeekSlot, SlotStatus } from './AvailabilityWeekPage.types';

const computeDuration = (startTime: string, endTime: string): number => {
	const [sh, sm] = startTime.split(':').map(Number);
	const [eh, em] = endTime.split(':').map(Number);
	return eh * 60 + em - (sh * 60 + sm);
};

const toSlotStatus = (
	status: string,
	source?: string
): SlotStatus | null => {
	if (status === 'AVAILABLE') return 'available';
	if (status === 'BOOKED')
		return source === 'google' ? 'booked-google' : 'booked-jupiter';
	if (status === 'CANCELLED' || status === 'CANCELED') return 'cancelled';
	return null;
};

export const useWeekSlots = (weekStart: Date, weekEnd: Date) => {
	const therapistId = useTherapistId();
	const { availabilityData, availabilityDataIsLoading, isAvailabilityDatesEmpty } = useAvailability();

	// Filter to dates that fall within this week (Date comparison handles timezone)
	const weekDates = (availabilityData?.dates ?? []).filter((d) =>
		isWithinInterval(parseISO(d.date), { start: weekStart, end: weekEnd })
	);

	const dayQueries = useQueries({
		queries: weekDates.map((d) => ({
			enabled: !!therapistId && !!d.dateId,
			queryFn: () => getAvailabilityByDayId(therapistId, { dateId: d.dateId }),
			queryKey: ['availabilityByDay', d.dateId],
			staleTime: 1000 * 60 * 5,
		})),
	});

	const isLoading =
		availabilityDataIsLoading || dayQueries.some((q) => q.isLoading);

	const weekData: Record<string, IWeekSlot[]> = {};

	weekDates.forEach((d, i) => {
		const result = dayQueries[i]?.data;
		if (!result) return;

		const dayStr = format(parseISO(d.date), 'yyyy-MM-dd');
		const availDate = result.availabilityDates?.[0];
		if (!availDate) return;

		weekData[dayStr] = availDate.slots
			.map((slot, j) => {
				const status = toSlotStatus(slot.status, slot.source);
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
				} satisfies IWeekSlot;
			})
			.filter((s): s is IWeekSlot => s !== null);
	});

	return { isAvailabilityDatesEmpty, isLoading, weekData };
};

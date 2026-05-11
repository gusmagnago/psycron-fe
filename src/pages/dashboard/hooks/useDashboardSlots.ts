import { useMemo } from 'react';
import { getAvailabilityCalendar } from '@psycron/api/user';
import { StatusEnum } from '@psycron/api/user/availability/index.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import type { SlotStatus } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';
import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';
import { useQuery } from '@tanstack/react-query';
import { endOfWeek, format, startOfWeek } from 'date-fns';

export interface UseDashboardSlotsReturn {
	isLoading: boolean;
	todaySlots: IWeekSlot[];
	weekEnd: string;
	weekSlotsByDay: Record<string, IWeekSlot[]>;
	weekStart: string;
}

const computeDuration = (startTime: string, endTime: string): number => {
	const [sh, sm] = startTime.split(':').map(Number);
	const [eh, em] = endTime.split(':').map(Number);
	return eh * 60 + em - (sh * 60 + sm);
};

const toSlotStatus = (status: StatusEnum): SlotStatus => {
	switch (status) {
		case StatusEnum.BOOKED:
			return 'booked-jupiter';
		case StatusEnum.BLOCKED:
			return 'blocked';
		case StatusEnum.CANCELED:
			return 'cancelled';
		default:
			return 'available';
	}
};

export const useDashboardSlots = (): UseDashboardSlotsReturn => {
	const { userDetails } = useUserDetails();
	const therapistId = userDetails?._id ?? '';

	const today = new Date();
	const from = format(startOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd');
	const to = format(endOfWeek(today, { weekStartsOn: 0 }), 'yyyy-MM-dd');
	const todayStr = format(today, 'yyyy-MM-dd');

	const { data, isLoading } = useQuery({
		queryKey: ['dashboard-week-slots', therapistId, from, to],
		queryFn: () => getAvailabilityCalendar(therapistId, { from, to }),
		enabled: Boolean(therapistId),
		staleTime: 5 * 60 * 1000,
	});

	const weekSlotsByDay = useMemo<Record<string, IWeekSlot[]>>(() => {
		if (!data?.dates) return {};
		return data.dates.reduce<Record<string, IWeekSlot[]>>(
			(acc, day) => {
				if (!day.slots?.length) return acc;
				// BE may return full ISO datetime strings — normalize to YYYY-MM-DD
				const dateStr = day.date.substring(0, 10);
				acc[dateStr] = day.slots
					.filter((slot) => slot.startTime && slot.endTime)
					.map((slot) => ({
						_id: String(slot._id),
						availabilityDayId: String(day.dateId),
						date: dateStr,
						deliveryMode: slot.deliveryMode ?? undefined,
						duration: computeDuration(slot.startTime, slot.endTime),
						id: String(slot._id),
						patientName: slot.patientSummary?.fullName,
						startTime: slot.startTime,
						status: toSlotStatus(slot.status),
					}));
				return acc;
			},
			{}
		);
	}, [data]);

	const todaySlots = useMemo(
		() => weekSlotsByDay[todayStr] ?? [],
		[weekSlotsByDay, todayStr]
	);

	return { isLoading, todaySlots, weekEnd: to, weekSlotsByDay, weekStart: from };
};

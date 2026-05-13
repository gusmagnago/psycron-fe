import { useMemo } from 'react';
import { getAvailabilityCalendar } from '@psycron/api/user';
import { StatusEnum } from '@psycron/api/user/availability/index.types';
import { useUserDetails } from '@psycron/context/user/details/UserDetailsContext';
import type { SlotStatus } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';
import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';
import { useQuery } from '@tanstack/react-query';
import { endOfWeek, format, startOfWeek } from 'date-fns';

export interface WeekMetrics {
	todayBookedCount: number;
	weekBookedCount: number;
	weekBusiestDay: { count: number; date: string };
	weekCancelledCount: number;
	weekCompletedCount: number;
	weekUpcomingCount: number;
}

export interface UseDashboardSlotsReturn {
	isLoading: boolean;
	metrics: WeekMetrics;
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

const isBooked = (s: IWeekSlot): boolean =>
	s.status === 'booked-jupiter' || s.status === 'booked-google';

export const useDashboardSlots = (): UseDashboardSlotsReturn => {
	const { userDetails } = useUserDetails();
	const therapistId = userDetails?._id ?? '';

	const today = new Date();
	const from = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
	const to = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
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
				// Only include dates within the queried window
				if (dateStr < from || dateStr > to) return acc;
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
	}, [data, from, to]);

	const todaySlots = useMemo(
		() => weekSlotsByDay[todayStr] ?? [],
		[weekSlotsByDay, todayStr]
	);

	const metrics = useMemo<WeekMetrics>(() => {
		const allWeekSlots = Object.values(weekSlotsByDay).flat();
		const weekBusiestDay = Object.entries(weekSlotsByDay).reduce(
			(best, [date, slots]) => {
				const count = slots.filter(isBooked).length;
				return count > best.count ? { count, date } : best;
			},
			{ count: 0, date: '' }
		);
		const weekUpcomingCount = allWeekSlots.filter((s) => s.status === 'booked-jupiter').length;
		const weekCompletedCount = allWeekSlots.filter((s) => s.status === 'booked-google').length;
		return {
			todayBookedCount: todaySlots.filter(isBooked).length,
			weekBusiestDay,
			weekBookedCount: weekUpcomingCount + weekCompletedCount,
			weekCancelledCount: allWeekSlots.filter((s) => s.status === 'cancelled').length,
			weekCompletedCount,
			weekUpcomingCount,
		};
	}, [todaySlots, weekSlotsByDay]);

	return { isLoading, metrics, todaySlots, weekEnd: to, weekSlotsByDay, weekStart: from };
};

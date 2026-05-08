import { useMemo } from 'react';
import { getWeekSlots } from '@psycron/api/jupiter';
import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';
import { useQuery } from '@tanstack/react-query';
import { endOfWeek, format, startOfWeek } from 'date-fns';

export interface UseDashboardSlotsReturn {
	isLoading: boolean;
	todaySlots: Omit<IWeekSlot, 'id'>[];
	weekSlotsByDay: Record<string, Omit<IWeekSlot, 'id'>[]>;
}

export const useDashboardSlots = (): UseDashboardSlotsReturn => {
	const today = new Date();
	const from = format(startOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
	const to = format(endOfWeek(today, { weekStartsOn: 1 }), 'yyyy-MM-dd');
	const todayStr = format(today, 'yyyy-MM-dd');

	const { data, isLoading } = useQuery({
		queryKey: ['dashboard-week-slots', from, to],
		queryFn: () => getWeekSlots(from, to),
		staleTime: 5 * 60 * 1000,
	});

	const weekSlotsByDay = useMemo<Record<string, Omit<IWeekSlot, 'id'>[]>>(() => {
		if (!data?.days) return {};
		return data.days.reduce<Record<string, Omit<IWeekSlot, 'id'>[]>>(
			(acc, day) => {
				acc[day.date] = day.slots;
				return acc;
			},
			{}
		);
	}, [data]);

	const todaySlots = useMemo(
		() => weekSlotsByDay[todayStr] ?? [],
		[weekSlotsByDay, todayStr]
	);

	return { isLoading, todaySlots, weekSlotsByDay };
};

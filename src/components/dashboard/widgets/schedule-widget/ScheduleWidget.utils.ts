import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';
import { addDays, format,parseISO } from 'date-fns';

import type { ScheduleSlotStatus } from './ScheduleWidget.types';

export const ROW_VARIANTS = {
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' },
	}),
};

export const isBookedDashboardSlot = (slot: IWeekSlot): boolean =>
	slot.status === 'booked-jupiter' || slot.status === 'booked-google';

export const getScheduleSlotStatus = (
	slot: IWeekSlot
): ScheduleSlotStatus => {
	if (slot.status === 'cancelled') return 'cancelled';
	return 'confirmed';
};

export const getBookedDashboardSlots = (slots: IWeekSlot[]): IWeekSlot[] =>
	[...slots]
		.filter(isBookedDashboardSlot)
		.sort(
			(a, b) =>
				parseISO(`${a.date}T${a.startTime}`).getTime() -
				parseISO(`${b.date}T${b.startTime}`).getTime()
		);

export const getBookedWeekdayCounts = (
	weekStart: string | undefined,
	weekSlotsByDay: Record<string, IWeekSlot[]> | undefined
): Array<{ bookedCount: number; date: string }> => {
	if (!weekStart) return [];

	const startDate = parseISO(weekStart);

	return Array.from({ length: 7 }, (_, index) => {
		const date = format(addDays(startDate, index), 'yyyy-MM-dd');
		const daySlots = weekSlotsByDay?.[date] ?? [];

		return {
			bookedCount: daySlots.filter(isBookedDashboardSlot).length,
			date,
		};
	});
};

import { expect, test } from '@playwright/test';

import {
	getBookedDashboardSlots,
	getBookedWeekdayCounts,
	getScheduleSlotStatus,
} from '../../src/components/dashboard/widgets/schedule-widget/ScheduleWidget.utils';
import type { IWeekSlot } from '../../src/pages/availability/week/AvailabilityWeekPage.types';

const buildSlot = (overrides: Partial<IWeekSlot>): IWeekSlot =>
	({
		date: '2026-06-08',
		duration: 50,
		id: 'slot-1',
		startTime: '09:00',
		status: 'available',
		...overrides,
	} as IWeekSlot);

test.describe('Schedule widget helpers', () => {
	test('filters booked sessions and keeps them sorted by start time', () => {
		const slots = [
			buildSlot({
				date: '2026-06-09',
				id: 'slot-3',
				startTime: '11:00',
				status: 'booked-google',
			}),
			buildSlot({
				date: '2026-06-08',
				id: 'slot-2',
				startTime: '08:00',
				status: 'available',
			}),
			buildSlot({
				date: '2026-06-08',
				id: 'slot-1',
				startTime: '09:00',
				status: 'booked-jupiter',
			}),
		];

		const result = getBookedDashboardSlots(slots);

		expect(result.map((slot) => slot.id)).toEqual(['slot-1', 'slot-3']);
	});

	test('builds seven weekday counts from weekStart and booked sessions only', () => {
		const weekSlotsByDay: Record<string, IWeekSlot[]> = {
			'2026-06-08': [
				buildSlot({ id: 'monday-1', status: 'booked-jupiter' }),
				buildSlot({ id: 'monday-2', status: 'available' }),
			],
			'2026-06-10': [
				buildSlot({ date: '2026-06-10', id: 'wednesday-1', status: 'booked-google' }),
				buildSlot({ date: '2026-06-10', id: 'wednesday-2', status: 'cancelled' }),
			],
		};

		const result = getBookedWeekdayCounts('2026-06-08', weekSlotsByDay);

		expect(result).toHaveLength(7);
		expect(result[0]).toEqual({ bookedCount: 1, date: '2026-06-08' });
		expect(result[2]).toEqual({ bookedCount: 1, date: '2026-06-10' });
		expect(result[6]).toEqual({ bookedCount: 0, date: '2026-06-14' });
	});

	test('maps cancelled slots to the cancelled row status', () => {
		expect(
			getScheduleSlotStatus(
				buildSlot({ id: 'cancelled-1', status: 'cancelled' })
			)
		).toBe('cancelled');
		expect(
			getScheduleSlotStatus(
				buildSlot({ id: 'confirmed-1', status: 'booked-jupiter' })
			)
		).toBe('confirmed');
	});
});

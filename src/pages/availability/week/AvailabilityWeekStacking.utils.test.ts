import { describe, expect, it } from 'vitest';

import type { IWeekSlot, SlotStatus } from './AvailabilityWeekPage.types';
import {
	CONFLICT_STACK_ORDER,
	intervalsOverlap,
	stackDaySlots,
	STATUS_STACK_ORDER,
	toInterval,
	weekHasConflicts,
} from './AvailabilityWeekStacking.utils';

const makeSlot = (
	overrides: Partial<IWeekSlot> & {
		duration: number;
		startTime: string;
		status: SlotStatus;
	}
): IWeekSlot => ({
	date: '2026-06-12',
	id: `${overrides.status}-${overrides.startTime}`,
	...overrides,
});

describe('toInterval', () => {
	it('converts startTime + duration to minutes since midnight', () => {
		const slot = makeSlot({
			duration: 50,
			startTime: '09:30',
			status: 'available',
		});
		expect(toInterval(slot)).toEqual({ endMin: 620, startMin: 570 });
	});
});

describe('intervalsOverlap', () => {
	it('detects a partial overlap', () => {
		expect(
			intervalsOverlap(
				{ endMin: 120, startMin: 60 },
				{ endMin: 150, startMin: 90 }
			)
		).toBe(true);
	});

	it('treats touching boundaries as NOT overlapping', () => {
		expect(
			intervalsOverlap(
				{ endMin: 120, startMin: 60 },
				{ endMin: 180, startMin: 120 }
			)
		).toBe(false);
	});

	it('detects full containment', () => {
		expect(
			intervalsOverlap(
				{ endMin: 180, startMin: 60 },
				{ endMin: 120, startMin: 90 }
			)
		).toBe(true);
	});
});

describe('stackDaySlots', () => {
	it('assigns the deterministic status stack order', () => {
		const result = stackDaySlots([
			makeSlot({ duration: 60, startTime: '09:00', status: 'available' }),
			makeSlot({ duration: 60, startTime: '10:00', status: 'booked-jupiter' }),
			makeSlot({ duration: 60, startTime: '11:00', status: 'booked-google' }),
		]);

		expect(result.map((s) => s.stackOrder)).toEqual([
			STATUS_STACK_ORDER.available,
			STATUS_STACK_ORDER['booked-jupiter'],
			STATUS_STACK_ORDER['booked-google'],
		]);
	});

	it('drops zero/negative-duration slots', () => {
		const result = stackDaySlots([
			makeSlot({ duration: 0, startTime: '09:00', status: 'available' }),
			makeSlot({ duration: 50, startTime: '10:00', status: 'available' }),
		]);
		expect(result).toHaveLength(1);
		expect(result[0].startTime).toBe('10:00');
	});

	it('never clips or fragments slots — non-occluded slots pass through intact', () => {
		const input = [
			makeSlot({ duration: 60, startTime: '09:00', status: 'available' }),
			makeSlot({ duration: 60, startTime: '10:00', status: 'booked-google' }),
		];
		const result = stackDaySlots(input);

		expect(result).toHaveLength(2);
		expect(result.map((s) => ({ d: s.duration, t: s.startTime }))).toEqual([
			{ d: 60, t: '09:00' },
			{ d: 60, t: '10:00' },
		]);
	});

	it('occludes available slots overlapped by a google booking', () => {
		const result = stackDaySlots([
			makeSlot({ duration: 60, startTime: '09:00', status: 'available' }),
			makeSlot({ duration: 60, startTime: '09:30', status: 'booked-google' }),
			makeSlot({ duration: 60, startTime: '11:00', status: 'available' }),
		]);

		expect(result.map((s) => `${s.status}:${s.startTime}`)).toEqual([
			'booked-google:09:30',
			'available:11:00',
		]);
	});

	it('occludes available slots overlapped by a jupiter booking', () => {
		const result = stackDaySlots([
			makeSlot({ duration: 60, startTime: '09:00', status: 'available' }),
			makeSlot({ duration: 60, startTime: '09:00', status: 'booked-jupiter' }),
		]);

		expect(result).toHaveLength(1);
		expect(result[0].status).toBe('booked-jupiter');
	});

	it('occludes available slots overlapped by busy time', () => {
		const result = stackDaySlots([
			makeSlot({ duration: 60, startTime: '09:00', status: 'available' }),
			makeSlot({ duration: 60, startTime: '09:00', status: 'busy' }),
		]);

		expect(result).toHaveLength(1);
		expect(result[0].status).toBe('busy');
	});

	it('does not occlude available slots that merely touch a booking boundary', () => {
		const result = stackDaySlots([
			makeSlot({ duration: 60, startTime: '09:00', status: 'available' }),
			makeSlot({ duration: 60, startTime: '10:00', status: 'booked-google' }),
		]);

		expect(result.some((s) => s.status === 'available')).toBe(true);
	});

	it('flags overlapping jupiter and google bookings as conflicts on both sides', () => {
		const result = stackDaySlots([
			makeSlot({ duration: 60, startTime: '09:00', status: 'booked-jupiter' }),
			makeSlot({ duration: 60, startTime: '09:30', status: 'booked-google' }),
		]);

		const jupiter = result.find((s) => s.status === 'booked-jupiter');
		const google = result.find((s) => s.status === 'booked-google');

		expect(jupiter?.hasConflict).toBe(true);
		expect(google?.hasConflict).toBe(true);
		expect(jupiter?.stackOrder).toBe(CONFLICT_STACK_ORDER);
		expect(google?.stackOrder).toBe(STATUS_STACK_ORDER['booked-google']);
	});

	it('does not flag back-to-back jupiter and google bookings', () => {
		const result = stackDaySlots([
			makeSlot({ duration: 60, startTime: '09:00', status: 'booked-jupiter' }),
			makeSlot({ duration: 60, startTime: '10:00', status: 'booked-google' }),
		]);

		expect(result.every((s) => !s.hasConflict)).toBe(true);
	});

	it('does not flag a google event overlapping only available/blocked time', () => {
		const result = stackDaySlots([
			makeSlot({ duration: 60, startTime: '09:00', status: 'available' }),
			makeSlot({ duration: 60, startTime: '09:00', status: 'blocked' }),
			makeSlot({ duration: 60, startTime: '09:15', status: 'booked-google' }),
		]);

		expect(result.every((s) => !s.hasConflict)).toBe(true);
	});

	it('sorts by startTime then stackOrder', () => {
		const result = stackDaySlots([
			makeSlot({ duration: 60, startTime: '10:00', status: 'available' }),
			makeSlot({ duration: 60, startTime: '09:00', status: 'booked-jupiter' }),
			makeSlot({ duration: 60, startTime: '09:00', status: 'blocked' }),
		]);

		expect(
			result.map((s) => `${s.startTime}:${s.stackOrder}`)
		).toEqual([
			`09:00:${STATUS_STACK_ORDER.blocked}`,
			`09:00:${STATUS_STACK_ORDER['booked-jupiter']}`,
			`10:00:${STATUS_STACK_ORDER.available}`,
		]);
	});
});

describe('weekHasConflicts', () => {
	it('is true when any day has a conflicted slot', () => {
		const monday = stackDaySlots([
			makeSlot({ duration: 60, startTime: '09:00', status: 'booked-jupiter' }),
			makeSlot({ duration: 60, startTime: '09:30', status: 'booked-google' }),
		]);
		const tuesday = stackDaySlots([
			makeSlot({ duration: 60, startTime: '09:00', status: 'available' }),
		]);

		expect(weekHasConflicts({ '2026-06-15': monday, '2026-06-16': tuesday })).toBe(
			true
		);
		expect(weekHasConflicts({ '2026-06-16': tuesday })).toBe(false);
	});
});

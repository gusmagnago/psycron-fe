import type {
	IStackedWeekSlot,
	IWeekSlot,
	SlotStatus,
} from './AvailabilityWeekPage.types';

/**
 * Stacking + conflict layer for the availability week grid.
 *
 * Architecture (decided 2026-06-12): Google Calendar is mirrored as
 * first-class events — nothing is merged, clipped, or subtracted on the
 * frontend. The backend sync already consumes availability that Google
 * events overlap, so the payload arriving here is ONE timeline. This module
 * only adds what rendering needs:
 *  1. a deterministic z-order by status (payload order is not stable), and
 *  2. jupiter ∩ google overlap detection — a real double-booking that must
 *     be surfaced, never hidden.
 *
 * All math is minutes-since-midnight on 'HH:mm' wall-clock strings, so DST
 * is a non-issue. Overnight (cross-midnight) slots are out of scope — the
 * upstream mapper already wraps times within a single day.
 */

export interface ISlotInterval {
	endMin: number;
	startMin: number;
}

// Deterministic z-order by status — replaces payload-order stacking.
export const STATUS_STACK_ORDER: Record<SlotStatus, number> = {
	available: 20,
	blocked: 10,
	'booked-google': 50,
	'booked-jupiter': 60,
	buffer: 40,
	busy: 55,
	cancelled: 30,
};

// Real double-bookings render above everything so they are never hidden.
export const CONFLICT_STACK_ORDER = 70;

const parseTimeToMinutes = (time: string): number => {
	const [h, m] = time.split(':').map(Number);
	return h * 60 + m;
};

export const toInterval = (slot: IWeekSlot): ISlotInterval => {
	const startMin = parseTimeToMinutes(slot.startTime);
	return { endMin: startMin + slot.duration, startMin };
};

// Strict overlap: touching boundaries (end === start) is NOT an overlap.
export const intervalsOverlap = (
	a: ISlotInterval,
	b: ISlotInterval
): boolean => a.startMin < b.endMin && b.startMin < a.endMin;

/**
 * Decorate one day's slots with a deterministic stackOrder and flag
 * booked-jupiter ∩ booked-google overlaps as conflicts on both sides
 * (jupiter raised to CONFLICT_STACK_ORDER so the Psycron session stays on
 * top). AVAILABLE slots overlapped by any booking are occluded — dropped
 * entirely (decision 2026-06-12): occupied time shows only the event; the
 * slot stays in the DB and reappears if the booking moves. Output sorted by
 * startTime then stackOrder.
 */
export const stackDaySlots = (slots: IWeekSlot[]): IStackedWeekSlot[] => {
	const validSlots = slots.filter((slot) => slot.duration > 0);

	const googleIntervals = validSlots
		.filter((slot) => slot.status === 'booked-google')
		.map(toInterval);
	const jupiterIntervals = validSlots
		.filter((slot) => slot.status === 'booked-jupiter')
		.map(toInterval);
	const busyIntervals = validSlots
		.filter((slot) => slot.status === 'busy')
		.map(toInterval);
	const bookedIntervals = [
		...googleIntervals,
		...jupiterIntervals,
		...busyIntervals,
	];

	return validSlots
		.filter(
			(slot) =>
				slot.status !== 'available' ||
				!bookedIntervals.some((booked) =>
					intervalsOverlap(toInterval(slot), booked)
				)
		)
		.map((slot): IStackedWeekSlot => {
			const interval = toInterval(slot);
			const hasConflict =
				(slot.status === 'booked-jupiter' &&
					googleIntervals.some((google) =>
						intervalsOverlap(interval, google)
					)) ||
				(slot.status === 'booked-google' &&
					jupiterIntervals.some((jupiter) =>
						intervalsOverlap(interval, jupiter)
					));

			return {
				...slot,
				...(hasConflict ? { hasConflict: true } : {}),
				stackOrder:
					hasConflict && slot.status === 'booked-jupiter'
						? CONFLICT_STACK_ORDER
						: STATUS_STACK_ORDER[slot.status],
			};
		})
		.sort(
			(a, b) =>
				a.startTime.localeCompare(b.startTime) || a.stackOrder - b.stackOrder
		);
};

export const weekHasConflicts = (
	weekData: Record<string, IStackedWeekSlot[]>
): boolean =>
	Object.values(weekData).some((slots) =>
		slots.some((slot) => slot.hasConflict)
	);

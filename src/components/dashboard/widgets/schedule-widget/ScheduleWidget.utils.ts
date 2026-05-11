import { addMinutes, isAfter, isBefore, parseISO } from 'date-fns';

import type { SlotStatusChip } from './ScheduleWidget.types';

export const ROW_VARIANTS = {
	hidden: { opacity: 0, x: -8 },
	visible: (i: number) => ({
		opacity: 1,
		x: 0,
		transition: { delay: i * 0.04, duration: 0.25, ease: 'easeOut' },
	}),
};

export const getSlotStatus = (
	date: string,
	duration: number,
	startTime: string
): { progress: number | null; status: SlotStatusChip } => {
	const start = parseISO(`${date}T${startTime}`);
	const end = addMinutes(start, duration);
	const now = new Date();

	if (isAfter(now, start) && isBefore(now, end)) {
		const elapsed = now.getTime() - start.getTime();
		const progress = (elapsed / (duration * 60_000)) * 100;
		return { progress, status: 'live' };
	}
	if (isAfter(now, end)) return { progress: null, status: 'done' };
	return { progress: null, status: 'confirmed' };
};

import type { IWeekSlot } from '../../AvailabilityWeekPage.types';

export const FALLBACK_START_MINUTES = 8 * 60;
export const FALLBACK_END_MINUTES = 18 * 60;
export const HOUR_INTERVAL_MINUTES = 60;
export const HALF_HOUR_INTERVAL_MINUTES = 30;
export const PIXELS_PER_MINUTE = 1;
export const DAY_HEADER_HEIGHT = 88;
export const MIN_BUFFER_HEIGHT = 8;
export const MIN_SLOT_HEIGHT = 20;
export const SLOT_VERTICAL_GAP = 8;
export const BUFFER_VERTICAL_GAP = 4;
export const BUFFER_LABEL_MIN_HEIGHT = 18;
export const SLOT_COMPACT_HEIGHT = 42;
export const SLOT_TEXT_MIN_HEIGHT = 24;

export const parseTimeToMinutes = (time: string): number => {
	const [hours, minutes] = time.split(':').map(Number);
	return hours * 60 + minutes;
};

export const formatMinutesToTimeLabel = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export const buildTimelineMarks = (
	startMinute: number,
	endMinute: number,
	step: number
): number[] => {
	const marks: number[] = [];

	for (let minute = startMinute; minute <= endMinute; minute += step) {
		marks.push(minute);
	}

	return marks;
};

export const getSlotEndMinutes = (slot: IWeekSlot): number =>
	parseTimeToMinutes(slot.startTime) + slot.duration;

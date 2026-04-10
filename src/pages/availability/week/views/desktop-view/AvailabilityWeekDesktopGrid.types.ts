import type { IWeekSlot } from '../../AvailabilityWeekPage.types';

export type AvailabilityWeekDesktopGridProps = {
	debugNowMinutes?: number | null;
	getDaySlots: (day: Date) => IWeekSlot[];
	getVisibleDaySlots: (day: Date) => IWeekSlot[];
	onDayHeaderClick: (dateStr: string) => void;
	onSlotClick: (slot: IWeekSlot) => void;
	onSlotPointerDown: (slot: IWeekSlot) => void;
	weekData: Record<string, IWeekSlot[]>;
	weekDays: Date[];
};

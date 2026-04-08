import type { IWeekSlot } from '../../AvailabilityWeekPage.types';

export type AvailabilityWeekDesktopGridProps = {
	getDaySlots: (day: Date) => IWeekSlot[];
	getVisibleDaySlots: (day: Date) => IWeekSlot[];
	onDayHeaderClick: (
		event: React.MouseEvent<HTMLElement>,
		dateStr: string
	) => void;
	onSlotClick: (slot: IWeekSlot) => void;
	onSlotPointerDown: (slot: IWeekSlot) => void;
	timeSlots: string[];
	weekData: Record<string, IWeekSlot[]>;
	weekDays: Date[];
};

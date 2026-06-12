import type {
	IAvailabilityWeekMobileDay,
	IWeekSlot,
} from '../../AvailabilityWeekPage.types';

export type AvailabilityWeekMobileListProps = {
	days: IAvailabilityWeekMobileDay[];
	// Calendar-level fallback color for Google events without a colorId.
	googleCalendarColor?: string | null;
	onDayHeaderClick: (dateStr: string) => void;
	onSlotClick: (slot: IWeekSlot) => void;
	onSlotPointerDown: (slot: IWeekSlot) => void;
	onToggleDayExpanded: (dateStr: string) => void;
	todayCardId: string;
};

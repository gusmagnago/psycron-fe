import type { AvailabilityViewMode } from '../../../workspace/AvailabilityViewToggle.types';
import type {
	IStackedWeekSlot,
	IWeekSlot,
} from '../../AvailabilityWeekPage.types';

export type AvailabilityWeekDesktopGridProps = {
	activeDate: Date;
	debugNowMinutes?: number | null;
	getDaySlots: (day: Date) => IStackedWeekSlot[];
	getVisibleDaySlots: (day: Date) => IStackedWeekSlot[];
	// Calendar-level fallback color for Google events without a colorId.
	googleCalendarColor?: string | null;
	onDayHeaderClick: (dateStr: string) => void;
	onSlotClick: (slot: IWeekSlot) => void;
	onSlotPointerDown: (slot: IWeekSlot) => void;
	viewMode: AvailabilityViewMode;
	weekData: Record<string, IStackedWeekSlot[]>;
	weekDays: Date[];
};

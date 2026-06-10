import type { AvailabilityViewMode } from '../../../workspace/AvailabilityViewToggle.types';
import type { IWeekSlot } from '../../AvailabilityWeekPage.types';

export type AvailabilityWeekDesktopGridProps = {
	activeDate: Date;
	debugNowMinutes?: number | null;
	getDaySlots: (day: Date) => IWeekSlot[];
	getVisibleDaySlots: (day: Date) => IWeekSlot[];
	onDayHeaderClick: (dateStr: string) => void;
	onSlotClick: (slot: IWeekSlot) => void;
	onSlotPointerDown: (slot: IWeekSlot) => void;
	viewMode: AvailabilityViewMode;
	weekData: Record<string, IWeekSlot[]>;
	weekDays: Date[];
};

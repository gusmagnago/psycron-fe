import type { IRescheduleSlot } from '../../AvailabilityWeekDrawer.types';

export interface ISlotGroup {
	availabilityDayId: string;
	date: string;
	formattedDate: string;
	slots: IRescheduleSlot[];
}

export interface ISlotReschedulePickerProps {
	availableSlotGroups: ISlotGroup[];
	onSelectSlot: (slot: IRescheduleSlot) => void;
	selectedSlot: IRescheduleSlot | null;
}

import type { IWeekSlot } from '../AvailabilityWeekPage.types';

export interface BlockDayConflictModalProps {
	availableCount: number;
	bookedSlots: IWeekSlot[];
	dayLabel: string;
	id?: string;
	isLoading: boolean;
	onClose: () => void;
	onConfirm: () => void;
	open: boolean;
}

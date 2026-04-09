import type { IWeekSlot } from '../AvailabilityWeekPage.types';

export interface IDaySummary {
	available: number;
	blocked: number;
	booked: number;
	cancelled: number;
	total: number;
}

export interface IDayHeaderPopoverProps {
	availabilityDayId: string;
	dayDate: string;
	dayLabel: string;
	isBlockDayPending: boolean;
	isPastDay: boolean;
	isUnblockDayPending: boolean;
	onBlockAll: () => void;
	onClose: () => void;
	onUnblockAll: () => void;
	open: boolean;
	slots: IWeekSlot[];
}

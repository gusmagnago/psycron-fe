import type { IWeekSlot } from '../AvailabilityWeekPage.types';

export interface IDaySummary {
	available: number;
	blocked: number;
	booked: number;
	total: number;
}

export interface IDayHeaderPopoverProps {
	anchorEl: HTMLElement | null;
	availabilityDayId: string;
	dayDate: string;
	dayLabel: string;
	isBlockDayPending: boolean;
	isUnblockDayPending: boolean;
	onBlockAll: () => void;
	onClose: () => void;
	onUnblockAll: () => void;
	slots: IWeekSlot[];
}

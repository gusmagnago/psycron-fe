import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';

export interface ScheduleSlotRowProps {
	index: number;
	onClick: (slot: IWeekSlot) => void;
	showDate?: boolean;
	slot: IWeekSlot;
	timezone?: string;
}

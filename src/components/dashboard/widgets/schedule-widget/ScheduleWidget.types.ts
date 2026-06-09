import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';

export interface ScheduleWidgetProps {
	isLoading: boolean;
	onEmptyStateClick: () => void;
	onSlotClick: (slot: IWeekSlot) => void;
	onWeekDayClick: (date: string) => void;
	slots: IWeekSlot[];
	timezone?: string;
	weekEnd?: string;
	weekSlotsByDay?: Record<string, IWeekSlot[]>;
	weekStart?: string;
}

export type ScheduleSlotStatus = 'cancelled' | 'confirmed';

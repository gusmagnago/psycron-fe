import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';

export interface ScheduleWidgetProps {
	isLoading: boolean;
	onSlotClick: (slot: IWeekSlot) => void;
	slots: IWeekSlot[];
	weekEnd?: string;
	weekHref?: string;
	weekSlotsByDay?: Record<string, IWeekSlot[]>;
	weekStart?: string;
}

export type SlotStatusChip = 'confirmed' | 'done' | 'live' | 'pending';

export type ViewMode = 'today' | 'week';

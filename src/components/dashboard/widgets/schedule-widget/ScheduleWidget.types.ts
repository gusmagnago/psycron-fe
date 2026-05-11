import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';

export interface ScheduleWidgetProps {
	isLoading: boolean;
	slots: Omit<IWeekSlot, 'id'>[];
	weekEnd?: string;
	weekHref?: string;
	weekSlotsByDay?: Record<string, Omit<IWeekSlot, 'id'>[]>;
	weekStart?: string;
}

export type SlotStatusChip = 'confirmed' | 'done' | 'live' | 'pending';

export type ViewMode = 'today' | 'week';

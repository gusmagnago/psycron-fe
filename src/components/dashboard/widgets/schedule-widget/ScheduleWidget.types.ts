import type { IWeekSlot } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';

export interface ScheduleWidgetProps {
	isLoading: boolean;
	onViewWeek?: () => void;
	slots: Omit<IWeekSlot, 'id'>[];
}

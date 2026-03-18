import type { BookingSource, CalendarPrefs, DeliveryMode, TimeOfDay } from '@psycron/hooks/useCalendarPrefs';

export interface IAvailabilityWeekFiltersProps {
	activeFilterCount: number;
	allSessionTypes: string[];
	anchorEl: HTMLElement | null;
	onClearFilters: () => void;
	onClose: () => void;
	onToggleBookingSource: (source: BookingSource) => void;
	onToggleDeliveryMode: (mode: DeliveryMode) => void;
	onToggleSessionType: (type: string) => void;
	onToggleShowCancelledSlots: () => void;
	onToggleShowFreeSlots: () => void;
	onToggleTimeOfDay: (band: TimeOfDay) => void;
	prefs: CalendarPrefs;
}

import type {
	BookingSource,
	CalendarPrefs,
	DeliveryMode,
	TimeOfDay,
} from '@psycron/hooks/useCalendarPrefs';

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

export type IChipSection = {
	getOptionLabel: (value: string) => string;
	isActive: (value: string) => boolean;
	key: string;
	labelKey: string;
	onToggle: (value: string) => void;
	options: string[];
	type: 'chips';
};

export type ISwitchSection = {
	key: string;
	labelKey: string;
	rows: { checked: boolean; labelKey: string; onChange: () => void }[];
	type: 'switches';
};

export type IFilterSection = IChipSection | ISwitchSection;

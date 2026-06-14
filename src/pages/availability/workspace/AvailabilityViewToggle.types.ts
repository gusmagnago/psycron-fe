export type AvailabilityViewMode = 'day' | 'week';

export type AvailabilityViewSelection = AvailabilityViewMode | 'month';

export interface AvailabilityViewToggleProps {
	dayLabel: string;
	monthLabel: string;
	onChange: (selection: AvailabilityViewSelection) => void;
	value: AvailabilityViewSelection;
	viewModeLabel: string;
	weekLabel: string;
}

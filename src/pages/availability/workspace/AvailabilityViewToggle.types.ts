export type AvailabilityViewMode = 'day' | 'week';

export interface AvailabilityViewToggleProps {
	dayLabel: string;
	onChange: (viewMode: AvailabilityViewMode) => void;
	value: AvailabilityViewMode;
	viewModeLabel: string;
	weekLabel: string;
}

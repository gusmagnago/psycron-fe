export interface AvailabilityMiniCalendarProps {
	activeDate: Date;
}

export type AvailabilityMiniCalendarDayState =
	| 'empty'
	| 'muted'
	| 'selected'
	| 'slots';

export interface AvailabilityMiniCalendarProps {
	activeDate: Date;
}

export type AvailabilityMiniCalendarDayState =
	| 'default'
	| 'muted'
	| 'selected';

/**
 * Booked-weight bucket for a day, driving the heatmap shade.
 * 0 = no booked sessions, 5 = busiest. Thresholds are fixed (not
 * normalized per month) so the same load reads identically across months.
 */
export type AvailabilityMiniCalendarHeatLevel = 0 | 1 | 2 | 3 | 4 | 5;

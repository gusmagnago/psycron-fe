export interface IAvailabilityRecord {
	availabilityId: string;
	bufferTimeMinutes?: number | null;
	// Write-target calendar's hex color — fallback for Google events without
	// a per-event colorId (they inherit it in Google's UI).
	googleCalendarColor?: string | null;
	googleCalendarConnected?: boolean;
	recurrencePattern?: 'MONTHLY' | 'WEEKLY';
	sessionDuration: string;
	sessionType: string;
	specialty?: string;
	timeRange: string;
	timezone: string;
	workingDays: string[];
}

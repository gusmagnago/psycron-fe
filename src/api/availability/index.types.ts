export interface IAvailabilityRecord {
	availabilityId: string;
	bufferTimeMinutes?: number | null;
	googleCalendarConnected?: boolean;
	recurrencePattern?: 'MONTHLY' | 'WEEKLY';
	sessionDuration: string;
	sessionType: string;
	specialty?: string;
	timeRange: string;
	timezone: string;
	workingDays: string[];
}

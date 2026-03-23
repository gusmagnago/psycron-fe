export interface IOccupancyCount {
	available: number;
	booked: number;
}

export interface ICalendarDay {
	date: string;
	google: IOccupancyCount;
	jupiter: IOccupancyCount;
}

export interface IAvailabilityRecord {
	availabilityId: string;
	calendar?: ICalendarDay[];
	googleCalendarConnected?: boolean;
	recurrencePattern?: 'MONTHLY' | 'WEEKLY';
	sessionDuration: string;
	sessionType: string;
	timeRange: string;
	timezone: string;
	workingDays: string[];
}

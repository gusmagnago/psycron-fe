import type { RecurrencePattern } from '@psycron/api/jupiter';

import type { StatusNoteType } from './status-note/StatusNote.types';

export type JupiterStep =
	| 'specialty'
	| 'calendar-choice'
	| 'working-days'
	| 'time-range'
	| 'session-duration'
	| 'session-type'
	| 'timezone'
	| 'recurrence-pattern'
	| 'preview'
	| 'google-permissions'
	| 'calendar-picker'
	| 'google-success'
	| 'done';

export type AvailabilitySource = 'google-import' | 'google-manual' | 'manual';

// Outcome of a publish attempt. 'published' = saved (and synced or manual);
// 'sync-pending' = saved but the Google busy-time sync still failed after the
// automatic retries, so the user is kept on the page to retry in place;
// 'failed' = the publish itself failed.
export type JupiterPublishOutcome = 'published' | 'sync-pending' | 'failed';

export interface JupiterAnswers {
	availabilitySource?: AvailabilitySource;
	calendarChoice?: 'google' | 'manual';
	recurrencePattern?: RecurrencePattern;
	selectedCalendarId?: string;
	selectedCalendarName?: string;
	sessionDuration?: string;
	sessionType?: string;
	specialities?: string[];
	timeRange?: string;
	timezone?: string;
	timezoneConfirmed?: boolean;
	workingDays?: string[];
}

export interface JupiterMessageNote {
	testId: string;
	text: string;
	type?: StatusNoteType;
}

export interface JupiterMessage {
	content: string;
	note?: JupiterMessageNote;
	sender: 'bot' | 'user';
	showIcon?: boolean;
}

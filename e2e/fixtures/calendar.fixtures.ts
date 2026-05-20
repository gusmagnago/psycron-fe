import type { CalendarItem } from '../../src/api/auth';

export const singleCalendar: CalendarItem[] = [
	{ id: 'primary', summary: 'My Calendar', primary: true, backgroundColor: '#4a86e8' },
];

export const multipleCalendars: CalendarItem[] = [
	{ id: 'primary', summary: 'Personal', primary: true, backgroundColor: '#4a86e8' },
	{ id: 'work@example.com', summary: 'Work', primary: false, backgroundColor: '#0f9d58' },
	{ id: 'family@group.calendar.google.com', summary: 'Family', primary: false, backgroundColor: '#e67c73' },
];

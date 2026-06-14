import { palette } from '@psycron/theme/palette/palette.theme';

/**
 * Google Calendar's modern event palette (the colors users actually see in
 * the Google Calendar UI), keyed by the event `colorId` (1–11) returned by
 * the Calendar API. Events without a colorId inherit their calendar's color,
 * which the API does not put on the event — those fall back to Google's
 * default event blue (Peacock).
 */
const GOOGLE_EVENT_COLORS: Record<string, string> = {
	'1': '#7986CB', // Lavender
	'2': '#33B679', // Sage
	'3': '#8E24AA', // Grape
	'4': '#E67C73', // Flamingo
	'5': '#F6BF26', // Banana
	'6': '#F4511E', // Tangerine
	'7': '#039BE5', // Peacock
	'8': '#616161', // Graphite
	'9': '#3F51B5', // Blueberry
	'10': '#0B8043', // Basil
	'11': '#D50000', // Tomato
};

const GOOGLE_DEFAULT_EVENT_COLOR = GOOGLE_EVENT_COLORS['7'];

/**
 * Resolve a Google event's display color exactly like Google's UI does:
 * per-event colorId first, then the calendar's own color (events without a
 * colorId inherit it), then Google's default event blue.
 */
export const getGoogleEventColor = (
	colorId?: string | null,
	calendarColor?: string | null
): string =>
	(colorId && GOOGLE_EVENT_COLORS[colorId]) ||
	calendarColor ||
	GOOGLE_DEFAULT_EVENT_COLOR;

/**
 * Readable text color for a Google event block — white on dark fills, the
 * theme's primary text on light fills (e.g. Banana). Uses YIQ luminance,
 * the standard quick contrast heuristic.
 */
export const getGoogleEventTextColor = (
	colorId?: string | null,
	calendarColor?: string | null
): string => {
	const raw = getGoogleEventColor(colorId, calendarColor).replace('#', '');
	// Google's CalendarList color is a 6-digit hex, but a calendarColor from
	// another source could be 3-digit (#abc) — expand it so the luminance math
	// never parses to NaN (which would silently force white text everywhere).
	const hex =
		raw.length === 3
			? raw
					.split('')
					.map((c) => c + c)
					.join('')
			: raw;
	const r = Number.parseInt(hex.slice(0, 2), 16);
	const g = Number.parseInt(hex.slice(2, 4), 16);
	const b = Number.parseInt(hex.slice(4, 6), 16);
	// Unparseable color → assume a dark fill and keep white (the safer default
	// for Google's mostly-saturated palette).
	if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) {
		return palette.white;
	}
	const yiq = (r * 299 + g * 587 + b * 114) / 1000;

	return yiq >= 160 ? palette.text.primary : palette.white;
};

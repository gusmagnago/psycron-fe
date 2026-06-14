import { describe, expect, it } from 'vitest';

import {
	getGoogleEventColor,
	getGoogleEventTextColor,
} from './googleCalendarColors';

describe('getGoogleEventColor', () => {
	it('maps a known colorId to its Google hex', () => {
		expect(getGoogleEventColor('11')).toBe('#D50000'); // Tomato
		expect(getGoogleEventColor('5')).toBe('#F6BF26'); // Banana
	});

	it('falls back to the calendar color when colorId is absent', () => {
		expect(getGoogleEventColor(null, '#123456')).toBe('#123456');
		expect(getGoogleEventColor(undefined, '#123456')).toBe('#123456');
	});

	it('prefers the per-event colorId over the calendar color', () => {
		expect(getGoogleEventColor('11', '#123456')).toBe('#D50000');
	});

	it('falls back to default Peacock when neither colorId nor calendar color resolves', () => {
		expect(getGoogleEventColor(null, null)).toBe('#039BE5');
		expect(getGoogleEventColor('999', null)).toBe('#039BE5'); // unknown id
	});
});

describe('getGoogleEventTextColor', () => {
	const PRIMARY = '#060B0E'; // palette.text.primary
	const WHITE = '#FFFFFF'; // palette.white

	it('returns dark text on light fills (Banana)', () => {
		expect(getGoogleEventTextColor('5')).toBe(PRIMARY); // #F6BF26 light
	});

	it('returns white text on dark fills (Tomato, Graphite)', () => {
		expect(getGoogleEventTextColor('11')).toBe(WHITE); // #D50000
		expect(getGoogleEventTextColor('8')).toBe(WHITE); // #616161
	});

	it('expands a 3-digit calendar color hex instead of parsing NaN', () => {
		// '#fff' must read as white (light) → dark text, NOT silently white.
		expect(getGoogleEventTextColor(null, '#fff')).toBe(PRIMARY);
	});

	it('falls back to white text when the color is unparseable', () => {
		expect(getGoogleEventTextColor(null, 'rgb(0,0,0)')).toBe(WHITE);
		expect(getGoogleEventTextColor(null, 'not-a-color')).toBe(WHITE);
	});
});

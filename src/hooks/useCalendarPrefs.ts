import { useCallback, useState } from 'react';

const CALENDAR_PREFS_KEY = '_psy_cp';

export type CalendarPrefs = {
	showUnavailableSlots: boolean;
};

const DEFAULT_PREFS: CalendarPrefs = {
	showUnavailableSlots: false,
};

const readPrefs = (): CalendarPrefs => {
	try {
		const raw = localStorage.getItem(CALENDAR_PREFS_KEY);
		return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
	} catch {
		return DEFAULT_PREFS;
	}
};

export const useCalendarPrefs = () => {
	const [prefs, setPrefs] = useState<CalendarPrefs>(readPrefs);

	const toggleShowUnavailable = useCallback(() => {
		setPrefs((prev) => {
			const next = { ...prev, showUnavailableSlots: !prev.showUnavailableSlots };
			localStorage.setItem(CALENDAR_PREFS_KEY, JSON.stringify(next));
			return next;
		});
	}, []);

	return { prefs, toggleShowUnavailable };
};

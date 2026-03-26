import { useCallback, useMemo, useState } from 'react';
import type { DeliveryMode } from '@psycron/pages/availability/week/AvailabilityWeekPage.types';

const CALENDAR_PREFS_KEY = '_psy_cp';

export type { DeliveryMode };
export type TimeOfDay = 'afternoon' | 'evening' | 'morning';
export type BookingSource = 'google' | 'jupiter';

export type CalendarPrefs = {
	bookingSources: BookingSource[];
	deliveryModes: DeliveryMode[];
	sessionTypes: string[];
	showCancelledSlots: boolean;
	showFreeSlots: boolean;
	timeOfDay: TimeOfDay[];
};

const DEFAULT_PREFS: CalendarPrefs = {
	bookingSources: [],
	deliveryModes: [],
	sessionTypes: [],
	showCancelledSlots: true,
	showFreeSlots: true,
	timeOfDay: [],
};

const toggleInArray = <T>(arr: T[], item: T): T[] =>
	arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

const savePrefs = (prefs: CalendarPrefs): CalendarPrefs => {
	localStorage.setItem(CALENDAR_PREFS_KEY, JSON.stringify(prefs));
	return prefs;
};

const readPrefs = (): CalendarPrefs => {
	try {
		const raw = localStorage.getItem(CALENDAR_PREFS_KEY);
		if (!raw) return DEFAULT_PREFS;
		const stored = JSON.parse(raw) as Record<string, unknown>;
		// Migrate legacy showUnavailableSlots → showFreeSlots
		if ('showUnavailableSlots' in stored && !('showFreeSlots' in stored)) {
			stored.showFreeSlots = stored.showUnavailableSlots;
		}
		return { ...DEFAULT_PREFS, ...stored };
	} catch {
		return DEFAULT_PREFS;
	}
};

export const useCalendarPrefs = () => {
	const [prefs, setPrefs] = useState<CalendarPrefs>(readPrefs);

	const update = useCallback((next: CalendarPrefs) => {
		setPrefs(savePrefs(next));
	}, []);

	const toggleShowFreeSlots = useCallback(() => {
		setPrefs((prev) => savePrefs({ ...prev, showFreeSlots: !prev.showFreeSlots }));
	}, []);

	const toggleShowCancelledSlots = useCallback(() => {
		setPrefs((prev) =>
			savePrefs({ ...prev, showCancelledSlots: !prev.showCancelledSlots })
		);
	}, []);

	const toggleBookingSource = useCallback(
		(source: BookingSource) => {
			setPrefs((prev) =>
				savePrefs({
					...prev,
					bookingSources: toggleInArray(prev.bookingSources, source),
				})
			);
		},
		[]
	);

	const toggleSessionType = useCallback((type: string) => {
		setPrefs((prev) =>
			savePrefs({
				...prev,
				sessionTypes: toggleInArray(prev.sessionTypes, type),
			})
		);
	}, []);

	const toggleDeliveryMode = useCallback((mode: DeliveryMode) => {
		setPrefs((prev) =>
			savePrefs({
				...prev,
				deliveryModes: toggleInArray(prev.deliveryModes, mode),
			})
		);
	}, []);

	const toggleTimeOfDay = useCallback((band: TimeOfDay) => {
		setPrefs((prev) =>
			savePrefs({ ...prev, timeOfDay: toggleInArray(prev.timeOfDay, band) })
		);
	}, []);

	const clearFilters = useCallback(() => {
		update(DEFAULT_PREFS);
	}, [update]);

	const activeFilterCount = useMemo(() => {
		let count = 0;
		if (prefs.showFreeSlots) count++;
		if (!prefs.showCancelledSlots) count++;
		if (prefs.bookingSources.length > 0) count++;
		if (prefs.sessionTypes.length > 0) count++;
		if (prefs.deliveryModes.length > 0) count++;
		if (prefs.timeOfDay.length > 0) count++;
		return count;
	}, [prefs]);

	return {
		activeFilterCount,
		clearFilters,
		prefs,
		toggleBookingSource,
		toggleDeliveryMode,
		toggleSessionType,
		toggleShowCancelledSlots,
		toggleShowFreeSlots,
		toggleTimeOfDay,
	};
};

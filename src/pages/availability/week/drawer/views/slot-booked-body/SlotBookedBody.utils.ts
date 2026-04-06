import { useCallback, useState } from 'react';
import { isFuture, isToday, parseISO } from 'date-fns';

/**
 * Determines whether a slot is in the past.
 * Past = not today AND not a future date. Today's slots are always actionable.
 */
export const isPastAppointment = (date: string): boolean => {
	const slotDate = parseISO(date);
	return !isToday(slotDate) && !isFuture(slotDate);
};

/**
 * Hook for copy-to-clipboard with visual feedback.
 * Returns the key of the currently-copied field (or null) and a copy function.
 */
export const useCopyToClipboard = () => {
	const [copiedKey, setCopiedKey] = useState<string | null>(null);

	const copy = useCallback(async (text: string, key: string) => {
		try {
			await navigator.clipboard.writeText(text);
			setCopiedKey(key);
			setTimeout(() => setCopiedKey(null), 2000);
		} catch {
			// Clipboard API may not be available in all contexts
		}
	}, []);

	return { copy, copiedKey };
};

import { useEffect, useState } from 'react';

/**
 * A single shared interval drives every subscriber, so a table of N rows costs
 * one timer instead of N, and all rows re-render on the same tick rather than
 * drifting apart.
 */
const subscribers = new Set<(now: Date) => void>();
let timerId: ReturnType<typeof setInterval> | null = null;
let tickIntervalMs = 0;

const startTicker = (intervalMs: number): void => {
	tickIntervalMs = intervalMs;
	timerId = setInterval(() => {
		const now = new Date();
		for (const notify of subscribers) notify(now);
	}, intervalMs);
};

const subscribe = (notify: (now: Date) => void, intervalMs: number): void => {
	subscribers.add(notify);
	// The first subscriber sets the cadence. A later, faster subscriber restarts
	// the ticker so it isn't starved by a slower one already running.
	if (!timerId) {
		startTicker(intervalMs);
		return;
	}
	if (intervalMs < tickIntervalMs) {
		clearInterval(timerId);
		startTicker(intervalMs);
	}
};

const unsubscribe = (notify: (now: Date) => void): void => {
	subscribers.delete(notify);
	if (subscribers.size === 0 && timerId) {
		clearInterval(timerId);
		timerId = null;
		tickIntervalMs = 0;
	}
};

/**
 * Current time, re-rendering the caller every `intervalMs`. Use for values that
 * go stale on their own — relative times, countdowns, urgency thresholds —
 * rather than computing them once at fetch time and letting them rot until the
 * next refetch.
 */
export const useNow = (intervalMs: number): Date => {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const notify = (tick: Date): void => setNow(tick);
		subscribe(notify, intervalMs);
		return () => unsubscribe(notify);
	}, [intervalMs]);

	return now;
};

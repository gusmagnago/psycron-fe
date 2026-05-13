import { useCallback, useEffect, useRef, useState } from 'react';

const AUTOPLAY_MS = 7_000;

interface UseInsightCarouselReturn {
	direction: number;
	goTo: (next: number, dir: number) => void;
	idx: number;
	onTouchEnd: (e: React.TouchEvent) => void;
	onTouchStart: (e: React.TouchEvent) => void;
}

export const useInsightCarousel = (total: number): UseInsightCarouselReturn => {
	const [active, setActive] = useState(0);
	const [direction, setDirection] = useState(1);

	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const touchStartX = useRef<number>(0);

	const idx = total > 0 ? active % total : 0;

	const goTo = useCallback(
		(next: number, dir: number) => {
			setDirection(dir);
			setActive(((next % total) + total) % total);
		},
		[total]
	);

	const advance = useCallback(() => goTo(idx + 1, 1), [goTo, idx]);

	useEffect(() => {
		if (total === 0) return;
		timerRef.current = setTimeout(advance, AUTOPLAY_MS);
		return () => {
			if (timerRef.current) clearTimeout(timerRef.current);
		};
	}, [advance, idx, total]);

	const onTouchStart = useCallback((e: React.TouchEvent) => {
		touchStartX.current = e.touches[0].clientX;
	}, []);

	const onTouchEnd = useCallback(
		(e: React.TouchEvent) => {
			const delta = e.changedTouches[0].clientX - touchStartX.current;
			if (Math.abs(delta) > 40) goTo(delta < 0 ? idx + 1 : idx - 1, delta < 0 ? 1 : -1);
		},
		[goTo, idx]
	);

	return { direction, goTo, idx, onTouchEnd, onTouchStart };
};

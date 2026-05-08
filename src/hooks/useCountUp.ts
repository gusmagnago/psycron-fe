import { useEffect, useState } from 'react';

export interface UseCountUpOptions {
	duration?: number;
	end: number;
	start?: number;
}

export const useCountUp = ({
	end,
	start = 0,
	duration = 900,
}: UseCountUpOptions): number => {
	const [value, setValue] = useState(start);

	useEffect(() => {
		if (end === start) return;

		const startTime = performance.now();
		let frame: number;

		const tick = (now: number) => {
			const elapsed = now - startTime;
			const progress = Math.min(elapsed / duration, 1);
			const eased = 1 - Math.pow(1 - progress, 3);
			setValue(Math.round(start + (end - start) * eased));
			if (progress < 1) frame = requestAnimationFrame(tick);
		};

		frame = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(frame);
	}, [end, start, duration]);

	return value;
};

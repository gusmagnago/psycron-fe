import { useEffect, useState } from 'react';

export type TimeOfDayBand = 'afternoon' | 'evening' | 'morning';

const resolve = (): TimeOfDayBand => {
	const hour = new Date().getHours();
	if (hour < 12) return 'morning';
	if (hour < 17) return 'afternoon';
	return 'evening';
};

export const useTimeOfDay = (): TimeOfDayBand => {
	const [band, setBand] = useState<TimeOfDayBand>(resolve);

	useEffect(() => {
		const id = setInterval(() => setBand(resolve()), 60_000);
		return () => clearInterval(id);
	}, []);

	return band;
};

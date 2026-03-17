import { useState } from 'react';
import { getAvailability } from '@psycron/api/availability';
import { useQuery } from '@tanstack/react-query';
import {
	addMonths,
	endOfMonth,
	endOfWeek,
	format,
	startOfMonth,
	startOfWeek,
	subMonths,
} from 'date-fns';

export const useJupiterAvailability = () => {
	const [currentDate, setCurrentDate] = useState(new Date());

	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(currentDate);

	const from = format(startOfWeek(monthStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
	const to = format(endOfWeek(monthEnd, { weekStartsOn: 1 }), 'yyyy-MM-dd');

	const { data, isLoading } = useQuery({
		queryKey: ['jupiterAvailability', from, to],
		queryFn: () => getAvailability({ from, to }),
		staleTime: 1000 * 60 * 5,
	});

	const hasGoogleData = (data?.calendar ?? []).some(
		(d) => d.google.available > 0 || d.google.booked > 0
	);

	return {
		availability: data,
		calendar: data?.calendar ?? [],
		currentDate,
		from,
		goToNextMonth: () => setCurrentDate((d) => addMonths(d, 1)),
		goToPrevMonth: () => setCurrentDate((d) => subMonths(d, 1)),
		hasGoogleData,
		isLoading,
		to,
	};
};

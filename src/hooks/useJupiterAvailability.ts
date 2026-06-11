import { useCallback, useState } from 'react';
import { getAvailabilityCalendar } from '@psycron/api/user';
import type { IDateInfo } from '@psycron/api/user/index.types';
import { useTherapistId } from '@psycron/hooks/useTherapistId';
import { useQuery } from '@tanstack/react-query';
import {
	addMonths,
	endOfMonth,
	endOfWeek,
	format,
	isAfter,
	isBefore,
	parseISO,
	startOfMonth,
	startOfWeek,
	subMonths,
} from 'date-fns';

interface UseJupiterAvailabilityOptions {
	anchorDate?: Date;
	firstDate?: IDateInfo | null;
	lastDate?: IDateInfo | null;
}

export const useJupiterAvailability = (options?: UseJupiterAvailabilityOptions) => {
	const therapistId = useTherapistId();
	const [currentDate, setCurrentDate] = useState(() => options?.anchorDate ?? new Date());

	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(currentDate);

	const from = format(startOfWeek(monthStart, { weekStartsOn: 1 }), 'yyyy-MM-dd');
	const to = format(endOfWeek(monthEnd, { weekStartsOn: 1 }), 'yyyy-MM-dd');

	const { data, isLoading } = useQuery({
		queryKey: ['jupiterAvailability', therapistId, from, to],
		queryFn: () => getAvailabilityCalendar(therapistId!, { from, to }),
		enabled: !!therapistId,
		staleTime: 1000 * 60 * 5,
	});

	const hasGoogleData = (data?.calendar ?? []).some(
		(d) => d.google.available > 0 || d.google.booked > 0
	);

	const firstISO = options?.firstDate?.date ? parseISO(options.firstDate.date) : null;
	const lastISO = options?.lastDate?.date ? parseISO(options.lastDate.date) : null;

	const canGoPrev = firstISO ? isAfter(startOfMonth(currentDate), startOfMonth(firstISO)) : false;
	const canGoNext = lastISO ? isBefore(startOfMonth(currentDate), startOfMonth(lastISO)) : false;

	const goToDate = useCallback((date: Date) => setCurrentDate(date), []);
	const goToNextMonth = useCallback(() => setCurrentDate((d) => addMonths(d, 1)), []);
	const goToPrevMonth = useCallback(() => setCurrentDate((d) => subMonths(d, 1)), []);
	const goToToday = useCallback(() => setCurrentDate(new Date()), []);

	return {
		availability: data,
		calendar: data?.calendar ?? [],
		canGoNext,
		canGoPrev,
		currentDate,
		from,
		goToDate,
		goToNextMonth,
		goToPrevMonth,
		goToToday,
		hasGoogleData,
		isLoading,
		to,
	};
};

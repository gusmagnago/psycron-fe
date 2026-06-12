import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from '@psycron/components/icons';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import { useJupiterAvailability } from '@psycron/hooks/useJupiterAvailability';
import i18n from '@psycron/i18n';
import { AVAILABILITYWEEK_BASE } from '@psycron/pages/urls';
import { WEEK_STARTS_ON } from '@psycron/utils/variables';
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameDay,
	isSameMonth,
	startOfMonth,
	startOfWeek,
} from 'date-fns';

import {
	MiniCalendarCard,
	MiniCalendarHead,
	MiniCalendarNav,
	MiniCalendarNavButton,
	MiniCalendarTitle,
	MiniDayButton,
	MiniDayGrid,
	MiniDaySkeleton,
	MiniWeekdayGrid,
	MiniWeekdayLabel,
} from './AvailabilityMiniCalendar.styles';
import type {
	AvailabilityMiniCalendarDayState,
	AvailabilityMiniCalendarHeatLevel,
	AvailabilityMiniCalendarProps,
} from './AvailabilityMiniCalendar.types';

// Sunday-first, matching WEEK_STARTS_ON.
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;

// Fixed booked-count thresholds (not normalized per month) so the same daily
// load renders the same shade across every month until the end of availability.
const getHeatLevel = (booked: number): AvailabilityMiniCalendarHeatLevel => {
	if (booked <= 0) return 0;
	if (booked <= 2) return 1;
	if (booked <= 4) return 2;
	if (booked <= 6) return 3;
	if (booked <= 8) return 4;
	return 5;
};

export const AvailabilityMiniCalendar = ({
	activeDate,
}: AvailabilityMiniCalendarProps) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { firstDate, lastDate } = useAvailability();
	const {
		calendar,
		canGoNext,
		canGoPrev,
		currentDate,
		goToDate,
		goToNextMonth,
		goToPrevMonth,
		isLoading,
	} = useJupiterAvailability({ anchorDate: activeDate, firstDate, lastDate });

	// Keep the mini calendar's month in sync with the week shown in the viewbar:
	// when week navigation moves the active date into another month, follow it,
	// while still allowing the month-nav buttons to browse independently.
	const lastActiveDateRef = useRef(activeDate);
	useEffect(() => {
		if (!isSameMonth(activeDate, lastActiveDateRef.current)) {
			goToDate(activeDate);
		}
		lastActiveDateRef.current = activeDate;
	}, [activeDate, goToDate]);

	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(currentDate);
	const calendarDays = eachDayOfInterval({
		start: startOfWeek(monthStart, { weekStartsOn: WEEK_STARTS_ON }),
		end: endOfWeek(monthEnd, { weekStartsOn: WEEK_STARTS_ON }),
	});
	const dayMap = new Map(calendar.map((day) => [day.date, day]));

	const getDayState = (day: Date): AvailabilityMiniCalendarDayState => {
		if (!isSameMonth(day, currentDate)) return 'muted';
		if (isSameDay(day, activeDate)) return 'selected';

		return 'default';
	};

	// Booked weight = Jupiter patient bookings + Google busy time. Both make the
	// day "heavier" and therefore darker on the heatmap.
	const getBookedCount = (day: Date): number => {
		const calendarDay = dayMap.get(format(day, 'yyyy-MM-dd'));

		return (calendarDay?.jupiter.booked ?? 0) + (calendarDay?.google.booked ?? 0);
	};

	const handleDaySelect = (day: Date): void => {
		if (!isSameMonth(day, currentDate)) return;

		navigate(
			`/${i18n.language}/${AVAILABILITYWEEK_BASE}/${format(day, 'yyyy-MM-dd')}`
		);
	};

	return (
		<MiniCalendarCard
			aria-labelledby='availability-month-calendar-title'
			data-testid='availability-month-calendar'
			id='availability-month-calendar'
		>
			<MiniCalendarHead>
				<MiniCalendarTitle id='availability-month-calendar-title'>
					{format(currentDate, 'MMMM yyyy')}
				</MiniCalendarTitle>
				<MiniCalendarNav aria-label={t('availability.workspace.month-nav')}>
					<MiniCalendarNavButton
						aria-label={t('availability.workspace.month-prev')}
						data-testid='availability-month-prev'
						disabled={!canGoPrev}
						id='availability-month-prev'
						onClick={goToPrevMonth}
						type='button'
					>
						<ChevronLeft />
					</MiniCalendarNavButton>
					<MiniCalendarNavButton
						aria-label={t('availability.workspace.month-next')}
						data-testid='availability-month-next'
						disabled={!canGoNext}
						id='availability-month-next'
						onClick={goToNextMonth}
						type='button'
					>
						<ChevronRight />
					</MiniCalendarNavButton>
				</MiniCalendarNav>
			</MiniCalendarHead>
			<MiniWeekdayGrid
				aria-hidden='true'
				data-testid='availability-month-weekday-grid'
				id='availability-month-weekday-grid'
			>
				{WEEKDAYS.map((weekday, index) => (
					<MiniWeekdayLabel key={`${weekday}-${index}`}>
						{weekday}
					</MiniWeekdayLabel>
				))}
			</MiniWeekdayGrid>
			<MiniDayGrid
				aria-busy={isLoading}
				aria-label={t('availability.workspace.month-grid-label', {
					month: format(currentDate, 'MMMM yyyy'),
				})}
				data-testid='availability-month-day-grid'
				id='availability-month-day-grid'
				role='grid'
			>
				{calendarDays.map((day) => {
					const key = format(day, 'yyyy-MM-dd');

					if (isLoading) {
						return (
							<MiniDaySkeleton
								aria-hidden='true'
								data-testid={`availability-month-day-skeleton-${key}`}
								id={`availability-month-day-skeleton-${key}`}
								key={key}
								variant='rounded'
							/>
						);
					}

					const dayState = getDayState(day);
					const bookedCount =
						dayState === 'muted' ? 0 : getBookedCount(day);
					const heatLevel = getHeatLevel(bookedCount);

					const state =
						dayState === 'selected'
							? t('availability.workspace.month-day-selected')
							: bookedCount > 0
								? t('availability.workspace.month-day-booked', {
										count: bookedCount,
									})
								: '';

					return (
						<MiniDayButton
							aria-label={t('availability.workspace.month-day-label', {
								date: format(day, 'EEEE, MMMM d'),
								state,
							})}
							data-testid={`availability-month-day-${key}`}
							dayState={dayState}
							heatLevel={heatLevel}
							id={`availability-month-day-${key}`}
							key={key}
							onClick={() => handleDaySelect(day)}
							role='gridcell'
							type='button'
						>
							{format(day, 'd')}
						</MiniDayButton>
					);
				})}
			</MiniDayGrid>
		</MiniCalendarCard>
	);
};

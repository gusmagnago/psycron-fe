import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from '@psycron/components/icons';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import { useJupiterAvailability } from '@psycron/hooks/useJupiterAvailability';
import i18n from '@psycron/i18n';
import { AVAILABILITYWEEK_BASE } from '@psycron/pages/urls';
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
	MiniWeekdayGrid,
	MiniWeekdayLabel,
} from './AvailabilityMiniCalendar.styles';
import type {
	AvailabilityMiniCalendarDayState,
	AvailabilityMiniCalendarProps,
} from './AvailabilityMiniCalendar.types';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

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
		start: startOfWeek(monthStart, { weekStartsOn: 1 }),
		end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
	});
	const dayMap = new Map(calendar.map((day) => [day.date, day]));

	const getDayState = (day: Date): AvailabilityMiniCalendarDayState => {
		if (!isSameMonth(day, currentDate)) return 'muted';
		if (isSameDay(day, activeDate)) return 'selected';

		const key = format(day, 'yyyy-MM-dd');
		const calendarDay = dayMap.get(key);
		const slotCount =
			(calendarDay?.jupiter.available ?? 0) + (calendarDay?.jupiter.booked ?? 0);

		return slotCount > 0 ? 'slots' : 'empty';
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
				aria-label={t('availability.workspace.month-grid-label', {
					month: format(currentDate, 'MMMM yyyy'),
				})}
				data-testid='availability-month-day-grid'
				id='availability-month-day-grid'
				role='grid'
			>
				{calendarDays.map((day) => {
					const dayState = getDayState(day);
					const key = format(day, 'yyyy-MM-dd');

					return (
						<MiniDayButton
							aria-label={t('availability.workspace.month-day-label', {
								date: format(day, 'EEEE, MMMM d'),
								state:
									dayState === 'slots'
										? t('availability.workspace.month-day-has-slots')
										: dayState === 'selected'
											? t('availability.workspace.month-day-selected')
											: '',
							})}
							data-testid={`availability-month-day-${key}`}
							dayState={dayState}
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

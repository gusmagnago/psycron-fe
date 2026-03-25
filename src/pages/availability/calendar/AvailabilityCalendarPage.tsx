import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import type { AvailabilityLegendItem } from '@psycron/components/availability/AvailabilityLegend';
import { AvailabilityLegend } from '@psycron/components/availability/AvailabilityLegend';
import {
	NavButton,
	NavButtons,
} from '@psycron/components/availability/AvailabilityNavButton';
import { AvailabilityTodayButton } from '@psycron/components/availability/AvailabilityTodayButton';
import { useAvailability } from '@psycron/context/appointment/availability/AvailabilityContext';
import { useJupiterAvailability } from '@psycron/hooks/useJupiterAvailability';
import i18n from '@psycron/i18n';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { AVAILABILITYWEEK_BASE } from '@psycron/pages/urls';
import { palette } from '@psycron/theme/palette/palette.theme';
import {
	eachDayOfInterval,
	endOfMonth,
	endOfWeek,
	format,
	isSameMonth,
	isToday,
	startOfMonth,
	startOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import type { OccupancyLevel } from './AvailabilityCalendarPage.styles';
import {
	CalendarCard,
	CalendarFooter,
	CalendarGrid,
	CalendarHeader,
	CalendarSubtitle,
	CalendarTitle,
	DayCellButton,
	OCCUPANCY_COLORS,
	SourceButton,
	SourceToggle,
	WeekdayLabel,
	WeekdayRow,
} from './AvailabilityCalendarPage.styles';

type SourceView = 'jupiter' | 'google';

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'] as const;

const getOccupancyLevel = (
	booked: number,
	available: number
): OccupancyLevel => {
	if (available === 0) return 'empty';
	const ratio = booked / available;
	if (ratio === 0) return 'available';
	if (ratio < 0.5) return 'partial';
	if (ratio < 1) return 'busy';
	return 'full';
};

export const AvailabilityCalendarPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [sourceView, setSourceView] = useState<SourceView>('jupiter');

	const { firstDate, lastDate } = useAvailability();

	const {
		calendar,
		canGoNext,
		canGoPrev,
		currentDate,
		goToNextMonth,
		goToPrevMonth,
		hasGoogleData,
		isLoading,
	} = useJupiterAvailability({ firstDate, lastDate });

	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(currentDate);

	const calendarDays = eachDayOfInterval({
		start: startOfWeek(monthStart, { weekStartsOn: 1 }),
		end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
	});

	const dayMap = new Map(calendar.map((d) => [d.date, d]));

	const getLevel = (date: Date): OccupancyLevel => {
		const key = format(date, 'yyyy-MM-dd');
		const day = dayMap.get(key);
		if (!day) return 'empty';
		const counts = sourceView === 'jupiter' ? day.jupiter : day.google;
		return getOccupancyLevel(counts.booked, counts.available);
	};

	const handleDayClick = (day: Date) => {
		navigate(
			`/${i18n.language}/${AVAILABILITYWEEK_BASE}/${format(day, 'yyyy-MM-dd')}`
		);
	};

	const legendItems: AvailabilityLegendItem[] = [
		{
			color: OCCUPANCY_COLORS['available'],
			label: t('availability.calendar.legend-available'),
		},
		{
			color: OCCUPANCY_COLORS['partial'],
			label: t('availability.calendar.legend-partial'),
		},
		{
			color: OCCUPANCY_COLORS['busy'],
			label: t('availability.calendar.legend-busy'),
		},
		{
			color: OCCUPANCY_COLORS['full'],
			label: t('availability.calendar.legend-full'),
		},
		{
			color: OCCUPANCY_COLORS['empty'],
			label: t('availability.calendar.legend-empty'),
		},
		{
			borderColor: palette.secondary.main,
			color: OCCUPANCY_COLORS['available'],
			label: t('availability.calendar.legend-today'),
		},
	];

	return (
		<PageLayout
			title={t('availability.calendar.page-title')}
			isLoading={isLoading}
		>
			<CalendarCard>
				<CalendarHeader>
					<div>
						<CalendarTitle>{format(currentDate, 'MMMM yyyy')}</CalendarTitle>
						<CalendarSubtitle>
							{t('availability.calendar.subtitle')}
						</CalendarSubtitle>
					</div>
					<NavButtons>
						<NavButton disabled={!canGoPrev} onClick={goToPrevMonth}>
							<ChevronLeft size={20} />
						</NavButton>
						<NavButton disabled={!canGoNext} onClick={goToNextMonth}>
							<ChevronRight size={20} />
						</NavButton>
					</NavButtons>
				</CalendarHeader>

				<WeekdayRow>
					{WEEKDAYS.map((day, i) => (
						<WeekdayLabel key={i}>{day}</WeekdayLabel>
					))}
				</WeekdayRow>

				<CalendarGrid>
					{calendarDays.map((day) => {
						const isOtherMonth = !isSameMonth(day, currentDate);
						const occupancy = isOtherMonth ? 'empty' : getLevel(day);
						// TODO: when clicking an unavailable day, show a contextual message
						// (e.g. "No slots available on this day") instead of silently ignoring.
						const isClickable = !isOtherMonth && occupancy !== 'empty';
						return (
							<DayCellButton
								key={day.toISOString()}
								occupancy={occupancy}
								isOtherMonth={isOtherMonth}
								isClickable={isClickable}
								isToday={!isOtherMonth && isToday(day)}
								disableRipple={!isClickable}
								onClick={isClickable ? () => handleDayClick(day) : undefined}
							>
								{format(day, 'd')}
							</DayCellButton>
						);
					})}
				</CalendarGrid>

				<CalendarFooter>
					<AvailabilityLegend items={legendItems} />

					<SourceToggle>
						<AvailabilityTodayButton />
						<SourceButton
							isActive={sourceView === 'jupiter'}
							onClick={() => setSourceView('jupiter')}
						>
							{t('availability.calendar.source-jupiter')}
						</SourceButton>
						{hasGoogleData && (
							<SourceButton
								isActive={sourceView === 'google'}
								onClick={() => setSourceView('google')}
							>
								{t('availability.calendar.source-google')}
							</SourceButton>
						)}
					</SourceToggle>
				</CalendarFooter>
			</CalendarCard>
		</PageLayout>
	);
};

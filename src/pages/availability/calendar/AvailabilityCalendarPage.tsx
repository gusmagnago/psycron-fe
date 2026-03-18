import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useJupiterAvailability } from '@psycron/hooks/useJupiterAvailability';
import i18n from '@psycron/i18n';
import { PageLayout } from '@psycron/layouts/app/pages-layout/PageLayout';
import { AVAILABILITYPATH } from '@psycron/pages/urls';
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
	LegendGroup,
	LegendItem,
	LegendLabel,
	LegendSwatch,
	NavButton,
	NavButtons,
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

	const {
		calendar,
		currentDate,
		goToNextMonth,
		goToPrevMonth,
		hasGoogleData,
		isLoading,
	} = useJupiterAvailability();

	const monthStart = startOfMonth(currentDate);
	const monthEnd = endOfMonth(currentDate);

	const calendarDays = eachDayOfInterval({
		start: startOfWeek(monthStart, { weekStartsOn: 1 }),
		end: endOfWeek(monthEnd, { weekStartsOn: 1 }),
	});

	const dayMap = new Map(calendar.map((d) => [d.date, d]));

	const getLevel = (date: Date): OccupancyLevel => {
		if (isToday(date)) return 'today';
		const key = format(date, 'yyyy-MM-dd');
		const day = dayMap.get(key);
		if (!day) return 'empty';
		const counts = sourceView === 'jupiter' ? day.jupiter : day.google;
		return getOccupancyLevel(counts.booked, counts.available);
	};

	const handleDayClick = (day: Date) => {
		navigate(`/${i18n.language}/${AVAILABILITYPATH}/week/${format(day, 'yyyy-MM-dd')}`);
	};

	const legendItems: { key: OccupancyLevel; labelKey: string }[] = [
		{ key: 'available', labelKey: 'availability.calendar.legend-available' },
		{ key: 'partial', labelKey: 'availability.calendar.legend-partial' },
		{ key: 'busy', labelKey: 'availability.calendar.legend-busy' },
		{ key: 'full', labelKey: 'availability.calendar.legend-full' },
	];

	return (
		<PageLayout title={t('availability.calendar.page-title')} isLoading={isLoading}>
			<CalendarCard>
				<CalendarHeader>
					<div>
						<CalendarTitle>{format(currentDate, 'MMMM yyyy')}</CalendarTitle>
						<CalendarSubtitle>
							{t('availability.calendar.subtitle')}
						</CalendarSubtitle>
					</div>
					<NavButtons>
						<NavButton onClick={goToPrevMonth}>
							<ChevronLeft size={20} />
						</NavButton>
						<NavButton onClick={goToNextMonth}>
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
						return (
							<DayCellButton
								key={day.toISOString()}
								occupancy={occupancy}
								isOtherMonth={isOtherMonth}
								isClickable={!isOtherMonth}
								disableRipple={isOtherMonth}
								onClick={isOtherMonth ? undefined : () => handleDayClick(day)}
							>
								{format(day, 'd')}
							</DayCellButton>
						);
					})}
				</CalendarGrid>

				<CalendarFooter>
					<LegendGroup>
						{legendItems.map(({ key, labelKey }) => (
							<LegendItem key={key}>
								<LegendSwatch color={OCCUPANCY_COLORS[key]} />
								<LegendLabel>{t(labelKey)}</LegendLabel>
							</LegendItem>
						))}
					</LegendGroup>

					<SourceToggle>
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

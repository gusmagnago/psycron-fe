import { ChevronLeft, ChevronRight } from '@psycron/components/icons';
import { Text } from '@psycron/components/text/Text';

import {
	CalendarHeader,
	CalendarHeaderActions,
	CalendarShell,
	DayCell,
	DayCount,
	DayIndicator,
	DayIndicators,
	DayMeta,
	DayNumber,
	DetailBody,
	DetailHeader,
	DetailPanel,
	MainActions,
	MainHeader,
	MainPanel,
	MonthGrid,
	NavIconButton,
	SchedulerHeader,
	SchedulerWrapper,
	Sidebar,
	ViewToggle,
	ViewToggleButton,
	WeekdayCell,
	WeekdayRow,
} from './PublicSchedulingCalendar.styles';
import type { PublicSchedulingCalendarProps } from './PublicSchedulingCalendar.types';
import {
	getNextSchedulingPeriod,
	getPreviousSchedulingPeriod,
	getSchedulingCalendarDays,
	getSchedulingPeriodLabel,
	getSchedulingWeekdayLabels,
	isSchedulingDayInPeriod,
	isSchedulingDaySelected,
} from './PublicSchedulingCalendar.utils';

export const PublicSchedulingCalendar = ({
	detailBody,
	detailSubtitle,
	detailTitle,
	getDayMeta,
	greetingTitle,
	language,
	monthLabel,
	mainSubtitle,
	mainTitle,
	month,
	onMonthChange,
	onSelectDate,
	onViewModeChange,
	selectedDate,
	sidebar,
	topActions,
	viewMode = 'month',
	weekLabel,
}: PublicSchedulingCalendarProps) => {
	const calendarDays = getSchedulingCalendarDays(month, viewMode);
	const weekdayLabels = getSchedulingWeekdayLabels(language);

	return (
		<SchedulerWrapper>
			<SchedulerHeader>
				<Text fontWeight={700} variant='h4'>
					{greetingTitle}
				</Text>
			</SchedulerHeader>

			<CalendarShell>
				<Sidebar>{sidebar}</Sidebar>

				<MainPanel>
					<MainHeader>
						<Text fontWeight={700} variant='h4'>
							{mainTitle}
						</Text>
						{mainSubtitle ? (
							<Text color='text.secondary' variant='body2'>
								{mainSubtitle}
							</Text>
						) : null}
					</MainHeader>

					<MainActions>
						<ViewToggle>
							<ViewToggleButton
								isActive={viewMode === 'month'}
								onClick={() => onViewModeChange?.('month')}
							>
								{monthLabel}
							</ViewToggleButton>
							<ViewToggleButton
								isActive={viewMode === 'week'}
								onClick={() => onViewModeChange?.('week')}
							>
								{weekLabel}
							</ViewToggleButton>
						</ViewToggle>
						{topActions}
					</MainActions>

					<CalendarHeader>
						<Text fontWeight={700} variant='h5'>
							{getSchedulingPeriodLabel(month, viewMode, language)}
						</Text>
						<CalendarHeaderActions>
							<NavIconButton
								aria-label='Previous period'
								onClick={() =>
									onMonthChange(getPreviousSchedulingPeriod(month, viewMode))
								}
							>
								<ChevronLeft />
							</NavIconButton>
							<NavIconButton
								aria-label='Next period'
								onClick={() =>
									onMonthChange(getNextSchedulingPeriod(month, viewMode))
								}
							>
								<ChevronRight />
							</NavIconButton>
						</CalendarHeaderActions>
					</CalendarHeader>

					<WeekdayRow>
						{weekdayLabels.map((label) => (
							<WeekdayCell key={label}>{label}</WeekdayCell>
						))}
					</WeekdayRow>

					<MonthGrid viewMode={viewMode}>
						{calendarDays.map((day) => {
							const meta = getDayMeta(day);
							const countLabel = meta.countLabel;
							const tone = meta.tone ?? 'neutral';
							const indicatorCount = meta.indicatorCount ?? 0;
							const isDisabled = meta.disabled ?? false;
							const isHighlighted = meta.highlighted ?? false;
							const isSelected = isSchedulingDaySelected(day, selectedDate);

							return (
								<DayCell
									isCurrentMonth={isSchedulingDayInPeriod(day, month, viewMode)}
									isDisabled={isDisabled}
									isHighlighted={isHighlighted}
									isSelected={isSelected}
									key={day.toISOString()}
									onClick={() => {
										if (!isDisabled) onSelectDate(day);
									}}
									tone={tone}
								>
									<DayNumber>{day.getDate()}</DayNumber>
									<DayMeta>
										<DayIndicators>
											{Array.from({
												length: Math.min(indicatorCount, 3),
											}).map((_, index) => (
												<DayIndicator key={`${day.toISOString()}-${index}`} tone={tone} />
											))}
										</DayIndicators>
										<DayCount isSelected={isSelected}>
											{countLabel ?? ''}
										</DayCount>
									</DayMeta>
								</DayCell>
							);
						})}
					</MonthGrid>
				</MainPanel>

				<DetailPanel>
					<DetailHeader>
						<Text fontWeight={700} variant='h5'>
							{detailTitle}
						</Text>
						{detailSubtitle ? (
							<Text color='text.secondary' variant='body2'>
								{detailSubtitle}
							</Text>
						) : null}
					</DetailHeader>
					<DetailBody>{detailBody}</DetailBody>
				</DetailPanel>
			</CalendarShell>
		</SchedulerWrapper>
	);
};

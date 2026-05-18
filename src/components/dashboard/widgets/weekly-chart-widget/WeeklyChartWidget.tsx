import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { useBentoTileChrome } from '@psycron/components/dashboard/bento-tile/BentoTile.context';
import { Calendar, CalendarRange } from '@psycron/components/icons';
import { palette } from '@psycron/theme/palette/palette.theme';

import {
	ScheduleSwitcher,
	SwitcherOption,
} from '../schedule-widget/ScheduleWidget.styles';

import {
	BarGroup,
	BarLabel,
	BarSegment,
	ChartCanvas,
	ChartLegend,
	ChartRoot,
	LegendDot,
	LegendItem,
} from './WeeklyChartWidget.styles';
import type { ChartViewMode, WeeklyChartWidgetProps } from './WeeklyChartWidget.types';

const COLORS = {
	blocked: palette.alert.main,
	cancelled: palette.error.light,
	completed: palette.success.main,
	upcoming: palette.primary.main,
} as const;

export const WeeklyChartWidget = ({
	data,
	isLoading,
	monthData,
	onDayClick,
}: WeeklyChartWidgetProps) => {
	const { t } = useTranslation();
	const [viewMode, setViewMode] = useState<ChartViewMode>('week');

	const displayData = viewMode === 'month' ? monthData : data;

	const headerActions = useMemo(
		() => (
			<ScheduleSwitcher>
				<SwitcherOption
					aria-label={t('page.dashboard.widgets.weekly-chart.view-week')}
					isActive={viewMode === 'week'}
					onClick={() => setViewMode('week')}
				>
					<CalendarRange />
					{t('page.dashboard.widgets.weekly-chart.view-week')}
				</SwitcherOption>
				<SwitcherOption
					aria-label={t('page.dashboard.widgets.weekly-chart.view-month')}
					isActive={viewMode === 'month'}
					onClick={() => setViewMode('month')}
				>
					<Calendar />
					{t('page.dashboard.widgets.weekly-chart.view-month')}
				</SwitcherOption>
			</ScheduleSwitcher>
		),
		[t, viewMode]
	);

	const footer = useMemo(
		() => (
			<ChartLegend>
				{(
					[
						['upcoming', t('page.dashboard.widgets.weekly-chart.legend.upcoming')],
						['completed', t('page.dashboard.widgets.weekly-chart.legend.completed')],
						['cancelled', t('page.dashboard.widgets.weekly-chart.legend.cancelled')],
						['blocked', t('page.dashboard.widgets.weekly-chart.legend.blocked')],
					] as const
				).map(([key, label]) => (
					<LegendItem key={key}>
						<LegendDot color={COLORS[key]} />
						{label}
					</LegendItem>
				))}
			</ChartLegend>
		),
		[t]
	);

	useBentoTileChrome({
		footer,
		headerActions,
		title: t('page.dashboard.widgets.weekly-chart.title'),
	});

	const maxTotal = useMemo(
		() =>
			Math.max(
				1,
				...displayData.map((d) => d.upcoming + d.completed + d.cancelled + d.blocked)
			),
		[displayData]
	);

	if (isLoading) {
		return (
			<Box display='flex' gap={1} alignItems='flex-end' flex={1} minHeight={80}>
				{[...Array(7)].map((_, i) => (
					<Skeleton
						height={`${30 + i * 8}%`}
						key={`chart-skeleton-${i}`}
						variant='rectangular'
						sx={{ flex: 1, borderRadius: 1 }}
					/>
				))}
			</Box>
		);
	}

	return (
		<ChartRoot>
			<ChartCanvas role='img' aria-label={t('page.dashboard.widgets.weekly-chart.aria-label')}>
				{displayData.map((day) => {
					const total =
						day.upcoming + day.completed + day.cancelled + day.blocked;
					const upcomingPct = total > 0 ? (day.upcoming / maxTotal) * 100 : 0;
					const completedPct = total > 0 ? (day.completed / maxTotal) * 100 : 0;
					const cancelledPct = total > 0 ? (day.cancelled / maxTotal) * 100 : 0;
					const blockedPct = total > 0 ? (day.blocked / maxTotal) * 100 : 0;

					return (
						<BarGroup
							isToday={day.isToday}
							key={day.date}
							onClick={() => onDayClick?.(day)}
							onKeyDown={(event) => {
								if (!onDayClick) return;
								if (event.key === 'Enter' || event.key === ' ') {
									event.preventDefault();
									onDayClick(day);
								}
							}}
							role={onDayClick ? 'button' : undefined}
							tabIndex={onDayClick ? 0 : undefined}
							title={`${day.label}: ${total} ${t('page.dashboard.widgets.weekly-chart.sessions')}`}
						>
							<Box className='bar-stack' flex={1} width='100%'>
								<BarSegment color={COLORS.blocked} heightPct={blockedPct} />
								<BarSegment color={COLORS.cancelled} heightPct={cancelledPct} />
								<BarSegment color={COLORS.completed} heightPct={completedPct} />
								<BarSegment color={COLORS.upcoming} heightPct={upcomingPct} />
							</Box>
							<BarLabel isToday={day.isToday}>{day.label}</BarLabel>
						</BarGroup>
					);
				})}
			</ChartCanvas>
		</ChartRoot>
	);
};

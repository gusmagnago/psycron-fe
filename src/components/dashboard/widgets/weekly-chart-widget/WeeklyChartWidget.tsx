import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';

import { WidgetHeader, WidgetTitle } from '../schedule-widget/ScheduleWidget.styles';

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
import type { WeeklyChartWidgetProps } from './WeeklyChartWidget.types';

const COLORS = {
	blocked: palette.alert.main,
	cancelled: palette.error.light,
	completed: palette.success.main,
	upcoming: palette.primary.main,
} as const;

export const WeeklyChartWidget = ({
	data,
	isLoading,
	onDayClick,
}: WeeklyChartWidgetProps) => {
	const { t } = useTranslation();

	const maxTotal = useMemo(
		() =>
			Math.max(
				1,
				...data.map((d) => d.upcoming + d.completed + d.cancelled + d.blocked)
			),
		[data]
	);

	if (isLoading) {
		return (
			<Box display='flex' gap={1} alignItems='flex-end' height={160}>
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
			<WidgetHeader>
				<WidgetTitle>{t('page.dashboard.widgets.weekly-chart.title')}</WidgetTitle>
			</WidgetHeader>

			<ChartCanvas role='img' aria-label={t('page.dashboard.widgets.weekly-chart.aria-label')}>
				{data.map((day) => {
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
		</ChartRoot>
	);
};

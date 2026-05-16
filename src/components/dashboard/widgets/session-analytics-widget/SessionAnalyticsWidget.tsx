import { useCallback, useMemo, useState } from 'react';
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
	AnalyticsRoot,
	BarGroup,
	BarLabel,
	BarSegment,
	BlockedHours,
	ChartCanvas,
	ChartLegend,
	ChartSection,
	CompletionRateLabel,
	CompletionRateValue,
	KpiBlock,
	KpiDivider,
	LegendDot,
	LegendItem,
	StatCount,
	StatDot,
	StatLabel,
	StatRow,
} from './SessionAnalyticsWidget.styles';
import type {
	SessionAnalyticsPeriodData,
	SessionAnalyticsViewMode,
	SessionAnalyticsWidgetProps,
} from './SessionAnalyticsWidget.types';

const COLORS = {
	blocked: palette.alert.main,
	cancelled: palette.error.light,
	completed: palette.success.main,
	upcoming: palette.primary.main,
} as const;

const getRateColor = (rate: number | undefined): string => {
	if (rate === undefined) return palette.text.secondary as string;
	if (rate >= 75) return palette.success.main as string;
	if (rate >= 40) return palette.alert.main as string;
	return palette.error.main as string;
};

const computeCompletionRate = (data: SessionAnalyticsPeriodData): number | undefined => {
	const concluded = data.completed + data.cancelled;
	if (concluded === 0) return undefined;
	return Math.round((data.completed / concluded) * 100);
};

export const SessionAnalyticsWidget = ({
	chartData,
	isLoading,
	monthChartData,
	monthData,
	onDayClick,
	onViewModeChange,
	weekData,
}: SessionAnalyticsWidgetProps) => {
	const { t } = useTranslation();
	const [viewMode, setViewMode] = useState<SessionAnalyticsViewMode>('week');

	const displayData = viewMode === 'month' ? monthData : weekData;
	const displayChartData = viewMode === 'month' ? monthChartData : chartData;

	const handleViewModeChange = useCallback(
		(mode: SessionAnalyticsViewMode) => {
			setViewMode(mode);
			onViewModeChange?.(mode);
		},
		[onViewModeChange]
	);

	const completionRate = useMemo(
		() => computeCompletionRate(displayData),
		[displayData]
	);

	const blockedHoursText = useMemo(() => {
		if (displayData.adminBlockedMinutes === 0) return undefined;
		const hours = (displayData.adminBlockedMinutes / 60).toFixed(1);
		return t('page.dashboard.widgets.session-analytics.blocked-hours', { hours });
	}, [displayData.adminBlockedMinutes, t]);

	const rateColor = getRateColor(completionRate);

	const maxTotal = useMemo(
		() =>
			Math.max(
				1,
				...displayChartData.map(
					(d) => d.upcoming + d.completed + d.cancelled + d.blocked
				)
			),
		[displayChartData]
	);

	const headerActions = useMemo(
		() => (
			<ScheduleSwitcher>
				<SwitcherOption
					aria-label={t('page.dashboard.widgets.session-analytics.view-week')}
					isActive={viewMode === 'week'}
					onClick={() => handleViewModeChange('week')}
				>
					<CalendarRange />
					{t('page.dashboard.widgets.session-analytics.view-week')}
				</SwitcherOption>
				<SwitcherOption
					aria-label={t('page.dashboard.widgets.session-analytics.view-month')}
					isActive={viewMode === 'month'}
					onClick={() => handleViewModeChange('month')}
				>
					<Calendar />
					{t('page.dashboard.widgets.session-analytics.view-month')}
				</SwitcherOption>
			</ScheduleSwitcher>
		),
		[handleViewModeChange, t, viewMode]
	);

	const footer = useMemo(
		() => (
			<ChartLegend>
				{(
					[
						['upcoming', t('page.dashboard.widgets.session-analytics.legend.upcoming')],
						['completed', t('page.dashboard.widgets.session-analytics.legend.completed')],
						['cancelled', t('page.dashboard.widgets.session-analytics.legend.cancelled')],
						['blocked', t('page.dashboard.widgets.session-analytics.legend.blocked')],
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
		title: t('page.dashboard.widgets.session-analytics.title'),
	});

	if (isLoading) {
		return (
			<Box display='flex' flex={1} gap={2}>
				<Box display='flex' flexDirection='column' gap={1} width='38%'>
					<Skeleton height={48} width='60%' />
					<Skeleton height={16} />
					<Skeleton height={16} />
					<Skeleton height={16} />
					<Skeleton height={16} />
				</Box>
				<Box alignItems='flex-end' display='flex' flex={1} gap={1} minHeight={80}>
					{[...Array(7)].map((_, i) => (
						<Skeleton
							height={`${30 + i * 8}%`}
							key={`chart-skeleton-${i}`}
							sx={{ borderRadius: 1, flex: 1 }}
							variant='rectangular'
						/>
					))}
				</Box>
			</Box>
		);
	}

	return (
		<AnalyticsRoot>
			<KpiBlock>
				<CompletionRateValue rateColor={rateColor}>
					{completionRate !== undefined ? `${completionRate}%` : '—'}
				</CompletionRateValue>
				<CompletionRateLabel>
					{t('page.dashboard.widgets.session-analytics.completion-rate')}
				</CompletionRateLabel>

				<KpiDivider />

				{(
					[
						[
							'completed',
							displayData.completed,
							t('page.dashboard.widgets.session-analytics.completed'),
						],
						[
							'upcoming',
							displayData.upcoming,
							t('page.dashboard.widgets.session-analytics.upcoming'),
						],
						[
							'cancelled',
							displayData.cancelled,
							t('page.dashboard.widgets.session-analytics.cancelled'),
						],
						[
							'blocked',
							displayData.blocked,
							t('page.dashboard.widgets.session-analytics.blocked'),
						],
					] as const
				).map(([key, count, label]) => (
					<StatRow key={key}>
						<StatLabel>
							<StatDot color={COLORS[key]} />
							{label}
						</StatLabel>
						<StatCount>{count}</StatCount>
					</StatRow>
				))}

				{blockedHoursText && (
					<>
						<KpiDivider />
						<BlockedHours>{blockedHoursText}</BlockedHours>
					</>
				)}
			</KpiBlock>

			<ChartSection>
				<ChartCanvas
					aria-label={t('page.dashboard.widgets.session-analytics.chart-aria-label')}
					role='img'
				>
					{displayChartData.map((day) => {
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
								title={`${day.label}: ${total} ${t('page.dashboard.widgets.session-analytics.sessions')}`}
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
			</ChartSection>
		</AnalyticsRoot>
	);
};

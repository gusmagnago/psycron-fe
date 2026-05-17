import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { useBentoTileChrome } from '@psycron/components/dashboard/bento-tile/BentoTile.context';
import { Calendar, CalendarRange } from '@psycron/components/icons';

import {
	ScheduleSwitcher,
	SwitcherOption,
} from '../schedule-widget/ScheduleWidget.styles';

import { SessionAnalyticsChart } from './SessionAnalyticsChart';
import { SessionAnalyticsKpi } from './SessionAnalyticsKpi';
import {
	AnalyticsRoot,
	ChartLegend,
	ChartSkeletonBar,
	COLORS,
	GlassPanel,
	LegendDot,
	LegendItem,
	LoadingChart,
	LoadingKpi,
	LoadingPanel,
} from './SessionAnalyticsWidget.styles';
import type {
	SessionAnalyticsLayout,
	SessionAnalyticsViewMode,
	SessionAnalyticsWidgetProps,
} from './SessionAnalyticsWidget.types';

const k = (key: string) => `page.dashboard.widgets.session-analytics.${key}`;

const LEGEND_KEYS = ['upcoming', 'completed', 'cancelled', 'blocked'] as const;

const getDefaultLayout = (rowSpan: number): SessionAnalyticsLayout =>
	rowSpan >= 4 ? 'column' : 'row';

export const SessionAnalyticsWidget = ({
	chartData,
	isLoading,
	layout,
	monthChartData,
	monthData,
	onDayClick,
	onViewModeChange,
	rowSpan = 2,
	weekData,
}: SessionAnalyticsWidgetProps) => {
	const effectiveLayout = layout ?? getDefaultLayout(rowSpan);
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

	const headerActions = useMemo(
		() => (
			<ScheduleSwitcher>
				<SwitcherOption
					aria-label={t(k('view-week'))}
					isActive={viewMode === 'week'}
					onClick={() => handleViewModeChange('week')}
				>
					<CalendarRange />
					{t(k('view-week'))}
				</SwitcherOption>
				<SwitcherOption
					aria-label={t(k('view-month'))}
					isActive={viewMode === 'month'}
					onClick={() => handleViewModeChange('month')}
				>
					<Calendar />
					{t(k('view-month'))}
				</SwitcherOption>
			</ScheduleSwitcher>
		),
		[handleViewModeChange, t, viewMode]
	);

	const footer = useMemo(
		() => (
			<ChartLegend>
				{LEGEND_KEYS.map((key) => (
					<LegendItem key={key}>
						<LegendDot color={COLORS[key]} />
						{t(k(`legend.${key}`))}
					</LegendItem>
				))}
			</ChartLegend>
		),
		[t]
	);

	useBentoTileChrome({
		footer,
		headerActions,
		title: t(k('title')),
	});

	return (
		<AnalyticsRoot>
			<GlassPanel layout={effectiveLayout}>
				{isLoading ? (
					<LoadingPanel>
						<LoadingKpi>
							<Skeleton height={48} width='60%' />
							<Skeleton height={16} />
							<Skeleton height={16} />
							<Skeleton height={16} />
							<Skeleton height={16} />
						</LoadingKpi>
						<LoadingChart>
							{[...Array(7)].map((_, i) => (
								<ChartSkeletonBar
									height={`${30 + i * 8}%`}
									key={`chart-skeleton-${i}`}
									variant='rectangular'
								/>
							))}
						</LoadingChart>
					</LoadingPanel>
				) : (
					<>
						<SessionAnalyticsKpi
							data={displayData}
							layout={effectiveLayout}
							viewMode={viewMode}
						/>
						<SessionAnalyticsChart data={displayChartData} onDayClick={onDayClick} />
					</>
				)}
			</GlassPanel>
		</AnalyticsRoot>
	);
};

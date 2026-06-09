import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@mui/material';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { RangeGroup } from '@psycron/components/range-group/RangeGroup';

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
const SESSION_ANALYTICS_WIDGET_ID_PREFIX = 'dashboard-session-analytics';

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
				<RangeGroup<SessionAnalyticsViewMode>
					ariaLabel={t(k('range-aria-label-sessions'))}
					idPrefix={`${SESSION_ANALYTICS_WIDGET_ID_PREFIX}-range`}
					size='small'
					onChange={handleViewModeChange}
					options={[
						{
							ariaLabel: t(k('view-week')),
							label: t(k('view-week')),
							value: 'week',
						},
						{
							ariaLabel: t(k('view-month')),
							label: t(k('view-month')),
							value: 'month',
						},
					]}
					value={viewMode}
				/>
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

	const body = (
		<AnalyticsRoot
			aria-labelledby={`${SESSION_ANALYTICS_WIDGET_ID_PREFIX}-title`}
			id={`${SESSION_ANALYTICS_WIDGET_ID_PREFIX}-root`}
		>
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
						<SessionAnalyticsKpi data={displayData} layout={effectiveLayout} />
						<SessionAnalyticsChart
							data={displayChartData}
							onDayClick={onDayClick}
						/>
					</>
				)}
			</GlassPanel>
		</AnalyticsRoot>
	);

	return (
		<WidgetLayout
			body={body}
			footer={footer}
			headerActions={headerActions}
			titleId={`${SESSION_ANALYTICS_WIDGET_ID_PREFIX}-title`}
			title={t(k('title'))}
		/>
	);
};

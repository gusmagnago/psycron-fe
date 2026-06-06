import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { WidgetLayout } from '@psycron/components/dashboard/widget-layout/WidgetLayout';
import { Calendar, CalendarRange, ChevronUp } from '@psycron/components/icons';

import { DeltaChip } from '../metric-card-widget/MetricCardWidget.styles';
import {
	ScheduleSwitcher,
	SwitcherOption,
} from '../schedule-widget/ScheduleWidget.styles';

import { THIS_WEEK_COLORS, ThisWeekDonutChart } from './ThisWeekDonutChart';
import {
	DonutCenter,
	DonutRow,
	DonutTotal,
	DonutWrapper,
	LegendCount,
	LegendDot,
	LegendLabel,
	LegendList,
	LegendRow,
	ThisWeekRoot,
} from './ThisWeekWidget.styles';
import type {
	ThisWeekViewMode,
	ThisWeekWidgetProps,
} from './ThisWeekWidget.types';

export const ThisWeekWidget = ({
	data,
	isLoading,
	monthData,
}: ThisWeekWidgetProps) => {
	const { t } = useTranslation();
	const [viewMode, setViewMode] = useState<ThisWeekViewMode>('week');

	const displayData = viewMode === 'month' ? monthData : data;

	const headerActions = useMemo(
		() => (
			<ScheduleSwitcher>
				<SwitcherOption
					aria-label={t('page.dashboard.widgets.this-week.view-week')}
					isActive={viewMode === 'week'}
					onClick={() => setViewMode('week')}
				>
					<CalendarRange />
					{t('page.dashboard.widgets.this-week.view-week')}
				</SwitcherOption>
				<SwitcherOption
					aria-label={t('page.dashboard.widgets.this-week.view-month')}
					isActive={viewMode === 'month'}
					onClick={() => setViewMode('month')}
				>
					<Calendar />
					{t('page.dashboard.widgets.this-week.view-month')}
				</SwitcherOption>
			</ScheduleSwitcher>
		),
		[t, viewMode]
	);

	const total = useMemo(
		() =>
			displayData.completed +
			displayData.upcoming +
			displayData.cancelled +
			displayData.blocked,
		[displayData]
	);

	const body = isLoading ? (
		<Box display='flex' gap={2} alignItems='center'>
			<Skeleton height={100} width={100} variant='circular' />
			<Box display='flex' flexDirection='column' gap={1} flex={1}>
				<Skeleton height={16} />
				<Skeleton height={16} />
				<Skeleton height={16} />
			</Box>
		</Box>
	) : (
		<ThisWeekRoot>
			{displayData.delta !== undefined && (
				<DeltaChip isPositive={(displayData.delta ?? 0) >= 0}>
					<ChevronUp />+{displayData.delta}
				</DeltaChip>
			)}

			<DonutRow>
				<DonutWrapper>
					<ThisWeekDonutChart
						blocked={displayData.blocked}
						cancelled={displayData.cancelled}
						completed={displayData.completed}
						upcoming={displayData.upcoming}
					/>
					<DonutCenter>
						<DonutTotal>{total}</DonutTotal>
					</DonutCenter>
				</DonutWrapper>

				<LegendList>
					{(
						[
							[
								'completed',
								displayData.completed,
								t('page.dashboard.widgets.this-week.completed'),
							],
							[
								'upcoming',
								displayData.upcoming,
								t('page.dashboard.widgets.this-week.upcoming'),
							],
							[
								'cancelled',
								displayData.cancelled,
								t('page.dashboard.widgets.this-week.cancelled'),
							],
							[
								'blocked',
								displayData.blocked,
								t('page.dashboard.widgets.this-week.blocked'),
							],
						] as const
					).map(([key, count, label]) => (
						<LegendRow key={key}>
							<LegendLabel>
								<LegendDot color={THIS_WEEK_COLORS[key]} />
								{label}
							</LegendLabel>
							<LegendCount>{count}</LegendCount>
						</LegendRow>
					))}
				</LegendList>
			</DonutRow>
		</ThisWeekRoot>
	);

	return (
		<WidgetLayout
			body={body}
			headerActions={headerActions}
			title={t('page.dashboard.widgets.this-week.title')}
		/>
	);
};

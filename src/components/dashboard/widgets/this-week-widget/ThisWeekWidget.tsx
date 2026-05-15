import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { ChevronUp } from '@psycron/components/icons';

import { DeltaChip } from '../metric-card-widget/MetricCardWidget.styles';
import { WidgetHeader, WidgetTitle } from '../schedule-widget/ScheduleWidget.styles';

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
import type { ThisWeekWidgetProps } from './ThisWeekWidget.types';

export const ThisWeekWidget = ({ data, isLoading }: ThisWeekWidgetProps) => {
	const { t } = useTranslation();
	const total = useMemo(
		() => data.completed + data.upcoming + data.cancelled + data.blocked,
		[data]
	);

	if (isLoading) {
		return (
			<Box display='flex' gap={2} alignItems='center'>
				<Skeleton height={100} width={100} variant='circular' />
				<Box display='flex' flexDirection='column' gap={1} flex={1}>
					<Skeleton height={16} />
					<Skeleton height={16} />
					<Skeleton height={16} />
				</Box>
			</Box>
		);
	}

	const isDeltaPositive = (data.delta ?? 0) >= 0;

	return (
		<ThisWeekRoot>
			<WidgetHeader>
				<WidgetTitle>{t('page.dashboard.widgets.this-week.title')}</WidgetTitle>
				{data.delta !== undefined && (
					<DeltaChip isPositive={isDeltaPositive}>
						<ChevronUp height={11} width={11} />+{data.delta}
					</DeltaChip>
				)}
			</WidgetHeader>

			<DonutRow>
				<DonutWrapper>
					<ThisWeekDonutChart
						blocked={data.blocked}
						cancelled={data.cancelled}
						completed={data.completed}
						upcoming={data.upcoming}
					/>
					<DonutCenter>
						<DonutTotal>{total}</DonutTotal>
					</DonutCenter>
				</DonutWrapper>

				<LegendList>
					{(
						[
							['completed', data.completed, t('page.dashboard.widgets.this-week.completed')],
							['upcoming', data.upcoming, t('page.dashboard.widgets.this-week.upcoming')],
							['cancelled', data.cancelled, t('page.dashboard.widgets.this-week.cancelled')],
							['blocked', data.blocked, t('page.dashboard.widgets.this-week.blocked')],
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
};

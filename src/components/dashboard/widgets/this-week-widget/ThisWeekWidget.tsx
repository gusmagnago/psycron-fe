import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, Skeleton } from '@mui/material';
import { palette } from '@psycron/theme/palette/palette.theme';
import { TrendingUp } from 'lucide-react';

import { DeltaChip } from '../metric-card-widget/MetricCardWidget.styles';
import { WidgetHeader, WidgetTitle } from '../schedule-widget/ScheduleWidget.styles';

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

const SIZE = 100;
const STROKE = 14;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

const COLORS = {
	cancelled: palette.error.main,
	completed: palette.success.main,
	upcoming: palette.primary.main,
} as const;

const DonutChart = ({
	cancelled,
	completed,
	upcoming,
}: {
	cancelled: number;
	completed: number;
	upcoming: number;
}) => {
	const total = completed + upcoming + cancelled || 1;
	const segments = [
		{ key: 'completed', value: completed, color: COLORS.completed },
		{ key: 'upcoming', value: upcoming, color: COLORS.upcoming },
		{ key: 'cancelled', value: cancelled, color: COLORS.cancelled },
	];

	let offset = 0;
	return (
		<svg
			aria-hidden='true'
			height={SIZE}
			viewBox={`0 0 ${SIZE} ${SIZE}`}
			width={SIZE}
		>
			{/* track */}
			<circle
				cx={SIZE / 2}
				cy={SIZE / 2}
				fill='none'
				r={R}
				stroke={palette.gray['01']}
				strokeWidth={STROKE}
			/>
			{segments.map(({ color, key, value }) => {
				const dash = (value / total) * CIRC;
				const gap = CIRC - dash;
				const rotation = (offset / total) * 360 - 90;
				offset += value;
				return (
					<circle
						cx={SIZE / 2}
						cy={SIZE / 2}
						fill='none'
						key={key}
						r={R}
						stroke={color}
						strokeDasharray={`${dash} ${gap}`}
						strokeLinecap='round'
						strokeWidth={STROKE}
						style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '50% 50%', transition: 'stroke-dasharray 0.5s ease' }}
					/>
				);
			})}
		</svg>
	);
};

export const ThisWeekWidget = ({ data, isLoading }: ThisWeekWidgetProps) => {
	const { t } = useTranslation();
	const total = useMemo(
		() => data.completed + data.upcoming + data.cancelled,
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
						<TrendingUp size={11} />+{data.delta}
					</DeltaChip>
				)}
			</WidgetHeader>

			<DonutRow>
				<DonutWrapper>
					<DonutChart
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
						] as const
					).map(([key, count, label]) => (
						<LegendRow key={key}>
							<LegendLabel>
								<LegendDot color={COLORS[key]} />
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

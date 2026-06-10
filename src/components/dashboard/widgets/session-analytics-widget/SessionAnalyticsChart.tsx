import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import type { DashboardWeekSeriesDay } from '@psycron/api/dashboard/index.types';

import {
	BarGroup,
	BarLabel,
	BarSegment,
	ChartCanvas,
	ChartSection,
	COLORS,
} from './SessionAnalyticsWidget.styles';

const k = (key: string) => `page.dashboard.widgets.session-analytics.${key}`;

interface SessionAnalyticsChartProps {
	data: DashboardWeekSeriesDay[];
	onDayClick?: (day: DashboardWeekSeriesDay) => void;
}

export const SessionAnalyticsChart = ({ data, onDayClick }: SessionAnalyticsChartProps) => {
	const { t } = useTranslation();

	const maxTotal = useMemo(
		() =>
			Math.max(
				1,
				...data.map((d) => d.upcoming + d.completed + d.cancelled + d.blocked)
			),
		[data]
	);

	return (
		<ChartSection>
			<ChartCanvas aria-label={t(k('chart-aria-label'))} role='img'>
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
							title={`${day.label}: ${total} ${t(k('sessions'))}`}
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
	);
};

import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Jupiter } from '@psycron/components/icons';

import {
	BlockedHours,
	COLORS,
	CompletionRateLabel,
	CompletionRateValue,
	KpiBlock,
	KpiDivider,
	KpiHero,
	KpiInsight,
	KpiInsightSource,
	StatCount,
	StatDot,
	StatGrid,
	StatLabel,
	StatRow,
} from './SessionAnalyticsWidget.styles';
import type {
	SessionAnalyticsLayout,
	SessionAnalyticsPeriodData,
	SessionAnalyticsViewMode,
} from './SessionAnalyticsWidget.types';
import {
	computeCompletionRateSummary,
	getInsightKey,
	getRateColor,
} from './SessionAnalyticsWidget.utils';

const k = (key: string) => `page.dashboard.widgets.session-analytics.${key}`;

const STAT_KEYS = ['completed', 'upcoming', 'cancelled', 'blocked'] as const;

type StatKey = (typeof STAT_KEYS)[number];

interface SessionAnalyticsKpiProps {
	data: SessionAnalyticsPeriodData;
	layout: SessionAnalyticsLayout;
	viewMode: SessionAnalyticsViewMode;
}

export const SessionAnalyticsKpi = ({
	data,
	layout,
	viewMode,
}: SessionAnalyticsKpiProps) => {
	const { t } = useTranslation();

	const completionRate = useMemo(
		() => computeCompletionRateSummary(data),
		[data]
	);

	const blockedHoursText = useMemo(() => {
		if (data.adminBlockedMinutes === 0) return undefined;
		const hours = (data.adminBlockedMinutes / 60).toFixed(1);
		return t(k('blocked-hours'), { hours });
	}, [data.adminBlockedMinutes, t]);

	const insightKey = getInsightKey(data, completionRate.concluded);
	const rateColor = getRateColor(completionRate.tone);
	const insightText = t(k(insightKey), {
		completed: data.completed,
		concluded: completionRate.concluded,
		delta: Math.abs(data.delta ?? 0),
		period: t(k(`period.${viewMode}`)).toLowerCase(),
	});

	const statValues: Record<StatKey, number> = {
		blocked: data.blocked,
		cancelled: data.cancelled,
		completed: data.completed,
		upcoming: data.upcoming,
	};

	return (
		<KpiBlock layout={layout}>
			<KpiHero>
				<CompletionRateValue rateColor={rateColor}>
					{completionRate.rate !== undefined ? `${completionRate.rate}%` : '—'}
				</CompletionRateValue>
				<CompletionRateLabel>{t(k('completion-rate'))}</CompletionRateLabel>
			</KpiHero>

			<KpiInsight>
				<Jupiter />
				<span>
					<KpiInsightSource>{t(k('insight-source'))}</KpiInsightSource>
					{insightText}
				</span>
			</KpiInsight>

			<KpiDivider />

			<StatGrid layout={layout}>
				{STAT_KEYS.map((key) => (
					<StatRow key={key}>
						<StatLabel>
							<StatDot color={COLORS[key]} />
							{t(k(key))}
						</StatLabel>
						<StatCount>{statValues[key]}</StatCount>
					</StatRow>
				))}
			</StatGrid>

			{blockedHoursText && (
				<>
					<KpiDivider />
					<BlockedHours>{blockedHoursText}</BlockedHours>
				</>
			)}
		</KpiBlock>
	);
};

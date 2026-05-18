import { palette } from '@psycron/theme/palette/palette.theme';

import type {
	SessionAnalyticsPeriodData,
	SessionAnalyticsRateTone,
} from './SessionAnalyticsWidget.types';

export interface CompletionRateSummary {
	concluded: number;
	rate?: number;
	tone: SessionAnalyticsRateTone;
}

export const computeCompletionRateSummary = (
	data: SessionAnalyticsPeriodData
): CompletionRateSummary => {
	const concluded = data.completed + data.cancelled;
	const total = concluded + data.upcoming + data.blocked;

	if (total === 0) return { concluded, tone: 'empty' };
	if (concluded === 0) return { concluded, rate: 0, tone: 'empty' };

	const rate = Math.round((data.completed / concluded) * 100);
	if (rate >= 80) return { concluded, rate, tone: 'success' };
	if (rate >= 60) return { concluded, rate, tone: 'warning' };
	return { concluded, rate, tone: 'error' };
};

export const getRateColor = (tone: SessionAnalyticsRateTone): string => {
	switch (tone) {
		case 'success':
			return palette.success.main as string;
		case 'warning':
			return palette.alert.dark as string;
		case 'error':
			return palette.error.main as string;
		case 'empty':
			return palette.text.secondary as string;
	}
};

export const getInsightKey = (
	data: SessionAnalyticsPeriodData,
	concluded: number
): string => {
	if (data.delta === undefined) return concluded > 0 ? 'insight-summary' : 'insight-empty';
	if (data.delta > 0) return 'insight-up';
	if (data.delta < 0) return 'insight-down';
	return 'insight-flat';
};

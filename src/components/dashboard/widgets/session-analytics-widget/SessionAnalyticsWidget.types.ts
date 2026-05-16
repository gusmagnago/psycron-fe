import type { WeeklyBarData } from '../weekly-chart-widget/WeeklyChartWidget.types';

export type SessionAnalyticsViewMode = 'month' | 'week';

export interface SessionAnalyticsPeriodData {
	adminBlockedMinutes: number;
	blocked: number;
	cancelled: number;
	completed: number;
	delta?: number;
	upcoming: number;
}

export interface SessionAnalyticsWidgetProps {
	chartData: WeeklyBarData[];
	isLoading?: boolean;
	monthChartData: WeeklyBarData[];
	monthData: SessionAnalyticsPeriodData;
	onDayClick?: (day: WeeklyBarData) => void;
	onViewModeChange?: (mode: SessionAnalyticsViewMode) => void;
	weekData: SessionAnalyticsPeriodData;
}

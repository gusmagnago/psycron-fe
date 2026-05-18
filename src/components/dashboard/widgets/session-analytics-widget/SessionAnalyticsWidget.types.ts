import type { WeeklyBarData } from '../weekly-chart-widget/WeeklyChartWidget.types';

export type SessionAnalyticsViewMode = 'month' | 'week';
export type SessionAnalyticsLayout = 'column' | 'row';
export type SessionAnalyticsRateTone = 'empty' | 'error' | 'success' | 'warning';

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
	layout?: SessionAnalyticsLayout;
	monthChartData: WeeklyBarData[];
	monthData: SessionAnalyticsPeriodData;
	onDayClick?: (day: WeeklyBarData) => void;
	onViewModeChange?: (mode: SessionAnalyticsViewMode) => void;
	rowSpan?: number;
	weekData: SessionAnalyticsPeriodData;
}

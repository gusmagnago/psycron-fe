import type { DashboardWeekSeriesDay } from '@psycron/api/dashboard/index.types';

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
	chartData: DashboardWeekSeriesDay[];
	isLoading?: boolean;
	layout?: SessionAnalyticsLayout;
	monthChartData: DashboardWeekSeriesDay[];
	monthData: SessionAnalyticsPeriodData;
	onDayClick?: (day: DashboardWeekSeriesDay) => void;
	onViewModeChange?: (mode: SessionAnalyticsViewMode) => void;
	rowSpan?: number;
	weekData: SessionAnalyticsPeriodData;
}

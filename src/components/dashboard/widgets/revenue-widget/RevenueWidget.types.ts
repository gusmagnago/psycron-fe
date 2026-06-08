import type { DashboardRevenueEstimate } from '@psycron/api/dashboard/index.types';

export interface RevenueWeekEstimate {
	amount: number;
	cancelledCount: number;
	completedCount: number;
	upcomingCount: number;
}

export interface RevenueWidgetProps {
	colSpan?: number;
	estimate?: DashboardRevenueEstimate;
	isLoading?: boolean;
	onClick?: () => void;
	weekEstimate?: RevenueWeekEstimate;
}

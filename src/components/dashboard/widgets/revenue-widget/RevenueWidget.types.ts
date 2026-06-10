import type {
	DashboardRevenueEstimate,
	DashboardRevenueWeekEstimate,
} from '@psycron/api/dashboard/index.types';

export interface RevenueWidgetProps {
	colSpan?: number;
	estimate?: DashboardRevenueEstimate;
	isLoading?: boolean;
	onClick?: () => void;
	weekEstimate?: DashboardRevenueWeekEstimate;
}

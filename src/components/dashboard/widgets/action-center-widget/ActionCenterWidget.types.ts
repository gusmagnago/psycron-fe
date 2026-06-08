import type { DashboardActionCenterSummary } from '@psycron/api/dashboard/index.types';

export interface ActionCenterWidgetProps {
	isLoading?: boolean;
	onItemClick?: (
		item: DashboardActionCenterSummary['items'][number]
	) => void;
	summary?: DashboardActionCenterSummary;
}

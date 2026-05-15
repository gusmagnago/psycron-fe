import type { DashboardPendingTaskType, DashboardTier } from '@psycron/api/dashboard/index.types';

export type PendingTaskType = DashboardPendingTaskType;

export interface PendingTask {
	count: number;
	label: string;
	onClick?: () => void;
	tier: DashboardTier;
	type: PendingTaskType;
}

export interface PendingTasksWidgetProps {
	isLoading?: boolean;
	tasks: PendingTask[];
}

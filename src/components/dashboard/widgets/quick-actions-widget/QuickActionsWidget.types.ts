import type { ReactNode } from 'react';
import type { DashboardQuickActionId, DashboardTier } from '@psycron/api/dashboard/index.types';

export interface ActionAccent {
	bg: string;
	fg: string;
}

export interface QuickAction {
	ariaLabel: string;
	badge?: number;
	icon: ReactNode;
	id: DashboardQuickActionId;
	label: string;
	onClick: () => void;
	tier: DashboardTier;
}

export interface QuickActionsWidgetProps {
	actions: QuickAction[];
	isLoading?: boolean;
}

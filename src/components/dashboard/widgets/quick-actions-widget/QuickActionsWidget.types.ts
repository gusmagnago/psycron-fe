import type { ReactNode } from 'react';
import type { DashboardQuickActionId, DashboardTier } from '@psycron/api/dashboard/index.types';
import type { DashboardAccentTone } from '@psycron/theme/palette/dashboardAccents';

export interface QuickAction {
	ariaLabel: string;
	badge?: number;
	description?: string;
	icon: ReactNode;
	id: DashboardQuickActionId;
	label: string;
	onClick: () => void;
	tier: DashboardTier;
	tone: DashboardAccentTone;
}

export interface QuickActionsWidgetProps {
	actions: QuickAction[];
	colSpan?: number;
	isLoading?: boolean;
}

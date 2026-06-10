import type { ReactNode } from 'react';
import type { DashboardActionCenterSummary } from '@psycron/api/dashboard/index.types';
import type { DashboardAccentTone } from '@psycron/theme/palette/dashboardAccents';

export interface ActionCenterWidgetRow {
	actionLabel: string;
	ariaLabel: string;
	icon: ReactNode;
	id: string;
	label: string;
	meta?: string;
	onClick: () => void;
	tone: DashboardAccentTone;
	variant: 'alert' | 'quick';
}

export interface ActionCenterWidgetProps {
	isLoading?: boolean;
	items?: ActionCenterWidgetRow[];
	summary?: DashboardActionCenterSummary;
}

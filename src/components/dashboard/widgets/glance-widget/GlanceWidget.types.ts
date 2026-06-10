import type { ReactNode } from 'react';
import type { DashboardAccentTone } from '@psycron/theme/palette/dashboardAccents';

export type GlanceStatId = 'attention' | 'next-session' | 'sessions-today';

export interface GlanceStat {
	ariaLabel: string;
	icon: ReactNode;
	id: GlanceStatId;
	label: string;
	onClick: () => void;
	tone: DashboardAccentTone;
	value: string;
}

export interface GlanceWidgetProps {
	isLoading?: boolean;
	stats: GlanceStat[];
}

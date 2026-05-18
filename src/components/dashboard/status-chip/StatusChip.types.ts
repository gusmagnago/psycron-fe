import type { HTMLAttributes, ReactNode } from 'react';
import type { DashboardAccentTone } from '@psycron/theme/palette/dashboardAccents';

export type StatusChipVariant = 'filled' | 'outline';

export interface StatusChipProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
	leadingDot?: boolean;
	tone?: DashboardAccentTone;
	variant?: StatusChipVariant;
}

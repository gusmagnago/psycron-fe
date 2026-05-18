import type { HTMLAttributes, ReactNode } from 'react';
import type { DashboardAccentTone } from '@psycron/theme/palette/dashboardAccents';

export interface IconBoxProps extends HTMLAttributes<HTMLSpanElement> {
	children: ReactNode;
	size?: number;
	tone?: DashboardAccentTone;
}

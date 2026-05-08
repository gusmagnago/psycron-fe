import type { ReactNode } from 'react';

export interface AvatarItem {
	firstName: string;
	id: string;
	lastName: string;
}

export interface SparklinePoint {
	value: number;
}

export type MetricCardVariant = 'default' | 'avatar-stack' | 'sparkline';

export interface MetricCardWidgetProps {
	avatars?: AvatarItem[];
	delta?: number;
	deltaLabel?: string;
	icon?: ReactNode;
	isLoading?: boolean;
	label: string;
	prefix?: string;
	sparkline?: SparklinePoint[];
	subLabel?: string;
	suffix?: string;
	value: number;
	variant?: MetricCardVariant;
}
